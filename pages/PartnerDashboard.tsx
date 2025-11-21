import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../App';
import { mockDb } from '../services/mockDatabase';
import { Lead, LeadStatus, Package } from '../types';
import { Phone, Mail, Calendar, User, CheckCircle } from 'lucide-react';

export const PartnerDashboard: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);

  const loadData = () => {
    if (!user) return;
    const allLeads = mockDb.getLeads().filter(l => l.partnerId === user.id);
    setLeads(allLeads);
    setPackages(mockDb.getPackages());
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleStatusUpdate = (leadId: string, newStatus: string) => {
    mockDb.updateLead(leadId, { status: newStatus as LeadStatus });
    loadData();
  };

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Partner Dashboard</h1>
        <p className="text-gray-500">Welcome, {user.name}. Manage your inquiries.</p>
      </div>

      <div className="grid gap-6">
        {leads.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
            <h3 className="text-gray-400 font-medium">No leads assigned yet.</h3>
          </div>
        ) : (
          leads.map(lead => {
            const pkg = packages.find(p => p.id === lead.packageId);
            return (
              <div key={lead.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                        {lead.customerName}
                        {lead.status === 'New' && <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">New</span>}
                      </h3>
                      <p className="text-brand-600 font-medium text-sm">{pkg?.title}</p>
                    </div>
                    <div className="text-right text-xs text-gray-400">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" /> {lead.customerPhone}
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" /> {lead.customerEmail}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" /> Travel: {lead.travelDate}
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" /> {lead.travelers} Travelers
                    </div>
                  </div>

                  {lead.specialRequirements && (
                    <div className="bg-gray-50 p-3 rounded text-xs text-gray-600 italic">
                      " {lead.specialRequirements} "
                    </div>
                  )}
                </div>

                <div className="w-full md:w-64 border-t md:border-t-0 md:border-l border-gray-100 md:pl-6 flex flex-col justify-center space-y-3">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Update Status</label>
                  <select 
                    value={lead.status}
                    onChange={(e) => handleStatusUpdate(lead.id, e.target.value)}
                    className={`w-full p-2 rounded-lg border text-sm font-medium focus:ring-2 focus:ring-brand-500 outline-none
                      ${lead.status === 'New' ? 'border-blue-200 bg-blue-50 text-blue-800' :
                        lead.status === 'Converted' ? 'border-green-200 bg-green-50 text-green-800' :
                        'border-gray-200 bg-white text-gray-700'}
                    `}
                  >
                    <option value="New">New Lead</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Not Interested">Not Interested</option>
                    <option value="Converted">Converted</option>
                  </select>

                  {lead.status === 'Converted' && (
                    <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 p-2 rounded justify-center">
                      <CheckCircle className="w-3 h-3" /> Sale Recorded
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
