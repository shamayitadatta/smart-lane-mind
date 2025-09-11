import { useEffect, useRef } from 'react';
import { Vehicle, TrafficSignal } from '@/types/traffic';
import { cn } from '@/lib/utils';

interface TrafficIntersectionProps {
  vehicles: Vehicle[];
  signals: TrafficSignal;
  congestionLevel: 'low' | 'medium' | 'high';
}

export function TrafficIntersection({ vehicles, signals, congestionLevel }: TrafficIntersectionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Clear canvas
    ctx.fillStyle = '#0a0f1b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const roadWidth = 60;
    const intersectionSize = 100;

    // Draw roads with gradient
    const roadGradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    roadGradient.addColorStop(0, '#1a2332');
    roadGradient.addColorStop(0.5, '#1f2937');
    roadGradient.addColorStop(1, '#1a2332');
    
    ctx.fillStyle = roadGradient;
    // Horizontal road
    ctx.fillRect(0, centerY - roadWidth, canvas.width, roadWidth * 2);
    // Vertical road
    ctx.fillRect(centerX - roadWidth, 0, roadWidth * 2, canvas.height);

    // Draw intersection
    ctx.fillStyle = '#2a3441';
    ctx.fillRect(
      centerX - intersectionSize / 2,
      centerY - intersectionSize / 2,
      intersectionSize,
      intersectionSize
    );

    // Draw lane markings
    ctx.strokeStyle = '#4a5568';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 10]);
    
    // Horizontal lane marking
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(centerX - intersectionSize / 2, centerY);
    ctx.moveTo(centerX + intersectionSize / 2, centerY);
    ctx.lineTo(canvas.width, centerY);
    ctx.stroke();
    
    // Vertical lane marking
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, centerY - intersectionSize / 2);
    ctx.moveTo(centerX, centerY + intersectionSize / 2);
    ctx.lineTo(centerX, canvas.height);
    ctx.stroke();
    
    ctx.setLineDash([]);

    // Draw traffic lights
    const drawTrafficLight = (x: number, y: number, signal: 'red' | 'yellow' | 'green', rotation: number = 0) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);

      // Light housing
      ctx.fillStyle = '#1f2937';
      ctx.fillRect(-15, -35, 30, 70);

      // Lights
      const lights = [
        { color: 'red', y: -20, active: signal === 'red' },
        { color: 'yellow', y: 0, active: signal === 'yellow' },
        { color: 'green', y: 20, active: signal === 'green' }
      ];

      lights.forEach(light => {
        if (light.active) {
          // Glow effect
          const gradient = ctx.createRadialGradient(0, light.y, 0, 0, light.y, 15);
          if (light.color === 'red') {
            gradient.addColorStop(0, 'hsl(0, 84%, 60%)');
            gradient.addColorStop(1, 'hsl(0, 84%, 40%)');
          } else if (light.color === 'yellow') {
            gradient.addColorStop(0, 'hsl(48, 95%, 53%)');
            gradient.addColorStop(1, 'hsl(48, 85%, 40%)');
          } else {
            gradient.addColorStop(0, 'hsl(142, 70%, 45%)');
            gradient.addColorStop(1, 'hsl(142, 60%, 35%)');
          }
          ctx.fillStyle = gradient;
          
          // Add shadow glow
          ctx.shadowColor = light.color === 'red' ? 'hsl(0, 100%, 65%)' : 
                           light.color === 'yellow' ? 'hsl(48, 100%, 60%)' : 
                           'hsl(142, 100%, 50%)';
          ctx.shadowBlur = 20;
        } else {
          ctx.fillStyle = '#374151';
          ctx.shadowBlur = 0;
        }
        
        ctx.beginPath();
        ctx.arc(0, light.y, 8, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore();
    };

    // Draw traffic lights at each corner
    drawTrafficLight(centerX - intersectionSize / 2 - 30, centerY - intersectionSize / 2 - 30, signals.north);
    drawTrafficLight(centerX + intersectionSize / 2 + 30, centerY + intersectionSize / 2 + 30, signals.south, Math.PI);
    drawTrafficLight(centerX - intersectionSize / 2 - 30, centerY + intersectionSize / 2 + 30, signals.west, -Math.PI / 2);
    drawTrafficLight(centerX + intersectionSize / 2 + 30, centerY - intersectionSize / 2 - 30, signals.east, Math.PI / 2);

    // Draw vehicles
    vehicles.forEach(vehicle => {
      const lanePositions = [
        { x: centerX - 30, y: canvas.height - (vehicle.position / 100) * canvas.height }, // North
        { x: centerX + 30, y: (vehicle.position / 100) * canvas.height }, // South
        { x: canvas.width - (vehicle.position / 100) * canvas.width, y: centerY - 30 }, // East
        { x: (vehicle.position / 100) * canvas.width, y: centerY + 30 } // West
      ];

      const pos = lanePositions[vehicle.lane];
      
      // Vehicle glow based on speed
      const speedRatio = vehicle.speed / 30;
      ctx.shadowColor = speedRatio > 0.5 ? 'hsl(185, 100%, 50%)' : 'hsl(0, 84%, 60%)';
      ctx.shadowBlur = 10;
      
      // Vehicle body
      const gradient = ctx.createLinearGradient(pos.x - 10, pos.y - 5, pos.x + 10, pos.y + 5);
      gradient.addColorStop(0, speedRatio > 0.5 ? '#00d4ff' : '#ff6b6b');
      gradient.addColorStop(1, speedRatio > 0.5 ? '#0099cc' : '#cc4444');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(pos.x - 10, pos.y - 5, 20, 10);
      
      // Vehicle windows
      ctx.fillStyle = '#1f2937';
      ctx.fillRect(pos.x - 6, pos.y - 3, 12, 6);
      
      ctx.shadowBlur = 0;
    });

    // Draw congestion overlay
    if (congestionLevel !== 'low') {
      const overlayGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 200);
      if (congestionLevel === 'high') {
        overlayGradient.addColorStop(0, 'hsla(0, 84%, 60%, 0.3)');
        overlayGradient.addColorStop(1, 'transparent');
      } else {
        overlayGradient.addColorStop(0, 'hsla(48, 95%, 53%, 0.2)');
        overlayGradient.addColorStop(1, 'transparent');
      }
      ctx.fillStyle = overlayGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

  }, [vehicles, signals, congestionLevel]);

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden bg-gradient-to-br from-background to-card">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ imageRendering: 'crisp-edges' }}
      />
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <div className={cn(
          "w-3 h-3 rounded-full animate-pulse",
          congestionLevel === 'low' && "bg-traffic-green shadow-glow-green",
          congestionLevel === 'medium' && "bg-traffic-yellow shadow-glow-yellow",
          congestionLevel === 'high' && "bg-traffic-red shadow-glow-red"
        )} />
        <span className="text-sm font-medium text-muted-foreground">
          {congestionLevel === 'low' && 'Optimal Flow'}
          {congestionLevel === 'medium' && 'Moderate Traffic'}
          {congestionLevel === 'high' && 'Heavy Congestion'}
        </span>
      </div>
    </div>
  );
}