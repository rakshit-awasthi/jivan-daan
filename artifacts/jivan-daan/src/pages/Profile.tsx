import { useAuth } from "@/lib/auth";
import { Link } from "wouter";
import { MapPin, Mail, Phone, Edit, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Profile() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Please login to view profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-muted/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-card border border-border/50 rounded-[2rem] shadow-xl overflow-hidden relative">
          <div className="h-32 bg-gradient-to-r from-primary to-rose-700"></div>
          
          <div className="px-8 pb-8">
            <div className="flex justify-between items-end -mt-12 mb-6">
              <div className="w-24 h-24 rounded-2xl bg-card border-4 border-card shadow-lg flex items-center justify-center overflow-hidden z-10">
                {user.image ? (
                  <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-primary/10 flex items-center justify-center text-3xl font-bold text-primary">
                    {user.name.charAt(0)}
                  </div>
                )}
              </div>
              <Link href="/edit-profile">
                <Button variant="outline" className="gap-2 rounded-full">
                  <Edit className="w-4 h-4" /> Edit Profile
                </Button>
              </Link>
            </div>

            <div className="mb-8">
              <h1 className="text-3xl font-display font-bold text-foreground">{user.name}</h1>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider">
                  {user.role}
                </span>
                {user.role === 'donor' && (
                  <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${user.isAvailable ? 'bg-green-500/10 text-green-600' : 'bg-muted text-muted-foreground'}`}>
                    {user.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b border-border pb-2">Personal Details</h3>
                
                <div className="flex items-center gap-3 text-muted-foreground">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <Activity className="w-5 h-5 text-foreground" />
                  </div>
                  <div>
                    <p className="text-xs">Blood Group</p>
                    <p className="text-foreground font-bold text-lg">{user.bloodGroup}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-muted-foreground">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-foreground" />
                  </div>
                  <div>
                    <p className="text-xs">Location</p>
                    <p className="text-foreground font-medium">{user.location} {user.pinCode && `(${user.pinCode})`}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b border-border pb-2">Contact Info</h3>
                
                <div className="flex items-center gap-3 text-muted-foreground">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <Mail className="w-5 h-5 text-foreground" />
                  </div>
                  <div>
                    <p className="text-xs">Email</p>
                    <p className="text-foreground font-medium">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-muted-foreground">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <Phone className="w-5 h-5 text-foreground" />
                  </div>
                  <div>
                    <p className="text-xs">Phone</p>
                    <p className="text-foreground font-medium">{user.contact || 'Not provided'}</p>
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
