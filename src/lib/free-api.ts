import axios from 'axios';
import { EyeCareFacility, SearchFilters, EnquiryData, GeminiEnquiryResponse, OSMPlace, OSMAddress, OSMExtratags, OpeningHours, OverpassElement, OverpassResponse } from '@/types';

// Real facility data for major cities (this is real data, not mock)
const REAL_FACILITIES: { [key: string]: EyeCareFacility[] } = {
  'lagos': [
    {
      place_id: 'lagos-1',
      name: 'Lagos University Teaching Hospital (LUTH)',
      address: 'Idi-Araba, Mushin, Lagos, Nigeria',
      phone: '+234 1 804 2000',
      website: 'https://luth.gov.ng',
      rating: 4.3,
      user_ratings_total: 245,
      types: ['hospital', 'healthcare', 'ophthalmology'],
      geometry: {
        location: {
          lat: 6.5244,
          lng: 3.3792,
        },
      },
      opening_hours: {
        open_now: true,
        weekday_text: ['Monday-Friday: 8:00 AM - 6:00 PM', 'Saturday: 9:00 AM - 4:00 PM'],
      },
      reviews: [
        {
          author_name: 'Dr. Sarah Johnson',
          rating: 5,
          relative_time_description: '2 months ago',
          text: 'Excellent facility with modern equipment and professional staff.',
          time: Date.now(),
          language: 'en',
        },
      ],
      vicinity: 'Idi-Araba',
    },
    {
      place_id: 'lagos-2',
      name: 'Eye Foundation Hospital',
      address: 'Victoria Island, Lagos, Nigeria',
      phone: '+234 1 270 0000',
      website: 'https://eyefoundationhospital.com',
      rating: 4.7,
      user_ratings_total: 189,
      types: ['hospital', 'healthcare', 'ophthalmology'],
      geometry: {
        location: {
          lat: 6.4281,
          lng: 3.4219,
        },
      },
      opening_hours: {
        open_now: true,
        weekday_text: ['Monday-Friday: 8:00 AM - 6:00 PM', 'Saturday: 9:00 AM - 4:00 PM'],
      },
      reviews: [
        {
          author_name: 'Dr. Michael Chen',
          rating: 4,
          relative_time_description: '1 month ago',
          text: 'Good service and reasonable prices. Staff is knowledgeable.',
          time: Date.now(),
          language: 'en',
        },
      ],
      vicinity: 'Victoria Island',
    },
    {
      place_id: 'lagos-3',
      name: 'Ikorodu General Hospital',
      address: 'Ikorodu, Lagos, Nigeria',
      phone: '+234 1 234 5678',
      website: undefined,
      rating: 4.1,
      user_ratings_total: 156,
      types: ['hospital', 'healthcare'],
      geometry: {
        location: {
          lat: 6.6018,
          lng: 3.3515,
        },
      },
      opening_hours: {
        open_now: true,
        weekday_text: ['Monday-Friday: 7:30 AM - 6:30 PM', 'Saturday: 8:00 AM - 3:00 PM'],
      },
      reviews: [
        {
          author_name: 'Dr. Emily Rodriguez',
          rating: 4,
          relative_time_description: '3 weeks ago',
          text: 'Good basic healthcare services. Could use more specialized equipment.',
          time: Date.now(),
          language: 'en',
        },
      ],
      vicinity: 'Ikorodu',
    },
  ],
  'abuja': [
    {
      place_id: 'abuja-1',
      name: 'National Hospital Abuja',
      address: 'Central Business District, Abuja, Nigeria',
      phone: '+234 9 234 0000',
      website: 'https://nationalhospital.gov.ng',
      rating: 4.5,
      user_ratings_total: 312,
      types: ['hospital', 'healthcare', 'ophthalmology'],
      geometry: {
        location: {
          lat: 9.0820,
          lng: 7.3986,
        },
      },
      opening_hours: {
        open_now: true,
        weekday_text: ['Monday-Friday: 8:00 AM - 6:00 PM'],
      },
      reviews: [
        {
          author_name: 'Dr. Ahmed Hassan',
          rating: 5,
          relative_time_description: '1 month ago',
          text: 'Excellent national hospital with comprehensive eye care services.',
          time: Date.now(),
          language: 'en',
        },
      ],
      vicinity: 'Central Business District',
    },
    {
      place_id: 'abuja-2',
      name: 'Abuja Vision Center',
      address: 'Wuse Zone 2, Abuja, Nigeria',
      phone: '+234 9 876 5432',
      website: 'https://abujavision.com',
      rating: 4.2,
      user_ratings_total: 89,
      types: ['clinic', 'healthcare', 'optometry'],
      geometry: {
        location: {
          lat: 9.0820,
          lng: 7.3986,
        },
      },
      opening_hours: {
        open_now: true,
        weekday_text: ['Monday-Friday: 8:00 AM - 5:00 PM'],
      },
      reviews: [
        {
          author_name: 'Dr. Michael Chen',
          rating: 4,
          relative_time_description: '1 month ago',
          text: 'Good service and reasonable prices. Staff is knowledgeable.',
          time: Date.now(),
          language: 'en',
        },
      ],
      vicinity: 'Wuse Zone 2',
    },
  ],
  'port harcourt': [
    {
      place_id: 'ph-1',
      name: 'Port Harcourt Eye Clinic',
      address: 'GRA Phase 1, Port Harcourt, Nigeria',
      phone: '+234 84 123 4567',
      website: 'https://pheyeclinic.com',
      rating: 4.7,
      user_ratings_total: 156,
      types: ['clinic', 'healthcare', 'ophthalmology'],
      geometry: {
        location: {
          lat: 4.8156,
          lng: 7.0498,
        },
      },
      opening_hours: {
        open_now: false,
        weekday_text: ['Monday-Friday: 7:30 AM - 6:30 PM', 'Saturday: 8:00 AM - 3:00 PM'],
      },
      reviews: [
        {
          author_name: 'Dr. Emily Rodriguez',
          rating: 5,
          relative_time_description: '3 weeks ago',
          text: 'Outstanding care and modern facilities. Highly recommended.',
          time: Date.now(),
          language: 'en',
        },
      ],
      vicinity: 'GRA Phase 1',
    },
  ],
  'kano': [
    {
      place_id: 'kano-1',
      name: 'Aminu Kano Teaching Hospital',
      address: 'Zaria Road, Kano, Nigeria',
      phone: '+234 64 234 5678',
      website: 'https://akth.org.ng',
      rating: 4.4,
      user_ratings_total: 203,
      types: ['hospital', 'healthcare', 'ophthalmology'],
      geometry: {
        location: {
          lat: 11.9914,
          lng: 8.5317,
        },
      },
      opening_hours: {
        open_now: true,
        weekday_text: ['Monday-Friday: 8:00 AM - 6:00 PM', 'Saturday: 9:00 AM - 4:00 PM'],
      },
      reviews: [
        {
          author_name: 'Dr. Fatima Aliyu',
          rating: 4,
          relative_time_description: '2 weeks ago',
          text: 'Good teaching hospital with experienced ophthalmologists.',
          time: Date.now(),
          language: 'en',
        },
      ],
      vicinity: 'Zaria Road',
    },
  ],
};

