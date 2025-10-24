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

    const rawDateInput = body.data;
    const orderDate =
      rawDateInput === undefined || rawDateInput === null || rawDateInput === ""
        ? formatDateOnly(new Date())
        : parseOrderDate(rawDateInput);

    if (!orderDate) {
      return NextResponse.json(
        {
          error:
            "Informe uma data de pedido válida no formato ISO 8601 ou DD/MM/AAAA.",
        },
        { status: 400 },
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
      const [order] = await tx
        .insert(ordersTable)
        .values({
          clientId,
          clientName: client.name,
          orderDate,
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
          orderDate: result.order.orderDate,
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
        createdAt: ordersTable.createdAt,
        totalValue: sql<string>`
          COALESCE(SUM(${orderItemsTable.unitValue} * ${orderItemsTable.quantity}), 0)
        `,
      })
      .from(ordersTable)
      .innerJoin(clientsTable, eq(ordersTable.clientId, clientsTable.id))
      .leftJoin(orderItemsTable, eq(orderItemsTable.orderId, ordersTable.id))
      .where(eq(clientsTable.userId, user.id))
      .groupBy(ordersTable.id)
      .orderBy(desc(ordersTable.createdAt));

    const formatted = orders.map((order) => ({
      orderId: order.orderId,
      clientId: order.clientId,
      clientName: order.clientName,
      valor: formatCurrency(order.totalValue),
      data: order.createdAt.toISOString(),
    }));

    return NextResponse.json({ pedidos: formatted }, { status: 200 });
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

function parseOrderDate(value: unknown) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return formatDateOnly(value);
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) {
      return null;
    }

    const directDatePattern = /^(\d{4})-(\d{2})-(\d{2})$/;
    const directMatch = trimmed.match(directDatePattern);
    if (directMatch) {
      return trimmed;
    }

    const isoParsed = new Date(trimmed);
    if (!Number.isNaN(isoParsed.getTime())) {
      return formatDateOnly(isoParsed);
    }

    const match = trimmed.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (match) {
      const day = Number.parseInt(match[1]!, 10);
      const month = Number.parseInt(match[2]!, 10) - 1;
      const year = Number.parseInt(match[3]!, 10);
      const candidate = new Date(Date.UTC(year, month, day));
      if (!Number.isNaN(candidate.getTime())) {
        return formatDateOnly(candidate);
      }
    }
  }

  return null;
}

function formatDateOnly(date: Date) {
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
