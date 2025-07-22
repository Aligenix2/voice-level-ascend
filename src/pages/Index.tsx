import { useState } from "react";
import { NeuraLogo } from "@/components/NeuraLogo";
import { NarrativeGenerator } from "@/components/NarrativeGenerator";
import { SpeechRecorder, SpeechAnalysis } from "@/components/SpeechRecorder";
import { SpeechReport } from "@/components/SpeechReport";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Narrative {
  id: string;
  title: string;
  content: string;
  emotions: string[];
  difficulty: number;
}

const Index = () => {
  const [currentNarrative, setCurrentNarrative] = useState<Narrative | null>(null);
  const [speechAnalysis, setSpeechAnalysis] = useState<SpeechAnalysis | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [transcript, setTranscript] = useState<string>("");
  const [activeTab, setActiveTab] = useState("practice");

  const handleNarrativeSelect = (narrative: Narrative) => {
    setCurrentNarrative(narrative);
    setSpeechAnalysis(null);
    setAudioBlob(null);
    setTranscript("");
  };

  const handleRecordingComplete = (audioBlob: Blob, transcript: string, analysis: SpeechAnalysis) => {
    setAudioBlob(audioBlob);
    setTranscript(transcript);
    setSpeechAnalysis(analysis);
    setActiveTab("results");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-dark"></div>
        <div className="absolute inset-0 bg-gradient-accent opacity-30"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <NeuraLogo />
          <p className="text-xl text-muted-foreground mt-4 max-w-2xl mx-auto">
            Develop your speech skills with AI-powered analysis and personalized feedback
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 neural-card h-14">
              <TabsTrigger value="practice" className="text-lg py-3 h-full flex items-center justify-center">
                Practice Session
              </TabsTrigger>
              <TabsTrigger value="results" className="text-lg py-3 h-full flex items-center justify-center" disabled={!speechAnalysis}>
                Analysis Results
              </TabsTrigger>
            </TabsList>

            <TabsContent value="practice" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Narrative Section */}
                <div>
                  <NarrativeGenerator onNarrativeSelect={handleNarrativeSelect} />
                </div>

                {/* Recording Section */}
                <div>
                  {currentNarrative && (
                    <SpeechRecorder 
                      onRecordingComplete={handleRecordingComplete}
                      narrative={currentNarrative.content}
                    />
                  )}
                </div>
              </div>

              {/* Instructions */}
              <div className="neural-card p-6 text-center">
                <h3 className="text-lg font-semibold mb-3 text-foreground">How NEURA Works</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                  <div className="space-y-2">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-primary font-bold">1</span>
                    </div>
                    <p className="font-medium">Choose Your Narrative</p>
                    <p className="text-muted-foreground">Get a randomly generated story with various emotions to practice</p>
                  </div>
                  <div className="space-y-2">
                    <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-accent font-bold">2</span>
                    </div>
                    <p className="font-medium">Record Your Speech</p>
                    <p className="text-muted-foreground">Read the narrative aloud while NEURA analyzes your delivery</p>
                  </div>
                  <div className="space-y-2">
                    <div className="w-12 h-12 bg-primary-glow/20 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-primary-glow font-bold">3</span>
                    </div>
                    <p className="font-medium">Get AI Feedback</p>
                    <p className="text-muted-foreground">Receive detailed analysis and personalized improvement recommendations</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="results">
              {speechAnalysis && transcript && (
                <SpeechReport analysis={speechAnalysis} transcript={transcript} />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Index;
