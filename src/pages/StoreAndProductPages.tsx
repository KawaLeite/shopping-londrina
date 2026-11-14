import React, { useState } from 'react';
import {
  MapPin,
  Star,
  Clock,
  ShieldCheck,
  Footprints,
  Truck,
  ShoppingBag,
  ArrowLeft,
  CheckCircle2,
  Trash2,
  Plus,
  Minus,
  Ticket,
  CreditCard,
  QrCode,
  Sparkles,
  User,
} from 'lucide-react';
import { useLondrinaApp } from '../context/LondrinaAppContext';
import { ProductCard } from '../components/ProductCard';
import { CUPONS_LONDRINA } from '../data/londrinaSeed';

// ============================================================================
// 1. PÁGINA DA LOJA (/loja/:slug)
// ============================================================================
export const StoreProfilePage: React.FC<{ slug: string }> = ({ slug }) => {
  const { storesWithProximity, productsWithProximity, navigate } = useLondrinaApp();
  const store =
    storesWithProximity.find((s) => s.slug === slug) || storesWithProximity[0];
  const storeProducts = productsWithProximity.filter((p) => p.storeId === store.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <button
        type="button"
        onClick={() => navigate('/')}
        className="text-xs font-extrabold text-slate-600 hover:text-[#C8102E] flex items-center gap-1.5"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar para a Vitrine de Londrina
      </button>

      {/* Banner da Loja */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="relative h-52 sm:h-64 bg-slate-900">
          <img
            src={store.capaUrl}
            alt={store.nome}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <span className="bg-[#C8102E] text-white px-3 py-1 rounded-full text-xs font-black flex items-center gap-1 shadow">
              <MapPin className="w-3.5 h-3.5" />
              {store.proximity.badgeTexto}
            </span>
            {store.alvaraVerificadoLondrinaGo && (
              <span className="bg-slate-950/85 text-amber-300 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Alvará Verificado LondrinaGO • CNPJ {store.cnpj}
              </span>
            )}
          </div>
        </div>

        <div className="p-4 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-5 sm:gap-6">
          <div className="flex flex-col sm:flex-row items-start gap-3.5 sm:gap-4">
            <img
              src={store.logoUrl}
              alt={store.nome}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-4 border-white shadow-lg -mt-10 sm:-mt-12 bg-white shrink-0 relative z-10"
            />
            <div className="space-y-1">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#C8102E]">
                {store.segmento} • {store.bairroNome} ({store.zona})
              </span>
              <h1 className="text-xl sm:text-3xl font-black text-slate-900">
                {store.nome}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
                {store.descricao}
              </p>
              <p className="text-xs font-bold text-slate-700 pt-1">
                📍 {store.endereco} ({store.quadraReferencia}) • 🕒 {store.horarioFuncionamento}
              </p>
            </div>
          </div>

          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 space-y-2 shrink-0 lg:w-80">
            <div className="text-xs font-black text-[#9B0B22] flex items-center gap-1.5">
              <Footprints className="w-4 h-4 text-[#C8102E]" />
              Vantagem Hub do Bairro:
            </div>
            <p className="text-xs text-slate-700 font-semibold">
              {store.descontoRetiradaBairro || 'Retire em poucos minutos caminhando no seu bairro!'}
            </p>
            <div className="flex items-center justify-between text-xs pt-2 border-t border-rose-200/70">
              <span className="font-black text-amber-600 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {store.nota.toFixed(1)} ({store.avaliacoes})
              </span>
              <span className="font-bold text-slate-600 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {store.tempoEntrega}
              </span>
              <span className="font-extrabold text-emerald-700">
                {store.taxaEntrega === 0 ? 'Entrega Grátis' : `R$ ${store.taxaEntrega.toFixed(2)}`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Catálogo da Loja */}
      <div className="space-y-4">
        <h2 className="text-xl font-black text-slate-900">
          Produtos Disponíveis em {store.nome} ({storeProducts.length})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {storeProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 2. PÁGINA DO PRODUTO (/produto/:id)
// ============================================================================
export const ProductDetailPage: React.FC<{ id: number }> = ({ id }) => {
  const { productsWithProximity, addToCart, navigate } = useLondrinaApp();
  const product =
    productsWithProximity.find((p) => p.id === id) || productsWithProximity[0];
  const [qty, setQty] = useState(1);

  const finalPrice = product.precoPromocional ?? product.preco;
  const related = productsWithProximity
    .filter((p) => p.id !== product.id && p.categoriaSlug === product.categoriaSlug)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <button
        type="button"
        onClick={() => navigate('/')}
        className="text-xs font-extrabold text-slate-600 hover:text-[#C8102E] flex items-center gap-1.5"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar para os Produtos
      </button>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5">
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 h-80 sm:h-96">
            <img
              src={product.imagemUrl}
              alt={product.nome}
              className="w-full h-full object-cover"
            />
            <span className="absolute top-3 left-3 bg-[#C8102E] text-white text-xs font-black px-3 py-1.5 rounded-full flex items-center gap-1 shadow">
              <MapPin className="w-3.5 h-3.5" />
              {product.proximity.badgeTexto}
            </span>
          </div>
        </div>

        <div className="lg:col-span-7 flex flex-col justify-between space-y-5">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#C8102E] bg-rose-50 px-3 py-1 rounded-full">
                {product.categoria}
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full flex items-center gap-1">
                <Footprints className="w-3.5 h-3.5" />
                Pronto em {product.tempoPreparoMin} min • A {product.proximity.quadrasEstimadas} quadras
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              {product.nome}
            </h1>

            <p className="text-sm text-slate-600 leading-relaxed">
              {product.descricao}
            </p>

            {/* Card da Loja Vendedora */}
            <div
              onClick={() => navigate(`/loja/${product.store.slug}`)}
              className="bg-slate-50 hover:bg-rose-50/50 border border-slate-200 rounded-2xl p-4 cursor-pointer transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <img
                  src={product.store.logoUrl}
                  alt={product.store.nome}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-300"
                />
                <div>
                  <div className="text-xs font-black text-slate-900 flex items-center gap-1">
                    {product.store.nome}
                    <CheckCircle2 className="w-4 h-4 text-[#C8102E]" />
                  </div>
                  <div className="text-xs text-slate-500">
                    {product.store.endereco} • {product.store.bairroNome}
                  </div>
                </div>
              </div>
              <span className="text-xs font-extrabold text-[#C8102E]">
                Ver loja →
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <div>
              {product.precoPromocional && (
                <span className="text-sm text-slate-400 line-through block">
                  De R$ {product.preco.toFixed(2).replace('.', ',')}
                </span>
              )}
              <span className="text-3xl font-black text-[#C8102E]">
                R$ {finalPrice.toFixed(2).replace('.', ',')}
              </span>
              <span className="text-xs text-slate-500 block">
                por {product.unidade} • Estoque local: {product.estoque} un.
              </span>
            </div>

            <div className="flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
              <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden shrink-0">
                <button
                  type="button"
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="p-2.5 hover:bg-slate-100"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-3.5 sm:px-4 font-black text-sm">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty(qty + 1)}
                  className="p-2.5 hover:bg-slate-100"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  addToCart(product, qty);
                  navigate('/carrinho');
                }}
                className="flex-1 sm:flex-initial justify-center px-5 sm:px-6 py-3 rounded-xl bg-[#C8102E] hover:bg-[#9B0B22] text-white font-black text-xs sm:text-sm shadow-lg flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4 shrink-0" />
                Comprar no Meu Bairro
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Relacionados */}
      <div className="space-y-4">
        <h2 className="text-lg font-black text-slate-900">
          Outros Produtos Próximos de Você
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {related.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 3. PÁGINA DO CARRINHO & CHECKOUT (/carrinho e /checkout)
// ============================================================================
export const CartAndCheckoutPage: React.FC = () => {
  const {
    cart,
    updateCartQty,
    removeFromCart,
    cartTotal,
    appliedCouponCode,
    applyCoupon,
    discountAmount,
    placeOrder,
    selectedBairro,
    currentUser,
    navigate,
  } = useLondrinaApp();

  const [couponInput, setCouponInput] = useState(appliedCouponCode || '');
  const [modalidade, setModalidade] = useState<
    'Retirada no Bairro (Presencial)' | 'Entrega Rápida Local'
  >('Retirada no Bairro (Presencial)');
  const [pagamento, setPagamento] = useState('PIX LondrinaGO (Cashback Pé-Vermelho)');
  const [completedOrder, setCompletedOrder] = useState<any | null>(null);

  const handleCheckout = () => {
    const order = placeOrder(modalidade, pagamento);
    if (order) {
      setCompletedOrder(order);
    }
  };

  if (completedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl border-2 border-emerald-500 p-8 text-center space-y-5 shadow-xl">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <span className="bg-emerald-50 text-emerald-800 text-xs font-black px-3 py-1 rounded-full">
            PEDIDO CONFIRMADO NO HUB DE BAIRROS • {completedOrder.codigo}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Compra Realizada no Comércio do Seu Bairro!
          </h1>
          <p className="text-sm text-slate-600 max-w-xl mx-auto">
            Seu pedido em <strong>{completedOrder.storeNome}</strong> ({completedOrder.storeBairro}) já foi recebido. Além de economizar tempo e deslocamento, esta compra foi contabilizada anonimamente no <strong>Mapa de Calor da Secretaria de Desenvolvimento Econômico de Londrina</strong>.
          </p>

          <div className="bg-slate-50 rounded-2xl p-4 text-left text-xs space-y-1.5 border border-slate-200 max-w-md mx-auto">
            <div className="flex justify-between">
              <span className="text-slate-500">Modalidade Escolhida:</span>
              <strong className="text-[#C8102E]">{completedOrder.modalidade}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Status Atual:</span>
              <strong className="text-emerald-700">{completedOrder.status}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Total Pago:</span>
              <strong className="text-slate-900">
                R$ {completedOrder.valorTotal.toFixed(2).replace('.', ',')}
              </strong>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/conta')}
              className="px-5 py-2.5 rounded-xl bg-[#C8102E] text-white font-black text-xs"
            >
              Acompanhar Meus Pedidos
            </button>
            <button
              type="button"
              onClick={() => navigate('/inteligencia-economica')}
              className="px-5 py-2.5 rounded-xl bg-slate-900 text-amber-400 font-black text-xs"
            >
              Ver Impacto no Mapa de Calor SDE
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <span className="text-xs font-extrabold uppercase tracking-wider text-[#C8102E]">
          Sacola Hiperlocal • Shopping Digital de Londrina
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          Finalizar Compra no Comércio de {selectedBairro.nome}
        </h1>
      </div>

      {cart.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
          <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
          <h2 className="text-lg font-black text-slate-800">Sua sacola está vazia</h2>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-5 py-2.5 rounded-xl bg-[#C8102E] text-white text-xs font-extrabold"
          >
            Explorar Produtos do Meu Bairro
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Lista de Itens e Escolha de Modalidade (Presencial vs Entrega) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Seletor Presencial vs Entrega (Alimenta estatísticas SDE) */}
            <div className="bg-white rounded-3xl border border-slate-200 p-5 space-y-3">
              <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C8102E]" />
                1. Como deseja receber no seu bairro ({selectedBairro.nome})?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setModalidade('Retirada no Bairro (Presencial)')}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${
                    modalidade === 'Retirada no Bairro (Presencial)'
                      ? 'border-[#C8102E] bg-rose-50/50'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                      <Footprints className="w-4 h-4 text-[#C8102E]" />
                      Retirada Presencial (A Pé)
                    </span>
                    <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                      GRÁTIS
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Retire caminhando a 2 quadras da sua casa em 10 min e ganhe brinde/desconto vizinhança.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setModalidade('Entrega Rápida Local')}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${
                    modalidade === 'Entrega Rápida Local'
                      ? 'border-[#C8102E] bg-rose-50/50'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-[#C8102E]" />
                      Entrega Expressa no Bairro
                    </span>
                    <span className="text-[10px] font-black bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                      15-25 MIN
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Entregador local do próprio bairro leva até o seu portão ou condomínio.
                  </p>
                </button>
              </div>
            </div>

            {/* Itens da Sacola */}
            <div className="bg-white rounded-3xl border border-slate-200 p-5 space-y-4">
              <h2 className="text-sm font-black text-slate-900">
                2. Produtos Selecionados ({cart.length})
              </h2>
              {cart.map((item) => {
                const price = item.product.precoPromocional ?? item.product.preco;
                return (
                  <div
                    key={item.product.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-slate-100 pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={item.product.imagemUrl}
                        alt={item.product.nome}
                        className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold text-[#C8102E] block truncate">
                          {item.store.nome} • {item.store.bairroNome}
                        </span>
                        <h3 className="text-xs sm:text-sm font-black text-slate-900 line-clamp-2">
                          {item.product.nome}
                        </h3>
                        <span className="text-xs font-extrabold text-slate-700">
                          R$ {price.toFixed(2).replace('.', ',')} / {item.product.unidade}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 self-end sm:self-auto shrink-0">
                      <button
                        type="button"
                        onClick={() => updateCartQty(item.product.id, item.quantity - 1)}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-black w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateCartQty(item.product.id, item.quantity + 1)}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Resumo Financeiro + Cupom + Pagamento */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
            <h2 className="text-base font-black text-slate-900">
              Resumo do Pedido Municipal
            </h2>

            {/* Cupom */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 flex items-center gap-1">
                <Ticket className="w-3.5 h-3.5 text-[#C8102E]" />
                Cupom de Incentivo de Bairro
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Ex: BAIRROFORTE15"
                  className="flex-1 rounded-xl border-slate-300 text-xs font-bold uppercase"
                />
                <button
                  type="button"
                  onClick={() => applyCoupon(couponInput)}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
                >
                  Aplicar
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {CUPONS_LONDRINA.map((c) => (
                  <button
                    key={c.codigo}
                    type="button"
                    onClick={() => {
                      setCouponInput(c.codigo);
                      applyCoupon(c.codigo);
                    }}
                    className="text-[10px] font-bold bg-rose-50 text-[#C8102E] border border-rose-200 px-2 py-0.5 rounded-md"
                  >
                    {c.codigo} (-R$ {c.descontoReais})
                  </button>
                ))}
              </div>
            </div>

            {/* Forma de Pagamento */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 block">
                Forma de Pagamento
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPagamento('PIX LondrinaGO (Cashback Pé-Vermelho)')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 ${
                    pagamento.includes('PIX')
                      ? 'border-[#C8102E] bg-rose-50 text-[#C8102E]'
                      : 'border-slate-200 text-slate-700'
                  }`}
                >
                  <QrCode className="w-4 h-4" />
                  PIX Instantâneo
                </button>
                <button
                  type="button"
                  onClick={() => setPagamento('Cartão de Crédito / Débito Local')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 ${
                    pagamento.includes('Cartão')
                      ? 'border-[#C8102E] bg-rose-50 text-[#C8102E]'
                      : 'border-slate-200 text-slate-700'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  Cartão / Balcão
                </button>
              </div>
            </div>

            {/* Valores */}
            <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal dos Produtos:</span>
                <strong>R$ {cartTotal.toFixed(2).replace('.', ',')}</strong>
              </div>
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Taxa de Entrega / Retirada no Bairro:</span>
                <strong>GRÁTIS (Vizinhança)</strong>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-[#C8102E] font-bold">
                  <span>Desconto Cupom ({appliedCouponCode}):</span>
                  <strong>- R$ {discountAmount.toFixed(2).replace('.', ',')}</strong>
                </div>
              )}
              <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>Total a Pagar:</span>
                <span className="text-[#C8102E]">
                  R$ {Math.max(0, cartTotal - discountAmount).toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>

            {currentUser && (
              <div className="bg-slate-50 rounded-xl p-3 text-[11px] text-slate-600 border border-slate-200">
                Autenticado via <strong>LondrinaGO</strong> como{' '}
                <strong>{currentUser.name}</strong> (CPF {currentUser.cpf}).
              </div>
            )}

            <button
              type="button"
              onClick={handleCheckout}
              className="w-full py-3.5 rounded-xl bg-[#C8102E] hover:bg-[#9B0B22] text-white font-black text-sm shadow-lg transition-all"
            >
              Confirmar Pedido no Comércio do Bairro
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 4. PÁGINA DA CONTA DO CIDADÃO (/conta)
// ============================================================================
export const CitizenAccountPage: React.FC = () => {
  const { currentUser, orders, selectedBairro, navigate } = useLondrinaApp();

  if (!currentUser) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12 text-center space-y-4">
        <h2 className="text-xl font-black">Acesse sua conta LondrinaGO</h2>
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="px-5 py-2.5 rounded-xl bg-[#C8102E] text-white font-bold text-xs"
        >
          Ir para o Login Único LondrinaGO
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-20 h-20 rounded-2xl object-cover border-2 border-[#C8102E]"
          />
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1 bg-rose-50 text-[#C8102E] text-xs font-black px-2.5 py-0.5 rounded-full">
              <User className="w-3.5 h-3.5" />
              Identidade LondrinaGO • {currentUser.role.toUpperCase()}
            </span>
            <h1 className="text-2xl font-black text-slate-900">{currentUser.name}</h1>
            <p className="text-xs text-slate-600">
              CPF: <strong>{currentUser.cpf}</strong> • E-mail: <strong>{currentUser.email}</strong>
            </p>
            <p className="text-xs text-emerald-700 font-semibold">
              {currentUser.nivelLondrinaGo} • Bairro Vinculado: {selectedBairro.nome}
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#C8102E] to-[#88091E] text-white rounded-2xl p-4 text-center min-w-[200px]">
          <span className="text-[10px] uppercase font-bold text-amber-300 block">
            Programa Nota Londrina / Cashback
          </span>
          <span className="text-2xl font-black block mt-0.5">
            {currentUser.pontosPeVermelho} pts
          </span>
          <span className="text-[11px] text-rose-100">
            Pontos Pé-Vermelho Acumulados
          </span>
        </div>
      </div>

      {/* Histórico de Pedidos nos Bairros */}
      <div className="space-y-4">
        <h2 className="text-xl font-black text-slate-900">
          Histórico de Pedidos no Comércio de Londrina ({orders.length})
        </h2>
        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono font-black text-xs bg-slate-900 text-amber-400 px-2.5 py-0.5 rounded">
                    {order.codigo}
                  </span>
                  <span className="text-xs font-bold text-slate-500">{order.dataHora}</span>
                  <span className="text-xs font-extrabold text-[#C8102E] bg-rose-50 px-2.5 py-0.5 rounded-full">
                    {order.modalidade}
                  </span>
                </div>
                <h3 className="text-sm font-black text-slate-900">
                  {order.storeNome} ({order.storeBairro})
                </h3>
                <p className="text-xs text-slate-600">
                  {order.itens.map((i) => `${i.qtd}x ${i.nome}`).join(' • ')}
                </p>
              </div>

              <div className="text-left sm:text-right shrink-0">
                <span className="inline-block text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full mb-1">
                  {order.status}
                </span>
                <div className="text-base font-black text-slate-900">
                  R$ {order.valorTotal.toFixed(2).replace('.', ',')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

