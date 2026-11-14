import React from 'react';
import { ShieldCheck, MapPin, Phone, Globe, Building2, Flame, Compass, Lock } from 'lucide-react';
import { useLondrinaApp } from '../context/LondrinaAppContext';

export const Footer: React.FC = () => {
  const { navigate } = useLondrinaApp();

  return (
    <footer className="bg-slate-950 text-slate-300 border-t-4 border-[#C8102E] mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Coluna 1: Identidade Londrina */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/assets/brand/brasao-londrina.svg"
                alt="Brasão de Londrina"
                className="w-11 h-11 rounded-full bg-white p-1"
              />
              <div>
                <h3 className="text-white font-extrabold text-base leading-tight">
                  SHOPPING LONDRINA
                </h3>
                <p className="text-xs text-rose-400 font-semibold">
                  Prefeitura do Município de Londrina • PR
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Plataforma oficial de fortalecimento do comércio de bairro, descentralização econômica e inteligência territorial integrada ao Login Único Municipal <strong>LondrinaGO (LondrinaON Cidadão)</strong>.
            </p>
            <div className="inline-flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-amber-300">
              <ShieldCheck className="w-4 h-4 text-[#C8102E]" />
              Base Municipal de Dados • LGPD Compliant
            </div>
          </div>

          {/* Coluna 2: Hub de Bairros */}
          <div>
            <h4 className="text-white font-bold text-sm mb-3 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-[#C8102E]" />
              Polos & Hub de Bairros
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>• Vila Casoni & Recreio (Centro-Norte)</li>
              <li>• Cinco Conjuntos / Av. Saul Elkind (Zona Norte)</li>
              <li>• Gleba Palhano & Aurora (Zona Sul)</li>
              <li>• Jardim Bandeirantes / Av. Tiradentes (Oeste)</li>
              <li>• Aeroporto, Londrilar & HU (Zona Leste)</li>
              <li>• Cafezal, Jamile Dequech & Patrimônio Heimtal</li>
            </ul>
          </div>

          {/* Coluna 3: Acesso Rápido para Apresentação */}
          <div>
            <h4 className="text-white font-bold text-sm mb-3 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-400" />
              Módulos de Demonstração
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/hub-bairros')}
                  className="hover:text-white transition-colors"
                >
                  → Algoritmo do Hub de Bairros (Raio de Quadras)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/inteligencia-economica')}
                  className="hover:text-white transition-colors text-amber-300 font-semibold"
                >
                  → Mapa de Calor SDE / CODEL (Desenvolvimento Econômico)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="hover:text-white transition-colors"
                >
                  → Autenticação Única LondrinaGO (Cidadão, Lojista e Admin)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/comparador-precos')}
                  className="hover:text-white transition-colors"
                >
                  → Radar de Preços Hiperlocal de Londrina
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/vendedor')}
                  className="hover:text-white transition-colors"
                >
                  → Portal do Comerciante Pé-Vermelho
                </button>
              </li>
            </ul>
          </div>

          {/* Coluna 4: Órgãos Integrados */}
          <div>
            <h4 className="text-white font-bold text-sm mb-3 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-[#C8102E]" />
              Governança & Integração
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C8102E] shrink-0 mt-0.5" />
                <span>Av. Duque de Caxias, 635 - Centro Cívico, Londrina - PR, 86015-901</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C8102E] shrink-0" />
                <span>Central 156 LondrinaON • (43) 3372-4000</span>
              </p>
              <p className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#C8102E] shrink-0" />
                <span>londrina.pr.gov.br • londrinaon.com.br</span>
              </p>
              <p className="flex items-center gap-2 text-emerald-400 font-medium pt-1">
                <Lock className="w-4 h-4 shrink-0" />
                <span>Protótipo Funcional • Arquitetura Cidades Inteligentes</span>
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>
            © 2026 Prefeitura do Município de Londrina • Secretaria Municipal de Desenvolvimento Econômico & CODEL.
          </p>
          <p className="text-slate-400">
            Identidade Visual Oficial Pé-Vermelho • Tecnologia validada para Smart Cities
          </p>
        </div>
      </div>
    </footer>
  );
};

