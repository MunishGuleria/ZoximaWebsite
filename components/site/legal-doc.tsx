import { Reveal } from "@/components/site/reveal"
import { LegalToc } from "@/components/site/legal-toc"

/* --------------------------------------------------------------------------
   A legal document (Terms of Service, Privacy Policy): one readable column
   of numbered sections, with a sticky contents list beside it on wide screens
   that jumps to each section and marks the one being read (legal-toc.tsx).
   Blocks are paragraphs (string) or bullet lists (string[]).
   Email addresses become mail links; **text** is set in bold (lead-ins such
   as "**Access.**"). White, ink and navy only.
   -------------------------------------------------------------------------- */

export type LegalSection = { id: string; heading: string; blocks: (string | string[])[] }

const EMAIL = /([\w.+-]+@[\w-]+\.[\w.]+)/

function Emails({ text }: { text: string }) {
  return (
    <>
      {text.split(EMAIL).map((p, i) =>
        EMAIL.test(p) ? (
          <a key={i} href={`mailto:${p}`} className="font-semibold text-navy-600 underline decoration-navy-600/30 underline-offset-4 hover:decoration-navy-600">
            {p}
          </a>
        ) : (
          p
        )
      )}
    </>
  )
}

function Text({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*)/).map((p, i) =>
        p.startsWith("**") && p.endsWith("**") ? (
          <strong key={i} className="font-semibold text-ink-950">
            {p.slice(2, -2)}
          </strong>
        ) : (
          <Emails key={i} text={p} />
        )
      )}
    </>
  )
}

export function LegalDoc({ sections }: { sections: LegalSection[] }) {
  return (
    <section className="zx-section !pt-2 sm:!pt-4">
      <div className="zx-container grid gap-10 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-16">
        <div className="hidden lg:block">
          <LegalToc items={sections.map(({ id, heading }) => ({ id, heading }))} />
        </div>

        <div className="max-w-3xl">
          {sections.map((s, i) => (
            <Reveal
              key={s.id}
              id={s.id}
              index={Math.min(i, 2)}
              className="scroll-mt-28 border-t border-line py-8 first:border-t-0 first:pt-0"
            >
              <h2 className="text-[1.375rem] font-semibold leading-snug tracking-[-0.02em] text-ink-950 sm:text-2xl">{s.heading}</h2>
              <div className="mt-4 space-y-4 text-[1.0625rem] leading-relaxed text-ink-700">
                {s.blocks.map((b, j) =>
                  typeof b === "string" ? (
                    <p key={j}>
                      <Text text={b} />
                    </p>
                  ) : (
                    <ul key={j} className="space-y-2.5">
                      {b.map((li) => (
                        <li key={li} className="flex gap-3">
                          <span className="mt-[0.65rem] h-1.5 w-1.5 shrink-0 rounded-full bg-navy-600" aria-hidden />
                          <span>
                            <Text text={li} />
                          </span>
                        </li>
                      ))}
                    </ul>
                  )
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
