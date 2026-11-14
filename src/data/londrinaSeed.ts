export type UserRole = 'cidadao' | 'comerciante' | 'admin';

export interface LondrinaAccount {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  cpf: string;
  cnpj?: string;
  password: string;
  avatar: string;
  bairroId: string;
  endereco: string;
  telefone: string;
  nivelLondrinaGo: string;
  protocoloGovBr: string;
  pontosPeVermelho: number;
  storeSlug?: string;
  cargoMunicipal?: string;
}

export interface BairroLondrina {
  id: string;
  nome: string;
  zona: 'Zona Norte' | 'Zona Sul' | 'Zona Leste' | 'Zona Oeste' | 'Centro' | 'Centro-Norte';
  referencia: string;
  cepFaixa: string;
  lat: number;
  lng: number;
  populacaoEstimada: number;
  lojasAtivas: number;
  intensidadeComercial: number; // 0 to 100 (for Heatmap)
  statusAtividade: 'Muito Alta' | 'Alta' | 'Moderada' | 'Baixa (Foco de Incentivo)' | 'Em Expansão';
  indiceInvisibilidadeAntesHub: number; // % of local demand that leaked to Centro before Hub de Bairros
  crescimentoPosHub: number; // % growth with Hub de Bairros algorithm
  percentualPresencial: number; // % in-person / pickup
  percentualEntrega: number; // % delivery
  volumeMensalReais: number;
  ticketMedioReais: number;
  tiposMaisVendem: { segmento: string; percentual: number; tendencia: string }[];
  tiposMenosAtendidos: string[];
  recomendacaoPrefeitura: string;
}

export interface StoreLondrina {
  id: number;
  nome: string;
  slug: string;
  segmento: string;
  segmentoSlug: string;
  categoriaIcone: string;
  bairroId: string;
  bairroNome: string;
  zona: string;
  endereco: string;
  quadraReferencia: string;
  lat: number;
  lng: number;
  nota: number;
  avaliacoes: number;
  tempoEntrega: string;
  taxaEntrega: number;
  aceitaRetiradaVizinhanca: boolean;
  descontoRetiradaBairro?: string;
  abertaAgora: boolean;
  horarioFuncionamento: string;
  whatsapp: string;
  cnpj: string;
  alvaraVerificadoLondrinaGo: boolean;
  seloComercioDeBairro: boolean;
  logoUrl: string;
  capaUrl: string;
  descricao: string;
  vendasPresenciaisPct: number;
  vendasEntregaPct: number;
  pedidosMes: number;
}

export interface ProductLondrina {
  id: number;
  nome: string;
  slug: string;
  descricao: string;
  preco: number;
  precoPromocional?: number;
  unidade: string;
  categoria: string;
  categoriaSlug: string;
  skuFamilia?: string; // Used in Radar de Preços across different neighborhood stores
  imagemUrl: string;
  estoque: number;
  destaqueBairro: boolean;
  disponivelRetiradaImediata: boolean;
  tempoPreparoMin: number;
  vendasMes: number;
  storeId: number;
}

export interface StoryLondrina {
  id: number;
  storeId: number;
  storeNome: string;
  storeSlug: string;
  bairroNome: string;
  avatarUrl: string;
  mediaUrl: string;
  legenda: string;
  precoDestaque?: string;
  tempoAtras: string;
}

export interface EconomicSegmentEvidence {
  segmento: string;
  icone: string;
  statusEvidencia: 'Alta Evidência' | 'Média Evidência' | 'Baixa Evidência (Invisível nos Bairros)';
  scoreEvidencia: number; // 0-100
  buscasMensais: number;
  taxaConversaoPct: number;
  faturamentoMensal: number;
  presencialPct: number;
  entregaPct: number;
  crescimentoMensalPct: number;
  regiaoDominante: string;
  regiaoCarente: string;
  diagnosticoSDE: string;
}

export interface OrderLondrina {
  id: string;
  codigo: string;
  dataHora: string;
  clienteNome: string;
  clienteBairro: string;
  storeId: number;
  storeNome: string;
  storeBairro: string;
  modalidade: 'Retirada no Bairro (Presencial)' | 'Entrega Rápida Local';
  status: 'Entregue / Retirado' | 'Em separação' | 'Saiu para entrega' | 'Pronto para retirada (a 2 quadras)';
  valorTotal: number;
  economiaFreteBairro: number;
  itens: { nome: string; qtd: number; precoUnit: number }[];
}

// ============================================================================
// 1. CONTAS LOCAIS (SEEDERS) — INTEGRAÇÃO LONDRINAGO (LOGIN ÚNICO MUNICIPAL)
// ============================================================================
export const CONTAS_LONDRINAGO: LondrinaAccount[] = [
  {
    id: 'usr-admin-londrina',
    role: 'admin',
    name: 'Dr. Roberto Andrade (Gestor SDE / CODEL)',
    email: 'admin@londrina.pr.gov.br',
    cpf: '111.222.333-44',
    password: 'londrina2026',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&auto=format&fit=crop&q=80',
    bairroId: 'centro-historico',
    endereco: 'Av. Duque de Caxias, 635 - Centro Cívico, Londrina - PR',
    telefone: '(43) 3372-4000',
    nivelLondrinaGo: 'Nível 3 • Ouro (Servidor Público Municipal + Gov.br)',
    protocoloGovBr: 'LGO-ADM-2026-99412',
    pontosPeVermelho: 2500,
    cargoMunicipal: 'Secretaria Municipal de Desenvolvimento Econômico & CODEL',
  },
  {
    id: 'usr-cidadao-londrina',
    role: 'cidadao',
    name: 'Carlos Eduardo Pé-Vermelho',
    email: 'cidadao@londrinago.pr.gov.br',
    cpf: '222.333.444-55',
    password: 'londrina2026',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    bairroId: 'vila-casoni',
    endereco: 'Rua Guaporé, 412 - Vila Casoni, Londrina - PR',
    telefone: '(43) 99912-3456',
    nivelLondrinaGo: 'Nível 3 • Ouro (LondrinaON Cidadão + Nota Londrina Ativo)',
    protocoloGovBr: 'LGO-CID-2026-48201',
    pontosPeVermelho: 1450,
  },
  {
    id: 'usr-comerciante-londrina',
    role: 'comerciante',
    name: 'Maria Helena Tanaka (Empório Terra Vermelha)',
    email: 'comerciante@londrinago.pr.gov.br',
    cpf: '333.444.555-66',
    cnpj: '12.345.678/0001-90',
    password: 'londrina2026',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    bairroId: 'vila-casoni',
    endereco: 'Av. Rio Branco, 890 - Vila Casoni, Londrina - PR',
    telefone: '(43) 99844-7711',
    nivelLondrinaGo: 'Nível 3 • PJ Verificado (Alvará Digital SEI + ISS Londrina)',
    protocoloGovBr: 'LGO-EMP-2026-77319',
    pontosPeVermelho: 3890,
    storeSlug: 'emporio-cafe-terra-vermelha',
  },
];

