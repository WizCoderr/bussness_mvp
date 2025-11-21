import React, { useState, useEffect } from 'react';
import { mockDb } from '../services/mockDatabase';
import { Package } from '../types';
import { PackageCard } from '../components/PackageCard';
import { Search, Map } from 'lucide-react';

export const HomePage: React.FC = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [search, setSearch] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [regions, setRegions] = useState<string[]>([]);

  useEffect(() => {
    const data = mockDb.getPackages();
    setPackages(data);
    const uniqueRegions = Array.from(new Set(data.map(p => p.region)));
    setRegions(uniqueRegions);
  }, []);

  const filteredPackages = packages.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchesRegion = regionFilter ? p.region === regionFilter : true;
    return matchesSearch && matchesRegion;
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-brand-900 text-white py-20 px-4">
        <div className="absolute inset-0 overflow-hidden opacity-20">
             <img src="https://picsum.photos/id/16/1920/1080" className="w-full h-full object-cover" alt="Travel background" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Find Your Next Adventure</h1>
          <p className="text-xl text-brand-100 mb-10">Curated tour packages from trusted local partners.</p>
          
          <div className="bg-white p-2 rounded-xl shadow-lg flex flex-col md:flex-row gap-2 max-w-2xl mx-auto">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Where do you want to go?"
                className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="w-full md:w-48 relative border-t md:border-t-0 md:border-l border-gray-100">
               <Map className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <select 
                className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-800 bg-transparent focus:outline-none cursor-pointer appearance-none"
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
              >
                <option value="">All Regions</option>
                {regions.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            {filteredPackages.length > 0 ? 'Available Packages' : 'No packages found'}
          </h2>
          <span className="text-sm text-gray-500">{filteredPackages.length} tours found</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPackages.map(pkg => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      </section>
    </div>
  );
};
