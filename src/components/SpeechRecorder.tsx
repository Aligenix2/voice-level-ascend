import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Play, Pause, Square, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";

interface SpeechRecorderProps {
  onRecordingComplete: (audioBlob: Blob, transcript: string, analysis: SpeechAnalysis) => void;
  narrative: string;
}

export interface SpeechAnalysis {
  duration: number;
  fillerWords: string[];
  pauseCount: number;
  averagePause: number;
  wpm: number;
  confidence: number;
  clarity: number;
  tonalVariation: number;
  energy: number;
  level: string;
  levelDescription: string;
}

export const SpeechRecorder = ({ onRecordingComplete, narrative }: SpeechRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>("");
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Speech recognition setup
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }
        
        if (finalTranscript) {
          setTranscript(prev => (prev + finalTranscript).trim());
        } else if (interimTranscript) {
          setTranscript(prev => {
            const words = prev.split(' ');
            // Remove last interim word and add new interim
            const finalWords = words.slice(0, -1).join(' ');
            return finalWords ? finalWords + ' ' + interimTranscript : interimTranscript;
          });
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        toast({
          title: "Speech Recognition Error",
          description: `Error: ${event.error}. Please try again.`,
          variant: "destructive",
        });
      };
    } else {
      toast({
        title: "Speech Recognition Not Supported",
        description: "Your browser doesn't support speech recognition.",
        variant: "destructive",
      });
    }
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        
        // Ensure we have the final transcript before analysis
        setTimeout(() => {
          const finalTranscript = transcript.trim();
          if (finalTranscript) {
            const analysis = analyzeSpeech(finalTranscript, recordingTime);
            onRecordingComplete(blob, finalTranscript, analysis);
          } else {
            toast({
              title: "No Speech Detected",
              description: "Please try recording again and speak clearly.",
              variant: "destructive",
            });
          }
        }, 500); // Small delay to ensure transcript is complete
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      setTranscript("");

      // Start speech recognition
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      toast({
        title: "Recording Started",
        description: "Begin reading the narrative aloud.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);

      // Stop speech recognition
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }

      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      toast({
        title: "Recording Complete",
        description: "Analyzing your speech performance...",
      });
    }
  };

  const playRecording = () => {
    if (audioUrl && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const analyzeSpeech = (transcript: string, duration: number): SpeechAnalysis => {
    const words = transcript.trim().split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;
    const wpm = duration > 0 ? Math.round((wordCount / duration) * 60) : 0;

    // Detect filler words
    const fillerWords = words.filter(word => 
      /^(um|uh|er|ah|like|you know|so|actually|basically)$/i.test(word.toLowerCase())
    );

    // Simple analysis metrics (in a real app, this would be more sophisticated)
    const fillerRatio = wordCount > 0 ? fillerWords.length / wordCount : 0;
    const clarity = Math.max(0, Math.min(100, 100 - (fillerRatio * 200)));
    const confidence = Math.max(0, Math.min(100, wpm > 120 ? 85 + Math.random() * 15 : 60 + Math.random() * 25));
    const tonalVariation = Math.random() * 40 + 60; // Simulated
    const energy = Math.random() * 30 + 70; // Simulated

    // Determine level based on metrics
    const averageScore = (clarity + confidence + tonalVariation + energy) / 4;
    let level = "Core Speaker";
    let levelDescription = "Beginner level with areas for improvement";

    if (averageScore >= 90) {
      level = "Pro Speaker";
      levelDescription = "Expert level with masterful delivery";
    } else if (averageScore >= 80) {
      level = "Bold Speaker";
      levelDescription = "Advanced level with confident delivery";
    } else if (averageScore >= 70) {
      level = "Fluid Speaker";
      levelDescription = "Intermediate level with smooth delivery";
    } else if (averageScore >= 60) {
      level = "Clear Speaker";
      levelDescription = "Basic proficiency with room for growth";
    }

    return {
      duration,
      fillerWords: fillerWords,
      pauseCount: Math.floor(Math.random() * 5) + 2,
      averagePause: Math.random() * 2 + 0.5,
      wpm,
      confidence: Math.round(confidence),
      clarity: Math.round(clarity),
      tonalVariation: Math.round(tonalVariation),
      energy: Math.round(energy),
      level,
      levelDescription
    };
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="neural-card p-6 animate-slide-up">
      <h2 className="text-xl font-semibold mb-4 text-foreground">Speech Recording</h2>
      
      <div className="space-y-6">
        {/* Recording Controls */}
        <div className="flex items-center justify-center gap-4">
          {!isRecording ? (
            <Button
              onClick={startRecording}
              className="neural-button text-lg px-8 py-4"
              size="lg"
            >
              <Mic className="w-6 h-6 mr-2" />
              Start Recording
            </Button>
          ) : (
            <Button
              onClick={stopRecording}
              variant="destructive"
              className="text-lg px-8 py-4"
              size="lg"
            >
              <Square className="w-6 h-6 mr-2" />
              Stop Recording
            </Button>
          )}

          {audioUrl && (
            <Button
              onClick={playRecording}
              variant="outline"
              className="px-6 py-4"
              size="lg"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 mr-2" />
              ) : (
                <Play className="w-5 h-5 mr-2" />
              )}
              Playback
            </Button>
          )}
        </div>


        {/* Live Sound Wave Animation */}
        {isRecording && (
          <div className="text-center">
            <div className="text-2xl font-mono text-primary neural-animate mb-2">
              {formatTime(recordingTime)}
            </div>
            <div className="flex items-center justify-center gap-1 mb-2">
              <div className="w-1 bg-primary rounded-full animate-pulse" style={{height: '20px', animationDelay: '0ms', animationDuration: '600ms'}}></div>
              <div className="w-1 bg-primary rounded-full animate-pulse" style={{height: '30px', animationDelay: '100ms', animationDuration: '600ms'}}></div>
              <div className="w-1 bg-primary rounded-full animate-pulse" style={{height: '25px', animationDelay: '200ms', animationDuration: '600ms'}}></div>
              <div className="w-1 bg-primary rounded-full animate-pulse" style={{height: '35px', animationDelay: '300ms', animationDuration: '600ms'}}></div>
              <div className="w-1 bg-primary rounded-full animate-pulse" style={{height: '20px', animationDelay: '400ms', animationDuration: '600ms'}}></div>
              <div className="w-1 bg-primary rounded-full animate-pulse" style={{height: '28px', animationDelay: '500ms', animationDuration: '600ms'}}></div>
              <div className="w-1 bg-primary rounded-full animate-pulse" style={{height: '32px', animationDelay: '600ms', animationDuration: '600ms'}}></div>
              <div className="w-1 bg-primary rounded-full animate-pulse" style={{height: '24px', animationDelay: '700ms', animationDuration: '600ms'}}></div>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2"></div>
              <span className="text-sm text-muted-foreground">Recording...</span>
            </div>
          </div>
        )}

        {/* Audio Element */}
        {audioUrl && (
          <audio
            ref={audioRef}
            src={audioUrl}
            onEnded={() => setIsPlaying(false)}
            className="hidden"
          />
        )}
      </div>
    </div>
  );
};