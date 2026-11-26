import type { ReactNode } from "react"
import {
  ArrowUpRight,
  Building2,
  CalendarDays,
  Check,
  FileText,
  IndianRupee,
  Mail,
  Package,
  PencilLine,
  Phone,
  RefreshCw,
  Truck,
  User,
} from "lucide-react"
import { cn } from "@/lib/utils"

/* --------------------------------------------------------------------------
   "What we drive": the seven cards' copy and their visuals. Each visual is a
   small piece of live UI in the site palette (white, ink, one navy accent),
   drawn in code so it stays sharp at any size. Shared by the bento grid
   (what-we-drive.tsx) and the phone stack (what-we-drive-mobile.tsx).
   Figures inside the visuals are illustrative UI, not customer results.
   -------------------------------------------------------------------------- */

/* ---------- shared bits ---------- */

/** A grey placeholder line, as in a wireframe. */
function Bar({ className, dark = false }: { className?: string; dark?: boolean }) {
  return <span className={cn("block h-1.5 rounded-full", dark ? "bg-ink-800" : "bg-ink-100", className)} />
}

/** Light UI panel on a white card. */
function Panel({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-line bg-white shadow-[0_18px_40px_-24px_rgba(19,23,32,0.35)]",
        className
      )}
    >
      {children}
    </div>
  )
}

/** Dark UI panel on a dark card. */
function DarkPanel({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("rounded-2xl border border-ink-800 bg-ink-900", className)}>{children}</div>
}

/** Vertical dashed connector with a ringed dot, between two dark panels. */
function Connector() {
  return (
    <span aria-hidden className="relative mx-auto block h-3 w-0 border-l border-dashed border-navy-500">
      <span className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-navy-500 bg-white" />
    </span>
  )
}

/** Navy check in a circle. */
function Tick({ className }: { className?: string }) {
  return (
    <span className={cn("grid h-5 w-5 shrink-0 place-items-center rounded-full bg-navy-600 text-white", className)}>
      <Check className="h-3 w-3" strokeWidth={3} />
    </span>
  )
}

/* ---------- 01 Lead to quote (dark) ---------- */

function LeadVisual() {
  const steps = [
    { label: "New Enquiry", icon: User },
    { label: "Follow-up", icon: Phone },
    { label: "Quote Sent", icon: FileText },
  ]
  return (
    <div className="mx-auto w-full max-w-[17rem]">
      {steps.map(({ label, icon: Icon }) => (
        <div key={label}>
          {/* One line per step, so this card doesn't set the row's height. */}
          <DarkPanel className="flex items-center gap-2.5 px-2.5 py-2">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white text-navy-600">
              <Icon className="h-4 w-4" />
            </span>
            <p className="shrink-0 text-[12px] font-semibold text-white">{label}</p>
            <Bar dark className="ml-auto w-1/4" />
          </DarkPanel>
          <Connector />
        </div>
      ))}
      <div className="flex items-center gap-3 rounded-2xl bg-navy-600 px-3 py-2.5 shadow-[0_14px_34px_-12px_rgba(71,80,210,0.75)]">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-navy-600">
          <Check className="h-5 w-5" strokeWidth={3} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xl font-bold leading-none text-white">Won</p>
          <span className="mt-2 block h-1.5 w-4/5 rounded-full bg-white/35" />
          <span className="mt-1 block h-1.5 w-1/2 rounded-full bg-white/25" />
        </div>
      </div>
    </div>
  )
}

/* ---------- 02 Pricing ---------- */

function PricingVisual() {
  const rows = [
    ["Base Price", "₹ 50,000"],
    ["Discount", "- ₹ 5,000"],
    ["Taxes (GST)", "₹ 8,100"],
  ]
  return (
    <div className="relative flex w-full items-end gap-3">
      <Panel className="relative z-10 w-[60%] p-4 lg:p-5">
        <p className="text-[13px] font-semibold text-ink-950">Product Quote</p>
        <Bar className="mt-2.5 w-4/5" />
        <Bar className="mt-1.5 w-1/2" />
        <dl className="mt-4 space-y-2 text-[11px] lg:mt-6 lg:text-[12px]">
          {rows.map(([k, v]) => (
            <div key={k} className="flex justify-between gap-2">
              <dt className="text-ink-500">{k}</dt>
              <dd className="font-medium tabular-nums text-ink-950">{v}</dd>
            </div>
          ))}
          <div className="flex justify-between gap-2 border-t border-line pt-2.5 text-[12px] lg:text-[13px]">
            <dt className="font-semibold text-ink-950">Total Price</dt>
            <dd className="font-bold tabular-nums text-ink-950">₹ 53,100</dd>
          </div>
        </dl>
      </Panel>

      <div className="flex min-w-0 flex-1 flex-col items-stretch gap-3">
        <span className="ml-auto inline-flex items-center gap-1.5 rounded-xl bg-navy-600 px-2.5 py-1.5 text-[11px] font-semibold text-white shadow-[0_10px_24px_-10px_rgba(54,58,174,0.8)]">
          <IndianRupee className="h-3.5 w-3.5" />
          Best Price
        </span>
        <div aria-hidden className="flex h-20 items-end justify-center gap-1.5 lg:h-32">
          {[
            ["h-[35%]", "bg-navy-soft"],
            ["h-[50%]", "bg-navy-border"],
            ["h-[72%]", "bg-navy-500/80"],
            ["h-full", "bg-navy-600"],
          ].map(([h, c]) => (
            <span key={h} className={cn("w-3.5 rounded-t-md lg:w-5", h, c)} />
          ))}
        </div>
        <Panel className="flex items-center gap-2 p-2.5">
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-navy-600 text-white">
            <ArrowUpRight className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="text-[15px] font-bold leading-none text-ink-950">+18%</p>
            <p className="mt-1 text-[10px] leading-tight text-ink-500">Margin increase</p>
          </div>
        </Panel>
      </div>
    </div>
  )
}

