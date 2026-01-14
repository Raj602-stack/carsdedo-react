/**
 * Constants for CarDetails pages
 */

export const TOPBAR_HEIGHT = 68;

export const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "report", label: "Report" },
  { id: "specs", label: "Feature & Specs" },
  { id: "finance", label: "Finance" },
];

export const DRAWER_TABS = {
  CORE: "core",
  SUPPORTING: "supporting",
  INTERIORS: "interiors",
  EXTERIORS: "exteriors",
  WEAR: "wear",
};

export const STATUS_ICONS = {
  flawless: "check",
  minor: "warning",
  major: "error",
  little_flaw: "warning",
  damaged: "error",
};

export const STATUS_COLORS = {
  flawless: "#10b981",
  minor: "#f59e0b",
  major: "#ef4444",
  little_flaw: "#f59e0b",
  damaged: "#ef4444",
};
