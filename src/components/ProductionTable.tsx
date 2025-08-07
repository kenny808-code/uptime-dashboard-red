import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProductionRecord {
  unitCode: string;
  date: string;
  shift: string;
  machineCode: string;
  totalDowntime: number;
}

interface ProductionTableProps {
  records: ProductionRecord[];
  totalRecords: number;
}

export const ProductionTable = ({ records, totalRecords }: ProductionTableProps) => {
  const getShiftBadgeVariant = (shift: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      A: "default",
      B: "secondary", 
      C: "outline",
      D: "destructive",
      E: "default"
    };
    return variants[shift] || "default";
  };

  const getDowntimeBadge = (downtime: number) => {
    if (downtime > 30) {
      return <Badge variant="destructive">{downtime}</Badge>;
    } else if (downtime > 20) {
      return <Badge className="bg-warning text-warning-foreground">{downtime}</Badge>;
    }
    return <Badge variant="secondary">{downtime}</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Production Data</CardTitle>
          <p className="text-sm text-muted-foreground">
            Showing {records.length} of {totalRecords} records
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Unit Code</TableHead>
                <TableHead className="font-semibold">Date</TableHead>
                <TableHead className="font-semibold">Shift</TableHead>
                <TableHead className="font-semibold">Machine Code</TableHead>
                <TableHead className="text-right font-semibold">Total Downtime (min)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((record, index) => (
                <TableRow key={index} className="hover:bg-muted/30">
                  <TableCell className="font-medium">{record.unitCode}</TableCell>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>
                    <Badge variant={getShiftBadgeVariant(record.shift)}>
                      Shift {record.shift}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono">{record.machineCode}</TableCell>
                  <TableCell className="text-right">
                    {getDowntimeBadge(record.totalDowntime)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};