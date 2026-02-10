"use client";

export default function Skills() {
  return (
    <div className="mx-auto max-w-6xl px-6">
      <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
        Skills
      </h2>

      <p className="mt-4 max-w-2xl text-white/65">
        Technologies and tools I’ve used to design, build, and ship production-grade systems.
      </p>

      <div className="mt-10 grid gap-8 md:grid-cols-2">
        {/* Backend */}
        <SkillGroup
          title="Backend & Systems"
          items={[
            "Java (Spring Boot)",
            "Python (Flask, FastAPI)",
            "REST APIs",
            "Asynchronous Processing",
            "JWT & Role-Based Access Control",
            "System Design",
          ]}
        />

        {/* Cloud */}
        <SkillGroup
          title="Cloud & Infrastructure"
          items={[
            "AWS (EC2, S3, Lambda, IAM, CloudWatch)",
            "Google Cloud Platform",
            "Docker",
            "Kubernetes (Kind / Minikube / EKS)",
            "CI/CD Pipelines",
            "Infrastructure Cost Optimization",
          ]}
        />

        {/* Observability */}
        <SkillGroup
          title="Observability & Reliability"
          items={[
            "Prometheus",
            "Grafana",
            "ELK Stack",
            "Service Level Objectives (SLOs)",
            "Error Budgets",
            "Monitoring & Alerting",
          ]}
        />

        {/* ML / Data */}
        <SkillGroup
          title="Machine Learning & Data"
          items={[
            "scikit-learn",
            "MLflow (Tracking & Registry)",
            "Model Training Pipelines",
            "Production Inference APIs",
            "Experiment Versioning",
          ]}
        />

        {/* Frontend */}
        <SkillGroup
          title="Frontend & UI"
          items={[
            "React",
            "Next.js",
            "TypeScript",
            "Tailwind CSS",
            "Browser Extensions",
            "Responsive UI Design",
          ]}
        />

        {/* Mobile */}
        <SkillGroup
          title="Mobile Development"
          items={[
            "Swift (iOS)",
            "Kotlin (Android)",
            "MVVM Architecture",
            "React Native",
            "Expo",
            "Mobile REST Integrations",
          ]}
        />
      </div>
    </div>
  );
}

function SkillGroup({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="text-sm font-medium tracking-tight text-white/80">
        {title}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-full border border-white/12 bg-white/6 px-3 py-1 text-xs text-white/75"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
