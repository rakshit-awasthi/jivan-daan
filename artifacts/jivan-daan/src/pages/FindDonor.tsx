import { useState } from "react";
import { useGetDonors } from "@workspace/api-client-react";
import { Search, MapPin, Phone, CheckCircle2, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function FindDonor() {
  const [bloodGroup, setBloodGroup] = useState<string>("");
  const [location, setLocation] = useState<string>("");

  const { data: donors, isLoading } = useGetDonors({ 
    bloodGroup: bloodGroup === "All" ? undefined : bloodGroup, 
    location: location || undefined 
  });

  return (
    <div className="min-h-screen pt-24 pb-12 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Search */}
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-display font-bold text-foreground mb-4">Find a Donor</h1>
          <p className="text-muted-foreground text-lg mb-8">Search our verified database of ready-to-donate volunteers.</p>
          
          <div className="bg-card p-4 rounded-2xl shadow-lg shadow-black/5 border border-border/50 flex flex-col md:flex-row gap-4 items-center">
            <div className="w-full md:w-1/3">
              <Select value={bloodGroup} onValueChange={setBloodGroup}>
                <SelectTrigger className="h-12 bg-muted/50 border-transparent">
                  <SelectValue placeholder="Blood Group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Groups</SelectItem>
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                    <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-1/2 relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input 
                placeholder="Enter city or PIN code" 
                className="h-12 pl-10 bg-muted/50 border-transparent"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <Button className="w-full md:w-auto h-12 px-8 rounded-xl font-semibold shadow-md shadow-primary/20">
              <Search className="w-4 h-4 mr-2" /> Search
            </Button>
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="h-48 bg-card rounded-2xl animate-pulse border border-border/50"></div>
            ))}
          </div>
        ) : donors && donors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {donors.map((donor) => (
              <div key={donor.uid} className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm hover:shadow-xl transition-all duration-300 group">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl overflow-hidden">
                        {donor.image ? <img src={donor.image} alt={donor.name} className="w-full h-full object-cover"/> : donor.name.charAt(0)}
                      </div>
                      <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-card ${donor.isAvailable ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">{donor.name}</h3>
                      <p className="text-sm flex items-center gap-1 text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5" /> {donor.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary text-primary-foreground font-bold text-lg shadow-md shadow-primary/20">
                    {donor.bloodGroup}
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
                  <div className="flex items-center gap-1.5 text-sm font-medium">
                    {donor.isAvailable ? (
                      <><CheckCircle2 className="w-4 h-4 text-green-500" /> <span className="text-green-600 dark:text-green-400">Available Now</span></>
                    ) : (
                      <><XCircle className="w-4 h-4 text-muted-foreground" /> <span className="text-muted-foreground">Unavailable</span></>
                    )}
                  </div>
                  <Button variant="outline" size="sm" className="rounded-full gap-2 hover:bg-primary hover:text-white" disabled={!donor.isAvailable}>
                    <Phone className="w-3.5 h-3.5" /> Contact
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-card rounded-3xl border border-border/50">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold text-foreground">No donors found</h3>
            <p className="text-muted-foreground mt-2">Try adjusting your search filters.</p>
          </div>
        )}

      </div>
    </div>
  );
}