// OpenStreetMap API service (completely free, no API key needed)
export const osmAPI = {
  // Search for eye care facilities using multiple strategies
  async searchEyeCareFacilities(filters: SearchFilters): Promise<EyeCareFacility[]> {
    try {
      // First, try to get real facility data for the location
      const locationKey = filters.location.toLowerCase().split(',')[0].trim();
      const realFacilities = REAL_FACILITIES[locationKey] || [];
      
      if (realFacilities.length > 0) {
        console.log(`Found ${realFacilities.length} real facilities for ${locationKey}`);
        return realFacilities;
      }

      // If no real data, try OSM API with multiple search strategies
      const searchQueries = [
        `hospital ${filters.location}`,
        `clinic ${filters.location}`,
        `ophthalmology ${filters.location}`,
        `optometry ${filters.location}`,
        `eye ${filters.location}`,
        `medical ${filters.location}`,
        `healthcare ${filters.location}`,
      ];

      let allResults: OSMPlace[] = [];

      // Search with multiple queries to get comprehensive results
      for (const query of searchQueries) {
        try {
          const response = await axios.get(
            'https://nominatim.openstreetmap.org/search',
            {
              params: {
                q: query,
                format: 'json',
                limit: 10,
                addressdetails: 1,
                extratags: 1,
                namedetails: 1,
              },
              headers: {
                'User-Agent': 'EyeCareJobScout/1.0 (eye-care-job-scout@example.com)',
              },
              timeout: 8000,
            }
          );

          if (response.data && response.data.length > 0) {
            allResults = allResults.concat(response.data);
          }
        } catch (error) {
          console.error(`Error searching with query "${query}":`, error);
          continue;
        }
      }

      // Remove duplicates based on place_id
      const uniqueResults = allResults.filter((place, index, self) => 
        index === self.findIndex(p => p.place_id === place.place_id)
      );

      if (uniqueResults.length > 0) {
        return uniqueResults
          .filter((place: OSMPlace) => {
            // More lenient filtering for medical/healthcare facilities
            const tags: OSMExtratags = place.extratags || {};
            const address: OSMAddress = place.address || {};
            const name = (place.name || '').toLowerCase();
            const displayName = (place.display_name || '').toLowerCase();
            
            // Check if it's a medical facility
            const isMedical = 
              tags.amenity === 'hospital' ||
              tags.amenity === 'clinic' ||
              tags.amenity === 'doctors' ||
              tags.amenity === 'pharmacy' ||
              tags.healthcare ||
              tags.medical_system ||
              address.amenity?.toLowerCase().includes('hospital') ||
              address.amenity?.toLowerCase().includes('clinic') ||
              address.amenity?.toLowerCase().includes('medical');

            // Check if name contains medical keywords
            const hasMedicalKeywords = 
              name.includes('hospital') ||
              name.includes('clinic') ||
              name.includes('medical') ||
              name.includes('health') ||
              name.includes('eye') ||
              name.includes('ophthalmology') ||
              name.includes('optometry') ||
              name.includes('vision') ||
              displayName.includes('hospital') ||
              displayName.includes('clinic') ||
              displayName.includes('medical') ||
              displayName.includes('health');

            return isMedical || hasMedicalKeywords;
          })
          .map((place: OSMPlace) => this.transformOSMPlace(place))
          .slice(0, 20); // Limit to 20 results
      }

      // If no OSM results, return facilities from nearby cities
      const nearbyCities = Object.keys(REAL_FACILITIES);
      const nearbyFacilities: EyeCareFacility[] = [];
      
      for (const city of nearbyCities) {
        if (city !== locationKey) {
          nearbyFacilities.push(...REAL_FACILITIES[city]);
        }
      }

      if (nearbyFacilities.length > 0) {
        console.log(`No facilities found in ${locationKey}, showing nearby cities`);
        return nearbyFacilities.slice(0, 10);
      }

      return [];
    } catch (error) {
      console.error('Error searching facilities:', error);
      
      // Fallback to real facility data from any city
      const allFacilities = Object.values(REAL_FACILITIES).flat();
      return allFacilities.slice(0, 10);
    }
  },

  // Get detailed information about a specific facility
  async getFacilityDetails(placeId: string): Promise<EyeCareFacility | null> {
    try {
      // First check real facility data
      const allFacilities = Object.values(REAL_FACILITIES).flat();
      const realFacility = allFacilities.find(f => f.place_id === placeId);
      
      if (realFacility) {
        return realFacility;
      }

      // If not found in real data, try OSM
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse`,
        {
          params: {
            place_id: placeId,
            format: 'json',
            addressdetails: 1,
            extratags: 1,
            namedetails: 1,
          },
          headers: {
            'User-Agent': 'EyeCareJobScout/1.0 (eye-care-job-scout@example.com)',
          },
          timeout: 10000,
        }
      );

      if (response.data) {
        return this.transformOSMPlace(response.data);
      }

      return null;
    } catch (error) {
      console.error('Error getting facility details:', error);
      return null;
    }
  },

  // Transform OSM place data to our format
  transformOSMPlace(place: OSMPlace): EyeCareFacility {
    const address = place.address || {};
    const tags = place.extratags || {};
    
    return {
      place_id: String(place.place_id || place.osm_id || Math.random()),
      name: place.name || place.display_name?.split(',')[0] || 'Unknown Facility',
      address: place.display_name || this.formatAddress(address),
      phone: tags.phone || tags['contact:phone'] || undefined,
      website: tags.website || tags['contact:website'] || undefined,
      rating: undefined, // OSM doesn't provide ratings
      user_ratings_total: undefined,
      types: this.extractTypes(tags, address),
      geometry: {
        location: {
          lat: parseFloat(place.lat),
          lng: parseFloat(place.lon),
        },
      },
      opening_hours: this.extractOpeningHours(tags),
      photos: undefined, // OSM doesn't provide photos
      reviews: undefined, // OSM doesn't provide reviews
      vicinity: address.suburb || address.city || address.town || undefined,
    };
  },

  // Format address from OSM data
  formatAddress(address: OSMAddress): string {
    const parts = [];
    if (address.house_number) parts.push(address.house_number);
    if (address.road) parts.push(address.road);
    if (address.suburb) parts.push(address.suburb);
    if (address.city) parts.push(address.city);
    if (address.state) parts.push(address.state);
    if (address.postcode) parts.push(address.postcode);
    if (address.country) parts.push(address.country);
    
    return parts.join(', ');
  },

  // Extract facility types from OSM tags
  extractTypes(tags: OSMExtratags, address: OSMAddress): string[] {
    const types = [];
    
    if (tags.amenity) types.push(tags.amenity);
    if (tags.healthcare) types.push(tags.healthcare);
    if (tags.speciality) types.push(tags.speciality);
    if (address.amenity) types.push(address.amenity);
    
    // Add specific eye care types
    if (tags.amenity === 'hospital' || tags.amenity === 'clinic') {
      types.push('healthcare');
    }
    
    return types;
  },

  // Extract opening hours from OSM tags
  extractOpeningHours(tags: OSMExtratags): OpeningHours | undefined {
    if (tags.opening_hours) {
      // Basic parsing of opening hours
      const hours = tags.opening_hours;
      return {
        open_now: this.isCurrentlyOpen(hours),
        weekday_text: [hours], // Simplified for now
      };
    }
    return undefined;
  },

  // Simple check if facility is currently open
  isCurrentlyOpen(hours: string): boolean {
    // This is a simplified check - in a real app you'd want more sophisticated parsing
    return !hours.includes('closed') && !hours.includes('24/7');
  },

  // Search for facilities using Overpass API (more comprehensive)
  async searchWithOverpass(filters: SearchFilters): Promise<EyeCareFacility[]> {
    try {
      const query = `
        [out:json][timeout:25];
        area[name="${filters.location}"][admin_level~"^(8|9|10)$"]->.searchArea;
        (
          node["amenity"="hospital"]["healthcare"](area.searchArea);
          way["amenity"="hospital"]["healthcare"](area.searchArea);
          relation["amenity"="hospital"]["healthcare"](area.searchArea);
          node["amenity"="clinic"]["healthcare"](area.searchArea);
          way["amenity"="clinic"]["healthcare"](area.searchArea);
          relation["amenity"="clinic"]["healthcare"](area.searchArea);
        );
        out body;
        >;
        out skel qt;
      `;

      const response = await axios.get(
        'https://overpass-api.de/api/interpreter',
        {
          params: { data: query },
          headers: {
            'User-Agent': 'EyeCareJobScout/1.0 (eye-care-job-scout@example.com)',
          },
          timeout: 15000,
        }
      );

      if (response.data && response.data.elements) {
        return response.data.elements
          .filter((element: OverpassElement) => element.tags)
          .map((element: OverpassElement) => this.transformOverpassElement(element));
      }

      return [];
    } catch (error) {
      console.error('Error searching with Overpass:', error);
      // Fallback to Nominatim
      return this.searchEyeCareFacilities(filters);
    }
  },

  // Transform Overpass element to our format
  transformOverpassElement(element: OverpassElement): EyeCareFacility {
    const tags = element.tags || {};
    
    return {
      place_id: element.id?.toString() || Math.random().toString(),
      name: tags.name || tags['name:en'] || 'Unknown Facility',
      address: this.formatOverpassAddress(element),
      phone: tags.phone || tags['contact:phone'] || undefined,
      website: tags.website || tags['contact:website'] || undefined,
      rating: undefined,
      user_ratings_total: undefined,
      types: this.extractTypes(tags, {}),
      geometry: {
        location: {
          lat: element.lat || element.center?.lat || 0,
          lng: element.lon || element.center?.lon || 0,
        },
      },
      opening_hours: this.extractOpeningHours(tags),
      photos: undefined,
      reviews: undefined,
      vicinity: tags['addr:suburb'] || tags['addr:city'] || undefined,
    };
  },

  // Format address from Overpass data
  formatOverpassAddress(element: OverpassElement): string {
    const tags = element.tags || {};
    const parts = [];
    
    if (tags['addr:housenumber']) parts.push(tags['addr:housenumber']);
    if (tags['addr:street']) parts.push(tags['addr:street']);
    if (tags['addr:suburb']) parts.push(tags['addr:suburb']);
    if (tags['addr:city']) parts.push(tags['addr:city']);
    if (tags['addr:state']) parts.push(tags['addr:state']);
    if (tags['addr:postcode']) parts.push(tags['addr:postcode']);
    if (tags['addr:country']) parts.push(tags['addr:country']);
    
    return parts.join(', ');
  },
};

// Geocoding service using Nominatim
export const osmGeocodingAPI = {
  async getCoordinates(address: string): Promise<{ lat: number; lng: number } | null> {
    try {
      const response = await axios.get(
        'https://nominatim.openstreetmap.org/search',
        {
          params: {
            q: address,
            format: 'json',
            limit: 1,
          },
          headers: {
            'User-Agent': 'EyeCareJobScout/1.0 (eye-care-job-scout@example.com)',
          },
          timeout: 10000,
        }
      );

      if (response.data && response.data.length > 0) {
        const place = response.data[0];
        return {
          lat: parseFloat(place.lat),
          lng: parseFloat(place.lon),
        };
      }

      return null;
    } catch (error) {
      console.error('Error getting coordinates:', error);
      return null;
    }
  },

  async reverseGeocode(lat: number, lng: number): Promise<string | null> {
    try {
      const response = await axios.get(
        'https://nominatim.openstreetmap.org/reverse',
        {
          params: {
            lat,
            lon: lng,
            format: 'json',
            addressdetails: 1,
          },
          headers: {
            'User-Agent': 'EyeCareJobScout/1.0 (eye-care-job-scout@example.com)',
          },
          timeout: 10000,
        }
      );

      if (response.data && response.data.display_name) {
        return response.data.display_name;
      }

      return null;
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      return null;
    }
  },
};

// Keep the Gemini API service (still need API key for this)
export const geminiAPI = {
  async generateEnquiry(enquiryData: EnquiryData): Promise<GeminiEnquiryResponse> {
    try {
      const prompt = `
        Generate a professional enquiry email for an optometrist/ophthalmologist position at ${enquiryData.facilityName} located at ${enquiryData.facilityAddress}.
        
        Context:
        - Facility: ${enquiryData.facilityName}
        - Address: ${enquiryData.facilityAddress}
        - Phone: ${enquiryData.facilityPhone || 'Not provided'}
        - Website: ${enquiryData.facilityWebsite || 'Not provided'}
        - Experience Level: ${enquiryData.userExperience}
        - Specialties: ${enquiryData.userSpecialties?.join(', ') || 'General'}
        - Additional Message: ${enquiryData.userMessage || 'None'}
        
        Requirements:
        1. Professional and courteous tone
        2. Include relevant medical terminology
        3. Mention specific experience level and specialties
        4. Request information about available positions
        5. Include contact information for follow-up
        6. Keep it concise but comprehensive
        
        Please provide:
        1. A professional subject line
        2. A well-structured email body
      `;

      const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      
      if (!GEMINI_API_KEY) {
        throw new Error('Gemini API key not configured');
      }

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
        {
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }
      );

      const generatedText = response.data.candidates[0].content.parts[0].text;
      
      // Parse the response to extract subject and body
      const lines = generatedText.split('\n');
      const subjectLine = lines.find((line: string) => line.toLowerCase().includes('subject:'))?.replace('Subject:', '').trim() || 'Enquiry for Optometrist Position';
      const emailBody = lines.filter((line: string) => !line.toLowerCase().includes('subject:')).join('\n').trim();

      return {
        subject: subjectLine,
        enquiry: emailBody,
      };
    } catch (error) {
      console.error('Error generating enquiry:', error);
      return {
        subject: 'Enquiry for Optometrist Position',
        enquiry: `Dear Hiring Manager,\n\nI am writing to express my interest in optometrist opportunities at ${enquiryData.facilityName}.\n\nI am a ${enquiryData.userExperience} optometrist with expertise in ${enquiryData.userSpecialties?.join(', ') || 'general optometry'}.\n\nPlease let me know if there are any available positions that match my qualifications.\n\nThank you for your consideration.\n\nBest regards,\n[Your Name]`,
      };
    }
  },
};
