import { getReportData } from "@/actions/reports";
import { ReportsDashboard } from "./reports-dashboard";

export default async function ReportsPage() {
    const reportData = await getReportData();

    return (
        <div className="container mx-auto py-6 animate-in fade-in duration-500">
            <div className="flex flex-col gap-1 border-b border-border/50 pb-5 mb-6">
                <h1 className="text-xl font-bold tracking-tight text-foreground">
                    Business Reports
                </h1>
                <p className="text-muted-foreground text-xs">
                    Comprehensive overview of business performance and metrics.
                </p>
            </div>
            
            <ReportsDashboard data={reportData} />
        </div>
    );
}
