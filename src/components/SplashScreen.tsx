import React from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Lock, CheckCircle2 } from "lucide-react";
import defaultLogo from "@/assets/default-logo.png";

interface SplashScreenProps {
  onAccept: () => void;
  disclaimerText: string;
  logoUrl?: string;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onAccept, disclaimerText, logoUrl }) => {
  const acknowledgments = [
    "You are authorized law enforcement personnel",
    "You understand the sensitive nature of this information",
    "You will use this system in accordance with department policies",
    "Your access and activities are logged and monitored",
    "Unauthorized access or misuse is subject to prosecution",
  ];

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: "var(--gradient-hero)" }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 20%, hsl(var(--primary-glow)) 0%, transparent 45%), radial-gradient(circle at 85% 80%, hsl(var(--accent)) 0%, transparent 45%)",
        }}
      />

      <div className="relative max-w-2xl w-full">
        <div className="bg-card rounded-2xl shadow-2xl overflow-hidden border border-border/50 backdrop-blur">
          {/* Header */}
          <div className="px-8 pt-8 pb-6 text-center border-b border-border">
            <div className="flex justify-center mb-4">
              {logoUrl ? (
                <img src={logoUrl} alt="System Logo" className="h-20 w-auto object-contain" />
              ) : (
                <div
                  className="h-16 w-16 rounded-2xl flex items-center justify-center text-primary-foreground shadow-lg"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  <Shield className="h-8 w-8" />
                </div>
              )}
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-semibold uppercase tracking-wider mb-3">
              <Lock className="h-3 w-3" />
              Restricted Access
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              Active Orders of Protection
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Law Enforcement Personnel Only
            </p>
          </div>

          {/* Body */}
          <div className="p-8 space-y-6">
            <div className="rounded-xl border-l-4 border-warning bg-warning/10 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                <div>
                  <h2 className="text-sm font-bold text-foreground mb-1.5 uppercase tracking-wide">
                    Important Disclaimer
                  </h2>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    {disclaimerText}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-3 text-sm">
                By clicking "I Accept", you acknowledge that:
              </h3>
              <ul className="space-y-2">
                {acknowledgments.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-foreground/80">
                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Button
              onClick={onAccept}
              size="lg"
              className="w-full font-semibold text-base shadow-lg hover:shadow-xl transition-shadow"
              style={{ background: "var(--gradient-primary)" }}
            >
              I Accept — Enter System
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              This acknowledgment is required each time you access this system
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
