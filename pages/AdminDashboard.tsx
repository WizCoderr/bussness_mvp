import React, { useState, useEffect } from 'react';
import { mockDb } from '../services/mockDatabase';
import { Package, Lead, Partner } from '../types';
import { Briefcase, Users, FileText, Plus, Trash2, Check, DollarSign } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'leads' | 'packages' | 'partners'>('leads');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);

  const refreshData = () => {
    setLeads(mockDb.getLeads());
    setPackages(mockDb.getPackages());
    setPartners(mockDb.getPartners());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleCommissionMark = (id: string) => {
    mockDb.updateLead(id, { commissionReceived: true });
    refreshData();
  };

  const handleDeletePackage = (id: string) => {
    if(window.confirm("Are you sure?")) {
        mockDb.deletePackage(id);
        refreshData();
    }
  };

  // Components for Tabs
  const LeadsTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 text-gray-500 uppercase font-semibold">
          <tr>
            <th className="px-6 py-3">Customer</th>
            <th className="px-6 py-3">Package</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3">Commission</th>
            <th className="px-6 py-3">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {leads.map(lead => {
             const pkg = packages.find(p => p.id === lead.packageId);
             return (
              <tr key={lead.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{lead.customerName}</div>
                  <div className="text-gray-500 text-xs">{lead.customerEmail}</div>
                </td>
                <td className="px-6 py-4 text-gray-700">{pkg?.title || 'Unknown Package'}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    lead.status === 'New' ? 'bg-blue-100 text-blue-800' :
                    lead.status === 'Converted' ? 'bg-green-100 text-green-800' :
                    lead.status === 'Not Interested' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {lead.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {lead.commissionReceived ? (
                    <span className="text-green-600 flex items-center gap-1 font-bold"><Check className="w-4 h-4" /> Paid</span>
                  ) : (
                    <span className="text-gray-400">Pending</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {!lead.commissionReceived && lead.status === 'Converted' && (
                    <button 
                      onClick={() => handleCommissionMark(lead.id)}
                      className="text-xs bg-green-50 text-green-700 px-3 py-1 rounded hover:bg-green-100 border border-green-200"
                    >
                      Mark Paid
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  const PackagesTable = () => (
    <div>
        <div className="flex justify-end mb-4">
            <button className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-brand-700">
                <Plus className="w-4 h-4" /> Add Package
            </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map(pkg => (
                <div key={pkg.id} className="bg-white border rounded-lg overflow-hidden shadow-sm flex flex-col">
                    <img src={pkg.thumbnailUrl} className="h-32 w-full object-cover" alt="" />
                    <div className="p-4 flex-grow">
                        <h4 className="font-bold text-gray-900">{pkg.title}</h4>
                        <div className="text-xs text-gray-500 mt-1 flex justify-between">
                            <span>{pkg.region}</span>
                            <span>${pkg.priceFrom}</span>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-2 border-t flex justify-between items-center">
                         <span className="text-xs text-gray-500">Partner: {partners.find(p => p.id === pkg.partnerId)?.name}</span>
                         <button onClick={() => handleDeletePackage(pkg.id)} className="text-red-500 hover:bg-red-50 p-1 rounded">
                             <Trash2 className="w-4 h-4" />
                         </button>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500">Manage platform operations</p>
        </div>
        
        <div className="flex gap-4">
            <div className="bg-white p-3 rounded-lg shadow-sm border text-center min-w-[120px]">
                <div className="text-xs text-gray-400 uppercase">Revenue (Est)</div>
                <div className="text-xl font-bold text-green-600 flex items-center justify-center">
                    <DollarSign className="w-4 h-4" /> 
                    {leads.filter(l => l.status === 'Converted').length * 50}
                </div>
            </div>
             <div className="bg-white p-3 rounded-lg shadow-sm border text-center min-w-[120px]">
                <div className="text-xs text-gray-400 uppercase">Pending Leads</div>
                <div className="text-xl font-bold text-brand-600">
                    {leads.filter(l => l.status === 'New').length}
                </div>
            </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[500px]">
        <div className="border-b flex">
          <button 
            onClick={() => setActiveTab('leads')}
            className={`px-6 py-4 text-sm font-bold flex items-center gap-2 ${activeTab === 'leads' ? 'bg-gray-50 text-brand-600 border-b-2 border-brand-600' : 'text-gray-500 hover:text-gray-900'}`}
          >
            <FileText className="w-4 h-4" /> Leads Management
          </button>
          <button 
             onClick={() => setActiveTab('packages')}
             className={`px-6 py-4 text-sm font-bold flex items-center gap-2 ${activeTab === 'packages' ? 'bg-gray-50 text-brand-600 border-b-2 border-brand-600' : 'text-gray-500 hover:text-gray-900'}`}
          >
            <Briefcase className="w-4 h-4" /> Packages
          </button>
          <button 
             onClick={() => setActiveTab('partners')}
             className={`px-6 py-4 text-sm font-bold flex items-center gap-2 ${activeTab === 'partners' ? 'bg-gray-50 text-brand-600 border-b-2 border-brand-600' : 'text-gray-500 hover:text-gray-900'}`}
          >
            <Users className="w-4 h-4" /> Partners
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'leads' && <LeadsTable />}
          {activeTab === 'packages' && <PackagesTable />}
          {activeTab === 'partners' && <div className="text-gray-500 text-center py-10">Partner Management CRUD (Similar to Packages)</div>}
        </div>
      </div>
    </div>
  );
};
