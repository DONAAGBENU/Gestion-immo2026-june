import { useState } from 'react';
import {
  Building2, Users, TrendingUp, Plus, Home,
  User, CreditCard, Wrench, MapPin, ChevronRight,
  ArrowUpRight
} from 'lucide-react';
import { dashboardStats, mockProperties } from '../data/mockData';
import ImageSlider from './ImageSlider';
import ContactModal from './ContactModal';
import { Property } from '../types';
import { useAuth } from '../context/AuthContext';

/* ── Navigation globale ── */
const navigate = (page: string) => {
  if (typeof (window as any).__appNavigate === 'function') {
    (window as any).__appNavigate(page);
  }
};

/* ── Styles ── */
const card: React.CSSProperties = {
  background: '#111827',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '20px',
};

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  trend?: string;
}

function StatCard({ title, value, icon: Icon, color, trend }: StatCardProps) {
  return (
    <div className="p-5 transition-all duration-300 hover:-translate-y-1 cursor-default" style={card}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium mb-1 truncate" style={{ color: '#9ca3af' }}>{title}</p>
          <h3 className="text-2xl sm:text-3xl font-bold text-white truncate">{value}</h3>
          {trend && (
            <p className="text-xs mt-1 flex items-center gap-1" style={{ color: '#34d399' }}>
              <ArrowUpRight size={12} />{trend}
            </p>
          )}
        </div>
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ml-3"
          style={{ background: color }}>
          <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
        </div>
      </div>
    </div>
  );
}

