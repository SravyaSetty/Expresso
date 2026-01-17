import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { X, MapPin, Phone, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useTheme } from "./ThemeProvider";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { SharedNavigation } from "./SharedNavigation";

interface WellnessAdvisorPageProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
}

interface Counselor {
  id: string;
  name: string;
  specialization: string;
  image: string;
  description: string;
  contact: string;
}

interface Center {
  id: string;
  name: string;
  contact: string;
  address: string;
}

export function WellnessAdvisorPage({ onBack, onNavigate }: WellnessAdvisorPageProps) {
  const { selectedColor } = useTheme();
  const [selectedCounselor, setSelectedCounselor] = useState<Counselor | null>(null);
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [location, setLocation] = useState("");
  const [searchResults, setSearchResults] = useState<Center[] | null>(null);

  const counselors: Counselor[] = [
    {
      id: "1",
      name: "Dr. Sarah Johnson",
      specialization: "Anxiety & Depression",
      image: "https://images.unsplash.com/photo-1703449481095-bb99a6928f1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB0aGVyYXBpc3QlMjBjb3Vuc2Vsb3IlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTgwMDc5MzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      description: "Dr. Sarah Johnson is a licensed clinical psychologist with over 10 years of experience specializing in anxiety disorders and depression. She uses evidence-based approaches including CBT and mindfulness techniques to help young adults navigate their mental health challenges.",
      contact: "+1 (555) 123-4567"
    },
    {
      id: "2",
      name: "Dr. Michael Chen",
      specialization: "Trauma & PTSD",
      image: "https://images.unsplash.com/photo-1621533463370-837f20c6c889?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwc3ljaG9sb2dpc3QlMjBkb2N0b3IlMjBwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdHxlbnwxfHx8fDE3NTgwMDc5MzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      description: "Dr. Michael Chen specializes in trauma therapy and PTSD treatment. With a compassionate approach, he helps clients process difficult experiences and develop healthy coping mechanisms. His expertise includes EMDR and trauma-focused cognitive behavioral therapy.",
      contact: "+1 (555) 234-5678"
    },
    {
      id: "3",
      name: "Dr. Emily Rodriguez",
      specialization: "Relationship Counseling",
      image: "https://images.unsplash.com/photo-1625591243862-9f475616ba64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW50YWwlMjBoZWFsdGglMjBjb3Vuc2Vsb3IlMjBmZW1hbGUlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzU4MDA3OTM3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      description: "Dr. Emily Rodriguez is a licensed marriage and family therapist who specializes in relationship counseling for young adults. She helps individuals and couples build stronger communication skills and navigate relationship challenges with empathy and understanding.",
      contact: "+1 (555) 345-6789"
    },
    {
      id: "4",
      name: "Dr. James Thompson",
      specialization: "Stress Management",
      image: "https://images.unsplash.com/photo-1620302044902-30315ad936cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGluaWNhbCUyMHBzeWNob2xvZ2lzdCUyMHByb2Zlc3Npb25hbCUyMGhlYWRzaG90fGVufDF8fHx8MTc1ODAwNzk0M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      description: "Dr. James Thompson focuses on stress management and work-life balance for young professionals. He provides practical strategies for managing academic and career pressures while maintaining mental wellness through mindfulness and stress reduction techniques.",
      contact: "+1 (555) 456-7890"
    },
    {
      id: "5",
      name: "Dr. Lisa Parker",
      specialization: "Eating Disorders",
      image: "https://images.unsplash.com/photo-1597412915844-310e1ea9cfbf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaWNlbnNlZCUyMHRoZXJhcGlzdCUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0JTIwd29tYW58ZW58MXx8fHwxNzU4MDA3OTQ2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      description: "Dr. Lisa Parker is a specialist in eating disorders and body image therapy. She works with individuals struggling with various eating disorders, helping them develop a healthy relationship with food and their body through compassionate, evidence-based treatment approaches.",
      contact: "+1 (555) 567-8901"
    },
    {
      id: "6",
      name: "Dr. David Wilson",
      specialization: "Addiction Recovery",
      image: "https://images.unsplash.com/photo-1703449481095-bb99a6928f1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwc3ljaGlhdHJpc3QlMjB0aGVyYXBpc3QlMjBwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTgwMDc5NDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      description: "Dr. David Wilson specializes in addiction recovery and substance abuse counseling. He provides comprehensive support for individuals in recovery, focusing on relapse prevention, coping strategies, and building a strong foundation for long-term sobriety.",
      contact: "+1 (555) 678-9012"
    }
  ];

  const handleLocationSearch = () => {
    if (!location.trim()) return;
    
    // Mock search results
    const mockResults: Center[] = [
      {
        id: "1",
        name: "Harmony Mental Health Center",
        contact: "+1 (555) 111-2222",
        address: "123 Wellness Ave, " + location
      },
      {
        id: "2",
        name: "Mindful Care Clinic",
        contact: "+1 (555) 222-3333",
        address: "456 Peace Street, " + location
      },
      {
        id: "3",
        name: "Serenity Counseling Services",
        contact: "+1 (555) 333-4444",
        address: "789 Hope Blvd, " + location
      },
      {
        id: "4",
        name: "Wellness First Psychology Center",
        contact: "+1 (555) 444-5555",
        address: "321 Calm Circle, " + location
      },
      {
        id: "5",
        name: "Bright Future Therapy Group",
        contact: "+1 (555) 555-6666",
        address: "654 Healing Way, " + location
      }
    ];
    
    setSearchResults(mockResults);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLocationSearch();
    }
  };

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <header className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center ml-2"
            style={{ backgroundColor: selectedColor }}
          >
            <span className="text-white text-sm">M</span>
          </div>
          <span className="text-sm">MindSpace</span>
        </div>
        <SharedNavigation onNavigate={onNavigate} currentPage="wellness" />
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
            {/* Left Side - 40% (2 columns) */}
            <div className="lg:col-span-2 space-y-8">
              <div className="space-y-6">
                <h1 className="text-3xl lg:text-4xl leading-tight">
                  Need of wellness<br />
                  advisors
                </h1>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    Professional wellness advisors provide specialized support and evidence-based treatments that can make a significant difference in your wellness journey.
                  </p>
                  <p>
                    Unlike general support, licensed counselors and therapists have the training and expertise to address complex  challenges with personalized treatment approaches.
                  </p>
                  <p>
                    They offer a safe, confidential space where you can explore your thoughts and feelings without judgment, while learning practical coping strategies and tools.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side - 60% (3 columns) */}
            <div className="lg:col-span-3">
              {/* Counselors Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {counselors.map((counselor) => (
                  <button
                    key={counselor.id}
                    onClick={() => setSelectedCounselor(counselor)}
                    className="bg-white border border-gray-200 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 transform hover:scale-105 shadow-md"
                  >
                    <div className="mb-4">
                      <ImageWithFallback
                        src={counselor.image}
                        alt={counselor.name}
                        className="w-16 h-16 rounded-full mx-auto object-cover"
                      />
                    </div>
                    <h3 className="text-base mb-1">{counselor.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{counselor.specialization}</p>
                    <div 
                      className="w-8 h-1 mx-auto"
                      style={{ backgroundColor: selectedColor }}
                    ></div>
                  </button>
                ))}
              </div>

              {/* Find Centers Section */}
              <div className="text-center">
                {!showLocationInput ? (
                  <Button
                    onClick={() => setShowLocationInput(true)}
                    className="text-white px-8 py-3"
                    style={{ backgroundColor: selectedColor }}
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Find Centers Near Me
                  </Button>
                ) : (
                  <div className="max-w-md mx-auto space-y-4">
                    <div className="flex space-x-2">
                      <Input
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Enter your location..."
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                        style={{ borderColor: selectedColor }}
                      />
                      <Button
                        onClick={handleLocationSearch}
                        disabled={!location.trim()}
                        className="text-white px-6 py-2"
                        style={{ backgroundColor: selectedColor }}
                      >
                        Search
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setShowLocationInput(false);
                        setSearchResults(null);
                        setLocation("");
                      }}
                      className="text-gray-500 text-sm"
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Counselor Details Modal */}
      {selectedCounselor && (
        <div 
          className="fixed inset-0 flex items-center justify-center p-4 z-50"
          style={{
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }}
        >
          <div 
            className="bg-white bg-opacity-90 backdrop-blur-lg border border-white border-opacity-30 rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl"
            style={{
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
            }}
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center space-x-4">
                <ImageWithFallback
                  src={selectedCounselor.image}
                  alt={selectedCounselor.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div>
                  <h2 className="text-xl mb-1">{selectedCounselor.name}</h2>
                  <p className="text-gray-600">{selectedCounselor.specialization}</p>
                </div>
              </div>
              <Button
                onClick={() => setSelectedCounselor(null)}
                variant="ghost"
                size="sm"
                className="p-2 hover:bg-black hover:bg-opacity-10 rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg mb-2">About</h3>
                <p className="text-gray-700 leading-relaxed">
                  {selectedCounselor.description}
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <Phone className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700">{selectedCounselor.contact}</span>
              </div>
              
              <div className="flex space-x-3">
                <Button
                  className="text-white px-6 py-2 flex-1"
                  style={{ backgroundColor: selectedColor }}
                >
                  Contact Now
                </Button>
                <Button
                  variant="outline"
                  className="px-6 py-2 flex-1"
                  style={{ borderColor: selectedColor, color: selectedColor }}
                >
                  Schedule Later
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Location Search Results Modal */}
      {searchResults && (
        <div 
          className="fixed inset-0 flex items-center justify-center p-4 z-50"
          style={{
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }}
        >
          <div 
            className="bg-white bg-opacity-90 backdrop-blur-lg border border-white border-opacity-30 rounded-2xl p-8 max-w-4xl w-full max-h-[80vh] overflow-y-auto shadow-2xl"
            style={{
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
            }}
          >
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl">Mental Health Centers near {location}</h2>
              <Button
                onClick={() => setSearchResults(null)}
                variant="ghost"
                size="sm"
                className="p-2 hover:bg-black hover:bg-opacity-10 rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="space-y-4">
              {searchResults.map((center) => (
                <div
                  key={center.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg mb-1">{center.name}</h3>
                      <p className="text-gray-600 text-sm mb-2">{center.address}</p>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700 text-sm">{center.contact}</span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="text-white"
                      style={{ backgroundColor: selectedColor }}
                    >
                      Contact
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex justify-end">
              <Button
                onClick={() => setSearchResults(null)}
                variant="outline"
                className="px-6 py-2"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}