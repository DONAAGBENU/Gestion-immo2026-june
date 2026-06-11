import {
  Building2,
  Users,
  Euro,
  TrendingUp,
  Plus,
  Home,
  User,
  CreditCard,
  Wrench,
  MapPin
} from 'lucide-react';

import { dashboardStats, mockProperties } from '../data/mockData';

const cardStyle = {
  background: '#111827',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '20px'
};

interface StatCardProps {
  title: string;
  value: string | number;
  icon: any;
  color: string;
}

function StatCard({
  title,
  value,
  icon: Icon,
  color
}: StatCardProps) {
  return (
    <div
      className="p-6 transition-all duration-300 hover:-translate-y-1"
      style={cardStyle}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400 mb-2">
            {title}
          </p>

          <h3 className="text-3xl font-bold text-white">
            {value}
          </h3>
        </div>

        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{
            background: color
          }}
        >
          <Icon className="w-7 h-7 text-white" />
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {

  const occupationRate = Math.round(
    (dashboardStats.occupiedProperties /
      dashboardStats.totalProperties) *
      100
  );

  return (
    <div className="min-h-screen bg-slate-950">

      {/* HERO */}

      <div className="relative overflow-hidden">

        <img
          src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1600&auto=format&fit=crop"
          alt="Immobilier"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-900/40" />

        <div className="relative px-6 py-16 lg:px-10">

          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-500/10 text-blue-400 border border-blue-500/20">
            Tableau de bord
          </span>

          <h1 className="mt-4 text-4xl lg:text-5xl font-bold text-white">
            Gestion Immobilière
          </h1>

          <p className="mt-4 max-w-2xl text-gray-400 text-lg">
            Suivez vos propriétés, locataires et revenus
            depuis une interface moderne et centralisée.
          </p>

        </div>
      </div>

      <div className="p-6 lg:p-10 space-y-8">

        {/* STATS */}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

          <StatCard
            title="Total Propriétés"
            value={dashboardStats.totalProperties}
            icon={Building2}
            color="linear-gradient(135deg,#2563eb,#4f46e5)"
          />

          <StatCard
            title="Locataires"
            value={dashboardStats.totalTenants}
            icon={Users}
            color="linear-gradient(135deg,#10b981,#059669)"
          />

          <StatCard
            title="Revenus Mensuels"
            value={`${dashboardStats.monthlyRevenue.toLocaleString()} €`}
            icon={Euro}
            color="linear-gradient(135deg,#9333ea,#7c3aed)"
          />

          <StatCard
            title="Taux d'Occupation"
            value={`${occupationRate}%`}
            icon={TrendingUp}
            color="linear-gradient(135deg,#f59e0b,#d97706)"
          />

        </div>

        {/* ACTIONS RAPIDES */}

        <div
          className="p-6"
          style={cardStyle}
        >
          <h2 className="text-xl font-semibold text-white mb-6">
            Actions Rapides
          </h2>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

            <button className="p-5 rounded-xl bg-slate-800 hover:bg-slate-700 transition text-left">
              <Plus className="w-7 h-7 text-blue-400 mb-3" />
              <p className="font-medium text-white">
                Ajouter une propriété
              </p>
            </button>

            <button className="p-5 rounded-xl bg-slate-800 hover:bg-slate-700 transition text-left">
              <User className="w-7 h-7 text-green-400 mb-3" />
              <p className="font-medium text-white">
                Ajouter un locataire
              </p>
            </button>

            <button className="p-5 rounded-xl bg-slate-800 hover:bg-slate-700 transition text-left">
              <CreditCard className="w-7 h-7 text-purple-400 mb-3" />
              <p className="font-medium text-white">
                Enregistrer un paiement
              </p>
            </button>

            <button className="p-5 rounded-xl bg-slate-800 hover:bg-slate-700 transition text-left">
              <Wrench className="w-7 h-7 text-orange-400 mb-3" />
              <p className="font-medium text-white">
                Déclarer une maintenance
              </p>
            </button>

          </div>
        </div>

        {/* PROPRIÉTÉS */}

        <div
          className="p-6"
          style={cardStyle}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">
              Mes Propriétés
            </h2>

            <button className="text-blue-400 hover:text-blue-300">
              Voir tout
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

            {mockProperties.map((property) => (

              <div
                key={property.id}
                className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900"
              >

                <div className="relative h-56">

                  <img
                    src={property.images[0]}
                    alt={property.name}
                    className="w-full h-full object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent" />

                  <div className="absolute bottom-3 right-3">

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium
                      ${
                        property.status === 'occupied'
                          ? 'bg-green-500/20 text-green-400'
                          : property.status === 'vacant'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {property.status === 'occupied'
                        ? 'Occupé'
                        : property.status === 'vacant'
                        ? 'Vacant'
                        : 'Maintenance'}
                    </span>

                  </div>

                </div>

                <div className="p-5">

                  <div className="flex items-center gap-2 mb-2">
                    <Home className="w-4 h-4 text-blue-400" />
                    <h3 className="font-semibold text-white">
                      {property.name}
                    </h3>
                  </div>

                  <div className="flex items-start gap-2 text-sm text-gray-400 mb-4">

                    <MapPin className="w-4 h-4 mt-0.5" />

                    <span>
                      {property.address}
                    </span>

                  </div>

                  <div className="flex items-center justify-between">

                    <div>
                      <p className="text-xs text-gray-500">
                        Loyer mensuel
                      </p>

                      <p className="text-2xl font-bold text-blue-400">
                        {property.rent} €
                      </p>
                    </div>

                    <button className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition">
                      Détails
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>
        </div>

      </div>

    </div>
  );
}