/* ---------- 03 Orders ---------- */

function OrdersVisual() {
  const steps = [
    ["Order Confirmed", "12 Oct, 10:24 AM"],
    ["Dispatched", "13 Oct, 04:18 PM"],
    ["Delivered & Billed", "15 Oct, 11:02 AM"],
  ]
  return (
    <div className="flex w-full items-stretch gap-3">
      <div className="relative hidden w-[34%] place-items-center rounded-2xl bg-navy-soft sm:grid">
        <Package className="h-14 w-14 text-navy-600 lg:h-20 lg:w-20" strokeWidth={1.4} />
        <span aria-hidden className="absolute inset-x-4 bottom-4 h-1.5 rounded-full bg-navy-border" />
      </div>
      <Panel className="min-w-0 flex-1 p-4 lg:p-5">
        <ol className="relative space-y-3 lg:space-y-5">
          <span aria-hidden className="absolute bottom-3 left-2.5 top-3 w-px bg-navy-500" />
          {steps.map(([label, time]) => (
            <li key={label} className="relative flex items-start gap-2.5">
              <Tick />
              <div className="min-w-0">
                <p className="text-[12px] font-semibold text-ink-950 lg:text-[13px]">{label}</p>
                <p className="text-[10px] text-ink-500 lg:text-[11px]">{time}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-3 grid place-items-center rounded-xl bg-navy-soft py-2.5 lg:mt-5 lg:py-4">
          <Truck className="h-7 w-7 text-navy-600" />
        </div>
      </Panel>
    </div>
  )
}

/* ---------- 04 Collections ---------- */

function CoinStack({ count, className }: { count: number; className?: string }) {
  return (
    <div aria-hidden className={cn("flex flex-col-reverse items-center", className)}>
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className="-mt-1.5 block h-3 w-10 rounded-[50%] border border-navy-700 bg-navy-500 shadow-[inset_0_-2px_0_rgba(37,39,131,0.6)]" />
      ))}
    </div>
  )
}

