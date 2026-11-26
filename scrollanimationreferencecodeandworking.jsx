"use client";

/**
 * Reference architecture — scroll-driven assembly.
 *
 * Stage is a 2-row grid that fills the viewport exactly, so there is no dead
 * space above the content:
 *   row 1 (1fr)  — hero zone: the block at hero size (left) + description,
 *                  chart and proof points (right)
 *   row 2 (auto) — the card the blocks travel down into
 *
 * Each block arrives in the hero zone, its chart draws itself, then the block
 * shrinks and travels into its own column and stays. The connector to the
 * previous block draws as it lands. After the fourth, the footprint strip
 * appears.
 *
 * Mobile / reduced motion: stacked, no pinning.
 *
 * Copy and figures from zoxima.com, salezx.com, goedai.com, and Zoxima's
 * AppExchange and AppSource listings.
 */

import { useEffect, useLayoutEffect, useRef, useState } from "react";

const C = {
    ink: "#1a1a2e",
    soft: "#5b5b73",
    line: "#e4e3ee",
    surface: "#ffffff",
    tile: "#f6f6fb",
    tint: "#dedcfb",
    tintInk: "#26215c",
    bar: "#6f66d6",
    barSoft: "#b9b4ea",
};

const BLOCKS = [
    {
        key: "channels",
        label: "Channels",
        items: ["Teams, Copilot, Outlook", "WhatsApp & voice bots", "Field apps & portals", "CRM & service desk"],
        heading: "People stay in the tools they already use",
        body:
            "Reps ask in Microsoft Teams or in the Copilot licence you already pay for. Customers reach you on WhatsApp, web and calls.",
        chart: {
            type: "bars",
            rows: [
                { label: "Manual prep before a call", value: "30 min", frac: 1 },
                { label: "Same brief through Salezx", value: "10 sec", frac: 0.07, soft: true },
            ],
        },
        proof: ["Live in about 2 days", "No new licences"],
    },
    {
        key: "platform",
        label: "Zoxima platform",
        items: ["MCP orchestration", "LangChain & LangGraph", "Multi-model routing", "LangSmith observability"],
        heading: "One MCP backbone, not a pilot per department",
        body:
            "MCP servers coordinate specialised agents — retrieval, reasoning, compliance, sales — across OpenAI, Azure AI and Anthropic, with governance and logging in one place.",
        chart: { type: "ramp", caption: "2 → 100+ use cases on the same backbone" },
        proof: ["No architectural rework", "LangSmith observability"],
    },
    {
        key: "build",
        label: "What we build",
        items: ["Salezx — AI sales brain", "SalezX Education — GoEd AI", "CRM: Salesforce & D365", "Apps, agents, automations"],
        heading: "Products and projects on one foundation",
        body:
            "Salezx briefs reps and keeps the CRM current. SalezX Education runs admissions end to end. Alongside them: CRM rollouts, portals, automation and pre-built SFA and DMS.",
        chart: {
            type: "bars",
            rows: [
                { label: "Admissions contact rate", value: "98%", frac: 0.98 },
                { label: "Conversions vs baseline", value: "2.4x", frac: 0.78, soft: true },
            ],
        },
        proof: ["ROI in 3–8 weeks", "3x faster development"],
    },
    {
        key: "systems",
        label: "Systems of record",
        items: ["Salesforce", "Dynamics 365", "SAP & Business Central", "SharePoint, drives, DMS"],
        heading: "Data stays in the systems that own it",
        body:
            "Agents read widely and write back through governed integrations, inside your own tenant. Nothing is ripped out and documents are never modified.",
        chart: {
            type: "bars",
            rows: [
                { label: "Record-update time", value: "−80%", frac: 0.8 },
                { label: "Data migrated out", value: "none", frac: 0.03, soft: true },
            ],
        },
        proof: ["Runs in your tenant", "USA & India delivery"],
    },
];

const FOOTPRINT = ["Microsoft AppSource", "Salesforce AppExchange", "salezx.com", "goedai.com", "150+ projects"];

const SPAN = 0.22;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const range = (v, a, b) => clamp((v - a) / (b - a), 0, 1);
const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

export default function ReferenceArchitectureScroll() {
    const [scrollMode, setScrollMode] = useState(false);
    useEffect(() => {
        const wide = window.matchMedia("(min-width: 960px)");
        const still = window.matchMedia("(prefers-reduced-motion: reduce)");
        const decide = () => setScrollMode(wide.matches && !still.matches);
        decide();
        wide.addEventListener("change", decide);
        still.addEventListener("change", decide);
        return () => {
            wide.removeEventListener("change", decide);
            still.removeEventListener("change", decide);
        };
    }, []);
    return scrollMode ? <ScrollStage /> : <StackedSection />;
}

