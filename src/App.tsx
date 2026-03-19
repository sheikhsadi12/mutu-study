import { useState, useEffect, useRef } from "react";

// ── Seed data ─────────────────────────────────────────────────────────
const SEED_FOLDERS = [
  {
    id: "folder_1",
    name: "HSC English",
    icon: "📘",
    color: "#1A2F5A",
    passages: [
      {
        id: "p1",
        passageNo: "01", board: "DB", year: "25",
        en: `"There can be no progress without efforts. Life loses its interest if there is no struggle. For example, games become dull if there is no competition in them and if the result is easily foreseen. No matter we win the game or lose it. The keener the contest, the greater the enjoyment. A victory is not a real triumph unless both the sides are equally matched. Whether we like it or not, life is a continuous competitive examination."`,
        bn: `"প্রচেষ্টা বা শ্রম ছাড়া কোনো উন্নতি সম্ভব নয়। যদি কোনো সংগ্রাম না থাকে তবে জীবন তার আনন্দ বা আকর্ষণ হারায়।"`,
        words: [
          { id:"A", word:"Progress",   pron:"প্রো-গ্রেস",    pos:"Noun/Verb",        bn:"উন্নতি, প্রগতি",    exEn:"Hard work is the key to progress.",          exBn:"পরিশ্রমই উন্নতির চাবিকাঠি।",         type:"syn", items:[["Improvement","ইমপ্রুভমেন্ট","সংস্কার বা উৎকর্ষ সাধন"],["Advance","অ্যাডভান্স","অগ্রসর হওয়া বা অগ্রগতি"],["Development","ডেভেলপমেন্ট","উন্নয়ন বা বিকাশ"]]},
          { id:"B", word:"Efforts",    pron:"এফোর্টস",        pos:"Noun",             bn:"প্রচেষ্টা, শ্রম",   exEn:"We must make efforts to succeed.",           exBn:"সফল হওয়ার জন্য প্রচেষ্টা করতে হবে।", type:"syn", items:[["Attempts","অ্যাটেম্পটস","চেষ্টা বা উদ্যোগ"],["Endeavors","এনডেভার্স","সুসংবদ্ধ প্রচেষ্টা"],["Hard work","হার্ড ওয়ার্ক","কঠোর পরিশ্রম"]]},
          { id:"C", word:"Interest",   pron:"ইন্টারেস্ট",     pos:"Noun/Verb",        bn:"আগ্রহ, আকর্ষণ",    exEn:"He has a great interest in music.",          exBn:"সংগীতের প্রতি তার প্রবল আগ্রহ আছে।",  type:"syn", items:[["Attraction","অ্যাট্রাকশন","আকর্ষণ"],["Attention","অ্যাটেনশন","মনোযোগ"],["Appeal","অ্যাপিল","আবেদন বা আকর্ষণ"]]},
          { id:"D", word:"Struggle",   pron:"স্ট্রাগল",       pos:"Noun/Verb",        bn:"সংগ্রাম, লড়াই",    exEn:"Life is a constant struggle.",              exBn:"জীবন একটি নিরন্তর সংগ্রাম।",         type:"ant", items:[["Peace","পিস","শান্তি"],["Ease","ইজ","আরাম বা অনায়াস"],["Comfort","কমফোর্ট","স্বস্তি বা আরাম"]]},
          { id:"E", word:"Dull",       pron:"ডাল",             pos:"Adjective",        bn:"একঘেয়ে, নিরানন্দ", exEn:"The movie was very dull.",                  exBn:"সিনেমাটি খুব একঘেয়ে ছিল।",           type:"ant", items:[["Exciting","এক্সাইটিং","উত্তেজনাপূর্ণ"],["Interesting","ইন্টারেস্টিং","আকর্ষণীয়"],["Bright","ব্রাইট","উজ্জ্বল বা প্রাণবন্ত"]]},
          { id:"F", word:"Competition",pron:"কম্পিটিশন",       pos:"Noun",             bn:"প্রতিযোগিতা",      exEn:"There is tough competition in the market.", exBn:"বাজারে এখন কঠিন প্রতিযোগিতা।",        type:"syn", items:[["Contest","কনটেস্ট","প্রতিযোগিতা বা লড়াই"],["Rivalry","রাইভালরি","প্রতিদ্বন্দ্বিতা"],["Race","রেস","দৌড় বা পাল্লা"]]},
          { id:"G", word:"Easily",     pron:"ইজিলি",           pos:"Adverb",           bn:"সহজেই",            exEn:"He solved the math easily.",                exBn:"সে সহজেই অঙ্কটি সমাধান করল।",        type:"ant", items:[["Hardly","হার্ডলি","খুব কষ্টে বা কদাচিৎ"],["Difficultly","ডিফিকাল্টলি","কঠিনভাবে"],["Toughly","টাফলি","কঠিনভাবে"]]},
          { id:"H", word:"Win",        pron:"উইন",             pos:"Verb/Noun",        bn:"জয়লাভ করা",       exEn:"Our team will win the match.",              exBn:"আমাদের দল ম্যাচে জিতবে।",             type:"ant", items:[["Lose","লুজ","হারানো বা হেরে যাওয়া"],["Defeat","ডিফিট","পরাজিত হওয়া"],["Fail","ফেইল","ব্যর্থ হওয়া"]]},
          { id:"I", word:"Enjoyment",  pron:"এনজয়মেন্ট",     pos:"Noun",             bn:"আনন্দ, উপভোগ",     exEn:"Reading books gives us enjoyment.",         exBn:"বই পড়া আমাদের আনন্দ দেয়।",          type:"syn", items:[["Pleasure","প্লেজার","তৃপ্তি বা আনন্দ"],["Delight","ডিলাইট","মহা আনন্দ"],["Happiness","H্যাপিনেস","সুখ বা খুশি"]]},
          { id:"J", word:"Victory",    pron:"ভিক্টরি",         pos:"Noun",             bn:"বিজয়",            exEn:"We celebrated the victory.",                exBn:"আমরা বিজয় উদযাপন করলাম।",            type:"ant", items:[["Defeat","ডিফিট","পরাজয়"],["Loss","লস","ক্ষতি বা হার"],["Failure","Fেইলিওর","ব্যর্থতা"]]},
          { id:"K", word:"Real",       pron:"রিয়াল",           pos:"Adjective",        bn:"প্রকৃত, বাস্তব",   exEn:"This is a real diamond.",                  exBn:"এটি একটি আসল হীরা।",                  type:"syn", items:[["True","ট্রু","সত্য"],["Actual","অ্যাকচুয়াল","বাস্তব"],["Genuine","জেনুইন","খাঁটি বা অকৃত্রিম"]]},
          { id:"L", word:"Equally",    pron:"ইকুয়ালি",         pos:"Adverb",           bn:"সমানভাবে",         exEn:"Divide the cake equally.",                 exBn:"কেকটি সমানভাবে ভাগ কর।",              type:"ant", items:[["Unequally","আন-ইকুয়ালি","অসমানভাবে"],["Differently","ডিফারেন্টলি","ভিন্নভাবে"],["Unevenly","আন-ইভেনলি","অমসৃণভাবে"]]},
          { id:"M", word:"Like",       pron:"লাইক",            pos:"Verb/Preposition", bn:"পছন্দ করা, মতো",   exEn:"I like to read stories.",                  exBn:"আমি গল্প পড়তে পছন্দ করি।",          type:"syn", items:[["Love","লাভ","ভালোবাসা"],["Admire","অ্যাডমায়ার","শ্রদ্ধা করা"],["Appreciate","অ্যাপ্রিশিয়েট","প্রশংসা করা"]]},
          { id:"N", word:"Continuous", pron:"কন্টিনিউয়াস",    pos:"Adjective",        bn:"নিরন্তর, অবিরাম",  exEn:"Life is a continuous process.",            exBn:"জীবন একটি নিরন্তর প্রক্রিয়া।",       type:"ant", items:[["Irregular","ইরেগুলার","অনিয়মিত"],["Broken","ব্রোকেন","খণ্ডিত বা ভাঙা"],["Interrupted","ইন্টারাপ্টেড","সবিরাম বা বাধাগ্রস্ত"]]},
        ]
      }
    ]
  }
];

