import { useAuth } from "@/lib/auth";
import { Link } from "wouter";
import { useUpdateUser } from "@workspace/api-client-react";
import { Heart, CheckCircle2, Shield, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function Donate() {
  const { user } = useAuth();
  const { toast } = useToast();
  const updateUserMutation = useUpdateUser();

  const handleToggleAvailability = async (checked: boolean) => {
    if (!user) return;
    try {
      await updateUserMutation.mutateAsync({
        uid: user.uid,
        data: { isAvailable: checked }
      });
      toast({ title: "Status Updated", description: checked ? "You are now visible to receivers." : "You are currently hidden from search." });
    } catch {
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Heart className="w-8 h-8 text-primary fill-primary" />
          </div>
          <h1 className="text-4xl font-display font-bold text-foreground mb-4">Become a Donor</h1>
          <p className="text-muted-foreground text-lg">One donation can save up to three lives. Make a difference today.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Status Panel */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-lg shadow-black/5">
              <h3 className="font-display font-bold text-xl mb-6">Your Status</h3>
              
              {user ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-2xl border border-border">
                    <div className="space-y-0.5">
                      <Label className="text-base font-semibold">Available to Donate</Label>
                      <p className="text-xs text-muted-foreground">Toggle to show in search results</p>
                    </div>
                    <Switch 
                      checked={user.isAvailable} 
                      onCheckedChange={handleToggleAvailability}
                      disabled={updateUserMutation.isPending}
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Blood Group:</span>
                      <span className="font-bold text-primary">{user.bloodGroup}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Location:</span>
                      <span className="font-medium">{user.location}</span>
                    </div>
                  </div>

                  <Link href="/profile">
                    <Button variant="outline" className="w-full">Edit Profile Details</Button>
                  </Link>
                </div>
              ) : (
                <div className="text-center py-6">
                  <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground mb-4">Please log in to manage your donor status.</p>
                  <Link href="/auth">
                    <Button className="w-full shadow-md shadow-primary/20">Login to Continue</Button>
                  </Link>
                </div>
              )}
            </div>

            <div className="bg-gradient-to-br from-primary to-rose-700 rounded-3xl p-6 text-white shadow-xl shadow-primary/20">
              <h3 className="font-bold text-xl mb-2">Need Help?</h3>
              <p className="text-white/80 text-sm mb-4">Our support team is available 24/7 to guide you through the process.</p>
              <Button variant="secondary" className="w-full text-primary font-bold">Contact Support</Button>
            </div>
          </div>

          {/* Guidelines */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card border border-border/50 rounded-3xl p-8 shadow-sm">
              <h2 className="text-2xl font-display font-bold mb-6">Donation Guidelines</h2>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Who can donate?</h4>
                    <p className="text-muted-foreground mt-1">You must be between 18 and 65 years old, weigh at least 50 kg, and be in good general health. Your hemoglobin level must be sufficient.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                    <Shield className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Safety First</h4>
                    <p className="text-muted-foreground mt-1">All equipment used is sterile and single-use. You cannot contract diseases from donating blood. The process is entirely safe.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Preparation</h4>
                    <p className="text-muted-foreground mt-1">Eat a healthy meal and drink plenty of fluids before donating. Avoid fatty foods. Bring a valid ID.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
