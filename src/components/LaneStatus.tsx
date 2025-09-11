import { LaneData } from '@/types/traffic';
import { Card } from '@/components/ui/card';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LaneStatusProps {
  lanes: LaneData[];
}

export function LaneStatus({ lanes }: LaneStatusProps) {
  const getDirectionIcon = (direction: string) => {
    switch (direction) {
      case 'north': return ArrowUp;
      case 'south': return ArrowDown;
      case 'east': return ArrowRight;
      case 'west': return ArrowLeft;
      default: return ArrowUp;
    }
  };

  const getPressureColor = (pressure: number) => {
    if (pressure > 100) return 'text-status-congested';
    if (pressure > 50) return 'text-status-moderate';
    return 'text-status-optimal';
  };

  const getPressureLevel = (pressure: number) => {
    if (pressure > 100) return 'High';
    if (pressure > 50) return 'Medium';
    return 'Low';
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-card to-secondary border-border/50">
      <h3 className="text-lg font-semibold mb-4">Lane Analysis</h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {lanes.map((lane) => {
          const Icon = getDirectionIcon(lane.direction);
          const pressureColor = getPressureColor(lane.pressure);
          
          return (
            <div
              key={lane.direction}
              className="relative p-4 rounded-lg bg-card/50 border border-border/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-muted">
                    <Icon className="w-4 h-4 text-cyber" />
                  </div>
                  <span className="font-medium capitalize">{lane.direction}</span>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Vehicles:</span>
                  <span className="font-medium">{lane.vehicleCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Queue:</span>
                  <span className="font-medium">{lane.queueLength}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Speed:</span>
                  <span className="font-medium">{lane.averageSpeed.toFixed(1)} km/h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pressure:</span>
                  <span className={cn("font-medium", pressureColor)}>
                    {getPressureLevel(lane.pressure)}
                  </span>
                </div>
              </div>

              {/* Pressure indicator bar */}
              <div className="mt-3 h-1 bg-muted rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "h-full transition-all duration-500",
                    lane.pressure > 100 ? "bg-status-congested" :
                    lane.pressure > 50 ? "bg-status-moderate" :
                    "bg-status-optimal"
                  )}
                  style={{ width: `${Math.min(100, (lane.pressure / 150) * 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}