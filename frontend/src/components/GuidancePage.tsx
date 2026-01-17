import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { ArrowLeft, Search, Play, BookOpen, ExternalLink } from "lucide-react";
import { useState } from "react";
import { useTheme } from "./ThemeProvider";
import { SharedNavigation } from "./SharedNavigation";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface GuidancePageProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
}

interface ContentItem {
  id: string;
  title: string;
  hashtag: string;
  image: string;
  type: "videos" | "books" | "success stories";
  // Video specific
  videoThumbnail?: string;
  description?: string;
  videoUrl?: string;
  // Book specific
  author?: string;
  summary?: string;
  bookUrl?: string;
  // Success story specific
  story?: string;
  personName?: string;
}

export function GuidancePage({ onBack, onNavigate }: GuidancePageProps) {
  const { selectedColor } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string>("videos");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Sample content data
  const contentData: ContentItem[] = [
    // Videos
    {
      id: "v1",
      title: "Stress Handling",
      hashtag: "#stress #anxiety",
      image: "https://i.pinimg.com/1200x/7d/ad/32/7dad32c94e245534582905eba11ddf31.jpg",
      type: "videos",
      videoThumbnail: "https://i.pinimg.com/1200x/7d/ad/32/7dad32c94e245534582905eba11ddf31.jpg",
      description: " We highly recommend this resource for understanding how stress affects both mind and body, and for learning science-backed tools to manage it effectively. It offers practical strategies, supplements, and protocols to build resilience, reduce chronic stress, and maintain balance in daily life.",
      videoUrl: " https://youtu.be/qUz93CyNIz0?si=wxRnfSRbi27hieoP"
    },
    {
      id: "v2",
      title: "The Secret to Stopping Fear and Anxiety",
      hashtag: "#fear #anxiety",
      image: "https://i.pinimg.com/736x/d3/9f/66/d39f6669cc504a235057086dd278a139.jpg",
      type: "videos",
      videoThumbnail: "https://images.unsplash.com/photo-1507120410856-1f35574c3b45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmVhdGhpbmclMjBleGVyY2lzZSUyMHZpZGVvfGVufDF8fHx8MTc1ODAxMTEwM3ww&ixlib=rb-4.1.0&q=80&w=1080",
      description: "This video introduces a powerful 3-step technique based on the 5 Second Rule to stop fear, anxiety, panic attacks, and negative thoughts. Backed by research and proven results, it offers a simple yet effective way to build courage and transform daily life.",
      videoUrl: "https://youtu.be/6n8i7ua0mSw?si=n8-jImhKXkiL9JbV"
    },
    {
      id: "v3",
      title: "How to stay calm when you know you'll be stressed ",
      hashtag: "#stressrelief",
      // image: "https://images.unsplash.com/photo-1613205899634-c1360f6bb2f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlc3MlMjBtYW5hZ2VtZW50JTIwdmlkZW98ZW58MXx8fHwxNzU4MDExMTE0fDA&ixlib=rb-4.1.0&q=80&w=1080",
      image: "https://i.pinimg.com/1200x/e6/b9/c1/e6b9c1decfae8e63c78edf62d1328f3f.jpg",
      type: "videos",
      videoThumbnail: "https://images.unsplash.com/photo-1613205899634-c1360f6bb2f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlc3MlMjBtYW5hZ2VtZW50JTIwdmlkZW98ZW58MXx8fHwxNzU4MDExMTE0fDA&ixlib=rb-4.1.0&q=80&w=1080",
      description: "Neuroscientist Daniel Levitin explains how stress clouds rational thinking by triggering cortisol, but suggests using a “pre-mortem” to plan for potential failures in advance. This proactive approach helps reduce mistakes and improve decision-making under pressure.",
      videoUrl: "https://youtu.be/8jPQjjsBbIc?si=ABk0rsmRTiuIGXuF"
    },
    {
      id: "v4",
      title: "Skills for Healthy Romantic Relationships",
      hashtag: " #relationship",
      image: "https://i.pinimg.com/1200x/95/67/a4/9567a48222bc3f013c6e6d246b1e9aae.jpg",
      type: "videos",
      //
      videoThumbnail: "https://images.unsplash.com/photo-1608657354857-7da58e290436?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpdGF0aW9uJTIwdmlkZW8lMjB0dXRvcmlhbHxlbnwxfHx8fDE3NTgwMTEwODd8MA&ixlib=rb-4.1.0&q=80&w=1080",
      description: "Psychologist Dr. Joanne Davila explains how to build healthy romantic relationships using three key skills: insight, mutuality, and emotion regulation. Her evidence-based approach helps people create stronger, more fulfilling connections while avoiding unhealthy patterns",
      videoUrl: "https://youtu.be/gh5VhaicC6g?si=R5Vki3xOD7zcUM2w"
    },
    {
      id: "v5",
      title: "Advice for Strong Relationships",
      hashtag: " #relationship",
      image: "https://i.pinimg.com/1200x/d8/1b/38/d81b3851358f1d36ebc004a42dd6e0d4.jpg",
      type: "videos",
      //
      videoThumbnail: "https://images.unsplash.com/photo-1608657354857-7da58e290436?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpdGF0aW9uJTIwdmlkZW8lMjB0dXRvcmlhbHxlbnwxfHx8fDE3NTgwMTEwODd8MA&ixlib=rb-4.1.0&q=80&w=1080",
      description: "Jordan Peterson stresses that honesty, commitment, and refusing to run from difficulties are the keys to strong, lasting relationships",
      videoUrl: "https://youtu.be/n-SVPsGMPi8?si=o1igKgUrzvY_Wvlm"
    },
    {
      id: "v6",
      title: "How not to take things personally?",
      hashtag: " #personalitydevelopment",
      image: "https://i.pinimg.com/1200x/1e/c7/6f/1ec76f5f832920aa382575948fff67e2.jpg",
      type: "videos",
      //
      videoThumbnail: "https://images.unsplash.com/photo-1608657354857-7da58e290436?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpdGF0aW9uJTIwdmlkZW8lMjB0dXRvcmlhbHxlbnwxfHx8fDE3NTgwMTEwODd8MA&ixlib=rb-4.1.0&q=80&w=1080",
      description: " Frederik Imbo shares two key strategies: first, shift your mindset to recognize that most issues aren’t about you, but about the other person’s intentions. Second, when something is about you, respond with self-empathy and open, non-blaming communication.",
      videoUrl: "https://youtu.be/LnJwH_PZXnM?si=p3iTq6uqPPFya0OZ"
    },
    {
      id: "v7",
      title: "Habits of The Ultra Wealthy ",
      hashtag: " #personalitydevelopment",
      image: "https://i.pinimg.com/736x/0f/a3/fa/0fa3fabc69ba89f474c3af53e42c8160.jpg",
      type: "videos",
      //
      videoThumbnail: "https://images.unsplash.com/photo-1608657354857-7da58e290436?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpdGF0aW9uJTIwdmlkZW8lMjB0dXRvcmlhbHxlbnwxfHx8fDE3NTgwMTEwODd8MA&ixlib=rb-4.1.0&q=80&w=1080",
      description: "  Dr. Andrew Huberman reveals the daily habits and mindset shifts of the ultra-rich that rewire the brain for peak performance. By practicing conscious behaviors consistently, you can unlock your full potential and move closer to success.",
      videoUrl: "https://youtu.be/BzynYwGx-qg?si=6YlmxqADMLGYskIh"
    },
    {
      id: "v8",
      title: "I learned a system for remembering everything",
      hashtag: " #studyplanning" ,
      image: "https://i.pinimg.com/1200x/61/ed/41/61ed41ef5b111df893dac44fb06900fc.jpg",
      type: "videos",
      //
      videoThumbnail: "https://images.unsplash.com/photo-1608657354857-7da58e290436?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpdGF0aW9uJTIwdmlkZW8lMjB0dXRvcmlhbHxlbnwxfHx8fDE3NTgwMTEwODd8MA&ixlib=rb-4.1.0&q=80&w=1080",
      description: "The video explores a memory system where you don’t aim to remember everything, but instead focus on retaining what matters most by actively taking notes, revisiting them, and organizing them into themes after reading. This structured system helps make insights stick and improves long-term recall",
      videoUrl: "https://youtu.be/Rvey9g0VgY0?si=V746Vzh8sVC3jEAv"
    },
     {
      id: "v9",
      title: "Getting ADDICTED to STUDYING is Easy, Actually",
      hashtag: " #studyplanning #dopamine" ,
      image: "https://i.pinimg.com/736x/52/ce/b2/52ceb23af94247d54971df575342cce7.jpg",
      type: "videos",
      //
      videoThumbnail: "https://images.unsplash.com/photo-1608657354857-7da58e290436?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpdGF0aW9uJTIwdmlkZW8lMjB0dXRvcmlhbHxlbnwxfHx8fDE3NTgwMTEwODd8MA&ixlib=rb-4.1.0&q=80&w=1080",
      description: "This video explains how to rewire your brain to enjoy studying by using dopamine and motivation science. It shares practical techniques like mini dopamine detoxes, Pomodoro sessions, and visualization to overcome procrastination and boost productivity",
      videoUrl: "https://youtu.be/S39zoHnV-ok?si=tGBgLqifjyylnCns"
    },
     {
      id: "v10",
      title: "A Quick Way To Overcome Addiction ",
      hashtag: " #addiction" ,
      image: "https://i.pinimg.com/736x/ff/76/d5/ff76d5ed3e2aaa553b6e9a38ba189700.jpg",
      type: "videos",
      //
      videoThumbnail: "https://images.unsplash.com/photo-1608657354857-7da58e290436?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpdGF0aW9uJTIwdmlkZW8lMjB0dXRvcmlhbHxlbnwxfHx8fDE3NTgwMTEwODd8MA&ixlib=rb-4.1.0&q=80&w=1080",
      description: "This video introduces the “nothing rule,” a simple yet powerful method to overcome addiction. By committing to do nothing when faced with temptation, you can break harmful habits and regain control. ",
      videoUrl: "https://youtu.be/gZOcLix4PGc?si=lEYjoMGc-rzeqnjf"
    },
    {
      id: "v11",
      title: "The Stigma of Addiction ",
      hashtag: " #drugaddiction" ,
      image: "https://i.pinimg.com/1200x/24/03/81/2403819787f3c8ceb66b9edf5058629e.jpg",
      type: "videos",
      //
      videoThumbnail: "https://images.unsplash.com/photo-1608657354857-7da58e290436?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpdGF0aW9uJTIwdmlkZW8lMjB0dXRvcmlhbHxlbnwxfHx8fDE3NTgwMTEwODd8MA&ixlib=rb-4.1.0&q=80&w=1080",
      description: "Tony shares how his first encounter with marijuana spiraled into addiction, homelessness, and prison. He also highlights his journey of redemption, breaking stigma and proving recovery is possible.",
      videoUrl: "https://youtu.be/FuooVrSpffk?si=rEJsAFCN7usZPMP3"
    },
    {
      id: "v12",
      title: "The fall and rise of a gambling addict",
      hashtag: "#gamblingaddiction" ,
      image: "https://i.pinimg.com/1200x/a2/a2/89/a2a289fd71a2e6d11cce8a750d023f3e.jpg",
      type: "videos",
      //
      videoThumbnail: "https://images.unsplash.com/photo-1608657354857-7da58e290436?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpdGF0aW9uJTIwdmlkZW8lMjB0dXRvcmlhbHxlbnwxfHx8fDE3NTgwMTEwODd8MA&ixlib=rb-4.1.0&q=80&w=1080",
      description: " Justyn Rees Larcombe shares how a free £5 bet spiraled into a devastating gambling addiction that cost him his career, family, and home. Now in recovery, he campaigns for education and legal reform, offering hope and guidance to others battling hidden addictions.",
      videoUrl: "https://youtu.be/7AN3VLLlkdI?si=-_EYx1xgqMpyXEI8"
    },
    // Books
    {
      id: "b1",
      title: "The Anxiety Toolkit",
      hashtag: "#anxiety",
      image: "https://images.unsplash.com/photo-1650850048713-5460c8f143ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbnhpZXR5JTIwaGVscCUyMGJvb2t8ZW58MXx8fHwxNzU4MDExMDk5fDA&ixlib=rb-4.1.0&q=80&w=1080",
      type: "books",
      author: "Dr. Alice Boyes",
      summary: "A practical guide to managing anxiety with evidence-based strategies. This book offers simple, effective techniques to help you understand and overcome anxiety in daily life. From cognitive behavioral therapy approaches to mindfulness practices, discover tools that can help you build resilience and find peace.",
      bookUrl: "https://www.amazon.com/Anxiety-Toolkit-Strategies-Overcoming-Anxiety/dp/0399169253"
    },
    {
      id: "b2",
      title: "Mindful Living",
      hashtag: "#mindfulness",
      image: "https://images.unsplash.com/photo-1588912914017-923900a34710?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5kZnVsbmVzcyUyMGJvb2slMjBvcGVufGVufDF8fHx8MTc1ODAxMTEwN3ww&ixlib=rb-4.1.0&q=80&w=1080",
      type: "books",
      author: "Sarah Johnson",
      summary: "Transform your daily experience through mindfulness practices. This comprehensive guide shows you how to incorporate mindfulness into every aspect of your life, from work to relationships. Learn to be present, reduce stress, and find joy in simple moments.",
      bookUrl: "https://www.amazon.com/Wherever-You-Go-There-Are/dp/0316437239"
    },
    {
      id: "b3",
      title: "Mental Health Matters",
      hashtag: "#wellness",
      image: "https://images.unsplash.com/photo-1608655298388-6854f762b023?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW50YWwlMjBoZWFsdGglMjBib29rfGVufDF8fHx8MTc1ODAxMTA5MXww&ixlib=rb-4.1.0&q=80&w=1080",
      type: "books",
      author: "Dr. Michael Chen",
      summary: "A comprehensive approach to mental wellness for young adults. Covering topics from depression and anxiety to building healthy relationships and self-esteem. Filled with practical exercises and real-world applications.",
      bookUrl: "https://www.amazon.com/Feeling-Good-New-Mood-Therapy/dp/0380810336"
    },
    {
      id: "b4",
      title: "Emotional Intelligence",
      hashtag: "#emotions",
      image: "https://images.unsplash.com/photo-1588912914017-923900a34710?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5kZnVsbmVzcyUyMGJvb2slMjBvcGVufGVufDF8fHx8MTc1ODAxMTEwN3ww&ixlib=rb-4.1.0&q=80&w=1080",
      type: "books",
      author: "Dr. Lisa Williams",
      summary: "Master your emotions and improve your relationships. Learn to recognize, understand, and manage your emotions effectively while building stronger connections with others.",
      bookUrl: "https://www.amazon.com/Emotional-Intelligence-Why-Matters-More/dp/055338371X"
    },

    // Success Stories
    {
      id: "s1",
      title: "From Anxiety to Peace",
      hashtag: "#recovery",
      image: "https://images.unsplash.com/photo-1569162155800-21fddb5e596c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdWNjZXNzJTIwc3RvcnklMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTgwMTEwOTV8MA&ixlib=rb-4.1.0&q=80&w=1080",
      type: "success stories",
      personName: "Emma, 22",
      story: "Two years ago, I was struggling with severe anxiety that made it difficult to leave my house or maintain friendships. I felt trapped and hopeless, unsure if things would ever get better.\n\nMy journey to recovery began when I discovered meditation through a mental health app. At first, I could only sit still for 30 seconds before my mind would race with worry. But I kept practicing, even when it felt impossible.\n\nSlowly, I began to notice small changes. I could breathe more deeply. I started sleeping better. Most importantly, I learned that my anxious thoughts weren't facts – they were just thoughts that would pass.\n\nI also found therapy incredibly helpful. My therapist taught me cognitive behavioral techniques that helped me challenge negative thought patterns. We worked together to develop coping strategies for difficult situations.\n\nBuilding a support network was crucial too. I joined a support group for young adults with anxiety, and for the first time, I felt understood. Hearing others share similar experiences made me feel less alone.\n\nToday, I still experience anxiety sometimes, but I have tools to manage it. I practice meditation daily, exercise regularly, and I'm not afraid to ask for help when I need it. I'm now studying psychology in college and hope to help others on their mental health journey.\n\nTo anyone struggling with anxiety: please know that recovery is possible. It takes time, patience, and the right support, but you can find peace again. You're stronger than you know."
    },
    {
      id: "s2",
      title: "Breaking Free from Depression",
      hashtag: "#hope",
      image: "https://images.unsplash.com/photo-1713145869505-18f4434f127c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHBlcnNvbiUyMHNtaWxpbmclMjByZWNvdmVyeXxlbnwxfHx8fDE3NTgwMTExMTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
      type: "success stories",
      personName: "Alex, 19",
      story: "At 17, I hit rock bottom. Depression had taken over my life completely. I couldn't get out of bed, I was failing school, and I had pushed away all my friends. I felt like a burden to everyone around me.\n\nThe turning point came when my younger sister told me she was worried about me. Seeing the fear in her eyes made me realize I needed to get help, not just for myself, but for the people who loved me.\n\nStarting therapy was scary. I had convinced myself that nothing could help, that I was broken beyond repair. But my therapist was patient and understanding. She helped me see that depression was an illness, not a character flaw.\n\nMedication also played a role in my recovery. I was hesitant at first, worried about side effects and stigma. But working with a psychiatrist, we found the right combination that helped lift the fog that had been clouding my mind.\n\nRecovery wasn't linear. I had good days and bad days, setbacks and breakthroughs. Learning to be patient with myself was one of the hardest but most important lessons.\n\nGradually, I started doing small things that brought me joy again. I picked up my guitar, started going for walks, and slowly reconnected with friends. Each small step forward gave me hope for bigger ones.\n\nNow, two years later, I'm in my first year of college studying music therapy. I want to use my experience to help other young people who are struggling. Depression taught me empathy and resilience I never knew I had.\n\nIf you're in a dark place right now, please hold on. Reach out for help. Talk to someone you trust. You matter more than you know, and there is hope for brighter days ahead."
    },
    {
      id: "s3",
      title: "Overcoming Social Anxiety",
      hashtag: "#courage",
      image: "https://images.unsplash.com/photo-1569162155800-21fddb5e596c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdWNjZXNzJTIwc3RvcnklMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTgwMTEwOTV8MA&ixlib=rb-4.1.0&q=80&w=1080",
      type: "success stories",
      personName: "Jordan, 20",
      story: "Social anxiety controlled my life for years. I avoided parties, presentations, and even casual conversations. The fear of being judged or embarrassed was paralyzing.\n\nI spent lunch breaks hiding in the library, declined invitations, and watched life pass me by from the sidelines. I was lonely but too scared to reach out and connect with others.\n\nEverything changed when I was forced to give a presentation in my communications class. I was terrified, but something amazing happened – I survived. Not only that, but people actually seemed engaged with what I was saying.\n\nThat small victory gave me the courage to take bigger steps. I started with exposure therapy, gradually putting myself in social situations that scared me. Each time, I proved to myself that my fears were often worse than reality.\n\nI joined the drama club, which seemed counterintuitive for someone with social anxiety. But being on stage actually helped me practice being seen and heard in a structured environment. The other club members became some of my closest friends.\n\nI also learned about the spotlight effect – the tendency to overestimate how much others notice our mistakes. Realizing that people are usually too focused on themselves to judge me harshly was liberating.\n\nBuilding social skills took practice, just like any other skill. I learned to ask questions, listen actively, and share appropriate personal stories. What once felt impossible became natural.\n\nToday, I'm studying to become a teacher – a career I never thought possible given my social anxiety. I still get nervous sometimes, but I've learned that courage isn't the absence of fear; it's action in spite of fear.\n\nTo anyone struggling with social anxiety: start small, be patient with yourself, and remember that meaningful connections are worth the discomfort of stepping outside your comfort zone."
    },
    {
      id: "s4",
      title: "Finding My Voice",
      hashtag: "#selfworth",
      image: "https://images.unsplash.com/photo-1713145869505-18f4434f127c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHBlcnNvbiUyMHNtaWxpbmclMjByZWNvdmVyeXxlbnwxfHx8fDE3NTgwMTExMTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
      type: "success stories",
      personName: "Sam, 21",
      story: "Growing up, I never felt good enough. I was a perfectionist who was terrified of making mistakes or disappointing others. This led to chronic stress, burnout, and a complete loss of my sense of self.\n\nI said yes to everything, even when I was overwhelmed. I chose my college major based on what my parents wanted, not what I was passionate about. I was living someone else's life and felt completely lost.\n\nThe wake-up call came during my sophomore year when I had a panic attack during finals week. I realized I couldn't keep living this way – constantly anxious, never satisfied, always seeking validation from others.\n\nTherapy helped me understand that my worth wasn't tied to my achievements or other people's approval. I learned about boundaries, self-compassion, and the importance of authenticity.\n\nSlowly, I started making choices based on my own values and interests. I changed my major to environmental science, something I was genuinely passionate about. I learned to say no to commitments that didn't align with my priorities.\n\nPracticing self-compassion was revolutionary. Instead of beating myself up for mistakes, I learned to treat myself with the same kindness I'd show a good friend. This reduced my anxiety significantly and allowed me to take healthy risks.\n\nI also discovered the power of creative expression. Writing in a journal, painting, and playing music became outlets for emotions I had been suppressing. These activities helped me reconnect with my authentic self.\n\nBuilding genuine friendships was another crucial part of my journey. I attracted people who appreciated me for who I truly was, not who I thought I should be.\n\nNow, I'm confident in my decisions and comfortable with imperfection. I'm pursuing a career in environmental conservation and feel excited about my future for the first time in years.\n\nRemember: you are enough, exactly as you are. Your voice matters, your feelings are valid, and you deserve to live authentically. It's never too late to start honoring your true self."
    }
  ];

  const filteredContent = contentData.filter(item => {
    const matchesCategory = selectedCategory === "all" || item.type === selectedCategory;
    const matchesSearch = searchQuery === "" || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.hashtag.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleItemClick = (item: ContentItem) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const renderModal = () => {
    if (!selectedItem) return null;

    if (selectedItem.type === "videos") {
      return (
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Play className="w-5 h-5" style={{ color: selectedColor }} />
              <span>{selectedItem.title}</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Video Thumbnail - Reduced Size */}
            <div className="relative w-full h-48 overflow-hidden rounded-lg">
              <ImageWithFallback
                src={selectedItem.videoThumbnail!}
                alt={selectedItem.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white cursor-pointer hover:scale-110 transition-transform"
                  style={{ backgroundColor: selectedColor }}
                >
                  <Play className="w-6 h-6 ml-1" />
                </div>
              </div>
            </div>
            
            {/* Description */}
            <p className="text-gray-600 leading-relaxed">
              {selectedItem.description}
            </p>
            
            {/* Watch Button */}
            <Button
              className="w-full text-white"
              style={{ backgroundColor: selectedColor }}
              onClick={() => window.open(selectedItem.videoUrl, '_blank')}
            >
              <Play className="w-4 h-4 mr-2" />
              Watch Video
            </Button>
          </div>
        </DialogContent>
      );
    }

    if (selectedItem.type === "books") {
      return (
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5" style={{ color: selectedColor }} />
              <span>{selectedItem.title}</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex space-x-4">
              <div className="w-32 h-48 flex-shrink-0 overflow-hidden rounded-lg">
                <ImageWithFallback
                  src={selectedItem.image}
                  alt={selectedItem.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Author</p>
                  <p>{selectedItem.author}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Summary</p>
                  <p className="text-sm leading-relaxed">{selectedItem.summary}</p>
                </div>
              </div>
            </div>
            
            {/* Read Button */}
            <Button
              className="w-full text-white"
              style={{ backgroundColor: selectedColor }}
              onClick={() => window.open(selectedItem.bookUrl, '_blank')}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Read Entire Book
            </Button>
          </div>
        </DialogContent>
      );
    }

    if (selectedItem.type === "success stories") {
      return (
        <DialogContent className="sm:max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <ExternalLink className="w-5 h-5" style={{ color: selectedColor }} />
              <span>{selectedItem.title}</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 overflow-hidden rounded-full">
                <ImageWithFallback
                  src={selectedItem.image}
                  alt={selectedItem.personName!}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-sm text-gray-600">Shared by</p>
                <p>{selectedItem.personName}</p>
              </div>
            </div>
            
            {/* Scrollable Story */}
            <div 
              className="max-h-96 overflow-y-auto pr-2 space-y-4 rounded-lg p-4"
              style={{
                backgroundColor: selectedColor + '10',
                backdropFilter: 'blur(10px)',
                border: `1px solid ${selectedColor}20`
              }}
            >
              {selectedItem.story!.split('\n\n').map((paragraph, index) => (
                <p key={index} className="leading-relaxed text-sm">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </DialogContent>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <header className="flex items-center justify-between p-3 sm:p-4">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
          <div 
            className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ml-2"
            style={{ backgroundColor: selectedColor }}
          >
            <span className="text-white text-xs sm:text-sm">G</span>
          </div>
          <span className="text-xs sm:text-sm">Guidance</span>
        </div>
        <SharedNavigation onNavigate={onNavigate} currentPage="guidance" />
      </header>

      {/* Main Content */}
      <main className="p-3 sm:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mb-4 sm:mb-6 items-center justify-center">
            {/* Dropdown */}
            <div className="w-full sm:w-48">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger 
                  className="w-full text-sm"
                  style={{ borderColor: selectedColor }}
                >
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="videos">Videos</SelectItem>
                  <SelectItem value="books">Books</SelectItem>
                  <SelectItem value="success stories">Success Stories</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Search */}
            <div className="w-full sm:w-48 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
              <Input
                placeholder="Search by tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 sm:pl-10 text-sm"
                style={{ borderColor: selectedColor }}
              />
            </div>
          </div>

          {/* Content Grid - Responsive: 2 cols mobile, 4 cols tablet, 6 cols desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {filteredContent.map((item) => (
              <div 
                key={item.id}
                onClick={() => handleItemClick(item)}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
              >
                {/* Image */}
                <div className="relative h-24 sm:h-32 overflow-hidden">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="p-2 sm:p-3 space-y-1">
                  <h3 className="text-xs sm:text-sm line-clamp-2 leading-tight">{item.title}</h3>
                  <p 
                    className="text-xs px-2 py-1 rounded-full inline-block"
                    style={{ 
                      backgroundColor: selectedColor + '20',
                      color: selectedColor 
                    }}
                  >
                    {item.hashtag}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* No results message */}
          {filteredContent.length === 0 && (
            <div className="text-center py-16">
              <div 
                className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ backgroundColor: selectedColor + '20' }}
              >
                <Search className="w-8 h-8" style={{ color: selectedColor }} />
              </div>
              <h3 className="text-xl mb-2">No content found</h3>
              <p className="text-gray-600">
                Try adjusting your search or category filter
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        {renderModal()}
      </Dialog>
    </div>
  );
}