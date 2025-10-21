import { NextResponse } from "next/server";

import { getUserByEmail } from "../utils";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Payload inválido. Envie um objeto JSON." },
        { status: 400 },
      );
    }

    const email = typeof body.email === "string" ? body.email.trim() : "";

    if (!email) {
      return NextResponse.json(
        { error: "É necessário informar um email válido." },
        { status: 400 },
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
