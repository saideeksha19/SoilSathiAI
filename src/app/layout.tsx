import type { Metadata, Viewport } from "next";
import "./globals.css";
import { WorkspaceProvider } from "@/components/workspace/WorkspaceProvider";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: {
    default: "SoilSathi AI — Intelligent Farm Decision Engine",
    template: "%s · SoilSathi AI",
  },
  description:
    "Understand your soil, simulate your choices, and farm smarter. SoilSathi AI reads soil test reports, applies documented crop reference ranges, and explains the trade-offs in English, Kannada, and Hindi.",
  applicationName: "SoilSathi AI",
  keywords: ["soil test", "soil health", "crop suitability", "agriculture", "Karnataka", "decision support"],
};

export const viewport: Viewport = {
  themeColor: "#1f3520",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <WorkspaceProvider>
          <AppShell>{children}</AppShell>
        </WorkspaceProvider>
      </body>
    </html>
  );
}
