import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useTheme } from "./ThemeProvider";
import { SharedNavigation } from "./SharedNavigation";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip } from "recharts";

interface StatsPageProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
}

export function StatsPage({ onBack, onNavigate }: StatsPageProps) {
  const { selectedColor } = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState("week");

  // Mock data for the wellness chart
  const weeklyData = [
    { day: "Mon", wellness: 65 }, { day: "Tue", wellness: 72 }, { day: "Wed", wellness: 68 },
    { day: "Thu", wellness: 75 }, { day: "Fri", wellness: 82 }, { day: "Sat", wellness: 78 },
    { day: "Sun", wellness: 85 }
  ];
  const monthlyData = [
    { day: "Week 1", wellness: 70 }, { day: "Week 2", wellness: 75 },
    { day: "Week 3", wellness: 78 }, { day: "Week 4", wellness: 82 }
  ];
  const yearlyData = [
    { day: "Jan", wellness: 65 }, { day: "Feb", wellness: 68 }, { day: "Mar", wellness: 72 },
    { day: "Apr", wellness: 75 }, { day: "May", wellness: 78 }, { day: "Jun", wellness: 82 },
    { day: "Jul", wellness: 85 }, { day: "Aug", wellness: 80 }, { day: "Sep", wellness: 76 },
    { day: "Oct", wellness: 79 }, { day: "Nov", wellness: 83 }, { day: "Dec", wellness: 87 }
  ];

  const getChartData = () => {
    switch(selectedPeriod) {
      case "month": return monthlyData;
      case "year": return yearlyData;
      default: return weeklyData;
    }
  };

  // Mock data for spider chart
  const emotionData = [
    { emotion: "Happy", value: 85 }, { emotion: "Calm", value: 72 }, { emotion: "Anxious", value: 35 },
    { emotion: "Energetic", value: 78 }, { emotion: "Sad", value: 25 }, { emotion: "Confident", value: 80 }
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-black flex flex-col">
      <header className="flex items-center justify-between p-4 bg-white border-b">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={onBack}><ArrowLeft className="w-5 h-5" /></Button>
          <div className="w-8 h-8 rounded-full flex items-center justify-center ml-2" style={{ backgroundColor: selectedColor }}><span className="text-white text-sm">M</span></div>
          <span className="text-sm">Wellness Monitoring</span>
        </div>
        <SharedNavigation onNavigate={onNavigate} currentPage="stats" />
      </header>
      
      {/* --- THIS IS THE FIX --- */}
      {/* A new grid layout for the main content area ensures proper space distribution */}
      <main className="p-4 md:p-6 flex-1 grid grid-rows-[auto_1fr] gap-4">
        {/* Top Row - Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border rounded-lg p-4 flex flex-col justify-center text-center">
            <div className="text-gray-500 text-sm mb-1">Total Check-ins</div>
            <div className="text-3xl font-semibold">47</div>
          </div>
          <div className="bg-white border rounded-lg p-4 flex flex-col justify-center text-center">
            <div className="text-gray-500 text-sm mb-1">Current Streak</div>
            <div className="text-3xl font-semibold">12 days</div>
          </div>
          <div className="bg-white border rounded-lg p-4 flex flex-col justify-center text-center">
            <div className="text-gray-500 text-sm mb-1">Wellness Score</div>
            <div className="text-3xl font-semibold">82</div>
          </div>
        </div>

        {/* Bottom Row - Charts (This row will now correctly fill all remaining space) */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 min-h-0">
          {/* Left container - Line Chart */}
          <div className="lg:col-span-3 bg-white border rounded-lg p-4 flex flex-col">
            <div className="flex justify-between items-center mb-4 flex-shrink-0">
              <div className="text-gray-600 font-medium">Wellness Trends</div>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-24 h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Week</SelectItem>
                  <SelectItem value="month">Month</SelectItem>
                  <SelectItem value="year">Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getChartData()} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }}/>
                  <YAxis domain={[50, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }}/>
                  <Tooltip contentStyle={{ borderRadius: '0.5rem', borderColor: '#e5e7eb' }} />
                  <Line type="monotone" dataKey="wellness" stroke={selectedColor} strokeWidth={2} dot={{ fill: selectedColor, r: 4 }} activeDot={{ r: 6, stroke: selectedColor, strokeWidth: 2, fill: 'white' }}/>
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right container - Radar Chart */}
          <div className="lg:col-span-2 bg-white border rounded-lg p-4 flex flex-col">
            <div className="text-gray-600 font-medium mb-2 text-center flex-shrink-0">Emotion Web</div>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={emotionData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                  <PolarGrid gridType="polygon" />
                  <PolarAngleAxis dataKey="emotion" tick={{ fontSize: 12, fill: '#6B7280' }}/>
                  <PolarRadiusAxis domain={[0, 100]} axisLine={false} tick={false} />
                  <Tooltip contentStyle={{ borderRadius: '0.5rem', borderColor: '#e5e7eb' }} />
                  <Radar name="Emotions" dataKey="value" stroke={selectedColor} fill={selectedColor} fillOpacity={0.3} strokeWidth={2}/>
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}