import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  CONTAS_LONDRINAGO,
  BAIRROS_LONDRINA,
  LOJAS_LONDRINA,
  PRODUTOS_LONDRINA,
  PEDIDOS_SEED,
  CUPONS_LONDRINA,
  LondrinaAccount,
  BairroLondrina,
  StoreLondrina,
  ProductLondrina,
  OrderLondrina,
  UserRole,
  calcularProximidadeBairro,
  ProximityInfo,
} from '../data/londrinaSeed';
import { toast } from 'sonner';

export interface CartItem {
  product: ProductLondrina;
  store: StoreLondrina;
  quantity: number;
}

export interface ProductWithProximity extends ProductLondrina {
  store: StoreLondrina;
  proximity: ProximityInfo;
}

export interface StoreWithProximity extends StoreLondrina {
  proximity: ProximityInfo;
}

interface LondrinaAppContextType {
  // Router
  currentPath: string;
  searchParams: URLSearchParams;
  navigate: (to: string) => void;

  // Auth (LondrinaGO)
  currentUser: LondrinaAccount | null;
  loginWithLondrinaGo: (identifier: string, password: string) => { ok: boolean; message: string };
  quickLoginRole: (role: UserRole) => void;
  logout: () => void;

  // Hub de Bairros & Proximity Algorithm
  bairros: BairroLondrina[];
  selectedBairro: BairroLondrina;
  setSelectedBairroId: (bairroId: string) => void;
  algoritmoProximidadeAtivo: boolean;
  setAlgoritmoProximidadeAtivo: (active: boolean) => void;

  // Enriched Stores & Products sorted by Hub de Bairros
  storesWithProximity: StoreWithProximity[];
  productsWithProximity: ProductWithProximity[];
  allStores: StoreLondrina[];
  allProducts: ProductLondrina[];
  addNewProduct: (newProd: Omit<ProductLondrina, 'id' | 'slug' | 'vendasMes'>) => void;

  // Cart & Checkout
  cart: CartItem[];
  addToCart: (product: ProductLondrina, qty?: number) => void;
  updateCartQty: (productId: number, qty: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  appliedCouponCode: string | null;
  applyCoupon: (code: string) => boolean;
  discountAmount: number;

  // Orders
  orders: OrderLondrina[];
  placeOrder: (modalidade: 'Retirada no Bairro (Presencial)' | 'Entrega Rápida Local', pagamento: string) => OrderLondrina | null;
  updateOrderStatus: (orderId: string, newStatus: OrderLondrina['status']) => void;
}

const LondrinaAppContext = createContext<LondrinaAppContextType | undefined>(undefined);

export const LondrinaAppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Router state
  const [fullUrl, setFullUrl] = useState<string>(() => {
    return window.location.pathname + window.location.search;
  });

