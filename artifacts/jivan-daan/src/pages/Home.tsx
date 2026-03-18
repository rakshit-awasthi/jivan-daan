import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  Heart, Activity, Search, ShieldCheck, 
  ArrowRight, Users, Bell, AlertCircle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetStats, useGetBloodRequests } from "@workspace/api-client-react";
import { formatDistanceToNow } from "date-fns";

export default function Home() {
  const { data: stats } = useGetStats();
  const { data: urgentRequests } = useGetBloodRequests({ urgency: "critical" });

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Absolute Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`} 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            transition={{ staggerChildren: 0.2 }}
            className="space-y-8 max-w-4xl mx-auto"
          >
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 backdrop-blur-md font-medium text-sm">
              <Activity className="w-4 h-4" />
              Every 2 seconds, someone needs blood.
            </motion.div>
            
            <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-foreground leading-tight">
              Save Lives. <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-rose-500">
                Become a Hero.
              </span>
            </motion.h1>
            
            <motion.p variants={fadeIn} className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Jivan Daan connects blood donors with those in urgent need. A smart, fast, and reliable platform built to make blood donation accessible to everyone.
            </motion.p>
            
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/donate">
                <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg font-semibold rounded-full shadow-xl shadow-primary/25 hover:scale-105 transition-transform">
                  Donate Blood <Heart className="w-5 h-5 ml-2 fill-current" />
                </Button>
              </Link>
              <Link href="/request">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg font-semibold rounded-full bg-background/50 backdrop-blur-md hover:bg-background border-2">
                  Request Blood <Search className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-20 -mt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {[
            { label: "Registered Donors", value: stats?.totalDonors || "1,200+", icon: Users },
            { label: "Blood Requests", value: stats?.totalRequests || "450+", icon: Bell },
            { label: "Partner Hospitals", value: stats?.totalHospitals || "85+", icon: ShieldCheck },
            { label: "Lives Saved", value: stats?.livesSaved || "3,500+", icon: Heart, highlight: true }
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`bg-card rounded-2xl p-6 shadow-lg shadow-black/5 border ${stat.highlight ? 'border-primary/30 bg-primary/5' : 'border-border/50'} backdrop-blur-xl`}
            >
              <stat.icon className={`w-8 h-8 mb-4 ${stat.highlight ? 'text-primary' : 'text-muted-foreground'}`} />
              <h3 className="text-3xl font-display font-bold text-foreground">{stat.value}</h3>
              <p className="text-sm font-medium text-muted-foreground mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Emergency Requests Banner */}
      {urgentRequests && urgentRequests.length > 0 && (
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="relative">
              <AlertCircle className="w-8 h-8 text-destructive relative z-10" />
              <div className="absolute inset-0 bg-destructive rounded-full animate-ping opacity-20 scale-150"></div>
            </div>
            <h2 className="text-2xl font-display font-bold">Critical Emergencies</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {urgentRequests.slice(0, 3).map(req => (
              <div key={req.id} className="bg-destructive/5 border border-destructive/20 rounded-2xl p-6 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-destructive"></div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-destructive text-white font-bold text-xl shadow-md shadow-destructive/20">
                    {req.bloodGroup}
                  </div>
                  <span className="text-xs font-semibold px-2 py-1 bg-destructive/10 text-destructive rounded-full">CRITICAL</span>
                </div>
                <h3 className="font-bold text-foreground text-lg truncate">{req.patientName}</h3>
                <p className="text-muted-foreground text-sm flex items-center gap-1 mt-1">
                  <MapPin className="w-4 h-4" /> {req.location}
                </p>
                <div className="mt-4 pt-4 border-t border-destructive/10 flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(req.createdAt))} ago</span>
                  <Link href={`/find-donor?bloodGroup=${req.bloodGroup}&location=${req.location}`}>
                    <Button size="sm" variant="destructive" className="rounded-full font-semibold">Help Now</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Features */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">Why Choose Jivan Daan?</h2>
            <p className="text-lg text-muted-foreground">Built by Includer Technologies to provide a seamless, reliable experience during critical times.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Smart Matching", desc: "Our algorithm connects you with the nearest eligible donors instantly.", icon: Search },
              { title: "Verified Hospitals", desc: "All partner hospitals are verified to ensure safe and hygienic donation processes.", icon: ShieldCheck },
              { title: "Real-time Alerts", desc: "Get instant notifications for blood requirements in your area.", icon: Bell }
            ].map((feature, i) => (
              <div key={i} className="bg-card p-8 rounded-3xl border border-border/50 hover:shadow-xl transition-shadow duration-300 hover:-translate-y-1">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center bg-gradient-to-br from-primary to-rose-800 rounded-[3rem] p-12 md:p-20 shadow-2xl shadow-primary/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">Ready to make a difference?</h2>
            <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto">Join thousands of donors who are saving lives every day. Your one donation can save up to three lives.</p>
            <Link href="/auth">
              <Button size="lg" variant="secondary" className="h-14 px-8 text-lg font-bold rounded-full text-primary hover:scale-105 transition-transform">
                Register as Donor <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// Needed to silence TS for MapPin in the Urgent requests section which wasn't imported at top
import { MapPin } from "lucide-react";
