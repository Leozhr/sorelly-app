import Brevo from "@getbrevo/brevo";

let client: Brevo.TransactionalEmailsApi | null = null;

function getClient() {
  if (!client) {
    client = new Brevo.TransactionalEmailsApi();
  }

  return client;
}

function getErrorStatus(error: unknown) {
  if (
    error &&
    typeof error === "object" &&
    "response" in error &&
    error.response &&
    typeof error.response === "object"
  ) {
    const response = error.response as { status?: number };
    return response?.status;
  }

  if (error && typeof error === "object" && "statusCode" in error) {
    return (error as { statusCode?: number }).statusCode;
  }

  return undefined;
}

export async function sendVerificationEmail(to: string, code: string) {
  const apiKey = process.env.BREVO_API_KEY;

  if (!apiKey) {
    console.warn("BREVO_API_KEY ausente – email não enviado.");
    return;
  }

  const email = {
    sender: {
      email: process.env.BREVO_SENDER_EMAIL ?? "adm@hnoapps.com",
      name: process.env.BREVO_SENDER_NAME ?? "Sorelly App",
    },
    to: [{ email: to }],
    subject: "Seu código de acesso",
    htmlContent: `<p>Seu código é <strong>${code}</strong>. Ele expira em 10 minutos.</p>`,
  };

  const transactionalClient = getClient();
  transactionalClient.setApiKey(
    Brevo.TransactionalEmailsApiApiKeys.apiKey,
    apiKey,
  );

  try {
    await transactionalClient.sendTransacEmail(email);
  } catch (error) {
    const status = getErrorStatus(error);

    if (status === 401) {
      throw new Error(
        "Falha ao enviar email: verifique a chave e permissões da API Brevo.",
      );
    }

    console.error("Falha ao enviar email de verificação:", error);
    throw new Error("Falha ao enviar email de verificação.");
  }
}
