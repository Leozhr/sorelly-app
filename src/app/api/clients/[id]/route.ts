import { NextRequest, NextResponse } from "next/server";

import { db } from "@/db";
import { clientsTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { getSessionByToken, getUserById } from "../../auth/utils";

type ClientRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(req: NextRequest, context: ClientRouteContext) {
  try {
    const { id } = await context.params;
    const clientId = parseClientId(id);

    if (!clientId) {
      return NextResponse.json(
        { error: "Informe um identificador válido para o cliente." },
        { status: 400 },
      );
    }

    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.toLowerCase().startsWith("bearer ")) {
      return NextResponse.json(
        { error: "Sessão inválida. Informe o token no header Authorization." },
        { status: 401 },
      );
    }

    const sessionToken = authHeader.slice(7).trim();

    if (!sessionToken) {
      return NextResponse.json(
        { error: "Sessão inválida. Token ausente no header Authorization." },
        { status: 401 },
      );
    }

    const session = await getSessionByToken(sessionToken);

    if (!session) {
      return NextResponse.json(
        { error: "Sessão inválida ou inexistente." },
        { status: 401 },
      );
    }

    if (session.expiresAt && session.expiresAt.getTime() <= Date.now()) {
      return NextResponse.json(
        { error: "Sessão expirada. Faça login novamente." },
        { status: 401 },
      );
    }

    const user = await getUserById(session.userId);

    if (!user) {
      return NextResponse.json(
        {
          error:
            "Usuário vinculado à sessão não foi encontrado. Solicite uma nova sessão.",
        },
        { status: 500 },
      );
    }

    const [client] = await db
      .select()
      .from(clientsTable)
      .where(
        and(eq(clientsTable.id, clientId), eq(clientsTable.userId, user.id)),
      )
      .limit(1);

    if (!client) {
      return NextResponse.json(
        { error: "Cliente não encontrado." },
        { status: 404 },
      );
    }

    return NextResponse.json({ client }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Não foi possível buscar o cliente.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest, context: ClientRouteContext) {
  try {
    const { id } = await context.params;
    const clientId = parseClientId(id);

    if (!clientId) {
      return NextResponse.json(
        { error: "Informe um identificador válido para o cliente." },
        { status: 400 },
      );
    }

    const body = await req.json();

    if (!isPlainObject(body)) {
      return NextResponse.json(
        { error: "Payload inválido. Envie um objeto JSON." },
        { status: 400 },
      );
    }

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : undefined;
    const phone =
      typeof body.phone === "string"
        ? body.phone.trim()
        : undefined;

    const payload: Record<string, string> = {};

    if (typeof name === "string") {
      if (!name) {
        return NextResponse.json(
          { error: "Informe um nome válido para atualizar o cliente." },
          { status: 400 },
        );
      }

      payload.name = name;
    }

    if (typeof phone === "string") {
      if (!phone) {
        return NextResponse.json(
          { error: "Informe um telefone válido para atualizar o cliente." },
          { status: 400 },
        );
      }

      payload.phone = phone;
      const digitsOnly = phone.replace(/\D/g, "");

      if (!digitsOnly) {
        return NextResponse.json(
          {
            error:
              "Informe um telefone utilizando ao menos um dígito numérico válido.",
          },
          { status: 400 },
        );
      }

      payload.whatsApp = `https://wa.me/${digitsOnly}`;
    }

    if (Object.keys(payload).length === 0) {
      return NextResponse.json(
        {
          error:
            "Informe ao menos um campo (nome ou telefone) para atualizar o cliente.",
        },
        { status: 400 },
      );
    }

    const [client] = await db
      .update(clientsTable)
      .set(payload)
      .where(eq(clientsTable.id, clientId))
      .returning();

    if (!client) {
      return NextResponse.json(
        { error: "Cliente não encontrado." },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Cliente atualizado com sucesso.", client },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Não foi possível atualizar o cliente.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  context: ClientRouteContext,
) {
  try {
    const { id } = await context.params;
    const clientId = parseClientId(id);

    if (!clientId) {
      return NextResponse.json(
        { error: "Informe um identificador válido para o cliente." },
        { status: 400 },
      );
    }

    const [client] = await db
      .delete(clientsTable)
      .where(eq(clientsTable.id, clientId))
      .returning();

    if (!client) {
      return NextResponse.json(
        { error: "Cliente não encontrado." },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Cliente removido com sucesso." },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Não foi possível remover o cliente.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

function parseClientId(rawId: string | undefined) {
  if (!rawId || rawId.trim().length === 0) {
    return null;
  }

  const value = Number.parseInt(rawId, 10);

  if (!Number.isInteger(value) || value <= 0) {
    return null;
  }

  return value;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
