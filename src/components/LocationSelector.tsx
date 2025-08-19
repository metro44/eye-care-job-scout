'use client';

import { useState } from 'react';
import { MapPin, ChevronDown, Search } from 'lucide-react';

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
    <div className="glass rounded-xl p-4 sm:p-6 shadow-xl">
      <div className="text-center mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Find Eye Care Facilities</h2>
        <p className="text-[#B0A6A7] text-sm sm:text-base">Select a location to discover hospitals and clinics</p>
      </div>

      <div className="space-y-4">
        {/* Quick Select Dropdown */}
        <div className="relative">
          <label className="block text-sm font-medium text-[#B0A6A7] mb-2">
            Quick Select Major Cities
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full input-field flex items-center justify-between cursor-pointer"
            >
              <span className={selectedLocation ? 'text-[#30333A]' : 'text-[#72676F]'}>
                {selectedLocation || 'Choose a major city...'}
              </span>
              <ChevronDown 
                className={`w-5 h-5 text-[#72676F] transition-transform duration-200 ${
                  isDropdownOpen ? 'rotate-180' : ''
                }`} 
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 glass-dark rounded-lg shadow-xl border border-[#B0A6A7]/20 max-h-60 overflow-y-auto">
                {MAJOR_CITIES.map((city) => (
                  <button
                    key={city}
                    onClick={() => handleLocationSelect(city)}
                    className="w-full px-4 py-3 text-left text-[#B0A6A7] hover:bg-[#72676F]/20 hover:text-white transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-4 h-4" />
                      <span>{city}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#B0A6A7]/20"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-[#30333A] text-[#B0A6A7]">or</span>
          </div>
        </div>

        {/* Custom Location Input */}
        <div>
          <label className="block text-sm font-medium text-[#B0A6A7] mb-2">
            Search Any Location
          </label>
          <form onSubmit={handleCustomLocationSubmit} className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#72676F]" />
              <input
                type="text"
                value={customLocation}
                onChange={(e) => setCustomLocation(e.target.value)}
                placeholder="Enter city, state, or country..."
                className="input-field w-full pl-10"
              />
            </div>
            <button
              type="submit"
              disabled={!customLocation.trim()}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
            >
              Search
            </button>
          </form>
        </div>

        {/* Selected Location Display */}
        {selectedLocation && (
          <div className="mt-4 p-4 bg-gradient-warm rounded-lg border border-[#B0A6A7]/30">
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-[#30333A]" />
              <span className="font-medium text-[#30333A]">Selected: {selectedLocation}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
