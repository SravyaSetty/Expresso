import { Button } from "./ui/button";
import { ArrowLeft, X } from "lucide-react";
import { useState } from "react";
import { useTheme } from "./ThemeProvider";
import { SharedNavigation } from "./SharedNavigation";

interface AboutUsPageProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
}

interface TeamMember {
  name: string;
  role: string;
  description: string;
  image: string;
  expertise: string[];
}

export function AboutUsPage({ onBack, onNavigate }: AboutUsPageProps) {
  const { selectedColor } = useTheme();
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const teamMembers: TeamMember[] = [
    {
      name: "Reshyendra",
      role: "Full Stack Developer",
      description: "Reshyendra is a highly skilled Full-Stack Developer actively exploring new opportunities. He is highly proficient in Data Structures, Algorithms, and advanced problem-solving, and thrives on deconstructing complex challenges to engineer elegant, efficient solutions. Driven by a relentless curiosity and a passion for innovation, his mission is to continuously learn and apply new technologies to build meaningful and impactful applications",
      image: "https://i.pinimg.com/736x/fb/ef/d5/fbefd5df5d5d1ea1c59cd6b319376022.jpg",
      expertise: ["Problem Solving", "Web Development", "Gen AI enthusiast","Team Collaborator"]
    },
    {
      name: "Sravya",
      role: "UX/UI Designer",
      description: "Sravya is passionate about creating inclusive and accessible digital experiences. With a background in human-computer interaction, she ensures our platform is user-friendly and promotes positive mental health through thoughtful design choices.",
      image: "https://i.pinimg.com/736x/0f/89/50/0f8950224b30afc1b20aeb6ae28a6724.jpg",
      expertise: ["User Experience Design", "Accessibility", "Human-Computer Interaction", "Design Systems"]
    },
    {
      name: "SriCharan",
      role: "Full Stack Developer",
      description: "SriCharan is our technical lead with expertise in building secure and scalable web applications. He focuses on data privacy and ensuring our platform provides a safe space for users to express themselves without compromising their personal information.",
      image: "https://i.pinimg.com/1200x/41/dd/2e/41dd2eadabfd0c7ccb352de0bf7157c3.jpg",
      expertise: ["Web Development", "Data Security", "Cloud Architecture", "API Development"]
    },
    {
      name: "Moksha",
      role: "AI/ML Engineer",
      description: "Moksha specializes in natural language processing and conversational AI. He develops the intelligent chatbot systems that provide personalized support and insights, ensuring the AI interactions are empathetic and authentic.",
      image: "https://i.pinimg.com/736x/04/03/a9/0403a942220c8fcc7029d650afd99269.jpg",
      expertise: ["Machine Learning", "Natural Language Processing", "Conversational AI", "Data Analytics"]
    }
  ];

  const openModal = (member: TeamMember) => {
    setSelectedMember(member);
  };

  const closeModal = () => {
    setSelectedMember(null);
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
            <span className="text-white text-sm">A</span>
          </div>
          <span className="text-sm">About Us</span>
        </div>
        <SharedNavigation onNavigate={onNavigate} currentPage="about" />
      </header>

      {/* Main Content */}
      <main className="p-6 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl mb-2">Meet Our Team</h1>
          <p className="text-gray-600">The passionate individuals behind MindSpace</p>
        </div>

        {/* Team Member Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {teamMembers.map((member, index) => (
            <button
              key={index}
              onClick={() => openModal(member)}
              className="bg-white border border-gray-200 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 transform hover:scale-105 shadow-md"
            >
              <h3 className="text-base mb-2">{member.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{member.role}</p>
              <div 
                className="w-8 h-1 mx-auto"
                style={{ backgroundColor: selectedColor }}
              ></div>
            </button>
          ))}
        </div>
      </main>

      {/* Glass Morphism Modal */}
      {selectedMember && (
        <div 
          className="fixed inset-0 flex items-center justify-center p-4 z-50"
          style={{
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }}
        >
          <div 
            className="bg-white bg-opacity-90 backdrop-blur-lg border border-white border-opacity-30 rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto shadow-2xl flex"
            style={{
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
            }}
          >
            {/* Left Side - 40% Image */}
            <div className="w-2/5 relative overflow-hidden rounded-l-2xl">
              <img
                src={selectedMember.image}
                alt={`${selectedMember.name} portrait`}
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
            </div>

            {/* Right Side - 60% Info */}
            <div className="w-3/5 p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl mb-1">{selectedMember.name}</h2>
                  <p className="text-lg text-gray-600">{selectedMember.role}</p>
                </div>
                <Button
                  onClick={closeModal}
                  variant="ghost"
                  size="sm"
                  className="p-2 hover:bg-black hover:bg-opacity-10 rounded-full"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg mb-3">About</h3>
                  <p className="text-gray-800 leading-relaxed">
                    {selectedMember.description}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg mb-3">Expertise</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedMember.expertise.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full text-sm border"
                        style={{
                          borderColor: selectedColor,
                          backgroundColor: selectedColor + '10',
                          color: selectedColor
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end">
                <Button
                  onClick={closeModal}
                  className="text-white px-6 py-2"
                  style={{ backgroundColor: selectedColor }}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}