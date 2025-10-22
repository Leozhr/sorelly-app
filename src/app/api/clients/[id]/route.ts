import { NextResponse } from "next/server";

import { db } from "@/db";
import { clientsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

type RouteParams = {
  params: {
    id: string;
  };
};

export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    const clientId = parseClientId(params.id);

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

export async function DELETE(_req: Request, { params }: RouteParams) {
  try {
    const clientId = parseClientId(params.id);

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
