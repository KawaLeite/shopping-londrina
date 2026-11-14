import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import {
  Flame,
  Database,
  TrendingUp,
  TrendingDown,
  MapPin,
  Footprints,
  Truck,
  Download,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Building2,
  BarChart3,
  Layers,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts';
import {
  BAIRROS_LONDRINA,
  SEGMENTOS_EVIDENCIA_LONDRINA,
  BairroLondrina,
} from '../data/londrinaSeed';
import { toast } from 'sonner';

export const InteligenciaEconomicaPage: React.FC = () => {
  const [selectedArea, setSelectedArea] = useState<BairroLondrina>(BAIRROS_LONDRINA[0]);
  const [heatFilter, setHeatFilter] = useState<'intensidade' | 'presencial' | 'invisibilidade'>(
    'intensidade'
  );

  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<L.Map | null>(null);

  const sortedByActivity = [...BAIRROS_LONDRINA].sort(
    (a, b) => b.intensidadeComercial - a.intensidadeComercial
  );
  const mostActiveAreas = sortedByActivity.slice(0, 4);
  const leastActiveAreas = [...sortedByActivity].reverse().slice(0, 4);

  const altaEvidencia = SEGMENTOS_EVIDENCIA_LONDRINA.filter(
    (s) => s.statusEvidencia === 'Alta Evidência' || s.statusEvidencia === 'Média Evidência'
  );
  const baixaEvidencia = SEGMENTOS_EVIDENCIA_LONDRINA.filter(
    (s) => s.statusEvidencia === 'Baixa Evidência (Invisível nos Bairros)'
  );

  // Totals for City-wide Presencial vs Entrega
  const mediaPresencialCidade = Math.round(
    BAIRROS_LONDRINA.reduce((acc, b) => acc + b.percentualPresencial, 0) /
      BAIRROS_LONDRINA.length
  );
  const mediaEntregaCidade = 100 - mediaPresencialCidade;

  // Render Interactive Heatmap on Leaflet
  useEffect(() => {
    if (!mapRef.current) return;

    if (!leafletMapRef.current) {
      leafletMapRef.current = L.map(mapRef.current, {
        center: [-23.3045, -51.1628],
        zoom: 12,
        scrollWheelZoom: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap • Base Municipal de Dados SDE Londrina',
      }).addTo(leafletMapRef.current);
    }

    const map = leafletMapRef.current;
    map.eachLayer((layer) => {
      if (!(layer instanceof L.TileLayer)) {
        map.removeLayer(layer);
      }
    });

    BAIRROS_LONDRINA.forEach((b) => {
      const score =
        heatFilter === 'intensidade'
          ? b.intensidadeComercial
          : heatFilter === 'presencial'
          ? b.percentualPresencial
          : b.indiceInvisibilidadeAntesHub;

      // Color gradient for Heatmap (Red/Crimson = Very Intense, Amber = Moderate, Blue/Slate = Low Activity)
      const color =
        score >= 85
          ? '#C8102E'
          : score >= 65
          ? '#EA580C'
          : score >= 45
          ? '#F59E0B'
          : '#2563EB';

      // Outer thermal aura
      L.circle([b.lat, b.lng], {
        radius: 1350 + score * 8,
        color: 'transparent',
        fillColor: color,
        fillOpacity: 0.22,
      }).addTo(map);

      // Middle thermal zone
      L.circle([b.lat, b.lng], {
        radius: 820 + score * 4,
        color: color,
        weight: selectedArea.id === b.id ? 3 : 1.5,
        fillColor: color,
        fillOpacity: 0.45,
      })
        .addTo(map)
        .on('click', () => setSelectedArea(b));

      // Label Marker
      const badgeHtml = `<div style="background:${
        selectedArea.id === b.id ? '#0F172A' : '#FFFFFF'
      };color:${
        selectedArea.id === b.id ? '#FBBF24' : '#0F172A'
      };padding:4px 8px;border-radius:8px;font-weight:800;font-size:10px;border:2px solid ${color};white-space:nowrap;box-shadow:0 3px 10px rgba(0,0,0,0.22);cursor:pointer;">
        ${b.nome.split(' ')[0]} • ${score}%
      </div>`;

      const icon = L.divIcon({
        className: 'heat-label-icon',
        html: badgeHtml,
        iconSize: [110, 24],
        iconAnchor: [55, 12],
      });

      L.marker([b.lat, b.lng], { icon })
        .addTo(map)
        .on('click', () => setSelectedArea(b));
    });
  }, [selectedArea, heatFilter]);

  const handleExportBaseMunicipal = () => {
    const payload = {
      orgaoDestino: 'Secretaria Municipal de Desenvolvimento Econômico de Londrina & CODEL',
      sistemaOrigem: 'Shopping Digital de Londrina — Base Municipal de Dados',
      protocoloIntegracao: 'SDE-LONDRINA-2026-DATALAKE',
      atualizadoEm: new Date().toISOString(),
      resumoMunicipal: {
        mediaCompraPresencialPct: mediaPresencialCidade,
        mediaCompraEntregaPct: mediaEntregaCidade,
        bairrosMonitorados: BAIRROS_LONDRINA.length,
      },
      areasMonitoradas: BAIRROS_LONDRINA,
      evidenciaPorSegmento: SEGMENTOS_EVIDENCIA_LONDRINA,
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'base-municipal-desenvolvimento-economico-londrina.json';
    a.click();
    URL.revokeObjectURL(url);

    toast.success('Lote exportado para a Base Municipal de Dados de Londrina!', {
      description: 'Arquivo JSON estruturado conforme padrão de Governança de Dados da SDE/CODEL.',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-6 sm:space-y-8">
      {/* 1. CABEÇALHO INSTITUCIONAL DA SECRETARIA DE DESENVOLVIMENTO ECONÔMICO */}
      <div className="bg-gradient-to-br from-slate-950 via-[#8B0A1E] to-slate-900 text-white rounded-3xl p-5 sm:p-10 shadow-2xl border border-rose-500/30">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 sm:gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 bg-amber-400 text-slate-950 px-3 py-1 rounded-full text-[10px] sm:text-xs font-black uppercase">
                <Flame className="w-4 h-4 shrink-0" />
                <span>Secretaria de Desenv. Econômico • CODEL</span>
              </span>
              <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold">
                <Database className="w-3.5 h-3.5 shrink-0" />
                <span>Sincronizado Base Municipal (Tempo Real)</span>
              </span>
            </div>

            <h1 className="text-xl sm:text-4xl font-black leading-tight">
              Observatório & Mapa de Calor da Atividade Comercial de Londrina
            </h1>

            <p className="text-xs sm:text-sm text-rose-100 leading-relaxed">
              Painel estratégico alimentado automaticamente pelas transações e buscas anonimizadas (LGPD) do <strong>Shopping Digital de Londrina</strong>. Permite à Prefeitura identificar polos aquecidos, desertos comerciais que necessitam de microcrédito/incentivo fiscal, comportamento de compra (Presencial vs. Entrega) e os segmentos em maior ou menor evidência em cada bairro.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleExportBaseMunicipal}
              className="w-full sm:w-auto justify-center px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-lg flex items-center gap-2 transition-all"
            >
              <Download className="w-4 h-4 shrink-0" />
              Exportar Lote p/ Base Municipal (JSON)
            </button>
            <div className="bg-black/35 border border-white/15 rounded-xl px-4 py-2.5 text-[11px] text-rose-100">
              <div className="font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                Pipeline Data Lake Municipal Ativo
              </div>
              <div>Integração: SMTER • CODEL • Fazenda (ISS)</div>
            </div>
          </div>
        </div>

        {/* KPIs Estratégicos Municipais */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-white/15">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3.5 sm:p-4 border border-white/10">
            <span className="text-[11px] text-rose-200 font-bold uppercase">
              Volume Mapeado na Base (Mês)
            </span>
            <span className="text-xl sm:text-3xl font-black text-white block mt-1">
              R$ 9,16 Mi
            </span>
            <span className="text-[11px] text-emerald-300 font-semibold">
              +34% retido nos próprios bairros
            </span>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3.5 sm:p-4 border border-white/10">
            <span className="text-[11px] text-rose-200 font-bold uppercase">
              Modalidade Predominante
            </span>
            <span className="text-xl sm:text-3xl font-black text-amber-300 block mt-1">
              {mediaPresencialCidade}% Presencial
            </span>
            <span className="text-[11px] text-rose-100">
              vs. {mediaEntregaCidade}% com Entrega (Delivery)
            </span>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3.5 sm:p-4 border border-white/10">
            <span className="text-[11px] text-rose-200 font-bold uppercase">
              Áreas Mais Ativas (Calor Máximo)
            </span>
            <span className="text-base sm:text-xl font-black text-white block mt-1">
              Centro (98%) & Palhano (95%)
            </span>
            <span className="text-[11px] text-amber-300">
              Saul Elkind / Norte em 3º (88%)
            </span>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3.5 sm:p-4 border border-white/10">
            <span className="text-[11px] text-rose-200 font-bold uppercase">
              Áreas Menos Ativas (Foco SDE)
            </span>
            <span className="text-base sm:text-xl font-black text-rose-300 block mt-1">
              Heimtal (32%) & Cafezal (38%)
            </span>
            <span className="text-[11px] text-rose-100">
              Prioridade para incentivo fiscal e MEI
            </span>
          </div>
        </div>
      </div>

      {/* 2. MAPA DE CALOR INTERATIVO DE LONDRINA + INSPETOR POR REGIÃO */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#C8102E] flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" />
                Geointeligência Econômica Municipal
              </span>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                Mapa de Calor da Intensidade Comercial por Região
              </h2>
            </div>

            <div className="grid grid-cols-3 sm:flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-[11px] sm:text-xs font-bold">
              <button
                type="button"
                onClick={() => setHeatFilter('intensidade')}
                className={`px-2 py-1.5 rounded-lg transition-all text-center ${
                  heatFilter === 'intensidade'
                    ? 'bg-[#C8102E] text-white shadow-sm'
                    : 'text-slate-600'
                }`}
              >
                Intensidade
              </button>
              <button
                type="button"
                onClick={() => setHeatFilter('presencial')}
                className={`px-2 py-1.5 rounded-lg transition-all text-center ${
                  heatFilter === 'presencial'
                    ? 'bg-[#C8102E] text-white shadow-sm'
                    : 'text-slate-600'
                }`}
              >
                % Presencial
              </button>
              <button
                type="button"
                onClick={() => setHeatFilter('invisibilidade')}
                className={`px-2 py-1.5 rounded-lg transition-all text-center ${
                  heatFilter === 'invisibilidade'
                    ? 'bg-[#C8102E] text-white shadow-sm'
                    : 'text-slate-600'
                }`}
              >
                Evasão Centro
              </button>
            </div>
          </div>

          <div
            ref={mapRef}
            className="w-full h-72 sm:h-[420px] rounded-2xl overflow-hidden border border-slate-200"
          />

          {/* Legenda Térmica */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            <span className="font-bold text-slate-700">Escala do Mapa de Calor:</span>
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                <span className="w-3 h-3 rounded-full bg-[#C8102E]" />
                85-100% (Muito Ativo)
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                <span className="w-3 h-3 rounded-full bg-[#EA580C]" />
                65-84% (Alta Atividade)
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                <span className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                45-64% (Moderada)
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                <span className="w-3 h-3 rounded-full bg-[#2563EB]" />
                &lt;45% (Baixa Atividade • Incentivo SDE)
              </span>
            </div>
          </div>
        </div>

        {/* Painel de Raio-X da Área Selecionada no Mapa */}
        <div className="lg:col-span-5 bg-white rounded-3xl border-2 border-[#C8102E]/30 p-5 sm:p-6 shadow-md space-y-5">
          <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#C8102E]">
                Diagnóstico Territorial • Base Municipal SDE
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-0.5">
                {selectedArea.nome}
              </h3>
              <p className="text-xs text-slate-500">
                {selectedArea.zona} • {selectedArea.referencia}
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-black shrink-0 ${
                selectedArea.intensidadeComercial >= 80
                  ? 'bg-rose-100 text-[#C8102E]'
                  : selectedArea.intensidadeComercial >= 60
                  ? 'bg-amber-100 text-amber-900'
                  : 'bg-blue-100 text-blue-900'
              }`}
            >
              Calor: {selectedArea.intensidadeComercial}/100
            </span>
          </div>

          {/* Seletor rápido de área para inspecionar */}
          <div className="flex flex-wrap gap-1.5">
            {BAIRROS_LONDRINA.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => setSelectedArea(b)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  selectedArea.id === b.id
                    ? 'bg-slate-900 text-amber-400'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {b.nome.split(' ')[0]} ({b.intensidadeComercial}%)
              </button>
            ))}
          </div>

          {/* Compra Presencial vs Entrega naquela Área */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-extrabold">
              <span className="flex items-center gap-1.5 text-emerald-700">
                <Footprints className="w-4 h-4" />
                Presencial / Retirada: {selectedArea.percentualPresencial}%
              </span>
              <span className="flex items-center gap-1.5 text-[#C8102E]">
                <Truck className="w-4 h-4" />
                Entrega (Delivery): {selectedArea.percentualEntrega}%
              </span>
            </div>
            <div className="w-full h-3.5 rounded-full bg-rose-200 overflow-hidden flex">
              <div
                style={{ width: `${selectedArea.percentualPresencial}%` }}
                className="bg-emerald-600 h-full"
              />
              <div
                style={{ width: `${selectedArea.percentualEntrega}%` }}
                className="bg-[#C8102E] h-full"
              />
            </div>
            <p className="text-[11px] text-slate-500">
              Volume Mensal Mapeado: <strong>R$ {(selectedArea.volumeMensalReais / 1000).toFixed(0)} mil/mês</strong> • Ticket Médio: <strong>R$ {selectedArea.ticketMedioReais.toFixed(2).replace('.', ',')}</strong>
            </p>
          </div>

          {/* Quais tipos de comércios mais vendem nesta área */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
              Tipos de Comércio que Mais Vendem em {selectedArea.nome.split(' ')[0]}:
            </h4>
            {selectedArea.tiposMaisVendem.map((t, i) => (
              <div
                key={i}
                className="bg-white border border-slate-200 rounded-xl p-2.5 flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-extrabold text-slate-900 block">
                    {i + 1}º • {t.segmento}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Representa {t.percentual}% do faturamento do bairro
                  </span>
                </div>
                <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  {t.tendencia}
                </span>
              </div>
            ))}
          </div>

          {/* Lacunas de Mercado / Oportunidades */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-rose-700">
              Segmentos Carentes / Oportunidade para Novos Negócios:
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {selectedArea.tiposMenosAtendidos.map((carente, i) => (
                <span
                  key={i}
                  className="bg-rose-50 text-[#9B0B22] border border-rose-200 px-2.5 py-1 rounded-lg text-xs font-bold"
                >
                  + {carente}
                </span>
              ))}
            </div>
          </div>

          {/* Recomendação Estratégica para a Prefeitura */}
          <div className="bg-amber-50 border border-amber-300/80 rounded-2xl p-3.5 text-xs text-amber-950 space-y-1">
            <div className="font-black flex items-center gap-1.5 text-amber-900">
              <Building2 className="w-4 h-4 text-[#C8102E]" />
              Diretriz Estratégica SDE / CODEL:
            </div>
            <p className="leading-relaxed">{selectedArea.recomendacaoPrefeitura}</p>
          </div>
        </div>
      </div>

      {/* 3. COMPARATIVO DIRETO: ÁREAS COM COMÉRCIO MAIS ATIVO VS. MENOS ATIVO */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mais Ativas */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700">
                Polos Consolidados & Alto Fluxo
              </span>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                Áreas com Comércio Mais Ativo em Londrina
              </h3>
            </div>
          </div>

          <div className="space-y-3">
            {mostActiveAreas.map((area, idx) => (
              <div
                key={area.id}
                onClick={() => setSelectedArea(area)}
                className="p-3.5 rounded-2xl border border-slate-200 hover:border-[#C8102E] cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4"
              >
                <div className="space-y-0.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#C8102E] text-white text-xs font-black flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="font-black text-sm text-slate-900">{area.nome}</span>
                    <span className="text-[10px] font-bold bg-slate-100 px-2 py-0.5 rounded">
                      {area.zona}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 sm:pl-8">
                    Líder: <strong>{area.tiposMaisVendem[0].segmento}</strong> ({area.lojasAtivas} lojas ativas)
                  </p>
                </div>
                <div className="flex sm:block items-center justify-between sm:text-right shrink-0 border-t sm:border-t-0 border-slate-100 pt-2 sm:pt-0">
                  <span className="text-sm sm:text-base font-black text-[#C8102E] block">
                    {area.intensidadeComercial}% Ativo
                  </span>
                  <span className="text-[11px] text-slate-500">
                    R$ {(area.volumeMensalReais / 1000000).toFixed(2)} Mi/mês
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Menos Ativas (Foco de Políticas Públicas) */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-rose-700">
                Zonas de Descentralização & Incentivo Fiscal
              </span>
              <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                <span>Áreas com Comércio Menos Ativo (Oportunidade SDE)</span>
              </h3>
            </div>
          </div>

          <div className="space-y-3">
            {leastActiveAreas.map((area, idx) => (
              <div
                key={area.id}
                onClick={() => setSelectedArea(area)}
                className="p-3.5 rounded-2xl border border-amber-200 bg-amber-50/30 hover:border-[#C8102E] cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4"
              >
                <div className="space-y-0.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 text-xs font-black flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="font-black text-sm text-slate-900">{area.nome}</span>
                    <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded border border-amber-200">
                      {area.statusAtividade}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 sm:pl-8">
                    Carência: <strong>{area.tiposMenosAtendidos.slice(0, 2).join(', ')}</strong> • Evasão antes do Hub: {area.indiceInvisibilidadeAntesHub}%
                  </p>
                </div>
                <div className="flex sm:block items-center justify-between sm:text-right shrink-0 border-t sm:border-t-0 border-amber-200/60 pt-2 sm:pt-0">
                  <span className="text-sm sm:text-base font-black text-amber-800 block">
                    {area.intensidadeComercial}% Ativo
                  </span>
                  <span className="text-[11px] text-emerald-700 font-bold">
                    +{area.crescimentoPosHub}% c/ Hub
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. GRÁFICO: COMPRA PRESENCIAL (RETIRADA NO BAIRRO) VS. ENTREGA (DELIVERY) POR ÁREA */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#C8102E]">
              Comportamento Logístico e Mobilidade Urbana
            </span>
            <h3 className="text-lg sm:text-xl font-black text-slate-900">
              Compras Presenciais (Balcão / A Pé no Bairro) vs. Entrega (Delivery) por Região
            </h3>
            <p className="text-xs text-slate-500">
              Bairros verticalizados como a Gleba Palhano demandam mais Entrega (66%), enquanto bairros tradicionais como Vila Casoni, Centro e Cafezal priorizam a Retirada Presencial (&gt;62%).
            </p>
          </div>
        </div>

        <div className="h-80 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={BAIRROS_LONDRINA.map((b) => ({
                nome: b.nome.split(' ')[0],
                Presencial: b.percentualPresencial,
                Entrega: b.percentualEntrega,
                Intensidade: b.intensidadeComercial,
              }))}
              margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
            >
              <XAxis dataKey="nome" tick={{ fontSize: 12, fontWeight: 700 }} />
              <YAxis unit="%" tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="Presencial"
                name="Compra Presencial / Retirada no Bairro (%)"
                stackId="a"
                fill="#16A34A"
                radius={[0, 0, 6, 6]}
              />
              <Bar
                dataKey="Entrega"
                name="Compra com Entrega / Delivery Local (%)"
                stackId="a"
                fill="#C8102E"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 5. TIPOS DE COMÉRCIO EM MAIOR EVIDÊNCIA VS. MENOR EVIDÊNCIA NA CIDADE */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#C8102E]">
              Termômetro Setorial da Cidade de Londrina
            </span>
            <h3 className="text-xl font-black text-slate-900">
              Tipos de Comércio em Maior Evidência vs. Menor Evidência na Base Municipal
            </h3>
            <p className="text-xs text-slate-500">
              Cruzamento de volume de pesquisas dos cidadãos, taxa de conversão, faturamento digital e índice de presença nos bairros
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Coluna: Maior Evidência */}
          <div className="bg-white rounded-3xl border border-emerald-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-emerald-700 font-black text-base">
              <CheckCircle2 className="w-5 h-5" />
              Segmentos em MAIOR Evidência em Londrina
            </div>

            <div className="space-y-3">
              {altaEvidencia.map((seg, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-sm font-black text-slate-900 block">
                        {seg.segmento}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Polo dominante: <strong>{seg.regiaoDominante}</strong>
                      </span>
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-2.5 py-1 rounded-lg shrink-0">
                      Score {seg.scoreEvidencia}/100
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-[11px] bg-white p-2.5 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-slate-400 block">Buscas/Mês</span>
                      <strong className="text-slate-800">
                        {seg.buscasMensais.toLocaleString('pt-BR')}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Modalidade</span>
                      <strong className="text-slate-800">
                        {seg.presencialPct}% Pres. / {seg.entregaPct}% Ent.
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Crescimento</span>
                      <strong className="text-emerald-600">+{seg.crescimentoMensalPct}%</strong>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{seg.diagnosticoSDE}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Coluna: Menor Evidência (Invisíveis nos Bairros) */}
          <div className="bg-white rounded-3xl border border-rose-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-[#C8102E] font-black text-base">
              <TrendingDown className="w-5 h-5" />
              Segmentos em MENOR Evidência (Ação Prioritária SDE/SEBRAE)
            </div>

            <div className="space-y-3">
              {baixaEvidencia.map((seg, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl border border-rose-200 bg-rose-50/40 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-sm font-black text-slate-900 block">
                        {seg.segmento}
                      </span>
                      <span className="text-[11px] text-rose-700 font-semibold">
                        Regiões mais carentes: <strong>{seg.regiaoCarente}</strong>
                      </span>
                    </div>
                    <span className="bg-rose-100 text-[#C8102E] text-xs font-black px-2.5 py-1 rounded-lg shrink-0">
                      Score {seg.scoreEvidencia}/100
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-[11px] bg-white p-2.5 rounded-xl border border-rose-100">
                    <div>
                      <span className="text-slate-400 block">Buscas reprimidas</span>
                      <strong className="text-slate-800">
                        {seg.buscasMensais.toLocaleString('pt-BR')}/mês
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Modalidade</span>
                      <strong className="text-slate-800">
                        {seg.presencialPct}% Pres. / {seg.entregaPct}% Ent.
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Conversão Atual</span>
                      <strong className="text-rose-600">{seg.taxaConversaoPct}% (Baixa)</strong>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 font-medium leading-relaxed bg-white/80 p-2.5 rounded-xl border border-rose-200/60">
                    {seg.diagnosticoSDE}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

