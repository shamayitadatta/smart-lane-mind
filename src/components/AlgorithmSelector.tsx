import { AlgorithmType } from '@/types/traffic';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Brain, Grid, Cpu } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AlgorithmSelectorProps {
  selectedAlgorithm: AlgorithmType;
  onAlgorithmChange: (algorithm: AlgorithmType) => void;
}

export function AlgorithmSelector({ selectedAlgorithm, onAlgorithmChange }: AlgorithmSelectorProps) {
  const algorithms = [
    {
      id: 'fixed' as AlgorithmType,
      name: 'Fixed-Time',
      description: 'Traditional fixed cycle timing',
      icon: Grid,
      color: 'from-muted to-secondary'
    },
    {
      id: 'max-pressure' as AlgorithmType,
      name: 'Max-Pressure',
      description: 'Queue-based pressure control',
      icon: Cpu,
      color: 'from-status-moderate/20 to-status-moderate/10'
    },
    {
      id: 'ai-optimized' as AlgorithmType,
      name: 'AI-Optimized',
      description: 'Predictive AI with learning',
      icon: Brain,
      color: 'from-cyber/20 to-cyber/10'
    }
  ];

  return (
    <Card className="p-6 bg-gradient-to-br from-card to-secondary border-border/50">
      <h3 className="text-lg font-semibold mb-4">Control Algorithm</h3>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {algorithms.map((algo) => {
          const Icon = algo.icon;
          const isSelected = selectedAlgorithm === algo.id;
          
          return (
            <button
              key={algo.id}
              onClick={() => onAlgorithmChange(algo.id)}
              className={cn(
                "relative group p-4 rounded-lg transition-all duration-300",
                "border-2 backdrop-blur-sm",
                isSelected ? [
                  "border-cyber bg-gradient-to-br",
                  algo.color,
                  "shadow-neon"
                ] : [
                  "border-border/50 bg-card/50",
                  "hover:border-cyber/50 hover:shadow-lg"
                ]
              )}
            >
              <div className="flex flex-col items-center text-center space-y-2">
                <div className={cn(
                  "p-3 rounded-lg transition-all duration-300",
                  isSelected ? "bg-cyber/20" : "bg-muted"
                )}>
                  <Icon className={cn(
                    "w-6 h-6 transition-colors",
                    isSelected ? "text-cyber-bright" : "text-muted-foreground"
                  )} />
                </div>
                <div>
                  <h4 className={cn(
                    "font-semibold transition-colors",
                    isSelected ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {algo.name}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {algo.description}
                  </p>
                </div>
              </div>
              {isSelected && (
                <div className="absolute -inset-px bg-gradient-to-r from-cyber/50 to-cyber-bright/50 rounded-lg blur opacity-20" />
              )}
            </button>
          );
        })}
      </div>
    </Card>
  );
}