import { Vehicle, TrafficSignal, TrafficMetrics, LaneData, AlgorithmType } from '@/types/traffic';

export class TrafficSimulation {
  private vehicles: Map<string, Vehicle> = new Map();
  private signals: TrafficSignal = {
    north: 'red',
    south: 'red',
    east: 'green',
    west: 'green'
  };
  private metrics: TrafficMetrics = {
    averageWaitTime: 0,
    queueLength: 0,
    throughput: 0,
    stopCount: 0,
    congestionLevel: 'low'
  };
  private algorithm: AlgorithmType = 'fixed';
  private cycleTime = 0;
  private lastUpdate = Date.now();

  constructor() {
    this.initializeVehicles();
  }

  private initializeVehicles() {
    // Initialize with some random vehicles
    for (let i = 0; i < 20; i++) {
      const id = `vehicle-${i}`;
      const lane = Math.floor(Math.random() * 4);
      const vehicle: Vehicle = {
        id,
        lane,
        position: Math.random() * 100,
        speed: Math.random() * 30 + 10,
        waitTime: 0
      };
      this.vehicles.set(id, vehicle);
    }
  }

  public update(): void {
    const now = Date.now();
    const deltaTime = (now - this.lastUpdate) / 1000;
    this.lastUpdate = now;
    
    this.cycleTime += deltaTime;
    
    // Update vehicles
    this.vehicles.forEach(vehicle => {
      const signal = this.getSignalForLane(vehicle.lane);
      
      if (signal === 'green') {
        vehicle.position += vehicle.speed * deltaTime;
        vehicle.waitTime = Math.max(0, vehicle.waitTime - deltaTime);
        
        // Reset vehicle if it passes through
        if (vehicle.position > 100) {
          vehicle.position = 0;
          this.metrics.throughput++;
        }
      } else {
        vehicle.waitTime += deltaTime;
        vehicle.speed = Math.max(0, vehicle.speed - 5 * deltaTime);
        
        if (vehicle.speed === 0) {
          this.metrics.stopCount++;
        }
      }
    });
    
    // Update signals based on algorithm
    this.updateSignals();
    
    // Calculate metrics
    this.calculateMetrics();
    
    // Randomly add new vehicles
    if (Math.random() < 0.1) {
      this.addRandomVehicle();
    }
  }

  private getSignalForLane(lane: number): 'red' | 'yellow' | 'green' {
    const directions = ['north', 'south', 'east', 'west'] as const;
    return this.signals[directions[lane]];
  }

  private updateSignals() {
    switch (this.algorithm) {
      case 'fixed':
        this.updateFixedTimeSignals();
        break;
      case 'max-pressure':
        this.updateMaxPressureSignals();
        break;
      case 'ai-optimized':
        this.updateAIOptimizedSignals();
        break;
    }
  }

  private updateFixedTimeSignals() {
    const cycleLength = 30; // 30 seconds per phase
    const phase = Math.floor(this.cycleTime / cycleLength) % 2;
    
    if (phase === 0) {
      this.signals = {
        north: 'green',
        south: 'green',
        east: 'red',
        west: 'red'
      };
    } else {
      this.signals = {
        north: 'red',
        south: 'red',
        east: 'green',
        west: 'green'
      };
    }
  }

  private updateMaxPressureSignals() {
    const lanes = this.getLaneData();
    const nsPressure = lanes.filter(l => l.direction === 'north' || l.direction === 'south')
      .reduce((sum, l) => sum + l.pressure, 0);
    const ewPressure = lanes.filter(l => l.direction === 'east' || l.direction === 'west')
      .reduce((sum, l) => sum + l.pressure, 0);
    
    if (nsPressure > ewPressure) {
      this.signals = {
        north: 'green',
        south: 'green',
        east: 'red',
        west: 'red'
      };
    } else {
      this.signals = {
        north: 'red',
        south: 'red',
        east: 'green',
        west: 'green'
      };
    }
  }

  private updateAIOptimizedSignals() {
    // Simulated AI optimization using weighted factors
    const lanes = this.getLaneData();
    const timeWeight = 0.4;
    const queueWeight = 0.3;
    const throughputWeight = 0.3;
    
    // Calculate scores for each phase
    const nsScore = lanes.filter(l => l.direction === 'north' || l.direction === 'south')
      .reduce((sum, l) => sum + (l.queueLength * queueWeight + l.pressure * timeWeight), 0);
    const ewScore = lanes.filter(l => l.direction === 'east' || l.direction === 'west')
      .reduce((sum, l) => sum + (l.queueLength * queueWeight + l.pressure * timeWeight), 0);
    
    // Add prediction factor (simulated)
    const predictionFactor = Math.sin(Date.now() / 10000) * 0.2;
    
    if (nsScore + predictionFactor > ewScore) {
      this.signals = {
        north: 'green',
        south: 'green',
        east: 'red',
        west: 'red'
      };
    } else {
      this.signals = {
        north: 'red',
        south: 'red',
        east: 'green',
        west: 'green'
      };
    }
  }

  private calculateMetrics() {
    let totalWaitTime = 0;
    let totalQueue = 0;
    
    this.vehicles.forEach(vehicle => {
      totalWaitTime += vehicle.waitTime;
      if (vehicle.speed < 5) {
        totalQueue++;
      }
    });
    
    this.metrics.averageWaitTime = totalWaitTime / this.vehicles.size;
    this.metrics.queueLength = totalQueue;
    
    // Determine congestion level
    if (this.metrics.queueLength > 15) {
      this.metrics.congestionLevel = 'high';
    } else if (this.metrics.queueLength > 8) {
      this.metrics.congestionLevel = 'medium';
    } else {
      this.metrics.congestionLevel = 'low';
    }
  }

  private addRandomVehicle() {
    const id = `vehicle-${Date.now()}`;
    const lane = Math.floor(Math.random() * 4);
    const vehicle: Vehicle = {
      id,
      lane,
      position: 0,
      speed: Math.random() * 20 + 20,
      waitTime: 0
    };
    this.vehicles.set(id, vehicle);
    
    // Remove old vehicles to maintain performance
    if (this.vehicles.size > 30) {
      const firstKey = this.vehicles.keys().next().value;
      this.vehicles.delete(firstKey);
    }
  }

  public getLaneData(): LaneData[] {
    const directions = ['north', 'south', 'east', 'west'] as const;
    
    return directions.map((direction, index) => {
      const laneVehicles = Array.from(this.vehicles.values())
        .filter(v => v.lane === index);
      
      const queueLength = laneVehicles.filter(v => v.speed < 5).length;
      const averageSpeed = laneVehicles.reduce((sum, v) => sum + v.speed, 0) / (laneVehicles.length || 1);
      const pressure = laneVehicles.reduce((sum, v) => sum + v.waitTime, 0);
      
      return {
        direction,
        vehicleCount: laneVehicles.length,
        queueLength,
        averageSpeed,
        pressure
      };
    });
  }

  public getSignals(): TrafficSignal {
    return this.signals;
  }

  public getMetrics(): TrafficMetrics {
    return this.metrics;
  }

  public getVehicles(): Vehicle[] {
    return Array.from(this.vehicles.values());
  }

  public setAlgorithm(algorithm: AlgorithmType) {
    this.algorithm = algorithm;
    this.metrics.throughput = 0;
    this.metrics.stopCount = 0;
  }

  public reset() {
    this.vehicles.clear();
    this.initializeVehicles();
    this.metrics = {
      averageWaitTime: 0,
      queueLength: 0,
      throughput: 0,
      stopCount: 0,
      congestionLevel: 'low'
    };
    this.cycleTime = 0;
  }
}