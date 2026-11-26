import fs from "node:fs"
import path from "node:path"
import { cn } from "@/lib/utils"

/**
 * Renders an approved logo from /public/logos/<slug>.svg when one exists,
 * otherwise a typeset wordmark. Server component: the file check runs at
 * render time, so dropping an SVG into the folder is the whole integration.
 * See public/logos/README.md for where rights-cleared files come from.
 */
export function BrandMark({
  slug,
  name,
  className,
  textClassName,
}: {
  slug: string
  name: string
  className?: string
  textClassName?: string
}) {
  const file = path.join(process.cwd(), "public", "logos", `${slug}.svg`)
  const hasLogo = fs.existsSync(file)

  if (hasLogo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={`/logos/${slug}.svg`}
        alt={name}
        className={cn("h-7 w-auto opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0", className)}
        loading="lazy"
      />
    )
  }

  return (
    <span
      className={cn(
        "whitespace-nowrap text-[1.0625rem] font-medium tracking-tight text-ink-400 transition-colors",
        textClassName
      )}
    >
      {name}
    </span>
  )
}
