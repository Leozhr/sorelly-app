import { NextResponse } from "next/server";

import { getSessionByToken, getUserById } from "../auth/utils";
import { db } from "@/db";
import { clientsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
  try {
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

    const clients = await db
      .select()
      .from(clientsTable)
      .where(eq(clientsTable.userId, user.id));

    return NextResponse.json({ clients }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Não foi possível listar os clientes.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
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
        : "";
    const phone =
      typeof body.phone === "string"
        ? body.phone.trim()
        : "";

    if (!name) {
      return NextResponse.json(
        { error: "Informe um nome válido para o cliente." },
        { status: 400 },
      );
    }

    if (!phone) {
      return NextResponse.json(
        { error: "Informe um telefone válido para o cliente." },
        { status: 400 },
      );
    }

    const [client] = await db
      .insert(clientsTable)
      .values({
        userId: user.id,
        name,
        phone,
      })
      .returning();

    return NextResponse.json(
      { message: "Cliente cadastrado com sucesso.", client },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Não foi possível cadastrar o cliente.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
