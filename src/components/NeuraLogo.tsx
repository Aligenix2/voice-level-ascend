import { Brain } from "lucide-react";

export const NeuraLogo = () => {
  return (
    <div className="flex items-center gap-3 justify-center">
      <div className="relative">
        <Brain className="w-10 h-10 text-primary neural-animate" />
        <div className="absolute inset-0 brain-glow rounded-full blur-md opacity-50"></div>
      </div>
      <h1 className="text-4xl font-bold gradient-text tracking-wider">
        NEURA
      </h1>
    </div>
  );
};