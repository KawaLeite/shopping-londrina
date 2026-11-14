import React, { useState, useMemo } from 'react';
import {
  Search,
  MapPin,
  SlidersHorizontal,
  Compass,
  CheckCircle2,
  Footprints,
} from 'lucide-react';
import { useLondrinaApp } from '../context/LondrinaAppContext';
import { CATEGORIAS_LONDRINA } from '../data/londrinaSeed';
import { ProductCard } from '../components/ProductCard';
import { StoreCard } from '../components/StoreCard';

export const BuscaPage: React.FC = () => {
  const {
    searchParams,
    bairros,
    selectedBairro,
    setSelectedBairroId,
    productsWithProximity,
    storesWithProximity,
  } = useLondrinaApp();

  const initialQuery = searchParams.get('q') || '';
  const initialCat = searchParams.get('categoria') || 'todas';

  const [query, setQuery] = useState(initialQuery);
  const [selectedCat, setSelectedCat] = useState(initialCat);
  const [sortMode, setSortMode] = useState<'proximidade' | 'menor-preco' | 'populares'>(
    'proximidade'
  );
  const [onlyMyBairro, setOnlyMyBairro] = useState(false);

  const filteredProducts = useMemo(() => {
    let list = [...productsWithProximity];

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.nome.toLowerCase().includes(q) ||
          p.descricao.toLowerCase().includes(q) ||
          p.categoria.toLowerCase().includes(q) ||
          p.store.nome.toLowerCase().includes(q) ||
          p.store.bairroNome.toLowerCase().includes(q)
      );
    }

    if (selectedCat !== 'todas') {
      list = list.filter((p) => p.categoriaSlug === selectedCat);
    }

    if (onlyMyBairro) {
      list = list.filter((p) => p.proximity.isSameBairro);
    }

    if (sortMode === 'proximidade') {
      list.sort((a, b) => b.proximity.prioridadeScore - a.proximity.prioridadeScore);
    } else if (sortMode === 'menor-preco') {
      list.sort(
        (a, b) =>
          (a.precoPromocional ?? a.preco) - (b.precoPromocional ?? b.preco)
      );
    } else {
      list.sort((a, b) => b.vendasMes - a.vendasMes);
    }

    return list;
  }, [productsWithProximity, query, selectedCat, sortMode, onlyMyBairro]);

  const filteredStores = useMemo(() => {
    let list = [...storesWithProximity];
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (s) =>
          s.nome.toLowerCase().includes(q) ||
          s.segmento.toLowerCase().includes(q) ||
          s.bairroNome.toLowerCase().includes(q)
      );
    }
    if (onlyMyBairro) {
      list = list.filter((s) => s.proximity.isSameBairro);
    }
    return list;
  }, [storesWithProximity, query, onlyMyBairro]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Banner de Contexto da Busca Hiperlocal */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#C8102E] uppercase tracking-wider mb-1">
              <Compass className="w-4 h-4" />
              Motor de Busca Hiperlocal • Hub de Bairros Londrina
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Pesquisa Priorizada por Proximidade ({selectedBairro.nome})
            </h1>
            <p className="text-xs text-slate-500">
              Mostrando primeiro os produtos a 2 ou 3 quadras da sua localização antes de lojas distantes
            </p>
          </div>

          {/* Seletor de Bairro na Busca */}
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#C8102E] shrink-0" />
            <select
              value={selectedBairro.id}
              onChange={(e) => setSelectedBairroId(e.target.value)}
              className="rounded-xl border-slate-300 text-xs font-extrabold text-slate-900 focus:border-[#C8102E] focus:ring-[#C8102E]"
            >
              {bairros.map((b) => (
                <option key={b.id} value={b.id}>
                  Meu Bairro: {b.nome} ({b.zona})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Controles de Filtro */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2">
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Digite o produto (ex: arroz, café, vitamina, churrasco)..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:border-[#C8102E] focus:ring-[#C8102E]"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
              className="w-full py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:border-[#C8102E]"
            >
              <option value="todas">Todos os Departamentos</option>
              {CATEGORIAS_LONDRINA.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-4 flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value as any)}
              className="w-full py-2 rounded-xl border border-slate-200 text-xs font-extrabold text-[#C8102E] bg-rose-50/50 focus:border-[#C8102E]"
            >
              <option value="proximidade">
                ⭐ Priorizar Mais Perto de Mim (Hub de Bairros)
              </option>
              <option value="menor-preco">💲 Menor Preço na Cidade</option>
              <option value="populares">🔥 Mais Vendidos em Londrina</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
          <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
            <input
              type="checkbox"
              checked={onlyMyBairro}
              onChange={(e) => setOnlyMyBairro(e.target.checked)}
              className="rounded text-[#C8102E] focus:ring-[#C8102E]"
            />
            <Footprints className="w-3.5 h-3.5 text-[#C8102E]" />
            Mostrar apenas produtos dentro do meu bairro ({selectedBairro.nome})
          </label>

          <span className="text-xs font-semibold text-slate-500">
            {filteredProducts.length} produtos encontrados •{' '}
            <strong className="text-[#C8102E]">
              {filteredProducts.filter((p) => p.proximity.isSameBairro).length} no seu próprio bairro
            </strong>
          </span>
        </div>
      </div>

      {/* Resultados de Produtos */}
      <div className="space-y-4">
        <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-[#C8102E]" />
          Produtos Encontrados (Ordenados por Proximidade)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Lojas Correspondentes */}
      <div className="space-y-4 pt-4">
        <h2 className="text-lg font-black text-slate-900">
          Comércios Próximos Relacionados
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredStores.slice(0, 4).map((store) => (
            <StoreCard key={store.id} store={store} />
          ))}
        </div>
      </div>
    </div>
  );
};