// ============================================================================
// 2. BAIRROS DE LONDRINA — HUB DE BAIRROS & MAPA DE CALOR (SDE / CODEL)
// ============================================================================
export const BAIRROS_LONDRINA: BairroLondrina[] = [
  {
    id: 'vila-casoni',
    nome: 'Vila Casoni / Recreio',
    zona: 'Centro-Norte',
    referencia: 'Av. Rio Branco & Rua Guaporé (Tradicional)',
    cepFaixa: '86025-000',
    lat: -23.2968,
    lng: -51.1588,
    populacaoEstimada: 28400,
    lojasAtivas: 64,
    intensidadeComercial: 74,
    statusAtividade: 'Alta',
    indiceInvisibilidadeAntesHub: 68,
    crescimentoPosHub: 42,
    percentualPresencial: 62,
    percentualEntrega: 38,
    volumeMensalReais: 685000,
    ticketMedioReais: 64.5,
    tiposMaisVendem: [
      { segmento: 'Padarias, Cafés & Empórios', percentual: 34, tendencia: '+28%' },
      { segmento: 'Mercados de Vizinhança & Hortifruti', percentual: 29, tendencia: '+19%' },
      { segmento: 'Farmácias & Saúde', percentual: 18, tendencia: '+11%' },
    ],
    tiposMenosAtendidos: ['Eletrônicos & Informática', 'Moda Infantil', 'Pet Shop 24h'],
    recomendacaoPrefeitura: 'Forte adesão à compra a pé (2 a 4 quadras).Priorizar calçadas acessíveis e selo Comércio Tradicional Pé-Vermelho.',
  },
  {
    id: 'cinco-conjuntos',
    nome: 'Cinco Conjuntos (Av. Saul Elkind)',
    zona: 'Zona Norte',
    referencia: 'Eixo Av. Saul Elkind / Vivi Xavier / Parigot',
    cepFaixa: '86084-000',
    lat: -23.2585,
    lng: -51.1572,
    populacaoEstimada: 142000,
    lojasAtivas: 118,
    intensidadeComercial: 88,
    statusAtividade: 'Muito Alta',
    indiceInvisibilidadeAntesHub: 54,
    crescimentoPosHub: 51,
    percentualPresencial: 58,
    percentualEntrega: 42,
    volumeMensalReais: 1420000,
    ticketMedioReais: 58.9,
    tiposMaisVendem: [
      { segmento: 'Gastronomia, Lanches & Pizzarias', percentual: 36, tendencia: '+39%' },
      { segmento: 'Supermercados & Açougues', percentual: 31, tendencia: '+24%' },
      { segmento: 'Moda, Calçados & Variedades', percentual: 21, tendencia: '+17%' },
    ],
    tiposMenosAtendidos: ['Serviços Especializados de TI', 'Livrarias & Papelarias Técnicas'],
    recomendacaoPrefeitura: 'Polo autossuficiente da Zona Norte. O Hub de Bairros reteve R$ 410 mil/mês que antes iam para o Centro.',
  },
  {
    id: 'gleba-palhano',
    nome: 'Gleba Palhano / Aurora',
    zona: 'Zona Sul',
    referencia: 'Av. Ayrton Senna / Av. Madre Leônia Milito',
    cepFaixa: '86050-000',
    lat: -23.3322,
    lng: -51.1765,
    populacaoEstimada: 65000,
    lojasAtivas: 134,
    intensidadeComercial: 95,
    statusAtividade: 'Muito Alta',
    indiceInvisibilidadeAntesHub: 31,
    crescimentoPosHub: 29,
    percentualPresencial: 34,
    percentualEntrega: 66,
    volumeMensalReais: 2180000,
    ticketMedioReais: 112.0,
    tiposMaisVendem: [
      { segmento: 'Gastronomia Gourmet & Cafés Especiais', percentual: 41, tendencia: '+26%' },
      { segmento: 'Farmácias, Dermocosméticos & Bem-Estar', percentual: 27, tendencia: '+22%' },
      { segmento: 'Pet Shops & Clínicas Veterinárias', percentual: 19, tendencia: '+18%' },
    ],
    tiposMenosAtendidos: ['Materiais de Construção Pesados', 'Oficinas Mecânicas Populares'],
    recomendacaoPrefeitura: 'Maior predominância de pedidos por Entrega (66%) devido à verticalização. Estimular logística de bike-entregadores locais.',
  },
  {
    id: 'centro-historico',
    nome: 'Centro / Calçadão & Higienópolis',
    zona: 'Centro',
    referencia: 'Calçadão de Londrina / Av. Paraná / Av. Higienópolis',
    cepFaixa: '86010-000',
    lat: -23.3105,
    lng: -51.1628,
    populacaoEstimada: 48000,
    lojasAtivas: 215,
    intensidadeComercial: 98,
    statusAtividade: 'Muito Alta',
    indiceInvisibilidadeAntesHub: 12,
    crescimentoPosHub: 18,
    percentualPresencial: 71,
    percentualEntrega: 29,
    volumeMensalReais: 2890000,
    ticketMedioReais: 94.0,
    tiposMaisVendem: [
      { segmento: 'Moda, Calçados & Óticas', percentual: 38, tendencia: '+14%' },
      { segmento: 'Eletrônicos, Celulares & Assistência', percentual: 28, tendencia: '+16%' },
      { segmento: 'Restaurantes Executivos & Cafeterias', percentual: 20, tendencia: '+12%' },
    ],
    tiposMenosAtendidos: ['Hortifruti de Vizinhança com Entrega Rápida'],
    recomendacaoPrefeitura: 'Centro consolidado com 71% de fluxo presencial. Integrar estacionamento inteligente e retirada expressa (Click & Retire).',
  },
  {
    id: 'bandeirantes',
    nome: 'Jardim Bandeirantes / Oeste',
    zona: 'Zona Oeste',
    referencia: 'Av. Bandeirantes / Av. Tiradentes / Leonor',
    cepFaixa: '86065-000',
    lat: -23.3075,
    lng: -51.1965,
    populacaoEstimada: 78000,
    lojasAtivas: 72,
    intensidadeComercial: 67,
    statusAtividade: 'Moderada',
    indiceInvisibilidadeAntesHub: 72,
    crescimentoPosHub: 47,
    percentualPresencial: 54,
    percentualEntrega: 46,
    volumeMensalReais: 740000,
    ticketMedioReais: 61.2,
    tiposMaisVendem: [
      { segmento: 'Mercados, Sacolões & Panificadoras', percentual: 37, tendencia: '+33%' },
      { segmento: 'Farmácias & Laboratórios', percentual: 26, tendencia: '+21%' },
      { segmento: 'Materiais de Construção & Ferragens', percentual: 22, tendencia: '+19%' },
    ],
    tiposMenosAtendidos: ['Moda & Vestuário', 'Papelaria & Brinquedos', 'Restaurantes Noturnos'],
    recomendacaoPrefeitura: 'Alta invisibilidade histórica (72% dos moradores iam ao Centro). O algoritmo de proximidade dobrou a descoberta de lojas a 3 quadras.',
  },
  {
    id: 'aeroporto-londrilar',
    nome: 'Aeroporto / Londrilar / Santos Dumont',
    zona: 'Zona Leste',
    referencia: 'Av. Santos Dumont / Av. Robert Koch (HU)',
    cepFaixa: '86039-000',
    lat: -23.3265,
    lng: -51.1355,
    populacaoEstimada: 69000,
    lojasAtivas: 68,
    intensidadeComercial: 63,
    statusAtividade: 'Em Expansão',
    indiceInvisibilidadeAntesHub: 69,
    crescimentoPosHub: 44,
    percentualPresencial: 49,
    percentualEntrega: 51,
    volumeMensalReais: 690000,
    ticketMedioReais: 66.8,
    tiposMaisVendem: [
      { segmento: 'Alimentação Pronta & Marmitarias', percentual: 35, tendencia: '+37%' },
      { segmento: 'Farmácias & Artigos Hospitalares', percentual: 30, tendencia: '+25%' },
      { segmento: 'Mercados & Conveniências', percentual: 21, tendencia: '+18%' },
    ],
    tiposMenosAtendidos: ['Eletrodomésticos', 'Moda Masculina/Feminina', 'Pet Shop Completo'],
    recomendacaoPrefeitura: 'Forte demanda em torno do Hospital Universitário (HU) e UTFPR. Fomentar comércio de serviços e alimentação rápida.',
  },
  {
    id: 'cafezal-jamile',
    nome: 'Cafezal / Parque Jamile Dequech',
    zona: 'Zona Sul',
    referencia: 'Av. Chepli Tanus Daher / União da Vitória',
    cepFaixa: '86045-000',
    lat: -23.3685,
    lng: -51.1610,
    populacaoEstimada: 54000,
    lojasAtivas: 34,
    intensidadeComercial: 38,
    statusAtividade: 'Baixa (Foco de Incentivo)',
    indiceInvisibilidadeAntesHub: 84,
    crescimentoPosHub: 63,
    percentualPresencial: 68,
    percentualEntrega: 32,
    volumeMensalReais: 310000,
    ticketMedioReais: 47.5,
    tiposMaisVendem: [
      { segmento: 'Mercearias, Açougues & Padarias', percentual: 48, tendencia: '+52%' },
      { segmento: 'Gás, Água & Utilidades Domésticas', percentual: 28, tendencia: '+31%' },
      { segmento: 'Lanches & Açaí de Bairro', percentual: 16, tendencia: '+29%' },
    ],
    tiposMenosAtendidos: ['Farmácias 24h', 'Óticas', 'Lojas de Calçados', 'Assistência Técnica'],
    recomendacaoPrefeitura: 'ÁREA PRIORITÁRIA SDE/CODEL: Deserto comercial parcial em serviços de saúde e vestuário. Recomendado programa de microcrédito Fomento Paraná e isenção de taxa de alvará.',
  },
  {
    id: 'heimtal-norte',
    nome: 'Heimtal / Conjunto Farid Libos',
    zona: 'Zona Norte',
    referencia: 'Patrimônio Heimtal / Estrada da Cegonha',
    cepFaixa: '86088-000',
    lat: -23.2380,
    lng: -51.1680,
    populacaoEstimada: 36000,
    lojasAtivas: 26,
    intensidadeComercial: 32,
    statusAtividade: 'Baixa (Foco de Incentivo)',
    indiceInvisibilidadeAntesHub: 87,
    crescimentoPosHub: 58,
    percentualPresencial: 65,
    percentualEntrega: 35,
    volumeMensalReais: 245000,
    ticketMedioReais: 52.0,
    tiposMaisVendem: [
      { segmento: 'Empórios Rurais, Padarias & Embutidos', percentual: 44, tendencia: '+49%' },
      { segmento: 'Agropecuária, Rações & Jardinagem', percentual: 32, tendencia: '+34%' },
      { segmento: 'Mercados Familiares', percentual: 18, tendencia: '+22%' },
    ],
    tiposMenosAtendidos: ['Farmácias', 'Moda & Confecções', 'Eletrônicos', 'Papelaria'],
    recomendacaoPrefeitura: 'ÁREA PRIORITÁRIA SDE/CODEL: Baixa densidade comercial, mas alto potencial gastronômico e histórico. Incluir no Rota Gastronômica de Bairros.',
  },
];

