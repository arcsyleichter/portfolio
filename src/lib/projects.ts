export type ProjectId = "lnyugta" | "ai-support" | "saas-inventory" | "auto-reporting";

export interface ProjectMeta {
  id: ProjectId;
  gradient: string;
  href?: string;
}

export const projects: ProjectMeta[] = [
  {
    id: "lnyugta",
    gradient: "from-charcoal via-charcoal-elevated to-gold",
  },
  {
    id: "ai-support",
    gradient: "from-tech-blue via-charcoal-elevated to-charcoal",
  },
  {
    id: "saas-inventory",
    gradient: "from-charcoal-elevated via-tech-blue to-tech-blue-light",
  },
  {
    id: "auto-reporting",
    gradient: "from-gold-light via-gold to-charcoal",
  },
];
