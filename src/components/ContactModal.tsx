import { useState } from 'react';
import {
  X, MessageCircle, Mail, User, Phone, Send,
  CheckCircle, AlertCircle
} from 'lucide-react';
import { saveContactRequest } from '../lib/db';

const ADMIN_WHATSAPP = '22893954818';
const ADMIN_EMAIL    = 'donaaagbenu2000@gmail.com';

interface Props {
  propertyId: string;
  propertyName: string;
  propertyRent: number;
  listingType?: 'rent' | 'sale';
  onClose: () => void;
}

type ContactVia = 'whatsapp' | 'email';
type Step = 'form' | 'success';

const inp: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '10px',
  color: '#fff',
  padding: '10px 12px',
  outline: 'none',
  fontSize: '14px',
};

export default function ContactModal({ propertyId, propertyName, propertyRent, listingType = 'rent', onClose }: Props) {
  const [step, setStep]           = useState<Step>('form');
  const [contactVia, setVia]      = useState<ContactVia>('whatsapp');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName]   = useState('');
  const [email, setEmail]         = useState('');
  const [phone, setPhone]         = useState('');
  const [message, setMessage]     = useState('');
  const [errors, setErrors]       = useState<string[]>([]);
  const [loading, setLoading]     = useState(false);

  const action = listingType === 'sale' ? 'acheter' : 'louer';
  const actionLabel = listingType === 'sale' ? 'Acheter' : 'Louer';

  const validate = () => {
    const e: string[] = [];
    if (!firstName.trim()) e.push('Le prénom est requis.');
    if (!lastName.trim())  e.push('Le nom est requis.');
    if (!email.trim())     e.push("L'email est requis.");
    if (!phone.trim())     e.push('Le téléphone est requis.');
    return e;
  };

  const handleSend = async () => {
    const errs = validate();
    if (errs.length) { setErrors(errs); return; }
    setLoading(true);

    const defaultMsg = message.trim()
      || `Bonjour, je souhaite ${action} la propriété "${propertyName}" (${propertyRent.toLocaleString()} FCFA). Merci de me contacter.`;

    /* Sauvegarder en base */
    await saveContactRequest({
      property_id:   propertyId,
      property_name: propertyName,
      first_name:    firstName.trim(),
      last_name:     lastName.trim(),
      email:         email.trim(),
      phone:         phone.trim(),
      message:       defaultMsg,
      contact_via:   contactVia,
    });

    /* Ouvrir le canal de contact */
    const fullName  = `${firstName.trim()} ${lastName.trim()}`;
    const encodedMsg = encodeURIComponent(
      `*Demande de ${actionLabel}*\n\nPropriété : ${propertyName}\nPrix : ${propertyRent.toLocaleString()} FCFA\n\nNom : ${fullName}\nEmail : ${email.trim()}\nTél : ${phone.trim()}\n\n${defaultMsg}`
    );

    if (contactVia === 'whatsapp') {
      window.open(`https://wa.me/${ADMIN_WHATSAPP}?text=${encodedMsg}`, '_blank');
    } else {
      const subject = encodeURIComponent(`Demande de ${actionLabel} — ${propertyName}`);
      const body    = encodeURIComponent(
        `Bonjour,\n\nNom : ${fullName}\nEmail : ${email.trim()}\nTéléphone : ${phone.trim()}\n\nPropriété : ${propertyName}\nPrix : ${propertyRent.toLocaleString()} FCFA\n\nMessage :\n${defaultMsg}\n\nCordialement,\n${fullName}`
      );
      window.location.href = `mailto:${ADMIN_EMAIL}?subject=${subject}&body=${body}`;
    }

    setLoading(false);
    setStep('success');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}
      onClick={onClose}
    >
      <div
        className="w-full relative flex flex-col"
        style={{
          maxWidth: 480,
          maxHeight: '95vh',
          background: '#13161f',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '20px',
          overflow: 'hidden',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div>
            <h3 className="text-base font-bold text-white">Contacter l'administrateur</h3>
            <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>
              {propertyName} — {propertyRent.toLocaleString()} FCFA
            </p>
          </div>
          <button onClick={onClose}
            className="flex items-center justify-center rounded-xl"
            style={{ width: 34, height: 34, background: 'rgba(255,255,255,0.06)', border: 'none', cursor: 'pointer', color: '#9ca3af' }}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">

          {step === 'success' ? (
            /* ── Succès ── */
            <div className="text-center py-8 space-y-4">
              <div className="flex items-center justify-center">
                <CheckCircle size={52} style={{ color: '#34d399' }} />
              </div>
              <h4 className="text-lg font-bold text-white">Demande envoyée !</h4>
              <p className="text-sm" style={{ color: '#9ca3af' }}>
                {contactVia === 'whatsapp'
                  ? "WhatsApp s'est ouvert. L'administrateur vous répondra rapidement."
                  : "Votre client email s'est ouvert avec le message pré-rempli."}
              </p>
              <div className="pt-2 space-y-2">
                <div className="flex items-center justify-center gap-2 text-sm" style={{ color: '#60a5fa' }}>
                  <MessageCircle size={14} />
                  <span>+228 93 95 48 18</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm" style={{ color: '#60a5fa' }}>
                  <Mail size={14} />
                  <span>{ADMIN_EMAIL}</span>
                </div>
              </div>
              <button onClick={onClose}
                className="mt-4 px-6 py-2.5 rounded-xl text-sm font-semibold text-white"
                style={{ background: 'linear-gradient(135deg,#3b82f6,#6366f1)', border: 'none', cursor: 'pointer' }}>
                Fermer
              </button>
            </div>
          ) : (
            /* ── Formulaire ── */
            <>
              {/* Erreurs */}
              {errors.length > 0 && (
                <div className="p-3 rounded-xl flex gap-2"
                  style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
                  <AlertCircle size={16} style={{ color: '#f87171', flexShrink: 0, marginTop: 1 }} />
                  <div className="space-y-0.5">
                    {errors.map((e, i) => (
                      <p key={i} className="text-xs" style={{ color: '#f87171' }}>{e}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* Canal de contact */}
              <div>
                <p className="text-xs font-semibold mb-2" style={{ color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Choisissez votre canal de contact
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {(['whatsapp', 'email'] as ContactVia[]).map(via => {
                    const active = contactVia === via;
                    return (
                      <button
                        key={via}
                        onClick={() => setVia(via)}
                        className="flex flex-col items-center gap-2 py-4 rounded-xl transition-all"
                        style={{
                          border: active
                            ? via === 'whatsapp' ? '2px solid #25d366' : '2px solid #3b82f6'
                            : '1px solid rgba(255,255,255,0.08)',
                          background: active
                            ? via === 'whatsapp' ? 'rgba(37,211,102,0.1)' : 'rgba(59,130,246,0.1)'
                            : 'rgba(255,255,255,0.03)',
                          cursor: 'pointer',
                        }}
                      >
                        {via === 'whatsapp'
                          ? <MessageCircle size={22} style={{ color: active ? '#25d366' : '#6b7280' }} />
                          : <Mail size={22} style={{ color: active ? '#3b82f6' : '#6b7280' }} />}
                        <span className="text-xs font-semibold"
                          style={{ color: active ? '#fff' : '#6b7280' }}>
                          {via === 'whatsapp' ? 'WhatsApp' : 'Email'}
                        </span>
                        <span className="text-xs" style={{ color: '#6b7280' }}>
                          {via === 'whatsapp' ? '+228 93 95 48 18' : ADMIN_EMAIL}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Infos personnelles */}
              <div>
                <p className="text-xs font-semibold mb-3" style={{ color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Vos informations
                </p>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs mb-1" style={{ color: '#9ca3af' }}>Prénom *</label>
                      <div className="relative">
                        <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#6b7280' }} />
                        <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)}
                          placeholder="Kofi" style={{ ...inp, paddingLeft: 32 }} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs mb-1" style={{ color: '#9ca3af' }}>Nom *</label>
                      <input type="text" value={lastName} onChange={e => setLastName(e.target.value)}
                        placeholder="MENSAH" style={inp} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs mb-1" style={{ color: '#9ca3af' }}>Email *</label>
                    <div className="relative">
                      <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#6b7280' }} />
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                        placeholder="kofi@email.com" style={{ ...inp, paddingLeft: 32 }} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs mb-1" style={{ color: '#9ca3af' }}>Téléphone *</label>
                    <div className="relative">
                      <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#6b7280' }} />
                      <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                        placeholder="+228 90 00 00 00" style={{ ...inp, paddingLeft: 32 }} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs mb-1" style={{ color: '#9ca3af' }}>Message (optionnel)</label>
                    <textarea
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      placeholder={`Je souhaite ${action} ce bien...`}
                      rows={3}
                      style={{ ...inp, resize: 'vertical', minHeight: 80 }}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {step === 'form' && (
          <div className="px-6 pb-5 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <button
              onClick={handleSend}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm text-white transition-all"
              style={{
                background: contactVia === 'whatsapp'
                  ? 'linear-gradient(135deg,#128c7e,#25d366)'
                  : 'linear-gradient(135deg,#3b82f6,#6366f1)',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {contactVia === 'whatsapp'
                ? <MessageCircle size={17} />
                : <Send size={17} />}
              {loading ? 'Envoi...' : `Envoyer via ${contactVia === 'whatsapp' ? 'WhatsApp' : 'Email'}`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