// ============================================================================
// 3. CATEGORIAS / DEPARTAMENTOS COM ÍCONES 3D (MESMA ESTRUTURA DE ASSAÍ)
// ============================================================================
export const CATEGORIAS_LONDRINA = [
  { id: 1, nome: 'Restaurantes & Cafés', slug: 'restaurantes', icone: '/assets/categories/cat-restaurants.png', totalLojas: 42 },
  { id: 2, nome: 'Mercados de Bairro', slug: 'mercados', icone: '/assets/categories/cat-markets.png', totalLojas: 38 },
  { id: 3, nome: 'Farmácias & Saúde', slug: 'farmacias', icone: '/assets/categories/cat-pharmacy.png', totalLojas: 29 },
  { id: 4, nome: 'Bebidas & Conveniência', slug: 'bebidas', icone: '/assets/categories/cat-drinks.png', totalLojas: 24 },
  { id: 5, nome: 'Moda & Calçados', slug: 'moda', icone: '/assets/categories/cat-fashion.png', totalLojas: 51 },
  { id: 6, nome: 'Pet Shop & Agro', slug: 'pet', icone: '/assets/categories/cat-pets.png', totalLojas: 19 },
  { id: 7, nome: 'Casa & Construção', slug: 'construcao', icone: '/assets/categories/cat-Offers.png', totalLojas: 27 },
  { id: 8, nome: 'Tecnologia & Celulares', slug: 'tecnologia', icone: '/assets/categories/cat-Shopping.png', totalLojas: 22 },
];

