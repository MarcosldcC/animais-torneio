// components/MascoteTurmas.tsx
// Componente React (TailwindCSS) para designar ANIMAIS como mascote de TURMAS.
// - Sem fotos
// - Exclusivo: animal escolhido some da lista para outras turmas
// - Persistência local via localStorage
// - Seção de "Animais escolhidos"

import { useEffect, useMemo, useState } from "react";

const ANIMAIS: { id: number; name: string; group: string }[] = [
  { id: 1, name: "Baleia-azul", group: "Mamífero" },
  { id: 2, name: "Tartaruga-verde", group: "Réptil" },
  { id: 3, name: "Polvo", group: "Molusco" },
  { id: 4, name: "Golfinho-nariz-de-garrafa", group: "Mamífero" },
  { id: 5, name: "Pinguim-imperador", group: "Ave" },
  { id: 6, name: "Arraia-jamanta", group: "Peixe cartilaginoso" },
  { id: 7, name: "Orca", group: "Mamífero" },
  { id: 8, name: "Estrela-do-mar", group: "Equinodermo" },
  { id: 9, name: "Cavalo-marinho", group: "Peixe ósseo" },
  { id: 10, name: "Leão-marinho", group: "Mamífero" },
  { id: 11, name: "Coral", group: "Cnidário" },
  { id: 12, name: "Peixe-espada", group: "Peixe ósseo" },
  { id: 13, name: "Foca", group: "Mamífero" },
  { id: 14, name: "Caranguejo-rei", group: "Crustáceo" },
  { id: 15, name: "Água-viva", group: "Cnidário" },
  { id: 16, name: "Peixe-boi", group: "Mamífero" },
  { id: 17, name: "Lagosta", group: "Crustáceo" },
  { id: 18, name: "Peixe-lua (Mola mola)", group: "Peixe ósseo" },
  { id: 19, name: "Lontra-marinha", group: "Mamífero" },
  { id: 20, name: "Camarão", group: "Crustáceo" },
  { id: 21, name: "Tubarão-martelo", group: "Peixe cartilaginoso" },
  { id: 22, name: "Narval", group: "Mamífero" },
  { id: 23, name: "Anêmona-do-mar", group: "Cnidário" },
  { id: 24, name: "Arraia-elétrica", group: "Peixe cartilaginoso" },
  { id: 25, name: "Beluga", group: "Mamífero" },
  { id: 26, name: "Ouriço-do-mar", group: "Equinodermo" },
  { id: 27, name: "Caravela-portuguesa", group: "Cnidário (colônia)" },
];

const TURMAS = [
  "2º A", "2º B", "2º C", "2º D", "2º E",
  "3º A", "3º B", "3º C", "3º D",
  "4º A", "4º B", "4º C", "4º D", "4º E",
  "5º A", "5º B", "5º C", "5º D",
] as const;

type Designacoes = Record<(typeof TURMAS)[number], number | null>;
const STORAGE_KEY = "mascotesPorTurma";

