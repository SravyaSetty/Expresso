import { BreathCircleGame } from "./components/games/BreathCircleGame";
import { Button } from "./components/ui/button";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { LoginPage } from "./components/LoginPage";
import { QuestionnairePage } from "./components/QuestionnairePage";
import { ChatPage } from "./components/ChatPage";
import { ResultsPage } from "./components/ResultsPage";
import { ColorSelectionPage } from "./components/ColorSelectionPage";
import { FontSelectionPage } from "./components/FontSelectionPage";
import { WellnessAdvisorPage } from "./components/WellnessAdvisorPage";
import { BuzzsessionPage } from "./components/BuzzsessionPage";
import { StatsPage } from "./components/StatsPage";
import { MemoirPage } from "./components/MemoirPage";
import { FunzonePage } from "./components/FunzonePage";
import { GuidancePage } from "./components/GuidancePage";
import { EmergencyContactsPage } from "./components/EmergencyContactsPage";
import { WelcomeBackPage } from "./components/WelcomeBackPage";
import { AboutUsPage } from "./components/AboutUsPage";
import { ThemeProvider } from "./components/ThemeProvider";
import axios from 'axios';
import { MemoryFlipGame } from "./components/games/MemoryFlipGame"; // Import the game
import { ColorConnectGame } from "./components/games/ColorConnectGame";
import { PostDetailPage } from "./components/PostDetailPage";
import { CreatePostPage } from "./components/CreatePostPage";

interface Summary {
  summary: string;
  keyInsights: string | string[];
  currentMood: string;
  gentleSuggestion: string;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  // --- FIX 1: Add state to track the active game ---
  const [activeGame, setActiveGame] = useState<string | null>(null);
  
  // (The rest of your state variables remain the same)
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [nickname, setNickname] = useState('');
  const [hasCompletedQuestionnaire, setHasCompletedQuestionnaire] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [latestSummary, setLatestSummary] = useState<Summary | null>(null);
  const [userMood, setUserMood] = useState<string>('');
  const [viewingPostId, setViewingPostId] = useState<string | null>(null);
  // (All your handler functions like useEffect, handleLogout, etc., remain the same)
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUserName = localStorage.getItem('userName');
    const storedUserId = localStorage.getItem('userId');
    const storedNickname = localStorage.getItem('nickname');
    const storedHasCompletedQuestionnaire = localStorage.getItem('hasCompletedQuestionnaire');
    if (token && storedUserName && storedUserId) {
      setIsAuthenticated(true);
      setUserName(storedUserName);
      setUserId(storedUserId);
      setNickname(storedNickname || storedUserName); 
      setHasCompletedQuestionnaire(storedHasCompletedQuestionnaire === 'true');
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setUserName('');
    setUserId('');
    setNickname('');
    setHasCompletedQuestionnaire(false);
    setCurrentPage('home');
    setShowMenu(false);
    setChatMessages([]);
    setLatestSummary(null);
    setUserMood('');
  };

