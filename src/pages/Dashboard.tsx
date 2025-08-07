import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { MetricsCard } from "@/components/MetricsCard";
import { ProductionFilters } from "@/components/ProductionFilters";
import { ProductionTable } from "@/components/ProductionTable";
import { RefreshCw, Database, Clock, AlertTriangle, Activity } from "lucide-react";
import productionData from "@/data/productionData.json";

interface ProductionRecord {
  unitCode: string;
  date: string;
  shift: string;
  machineCode: string;
  totalDowntime: number;
}

export const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedShift, setSelectedShift] = useState<string>("all");
  const [selectedMachine, setSelectedMachine] = useState<string>("all");
  const [lastUpdated, setLastUpdated] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLastUpdated(now.toLocaleTimeString());
    };
    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const filteredRecords = useMemo(() => {
    return productionData.records.filter((record: ProductionRecord) => {
      const matchesDate = !selectedDate || record.date === selectedDate.toISOString().split('T')[0];
      const matchesShift = selectedShift === "all" || record.shift === selectedShift;
      const matchesMachine = selectedMachine === "all" || record.machineCode === selectedMachine;
      
      return matchesDate && matchesShift && matchesMachine;
    });
  }, [selectedDate, selectedShift, selectedMachine]);

  const metrics = useMemo(() => {
    const totalRecords = filteredRecords.length;
    const avgDowntime = totalRecords > 0 
      ? Math.round(filteredRecords.reduce((sum, record) => sum + record.totalDowntime, 0) / totalRecords)
      : 0;
    const highDowntime = filteredRecords.filter(record => record.totalDowntime > 30).length;
    const activeMachines = new Set(filteredRecords.map(record => record.machineCode)).size;

    return { totalRecords, avgDowntime, highDowntime, activeMachines };
  }, [filteredRecords]);

  const handleReset = () => {
    setSelectedDate(undefined);
    setSelectedShift("all");
    setSelectedMachine("all");
  };

  const handleRefresh = () => {
    // In a real app, this would fetch new data from the backend
    setLastUpdated(new Date().toLocaleTimeString());
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Production Data Dashboard</h1>
            <p className="text-muted-foreground">Monitor machine downtime and production efficiency</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Last updated: {lastUpdated}
            </span>
            <Button onClick={handleRefresh} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricsCard
            title="Total Records"
            value={metrics.totalRecords}
            subtitle="Production entries"
            icon={Database}
          />
          <MetricsCard
            title="Avg Downtime"
            value={`${metrics.avgDowntime} min`}
            subtitle="Per machine entry"
            icon={Clock}
          />
          <MetricsCard
            title="High Downtime"
            value={metrics.highDowntime}
            subtitle="Entries > 30 min"
            icon={AlertTriangle}
            variant="warning"
          />
          <MetricsCard
            title="Active Machines"
            value={metrics.activeMachines}
            subtitle="Unique machine codes"
            icon={Activity}
          />
        </div>

        {/* Filters */}
        <ProductionFilters
          selectedDate={selectedDate}
          selectedShift={selectedShift}
          selectedMachine={selectedMachine}
          onDateChange={setSelectedDate}
          onShiftChange={setSelectedShift}
          onMachineChange={setSelectedMachine}
          onReset={handleReset}
          shifts={productionData.shifts}
          machines={productionData.machines}
        />

        {/* Data Table */}
        <ProductionTable
          records={filteredRecords}
          totalRecords={productionData.records.length}
        />
      </div>
    </div>
  );
};