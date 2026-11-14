import React, { useState } from 'react';
import {
  Search,
  ShoppingBag,
  MapPin,
  User,
  ShieldCheck,
  Store,
  Flame,
  Radar,
  Compass,
  ChevronDown,
  Sparkles,
  CheckCircle2,
  LogOut,
  BarChart3,
  Navigation,
  X,
} from 'lucide-react';
import { useLondrinaApp } from '../context/LondrinaAppContext';

export const Header: React.FC = () => {
  const {
    currentPath,
    navigate,
    currentUser,
    quickLoginRole,
    logout,
    bairros,
    selectedBairro,
    setSelectedBairroId,
    algoritmoProximidadeAtivo,
    setAlgoritmoProximidadeAtivo,
    cartCount,
  } = useLondrinaApp();

  const [searchInput, setSearchInput] = useState('');
  const [bairroDropdownOpen, setBairroDropdownOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/busca?q=${encodeURIComponent(searchInput.trim())}`);
  };

  return (
    <>
      {/* Barra Institucional Superior — Prefeitura de Londrina & LondrinaGO (Rola naturalmente no mobile para economizar tela) */}
      <div className="bg-gradient-to-r from-[#8B0A1E] via-[#C8102E] to-[#9B0B22] text-white text-xs border-b border-white/10">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-1.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">
          <div className="flex items-center justify-between sm:justify-start gap-2 min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <img
                src="/assets/brand/brasao-londrina.svg"
                alt="Brasão de Londrina"
                className="w-5 h-5 rounded-full bg-white p-0.5 shrink-0"
              />
              <span className="font-bold tracking-wide uppercase text-[10px] sm:text-[11px] truncate">
                Prefeitura de Londrina • CODEL & SDE
              </span>
            </div>
            <span className="hidden xl:inline-flex items-center gap-1 bg-white/15 px-2 py-0.5 rounded-full text-[11px] font-medium border border-white/20 shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
              Integrado ao LondrinaGO (Gov.br)
            </span>
          </div>

          {/* Seletor Rápido de Perfis (Scroll horizontal suave no mobile) */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <span className="text-[10px] sm:text-[11px] text-rose-100 shrink-0 mr-0.5">
               LondrinaGO:
            </span>
            <button
              type="button"
              onClick={() => {
                quickLoginRole('cidadao');
                navigate('/');
              }}
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all flex items-center gap-1 shrink-0 ${
                currentUser?.role === 'cidadao'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'bg-white/15 hover:bg-white/25 text-white'
              }`}
            >
              <User className="w-3 h-3" />
              Cidadão
            </button>
            <button
              type="button"
              onClick={() => {
                quickLoginRole('comerciante');
                navigate('/vendedor');
              }}
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all flex items-center gap-1 shrink-0 ${
                currentUser?.role === 'comerciante'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'bg-white/15 hover:bg-white/25 text-white'
              }`}
            >
              <Store className="w-3 h-3" />
              Comerciante
            </button>
            <button
              type="button"
              onClick={() => {
                quickLoginRole('admin');
                navigate('/inteligencia-economica');
              }}
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all flex items-center gap-1 shrink-0 ${
                currentUser?.role === 'admin'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'bg-white/15 hover:bg-white/25 text-white'
              }`}
            >
              <BarChart3 className="w-3 h-3" />
              Admin / SDE
            </button>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-black/25 hover:bg-black/40 text-amber-200 border border-amber-300/30 transition-all shrink-0"
            >
              Logins
            </button>
          </div>
        </div>
      </div>

      {/* Header Principal Sticky Compacto e Responsivo */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3">
          <div className="flex flex-col gap-2.5">
            {/* Linha 1: Logo + Busca (Desktop) + Conta/Sacola */}
            <div className="flex items-center justify-between gap-2 sm:gap-4">
              {/* Logo + Seletor de Bairro (Desktop) */}
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="flex items-center text-left group focus:outline-none shrink-0"
                >
                  <img
                    src="/assets/brand/logomarca-shopping-londrina.svg"
                    alt="Shopping Digital de Londrina"
                    className="h-9 sm:h-12 lg:h-14 w-auto object-contain transition-transform group-hover:scale-[1.02]"
                  />
                </button>

                {/* Botão Hub do Bairro (Visível em telas sm+ ao lado da logo) */}
                <div className="hidden sm:block relative">
                  <button
                    type="button"
                    onClick={() => setBairroDropdownOpen(!bairroDropdownOpen)}
                    className="flex items-center gap-2 bg-rose-50 hover:bg-rose-100/80 border border-rose-200 rounded-xl px-2.5 py-1.5 text-left transition-all"
                  >
                    <div className="w-7 h-7 rounded-lg bg-[#C8102E] text-white flex items-center justify-center shrink-0 shadow-sm">
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#C8102E]">
                          Hub do Seu Bairro
                        </span>
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      </div>
                      <div className="text-xs font-bold text-slate-900 truncate max-w-[160px] xl:max-w-[200px] flex items-center gap-1">
                        <span className="truncate">{selectedBairro.nome}</span>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Barra de Busca Central (Visível no Desktop lg+) */}
              <form onSubmit={handleSearchSubmit} className="hidden lg:block flex-1 max-w-xl">
                <div className="relative flex items-center">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder={`Buscar em ${selectedBairro.nome} (ex: café, arroz 5kg, farmácia)...`}
                    className="w-full pl-10 pr-28 py-2.5 rounded-xl border border-slate-200 bg-slate-50/80 focus:bg-white focus:border-[#C8102E] focus:ring-2 focus:ring-[#C8102E]/20 text-sm transition-all"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 px-3 py-1.5 bg-[#C8102E] hover:bg-[#9B0B22] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Navigation className="w-3 h-3" />
                    Perto de Mim
                  </button>
                </div>
              </form>

              {/* Ações Rápidas à Direita: Conta LondrinaGO & Sacola */}
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                {currentUser ? (
                  <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 rounded-xl px-2 py-1 sm:px-2.5 sm:py-1.5">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      onClick={() => navigate('/conta')}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg object-cover border border-[#C8102E]/30 cursor-pointer shrink-0"
                    />
                    <button
                      type="button"
                      onClick={() => navigate('/conta')}
                      className="text-left hidden md:block"
                    >
                      <span className="block text-[10px] font-extrabold uppercase tracking-wider text-[#C8102E]">
                        LondrinaGO • {currentUser.role.toUpperCase()}
                      </span>
                      <span className="block text-xs font-bold text-slate-900 truncate max-w-[120px]">
                        {currentUser.name.split(' ')[0]} {currentUser.name.split(' ')[1]}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={logout}
                      title="Sair / Trocar Conta LondrinaGO"
                      className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="px-2.5 py-2 sm:px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5"
                  >
                    <User className="w-4 h-4 text-amber-400" />
                    <span className="hidden sm:inline">Entrar LondrinaGO</span>
                    <span className="sm:hidden">Entrar</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => navigate('/carrinho')}
                  className="relative flex items-center gap-1.5 bg-[#C8102E] hover:bg-[#9B0B22] text-white px-2.5 sm:px-3.5 py-2 sm:py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all"
                >
                  <ShoppingBag className="w-4 h-4 shrink-0" />
                  <span className="hidden sm:inline">Sacola</span>
                  {cartCount > 0 && (
                    <span className="px-1.5 py-0.2 bg-amber-400 text-slate-950 rounded-full text-[10px] sm:text-[11px] font-extrabold">
                      {cartCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Linha 2 (Mobile / Tablet < lg): Seletor de Bairro Mobile + Barra de Busca Mobile */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 lg:hidden">
              {/* Botão Hub do Bairro exclusivo para Mobile (< sm) */}
              <button
                type="button"
                onClick={() => setBairroDropdownOpen(!bairroDropdownOpen)}
                className="sm:hidden flex items-center justify-between gap-2 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2 text-left"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-6 h-6 rounded-lg bg-[#C8102E] text-white flex items-center justify-center shrink-0">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#C8102E] block leading-none">
                      Hub do Seu Bairro • Raio 2 a 4 Quadras
                    </span>
                    <span className="text-xs font-black text-slate-900 truncate block mt-0.5">
                      {selectedBairro.nome} ({selectedBairro.zona})
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-extrabold bg-white text-[#C8102E] border border-rose-200 px-2 py-1 rounded-lg flex items-center gap-1 shrink-0">
                  Trocar
                  <ChevronDown className="w-3 h-3" />
                </span>
              </button>

              {/* Busca Mobile / Tablet */}
              <form onSubmit={handleSearchSubmit} className="flex-1">
                <div className="relative flex items-center">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder={`Buscar perto de você em ${selectedBairro.nome.split(' ')[0]}...`}
                    className="w-full pl-9 pr-20 py-2 rounded-xl border border-slate-200 bg-slate-50/90 focus:bg-white focus:border-[#C8102E] focus:ring-2 focus:ring-[#C8102E]/20 text-xs sm:text-sm transition-all"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 px-2.5 py-1 bg-[#C8102E] hover:bg-[#9B0B22] text-white text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Navigation className="w-3 h-3" />
                    Buscar
                  </button>
                </div>
              </form>
            </div>

            {/* Barra de Navegação Horizontal das Seções */}
            <nav className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2 border-t border-slate-100 text-[11px] sm:text-xs font-bold -mx-1 px-1">
              <button
                type="button"
                onClick={() => navigate('/')}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                  currentPath === '/'
                    ? 'bg-[#C8102E] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Vitrine Londrina
              </button>

              <button
                type="button"
                onClick={() => navigate('/hub-bairros')}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                  currentPath === '/hub-bairros'
                    ? 'bg-[#C8102E] text-white shadow-sm'
                    : 'bg-rose-50 text-[#C8102E] hover:bg-rose-100 border border-rose-200/60'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                Hub de Bairros
              </button>

              <button
                type="button"
                onClick={() => navigate('/busca')}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                  currentPath === '/busca'
                    ? 'bg-[#C8102E] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Search className="w-3.5 h-3.5" />
                Busca Hiperlocal
              </button>

              <button
                type="button"
                onClick={() => navigate('/comparador-precos')}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                  currentPath === '/comparador-precos'
                    ? 'bg-[#C8102E] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Radar className="w-3.5 h-3.5" />
                Radar de Preços
              </button>

              <button
                type="button"
                onClick={() => navigate('/inteligencia-economica')}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                  currentPath === '/inteligencia-economica'
                    ? 'bg-slate-900 text-amber-400 shadow-sm'
                    : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-300/80'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-[#C8102E]" />
                Mapa de Calor SDE
              </button>

              <button
                type="button"
                onClick={() => navigate('/vendedor')}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                  currentPath === '/vendedor'
                    ? 'bg-[#C8102E] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                Área do Comerciante
              </button>

              <button
                type="button"
                onClick={() => navigate('/admin')}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                  currentPath === '/admin'
                    ? 'bg-[#C8102E] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                Gestão Municipal
              </button>
            </nav>
          </div>
        </div>

        {/* Modal / Dropdown Responsivo de Seleção de Bairro (Nunca vaza da tela no mobile) */}
        {bairroDropdownOpen && (
          <>
            <div
              onClick={() => setBairroDropdownOpen(false)}
              className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs z-40"
            />
            <div className="fixed inset-x-3 top-20 sm:top-24 sm:left-auto sm:right-6 md:left-48 md:right-auto sm:w-96 max-h-[80vh] flex flex-col bg-white rounded-3xl shadow-2xl border border-slate-200 p-4 z-50">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-[#C8102E]" />
                    Hub de Bairros de Londrina
                  </h4>
                  <p className="text-xs text-slate-500">
                    Priorizando produtos a poucas quadras da sua casa
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setBairroDropdownOpen(false)}
                  className="p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Toggle do Algoritmo de Proximidade */}
              <div className="bg-rose-50/70 border border-rose-200/80 rounded-xl p-2.5 mb-3 flex items-center justify-between gap-2 shrink-0">
                <div className="text-xs min-w-0">
                  <span className="font-bold text-slate-900 block">
                    Algoritmo Hiperlocal (2 a 4 Quadras)
                  </span>
                  <span className="text-slate-600 text-[11px] block">
                    {algoritmoProximidadeAtivo
                      ? 'Ativo: Lojas do seu bairro aparecem primeiro'
                      : 'Desativado: Ordenando por volume geral'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setAlgoritmoProximidadeAtivo(!algoritmoProximidadeAtivo)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-extrabold transition-all shrink-0 ${
                    algoritmoProximidadeAtivo
                      ? 'bg-[#C8102E] text-white shadow-sm'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {algoritmoProximidadeAtivo ? 'ATIVO' : 'OFF'}
                </button>
              </div>

              <div className="space-y-1.5 overflow-y-auto pr-1 flex-1">
                {bairros.map((b) => {
                  const isSelected = b.id === selectedBairro.id;
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => {
                        setSelectedBairroId(b.id);
                        setBairroDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-xl border transition-all flex items-center justify-between gap-2 ${
                        isSelected
                          ? 'bg-[#FFF1F2] border-[#C8102E] text-slate-900'
                          : 'bg-white hover:bg-slate-50 border-slate-100 text-slate-700'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-bold flex flex-wrap items-center gap-1.5">
                          <span className="truncate">{b.nome}</span>
                          <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded font-semibold shrink-0">
                            {b.zona}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 truncate mt-0.5">
                          {b.referencia} • {b.lojasAtivas} comércios
                        </div>
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-[#C8102E] shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </header>

      {/* Barra de Navegação Inferior Fixa para Mobile (Estilo SuperApp Smart City) */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_20px_rgba(15,23,42,0.08)] px-2 py-1.5">
        <div className="grid grid-cols-5 gap-1 max-w-md mx-auto">
          <button
            type="button"
            onClick={() => navigate('/')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-colors ${
              currentPath === '/' ? 'text-[#C8102E] font-extrabold' : 'text-slate-500 font-semibold'
            }`}
          >
            <Sparkles className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] leading-none">Início</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/hub-bairros')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-colors ${
              currentPath === '/hub-bairros'
                ? 'text-[#C8102E] font-extrabold'
                : 'text-slate-500 font-semibold'
            }`}
          >
            <Compass className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] leading-none">Bairros</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/comparador-precos')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-colors ${
              currentPath === '/comparador-precos'
                ? 'text-[#C8102E] font-extrabold'
                : 'text-slate-500 font-semibold'
            }`}
          >
            <Radar className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] leading-none">Preços</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/inteligencia-economica')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-colors ${
              currentPath === '/inteligencia-economica'
                ? 'text-[#C8102E] font-extrabold'
                : 'text-slate-500 font-semibold'
            }`}
          >
            <Flame className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] leading-none">Mapa SDE</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/carrinho')}
            className={`relative flex flex-col items-center justify-center py-1 rounded-xl transition-colors ${
              currentPath === '/carrinho'
                ? 'text-[#C8102E] font-extrabold'
                : 'text-slate-500 font-semibold'
            }`}
          >
            <ShoppingBag className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] leading-none">Sacola</span>
            {cartCount > 0 && (
              <span className="absolute top-0.5 right-3 w-4 h-4 rounded-full bg-[#C8102E] text-white text-[9px] font-black flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </>
  );
};
