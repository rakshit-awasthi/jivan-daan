import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { useUpdateUser } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function EditProfile() {
  const { user } = useAuth();
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const updateUserMutation = useUpdateUser();

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    pinCode: "",
    contact: "",
    image: ""
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        location: user.location,
        pinCode: user.pinCode || "",
        contact: user.contact || "",
        image: user.image || ""
      });
    }
  }, [user]);

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUserMutation.mutateAsync({
        uid: user.uid,
        data: formData
      });
      toast({ title: "Profile Updated", description: "Your details have been saved." });
      setLocation("/profile");
    } catch (error) {
      toast({ title: "Error", description: "Failed to update profile.", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-muted/20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground">Edit Profile</h1>
        </div>

        <div className="bg-card border border-border/50 rounded-3xl p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input 
                required 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="bg-muted/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Location</Label>
                <Input 
                  required 
                  value={formData.location}
                  onChange={e => setFormData({...formData, location: e.target.value})}
                  className="bg-muted/50"
                />
              </div>
              <div className="space-y-2">
                <Label>PIN Code</Label>
                <Input 
                  value={formData.pinCode}
                  onChange={e => setFormData({...formData, pinCode: e.target.value})}
                  className="bg-muted/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Contact Number</Label>
              <Input 
                value={formData.contact}
                onChange={e => setFormData({...formData, contact: e.target.value})}
                className="bg-muted/50"
              />
            </div>

            <div className="space-y-2">
              <Label>Avatar Image URL (Optional)</Label>
              <Input 
                value={formData.image}
                onChange={e => setFormData({...formData, image: e.target.value})}
                placeholder="https://example.com/avatar.jpg"
                className="bg-muted/50"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1 shadow-md shadow-primary/20" disabled={updateUserMutation.isPending}>
                {updateUserMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
              <Button type="button" variant="outline" className="flex-1" onClick={() => setLocation("/profile")}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
