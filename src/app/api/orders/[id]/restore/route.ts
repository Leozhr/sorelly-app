import { NextRequest, NextResponse } from "next/server";

import { getSessionByToken, getUserById } from "../../../auth/utils";
import { db } from "@/db";
import { clientsTable, ordersTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";

type RestoreOrderRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(
  req: NextRequest,
  context: RestoreOrderRouteContext,
) {
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
        orderNumber: ordersTable.orderNumber,
        isCanceled: ordersTable.isCanceled,
        createdAt: ordersTable.createdAt,
        updatedAt: ordersTable.updatedAt,
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

    if (!order.isCanceled) {
      return NextResponse.json(
        { message: "Pedido já está ativo." },
        { status: 200 },
      );
    }

    const [updatedOrder] = await db
      .update(ordersTable)
      .set({ isCanceled: false })
      .where(eq(ordersTable.id, orderId))
      .returning({
        id: ordersTable.id,
        clientId: ordersTable.clientId,
        orderNumber: ordersTable.orderNumber,
        isCanceled: ordersTable.isCanceled,
        createdAt: ordersTable.createdAt,
        updatedAt: ordersTable.updatedAt,
      });

    if (!updatedOrder) {
      return NextResponse.json(
        { error: "Não foi possível reativar o pedido." },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        message: "Pedido reativado com sucesso.",
        pedido: {
          id: updatedOrder.id,
          clientId: updatedOrder.clientId,
          numero_pedido: updatedOrder.orderNumber,
          isCanceled: updatedOrder.isCanceled,
          orderDate: formatDateOnly(updatedOrder.createdAt),
          createdAt: updatedOrder.createdAt,
          updatedAt: updatedOrder.updatedAt,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Não foi possível reativar o pedido.",
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
