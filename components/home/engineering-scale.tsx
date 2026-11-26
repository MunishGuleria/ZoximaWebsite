"use client"


import { CountUp } from "@/components/motion/count-up"
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal"

const SCALE_STATS: { value?: number; prefix?: string; suffix?: string; text?: string; label: string; isLive?: boolean }[] = [
  {
    value: 90,
    suffix: "+",
    label: "large enterprise projects",
  },
  {
    value: 25,
    suffix: "+",
    label: "enterprise AI projects live",
  },
  {
    value: 4000,
    suffix: "+",
    label: "users on a single CRM rollout",
  },
  {
    value: 20,
    prefix: "$",
    suffix: "B+",
    label: "in orders, collections and renewals managed",
  },
  {
    value: 50,
    suffix: "K+",
    label: "AI voice calls every week",
    isLive: true,
  },
]

export function EngineeringScale() {
  return (
    <section
      id="engineering-scale"
      className="relative isolate overflow-hidden border-t border-line py-10 lg:py-16"
    >

      <div className="zx-container">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-end">
            <div>
              <h2 className="zx-display-sm text-[1.875rem] text-ink-950 sm:text-[2.25rem] lg:text-[2.5rem]">
                Built and running at{" "}
                <span className="zx-serif text-navy-600">enterprise scale</span>
              </h2>
            </div>
          </div>
        </Reveal>

        {/* Scaled-down, balanced stat row */}
        {/* Phones and tablets: two columns, the last stat across both. lg: five in a row. */}
        <div className="mt-6 border-y border-line/80 py-5 sm:mt-8 sm:py-6 lg:py-8">
          <RevealGroup className="grid grid-cols-2 gap-x-4 gap-y-5 sm:gap-6 lg:grid-cols-5 lg:divide-x lg:divide-line/70" stagger={0.06}>
            {SCALE_STATS.map((stat, i) => (
              <RevealItem key={stat.label} className={`${i > 0 ? "lg:pl-6" : ""} ${i === SCALE_STATS.length - 1 ? "col-span-2 lg:col-span-1" : ""}`}>
                <div className="group relative flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[1.75rem] font-bold leading-tight tracking-tight text-ink-950 sm:text-[2.25rem] lg:text-[2.5rem]">
                        {stat.text ?? <CountUp value={stat.value ?? 0} prefix={stat.prefix} suffix={stat.suffix} />}
                      </span>
                      {stat.isLive && (
                        <span className="relative flex h-2 w-2">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                        </span>
                      )}
                    </div>

                    <h3 className="mt-1 text-[13px] font-semibold leading-snug text-ink-900 transition-colors group-hover:text-navy-600 sm:mt-1.5 sm:text-[0.9375rem]">
                      {stat.label}
                    </h3>
                  </div>

                  <div className="mt-4 hidden h-0.5 w-16 origin-left scale-x-50 bg-line transition-[scale,background-color] duration-300 group-hover:scale-x-100 group-hover:bg-navy-600 sm:block" />
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  )
}
