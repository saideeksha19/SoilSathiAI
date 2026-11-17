import {
  Sprout,
  FlaskConical,
  GitCompareArrows,
  SlidersHorizontal,
  Languages,
  FileText,
  LayoutDashboard,
  BookOpen,
} from "lucide-react";

export const navItems = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/analyzer", label: "Analyzer", icon: FlaskConical },
  { href: "/analysis", label: "Soil intelligence", icon: Sprout },
  { href: "/compare", label: "Compare crops", icon: GitCompareArrows },
  { href: "/simulator", label: "What-if simulator", icon: SlidersHorizontal },
  { href: "/explain", label: "Explanation", icon: Languages },
  { href: "/report", label: "Decision report", icon: FileText },
  { href: "/sources", label: "Sources", icon: BookOpen },
];
