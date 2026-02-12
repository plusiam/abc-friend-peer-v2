import { useState, useEffect } from "react";

/* ═══════════════════════════════════════════════
   🎨 디자인 시스템 — "Soft Playground"
   ═══════════════════════════════════════════════ */
const DS = {
  color: {
    bg: "#FAFAF6", surface: "#FFFFFF", surfaceHover: "#F7F7F3",
    ink: "#1A1A2E", inkSoft: "#6B6D7B", inkMuted: "#A8AABB",
    border: "#EEEDF2", borderFocus: "#C4B5FD",
    accent: "#FF7E5F", accentLight: "#FFF0EB",
    accentGrad: "linear-gradient(135deg, #FF7E5F, #FEB47B)",
    s1: "#14B8A6", s1Bg: "#F0FDFA", s1Soft: "#CCFBF1",
    s2: "#818CF8", s2Bg: "#F5F3FF", s2Soft: "#E0E7FF",
    s3: "#F59E0B", s3Bg: "#FFFBEB", s3Soft: "#FEF3C7",
    s4: "#EC4899", s4Bg: "#FDF2F8", s4Soft: "#FCE7F3",
    success: "#10B981", successBg: "#ECFDF5",
  },
  radius: { sm: 10, md: 16, lg: 24, xl: 32, full: 9999 },
  shadow: {
    sm: "0 1px 3px rgba(26,26,46,0.04)", md: "0 4px 20px rgba(26,26,46,0.06)",
    lg: "0 12px 40px rgba(26,26,46,0.08)", glow: (c) => `0 8px 32px ${c}25`,
  },
  transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
};

/* ═══════════════════════════════════════════════
   📦 데이터
   ═══════════════════════════════════════════════ */
const EMOTIONS = [
  { emoji: "😢", name: "슬퍼요", hue: 220 },
  { emoji: "😠", name: "화나요", hue: 0 },
  { emoji: "😟", name: "걱정돼요", hue: 270 },
  { emoji: "😞", name: "실망했어요", hue: 30 },
  { emoji: "😨", name: "무서워요", hue: 250 },
  { emoji: "😳", name: "부끄러워요", hue: 340 },
  { emoji: "😤", name: "답답해요", hue: 45 },
  { emoji: "🥺", name: "외로워요", hue: 200 },
  { emoji: "😣", name: "억울해요", hue: 350 },
  { emoji: "😶", name: "모르겠어요", hue: 210 },
];

const WORRIES = {
  "학교생활": { icon: "📚", items: [
    { text: "시험 성적이 나빠서 속상해", a: "열심히 공부했는데 성적이 안 좋게 나옴", b: "노력해도 안 되나봐", c: "속상하고 부끄러움" },
    { text: "발표하는 게 너무 떨려", a: "발표 시간에 앞에 나가면 목소리가 떨림", b: "실수하면 다들 비웃을 거야", c: "심장이 빨리 뛰고 두려움" },
    { text: "새 학급에 적응하기 어려워", a: "새 학기인데 아직 친한 친구가 없음", b: "나랑 같이 있으면 재미없나봐", c: "쉬는 시간이 두렵고 외로움" },
  ]},
  "친구관계": { icon: "💛", items: [
    { text: "친구와 싸웠어", a: "친구가 내 물건을 허락 없이 가져감", b: "나를 무시하는 것 같아", c: "화가 나서 소리 지름" },
    { text: "비밀을 다른 애한테 말했어", a: "친구에게만 말한 비밀이 퍼짐", b: "배신당한 느낌이야", c: "배신감과 분노" },
    { text: "나만 빼고 놀아", a: "친구들 모임에 나만 초대 안 받음", b: "나를 싫어하나봐", c: "소외감과 외로움" },
  ]},
  "가족관계": { icon: "🏠", items: [
    { text: "마음을 몰라주시는 것 같아", a: "고민을 말해도 대수롭지 않게 넘기심", b: "내 감정에 관심이 없어", c: "답답하고 서운함" },
    { text: "동생이랑 자꾸 싸워", a: "사소한 일로 동생과 자주 다툼", b: "동생만 예뻐하시는 것 같아", c: "화가 나고 억울함" },
  ]},
  "마음과 자신감": { icon: "💪", items: [
    { text: "자꾸 불안한 마음이 들어", a: "특별한 이유 없이 불안감을 느낌", b: "나쁜 일이 생길 것 같아", c: "집중이 어렵고 잠을 못 잠" },
    { text: "나만 못하는 것 같아", a: "친구들은 잘하는데 나만 실수함", b: "나는 재능이 없나봐", c: "자신감이 떨어지고 도전을 피함" },
  ]},
};

// 2단계용 공감 표현 옵션
const THOUGHTS = ["정말 힘들었겠구나", "많이 당황스러웠겠어", "어떻게 해야 할지 막막했겠어", "마음이 복잡했겠구나"];
const FEELINGS = ["속상한 마음이 들었겠다", "화가 났겠다", "걱정이 많았겠다", "두려웠겠다", "답답했겠다"];
const CLOSINGS = ["네 마음을 이해해. 혼자가 아니야.", "그런 기분이 드는 건 자연스러운 거야.", "네 감정은 중요해.", "함께 방법을 찾아보자."];

