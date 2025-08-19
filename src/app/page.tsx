'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, MapPin, Eye, Star } from 'lucide-react';
import LocationSelector from '@/components/LocationSelector';
import FacilityCard from '@/components/FacilityCard';
import EnquiryModal from '@/components/EnquiryModal';
import { EyeCareFacility } from '@/types';

export default function Home() {
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [selectedFacility, setSelectedFacility] = useState<EyeCareFacility | null>(null);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState<boolean>(false);

  // Fetch facilities based on selected location
  const { data: facilities = [], isLoading, error } = useQuery({
    queryKey: ['facilities', selectedLocation],
    queryFn: async () => {
      if (!selectedLocation) return [];
      setIsSearching(true);
      try {
        const response = await fetch(`/api/facilities?location=${encodeURIComponent(selectedLocation)}&minRating=0`);
        const data = await response.json();
        return data.facilities || [];
      } catch (error) {
        console.error('Error fetching facilities:', error);
        return [];
      } finally {
        setIsSearching(false);
      }
    },
    enabled: !!selectedLocation,
  });

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
  };

  const handleGenerateEnquiry = (facility: EyeCareFacility) => {
    setSelectedFacility(facility);
    setIsEnquiryModalOpen(true);
  };

  return (
    <div className="min-h-screen gradient-primary">
      {/* Header */}
      <header className="glass-dark border-b border-light/20">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-secondary rounded-lg">
                <Eye className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-xl sm:text-2xl font-bold text-white">Eye Care Job Scout</h1>
                <p className="text-light text-xs sm:text-sm">Find your next opportunity in eye care</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center space-x-4 text-light">
              <span className="text-sm">Powered by OpenStreetMap</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-4 sm:py-8">
        {/* Location Selector */}
        <div className="mb-6 sm:mb-8">
          <LocationSelector onLocationSelect={handleLocationSelect} />
        </div>

        {/* Search Status */}
        {selectedLocation && (
          <div className="mb-6">
            <div className="flex items-center space-x-2 text-light">
              <MapPin className="w-5 h-5" />
              <span className="font-medium">Searching in: {selectedLocation}</span>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading || isSearching ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mb-4"></div>
            <p className="text-light text-lg">Searching for eye care facilities...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="glass rounded-xl p-8 max-w-md mx-auto">
              <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Search Error</h3>
              <p className="text-light">Unable to fetch facilities. Please try again.</p>
            </div>
          </div>
        ) : facilities.length === 0 && selectedLocation ? (
          <div className="text-center py-16">
            <div className="glass rounded-xl p-8 max-w-md mx-auto">
              <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No Facilities Found</h3>
              <p className="text-light mb-4">
                No eye care facilities found in {selectedLocation}. Try searching for a different location.
              </p>
              <button
                onClick={() => setSelectedLocation('')}
                className="btn-secondary"
              >
                Search Different Location
              </button>
            </div>
          </div>
        ) : facilities.length > 0 ? (
          <>
            {/* Results Header */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  Found {facilities.length} facilit{facilities.length !== 1 ? 'ies' : 'y'}
                </h2>
                <div className="flex items-center space-x-2 text-light">
                  <Star className="w-4 h-4" />
                  <span className="text-xs sm:text-sm">Click on any facility to generate an enquiry</span>
                </div>
              </div>
            </div>

            {/* Facilities Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {facilities.map((facility: EyeCareFacility) => (
                <FacilityCard
                  key={facility.place_id}
                  facility={facility}
                  onGenerateEnquiry={handleGenerateEnquiry}
                />
              ))}
            </div>
          </>
        ) : (
          /* Welcome State */
          <div className="text-center py-8 sm:py-16">
            <div className="glass rounded-xl p-6 sm:p-12 max-w-2xl mx-auto">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Eye className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
                Welcome to Eye Care Job Scout
              </h2>
              <p className="text-light text-base sm:text-lg mb-6 sm:mb-8 max-w-lg mx-auto">
                Discover eye care facilities in your area and generate professional enquiries 
                for optometrist and ophthalmologist positions.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <div className="flex items-center space-x-2 text-light">
                  <MapPin className="w-5 h-5" />
                  <span className="text-sm sm:text-base">Select a location above to get started</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Enquiry Modal */}
      {selectedFacility && (
        <EnquiryModal
          isOpen={isEnquiryModalOpen}
          onClose={() => setIsEnquiryModalOpen(false)}
          facility={selectedFacility}
        />
      )}
    </div>
  );
}
