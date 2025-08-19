export interface EyeCareFacility {
  place_id: string;
  name: string;
  address: string;
  phone?: string;
  website?: string;
  rating?: number;
  user_ratings_total?: number;
  types: string[];
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  opening_hours?: {
    open_now: boolean;
    weekday_text?: string[];
  };
  photos?: Array<{
    photo_reference: string;
    height: number;
    width: number;
  }>;
  reviews?: Review[];
  vicinity?: string;
}

export interface Review {
  author_name: string;
  author_url?: string;
  language: string;
  profile_photo_url?: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
  translated?: boolean;
}

export interface Location {
  lat: number;
  lng: number;
  address: string;
}

export interface SearchFilters {
  location: string;
  radius?: number;
  type?: string;
  minRating?: number;
}

export interface EnquiryData {
  facilityName: string;
  facilityAddress: string;
  facilityPhone?: string;
  facilityWebsite?: string;
  userExperience: string;
  userSpecialties?: string[];
  userMessage?: string;
}

export interface GeminiEnquiryResponse {
  enquiry: string;
  subject: string;
}