// 3단계용 체크리스트
const CHECKLISTS = {
  "학교생활": {
    thinking: ["한 번의 시험으로 모든 것이 결정되지 않아", "실수는 배움의 기회가 될 수 있어", "모든 사람은 각자의 속도가 있어", "노력하는 과정 자체가 소중해"],
    help: ["어려운 문제는 선생님께 질문하기", "매일 조금씩 공부 계획 세우기", "친구들과 함께 공부하기", "작은 목표부터 달성해보기"],
  },
  "친구관계": {
    thinking: ["친구도 실수할 수 있어", "대화로 해결할 수 있어", "진짜 친구는 이해해줄 거야", "혼자가 아니야, 다른 친구들도 있어"],
    help: ["친구와 솔직하게 대화하기", "먼저 사과하거나 이해하려 노력하기", "새로운 친구 만들어보기", "선생님께 조언 구하기"],
  },
  "가족관계": {
    thinking: ["가족도 완벽하지 않아", "시간을 두고 대화하면 이해할 수 있어", "내 감정을 표현하는 것이 중요해", "가족은 나를 사랑해"],
    help: ["차분할 때 마음을 전달하기", "가족과 함께 시간 보내기", "감사한 마음 표현하기", "서로의 입장 이해하려 노력하기"],
  },
  "마음과 자신감": {
    thinking: ["이런 감정을 느끼는 건 자연스러운 거야", "시간이 지나면 나아질 거야", "나도 소중한 사람이야", "작은 성공도 큰 의미가 있어"],
    help: ["믿을 만한 어른에게 이야기하기", "좋아하는 활동하며 기분 전환하기", "자신의 장점 찾아보기", "충분한 수면과 휴식 취하기"],
  },
};

const ENCOURAGE_MSGS = [
  "너의 마음을 이해해주는 사람이 여기 있어 ✨",
  "힘든 시간도 지나갈 거야, 조금만 더 힘내자 💪",
  "너는 생각보다 훨씬 강한 사람이야 🌟",
  "완벽하지 않아도 괜찮아, 그것이 바로 너니까 🤗",
  "오늘 하루도 최선을 다한 너에게 박수를 보내 👏",
  "네가 웃으면 세상이 더 밝아져 🌞",
  "작은 한 걸음이 큰 변화를 만들어 🚶",
  "실패는 끝이 아니야, 새로운 시작이야 🌱",
];

const STEPS_DATA = [
  { n: 1, label: "공감", color: DS.color.s1 },
  { n: 2, label: "표현", color: DS.color.s2 },
  { n: 3, label: "도움", color: DS.color.s3 },
  { n: 4, label: "격려", color: DS.color.s4 },
];

/* ═══════════════════════════════════════════════
   🏠 메인 앱
   ═══════════════════════════════════════════════ */
export default function App() {
  const [view, setView] = useState("splash");
  const [names, setNames] = useState({ counselor: "", client: "" });
  const [worry, setWorry] = useState(null);
  const [emotions, setEmotions] = useState([]);
  const [customEmo, setCustomEmo] = useState("");
  // 2단계
  const [empathy, setEmpathy] = useState({ thought: "", feeling: "", closing: "" });
  const [empathyText, setEmpathyText] = useState("");
  // 3단계
  const [thinkChecks, setThinkChecks] = useState([]);
  const [helpChecks, setHelpChecks] = useState([]);
  const [newThinking, setNewThinking] = useState("");
  const [helpSuggestions, setHelpSuggestions] = useState("");
  // 4단계
  const [drawnMsg, setDrawnMsg] = useState("");
  const [personalMsg, setPersonalMsg] = useState("");
  const [promise, setPromise] = useState(false);
  const [usedMsgs, setUsedMsgs] = useState([]);
  // 전환
  const [phase, setPhase] = useState("enter");

  const cl = names.client || "친구";
  const cat = worry?.category || "학교생활";
  const checks = CHECKLISTS[cat] || CHECKLISTS["학교생활"];

  const go = (next) => {
    setPhase("exit");
    setTimeout(() => { setView(next); setPhase("enter"); window.scrollTo(0, 0); }, 280);
  };

  const anim = {
    opacity: phase === "enter" ? 1 : 0,
    transform: phase === "enter" ? "translateY(0)" : "translateY(16px)",
    transition: "opacity 0.3s ease, transform 0.35s ease",
  };

  // 2단계: 공감 표현 자동 생성
  useEffect(() => {
    if (!worry) return;
    const parts = [`${worry.a}으로`];
    if (empathy.thought) parts.push(empathy.thought);
    if (empathy.feeling) parts.push(empathy.feeling);
    if (empathy.closing) parts.push(empathy.closing);
    if (parts.length > 1) setEmpathyText(parts.join(". ") + ".");
  }, [empathy, worry]);

  return (
    <div style={{ minHeight: "100vh", background: DS.color.bg, fontFamily: "system-ui, -apple-system, sans-serif", color: DS.color.ink, WebkitFontSmoothing: "antialiased" }}>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, opacity: 0.015,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: "200px" }} />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 480, margin: "0 auto", padding: "0 20px", ...anim }}>
        {view === "splash" && <Splash onGo={() => go("names")} />}
        {view === "names" && <Names names={names} setNames={setNames} onGo={() => go("worry")} onBack={() => go("splash")} />}
        {view === "worry" && <Worry worry={worry} setWorry={setWorry} client={cl} onGo={() => go("step1")} onBack={() => go("names")} />}
        {view === "step1" && <Step1 emotions={emotions} setEmotions={setEmotions} customEmo={customEmo} setCustomEmo={setCustomEmo} worry={worry} client={cl} onGo={() => go("step2")} onBack={() => go("worry")} />}
        {view === "step2" && <Step2 worry={worry} client={cl} empathy={empathy} setEmpathy={setEmpathy} empathyText={empathyText} setEmpathyText={setEmpathyText} emotions={emotions} onGo={() => go("step3")} onBack={() => go("step1")} />}
        {view === "step3" && <Step3 client={cl} checks={checks} cat={cat} thinkChecks={thinkChecks} setThinkChecks={setThinkChecks} helpChecks={helpChecks} setHelpChecks={setHelpChecks} newThinking={newThinking} setNewThinking={setNewThinking} helpSuggestions={helpSuggestions} setHelpSuggestions={setHelpSuggestions} onGo={() => go("step4")} onBack={() => go("step2")} />}
        {view === "step4" && <Step4 client={cl} drawnMsg={drawnMsg} setDrawnMsg={setDrawnMsg} personalMsg={personalMsg} setPersonalMsg={setPersonalMsg} promise={promise} setPromise={setPromise} usedMsgs={usedMsgs} setUsedMsgs={setUsedMsgs} onGo={() => go("result")} onBack={() => go("step3")} />}
        {view === "result" && <Result names={names} worry={worry} emotions={emotions} empathyText={empathyText} newThinking={newThinking} helpSuggestions={helpSuggestions} drawnMsg={drawnMsg} personalMsg={personalMsg} promise={promise} />}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   ✦ 스플래시 / 온보딩
   ═══════════════════════════════════════════════ */
