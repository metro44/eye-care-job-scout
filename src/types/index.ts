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

// Google Places API types
export interface GooglePlace {
  place_id: string;
  name: string;
  formatted_address: string;
  formatted_phone_number?: string;
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

// OSM (OpenStreetMap) types
export interface OSMPlace {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  boundingbox: string[];
  lat: string;
  lon: string;
  display_name: string;
  class: string;
  type: string;
  importance: number;
  icon?: string;
  name?: string;
  address?: {
    [key: string]: string;
  };
  extratags?: {
    [key: string]: string;
  };
  namedetails?: {
    [key: string]: string;
  };
}

export interface OSMAddress {
  amenity?: string;
  house_number?: string;
  road?: string;
  suburb?: string;
  city?: string;
  state?: string;
  postcode?: string;
  country?: string;
  [key: string]: string | undefined;
}

export interface OSMExtratags {
  amenity?: string;
  healthcare?: string;
  medical_system?: string;
  opening_hours?: string;
  [key: string]: string | undefined;
}

export interface OpeningHours {
  open_now: boolean;
  weekday_text?: string[];
}

// Overpass API types
export interface OverpassElement {
  type: string;
  id: number;
  lat?: number;
  lon?: number;
  center?: {
    lat: number;
    lon: number;
  };
  tags?: {
    [key: string]: string;
  };
}

export interface OverpassResponse {
  elements: OverpassElement[];
}
