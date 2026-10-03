"use client";

import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "h2ct-workbook-v1";

type Task = { text: string; done: boolean };
type TimeRow = { date: string; task: string; category: string; minutes: string };
/** One paper Time on Task day sheet. blocks keyed by block index "0".."63";
 *  mark is "P" (productive — the block did what you marked it for) or
 *  "W" (wasted — it did not), per the book's Week 1 definition. */
type TotDay = {
  date: string;
  day: string;
  cycle: string;
  blocks: Record<string, { code: string; mark: string }>;
  margin: string;
};
type Ikigai = { love: string[]; goodAt: string[]; worldNeeds: string[]; paidFor: string[] };

type State = {
  hwName: string;
  hwDate: string;
  haveWant: string[];
  dontHaveWant: string[];
  goalIndex: number | null;
  haveDontWant: string[];
  dontHaveDontWant: string[];
  ikName: string;
  ikDate: string;
  ikigai: Ikigai;
  ikigaiMiddle: string;
  planName: string;
  planDate: string;
  goal: string;
  goalEdited: boolean;
  difficultBecause: string;
  stillPossibleBecause: string;
  milestones: string[];
  tasks: Task[];
  timeLog: TimeRow[];
  totDays: TotDay[];
};

const rows = (n: number): string[] => Array.from({ length: n }, () => "");

const blankTotDay = (): TotDay => ({ date: "", day: "", cycle: "", blocks: {}, margin: "" });

