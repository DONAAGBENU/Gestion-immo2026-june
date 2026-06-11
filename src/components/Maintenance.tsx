import { useState } from 'react';
import { 
  Plus, 
  Search, 
  Wrench,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Calendar,
  Euro,
  MapPin
} from 'lucide-react';
import { mockMaintenance, mockProperties } from '../data/mockData';

const MaintenanceCard = ({ maintenance }: { maintenance: any }) => {
  const property = mockProperties.find(p => p.id === maintenance.propertyId);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'reported': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'in-progress': return Clock;
      case 'reported': return AlertTriangle;
      case 'cancelled': return XCircle;
      default: return Clock;
    }
  };

  const StatusIcon = getStatusIcon(maintenance.status);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{maintenance.title}</h3>
          <p className="text-sm text-gray-600 mb-3">{maintenance.description}</p>
          
          <div className="flex items-center space-x-2 mb-3">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(maintenance.priority)}`}>
              {maintenance.priority === 'urgent' ? 'Urgent' :
               maintenance.priority === 'high' ? 'Élevée' :
               maintenance.priority === 'medium' ? 'Moyenne' : 'Faible'}
            </span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(maintenance.status)}`}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {maintenance.status === 'completed' ? 'Terminé' :
               maintenance.status === 'in-progress' ? 'En cours' :
               maintenance.status === 'reported' ? 'Signalé' : 'Annulé'}
            </span>
          </div>
          
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-gray-400" />
              {property?.name || 'Propriété inconnue'}
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-gray-400" />
              Signalé le {new Date(maintenance.reportedDate).toLocaleDateString()}
            </div>
            {maintenance.completedDate && (
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-gray-400" />
                Terminé le {new Date(maintenance.completedDate).toLocaleDateString()}
              </div>
            )}
            {maintenance.assignedTo && (
              <div className="flex items-center">
                <Wrench className="h-4 w-4 mr-2 text-gray-400" />
                Assigné à: {maintenance.assignedTo}
              </div>
            )}
            {maintenance.cost && (
              <div className="flex items-center">
                <Euro className="h-4 w-4 mr-2 text-gray-400" />
                Coût: {maintenance.cost}€
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        <button className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
          Modifier
        </button>
        {maintenance.status !== 'completed' && (
          <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
            Marquer terminé
          </button>
        )}
      </div>
    </div>
  );
};

export default function Maintenance() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredMaintenance = mockMaintenance.filter(maintenance => {
    const property = mockProperties.find(p => p.id === maintenance.propertyId);
    
    const matchesSearch = maintenance.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         maintenance.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (property && property.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = filterStatus === 'all' || maintenance.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || maintenance.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const activeRequests = mockMaintenance.filter(m => m.status !== 'completed' && m.status !== 'cancelled').length;
  const urgentRequests = mockMaintenance.filter(m => m.priority === 'urgent' && m.status !== 'completed').length;
  const totalCost = mockMaintenance.filter(m => m.cost).reduce((sum, m) => sum + (m.cost || 0), 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Maintenance</h2>
          <p className="text-gray-600">Gérez les demandes de maintenance et réparations</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Demande
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-100">
              <Wrench className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{activeRequests}</p>
              <p className="text-sm text-gray-600">Demandes actives</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-red-100">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{urgentRequests}</p>
              <p className="text-sm text-gray-600">Urgentes</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-100">
              <Euro className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{totalCost.toLocaleString()} €</p>
              <p className="text-sm text-gray-600">Coût total</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par titre ou propriété..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tous les statuts</option>
              <option value="reported">Signalé</option>
              <option value="in-progress">En cours</option>
              <option value="completed">Terminé</option>
              <option value="cancelled">Annulé</option>
            </select>
            
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Toutes les priorités</option>
              <option value="urgent">Urgent</option>
              <option value="high">Élevée</option>
              <option value="medium">Moyenne</option>
              <option value="low">Faible</option>
            </select>
          </div>
        </div>
      </div>

      {/* Maintenance Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredMaintenance.map((maintenance) => (
          <MaintenanceCard key={maintenance.id} maintenance={maintenance} />
        ))}
      </div>

      {filteredMaintenance.length === 0 && (
        <div className="text-center py-12">
          <Wrench className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Aucune demande de maintenance trouvée</p>
        </div>
      )}

      {/* Add Maintenance Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 max-h-screen overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Nouvelle Demande de Maintenance</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Titre de la demande"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <textarea
                placeholder="Description détaillée"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>Sélectionner une propriété</option>
                {mockProperties.map(property => (
                  <option key={property.id} value={property.id}>
                    {property.name}
                  </option>
                ))}
              </select>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="low">Priorité faible</option>
                <option value="medium">Priorité moyenne</option>
                <option value="high">Priorité élevée</option>
                <option value="urgent">Urgent</option>
              </select>
              <input
                type="text"
                placeholder="Assigné à (optionnel)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="number"
                placeholder="Coût estimé (€)"
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
                Créer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}