  useEffect(() => {
    const onPopState = () => {
      setFullUrl(window.location.pathname + window.location.search);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = (to: string) => {
    window.history.pushState({}, '', to);
    setFullUrl(to);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const { currentPath, searchParams } = useMemo(() => {
    const [pathPart, queryPart] = fullUrl.split('?');
    return {
      currentPath: pathPart || '/',
      searchParams: new URLSearchParams(queryPart || ''),
    };
  }, [fullUrl]);

  // 2. Auth state (Default logged in as Cidadão so user can explore immediately, or switch at any time)
  const [currentUser, setCurrentUser] = useState<LondrinaAccount | null>(() => {
    try {
      const saved = localStorage.getItem('londrinago_user');
      if (saved) return JSON.parse(saved);
    } catch {}
    return CONTAS_LONDRINAGO.find((c) => c.role === 'cidadao') || CONTAS_LONDRINAGO[1];
  });

  // 3. Hub de Bairros state
  const [selectedBairroId, setSelectedBairroIdState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('londrina_bairro_id');
      if (saved && BAIRROS_LONDRINA.some((b) => b.id === saved)) return saved;
    } catch {}
    return 'vila-casoni';
  });

  const [algoritmoProximidadeAtivo, setAlgoritmoProximidadeAtivo] = useState<boolean>(true);

  const setSelectedBairroId = (bairroId: string) => {
    setSelectedBairroIdState(bairroId);
    try {
      localStorage.setItem('londrina_bairro_id', bairroId);
    } catch {}
    const found = BAIRROS_LONDRINA.find((b) => b.id === bairroId);
    if (found) {
      toast.success(`Hub de Bairros atualizado: ${found.nome}`, {
        description: `Priorizando comércios e produtos a poucas quadras de você em ${found.nome}.`,
      });
    }
  };

  const selectedBairro = useMemo(() => {
    return BAIRROS_LONDRINA.find((b) => b.id === selectedBairroId) || BAIRROS_LONDRINA[0];
  }, [selectedBairroId]);

  // 4. Stores & Products state
  const [allStores] = useState<StoreLondrina[]>(LOJAS_LONDRINA);
  const [allProducts, setAllProducts] = useState<ProductLondrina[]>(PRODUTOS_LONDRINA);

  const addNewProduct = (newProd: Omit<ProductLondrina, 'id' | 'slug' | 'vendasMes'>) => {
    const id = Date.now();
    const slug = newProd.nome.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + id;
    const created: ProductLondrina = {
      ...newProd,
      id,
      slug,
      vendasMes: 12,
    };
    setAllProducts((prev) => [created, ...prev]);
    toast.success('Produto publicado no Hub do Bairro!', {
      description: `${created.nome} já aparece com prioridade para moradores próximos.`,
    });
  };

  // 5. Proximity calculation & sorting
  const storesWithProximity = useMemo<StoreWithProximity[]>(() => {
    const enriched = allStores.map((store) => ({
      ...store,
      proximity: calcularProximidadeBairro(selectedBairro, store),
    }));

    if (algoritmoProximidadeAtivo) {
      return enriched.sort((a, b) => b.proximity.prioridadeScore - a.proximity.prioridadeScore);
    }
    return enriched.sort((a, b) => b.pedidosMes - a.pedidosMes);
  }, [allStores, selectedBairro, algoritmoProximidadeAtivo]);

  const productsWithProximity = useMemo<ProductWithProximity[]>(() => {
    const storeMap = new Map(storesWithProximity.map((s) => [s.id, s]));
    const enriched = allProducts
      .map((prod) => {
        const store = storeMap.get(prod.storeId) || storesWithProximity[0];
        return {
          ...prod,
          store,
          proximity: store.proximity,
        };
      });

    if (algoritmoProximidadeAtivo) {
      return enriched.sort((a, b) => {
        if (a.proximity.isSameBairro !== b.proximity.isSameBairro) {
          return a.proximity.isSameBairro ? -1 : 1;
        }
        return b.proximity.prioridadeScore - a.proximity.prioridadeScore;
      });
    }
    return enriched.sort((a, b) => b.vendasMes - a.vendasMes);
  }, [allProducts, storesWithProximity, algoritmoProximidadeAtivo]);

  // 6. Auth methods
  const loginWithLondrinaGo = (identifier: string, password: string) => {
    const clean = identifier.trim().toLowerCase();
    const cleanDigits = identifier.replace(/\D/g, '');

    const match = CONTAS_LONDRINAGO.find((acc) => {
      const emailMatch = acc.email.toLowerCase() === clean;
      const cpfMatch = cleanDigits.length >= 9 && acc.cpf.replace(/\D/g, '') === cleanDigits;
      const cnpjMatch = acc.cnpj && cleanDigits.length >= 11 && acc.cnpj.replace(/\D/g, '') === cleanDigits;
      return emailMatch || cpfMatch || cnpjMatch;
    });

    if (!match) {
      return {
        ok: false,
        message: 'Credencial não localizada na base LondrinaGO. Utilize um dos logins de demonstração listados ao lado.',
      };
    }

    if (password !== match.password && password !== '123456') {
      return {
        ok: false,
        message: 'Senha incorreta. Para o ambiente de demonstração LondrinaGO utilize a senha: londrina2026',
      };
    }

    setCurrentUser(match);
    setSelectedBairroIdState(match.bairroId);
    try {
      localStorage.setItem('londrinago_user', JSON.stringify(match));
      localStorage.setItem('londrina_bairro_id', match.bairroId);
    } catch {}

    toast.success(`Autenticado via LondrinaGO: ${match.name}`, {
      description: `Token OIDC validado • ${match.nivelLondrinaGo}`,
    });

    return { ok: true, message: 'Autenticado com sucesso!' };
  };

  const quickLoginRole = (role: UserRole) => {
    const match = CONTAS_LONDRINAGO.find((c) => c.role === role);
    if (!match) return;
    setCurrentUser(match);
    setSelectedBairroIdState(match.bairroId);
    try {
      localStorage.setItem('londrinago_user', JSON.stringify(match));
      localStorage.setItem('londrina_bairro_id', match.bairroId);
    } catch {}
    toast.success(`Perfil LondrinaGO alternado para ${role.toUpperCase()}`, {
      description: `${match.name} (${match.email})`,
    });
  };

  const logout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('londrinago_user');
    } catch {}
    toast.info('Sessão LondrinaGO encerrada.');
    navigate('/login');
  };

