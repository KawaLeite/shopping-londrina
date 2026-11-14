import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import {
  Compass,
  MapPin,
  Footprints,
  Sparkles,
  CheckCircle2,
  Store,
  TrendingUp,
  Navigation,
  ShieldCheck,
} from 'lucide-react';
import { useLondrinaApp } from '../context/LondrinaAppContext';
import { ProductCard } from '../components/ProductCard';
import { StoreCard } from '../components/StoreCard';

export const HubBairrosPage: React.FC = () => {
  const {
    bairros,
    selectedBairro,
    setSelectedBairroId,
    algoritmoProximidadeAtivo,
    setAlgoritmoProximidadeAtivo,
    storesWithProximity,
    productsWithProximity,
  } = useLondrinaApp();

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapContainerRef.current, {
        center: [selectedBairro.lat, selectedBairro.lng],
        zoom: 15,
        scrollWheelZoom: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap • Hub de Bairros Londrina',
      }).addTo(mapInstanceRef.current);
    } else {
      mapInstanceRef.current.setView([selectedBairro.lat, selectedBairro.lng], 15);
    }

    const map = mapInstanceRef.current;
    // Clear existing non-tile layers
    map.eachLayer((layer) => {
      if (!(layer instanceof L.TileLayer)) {
        map.removeLayer(layer);
      }
    });

    // 4-block walking radius circle (~450m)
    L.circle([selectedBairro.lat, selectedBairro.lng], {
      radius: 480,
      color: '#C8102E',
      fillColor: '#C8102E',
      fillOpacity: 0.14,
      weight: 2,
      dashArray: '6 4',
    })
      .addTo(map)
      .bindPopup(
        `<b>Sua Vizinhança: ${selectedBairro.nome}</b><br/>Raio prioritário de 4 quadras (~450m)`
      );

    // Citizen home marker
    const homeIcon = L.divIcon({
      className: 'custom-home-marker',
      html: `<div style="background:#0F172A;color:#FBBF24;padding:5px 10px;border-radius:999px;font-weight:800;font-size:11px;border:2px solid #FBBF24;white-space:nowrap;box-shadow:0 4px 12px rgba(0,0,0,0.3);">🏠 Você (${selectedBairro.nome.split(' ')[0]})</div>`,
      iconSize: [140, 30],
      iconAnchor: [70, 15],
    });
    L.marker([selectedBairro.lat, selectedBairro.lng], { icon: homeIcon }).addTo(map);

    // Store markers
    storesWithProximity.forEach((store) => {
      const isLocal = store.proximity.isSameBairro;
      const storeIcon = L.divIcon({
        className: 'custom-store-marker',
        html: `<div style="background:${
          isLocal ? '#C8102E' : '#475569'
        };color:#FFFFFF;padding:4px 9px;border-radius:10px;font-weight:800;font-size:10px;border:2px solid #FFFFFF;white-space:nowrap;box-shadow:0 4px 10px rgba(0,0,0,0.25);">${
          isLocal ? `⭐ ${store.proximity.quadrasEstimadas} quadras` : `${store.proximity.distanceKm} km`
        } • ${store.nome.split(' ')[0]}</div>`,
        iconSize: [130, 26],
        iconAnchor: [65, 13],
      });

      L.marker([store.lat, store.lng], { icon: storeIcon })
        .addTo(map)
        .bindPopup(
          `<b>${store.nome}</b><br/>${store.endereco}<br/><span style="color:#C8102E;font-weight:bold;">${store.proximity.badgeTexto}</span>`
        );
    });
  }, [selectedBairro, storesWithProximity]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Cabeçalho do Hub de Bairros */}
      <div className="bg-gradient-to-br from-[#8B0A1E] via-[#C8102E] to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl border border-rose-400/20">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 bg-amber-400 text-slate-950 px-3 py-1 rounded-full text-xs font-black uppercase">
            <Compass className="w-4 h-4" />
            Inovação Exclusiva • Shopping Digital de Londrina
          </div>
          <h1 className="text-2xl sm:text-4xl font-black leading-tight">
            Hub de Bairros: Tornando Visível o Comércio a Duas Quadras da Sua Casa
          </h1>
          <p className="text-sm sm:text-base text-rose-100 leading-relaxed">
            Londrina possui mais de 580 mil habitantes distribuídos em grandes polos (Zona Norte, Sul, Leste, Oeste e Patrimônios). Nosso algoritmo geográfico prioriza automaticamente na vitrine inicial e nas buscas os produtos disponíveis no seu próprio bairro, evitando deslocamentos desnecessários ao Centro e mantendo a riqueza circulando na comunidade.
          </p>
        </div>
      </div>

      {/* Seletor de Bairro + Mapa Interativo de Raio de Quadras */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Lista de Bairros */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Navigation className="w-4 h-4 text-[#C8102E]" />
                Escolha seu Bairro em Londrina
              </h2>
              <p className="text-xs text-slate-500">
                Veja o algoritmo reordenar vitrines e distâncias em quadras
              </p>
            </div>
            <button
              type="button"
              onClick={() => setAlgoritmoProximidadeAtivo(!algoritmoProximidadeAtivo)}
              className={`px-3 py-1 rounded-lg text-xs font-black ${
                algoritmoProximidadeAtivo
                  ? 'bg-[#C8102E] text-white'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {algoritmoProximidadeAtivo ? 'Algoritmo ON' : 'Algoritmo OFF'}
            </button>
          </div>

          <div className="space-y-2">
            {bairros.map((b) => {
              const active = b.id === selectedBairro.id;
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setSelectedBairroId(b.id)}
                  className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center justify-between ${
                    active
                      ? 'bg-rose-50/90 border-[#C8102E] ring-2 ring-[#C8102E]/20'
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-black text-slate-900">
                        {b.nome}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {b.zona}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {b.referencia} • {b.lojasAtivas} lojas • Crescimento +{b.crescimentoPosHub}%
                    </p>
                  </div>
                  {active && <CheckCircle2 className="w-5 h-5 text-[#C8102E] shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Mapa de Raio Hiperlocal + Indicadores do Bairro */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#C8102E]">
                  Georreferenciamento em Tempo Real
                </span>
                <h3 className="text-base font-black text-slate-900">
                  Raio de Caminhabilidade (2 a 4 Quadras) — {selectedBairro.nome}
                </h3>
              </div>
              <span className="text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1">
                <Footprints className="w-3.5 h-3.5" />
                Retirada a pé em 3 a 6 min
              </span>
            </div>

            <div
              ref={mapContainerRef}
              className="w-full h-80 rounded-2xl overflow-hidden border border-slate-200"
            />
          </div>

          {/* Diagnóstico de Descentralização daquele Bairro */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white rounded-2xl border border-slate-200 p-4">
              <span className="text-[11px] font-bold text-slate-500 block">
                Evasão Antes do Hub
              </span>
              <span className="text-2xl font-black text-rose-600">
                {selectedBairro.indiceInvisibilidadeAntesHub}%
              </span>
              <p className="text-[11px] text-slate-500 mt-1">
                iam ao Centro por desconhecer lojas vizinhas
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-4">
              <span className="text-[11px] font-bold text-slate-500 block">
                Aumento de Visibilidade Local
              </span>
              <span className="text-2xl font-black text-emerald-600">
                +{selectedBairro.crescimentoPosHub}%
              </span>
              <p className="text-[11px] text-slate-500 mt-1">
                em vendas para comércios de {selectedBairro.nome.split(' ')[0]}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-4">
              <span className="text-[11px] font-bold text-slate-500 block">
                Compra Presencial vs. Entrega
              </span>
              <span className="text-2xl font-black text-slate-900">
                {selectedBairro.percentualPresencial}% / {selectedBairro.percentualEntrega}%
              </span>
              <p className="text-[11px] text-slate-500 mt-1">
                Presencial no bairro vs. Delivery local
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Produtos Ordenados por Proximidade */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#C8102E]" />
            Produtos Priorizados para {selectedBairro.nome}
          </h2>
          <p className="text-xs text-slate-500">
            Itens disponíveis a poucas quadras aparecem no topo da listagem
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {productsWithProximity.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Lojas Ordenadas por Proximidade */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Store className="w-5 h-5 text-[#C8102E]" />
            Lojas do Hub de Bairros (Ordenadas por Menor Distância)
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {storesWithProximity.map((store) => (
            <StoreCard key={store.id} store={store} />
          ))}
        </div>
      </section>
    </div>
  );
};