/** The paper grid: sixteen waking hours in fifteen-minute blocks. */
const BLOCK_TIMES: string[] = Array.from({ length: 64 }, (_, i) => {
  const mins = i * 15;
  return `+${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;
});

const LEAK_CODES = ["D", "SO", "O", "X"];

const initialState: State = {
  hwName: "",
  hwDate: "",
  haveWant: rows(7),
  dontHaveWant: rows(7),
  goalIndex: null,
  haveDontWant: rows(7),
  dontHaveDontWant: rows(7),
  ikName: "",
  ikDate: "",
  ikigai: { love: rows(7), goodAt: rows(7), worldNeeds: rows(7), paidFor: rows(7) },
  ikigaiMiddle: "",
  planName: "",
  planDate: "",
  goal: "",
  goalEdited: false,
  difficultBecause: "",
  stillPossibleBecause: "",
  milestones: rows(5),
  tasks: Array.from({ length: 10 }, () => ({ text: "", done: false })),
  timeLog: [{ date: "", task: "", category: "G", minutes: "" }],
  totDays: [blankTotDay()],
};

const CATEGORIES: { code: string; label: string }[] = [
  { code: "S", label: "S — Self" },
  { code: "Fam", label: "Fam — Family" },
  { code: "Fr", label: "Fr — Friends" },
  { code: "C", label: "C — Career" },
  { code: "Fa", label: "Fa — Faith" },
  { code: "G", label: "G — Goal" },
  { code: "SO", label: "SO — Shiny" },
  { code: "D", label: "D — Distract" },
  { code: "O", label: "O — Obstacle" },
  { code: "X", label: "X — Excuse" },
  // The book's code list adds Ot (Other); the paper legend leaves it off.
  { code: "Ot", label: "Ot — Other" },
];

function mergeState(saved: Partial<State> | null): State {
  if (!saved) return initialState;
  return {
    ...initialState,
    ...saved,
    ikigai: { ...initialState.ikigai, ...(saved.ikigai ?? {}) },
    // Saved state from before the day grid existed has no totDays (or a
    // partial shape) — keep whatever days are there, drop malformed ones.
    totDays:
      Array.isArray(saved.totDays) && saved.totDays.length > 0
        ? saved.totDays.map((d) => ({ ...blankTotDay(), ...(d ?? {}), blocks: d?.blocks ?? {} }))
        : initialState.totDays,
  };
}

export default function WorkbookApp() {
  const [state, setState] = useState<State>(initialState);
  const [loaded, setLoaded] = useState(false);
  const [totDayIdx, setTotDayIdx] = useState(0);
  const [totCat, setTotCat] = useState("G");

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setState(mergeState(JSON.parse(raw) as Partial<State>));
    } catch {
      /* start fresh */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage full/blocked — keep working in-memory */
    }
  }, [state, loaded]);

  const set = <K extends keyof State>(key: K, value: State[K]) =>
    setState((s) => ({ ...s, [key]: value }));

  const setTotDay = (idx: number, patch: Partial<TotDay>) =>
    setState((s) => {
      const totDays = [...s.totDays];
      totDays[idx] = { ...totDays[idx], ...patch };
      return { ...s, totDays };
    });

  /** Paper mechanic: one mark per block. Tap cycles unmarked -> P -> W ->
   *  unmarked, stamping the block with the currently picked category. */
  const cycleBlock = (dayIdx: number, blockIdx: number) =>
    setState((s) => {
      const totDays = [...s.totDays];
      const day = { ...totDays[dayIdx], blocks: { ...totDays[dayIdx].blocks } };
      const key = String(blockIdx);
      const cur = day.blocks[key];
      if (!cur || !cur.mark) day.blocks[key] = { code: totCat, mark: "P" };
      else if (cur.mark === "P") day.blocks[key] = { code: cur.code, mark: "W" };
      else delete day.blocks[key];
      totDays[dayIdx] = day;
      return { ...s, totDays };
    });

  const totStats = useMemo(() => {
    let p = 0,
      w = 0,
      g = 0,
      leaks = 0;
    for (const d of state.totDays) {
      for (const key of Object.keys(d.blocks)) {
        const b = d.blocks[key];
        if (!b || !b.mark) continue;
        if (b.mark === "P") p++;
        else if (b.mark === "W") w++;
        if (b.code === "G") g++;
        if (LEAK_CODES.includes(b.code)) leaks++;
      }
    }
    return { pMin: p * 15, wMin: w * 15, gBlocks: g, leakCount: leaks };
  }, [state.totDays]);

  const setRow = (key: "haveWant" | "dontHaveWant" | "haveDontWant" | "dontHaveDontWant" | "milestones", i: number, v: string) =>
    setState((s) => {
      const next = [...s[key]];
      next[i] = v;
      return { ...s, [key]: next };
    });

  const addRow = (key: "haveWant" | "dontHaveWant" | "haveDontWant" | "dontHaveDontWant" | "milestones") =>
    setState((s) => ({ ...s, [key]: [...s[key], ""] }));

  const setIkigaiRow = (section: keyof Ikigai, i: number, v: string) =>
    setState((s) => {
      const list = [...s.ikigai[section]];
      list[i] = v;
      return { ...s, ikigai: { ...s.ikigai, [section]: list } };
    });

  const addIkigaiRow = (section: keyof Ikigai) =>
    setState((s) => ({ ...s, ikigai: { ...s.ikigai, [section]: [...s.ikigai[section], ""] } }));

  const circleGoal = (i: number) =>
    setState((s) => ({
      ...s,
      goalIndex: i,
      goal: s.goalEdited ? s.goal : s.dontHaveWant[i] ?? s.goal,
    }));

  const totalMinutes = useMemo(
    () =>
      state.timeLog.reduce((sum, r) => {
        const n = parseInt(r.minutes, 10);
        return sum + (Number.isFinite(n) && n > 0 ? n : 0);
      }, 0),
    [state.timeLog]
  );

  const tasksDone = state.tasks.filter((t) => t.done).length;
  const tasksTotal = state.tasks.filter((t) => t.text.trim() !== "").length;

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "how-to-create-time-workbook.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    if (!window.confirm("Clear everything in this workbook? This cannot be undone.")) return;
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setState(initialState);
  };

  const listSection = (
    title: string,
    note: string,
    key: "haveWant" | "dontHaveWant" | "haveDontWant" | "dontHaveDontWant",
    circleable = false
  ) => (
    <div className="wb-list">
      <h3>{title}</h3>
      <p className="wb-note">{note}</p>
      {state[key].map((v, i) => (
        <div className="wb-row" key={i}>
          {circleable && (
            <button
              type="button"
              className={state.goalIndex === i ? "wb-circle wb-circle-on" : "wb-circle"}
              aria-label={`Circle item ${i + 1} as the goal`}
              title="Circle this one — that is the goal"
              onClick={() => circleGoal(i)}
            >
              {state.goalIndex === i ? "◉" : "○"}
            </button>
          )}
          <span className="wb-num">{i + 1}.</span>
          <input
            className="wb-input"
            type="text"
            value={v}
            onChange={(e) => setRow(key, i, e.target.value)}
            aria-label={`${title} item ${i + 1}`}
          />
        </div>
      ))}
      <button type="button" className="wb-add" onClick={() => addRow(key)}>
        + Add a row
      </button>
    </div>
  );

  const ikigaiSection = (title: string, section: keyof Ikigai) => (
    <div className="wb-list">
      <h3>{title}</h3>
      {state.ikigai[section].map((v, i) => (
        <div className="wb-row" key={i}>
          <span className="wb-num">{i + 1}.</span>
          <input
            className="wb-input"
            type="text"
            value={v}
            onChange={(e) => setIkigaiRow(section, i, e.target.value)}
            aria-label={`${title} item ${i + 1}`}
          />
        </div>
      ))}
      <button type="button" className="wb-add" onClick={() => addIkigaiRow(section)}>
        + Add a row
      </button>
    </div>
  );

  const nameDate = (
    nameKey: "hwName" | "ikName" | "planName",
    dateKey: "hwDate" | "ikDate" | "planDate"
  ) => (
    <div className="wb-namedate">
      <label>
        Name
        <input
          className="wb-input"
          type="text"
          value={state[nameKey]}
          onChange={(e) => set(nameKey, e.target.value)}
        />
      </label>
      <label>
        Date
        <input
          className="wb-input"
          type="date"
          value={state[dateKey]}
          onChange={(e) => set(dateKey, e.target.value)}
        />
      </label>
    </div>
  );

  const filled = (arr: string[]) => arr.filter((x) => x.trim() !== "");

  return (
    <>
      {/* ---------- Screen ---------- */}
      <div className="wb-screen">
        <p className="lf-stamp">The companion workbook — interactive edition</p>
        <h1>How to Create Time — Workbook</h1>
        <div className="lf-room">
          <p>
            This is the companion workbook from <em>How to Create Time</em>, as a tool instead of
            a PDF: the same exercises, in the same order — Have / Want, Ikigai, Goal / Milestones
            / Tasks, and Time on Task, including the fifteen-minute day grid.
          </p>
          <p>
            <strong>Your answers stay on this device.</strong> Everything you type is saved only
            in this browser, on this machine. Nothing is sent anywhere, there is no account, and
            we never see it. Use Print / export below to keep a copy, or download your answers as
            a file.
          </p>
          <p style={{ marginBottom: 0 }}>
            Prefer paper? The printable workbook is still yours:{" "}
            <a href="/downloads/h2ct-workbook.pdf" download="H2CT-Companion-Workbook.pdf">
              download the workbook (PDF)
            </a>
            .
          </p>
        </div>

        <p className="wb-status" role="status">
          {state.goalIndex !== null && state.dontHaveWant[state.goalIndex]?.trim()
            ? `Goal circled: “${state.dontHaveWant[state.goalIndex]}” · `
            : "No goal circled yet · "}
          Tasks done: {tasksDone}
          {tasksTotal > 0 ? ` of ${tasksTotal} written` : ""} · Time logged: {totalMinutes} min
          {totalMinutes >= 60 ? ` (${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m)` : ""}
          {` · Grid: P ${totStats.pMin} min · W ${totStats.wMin} min · G ${totStats.gBlocks} blocks`}
        </p>

        {/* ---------- 1. Have / Want ---------- */}
        <section className="lf-room wb-section">
          <p className="lf-stamp">How to Create Time — Week 0</p>
          <h2>Have / Want</h2>
          {listSection("Have", "Have and want. Keep these.", "haveWant")}
          {listSection("Don’t Have — Want", "Don’t have and want. Point B.", "dontHaveWant", true)}
          {listSection("Have — Don’t Want", "Have and don’t want.", "haveDontWant")}
          {listSection("Don’t Have — Don’t Want", "Don’t have and don’t want.", "dontHaveDontWant")}
          <ul className="wb-bullets">
            <li>Circle one item in Don’t have and want. That is the goal.</li>
            <li>See it. See yourself having already done it.</li>
            <li>If this box is empty: give, serve, or want to need a jet.</li>
          </ul>
          {nameDate("hwName", "hwDate")}
        </section>

        {/* ---------- 2. Ikigai ---------- */}
        <section className="lf-room wb-section">
          <p className="lf-stamp">Only if Don’t Have and Want is empty</p>
          <h2>Ikigai</h2>
          <p className="wb-note">Say it: icky-guy-ah</p>
          {ikigaiSection("What you love", "love")}
          {ikigaiSection("What you are good at", "goodAt")}
          {ikigaiSection("What the world needs", "worldNeeds")}
          {ikigaiSection("What you can be paid for", "paidFor")}
          <label className="wb-field-label" htmlFor="wb-middle">
            The middle
          </label>
          <textarea
            id="wb-middle"
            className="wb-textarea"
            rows={3}
            value={state.ikigaiMiddle}
            onChange={(e) => set("ikigaiMiddle", e.target.value)}
          />
          <p className="wb-note">
            The middle is the next guess at Point B. Not a personality test.
          </p>
          <p className="wb-note">
            If the middle is still empty, go to the stop point in the book. Do not sit until a
            passion arrives. Give. Serve. Or want to need a jet.
          </p>
          {nameDate("ikName", "ikDate")}
        </section>

        {/* ---------- 3. Goal / Milestones / Tasks ---------- */}
        <section className="lf-room wb-section">
          <h2>Goal / Milestones / Tasks</h2>
          <label className="wb-field-label" htmlFor="wb-goal">
            Goal (one sentence from Don’t Have and Want):
          </label>
          <input
            id="wb-goal"
            className="wb-input wb-input-block"
            type="text"
            value={state.goal}
            onChange={(e) =>
              setState((s) => ({ ...s, goal: e.target.value, goalEdited: true }))
            }
          />
          <p className="wb-note">See it done. See yourself having already done it.</p>
          <label className="wb-field-label" htmlFor="wb-difficult">
            Difficult because:
          </label>
          <input
            id="wb-difficult"
            className="wb-input wb-input-block"
            type="text"
            value={state.difficultBecause}
            onChange={(e) => set("difficultBecause", e.target.value)}
          />
          <label className="wb-field-label" htmlFor="wb-possible">
            Still possible because:
          </label>
          <input
            id="wb-possible"
            className="wb-input wb-input-block"
            type="text"
            value={state.stillPossibleBecause}
            onChange={(e) => set("stillPossibleBecause", e.target.value)}
          />

          <h3>Milestones</h3>
          {state.milestones.map((v, i) => (
            <div className="wb-row" key={i}>
              <span className="wb-num">{i + 1}.</span>
              <input
                className="wb-input"
                type="text"
                value={v}
                onChange={(e) => setRow("milestones", i, e.target.value)}
                aria-label={`Milestone ${i + 1}`}
              />
            </div>
          ))}
          <button type="button" className="wb-add" onClick={() => addRow("milestones")}>
            + Add a milestone
          </button>
          <p className="wb-note">A milestone tells you where you are. Not a vibe.</p>

          <h3>Tasks</h3>
          <p className="wb-note">Bites. Tonight or this week. A thing that can get an X.</p>
          {state.tasks.map((t, i) => (
            <div className="wb-row" key={i}>
              <input
                type="checkbox"
                className="wb-check"
                checked={t.done}
                onChange={(e) =>
                  setState((s) => {
                    const tasks = [...s.tasks];
                    tasks[i] = { ...tasks[i], done: e.target.checked };
                    return { ...s, tasks };
                  })
                }
                aria-label={`Task ${i + 1} done`}
              />
              <input
                className="wb-input"
                type="text"
                value={t.text}
                placeholder={`Task ${i + 1}`}
                onChange={(e) =>
                  setState((s) => {
                    const tasks = [...s.tasks];
                    tasks[i] = { ...tasks[i], text: e.target.value };
                    return { ...s, tasks };
                  })
                }
                aria-label={`Task ${i + 1}`}
              />
            </div>
          ))}
          <button
            type="button"
            className="wb-add"
            onClick={() =>
              setState((s) => ({ ...s, tasks: [...s.tasks, { text: "", done: false }] }))
            }
          >
            + Add a task
          </button>
          <p className="wb-note">One goal. One rabbit. Everything else waits.</p>
          {nameDate("planName", "planDate")}
        </section>

        {/* ---------- 4. Time on Task ---------- */}
        <section className="lf-room wb-section">
          <h2>Time on Task</h2>
          <p className="wb-note">
            S Self · Fam Family · Fr Friends · C Career · Fa Faith · G Goal · SO shiny · D
            distract · O obstacle · X excuse · Ot Other
          </p>
          <p className="wb-note">
            Sixteen waking hours in fifteen-minute blocks — the workbook&rsquo;s Week 1 page,
            one sheet per day. <strong>P</strong> — productive: the block did what you marked
            it for. <strong>W</strong> — wasted: it did not. Code on the line. Log a typical
            week; do not fix the week while you log it.
          </p>
          {(() => {
            const idx = Math.min(totDayIdx, state.totDays.length - 1);
            const day = state.totDays[idx];
            let p = 0,
              w = 0,
              g = 0,
              leaks = 0;
            for (let i = 0; i < 64; i++) {
              const b = day.blocks[String(i)];
              if (!b || !b.mark) continue;
              if (b.mark === "P") p++;
              else if (b.mark === "W") w++;
              if (b.code === "G") g++;
              if (LEAK_CODES.includes(b.code)) leaks++;
            }
            return (
              <div className="wb-tot">
                <div className="wb-tot-nav">
                  <button
                    type="button"
                    className="wb-add"
                    disabled={idx === 0}
                    onClick={() => setTotDayIdx(idx - 1)}
                  >
                    ← Prev day
                  </button>
                  <span className="wb-tot-daylabel">
                    Day {idx + 1} of {state.totDays.length}
                  </span>
                  <button
                    type="button"
                    className="wb-add"
                    disabled={idx >= state.totDays.length - 1}
                    onClick={() => setTotDayIdx(idx + 1)}
                  >
                    Next day →
                  </button>
                  <button
                    type="button"
                    className="wb-add"
                    onClick={() => {
                      setState((s) => ({ ...s, totDays: [...s.totDays, blankTotDay()] }));
                      setTotDayIdx(state.totDays.length);
                    }}
                  >
                    + Add a day
                  </button>
                  {state.totDays.length > 1 && (
                    <button
                      type="button"
                      className="wb-remove"
                      aria-label="Remove this day sheet"
                      title="Remove this day sheet"
                      onClick={() => {
                        if (
                          window.confirm(
                            "Remove this day sheet? Its blocks will be deleted."
                          )
                        ) {
                          setState((s) => ({
                            ...s,
                            totDays: s.totDays.filter((_, j) => j !== idx),
                          }));
                          setTotDayIdx(Math.max(0, idx - 1));
                        }
                      }}
                    >
                      ×
                    </button>
                  )}
                </div>
                <div className="wb-namedate">
                  <label>
                    Date
                    <input
                      className="wb-input"
                      type="date"
                      value={day.date}
                      onChange={(e) => setTotDay(idx, { date: e.target.value })}
                    />
                  </label>
                  <label>
                    Day
                    <input
                      className="wb-input"
                      type="text"
                      value={day.day}
                      onChange={(e) => setTotDay(idx, { day: e.target.value })}
                    />
                  </label>
                  <label>
                    Cycle #
                    <input
                      className="wb-input"
                      type="text"
                      inputMode="numeric"
                      value={day.cycle}
                      onChange={(e) =>
                        setTotDay(idx, { cycle: e.target.value.replace(/[^0-9]/g, "") })
                      }
                    />
                  </label>
                </div>
                <p className="wb-note">
                  Pick the category, then tap a block: once for <strong>P</strong>, again
                  for <strong>W</strong>, a third tap clears it. The block keeps the
                  category it was marked with.
                </p>
                <div className="wb-tot-cats" role="group" aria-label="Category for marking blocks">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      className={totCat === c.code ? "wb-tot-cat wb-tot-cat-on" : "wb-tot-cat"}
                      onClick={() => setTotCat(c.code)}
                      title={c.label}
                      aria-pressed={totCat === c.code}
                    >
                      {c.code}
                    </button>
                  ))}
                  <span className="wb-tot-catlabel">
                    {CATEGORIES.find((c) => c.code === totCat)?.label}
                  </span>
                </div>
                <div className="wb-tot-grid">
                  {BLOCK_TIMES.map((t, i) => {
                    const b = day.blocks[String(i)];
                    const marked = !!(b && b.mark);
                    return (
                      <button
                        key={t}
                        type="button"
                        className={
                          marked
                            ? `wb-tot-block ${b.mark === "P" ? "wb-tot-p" : "wb-tot-w"}`
                            : "wb-tot-block"
                        }
                        onClick={() => cycleBlock(idx, i)}
                        aria-label={`Block ${t}${marked ? `, ${b.code}, ${b.mark === "P" ? "productive" : "wasted"}` : ", unmarked"}`}
                      >
                        <span className="wb-tot-time">{t}</span>
                        <span className="wb-tot-code">{marked ? b.code : ""}</span>
                        <span className="wb-tot-mark">{marked ? b.mark : ""}</span>
                      </button>
                    );
                  })}
                </div>
                <p className="wb-total">
                  Tally — P minutes {p * 15} · W minutes {w * 15} · G blocks {g} ·
                  D/SO/O/X count {leaks}
                </p>
                <label className="wb-field-label" htmlFor="wb-tot-margin">
                  When you left G, write the sentence here. That sentence is data.
                </label>
                <input
                  id="wb-tot-margin"
                  className="wb-input wb-input-block"
                  type="text"
                  value={day.margin}
                  onChange={(e) => setTotDay(idx, { margin: e.target.value })}
                />
              </div>
            );
          })()}

          <h3>Quick log</h3>
          <p className="wb-note">
            The short version: single entries instead of the grid.
          </p>
          {state.timeLog.map((r, i) => (
            <div className="wb-timerow" key={i}>
              <input
                className="wb-input wb-date"
                type="date"
                value={r.date}
                onChange={(e) =>
                  setState((s) => {
                    const timeLog = [...s.timeLog];
                    timeLog[i] = { ...timeLog[i], date: e.target.value };
                    return { ...s, timeLog };
                  })
                }
                aria-label={`Entry ${i + 1} date`}
              />
              <input
                className="wb-input wb-task"
                type="text"
                value={r.task}
                placeholder="Task"
                onChange={(e) =>
                  setState((s) => {
                    const timeLog = [...s.timeLog];
                    timeLog[i] = { ...timeLog[i], task: e.target.value };
                    return { ...s, timeLog };
                  })
                }
                aria-label={`Entry ${i + 1} task`}
              />
              <select
                className="wb-select"
                value={r.category}
                onChange={(e) =>
                  setState((s) => {
                    const timeLog = [...s.timeLog];
                    timeLog[i] = { ...timeLog[i], category: e.target.value };
                    return { ...s, timeLog };
                  })
                }
                aria-label={`Entry ${i + 1} category`}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label}
                  </option>
                ))}
              </select>
              <input
                className="wb-input wb-mins"
                type="text"
                inputMode="numeric"
                value={r.minutes}
                placeholder="Min"
                onChange={(e) =>
                  setState((s) => {
                    const timeLog = [...s.timeLog];
                    timeLog[i] = { ...timeLog[i], minutes: e.target.value.replace(/[^0-9]/g, "") };
                    return { ...s, timeLog };
                  })
                }
                aria-label={`Entry ${i + 1} minutes`}
              />
              <button
                type="button"
                className="wb-remove"
                aria-label={`Remove entry ${i + 1}`}
                onClick={() =>
                  setState((s) => ({ ...s, timeLog: s.timeLog.filter((_, j) => j !== i) }))
                }
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            className="wb-add"
            onClick={() =>
              setState((s) => ({
                ...s,
                timeLog: [...s.timeLog, { date: "", task: "", category: "G", minutes: "" }],
              }))
            }
          >
            + Add an entry
          </button>
          <p className="wb-total">
            Tally — total time logged: {totalMinutes} minutes
            {totalMinutes >= 60
              ? ` (${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m)`
              : ""}
            {" · "}Goal (G) time:{" "}
            {state.timeLog
              .filter((r) => r.category === "G")
              .reduce((sum, r) => sum + (parseInt(r.minutes, 10) || 0), 0)}{" "}
            minutes
          </p>
        </section>

        {/* ---------- Actions ---------- */}
        <div className="lf-cta wb-actions">
          <button type="button" className="lf-btn lf-btn-red" onClick={() => window.print()}>
            Print / export my answers
          </button>
          <p style={{ marginTop: 12 }}>
            <button type="button" className="lf-btn lf-btn-ghost" onClick={exportJson}>
              Download my answers (JSON)
            </button>
          </p>
          <p style={{ marginTop: 12 }}>
            <button type="button" className="lf-btn lf-btn-ghost" onClick={clearAll}>
              Start over — clear everything
            </button>
          </p>
          <p className="lf-tiny">
            Saved automatically in this browser as you type. Nothing leaves your device.
          </p>
        </div>
      </div>

      {/* ---------- Print view ---------- */}
      <div className="wb-print" aria-hidden="true">
        <h1>How to Create Time — Companion Workbook</h1>
        <p>
          Name: {state.hwName || "—"} · Date: {state.hwDate || "—"}
        </p>

        <h2>Have / Want</h2>
        <h3>Have — have and want. Keep these.</h3>
        <ol>{filled(state.haveWant).map((x, i) => <li key={i}>{x}</li>)}</ol>
        <h3>Don’t have and want. Point B.</h3>
        <ol>
          {state.dontHaveWant.map((x, idx) =>
            x.trim() !== "" ? (
              <li key={idx}>
                {x}
                {idx === state.goalIndex ? " — ★ THE GOAL" : ""}
              </li>
            ) : null
          )}
        </ol>
        <h3>Have and don’t want.</h3>
        <ol>{filled(state.haveDontWant).map((x, i) => <li key={i}>{x}</li>)}</ol>
        <h3>Don’t have and don’t want.</h3>
        <ol>{filled(state.dontHaveDontWant).map((x, i) => <li key={i}>{x}</li>)}</ol>

        <h2>Ikigai</h2>
        <p>
          Name: {state.ikName || "—"} · Date: {state.ikDate || "—"}
        </p>
        <h3>What you love</h3>
        <ol>{filled(state.ikigai.love).map((x, i) => <li key={i}>{x}</li>)}</ol>
        <h3>What you are good at</h3>
        <ol>{filled(state.ikigai.goodAt).map((x, i) => <li key={i}>{x}</li>)}</ol>
        <h3>What the world needs</h3>
        <ol>{filled(state.ikigai.worldNeeds).map((x, i) => <li key={i}>{x}</li>)}</ol>
        <h3>What you can be paid for</h3>
        <ol>{filled(state.ikigai.paidFor).map((x, i) => <li key={i}>{x}</li>)}</ol>
        <p>
          <strong>The middle:</strong> {state.ikigaiMiddle || "—"}
        </p>

        <h2>Goal / Milestones / Tasks</h2>
        <p>
          Name: {state.planName || "—"} · Date: {state.planDate || "—"}
        </p>
        <p>
          <strong>Goal:</strong> {state.goal || "—"}
        </p>
        <p>
          <strong>Difficult because:</strong> {state.difficultBecause || "—"}
        </p>
        <p>
          <strong>Still possible because:</strong> {state.stillPossibleBecause || "—"}
        </p>
        <h3>Milestones</h3>
        <ol>{filled(state.milestones).map((x, i) => <li key={i}>{x}</li>)}</ol>
        <h3>Tasks</h3>
        <ul>
          {state.tasks
            .filter((t) => t.text.trim() !== "")
            .map((t, i) => (
              <li key={i}>
                {t.done ? "☑" : "☐"} {t.text}
              </li>
            ))}
        </ul>

        <h2>Time on Task</h2>
        <h3>Quick log</h3>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Task</th>
              <th>Category</th>
              <th>Minutes</th>
            </tr>
          </thead>
          <tbody>
            {state.timeLog
              .filter((r) => r.task.trim() !== "" || r.minutes !== "" || r.date !== "")
              .map((r, i) => (
                <tr key={i}>
                  <td>{r.date}</td>
                  <td>{r.task}</td>
                  <td>{r.category}</td>
                  <td>{r.minutes}</td>
                </tr>
              ))}
          </tbody>
        </table>
        <p>
          <strong>Total time logged:</strong> {totalMinutes} minutes
        </p>

        <h3>Day sheets — fifteen-minute grid</h3>
        {state.totDays.map((d, di) => {
          const cells: string[] = [];
          let p = 0,
            w = 0,
            g = 0,
            leaks = 0;
          for (let i = 0; i < 64; i++) {
            const b = d.blocks[String(i)];
            if (b && b.mark) {
              cells.push(`${BLOCK_TIMES[i]} ${b.code} ${b.mark}`);
              if (b.mark === "P") p++;
              else if (b.mark === "W") w++;
              if (b.code === "G") g++;
              if (LEAK_CODES.includes(b.code)) leaks++;
            }
          }
          if (cells.length === 0 && !d.date && !d.day && !d.margin) return null;
          return (
            <div key={di}>
              <h4>
                Day sheet {di + 1}
                {d.date ? ` — ${d.date}` : ""}
                {d.day ? ` (${d.day})` : ""}
                {d.cycle ? ` · Cycle ${d.cycle}` : ""}
              </h4>
              <p>{cells.length > 0 ? cells.join(" · ") : "No blocks marked."}</p>
              <p>
                <strong>Tally:</strong> P minutes {p * 15} · W minutes {w * 15} · G blocks{" "}
                {g} · D/SO/O/X count {leaks}
              </p>
              {d.margin ? (
                <p>
                  <strong>Left G:</strong> {d.margin}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
    </>
  );
}
