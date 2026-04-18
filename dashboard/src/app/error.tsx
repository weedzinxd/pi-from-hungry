'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="pt-BR">
      <body className="bg-zinc-950 text-white min-h-screen flex items-center justify-center p-6">
        <div className="max-w-xl w-full rounded-2xl border border-red-500/30 bg-zinc-900 p-6">
          <h2 className="text-2xl font-bold text-red-400 mb-3">Falha na aplicação</h2>
          <p className="text-zinc-300 mb-4">
            O dashboard encontrou um erro inesperado. Os detalhes foram enviados ao console para análise.
          </p>
          <button
            onClick={reset}
            className="rounded-lg bg-red-500 px-4 py-2 font-medium text-white hover:bg-red-600 transition"
          >
            Tentar novamente
          </button>
        </div>
      </body>
    </html>
  );
}