// ── Colors ────────────────────────────────────────────────────────────
const SC = { bg:"#DBEAFE", border:"#BFDBFE", badge:"#1A2F5A" };
const AC = { bg:"#FEE2E2", border:"#FCA5A5", badge:"#991B1B" };

// ── Mini Word Card ────────────────────────────────────────────────────
function WordCard({ w, compact = false }) {
  const c = w.type === "syn" ? SC : AC;
  return (
    <div style={{ background:"#fff", borderRadius:"10px", border:`1.5px solid ${c.border}`, overflow:"hidden", marginBottom:"8px" }}>
      {/* Header — word line: (A) Forgive [ফরগিভ] Verb — ক্ষমা করা  SYN */}
      <div style={{ background:c.bg, padding:"9px 12px 8px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:"6px" }}>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:"flex", alignItems:"baseline", flexWrap:"wrap", gap:"0px", lineHeight:"1.4" }}>
            <span style={{ fontWeight:800, fontSize:"13px", color:c.badge, marginRight:"4px" }}>({w.id})</span>
            <span style={{ fontWeight:800, fontSize:"14px", color:c.badge, marginRight:"4px" }}>{w.word}</span>
            <span style={{ fontSize:"10px", color:c.badge, marginRight:"5px" }}>[{w.pron}]</span>
            <span style={{ fontSize:"10px", color:c.badge, marginRight:"5px" }}>{w.pos}</span>
            <span style={{ fontSize:"10px", color:"#888", marginRight:"4px" }}>—</span>
            <span style={{ fontSize:"12px", fontWeight:700, color:c.badge }}>{w.bn}</span>
          </div>
        </div>
        <span style={{ background:c.badge, color:"#fff", borderRadius:"5px", padding:"2px 6px", fontSize:"9px", fontWeight:700, flexShrink:0 }}>
          {w.type==="syn"?"SYN":"ANT"}
        </span>
      </div>
      {/* Example */}
      <div style={{ padding:"5px 12px", borderBottom:`1px dashed ${c.border}`, background:"#FAFBFF", fontSize:"11px", color:"#555", fontStyle:"italic" }}>
        ✎ {w.exEn} <span style={{ color:"#999", fontStyle:"normal" }}>({w.exBn})</span>
      </div>
      {/* Items — each in one line: Pardon [পারডন] মাফ করা বা ক্ষমা করা */}
      <div style={{ padding:"6px 12px 8px" }}>
        {w.items.map((it, i) => (
          <div key={i} style={{ display:"flex", alignItems:"center", gap:"6px", padding:"4px 0", borderBottom:i<w.items.length-1?`1px solid ${c.bg}`:"none" }}>
            <div style={{ width:"16px", height:"16px", background:c.bg, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"9px", fontWeight:800, color:c.badge, flexShrink:0 }}>{i+1}</div>
            <div style={{ flex:1, display:"flex", alignItems:"baseline", flexWrap:"wrap", gap:"0px" }}>
              <span style={{ fontWeight:700, fontSize:"12.5px", color:c.badge, marginRight:"4px" }}>{it[0]}</span>
              <span style={{ fontSize:"10px", color:c.badge, marginRight:"6px" }}>[{it[1]}]</span>
              <span style={{ fontSize:"11px", color:"#555" }}>{it[2]}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Code Add Modal ────────────────────────────────────────────────────
function CodeAddModal({ folders, onClose, onSave }) {
  const [code, setCode] = useState("");
  const [parsed, setParsed] = useState<any>(null);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1); // 1=paste, 2=choose folder
  const [destType, setDestType] = useState("existing"); // "existing"|"new"
  const [selectedFolder, setSelectedFolder] = useState(folders[0]?.id || "");
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderIcon, setNewFolderIcon] = useState("📗");
  const [wordFilter, setWordFilter] = useState("all");
  const textRef = useRef<HTMLTextAreaElement>(null);

  const handleCode = (val) => {
    setCode(val);
    if (!val.trim()) { setParsed(null); setError(""); return; }
    try {
      const d = JSON.parse(val);
      if (!d.words || !Array.isArray(d.words)) throw new Error("words array না পেলাম");
      // Normalize items: support both array [["w","p","m"]] and object format
      d.words = d.words.map(w => ({
        ...w,
        items: (w.items || []).map(it => {
          if (Array.isArray(it)) return it;
          return [it.en || it.word || "", it.pron || "", it.bn || it.meaning || ""];
        })
      }));
      setParsed(d);
      setError("");
    } catch(e) {
      setParsed(null);
      setError("JSON format ঠিক নেই: " + e.message);
    }
  };

  const doSave = () => {
    if (!parsed) return;
    const passage = { ...parsed, id: "p_" + Date.now() };
    if (destType === "new") {
      onSave({ type:"new", folderName: newFolderName || "New Folder", folderIcon: newFolderIcon, passage });
    } else {
      onSave({ type:"existing", folderId: selectedFolder, passage });
    }
  };

  const filteredWords = parsed?.words
    ? (wordFilter === "all" ? parsed.words : parsed.words.filter(w => w.type === wordFilter))
    : [];

  const ICONS = ["📘","📗","📕","📙","📓","📒","🗂","📂","✏️","🔖"];

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.6)", zIndex:200, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
      <div style={{ background:"#fff", width:"100%", maxWidth:"430px", borderRadius:"20px 20px 0 0", maxHeight:"92vh", display:"flex", flexDirection:"column", overflow:"hidden" }}>
        
        {/* Handle bar */}
        <div style={{ display:"flex", justifyContent:"center", padding:"10px 0 0" }}>
          <div style={{ width:"36px", height:"4px", background:"#ddd", borderRadius:"2px" }}/>
        </div>

        {/* Header */}
        <div style={{ padding:"10px 18px 10px", display:"flex", alignItems:"center", justifyContent:"space-between", borderBottom:"1px solid #f0f0f0" }}>
          <div>
            <div style={{ fontWeight:800, fontSize:"16px", color:"#1A2F5A" }}>
              {step===1 ? "📋 Code Paste" : "📁 Folder Select"}
            </div>
            <div style={{ fontSize:"11px", color:"#888", marginTop:"1px" }}>
              {step===1 ? "JSON code পেস্ট করুন → live preview" : "কোথায় save করবেন?"}
            </div>
          </div>
          <button onClick={onClose} style={{ background:"#f5f5f5", border:"none", borderRadius:"50%", width:"32px", height:"32px", cursor:"pointer", fontSize:"16px", color:"#666" }}>✕</button>
        </div>

        {/* Step tabs */}
        <div style={{ display:"flex", borderBottom:"1px solid #eee" }}>
          {["Code Paste","Folder"].map((s,i)=>(
            <div key={i} style={{
              flex:1, padding:"8px", textAlign:"center", fontSize:"12px", fontWeight:700, cursor:"pointer",
              color: step===i+1 ? "#1A2F5A" : "#aaa",
              borderBottom: step===i+1 ? "2.5px solid #1A2F5A" : "2.5px solid transparent",
            }} onClick={()=>{ if(i===1 && !parsed) return; setStep(i+1); }}>
              {i+1}. {s}
            </div>
          ))}
        </div>

        <div style={{ flex:1, overflowY:"auto" }}>
          {step===1 ? (
            <div style={{ padding:"14px" }}>
              {/* Code area */}
              <div style={{ marginBottom:"10px" }}>
                <div style={{ fontSize:"11px", fontWeight:700, color:"#1A2F5A", marginBottom:"6px" }}>JSON Code পেস্ট করুন:</div>
                <textarea
                  ref={textRef}
                  value={code}
                  onChange={e => handleCode(e.target.value)}
                  placeholder={`{\n  "passageNo": "02",\n  "board": "RB",\n  "year": "25",\n  "en": "English passage...",\n  "bn": "বাংলা অনুবাদ...",\n  "words": [...]\n}`}
                  style={{ width:"100%", height:"130px", border:`1.5px solid ${error?"#FCA5A5":parsed?"#86EFAC":"#ddd"}`, borderRadius:"10px", padding:"10px", fontSize:"11.5px", fontFamily:"monospace", resize:"none", outline:"none", background: error?"#FFF5F5":parsed?"#F0FFF4":"#fff", boxSizing:"border-box" }}
                />
                {error && <div style={{ color:"#991B1B", fontSize:"11px", marginTop:"4px" }}>⚠ {error}</div>}
                {parsed && !error && (
                  <div style={{ color:"#134E4A", fontSize:"11px", marginTop:"4px", background:"#F0FFF4", padding:"4px 10px", borderRadius:"6px" }}>
                    ✓ Passage {parsed.passageNo} [{parsed.board}'{parsed.year}] — {parsed.words.length} words detected
                  </div>
                )}
              </div>

              {/* Preview */}
              {parsed && (
                <>
                  <div style={{ fontSize:"11px", fontWeight:700, color:"#1A2F5A", marginBottom:"8px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                    <span>Live Preview</span>
                    <div style={{ display:"flex", gap:"4px" }}>
                      {[["all","সব"],["syn","SYN"],["ant","ANT"]].map(([v,l])=>(
                        <button key={v} onClick={()=>setWordFilter(v)} style={{ padding:"2px 8px", borderRadius:"10px", border:"none", fontSize:"10px", fontWeight:700, cursor:"pointer", background:wordFilter===v?(v==="ant"?"#991B1B":"#1A2F5A"):"#f0f0f0", color:wordFilter===v?"#fff":"#666" }}>{l}</button>
                      ))}
                    </div>
                  </div>

                  {/* Passage preview */}
                  <div style={{ background:"#FFFDF0", border:"1.5px solid #86EFAC", borderRadius:"10px", padding:"10px 12px", marginBottom:"10px", fontSize:"11.5px", color:"#333", lineHeight:"1.6" }}>
                    <span style={{ fontWeight:700, color:"#92400E", fontSize:"10px" }}>EN  </span>
                    {parsed.en?.substring(0,120)}{parsed.en?.length>120?"...":""}
                  </div>

                  <div style={{ maxHeight:"340px", overflowY:"auto", paddingRight:"2px" }}>
                    {filteredWords.map((w,i) => <WordCard key={i} w={w} compact />)}
                  </div>

                  <button onClick={()=>setStep(2)} style={{ width:"100%", background:"#1A2F5A", color:"#fff", border:"none", borderRadius:"10px", padding:"11px", fontWeight:700, cursor:"pointer", fontSize:"13px", marginTop:"10px" }}>
                    Next → Folder চুনুন
                  </button>
                </>
              )}

              {!parsed && !error && (
                <div style={{ background:"#F0F4FF", borderRadius:"10px", padding:"14px", fontSize:"11.5px", color:"#1A2F5A", lineHeight:"1.7" }}>
                  <div style={{ fontWeight:700, marginBottom:"6px" }}>📌 Code Format:</div>
                  আমাকে নতুন passage এর data দিলে আমি এই format এ JSON code দিয়ে দেব — সেটা এখানে paste করুন।
                  <br/><br/>
                  <span style={{ fontFamily:"monospace", fontSize:"10.5px", color:"#444" }}>
                    {`{ "passageNo":"02", "board":"RB", "year":"25",`}<br/>
                    {`  "en":"passage...", "bn":"অনুবাদ...",`}<br/>
                    {`  "words":[{"id":"A","word":"...","type":"syn",...}] }`}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div style={{ padding:"14px" }}>
              <div style={{ fontSize:"12px", fontWeight:700, color:"#555", marginBottom:"12px" }}>
                "{parsed?.word || `Passage ${parsed?.passageNo}`}" কোথায় add করবেন?
              </div>

              {/* Existing folder */}
              <button onClick={()=>setDestType("existing")} style={{ width:"100%", background:destType==="existing"?"#EFF6FF":"#f9f9f9", border:`2px solid ${destType==="existing"?"#1A2F5A":"#eee"}`, borderRadius:"12px", padding:"12px", cursor:"pointer", textAlign:"left", marginBottom:"8px" }}>
                <div style={{ fontWeight:700, fontSize:"13px", color:"#1A2F5A" }}>📂 আগের Folder এ Add করুন</div>
                {destType==="existing" && folders.length > 0 && (
                  <div style={{ marginTop:"10px", display:"flex", flexDirection:"column", gap:"6px" }}>
                    {folders.map(f => (
                      <div key={f.id} onClick={e=>{e.stopPropagation();setSelectedFolder(f.id);}} style={{
                        display:"flex", alignItems:"center", gap:"10px", padding:"8px 10px", borderRadius:"8px",
                        background: selectedFolder===f.id ? f.color+"22" : "#fff",
                        border: `1.5px solid ${selectedFolder===f.id ? f.color : "#e5e5e5"}`,
                        cursor:"pointer",
                      }}>
                        <span style={{ fontSize:"18px" }}>{f.icon}</span>
                        <div>
                          <div style={{ fontWeight:700, fontSize:"12.5px", color:f.color }}>{f.name}</div>
                          <div style={{ fontSize:"10.5px", color:"#888" }}>{f.passages.length} passage{f.passages.length!==1?"s":""}</div>
                        </div>
                        {selectedFolder===f.id && <span style={{ marginLeft:"auto", color:f.color, fontWeight:800 }}>✓</span>}
                      </div>
                    ))}
                  </div>
                )}
              </button>

              {/* New folder */}
              <button onClick={()=>setDestType("new")} style={{ width:"100%", background:destType==="new"?"#F0FFF4":"#f9f9f9", border:`2px solid ${destType==="new"?"#134E4A":"#eee"}`, borderRadius:"12px", padding:"12px", cursor:"pointer", textAlign:"left" }}>
                <div style={{ fontWeight:700, fontSize:"13px", color:"#134E4A" }}>✨ নতুন Folder তৈরি করুন</div>
                {destType==="new" && (
                  <div style={{ marginTop:"10px" }} onClick={e=>e.stopPropagation()}>
                    <div style={{ fontSize:"11px", fontWeight:700, color:"#555", marginBottom:"6px" }}>Folder Icon:</div>
                    <div style={{ display:"flex", gap:"6px", marginBottom:"10px", flexWrap:"wrap" }}>
                      {["📘","📗","📕","📙","📓","📒","🗂","📂","✏️","🔖"].map(ic=>(
                        <button key={ic} onClick={()=>setNewFolderIcon(ic)} style={{ width:"34px", height:"34px", border:`2px solid ${newFolderIcon===ic?"#134E4A":"#ddd"}`, borderRadius:"8px", background:newFolderIcon===ic?"#DCFCE7":"#fff", cursor:"pointer", fontSize:"18px" }}>{ic}</button>
                      ))}
                    </div>
                    <div style={{ fontSize:"11px", fontWeight:700, color:"#555", marginBottom:"4px" }}>Folder Name:</div>
                    <input value={newFolderName} onChange={e=>setNewFolderName(e.target.value)} placeholder="e.g. HSC English" style={{ width:"100%", border:"1.5px solid #86EFAC", borderRadius:"8px", padding:"8px 10px", fontSize:"13px", outline:"none", boxSizing:"border-box" }} />
                  </div>
                )}
              </button>

              <button onClick={doSave} style={{ width:"100%", background:"#1A2F5A", color:"#fff", border:"none", borderRadius:"10px", padding:"12px", fontWeight:800, cursor:"pointer", fontSize:"14px", marginTop:"14px" }}>
                ✓ Save করুন
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Passage View ──────────────────────────────────────────────────────
function PassageView({ passage, onBack }) {
  const [filter, setFilter] = useState("all");
  const [showPassage, setShowPassage] = useState(false);
  const filtered = filter==="all" ? passage.words : passage.words.filter(w=>w.type===filter);

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%" }}>
      {/* Header */}
      <div style={{ background:"#1A2F5A", padding:"12px 16px 10px", flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
          <button onClick={onBack} style={{ background:"rgba(255,255,255,.15)", border:"none", color:"#fff", borderRadius:"8px", width:"32px", height:"32px", cursor:"pointer", fontSize:"16px" }}>‹</button>
          <div style={{ flex:1 }}>
            <div style={{ color:"#BFDBFE", fontSize:"10px", fontWeight:700, letterSpacing:"1px" }}>PASSAGE {passage.passageNo}  ·  {passage.board}'{passage.year}</div>
            <div style={{ color:"#fff", fontSize:"14px", fontWeight:800, marginTop:"1px" }}>Synonym & Antonym Notes</div>
          </div>
        </div>
        {/* Stats row */}
        <div style={{ display:"flex", gap:"6px", marginTop:"10px" }}>
          <span style={{ background:"rgba(255,255,255,.15)", color:"#BFDBFE", borderRadius:"6px", padding:"3px 10px", fontSize:"11px", fontWeight:700 }}>
            {passage.words.length} words
          </span>
          <span style={{ background:passageC("syn"), color:"#BFDBFE", borderRadius:"6px", padding:"3px 10px", fontSize:"11px", fontWeight:700 }}>
            {passage.words.filter(w=>w.type==="syn").length} SYN
          </span>
          <span style={{ background:passageC("ant"), color:"#FCA5A5", borderRadius:"6px", padding:"3px 10px", fontSize:"11px", fontWeight:700 }}>
            {passage.words.filter(w=>w.type==="ant").length} ANT
          </span>
          <button onClick={()=>setShowPassage(p=>!p)} style={{ marginLeft:"auto", background:"rgba(255,255,255,.15)", border:"none", color:"#DCFCE7", borderRadius:"6px", padding:"3px 10px", fontSize:"11px", fontWeight:700, cursor:"pointer" }}>
            {showPassage?"▲":"▼"} Passage
          </button>
        </div>
      </div>

      {/* Passage text */}
      {showPassage && (
        <div style={{ background:"#FFFDF0", borderBottom:"1px solid #FEF3C7", padding:"10px 14px", fontSize:"12px", color:"#333", lineHeight:"1.7", flexShrink:0 }}>
          <span style={{ fontWeight:700, color:"#92400E", fontSize:"10px" }}>EN  </span>{passage.en}
          {passage.bn && <><br/><span style={{ fontWeight:700, color:"#92400E", fontSize:"10px" }}>BN  </span><span style={{ color:"#666" }}>{passage.bn}</span></>}
        </div>
      )}

      {/* Filter bar */}
      <div style={{ background:"#fff", borderBottom:"1px solid #eee", padding:"8px 14px", display:"flex", gap:"6px", flexShrink:0 }}>
        {[["all","সব শব্দ"],["syn","Synonyms"],["ant","Antonyms"]].map(([v,l])=>(
          <button key={v} onClick={()=>setFilter(v)} style={{
            padding:"4px 12px", borderRadius:"16px", border:"none", fontSize:"11.5px", fontWeight:700, cursor:"pointer",
            background:filter===v?(v==="ant"?"#991B1B":v==="syn"?"#1A2F5A":"#1A2F5A"):"#f0f0f0",
            color:filter===v?"#fff":"#666",
          }}>{l}</button>
        ))}
      </div>

      {/* Word cards */}
      <div style={{ flex:1, overflowY:"auto", padding:"12px 14px" }}>
        {filtered.map((w,i) => <WordCard key={i} w={w} />)}
      </div>
    </div>
  );
}

const passageC = (t) => t==="syn" ? "rgba(219,234,254,.25)" : "rgba(254,226,226,.25)";

// ── Folder View ───────────────────────────────────────────────────────
function FolderView({ folder, onBack, onPassageOpen }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%" }}>
      <div style={{ background:folder.color, padding:"14px 16px 12px", flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
          <button onClick={onBack} style={{ background:"rgba(255,255,255,.2)", border:"none", color:"#fff", borderRadius:"8px", width:"32px", height:"32px", cursor:"pointer", fontSize:"16px" }}>‹</button>
          <span style={{ fontSize:"24px" }}>{folder.icon}</span>
          <div>
            <div style={{ color:"rgba(255,255,255,.7)", fontSize:"10px", fontWeight:700, letterSpacing:"1px" }}>FOLDER</div>
            <div style={{ color:"#fff", fontSize:"16px", fontWeight:800 }}>{folder.name}</div>
          </div>
        </div>
        <div style={{ color:"rgba(255,255,255,.7)", fontSize:"11.5px", marginTop:"8px" }}>
          {folder.passages.length} passage{folder.passages.length!==1?"s":" · "} · {folder.passages.reduce((s,p)=>s+p.words.length,0)} total words
        </div>
      </div>

      <div style={{ flex:1, overflowY:"auto", padding:"12px" }}>
        {folder.passages.length === 0 && (
          <div style={{ textAlign:"center", padding:"40px 20px", color:"#aaa" }}>
            <div style={{ fontSize:"32px", marginBottom:"8px" }}>📭</div>
            কোনো passage নেই। Code Add করে passage যোগ করুন।
          </div>
        )}
        {folder.passages.map((p,i) => (
          <div key={i} onClick={()=>onPassageOpen(p)} style={{ background:"#fff", border:"1.5px solid #E2E8F0", borderRadius:"12px", padding:"12px 14px", marginBottom:"8px", cursor:"pointer", display:"flex", alignItems:"center", gap:"12px", boxShadow:"0 1px 4px rgba(0,0,0,.06)" }}>
            <div style={{ background:folder.color, color:"#fff", width:"44px", height:"44px", borderRadius:"10px", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:"16px", flexShrink:0 }}>
              {p.passageNo}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:800, fontSize:"14px", color:"#1A2F5A" }}>Passage {p.passageNo}</div>
              <div style={{ fontSize:"11px", color:"#888", marginTop:"2px" }}>{p.board}'{p.year} · {p.words.length} words</div>
            </div>
            <div style={{ display:"flex", gap:"4px" }}>
              <span style={{ background:"#DBEAFE", color:"#1A2F5A", borderRadius:"4px", padding:"2px 7px", fontSize:"10px", fontWeight:700 }}>{p.words.filter(w=>w.type==="syn").length}S</span>
              <span style={{ background:"#FEE2E2", color:"#991B1B", borderRadius:"4px", padding:"2px 7px", fontSize:"10px", fontWeight:700 }}>{p.words.filter(w=>w.type==="ant").length}A</span>
            </div>
            <span style={{ color:"#ccc", fontSize:"18px" }}>›</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Three-dot Menu ─────────────────────────────────────────────────────
function ThreeDotMenu({ onClose }) {
  const items = [
    { icon:"⚙️", label:"Settings", sub:"Coming soon...", disabled:true },
    { icon:"📊", label:"Statistics", sub:"Coming soon...", disabled:true },
    { icon:"🔔", label:"Notifications", sub:"Coming soon...", disabled:true },
    { icon:"ℹ️", label:"About Mutu Study", sub:"v1.0  ·  HSC Study App", disabled:false },
  ];
  return (
    <div style={{ position:"fixed", inset:0, zIndex:300 }} onClick={onClose}>
      <div style={{ position:"absolute", top:"54px", right:"calc(50% - 200px)", background:"#fff", borderRadius:"12px", boxShadow:"0 8px 32px rgba(0,0,0,.18)", overflow:"hidden", minWidth:"200px" }} onClick={e=>e.stopPropagation()}>
        {items.map((it,i) => (
          <div key={i} style={{ padding:"12px 16px", display:"flex", alignItems:"center", gap:"12px", borderBottom:i<items.length-1?"1px solid #f5f5f5":"none", opacity:it.disabled?.5:1, cursor:it.disabled?"default":"pointer" }}>
            <span style={{ fontSize:"18px" }}>{it.icon}</span>
            <div>
              <div style={{ fontWeight:700, fontSize:"13px", color:"#1A2F5A" }}>{it.label}</div>
              <div style={{ fontSize:"10.5px", color:"#aaa" }}>{it.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────
export default function App() {
  const [folders, setFolders] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [screen, setScreen] = useState("home"); // home | folder | passage
  const [activeFolder, setActiveFolder] = useState(null);
  const [activePassage, setActivePassage] = useState(null);
  const [showAddCode, setShowAddCode] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // Load from storage
  useEffect(() => {
    (async () => {
      try {
        const res = localStorage.getItem("mutu_folders");
        if (res) {
          const d = JSON.parse(res);
          setFolders(d.length ? d : SEED_FOLDERS);
        } else {
          setFolders(SEED_FOLDERS);
        }
      } catch(e) {
        setFolders(SEED_FOLDERS);
      }
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    (async () => {
      try { localStorage.setItem("mutu_folders", JSON.stringify(folders)); } catch(e) {}
    })();
  }, [folders, loaded]);

  const handleSave = ({ type, folderName, folderIcon, folderId, passage }) => {
    if (type === "new") {
      setFolders(f => [...f, {
        id: "folder_" + Date.now(),
        name: folderName,
        icon: folderIcon || "📘",
        color: ["#1A2F5A","#134E4A","#7C2D12","#3730A3","#0E7490"][f.length % 5],
        passages: [passage]
      }]);
    } else {
      setFolders(f => f.map(folder => folder.id===folderId ? { ...folder, passages:[...folder.passages, passage] } : folder));
    }
    setShowAddCode(false);
  };

  const totalWords = folders.reduce((s,f) => s + f.passages.reduce((ss,p) => ss + p.words.length, 0), 0);
  const totalPassages = folders.reduce((s,f) => s + f.passages.length, 0);

  if (!loaded) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", background:"#F0F4FF", fontFamily:"Segoe UI, sans-serif" }}>
      <div style={{ color:"#1A2F5A", fontWeight:700, fontSize:"16px" }}>Loading Mutu Study...</div>
    </div>
  );

  return (
    <div style={{ display:"flex", justifyContent:"center", alignItems:"center", minHeight:"100vh", background:"#E8EDF5", fontFamily:"'Segoe UI','Noto Sans Bengali',sans-serif" }}>
      {/* Phone shell */}
      <div style={{ width:"100%", maxWidth:"430px", height:"100dvh", maxHeight:"860px", background:"#F0F4FF", display:"flex", flexDirection:"column", overflow:"hidden", borderRadius:"0", boxShadow:"0 20px 60px rgba(0,0,0,.3)", position:"relative" }}>

        {/* ── HOME SCREEN ── */}
        {screen === "home" && (
          <>
            {/* App bar */}
            <div style={{ background:"#1A2F5A", padding:"14px 18px 12px", flexShrink:0 }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <div>
                  <div style={{ color:"#BFDBFE", fontSize:"10px", fontWeight:700, letterSpacing:"2px" }}>YOUR STUDY APP</div>
                  <div style={{ color:"#fff", fontSize:"22px", fontWeight:900, letterSpacing:".5px" }}>Mutu Study</div>
                </div>
                <button onClick={()=>setShowMenu(s=>!s)} style={{ background:"rgba(255,255,255,.15)", border:"none", color:"#fff", borderRadius:"50%", width:"38px", height:"38px", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"4px" }}>
                  <div style={{ width:"16px", height:"2px", background:"#fff", borderRadius:"1px" }}/>
                  <div style={{ width:"16px", height:"2px", background:"#fff", borderRadius:"1px" }}/>
                  <div style={{ width:"16px", height:"2px", background:"#fff", borderRadius:"1px" }}/>
                </button>
              </div>
              {/* Stats chips */}
              <div style={{ display:"flex", gap:"8px", marginTop:"12px" }}>
                <div style={{ background:"rgba(255,255,255,.12)", borderRadius:"8px", padding:"6px 12px", flex:1, textAlign:"center" }}>
                  <div style={{ color:"#fff", fontSize:"18px", fontWeight:800 }}>{folders.length}</div>
                  <div style={{ color:"#BFDBFE", fontSize:"10px", fontWeight:600 }}>Folders</div>
                </div>
                <div style={{ background:"rgba(255,255,255,.12)", borderRadius:"8px", padding:"6px 12px", flex:1, textAlign:"center" }}>
                  <div style={{ color:"#fff", fontSize:"18px", fontWeight:800 }}>{totalPassages}</div>
                  <div style={{ color:"#BFDBFE", fontSize:"10px", fontWeight:600 }}>Passages</div>
                </div>
                <div style={{ background:"rgba(255,255,255,.12)", borderRadius:"8px", padding:"6px 12px", flex:1, textAlign:"center" }}>
                  <div style={{ color:"#fff", fontSize:"18px", fontWeight:800 }}>{totalWords}</div>
                  <div style={{ color:"#BFDBFE", fontSize:"10px", fontWeight:600 }}>Words</div>
                </div>
              </div>
            </div>

            {/* Folders */}
            <div style={{ flex:1, overflowY:"auto", padding:"14px 12px" }}>
              <div style={{ fontSize:"11px", fontWeight:700, color:"#888", letterSpacing:"1px", marginBottom:"10px", paddingLeft:"4px" }}>MY FOLDERS</div>
              {folders.map((f,i) => (
                <div key={i} onClick={()=>{ setActiveFolder(f); setScreen("folder"); }} style={{
                  background:"#fff", borderRadius:"14px", padding:"14px 16px", marginBottom:"10px", cursor:"pointer",
                  display:"flex", alignItems:"center", gap:"14px",
                  boxShadow:"0 2px 8px rgba(0,0,0,.07)", border:"1.5px solid #E8EDF5"
                }}>
                  <div style={{ background:f.color, width:"50px", height:"50px", borderRadius:"14px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"24px", flexShrink:0 }}>
                    {f.icon}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:800, fontSize:"15px", color:f.color }}>{f.name}</div>
                    <div style={{ fontSize:"11.5px", color:"#888", marginTop:"2px" }}>
                      {f.passages.length} passage{f.passages.length!==1?"s":""} · {f.passages.reduce((s,p)=>s+p.words.length,0)} words
                    </div>
                    <div style={{ display:"flex", gap:"4px", marginTop:"6px" }}>
                      {f.passages.slice(0,4).map((p,j)=>(
                        <span key={j} style={{ background:f.color+"22", color:f.color, borderRadius:"5px", padding:"2px 7px", fontSize:"10px", fontWeight:700 }}>P{p.passageNo}</span>
                      ))}
                      {f.passages.length>4 && <span style={{ color:"#aaa", fontSize:"10px", padding:"2px 4px" }}>+{f.passages.length-4}</span>}
                    </div>
                  </div>
                  <span style={{ color:"#ccc", fontSize:"20px" }}>›</span>
                </div>
              ))}

              {folders.length === 0 && (
                <div style={{ textAlign:"center", padding:"40px 20px", color:"#aaa" }}>
                  <div style={{ fontSize:"36px", marginBottom:"8px" }}>📚</div>
                  <div style={{ fontWeight:700, fontSize:"14px", color:"#888" }}>কোনো folder নেই</div>
                  <div style={{ fontSize:"12px", marginTop:"4px" }}>নিচের বাটনে ক্লিক করে code paste করুন</div>
                </div>
              )}
            </div>

            {/* Code Add FAB */}
            <div style={{ padding:"12px 14px", background:"#fff", borderTop:"1px solid #E8EDF5", flexShrink:0 }}>
              <button onClick={()=>setShowAddCode(true)} style={{
                width:"100%", background:"linear-gradient(135deg,#1A2F5A,#134E4A)", color:"#fff", border:"none",
                borderRadius:"14px", padding:"14px", fontWeight:800, cursor:"pointer", fontSize:"15px",
                display:"flex", alignItems:"center", justifyContent:"center", gap:"8px",
                boxShadow:"0 4px 16px rgba(26,47,90,.3)"
              }}>
                <span style={{ fontSize:"18px" }}>📋</span>
                Code Add করুন
              </button>
            </div>
          </>
        )}

        {/* ── FOLDER SCREEN ── */}
        {screen === "folder" && activeFolder && (
          <FolderView
            folder={folders.find(f=>f.id===activeFolder.id) || activeFolder}
            onBack={()=>setScreen("home")}
            onPassageOpen={p=>{setActivePassage(p);setScreen("passage");}}
          />
        )}

        {/* ── PASSAGE SCREEN ── */}
        {screen === "passage" && activePassage && (
          <PassageView
            passage={activePassage}
            onBack={()=>setScreen("folder")}
          />
        )}

        {/* Three-dot menu */}
        {showMenu && <ThreeDotMenu onClose={()=>setShowMenu(false)} />}

        {/* Code Add modal */}
        {showAddCode && (
          <CodeAddModal
            folders={folders}
            onClose={()=>setShowAddCode(false)}
            onSave={handleSave}
          />
        )}
      </div>

      <style>{`
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width:4px; height:4px; }
        ::-webkit-scrollbar-thumb { background:#BFDBFE; border-radius:2px; }
        ::-webkit-scrollbar-track { background:transparent; }
        button:active { opacity:.85; transform:scale(.98); }
      `}</style>
    </div>
  );
}
