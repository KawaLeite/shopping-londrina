import React, { useState } from 'react';
import {
  MapPin,
  Compass,
  Sparkles,
  ArrowRight,
  Footprints,
  ShieldCheck,
  Flame,
  Radar,
  Store,
  CheckCircle2,
  X,
  TrendingUp,
  Ticket,
} from 'lucide-react';
import { useLondrinaApp } from '../context/LondrinaAppContext';
import {
  CATEGORIAS_LONDRINA,
  STORIES_LONDRINA,
  CUPONS_LONDRINA,
  StoryLondrina,
} from '../data/londrinaSeed';
import { ProductCard } from '../components/ProductCard';
import { StoreCard } from '../components/StoreCard';

export const HomePage: React.FC = () => {
  const {
    navigate,
    bairros,
    selectedBairro,
    setSelectedBairroId,
    algoritmoProximidadeAtivo,
    setAlgoritmoProximidadeAtivo,
    productsWithProximity,
    storesWithProximity,
    applyCoupon,
  } = useLondrinaApp();

  const [activeStory, setActiveStory] = useState<StoryLondrina | null>(null);

  const sameBairroProducts = productsWithProximity.filter((p) => p.proximity.isSameBairro);
  const prioritizedProducts =
    sameBairroProducts.length >= 2
      ? [
          ...sameBairroProducts,
          ...productsWithProximity.filter((p) => !p.proximity.isSameBairro),
        ].slice(0, 8)
      : productsWithProximity.slice(0, 8);

  const restaurantsStores = storesWithProximity.filter(
    (s) => s.segmentoSlug === 'restaurantes'
  );
  const marketStores = storesWithProximity.filter((s) => s.segmentoSlug === 'mercados');
  const pharmacyStores = storesWithProximity.filter((s) => s.segmentoSlug === 'farmacias');

  return (
    <div className="space-y-7 sm:space-y-10 pb-8 sm:pb-12">
      {/* 1. STORIES DAS LOJAS DE LONDRINA */}
      <section className="bg-white border-b border-slate-200/70 py-3 sm:py-4">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-[#C8102E] flex items-center gap-1.5 min-w-0">
              <span className="w-2 h-2 rounded-full bg-[#C8102E] animate-ping shrink-0" />
              <span className="truncate">Ao Vivo nos Bairros • Stories das Lojas</span>
            </span>
            <span className="text-[11px] text-slate-500 hidden sm:inline shrink-0">
              Clique para ver as ofertas de hoje a poucas quadras de você
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto no-scrollbar py-1 -mx-1 px-1">
            {STORIES_LONDRINA.map((story) => (
              <button
                key={story.id}
                type="button"
                onClick={() => setActiveStory(story)}
                className="flex flex-col items-center gap-1 shrink-0 group focus:outline-none"
              >
                <div className="p-0.5 rounded-full bg-gradient-to-tr from-[#C8102E] via-rose-500 to-amber-400 shadow-sm group-hover:scale-105 transition-transform">
                  <div className="p-0.5 bg-white rounded-full">
                    <img
                      src={story.avatarUrl}
                      alt={story.storeNome}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover"
                    />
                  </div>
                </div>
                <span className="text-[11px] font-bold text-slate-800 max-w-[84px] sm:max-w-[92px] truncate">
                  {story.storeNome}
                </span>
                <span className="text-[9px] sm:text-[10px] font-semibold text-[#C8102E] bg-rose-50 px-1.5 py-0.5 rounded-full">
                  {story.bairroNome}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Modal de Story */}
      {activeStory && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="relative bg-slate-900 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-white/15">
            <div className="relative h-[72vh] max-h-[420px] sm:h-96">
              <img
                src={activeStory.mediaUrl}
                alt={activeStory.storeNome}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
              <button
                type="button"
                onClick={() => setActiveStory(null)}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute top-3 left-3 sm:top-4 sm:left-4 right-14 flex items-center gap-2.5 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full">
                <img
                  src={activeStory.avatarUrl}
                  alt={activeStory.storeNome}
                  className="w-8 h-8 rounded-full object-cover border border-amber-400 shrink-0"
                />
                <div className="text-white text-xs min-w-0">
                  <div className="font-bold truncate">{activeStory.storeNome}</div>
                  <div className="text-[10px] text-amber-300 truncate">
                    Bairro {activeStory.bairroNome} • {activeStory.tempoAtras}
                  </div>
                </div>
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-white space-y-3">
                {activeStory.precoDestaque && (
                  <span className="inline-block bg-amber-400 text-slate-950 font-black text-xs sm:text-sm px-3 py-1 rounded-xl">
                    Oferta de Hoje: {activeStory.precoDestaque}
                  </span>
                )}
                <p className="text-xs sm:text-sm font-medium leading-snug">{activeStory.legenda}</p>
                <button
                  type="button"
                  onClick={() => {
                    const slug = activeStory.storeSlug;
                    setActiveStory(null);
                    navigate(`/loja/${slug}`);
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#C8102E] hover:bg-[#9B0B22] text-white font-extrabold text-xs flex items-center justify-center gap-1.5"
                >
                  Visitar Loja no Bairro {activeStory.bairroNome}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        {/* 2. HERO BANNER MUNICIPAL DE LONDRINA */}
        <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#8B0A1E] via-[#C8102E] to-[#680515] text-white shadow-xl border border-rose-500/30">
          <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.18),transparent_70%)] pointer-events-none" />
          <div className="relative p-4 sm:p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            <div className="lg:col-span-7 space-y-3.5 sm:space-y-4">
              <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-white/15 backdrop-blur-md border border-white/25 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-extrabold max-w-full">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 shrink-0" />
                <span className="truncate">SHOPPING DIGITAL DE LONDRINA • HUB DE BAIRROS</span>
              </div>

              <h1 className="text-xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight">
                Por que atravessar Londrina se o seu produto está{' '}
                <span className="text-amber-300 underline decoration-amber-400/60">
                  a 2 quadras de casa?
                </span>
              </h1>

              <p className="text-xs sm:text-base text-rose-100 leading-relaxed max-w-2xl">
                O <strong>Shopping Digital de Londrina</strong> utiliza inteligência territorial para dar visibilidade aos comércios do seu próprio bairro — descentralizando as compras do Centro e fortalecendo a economia local da nossa Terra Vermelha.
              </p>

              <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3 pt-1 sm:pt-2">
                <button
                  type="button"
                  onClick={() => navigate('/hub-bairros')}
                  className="w-full sm:w-auto justify-center px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm shadow-lg transition-all flex items-center gap-2"
                >
                  <Compass className="w-4 h-4 shrink-0" />
                  <span>Explorar Hub do Bairro ({selectedBairro.nome.split(' ')[0]})</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/inteligencia-economica')}
                  className="w-full sm:w-auto justify-center px-5 py-3 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/30 font-extrabold text-xs sm:text-sm transition-all flex items-center gap-2"
                >
                  <Flame className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>Mapa de Calor (Desenv. Econômico)</span>
                </button>
              </div>
            </div>

            {/* Card Resumo Hiperlocal do Bairro Atual */}
            <div className="lg:col-span-5 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-5 space-y-3.5 sm:space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/15 pb-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase tracking-wider text-amber-300 font-extrabold block">
                      Radar Hiperlocal Ativo
                    </span>
                    <h3 className="text-sm sm:text-base font-black text-white truncate">
                      {selectedBairro.nome}
                    </h3>
                  </div>
                </div>
                <span className="text-[11px] font-bold bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 px-2.5 py-0.5 rounded-full shrink-0">
                  {selectedBairro.zona}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-black/25 rounded-xl p-2 sm:p-2.5">
                  <span className="text-base sm:text-xl font-black text-amber-300 block">
                    {selectedBairro.lojasAtivas}
                  </span>
                  <span className="text-[10px] text-rose-100 leading-tight block">
                    Lojas no Bairro
                  </span>
                </div>
                <div className="bg-black/25 rounded-xl p-2 sm:p-2.5">
                  <span className="text-base sm:text-xl font-black text-white block">
                    2 a 4
                  </span>
                  <span className="text-[10px] text-rose-100 leading-tight block">
                    Quadras de Raio
                  </span>
                </div>
                <div className="bg-black/25 rounded-xl p-2 sm:p-2.5">
                  <span className="text-base sm:text-xl font-black text-emerald-300 block">
                    +{selectedBairro.crescimentoPosHub}%
                  </span>
                  <span className="text-[10px] text-rose-100 leading-tight block">
                    Vendas Retidas
                  </span>
                </div>
              </div>

              <div className="text-[11px] sm:text-xs text-rose-100 bg-black/20 rounded-xl p-3 flex items-start gap-2">
                <Footprints className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                <span>
                  Em <strong>{selectedBairro.nome}</strong>,{' '}
                  <strong>{selectedBairro.percentualPresencial}%</strong> dos clientes preferem retirar a pé em menos de 10 minutos e{' '}
                  <strong>{selectedBairro.percentualEntrega}%</strong> pedem entrega local expressa.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. CATEGORIAS / DEPARTAMENTOS COM ÍCONES OFICIAIS DE LONDRINA */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-4">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                Departamentos do Comércio de Londrina
              </h2>
              <p className="text-xs text-slate-500">
                Navegue pelos segmentos com priorização automática para o seu bairro
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/busca')}
              className="text-xs font-extrabold text-[#C8102E] hover:underline flex items-center gap-1 self-start sm:self-auto"
            >
              Ver todos os departamentos
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 sm:gap-3">
            {CATEGORIAS_LONDRINA.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => navigate(`/busca?categoria=${cat.slug}`)}
                className="group bg-white hover:bg-rose-50/60 border border-slate-200/80 hover:border-[#C8102E] rounded-2xl p-3 flex flex-col items-center text-center transition-all shadow-sm hover:shadow-md"
              >
                <div className="w-16 h-16 rounded-2xl bg-rose-50/90 group-hover:bg-white flex items-center justify-center p-2 mb-2.5 transition-transform group-hover:scale-110 border border-rose-100">
                  <img
                    src={cat.icone}
                    alt={cat.nome}
                    loading="eager"
                    className="w-full h-full object-contain drop-shadow-xs"
                  />
                </div>
                <span className="text-xs font-extrabold text-slate-800 group-hover:text-[#C8102E] leading-tight">
                  {cat.nome}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5 font-medium">
                  {cat.totalLojas} lojas
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* 4. SEÇÃO EXCLUSIVA LONDRINA: ALGORITMO DO HUB DE BAIRROS NA TELA INICIAL */}
        <section className="bg-gradient-to-br from-rose-50/90 via-white to-amber-50/50 rounded-3xl border-2 border-[#C8102E]/25 p-4 sm:p-7 shadow-sm space-y-5 sm:space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-rose-200/60 pb-4 sm:pb-5">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 bg-[#C8102E] text-white px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wide">
                <Compass className="w-3.5 h-3.5 shrink-0" />
                <span>Algoritmo Hub de Bairros • Londrina-PR</span>
              </div>
              <h2 className="text-lg sm:text-2xl font-black text-slate-900 leading-snug">
                Produtos a Poucas Quadras de Você em{' '}
                <span className="text-[#C8102E]">{selectedBairro.nome}</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-3xl">
                Antes do Hub de Bairros, <strong>{selectedBairro.indiceInvisibilidadeAntesHub}%</strong> dos moradores de{' '}
                <strong>{selectedBairro.nome}</strong> compravam no Centro por não saberem que o produto existia na esquina de casa. Troque de bairro abaixo para testar o algoritmo em tempo real:
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setAlgoritmoProximidadeAtivo(!algoritmoProximidadeAtivo)}
                className={`w-full sm:w-auto justify-center px-3.5 py-2.5 rounded-xl text-xs font-extrabold border transition-all flex items-center gap-1.5 ${
                  algoritmoProximidadeAtivo
                    ? 'bg-[#C8102E] text-white border-[#C8102E] shadow-sm'
                    : 'bg-white text-slate-700 border-slate-300'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                {algoritmoProximidadeAtivo
                  ? 'Priorização por Bairro: ATIVA'
                  : 'Priorização por Bairro: DESATIVADA'}
              </button>
            </div>
          </div>

          {/* Seletor Rápido de Bairros em Pílulas */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-500 block sm:hidden">
              Toque para simular morador em outro bairro:
            </span>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
              <span className="text-xs font-bold text-slate-500 shrink-0 mr-1 hidden sm:inline">
                Simular morador em:
              </span>
              {bairros.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setSelectedBairroId(b.id)}
                  className={`px-3 sm:px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                    selectedBairro.id === b.id
                      ? 'bg-slate-900 text-amber-400 shadow-sm ring-2 ring-[#C8102E]'
                      : 'bg-white hover:bg-rose-50 text-slate-700 border border-slate-200'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5 text-[#C8102E] shrink-0" />
                  {b.nome}
                </button>
              ))}
            </div>
          </div>

          {/* Grid de Produtos Priorizados pelo Algoritmo Hiperlocal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
            {prioritizedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* 5. BANNERS DE FERRAMENTAS MUNICIPAIS (RADAR DE PREÇOS, CUPONS E MAPA DE CALOR SDE) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
          <div
            onClick={() => navigate('/comparador-precos')}
            className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-5 cursor-pointer hover:shadow-xl transition-all border border-slate-700 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-amber-400">
                <Radar className="w-3.5 h-3.5" />
                Economia Doméstica
              </span>
              <h3 className="text-base sm:text-lg font-black">
                Radar de Preços entre Bairros
              </h3>
              <p className="text-xs text-slate-300">
                Compare o mesmo item (Arroz 5kg, Café 500g, Cesta Hortifruti, Churrasco) no seu bairro vs. outras regiões de Londrina.
              </p>
            </div>
            <span className="mt-4 inline-flex items-center gap-1 text-xs font-extrabold text-amber-400">
              Comparar preços agora <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div
            onClick={() => navigate('/inteligencia-economica')}
            className="bg-gradient-to-br from-[#C8102E] to-[#88091E] text-white rounded-2xl p-5 cursor-pointer hover:shadow-xl transition-all border border-rose-400/30 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-amber-300">
                <Flame className="w-3.5 h-3.5" />
                Secretaria de Desenv. Econômico
              </span>
              <h3 className="text-base sm:text-lg font-black">
                Mapa de Calor & Base Municipal
              </h3>
              <p className="text-xs text-rose-100">
                Visualize quais áreas de Londrina têm comércio mais ativo, compra presencial vs. entrega e segmentos invisíveis.
              </p>
            </div>
            <span className="mt-4 inline-flex items-center gap-1 text-xs font-extrabold text-amber-300">
              Abrir Painel SDE / CODEL <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-[#C8102E]">
                <Ticket className="w-3.5 h-3.5" />
                Cupons de Incentivo Local
              </span>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                Use BAIRROFORTE15
              </h3>
              <p className="text-xs text-slate-600">
                {CUPONS_LONDRINA[0].descricao}
              </p>
            </div>
            <button
              type="button"
              onClick={() => applyCoupon('BAIRROFORTE15')}
              className="mt-4 w-full py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-[#C8102E] font-extrabold text-xs border border-rose-200 transition-colors"
            >
              Ativar Cupom R$ 15 OFF na Sacola
            </button>
          </div>
        </section>

        {/* 6. LOJAS PRIORIZADAS POR SEGMENTO */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                <Store className="w-5 h-5 text-[#C8102E] shrink-0" />
                <span>Comércios Mais Próximos de {selectedBairro.nome}</span>
              </h2>
              <p className="text-xs text-slate-500">
                Ordenados pela menor distância em quadras da sua residência
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/hub-bairros')}
              className="text-xs font-extrabold text-[#C8102E] hover:underline flex items-center gap-1 self-start sm:self-auto"
            >
              Ver mapa completo dos bairros <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
            {storesWithProximity.slice(0, 4).map((store) => (
              <StoreCard key={store.id} store={store} />
            ))}
          </div>
        </section>

        {/* 7. GASTRONOMIA, CAFÉS ESPECIAIS & EMPÓRIOS DE LONDRINA */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                Padarias, Cafés Pé-Vermelho & Gastronomia de Bairro
              </h2>
              <p className="text-xs text-slate-500">
                Sabores tradicionais de Londrina: da Vila Casoni ao Patrimônio Heimtal
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
            {restaurantsStores.map((store) => (
              <StoreCard key={store.id} store={store} />
            ))}
          </div>
        </section>

        {/* 8. MERCADOS DE VIZINHANÇA & FARMÁCIAS */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                Mercados de Vizinhança, Sacolões & Farmácias 24h
              </h2>
              <p className="text-xs text-slate-500">
                Abasteça sua casa sem enfrentar trânsito até os hipermercados centrais
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
            {[...marketStores, ...pharmacyStores].slice(0, 4).map((store) => (
              <StoreCard key={store.id} store={store} />
            ))}
          </div>
        </section>

        {/* 9. BANNER INSTITUCIONAL LONDRINAGO + DESENVOLVIMENTO ECONÔMICO */}
        <section className="bg-slate-900 text-white rounded-3xl p-5 sm:p-8 border border-slate-800 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-5 sm:gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-extrabold text-amber-400 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-[#C8102E] shrink-0" />
              <span>Integração Nativa • Login Único LondrinaGO</span>
            </div>
            <h3 className="text-lg sm:text-2xl font-black leading-snug">
              Um único acesso para o Cidadão, o Comerciante de Bairro e o Gestor Público
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Autenticação integrada via CPF/CNPJ com validação de Alvará Digital no SEI/Redesim e geração de inteligência anônima para a Base Municipal de Dados da Secretaria de Desenvolvimento Econômico de Londrina.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto justify-center px-5 py-3 rounded-xl bg-[#C8102E] hover:bg-[#9B0B22] text-white font-extrabold text-xs flex items-center gap-2"
            >
              Testar Logins LondrinaGO
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => navigate('/inteligencia-economica')}
              className="w-full sm:w-auto justify-center px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs flex items-center gap-2"
            >
              <TrendingUp className="w-4 h-4" />
              Dados da Prefeitura (SDE)
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
