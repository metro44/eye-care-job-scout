import axios from 'axios';
import { EyeCareFacility, SearchFilters, EnquiryData, GeminiEnquiryResponse, GooglePlace, Review } from '@/types';

const GOOGLE_PLACES_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

// Google Places API service
export const googlePlacesAPI = {
  // Search for eye care facilities in a location
  async searchEyeCareFacilities(filters: SearchFilters): Promise<EyeCareFacility[]> {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/textsearch/json`,
        {
          params: {
            query: `ophthalmology OR eye hospital OR optometry OR eye clinic`,
            location: filters.location,
            radius: filters.radius || 50000, // 50km default
            type: 'health',
            key: GOOGLE_PLACES_API_KEY,
          },
        }
      );

      if (response.data.status === 'OK') {
        return response.data.results.map((place: GooglePlace) => ({
          place_id: place.place_id,
          name: place.name,
          address: place.formatted_address,
          phone: place.formatted_phone_number,
          website: place.website,
          rating: place.rating,
          user_ratings_total: place.user_ratings_total,
          types: place.types,
          geometry: place.geometry,
          opening_hours: place.opening_hours,
          photos: place.photos,
          vicinity: place.vicinity,
        }));
      }

      return [];
    } catch (error) {
      console.error('Error searching eye care facilities:', error);
      return [];
    }
  },

  // Get detailed information about a specific facility
  async getFacilityDetails(placeId: string): Promise<EyeCareFacility | null> {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/details/json`,
        {
          params: {
            place_id: placeId,
            fields: 'name,formatted_address,formatted_phone_number,website,rating,user_ratings_total,types,geometry,opening_hours,photos,reviews,vicinity',
            key: GOOGLE_PLACES_API_KEY,
          },
        }
      );

      if (response.data.status === 'OK') {
        const place = response.data.result;
        return {
          place_id: place.place_id,
          name: place.name,
          address: place.formatted_address,
          phone: place.formatted_phone_number,
          website: place.website,
          rating: place.rating,
          user_ratings_total: place.user_ratings_total,
          types: place.types,
          geometry: place.geometry,
          opening_hours: place.opening_hours,
          photos: place.photos,
          reviews: place.reviews,
          vicinity: place.vicinity,
        };
      }

      return null;
    } catch (error) {
      console.error('Error getting facility details:', error);
      return null;
    }
  },

  // Get reviews for a facility
  async getFacilityReviews(placeId: string): Promise<Review[]> {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/details/json`,
        {
          params: {
            place_id: placeId,
            fields: 'reviews',
            key: GOOGLE_PLACES_API_KEY,
          },
        }
      );

      if (response.data.status === 'OK' && response.data.result.reviews) {
        return response.data.result.reviews;
      }

      return [];
    } catch (error) {
      console.error('Error getting facility reviews:', error);
      return [];
    }
  },
};

// Gemini API service for enquiry generation
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

// Geocoding service
export const geocodingAPI = {
  async getCoordinates(address: string): Promise<{ lat: number; lng: number } | null> {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json`,
        {
          params: {
            address,
            key: GOOGLE_PLACES_API_KEY,
          },
        }
      );

      if (response.data.status === 'OK' && response.data.results.length > 0) {
        const location = response.data.results[0].geometry.location;
        return {
          lat: location.lat,
          lng: location.lng,
        };
      }

      return null;
    } catch (error) {
      console.error('Error getting coordinates:', error);
      return null;
    }
  },
};
