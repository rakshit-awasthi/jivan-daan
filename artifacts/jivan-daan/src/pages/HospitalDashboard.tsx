import { useGetBloodRequests } from "@workspace/api-client-react";
import { formatDistanceToNow } from "date-fns";
import { Activity, MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HospitalDashboard() {
  const { data: requests, isLoading } = useGetBloodRequests();

  return (
    <div className="min-h-screen pt-24 pb-12 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Hospital Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage emergency requests and donors</p>
          </div>
          <Button className="shadow-md shadow-primary/20">Create Request</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Activity className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Requests</p>
              <p className="text-2xl font-bold">{requests?.filter(r => r.status === 'active').length || 0}</p>
            </div>
          </div>
          <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
              <Search className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Fulfilled</p>
              <p className="text-2xl font-bold">{requests?.filter(r => r.status === 'fulfilled').length || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border/50 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-muted/30">
            <h2 className="font-semibold text-lg">All Blood Requests</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/20">
                <tr>
                  <th className="px-6 py-3">Patient & Details</th>
                  <th className="px-6 py-3">Blood Group</th>
                  <th className="px-6 py-3">Urgency</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={6} className="text-center py-8">Loading requests...</td></tr>
                ) : requests?.map((req) => (
                  <tr key={req.id} className="border-b border-border hover:bg-muted/30">
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{req.patientName}</div>
                      <div className="text-muted-foreground text-xs flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" /> {req.location}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded bg-primary/10 text-primary font-bold">
                        {req.bloodGroup}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        req.urgency === 'critical' ? 'bg-destructive/10 text-destructive' :
                        req.urgency === 'urgent' ? 'bg-amber-500/10 text-amber-600' :
                        'bg-blue-500/10 text-blue-600'
                      }`}>
                        {req.urgency.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        req.status === 'active' ? 'bg-green-500/10 text-green-600' : 'bg-muted text-muted-foreground'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {formatDistanceToNow(new Date(req.createdAt))} ago
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm">Manage</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
