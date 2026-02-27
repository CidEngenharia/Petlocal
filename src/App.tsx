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
import Top10View from './components/Top10View';
import TrackerView from './components/TrackerView';
import LostFoundView from './components/LostFoundView';
import DocumentViewer from './components/Dashboard/DocumentViewer';
import PresentationView from './components/PresentationView';

export default function App() {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const [view, setView] = useState<'home' | 'dashboard' | 'marketplace' | 'profile' | 'donations' | 'shop' | 'top10' | 'tracker' | 'lost-found' | 'presentation'>('home');
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

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('Non-JSON response:', text);
        alert(`Erro do servidor (${res.status}): ${text.length > 0 ? text.slice(0, 100) : 'Resposta vazia'}`);
        setLoading(false);
        return;
      }

      if (res.ok && data.token) {
        if (isRegister) {
          alert('Conta criada com sucesso! Redirecionando...');
        }
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        setView('dashboard');
      } else {
        alert(data.error || (isRegister ? 'Erro ao criar conta' : 'E-mail ou senha incorretos'));
      }
    } catch (err: any) {
      console.error('Fetch error:', err);
      alert(`Erro de conexão: ${err.message}. Verifique se o servidor está rodando.`);
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

          {view === 'donations' && <DonationArea key="donations" user={user} />}

          {view === 'shop' && <PetShop key="shop" user={user} setView={setView} />}

          {view === 'top10' && <Top10View key="top10" user={user} />}

          {view === 'tracker' && <TrackerView key="tracker" user={user} />}

          {view === 'lost-found' && <LostFoundView key="lost-found" user={user} />}

          {view === 'presentation' && <PresentationView key="presentation" setView={setView} />}

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

      <footer className="bg-[#004010] text-white/80 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm mb-8">© 2024 PetLocal - O hub definitivo para o bem-estar do seu pet.</p>
          <p className="text-xs text-white/40">Developer cidEngenharia - Sidney Sales</p>
        </div>
      </footer>
    </div>
  );
}
