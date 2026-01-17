import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useTheme } from "./ThemeProvider";

interface EmergencyContactsPageProps {
  onBack: () => void;
  onComplete: () => void;
}

export function EmergencyContactsPage({ onBack, onComplete }: EmergencyContactsPageProps) {
  const { selectedColor } = useTheme();
  const [contacts, setContacts] = useState({
    contact1: { email: "" },
    contact2: { email: "" },
    contact3: { email: "" }
  });

  const handleContactChange = (contactNum: 'contact1' | 'contact2' | 'contact3', value: string) => {
    setContacts(prev => ({
      ...prev,
      [contactNum]: {
        email: value
      }
    }));
  };

  const isFirstContactComplete = contacts.contact1.email.trim();

  const handleSubmit = () => {
    if (isFirstContactComplete) {
      console.log("Emergency contacts:", contacts);
      onComplete();
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex items-center justify-center p-6">
      <div className="max-w-md mx-auto text-center w-full">
        {/* Progress indicator */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex space-x-2">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`w-3 h-3 rounded-full ${
                  step <= 2 ? 'opacity-100' : 'opacity-30'
                }`}
                style={{ backgroundColor: selectedColor }}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500">Step 2 of 4</span>
        </div>

        {/* Title and Description */}
        <div className="mb-8">
          <h1 className="text-2xl mb-4">Emergency Contacts</h1>
          <p className="text-gray-600 leading-relaxed">
            Please provide at least one emergency contact email for your safety and support.
          </p>
        </div>

        {/* Emergency Contact Inputs */}
        <div className="space-y-4 mb-8">
          {/* Contact 1 - Required */}
          <div className="text-left">
            <label className="block text-sm text-gray-600 mb-2">
              Primary Contact Email <span className="text-red-500">*</span>
            </label>
            <Input
              type="email"
              value={contacts.contact1.email}
              onChange={(e) => handleContactChange('contact1', e.target.value)}
              placeholder="primary@example.com"
              className="w-full"
              style={{ borderColor: selectedColor }}
            />
          </div>

          {/* Contact 2 - Optional */}
          <div className="text-left">
            <label className="block text-sm text-gray-600 mb-2">
              Secondary Contact Email (Optional)
            </label>
            <Input
              type="email"
              value={contacts.contact2.email}
              onChange={(e) => handleContactChange('contact2', e.target.value)}
              placeholder="secondary@example.com"
              className="w-full border-gray-300"
            />
          </div>

          {/* Contact 3 - Optional */}
          <div className="text-left">
            <label className="block text-sm text-gray-600 mb-2">
              Third Contact Email (Optional)
            </label>
            <Input
              type="email"
              value={contacts.contact3.email}
              onChange={(e) => handleContactChange('contact3', e.target.value)}
              placeholder="third@example.com"
              className="w-full border-gray-300"
            />
          </div>
        </div>

        {/* Continue Button */}
        <Button
          onClick={handleSubmit}
          disabled={!isFirstContactComplete}
          className="w-full text-white py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ 
            backgroundColor: isFirstContactComplete ? selectedColor : '#gray-400'
          }}
        >
          Continue
        </Button>
        
        {!isFirstContactComplete && (
          <p className="text-sm text-gray-500 mt-2">
            Please provide at least one emergency contact
          </p>
        )}
      </div>
    </div>
  );
}