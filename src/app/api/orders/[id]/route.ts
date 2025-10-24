import { NextRequest, NextResponse } from "next/server";

import { getSessionByToken, getUserById } from "../../auth/utils";
import { db } from "@/db";
import { clientsTable, orderItemsTable, ordersTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";

type OrderRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(req: NextRequest, context: OrderRouteContext) {
  try {
    const { id } = await context.params;
    const orderId = parseId(id);

    if (!orderId) {
      return NextResponse.json(
        { error: "Informe um identificador de pedido válido." },
        { status: 400 },
      );
    }

    const authResult = await authenticateRequest(req);
    if ("response" in authResult) {
      return authResult.response;
    }

    const { user } = authResult;

    const [order] = await db
      .select({
        id: ordersTable.id,
        clientId: ordersTable.clientId,
        orderDate: ordersTable.orderDate,
        createdAt: ordersTable.createdAt,
        updatedAt: ordersTable.updatedAt,
        clientName: ordersTable.clientName,
        clientPhone: clientsTable.phone,
        clientWhatsApp: clientsTable.whatsApp,
      })
      .from(ordersTable)
      .innerJoin(clientsTable, eq(ordersTable.clientId, clientsTable.id))
      .where(
        and(eq(ordersTable.id, orderId), eq(clientsTable.userId, user.id)),
      )
      .limit(1);

    if (!order) {
      return NextResponse.json(
        { error: "Pedido não encontrado para o usuário autenticado." },
        { status: 404 },
      );
    }

    const items = await db
      .select({
        id: orderItemsTable.id,
        productId: orderItemsTable.productId,
        quantity: orderItemsTable.quantity,
        variantId: orderItemsTable.variantId,
        unitValue: orderItemsTable.unitValue,
        description: orderItemsTable.description,
        image: orderItemsTable.image,
        createdAt: orderItemsTable.createdAt,
        updatedAt: orderItemsTable.updatedAt,
      })
      .from(orderItemsTable)
      .where(eq(orderItemsTable.orderId, orderId));

    const totalValue = items.reduce((sum, item) => {
      const numeric = Number.parseFloat(String(item.unitValue ?? 0));
      if (!Number.isFinite(numeric)) {
        return sum;
      }

      return sum + numeric * item.quantity;
    }, 0);

    return NextResponse.json(
      {
        pedido: {
          id: order.id,
          clientId: order.clientId,
          valor: totalValue.toFixed(2),
          orderDate: order.orderDate,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
          cliente: {
            id: order.clientId,
            nome: order.clientName,
            telefone: order.clientPhone,
            whatsApp: order.clientWhatsApp,
          },
          itens: items.map((item) => ({
            id: item.id,
            produtoId: item.productId,
            quantidade: item.quantity,
            variante: item.variantId,
            valorUnitario: formatCurrency(item.unitValue),
            descricao: item.description,
            imagem: item.image,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
          })),
        },
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Não foi possível buscar o pedido.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

async function authenticateRequest(req: NextRequest) {
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

function parseId(value: string | undefined | null) {
  if (!value) {
    return null;
  }

  const parsed = Number.parseInt(value, 10);

  if (Number.isInteger(parsed) && parsed > 0) {
    return parsed;
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
