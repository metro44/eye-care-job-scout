'use client';

import { useState } from 'react';
import { EyeCareFacility, EnquiryData } from '@/types';
import { X, Send, Copy, Download, User, Briefcase, MessageSquare } from 'lucide-react';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  facility: EyeCareFacility;
}

export default function EnquiryModal({ isOpen, onClose, facility }: EnquiryModalProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [enquiryData, setEnquiryData] = useState<EnquiryData>({
    facilityName: facility.name,
    facilityAddress: facility.address,
    facilityPhone: facility.phone || '',
    facilityWebsite: facility.website || '',
    userExperience: '',
    userSpecialties: [],
    userMessage: '',
  });
  const [generatedEnquiry, setGeneratedEnquiry] = useState<{ subject: string; enquiry: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const experienceLevels = [
    'Student/Intern',
    'Recent Graduate',
    '1-2 years experience',
    '3-5 years experience',
    '5-10 years experience',
    '10+ years experience',
  ];

  const specialtyOptions = [
    'General Optometry',
    'Pediatric Optometry',
    'Contact Lens Fitting',
    'Low Vision Rehabilitation',
    'Ocular Disease Management',
    'Vision Therapy',
    'Cataract Surgery',
    'Glaucoma Management',
    'Retinal Diseases',
    'Cornea and External Disease',
    'Neuro-Ophthalmology',
    'Oculoplastic Surgery',
  ];

  const generateInquiryDraft = async () => {
    setIsGenerating(true);
    
    // Extract facility information for the prompt
    const clinicServices = facility.types?.join(', ') || 'Eye care services';
    const clinicFeatures = [
      facility.rating && `Rated ${facility.rating}/5 stars`,
      facility.opening_hours?.open_now && 'Currently open',
      facility.phone && 'Phone consultation available',
      facility.website && 'Online presence'
    ].filter(Boolean).join(', ');
    
    const clinicFeedback = facility.reviews && facility.reviews.length > 0 
      ? facility.reviews.slice(0, 3).map(review => review.text).join(' ')
      : 'Well-established eye care facility';

    const prompt = `You are a professional optometrist looking for a job. Write a concise and compelling email to the hiring manager of an eye clinic. The email should express interest in a position and highlight how your skills align with their services and features.

    Your name: ${enquiryData.userMessage?.includes('name') ? 'An Optometrist' : 'An Optometrist'}
    Your experience: ${enquiryData.userExperience || 'Entry-level with strong foundational skills'}

    Clinic Name: ${facility.name}
    Clinic Services: ${clinicServices}
    Clinic Features: ${clinicFeatures}
    Clinic Positive Feedback: ${clinicFeedback}

    Draft the email subject line and body. Focus on being professional and respectful. The email should be no more than 150 words. Do not include a signature or a closing.`;

    // API payload for the LLM call
    const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
    const payload = { contents: chatHistory };
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    // Exponential backoff retry logic for the API call
    const maxRetries = 5;
    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                if (response.status === 429) { // Too many requests
                    const delay = Math.pow(2, i) * 1000 + Math.random() * 1000;
                    console.warn(`Rate limit exceeded. Retrying in ${delay / 1000}s...`);
                    await new Promise(res => setTimeout(res, delay));
                    continue;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;

            if (text) {
                // Parse the response to extract subject and body
                const lines = text.split('\n').filter((line: string) => line.trim());
                let subject = 'Enquiry for Optometrist Position';
                let enquiry = text;

                // Try to extract subject if it's in the format "Subject: ..."
                if (lines[0]?.toLowerCase().includes('subject:')) {
                    subject = lines[0].replace(/^subject:\s*/i, '').trim();
                    enquiry = lines.slice(1).join('\n').trim();
                }

                setGeneratedEnquiry({ subject, enquiry });
                break; // Exit loop on success
            }
        } catch (error) {
            console.error("Failed to generate draft:", error);
            // On the last attempt, set an error message
            if (i === maxRetries - 1) {
                setGeneratedEnquiry({
                    subject: 'Enquiry for Optometrist Position',
                    enquiry: "Failed to generate draft. Please try again later."
                });
            }
        }
    }
    setIsGenerating(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await generateInquiryDraft();
  };

  const handleCopy = () => {
    if (generatedEnquiry) {
      const fullText = `Subject: ${generatedEnquiry.subject}\n\n${generatedEnquiry.enquiry}`;
      const el = document.createElement('textarea');
      el.value = fullText;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (generatedEnquiry) {
      const fullText = `Subject: ${generatedEnquiry.subject}\n\n${generatedEnquiry.enquiry}`;
      const blob = new Blob([fullText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `enquiry-${facility.name.replace(/[^a-zA-Z0-9]/g, '-')}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 modal-overlay flex items-center justify-center p-4">
      <div className="modal-content rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-secondary p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MessageSquare className="w-6 h-6" />
              <div>
                <h2 className="text-xl font-bold">Generate Professional Enquiry</h2>
                <p className="text-[#B0A6A7] text-sm">{facility.name}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-[#B0A6A7] hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row h-full">
          {/* Form Section */}
          <div className="flex-1 p-6 bg-white">
            {!generatedEnquiry ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Experience Level */}
                <div>
                  <label className="block text-sm font-medium text-[#30333A] mb-2 flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Experience Level
                  </label>
                  <select
                    value={enquiryData.userExperience}
                    onChange={(e) => setEnquiryData(prev => ({ ...prev, userExperience: e.target.value }))}
                    required
                    className="input-field w-full"
                  >
                    <option value="">Select your experience level</option>
                    {experienceLevels.map((level) => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                {/* Specialties */}
                <div>
                  <label className="block text-sm font-medium text-[#30333A] mb-2 flex items-center">
                    <Briefcase className="w-4 h-4 mr-2" />
                    Specialties (Select all that apply)
                  </label>
                  <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                    {specialtyOptions.map((specialty) => (
                      <label key={specialty} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={enquiryData.userSpecialties?.includes(specialty)}
                          onChange={(e) => {
                            const current = enquiryData.userSpecialties || [];
                            if (e.target.checked) {
                              setEnquiryData(prev => ({
                                ...prev,
                                userSpecialties: [...current, specialty]
                              }));
                            } else {
                              setEnquiryData(prev => ({
                                ...prev,
                                userSpecialties: current.filter(s => s !== specialty)
                              }));
                            }
                          }}
                          className="rounded border-[#B0A6A7] text-[#72676F] focus:ring-[#9A8D96]"
                        />
                        <span className="text-sm text-[#30333A]">{specialty}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Additional Message */}
                <div>
                  <label className="block text-sm font-medium text-[#30333A] mb-2">
                    Additional Message (Optional)
                  </label>
                  <textarea
                    value={enquiryData.userMessage}
                    onChange={(e) => setEnquiryData(prev => ({ ...prev, userMessage: e.target.value }))}
                    placeholder="Add any specific details about your background, availability, or preferences..."
                    rows={4}
                    className="input-field w-full resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isGenerating || !enquiryData.userExperience}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Generate Enquiry</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* Generated Enquiry Display */
              <div className="space-y-4">
                <div className="bg-[#72676F]/10 rounded-lg p-4">
                  <h3 className="font-semibold text-[#30333A] mb-2">Subject:</h3>
                  <p className="text-[#30333A]">{generatedEnquiry.subject}</p>
                </div>

                <div className="bg-[#72676F]/10 rounded-lg p-4">
                  <h3 className="font-semibold text-[#30333A] mb-2">Email Body:</h3>
                  <div className="whitespace-pre-wrap text-[#30333A] text-sm leading-relaxed">
                    {generatedEnquiry.enquiry}
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={handleCopy}
                    className="flex-1 btn-secondary flex items-center justify-center space-x-2"
                  >
                    <Copy className="w-4 h-4" />
                    <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex-1 btn-secondary flex items-center justify-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                </div>

                <button
                  onClick={() => setGeneratedEnquiry(null)}
                  className="w-full btn-primary"
                >
                  Generate New Enquiry
                </button>
              </div>
            )}
          </div>

          {/* Facility Info Sidebar */}
          <div className="lg:w-80 bg-[#30333A] p-6 text-white">
            <h3 className="text-lg font-semibold mb-4">Facility Information</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-[#B0A6A7] mb-1">Name</h4>
                <p className="text-sm">{facility.name}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-[#B0A6A7] mb-1">Address</h4>
                <button
                  onClick={() => {
                    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(facility.address)}`;
                    window.open(mapsUrl, '_blank');
                  }}
                  className="text-sm hover:text-[#B79D9B] transition-colors cursor-pointer underline decoration-dotted text-left flex items-center space-x-1"
                  title="Click to open in Google Maps"
                >
                  <span>{facility.address}</span>
                  <span className="text-[#9A8D96] text-xs">📍</span>
                </button>
              </div>

              {facility.phone && (
                <div>
                  <h4 className="font-medium text-[#B0A6A7] mb-1">Phone</h4>
                  <p className="text-sm">{facility.phone}</p>
                </div>
              )}

              {facility.website && (
                <div>
                  <h4 className="font-medium text-[#B0A6A7] mb-1">Website</h4>
                  <p className="text-sm break-all">{facility.website}</p>
                </div>
              )}

              {facility.rating && (
                <div>
                  <h4 className="font-medium text-[#B0A6A7] mb-1">Rating</h4>
                  <p className="text-sm">{facility.rating}/5 ({facility.user_ratings_total} reviews)</p>
                </div>
              )}

              {facility.opening_hours && (
                <div>
                  <h4 className="font-medium text-[#B0A6A7] mb-1">Status</h4>
                  <p className={`text-sm ${facility.opening_hours.open_now ? 'text-green-400' : 'text-red-400'}`}>
                    {facility.opening_hours.open_now ? 'Open Now' : 'Closed'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
