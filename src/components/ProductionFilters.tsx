import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Filter, RotateCcw } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ProductionFiltersProps {
  selectedDate: Date | undefined;
  selectedShift: string;
  selectedMachine: string;
  onDateChange: (date: Date | undefined) => void;
  onShiftChange: (shift: string) => void;
  onMachineChange: (machine: string) => void;
  onReset: () => void;
  shifts: string[];
  machines: string[];
}

export const ProductionFilters = ({
  selectedDate,
  selectedShift,
  selectedMachine,
  onDateChange,
  onShiftChange,
  onMachineChange,
  onReset,
  shifts,
  machines,
}: ProductionFiltersProps) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Filter className="h-5 w-5" />
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-card border border-border" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={onDateChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Shift</label>
            <Select value={selectedShift} onValueChange={onShiftChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Shifts" />
              </SelectTrigger>
              <SelectContent className="bg-card border border-border">
                <SelectItem value="all">All Shifts</SelectItem>
                {shifts.map((shift) => (
                  <SelectItem key={shift} value={shift}>
                    Shift {shift}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Machine Code</label>
            <Select value={selectedMachine} onValueChange={onMachineChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Machines" />
              </SelectTrigger>
              <SelectContent className="bg-card border border-border">
                <SelectItem value="all">All Machines</SelectItem>
                {machines.map((machine) => (
                  <SelectItem key={machine} value={machine}>
                    {machine}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={onReset} variant="outline" className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};