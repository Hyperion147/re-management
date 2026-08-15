'use client';

import React, { useState, useEffect, useCallback } from 'react';

type Application = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  licenseState: string;
  brokerageName: string;
  mlsId?: string;
  services: string[];
  zipCode: string;
  radiusMiles: number;
  willingToTravel: boolean;
  availableDays: string[];
  acceptSameDay: boolean;
  photoUrl?: string;
  bio?: string;
  specialties?: string[];
  languages?: string;
  yearsOfExperience?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
  adminNote?: string;
  createdAt: string;
};

type Tab = 'pending' | 'approved' | 'rejected' | 'suspended';

const STATUS_BADGE: Record<string, string> = {
  PENDING:   'bg-amber-50 text-amber-600 border-amber-200',
  APPROVED:  'bg-green-50 text-green-600 border-green-200',
  REJECTED:  'bg-red-50 text-red-600 border-red-200',
  SUSPENDED: 'bg-gray-100 text-gray-500 border-gray-200',
};

export default function AdminAgentsPage() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('pending');
  const [selected, setSelected] = useState<Application | null>(null);
  const [note, setNote] = useState('');
  const [acting, setActing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/admin/agents');
    const data = await res.json();
    setApps(data.applications || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const counts = {
    pending:   apps.filter(a => a.status === 'PENDING').length,
    approved:  apps.filter(a => a.status === 'APPROVED').length,
    rejected:  apps.filter(a => a.status === 'REJECTED').length,
    suspended: apps.filter(a => a.status === 'SUSPENDED').length,
  };

  const visible = apps.filter(a => a.status === tab.toUpperCase());

  const action = async (id: string, status: string) => {
    setActing(true);
    await fetch(`/api/admin/agents/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, adminNote: note }),
    });
    setActing(false);
    setSelected(null);
    setNote('');
    load();
  };

  const TABS: { key: Tab; label: string }[] = [
    { key: 'pending',   label: 'New Requests' },
    { key: 'approved',  label: 'Approved' },
    { key: 'rejected',  label: 'Rejected' },
    { key: 'suspended', label: 'Suspended' },
  ];

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#1a2a2a] tracking-tight">Agents</h2>
          <p className="text-sm text-gray-400 font-medium mt-1">Review applications and manage approved agents</p>
        </div>
        <button onClick={load} className="bg-white border border-gray-100 px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 flex items-center gap-2 shadow-sm">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Stat chips */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Pending', count: counts.pending,   color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Approved', count: counts.approved, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Rejected', count: counts.rejected, color: 'text-red-500',   bg: 'bg-red-50' },
          { label: 'Suspended', count: counts.suspended, color: 'text-gray-500', bg: 'bg-gray-100' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex items-center gap-4">
            <div className={`text-2xl font-extrabold ${s.color}`}>{s.count}</div>
            <div className={`text-[10px] font-black uppercase tracking-widest text-gray-400`}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-2xl w-fit">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              tab === t.key ? 'bg-white text-[#1a2a2a] shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label}
            {counts[t.key] > 0 && (
              <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                t.key === 'pending' ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {counts[t.key]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-50 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1a362d]" />
          </div>
        ) : visible.length === 0 ? (
          <div className="py-20 text-center">
            <div className="text-4xl mb-3">🪪</div>
            <p className="text-gray-400 font-medium text-sm">No {tab} applications</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/60 border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <th className="px-7 py-4">Agent</th>
                <th className="px-7 py-4">License</th>
                <th className="px-7 py-4">Brokerage</th>
                <th className="px-7 py-4">Service Area</th>
                <th className="px-7 py-4">Applied</th>
                <th className="px-7 py-4">Status</th>
                <th className="px-7 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {visible.map(app => (
                <tr key={app.id} className="hover:bg-gray-50/40 transition-colors">
                  <td className="px-7 py-5">
                    <div className="flex items-center gap-3">
                      {app.photoUrl ? (
                        <img src={app.photoUrl} alt={app.fullName} className="w-9 h-9 rounded-full object-cover border border-gray-100 flex-shrink-0" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-[#1a362d]/10 flex items-center justify-center text-[#1a362d] font-bold text-sm flex-shrink-0">
                          {app.fullName.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-[#1a2a2a] text-sm">{app.fullName}</p>
                        <p className="text-xs text-gray-400 font-medium">{app.email}</p>
                        <p className="text-xs text-gray-400 font-medium">{app.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-7 py-5">
                    <p className="text-sm font-bold text-[#1a2a2a]">{app.licenseNumber}</p>
                    <p className="text-xs text-gray-400 font-medium">{app.licenseState}</p>
                    {app.mlsId && <p className="text-xs text-gray-400 font-medium">MLS: {app.mlsId}</p>}
                  </td>
                  <td className="px-7 py-5">
                    <p className="text-sm font-semibold text-[#1a2a2a]">{app.brokerageName}</p>
                    {app.yearsOfExperience && (
                      <p className="text-xs text-gray-400 font-medium">{app.yearsOfExperience} yrs exp.</p>
                    )}
                  </td>
                  <td className="px-7 py-5">
                    <p className="text-sm font-semibold text-[#1a2a2a]">{app.zipCode} · {app.radiusMiles}mi</p>
                    {app.willingToTravel && (
                      <p className="text-xs text-[#d69e5e] font-bold">Willing to travel</p>
                    )}
                    <p className="text-xs text-gray-400 font-medium mt-0.5">
                      {Array.isArray(app.availableDays) ? app.availableDays.slice(0, 3).join(', ') + (app.availableDays.length > 3 ? '…' : '') : ''}
                    </p>
                  </td>
                  <td className="px-7 py-5 text-xs text-gray-400 font-medium">
                    {new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-7 py-5">
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest border ${STATUS_BADGE[app.status]}`}>
                      {app.status}
                    </span>
                    {app.adminNote && (
                      <p className="text-[10px] text-gray-400 mt-1 max-w-[120px] truncate" title={app.adminNote}>
                        "{app.adminNote}"
                      </p>
                    )}
                  </td>
                  <td className="px-7 py-5 text-right">
                    <button
                      onClick={() => { setSelected(app); setNote(app.adminNote || ''); }}
                      className="bg-[#1a362d] hover:bg-[#112424] text-white px-4 py-2 rounded-xl text-[11px] font-bold transition-all"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Detail / Action Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={e => { if (e.target === e.currentTarget) setSelected(null); }}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
              <div className="flex items-center gap-4">
                {selected.photoUrl ? (
                  <img src={selected.photoUrl} alt={selected.fullName} className="w-12 h-12 rounded-full object-cover border-2 border-gray-100" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#1a362d]/10 flex items-center justify-center text-[#1a362d] font-bold text-lg">
                    {selected.fullName.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-[#1a2a2a] text-lg">{selected.fullName}</h3>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest border ${STATUS_BADGE[selected.status]}`}>
                    {selected.status}
                  </span>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal body */}
            <div className="px-8 py-6 space-y-6">
              {/* Contact */}
              <Section title="Contact">
                <Row label="Email" value={selected.email} />
                <Row label="Phone" value={selected.phone} />
              </Section>

              {/* License */}
              <Section title="License & Brokerage">
                <Row label="License #" value={selected.licenseNumber} />
                <Row label="State" value={selected.licenseState} />
                <Row label="Brokerage" value={selected.brokerageName} />
                {selected.mlsId && <Row label="MLS ID" value={selected.mlsId} />}
                {selected.yearsOfExperience && <Row label="Experience" value={`${selected.yearsOfExperience} years`} />}
              </Section>

              {/* Services */}
              <Section title="Services Offered">
                <div className="flex flex-wrap gap-2 mt-1">
                  {(Array.isArray(selected.services) ? selected.services : []).map(s => (
                    <span key={s} className="bg-[#1a362d]/10 text-[#1a362d] text-xs font-bold px-3 py-1 rounded-full">{s}</span>
                  ))}
                </div>
              </Section>

              {/* Service Area */}
              <Section title="Service Area">
                <Row label="ZIP Code" value={selected.zipCode} />
                <Row label="Radius" value={`${selected.radiusMiles} miles`} />
                <Row label="Travel" value={selected.willingToTravel ? 'Willing to travel farther' : 'Radius only'} />
                <Row label="Days" value={(Array.isArray(selected.availableDays) ? selected.availableDays : []).join(', ') || '—'} />
                <Row label="Same-Day" value={selected.acceptSameDay ? 'Yes' : 'No'} />
              </Section>

              {/* Profile */}
              {(selected.bio || selected.languages || selected.specialties?.length) && (
                <Section title="Profile">
                  {selected.bio && <Row label="Bio" value={selected.bio} />}
                  {selected.languages && <Row label="Languages" value={selected.languages} />}
                  {selected.specialties?.length && (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selected.specialties.map(s => (
                        <span key={s} className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full">{s}</span>
                      ))}
                    </div>
                  )}
                </Section>
              )}

              {/* Admin note */}
              <div>
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest block mb-2">Admin Note (optional)</label>
                <textarea
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="e.g. License verified, proceeding with approval..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm font-medium text-[#1a2a2a] focus:outline-none focus:ring-2 focus:ring-[#1a362d]/20 focus:border-[#1a362d] resize-none"
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="px-8 pb-8 flex flex-wrap gap-3">
              {selected.status !== 'APPROVED' && (
                <button
                  onClick={() => action(selected.id, 'APPROVED')}
                  disabled={acting}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-2xl text-sm font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Approve
                </button>
              )}
              {selected.status !== 'REJECTED' && (
                <button
                  onClick={() => action(selected.id, 'REJECTED')}
                  disabled={acting}
                  className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 py-3 rounded-2xl text-sm font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Reject
                </button>
              )}
              {selected.status === 'APPROVED' && (
                <button
                  onClick={() => action(selected.id, 'SUSPENDED')}
                  disabled={acting}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 border border-gray-200 py-3 rounded-2xl text-sm font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                  Suspend
                </button>
              )}
              {selected.status === 'SUSPENDED' && (
                <button
                  onClick={() => action(selected.id, 'APPROVED')}
                  disabled={acting}
                  className="flex-1 bg-green-50 hover:bg-green-100 text-green-600 border border-green-200 py-3 rounded-2xl text-sm font-bold transition-all disabled:opacity-50"
                >
                  Reactivate
                </button>
              )}
              {selected.status === 'REJECTED' && (
                <button
                  onClick={() => action(selected.id, 'PENDING')}
                  disabled={acting}
                  className="flex-1 bg-amber-50 hover:bg-amber-100 text-amber-600 border border-amber-200 py-3 rounded-2xl text-sm font-bold transition-all disabled:opacity-50"
                >
                  Move to Pending
                </button>
              )}
              <button onClick={() => setSelected(null)} className="px-6 py-3 rounded-2xl border border-gray-200 text-sm font-bold text-gray-500 hover:bg-gray-50 transition-all">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-black text-[#d69e5e] uppercase tracking-widest mb-3">{title}</p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between py-1.5 border-b border-gray-50 last:border-0">
      <span className="text-xs font-bold text-gray-400 uppercase tracking-wide w-28 flex-shrink-0">{label}</span>
      <span className="text-sm font-semibold text-[#1a2a2a] text-right flex-1 leading-relaxed">{value || '—'}</span>
    </div>
  );
}
