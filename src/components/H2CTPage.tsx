"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { BuyButton } from "./BuyButton";
import { Countdown } from "./Countdown";
import { H2CTPrice } from "./H2CTPrice";

const WEEKS: Array<[string, string]> = [
  ["Week 0 — Point B", "The Have/Want quadrant. Bottom left — Don\u2019t Have and Want — is your destination. Clear the old pile first: avalanche or snowball, pick one, don\u2019t switch."],
  ["Week 1 — Time on Task", "Log 16 waking hours in 15-minute blocks, seven days. Code every block P or W with a life code. Do not fix the week. You argue with a log."],
  ["Week 2 — Clarity", "One goal, one rabbit. He who chases two rabbits catches none. Goal \u2192 milestones \u2192 bites. Audit: does your G match the goal sentence, or were you hunting the wrong rabbit and calling it the goal?"],
  ["Week 3 — Focus", "The 45/15 rule: 45 minutes on task, 15 on the leak, held for eight hours. Distraction log. Kill one distraction per day. You are not short on energy. You are spread."],
  ["Week 4 — Determination", "An obstacle is not a problem. Water does not argue with rock \u2014 the Colorado cut the Grand Canyon out of stone. Every recurring non-goal block gets Stop, Hand it off, or Keep."],
  ["Week 5 — Failure + Commitment", "Two fears: the ceiling of failure and the floor of failure. Fail on purpose \u2014 a week with no failure is a week that stayed in the hallway. Then the time inventory: anything you spend more time on than the goal is more important than the goal. Plus the squirrel bin."],
  ["Week 6 — Excuses + the Room", "Triage every miss: distraction (bin it), obstacle (next action), excuse (cross it out \u2014 you still owe the task). The fire test: if you would not stop running out of the burning building because of it, it is an excuse."],
  ["Week 7 — Tools", "Five words: tools, leverage, delegate, automate, be efficient. \u201CA machine can\u2019t do what I do\u201D is usually true about the last inch and a lie about the other eleven. Pride is not a line item."],
  ["Week 8 — Get your name off the job", "SOP it, train it, automate it, delegate it, inspect it. If every exception comes back to you, you delegated a chore and kept the job. That is how a role becomes a business. That is how a job stops being a cage."],
  ["The close — You are creating time", "You did not invent a twenty-fifth hour. You stopped paying the ones you had to comfort."],
];

const FAQS: Array<[string, string]> = [
  [
    "LOL. I don't have time for an 8-week system.",
    "THAT'S THE FUCKING POINT! In 8 weeks you'll have 75% more time.",
  ],
  [
    "I need motivation first.",
    "You do not need to want to change in order to change, you do not need a desire to change in order to change. Will is first, not passion. You do not need to love the goal. You are not in love with escaping a fire. You still leave. No speech about passion. No permission from the room.",
  ],
  [
    "I don't know what I want.",
    "That is what Week 0 is for: the Have/Want quadrant, the Ikigai backup, and if all else fails \u2014 give and serve, or want to need a jet. A hard goal aimed at other people fills that hole. It does not get anyone killed.",
  ],
  [
    "Productivity systems never stick for me.",
    "This one measures before it changes anything. First you have to see the hours. Every cycle re-audits the log against the goal sentence. Do not restart the goal list.",
  ],
  [
    "Isn't this just another time-management book?",
    "It is the distilled non-executive version of five-figure strategic-vision coaching. The two-week executive version only works if you already have a mission. This is the eight-week crossing for everyone else \u2014 plus a workbook and a Time Log.",
  ],
  [
    "AI is going to take my job anyway.",
    "So delegate your job to it today so that you can do more important things.",
  ],
  [
    "No one can do it as well as I can.",
    "Cost math: hours that are cheaper than yours, hands that are faster than yours \u2014 that is the whole rule. Pride is not a line item. And Week 8\u2019s SOP-train-inspect sequence exists so quality does not collapse when you hand the work off.",
  ],
  [
    "What exactly do I get?",
    "The complete book as a PDF, the H2CT Companion workbook as a PDF, and the Time Log \u2014 all downloadable the second your payment clears. Check your email for the Stripe receipt.",
  ],
  [
    "Why $47 if it is \u201Creally\u201D $97?",
    "Our coaching clients are under NDA, so this page launches with zero testimonials. No borrowed wins, no fake five-stars. The first public scoreboards come from buyers here, and the price climbs with each one. $47 is the before-proof price.",
  ],
  [
    "Why a timer?",
    "The executive version goes for $10,000 in person. Every real review moves the public price toward that. Any day, this 24h window, we can raise it \u2014 and when your clock hits zero, it does.",
  ],
];

