import { AnimateIn } from "./AnimateIn";

const STATS = [
  { value: "< 3s", label: "AI Analysis Time" },
  { value: "99%", label: "Macro Accuracy" },
  { value: "500K+", label: "Foods in Database" },
  { value: "Free", label: "To Get Started" },
];

export function Stats() {
  return (
    <section className="relative py-16 border-y border-brand-border/30">
      <div className="mx-auto max-w-7xl px-6">
        <AnimateIn>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
            {STATS.map((stat, i) => (
              <div key={stat.label} className="text-center">
                <div
                  className="font-[family-name:var(--font-outfit)] text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 mb-1"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {stat.value}
                </div>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
