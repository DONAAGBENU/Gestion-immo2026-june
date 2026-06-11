import { useState } from 'react';
import {
  Plus, Search, Filter, MapPin, Home, Euro, Users,
  Edit, Eye, Building2, X, Bed, Droplets, Maximize,
  Calendar, ShoppingBag, Lock, Award, ChevronLeft, ChevronRight,
  Wifi, Truck, Leaf, Zap, ShieldCheck, Phone, MoreVertical,
  Trash2
} from 'lucide-react';
import { mockProperties } from '../data/mockData';
import { Property } from '../types';

/* ── styles ── */
const card = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '16px'
};
const inputStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  color: '#fff',
  borderRadius: '10px',
  padding: '8px 12px',
  outline: 'none',
  width: '100%'
};
const labelStyle: React.CSSProperties = {
  color: '#9ca3af',
  fontSize: '12px',
  fontWeight: 600,
  display: 'block',
  marginBottom: '6px',
  textTransform: 'uppercase',
  letterSpacing: '0.05em'
};
const sectionTitle: React.CSSProperties = {
  color: '#fff',
  fontSize: '13px',
  fontWeight: 700,
  marginBottom: '14px',
  paddingBottom: '8px',
  borderBottom: '1px solid rgba(255,255,255,0.07)',
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
};

const amenityOptions = ['Wi-Fi','Parking','Jardin','Piscine','Électricité incluse','Gardien','Ascenseur','Balcon','Cave','Interphone'];

/* ══════════════════════════════════════════
   FORMULAIRE AJOUT
══════════════════════════════════════════ */
interface AddModalProps {
  onClose: () => void;
  onSave: (p: Property) => void;
}

