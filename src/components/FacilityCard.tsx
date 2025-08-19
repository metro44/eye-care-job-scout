'use client';

import { useState } from 'react';
import { EyeCareFacility } from '@/types';
import { MapPin, Phone, Globe, Clock, Star, Eye, MessageSquare } from 'lucide-react';

interface FacilityCardProps {
  facility: EyeCareFacility;
  onGenerateEnquiry: (facility: EyeCareFacility) => void;
}

export default function FacilityCard({ facility, onGenerateEnquiry }: FacilityCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getSpecialtyTags = (types: string[]) => {
    const specialtyKeywords = [
      'ophthalmology', 'optometry', 'eye', 'vision', 'retinal', 'cataract', 
      'glaucoma', 'cornea', 'pediatric', 'surgery', 'clinic', 'hospital',
      'healthcare', 'medical', 'specialist', 'consultation'
    ];
    
    return types
      .filter(type => specialtyKeywords.some(keyword => 
        type.toLowerCase().includes(keyword)
      ))
      .slice(0, 3);
  };

  const specialtyTags = getSpecialtyTags(facility.types);

  return (
    <div className="card group hover:scale-[1.02] cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <div className="flex-1">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-[#D4D8DD] transition-colors">
              {facility.name}
            </h3>
            <div className="flex items-center space-x-2 text-[#C0C8CA] mb-2">
              <MapPin className="w-4 h-4" />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(facility.address)}`;
                  window.open(mapsUrl, '_blank');
                }}
                className="text-xs sm:text-sm line-clamp-1 hover:text-[#D4D8DD] transition-colors cursor-pointer underline decoration-dotted flex items-center space-x-1"
                title="Click to open in Google Maps"
              >
                <span>{facility.address}</span>
                <span className="text-[#AAB7B7] text-xs">📍</span>
              </button>
            </div>
          </div>
          
          {/* Rating */}
          {facility.rating && (
            <div className="flex items-center space-x-1 bg-[#2E4156]/20 px-2 py-1 rounded-lg">
              <Star className="w-4 h-4 text-[#D4D8DD] fill-current" />
              <span className="text-xs sm:text-sm font-medium text-white">{facility.rating}</span>
              {facility.user_ratings_total && (
                <span className="text-xs text-[#C0C8CA]">({facility.user_ratings_total})</span>
              )}
            </div>
          )}
        </div>

        {/* Specialty Tags */}
        {specialtyTags.length > 0 && (
          <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
            {specialtyTags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs font-medium bg-[#AAB7B7]/20 text-[#C0C8CA] rounded-md border border-[#AAB7B7]/30"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Contact Information */}
        <div className="space-y-2 mb-4">
          {facility.phone && (
            <div className="flex items-center space-x-2 text-[#C0C8CA]">
              <Phone className="w-4 h-4" />
              <span className="text-sm">{facility.phone}</span>
            </div>
          )}
          
          {facility.website && (
            <div className="flex items-center space-x-2 text-[#C0C8CA]">
              <Globe className="w-4 h-4" />
              <span className="text-sm line-clamp-1">{facility.website}</span>
            </div>
          )}
        </div>

        {/* Opening Hours */}
        {facility.opening_hours && (
          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="w-4 h-4 text-[#C0C8CA]" />
              <span className="text-sm font-medium text-[#C0C8CA]">Opening Hours</span>
              {facility.opening_hours.open_now !== undefined && (
                <span className={`text-xs px-2 py-1 rounded-full ${
                  facility.opening_hours.open_now 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {facility.opening_hours.open_now ? 'Open Now' : 'Closed'}
                </span>
              )}
            </div>
            {facility.opening_hours.weekday_text && (
              <div className="text-xs text-[#C0C8CA] space-y-1">
                {facility.opening_hours.weekday_text.map((hours, index) => (
                  <div key={index}>{hours}</div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Expandable Content */}
        {isExpanded && (
          <div className="border-t border-[#C0C8CA]/20 pt-4 mt-4">
            {/* Reviews */}
            {facility.reviews && facility.reviews.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-white mb-2 flex items-center">
                  <Star className="w-4 h-4 mr-1 text-[#D4D8DD]" />
                  Reviews
                </h4>
                <div className="space-y-3 max-h-32 overflow-y-auto">
                  {facility.reviews.map((review, index) => (
                    <div key={index} className="bg-[#2E4156]/10 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-white">{review.author_name}</span>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-[#D4D8DD] fill-current" />
                          <span className="text-xs text-[#C0C8CA]">{review.rating}</span>
                        </div>
                      </div>
                      <p className="text-xs text-[#C0C8CA] line-clamp-2">{review.text}</p>
                      <span className="text-xs text-[#2E4156]">{review.relative_time_description}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Details */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              {facility.vicinity && (
                <div>
                  <span className="text-[#C0C8CA]">Area:</span>
                  <div className="text-white">{facility.vicinity}</div>
                </div>
              )}
              
              {facility.geometry?.location && (
                <div>
                  <span className="text-[#C0C8CA]">Coordinates:</span>
                  <div className="text-white text-xs">
                    {facility.geometry.location.lat.toFixed(4)}, {facility.geometry.location.lng.toFixed(4)}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="mt-4 pt-4 border-t border-[#C0C8CA]/20">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onGenerateEnquiry(facility);
            }}
            className="w-full btn-primary flex items-center justify-center space-x-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Generate Enquiry</span>
          </button>
        </div>

        {/* Expand/Collapse Indicator */}
        <div className="mt-3 text-center">
          <div className="inline-flex items-center space-x-1 text-[#C0C8CA] text-xs">
            <Eye className="w-3 h-3" />
            <span>{isExpanded ? 'Click to collapse' : 'Click to expand'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
