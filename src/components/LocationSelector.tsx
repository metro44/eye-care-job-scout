'use client';

import { useState } from 'react';
import { MapPin, ChevronDown, Search } from 'lucide-react';
import AnimatedList from '@/components/AnimatedList';

interface LocationSelectorProps {
  onLocationSelect: (location: string) => void;
}

const MAJOR_CITIES = [
  'Lagos, Nigeria',
  'Abuja, Nigeria',
  'Port Harcourt, Nigeria',
  'Kano, Nigeria',
  'Ibadan, Nigeria',
  'Kaduna, Nigeria',
  'Enugu, Nigeria',
  'Calabar, Nigeria',
];

export default function LocationSelector({ onLocationSelect }: LocationSelectorProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [customLocation, setCustomLocation] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
    setIsDropdownOpen(false);
    onLocationSelect(location);
  };

  const handleCustomLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customLocation.trim()) {
      handleLocationSelect(customLocation.trim());
      setCustomLocation('');
    }
  };

  return (
    <div className="glass rounded-xl p-6 sm:p-8 shadow-2xl bg-white/95 backdrop-blur-sm">
      <div className="text-center mb-6 sm:mb-8">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
          <MapPin className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-dark mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
          Find Eye Care Facilities
        </h2>
        <p className="text-light text-sm sm:text-base">
          Discover hospitals and clinics in your preferred location
        </p>
      </div>

      <div className="space-y-6">
        {/* Search First Approach */}
        <div>
          <label className="block text-sm font-medium text-dark mb-2 flex items-center">
            <Search className="w-4 h-4 mr-2 text-primary" />
            Search Location
          </label>
          <form onSubmit={handleCustomLocationSubmit} className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <div className="relative flex-1 group">
              <input
                type="text"
                value={customLocation}
                onChange={(e) => setCustomLocation(e.target.value)}
                placeholder="Enter city, state, or country..."
                className="input-field w-full pl-4 pr-10 py-3 shadow-sm group-hover:shadow-md transition-shadow duration-200"
              />
              {/* <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary opacity-50 group-hover:opacity-100 transition-opacity duration-200" /> */}
            </div>
            <button
              type="submit"
              disabled={!customLocation.trim()}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto shadow-lg hover:shadow-xl transition-shadow duration-200 py-3 px-6"
            >
              Search
            </button>
          </form>
        </div>

        {/* Divider with Popular Cities Text */}
        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-accent"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-4 text-sm font-medium text-light bg-white">Popular Cities</span>
          </div>
        </div>

        {/* Quick Select Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {MAJOR_CITIES.map((city) => (
            <button
              key={city}
              onClick={() => handleLocationSelect(city)}
              className={`p-3 rounded-lg text-sm transition-all duration-200 flex items-center justify-center text-center
                ${selectedLocation === city 
                  ? 'bg-primary text-white shadow-lg scale-105' 
                  : 'hover:bg-accent/10 text-light hover:text-primary border border-accent/50 hover:border-primary/30'
                }`}
            >
              {city.split(',')[0]}
            </button>
          ))}
        </div>

        {/* Selected Location Display */}
        {selectedLocation && (
          <div className="mt-4 p-4 rounded-lg bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/20">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-primary/10">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-xs text-light">Selected Location</div>
                <div className="font-medium text-dark">{selectedLocation}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
