import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { MessageCircle, Instagram, Linkedin, Twitter, ChevronUp } from 'lucide-react';
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
import AuthPrompt from './components/Dashboard/AuthPrompt';

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
  const [viewerType, setViewerType] = useState<'RG' | 'BirthCert' | 'Vaccination' | null>(null);

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
    <div id="top" className="min-h-screen flex flex-col">
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
        setView={(v) => {
          if (v === 'dashboard' && user?.role === 'provider') setView('marketplace');
          else setView(v);
        }}
        onOpenSidebar={() => setIsSidebarOpen(true)}
        onLogout={logout}
      />

      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {view === 'home' && <HomeView key="home" onGetStarted={() => setView('profile')} />}

          {view === 'dashboard' && (
            user ? (
              <DashboardView
                key="dashboard"
                user={user}
                pets={pets}
                services={providerServices}
                onRefresh={user.role === 'owner' ? fetchPets : fetchProviderServices}
                onViewDocument={(pet, type: 'RG' | 'BirthCert' | 'Vaccination') => {
                  setViewerPet(pet);
                  setViewerType(type);
                }}
              />
            ) : (
              <AuthPrompt key="auth-prompt" setView={setView} />
            )
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

          {view === 'tracker' && <TrackerView key="tracker" user={user} setView={setView} />}

          {view === 'lost-found' && <LostFoundView key="lost-found" user={user} />}

          {view === 'presentation' && <PresentationView key="presentation" setView={setView} />}

          {view === 'profile' && !user && (
            <AuthView key="auth" onLogin={handleAuth} loading={loading} />
          )}

          {view === 'profile' && user && (
            <ProfileView
              key="profile"
              user={user}
              pets={pets}
              services={providerServices}
              onRefresh={user.role === 'owner' ? fetchPets : fetchProviderServices}
              onViewDocument={(pet, type: 'RG' | 'BirthCert' | 'Vaccination') => {
                setViewerPet(pet);
                setViewerType(type);
              }}
            />
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
          <div className="space-y-4">
            <a
              href="https://cidengenharia.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-white/40 hover:text-white/60 transition-colors block"
            >
              Developer cidEngenharia - Sidney Sales
            </a>

            <div className="flex justify-center items-center gap-6">
              <a href="https://wa.me/5571984184782" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white/80 transition-all hover:scale-110">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href="https://instagram.com/cidengenharia" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white/80 transition-all hover:scale-110">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com/in/sidney.sales" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white/80 transition-all hover:scale-110">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="https://x.com/cidengenharia" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white/80 transition-all hover:scale-110">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Widgets */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-3 z-50">
        <a
          href="#top"
          className="bg-white/80 backdrop-blur-md text-stone-600 p-3 rounded-full shadow-lg border border-stone-100 hover:bg-white hover:scale-110 transition-all group"
          title="Voltar ao topo"
        >
          <ChevronUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
        </a>
        <a
          href="https://wa.me/5571984184782"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 text-white p-3 rounded-full shadow-lg shadow-green-500/20 hover:bg-green-600 hover:scale-110 transition-all flex items-center justify-center"
          title="Suporte WhatsApp"
        >
          <MessageCircle className="w-6 h-6" />
        </a>
      </div>
    </div>
  );
}
