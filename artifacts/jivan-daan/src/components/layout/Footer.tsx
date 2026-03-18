import { Link } from "wouter";
import { Droplet, Heart, ShieldAlert, Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
                <Droplet className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="font-display font-bold text-lg tracking-tight">
                JIVAN <span className="text-primary">DAAN</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
              A mission-driven platform dedicated to connecting blood donors with those in urgent need. Every drop counts.
            </p>
          </div>

          <div>
            <h3 className="font-display font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link href="/donate" className="text-sm text-muted-foreground hover:text-primary transition-colors">Donate Blood</Link></li>
              <li><Link href="/request" className="text-sm text-muted-foreground hover:text-primary transition-colors">Request Blood</Link></li>
              <li><Link href="/find-donor" className="text-sm text-muted-foreground hover:text-primary transition-colors">Find Donors</Link></li>
              <li><Link href="/auth" className="text-sm text-muted-foreground hover:text-primary transition-colors">Register Hospital</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-semibold text-foreground mb-4">Support</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <ShieldAlert className="w-4 h-4 text-primary" />
                <span>Emergency Guidelines</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Heart className="w-4 h-4 text-primary" />
                <span>Who Can Donate?</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-semibold text-foreground mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <Phone className="w-4 h-4 mt-0.5" />
                <span>1800-JIVAN-DAAN<br/>(Toll Free, 24x7)</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>help@jivandaan.org</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span>Includer Technologies<br/>Innovation Hub</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Jivan Daan. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground bg-secondary/50 px-4 py-2 rounded-full">
            Powered by <span className="text-foreground">INCLUDER TECHNOLOGIES</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
