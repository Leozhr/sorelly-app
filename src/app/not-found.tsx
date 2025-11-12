import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Página não encontrada - Sorelly",
  description: "A página que você está procurando não foi encontrada",
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 py-8">
      <div className="max-w-xl w-full text-center">
        {/* Código 404 */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-white mb-2 tracking-tight">
            404
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent mx-auto"></div>
        </div>

        {/* Mensagem principal */}
        <h2 className="text-3xl font-light text-white mb-4 tracking-wide">
          Link inválido ou expirado
        </h2>

        <p className="text-gray-400 mb-12 leading-relaxed max-w-md mx-auto">
          Este link não é mais válido ou já expirou.
        </p>

        {/* Card de aviso minimalista */}
        <div className="border border-yellow-500/20 rounded-lg p-8 backdrop-blur-sm bg-white/5">
          <div className="inline-block p-3 rounded-full bg-yellow-500/10 mb-4">
            <svg
              className="w-6 h-6 text-yellow-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-gray-300 text-base leading-relaxed">
            Entre em contato com a{" "}
            <span className="text-yellow-500 font-medium">
              vendedora
            </span>{" "}
            que te enviou este link para obter um novo acesso válido.
          </p>
        </div>
      </div>
    </div>
  );
}

