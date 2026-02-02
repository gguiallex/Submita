'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AvaliarArtigoPage() {
  const { atribuicaoId } = useParams();
  const router = useRouter();
  const [atribuicao, setAtribuicao] = useState<any>(null);
  const [perguntas, setPerguntas] = useState<any[]>([]);
  const [respostas, setRespostas] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      // 1. Busca detalhes da atribuição e perguntas da edição
      const res = await fetch(`/api/atribuicoes/${atribuicaoId}`);
      const data = await res.json();
      setAtribuicao(data);
      setPerguntas(data.artigo.edicao.perguntas);

      // Se já existirem respostas, carrega-as no estado
      const initialRespostas: any = {};
      data.respostas.forEach((r: any) => {
        initialRespostas[r.perguntaId] = r.resposta;
      });
      setRespostas(initialRespostas);

      setLoading(false);
    };
    fetchData();
  }, [atribuicaoId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);

    try {
      const res = await fetch(`/api/atribuicoes/${atribuicaoId}/respostas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ respostas })
      });

      if (res.ok) {
        alert("Avaliação salva com sucesso!");
        router.push('/revisor');
      }
    } catch (error) {
      alert("Erro ao salvar avaliação.");
    } finally {
      setEnviando(false);
    }
  };

  if (loading) return <div className="p-20 text-center text-slate-400 font-bold">Carregando formulário...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 text-slate-900">
      <div className="max-w-3xl mx-auto">
        <Link href="/revisor" className="text-xs font-bold text-blue-600 hover:underline uppercase tracking-widest">
          ← Voltar para Lista
        </Link>

        <header className="my-8">
          <h1 className="text-2xl font-black text-slate-800 mb-2">{atribuicao.artigo.titulo}</h1>
          <p className="text-slate-500 text-sm">Preencha os critérios de avaliação abaixo.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          {perguntas.map((pergunta) => (
            <div key={pergunta.id} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <label className="block text-slate-800 font-bold mb-4">
                {pergunta.texto}
                <span className="block text-[10px] text-slate-400 uppercase mt-1 tracking-widest">
                  {pergunta.tipo === 'escala' ? 'Nota de 1 a 5' : 'Resposta em texto'}
                </span>
              </label>

              {/* LÓGICA CONDICIONAL DE RENDERIZAÇÃO */}
              {pergunta.tipo === 'escala' ? (
                // Renderiza os botões de 1 a 5
                <div className="flex justify-between gap-2">
                  {[1, 2, 3, 4, 5].map((nota) => (
                    <button
                      key={nota}
                      type="button"
                      onClick={() => setRespostas({ ...respostas, [pergunta.id]: String(nota) })}
                      className={`flex-1 py-4 rounded-xl font-black transition-all ${respostas[pergunta.id] === String(nota)
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-100'
                          : 'bg-slate-50 text-slate-400 hover:bg-slate-100 border border-transparent'
                        }`}
                    >
                      {nota}
                    </button>
                  ))}
                </div>
              ) : (
                // Renderiza o campo de texto (textarea)
                <textarea
                  rows={4}
                  placeholder="Digite sua avaliação técnica aqui..."
                  className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-700 font-medium"
                  value={respostas[pergunta.id] || ''}
                  onChange={(e) => setRespostas({ ...respostas, [pergunta.id]: e.target.value })}
                  required
                />
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={enviando}
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 disabled:opacity-50"
          >
            {enviando ? 'SALVANDO...' : 'FINALIZAR AVALIAÇÃO'}
          </button>
        </form>
      </div>
    </div>
  );
}