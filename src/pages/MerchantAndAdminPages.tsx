import React, { useState } from 'react';
import {
  Store,
  Package,
  ShoppingBag,
  TrendingUp,
  Plus,
  CheckCircle2,
  MapPin,
  ShieldCheck,
  Footprints,
  Truck,
  Flame,
  Users,
  Building2,
  ArrowRight,
} from 'lucide-react';
import { useLondrinaApp } from '../context/LondrinaAppContext';
import { CONTAS_LONDRINAGO } from '../data/londrinaSeed';

// ============================================================================
// 1. PAINEL DO COMERCIANTE DE BAIRRO (/vendedor)
// ============================================================================
export const MerchantDashboardPage: React.FC = () => {
  const {
    allStores,
    allProducts,
    addNewProduct,
    orders,
    updateOrderStatus,
    navigate,
  } = useLondrinaApp();

  const merchantStore = allStores[0]; // Empório & Café Terra Vermelha (Vila Casoni)
  const storeProducts = allProducts.filter((p) => p.storeId === merchantStore.id);

  const [showNewModal, setShowNewModal] = useState(false);
  const [nomeProd, setNomeProd] = useState('');
  const [precoProd, setPrecoProd] = useState('29.90');
  const [precoPromo, setPrecoPromo] = useState('24.90');
  const [unidadeProd, setUnidadeProd] = useState('unidade');
  const [descProd, setDescProd] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomeProd.trim()) return;
    addNewProduct({
      nome: nomeProd,
      descricao:
        descProd ||
        'Produto fresquinho disponível a 2 quadras da sua casa na Vila Casoni.',
      preco: parseFloat(precoProd) || 29.9,
      precoPromocional: parseFloat(precoPromo) || undefined,
      unidade: unidadeProd,
      categoria: 'Restaurantes & Cafés',
      categoriaSlug: 'restaurantes',
      imagemUrl:
        'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
      estoque: 35,
      destaqueBairro: true,
      disponivelRetiradaImediata: true,
      tempoPreparoMin: 10,
      storeId: merchantStore.id,
    });
    setNomeProd('');
    setDescProd('');
    setShowNewModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Cabeçalho do Lojista */}
      <div className="bg-gradient-to-r from-[#8B0A1E] via-[#C8102E] to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={merchantStore.logoUrl}
            alt={merchantStore.nome}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-amber-400"
          />
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                Portal do Lojista • LondrinaGO PJ
              </span>
              <span className="text-xs text-rose-200 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                CNPJ {merchantStore.cnpj} • Alvará SEI Ativo
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">{merchantStore.nome}</h1>
            <p className="text-xs text-rose-100 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-300" />
              {merchantStore.endereco} • Hub do Bairro:{' '}
              <strong>{merchantStore.bairroNome}</strong>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setShowNewModal(true)}
            className="px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-lg flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Cadastrar Produto no Bairro
          </button>
          <button
            type="button"
            onClick={() => navigate(`/loja/${merchantStore.slug}`)}
            className="px-4 py-3 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs border border-white/25"
          >
            Ver Minha Vitrine Pública
          </button>
        </div>
      </div>

      {/* KPIs de Visibilidade Hiperlocal no Bairro */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <span className="text-xs font-bold text-slate-500 block">
            Alcance no Hub Vila Casoni (Raio 4 Quadras)
          </span>
          <span className="text-2xl font-black text-[#C8102E] block mt-1">
            4.820 vizinhos
          </span>
          <span className="text-[11px] text-emerald-600 font-bold">
            +64% de descoberta sem ir ao Centro
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <span className="text-xs font-bold text-slate-500 block">
            Pedidos no Mês
          </span>
          <span className="text-2xl font-black text-slate-900 block mt-1">
            {merchantStore.pedidosMes} pedidos
          </span>
          <span className="text-[11px] text-slate-500">
            Ticket médio: R$ 64,50
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <span className="text-xs font-bold text-slate-500 block">
            Retirada Presencial (A Pé) vs. Entrega
          </span>
          <span className="text-2xl font-black text-emerald-700 block mt-1">
            {merchantStore.vendasPresenciaisPct}% / {merchantStore.vendasEntregaPct}%
          </span>
          <span className="text-[11px] text-slate-500">
            Maioria busca caminhando em 2 quadras
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <span className="text-xs font-bold text-slate-500 block">
            Faturamento Retido no Bairro
          </span>
          <span className="text-2xl font-black text-slate-900 block mt-1">
            R$ 54.502,00
          </span>
          <span className="text-[11px] text-emerald-600 font-bold">
            Taxa 0% Prefeitura de Londrina
          </span>
        </div>
      </div>

      {/* Modal de Novo Produto */}
      {showNewModal && (
        <div className="bg-rose-50/70 border-2 border-[#C8102E] rounded-3xl p-6 space-y-4">
          <h3 className="text-lg font-black text-slate-900">
            Novo Produto com Prioridade no Hub da Vila Casoni
          </h3>
          <form onSubmit={handleAddSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nome do Produto
              </label>
              <input
                type="text"
                value={nomeProd}
                onChange={(e) => setNomeProd(e.target.value)}
                placeholder="Ex: Pão de Queijo Recheado com Goiabada (Forno Agora)"
                className="w-full rounded-xl border-slate-300 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Unidade
              </label>
              <input
                type="text"
                value={unidadeProd}
                onChange={(e) => setUnidadeProd(e.target.value)}
                className="w-full rounded-xl border-slate-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Preço Normal (R$)
              </label>
              <input
                type="number"
                step="0.01"
                value={precoProd}
                onChange={(e) => setPrecoProd(e.target.value)}
                className="w-full rounded-xl border-slate-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Preço Promocional Vizinhança (R$)
              </label>
              <input
                type="number"
                step="0.01"
                value={precoPromo}
                onChange={(e) => setPrecoPromo(e.target.value)}
                className="w-full rounded-xl border-slate-300 text-sm"
              />
            </div>
            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#C8102E] text-white font-black text-xs"
              >
                Publicar no Hub do Bairro
              </button>
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Gestão de Pedidos da Vizinhança & Catálogo */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Pedidos Recebidos */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
          <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#C8102E]" />
            Fila de Pedidos dos Moradores Próximos
          </h2>

          <div className="space-y-3">
            {orders.map((order) => (
              <div
                key={order.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-black text-xs bg-slate-900 text-amber-400 px-2.5 py-0.5 rounded">
                    {order.codigo} • {order.clienteNome}
                  </span>
                  <span className="text-xs font-black text-[#C8102E]">
                    R$ {order.valorTotal.toFixed(2).replace('.', ',')}
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  {order.itens.map((i) => `${i.qtd}x ${i.nome}`).join(', ')}
                </p>
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/70">
                  <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                    {order.modalidade.includes('Presencial') ? (
                      <Footprints className="w-3.5 h-3.5" />
                    ) : (
                      <Truck className="w-3.5 h-3.5" />
                    )}
                    {order.modalidade}
                  </span>

                  <select
                    value={order.status}
                    onChange={(e) =>
                      updateOrderStatus(order.id, e.target.value as any)
                    }
                    className="rounded-lg border-slate-300 text-xs font-bold text-slate-800 py-1"
                  >
                    <option value="Em separação">Em separação</option>
                    <option value="Pronto para retirada (a 2 quadras)">
                      Pronto para retirada (a 2 quadras)
                    </option>
                    <option value="Saiu para entrega">Saiu para entrega</option>
                    <option value="Entregue / Retirado">Entregue / Retirado</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Catálogo Ativo */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
          <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-[#C8102E]" />
            Meus Produtos Ativos no Hub ({storeProducts.length})
          </h2>

          <div className="space-y-3">
            {storeProducts.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between gap-3 p-3 rounded-2xl border border-slate-200"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={p.imagemUrl}
                    alt={p.nome}
                    className="w-14 h-14 rounded-xl object-cover"
                  />
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-900">
                      {p.nome}
                    </h4>
                    <span className="text-xs font-bold text-[#C8102E]">
                      R$ {(p.precoPromocional ?? p.preco).toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-[11px] text-slate-500 ml-2">
                      • Estoque: {p.estoque} un.
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full shrink-0">
                  Priorizado no Bairro
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 2. PAINEL DE GESTÃO MUNICIPAL ADMIN (/admin)
// ============================================================================
export const AdminDashboardPage: React.FC = () => {
  const { allStores, allProducts, bairros, navigate } = useLondrinaApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 bg-[#C8102E] text-white px-3 py-1 rounded-full text-xs font-black uppercase">
            <Building2 className="w-4 h-4" />
            Administração Municipal • Prefeitura de Londrina
          </span>
          <h1 className="text-2xl sm:text-3xl font-black">
            Central de Governança do Shopping Digital de Londrina
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Gerenciamento de comércios credenciados via LondrinaGO, monitoramento dos Hubs de Bairros e integração com o Observatório da Secretaria de Desenvolvimento Econômico (SDE / CODEL).
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/inteligencia-economica')}
          className="px-5 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-lg flex items-center gap-2 shrink-0"
        >
          <Flame className="w-4 h-4 text-[#C8102E]" />
          Abrir Mapa de Calor SDE / CODEL
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Resumo Geral */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <span className="text-xs font-bold text-slate-500">Polos / Hubs de Bairros</span>
          <span className="text-3xl font-black text-[#C8102E] block mt-1">
            {bairros.length} Regiões
          </span>
          <span className="text-[11px] text-slate-500">Norte, Sul, Leste, Oeste e Centro</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <span className="text-xs font-bold text-slate-500">Lojas Demonstração Ativas</span>
          <span className="text-3xl font-black text-slate-900 block mt-1">
            {allStores.length} Lojas (731 na base)
          </span>
          <span className="text-[11px] text-emerald-600 font-bold">100% Verificadas LondrinaGO</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <span className="text-xs font-bold text-slate-500">Produtos Semeados</span>
          <span className="text-3xl font-black text-slate-900 block mt-1">
            {allProducts.length} SKUs
          </span>
          <span className="text-[11px] text-slate-500">Indexados por geolocalização</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <span className="text-xs font-bold text-slate-500">Contas LondrinaGO Seed</span>
          <span className="text-3xl font-black text-emerald-700 block mt-1">
            {CONTAS_LONDRINAGO.length} Perfis
          </span>
          <span className="text-[11px] text-slate-500">Admin, Cidadão e Comerciante</span>
        </div>
      </div>

      {/* Tabela de Lojas Credenciadas por Bairro */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
          <Store className="w-5 h-5 text-[#C8102E]" />
          Comércios Credenciados nos Bairros de Londrina
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase">
                <th className="py-3 px-3">Estabelecimento</th>
                <th className="py-3 px-3">Bairro / Zona</th>
                <th className="py-3 px-3">CNPJ / LondrinaGO</th>
                <th className="py-3 px-3">Presencial vs. Entrega</th>
                <th className="py-3 px-3">Pedidos/Mês</th>
                <th className="py-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allStores.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50">
                  <td className="py-3 px-3 font-black text-slate-900">{s.nome}</td>
                  <td className="py-3 px-3 font-semibold text-[#C8102E]">
                    {s.bairroNome} ({s.zona})
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-600">{s.cnpj}</td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-emerald-700">
                      {s.vendasPresenciaisPct}% Pres.
                    </span>{' '}
                    / {s.vendasEntregaPct}% Ent.
                  </td>
                  <td className="py-3 px-3 font-bold">{s.pedidosMes}</td>
                  <td className="py-3 px-3">
                    <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full text-[10px]">
                      Alvará Ativo
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

