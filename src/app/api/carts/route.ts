import { NextResponse } from "next/server";

import { getSessionByToken, getUserById, getUserByEmail } from "../auth/utils";
import { db } from "@/db";
import { cartsTable, clientsTable } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const authResult = await authenticateRequest(req);
    if ("response" in authResult) {
      return authResult.response;
    }

    const { user } = authResult;

    const carts = await db
      .select({
        id: cartsTable.id,
        clientId: cartsTable.clientId,
        product: cartsTable.product,
        variation: cartsTable.variation,
        client: cartsTable.client,
        quantity: cartsTable.quantity,
        total: cartsTable.total,
        createdAt: cartsTable.createdAt,
        updatedAt: cartsTable.updatedAt,
      })
      .from(cartsTable)
      .innerJoin(clientsTable, eq(cartsTable.clientId, clientsTable.id))
      .where(eq(clientsTable.userId, user.id))
      .orderBy(desc(cartsTable.createdAt));

    const formatted = carts.map((cart) => ({
      id: cart.id,
      clientId: cart.clientId,
      product: cart.product,
      variation: cart.variation,
      client: cart.client,
      quantity: cart.quantity,
      total: Number.parseFloat(formatCurrency(cart.total)),
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
    }));

    return NextResponse.json({ carts: formatted }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Não foi possível listar os produtos no carrinho.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await safeJson(req);

    if (!isPlainObject(body)) {
      return NextResponse.json(
        { error: "Payload inválido. Envie um objeto JSON." },
        { status: 400 },
      );
    }

    // Verificar se há email no body para autenticação alternativa
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const devmasterUserId = typeof body.devmasterUserId === "string" ? body.devmasterUserId : null;
    let user;
    let skipUserIdValidation = false;

    if (email) {
      // Autenticação por email
      const authResult = await authenticateByEmail(email);
      if ("response" in authResult) {
        return authResult.response;
      }
      user = authResult.user;
      // Quando autentica por email, não validar user.id com clientsTable.userId
      // pois eles podem ser diferentes (ID interno vs ID Devmaster)
      skipUserIdValidation = true;
    } else {
      // Autenticação por token (método original)
      const authResult = await authenticateRequest(req);
      if ("response" in authResult) {
        return authResult.response;
      }
      user = authResult.user;
    }

    const product = isPlainObject(body.product) ? body.product : null;
    if (!product) {
      return NextResponse.json(
        { error: "Informe os dados do produto no formato esperado." },
        { status: 400 },
      );
    }

    const variation = isPlainObject(body.variation) ? body.variation : null;
    if (!variation) {
      return NextResponse.json(
        { error: "Informe os dados da variação do produto no formato esperado." },
        { status: 400 },
      );
    }

    const clientPayload = isPlainObject(body.client) ? body.client : null;
    
    // Se não houver client no payload, buscar pelo clientId quando autenticado por email
    let clientId = parseInteger(body.clientId);
    let finalClientPayload = clientPayload;

    if (!clientPayload && email && clientId) {
      // Buscar dados do cliente no banco
      // Se skipUserIdValidation for true, buscar apenas por clientId
      const [clientFromDb] = skipUserIdValidation
        ? await db
            .select()
            .from(clientsTable)
            .where(eq(clientsTable.id, clientId))
            .limit(1)
        : await db
            .select()
            .from(clientsTable)
            .where(
              and(eq(clientsTable.id, clientId), eq(clientsTable.userId, user.id)),
            )
            .limit(1);

      if (!clientFromDb) {
        return NextResponse.json(
          {
            error:
              "Cliente não encontrado ou não pertence ao usuário autenticado.",
          },
          { status: 404 },
        );
      }

      // Criar payload do cliente a partir dos dados do banco
      finalClientPayload = {
        id: clientFromDb.id,
        userId: clientFromDb.userId,
        name: clientFromDb.name,
        phone: clientFromDb.phone,
      };
    } else if (!clientPayload) {
      return NextResponse.json(
        { error: "Informe os dados do cliente no formato esperado." },
        { status: 400 },
      );
    }

    // Validar userId apenas se não for autenticação por email
    if (!skipUserIdValidation) {
      const payloadUserId = parseInteger(finalClientPayload!.userId);
      if (payloadUserId && payloadUserId !== user.id) {
        return NextResponse.json(
          { error: "Dados do cliente não correspondem ao usuário autenticado." },
          { status: 400 },
        );
      }
    }

    if (!clientId) {
      clientId =
        parseInteger(finalClientPayload!.id) ??
        parseInteger((finalClientPayload as any).clienteId);
    }

    if (!clientId) {
      return NextResponse.json(
        { error: "Informe um identificador válido para o cliente." },
        { status: 400 },
      );
    }

    const payloadClientId =
      parseInteger(finalClientPayload!.id) ?? parseInteger((finalClientPayload as any).clienteId);

    if (payloadClientId && payloadClientId !== clientId) {
      return NextResponse.json(
        {
          error:
            "Identificador do cliente informado não corresponde ao payload enviado.",
        },
        { status: 400 },
      );
    }

    const quantity = parseInteger(body.quantity);
    if (!quantity || quantity <= 0) {
      return NextResponse.json(
        { error: "Informe uma quantidade válida para o produto no carrinho." },
        { status: 400 },
      );
    }

    const totalValue = parseCurrency(body.total);
    if (totalValue === null) {
      return NextResponse.json(
        { error: "Informe um valor total válido para o item no carrinho." },
        { status: 400 },
      );
    }

    if (totalValue < 0) {
      return NextResponse.json(
        { error: "O valor total do item deve ser maior ou igual a zero." },
        { status: 400 },
      );
    }

    // Verificar se o cliente existe
    // Se skipUserIdValidation, não validar o userId
    const [client] = skipUserIdValidation
      ? await db
          .select({ id: clientsTable.id })
          .from(clientsTable)
          .where(eq(clientsTable.id, clientId))
          .limit(1)
      : await db
          .select({ id: clientsTable.id })
          .from(clientsTable)
          .where(
            and(eq(clientsTable.id, clientId), eq(clientsTable.userId, user.id)),
          )
          .limit(1);

    if (!client) {
      return NextResponse.json(
        {
          error:
            "Cliente não encontrado ou não pertence ao usuário autenticado.",
        },
        { status: 404 },
      );
    }

    const [cart] = await db
      .insert(cartsTable)
      .values({
        clientId,
        product,
        variation,
        client: finalClientPayload,
        quantity,
        total: totalValue.toFixed(2),
      })
      .returning();

    return NextResponse.json(
      {
        message: "Produto adicionado ao carrinho com sucesso.",
        cart: {
          id: cart.id,
          clientId: cart.clientId,
          product: cart.product,
          variation: cart.variation,
          client: cart.client,
          quantity: cart.quantity,
          total: Number.parseFloat(formatCurrency(cart.total)),
          createdAt: cart.createdAt,
          updatedAt: cart.updatedAt,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Não foi possível adicionar o produto ao carrinho.",
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

async function authenticateByEmail(email: string) {
  if (!email) {
    return {
      response: NextResponse.json(
        { error: "Email não informado." },
        { status: 400 },
      ),
    } as const;
  }

  const user = await getUserByEmail(email);

  if (!user) {
    return {
      response: NextResponse.json(
        { error: "Usuário não encontrado com o email informado." },
        { status: 404 },
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
