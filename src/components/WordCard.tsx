import { Volume2 } from 'lucide-react';
import { FontSize, LineSpacing } from '../types';

// Colors mapped to CSS variables for theme support
const SC = { bg: "var(--syn-bg)", border: "var(--syn-border)", badge: "var(--syn-text)" };
const AC = { bg: "var(--ant-bg)", border: "var(--ant-border)", badge: "var(--ant-text)" };

export default function WordCard({ w, fontSize, lineSpacing }: { w: any, fontSize: FontSize, lineSpacing: LineSpacing }) {
  const c = w.type === "syn" ? SC : AC;

  const speak = (text: string) => {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    window.speechSynthesis.speak(u);
  };

  // Map settings to styles
  const sizeMap: Record<FontSize, string> = { sm: '12px', base: '14px', lg: '16px', xl: '18px' };
  const bnSizeMap: Record<FontSize, string> = { sm: '11px', base: '12px', lg: '14px', xl: '16px' };
  const exSizeMap: Record<FontSize, string> = { sm: '10px', base: '11px', lg: '12px', xl: '14px' };
  const pronSizeMap: Record<FontSize, string> = { sm: '9px', base: '10px', lg: '11px', xl: '12px' };
  const spacingMap: Record<LineSpacing, string> = { normal: '1.4', relaxed: '1.6', loose: '1.8' };

  const sz = sizeMap[fontSize];
  const bnsz = bnSizeMap[fontSize];
  const exsz = exSizeMap[fontSize];
  const prsz = pronSizeMap[fontSize];
  const sp = spacingMap[lineSpacing];

  return (
    <div style={{
      background: "#fff", borderRadius: "10px",
      border: `1.5px solid ${c.border}`, overflow: "hidden", marginBottom: "8px"
    }}>

      {/* ── Header ── */}
      <div style={{
        background: c.bg, padding: "9px 12px 8px",
        display: "flex", alignItems: "center",
        justifyContent: "space-between", gap: "6px"
      }}>
        <div style={{ flex: 1 }}>
          <div style={{
            display: "flex", alignItems: "baseline",
            flexWrap: "wrap", lineHeight: sp
          }}>
            <span style={{ fontWeight: 800, fontSize: sz, color: c.badge, marginRight: "4px" }}>({w.id})</span>
            <span style={{ fontWeight: 800, fontSize: sz, color: c.badge, marginRight: "4px" }}>{w.word}</span>
            <span style={{ fontSize: prsz, color: c.badge, marginRight: "5px" }}>[{w.pron}]</span>
            <span style={{ fontSize: prsz, color: c.badge, marginRight: "5px" }}>{w.pos}</span>
            <span style={{ fontSize: prsz, color: "#888", marginRight: "4px" }}>—</span>
            <span style={{ fontSize: bnsz, fontWeight: 700, color: c.badge }}>{w.bn}</span>
          </div>
        </div>
        <span style={{
          background: c.badge, color: "#fff",
          borderRadius: "5px", padding: "2px 6px",
          fontSize: "9px", fontWeight: 700, flexShrink: 0
        }}>
          {w.type === "syn" ? "SYN" : "ANT"}
        </span>
      </div>

      {/* ── Example sentence ── */}
      <div style={{
        padding: "5px 12px",
        borderBottom: `1px dashed ${c.border}`,
        background: "#FAFBFF", fontSize: exsz,
        color: "#555", fontStyle: "italic", lineHeight: sp
      }}>
        ✎ {w.exEn}
        <span style={{ color: "#999", fontStyle: "normal" }}>
          {" "}({w.exBn})
        </span>
      </div>

      {/* ── Items ── */}
      <div style={{ padding: "6px 12px 8px" }}>
        {w.items.map((it: any, i: number) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: "6px",
            padding: "4px 0",
            borderBottom: i < w.items.length - 1
              ? `1px solid ${c.bg}` : "none"
          }}>

            {/* Number circle */}
            <div style={{
              width: "16px", height: "16px", background: c.bg,
              borderRadius: "50%", display: "flex",
              alignItems: "center", justifyContent: "center",
              fontSize: "9px", fontWeight: 800,
              color: c.badge, flexShrink: 0
            }}>{i + 1}</div>

            {/* Word+pron LEFT | meaning RIGHT */}
            <div style={{
              flex: 1, display: "flex",
              alignItems: "center",
              justifyContent: "space-between", gap: "6px"
            }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "3px" }}>
                <span style={{ fontWeight: 700, fontSize: sz, color: c.badge }}>{it[0]}</span>
                <span style={{ fontSize: prsz, color: c.badge }}>[{it[1]}]</span>
              </div>
              <span style={{
                fontSize: bnsz, color: "#555",
                textAlign: "right", flexShrink: 0
              }}>{it[2]}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