/* ── Bouton d'action rapide ── */
interface ActionBtnProps {
  icon: React.ElementType;
  label: string;
  color: string;
  onClick: () => void;
}
function ActionBtn({ icon: Icon, label, color, onClick }: ActionBtnProps) {
  return (
    <button
      onClick={onClick}
      className="p-4 sm:p-5 rounded-xl text-left w-full transition-all duration-200 group"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer' }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; }}
    >
      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
        style={{ background: color }}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <p className="font-medium text-white text-sm leading-snug">{label}</p>
      <ChevronRight className="w-3.5 h-3.5 mt-1 transition-transform group-hover:translate-x-1"
        style={{ color: '#6b7280' }} />
    </button>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [contactProp, setContactProp] = useState<Property | null>(null);

  const occupationRate = Math.round(
    (dashboardStats.occupiedProperties / dashboardStats.totalProperties) * 100
  );

  return (
    <div className="min-h-screen" style={{ background: '#0a0c10' }}>

      {/* ── HERO ── */}
      <div className="relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1600&auto=format&fit=crop"
          alt="Immobilier"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, #0a0c10, rgba(10,12,16,0.9), rgba(10,12,16,0.4))' }} />
        <div className="relative px-4 sm:px-6 lg:px-10 py-10 sm:py-16">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm"
            style={{ background: 'rgba(59,130,246,0.1)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.2)' }}>
            Tableau de bord {isAdmin ? '(Administrateur)' : '(Espace Client)'}
          </span>
          <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            Gestion Immobilière
          </h1>
          <p className="mt-3 max-w-2xl text-sm sm:text-base lg:text-lg" style={{ color: '#9ca3af' }}>
            {isAdmin
              ? 'Suivez vos propriétés, locataires et revenus depuis votre interface centralisée.'
              : 'Explorez nos offres immobilières d\'exception et contactez directement l\'administration.'}
          </p>
        </div>
      </div>

      <div className="p-4 sm:p-6 lg:p-10 space-y-6 sm:space-y-8">

        {/* ── STATS ── */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-5">
          <StatCard title="Total Propriétés"    value={dashboardStats.totalProperties}  icon={Building2}   color="linear-gradient(135deg,#2563eb,#4f46e5)" />
          <StatCard title="Locataires"           value={dashboardStats.totalTenants}     icon={Users}       color="linear-gradient(135deg,#10b981,#059669)" />
          <StatCard title="Revenus Mensuels"     value={`${dashboardStats.monthlyRevenue.toLocaleString()} FCFA`} icon={TrendingUp} color="linear-gradient(135deg,#9333ea,#7c3aed)" />
          <StatCard title="Taux d'Occupation"   value={`${occupationRate}%`}            icon={TrendingUp}  color="linear-gradient(135deg,#f59e0b,#d97706)" />
        </div>

        {/* ── ACTIONS RAPIDES (Uniquement pour l'Administrateur) ── */}
        {isAdmin && (
          <div className="p-4 sm:p-6" style={card}>
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">Actions Rapides Administrateur</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <ActionBtn
                icon={Plus}   label="Ajouter une propriété"   color="linear-gradient(135deg,#2563eb,#4f46e5)"
                onClick={() => navigate('properties')}
              />
              <ActionBtn
                icon={User}   label="Ajouter un locataire"    color="linear-gradient(135deg,#10b981,#059669)"
                onClick={() => navigate('tenants')}
              />
              <ActionBtn
                icon={CreditCard} label="Enregistrer un paiement" color="linear-gradient(135deg,#9333ea,#7c3aed)"
                onClick={() => navigate('payments')}
              />
              <ActionBtn
                icon={Wrench} label="Déclarer une maintenance" color="linear-gradient(135deg,#f59e0b,#d97706)"
                onClick={() => navigate('maintenance')}
              />
            </div>
          </div>
        )}

        {/* ── PROPRIÉTÉS RÉCENTES ── */}
        <div className="p-4 sm:p-6" style={card}>
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-white">Propriétés Récentes</h2>
            <button
              onClick={() => navigate('properties')}
              className="flex items-center gap-1 text-xs sm:text-sm font-medium transition-colors"
              style={{ color: '#60a5fa', background: 'none', border: 'none', cursor: 'pointer' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#93c5fd'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#60a5fa'; }}
            >
              Voir tout <ChevronRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {mockProperties.slice(0, 3).map(property => {
              const isForSale = (property as any).listingType === 'sale';
              const isAvail   = property.status === 'vacant';
              return (
                <div key={property.id} className="overflow-hidden rounded-2xl"
                  style={{ border: '1px solid rgba(255,255,255,0.07)', background: '#0d1117' }}>

                  {/* Slider */}
                  <ImageSlider images={property.images} height="200px" autoPlayInterval={5000} />

                  <div className="p-4">
                    {/* Badges statut & Type de transaction */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{
                          background: property.status === 'occupied' ? 'rgba(52,211,153,0.15)' : property.status === 'vacant' ? 'rgba(251,191,36,0.15)' : 'rgba(248,113,113,0.15)',
                          color: property.status === 'occupied' ? '#34d399' : property.status === 'vacant' ? '#fbbf24' : '#f87171',
                        }}>
                        {property.status === 'occupied' ? 'Occupé' : property.status === 'vacant' ? 'Disponible' : 'Maintenance'}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                        style={{
                          background: isForSale ? 'rgba(16,185,129,0.2)' : 'rgba(59,130,246,0.2)',
                          color: isForSale ? '#34d399' : '#60a5fa',
                          border: isForSale ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(59,130,246,0.3)',
                        }}>
                        {isForSale ? '🏷️ À ACHETER' : '🔑 À LOUER'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-1">
                      <Home className="w-4 h-4 flex-shrink-0" style={{ color: '#60a5fa' }} />
                      <h3 className="font-semibold text-white text-sm truncate">{property.name}</h3>
                    </div>

                    <div className="flex items-start gap-1.5 text-xs mb-3" style={{ color: '#9ca3af' }}>
                      <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-1">{property.address}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs" style={{ color: '#6b7280' }}>{isForSale ? 'Prix de vente' : 'Loyer mensuel'}</p>
                        <p className="text-lg font-bold" style={{ color: '#60a5fa' }}>
                          {property.rent.toLocaleString()} FCFA
                        </p>
                      </div>
                      <button
                        onClick={() => navigate('properties')}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-colors"
                        style={{ background: 'linear-gradient(135deg,#3b82f6,#6366f1)', border: 'none', cursor: 'pointer' }}>
                        Détails
                      </button>
                    </div>

                    {/* CTA contact */}
                    {isAvail && (
                      <button
                        onClick={() => setContactProp(property)}
                        className="mt-3 w-full py-2 rounded-xl text-xs font-semibold text-white transition-all flex items-center justify-center gap-1.5"
                        style={{
                          background: isForSale ? 'linear-gradient(135deg,#10b981,#059669)' : 'linear-gradient(135deg,#3b82f6,#6366f1)',
                          border: 'none', cursor: 'pointer',
                        }}>
                        {isForSale ? '🛒 Acheter ce bien' : '🔑 Louer ce bien'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* ── Modal de contact ── */}
      {contactProp && (
        <ContactModal
          propertyId={contactProp.id}
          propertyName={contactProp.name}
          propertyRent={contactProp.rent}
          listingType={(contactProp as any).listingType ?? 'rent'}
          onClose={() => setContactProp(null)}
        />
      )}
    </div>
  );
}