  const handleLoginSuccess = (user: {id: string, username: string}, token: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userName', user.username);
    localStorage.setItem('userId', user.id);
    
    setUserName(user.username);
    setUserId(user.id);
    setIsAuthenticated(true);

    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/user/${user.id}`).then(response => {
      const userData = response.data;
      const completed = userData.hasCompletedQuestionnaire || false;
      const userNickname = userData.nickname || user.username;
      
      localStorage.setItem('hasCompletedQuestionnaire', completed ? 'true' : 'false');
      localStorage.setItem('nickname', userNickname);
      
      setHasCompletedQuestionnaire(completed);
      setNickname(userNickname);

      setCurrentPage('colors');
    }).catch(error => {
      console.error("Error fetching user data after login:", error);
      setHasCompletedQuestionnaire(false);
      setNickname(user.username);
      localStorage.setItem('hasCompletedQuestionnaire', 'false');
      localStorage.setItem('nickname', user.username);
      setCurrentPage('colors');
    });
  };

  const handleSignupSuccess = (user: {id: string, username: string}, token: string) => {
      localStorage.setItem('token', token);
      localStorage.setItem('userName', user.username);
      localStorage.setItem('userId', user.id);
      localStorage.setItem('nickname', user.username);
      localStorage.setItem('hasCompletedQuestionnaire', 'false');

      setUserName(user.username);
      setUserId(user.id);
      setNickname(user.username);
      setHasCompletedQuestionnaire(false);
      setIsAuthenticated(true);
      
      setCurrentPage('emergency-contacts');
  };
  
  const renderPage = () => {
    if (viewingPostId) {
        return <PostDetailPage postId={viewingPostId} userId={userId} onBack={() => setViewingPostId(null)} />;
    }
    // --- FIX 2: Check if a game is active and render it before checking pages ---
    if (activeGame === 'memory-flip') {
        // The 'onBack' prop sets the active game back to null, returning to the Funzone
        return <MemoryFlipGame onBack={() => setActiveGame(null)} />;
    }
    if (activeGame === 'breath-circle') {
        return <BreathCircleGame onBack={() => setActiveGame(null)} />;
    }
    if (activeGame === 'color-connect') {
        return <ColorConnectGame onBack={() => setActiveGame(null)} />;
    }
    // If no game is active, render the current page as usual
    switch(currentPage) {
      case 'home':
        return (
          <div className="min-h-screen bg-white text-black">
            <header className="flex justify-between items-center p-4 sm:p-6">
              <div className="text-lg sm:text-xl">Expresso</div>
              {isAuthenticated ? (
                <div className="relative">
                  <Button variant="ghost" size="sm" className="p-2" onClick={() => setShowMenu(!showMenu)}>
                    {showMenu ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
                  </Button>
                  {showMenu && (
                    <div className="absolute right-0 top-12 bg-white border border-gray-200 rounded-lg shadow-lg py-2 w-48 z-50">
                      <button onClick={() => { setCurrentPage('results'); setShowMenu(false); }} className="w-full text-left px-4 py-2 hover:bg-gray-100">Dashboard</button>
                      <button onClick={() => { setCurrentPage('about'); setShowMenu(false); }} className="w-full text-left px-4 py-2 hover:bg-gray-100">About Us</button>
                      <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600">Logout</button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex space-x-2 sm:space-x-3">
                  <Button variant="outline" size="sm" className="border-black text-black hover:bg-black hover:text-white text-sm sm:text-base px-3 sm:px-4" onClick={() => setCurrentPage('login')}>Login</Button>
                  <Button size="sm" className="bg-black text-white hover:bg-gray-800 text-sm sm:text-base px-3 sm:px-4" onClick={() => setCurrentPage('signup')}>Signup</Button>
                </div>
              )}
            </header>
            <main className="flex items-center justify-center min-h-[calc(100vh-100px)] sm:min-h-[calc(100vh-120px)]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col lg:flex-row items-center h-full">
                <div className="w-full lg:w-3/5 lg:pr-8 space-y-6 sm:space-y-8 text-center lg:text-left">
                  <div className="space-y-4">
                    <h1 className="text-2xl sm:text-3xl lg:text-5xl leading-tight">
                      <span className="block">It's okay to not</span>
                      <span className="block">know where you're</span>
                      <span className="block"> going, what matters</span>
                      <span className="block">is you're still moving!</span>
                    </h1>
                  </div>
                  {!isAuthenticated ? (
                    <Button size="lg" className="bg-black text-white hover:bg-gray-800 px-6 sm:px-8 py-3 text-base sm:text-lg" onClick={() => setCurrentPage('login')}>Get started</Button>
                  ) : (
                    <Button size="lg" className="bg-black text-white hover:bg-gray-800 px-6 sm:px-8 py-3 text-base sm:text-lg" onClick={() => setCurrentPage('results')}>Go to Dashboard</Button>
                  )}
                </div>
                <div className="w-full lg:w-2/5 h-[300px] sm:h-[400px] lg:h-[500px] mt-8 lg:mt-0">
                  <img src="https://i.pinimg.com/1200x/9c/93/c3/9c93c35336cbb393c7188f84105de538.jpg" alt="Mental health illustration" className="w-full h-full object-cover rounded-lg"/>
                </div>
              </div>
            </main>
          </div>
        );
      case 'login':
        return <LoginPage mode="login" onBack={() => setCurrentPage('home')} onLoginComplete={handleLoginSuccess} onNavigateToSignup={() => setCurrentPage('signup')} onSignupComplete={() => {}} />;
      case 'signup':
        return <LoginPage mode="signup" onBack={() => setCurrentPage('home')} onSignupComplete={handleSignupSuccess} onNavigateToSignup={() => setCurrentPage('login')} onLoginComplete={() => {}} />;
      case 'emergency-contacts':
        return <EmergencyContactsPage onBack={() => setCurrentPage('signup')} onComplete={() => setCurrentPage('colors')} />;
      case 'colors':
        return <ColorSelectionPage onColorSelected={() => setCurrentPage('fonts')} />;
      case 'fonts':
        return <FontSelectionPage onFontSelected={() => {
          if (hasCompletedQuestionnaire) {
            setCurrentPage('welcome-back');
          } else {
            setCurrentPage('questionnaire');
          }
        }} />;
      case 'questionnaire':
        return <QuestionnairePage userId={userId} onComplete={(name) => {
            setNickname(name);
            localStorage.setItem('nickname', name);
            localStorage.setItem('hasCompletedQuestionnaire', 'true');
            setHasCompletedQuestionnaire(true);
            setCurrentPage('chat');
        }} />;
      case 'welcome-back':
        return <WelcomeBackPage 
            userName={nickname} 
            onContinue={(mood) => {
                setUserMood(mood);
                setCurrentPage('chat');
            }} 
        />;
      case 'chat':
        return <ChatPage 
          userName={userName}
          userId={userId}
          nickname={nickname}
          messages={chatMessages}
          onUpdateMessages={setChatMessages}
          userMood={userMood}
          onSummaryGenerated={(summary) => {
            setLatestSummary(summary);
            setChatMessages([]); 
            setUserMood('');
            setCurrentPage('results');
          }}
        />;
      case 'results':
        return <ResultsPage userName={nickname} userId={userId} onNavigate={(page) => setCurrentPage(page)} summary={latestSummary} />;
      case 'stats':
        return <StatsPage onBack={() => setCurrentPage('results')} onNavigate={(page) => setCurrentPage(page)} />;
      case 'about':
        return <AboutUsPage onBack={() => setCurrentPage(isAuthenticated ? 'results' : 'home')} onNavigate={(page) => setCurrentPage(page)} />;
      case 'buzzsession':
        return <BuzzsessionPage 
            // --- ADD userId to the props ---
            userId={userId} 
            onBack={() => setCurrentPage('results')} 
            onNavigate={(page) => setCurrentPage(page)}
            onSelectPost={(postId) => setViewingPostId(postId)}
        />;
      case 'wellness':
        return <WellnessAdvisorPage onBack={() => setCurrentPage('results')} onNavigate={(page) => setCurrentPage(page)} />;
      case 'guidance':
        return <GuidancePage onBack={() => setCurrentPage('results')} onNavigate={(page) => setCurrentPage(page)} />;
      case 'funzone':
        return <FunzonePage 
            onBack={() => setCurrentPage('results')} 
            onNavigate={(page) => setCurrentPage(page)}
            // --- FIX 3: Replace the placeholder with the actual function logic ---
            onPlayGame={(gameId) => setActiveGame(gameId)}
        />;
       case 'create-post':
        return <CreatePostPage 
            userId={userId} 
            onBack={() => setCurrentPage('buzzsession')} 
        />;
      case 'memoir':
        return <MemoirPage userId={userId} onBack={() => setCurrentPage('results')} onNavigate={(page) => setCurrentPage(page)} />;
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <ThemeProvider>
      {renderPage()}
    </ThemeProvider>
  );
}

