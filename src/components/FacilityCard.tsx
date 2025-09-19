'use client';

import { useState } from 'react';
import { EyeCareFacility } from '@/types';
import { 
  Phone, 
  Clock, 
  Star, 
  MessageSquare, 
  Bookmark, 
  Share2,
  MapPin,
  Building2,
} from 'lucide-react';

interface FacilityCardProps {
  facility: EyeCareFacility;
  onGenerateEnquiry: (facility: EyeCareFacility) => void;
}

export default function FacilityCard({ facility, onGenerateEnquiry }: FacilityCardProps) {
  const specialties = ['Eye Exams', 'Contact Lenses', 'Glasses'];

  return (
    <div className="bg-white rounded-xl medical-border p-6 hover:shadow-lg transition-all hospital-shadow h-full min-h-[360px] flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 gradient-bg rounded-xl flex items-center justify-center">
            <Building2 className="text-white text-lg" />
          </div>
          <div className="min-h-[56px]">
            <h3
              className="text-gray-900 font-semibold text-lg"
              style={{ display: '-webkit-box', WebkitLineClamp: 2 as unknown as number, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
              title={facility.name}
            >
              {facility.name}
            </h3>
            <p className="text-sm text-gray-600 font-medium">Optometry Clinic</p>
          </div>
        </div>

        {/* Rating */}
        {facility.rating && (
          <div className="flex items-center space-x-1">
            <Star className="text-accent-yellow" />
            <span className="text-sm font-semibold text-gray-900">{facility.rating}</span>
          </div>
        )}
      </div>

      {/* Contact Information */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="w-4 mr-3 text-primary-blue" />
          <div className="font-medium truncate" title={`${facility.vicinity} • ${facility.distance ?? '0.3'} miles`}>
            {facility.vicinity} • {facility.distance ?? '0.3'} miles
          </div>
        </div>
        
        {facility.phone && (
          <div className="flex items-center text-sm text-gray-600">
            <Phone className="w-4 mr-3 text-primary-blue" />
            <span className="font-medium">{facility.phone}</span>
          </div>
        )}

        {facility.opening_hours && (
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="w-4 mr-3 text-primary-blue" />
            <span className="font-medium">
              {facility.opening_hours.open_now ? 'Open until 6:00 PM' : 'Closed'}
            </span>
          </div>
        )}
      </div>

      {/* Specialty Tags */}
      <div className="flex flex-wrap gap-2 mb-6 min-h-[40px]">
        {specialties.map((specialty, index) => (
          <span key={index} className="px-3 py-1 bg-hospital-gray text-gray-700 rounded-full text-xs font-semibold">
            {specialty}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-3 mt-auto">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onGenerateEnquiry(facility);
          }}
          className="p-3 medical-border rounded-xl hover:bg-hospital-gray transition-colors flex items-center justify-center"
        >
          <span className="text-primary-blue font-semibold">Generate Enquiry</span>
        </button>
        <button
          onClick={(e) => e.stopPropagation()}
          className="p-3 medical-border rounded-xl hover:bg-hospital-gray transition-colors"
          aria-label="Save facility"
        >
          <Bookmark className="text-primary-blue" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (navigator.share) {
              navigator.share({ title: facility.name, url: facility.website || window.location.href });
            }
          }}
          className="p-3 medical-border rounded-xl hover:bg-hospital-gray transition-colors"
          aria-label="Share facility"
        >
          <Share2 className="text-primary-blue" />
        </button>
      </div>
    </div>
  );
}
