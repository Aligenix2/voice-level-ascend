import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Narrative {
  id: string;
  title: string;
  content: string;
  emotions: string[];
  difficulty: number;
}

const narratives: Narrative[] = [
  {
    id: "1",
    title: "The Victory Speech",
    content: "Ladies and gentlemen, today marks a turning point in our journey! Against all odds, we have achieved what many thought impossible. Our dedication, our passion, and our unwavering belief in ourselves has brought us to this incredible moment. But this is not the end - this is just the beginning of even greater adventures ahead!",
    emotions: ["excitement", "triumph", "determination"],
    difficulty: 2
  },
  {
    id: "2", 
    title: "A Farewell to Remember",
    content: "As I stand here today, my heart is heavy with emotion. We are saying goodbye to someone who has touched all our lives in ways we never imagined. Though tears may fill our eyes, let us also celebrate the beautiful memories we shared. Their legacy will live on in each of us, inspiring us to be better, to love deeper, and to cherish every moment we have.",
    emotions: ["sorrow", "nostalgia", "gratitude"],
    difficulty: 3
  },
  {
    id: "3",
    title: "The Innovation Announcement", 
    content: "Imagine a world where technology serves humanity in ways we've only dreamed of. Today, I'm thrilled to share with you a breakthrough that will revolutionize how we connect, learn, and grow together. This innovation isn't just about progress - it's about creating a future where every individual has the power to unlock their unlimited potential!",
    emotions: ["enthusiasm", "wonder", "confidence"],
    difficulty: 4
  },
  {
    id: "4",
    title: "Overcoming the Storm",
    content: "Life has a way of testing our resolve when we least expect it. I won't lie to you - the road ahead is challenging, filled with obstacles that seem insurmountable. But here's what I know: within each of us lies an strength that fear cannot touch. Together, we will rise above these difficulties, and we will emerge stronger than ever before.",
    emotions: ["concern", "determination", "hope"],
    difficulty: 3
  },
  {
    id: "5",
    title: "The Graduate's Journey",
    content: "From the nervous freshman walking through these halls for the first time, to the confident graduate standing before you today - what a transformation! This journey has been filled with late nights, challenging exams, unforgettable friendships, and moments of pure joy. As you step into the world beyond these walls, remember that learning never stops, and your greatest adventures are yet to come!",
    emotions: ["pride", "nostalgia", "excitement", "wisdom"],
    difficulty: 4
  }
];

interface NarrativeGeneratorProps {
  onNarrativeSelect: (narrative: Narrative) => void;
}

export const NarrativeGenerator = ({ onNarrativeSelect }: NarrativeGeneratorProps) => {
  const [currentNarrative, setCurrentNarrative] = useState<Narrative>(narratives[0]);

  const generateNewNarrative = () => {
    const randomIndex = Math.floor(Math.random() * narratives.length);
    const newNarrative = narratives[randomIndex];
    setCurrentNarrative(newNarrative);
    onNarrativeSelect(newNarrative);
  };

  useEffect(() => {
    generateNewNarrative();
  }, []);

  return (
    <div className="neural-card p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-foreground">Practice Narrative</h2>
        <Button
          onClick={generateNewNarrative}
          variant="outline"
          size="sm"
          className="neural-button text-sm"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          New Narrative
        </Button>
      </div>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium text-primary mb-2">{currentNarrative.title}</h3>
          <div className="flex gap-2 mb-3">
            {currentNarrative.emotions.map((emotion, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm capitalize"
              >
                {emotion}
              </span>
            ))}
          </div>
        </div>
        
        <div className="bg-muted/30 p-4 rounded-lg border border-border/50">
          <p className="text-foreground leading-relaxed text-lg">
            {currentNarrative.content}
          </p>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Difficulty:</span>
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i < currentNarrative.difficulty ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};