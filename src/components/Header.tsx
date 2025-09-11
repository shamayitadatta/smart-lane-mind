import { Activity, Brain, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onReset: () => void;
  isRunning: boolean;
  onToggleSimulation: () => void;
}

export function Header({ onReset, isRunning, onToggleSimulation }: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-card to-secondary border-b border-border/50 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyber/20 backdrop-blur-sm">
              <Brain className="w-6 h-6 text-cyber-bright" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyber to-cyber-bright bg-clip-text text-transparent">
                AI Traffic Control System
              </h1>
              <p className="text-sm text-muted-foreground">Real-time Intelligent Signal Optimization</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              onClick={onToggleSimulation}
              variant="outline"
              className="border-cyber/50 hover:bg-cyber/10"
            >
              <Activity className="w-4 h-4 mr-2" />
              {isRunning ? 'Pause' : 'Start'} Simulation
            </Button>
            <Button
              onClick={onReset}
              variant="outline"
              className="border-border hover:bg-muted"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}