  // 7. Cart & Orders
  const [cart, setCart] = useState<CartItem[]>([
    {
      product: PRODUTOS_LONDRINA[0],
      store: LOJAS_LONDRINA[0],
      quantity: 1,
    },
    {
      product: PRODUTOS_LONDRINA[2],
      store: LOJAS_LONDRINA[1],
      quantity: 1,
    },
  ]);

  const [appliedCouponCode, setAppliedCouponCode] = useState<string | null>('BAIRROFORTE15');
  const [orders, setOrders] = useState<OrderLondrina[]>(PEDIDOS_SEED);

  const addToCart = (product: ProductLondrina, qty = 1) => {
    const store = allStores.find((s) => s.id === product.storeId) || allStores[0];
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + qty } : i
        );
      }
      return [...prev, { product, store, quantity: qty }];
    });
    toast.success(`${product.nome} adicionado à sacola!`, {
      description: `Loja: ${store.nome} (${store.bairroNome})`,
    });
  };

  const updateCartQty = (productId: number, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((i) => (i.product.id === productId ? { ...i, quantity: qty } : i))
    );
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const clearCart = () => setCart([]);

  const cartTotal = useMemo(() => {
    return cart.reduce((acc, item) => {
      const unitPrice = item.product.precoPromocional ?? item.product.preco;
      return acc + unitPrice * item.quantity;
    }, 0);
  }, [cart]);

  const cartCount = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    const found = CUPONS_LONDRINA.find((c) => c.codigo === clean);
    if (!found) {
      toast.error('Cupom inválido ou expirado.');
      return false;
    }
    setAppliedCouponCode(found.codigo);
    toast.success(`Cupom ${found.codigo} aplicado!`, {
      description: found.titulo,
    });
    return true;
  };

  const discountAmount = useMemo(() => {
    if (!appliedCouponCode || cartTotal === 0) return 0;
    const found = CUPONS_LONDRINA.find((c) => c.codigo === appliedCouponCode);
    if (!found || cartTotal < found.pedidoMinimo) return 0;
    return found.descontoReais;
  }, [appliedCouponCode, cartTotal]);

  const placeOrder = (
    modalidade: 'Retirada no Bairro (Presencial)' | 'Entrega Rápida Local',
    _pagamento: string
  ) => {
    if (cart.length === 0) return null;
    const firstStore = cart[0].store;
    const newOrder: OrderLondrina = {
      id: 'ped-' + Date.now(),
      codigo: '#LON-' + Math.floor(9100 + Math.random() * 800),
      dataHora: 'Agora mesmo',
      clienteNome: currentUser?.name || 'Cidadão Londrinense',
      clienteBairro: selectedBairro.nome,
      storeId: firstStore.id,
      storeNome: firstStore.nome,
      storeBairro: firstStore.bairroNome,
      modalidade,
      status:
        modalidade === 'Retirada no Bairro (Presencial)'
          ? 'Pronto para retirada (a 2 quadras)'
          : 'Em separação',
      valorTotal: Math.max(0, cartTotal - discountAmount),
      economiaFreteBairro: 14.5,
      itens: cart.map((c) => ({
        nome: c.product.nome,
        qtd: c.quantity,
        precoUnit: c.product.precoPromocional ?? c.product.preco,
      })),
    };
    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    toast.success(`Pedido ${newOrder.codigo} confirmado no comércio do seu bairro!`, {
      description: `Os dados agregados desta compra fortalecem o Hub de Bairros de Londrina.`,
    });
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderLondrina['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    toast.success(`Status do pedido atualizado para: ${newStatus}`);
  };

  return (
    <LondrinaAppContext.Provider
      value={{
        currentPath,
        searchParams,
        navigate,
        currentUser,
        loginWithLondrinaGo,
        quickLoginRole,
        logout,
        bairros: BAIRROS_LONDRINA,
        selectedBairro,
        setSelectedBairroId,
        algoritmoProximidadeAtivo,
        setAlgoritmoProximidadeAtivo,
        storesWithProximity,
        productsWithProximity,
        allStores,
        allProducts,
        addNewProduct,
        cart,
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
        cartTotal,
        cartCount,
        appliedCouponCode,
        applyCoupon,
        discountAmount,
        orders,
        placeOrder,
        updateOrderStatus,
      }}
    >
      {children}
    </LondrinaAppContext.Provider>
  );
};

export function useLondrinaApp() {
  const ctx = useContext(LondrinaAppContext);
  if (!ctx) throw new Error('useLondrinaApp must be used inside LondrinaAppProvider');
  return ctx;
}