function CollectionsVisual() {
  const rows = [
    ["Invoice No.", "INV-1024"],
    ["Issue Date", "01 Oct 2026"],
    ["Due Date", "31 Oct 2026"],
    ["Amount", "₹ 53,100"],
  ]
  return (
    <div className="relative w-full">
      <Panel className="absolute right-0 top-0 hidden w-[38%] p-2.5 sm:block">
        <CalendarDays className="h-4 w-4 text-ink-300" />
        <div className="mt-2 grid grid-cols-3 gap-1">
          {Array.from({ length: 6 }, (_, i) => (
            <span key={i} className="h-3 rounded-sm bg-ink-100" />
          ))}
        </div>
      </Panel>
      <Panel className="relative z-10 w-[68%] p-3.5">
        <p className="text-[12px] font-semibold text-ink-950">Invoice</p>
        <Bar className="mt-2 w-4/5" />
        <dl className="mt-3 space-y-1 text-[10px]">
          {rows.map(([k, v]) => (
            <div key={k} className="flex justify-between gap-2">
              <dt className="text-ink-500">{k}</dt>
              <dd className="font-medium tabular-nums text-ink-950">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-navy-600 p-2 text-white">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-white text-navy-600">
            <Check className="h-3.5 w-3.5" strokeWidth={3} />
          </span>
          <span className="text-[12px] font-semibold">Paid</span>
        </div>
      </Panel>
      <div className="absolute bottom-0 right-0 flex items-end gap-1">
        <CoinStack count={4} />
        <CoinStack count={7} />
      </div>
    </div>
  )
}

/* ---------- 05 Renewals ---------- */

function RenewalsVisual() {
  return (
    <div className="relative w-full pr-6 pt-4">
      <Panel className="p-4">
        <p className="text-[12px] font-semibold text-ink-950">Service Contract</p>
        <Bar className="mt-3 w-11/12" />
        <Bar className="mt-1.5 w-4/5" />
        <Bar className="mt-1.5 w-3/5" />
        <svg aria-hidden viewBox="0 0 90 28" className="mt-4 h-7 w-20 text-navy-700" fill="none">
          <path
            d="M4 22c6-14 10-16 12-8s-2 10 3 2 8-12 10-4-1 8 4 3 9-7 12-3 6 3 10 1 10-3 14-2"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <Bar className="mt-1 w-2/5" />
      </Panel>
      <span className="absolute right-0 top-0 grid h-11 w-11 place-items-center rounded-xl border border-line bg-white text-navy-600 shadow-[0_10px_24px_-12px_rgba(19,23,32,0.35)]">
        <CalendarDays className="h-5 w-5" />
      </span>
      <span className="absolute -bottom-2 right-0 grid h-14 w-14 place-items-center rounded-full bg-navy-soft text-navy-600 shadow-[0_14px_30px_-14px_rgba(54,58,174,0.6)]">
        <RefreshCw className="h-7 w-7" strokeWidth={2.4} />
      </span>
    </div>
  )
}

/* ---------- 06 Productivity (dark) ---------- */

function ProductivityVisual() {
  const contacts = [Building2, Mail, Phone]
  return (
    <div className="mx-auto w-full max-w-[18rem]">
      <DarkPanel className="flex gap-3 p-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-navy-600">
          <User className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[12px] font-semibold text-white">Acme Industries</p>
          <ul className="mt-2 space-y-1.5">
            {contacts.map((Icon, i) => (
              <li key={i} className="flex items-center gap-2">
                <Icon className="h-3 w-3 shrink-0 text-ink-300" />
                <Bar dark className="flex-1" />
              </li>
            ))}
          </ul>
        </div>
      </DarkPanel>
      <Connector />
      <DarkPanel className="flex gap-3 p-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-navy-600">
          <PencilLine className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[12px] font-semibold text-white">Meeting Notes</p>
          <ul className="mt-2 space-y-1.5">
            {["w-11/12", "w-3/4", "w-4/5"].map((w) => (
              <li key={w} className="flex items-center gap-2">
                <span className="h-1 w-1 shrink-0 rounded-full bg-ink-300" />
                <Bar dark className={w} />
              </li>
            ))}
          </ul>
        </div>
      </DarkPanel>
    </div>
  )
}

/* ---------- 07 Reviews ---------- */

function ReviewsVisual() {
  return (
    <div className="relative w-full pb-6">
      <Panel className="w-[82%] p-3.5">
        <p className="text-[11px] font-semibold text-ink-950">Performance Overview</p>
        <div aria-hidden className="mt-3 flex h-20 items-end gap-1.5">
          {["h-[30%]", "h-[42%]", "h-[55%]", "h-[72%]", "h-full"].map((h) => (
            <span key={h} className={cn("w-3.5 rounded-t-md bg-navy-500", h)} />
          ))}
        </div>
      </Panel>
      <Panel className="absolute right-0 top-0 px-2.5 py-2">
        <p className="flex items-center gap-1 text-[14px] font-bold leading-none text-ink-950">
          <ArrowUpRight className="h-3.5 w-3.5 text-navy-600" />
          +24%
        </p>
        <p className="mt-1 text-[9px] text-ink-500">This Quarter</p>
      </Panel>
      <Panel className="absolute bottom-0 right-0 w-[56%] p-3">
        <p className="text-[11px] font-semibold text-ink-950">Action Items</p>
        <ul className="mt-2 space-y-1.5">
          {["w-full", "w-4/5", "w-11/12"].map((w) => (
            <li key={w} className="flex items-center gap-2">
              <Tick className="h-4 w-4 [&>svg]:h-2.5 [&>svg]:w-2.5" />
              <Bar className={w} />
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  )
}

/* ---------- the seven cards ---------- */

export type Drive = {
  title: string
  body: string
  dark?: boolean
  visual: ReactNode
}

export const DRIVES: Drive[] = [
  {
    title: "Every lead and quote followed to a decision",
    body: "Every enquiry owned, every follow-up planned, and run until won or lost.",
    dark: true,
    visual: <LeadVisual />,
  },
  {
    title: "The right price, every time",
    body: "Discounts based on what actually wins, and quotes out fast from your price lists.",
    visual: <PricingVisual />,
  },
  {
    title: "Orders delivered and billed without delays",
    body: "Every order tracked from booking to invoice, with exceptions sent to the person who can fix them.",
    visual: <OrdersVisual />,
  },
  {
    title: "Cash collected on time",
    body: "Every invoice owned, every payment commitment checked, and risks flagged before an order is held.",
    visual: <CollectionsVisual />,
  },
  {
    title: "Service contracts renewed before they lapse",
    body: "Every renewal owned and tracked to a decision.",
    visual: <RenewalsVisual />,
  },
  {
    title: "Every rep prepared for every customer",
    body: "A brief before every meeting, and one note after it updates everything.",
    dark: true,
    visual: <ProductivityVisual />,
  },
  {
    title: "Reviews that end in actions",
    body: "Live numbers in the room, and decisions turned into actions that get done.",
    visual: <ReviewsVisual />,
  },
]
