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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
      {/* Barra Institucional Superior — Prefeitura de Londrina & LondrinaGO */}
      <div className="bg-gradient-to-r from-[#8B0A1E] via-[#C8102E] to-[#9B0B22] text-white text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <img
              src="/assets/brand/brasao-londrina.svg"
              alt="Brasão de Londrina"
              className="w-5 h-5 rounded-full bg-white p-0.5"
            />
            <span className="font-bold tracking-wide uppercase text-[11px]">
              Prefeitura do Município de Londrina • CODEL & SDE
            </span>
            <span className="hidden md:inline-flex items-center gap-1 bg-white/15 px-2 py-0.5 rounded-full text-[11px] font-medium border border-white/20">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
              Integrado ao LondrinaGO (LondrinaON Cidadão • Gov.br)
            </span>
          </div>

          {/* Seletor Rápido de Perfis (Demo para Banca Avaliadora) */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-rose-100 hidden sm:inline mr-1">
              Simulador LondrinaGO:
            </span>
            <button
              type="button"
              onClick={() => {
                quickLoginRole('cidadao');
                navigate('/');
              }}
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all flex items-center gap-1 ${
                currentUser?.role === 'cidadao'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'bg-white/10 hover:bg-white/20 text-white'
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
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all flex items-center gap-1 ${
                currentUser?.role === 'comerciante'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'bg-white/10 hover:bg-white/20 text-white'
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
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all flex items-center gap-1 ${
                currentUser?.role === 'admin'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <BarChart3 className="w-3 h-3" />
              Admin / SDE
            </button>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-black/25 hover:bg-black/40 text-amber-200 border border-amber-300/30 transition-all"
            >
              Tela Login LondrinaGO
            </button>
          </div>
        </div>
      </div>

      {/* Linha Principal do Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          {/* Logo + Seletor do Hub de Bairros */}
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-left group focus:outline-none"
            >
              <img
                src="/assets/brand/logomarca-shopping-londrina.svg"
                alt="Shopping Digital de Londrina"
                className="h-12 sm:h-14 w-auto object-contain transition-transform group-hover:scale-[1.02]"
              />
            </button>

            {/* Seletor de Bairro Ativo (Hub de Bairros) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setBairroDropdownOpen(!bairroDropdownOpen)}
                className="flex items-center gap-2 bg-rose-50 hover:bg-rose-100/80 border border-rose-200 rounded-xl px-3 py-2 text-left transition-all"
              >
                <div className="w-8 h-8 rounded-lg bg-[#C8102E] text-white flex items-center justify-center shrink-0 shadow-sm">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#C8102E]">
                      Hub do Seu Bairro
                    </span>
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-slate-900 truncate max-w-[155px] sm:max-w-[200px] flex items-center gap-1">
                    {selectedBairro.nome}
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  </div>
                </div>
              </button>

              {/* Dropdown de Bairros de Londrina */}
              {bairroDropdownOpen && (
                <div className="absolute left-0 sm:right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50">
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
                      className="text-xs font-semibold text-slate-400 hover:text-slate-600"
                    >
                      Fechar
                    </button>
                  </div>

                  {/* Toggle do Algoritmo de Proximidade */}
                  <div className="bg-rose-50/70 border border-rose-200/80 rounded-xl p-2.5 mb-3 flex items-center justify-between gap-2">
                    <div className="text-xs">
                      <span className="font-bold text-slate-900 block">
                        Algoritmo Hiperlocal (Raio 2 a 4 Quadras)
                      </span>
                      <span className="text-slate-600 text-[11px]">
                        {algoritmoProximidadeAtivo
                          ? 'Ativo: Lojas do seu bairro aparecem primeiro'
                          : 'Desativado: Ordenando por volume geral da cidade'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAlgoritmoProximidadeAtivo(!algoritmoProximidadeAtivo)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-extrabold transition-all shrink-0 ${
                        algoritmoProximidadeAtivo
                          ? 'bg-[#C8102E] text-white shadow-sm'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {algoritmoProximidadeAtivo ? 'ATIVO' : 'OFF'}
                    </button>
                  </div>

                  <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
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
                          className={`w-full text-left px-3 py-2 rounded-xl border transition-all flex items-center justify-between ${
                            isSelected
                              ? 'bg-[#FFF1F2] border-[#C8102E] text-slate-900'
                              : 'bg-white hover:bg-slate-50 border-slate-100 text-slate-700'
                          }`}
                        >
                          <div>
                            <div className="text-xs font-bold flex items-center gap-1.5">
                              {b.nome}
                              <span className="text-[10px] px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded font-semibold">
                                {b.zona}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500">
                              {b.referencia} • {b.lojasAtivas} comércios ativos
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
              )}
            </div>
          </div>

          {/* Barra de Busca com Priorização por Bairro */}
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={`Buscar em ${selectedBairro.nome} (ex: café, arroz 5kg, farmácia, churrasco)...`}
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

          {/* Ações Rápidas: Conta LondrinaGO & Sacola */}
          <div className="flex items-center justify-end gap-2">
            {currentUser ? (
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 rounded-xl px-2.5 py-1.5">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-lg object-cover border border-[#C8102E]/30"
                />
                <button
                  type="button"
                  onClick={() => navigate('/conta')}
                  className="text-left"
                >
                  <span className="block text-[10px] font-extrabold uppercase tracking-wider text-[#C8102E]">
                    LondrinaGO • {currentUser.role.toUpperCase()}
                  </span>
                  <span className="block text-xs font-bold text-slate-900 truncate max-w-[130px]">
                    {currentUser.name.split(' ')[0]} {currentUser.name.split(' ')[1]}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={logout}
                  title="Sair / Trocar Conta LondrinaGO"
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <User className="w-4 h-4 text-amber-400" />
                Entrar com LondrinaGO
              </button>
            )}

            <button
              type="button"
              onClick={() => navigate('/carrinho')}
              className="relative flex items-center gap-2 bg-[#C8102E] hover:bg-[#9B0B22] text-white px-3.5 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Sacola</span>
              {cartCount > 0 && (
                <span className="px-1.5 py-0.2 bg-amber-400 text-slate-950 rounded-full text-[11px] font-extrabold">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Barra de Navegação das Seções do Sistema */}
        <nav className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-3 mt-2.5 border-t border-slate-100 text-xs font-bold">
          <button
            type="button"
            onClick={() => navigate('/')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 ${
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
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 ${
              currentPath === '/hub-bairros'
                ? 'bg-[#C8102E] text-white shadow-sm'
                : 'bg-rose-50 text-[#C8102E] hover:bg-rose-100 border border-rose-200/60'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            Hub de Bairros (Exclusivo Londrina)
          </button>

          <button
            type="button"
            onClick={() => navigate('/busca')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 ${
              currentPath === '/busca'
                ? 'bg-[#C8102E] text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            Busca por Proximidade
          </button>

          <button
            type="button"
            onClick={() => navigate('/comparador-precos')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 ${
              currentPath === '/comparador-precos'
                ? 'bg-[#C8102E] text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Radar className="w-3.5 h-3.5" />
            Radar de Preços nos Bairros
          </button>

          <button
            type="button"
            onClick={() => navigate('/inteligencia-economica')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 ${
              currentPath === '/inteligencia-economica'
                ? 'bg-slate-900 text-amber-400 shadow-sm'
                : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-300/80'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-[#C8102E]" />
            Mapa de Calor • Secretaria de Desenv. Econômico
          </button>

          <button
            type="button"
            onClick={() => navigate('/vendedor')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 ${
              currentPath === '/vendedor'
                ? 'bg-[#C8102E] text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            Painel do Comerciante
          </button>

          <button
            type="button"
            onClick={() => navigate('/admin')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 ${
              currentPath === '/admin'
                ? 'bg-[#C8102E] text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Gestão Municipal (Admin)
          </button>
        </nav>
      </div>
    </header>
  );
};

