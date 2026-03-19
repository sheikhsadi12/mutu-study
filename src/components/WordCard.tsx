import { Word, FontSize, LineSpacing } from '../types';

const DEFAULT_SC = { bg: "#DBEAFE", border: "#BFDBFE", badge: "#1A2F5A" };
const DEFAULT_AC = { bg: "#FEE2E2", border: "#FCA5A5", badge: "#991B1B" };

export default function WordCard({ w, fontSize, lineSpacing, customColors }: { w: Word; fontSize: FontSize; lineSpacing: LineSpacing, customColors?: Record<string, string> }) {
  const isSyn = w.type === "syn";
  
  const c = {
    bg: isSyn ? (customColors?.synBg || DEFAULT_SC.bg) : (customColors?.antBg || DEFAULT_AC.bg),
    border: isSyn ? (customColors?.synBorder || DEFAULT_SC.border) : (customColors?.antBorder || DEFAULT_AC.border),
    badge: isSyn ? (customColors?.synC || DEFAULT_SC.badge) : (customColors?.antC || DEFAULT_AC.badge),
  };

  const fontSizeMap = { sm: '12px', base: '14px', lg: '16px', xl: '18px' };
  const titleSize = fontSizeMap[fontSize];
  const pronSize = '10px';
  const posSize = '9px';
  const meaningSize = '11px';
  const itemWordSize = fontSize === 'sm' ? '11px' : '13px';
  const itemMeaningSize = '11px';

  return (
    <div style={{
      background: "#fff", borderRadius: "10px",
      border: `1.5px solid ${c.border}`,
      overflow: "hidden", marginBottom: "8px"
    }}>

      {/* ── Header: (A) Forgive [ফরগিভ] Verb — ক্ষমা করা  SYN ── */}
      <div style={{
        background: c.bg, padding: "9px 12px 8px",
        display: "flex", alignItems: "center",
        justifyContent: "space-between", gap: "6px"
      }}>
        <div style={{ flex: 1 }}>
          <div style={{
            display: "flex", alignItems: "baseline",
            flexWrap: "wrap", lineHeight: "1.4"
          }}>
            <span style={{
              fontWeight: 800, fontSize: "13px",
              color: c.badge, marginRight: "4px"
            }}>({w.id})</span>
            <span style={{
              fontWeight: 800, fontSize: titleSize,
              color: c.badge, marginRight: "4px"
            }}>{w.word}</span>
            <span style={{
              fontSize: pronSize,
              color: c.badge, marginRight: "5px"
            }}>[{w.pron}]</span>
            <span style={{
              fontSize: posSize,
              color: c.badge, marginRight: "5px"
            }}>{w.pos}</span>
            <span style={{
              fontSize: posSize,
              color: "#888", marginRight: "4px"
            }}>—</span>
            <span style={{
              fontSize: meaningSize,
              fontWeight: 700, color: c.badge
            }}>{w.bn}</span>
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
        background: "#FAFBFF", fontSize: meaningSize,
        color: "#555", fontStyle: "italic",
        lineHeight: lineSpacing === 'loose' ? '1.8' : lineSpacing === 'relaxed' ? '1.6' : '1.4'
      }}>
        ✎ {w.exEn}
        <span style={{ color: "#999", fontStyle: "normal" }}>
          {" "}({w.exBn})
        </span>
      </div>

      {/* ── Items: Peace [পিস] left | শান্তি right ── */}
      <div style={{ padding: "6px 12px 8px" }}>
        {w.items.map((it, i) => (
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
              <div style={{
                display: "flex",
                alignItems: "baseline", gap: "3px"
              }}>
                <span style={{
                  fontWeight: 700, fontSize: itemWordSize,
                  color: c.badge
                }}>{it[0]}</span>
                <span style={{
                  fontSize: pronSize,
                  color: c.badge
                }}>[{it[1]}]</span>
              </div>
              <span style={{
                fontSize: itemMeaningSize, color: "#555",
                textAlign: "right", flexShrink: 0
              }}>{it[2]}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
