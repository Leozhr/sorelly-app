import { NextResponse } from "next/server";

import { getSessionByToken, getUserById } from "../auth/utils";
import { db } from "@/db";
import { clientsTable, orderItemsTable, ordersTable } from "@/db/schema";
import { and, desc, eq, sql } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const authResult = await authenticateRequest(req);
    if ("response" in authResult) {
      return authResult.response;
    }

    const { user } = authResult;
    const body = await safeJson(req);

    if (!isPlainObject(body)) {
      return NextResponse.json(
        { error: "Payload inválido. Envie um objeto JSON." },
        { status: 400 },
      );
    }

    const clientId = parseInteger(body.clienteId);
    if (!clientId) {
      return NextResponse.json(
        { error: "Informe um cliente válido (clienteId numérico)." },
        { status: 400 },
      );
    }

    const [client] = await db
      .select({
        name: clientsTable.name,
      })
      .from(clientsTable)
      .where(
        and(eq(clientsTable.id, clientId), eq(clientsTable.userId, user.id)),
      )
      .limit(1);

    if (!client) {
      return NextResponse.json(
        { error: "Cliente não encontrado para o usuário autenticado." },
        { status: 404 },
      );
    }

    if (!Array.isArray(body.produtos) || body.produtos.length === 0) {
      return NextResponse.json(
        { error: "Informe ao menos um produto para registrar o pedido." },
        { status: 400 },
      );
    }

    const parsedItems: ParsedOrderItemInput[] = [];

    for (let index = 0; index < body.produtos.length; index++) {
      const rawItem = body.produtos[index];

      if (!isPlainObject(rawItem)) {
        return NextResponse.json(
          { error: `Produto na posição ${index} inválido.` },
          { status: 400 },
        );
      }

      const productId = parseInteger(rawItem.produtoId);
      if (!productId) {
        return NextResponse.json(
          {
            error: `Produto na posição ${index} sem identificador numérico válido (produtoId).`,
          },
          { status: 400 },
        );
      }

      const quantity = parseInteger(rawItem.unidades);
      if (!quantity || quantity <= 0) {
        return NextResponse.json(
          {
            error: `Produto na posição ${index} com quantidade inválida (unidades).`,
          },
          { status: 400 },
        );
      }

      const parsedValue = parseCurrency(rawItem.valor);
      if (parsedValue === null) {
        return NextResponse.json(
          { error: `Produto na posição ${index} com valor inválido.` },
          { status: 400 },
        );
      }

      const variantId = rawItem.variante ? parseInteger(rawItem.variante) : null;
      const description =
        typeof rawItem.descricao === "string"
          ? rawItem.descricao.trim() || null
          : null;

      const image =
        isPlainObject(rawItem.imagem) || typeof rawItem.imagem === "string"
          ? rawItem.imagem
          : null;

      parsedItems.push({
        productId,
        quantity,
        unitValueNumber: parsedValue,
        unitValueDb: parsedValue.toFixed(2),
        variantId,
        description,
        image,
      });
    }

    const result = await db.transaction(async (tx) => {
      const [previousOrder] = await tx
        .select({ lastOrderNumber: ordersTable.orderNumber })
        .from(ordersTable)
        .where(eq(ordersTable.clientId, clientId))
        .orderBy(desc(ordersTable.orderNumber))
        .limit(1);

      const nextOrderNumber = (previousOrder?.lastOrderNumber ?? 0) + 1;

      const [order] = await tx
        .insert(ordersTable)
        .values({
          clientId,
          clientName: client.name,
          orderNumber: nextOrderNumber,
        })
        .returning();

      const insertedItems = await tx
        .insert(orderItemsTable)
        .values(
          parsedItems.map((item) => ({
            orderId: order.id,
            clientName: client.name,
            productId: item.productId,
            quantity: item.quantity,
            unitValue: item.unitValueDb,
            variantId: item.variantId,
            description: item.description,
            image: item.image,
          })),
        )
        .returning();

      return { order, insertedItems };
    });

    const totalValue = parsedItems.reduce(
      (sum, item) => sum + item.unitValueNumber * item.quantity,
      0,
    );

    return NextResponse.json(
      {
        message: "Pedido registrado com sucesso.",
        pedido: {
          id: result.order.id,
          clientId: result.order.clientId,
          clientName: result.order.clientName,
          numero_pedido: result.order.orderNumber,
          isCanceled: result.order.isCanceled,
          orderDate: formatDateOnly(result.order.createdAt),
          createdAt: result.order.createdAt,
          updatedAt: result.order.updatedAt,
          valor: totalValue.toFixed(2),
          itens: result.insertedItems.map((item, index) => ({
            id: item.id,
            produtoId: item.productId,
            quantidade: item.quantity,
            valorUnitario: parsedItems[index]?.unitValueDb ?? item.unitValue,
            variante: item.variantId,
            descricao: item.description,
            imagem: item.image,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
          })),
        },
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Não foi possível registrar o pedido.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function GET(req: Request) {
  try {
    const authResult = await authenticateRequest(req);
    if ("response" in authResult) {
      return authResult.response;
    }

    const { user } = authResult;

    const orders = await db
      .select({
        orderId: ordersTable.id,
        clientId: ordersTable.clientId,
        clientName: ordersTable.clientName,
        orderNumber: ordersTable.orderNumber,
        createdAt: ordersTable.createdAt,
        isCanceled: ordersTable.isCanceled,
        totalValue: sql<string>`
          COALESCE(SUM(${orderItemsTable.unitValue} * ${orderItemsTable.quantity}), 0)
        `,
      })
      .from(ordersTable)
      .innerJoin(clientsTable, eq(ordersTable.clientId, clientsTable.id))
      .leftJoin(orderItemsTable, eq(orderItemsTable.orderId, ordersTable.id))
      .where(eq(clientsTable.userId, user.id))
      .groupBy(
        ordersTable.id,
        ordersTable.clientId,
        ordersTable.clientName,
        ordersTable.orderNumber,
        ordersTable.createdAt,
        ordersTable.isCanceled,
      )
      .orderBy(desc(ordersTable.createdAt));

    const formatted = orders.map((order) => ({
      orderId: order.orderId,
      clientId: order.clientId,
      clientName: order.clientName,
      numero_pedido: order.orderNumber,
      isCanceled: order.isCanceled,
      valor: formatCurrency(order.totalValue),
      data: order.createdAt.toISOString(),
    }));

    const activeOrders = orders.filter((order) => order.isCanceled === false);

    const quantidadeVendas = activeOrders.length;
    const valorVendas = activeOrders.reduce((sum, order) => {
      const numeric = Number.parseFloat(order.totalValue ?? "0");
      if (!Number.isFinite(numeric)) {
        return sum;
      }

      return sum + numeric;
    }, 0);

    return NextResponse.json(
      {
        pedidos: formatted,
        quantidade_vendas: quantidadeVendas,
        valor_vendas: valorVendas.toFixed(2),
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Não foi possível listar os pedidos.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

async function authenticateRequest(req: Request) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.toLowerCase().startsWith("bearer ")) {
    return {
      response: NextResponse.json(
        { error: "Sessão inválida. Informe o token no header Authorization." },
        { status: 401 },
      ),
    } as const;
  }

  const sessionToken = authHeader.slice(7).trim();

  if (!sessionToken) {
    return {
      response: NextResponse.json(
        { error: "Sessão inválida. Token ausente no header Authorization." },
        { status: 401 },
      ),
    } as const;
  }

  const session = await getSessionByToken(sessionToken);

  if (!session) {
    return {
      response: NextResponse.json(
        { error: "Sessão inválida ou inexistente." },
        { status: 401 },
      ),
    } as const;
  }

  if (session.expiresAt && session.expiresAt.getTime() <= Date.now()) {
    return {
      response: NextResponse.json(
        { error: "Sessão expirada. Faça login novamente." },
        { status: 401 },
      ),
    } as const;
  }

  const user = await getUserById(session.userId);

  if (!user) {
    return {
      response: NextResponse.json(
        {
          error:
            "Usuário vinculado à sessão não foi encontrado. Solicite uma nova sessão.",
        },
        { status: 500 },
      ),
    } as const;
  }

  return { user } as const;
}

async function safeJson(req: Request) {
  try {
    return await req.json();
  } catch {
    return null;
  }
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseInteger(value: unknown) {
  if (typeof value === "number" && Number.isInteger(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number.parseInt(value.replace(/\D/g, ""), 10);
    if (Number.isInteger(parsed)) {
      return parsed;
    }
  }

  return null;
}

type ParsedOrderItemInput = {
  productId: number;
  quantity: number;
  unitValueNumber: number;
  unitValueDb: string;
  variantId: number | null;
  description: string | null;
  image: Record<string, unknown> | string | null;
};

function formatDateOnly(value: Date | string) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseCurrency(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) {
      return null;
    }

    let sanitized = trimmed.replace(/[^0-9,.\-]/g, "");
    if (!sanitized) {
      return null;
    }

    const lastComma = sanitized.lastIndexOf(",");
    const lastDot = sanitized.lastIndexOf(".");

    if (lastComma > -1 && lastDot > -1) {
      if (lastComma > lastDot) {
        sanitized = sanitized.replace(/\./g, "").replace(",", ".");
      } else {
        sanitized = sanitized.replace(/,/g, "");
      }
    } else if (lastComma > -1) {
      sanitized = sanitized.replace(",", ".");
    }

    const parsed = Number.parseFloat(sanitized);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return null;
}

function formatCurrency(value: string | null | undefined) {
  if (!value) {
    return "0.00";
  }

  const numeric = Number.parseFloat(value);

  if (!Number.isFinite(numeric)) {
    return "0.00";
  }

  return numeric.toFixed(2);
}
