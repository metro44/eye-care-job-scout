# Eye Care Job Scout

A modern web application for finding optometrist and ophthalmologist job opportunities in your area. Built with Next.js, TypeScript, and integrated with **free OpenStreetMap data** and Gemini AI for intelligent enquiry generation.

## Features

### 🔍 **Smart Facility Discovery (FREE)**
- Search for eye care facilities in any location using OpenStreetMap
- Pre-configured major Nigerian cities (Lagos, Abuja, Port Harcourt, etc.)
- Custom location input with autocomplete
- Real-time facility validation and categorization
- **Completely free - no API keys needed for facility data!**

### 📊 **Rich Facility Information**
- Complete contact details (phone, website, address)
- Facility types and specializations
- Operating hours and availability status
- Specialty identification (ophthalmology, optometry, etc.)
- Interactive maps integration

### 🤖 **AI-Powered Enquiry Generation**
- Gemini AI integration for professional enquiry drafting
- Context-aware content based on facility details
- Customizable experience levels (new grad, experienced, specialist)
- Specialty-specific enquiry templates
- One-click copy functionality

### 🎯 **Advanced Filtering**
- Facility type filtering
- Open/closed status filtering
- Specialty-based categorization
- Location-based radius search

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **State Management**: React Query (TanStack Query)
- **Forms**: React Hook Form
- **Icons**: Lucide React
- **APIs**: OpenStreetMap (FREE), Google Gemini API
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Google Gemini API access (only for AI enquiry generation)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd optometrist-jobs-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```

4. **Configure API Keys (Optional)**

   Edit `.env.local` and add your Gemini API key (only needed for AI enquiry generation):

   ```env
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
   ```

   **Note**: The facility search functionality works completely free using OpenStreetMap data - no API keys needed!

### API Key Setup (Optional - Only for AI Enquiry Generation)

#### Google Gemini API
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key to your `.env.local` file

**Important**: If you don't set up the Gemini API key, the enquiry generation will still work with a fallback template.

### Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

The application will be available at `http://localhost:3000`

## Usage

### 1. Location Selection
- Choose from pre-configured major cities
- Or enter a custom location/address
- The app will search for eye care facilities in the selected area using free OpenStreetMap data

### 2. Facility Discovery
- Browse through discovered facilities
- View detailed information
- Filter by facility type or open status
- Copy contact information with one click

### 3. Enquiry Generation
- Click "Generate Enquiry" on any facility
- Select your experience level and specialties
- Add optional custom message
- Let Gemini AI create a professional enquiry (or use fallback template)
- Copy the generated email to clipboard

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── facilities/    # Facility search endpoints (OSM)
│   │   └── enquiry/       # Enquiry generation endpoint (Gemini)
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Main page component
│   └── providers.tsx      # React Query provider
├── components/            # React components
│   ├── LocationSelector.tsx
│   ├── FacilityCard.tsx
│   └── EnquiryModal.tsx
├── lib/                   # Utility functions
│   ├── api.ts            # Original Google API service
│   └── free-api.ts       # Free OSM API service
└── types/                # TypeScript type definitions
    └── index.ts
```

## API Endpoints

### GET `/api/facilities`
Search for eye care facilities in a location using free OpenStreetMap data.

**Query Parameters:**
- `location` (required): Search location
- `radius` (optional): Search radius in meters
- `type` (optional): Facility type filter
- `minRating` (optional): Minimum rating filter (not available with OSM)

### GET `/api/facilities/[id]`
Get detailed information about a specific facility.

### POST `/api/enquiry`
Generate an enquiry using Gemini AI (requires API key) or fallback template.

**Request Body:**
```json
{
  "facilityName": "string",
  "facilityAddress": "string",
  "facilityPhone": "string",
  "facilityWebsite": "string",
  "userExperience": "new-grad" | "experienced" | "specialist",
  "userSpecialties": ["string"],
  "userMessage": "string"
}
```

## Free Data Sources Used

### OpenStreetMap (OSM)
- **Cost**: Completely FREE
- **Data**: Global facility data including hospitals, clinics, optometrists
- **APIs**: 
  - Nominatim for search and geocoding
  - Overpass API for comprehensive facility queries
- **Rate Limits**: Be respectful (1 request/second for Nominatim)
- **Coverage**: Global, community-maintained data

### Benefits of OSM Integration
- **No API keys required** for facility data
- **No usage limits** (within reasonable bounds)
- **Global coverage** including Nigeria and other countries
- **Community-maintained** data
- **Open source** and free forever

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard (only Gemini API key needed)
4. Deploy automatically

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the GitHub repository.

---

**Built with ❤️ for the eye care community using free OpenStreetMap data**
