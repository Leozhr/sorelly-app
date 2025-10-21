import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";

import {
  createSession,
  ensureUser,
  findVerification,
  generateVerificationCode,
  markUserAsVerified,
  removeSessionsByUser,
  removeVerification,
  upsertVerification,
} from "../utils";

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
    const code =
      typeof body.code === "string" && body.code.trim().length > 0
        ? body.code.trim()
        : null;

    if (!email) {
      return NextResponse.json(
        { error: "É necessário informar um email válido." },
        { status: 400 },
      );
    }

    const user = await ensureUser(email);

    if (!code) {
      const token = generateVerificationCode();
      const verification = await upsertVerification(user.id, token);

      return NextResponse.json(
        {
          message:
            "Código gerado com sucesso. (Simulação: nenhum email enviado) Utilize-o para confirmar o acesso.",
          user,
          verification: {
            code: verification.token,
            expiresAt: verification.expiresAt,
          },
        },
        { status: 200 },
      );
    }

    if (!/^[0-9]{6}$/.test(code)) {
      return NextResponse.json(
        { error: "O código informado é inválido. Utilize 6 dígitos numéricos." },
        { status: 400 },
      );
    }

    const verification = await findVerification(user.id, code);

    if (!verification) {
      return NextResponse.json(
        { error: "Código inválido ou inexistente para este usuário." },
        { status: 400 },
      );
    }

    if (verification.expiresAt.getTime() < Date.now()) {
      await removeVerification(verification.id);

      return NextResponse.json(
        { error: "Código expirado. Solicite um novo código." },
        { status: 400 },
      );
    }

    const shouldMarkAsVerified = !user.isVerified;
    const updatedUser = shouldMarkAsVerified
      ? await markUserAsVerified(user.id)
      : user;
    const finalUser = updatedUser ?? { ...user, isVerified: true };

    await removeSessionsByUser(finalUser.id);

    const sessionToken = randomUUID();
    const session = await createSession(finalUser.id, sessionToken);

    await removeVerification(verification.id);

    return NextResponse.json(
      {
        message: shouldMarkAsVerified
          ? "Conta verificada e sessão iniciada com sucesso."
          : "Código validado e nova sessão iniciada com sucesso.",
        user: finalUser,
        session: {
          token: session.sessionToken,
          expiresAt: session.expiresAt,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Não foi possível processar a solicitação.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
