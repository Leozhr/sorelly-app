import { NextResponse } from "next/server";

import { getSessionByToken, getUserByEmail, getUserById } from "../utils";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Payload inválido. Envie um objeto JSON." },
        { status: 400 },
      );
    }

    const sessionToken =
      typeof body.sessionToken === "string" ? body.sessionToken.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";

    if (!sessionToken && !email) {
      return NextResponse.json(
        {
          error:
            "Informe um sessionToken válido ou o email para buscar a sessão.",
        },
        { status: 400 },
      );
    }

    if (sessionToken) {
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
              "Usuário associado à sessão não foi encontrado. Solicite uma nova sessão.",
          },
          { status: 500 },
        );
      }

      return NextResponse.json(
        {
          message: "Sessão válida.",
          user,
          session: {
            token: session.sessionToken,
            expiresAt: session.expiresAt,
            createdAt: session.createdAt,
          },
        },
        { status: 200 },
      );
    }

    const user = await getUserByEmail(email);

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado para o email informado." },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        error:
          "Sessões são criadas automaticamente após validar o código. Solicite um novo código caso precise acessar novamente.",
      },
      { status: 403 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Não foi possível iniciar a sessão.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
