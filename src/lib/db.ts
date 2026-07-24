/**
 * db.ts — Couche d'accès aux données via Supabase
 * Fallback vers les données mock si Supabase n'est pas disponible
 */
import { supabase } from './supabaseClient';
import { Property, Tenant, Payment, Maintenance } from '../types';
import { mockProperties, mockTenants, mockPayments, mockMaintenance } from '../data/mockData';

const USE_SUPABASE = !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);

/* ── Propriétés ── */
export async function getProperties(): Promise<Property[]> {
  if (!USE_SUPABASE) return mockProperties;
  const { data, error } = await supabase.from('properties').select('*').order('created_at', { ascending: false });
  if (error) { console.error('getProperties:', error); return mockProperties; }
  return (data as Property[]) ?? mockProperties;
}

export async function addProperty(p: Omit<Property, 'id'>): Promise<Property | null> {
  if (!USE_SUPABASE) return { ...p, id: Date.now().toString() } as Property;
  const { data, error } = await supabase.from('properties').insert([p]).select().single();
  if (error) { console.error('addProperty:', error); return null; }
  return data as Property;
}

export async function updateProperty(id: string, updates: Partial<Property>): Promise<boolean> {
  if (!USE_SUPABASE) return true;
  const { error } = await supabase.from('properties').update(updates).eq('id', id);
  if (error) { console.error('updateProperty:', error); return false; }
  return true;
}

export async function deleteProperty(id: string): Promise<boolean> {
  if (!USE_SUPABASE) return true;
  const { error } = await supabase.from('properties').delete().eq('id', id);
  if (error) { console.error('deleteProperty:', error); return false; }
  return true;
}

/* ── Locataires ── */
export async function getTenants(): Promise<Tenant[]> {
  if (!USE_SUPABASE) return mockTenants;
  const { data, error } = await supabase.from('tenants').select('*').order('created_at', { ascending: false });
  if (error) { console.error('getTenants:', error); return mockTenants; }
  return (data as Tenant[]) ?? mockTenants;
}

export async function addTenant(t: Omit<Tenant, 'id'>): Promise<Tenant | null> {
  if (!USE_SUPABASE) return { ...t, id: Date.now().toString() } as Tenant;
  const { data, error } = await supabase.from('tenants').insert([t]).select().single();
  if (error) { console.error('addTenant:', error); return null; }
  return data as Tenant;
}

/* ── Paiements ── */
export async function getPayments(): Promise<Payment[]> {
  if (!USE_SUPABASE) return mockPayments;
  const { data, error } = await supabase.from('payments').select('*').order('created_at', { ascending: false });
  if (error) { console.error('getPayments:', error); return mockPayments; }
  return (data as Payment[]) ?? mockPayments;
}

export async function addPayment(p: Omit<Payment, 'id'>): Promise<Payment | null> {
  if (!USE_SUPABASE) return { ...p, id: Date.now().toString() } as Payment;
  const { data, error } = await supabase.from('payments').insert([p]).select().single();
  if (error) { console.error('addPayment:', error); return null; }
  return data as Payment;
}

/* ── Maintenance ── */
export async function getMaintenances(): Promise<Maintenance[]> {
  if (!USE_SUPABASE) return mockMaintenance;
  const { data, error } = await supabase.from('maintenance').select('*').order('created_at', { ascending: false });
  if (error) { console.error('getMaintenances:', error); return mockMaintenance; }
  return (data as Maintenance[]) ?? mockMaintenance;
}

export async function addMaintenance(m: Omit<Maintenance, 'id'>): Promise<Maintenance | null> {
  if (!USE_SUPABASE) return { ...m, id: Date.now().toString() } as Maintenance;
  const { data, error } = await supabase.from('maintenance').insert([m]).select().single();
  if (error) { console.error('addMaintenance:', error); return null; }
  return data as Maintenance;
}

/* ── Demandes de contact ── */
export interface ContactRequest {
  id?: string;
  property_id: string;
  property_name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  message: string;
  contact_via: 'whatsapp' | 'email';
  created_at?: string;
}

export async function saveContactRequest(req: Omit<ContactRequest, 'id' | 'created_at'>): Promise<boolean> {
  if (!USE_SUPABASE) {
    console.log('Contact request (mock):', req);
    return true;
  }
  const { error } = await supabase.from('contact_requests').insert([req]);
  if (error) { console.error('saveContactRequest:', error); return false; }
  return true;
}