// ============================================================================
// 4. LOJAS SEMEADAS DE LONDRINA (DISTRIBUÍDAS PELOS BAIRROS)
// ============================================================================
export const LOJAS_LONDRINA: StoreLondrina[] = [
  {
    id: 101,
    nome: 'Empório & Café Terra Vermelha',
    slug: 'emporio-cafe-terra-vermelha',
    segmento: 'Padarias, Cafés & Empórios',
    segmentoSlug: 'restaurantes',
    categoriaIcone: '/assets/categories/cat-restaurants.png',
    bairroId: 'vila-casoni',
    bairroNome: 'Vila Casoni / Recreio',
    zona: 'Centro-Norte',
    endereco: 'Av. Rio Branco, 890 - Vila Casoni',
    quadraReferencia: 'A 2 quadras da Praça da Vila Casoni',
    lat: -23.2974,
    lng: -51.1595,
    nota: 4.9,
    avaliacoes: 318,
    tempoEntrega: '15-25 min',
    taxaEntrega: 0,
    aceitaRetiradaVizinhanca: true,
    descontoRetiradaBairro: '8% OFF + Café Cortesia retirando na loja (2 quadras)',
    abertaAgora: true,
    horarioFuncionamento: 'Seg a Sáb: 06h30 às 20h00',
    whatsapp: '5543998447711',
    cnpj: '12.345.678/0001-90',
    alvaraVerificadoLondrinaGo: true,
    seloComercioDeBairro: true,
    logoUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=240&auto=format&fit=crop&q=80',
    capaUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1000&auto=format&fit=crop&q=80',
    descricao: 'Torrefação artesanal de cafés especiais do Norte Pioneiro, pães de fermentação natural, queijos coloniais e produtos fresquinhos no coração da Vila Casoni.',
    vendasPresenciaisPct: 68,
    vendasEntregaPct: 32,
    pedidosMes: 845,
  },
  {
    id: 102,
    nome: 'Supermercado Vizinhança Casoni',
    slug: 'supermercado-vizinhanca-casoni',
    segmento: 'Mercados de Bairro',
    segmentoSlug: 'mercados',
    categoriaIcone: '/assets/categories/cat-markets.png',
    bairroId: 'vila-casoni',
    bairroNome: 'Vila Casoni / Recreio',
    zona: 'Centro-Norte',
    endereco: 'Rua Guaporé, 610 - Vila Casoni',
    quadraReferencia: 'A 1 quadra e meia da Rua Tietê',
    lat: -23.2959,
    lng: -51.1578,
    nota: 4.8,
    avaliacoes: 412,
    tempoEntrega: '20-30 min',
    taxaEntrega: 0,
    aceitaRetiradaVizinhanca: true,
    descontoRetiradaBairro: 'Frete Grátis no bairro ou Retire em 10 min',
    abertaAgora: true,
    horarioFuncionamento: 'Seg a Dom: 07h30 às 21h00',
    whatsapp: '5543999112233',
    cnpj: '23.456.789/0001-12',
    alvaraVerificadoLondrinaGo: true,
    seloComercioDeBairro: true,
    logoUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=240&auto=format&fit=crop&q=80',
    capaUrl: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=1000&auto=format&fit=crop&q=80',
    descricao: 'Seu mercado completo a poucas quadras de casa. Açougue selecionado, hortifruti direto do Ceasa Londrina e preços que batem os hipermercados do centro.',
    vendasPresenciaisPct: 64,
    vendasEntregaPct: 36,
    pedidosMes: 1290,
  },
  {
    id: 103,
    nome: 'Farmácia Saúde & Vida Casoni',
    slug: 'farmacia-saude-vida-casoni',
    segmento: 'Farmácias & Saúde',
    segmentoSlug: 'farmacias',
    categoriaIcone: '/assets/categories/cat-pharmacy.png',
    bairroId: 'vila-casoni',
    bairroNome: 'Vila Casoni / Recreio',
    zona: 'Centro-Norte',
    endereco: 'Av. Rio Branco, 1020 - Vila Casoni',
    quadraReferencia: 'Esquina com Rua Tupinambás (a 3 quadras)',
    lat: -23.2981,
    lng: -51.1602,
    nota: 4.9,
    avaliacoes: 195,
    tempoEntrega: '10-20 min',
    taxaEntrega: 0,
    aceitaRetiradaVizinhanca: true,
    descontoRetiradaBairro: 'Entrega expressa grátis em até 15 min na Vila Casoni',
    abertaAgora: true,
    horarioFuncionamento: 'Todos os dias: 07h00 às 23h00',
    whatsapp: '5543999887766',
    cnpj: '34.567.890/0001-34',
    alvaraVerificadoLondrinaGo: true,
    seloComercioDeBairro: true,
    logoUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=240&auto=format&fit=crop&q=80',
    capaUrl: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=1000&auto=format&fit=crop&q=80',
    descricao: 'Medicamentos genéricos com até 70% de desconto, aferição de pressão e entrega ultra-rápida para os moradores da Vila Casoni e Recreio.',
    vendasPresenciaisPct: 55,
    vendasEntregaPct: 45,
    pedidosMes: 620,
  },
  {
    id: 104,
    nome: 'Supermercado Saul Elkind Prime',
    slug: 'supermercado-saul-elkind-prime',
    segmento: 'Mercados de Bairro',
    segmentoSlug: 'mercados',
    categoriaIcone: '/assets/categories/cat-markets.png',
    bairroId: 'cinco-conjuntos',
    bairroNome: 'Cinco Conjuntos (Av. Saul Elkind)',
    zona: 'Zona Norte',
    endereco: 'Av. Saul Elkind, 2140 - Cinco Conjuntos',
    quadraReferencia: 'A 2 quadras da rotatória da Av. Karkará',
    lat: -23.2578,
    lng: -51.1565,
    nota: 4.8,
    avaliacoes: 684,
    tempoEntrega: '20-35 min',
    taxaEntrega: 0,
    aceitaRetiradaVizinhanca: true,
    descontoRetiradaBairro: '5% Cashback Pé-Vermelho para toda a Zona Norte',
    abertaAgora: true,
    horarioFuncionamento: 'Seg a Dom: 07h00 às 22h00',
    whatsapp: '5543991234567',
    cnpj: '45.678.901/0001-56',
    alvaraVerificadoLondrinaGo: true,
    seloComercioDeBairro: true,
    logoUrl: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=240&auto=format&fit=crop&q=80',
    capaUrl: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=1000&auto=format&fit=crop&q=80',
    descricao: 'O gigante da Zona Norte! Carnes nobres, padaria própria e ofertas diárias na Avenida Saul Elkind sem precisar ir até o centro.',
    vendasPresenciaisPct: 60,
    vendasEntregaPct: 40,
    pedidosMes: 1840,
  },
  {
    id: 105,
    nome: 'Burger & Brasa Saul Elkind',
    slug: 'burger-brasa-saul-elkind',
    segmento: 'Restaurantes & Cafés',
    segmentoSlug: 'restaurantes',
    categoriaIcone: '/assets/categories/cat-restaurants.png',
    bairroId: 'cinco-conjuntos',
    bairroNome: 'Cinco Conjuntos (Av. Saul Elkind)',
    zona: 'Zona Norte',
    endereco: 'Av. Saul Elkind, 1780 - Cinco Conjuntos',
    quadraReferencia: 'Ao lado do Banco do Brasil Saul Elkind',
    lat: -23.2592,
    lng: -51.1581,
    nota: 4.9,
    avaliacoes: 530,
    tempoEntrega: '20-30 min',
    taxaEntrega: 3.9,
    aceitaRetiradaVizinhanca: true,
    descontoRetiradaBairro: 'Batata Rústica Grátis na retirada no balcão',
    abertaAgora: true,
    horarioFuncionamento: 'Ter a Dom: 18h00 às 23h45',
    whatsapp: '5543992345678',
    cnpj: '56.789.012/0001-78',
    alvaraVerificadoLondrinaGo: true,
    seloComercioDeBairro: true,
    logoUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=240&auto=format&fit=crop&q=80',
    capaUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=1000&auto=format&fit=crop&q=80',
    descricao: 'Hambúrguer artesanal na parrilla com blend de costela bovina, pão brioche amanteigado e maionese defumada famosa na Zona Norte.',
    vendasPresenciaisPct: 48,
    vendasEntregaPct: 52,
    pedidosMes: 1120,
  },
  {
    id: 106,
    nome: 'Boulangerie & Bistrô Palhano',
    slug: 'boulangerie-bistro-palhano',
    segmento: 'Restaurantes & Cafés',
    segmentoSlug: 'restaurantes',
    categoriaIcone: '/assets/categories/cat-restaurants.png',
    bairroId: 'gleba-palhano',
    bairroNome: 'Gleba Palhano / Aurora',
    zona: 'Zona Sul',
    endereco: 'Av. Ayrton Senna da Silva, 550 - Gleba Palhano',
    quadraReferencia: 'A 2 quadras do Shopping Aurora',
    lat: -23.3318,
    lng: -51.1758,
    nota: 4.9,
    avaliacoes: 490,
    tempoEntrega: '15-25 min',
    taxaEntrega: 0,
    aceitaRetiradaVizinhanca: true,
    descontoRetiradaBairro: 'Entrega Grátis para todos os edifícios da Gleba Palhano',
    abertaAgora: true,
    horarioFuncionamento: 'Seg a Dom: 07h00 às 21h30',
    whatsapp: '5543993456789',
    cnpj: '67.890.123/0001-90',
    alvaraVerificadoLondrinaGo: true,
    seloComercioDeBairro: true,
    logoUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=240&auto=format&fit=crop&q=80',
    capaUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1000&auto=format&fit=crop&q=80',
    descricao: 'Croissants franceses, brunches, cafés especiais e empório gourmet com entrega ultrarrápida nos condomínios da Gleba Palhano.',
    vendasPresenciaisPct: 36,
    vendasEntregaPct: 64,
    pedidosMes: 1450,
  },
  {
    id: 107,
    nome: 'Pet Care & Boutique Lago Igapó',
    slug: 'pet-care-boutique-igapo',
    segmento: 'Pet Shop & Agro',
    segmentoSlug: 'pet',
    categoriaIcone: '/assets/categories/cat-pets.png',
    bairroId: 'gleba-palhano',
    bairroNome: 'Gleba Palhano / Aurora',
    zona: 'Zona Sul',
    endereco: 'Rua Bento Munhoz da Rocha Neto, 820 - Gleba Palhano',
    quadraReferencia: 'A 1 quadra da pista de caminhada do Lago Igapó II',
    lat: -23.3331,
    lng: -51.1774,
    nota: 4.8,
    avaliacoes: 275,
    tempoEntrega: '20-30 min',
    taxaEntrega: 0,
    aceitaRetiradaVizinhanca: true,
    descontoRetiradaBairro: '10% OFF em rações Super Premium retirando no bairro',
    abertaAgora: true,
    horarioFuncionamento: 'Seg a Sáb: 08h00 às 20h00',
    whatsapp: '5543994567890',
    cnpj: '78.901.234/0001-11',
    alvaraVerificadoLondrinaGo: true,
    seloComercioDeBairro: true,
    logoUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=240&auto=format&fit=crop&q=80',
    capaUrl: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=1000&auto=format&fit=crop&q=80',
    descricao: 'Rações super premium, farmácia veterinária, petiscos naturais e acessórios para o seu pet na região da Gleba Palhano e Lago Igapó.',
    vendasPresenciaisPct: 32,
    vendasEntregaPct: 68,
    pedidosMes: 590,
  },
  {
    id: 108,
    nome: 'Casa de Carnes & Mercearia Bandeirantes',
    slug: 'casa-de-carnes-bandeirantes',
    segmento: 'Mercados de Bairro',
    segmentoSlug: 'mercados',
    categoriaIcone: '/assets/categories/cat-markets.png',
    bairroId: 'bandeirantes',
    bairroNome: 'Jardim Bandeirantes / Oeste',
    zona: 'Zona Oeste',
    endereco: 'Rua Serra da Graciosa, 540 - Jardim Bandeirantes',
    quadraReferencia: 'A 2 quadras da Av. Bandeirantes',
    lat: -23.3069,
    lng: -51.1958,
    nota: 4.9,
    avaliacoes: 342,
    tempoEntrega: '15-25 min',
    taxaEntrega: 0,
    aceitaRetiradaVizinhanca: true,
    descontoRetiradaBairro: 'Pão de Alho Artesanal Grátis em compras acima de R$ 80 no bairro',
    abertaAgora: true,
    horarioFuncionamento: 'Ter a Dom: 07h30 às 20h00',
    whatsapp: '5543995678901',
    cnpj: '89.012.345/0001-22',
    alvaraVerificadoLondrinaGo: true,
    seloComercioDeBairro: true,
    logoUrl: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=240&auto=format&fit=crop&q=80',
    capaUrl: 'https://images.unsplash.com/photo-1558030006-450675393462?w=1000&auto=format&fit=crop&q=80',
    descricao: 'Cortes selecionados para churrasco, hortifruti fresquinho e mercearia completa no Jardim Bandeirantes. Você não precisa atravessar a cidade!',
    vendasPresenciaisPct: 58,
    vendasEntregaPct: 42,
    pedidosMes: 730,
  },
  {
    id: 109,
    nome: 'Drogaria Popular Santos Dumont',
    slug: 'drogaria-popular-santos-dumont',
    segmento: 'Farmácias & Saúde',
    segmentoSlug: 'farmacias',
    categoriaIcone: '/assets/categories/cat-pharmacy.png',
    bairroId: 'aeroporto-londrilar',
    bairroNome: 'Aeroporto / Londrilar / Santos Dumont',
    zona: 'Zona Leste',
    endereco: 'Av. Santos Dumont, 1120 - Aeroporto',
    quadraReferencia: 'A 2 quadras da Praça Nishinomiya (Aeroporto)',
    lat: -23.3258,
    lng: -51.1362,
    nota: 4.8,
    avaliacoes: 289,
    tempoEntrega: '15-25 min',
    taxaEntrega: 0,
    aceitaRetiradaVizinhanca: true,
    descontoRetiradaBairro: 'Desconto Vizinhança Zona Leste + Entrega em 15 min',
    abertaAgora: true,
    horarioFuncionamento: '24 Horas (Plantão Zona Leste)',
    whatsapp: '5543996789012',
    cnpj: '90.123.456/0001-33',
    alvaraVerificadoLondrinaGo: true,
    seloComercioDeBairro: true,
    logoUrl: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=240&auto=format&fit=crop&q=80',
    capaUrl: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=1000&auto=format&fit=crop&q=80',
    descricao: 'Farmácia 24h na Zona Leste de Londrina. Medicamentos, dermocosméticos e linha infantil com entrega imediata nos bairros Aeroporto e Londrilar.',
    vendasPresenciaisPct: 50,
    vendasEntregaPct: 50,
    pedidosMes: 810,
  },
  {
    id: 110,
    nome: 'Calçadão Tech & Magazine Londrina',
    slug: 'calcadao-tech-magazine-londrina',
    segmento: 'Tecnologia & Celulares',
    segmentoSlug: 'tecnologia',
    categoriaIcone: '/assets/categories/cat-Shopping.png',
    bairroId: 'centro-historico',
    bairroNome: 'Centro / Calçadão & Higienópolis',
    zona: 'Centro',
    endereco: 'Av. Paraná, 420 - Calçadão de Londrina',
    quadraReferencia: 'Em frente ao Teatro Ouro Verde (Calçadão)',
    lat: -23.3109,
    lng: -51.1632,
    nota: 4.7,
    avaliacoes: 820,
    tempoEntrega: '35-50 min',
    taxaEntrega: 7.9,
    aceitaRetiradaVizinhanca: true,
    descontoRetiradaBairro: 'Película 3D Cortesia retirando na loja do Calçadão',
    abertaAgora: true,
    horarioFuncionamento: 'Seg a Sáb: 08h30 às 18h30',
    whatsapp: '5543997890123',
    cnpj: '01.234.567/0001-44',
    alvaraVerificadoLondrinaGo: true,
    seloComercioDeBairro: false,
    logoUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=240&auto=format&fit=crop&q=80',
    capaUrl: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1000&auto=format&fit=crop&q=80',
    descricao: 'Smartphones, notebooks, acessórios originais e eletroportáteis com garantia oficial no Calçadão de Londrina.',
    vendasPresenciaisPct: 74,
    vendasEntregaPct: 26,
    pedidosMes: 1590,
  },
  {
    id: 111,
    nome: 'Sacolão & Mercearia Família Cafezal',
    slug: 'sacolao-mercearia-familia-cafezal',
    segmento: 'Mercados de Bairro',
    segmentoSlug: 'mercados',
    categoriaIcone: '/assets/categories/cat-markets.png',
    bairroId: 'cafezal-jamile',
    bairroNome: 'Cafezal / Parque Jamile Dequech',
    zona: 'Zona Sul',
    endereco: 'Av. Chepli Tanus Daher, 390 - Cafezal',
    quadraReferencia: 'A 2 quadras da UBS Cafezal',
    lat: -23.3679,
    lng: -51.1604,
    nota: 4.9,
    avaliacoes: 215,
    tempoEntrega: '15-25 min',
    taxaEntrega: 0,
    aceitaRetiradaVizinhanca: true,
    descontoRetiradaBairro: 'Selo Incentivo SDE • Frete 100% Grátis no Cafezal e Jamile Dequech',
    abertaAgora: true,
    horarioFuncionamento: 'Seg a Dom: 07h00 às 20h30',
    whatsapp: '5543998901234',
    cnpj: '11.223.344/0001-55',
    alvaraVerificadoLondrinaGo: true,
    seloComercioDeBairro: true,
    logoUrl: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=240&auto=format&fit=crop&q=80',
    capaUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1000&auto=format&fit=crop&q=80',
    descricao: 'Frutas, verduras de produtores locais da Zona Sul de Londrina, pães quentinhos e cesta básica com preço justo a duas quadras da sua casa.',
    vendasPresenciaisPct: 70,
    vendasEntregaPct: 30,
    pedidosMes: 480,
  },
  {
    id: 112,
    nome: 'Empório Colonial Heimtal 1934',
    slug: 'emporio-colonial-heimtal-1934',
    segmento: 'Padarias, Cafés & Empórios',
    segmentoSlug: 'restaurantes',
    categoriaIcone: '/assets/categories/cat-restaurants.png',
    bairroId: 'heimtal-norte',
    bairroNome: 'Heimtal / Conjunto Farid Libos',
    zona: 'Zona Norte',
    endereco: 'Rua Ângelo Mioto, 210 - Patrimônio Heimtal',
    quadraReferencia: 'Ao lado da Praça Histórica do Heimtal',
    lat: -23.2375,
    lng: -51.1674,
    nota: 5.0,
    avaliacoes: 184,
    tempoEntrega: '20-35 min',
    taxaEntrega: 0,
    aceitaRetiradaVizinhanca: true,
    descontoRetiradaBairro: 'Degustação Colonial + 10% OFF na retirada no Patrimônio Heimtal',
    abertaAgora: true,
    horarioFuncionamento: 'Ter a Dom: 08h00 às 19h30',
    whatsapp: '5543999012345',
    cnpj: '22.334.455/0001-66',
    alvaraVerificadoLondrinaGo: true,
    seloComercioDeBairro: true,
    logoUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=240&auto=format&fit=crop&q=80',
    capaUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1000&auto=format&fit=crop&q=80',
    descricao: 'Tradição pioneira de Londrina desde 1934! Cucas alemãs, embutidos artesanais, geleias caseiras e café torrado na lenha no Patrimônio Heimtal.',
    vendasPresenciaisPct: 66,
    vendasEntregaPct: 34,
    pedidosMes: 410,
  },
];