export function H2CTPage() {
  const [expired, setExpired] = useState(false);
  const handleExpire = useCallback(() => setExpired(true), []);

  return (
    <>
      <div className="lf-bar">
        HOW TO CREATE TIME — <H2CTPrice expired={expired} /> —{" "}
        {expired ? (
          "WINDOW CLOSED"
        ) : (
          <>
            TIMER: <Countdown id="timerTop" className="lf-timer" onExpire={handleExpire} />
          </>
        )}
      </div>

      <header className="lf-site-header">
        <div>Invocation Inc · Human Performance Engineers</div>
        <Link href="#offer">
          Get the System — <H2CTPrice expired={expired} />
        </Link>
      </header>

      <main id="main" className="lf-wrap">
        <p className="lf-stamp">
          Time creation for the rest of us. Not hustle culture. Not manifestation.
        </p>

        <p className="lf-tiny" style={{ textAlign: "center", marginBottom: 4 }}>
          HOW TO CREATE TIME
        </p>
        <p className="lf-tiny" style={{ textAlign: "center", marginTop: 0 }}>
          Same 24 Hours. Different Output.
        </p>

        <h1>You can&apos;t get more time. You can create it.</h1>

        <p className="lf-lead">
          This is the non-executive version of corporate strategic-vision coaching
          — the five-figure kind, built for CEOs and owners. The executive version
          works in two weeks, because the CEO already has a mission. This one takes
          eight, because you don&apos;t.
        </p>

        <p>
          You are on an island. The beach still has shade. Across the water you
          can see the other shore. <strong>Ninety-nine percent stay.</strong>{" "}
          They are comfortable. They are afraid. Or they wait for a feeling they
          were told they had to have first.
        </p>

        <p>
          You are in a burning building. The room still has a chair.{" "}
          <strong>Comfort is the number-one human instinct. Not survival.</strong>{" "}
          If survival were first, overdoses wouldn&apos;t happen, wrecks
          wouldn&apos;t happen, and we&apos;d still be in the cave. Familiar is
          comfort. Comfort kills.
        </p>

        <p>
          Most people have never written their hours down. They argue with a feeling.
          This book argues with a log. Most people spend about eighty percent of
          their hours on things that do not move the goal and do not keep livelihood
          alive. Attention is the toll. It does not refill at midnight. Where you
          paid with time and attention is what was important. If Other won, Other
          was the religion. If things other than what&apos;s important to you took
          up the most time, then the world won against you and comfort beat you.
        </p>

        <div className="lf-cta" id="buy-hero">
          {expired ? (
            <p className="lf-timer-hero">Window closed.</p>
          ) : (
            <p className="lf-timer-hero">
              <Countdown id="timerHero" onExpire={handleExpire} />
            </p>
          )}
          <BuyButton
            productId="book"
            expired={expired}
            label={
              <>
                Get the System — <H2CTPrice expired={expired} />
              </>
            }
          />
          <p className="lf-tiny">
            Book + Companion workbook + Time Log. PDFs download the second your
            payment clears.
          </p>
        </div>

        <h2>The gate: read this before anything else</h2>

        <p>
          This system is for the employee, the boss, the owner, or the person who
          does not have a title and still ran out of week. Anyone who will do the
          weeks: eight weeks, if you do the weeks.
        </p>

        <div className="lf-warn">
          <h2>Do NOT buy this system if:</h2>
          <p>
            <strong>You already have a mission.</strong> Then you don&apos;t need
            eight weeks. The executive version does this in two: write five
            priorities, delete everything else from the calendar, block the next
            fourteen days in fifteen-minute increments. This book is the crossing
            for everyone else.
          </p>
          <p>
            <strong>Your Point B fails the ethics gate.</strong> Legal where you
            live, survives a jury of your peers, matches your own ethics. Filling
            Don&apos;t Have and Want with a felony is not a Point B.
          </p>
          <p>
            <strong>You won&apos;t do a week of ink.</strong> The whole system starts
            with seven days of logging — no fixing, no skipping. If you won&apos;t
            write the hours down, nothing downstream works.
          </p>
          <p>
            <strong>You are waiting to feel like it.</strong> You do not need to
            want to change in order to change, you do not need a desire to change
            in order to change. Will is first. You do not need to love the goal.
            You are not in love with escaping a fire. You still leave.
          </p>
        </div>

        <h2>The mechanism: eight weeks, in order</h2>

        <p>
          Time creation sits on two numbers: <strong>two weeks</strong> and{" "}
          <strong>fifteen minutes</strong>. You pick or create a vision. You give it
          time equal to how much it matters. You put that time on the calendar in
          fifteen-minute blocks, always fourteen days out. The eight weeks below are
          the crossing that gets you to the place where those three steps actually
          work.
        </p>

        {WEEKS.map(([title, desc]) => (
          <div className="lf-week" key={title}>
            <h3>{title}</h3>
            <p>{desc}</p>
          </div>
        ))}

        <p>
          Forget the vocabulary. Do the weeks. Every tool in the book earns its
          name after you&apos;ve used it once — that is what the workbook is for.
        </p>

        <h2>What the executive version costs</h2>

        <p>
          This is a system. That is why we can charge $10,000 — or $2,500 an
          hour — for the executive version, and why companies keep paying it.
        </p>

        <p>
          <em>&ldquo;I will save you the tens of thousands of dollars people pay
          for that executive version. This costs hundreds of times less than a
          single hour of the training it came from.&rdquo;</em> That is the
          author&apos;s pitch, in his own words.
        </p>

        <p>
          His claim for people who do the weeks:{" "}
          <strong>
            about seventy-five percent more time than when you started
          </strong>{" "}
          — time that used to be Other, excuses, and repeats. The clock does not
          change and the output does. Same twenty-four. Magnitudes more of
          Don&apos;t Have and Want.
        </p>

        <p>
          And here is the part to sit with: seventy-five percent of everything
          you do should not be done by you. Less than a quarter of what you do
          is actually worthwhile to your goals. The freed hours go to making
          more money, more time with family, or whatever it is you love — the
          rest gets delegated, automated, or killed.
        </p>

        <h2>What you get: the system</h2>

        <p>
          This is not a book with a workbook. It is a system with a book in it —
          and that is the $47 justification.
        </p>

        <ul>
          <li>
            <strong>The book — <em>How to Create Time</em>.</strong> The full
            eight-week system, about eight thousand words, no fluff. Point B to
            your-name-off-the-job.
          </li>
          <li>
            <strong>The H2CT Companion workbook.</strong> Have/Want grids, weekly
            log pages, exercise pages — the paper half of the system, where the
            cycles actually happen.
          </li>
          <li>
            <strong>The H2CT Time Log.</strong> The fifteen-minute tracking grid.
            Week 1 starts here.
          </li>
        </ul>

        <h2>The ethics gate</h2>

        <p>
          This is not amoral hustle literature, and the book says so on the page:
        </p>

        <ul>
          <li>
            It does not matter what the destination is. What does matter: you are
            not sending explosives to anyone. Stay inside what is legal where you
            live, what would survive a jury of your peers, and what matches your
            own ethics.
          </li>
          <li>
            <strong>Do not trade sleep for time.</strong> Sleep is not optional.
            Seven to nine hours, every night. If your plan is to steal the goal out
            of those hours, stop. That is not commitment. That is a crash you
            scheduled.
          </li>
          <li>
            Do not outsource the living parts of a life and call it a system. Week
            8 is about work tasks, not family. The freed hour goes to the goal —
            or to family time that is actually you.
          </li>
        </ul>

        <h2>The author</h2>

        <p>
          <strong>Jonah Dorman</strong> is a U.S. Army combat veteran. He trained foster
          parents, social workers, and child-protection staff in trauma-informed care
          and positive communication — and served as VP or Chair/CoChair of 7+
          organizations bridging foster parents, the agencies that handle placements,
          and the government.
        </p>

        <p>
          He&apos;s been GM, VP, interim CEO — managing coders and IT workers (not always
          the best communicators) and running performance reviews for a living. He has
          studied hypnosis, NLP, sales, and performance. For a decade or so, he has
          run a company that makes weapons components for the U.S. Navy.
        </p>

        <p>
          The book is what those rooms have in common: five-figure strategic-vision
          coaching for CEOs and owners, distilled for the person who ran out of week.
          Time creation for the rest of us.
        </p>

        <h2 id="offer">Get the system</h2>

        <p>
          <strong>How to Create Time</strong> — the complete book, the Companion
          workbook, and the Time Log, direct from the author. The system is{" "}
          <H2CTPrice expired={expired} />{" "}
          {expired
            ? "now that your window closed."
            : "while the clock runs."}
        </p>

        <p>
          Why the discount? Our coaching clients are under NDA — so no borrowed
          wins, no fake five-stars. This page launches with zero testimonials,
          and the first public scoreboards come from buyers here. $47 is the
          before-proof price.
        </p>

        {expired ? (
          <>
            <p className="lf-timer-offer">Window closed.</p>
            <p>
              Your $47 window closed when the clock hit zero. The system is now
              $57 — still hundreds of times less than a single hour of the
              executive training it came from.
            </p>
          </>
        ) : (
          <p className="lf-timer-offer">
            <Countdown id="timerOffer" onExpire={handleExpire} />
          </p>
        )}

        <div className="lf-cta">
          <BuyButton
            productId="book"
            expired={expired}
            label={
              <>
                Get the System — <H2CTPrice expired={expired} />
              </>
            }
          />
          <p className="lf-tiny">
            PDFs available to download the second your payment clears. Sold here
            direct from the author.
          </p>
        </div>

        <div className="lf-warn">
          <h2>The price ladder</h2>
          <p>
            $47 exists while the bar counts. Miss it and the price climbs with
            the proof — $57, $67, $77, $87, $97. When the finished course ships,
            its standard price is $4,997. In person, under NDA, it is $10,000.
            This page&apos;s early price never comes back.
          </p>
        </div>

        <h2>Questions</h2>

        <div className="lf-faq">
          {FAQS.map(([q, a]) => (
            <details key={q}>
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </div>

        <div className="lf-ps">
          <p>
            P.S. — You did not invent a twenty-fifth hour. You stopped paying the
            ones you had to comfort. The water does not care that you were busy. It
            cares whether you got in.
          </p>
        </div>
      </main>

      <footer className="lf-footer">
        <p>© {new Date().getFullYear()} Invocation Inc. Not medical advice.</p>
        <p>
          <Link href="/privacy">Privacy</Link> · <Link href="/terms">Terms</Link>
        </p>
      </footer>
    </>
  );
}