function AddPropertyModal({ onClose, onSave }: AddModalProps) {
  /* champs */
  const [name, setName]           = useState('');
  const [type, setType]           = useState('apartment');
  const [address, setAddress]     = useState('');
  const [city, setCity]           = useState('');
  const [zip, setZip]             = useState('');
  const [country, setCountry]     = useState('France');
  const [desc, setDesc]           = useState('');
  const [rooms, setRooms]         = useState('');
  const [area, setArea]           = useState('');
  const [baths, setBaths]         = useState('');
  const [floor, setFloor]         = useState('');
  const [year, setYear]           = useState('');
  const [furnished, setFurnished] = useState('no');
  const [listing, setListing]     = useState<'rent'|'sale'>('rent');
  const [price, setPrice]         = useState('');
  const [charges, setCharges]     = useState('');
  const [deposit, setDeposit]     = useState('');
  const [availFrom, setAvailFrom] = useState('');
  const [status, setStatus]       = useState<'vacant'|'occupied'|'maintenance'>('vacant');
  const [lat, setLat]             = useState('');
  const [lng, setLng]             = useState('');
  const [previews, setPreviews]   = useState<string[]>([]);
  const [urlInput, setUrlInput]   = useState('');
  const [amenities, setAmenities] = useState<string[]>([]);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [errors, setErrors]       = useState<string[]>([]);
  const [success, setSuccess]     = useState(false);

  const toggleAmenity = (a: string) =>
    setAmenities(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);

  const addUrlPhoto = () => {
    if (urlInput.trim()) { setPreviews(p => [...p, urlInput.trim()]); setUrlInput(''); }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    Array.from(e.target.files || []).forEach(file => {
      const reader = new FileReader();
      reader.onload = ev => setPreviews(p => [...p, ev.target?.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const removePreview = (i: number) => setPreviews(p => p.filter((_, idx) => idx !== i));

  /* ── SOUMETTRE ── */
  const handleSubmit = () => {
    const errs: string[] = [];
    if (!name.trim())    errs.push('Le nom de la propriété est requis.');
    if (!address.trim()) errs.push("L'adresse est requise.");
    if (!price)          errs.push('Le prix est requis.');

    if (errs.length) { setErrors(errs); return; }

    const fullAddress = [address.trim(), city.trim(), zip.trim(), country.trim()]
      .filter(Boolean).join(', ');

    const newProperty: Property = {
      id: Date.now().toString(),
      name: name.trim(),
      address: fullAddress,
      type,
      rooms: parseInt(rooms) || 0,
      area: parseInt(area) || 0,
      rent: parseFloat(price) || 0,
      status,
      images: previews.length
        ? previews
        : ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80'],
      /* champs étendus stockés dans l'objet */
      ...(desc           && { description: desc }),
      ...(lat && lng     && { lat: parseFloat(lat), lng: parseFloat(lng) }),
      ...(amenities.length && { amenities }),
      ...(contactName    && { contactName }),
      ...(contactPhone   && { contactPhone }),
      ...(contactEmail   && { contactEmail }),
      listingType: listing,
      furnished,
      floor: parseInt(floor) || 0,
      baths: parseInt(baths) || 0,
      yearBuilt: parseInt(year) || 0,
      charges: parseFloat(charges) || 0,
      deposit: parseFloat(deposit) || 0,
      availableFrom: availFrom,
    } as any;

    setSuccess(true);
    setTimeout(() => {
      onSave(newProperty);
      onClose();
    }, 900);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(10px)' }}
      onClick={onClose}
    >
      <div
        className="w-full rounded-2xl flex flex-col"
        style={{ background: '#13161f', border: '1px solid rgba(255,255,255,0.1)', maxWidth: '720px', maxHeight: '94vh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div>
            <h3 className="text-lg font-bold text-white">Ajouter une Propriété</h3>
            <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>Remplissez les informations du bien</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)', color: '#9ca3af' }}>
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body scrollable */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-7">

          {/* Erreurs */}
          {errors.length > 0 && (
            <div className="p-4 rounded-xl" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
              {errors.map((e, i) => (
                <p key={i} className="text-sm" style={{ color: '#f87171' }}>⚠ {e}</p>
              ))}
            </div>
          )}

          {/* Succès */}
          {success && (
            <div className="p-4 rounded-xl text-center" style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.3)' }}>
              <p className="text-sm font-semibold" style={{ color: '#34d399' }}>✅ Propriété enregistrée avec succès !</p>
            </div>
          )}

          {/* ── 1. INFOS GÉNÉRALES ── */}
          <div>
            <div style={sectionTitle}><Building2 className="h-4 w-4" style={{ color: '#60a5fa' }} />Informations générales</div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={labelStyle}>Nom de la propriété *</label>
                  <input value={name} onChange={e => setName(e.target.value)} type="text" placeholder="Ex: Villa Lumière" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Type de bien</label>
                  <select value={type} onChange={e => setType(e.target.value)} style={inputStyle}>
                    <option value="apartment">Appartement</option>
                    <option value="house">Maison / Villa</option>
                    <option value="studio">Studio</option>
                    <option value="commercial">Local commercial</option>
                    <option value="land">Terrain</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={labelStyle}>Adresse *</label>
                <input value={address} onChange={e => setAddress(e.target.value)} type="text" placeholder="Ex: 12 Rue des Lilas" style={inputStyle} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label style={labelStyle}>Ville</label>
                  <input value={city} onChange={e => setCity(e.target.value)} type="text" placeholder="Paris" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Code postal</label>
                  <input value={zip} onChange={e => setZip(e.target.value)} type="text" placeholder="75011" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Pays</label>
                  <input value={country} onChange={e => setCountry(e.target.value)} type="text" style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Description</label>
                <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Décrivez le bien..." rows={3} style={{ ...inputStyle, resize: 'none' }} />
              </div>
            </div>
          </div>

          {/* ── 2. DÉTAILS ── */}
          <div>
            <div style={sectionTitle}><Home className="h-4 w-4" style={{ color: '#60a5fa' }} />Détails du bien</div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Pièces', val: rooms, set: setRooms, ph: '3' },
                { label: 'Surface (m²)', val: area, set: setArea, ph: '75' },
                { label: 'Salles de bain', val: baths, set: setBaths, ph: '1' },
                { label: 'Étage', val: floor, set: setFloor, ph: '0 = RDC' },
                { label: 'Année de construction', val: year, set: setYear, ph: '2005' },
              ].map(({ label, val, set, ph }) => (
                <div key={label}>
                  <label style={labelStyle}>{label}</label>
                  <input type="number" value={val} onChange={e => set(e.target.value)} placeholder={ph} min="0" style={inputStyle} />
                </div>
              ))}
              <div>
                <label style={labelStyle}>Meublé</label>
                <select value={furnished} onChange={e => setFurnished(e.target.value)} style={inputStyle}>
                  <option value="no">Non meublé</option>
                  <option value="yes">Meublé</option>
                  <option value="partial">Partiellement</option>
                </select>
              </div>
            </div>
          </div>

          {/* ── 3. PRIX & TYPE ── */}
          <div>
            <div style={sectionTitle}><Euro className="h-4 w-4" style={{ color: '#60a5fa' }} />Prix & Transaction</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label style={labelStyle}>Type de transaction *</label>
                <select value={listing} onChange={e => setListing(e.target.value as 'rent'|'sale')} style={inputStyle}>
                  <option value="rent">À louer</option>
                  <option value="sale">À vendre</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Prix (€) *</label>
                <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="0" min="0" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Charges mensuelles (€)</label>
                <input type="number" value={charges} onChange={e => setCharges(e.target.value)} placeholder="0" min="0" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Dépôt de garantie (€)</label>
                <input type="number" value={deposit} onChange={e => setDeposit(e.target.value)} placeholder="0" min="0" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Disponible à partir du</label>
                <input type="date" value={availFrom} onChange={e => setAvailFrom(e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Statut actuel</label>
                <select value={status} onChange={e => setStatus(e.target.value as any)} style={inputStyle}>
                  <option value="vacant">Disponible</option>
                  <option value="occupied">Occupé</option>
                  <option value="maintenance">En maintenance</option>
                </select>
              </div>
            </div>
          </div>

          {/* ── 4. GPS ── */}
          <div>
            <div style={sectionTitle}><span style={{ color: '#60a5fa', fontWeight: 700 }}>Localisation GPS</span></div>
            <div className="p-3 rounded-xl mb-4" style={{ background: 'rgba(59,130,246,0.07)', border: '1px solid rgba(59,130,246,0.2)' }}>
              <p className="text-xs" style={{ color: '#93c5fd' }}>
                💡 Sur <strong>maps.google.com</strong> → clic droit sur le lieu → "Copier les coordonnées"
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label style={labelStyle}>Latitude</label>
                <input type="number" value={lat} onChange={e => setLat(e.target.value)} placeholder="Ex: 48.8566" step="0.0001" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Longitude</label>
                <input type="number" value={lng} onChange={e => setLng(e.target.value)} placeholder="Ex: 2.3522" step="0.0001" style={inputStyle} />
              </div>
            </div>
          </div>

          {/* ── 5. PHOTOS ── */}
          <div>
            <div style={sectionTitle}><span style={{ color: '#60a5fa', fontWeight: 700 }}>Photos du bien</span></div>

            {/* Upload fichier */}
            <label
              className="flex flex-col items-center justify-center w-full py-7 rounded-xl cursor-pointer mb-4"
              style={{ border: '2px dashed rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.02)', transition: 'border-color 0.2s' }}
            >
              <span style={{ fontSize: '2rem', color: '#4b5563', marginBottom: '0.5rem' }}>📤</span>
              <p className="text-sm" style={{ color: '#6b7280' }}>
                Glissez vos photos ou <span style={{ color: '#60a5fa' }}>cliquez pour parcourir</span>
              </p>
              <p className="text-xs mt-1" style={{ color: '#4b5563' }}>JPG, PNG, WEBP</p>
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleFileUpload} />
            </label>

            {/* URL */}
            <div className="flex gap-2 mb-4">
              <input
                type="url"
                placeholder="https://exemple.com/photo.jpg"
                value={urlInput}
                onChange={e => setUrlInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addUrlPhoto()}
                style={{ ...inputStyle, flex: 1 }}
              />
              <button onClick={addUrlPhoto} className="px-4 py-2 rounded-xl text-sm font-medium flex-shrink-0"
                style={{ background: 'linear-gradient(135deg,#3b82f6,#6366f1)', color: '#fff' }}>
                Ajouter
              </button>
            </div>

            {/* Prévisualisation */}
            {previews.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {previews.map((src, i) => (
                  <div key={i} className="relative rounded-xl overflow-hidden" style={{ aspectRatio: '4/3' }}>
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)' }} />
                    {i === 0 && (
                      <span className="absolute top-2 left-2 text-xs px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(59,130,246,0.85)', color: '#fff', fontSize: '10px' }}>
                        Principale
                      </span>
                    )}
                    <button onClick={() => removePreview(i)}
                      className="absolute top-2 right-2 p-1.5 rounded-lg"
                      style={{ background: 'rgba(239,68,68,0.85)', color: '#fff' }}>
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── 6. ÉQUIPEMENTS ── */}
          <div>
            <div style={sectionTitle}><span style={{ color: '#60a5fa', fontWeight: 700 }}>Équipements & Services</span></div>
            <div className="grid grid-cols-2 gap-2">
              {amenityOptions.map(a => {
                const sel = amenities.includes(a);
                return (
                  <button key={a} onClick={() => toggleAmenity(a)}
                    className="flex items-center px-3 py-2.5 rounded-xl text-sm text-left"
                    style={{
                      background: sel ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.03)',
                      border: sel ? '1px solid rgba(59,130,246,0.4)' : '1px solid rgba(255,255,255,0.07)',
                      color: sel ? '#93c5fd' : '#9ca3af', transition: 'all 0.15s'
                    }}>
                    <div className="w-4 h-4 rounded mr-2.5 flex items-center justify-center flex-shrink-0"
                      style={{ background: sel ? '#3b82f6' : 'rgba(255,255,255,0.08)', border: sel ? 'none' : '1px solid rgba(255,255,255,0.15)' }}>
                      {sel && <span style={{ color: '#fff', fontSize: '10px', fontWeight: 'bold' }}>✓</span>}
                    </div>
                    {a}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── 7. CONTACT ── */}
          <div>
            <div style={sectionTitle}><Phone className="h-4 w-4" style={{ color: '#60a5fa' }} />Contact & Responsable</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label style={labelStyle}>Nom du responsable</label>
                <input value={contactName} onChange={e => setContactName(e.target.value)} type="text" placeholder="Jean Dupont" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Téléphone</label>
                <input value={contactPhone} onChange={e => setContactPhone(e.target.value)} type="tel" placeholder="+33 6 00 00 00 00" style={inputStyle} />
              </div>
              <div className="col-span-2">
                <label style={labelStyle}>Email</label>
                <input value={contactEmail} onChange={e => setContactEmail(e.target.value)} type="email" placeholder="contact@exemple.fr" style={inputStyle} />
              </div>
            </div>
          </div>

        </div>

        {/* Footer sticky */}
        <div className="px-6 py-4 flex space-x-3 flex-shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <button onClick={onClose} className="flex-1 py-3 rounded-xl text-sm font-medium"
            style={{ border: '1px solid rgba(255,255,255,0.1)', color: '#9ca3af' }}>
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={success}
            className="flex-1 py-3 rounded-xl text-sm font-bold"
            style={{
              background: success
                ? 'linear-gradient(135deg,#10b981,#059669)'
                : 'linear-gradient(135deg,#3b82f6,#6366f1)',
              color: '#fff',
              opacity: success ? 0.85 : 1,
              transition: 'all 0.3s'
            }}
          >
            {success ? '✅ Enregistré !' : 'Enregistrer la propriété'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   DETAIL MODAL
══════════════════════════════════════════ */
function PropertyDetailModal({ property, onClose }: { property: Property; onClose: () => void }) {
  const [imgIndex, setImgIndex] = useState(0);
  const images = (property as any).images?.length
    ? (property as any).images
    : ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=900&q=80'];

  const isForSale  = (property as any).listingType === 'sale';
  const isAvailable = property.status === 'vacant';

  const statusColor =
    property.status === 'occupied'  ? { bg: 'rgba(52,211,153,0.18)',  txt: '#34d399' } :
    property.status === 'vacant'    ? { bg: 'rgba(251,191,36,0.18)',  txt: '#fbbf24' } :
                                      { bg: 'rgba(248,113,113,0.18)', txt: '#f87171' };
  const statusLabel =
    property.status === 'occupied' ? 'Occupé' :
    property.status === 'vacant'   ? 'Disponible' : 'En maintenance';

  const prev = () => setImgIndex(i => (i - 1 + images.length) % images.length);
  const next = () => setImgIndex(i => (i + 1) % images.length);

  const defaultAmenities = [
    { icon: Wifi, label: 'Wi-Fi inclus' }, { icon: Truck, label: 'Parking' },
    { icon: Leaf, label: 'Jardin' },       { icon: Zap, label: 'Électricité' },
    { icon: ShieldCheck, label: 'Sécurisé' }, { icon: Phone, label: 'Interphone' },
  ];
  const savedAmenities: string[] = (property as any).amenities || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(10px)' }}
      onClick={onClose}>
      <div className="w-full rounded-2xl overflow-hidden flex flex-col lg:flex-row"
        style={{ background: '#13161f', border: '1px solid rgba(255,255,255,0.1)', maxWidth: '1000px', maxHeight: '92vh' }}
        onClick={e => e.stopPropagation()}>

        {/* LEFT gallery */}
        <div className="relative lg:w-[48%] flex-shrink-0" style={{ minHeight: '320px' }}>
          <img src={images[imgIndex]} alt={property.name} className="w-full object-cover" style={{ height: '100%', maxHeight: '92vh' }} />
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(19,22,31,0.95) 0%, transparent 55%)' }} />
          <span className="absolute top-4 left-4 text-xs px-3 py-1 rounded-full font-semibold"
            style={{ background: statusColor.bg, color: statusColor.txt, backdropFilter: 'blur(8px)' }}>{statusLabel}</span>
          <span className="absolute top-4 right-4 text-xs px-3 py-1 rounded-full font-semibold"
            style={{ background: isForSale ? 'rgba(99,102,241,0.25)' : 'rgba(59,130,246,0.25)', color: isForSale ? '#a5b4fc' : '#93c5fd', backdropFilter: 'blur(8px)' }}>
            {isForSale ? '🏷 À vendre' : '🔑 À louer'}
          </span>
          {images.length > 1 && (<>
            <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full" style={{ background: 'rgba(0,0,0,0.55)', color: '#fff' }}><ChevronLeft className="h-5 w-5" /></button>
            <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full" style={{ background: 'rgba(0,0,0,0.55)', color: '#fff' }}><ChevronRight className="h-5 w-5" /></button>
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex space-x-1.5">
              {images.map((_: any, i: number) => (
                <button key={i} onClick={() => setImgIndex(i)} className="rounded-full transition-all"
                  style={{ width: i === imgIndex ? '18px' : '6px', height: '6px', background: i === imgIndex ? '#fff' : 'rgba(255,255,255,0.4)' }} />
              ))}
            </div>
          </>)}
          <div className="absolute bottom-6 left-5">
            <p className="text-4xl font-bold text-white">{(property.rent ?? 0).toLocaleString()}€</p>
            <p className="text-sm mt-0.5" style={{ color: '#9ca3af' }}>{isForSale ? 'Prix de vente' : 'par mois'}</p>
          </div>
        </div>

        {/* RIGHT info */}
        <div className="flex-1 flex flex-col overflow-hidden" style={{ borderLeft: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">{property.name}</h2>
                <p className="text-sm flex items-center" style={{ color: '#6b7280' }}>
                  <MapPin className="h-4 w-4 mr-1.5 flex-shrink-0" />{property.address}
                </p>
              </div>
              <button onClick={onClose} className="p-2 rounded-xl ml-4 flex-shrink-0"
                style={{ background: 'rgba(255,255,255,0.06)', color: '#9ca3af' }}>
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex items-center space-x-1">
              {[1,2,3,4,5].map(s => <Award key={s} className="h-4 w-4" style={{ color: '#fbbf24' }} />)}
              <span className="text-xs ml-2" style={{ color: '#6b7280' }}>Très bien noté</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Bed,      label: 'Pièces',        value: `${property.rooms || '—'}` },
                { icon: Maximize, label: 'Surface',        value: `${property.area || '—'} m²` },
                { icon: Droplets, label: 'Salle de bain',  value: `${(property as any).baths || '1'}` },
                { icon: Calendar, label: 'Disponibilité',  value: property.status === 'vacant' ? 'Immédiate' : 'Occupé' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="p-3 rounded-xl flex items-center space-x-3"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="p-2 rounded-lg flex-shrink-0" style={{ background: 'rgba(59,130,246,0.15)' }}>
                    <Icon className="h-4 w-4" style={{ color: '#60a5fa' }} />
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: '#6b7280' }}>{label}</p>
                    <p className="text-sm font-semibold text-white">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* GPS si dispo */}
            {(property as any).lat && (property as any).lng && (
              <div className="flex items-center space-x-2 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ color: '#60a5fa', fontWeight: 700 }}>📍</span>
                <p className="text-xs" style={{ color: '#9ca3af' }}>
                  GPS : <span className="text-white">{(property as any).lat}, {(property as any).lng}</span>
                </p>
                <a
                  href={`https://maps.google.com/?q=${(property as any).lat},${(property as any).lng}`}
                  target="_blank" rel="noreferrer"
                  className="ml-auto text-xs px-2 py-1 rounded-lg"
                  style={{ background: 'rgba(59,130,246,0.2)', color: '#60a5fa' }}
                  onClick={e => e.stopPropagation()}
                >
                  Voir sur Maps
                </a>
              </div>
            )}

            <div>
              <h4 className="text-sm font-semibold text-white mb-2">Description</h4>
              <p className="text-sm leading-relaxed" style={{ color: '#9ca3af' }}>
                {(property as any).description ||
                  'Magnifique bien situé en plein cœur de la ville, offrant un cadre de vie agréable avec de belles prestations.'}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Équipements & Services</h4>
              <div className="grid grid-cols-3 gap-2">
                {(savedAmenities.length > 0
                  ? savedAmenities.map(a => ({ label: a }))
                  : defaultAmenities
                ).map((item: any) => {
                  const Icon = item.icon || Wifi;
                  return (
                    <div key={item.label} className="flex items-center space-x-2 p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
                      <Icon className="h-3.5 w-3.5 flex-shrink-0" style={{ color: '#60a5fa' }} />
                      <span className="text-xs" style={{ color: '#9ca3af' }}>{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-4 rounded-xl" style={{ background: 'rgba(59,130,246,0.07)', border: '1px solid rgba(59,130,246,0.2)' }}>
              <p className="text-xs font-semibold mb-1" style={{ color: '#60a5fa' }}>Contact Propriétaire</p>
              <p className="text-sm text-white font-medium">{(property as any).contactName || 'Jean Dupont'}</p>
              <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>
                {(property as any).contactPhone || '+33 6 12 34 56 78'} · {(property as any).contactEmail || 'agent@propertyflow.fr'}
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="p-5 space-y-3 flex-shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            {isAvailable ? (
              isForSale ? (
                <button className="w-full flex items-center justify-center py-3.5 rounded-xl font-semibold text-sm"
                  style={{ background: 'linear-gradient(135deg,#10b981,#059669)', color: '#fff' }}>
                  <ShoppingBag className="h-5 w-5 mr-2" />Acheter ce bien
                </button>
              ) : (
                <button className="w-full flex items-center justify-center py-3.5 rounded-xl font-semibold text-sm"
                  style={{ background: 'linear-gradient(135deg,#3b82f6,#6366f1)', color: '#fff' }}>
                  <Lock className="h-5 w-5 mr-2" />Louer ce bien
                </button>
              )
            ) : (
              <div className="w-full flex items-center justify-center py-3.5 rounded-xl text-sm font-semibold"
                style={{ background: 'rgba(255,255,255,0.05)', color: '#6b7280', cursor: 'not-allowed' }}>
                {property.status === 'occupied' ? '🔒 Bien actuellement occupé' : '🔧 En cours de maintenance'}
              </div>
            )}
            <button className="w-full flex items-center justify-center py-3 rounded-xl text-sm font-medium"
              style={{ border: '1px solid rgba(255,255,255,0.1)', color: '#9ca3af' }}>
              <Edit className="h-4 w-4 mr-2" />Modifier les infos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   PROPERTY CARD
══════════════════════════════════════════ */
const PropertyCard = ({ property, onClick }: { property: Property; onClick: () => void }) => {
  const isForSale = (property as any).listingType === 'sale';
  const img = (property as any).images?.[0] || 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80';

  return (
    <div
      className="rounded-xl overflow-hidden cursor-pointer"
      style={{ ...card, transition: 'transform 0.2s, box-shadow 0.2s' }}
      onClick={onClick}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.025)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(0,0,0,0.4)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
    >
      <div className="relative h-48">
        <img src={img} alt={property.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 55%)' }} />
        <span className="absolute top-3 left-3 text-xs px-2.5 py-1 rounded-full font-medium"
          style={{
            background: property.status === 'occupied' ? 'rgba(52,211,153,0.2)' : property.status === 'vacant' ? 'rgba(251,191,36,0.2)' : 'rgba(248,113,113,0.2)',
            color: property.status === 'occupied' ? '#34d399' : property.status === 'vacant' ? '#fbbf24' : '#f87171',
            backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)'
          }}>
          {property.status === 'occupied' ? 'Occupé' : property.status === 'vacant' ? 'Disponible' : 'Maintenance'}
        </span>
        <span className="absolute top-3 right-3 text-xs px-2.5 py-1 rounded-full font-medium"
          style={{ background: isForSale ? 'rgba(99,102,241,0.25)' : 'rgba(59,130,246,0.25)', color: isForSale ? '#a5b4fc' : '#93c5fd', backdropFilter: 'blur(8px)' }}>
          {isForSale ? 'Vente' : 'Location'}
        </span>
        <div className="absolute bottom-3 left-4">
          <span className="text-lg font-bold text-white">{(property.rent ?? 0).toLocaleString()}€</span>
          <span className="text-xs ml-1" style={{ color: '#9ca3af' }}>{isForSale ? '' : '/mois'}</span>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between mb-1">
          <h3 className="text-base font-semibold text-white">{property.name}</h3>
          <MoreVertical className="h-4 w-4 flex-shrink-0 ml-2" style={{ color: '#6b7280' }} />
        </div>
        <p className="text-xs flex items-center mb-4" style={{ color: '#6b7280' }}>
          <MapPin className="h-3 w-3 mr-1" />{property.address}
        </p>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { icon: Home,  label: `${property.rooms || '—'} pièces` },
            { icon: Users, label: `${property.area || '—'}m²` },
            { icon: Euro,  label: `${property.rent || 0}€` }
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="text-center py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <Icon className="h-3.5 w-3.5 mx-auto mb-1" style={{ color: '#6b7280' }} />
              <p className="text-xs text-white">{label}</p>
            </div>
          ))}
        </div>
        <button className="w-full py-2.5 rounded-xl text-sm flex items-center justify-center font-semibold"
          style={{ background: isForSale ? 'linear-gradient(135deg,#10b981,#059669)' : 'linear-gradient(135deg,#3b82f6,#6366f1)', color: '#fff' }}>
          <Eye className="h-4 w-4 mr-2" />{isForSale ? 'Voir & Acheter' : 'Voir & Louer'}
        </button>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════
   PAGE PRINCIPALE
══════════════════════════════════════════ */
export default function Properties() {
  /* ── STATE CENTRAL : liste des propriétés ── */
  const [properties, setProperties] = useState<Property[]>(mockProperties as Property[]);
  const [searchTerm, setSearchTerm]             = useState('');
  const [filterStatus, setFilterStatus]         = useState('all');
  const [filterType, setFilterType]             = useState('all');
  const [showAddModal, setShowAddModal]         = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  /* Ajout d'une nouvelle propriété */
  const handleSave = (newProp: Property) => {
    setProperties(prev => [newProp, ...prev]);
  };

  const filtered = properties.filter(p => {
    const lt = (p as any).listingType ?? 'rent';
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.address.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch &&
      (filterStatus === 'all' || p.status === filterStatus) &&
      (filterType   === 'all' || lt === filterType);
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-white">Propriétés</h2>
          <p style={{ color: '#6b7280' }}>
            {properties.length} bien{properties.length > 1 ? 's' : ''} · cliquez pour les détails
          </p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="flex items-center px-4 py-2 rounded-xl text-sm font-medium"
          style={{ background: 'linear-gradient(135deg,#3b82f6,#6366f1)', color: '#fff' }}>
          <Plus className="h-4 w-4 mr-2" />Ajouter Propriété
        </button>
      </div>

      {/* Filtres */}
      <div className="p-4 rounded-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4" style={card}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: '#6b7280' }} />
          <input type="text" placeholder="Rechercher par nom ou adresse..." value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)} className="pl-10"
            style={{ ...inputStyle, width: '256px' }} />
        </div>
        <div className="flex items-center space-x-3">
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ ...inputStyle, width: 'auto' }}>
            <option value="all">Tous les statuts</option>
            <option value="occupied">Occupé</option>
            <option value="vacant">Disponible</option>
            <option value="maintenance">Maintenance</option>
          </select>
          <select value={filterType} onChange={e => setFilterType(e.target.value)} style={{ ...inputStyle, width: 'auto' }}>
            <option value="all">Vente & Location</option>
            <option value="sale">À vendre</option>
            <option value="rent">À louer</option>
          </select>
          <button className="flex items-center space-x-2 px-3 py-2 rounded-xl text-sm"
            style={{ border: '1px solid rgba(255,255,255,0.1)', color: '#9ca3af' }}>
            <Filter className="h-4 w-4" /><span>Filtres</span>
          </button>
        </div>
      </div>

      {/* Grille */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(p => (
          <PropertyCard key={p.id} property={p} onClick={() => setSelectedProperty(p)} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Building2 className="h-12 w-12 mx-auto mb-4" style={{ color: '#374151' }} />
          <p style={{ color: '#6b7280' }}>Aucune propriété trouvée</p>
        </div>
      )}

      {/* Modales */}
      {selectedProperty && (
        <PropertyDetailModal property={selectedProperty} onClose={() => setSelectedProperty(null)} />
      )}
      {showAddModal && (
        <AddPropertyModal onClose={() => setShowAddModal(false)} onSave={handleSave} />
      )}
    </div>
  );
}