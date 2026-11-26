import { Reveal } from "@/components/motion/reveal"
import { FaqItem } from "./faq-item"
import { SectionHeading } from "./section-heading"

/**
 * Single source of truth for the FAQ — rendered here and emitted as
 * FAQPage JSON-LD from app/page.tsx, so the two can never drift apart.
 *
 * Answers are written to be quotable in isolation: each opens with a direct
 * declarative sentence, because that is the unit an answer engine extracts.
 */
export const FAQS = [
  {
    question: "Does the AI act on its own?",
    answer:
      "Only inside the rules you set. Anything that reaches a customer is approved by your team.",
  },
  {
    question: "Is our data used for training?",
    answer: "No. Your data remains in your environment and is not used to train third-party models.",
  },
  {
    question: "Which systems can it connect to?",
    answer:
      "Common ERPs, CRMs, email, Teams and document stores, through standard connectors or the reports you already produce.",
  },
  {
    question: "Can we start small?",
    answer: "Yes. Most customers start with one process and expand.",
  },
  {
    question: "What does Zoxima actually do?",
    answer:
      "Zoxima is an enterprise technology company with three delivery practices: Salesforce and Microsoft Dynamics 365 CRM; Power Platform applications, automation and integration; and agentic AI. All three are built on one governed foundation, which is why a second project costs a fraction of the first. Zoxima also ships its own software — Salezx, an AI sales brain for Microsoft Teams and 365; GoEd AI, an agentic admissions platform for higher education; a Dealer Management System for auto dealers; and an SFA app for field sales teams. It has delivered 90+ large enterprise projects, is a Microsoft Solutions Partner and Salesforce Partner, and is headquartered in Fremont, California.",
  },
  {
    question: "What is multi-agentic AI, and how is it different from a chatbot?",
    answer:
      "Multi-agentic AI is a system in which several specialized agents — retrieval, reasoning, compliance, action — coordinate to complete a task, rather than a single model answering a prompt. A chatbot returns text. A multi-agentic system reads from your systems of record, applies policy, takes an action, and leaves an audit trail. That difference is what allows it to sit inside a real business process instead of alongside one.",
  },
  {
    question: "What is MCP (Model Context Protocol) and why does it matter?",
    answer:
      "Model Context Protocol is an open standard for connecting AI models to tools and data through a consistent interface. It matters because it removes the need to rebuild plumbing for every use case: once the orchestration, routing, tracing and governance exist at the MCP layer, each new use case inherits them. In practice this is what makes the twentieth AI use case cheaper than the second rather than more expensive.",
  },
  {
    question: "How long does an enterprise AI implementation take?",
    answer:
      "A first production use case typically takes four to five weeks from kickoff. Week one is diagnosis and use-case selection, weeks two and three stand up the MCP foundation against your real systems, and weeks four and five deliver the first use case into production with governance controls and baseline metrics in place. Subsequent use cases deploy onto the same backbone and land faster.",
  },
  {
    question: "What return should we expect, and how soon?",
    answer:
      "Zoxima scopes initial use cases specifically so return is measurable, and clients typically see it within three to eight weeks of the first deployment. Reported outcomes across engagements include roughly 40% faster approvals and collections, 25% lower compliance cost, and 60% faster product launch cycles. Baseline metrics are captured before deployment so the change is attributable rather than asserted.",
  },
  {
    question: "Do you work with our existing Salesforce, SAP or Microsoft estate?",
    answer:
      "Yes — integrating with the existing estate is the default assumption, not an add-on. Zoxima is a Salesforce and Microsoft partner, and delivers against Sales and Service Cloud, Dynamics 365, Power Platform, Azure OpenAI, SAP, SharePoint and Teams. Agents are connected to those systems through the MCP layer, which keeps credentials, access policy and logging centralised rather than duplicated per integration.",
  },
  {
    question: "How do you handle data security, compliance and auditability?",
    answer:
      "Access control, audit logging, evaluation and model policy are delivered in the first release rather than retrofitted. Every agent run is traced in LangSmith, so prompts, latency, cost and failure modes are measurable, and model selection is governed centrally instead of per project. For regulated workloads — healthcare being the common case — the controls are enforced at the orchestration layer so they apply uniformly to every workflow built on top.",
  },
  {
    question: "Which models do you use?",
    answer:
      "Zoxima routes across OpenAI, Azure OpenAI and Anthropic models rather than committing to a single provider. Because routing sits behind the MCP orchestration layer, changing or adding a model is a configuration decision rather than a rewrite — which is how AI investments stay viable as the underlying models change.",
  },
  {
    question: "Where is Zoxima based, and which markets do you serve?",
    answer:
      "Zoxima Solutions is headquartered at 44870 Osgood Road, Suite 5, Fremont, California, USA, open Monday to Friday, 8:30 AM to 5:00 PM PST, with a Global Delivery Center supporting customers worldwide. The company serves enterprise clients across manufacturing, consumer packaged goods, healthcare and medical devices, education, digital natives and professional services, and its team spans business consultants and delivery engineers who run engagements together rather than handing them off.",
  },
]

export function Faq() {
  return (
    <section id="faq" className="border-t border-line py-12 lg:py-16">
      <div className="zx-container">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
          <SectionHeading
            /* sticky: the answer list is long, so the heading holds position
               while it scrolls — same behaviour as the Why Zoxima column */
            className="lg:sticky lg:top-32 lg:self-start"
            eyebrow="Questions"
            title={
              <>
                The things buyers actually{" "}
                <span className="zx-serif text-navy-600">ask us</span>
              </>
            }
            lead="If your question is not here, email info@zoxima.com and a consultant — not a form autoresponder — will reply."
          />

          <Reveal delay={0.1}>
            <div className="border-t border-line">
              {FAQS.map((faq, i) => (
                <FaqItem
                  key={faq.question}
                  question={faq.question}
                  answer={faq.answer}
                  defaultOpen={i === 0}
                />
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
