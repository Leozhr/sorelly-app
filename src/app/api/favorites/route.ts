import { NextResponse } from "next/server";

import { getSessionByToken, getUserById } from "../auth/utils";
import { db } from "@/db";
import { favoritesTable } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const authResult = await authenticateRequest(req);
    if ("response" in authResult) {
      return authResult.response;
    }

    const { user } = authResult;

    const favorites = await db
      .select({ productId: favoritesTable.productId })
      .from(favoritesTable)
      .where(eq(favoritesTable.userId, user.id))
      .orderBy(desc(favoritesTable.createdAt));

    const productIds = favorites
      .map((favorite) => favorite.productId.trim())
      .filter((value) => value.length > 0);

    return NextResponse.json(
      { favoritos: productIds.join(",") },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Não foi possível listar os favoritos.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

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

    const productId = parseProductIdentifier(
      body.productId ?? body.produtoId ?? body.id,
    );

    if (!productId) {
      return NextResponse.json(
        { error: "Informe um identificador válido para o produto." },
        { status: 400 },
      );
    }

    const [existing] = await db
      .select({ id: favoritesTable.id })
      .from(favoritesTable)
      .where(
        and(eq(favoritesTable.userId, user.id), eq(favoritesTable.productId, productId)),
      )
      .limit(1);

    if (existing) {
      return NextResponse.json(
        {
          message: "Produto já está favoritado.",
          favorito: { productId },
        },
        { status: 200 },
      );
    }

    const [favorite] = await db
      .insert(favoritesTable)
      .values({ userId: user.id, productId })
      .returning();

    return NextResponse.json(
      {
        message: "Produto adicionado aos favoritos com sucesso.",
        favorito: {
          id: favorite.id,
          productId: favorite.productId,
          createdAt: favorite.createdAt,
          updatedAt: favorite.updatedAt,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Não foi possível adicionar o produto aos favoritos.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
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

    const productId = parseProductIdentifier(
      body.productId ?? body.produtoId ?? body.id,
    );

    if (!productId) {
      return NextResponse.json(
        { error: "Informe um identificador válido para o produto." },
        { status: 400 },
      );
    }

    const result = await db
      .delete(favoritesTable)
      .where(
        and(eq(favoritesTable.userId, user.id), eq(favoritesTable.productId, productId)),
      )
      .returning({ id: favoritesTable.id });

    if (result.length === 0) {
      return NextResponse.json(
        {
          message: "Produto não estava na lista de favoritos.",
        },
        { status: 200 },
      );
    }

    return NextResponse.json(
      {
        message: "Produto removido dos favoritos com sucesso.",
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Não foi possível remover o produto dos favoritos.",
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

function parseProductIdentifier(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value.toString();
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed) {
      return trimmed;
    }
  }

  return null;
}
