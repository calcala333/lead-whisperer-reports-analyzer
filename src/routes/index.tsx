import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import SplashScreen from "@/components/SplashScreen";
import Index from "@/pages/Index";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Active Orders of Protection" },
      {
        name: "description",
        content:
          "Secure law-enforcement portal for tracking active orders of protection and related person records.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const [accepted, setAccepted] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");
  const disclaimerText =
    "This system contains sensitive law enforcement information. Access is restricted to authorized personnel only. All activities are logged and monitored. Unauthorized access is prohibited and subject to prosecution.";

  useEffect(() => {
    let cancelled = false;
    fetch("/api/data", { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then((data) => {
        if (!cancelled && typeof data?.settings?.logoUrl === "string") {
          setLogoUrl(data.settings.logoUrl);
        }
      })
      .catch((error) => console.error("Unable to load splash-screen settings.", error));

    return () => { cancelled = true; };
  }, []);

  return (
    <TooltipProvider>
      {!accepted ? (
        <SplashScreen
          onAccept={() => setAccepted(true)}
          disclaimerText={disclaimerText}
          logoUrl={logoUrl}
        />
      ) : (
        <>
          <Toaster />
          <Sonner />
          <Index />
        </>
      )}
    </TooltipProvider>
  );
}
