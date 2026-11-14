import React from 'react';
import { Toaster } from 'sonner';
import { LondrinaAppProvider, useLondrinaApp } from './context/LondrinaAppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { HubBairrosPage } from './pages/HubBairrosPage';
import { BuscaPage } from './pages/BuscaPage';
import { ComparadorPrecosPage } from './pages/ComparadorPrecosPage';
import { InteligenciaEconomicaPage } from './pages/InteligenciaEconomicaPage';
import { LoginLondrinaGoPage } from './pages/LoginLondrinaGoPage';
import {
  StoreProfilePage,
  ProductDetailPage,
  CartAndCheckoutPage,
  CitizenAccountPage,
} from './pages/StoreAndProductPages';
import {
  MerchantDashboardPage,
  AdminDashboardPage,
} from './pages/MerchantAndAdminPages';

const RouterView: React.FC = () => {
  const { currentPath } = useLondrinaApp();

  if (currentPath === '/' || currentPath === '') {
    return <HomePage />;
  }
  if (currentPath === '/hub-bairros') {
    return <HubBairrosPage />;
  }
  if (currentPath === '/busca') {
    return <BuscaPage />;
  }
  if (currentPath === '/comparador-precos') {
    return <ComparadorPrecosPage />;
  }
  if (
    currentPath === '/inteligencia-economica' ||
    currentPath === '/admin/inteligencia-economica'
  ) {
    return <InteligenciaEconomicaPage />;
  }
  if (currentPath === '/login' || currentPath === '/dev/login') {
    return <LoginLondrinaGoPage />;
  }
  if (currentPath.startsWith('/loja/')) {
    const slug = currentPath.replace('/loja/', '');
    return <StoreProfilePage slug={slug} />;
  }
  if (currentPath.startsWith('/produto/')) {
    const id = parseInt(currentPath.replace('/produto/', ''), 10) || 1001;
    return <ProductDetailPage id={id} />;
  }
  if (currentPath === '/carrinho' || currentPath === '/checkout') {
    return <CartAndCheckoutPage />;
  }
  if (currentPath === '/conta') {
    return <CitizenAccountPage />;
  }
  if (currentPath.startsWith('/vendedor')) {
    return <MerchantDashboardPage />;
  }
  if (currentPath.startsWith('/admin')) {
    return <AdminDashboardPage />;
  }

  return <HomePage />;
};

export const App: React.FC = () => {
  return (
    <LondrinaAppProvider>
      <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900">
        <Header />
        <main className="flex-1">
          <RouterView />
        </main>
        <Footer />
        <Toaster position="top-right" richColors closeButton />
      </div>
    </LondrinaAppProvider>
  );
};

export default App;

