import React from 'react';
import { MapPin, ShoppingBag, Footprints, CheckCircle2, Sparkles } from 'lucide-react';
import { ProductWithProximity, useLondrinaApp } from '../context/LondrinaAppContext';

export const ProductCard: React.FC<{ product: ProductWithProximity }> = ({ product }) => {
  const { navigate, addToCart } = useLondrinaApp();
  const finalPrice = product.precoPromocional ?? product.preco;
  const discountPct = product.precoPromocional
    ? Math.round(((product.preco - product.precoPromocional) / product.preco) * 100)
    : 0;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 hover:border-[#C8102E] shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col overflow-hidden">
      {/* Badge Superior de Proximidade (Hub de Bairros) */}
      <div
        className={`px-3 py-1.5 text-[11px] font-extrabold flex items-center justify-between gap-1.5 ${
          product.proximity.isSameBairro
            ? 'bg-gradient-to-r from-[#C8102E] to-[#9B0B22] text-white'
            : product.proximity.isVizinhoProximo
            ? 'bg-amber-50 text-amber-900 border-b border-amber-200'
            : 'bg-slate-100 text-slate-700 border-b border-slate-200'
        }`}
      >
        <span className="flex items-center gap-1 min-w-0 flex-1">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{product.proximity.badgeTexto}</span>
        </span>
        {product.proximity.isSameBairro && (
          <span className="bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded text-[10px] font-black shrink-0">
            SEU BAIRRO
          </span>
        )}
      </div>

      {/* Imagem do Produto */}
      <div
        onClick={() => navigate(`/produto/${product.id}`)}
        className="relative h-44 bg-slate-100 cursor-pointer overflow-hidden"
      >
        <img
          src={product.imagemUrl}
          alt={product.nome}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {discountPct > 0 && (
          <span className="absolute top-2.5 left-2.5 bg-[#C8102E] text-white text-xs font-black px-2.5 py-1 rounded-lg shadow">
            -{discountPct}% OFF
          </span>
        )}
        {product.disponivelRetiradaImediata && (
          <span className="absolute bottom-2 left-2 bg-slate-950/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1">
            <Footprints className="w-3 h-3 text-amber-400" />
            Retire em {product.proximity.tempoCaminhadaMin} min a pé
          </span>
        )}
      </div>

      {/* Corpo do Card */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Loja e Bairro */}
          <button
            type="button"
            onClick={() => navigate(`/loja/${product.store.slug}`)}
            className="text-[11px] font-bold text-slate-500 hover:text-[#C8102E] flex items-center gap-1 mb-1 text-left"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-[#C8102E] shrink-0" />
            <span className="truncate">{product.store.nome}</span>
            <span className="text-slate-400">• {product.store.bairroNome.split(' ')[0]}</span>
          </button>

          <h3
            onClick={() => navigate(`/produto/${product.id}`)}
            className="text-sm font-extrabold text-slate-900 group-hover:text-[#C8102E] line-clamp-2 cursor-pointer transition-colors"
          >
            {product.nome}
          </h3>

          {product.proximity.isSameBairro && (
            <p className="mt-1.5 text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200/70 rounded-lg px-2 py-1 font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3 shrink-0" />
              Economize ~R$ {product.proximity.economiaDeslocamentoCentroReais.toFixed(2).replace('.', ',')} sem ir ao Centro
            </p>
          )}
        </div>

        {/* Preço e Botão de Compra */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-end justify-between gap-2">
          <div>
            {product.precoPromocional && (
              <span className="block text-xs text-slate-400 line-through">
                R$ {product.preco.toFixed(2).replace('.', ',')}
              </span>
            )}
            <span className="text-lg font-black text-[#C8102E]">
              R$ {finalPrice.toFixed(2).replace('.', ',')}
            </span>
            <span className="block text-[10px] text-slate-500">{product.unidade}</span>
          </div>

          <button
            type="button"
            onClick={() => addToCart(product, 1)}
            className="px-3 py-2 rounded-xl bg-[#C8102E] hover:bg-[#9B0B22] text-white text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
};