export default function MascoteTurmas() {
  const [query, setQuery] = useState("");
  const [turmaSelecionada, setTurmaSelecionada] = useState<(typeof TURMAS)[number]>(TURMAS[0]);
  const [designacoes, setDesignacoes] = useState<Designacoes>(() => {
    let base: Designacoes = Object.fromEntries(TURMAS.map((t) => [t, null])) as Designacoes;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        for (const t of TURMAS) {
          if (t in parsed && (typeof parsed[t] === "number" || parsed[t] === null)) {
            base[t] = parsed[t];
          }
        }
      }
    } catch (_) {}
    return base;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(designacoes));
    } catch (_) {}
  }, [designacoes]);

  const atualId = designacoes[turmaSelecionada];
  const atual = atualId ? ANIMAIS.find((a) => a.id === atualId) ?? null : null;

  function atribuir(animalId: number) {
    setDesignacoes((prev) => ({ ...prev, [turmaSelecionada]: animalId }));
  }

  function limparTurma() {
    setDesignacoes((prev) => ({ ...prev, [turmaSelecionada]: null }));
  }

  const animalsDisponiveis = useMemo(() => {
    const q = query.trim().toLowerCase();
    const usados = new Set(Object.values(designacoes).filter((id) => id !== null && id !== atualId) as number[]);
    return ANIMAIS.filter((a) => !usados.has(a.id)).filter((a) => {
      if (!q) return true;
      return [a.name, a.group].some((f) => f.toLowerCase().includes(q));
    });
  }, [query, designacoes, atualId]);

  const turmasPorAnimal = useMemo(() => {
    const map = new Map<number, string[]>();
    for (const [turma, animalId] of Object.entries(designacoes) as [string, number | null][]) {
      if (animalId) {
        if (!map.has(animalId)) map.set(animalId, []);
        map.get(animalId)!.push(turma);
      }
    }
    return map;
  }, [designacoes]);

  const animaisEscolhidos = useMemo(() => {
    return Array.from(turmasPorAnimal.entries()).map(([animalId, turmas]) => {
      const animal = ANIMAIS.find((a) => a.id === animalId)!;
      return { ...animal, turmas };
    });
  }, [turmasPorAnimal]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-6xl">
        <header className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:items-end">
          <div className="col-span-2">
            <h1 className="text-3xl font-bold text-slate-900">Designar Mascotes por Turma</h1>
            <p className="text-slate-600">Selecione uma turma e clique em um animal para defini-lo como mascote dessa turma. Animais já escolhidos somem da lista.</p>
          </div>
          <div className="flex items-center gap-3 justify-start sm:justify-end">
            <label className="text-sm text-slate-600">Turma</label>
            <select
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 shadow-sm focus:ring-2 focus:ring-sky-400"
              value={turmaSelecionada}
              onChange={(e) => setTurmaSelecionada(e.target.value as (typeof TURMAS)[number])}
            >
              {TURMAS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </header>

        <section className="mb-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="text-sm text-slate-500">Turma selecionada</div>
              <div className="text-xl font-semibold text-slate-900">{turmaSelecionada}</div>
              {atual ? (
                <div className="mt-1 text-slate-700">Mascote atual: <span className="font-medium">{atual.name}</span> <span className="text-slate-500">({atual.group})</span></div>
              ) : (
                <div className="mt-1 text-slate-500">Nenhum mascote definido ainda.</div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Buscar animal por nome ou grupo..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-72 rounded-xl border border-slate-300 bg-white px-4 py-2 outline-none focus:ring-2 focus:ring-sky-400 shadow-sm"
              />
              <button
                onClick={limparTurma}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-slate-700 hover:bg-slate-50 shadow-sm"
              >
                Remover mascote da turma
              </button>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {animalsDisponiveis.map((a) => {
            const isAtual = a.id === atualId;
            return (
              <button
                key={a.id}
                onClick={() => atribuir(a.id)}
                className={`group relative w-full rounded-2xl border bg-white p-4 text-left shadow-sm transition hover:shadow-md focus:outline-none ${
                  isAtual ? "border-sky-500 ring-2 ring-sky-200" : "border-slate-200"
                }`}
                title={`Definir ${a.name} como mascote de ${turmaSelecionada}`}
              >
                {isAtual && (
                  <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-sky-100 px-2 py-1 text-xs font-medium text-sky-700">
                    Mascote da {turmaSelecionada}
                  </span>
                )}
                <div className="text-lg font-semibold text-slate-900">{a.name}</div>
                <div className="text-sm text-slate-600">{a.group}</div>
              </button>
            );
          })}
        </div>

        {/* seção de animais escolhidos */}
        <section className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold text-slate-900">Animais escolhidos</h2>
            <div className="text-sm text-slate-600">Total: {animaisEscolhidos.length}</div>
          </div>
          {animaisEscolhidos.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-500 shadow-sm">Nenhum animal foi escolhido por nenhuma turma ainda.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {animaisEscolhidos.map((item) => (
                <div key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="text-lg font-semibold text-slate-900">{item.name}</div>
                  <div className="text-sm text-slate-600">{item.group}</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.turmas.map((t) => (
                      <span key={t} className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700 border border-slate-200">{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-3">Resumo por turma</h2>
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-600">
                  <th className="px-4 py-3 text-left">Turma</th>
                  <th className="px-4 py-3 text-left">Mascote</th>
                  <th className="px-4 py-3 text-left">Grupo</th>
                </tr>
              </thead>
              <tbody>
                {TURMAS.map((t) => {
                  const id = designacoes[t];
                  const animal = id ? ANIMAIS.find((a) => a.id === id) ?? null : null;
                  return (
                    <tr key={t} className="border-t border-slate-100">
                      <td className="px-4 py-3 font-medium text-slate-900">{t}</td>
                      <td className="px-4 py-3">{animal ? animal.name : <span className="text-slate-400">—</span>}</td>
                      <td className="px-4 py-3 text-slate-600">{animal ? animal.group : <span className="text-slate-400">—</span>}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}