// ============================================================================
// 5. PRODUTOS SEMEADOS (COM SKU_FAMILIA PARA COMPARADOR E ORIGEM DE BAIRRO)
// ============================================================================
export const PRODUTOS_LONDRINA: ProductLondrina[] = [
  // Vila Casoni Products (Very close when user is in Vila Casoni)
  {
    id: 1001,
    nome: 'Café Especial Pé-Vermelho Torra Média 500g (Grãos ou Moído)',
    slug: 'cafe-especial-pe-vermelho-500g-casoni',
    descricao: 'Café 100% Arábica cultivado na Terra Roxa da região de Londrina. Notas de chocolate amargo e caramelo, torrado semanalmente na Vila Casoni.',
    preco: 34.9,
    precoPromocional: 28.9,
    unidade: 'pacote 500g',
    categoria: 'Restaurantes & Cafés',
    categoriaSlug: 'restaurantes',
    skuFamilia: 'cafe-500g-londrina',
    imagemUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&auto=format&fit=crop&q=80',
    estoque: 48,
    destaqueBairro: true,
    disponivelRetiradaImediata: true,
    tempoPreparoMin: 5,
    vendasMes: 320,
    storeId: 101,
  },
  {
    id: 1002,
    nome: 'Combo Café da Manhã Casoni (Pão Sourdough + Queijo Frescal + Bolo de Milho)',
    slug: 'combo-cafe-da-manha-casoni',
    descricao: 'Ideal para buscar a 2 quadras de casa: 1 filão de fermentação natural quentinho, 1 queijo minas frescal de produtor local e 1 bolo cremoso de milho.',
    preco: 49.9,
    precoPromocional: 39.9,
    unidade: 'combo',
    categoria: 'Restaurantes & Cafés',
    categoriaSlug: 'restaurantes',
    imagemUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
    estoque: 22,
    destaqueBairro: true,
    disponivelRetiradaImediata: true,
    tempoPreparoMin: 10,
    vendasMes: 215,
    storeId: 101,
  },
  {
    id: 1003,
    nome: 'Arroz Branco Tipo 1 Parboilizado 5kg — Safra Paraná',
    slug: 'arroz-tipo-1-5kg-casoni',
    descricao: 'Arroz soltinho de alta qualidade. Preço de atacado direto no mercado do seu bairro sem gastar combustível até o centro.',
    preco: 29.9,
    precoPromocional: 24.5,
    unidade: 'pacote 5kg',
    categoria: 'Mercados de Bairro',
    categoriaSlug: 'mercados',
    skuFamilia: 'arroz-5kg',
    imagemUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
    estoque: 85,
    destaqueBairro: true,
    disponivelRetiradaImediata: true,
    tempoPreparoMin: 5,
    vendasMes: 410,
    storeId: 102,
  },
  {
    id: 1004,
    nome: 'Cesta Hortifruti Ceasa Londrina (12 Itens Selecionados da Estação)',
    slug: 'cesta-hortifruti-ceasa-londrina-casoni',
    descricao: 'Banana nanica, maçã gala, mamão formosa, tomate italiano, batata inglesa, cenoura, alface americana, rúcula, cebola e tempero verde.',
    preco: 58.0,
    precoPromocional: 44.9,
    unidade: 'cesta 6,5kg',
    categoria: 'Mercados de Bairro',
    categoriaSlug: 'mercados',
    skuFamilia: 'cesta-hortifruti',
    imagemUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80',
    estoque: 30,
    destaqueBairro: true,
    disponivelRetiradaImediata: true,
    tempoPreparoMin: 15,
    vendasMes: 290,
    storeId: 102,
  },
  {
    id: 1005,
    nome: 'Kit Imunidade & Vitamina C 1g + Zinco (30 Comprimidos Efervescentes)',
    slug: 'kit-imunidade-vitamina-c-zinco-casoni',
    descricao: 'Suplemento diário de Vitamina C 1000mg com Zinco Quelato. Disponível a 3 quadras na Farmácia Saúde & Vida Casoni.',
    preco: 36.9,
    precoPromocional: 24.9,
    unidade: 'caixa 30 un',
    categoria: 'Farmácias & Saúde',
    categoriaSlug: 'farmacias',
    skuFamilia: 'vitamina-c-zinco',
    imagemUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
    estoque: 60,
    destaqueBairro: true,
    disponivelRetiradaImediata: true,
    tempoPreparoMin: 5,
    vendasMes: 185,
    storeId: 103,
  },

  // Cinco Conjuntos / Zona Norte Products
  {
    id: 1006,
    nome: 'Arroz Branco Tipo 1 Especial 5kg — Oferta Saul Elkind',
    slug: 'arroz-tipo-1-5kg-saul-elkind',
    descricao: 'Oferta exclusiva do Supermercado Saul Elkind Prime para moradores dos Cinco Conjuntos e Zona Norte.',
    preco: 28.9,
    precoPromocional: 23.9,
    unidade: 'pacote 5kg',
    categoria: 'Mercados de Bairro',
    categoriaSlug: 'mercados',
    skuFamilia: 'arroz-5kg',
    imagemUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
    estoque: 140,
    destaqueBairro: true,
    disponivelRetiradaImediata: true,
    tempoPreparoMin: 5,
    vendasMes: 630,
    storeId: 104,
  },
  {
    id: 1007,
    nome: 'Kit Churrasco Dominguera Norte (Picanha Maturada 1,2kg + Linguiça Toscana + Pão de Alho)',
    slug: 'kit-churrasco-saul-elkind',
    descricao: 'O kit mais vendido da Zona Norte de Londrina. Cortes frescos preparados pelo açougueiro na hora.',
    preco: 139.9,
    precoPromocional: 114.9,
    unidade: 'kit 2,2kg',
    categoria: 'Mercados de Bairro',
    categoriaSlug: 'mercados',
    skuFamilia: 'kit-churrasco',
    imagemUrl: 'https://images.unsplash.com/photo-1558030006-450675393462?w=600&auto=format&fit=crop&q=80',
    estoque: 40,
    destaqueBairro: true,
    disponivelRetiradaImediata: true,
    tempoPreparoMin: 15,
    vendasMes: 380,
    storeId: 104,
  },
  {
    id: 1008,
    nome: 'Combo Duplo Smash Saul Elkind (2 Burgers Costela 180g + Fritas Cheddar & Bacon + 2 Latas)',
    slug: 'combo-duplo-smash-saul-elkind',
    descricao: 'Dois hambúrgueres artesanais grelhados no fogo com queijo cheddar inglês, cebola caramelizada e batata frita crocante.',
    preco: 74.9,
    precoPromocional: 59.9,
    unidade: 'combo 2 pessoas',
    categoria: 'Restaurantes & Cafés',
    categoriaSlug: 'restaurantes',
    imagemUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
    estoque: 50,
    destaqueBairro: true,
    disponivelRetiradaImediata: true,
    tempoPreparoMin: 20,
    vendasMes: 540,
    storeId: 105,
  },

  // Gleba Palhano / Zona Sul Products
  {
    id: 1009,
    nome: 'Café Especial Pé-Vermelho Microlote Bourbon Amarelo 500g',
    slug: 'cafe-especial-bourbon-amarelo-palhano',
    descricao: 'Torra artesanal para espresso e coados na Gleba Palhano. Pontuação 86 SCA.',
    preco: 42.0,
    precoPromocional: 34.9,
    unidade: 'pacote 500g',
    categoria: 'Restaurantes & Cafés',
    categoriaSlug: 'restaurantes',
    skuFamilia: 'cafe-500g-londrina',
    imagemUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&auto=format&fit=crop&q=80',
    estoque: 65,
    destaqueBairro: true,
    disponivelRetiradaImediata: true,
    tempoPreparoMin: 5,
    vendasMes: 410,
    storeId: 106,
  },
  {
    id: 1010,
    nome: 'Box Brunch Lago Igapó (2 Croissants Amanteigados + Pain au Chocolat + Suco Natural + Café)',
    slug: 'box-brunch-lago-igapo-palhano',
    descricao: 'Perfeito para manhãs na Gleba Palhano ou piquenique no Lago Igapó. Entrega grátis nos condomínios da Zona Sul.',
    preco: 84.0,
    precoPromocional: 68.9,
    unidade: 'box completo',
    categoria: 'Restaurantes & Cafés',
    categoriaSlug: 'restaurantes',
    imagemUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop&q=80',
    estoque: 25,
    destaqueBairro: true,
    disponivelRetiradaImediata: true,
    tempoPreparoMin: 15,
    vendasMes: 365,
    storeId: 106,
  },
  {
    id: 1011,
    nome: 'Ração Super Premium Cães Adultos Raças Pequenas 10,1kg',
    slug: 'racao-super-premium-caes-10kg-palhano',
    descricao: 'Sem corantes artificiais, rica em ômega 3 e 6. Entrega em até 25 minutos na Gleba Palhano.',
    preco: 219.9,
    precoPromocional: 189.9,
    unidade: 'saco 10,1kg',
    categoria: 'Pet Shop & Agro',
    categoriaSlug: 'pet',
    imagemUrl: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=600&auto=format&fit=crop&q=80',
    estoque: 32,
    destaqueBairro: true,
    disponivelRetiradaImediata: true,
    tempoPreparoMin: 10,
    vendasMes: 210,
    storeId: 107,
  },

  // Jardim Bandeirantes / Zona Oeste Products
  {
    id: 1012,
    nome: 'Kit Churrasco Família Bandeirantes (Contrafilé 1,5kg + Linguiça Pura + Carvão 4kg)',
    slug: 'kit-churrasco-bandeirantes',
    descricao: 'Qualidade garantida na Zona Oeste de Londrina! Retire a 2 quadras da Av. Bandeirantes e ganhe pão de alho.',
    preco: 129.9,
    precoPromocional: 108.9,
    unidade: 'kit completo',
    categoria: 'Mercados de Bairro',
    categoriaSlug: 'mercados',
    skuFamilia: 'kit-churrasco',
    imagemUrl: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=600&auto=format&fit=crop&q=80',
    estoque: 28,
    destaqueBairro: true,
    disponivelRetiradaImediata: true,
    tempoPreparoMin: 10,
    vendasMes: 275,
    storeId: 108,
  },
  {
    id: 1013,
    nome: 'Arroz Branco Tipo 1 Selecionado 5kg — Mercearia Bandeirantes',
    slug: 'arroz-tipo-1-5kg-bandeirantes',
    descricao: 'Compre no seu próprio bairro na Zona Oeste com preço menor que nos grandes centros.',
    preco: 29.5,
    precoPromocional: 24.9,
    unidade: 'pacote 5kg',
    categoria: 'Mercados de Bairro',
    categoriaSlug: 'mercados',
    skuFamilia: 'arroz-5kg',
    imagemUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
    estoque: 54,
    destaqueBairro: true,
    disponivelRetiradaImediata: true,
    tempoPreparoMin: 5,
    vendasMes: 198,
    storeId: 108,
  },

  // Aeroporto / Zona Leste Products
  {
    id: 1014,
    nome: 'Kit Imunidade & Vitamina C 1g + Zinco (30 Comprimidos) — Plantão Zona Leste',
    slug: 'kit-imunidade-vitamina-c-santos-dumont',
    descricao: 'Pronta entrega 24h na Av. Santos Dumont para toda a região do Aeroporto, Londrilar e HU.',
    preco: 35.9,
    precoPromocional: 23.9,
    unidade: 'caixa 30 un',
    categoria: 'Farmácias & Saúde',
    categoriaSlug: 'farmacias',
    skuFamilia: 'vitamina-c-zinco',
    imagemUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
    estoque: 90,
    destaqueBairro: true,
    disponivelRetiradaImediata: true,
    tempoPreparoMin: 5,
    vendasMes: 310,
    storeId: 109,
  },

  // Centro / Calçadão Products
  {
    id: 1015,
    nome: 'Smartphone 5G 256GB 8GB RAM Tela Super AMOLED 120Hz (Garantia Nacional)',
    slug: 'smartphone-5g-256gb-calcadao-londrina',
    descricao: 'Retire na hora no Calçadão de Londrina com película 3D instalada grátis ou receba em casa com nota fiscal.',
    preco: 1899.0,
    precoPromocional: 1549.0,
    unidade: 'unidade',
    categoria: 'Tecnologia & Celulares',
    categoriaSlug: 'tecnologia',
    imagemUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80',
    estoque: 18,
    destaqueBairro: false,
    disponivelRetiradaImediata: true,
    tempoPreparoMin: 15,
    vendasMes: 142,
    storeId: 110,
  },

  // Cafezal / Jamile Dequech (Zona Sul Incentivada)
  {
    id: 1016,
    nome: 'Cesta Hortifruti Familiar Cafezal (14 Itens Direto da Roça Sul de Londrina)',
    slug: 'cesta-hortifruti-familiar-cafezal',
    descricao: 'Colhido hoje por agricultores familiares do cinturão verde da Zona Sul de Londrina. Economia real a 2 quadras da sua casa!',
    preco: 52.0,
    precoPromocional: 38.9,
    unidade: 'cesta 7kg',
    categoria: 'Mercados de Bairro',
    categoriaSlug: 'mercados',
    skuFamilia: 'cesta-hortifruti',
    imagemUrl: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&auto=format&fit=crop&q=80',
    estoque: 45,
    destaqueBairro: true,
    disponivelRetiradaImediata: true,
    tempoPreparoMin: 10,
    vendasMes: 260,
    storeId: 111,
  },

  // Heimtal (Extremo Norte)
  {
    id: 1017,
    nome: 'Cuca Alemã Artesanal do Heimtal (Banana com Farofa Amanteigada de Canela)',
    slug: 'cuca-alema-artesanal-heimtal',
    descricao: 'Receita centenária das famílias fundadoras do Patrimônio Heimtal em Londrina. Assada no forno a lenha.',
    preco: 32.0,
    precoPromocional: 26.9,
    unidade: 'forma 650g',
    categoria: 'Restaurantes & Cafés',
    categoriaSlug: 'restaurantes',
    imagemUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
    estoque: 20,
    destaqueBairro: true,
    disponivelRetiradaImediata: true,
    tempoPreparoMin: 10,
    vendasMes: 195,
    storeId: 112,
  },
];

