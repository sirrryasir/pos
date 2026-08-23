import { getReportData } from "@/actions/reports";
import { ReportsDashboard } from "./reports-dashboard";

export default async function ReportsPage() {
  const reportData = await getReportData();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="mb-6 pb-5 border-b border-border/50">
        <h1 className="text-xl font-bold tracking-tight text-foreground">Reports</h1>
      </div>

      <ReportsDashboard data={reportData} />
    </div>
  );
}
