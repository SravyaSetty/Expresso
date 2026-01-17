import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import axios from 'axios';

interface LoginPageProps {
  onBack: () => void;
  onSignupComplete: (user: { id: string; username: string }, token: string) => void;
  onLoginComplete: (user: { id: string; username: string }, token: string) => void;
  onNavigateToSignup?: () => void;
  mode: 'login' | 'signup';
}

export function LoginPage({ onBack, onSignupComplete, onLoginComplete, onNavigateToSignup, mode }: LoginPageProps) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    agreeToTerms: false,
    password: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, {
          email: formData.email,
          password: formData.password,
        });
        onLoginComplete(response.data.user, response.data.token);
      } catch (error) {
        alert('Login failed. Please check your credentials.');
      }
    } else {
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/signup`, {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        });
        onSignupComplete(response.data.user, response.data.token);
      } catch (error: any) {
        if (error.response && error.response.data && error.response.data.message) {
          alert(`Signup failed: ${error.response.data.message}`);
        } else {
          alert('Signup failed. Please try again.');
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col lg:flex-row">
      {/* Form Section - Full width on mobile, half on desktop */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 sm:px-8 lg:px-16 xl:px-20 py-8 lg:py-0">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="self-start mb-6 sm:mb-8 p-2 hover:bg-gray-100"
          onClick={onBack}
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>

        {/* Form Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl mb-3 sm:mb-4 leading-tight">
            {mode === 'login' ? (
              <>
                <span className="block">Welcome back!</span>
                <span className="block">Take a step to reframe your life</span>
              </>
            ) : (
              <>
                <span className="block">Ready to start your</span>
                <span className="block">success story?</span>
              </>
            )}
          </h1>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            {mode === 'login' ? (
              <>
                <span className="block">Sign in to continue your journey</span>
                {/* <span className="block">mental wellness journey</span> */}
              </>
            ) : (
              <>
                <span className="block">Well being starts from within oneself</span>
                {/* <span className="block">through your favorite literature today!</span> */}
              </>
            )}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Username (Signup only) */}
          {mode === 'signup' && (
            <div>
              <label className="block text-sm mb-2 text-gray-800">
                Username
              </label>
              <Input
                type="text"
                placeholder="janedoe"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full border-0 border-b border-gray-300 rounded-none bg-transparent px-0 focus:border-black focus:ring-0 text-sm sm:text-base"
              />
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm mb-2 text-gray-800">
              Email
            </label>
            <Input
              type="email"
              placeholder="janedoe@mail.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full border-0 border-b border-gray-300 rounded-none bg-transparent px-0 focus:border-black focus:ring-0 text-sm sm:text-base"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm mb-2 text-gray-800">
              Password
            </label>
            <Input
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full border-0 border-b border-gray-300 rounded-none bg-transparent px-0 focus:border-black focus:ring-0 text-sm sm:text-base"
            />
          </div>

          {mode === 'signup' && (
            <>
              {/* Terms and Conditions - Signup only */}
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked: boolean) => 
                    setFormData({ ...formData, agreeToTerms: checked as boolean })
                  }
                  className="border-gray-400 data-[state=checked]:bg-black data-[state=checked]:border-black mt-1"
                />
                <label htmlFor="terms" className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  I agree to the <span className="text-black underline cursor-pointer">Terms & Conditions</span>
                </label>
              </div>
            </>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="bg-black text-white hover:bg-gray-800 px-6 sm:px-8 py-2 rounded-full text-sm sm:text-base"
            disabled={mode === 'signup' ? (!formData.username || !formData.email || !formData.password || !formData.agreeToTerms) : (!formData.email || !formData.password)}
          >
            {mode === 'login' ? 'Sign in' : 'Sign up'}
          </Button>
        </form>

        {/* Navigation Links */}
        {mode === 'login' && onNavigateToSignup && (
          <div className="mt-4 sm:mt-6 text-center">
            <p className="text-gray-600 text-xs sm:text-sm">
              Don't have an account?{" "}
              <button
                onClick={onNavigateToSignup}
                className="text-black underline hover:no-underline"
              >
                Create one
              </button>
            </p>
          </div>
        )}

        {mode === 'signup' && (
          <div className="mt-4 sm:mt-6 text-center">
            <p className="text-gray-600 text-xs sm:text-sm">
              Already have an account?{" "}
              <button
                onClick={() => onNavigateToSignup && onNavigateToSignup()}
                className="text-black underline hover:no-underline"
              >
                Login
              </button>
            </p>
          </div>
        )}
      </div>

      {/* Right Side - Illustration - Hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-8">
        <div className="w-full h-[400px] lg:h-[500px]">
          <img
            src={mode === 'signup' 
              ? "https://i.pinimg.com/1200x/65/22/16/652216ee4ffcf856f60acdb35c037869.jpg"
              : "https://i.pinimg.com/736x/e2/3f/9b/e23f9bb1b472f112dbaad6c1e0958701.jpg"}
            alt={mode === 'signup' ? "Mental wellness signup illustration" : "Person reading illustration"}
            className="w-full h-full object-contain rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
