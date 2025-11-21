import React from 'react';
import { Package } from '../types';
import { Clock, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PackageCardProps {
  pkg: Package;
}

export const PackageCard: React.FC<PackageCardProps> = ({ pkg }) => {
  return (
    <Link to={`/package/${pkg.id}`} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={pkg.thumbnailUrl} 
          alt={pkg.title} 
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-800 shadow-sm">
          {pkg.region}
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-brand-600 transition-colors">
          {pkg.title}
        </h3>
        
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{pkg.durationDays} Days</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{pkg.region}</span>
          </div>
        </div>

        <div className="mt-auto pt-4 border-t flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500 uppercase font-semibold">Starting from</span>
            <div className="text-xl font-bold text-brand-600">${pkg.priceFrom}</div>
          </div>
          <span className="px-4 py-2 bg-gray-50 text-gray-700 text-sm font-medium rounded-lg group-hover:bg-brand-600 group-hover:text-white transition-colors">
            View Details
          </span>
        </div>
      </div>
    </Link>
  );
};
