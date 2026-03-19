import { Word, FontSize, LineSpacing } from '../types';

export default function WordCard({ w, fontSize, lineSpacing }: { w: Word; fontSize: FontSize; lineSpacing: LineSpacing }) {
  const c = w.type === "syn" 
    ? { bg: "var(--syn-bg)", border: "var(--syn-border)", badge: "var(--syn-text)" }
    : { bg: "var(--ant-bg)", border: "var(--ant-border)", badge: "var(--ant-text)" };

  const sizeMap = {
    sm: { id: "14px", word: "16px", pron: "12px", pos: "12px", bn: "14px", type: "10px", ex: "13px", num: "10px", item: "14px", itemPron: "12px", itemBn: "13px" },
    base: { id: "16px", word: "18px", pron: "14px", pos: "14px", bn: "16px", type: "12px", ex: "15px", num: "12px", item: "16px", itemPron: "14px", itemBn: "15px" },
    lg: { id: "18px", word: "22px", pron: "16px", pos: "16px", bn: "18px", type: "14px", ex: "17px", num: "14px", item: "18px", itemPron: "16px", itemBn: "17px" },
    xl: { id: "22px", word: "26px", pron: "18px", pos: "18px", bn: "22px", type: "16px", ex: "20px", num: "16px", item: "22px", itemPron: "18px", itemBn: "20px" },
  };
  const s = sizeMap[fontSize] || sizeMap.base;

  return (
    <div style={{
      background: "var(--bg-card)", borderRadius: "10px",
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
              fontWeight: 800, fontSize: s.id,
              color: c.badge, marginRight: "4px"
            }}>({w.id})</span>
            <span style={{
              fontWeight: 800, fontSize: s.word,
              color: c.badge, marginRight: "4px"
            }}>{w.word}</span>
            <span style={{
              fontSize: s.pron,
              color: c.badge, marginRight: "5px"
            }}>[{w.pron}]</span>
            <span style={{
              fontSize: s.pos,
              color: c.badge, marginRight: "5px"
            }}>{w.pos}</span>
            <span style={{
              fontSize: s.pos,
              color: "var(--text-sub)", marginRight: "4px"
            }}>—</span>
            <span style={{
              fontSize: s.bn,
              fontWeight: 700, color: c.badge
            }}>{w.bn}</span>
          </div>
        </div>
        <span style={{
          background: c.badge, color: "var(--bg-card)",
          borderRadius: "5px", padding: "2px 6px",
          fontSize: s.type, fontWeight: 700, flexShrink: 0
        }}>
          {w.type === "syn" ? "SYN" : "ANT"}
        </span>
      </div>

      {/* ── Example sentence ── */}
      <div style={{
        padding: "5px 12px",
        borderBottom: `1px dashed ${c.border}`,
        background: "var(--bg-main)", fontSize: s.ex,
        color: "var(--text-sub)", fontStyle: "italic",
        lineHeight: lineSpacing === 'loose' ? '1.8' : lineSpacing === 'relaxed' ? '1.6' : '1.4'
      }}>
        ✎ {w.exEn}
        <span style={{ color: "var(--text-sub)", fontStyle: "normal", opacity: 0.8 }}>
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
              fontSize: s.num, fontWeight: 800,
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
                  fontWeight: 700, fontSize: s.item,
                  color: c.badge
                }}>{it[0]}</span>
                <span style={{
                  fontSize: s.itemPron,
                  color: c.badge
                }}>[{it[1]}]</span>
              </div>
              <span style={{
                fontSize: s.itemBn, color: "var(--text-sub)",
                textAlign: "right", flexShrink: 0
              }}>{it[2]}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
