import React from 'react';
import { MapPin, Star, Clock, ShieldCheck, Footprints, Truck } from 'lucide-react';
import { StoreWithProximity, useLondrinaApp } from '../context/LondrinaAppContext';

export const StoreCard: React.FC<{ store: StoreWithProximity }> = ({ store }) => {
  const { navigate } = useLondrinaApp();

  return (
    <div
      onClick={() => navigate(`/loja/${store.slug}`)}
      className="group bg-white rounded-2xl border border-slate-200/90 hover:border-[#C8102E] shadow-sm hover:shadow-xl transition-all duration-200 overflow-hidden cursor-pointer flex flex-col"
    >
      {/* Capa da Loja */}
      <div className="relative h-32 bg-slate-200 overflow-hidden">
        <img
          src={store.capaUrl}
          alt={store.nome}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent" />

        {/* Badge de Distância / Quadras */}
        <div
          className={`absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold flex items-center gap-1 shadow ${
            store.proximity.isSameBairro
              ? 'bg-[#C8102E] text-white'
              : 'bg-white/95 text-slate-900'
          }`}
        >
          <MapPin className="w-3 h-3" />
          {store.proximity.isSameBairro
            ? `A ${store.proximity.quadrasEstimadas} quadras (${store.proximity.distanceMeters}m)`
            : `${store.proximity.distanceKm} km • ${store.bairroNome.split(' ')[0]}`}
        </div>

        {/* Selo LondrinaGO */}
        {store.alvaraVerificadoLondrinaGo && (
          <div className="absolute top-2.5 right-2.5 bg-slate-950/80 backdrop-blur-sm text-amber-300 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            LondrinaGO PJ
          </div>
        )}

        {/* Logo e Nome sobrepostos */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-end gap-2.5">
          <img
            src={store.logoUrl}
            alt={store.nome}
            className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-md bg-white shrink-0"
          />
          <div className="min-w-0 text-white">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block">
              {store.segmento}
            </span>
            <h3 className="text-sm font-extrabold truncate leading-tight">
              {store.nome}
            </h3>
          </div>
        </div>
      </div>

      {/* Informações do Comércio de Bairro */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <p className="text-xs text-slate-600 font-medium flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#C8102E] shrink-0" />
            <span className="truncate">{store.endereco}</span>
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5 pl-4">
            {store.quadraReferencia}
          </p>
        </div>

        {store.descontoRetiradaBairro && (
          <div className="bg-rose-50 border border-rose-200/70 rounded-xl px-2.5 py-1.5 text-[11px] font-bold text-[#9B0B22] flex items-center gap-1.5">
            <Footprints className="w-3.5 h-3.5 text-[#C8102E] shrink-0" />
            <span className="line-clamp-1">{store.descontoRetiradaBairro}</span>
          </div>
        )}

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
          <span className="font-extrabold text-amber-600 flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            {store.nota.toFixed(1)} ({store.avaliacoes})
          </span>
          <span className="flex items-center gap-1 font-medium">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            {store.tempoEntrega}
          </span>
          <span className="font-bold text-emerald-700 flex items-center gap-1">
            <Truck className="w-3.5 h-3.5" />
            {store.taxaEntrega === 0 ? 'Grátis no Bairro' : `R$ ${store.taxaEntrega.toFixed(2).replace('.', ',')}`}
          </span>
        </div>
      </div>
    </div>
  );
};

