import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { Reveal } from "@/components/motion/reveal"

/**
 * The one heading treatment used by every section on the page:
 * a mono eyebrow, a tight display heading, and an optional lead paragraph.
 * Consistency here is what stops the page reading as a pile of templates.
 */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  className,
}: {
  eyebrow: string
  title: ReactNode
  lead?: ReactNode
  align?: "left" | "center"
  className?: string
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      <Reveal>
        <p className={cn("zx-eyebrow flex items-center gap-2.5", align === "center" && "justify-center")}>
          <span
            className="inline-block h-px w-7 bg-navy-600"
            aria-hidden="true"
          />
          {eyebrow}
        </p>
      </Reveal>
      <Reveal delay={0.06}>
        <h2 className="zx-display-sm mt-4 text-[2rem] text-ink-950 sm:text-[2.5rem] lg:text-[2.875rem]">
          {title}
        </h2>
      </Reveal>
      {lead && (
        <Reveal delay={0.12}>
          <p className="zx-lead mt-5">{lead}</p>
        </Reveal>
      )}
    </div>
  )
}
