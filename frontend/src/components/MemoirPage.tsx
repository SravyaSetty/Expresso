import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { ArrowLeft, Edit } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "./ThemeProvider";
import { SharedNavigation } from "./SharedNavigation";
import axios from 'axios';

interface MemoirPageProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
  userId: string;
}

interface DiaryEntry {
  _id?: string;
  date: string;
  title: string;
  content: string;
  mood: string;
}

export function MemoirPage({ onBack, onNavigate, userId }: MemoirPageProps) {
  const { selectedColor } = useTheme();
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [showEntry, setShowEntry] = useState(false);
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null);
  const [entryToEdit, setEntryToEdit] = useState<DiaryEntry | null>(null);
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    if (userId) {
      axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/memoir/entries/${userId}`)
        .then(response => { setDiaryEntries(response.data); })
        .catch(error => { console.error("Failed to fetch diary entries:", error); });
    }
  }, [userId]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      const entry = diaryEntries.find((e) => {
        const entryDate = new Date(e.date);
        return entryDate.getUTCFullYear() === date.getUTCFullYear() &&
               entryDate.getUTCMonth() === date.getUTCMonth() &&
               entryDate.getUTCDate() === date.getUTCDate();
      });
      setSelectedEntry(entry || null);
      setShowEntry(true);
      setShowCalendar(false);
    }
  };

  const openNewOrEditEntry = (entry: DiaryEntry | null, date: Date = new Date()) => {
    setEntryToEdit(entry);
    setSelectedDate(date);
    setShowNewEntry(true);
  };
  
  const handleNewEntryClick = () => {
    const today = new Date();
    const todaysEntry = diaryEntries.find((e) => {
        const entryDate = new Date(e.date);
        return entryDate.getUTCFullYear() === today.getUTCFullYear() &&
               entryDate.getUTCMonth() === today.getUTCMonth() &&
               entryDate.getUTCDate() === today.getUTCDate();
    });
    openNewOrEditEntry(todaysEntry || null, today);
  };

  const handleEntrySaved = (savedEntry: DiaryEntry) => {
    setDiaryEntries(prevEntries => {
      const existingIndex = prevEntries.findIndex(e => e._id === savedEntry._id);
      if (existingIndex > -1) {
        const updatedEntries = [...prevEntries];
        updatedEntries[existingIndex] = savedEntry;
        return updatedEntries;
      } else {
        return [...prevEntries, savedEntry];
      }
    });
    setShowNewEntry(false);
    setEntryToEdit(null);
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <header className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={onBack}><ArrowLeft className="w-5 h-5" /></Button>
          <div className="w-8 h-8 rounded-full flex items-center justify-center ml-2" style={{ backgroundColor: selectedColor }}>
            <span className="text-white text-sm">M</span>
          </div>
          <span className="text-sm">Memoir</span>
        </div>
        <SharedNavigation onNavigate={onNavigate} currentPage="memoir" />
      </header>

      <main className="flex items-center justify-center min-h-[calc(100vh-80px)] p-6">
        <div className="text-center space-y-8 max-w-md">
          <img src="https://i.pinimg.com/736x/48/31/f4/4831f4a6393223f9de26be144594e2a4.jpg" alt="Diary illustration" className="w-full h-48 mb-6 object-cover rounded-lg"/>
          <div className="space-y-4">
            <Button onClick={() => setShowCalendar(true)} className="w-full py-4 text-white rounded-xl" style={{ backgroundColor: selectedColor }}>Previous Entries</Button>
            <Button onClick={handleNewEntryClick} variant="outline" className="w-full py-4 rounded-xl border-2" style={{ borderColor: selectedColor, color: selectedColor }}>New or Edit Today's Entry</Button>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed max-w-sm mx-auto">"Writing in a diary helps process emotions, reduce stress, and track personal growth."</p>
        </div>
      </main>

      <Dialog open={showCalendar} onOpenChange={setShowCalendar}>
        <DialogContent className="sm:max-w-md"><DialogHeader><DialogTitle>Select a Date</DialogTitle></DialogHeader><div className="flex justify-center"><Calendar mode="single" selected={selectedDate} onSelect={handleDateSelect} className="rounded-md border"/></div></DialogContent>
      </Dialog>

      <Dialog open={showEntry} onOpenChange={setShowEntry}>
        <DialogContent className="sm:max-w-lg">
          {selectedEntry ? (
            <div className="space-y-4">
              <DialogHeader><DialogTitle className="flex items-center space-x-2"><span>{selectedEntry.mood}</span><span>{selectedEntry.title}</span></DialogTitle></DialogHeader>
              <p className="text-sm text-gray-600">{new Date(selectedEntry.date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
              <p className="text-gray-800 leading-relaxed">{selectedEntry.content}</p>
              <div className="mt-4 flex justify-end">
                <Button onClick={() => { setShowEntry(false); openNewOrEditEntry(selectedEntry, new Date(selectedEntry.date)); }} style={{ backgroundColor: selectedColor }} className="text-white flex items-center gap-2"><Edit size={16}/> Edit Entry</Button>
              </div>
            </div>
          ) : (
            <div className="text-center p-8"><h3 className="text-lg">No Entry Found</h3><p className="text-gray-600 text-sm">There's no diary entry for {selectedDate?.toLocaleDateString()}</p><Button onClick={() => { setShowEntry(false); openNewOrEditEntry(null, selectedDate); }} className="mt-4 text-white" style={{ backgroundColor: selectedColor }}>Create Entry for This Date</Button></div>
          )}
        </DialogContent>
      </Dialog>
      
      {showNewEntry && (
        <NewEntryPage userId={userId} onBack={() => { setShowNewEntry(false); setEntryToEdit(null); }} onEntrySaved={handleEntrySaved} selectedColor={selectedColor} selectedDate={selectedDate} entryToEdit={entryToEdit}/>
      )}
    </div>
  );
}

interface NewEntryPageProps {
  userId: string;
  onBack: () => void;
  onEntrySaved: (newEntry: DiaryEntry) => void;
  selectedColor: string;
  selectedDate?: Date;
  entryToEdit?: DiaryEntry | null;
}

function NewEntryPage({ userId, onBack, onEntrySaved, selectedColor, selectedDate, entryToEdit }: NewEntryPageProps) {
  const [title, setTitle] = useState(entryToEdit?.title || "");
  const [content, setContent] = useState(entryToEdit?.content || "");
  const [selectedMood, setSelectedMood] = useState(entryToEdit?.mood || "");
  const [entryDate, setEntryDate] = useState(entryToEdit ? new Date(entryToEdit.date) : selectedDate || new Date());
  const moods = ["😊", "😢", "😰", "😴", "😡", "🤔"];

  const handleFinish = async () => {
    const entryData = { userId, date: entryDate.toISOString(), title, content, mood: selectedMood };
    try {
      // Use the new smart /save endpoint for both creating and updating
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/memoir/save`, entryData);
      onEntrySaved(response.data.entry);
    } catch (error) {
      console.error("Failed to save diary entry:", error);
      alert("Could not save your entry. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-hidden">
      <div className="absolute top-4 left-4 z-10">
        <Button variant="ghost" size="sm" onClick={onBack} className="p-2 hover:bg-gray-100"><ArrowLeft className="w-5 h-5" /></Button>
      </div>
      <div className="flex h-screen">
        <div className="w-1/5 flex items-start justify-end pt-6 pr-4"><div className="w-8 h-8 rounded-full flex items-center justify-center rotate-45" style={{ backgroundColor: selectedColor + "30" }}><span className="text-lg">📎</span></div></div>
        <div className="w-3/5 flex flex-col py-6 h-full">
          <div className="flex flex-col h-full space-y-6">
            <div><label className="block text-sm text-gray-600 mb-2">Title:</label><input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2 focus:outline-none focus:ring-0" style={{ borderBottomColor: selectedColor }} placeholder="Enter your title..."/></div>
            <div><label className="block text-sm text-gray-600 mb-2">Date:</label><input type="date" value={entryDate.toISOString().split("T")[0]} onChange={(e) => setEntryDate(new Date(e.target.value))} className="border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2 focus:outline-none focus:ring-0" style={{ borderBottomColor: selectedColor }}/></div>
            <div><label className="block text-sm text-gray-600 mb-3">Mood:</label><div className="flex space-x-3">{moods.map((mood) => (<button key={mood} onClick={() => setSelectedMood(mood)} className={`w-12 h-12 text-2xl rounded-full transition-all ${selectedMood === mood ? "scale-110" : "hover:scale-105"}`} style={{ backgroundColor: selectedMood === mood ? selectedColor + "20" : "transparent", border: selectedMood === mood ? `2px solid ${selectedColor}` : "2px solid transparent" }}>{mood}</button>))}</div></div>
            <div className="flex-1 flex flex-col min-h-0"><label className="block text-sm text-gray-600 mb-3 flex-shrink-0">Your thoughts:</label><textarea value={content} onChange={(e) => setContent(e.target.value)} className="flex-1 w-full border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-0 resize-none overflow-y-auto" style={{ borderColor: selectedColor }} placeholder="Write your thoughts here..."/></div>
            <div className="flex-shrink-0 pt-4"><Button onClick={handleFinish} className="w-full text-white py-3" style={{ backgroundColor: selectedColor }} disabled={!title.trim() || !content.trim() || !selectedMood}>Finish Entry</Button></div>
          </div>
        </div>
        <div className="w-1/5"></div>
      </div>
    </div>
  );
}