import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Progress } from "./ui/progress";
import { useState, useEffect } from "react";
import { useTheme } from "./ThemeProvider";
import axios from 'axios';

interface QuestionnairePageProps {
  onComplete: (userName: string) => void;
  userId: string;
}

export function QuestionnairePage({ onComplete, userId }: QuestionnairePageProps) {
  const { selectedColor } = useTheme();
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [answers, setAnswers] = useState({
    nickname: "",
    ageGroup: "",
    gender: "",
    situation: "",
    expectation: "",
    ethnicity: ""
  });

  const totalQuestions = 6;
  const progress = (currentQuestion / totalQuestions) * 100;

  const questions = [
    {
      id: 1,
      question: "A name you would love to be called?",
      type: "input",
      field: "nickname"
    },
    {
      id: 2,
      question: "Which age group fits you the best?",
      type: "options",
      field: "ageGroup",
      options: ["14-18", "19-25", "26-35", "36-45", "45+"]
    },
    {
      id: 3,
      question: "How do you identify as?",
      type: "options",
      field: "gender",
      options: ["Male", "Female", "Trans", "LGBTQ+", "Other"]
    },
    {
      id: 4,
      question: "What situation describes you the best?",
      type: "options",
      field: "situation",
      options: ["Relationship", "Depressed", "Single", "Anxious", "Stressed","Addiction"]
    },
    {
      id: 5,
      question: "How can we accompany you in your journey?",
      type: "options",
      field: "expectation",
      options: ["Mental Support", "Friend to Talk", "Guidance", "Stress Relief", "Emotional Outlet"]
    },
    {
      id: 6,
      question: "What is your ethnicity?",
      type: "options",
      field: "ethnicity",
      options: ["Asian", "African", "Caucasian", "Hispanic", "Mixed Heritage"]
    }
  ];

  const currentQuestionData = questions[currentQuestion - 1];

  const handleNext = async () => {
    if (currentQuestion < totalQuestions) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setIsLoading(true);
      try {
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/user/questionnaire`, { userId, answers });
        onComplete(answers.nickname || "friend");
      } catch (error) {
        alert('Failed to save questionnaire data.');
        setIsLoading(false);
      }
    }
  };

  const handleOptionSelect = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestionData.field]: value
    }));
  };

  const handleInputChange = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestionData.field]: value
    }));
  };

  const isAnswered = () => {
    const currentAnswer = answers[currentQuestionData.field as keyof typeof answers];
    return currentAnswer && currentAnswer.trim() !== "";
  };

  // Loading Screen Component
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white text-black flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-16 h-16 mx-auto flex items-center justify-center">
            <div 
              className="w-12 h-12 rounded-full animate-pulse"
              style={{ 
                backgroundColor: selectedColor,
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite, scale 2s ease-in-out infinite'
              }}
            ></div>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl">Give me some time {answers.nickname || "friend"},</h2>
            <p className="text-gray-600">
              I'm getting a good understanding of you and will be a great companion to you.
            </p>
          </div>
        </div>
        <style>{`
          @keyframes scale {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.2);
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={progress} className="h-2 bg-gray-200">
            <div 
              className="h-full transition-all duration-300 ease-out rounded-full"
              style={{ width: `${progress}%`, backgroundColor: selectedColor }}
            />
          </Progress>
        </div>

        {/* Question Container */}
        <div className="bg-white border-2 border-gray-200 rounded-lg p-8 shadow-sm">
          {/* Question */}
          <div className="mb-8">
            <h2 className="text-lg mb-6">{currentQuestionData.question}</h2>

            {/* Input Type */}
            {currentQuestionData.type === "input" && (
              <Input
                type="text"
                value={answers[currentQuestionData.field as keyof typeof answers]}
                onChange={(e) => handleInputChange(e.target.value)}
                className="w-full border-0 border-b-2 border-gray-300 rounded-none bg-transparent px-0 py-2 focus:ring-0 text-base"
                style={{ borderBottomColor: selectedColor }}
                placeholder="Your answer..."
              />
            )}

            {/* Options Type */}
            {currentQuestionData.type === "options" && (
              <div className="space-y-3">
                {currentQuestionData.options?.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleOptionSelect(option)}
                    className={`w-full p-4 text-left border-2 rounded-lg transition-all ${
                      answers[currentQuestionData.field as keyof typeof answers] === option
                        ? "bg-gray-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    style={{
                      borderColor: answers[currentQuestionData.field as keyof typeof answers] === option 
                        ? selectedColor 
                        : undefined
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Next Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleNext}
              disabled={!isAnswered()}
              className="text-white px-6 py-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
              style={{
                backgroundColor: isAnswered() ? selectedColor : '#d1d5db',
                borderColor: selectedColor
              }}
            >
              {currentQuestion === totalQuestions ? "Finish" : "Next"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}