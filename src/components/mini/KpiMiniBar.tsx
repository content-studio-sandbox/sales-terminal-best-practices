// src/components/leadership/mini/KpiMiniBar.tsx
import { useEffect, useState } from "react";
import { Tile } from "@carbon/react";

type Row = { label: string; value: number };

export default function KpiMiniBar({
                                       title,
                                       endpoint,
                                       valueSuffix = "",
                                       maxRows = 5,
                                   }: {
    title: string;
    endpoint: string;
    valueSuffix?: string;
    maxRows?: number;
}) {
    const [rows, setRows] = useState<Row[] | null>(null);
    const [err, setErr] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const r = await fetch(endpoint, { credentials: "include" });
                if (!r.ok) throw new Error(`HTTP ${r.status}`);
                const data = (await r.json()) as Row[];
                setRows((data || []).slice(0, maxRows));
            } catch (e: any) {
                setErr(e?.message || "Failed to load");
            }
        })();
    }, [endpoint, maxRows]);

    const max = rows && rows.length ? Math.max(...rows.map((r) => r.value || 0)) : 0;

    return (
        <Tile style={{ padding: 16 }}>
            <div className="cds--label-01" style={{ marginBottom: 12, color: "var(--cds-text-secondary)" }}>
                {title}
            </div>

            {!rows && !err && (
                <div style={{ height: 120, opacity: 0.6, display: "grid", gap: 8 }}>
                    <SkeletonBar />
                    <SkeletonBar />
                    <SkeletonBar />
                    <SkeletonBar />
                </div>
            )}

            {err && (
                <div className="cds--helper-text-01" style={{ color: "var(--cds-text-error)" }}>
                    {err}
                </div>
            )}

            {rows && rows.length > 0 && (
                <div style={{ display: "grid", gap: 8 }}>
                    {rows.map((r, i) => {
                        const pct = max ? Math.round((r.value / max) * 100) : 0;
                        return (
                            <div key={`${r.label}-${i}`}>
                                <div className="cds--label-01" style={{ marginBottom: 4 }}>
                                    {r.label}
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <div style={{ flex: 1, height: 8, background: "var(--cds-layer-accent-01)", borderRadius: 999 }}>
                                        <div style={{ width: `${pct}%`, height: 8, borderRadius: 999, background: "var(--cds-support-info)" }} />
                                    </div>
                                    <div className="cds--label-01" style={{ minWidth: 48, textAlign: "right" }}>
                                        {r.value}{valueSuffix}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {rows && rows.length === 0 && (
                <div className="cds--helper-text-01" style={{ color: "var(--cds-text-secondary)" }}>
                    No data.
                </div>
            )}
        </Tile>
    );
}

function SkeletonBar() {
    return (
        <div style={{ display: "grid", gap: 4 }}>
            <div style={{ width: 120, height: 10, background: "var(--cds-layer-accent-01)" }} />
            <div style={{ height: 8, background: "var(--cds-layer-accent-01)" }} />
        </div>
    );
}
