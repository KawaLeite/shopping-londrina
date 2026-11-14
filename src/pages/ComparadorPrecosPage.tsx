import React, { useState } from 'react';
import { Radar, MapPin, ShoppingBag, Sparkles, Footprints, CheckCircle2 } from 'lucide-react';
import { useLondrinaApp } from '../context/LondrinaAppContext';

const FAMILIAS_COMPARACAO = [
  {
    sku: 'arroz-5kg',
    titulo: 'Arroz Branco Tipo 1 (Pacote 5kg)',
    descricao: 'Compare o preço e a distância em quadras entre mercados de bairro de Londrina',
  },
  {
    sku: 'cafe-500g-londrina',
    titulo: 'Café Especial Pé-Vermelho Torrado (500g)',
    descricao: 'Torrefações e empórios locais nos bairros de Londrina',
  },
  {
    sku: 'cesta-hortifruti',
    titulo: 'Cesta Hortifruti Familiar Semanal (6,5kg a 7kg)',
    descricao: 'Direto do Ceasa Londrina e produtores da Zona Sul',
  },
  {
    sku: 'kit-churrasco',
    titulo: 'Kit Churrasco Completo Fim de Semana',
    descricao: 'Açougues de vizinhança na Zona Norte e Zona Oeste',
  },
  {
    sku: 'vitamina-c-zinco',
    titulo: 'Kit Imunidade Vitamina C 1g + Zinco (30 comp)',
    descricao: 'Farmácias de bairro com pronta entrega',
  },
];

export const ComparadorPrecosPage: React.FC = () => {
  const { selectedBairro, productsWithProximity, addToCart } = useLondrinaApp();
  const [selectedSku, setSelectedSku] = useState('arroz-5kg');

  const comparedItems = productsWithProximity
    .filter((p) => p.skuFamilia === selectedSku)
    .sort((a, b) => {
      // Sort by Total Real Cost (Product Price + Displacement Cost if outside neighborhood)
      const priceA = a.precoPromocional ?? a.preco;
      const priceB = b.precoPromocional ?? b.preco;
      const realCostA = a.proximity.isSameBairro ? priceA : priceA + 8.5;
      const realCostB = b.proximity.isSameBairro ? priceB : priceB + 8.5;
      return realCostA - realCostB;
    });

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-6 sm:space-y-8">
      <div className="bg-gradient-to-r from-slate-900 via-[#8B0A1E] to-[#C8102E] rounded-3xl p-5 sm:p-8 text-white shadow-xl">
        <div className="max-w-3xl space-y-2">
          <span className="inline-flex items-center gap-1.5 bg-amber-400 text-slate-950 px-3 py-1 rounded-full text-[10px] sm:text-xs font-black uppercase">
            <Radar className="w-4 h-4 shrink-0" />
            <span>Radar de Preços Hiperlocal • Compra +Inteligente</span>
          </span>
          <h1 className="text-xl sm:text-3xl font-black leading-tight">
            Compare Preço + Economia de Deslocamento no Seu Bairro
          </h1>
          <p className="text-xs sm:text-sm text-rose-100">
            Muitas vezes o cidadão atravessa Londrina para economizar R$ 1,00 e gasta R$ 15,00 de combustível ou ônibus. Nosso Radar calcula o <strong>Custo Real Total</strong> priorizando o seu bairro (<strong>{selectedBairro.nome}</strong>).
          </p>
        </div>
      </div>

      {/* Seletor de Produto para Comparar */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1 sm:flex-wrap">
        {FAMILIAS_COMPARACAO.map((f) => (
          <button
            key={f.sku}
            type="button"
            onClick={() => setSelectedSku(f.sku)}
            className={`px-3.5 sm:px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap shrink-0 ${
              selectedSku === f.sku
                ? 'bg-[#C8102E] text-white shadow-md'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-rose-50'
            }`}
          >
            {f.titulo}
          </button>
        ))}
      </div>

      {/* Tabela / Cards Comparativos */}
      <div className="space-y-4">
        {comparedItems.map((item, idx) => {
          const unitPrice = item.precoPromocional ?? item.preco;
          const displacementCost = item.proximity.isSameBairro
            ? 0
            : Number((item.proximity.distanceKm * 2.2).toFixed(2));
          const realCost = unitPrice + displacementCost;

          return (
            <div
              key={item.id}
              className={`bg-white rounded-2xl border-2 p-4 sm:p-5 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                idx === 0
                  ? 'border-[#C8102E] bg-rose-50/20 shadow-md'
                  : 'border-slate-200'
              }`}
            >
              <div className="flex items-start sm:items-center gap-3.5 sm:gap-4">
                <img
                  src={item.imagemUrl}
                  alt={item.nome}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-slate-200 shrink-0"
                />
                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    {idx === 0 && (
                      <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Sparkles className="w-3 h-3 shrink-0" />
                        MELHOR CUSTO-BENEFÍCIO REAL
                      </span>
                    )}
                    <span
                      className={`text-[10px] sm:text-[11px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                        item.proximity.isSameBairro
                          ? 'bg-[#C8102E] text-white'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      <MapPin className="w-3 h-3 shrink-0" />
                      <span className="truncate">{item.proximity.badgeTexto}</span>
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-black text-slate-900 leading-snug">
                    {item.nome}
                  </h3>
                  <p className="text-xs text-slate-600 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#C8102E] shrink-0" />
                    <span className="truncate">
                      {item.store.nome} • {item.store.endereco}
                    </span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-between lg:justify-end gap-3 sm:gap-5 border-t border-slate-100 lg:border-t-0 pt-3 lg:pt-0">
                <div className="text-left sm:text-right">
                  <span className="text-[11px] text-slate-500 block">Preço na Prateleira</span>
                  <span className="text-base sm:text-lg font-black text-slate-900">
                    R$ {unitPrice.toFixed(2).replace('.', ',')}
                  </span>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[11px] text-slate-500 block">Deslocamento</span>
                  {item.proximity.isSameBairro ? (
                    <span className="text-xs font-extrabold text-emerald-600 flex items-center gap-1">
                      <Footprints className="w-3.5 h-3.5 shrink-0" />
                      R$ 0,00 (A pé)
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-amber-700">
                      + R$ {displacementCost.toFixed(2).replace('.', ',')} ({item.proximity.distanceKm} km)
                    </span>
                  )}
                </div>

                <div className="text-left sm:text-right bg-slate-900 text-white px-3 py-2 rounded-xl">
                  <span className="text-[9px] sm:text-[10px] text-amber-300 uppercase font-bold block">
                    Custo Real p/ Bolso
                  </span>
                  <span className="text-sm sm:text-base font-black">
                    R$ {realCost.toFixed(2).replace('.', ',')}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => addToCart(item, 1)}
                  className=" justify-center px-4 py-2.5 rounded-xl bg-[#C8102E] hover:bg-[#9B0B22] text-white text-xs font-extrabold flex items-center gap-1.5"
                >
                  <ShoppingBag className="w-4 h-4 shrink-0" />
                  Comprar
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

