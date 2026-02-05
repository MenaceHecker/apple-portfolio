export default function Contact() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
      <h2 className="text-2xl font-semibold tracking-tight">Contact</h2>
      <p className="mt-2 max-w-2xl text-sm text-white/60">
        Want to talk systems, reliability, or product-grade engineering? I’m in.
      </p>

      <div className="mt-8 flex flex-col gap-3 text-sm">
        <a className="text-white/80 hover:text-white" href="mailto:mtushar2508@gmail.com">
          mtushar2508@gmail.com
        </a>
        <a className="text-white/80 hover:text-white" href="https://github.com/MenaceHecker" target="_blank" rel="noreferrer">
          github.com/MenaceHecker
        </a>
        <a className="text-white/80 hover:text-white" href="https://linkedin.com" target="_blank" rel="noreferrer">
          LinkedIn
        </a>
      </div>

      <div className="mt-8 text-xs text-white/40">
        Based in Atlanta • Open to full-time roles • Let’s build something great.
      </div>
    </div>
  );
}