// ============================================================================
// 6. STORIES DAS LOJAS DE BAIRRO DE LONDRINA
// ============================================================================
export const STORIES_LONDRINA: StoryLondrina[] = [
  {
    id: 1,
    storeId: 101,
    storeNome: 'Empório Terra Vermelha',
    storeSlug: 'emporio-cafe-terra-vermelha',
    bairroNome: 'Vila Casoni',
    avatarUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=200&auto=format&fit=crop&q=80',
    mediaUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=80',
    legenda: 'Fornada de pão sourdough e café Pé-Vermelho recém-torrado aqui na Vila Casoni! Passe a 2 quadras de casa ☕🥖',
    precoDestaque: 'R$ 28,90',
    tempoAtras: 'há 12 min',
  },
  {
    id: 2,
    storeId: 104,
    storeNome: 'Saul Elkind Prime',
    storeSlug: 'supermercado-saul-elkind-prime',
    bairroNome: 'Cinco Conjuntos',
    avatarUrl: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=200&auto=format&fit=crop&q=80',
    mediaUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80',
    legenda: 'Terça e Quarta Verde na Av. Saul Elkind! Não precisa pegar trânsito até o centro.',
    precoDestaque: 'Arroz 5kg R$ 23,90',
    tempoAtras: 'há 25 min',
  },
  {
    id: 3,
    storeId: 106,
    storeNome: 'Bistrô Palhano',
    storeSlug: 'boulangerie-bistro-palhano',
    bairroNome: 'Gleba Palhano',
    avatarUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&auto=format&fit=crop&q=80',
    mediaUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&auto=format&fit=crop&q=80',
    legenda: 'Box Brunch Lago Igapó saindo quentinho com entrega grátis em toda a Gleba Palhano! 🥐✨',
    precoDestaque: 'R$ 68,90',
    tempoAtras: 'há 38 min',
  },
  {
    id: 4,
    storeId: 108,
    storeNome: 'Carnes Bandeirantes',
    storeSlug: 'casa-de-carnes-bandeirantes',
    bairroNome: 'Jd. Bandeirantes',
    avatarUrl: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=200&auto=format&fit=crop&q=80',
    mediaUrl: 'https://images.unsplash.com/photo-1558030006-450675393462?w=800&auto=format&fit=crop&q=80',
    legenda: 'Kit Churrasco completo no Jardim Bandeirantes + Pão de Alho cortesia retirando na loja! 🔥🥩',
    precoDestaque: 'R$ 108,90',
    tempoAtras: 'há 1h',
  },
  {
    id: 5,
    storeId: 111,
    storeNome: 'Sacolão Cafezal',
    storeSlug: 'sacolao-mercearia-familia-cafezal',
    bairroNome: 'Cafezal / Sul',
    avatarUrl: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=200&auto=format&fit=crop&q=80',
    mediaUrl: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800&auto=format&fit=crop&q=80',
    legenda: 'Cesta Hortifruti 7kg direto dos produtores da Zona Sul de Londrina com Frete Grátis no bairro!',
    precoDestaque: 'R$ 38,90',
    tempoAtras: 'há 1h 20m',
  },
  {
    id: 6,
    storeId: 112,
    storeNome: 'Empório Heimtal 1934',
    storeSlug: 'emporio-colonial-heimtal-1934',
    bairroNome: 'Heimtal',
    avatarUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop&q=80',
    mediaUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80',
    legenda: 'Cuca Alemã tradicional do Patrimônio Heimtal saindo do forno a lenha!',
    precoDestaque: 'R$ 26,90',
    tempoAtras: 'há 2h',
  },
];

