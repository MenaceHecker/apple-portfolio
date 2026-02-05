export type ProjectId = "nexus" | "inboxiq" | "pulseforge";

export type Project = {
  id: ProjectId;
  name: string;
  oneLiner: string;
  tags: string[];
};

export const PROJECTS: Project[] = [
  {
    id: "nexus",
    name: "Nexus",
    oneLiner: "Distributed observability stack with SLO-based monitoring.",
    tags: ["Python", "Prometheus", "Grafana", "ELK", "Postgres"],
  },
  {
    id: "inboxiq",
    name: "InboxIQ",
    oneLiner: "Email organizer with smart triage + Gmail/Outlook integration.",
    tags: ["Next.js", "Prisma", "AWS", "Elastic"],
  },
  {
    id: "pulseforge",
    name: "PulseForge",
    oneLiner: "Event-driven backend platform built with Spring Boot.",
    tags: ["Java", "Spring Boot", "PostgreSQL", "JWT", "Async"],
  },
];
