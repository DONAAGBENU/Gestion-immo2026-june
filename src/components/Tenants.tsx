import { useState } from 'react';
import { 
  Plus, 
  Search, 
  Mail, 
  Phone, 
  Calendar,
  MoreVertical,
  Edit,
  Eye,
  User
} from 'lucide-react';
import { mockTenants } from '../data/mockData';

const TenantCard = ({ tenant }: { tenant: any }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center space-x-4">
        <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
          <User className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {tenant.firstName} {tenant.lastName}
          </h3>
          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
            tenant.status === 'active' ? 'bg-green-100 text-green-800' :
            tenant.status === 'inactive' ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {tenant.status === 'active' ? 'Actif' :
             tenant.status === 'inactive' ? 'Inactif' : 'En attente'}
          </span>
        </div>
      </div>
      <button className="p-2 hover:bg-gray-100 rounded-lg">
        <MoreVertical className="h-4 w-4 text-gray-400" />
      </button>
    </div>
    
    <div className="space-y-3 mb-4">
      <div className="flex items-center text-sm text-gray-600">
        <Mail className="h-4 w-4 mr-3 text-gray-400" />
        {tenant.email}
      </div>
      <div className="flex items-center text-sm text-gray-600">
        <Phone className="h-4 w-4 mr-3 text-gray-400" />
        {tenant.phone}
      </div>
      <div className="flex items-center text-sm text-gray-600">
        <Calendar className="h-4 w-4 mr-3 text-gray-400" />
        Bail: {new Date(tenant.leaseStart).toLocaleDateString()} - {new Date(tenant.leaseEnd).toLocaleDateString()}
      </div>
    </div>
    
    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
      <div>
        <p className="text-sm text-gray-600">Loyer mensuel</p>
        <p className="text-lg font-semibold text-gray-900">{tenant.monthlyRent}€</p>
      </div>
      <div className="flex items-center space-x-2">
        <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
          <Eye className="h-4 w-4 text-gray-600" />
        </button>
        <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
          <Edit className="h-4 w-4 text-gray-600" />
        </button>
      </div>
    </div>
  </div>
);

export default function Tenants() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredTenants = mockTenants.filter(tenant =>
    `${tenant.firstName} ${tenant.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Locataires</h2>
          <p className="text-gray-600">Gérez vos locataires et leurs informations</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter Locataire
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par nom ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full max-w-md"
          />
        </div>
      </div>

      {/* Tenants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTenants.map((tenant) => (
          <TenantCard key={tenant.id} tenant={tenant} />
        ))}
      </div>

      {filteredTenants.length === 0 && (
        <div className="text-center py-12">
          <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Aucun locataire trouvé</p>
        </div>
      )}

      {/* Add Tenant Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 max-h-screen overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ajouter un Locataire</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Prénom"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Nom"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <input
                type="email"
                placeholder="Email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="tel"
                placeholder="Téléphone"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Début du bail</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fin du bail</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <input
                type="number"
                placeholder="Loyer mensuel (€)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="number"
                placeholder="Dépôt de garantie (€)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Annuler
              </button>
              <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}