// ============================================================================
// 7. CUPONS MUNICIPAIS & CAMPANHAS DE INCENTIVO DE BAIRRO
// ============================================================================
export const CUPONS_LONDRINA = [
  {
    codigo: 'BAIRROFORTE15',
    titulo: 'R$ 15 OFF no Comércio do Seu Bairro',
    descricao: 'Válido para pedidos em lojas localizadas a menos de 1,5 km da sua residência em Londrina.',
    descontoReais: 15,
    pedidoMinimo: 50,
    tag: 'Hub de Bairros • CODEL',
  },
  {
    codigo: 'PEVERMELHO10',
    titulo: '10% OFF + Dobro de Pontos LondrinaGO',
    descricao: 'Exclusivo para cidadãos autenticados via Login Único LondrinaGO / LondrinaON.',
    descontoReais: 12,
    pedidoMinimo: 40,
    tag: 'LondrinaGO Oficial',
  },
  {
    codigo: 'RETIRADA2QUADRAS',
    titulo: 'R$ 10 OFF na Retirada Presencial no Bairro',
    descricao: 'Incentivo à caminhabilidade: compre pelo app e retire caminhando na loja vizinha.',
    descontoReais: 10,
    pedidoMinimo: 30,
    tag: 'Mobilidade Urbana',
  },
];

// ============================================================================
// 8. DADOS DA SECRETARIA DE DESENVOLVIMENTO ECONÔMICO (SDE / CODEL)
// ============================================================================
export const SEGMENTOS_EVIDENCIA_LONDRINA: EconomicSegmentEvidence[] = [
  {
    segmento: 'Gastronomia, Cafeterias & Padarias Artesanais',
    icone: 'Coffee',
    statusEvidencia: 'Alta Evidência',
    scoreEvidencia: 94,
    buscasMensais: 48200,
    taxaConversaoPct: 18.4,
    faturamentoMensal: 3120000,
    presencialPct: 47,
    entregaPct: 53,
    crescimentoMensalPct: 31.5,
    regiaoDominante: 'Gleba Palhano (Sul) & Cinco Conjuntos (Norte)',
    regiaoCarente: 'Cafezal / Jamile Dequech (Sul)',
    diagnosticoSDE: 'Segmento líder em engajamento digital. Cafeterias de bairro cresceram 42% após priorização de raio de 500m.',
  },
  {
    segmento: 'Mercados de Vizinhança, Açougues & Hortifruti',
    icone: 'ShoppingBag',
    statusEvidencia: 'Alta Evidência',
    scoreEvidencia: 91,
    buscasMensais: 43900,
    taxaConversaoPct: 21.2,
    faturamentoMensal: 2940000,
    presencialPct: 63,
    entregaPct: 37,
    crescimentoMensalPct: 28.0,
    regiaoDominante: 'Cinco Conjuntos (Norte) & Vila Casoni',
    regiaoCarente: 'Heimtal (Extremo Norte)',
    diagnosticoSDE: 'Maior retenção de renda nos bairros: 63% das compras ocorrem com retirada presencial a menos de 4 quadras.',
  },
  {
    segmento: 'Farmácias, Drogarias & Saúde Bem-Estar',
    icone: 'HeartPulse',
    statusEvidencia: 'Alta Evidência',
    scoreEvidencia: 86,
    buscasMensais: 35100,
    taxaConversaoPct: 24.6,
    faturamentoMensal: 1850000,
    presencialPct: 52,
    entregaPct: 48,
    crescimentoMensalPct: 19.4,
    regiaoDominante: 'Centro & Aeroporto/HU (Leste)',
    regiaoCarente: 'Cafezal & Heimtal (Sem plantão 24h local)',
    diagnosticoSDE: 'Equilíbrio entre balcão (52%) e delivery (48%). Identificada lacuna de plantão noturno no extremo sul.',
  },
  {
    segmento: 'Moda, Calçados & Acessórios',
    icone: 'Shirt',
    statusEvidencia: 'Média Evidência',
    scoreEvidencia: 68,
    buscasMensais: 27400,
    taxaConversaoPct: 11.8,
    faturamentoMensal: 1410000,
    presencialPct: 74,
    entregaPct: 26,
    crescimentoMensalPct: 14.2,
    regiaoDominante: 'Centro (Calçadão de Londrina)',
    regiaoCarente: 'Zona Oeste (Bandeirantes) & Zona Leste',
    diagnosticoSDE: 'Historicamente hiper-concentrado no Calçadão. Lojas de bairro na Av. Saul Elkind começam a ganhar tração.',
  },
  {
    segmento: 'Pet Shops, Rações & Clínicas Veterinárias',
    icone: 'PawPrint',
    statusEvidencia: 'Média Evidência',
    scoreEvidencia: 64,
    buscasMensais: 19800,
    taxaConversaoPct: 16.5,
    faturamentoMensal: 890000,
    presencialPct: 41,
    entregaPct: 59,
    crescimentoMensalPct: 22.1,
    regiaoDominante: 'Gleba Palhano / Lago Igapó',
    regiaoCarente: 'Zona Leste & Cafezal',
    diagnosticoSDE: 'Forte recorrência mensal de entregas de ração pesada (59% delivery).',
  },
  {
    segmento: 'Materiais de Construção, Elétrica & Ferragens de Bairro',
    icone: 'Hammer',
    statusEvidencia: 'Baixa Evidência (Invisível nos Bairros)',
    scoreEvidencia: 39,
    buscasMensais: 14200,
    taxaConversaoPct: 7.4,
    faturamentoMensal: 520000,
    presencialPct: 78,
    entregaPct: 22,
    crescimentoMensalPct: 8.5,
    regiaoDominante: 'Av. Tiradentes / Bandeirantes',
    regiaoCarente: 'Vila Casoni, Gleba Palhano & Zona Sul',
    diagnosticoSDE: 'ALERTA SDE: 74% dos pequenos depósitos de bairro ainda não digitalizaram catálogo. Prioridade para mutirão de capacitação SEBRAE/CODEL.',
  },
  {
    segmento: 'Papelarias, Livrarias & Armarinhos Locais',
    icone: 'BookOpen',
    statusEvidencia: 'Baixa Evidência (Invisível nos Bairros)',
    scoreEvidencia: 31,
    buscasMensais: 9600,
    taxaConversaoPct: 6.2,
    faturamentoMensal: 280000,
    presencialPct: 81,
    entregaPct: 19,
    crescimentoMensalPct: 5.1,
    regiaoDominante: 'Centro Histórico',
    regiaoCarente: 'Cinco Conjuntos, Bandeirantes & Zona Leste',
    diagnosticoSDE: 'ALERTA SDE: Moradores percorrem até 8 km até o Centro para comprar itens escolares simples que existem a 3 quadras de casa.',
  },
  {
    segmento: 'Assistência Técnica, Costureiras & Reparos Domésticos',
    icone: 'Wrench',
    statusEvidencia: 'Baixa Evidência (Invisível nos Bairros)',
    scoreEvidencia: 27,
    buscasMensais: 11300,
    taxaConversaoPct: 5.8,
    faturamentoMensal: 195000,
    presencialPct: 88,
    entregaPct: 12,
    crescimentoMensalPct: 6.4,
    regiaoDominante: 'Centro',
    regiaoCarente: 'Todos os bairros periféricos',
    diagnosticoSDE: 'ALERTA SDE: Alta procura pelos cidadãos, mas baixíssimo cadastro digital de MEIs de bairro. Recomendado programa "MEI Visível no Bairro".',
  },
];

