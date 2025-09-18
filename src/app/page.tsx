'use client';

import { useState } from 'react';
import { Skeleton } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { Search, MapPin, Eye, Star, Share2, Download } from 'lucide-react';
import LocationSelector from '@/components/LocationSelector';
import FacilityCard from '@/components/FacilityCard';
import EnquiryModal from '@/components/EnquiryModal';
import { EyeCareFacility } from '@/types';

export default function Home() {
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [selectedFacility, setSelectedFacility] = useState<EyeCareFacility | null>(null);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 9;

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
    setCurrentPage(1);
  };

  const handleGenerateEnquiry = (facility: EyeCareFacility) => {
    setSelectedFacility(facility);
    setIsEnquiryModalOpen(true);
  };

  return (
    <div className="min-h-screen gradient-primary">
      {/* Header */}
      <header className="glass-dark border-b border-accent">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-secondary rounded-lg">
                <Eye className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-xl sm:text-2xl font-bold text-white">Eye Care Job Scout</h1>
                <p className="text-secondary text-xs sm:text-sm">Find your next opportunity in eye care</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center space-x-4 text-secondary">
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
            <div className="flex items-center space-x-2 text-secondary">
              <MapPin className="w-5 h-5" />
              <span className="font-medium">Searching in: {selectedLocation}</span>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading || isSearching ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 py-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton active  key={i} className="bg-white rounded-xl medical-border p-6 opacity-60">
                <div className="animate-pulse">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 bg-gray-300 rounded-xl"></div>
                      <div>
                        <div className="h-5 bg-gray-300 rounded w-32 mb-2"></div>
                        <div className="h-4 bg-gray-300 rounded w-24"></div>
                      </div>
                    </div>
                    <div className="h-5 bg-gray-300 rounded w-8"></div>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <div className="h-4 bg-gray-300 rounded w-full"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  </div>
                  
                  <div className="flex space-x-2 mb-6">
                    <div className="h-6 bg-gray-300 rounded-full w-16"></div>
                    <div className="h-6 bg-gray-300 rounded-full w-20"></div>
                    <div className="h-6 bg-gray-300 rounded-full w-12"></div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <div className="flex-1 h-10 bg-gray-300 rounded-xl"></div>
                    <div className="h-10 w-10 bg-gray-300 rounded-xl"></div>
                    <div className="h-10 w-10 bg-gray-300 rounded-xl"></div>
                  </div>
                </div>
              </Skeleton >
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="glass rounded-xl p-8 max-w-md mx-auto">
              <div className="w-16 h-16 bg-light rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Search Error</h3>
              <p className="text-secondary">Unable to fetch facilities. Please try again.</p>
            </div>
          </div>
        ) : facilities.length === 0 && selectedLocation ? (
          <div className="text-center py-16">
            <div className="glass rounded-xl p-8 max-w-md mx-auto">
              <div className="w-16 h-16 bg-light rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No Facilities Found</h3>
              <p className="text-secondary mb-4">
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
          <section id="facility-results" className="py-20 bg-hospital-gray">
            <div className="max-w-7xl mx-auto px-5">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Facility Results</h2>
                  <p className="text-gray-600 mt-2 font-medium">Found {facilities.length} eye care facilities near you</p>
                </div>
                <div className="flex items-center space-x-4">
                  <button className="flex items-center px-6 py-3 bg-white medical-border rounded-xl text-sm hover:bg-hospital-gray font-semibold hospital-shadow">
                    <Download className="mr-2 text-primary-blue w-4 h-4" />
                    Export Results
                  </button>
                  <button className="flex items-center px-6 py-3 bg-white medical-border rounded-xl text-sm hover:bg-hospital-gray font-semibold hospital-shadow">
                    <Share2 className="mr-2 text-primary-blue w-4 h-4" />
                    Share Search
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {facilities
                  .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                  .map((facility: EyeCareFacility) => (
                  <FacilityCard
                    key={facility.place_id}
                    facility={facility}
                    onGenerateEnquiry={handleGenerateEnquiry}
                  />
                ))}
              </div>

              <div className="flex items-center justify-center mt-12 space-x-4">
                {(() => {
                  const totalPages = Math.max(1, Math.ceil(facilities.length / pageSize));
                  const goTo = (page: number) => setCurrentPage(Math.min(Math.max(1, page), totalPages));
                  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
                  const visible = pages.slice(0, Math.min(5, pages.length));
                  return (
                    <>
                      <button className="px-6 py-3 medical-border rounded-xl text-sm hover:bg-white transition-colors disabled:opacity-50 font-semibold" onClick={() => goTo(currentPage - 1)} disabled={currentPage === 1}>
                        Previous
                      </button>
                      <div className="flex space-x-2">
                        {visible.map((p) => (
                          <button key={p} className={`px-4 py-3 rounded-xl text-sm font-semibold ${p === currentPage ? 'gradient-bg text-white' : 'medical-border hover:bg-white'}`} onClick={() => goTo(p)}>
                            {p}
                          </button>
                        ))}
                        {pages.length > visible.length && <span className="px-4 py-3 text-gray-500 text-sm">...</span>}
                        {pages.length > visible.length && (
                          <button className="px-4 py-3 medical-border rounded-xl text-sm hover:bg-white font-semibold" onClick={() => goTo(pages.length)}>
                            {pages.length}
                          </button>
                        )}
                      </div>
                      <button className="px-6 py-3 medical-border rounded-xl text-sm hover:bg-white font-semibold" onClick={() => goTo(currentPage + 1)} disabled={currentPage === totalPages}>
                        Next
                      </button>
                    </>
                  );
                })()}
              </div>
            </div>
          </section>
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