function Splash({ onGo }) {
  const [ready, setReady] = useState(false);
  useEffect(() => { setTimeout(() => setReady(true), 100); }, []);
  const s = (i) => ({ opacity: ready ? 1 : 0, transform: ready ? "translateY(0)" : "translateY(28px)", transition: `opacity 0.6s ease ${i*0.12}s, transform 0.6s cubic-bezier(0.22,1,0.36,1) ${i*0.12}s` });

  return (
    <div style={{ paddingTop: 72, paddingBottom: 40 }}>
      <div style={{ ...s(0), width: 64, height: 64, borderRadius: DS.radius.lg, background: DS.color.accentGrad, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, marginBottom: 28, boxShadow: DS.shadow.glow(DS.color.accent) }}>🌈</div>
      <h1 style={{ ...s(1), fontSize: 36, fontWeight: 800, lineHeight: 1.2, letterSpacing: -1, marginBottom: 12 }}>친구의 마음을<br />이해하고 도와주세요</h1>
      <p style={{ ...s(2), fontSize: 16, color: DS.color.inkSoft, lineHeight: 1.6, marginBottom: 40, maxWidth: 320 }}>ABC 모델로 배우는 4단계 또래 상담.<br />차근차근 따라가면 누구나 할 수 있어요.</p>
      <div style={{ ...s(3), display: "flex", flexDirection: "column", gap: 10, marginBottom: 44 }}>
        {[{ l: "A", w: "Activating event", k: "사실 — 무슨 일이 있었나요?", c: "#FF7E5F" },
          { l: "B", w: "Belief", k: "생각 — 어떤 생각이 들었나요?", c: "#FEB47B" },
          { l: "C", w: "Consequence", k: "결과 — 어떤 감정이 나왔나요?", c: "#818CF8" }
        ].map((d) => (
          <div key={d.l} style={{ display: "flex", alignItems: "center", gap: 14, background: DS.color.surface, borderRadius: DS.radius.md, padding: "14px 18px", border: `1px solid ${DS.color.border}` }}>
            <div style={{ minWidth: 40, height: 40, borderRadius: DS.radius.sm, background: d.c, color: "#fff", fontWeight: 800, fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>{d.l}</div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 600, color: DS.color.inkMuted, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 2 }}>{d.w}</div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{d.k}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={s(4)}>
        <Btn onClick={onGo}>시작하기</Btn>
        <p style={{ textAlign: "center", fontSize: 12, color: DS.color.inkMuted, marginTop: 16 }}>🔒 입력한 내용은 이 기기에만 저장됩니다</p>
      </div>
    </div>
  );
}

/* ✦ 이름 입력 */
function Names({ names, setNames, onGo, onBack }) {
  const ok = names.counselor.trim() && names.client.trim();
  return (
    <div style={{ paddingTop: 24, paddingBottom: 40 }}>
      <TopBar onBack={onBack} />
      <SectionLabel>시작하기 전에</SectionLabel>
      <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.5, marginBottom: 24 }}>이름을 알려주세요</h2>
      <Card>
        <Field label="상담해주는 친구" icon="🧑‍⚕️" value={names.counselor} onChange={(v) => setNames({...names, counselor:v})} placeholder="이름을 입력하세요" />
        <div style={{ height: 1, background: DS.color.border, margin: "4px 0" }} />
        <Field label="도움이 필요한 친구" icon="💛" value={names.client} onChange={(v) => setNames({...names, client:v})} placeholder="이름을 입력하세요" />
      </Card>
      <div style={{ marginTop: 32 }}><Btn onClick={onGo} disabled={!ok}>다음</Btn></div>
    </div>
  );
}

/* ✦ 고민 선택 */
function Worry({ worry, setWorry, client, onGo, onBack }) {
  const [open, setOpen] = useState(null);
  const [mode, setMode] = useState("pick");
  const [custom, setCustom] = useState({ a: "", b: "", c: "" });
  const pick = (item, cat) => setWorry({ ...item, category: cat });
  const saveCustom = () => {
    if (custom.a && custom.b && custom.c) setWorry({ text: custom.a.slice(0, 30) + "...", ...custom, category: "마음과 자신감" });
  };

  return (
    <div style={{ paddingTop: 24, paddingBottom: 40 }}>
      <TopBar onBack={onBack} />
      <ProgressBar step={0} />
      <SectionLabel>{client}의 이야기</SectionLabel>
      <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.5, marginBottom: 20 }}>어떤 고민인가요?</h2>

      <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
        {[["pick","사례 선택"],["write","직접 입력"]].map(([k,l]) => (
          <button key={k} onClick={() => setMode(k)} style={{ padding: "8px 18px", borderRadius: DS.radius.full, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", background: mode===k ? DS.color.ink : DS.color.surface, color: mode===k ? "#fff" : DS.color.inkSoft, transition: DS.transition }}>{l}</button>
        ))}
      </div>

      {mode === "pick" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {Object.entries(WORRIES).map(([cat, { icon, items }]) => (
            <Card key={cat} style={{ padding: 0, overflow: "hidden" }}>
              <button onClick={() => setOpen(open===cat ? null : cat)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", border: "none", background: "transparent", cursor: "pointer", fontSize: 15, fontWeight: 600, color: DS.color.ink }}>
                <span>{icon} {cat}</span>
                <span style={{ fontSize: 11, color: DS.color.inkMuted, transform: open===cat ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.3s ease" }}>▾</span>
              </button>
              {open===cat && (
                <div style={{ padding: "0 16px 14px", display: "flex", flexDirection: "column", gap: 6 }}>
                  {items.map((item, i) => {
                    const active = worry?.text === item.text;
                    return (
                      <button key={i} onClick={() => pick(item, cat)} style={{ width: "100%", textAlign: "left", padding: "12px 16px", borderRadius: DS.radius.sm, border: active ? `2px solid ${DS.color.accent}` : `1.5px solid ${DS.color.border}`, background: active ? DS.color.accentLight : "transparent", cursor: "pointer", fontSize: 14, color: DS.color.ink, fontWeight: active ? 600 : 400, transition: DS.transition }}>
                        {active && <span style={{ float: "right", color: DS.color.accent }}>✓</span>}
                        {item.text}
                      </button>
                    );
                  })}
                </div>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <p style={{ fontSize: 13, color: DS.color.inkSoft, marginBottom: 16, lineHeight: 1.5 }}>{client}의 고민을 ABC로 정리해보세요.</p>
          {[{k:"a",label:"A · 사실",c:"#FF7E5F",ph:"무슨 일이 있었나요?"},{k:"b",label:"B · 생각",c:"#FEB47B",ph:"어떤 생각이 들었나요?"},{k:"c",label:"C · 결과",c:"#818CF8",ph:"어떤 감정과 행동이 나왔나요?"}].map(({k,label,c,ph}) => (
            <div key={k} style={{ marginBottom: 16 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 700, color: c, marginBottom: 6 }}><span style={{ width: 6, height: 6, borderRadius: "50%", background: c }} />{label}</label>
              <textarea value={custom[k]} onChange={(e) => setCustom({...custom,[k]:e.target.value})} placeholder={ph} rows={2} style={taStyle} />
            </div>
          ))}
          {custom.a && custom.b && custom.c && <Btn onClick={saveCustom} small>저장하기</Btn>}
        </Card>
      )}

      {worry && (
        <div style={{ marginTop: 16, padding: "16px 20px", borderRadius: DS.radius.md, background: DS.color.accentLight, border: `1px solid ${DS.color.accent}22` }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: DS.color.accent, marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>선택한 고민</div>
          {[["A", worry.a, "#FF7E5F"], ["B", worry.b, "#FEB47B"], ["C", worry.c, "#818CF8"]].map(([l, t, c]) => (
            <div key={l} style={{ display: "flex", gap: 10, marginBottom: 4, fontSize: 13, lineHeight: 1.6 }}>
              <span style={{ fontWeight: 800, color: c, minWidth: 16 }}>{l}</span><span>{t}</span>
            </div>
          ))}
        </div>
      )}
      <div style={{ marginTop: 32 }}><Btn onClick={onGo} disabled={!worry}>다음 단계로</Btn></div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   ✦ 1단계: 마음 공감하기
   ═══════════════════════════════════════════════ */
function Step1({ emotions, setEmotions, customEmo, setCustomEmo, worry, client, onGo, onBack }) {
  const toggle = (name) => setEmotions(emotions.includes(name) ? emotions.filter(e=>e!==name) : [...emotions, name]);
  const addCustom = () => { if (!customEmo.trim()) return; if (!emotions.includes(customEmo.trim())) setEmotions([...emotions, customEmo.trim()]); setCustomEmo(""); };

  return (
    <div style={{ paddingTop: 24, paddingBottom: 40 }}>
      <TopBar onBack={onBack} />
      <ProgressBar step={1} />
      <SectionLabel color={DS.color.s1}>1단계 · 마음 공감하기</SectionLabel>
      <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.5 }}>{client}의 마음은<br />어떨까요?</h2>
      <p style={{ fontSize: 14, color: DS.color.inkSoft, marginTop: 8, lineHeight: 1.5, marginBottom: 20 }}>느꼈을 감정을 골라주세요. 여러 개 선택할 수 있어요.</p>

      {worry && <Chip color={DS.color.s1} bg={DS.color.s1Bg} border={DS.color.s1Soft}>💬 {worry.text}</Chip>}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
        {EMOTIONS.map((emo) => {
          const sel = emotions.includes(emo.name);
          const hsl = (s,l) => `hsl(${emo.hue},${s}%,${l}%)`;
          return (
            <button key={emo.name} onClick={() => toggle(emo.name)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px", borderRadius: DS.radius.md, border: sel ? `2px solid ${hsl(60,55)}` : `1.5px solid ${DS.color.border}`, background: sel ? hsl(80,96) : DS.color.surface, cursor: "pointer", transition: DS.transition, transform: sel ? "scale(1.02)" : "scale(1)", boxShadow: sel ? DS.shadow.glow(hsl(60,55)) : DS.shadow.sm, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: sel ? 4 : 0, background: hsl(60,55), transition: "width 0.2s ease" }} />
              <span style={{ fontSize: 30, lineHeight: 1, transition: "transform 0.2s ease", transform: sel ? "scale(1.15)" : "scale(1)" }}>{emo.emoji}</span>
              <span style={{ fontSize: 14, fontWeight: sel ? 700 : 500, color: sel ? hsl(50,30) : DS.color.inkSoft, transition: DS.transition }}>{emo.name}</span>
            </button>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        <input value={customEmo} onChange={(e)=>setCustomEmo(e.target.value)} onKeyDown={(e)=>e.key==="Enter"&&addCustom()} placeholder="다른 감정 직접 입력" style={inputStyle} />
        <button onClick={addCustom} style={{ padding: "0 20px", borderRadius: DS.radius.sm, border: "none", background: DS.color.s1, color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>추가</button>
      </div>

      {emotions.length > 0 && <TagBox color={DS.color.s1} bg={DS.color.s1Bg} border={DS.color.s1Soft} label={`선택한 감정 ${emotions.length}개`} items={emotions} onRemove={(e)=>setEmotions(emotions.filter(x=>x!==e))} />}
      <Btn disabled={emotions.length===0} onClick={onGo}>다음 단계로</Btn>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   ✦ 2단계: 공감 표현하기
   ═══════════════════════════════════════════════ */
function Step2({ worry, client, empathy, setEmpathy, empathyText, setEmpathyText, emotions, onGo, onBack }) {
  const autoFill = () => {
    setEmpathy({ thought: THOUGHTS[0], feeling: FEELINGS[0], closing: CLOSINGS[0] });
  };

  return (
    <div style={{ paddingTop: 24, paddingBottom: 40 }}>
      <TopBar onBack={onBack} />
      <ProgressBar step={2} />
      <SectionLabel color={DS.color.s2}>2단계 · 공감 표현하기</SectionLabel>
      <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.5, marginBottom: 8 }}>따뜻한 말을<br />만들어볼까요?</h2>
      <p style={{ fontSize: 14, color: DS.color.inkSoft, marginBottom: 20, lineHeight: 1.5 }}>ABC를 활용해 {client}에게 전할 공감의 말을 만들어보세요.</p>

      {/* 현재 상황 요약 */}
      <div style={{ marginBottom: 20, padding: "14px 18px", borderRadius: DS.radius.md, background: DS.color.s2Bg, border: `1px solid ${DS.color.s2Soft}` }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: DS.color.s2, marginBottom: 6 }}>🎯 현재 상황</div>
        <div style={{ fontSize: 13, color: DS.color.ink, lineHeight: 1.5 }}>{worry?.a}</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 8 }}>
          {emotions.map(e => <span key={e} style={{ fontSize: 11, padding: "2px 8px", borderRadius: DS.radius.full, background: "#fff", color: DS.color.s2, fontWeight: 500 }}>{e}</span>)}
        </div>
      </div>

      <Card>
        {/* 드롭다운 선택 */}
        {[
          { key: "thought", label: "B · 생각/공감", opts: THOUGHTS, c: "#FEB47B" },
          { key: "feeling", label: "C · 감정 인정", opts: FEELINGS, c: "#818CF8" },
          { key: "closing", label: "마무리", opts: CLOSINGS, c: DS.color.s2 },
        ].map(({ key, label, opts, c }) => (
          <div key={key} style={{ marginBottom: 16 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 700, color: c, marginBottom: 6 }}><span style={{ width: 6, height: 6, borderRadius: "50%", background: c }} />{label}</label>
            <select value={empathy[key]} onChange={(e) => setEmpathy({...empathy, [key]: e.target.value})} style={selectStyle}>
              <option value="">선택 안함</option>
              {opts.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        ))}

        <button onClick={autoFill} style={{ width: "100%", padding: "12px", borderRadius: DS.radius.sm, border: `1.5px solid ${DS.color.s2Soft}`, background: DS.color.s2Bg, color: DS.color.s2, fontWeight: 600, fontSize: 14, cursor: "pointer", transition: DS.transition, marginBottom: 16 }}>
          ⚡ 추천 표현 자동 생성
        </button>
      </Card>

      {/* 미리보기 & 편집 */}
      {empathyText && (
        <div style={{ marginTop: 16 }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: DS.color.ink, marginBottom: 8, display: "block" }}>✨ 완성된 공감 표현</label>
          <div style={{ padding: "16px 18px", borderRadius: DS.radius.md, background: `linear-gradient(135deg, ${DS.color.s2Bg}, #F0F0FF)`, border: `1.5px solid ${DS.color.s2Soft}`, marginBottom: 12 }}>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: DS.color.ink }}>{empathyText}</p>
          </div>
          <label style={{ fontSize: 13, fontWeight: 600, color: DS.color.inkSoft, marginBottom: 6, display: "block" }}>📝 필요하면 직접 수정하세요</label>
          <textarea value={empathyText} onChange={(e) => setEmpathyText(e.target.value)} rows={3} style={taStyle} />
        </div>
      )}

      <div style={{ marginTop: 24 }}><Btn onClick={onGo} disabled={!empathyText.trim()}>다음 단계로</Btn></div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   ✦ 3단계: 도움 찾기
   ═══════════════════════════════════════════════ */
function Step3({ client, checks, cat, thinkChecks, setThinkChecks, helpChecks, setHelpChecks, newThinking, setNewThinking, helpSuggestions, setHelpSuggestions, onGo, onBack }) {
  const toggleCheck = (list, setList, item) => list.includes(item) ? setList(list.filter(x=>x!==item)) : setList([...list, item]);
  const applyThink = () => { if (thinkChecks.length) { setNewThinking((newThinking ? newThinking+"\n\n" : "") + thinkChecks.join(". ") + "."); setThinkChecks([]); }};
  const applyHelp = () => { if (helpChecks.length) { setHelpSuggestions((helpSuggestions ? helpSuggestions+"\n\n" : "") + helpChecks.map((h,i)=>`${i+1}) ${h}`).join("\n")); setHelpChecks([]); }};

  return (
    <div style={{ paddingTop: 24, paddingBottom: 40 }}>
      <TopBar onBack={onBack} />
      <ProgressBar step={3} />
      <SectionLabel color={DS.color.s3}>3단계 · 도움 찾기</SectionLabel>
      <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.5, marginBottom: 8 }}>새로운 생각과<br />도움 방법을 찾아요</h2>
      <p style={{ fontSize: 14, color: DS.color.inkSoft, marginBottom: 20, lineHeight: 1.5 }}>{client}의 부정적인 생각을 바꾸고, 실천할 수 있는 방법을 제안해주세요.</p>

      {/* 새로운 생각 */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: DS.color.s3 }}>✨ 더 도움이 되는 생각</span>
          {thinkChecks.length > 0 && <button onClick={applyThink} style={applyBtnStyle(DS.color.s3)}>적용하기</button>}
        </div>
        <div style={{ fontSize: 12, color: DS.color.inkMuted, marginBottom: 10 }}>💭 {cat} 상황에 도움되는 생각들</div>
        {checks.thinking.map((item) => (
          <CheckItem key={item} checked={thinkChecks.includes(item)} onChange={() => toggleCheck(thinkChecks, setThinkChecks, item)} label={item} color={DS.color.s3} />
        ))}
        <textarea value={newThinking} onChange={(e) => setNewThinking(e.target.value)} rows={3} placeholder="새로운 생각을 직접 작성하거나, 위에서 선택해서 적용하세요" style={{...taStyle, marginTop: 12}} />
      </Card>

      {/* 구체적인 도움 방법 */}
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: DS.color.s3 }}>🎯 구체적인 도움 방법</span>
          {helpChecks.length > 0 && <button onClick={applyHelp} style={applyBtnStyle(DS.color.s3)}>적용하기</button>}
        </div>
        <div style={{ fontSize: 12, color: DS.color.inkMuted, marginBottom: 10 }}>🛠️ {cat} 상황에 도움되는 방법들</div>
        {checks.help.map((item) => (
          <CheckItem key={item} checked={helpChecks.includes(item)} onChange={() => toggleCheck(helpChecks, setHelpChecks, item)} label={item} color={DS.color.s3} />
        ))}
        <textarea value={helpSuggestions} onChange={(e) => setHelpSuggestions(e.target.value)} rows={3} placeholder="구체적인 도움 방법을 작성하거나, 위에서 선택해서 적용하세요" style={{...taStyle, marginTop: 12}} />
      </Card>

      <div style={{ marginTop: 24 }}><Btn onClick={onGo} disabled={!newThinking.trim() && !helpSuggestions.trim()}>다음 단계로</Btn></div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   ✦ 4단계: 격려하기
   ═══════════════════════════════════════════════ */
function Step4({ client, drawnMsg, setDrawnMsg, personalMsg, setPersonalMsg, promise, setPromise, usedMsgs, setUsedMsgs, onGo, onBack }) {
  const draw = () => {
    let avail = ENCOURAGE_MSGS.filter(m => !usedMsgs.includes(m));
    if (!avail.length) { avail = ENCOURAGE_MSGS; setUsedMsgs([]); }
    const msg = avail[Math.floor(Math.random() * avail.length)];
    setDrawnMsg(msg);
    setUsedMsgs([...usedMsgs, msg]);
  };

  return (
    <div style={{ paddingTop: 24, paddingBottom: 40 }}>
      <TopBar onBack={onBack} />
      <ProgressBar step={4} />
      <SectionLabel color={DS.color.s4}>4단계 · 격려하기</SectionLabel>
      <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.5, marginBottom: 8 }}>{client}에게 따뜻한<br />응원을 전해요</h2>
      <p style={{ fontSize: 14, color: DS.color.inkSoft, marginBottom: 20, lineHeight: 1.5 }}>힘이 되는 말 한마디가 큰 변화를 만들어요.</p>

      {/* 격려 뽑기 */}
      <Card style={{ marginBottom: 16 }}>
        <button onClick={draw} style={{ width: "100%", padding: "14px", borderRadius: DS.radius.md, border: "none", background: `linear-gradient(135deg, ${DS.color.s4}, #F9A8D4)`, color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer", boxShadow: DS.shadow.glow(DS.color.s4), transition: DS.transition, marginBottom: 14 }}>
          🎲 격려 메시지 뽑기
        </button>

        <div style={{ minHeight: 80, padding: "18px 20px", borderRadius: DS.radius.md, background: `linear-gradient(135deg, ${DS.color.s4Bg}, #FFF5F7)`, border: `1.5px solid ${DS.color.s4Soft}`, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
          <p style={{ fontSize: drawnMsg ? 16 : 14, fontWeight: drawnMsg ? 600 : 400, color: drawnMsg ? DS.color.s4 : DS.color.inkMuted, lineHeight: 1.6 }}>
            {drawnMsg || "격려 메시지를 뽑아보세요! 🎁"}
          </p>
        </div>
        <p style={{ fontSize: 11, color: DS.color.inkMuted, textAlign: "center", marginTop: 8 }}>💡 여러 번 눌러서 다양한 메시지를 확인해보세요!</p>
      </Card>

      {/* 나만의 격려 */}
      <Card style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 14, fontWeight: 700, color: DS.color.s4, marginBottom: 8, display: "block" }}>💝 나만의 격려 메시지</label>
        <textarea value={personalMsg} onChange={(e) => setPersonalMsg(e.target.value)} rows={3} placeholder={`${client}에게 전하고 싶은 따뜻한 말을 써보세요...`} style={taStyle} />
      </Card>

      {/* 실천 약속 */}
      <Card>
        <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }} onClick={() => setPromise(!promise)}>
          <div style={{ width: 22, height: 22, minWidth: 22, borderRadius: 6, border: promise ? `2px solid ${DS.color.s4}` : `2px solid ${DS.color.border}`, background: promise ? DS.color.s4 : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: DS.transition, marginTop: 2 }}>
            {promise && <span style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>✓</span>}
          </div>
          <span style={{ fontSize: 14, color: DS.color.ink, lineHeight: 1.5 }}>🤝 앞으로 2주 동안 {client}를 특별히 응원하고 도와줄게요!</span>
        </label>
      </Card>

      <div style={{ marginTop: 24 }}><Btn onClick={onGo}>💾 상담 결과 저장하기</Btn></div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   ✦ 결과 화면
   ═══════════════════════════════════════════════ */
function Result({ names, worry, emotions, empathyText, newThinking, helpSuggestions, drawnMsg, personalMsg, promise }) {
  const now = new Date().toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric", weekday: "long" });
  const sections = [
    { emoji: "💚", title: "1단계: 마음 공감하기", color: DS.color.s1, bg: DS.color.s1Bg, content: (
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: DS.color.s1, marginBottom: 8 }}>친구의 감정</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{emotions.map(e => <span key={e} style={{ fontSize: 12, padding: "4px 10px", borderRadius: DS.radius.full, background: "#fff", border: `1px solid ${DS.color.s1Soft}`, color: DS.color.s1, fontWeight: 500 }}>{e}</span>)}</div>
      </div>
    )},
    { emoji: "💬", title: "2단계: 공감 표현하기", color: DS.color.s2, bg: DS.color.s2Bg, content: (
      <p style={{ fontSize: 14, lineHeight: 1.7, color: DS.color.ink, background: "#fff", padding: "12px 14px", borderRadius: DS.radius.sm }}>{empathyText || "(작성되지 않음)"}</p>
    )},
    { emoji: "✨", title: "3단계: 도움 찾기", color: DS.color.s3, bg: DS.color.s3Bg, content: (
      <div>
        {newThinking && <><div style={{ fontSize: 13, fontWeight: 600, color: DS.color.s3, marginBottom: 4 }}>새로운 생각</div><p style={{ fontSize: 13, lineHeight: 1.6, background: "#fff", padding: "10px 12px", borderRadius: DS.radius.sm, marginBottom: 10, whiteSpace: "pre-wrap" }}>{newThinking}</p></>}
        {helpSuggestions && <><div style={{ fontSize: 13, fontWeight: 600, color: DS.color.s3, marginBottom: 4 }}>도움 방법</div><p style={{ fontSize: 13, lineHeight: 1.6, background: "#fff", padding: "10px 12px", borderRadius: DS.radius.sm, whiteSpace: "pre-wrap" }}>{helpSuggestions}</p></>}
      </div>
    )},
    { emoji: "🎁", title: "4단계: 격려하기", color: DS.color.s4, bg: DS.color.s4Bg, content: (
      <div>
        {drawnMsg && <p style={{ fontSize: 14, lineHeight: 1.6, background: `linear-gradient(135deg, ${DS.color.s4Bg}, #FFF5F7)`, padding: "12px 14px", borderRadius: DS.radius.sm, marginBottom: 10, color: DS.color.s4, fontWeight: 500 }}>{drawnMsg}</p>}
        {personalMsg && <p style={{ fontSize: 14, lineHeight: 1.6, background: "#fff", padding: "12px 14px", borderRadius: DS.radius.sm }}>{personalMsg}</p>}
        {promise && <div style={{ marginTop: 10, fontSize: 13, color: DS.color.s4, fontWeight: 600 }}>🤝 2주 동안 특별히 응원하기로 약속했어요!</div>}
      </div>
    )},
  ];

  return (
    <div style={{ paddingTop: 32, paddingBottom: 60 }}>
      {/* 헤더 */}
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ width: 56, height: 56, borderRadius: DS.radius.lg, background: DS.color.accentGrad, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, margin: "0 auto 14px", boxShadow: DS.shadow.glow(DS.color.accent) }}>🌈</div>
        <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5, marginBottom: 4 }}>ABC 친구 도우미</h2>
        <p style={{ fontSize: 13, color: DS.color.inkMuted }}>상담 결과 · {now}</p>
      </div>

      {/* 기본 정보 */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-around", marginBottom: 16 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 11, color: DS.color.inkMuted, marginBottom: 4 }}>상담자</div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>🧑‍⚕️ {names.counselor || "상담자"}</div>
          </div>
          <div style={{ width: 1, background: DS.color.border }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 11, color: DS.color.inkMuted, marginBottom: 4 }}>상담받는 친구</div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>💛 {names.client || "친구"}</div>
          </div>
        </div>

        {worry && (
          <div style={{ padding: "14px 16px", borderRadius: DS.radius.md, background: DS.color.accentLight }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: DS.color.accent, marginBottom: 8, letterSpacing: 0.3 }}>🎯 상담 주제</div>
            {[["A", worry.a, "#FF7E5F"], ["B", worry.b, "#FEB47B"], ["C", worry.c, "#818CF8"]].map(([l, t, c]) => (
              <div key={l} style={{ display: "flex", gap: 8, marginBottom: 3, fontSize: 13 }}>
                <span style={{ fontWeight: 800, color: c, minWidth: 14 }}>{l}</span><span style={{ lineHeight: 1.5 }}>{t}</span>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* 4단계 결과 */}
      {sections.map((sec) => (
        <div key={sec.title} style={{ marginBottom: 12, padding: "16px 18px", borderRadius: DS.radius.lg, background: sec.bg, border: `1px solid ${sec.color}15` }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: sec.color, marginBottom: 10 }}>{sec.emoji} {sec.title}</div>
          {sec.content}
        </div>
      ))}

      {/* 마무리 */}
      <div style={{ textAlign: "center", padding: "20px", marginTop: 8 }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: DS.color.accent, marginBottom: 4 }}>🌟 친구를 도와줘서 정말 멋져요! 🌟</div>
        <p style={{ fontSize: 13, color: DS.color.inkMuted }}>이 결과는 나중에 다시 볼 수 있어요</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   🧱 공통 컴포넌트
   ═══════════════════════════════════════════════ */
function TopBar({ onBack }) {
  return (
    <button onClick={onBack} style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", color: DS.color.inkMuted, fontSize: 14, fontWeight: 500, padding: "12px 0", marginBottom: 8, transition: DS.transition }}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 13L5 8L10 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>이전
    </button>
  );
}

function ProgressBar({ step }) {
  const pct = step === 0 ? 2 : (step / 4) * 100;
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ height: 4, borderRadius: 2, background: DS.color.border, overflow: "hidden", marginBottom: 12 }}>
        <div style={{ height: "100%", borderRadius: 2, background: DS.color.accentGrad, width: `${pct}%`, transition: "width 0.5s cubic-bezier(0.4,0,0.2,1)" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {STEPS_DATA.map((s) => (
          <div key={s.n} style={{ display: "flex", alignItems: "center", gap: 5, opacity: step >= s.n ? 1 : 0.35, transition: DS.transition }}>
            <div style={{ width: 20, height: 20, borderRadius: "50%", background: step >= s.n ? s.color : DS.color.border, color: step >= s.n ? "#fff" : DS.color.inkMuted, fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", transition: DS.transition }}>{step > s.n ? "✓" : s.n}</div>
            <span style={{ fontSize: 12, fontWeight: step===s.n ? 700 : 500, color: step===s.n ? s.color : DS.color.inkMuted }}>{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionLabel({ children, color = DS.color.accent }) {
  return <div style={{ fontSize: 12, fontWeight: 700, color, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 6 }}>{children}</div>;
}

function Card({ children, style = {} }) {
  return <div style={{ background: DS.color.surface, border: `1px solid ${DS.color.border}`, borderRadius: DS.radius.lg, padding: 20, ...style }}>{children}</div>;
}

function Field({ label, icon, value, onChange, placeholder }) {
  return (
    <div style={{ padding: "12px 0" }}>
      <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: DS.color.inkSoft, marginBottom: 8 }}><span style={{ fontSize: 18 }}>{icon}</span> {label}</label>
      <input type="text" value={value} onChange={(e)=>onChange(e.target.value)} placeholder={placeholder} style={{ width: "100%", padding: "10px 0", border: "none", borderBottom: `1.5px solid ${DS.color.border}`, fontSize: 17, fontWeight: 500, outline: "none", background: "transparent", fontFamily: "inherit", color: DS.color.ink, transition: DS.transition, boxSizing: "border-box" }} onFocus={(e)=>e.target.style.borderBottomColor=DS.color.accent} onBlur={(e)=>e.target.style.borderBottomColor=DS.color.border} />
    </div>
  );
}

function Btn({ children, onClick, disabled, small }) {
  return <button onClick={onClick} disabled={disabled} style={{ width: small ? "auto" : "100%", padding: small ? "10px 24px" : "16px 32px", borderRadius: DS.radius.md, border: "none", background: disabled ? DS.color.border : DS.color.accentGrad, color: disabled ? DS.color.inkMuted : "#fff", fontSize: small ? 14 : 16, fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer", transition: DS.transition, boxShadow: disabled ? "none" : DS.shadow.glow(DS.color.accent), fontFamily: "inherit" }}>{children}</button>;
}

function Chip({ children, color, bg, border }) {
  return <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: DS.radius.full, background: bg, border: `1px solid ${border}`, fontSize: 13, color, fontWeight: 500, marginBottom: 24 }}>{children}</div>;
}

function TagBox({ color, bg, border, label, items, onRemove }) {
  return (
    <div style={{ padding: "16px 20px", borderRadius: DS.radius.md, background: bg, border: `1px solid ${border}`, marginBottom: 24 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color, marginBottom: 10, letterSpacing: 0.3 }}>{label}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {items.map((e) => (
          <span key={e} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px 6px 10px", borderRadius: DS.radius.full, background: "#fff", border: `1px solid ${border}`, fontSize: 13, fontWeight: 500, color }}>
            {e}
            <button onClick={() => onRemove(e)} style={{ border: "none", background: "none", cursor: "pointer", color: DS.color.inkMuted, fontSize: 15, padding: 0, lineHeight: 1 }}>×</button>
          </span>
        ))}
      </div>
    </div>
  );
}

function CheckItem({ checked, onChange, label, color }) {
  return (
    <div onClick={onChange} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 12px", borderRadius: DS.radius.sm, cursor: "pointer", transition: DS.transition, background: checked ? `${color}08` : "transparent" }}>
      <div style={{ width: 20, height: 20, minWidth: 20, borderRadius: 6, border: checked ? `2px solid ${color}` : `2px solid ${DS.color.border}`, background: checked ? color : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: DS.transition, marginTop: 1 }}>
        {checked && <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>✓</span>}
      </div>
      <span style={{ fontSize: 14, color: checked ? DS.color.ink : DS.color.inkSoft, fontWeight: checked ? 500 : 400, lineHeight: 1.5 }}>{label}</span>
    </div>
  );
}

const inputStyle = { flex: 1, padding: "12px 16px", borderRadius: DS.radius.sm, border: `1.5px solid ${DS.color.border}`, fontSize: 14, outline: "none", background: DS.color.surface, transition: DS.transition, fontFamily: "inherit" };
const taStyle = { width: "100%", padding: "12px 14px", borderRadius: DS.radius.sm, border: `1.5px solid ${DS.color.border}`, fontSize: 14, outline: "none", resize: "vertical", fontFamily: "inherit", color: DS.color.ink, background: DS.color.surface, transition: DS.transition, boxSizing: "border-box" };
const selectStyle = { width: "100%", padding: "10px 14px", borderRadius: DS.radius.sm, border: `1.5px solid ${DS.color.border}`, fontSize: 14, outline: "none", background: DS.color.surface, fontFamily: "inherit", color: DS.color.ink, appearance: "auto" };
const applyBtnStyle = (c) => ({ padding: "6px 14px", borderRadius: DS.radius.full, border: "none", background: c, color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" });
