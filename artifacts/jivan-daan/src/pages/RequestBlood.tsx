import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useCreateBloodRequest } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function RequestBlood() {
  const { user } = useAuth();
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const createRequestMutation = useCreateBloodRequest();

  const [formData, setFormData] = useState({
    patientName: "",
    bloodGroup: "",
    location: "",
    units: "1",
    contactNumber: user?.contact || "",
    urgency: "normal",
    description: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Auth Required", description: "Please login to create a request.", variant: "destructive" });
      setLocation("/auth");
      return;
    }

    try {
      await createRequestMutation.mutateAsync({
        data: {
          patientName: formData.patientName,
          bloodGroup: formData.bloodGroup,
          location: formData.location,
          units: parseInt(formData.units),
          contactNumber: formData.contactNumber,
          urgency: formData.urgency as any,
          description: formData.description,
          createdBy: user.uid,
          createdByName: user.name
        }
      });
      
      toast({ title: "Request Posted", description: "Your blood request is now active." });
      setLocation("/");
    } catch (error) {
      toast({ title: "Error", description: "Failed to post request.", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-4xl font-display font-bold text-foreground mb-2">Request Blood</h1>
          <p className="text-muted-foreground text-lg">Post an urgent requirement and notify nearby donors.</p>
        </div>

        <div className="bg-card border border-border/50 rounded-3xl shadow-xl p-6 sm:p-10">
          <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl mb-8 text-amber-600 dark:text-amber-400 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p>Please ensure all details are accurate. False requests can lead to account suspension. In case of critical emergencies, also contact your local blood bank directly.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Patient Name</Label>
                <Input 
                  required 
                  value={formData.patientName}
                  onChange={e => setFormData({...formData, patientName: e.target.value})}
                  placeholder="Enter patient's full name" 
                  className="bg-muted/50"
                />
              </div>
              <div className="space-y-2">
                <Label>Blood Group Required</Label>
                <Select value={formData.bloodGroup} onValueChange={v => setFormData({...formData, bloodGroup: v})}>
                  <SelectTrigger className="bg-muted/50 border-input">
                    <SelectValue placeholder="Select Group" />
                  </SelectTrigger>
                  <SelectContent>
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                      <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Hospital / Location</Label>
                <Input 
                  required 
                  value={formData.location}
                  onChange={e => setFormData({...formData, location: e.target.value})}
                  placeholder="Hospital name and city" 
                  className="bg-muted/50"
                />
              </div>
              <div className="space-y-2">
                <Label>Units Required</Label>
                <Input 
                  type="number" 
                  min="1" max="10" 
                  required 
                  value={formData.units}
                  onChange={e => setFormData({...formData, units: e.target.value})}
                  className="bg-muted/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Urgency Level</Label>
                <Select value={formData.urgency} onValueChange={v => setFormData({...formData, urgency: v})}>
                  <SelectTrigger className={`bg-muted/50 border-input ${formData.urgency === 'critical' ? 'text-destructive font-bold' : ''}`}>
                    <SelectValue placeholder="Select Urgency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal (Within few days)</SelectItem>
                    <SelectItem value="urgent">Urgent (Within 24 hours)</SelectItem>
                    <SelectItem value="critical" className="text-destructive font-bold">Critical (Immediate)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Contact Number</Label>
                <Input 
                  required 
                  value={formData.contactNumber}
                  onChange={e => setFormData({...formData, contactNumber: e.target.value})}
                  placeholder="Primary contact for donors" 
                  className="bg-muted/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Additional Details (Optional)</Label>
              <Textarea 
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                placeholder="Any specific instructions for donors..." 
                className="bg-muted/50 resize-none h-24"
              />
            </div>

            <div className="pt-4 border-t border-border">
              <Button type="submit" size="lg" className="w-full text-lg h-14 rounded-xl shadow-lg shadow-primary/20" disabled={createRequestMutation.isPending}>
                {createRequestMutation.isPending ? "Posting Request..." : "Post Blood Request"} <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
