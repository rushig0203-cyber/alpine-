const stats = [
  { value: "12+", label: "Projects Completed" },
  { value: "1.3M+", label: "Sq. Ft. Delivered" },
  { value: "1100+", label: "Happy Families" },
  { value: "20+", label: "Years of Legacy" },
];

export const Stats = () => {
  return (
    <section className="border-y border-border bg-background py-16 md:py-20">
      <div className="container grid grid-cols-2 divide-x divide-y divide-border border-x border-y border-border md:grid-cols-4 md:divide-y-0">
        {stats.map((s) => (
          <div key={s.label} className="group px-4 py-8 text-center transition-colors duration-500 hover:bg-gold-soft/35 md:px-7 md:py-12">
            <div className="font-serif text-4xl font-light text-foreground transition-transform duration-500 group-hover:-translate-y-1 md:text-6xl">
              {s.value}
            </div>
            <div className="mx-auto mt-4 h-px w-8 bg-gold" />
            <div className="mt-4 text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
