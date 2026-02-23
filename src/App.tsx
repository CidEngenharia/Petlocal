import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { User, Pet, Service } from './types';

// Components
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import HomeView from './components/HomeView';
import AuthView from './components/AuthView';
import DashboardView from './components/Dashboard/DashboardView';
import MarketplaceView from './components/MarketplaceView';
import ProfileView from './components/ProfileView';
import DonationArea from './components/DonationArea';
import PetShop from './components/PetShop';
import DocumentViewer from './components/Dashboard/DocumentViewer';

export default function App() {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const [view, setView] = useState<'home' | 'dashboard' | 'marketplace' | 'profile' | 'donations' | 'shop'>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [pets, setPets] = useState<Pet[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [providerServices, setProviderServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewerPet, setViewerPet] = useState<Pet | null>(null);
  const [viewerType, setViewerType] = useState<'RG' | 'BirthCert' | null>(null);

  // Auth logic
  const handleAuth = async (email: string, password: string, role: 'owner' | 'provider', isRegister: boolean) => {
    setLoading(true);
    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role })
      });
      const data = await res.json();

      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        setView('dashboard');
      } else if (isRegister) {
        // After register, auto login or just inform success
        alert('Cadastro realizado com sucesso! Faça login.');
      } else {
        alert(data.error || 'Erro na autenticação');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setView('home');
  };

  useEffect(() => {
    if (user) {
      if (user.role === 'owner') {
        fetchPets();
      } else {
        fetchProviderServices();
      }
      fetchServices();
    }
  }, [user]);

  const fetchPets = async () => {
    if (!user) return;
    const res = await fetch(`/api/pets/${user.id}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    const data = await res.json();
    setPets(data);
  };

  const fetchProviderServices = async () => {
    if (!user) return;
    const res = await fetch(`/api/services/provider/${user.id}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    const data = await res.json();
    setProviderServices(data);
  };

  const fetchServices = async () => {
    const res = await fetch('/api/services');
    const data = await res.json();
    setServices(data);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        setView={(v) => {
          if (v === 'donations') setView('donations');
          else if (v === 'marketplace') setView('marketplace');
          else setView(v);
        }}
        currentView={view}
      />

      <Navbar
        user={user}
        currentView={view}
        setView={setView}
        onOpenSidebar={() => setIsSidebarOpen(true)}
        onLogout={logout}
      />

      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {view === 'home' && <HomeView key="home" onGetStarted={() => setView('profile')} />}

          {view === 'dashboard' && user && (
            <DashboardView
              key="dashboard"
              user={user}
              pets={pets}
              services={providerServices}
              onRefresh={user.role === 'owner' ? fetchPets : fetchProviderServices}
              onViewDocument={(pet, type) => {
                setViewerPet(pet);
                setViewerType(type);
              }}
            />
          )}

          {view === 'marketplace' && (
            <MarketplaceView
              key="marketplace"
              services={services}
              user={user}
              onRefresh={fetchServices}
            />
          )}

          {view === 'donations' && <DonationArea key="donations" />}

          {view === 'shop' && <PetShop key="shop" />}
          {/* Note: In Sidebar, shop is not yet a distinct link, but let's add it to menuItems in Sidebar later or handle it here */}

          {view === 'profile' && !user && (
            <AuthView key="auth" onLogin={handleAuth} loading={loading} />
          )}

          {view === 'profile' && user && (
            <ProfileView key="profile" user={user} />
          )}
        </AnimatePresence>
      </main>

      {viewerPet && viewerType && (
        <DocumentViewer
          pet={viewerPet}
          type={viewerType}
          onClose={() => {
            setViewerPet(null);
            setViewerType(null);
          }}
        />
      )}

      <footer className="bg-brand-primary text-white/80 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm mb-8">© 2024 PetLocal - O hub definitivo para o bem-estar do seu pet.</p>
          <p className="text-xs text-white/40">Developer cidEngenharia - Sidney Sales</p>
        </div>
      </footer>
    </div>
  );
}