function ScrollStage() {
    const wrapRef = useRef(null);
    const stageRef = useRef(null);
    const anchorRef = useRef(null);
    const chromeRef = useRef(null);
    const stripRef = useRef(null);
    const cols = useRef([]);
    const descs = useRef([]);
    const links = useRef([]);
    const dots = useRef([]);
    const fills = useRef({});
    const ramps = useRef({});
    const geo = useRef([]);
    const progress = useRef(0);

    const registerFill = (i, j, el) => {
        if (!fills.current[i]) fills.current[i] = [];
        fills.current[i][j] = el;
    };
    const registerRamp = (i, part, el) => {
        if (!ramps.current[i]) ramps.current[i] = {};
        ramps.current[i][part] = el;
    };

    useLayoutEffect(() => {
        const paint = (p) => {
            progress.current = p;
            let active = 0;
            BLOCKS.forEach((_, i) => {
                const g = geo.current[i] || { dx: 0, dy: 0, scale: 1 };
                const start = i * SPAN;
                const enter = ease(range(p, start, start + 0.05));
                const travel = ease(range(p, start + 0.1, start + 0.205));
                if (enter > 0 && travel < 1) active = i;
                const k = 1 - travel;

                const col = cols.current[i];
                if (col) {
                    col.style.opacity = enter;
                    col.style.transform = `translate3d(${g.dx * k}px, ${g.dy * k}px, 0) scale(${1 + (g.scale - 1) * k})`;
                    col.style.zIndex = travel < 1 ? 20 : 1;
                }

                const desc = descs.current[i];
                if (desc) {
                    const out = range(p, start + 0.095, start + 0.16);
                    desc.style.opacity = enter * (1 - out);
                    desc.style.transform = `translate3d(0, ${12 * (1 - enter) - 14 * out}px, 0)`;
                }

                (fills.current[i] || []).forEach((el, j) => {
                    if (!el) return;
                    const frac = parseFloat(el.dataset.frac || "1");
                    const t = ease(range(p, start + 0.03 + j * 0.02, start + 0.11 + j * 0.02));
                    el.style.transform = `scaleX(${(t * frac).toFixed(4)})`;
                });

                const ramp = ramps.current[i];
                if (ramp) {
                    const t = ease(range(p, start + 0.03, start + 0.12));
                    if (ramp.line) ramp.line.style.strokeDashoffset = (1 - t).toFixed(4);
                    if (ramp.area) ramp.area.style.opacity = (t * 0.5).toFixed(3);
                    if (ramp.head) {
                        ramp.head.style.opacity = ease(range(p, start + 0.1, start + 0.13)).toFixed(3);
                    }
                }

                if (i > 0 && links.current[i - 1]) {
                    const rev = ease(range(p, start + 0.185, start + 0.235));
                    links.current[i - 1].style.opacity = rev;
                    links.current[i - 1].style.transform = `translate3d(${-12 * (1 - rev)}px, 0, 0)`;
                }

                const dot = dots.current[i];
                if (dot) dot.style.background = i === active ? C.tintInk : C.line;
            });

            if (chromeRef.current) chromeRef.current.style.opacity = ease(range(p, 0.2, 0.31));
            if (stripRef.current) {
                const s = ease(range(p, 0.86, 0.96));
                stripRef.current.style.opacity = s;
                stripRef.current.style.transform = `translate3d(0, ${12 * (1 - s)}px, 0)`;
            }
        };

        const measure = () => {
            const anchor = anchorRef.current;
            if (!anchor) return;
            cols.current.forEach((el) => el && (el.style.transform = "none"));
            const a = anchor.getBoundingClientRect();
            const heroX = a.left + a.width / 2;
            const heroY = a.top + a.height / 2;
            geo.current = cols.current.map((el) => {
                if (!el) return { dx: 0, dy: 0, scale: 1 };
                const r = el.getBoundingClientRect();
                const scale = clamp(Math.min((a.height * 0.88) / r.height, (a.width * 0.96) / r.width), 1.05, 1.8);
                return { dx: heroX - (r.left + r.width / 2), dy: heroY - (r.top + r.height / 2), scale };
            });
            paint(progress.current);
        };

        let raf = 0;
        const read = () => {
            raf = 0;
            const el = wrapRef.current;
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const travel = rect.height - window.innerHeight;
            paint(travel <= 0 ? 0 : clamp(-rect.top / travel, 0, 1));
        };
        const onScroll = () => {
            if (!raf) raf = requestAnimationFrame(read);
        };

        measure();
        read();
        const settle = setTimeout(measure, 350);
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure).catch(() => { });
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", measure);
        return () => {
            clearTimeout(settle);
            if (raf) cancelAnimationFrame(raf);
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", measure);
        };
    }, []);

    return (
        <section ref={wrapRef} aria-label="Reference architecture" style={{ height: `${BLOCKS.length * 100 + 120}vh`, position: "relative" }}>
            <div
                ref={stageRef}
                style={{
                    position: "sticky",
                    top: 0,
                    height: "100vh",
                    overflow: "hidden",
                    display: "grid",
                    gridTemplateRows: "1fr auto",
                    rowGap: "1.5vh",
                    padding: "1.5vh 0 3.5vh",
                    boxSizing: "border-box",
                }}
            >
                <div style={{ display: "grid", gridTemplateColumns: "minmax(240px, 32%) 1fr", gap: "3vw", alignItems: "center", padding: "0 4vw", minHeight: 0 }}>
                    <div ref={anchorRef} style={{ height: "100%" }} aria-hidden="true" />
                    <div style={{ position: "relative", minHeight: 300, pointerEvents: "none" }}>
                        {BLOCKS.map((b, i) => (
                            <div key={b.key} ref={(el) => (descs.current[i] = el)} style={{ position: "absolute", left: 0, right: 0, top: 0, opacity: 0, willChange: "transform, opacity" }}>
                                <div style={{ ...eyebrow, marginBottom: 10 }}>{b.label}</div>
                                <h3 style={{ margin: "0 0 10px", fontSize: "clamp(20px, 2vw, 29px)", lineHeight: 1.22, fontWeight: 500, color: C.ink }}>{b.heading}</h3>
                                <p style={{ margin: "0 0 18px", maxWidth: "58ch", fontSize: 15, lineHeight: 1.6, color: C.soft }}>{b.body}</p>
                                {b.chart.type === "bars" ? (
                                    <Bars rows={b.chart.rows} index={i} register={registerFill} />
                                ) : (
                                    <Ramp caption={b.chart.caption} index={i} register={registerRamp} />
                                )}
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 18, marginTop: 18, ...eyebrow }}>
                                    {b.proof.map((s) => (
                                        <span key={s}>{s}</span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ justifySelf: "center", width: "min(1080px, 92vw)", position: "relative" }}>
                    <div ref={chromeRef} aria-hidden="true" style={{ position: "absolute", inset: 0, border: `1px solid ${C.line}`, borderRadius: 14, background: C.surface, opacity: 0 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "13px 18px", borderBottom: `1px solid ${C.line}`, ...eyebrow }}>
                            <span>Reference architecture</span>
                            <span>one backbone · n use cases</span>
                        </div>
                    </div>

                    <div style={{ position: "relative", display: "flex", alignItems: "center", paddingTop: 46 }}>
                        {BLOCKS.map((b, i) => (
                            <div key={b.key} style={{ display: "contents" }}>
                                {i > 0 && (
                                    <div ref={(el) => (links.current[i - 1] = el)} aria-hidden="true" style={{ width: 42, display: "flex", alignItems: "center", gap: 3, opacity: 0 }}>
                                        <span style={{ flex: 1, borderTop: `1px dashed ${C.soft}`, opacity: 0.5 }} />
                                        <span style={{ width: 6, height: 6, borderTop: `1px solid ${C.soft}`, borderRight: `1px solid ${C.soft}`, transform: "rotate(45deg)", opacity: 0.6 }} />
                                    </div>
                                )}
                                <div ref={(el) => (cols.current[i] = el)} style={{ flex: 1, padding: "2px 12px 16px", opacity: 0, willChange: "transform, opacity" }}>
                                    <div style={{ ...eyebrow, marginBottom: 11 }}>{b.label}</div>
                                    {b.items.map((item) => (
                                        <div
                                            key={item}
                                            style={{
                                                padding: "10px 12px",
                                                marginBottom: 8,
                                                borderRadius: 8,
                                                fontSize: 13,
                                                lineHeight: 1.25,
                                                background: i === 1 ? C.tint : C.tile,
                                                color: i === 1 ? C.tintInk : C.ink,
                                                border: `1px solid ${i === 1 ? "transparent" : C.line}`,
                                            }}
                                        >
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div ref={stripRef} style={{ display: "flex", justifyContent: "center", gap: 26, marginTop: 14, opacity: 0, ...eyebrow }}>
                        {FOOTPRINT.map((s) => (
                            <span key={s}>{s}</span>
                        ))}
                    </div>
                </div>

                <div aria-hidden="true" style={{ position: "absolute", bottom: "1.2vh", left: "50%", transform: "translateX(-50%)", display: "flex", gap: 8 }}>
                    {BLOCKS.map((b, i) => (
                        <span key={b.key} ref={(el) => (dots.current[i] = el)} style={{ width: 18, height: 5, borderRadius: 3, background: C.line, transition: "background .3s" }} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function Bars({ rows, index, register, still }) {
    return (
        <div style={{ maxWidth: 420 }}>
            {rows.map((r, j) => (
                <div key={r.label} style={{ marginBottom: j === rows.length - 1 ? 0 : 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                        <span style={{ fontSize: 13, color: C.soft }}>{r.label}</span>
                        <span style={{ fontSize: 15, fontWeight: 500, color: C.ink }}>{r.value}</span>
                    </div>
                    <div style={{ height: 6, borderRadius: 3, background: C.tile, overflow: "hidden" }}>
                        <div
                            ref={register ? (el) => register(index, j, el) : undefined}
                            data-frac={r.frac}
                            style={{
                                height: "100%",
                                background: r.soft ? C.barSoft : C.bar,
                                transformOrigin: "left center",
                                transform: still ? `scaleX(${r.frac})` : "scaleX(0)",
                            }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}

function Ramp({ caption, index, register, still }) {
    const line = "M0 86 L70 83 L140 73 L210 51 L280 10";
    return (
        <div style={{ maxWidth: 420 }}>
            <svg viewBox="0 0 280 96" width="100%" height="96" role="img" aria-label={caption} style={{ display: "block" }}>
                <path
                    ref={register ? (el) => register(index, "area", el) : undefined}
                    d={`${line} L280 96 L0 96 Z`}
                    fill={C.tint}
                    opacity={still ? 0.5 : 0}
                />
                <path
                    ref={register ? (el) => register(index, "line", el) : undefined}
                    d={line}
                    fill="none"
                    stroke={C.bar}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    pathLength="1"
                    strokeDasharray="1"
                    strokeDashoffset={still ? 0 : 1}
                />
                <circle ref={register ? (el) => register(index, "head", el) : undefined} cx="280" cy="10" r="3.5" fill={C.bar} opacity={still ? 1 : 0} />
            </svg>
            <div style={{ ...eyebrow, marginTop: 4 }}>{caption}</div>
        </div>
    );
}

function StackedSection() {
    const ref = useRef(null);
    const [shown, setShown] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const io = new IntersectionObserver(([e]) => e.isIntersecting && (setShown(true), io.disconnect()), { threshold: 0.12 });
        io.observe(el);
        return () => io.disconnect();
    }, []);
    return (
        <section ref={ref} aria-label="Reference architecture" style={{ width: "min(1080px, 92vw)", margin: "0 auto", border: `1px solid ${C.line}`, borderRadius: 14, background: C.surface }}>
            <div style={{ padding: "15px 20px", borderBottom: `1px solid ${C.line}`, ...eyebrow }}>Reference architecture</div>
            <div style={{ padding: "6px 18px 20px" }}>
                {BLOCKS.map((b, i) => (
                    <div
                        key={b.key}
                        style={{
                            padding: "20px 0",
                            borderBottom: i < BLOCKS.length - 1 ? `1px solid ${C.line}` : "none",
                            opacity: shown ? 1 : 0,
                            transform: shown ? "none" : "translate3d(0, 12px, 0)",
                            transition: `opacity .5s ${i * 0.09}s, transform .5s ${i * 0.09}s`,
                        }}
                    >
                        <div style={{ ...eyebrow, marginBottom: 10 }}>{b.label}</div>
                        <h3 style={{ margin: "0 0 10px", fontSize: 19, lineHeight: 1.28, fontWeight: 500, color: C.ink }}>{b.heading}</h3>
                        <p style={{ margin: "0 0 16px", fontSize: 15, lineHeight: 1.6, color: C.soft }}>{b.body}</p>
                        {b.chart.type === "bars" ? <Bars rows={b.chart.rows} still /> : <Ramp caption={b.chart.caption} still />}
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
                            {b.items.map((item) => (
                                <span key={item} style={{ padding: "9px 12px", borderRadius: 8, fontSize: 13, background: i === 1 ? C.tint : C.tile, color: i === 1 ? C.tintInk : C.ink, border: `1px solid ${i === 1 ? "transparent" : C.line}` }}>
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 16, paddingTop: 18, ...eyebrow }}>
                    {FOOTPRINT.map((s) => (
                        <span key={s}>{s}</span>
                    ))}
                </div>
            </div>
        </section>
    );
}

const eyebrow = {
    fontSize: 11,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: C.soft,
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
};