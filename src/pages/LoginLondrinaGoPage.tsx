import React, { useState } from 'react';
import {
  ShieldCheck,
  User,
  Store,
  BarChart3,
  Lock,
  KeyRound,
  CheckCircle2,
  ArrowRight,
  Building2,
  Fingerprint,
  Copy,
} from 'lucide-react';
import { useLondrinaApp } from '../context/LondrinaAppContext';
import { CONTAS_LONDRINAGO, UserRole } from '../data/londrinaSeed';
import { toast } from 'sonner';

export const LoginLondrinaGoPage: React.FC = () => {
  const { loginWithLondrinaGo, quickLoginRole, navigate, currentUser } = useLondrinaApp();

  const [identifier, setIdentifier] = useState('cidadao@londrinago.pr.gov.br');
  const [password, setPassword] = useState('londrina2026');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const res = loginWithLondrinaGo(identifier, password);
    if (!res.ok) {
      setErrorMsg(res.message);
      return;
    }

    // Redirect based on logged role
    const matched = CONTAS_LONDRINAGO.find(
      (c) =>
        c.email.toLowerCase() === identifier.trim().toLowerCase() ||
        c.cpf === identifier.trim() ||
        c.cnpj === identifier.trim()
    );
    if (matched?.role === 'admin') {
      navigate('/inteligencia-economica');
    } else if (matched?.role === 'comerciante') {
      navigate('/vendedor');
    } else {
      navigate('/');
    }
  };

  const handleQuickSelect = (role: UserRole, targetPath: string) => {
    const account = CONTAS_LONDRINAGO.find((c) => c.role === role);
    if (account) {
      setIdentifier(account.email);
      setPassword(account.password);
      quickLoginRole(role);
      navigate(targetPath);
    }
  };

  const copyText = (txt: string, label: string) => {
    navigator.clipboard?.writeText(txt);
    toast.success(`${label} copiado: ${txt}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* COLUNA ESQUERDA: FORMULÁRIO OFICIAL DE LOGIN ÚNICO LONDRINAGO */}
        <div className="lg:col-span-5 bg-white rounded-3xl border-2 border-slate-200 shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-[#8B0A1E] via-[#C8102E] to-[#9B0B22] p-6 text-white space-y-3">
            <div className="flex items-center justify-between">
              <img
                src="/assets/brand/londrinago-logo.svg"
                alt="LondrinaGO"
                className="h-11 w-auto"
              />
              <span className="text-[10px] font-black uppercase tracking-wider bg-white/15 px-2.5 py-1 rounded-full border border-white/20">
                SSO Municipal v2.4
              </span>
            </div>
            <h1 className="text-xl font-black leading-snug">
              Acesso Único Municipal • LondrinaGO & LondrinaON Cidadão
            </h1>
            <p className="text-xs text-rose-100">
              Substituição completa do Keycloak de Assaí pela arquitetura de Identidade Digital Unificada da Prefeitura de Londrina (CPF, CNPJ e Gov.br).
            </p>
          </div>

          <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
            {currentUser && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-xs text-emerald-900 flex items-center justify-between">
                <div>
                  <span className="font-black block">
                    Sessão Ativa: {currentUser.name}
                  </span>
                  <span className="text-[11px] text-emerald-700">
                    Perfil: {currentUser.role.toUpperCase()} • {currentUser.nivelLondrinaGo}
                  </span>
                </div>
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              </div>
            )}

            {errorMsg && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-3 text-xs font-bold">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1">
                CPF, CNPJ ou E-mail Cadastrado no LondrinaGO
              </label>
              <div className="relative">
                <Fingerprint className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Ex: cidadao@londrinago.pr.gov.br ou 222.333.444-55"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:border-[#C8102E] focus:ring-[#C8102E]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1">
                Senha do Portal Único LondrinaGO
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Senha (londrina2026)"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:border-[#C8102E] focus:ring-[#C8102E]"
                  required
                />
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Senha padrão dos seeders locais: <code className="font-mono font-bold text-[#C8102E]">londrina2026</code>
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#C8102E] hover:bg-[#9B0B22] text-white font-black text-sm shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              Autenticar via LondrinaGO
            </button>

            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
              <div className="font-bold text-slate-700 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#C8102E]" />
                Barramento Federado LondrinaON Cidadão:
              </div>
              <p>
                Integrado aos níveis de confiabilidade Gov.br (Bronze/Prata/Ouro), Nota Londrina, Alvará Digital SEI e Cadastro Único Municipal.
              </p>
            </div>
          </form>
        </div>

        {/* COLUNA DIREITA: OS 3 LOGINS LOCAIS (SEEDERS) E ARQUITETURA LONDRINAGO */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#C8102E]">
                Contas Locais Semeadas (Seeders de Demonstração)
              </span>
              <h2 className="text-xl font-black text-slate-900">
                3 Perfis Oficiais para Avaliação (Admin, Cidadão e Comerciante)
              </h2>
              <p className="text-xs text-slate-500">
                Clique em qualquer perfil abaixo para preencher automaticamente ou entrar direto no módulo correspondente:
              </p>
            </div>

            <div className="space-y-4">
              {CONTAS_LONDRINAGO.map((acc) => {
                const isCitizen = acc.role === 'cidadao';
                const isMerchant = acc.role === 'comerciante';
                const targetUrl = isCitizen
                  ? '/hub-bairros'
                  : isMerchant
                  ? '/vendedor'
                  : '/inteligencia-economica';

                return (
                  <div
                    key={acc.id}
                    className="rounded-2xl border-2 border-slate-200 hover:border-[#C8102E] p-4 transition-all bg-slate-50/50 space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={acc.avatar}
                          alt={acc.name}
                          className="w-12 h-12 rounded-xl object-cover border-2 border-[#C8102E]"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#C8102E] text-white">
                              Perfil: {acc.role.toUpperCase()}
                            </span>
                            <span className="text-[11px] font-bold text-slate-500">
                              Protocolo {acc.protocoloGovBr}
                            </span>
                          </div>
                          <h3 className="text-sm sm:text-base font-black text-slate-900 mt-0.5">
                            {acc.name}
                          </h3>
                          <p className="text-[11px] text-emerald-700 font-semibold">
                            {acc.nivelLondrinaGo}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleQuickSelect(acc.role, targetUrl)}
                        className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-[#C8102E] text-white text-xs font-extrabold transition-colors flex items-center gap-1.5"
                      >
                        Entrar como {acc.role.toUpperCase()}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Credenciais explícitas para cópia */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-white p-3 rounded-xl border border-slate-200 text-xs">
                      <div className="flex items-center justify-between gap-1">
                        <div>
                          <span className="text-[10px] text-slate-400 block">E-mail Login:</span>
                          <code className="font-mono font-bold text-slate-800 text-[11px]">
                            {acc.email}
                          </code>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyText(acc.email, 'E-mail')}
                          className="p-1 text-slate-400 hover:text-[#C8102E]"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between gap-1">
                        <div>
                          <span className="text-[10px] text-slate-400 block">
                            CPF {acc.cnpj ? '/ CNPJ' : ''}:
                          </span>
                          <code className="font-mono font-bold text-slate-800 text-[11px]">
                            {acc.cpf} {acc.cnpj ? `• ${acc.cnpj}` : ''}
                          </code>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyText(acc.cpf, 'CPF')}
                          className="p-1 text-slate-400 hover:text-[#C8102E]"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between gap-1">
                        <div>
                          <span className="text-[10px] text-slate-400 block">Senha Local:</span>
                          <code className="font-mono font-bold text-[#C8102E] text-[11px]">
                            {acc.password}
                          </code>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyText(acc.password, 'Senha')}
                          className="p-1 text-slate-400 hover:text-[#C8102E]"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Explicação Técnica Profunda sobre o funcionamento do LondrinaGO / LondrinaON */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-black uppercase tracking-wider">
              <Building2 className="w-4 h-4 text-[#C8102E]" />
              Arquitetura de Integração • Como funciona o LondrinaGO (LondrinaON Cidadão)
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              O ecossistema de Identidade Digital de Londrina opera através do portal <strong>Londrina ON Cidadão</strong> (<code className="text-amber-300">autenticacao-londrinaoncidadao.cidadesinteligentes.org.br</code>), utilizando o protocolo <strong>OpenID Connect (OIDC) / OAuth 2.0</strong> integrado ao barramento federal <strong>Gov.br</strong>:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-800/90 p-3.5 rounded-2xl border border-slate-700 space-y-1">
                <div className="font-black text-amber-300 flex items-center gap-1.5">
                  <User className="w-4 h-4" />
                  1. Login Cidadão (CPF)
                </div>
                <p className="text-[11px] text-slate-300">
                  Sincroniza automaticamente o CEP/Bairro residencial cadastrado no IPTU/Cadastro Único (ex: Vila Casoni) para calibrar o algoritmo do <strong>Hub de Bairros</strong> e creditar cashback no programa <em>Nota Londrina</em>.
                </p>
              </div>

              <div className="bg-slate-800/90 p-3.5 rounded-2xl border border-slate-700 space-y-1">
                <div className="font-black text-amber-300 flex items-center gap-1.5">
                  <Store className="w-4 h-4" />
                  2. Login Comerciante (CNPJ)
                </div>
                <p className="text-[11px] text-slate-300">
                  Valida a situação cadastral junto à Secretaria de Fazenda (ISS Londrina) e <strong>Alvará Digital no SEI/Redesim</strong>, concedendo o selo oficial <em>Comércio de Bairro Verificado</em>.
                </p>
              </div>

              <div className="bg-slate-800/90 p-3.5 rounded-2xl border border-slate-700 space-y-1">
                <div className="font-black text-amber-300 flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4" />
                  3. Login Gestor (SDE/CODEL)
                </div>
                <p className="text-[11px] text-slate-300">
                  Acesso restrito aos servidores municipais (Nível 3 Ouro) com permissão de leitura e exportação do <strong>Mapa de Calor e Base Municipal de Dados Econômicos</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