// ============================================================================
// 9. PEDIDOS SEMEADOS (HISTÓRICO PARA CIDADÃO, LOJISTA E ADMIN)
// ============================================================================
export const PEDIDOS_SEED: OrderLondrina[] = [
  {
    id: 'ped-1',
    codigo: '#LON-9084',
    dataHora: 'Hoje, 10:42',
    clienteNome: 'Carlos Eduardo Pé-Vermelho',
    clienteBairro: 'Vila Casoni / Recreio',
    storeId: 101,
    storeNome: 'Empório & Café Terra Vermelha',
    storeBairro: 'Vila Casoni / Recreio',
    modalidade: 'Retirada no Bairro (Presencial)',
    status: 'Pronto para retirada (a 2 quadras)',
    valorTotal: 68.8,
    economiaFreteBairro: 14.9,
    itens: [
      { nome: 'Café Especial Pé-Vermelho Torra Média 500g', qtd: 1, precoUnit: 28.9 },
      { nome: 'Combo Café da Manhã Casoni (Sourdough + Queijo)', qtd: 1, precoUnit: 39.9 },
    ],
  },
  {
    id: 'ped-2',
    codigo: '#LON-9071',
    dataHora: 'Ontem, 19:15',
    clienteNome: 'Carlos Eduardo Pé-Vermelho',
    clienteBairro: 'Vila Casoni / Recreio',
    storeId: 102,
    storeNome: 'Supermercado Vizinhança Casoni',
    storeBairro: 'Vila Casoni / Recreio',
    modalidade: 'Entrega Rápida Local',
    status: 'Entregue / Retirado',
    valorTotal: 69.4,
    economiaFreteBairro: 12.0,
    itens: [
      { nome: 'Arroz Branco Tipo 1 Parboilizado 5kg', qtd: 1, precoUnit: 24.5 },
      { nome: 'Cesta Hortifruti Ceasa Londrina (12 Itens)', qtd: 1, precoUnit: 44.9 },
    ],
  },
  {
    id: 'ped-3',
    codigo: '#LON-9065',
    dataHora: 'Há 2 dias, 14:20',
    clienteNome: 'Fernanda M. (Vizinha Rua Tietê)',
    clienteBairro: 'Vila Casoni / Recreio',
    storeId: 101,
    storeNome: 'Empório & Café Terra Vermelha',
    storeBairro: 'Vila Casoni / Recreio',
    modalidade: 'Retirada no Bairro (Presencial)',
    status: 'Entregue / Retirado',
    valorTotal: 57.8,
    economiaFreteBairro: 11.5,
    itens: [
      { nome: 'Café Especial Pé-Vermelho Torra Média 500g', qtd: 2, precoUnit: 28.9 },
    ],
  },
  {
    id: 'ped-4',
    codigo: '#LON-9059',
    dataHora: 'Há 3 dias, 20:05',
    clienteNome: 'Marcos Vinícius Souza',
    clienteBairro: 'Cinco Conjuntos (Av. Saul Elkind)',
    storeId: 105,
    storeNome: 'Burger & Brasa Saul Elkind',
    storeBairro: 'Cinco Conjuntos (Av. Saul Elkind)',
    modalidade: 'Entrega Rápida Local',
    status: 'Entregue / Retirado',
    valorTotal: 59.9,
    economiaFreteBairro: 15.0,
    itens: [
      { nome: 'Combo Duplo Smash Saul Elkind', qtd: 1, precoUnit: 59.9 },
    ],
  },
];

// ============================================================================
// 10. ALGORITMO DO HUB DE BAIRROS (CÁLCULO HAVERSINE, QUADRAS E PRIORIZAÇÃO)
// ============================================================================
export interface ProximityInfo {
  distanceKm: number;
  distanceMeters: number;
  quadrasEstimadas: number;
  isSameBairro: boolean;
  isVizinhoProximo: boolean; // <= 2.2 km
  badgeTexto: string;
  tempoCaminhadaMin: number;
  economiaDeslocamentoCentroReais: number;
  prioridadeScore: number; // Higher = ranked first
}

export function calcularDistanciaHaversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function calcularProximidadeBairro(
  bairroUsuario: BairroLondrina,
  loja: StoreLondrina
): ProximityInfo {
  const rawKm = calcularDistanciaHaversineKm(
    bairroUsuario.lat,
    bairroUsuario.lng,
    loja.lat,
    loja.lng
  );

  const isSameBairro = bairroUsuario.id === loja.bairroId;
  // When in the same neighborhood, simulate realistic 150m - 450m (1 to 4 blocks)
  const effectiveKm = isSameBairro ? Math.max(0.16, Math.min(rawKm, 0.42)) : Math.max(0.5, rawKm);
  const distanceMeters = Math.round(effectiveKm * 1000);
  const quadrasEstimadas = Math.max(1, Math.round(distanceMeters / 110)); // 1 standard block ~ 110m
  const tempoCaminhadaMin = Math.max(2, Math.round(distanceMeters / 80));

  // Distance from user's neighborhood to Centro (-23.3105, -51.1628) round-trip cost comparison
  const distToCentroKm = calcularDistanciaHaversineKm(
    bairroUsuario.lat,
    bairroUsuario.lng,
    -23.3105,
    -51.1628
  );
  const economiaDeslocamentoCentroReais = isSameBairro
    ? Math.max(8.5, Number((distToCentroKm * 2 * 2.15).toFixed(2)))
    : Math.max(4.0, Number((distToCentroKm * 1.4).toFixed(2)));

  let badgeTexto = '';
  if (isSameBairro && quadrasEstimadas <= 4) {
    badgeTexto = `A ${quadrasEstimadas} ${quadrasEstimadas === 1 ? 'quadra' : 'quadras'} de você (${distanceMeters}m) • No seu bairro`;
  } else if (isSameBairro) {
    badgeTexto = `No seu bairro (${distanceMeters}m) • ${tempoCaminhadaMin} min a pé`;
  } else if (effectiveKm <= 2.2) {
    badgeTexto = `Bairro vizinho • a ${effectiveKm.toFixed(1)} km`;
  } else {
    badgeTexto = `A ${effectiveKm.toFixed(1)} km (${loja.bairroNome})`;
  }

  // Priority algorithm score: strongly boosts same neighborhood and short distance
  const prioridadeScore =
    (isSameBairro ? 1000 : 0) +
    (loja.seloComercioDeBairro ? 180 : 0) +
    Math.max(0, 500 - effectiveKm * 85) +
    loja.nota * 20;

  return {
    distanceKm: Number(effectiveKm.toFixed(2)),
    distanceMeters,
    quadrasEstimadas,
    isSameBairro,
    isVizinhoProximo: effectiveKm <= 2.2,
    badgeTexto,
    tempoCaminhadaMin,
    economiaDeslocamentoCentroReais,
    prioridadeScore,
  };
}

