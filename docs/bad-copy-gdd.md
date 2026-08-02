# BAD COPY
### Game Design Document v0.1
**Tervin Labs** — replaces *Dead Reckoning* in the portfolio

---

## 1. ONE-LINE PITCH

You command a company of soldiers you will never see. Everything you know comes from what they choose to tell you — and they are all, in their own small ways, lying.

---

## 2. DESIGN PILLARS

**1. Simple to read. Hard to be sure.**
Every piece of text on screen is plain English, four lines or fewer, no invented jargon. The difficulty never comes from confusion — it comes from two people you trust telling you different things.

**2. Information is the resource.**
Ammunition and fuel matter, but the scarce thing is *knowing*. Good soldiers are good because they see clearly and say so.

**3. Death costs sight, not bodies.**
Bodies get replaced. What you lose permanently is a person whose particular way of seeing the world you had finally learned to read.

**4. You are responsible, not present.**
You give intent and accept outcomes. The game never lets you take the shot yourself.

---

## 3. THE TWO HARD PROBLEMS, SOLVED UP FRONT

This document exists to answer two questions that could sink the concept.

### 3.1 "If the roster refills, does permadeath still hurt?"

Yes — because **replacements restore manpower, not information**.

Every soldier reports to you through a personal filter. Rivas overstates enemy numbers. Balogun hides his own casualties. You learn these filters over roughly three reports, and once learned, they are *shown to you permanently as a plain-English tag* on that soldier's card. A read soldier is a reliable instrument, even if the instrument is bent, because you know exactly how it's bent.

When Rivas dies, a dropship brings you Private Aduba four turns later. Aduba is:

- **Unread.** Her tags are hidden. You are blind again in that sector for three reports.
- **Thin.** Green soldiers produce shorter reports — one detail line instead of three. Literally less information per turn.
- **Costly to the squad.** Cohesion drops, and low-cohesion squads report late.

So the loop is: *you invest turns into learning a person, and death liquidates the investment.* The roster refill means the campaign never soft-locks and never becomes a save-scumming exercise. It just gets dimmer.

**Design rule:** never let a replacement be strictly better than the veteran they replace. Replacements may have better raw stats. They are never better *known*.

### 3.2 "How is this legible to someone who has never played a wargame?"

Six rules, enforced across the whole game:

| Rule | Implementation |
|---|---|
| No numbers the player must do maths on | Enemy strength is "a few", "a lot", "more than us" — never "14 hostiles" |
| Three certainty words only | **Certain** / **Fairly sure** / **Guessing** — every report carries exactly one |
| Max two traits per soldier | Written as plain sentences: *"Thinks things are worse than they are."* |
| Eight order verbs, total | Each with a one-line description on the button itself |
| The map colours itself | Pins auto-place from reports; the player only overrides if they want to |
| Contradiction is flagged for you | When two reports disagree, the game says **CONFLICT** in red. It never says who's right. |

The complexity budget is spent entirely on *whom to believe*. Nothing else is allowed to be hard.

---

## 4. FICTION & SETTING

**Where:** A contested colony world. Deliberately unglamorous — mining terraces, freight rail, weather that ruins optics.

**Who you are:** A command officer aboard the frigate *Halcyon Reach*, in low orbit. You have never met your company in person.

**Why you only get reports:** Orbital mechanics. The *Halcyon Reach* completes a pass every ~90 minutes. Signal latency swings from 40 seconds at closest approach to nineteen minutes at the far arc, and for a stretch of every orbit the planet's mass puts you fully **DARK** — no contact in either direction.

This is the single most important fictional device in the game. It makes "you only get reports" a physical fact rather than a rule, and it hands you a free pacing rhythm:

```
CONTACT (fast)  →  CONTACT (slow)  →  DARK  →  CONTACT (fast)
   orders land      orders stale      nothing      the backlog arrives
   in seconds       by 12 minutes     at all       all at once
```

The moment where you come out of DARK and eleven queued reports land in sequence — some of them written by people who were already dead when they sent them — is the game's signature beat.

**Second device:** neural augments push raw vitals continuously, even when text can't get through. A telemetry strip runs along the bottom of the screen at all times. During DARK, the text stops but the vitals don't. You will learn someone died by watching a line go flat, with no explanation, forty minutes before you can ask what happened.

---

## 5. CORE LOOP

```
1. READ     Reports arrive. Some conflict. Some are late. Some are from people you don't trust.
2. BELIEVE  Update your board. Decide which account of reality you're acting on.
3. ORDER    Issue verbs + intent to squads. Orders take latency-time to land.
4. WAIT     Turn resolves off-screen. You cannot watch.
5. LIVE WITH IT
```

One turn = ten minutes of in-fiction time. A mission runs 8–20 turns.

---

## 6. THE REPORT SYSTEM

### 6.1 Anatomy

Every report is the same four-part shape. Players learn it in one mission and never have to think about it again.

```
┌────────────────────────────────────────────────┐
│ 0412   RIVAS          RECON 2       ▲ 12 min    │
├────────────────────────────────────────────────┤
│ The ridge is held.                             │  ← SITUATION
│ More of them than us. Their heat signatures    │  ← DETAIL (1–3 lines,
│ are wrong — too cold, too many.                │     by veterancy)
│                                                │
│ ▸ Recommend we do not push.                    │  ← RECOMMENDATION
│                                                │
│ FAIRLY SURE                    ⚑ CONFLICT      │  ← CONFIDENCE + FLAG
└────────────────────────────────────────────────┘
```

- **Timestamp + age.** `▲ 12 min` means this is twelve minutes stale. Always shown.
- **Situation.** One short sentence. Always present.
- **Detail.** 1 line (green), 2 (regular), 3 (veteran). Veterancy is literally information bandwidth.
- **Recommendation.** Optional. Present only if the soldier has an opinion — which is itself a trait.
- **Confidence.** Exactly one of three words.
- **Conflict flag.** Auto-computed. Fires when another live report contradicts this one.

### 6.2 The sim is honest. The report is not.

Architecturally this is the whole game:

```
GROUND TRUTH  →  BIAS FILTER  →  REPORT TEXT
(never shown)     (per soldier)    (all the player ever sees)
```

The simulation resolves cleanly and deterministically. Then each reporting soldier's filter mangles it on the way up. Filters can:

- **Scale estimates** — multiply perceived enemy numbers by 0.6–1.6, then bucket into plain words
- **Omit** — drop own-casualty lines entirely, or drop the detail that would have saved you
- **Slant** — attach a recommendation that doesn't follow from the facts
- **Delay** — hold the report 1–3 turns (out of fear, or because they were busy not dying)
- **Inflate confidence** — say *Certain* when they should say *Guessing*

Filters are the *only* source of unreliability. No random noise. If the player learns the filter, they can back out the truth. That's the mastery curve, and it is fully learnable — which is what makes it fair.

### 6.3 Trait vocabulary

Every trait is a plain sentence. Roughly 20 in the shipping game; here are the load-bearing ones:

| Trait | Effect | Player-facing text |
|---|---|---|
| Alarmist | Enemy estimates ×1.5 | *"Thinks things are worse than they are."* |
| Cool | Estimates accurate, confidence honest | *"Says what she sees. Nothing more."* |
| Proud | Omits own casualties | *"Won't tell you when he's losing."* |
| Slow | Reports delayed 1–2 turns | *"Takes his time getting word up."* |
| Certain | Always reports "Certain" | *"Never admits to doubting herself."* |
| Loyal | Reports honestly even at low Trust | *"Will tell you the truth even when he shouldn't."* |
| Sharp | +1 detail line | *"Notices things other people don't."* |
| Green | −1 detail line, no recommendation | *"New. Hasn't learned what matters yet."* |

**The Read mechanic:** traits start hidden. After 2 reports the game shows a **suspected** trait in grey with a question mark. After 4 it confirms in white. This is the single most satisfying progression in the game and it costs nothing to implement.

---

## 7. THE BOARD

A sparse tactical board — 12–20 named locations connected by routes. Not a grid; a node map. Cheap to build, easy to read.

**Pins auto-place.** When a report mentions a location, the board places a pin coloured by corroboration:

- 🟢 **GREEN** — two or more independent sources agree
- 🟡 **AMBER** — one source only
- 🔴 **RED** — sources contradict each other

A new player can simply trust the colours and have a good time. An experienced player will notice that two reports from the *same alarmist squad* both say green, and that green means nothing here.

**Manual override:** the player can drag any pin, recolour it, or add a note. The game never corrects them, and never confirms. There is no post-mission "here's what was really there" screen — ever. That reveal would kill the entire premise.

---

## 8. ORDERS

Eight verbs. That's the whole command language.

| Verb | One-line description shown on the button |
|---|---|
| **MOVE** | Go there. Avoid contact if possible. |
| **RECON** | Go look. Don't get drawn in. |
| **HOLD** | Stay. Don't give ground. |
| **ENGAGE** | Attack what's there. |
| **BREAK CONTACT** | Get out. Now. |
| **DIG IN** | Fortify. Slow, but hard to move. |
| **DETACH** | Split a fireteam off for a separate task. |
| **GO DARK** | Radio silence. No reports until they surface. |

**GO DARK** deserves special mention: the player voluntarily blinds themselves in exchange for the enemy not hearing the transmissions either. It is the most interesting button on the screen.

### 8.1 Intent (inherited from *Dead Reckoning*'s doctrine system)

Because orders arrive up to nineteen minutes stale, every squad carries a **standing intent** governing how it improvises when your orders no longer match reality:

| Intent | Behaviour when out of contact |
|---|---|
| **Preserve the squad** | Disengages early. Survives. Fails objectives. |
| **Hold the line** | Won't retreat without explicit orders. Dies in place. |
| **Take the ground** | Pushes on initiative. Wins things you didn't ask for. Loses people. |
| **Use your judgement** | Defers to the squad leader's traits — good leaders shine, bad ones improvise you into a grave. |

Intent is set once and changed rarely. It's the player's command *style*, made mechanical, and it's what the ending text judges them on.

### 8.2 Speaking to them

The commander cannot ask for more information. The commander *can* talk a soldier down, or talk one into something.

This is the second command channel, and it deliberately does not touch the fog — you still never see the ground. You only manage the person standing on it.

**Nerve** is a second condition track, four plain words, shown beside physical Condition:

| Nerve | Effect on their reporting |
|---|---|
| **Steady** | Filter behaves as read. |
| **Shaken** | Filter amplified by half again. Confidence inflates — they start saying *Certain*. |
| **Breaking** | Filter doubled. Recommendations become pleas. May refuse orders outright. |
| **Gone** | Stops reporting. The squad runs on Intent alone, and you are blind in that sector. |

This is the elegant part: **Nerve is a multiplier on a filter the player has already learned.** A Shaken alarmist isn't a new problem, it's a familiar problem twice as loud. Nothing new to teach.

**Three things you can say.** One tap each, no dialogue trees.

| Verb | What it does | Where it's dangerous |
|---|---|---|
| **STEADY** | Calm them. Nerve up one step. | Weak on *Breaking* — sometimes you're too late. |
| **PRESS** | Override a refusal. The order gets carried out. | Costs a step of Nerve. You are spending the person. |
| **LEVEL** | Tell them the whole truth, including the part that will frighten them. | On *Cool* or *Loyal*, restores Nerve **and** buys Company Trust. On *Proud* or *Alarmist*, can push straight to Breaking. |

**The cost is the order slot.** In a given comms window you either command a squad or you talk to it. Never both. That is the entire economy of this system and it needs no further balancing.

**Personal threads become mechanically load-bearing.** Whether a message lands is a function of Company Trust, the soldier's traits, and their revealed thread. Once a thread is known, the relevant button carries a plain hint line:

```
▸ LEVEL                          "He has a brother in 2nd Battalion."
```

So the read has two layers now. Layer one: *how does this person distort what they see?* Layer two: *what do I say to this person when they are coming apart?* The flavour content and the mastery content are the same content.

**Failure moves Nerve the wrong way by one step.** This is a real bet, not a free action.

**At low Company Trust, none of it works.** They've stopped listening. The spiral is brutal and it is fair, because the player watched the bar fall.

**And you can talk to the dead.** If a soldier died during a DARK window, the STEADY you sent goes out anyway. It is never flagged, never acknowledged, never greyed out. See §10.5.

---

## 9. THE COMPANY

**Structure:** 1 company → 4 squads → 4–6 soldiers each. ~20 named soldiers at full strength.

**Who reports:** only the squad leader. Other soldiers exist as names, vitals, casualties, and occasional interjections — and as the pool that promotes up when the leader dies. That promotion moment is key: the new leader's traits are unknown, and might be terrible.

**Per-soldier data (all player-visible except traits-pending-read):**

- Name, rank, portrait
- Up to 2 traits (hidden → suspected → confirmed)
- Condition: **Fresh / Tired / Hurt / Bad** — four words, no numbers
- Nerve: **Steady / Shaken / Breaking / Gone** (§8.2)
- Vitals line (live, always, even during DARK)
- A one-line personal thread that occasionally surfaces in reports

**Personal threads** are the cheapest emotional content in the game *and*, since §8.2, the key to talking anyone down. Two or three sentences, revealed across a campaign: *Balogun has a brother in 2nd Battalion. Rivas has been demoted twice. Aduba lied about her age to enlist.* Knowing the thread tells you which of the three things to say. When they die, the thread just stops. No resolution. That's the point.

---

## 10. MISSIONS

### 10.1 Campaign Objective

Fixed at hour zero, stated plainly, never changes. Example: **"Hold the Kessel Terraces until the evacuation convoy clears the pass. Fourteen days."**

Everything else is noise generated on top of it.

### 10.2 FRAGOs

Command issues Fragmentary Orders as the campaign develops. This is the mission-generation system. Each FRAGO has a hidden honesty tier:

| Tier | What it is | Frequency |
|---|---|---|
| **Straight** | Genuine, and the stated situation is accurate | ~50% |
| **Shaded** | Real objective, but the risk is understated | ~30% |
| **Rotten** | Serves someone upstream. Will cost you people for nothing. | ~20% |

**The player has three responses:**

- **COMPLY** — do it as ordered
- **QUERY** — spend one comms window asking Command to justify it. Reveals a partial tell. Costs you a turn of orders, and repeated queries cost Command Standing.
- **REFUSE** — Command Standing down hard, Company Trust up hard

**Tells** are learnable, in plain language. Rotten FRAGOs tend to: arrive during DARK windows (so you can't query), use passive voice about who's asking, promise support that isn't specified, and set deadlines that don't match any known operational reality. A player who has been burned twice will start reading these the way they read Rivas.

### 10.3 The two meters

Displayed as two short bars. They pull against each other and the game never tells you which to favour.

**COMMAND STANDING** governs: reinforcement speed, resupply, access to orbital fire support, and how much information Command shares with you.

**COMPANY TRUST** governs: **report honesty**. This is the vicious one. At low Trust, your own soldiers start filtering harder — omitting more, delaying more, recommending less. At very low Trust, squads disobey orders and, eventually, walk off the board.

**Both meters are visible as bars** on Standard difficulty — but only the bars, never the numbers behind them and never a stated threshold. The key tuning requirement: **Trust must visibly fall a window or two before reporting degrades.** The player gets a warning they can act on. A meter that only reveals itself through symptoms is better design and worse onboarding; visible wins. Hidden on Dark Air.

The design intent: *obeying Command blinds you to the ground; obeying your company blinds you to the war.*

### 10.4 Intercepts

From Act II, a fourth source appears: fragments of enemy transmission, picked up while you're in contact.

Intercepts are **not reports**. They are three or four lines, partial, mid-conversation, sometimes cut off. They carry no confidence tag — the enemy does not label their certainty for your convenience — and no recommendation.

```
┌────────────────────────────────────────────────┐
│ 0431   INTERCEPT              PARTIAL          │
├────────────────────────────────────────────────┤
│ —— clear by first light, they haven't          │
│ moved off the ridge ——                         │
│                                                │
│ INTERCEPT                      ⚑ CONFLICT      │
└────────────────────────────────────────────────┘
```

They enter conflict detection as a full source. So an intercept can **corroborate Rivas and make her look right** — which is exactly the trap, because intercepts are the one source whose filter you can never learn. Some are genuine. Some are broadcast to be overheard.

This gives Act II a clean escalation: the player has just finished learning to read four people, and is handed a fifth voice that is unreadable by design.

**GO DARK now cuts both ways** — silence means no intercepts either.

**Scope note:** ~30 short templates, not a second full pipeline. Keep them fragmentary; fragments are cheaper to write *and* better.

### 10.5 Reports from the dead

The report queue is time-stamped and latency-delayed. Death does not purge it.

A soldier killed at 0412 whose report was written at 0408 will have that report arrive at 0419, in sequence, in the ordinary feed. It is **never flagged**. No posthumous label, no colour change, no acknowledgement anywhere in the UI.

The telemetry strip is the only tell. The player sees a flatline, then reads a recommendation from the person who flatlined, and does the arithmetic themselves. The game must never do it for them.

Same rule for outgoing messages: a **STEADY** sent into a DARK window transmits normally to a person who is already dead. It sends. That's all. No error state, no confirmation, nothing.

---

## 11. RESOLUTION

Deliberately simple, because the player never sees it and the interesting complexity lives elsewhere.

```
Effectiveness = Training + Position + Morale − Fatigue − Attrition
Threat        = enemy strength at node + posture modifier
Roll          = seeded d100 vs (Effectiveness − Threat)
```

Outcome bands, four only: **Clean / Costly / Repulsed / Broken.**

Then: casualty assignment (weighted toward exposed roles, never plot-armoured), condition updates, morale updates, and finally the outcome is handed to the report generator to be distorted on the way up.

**Seeded and deterministic.** Same seed, same choices, same outcome. Non-negotiable — a game about believing your instruments cannot have the instruments be genuinely random.

---

## 12. CAMPAIGN STRUCTURE

**Length:** 4–6 hours. Three acts. ~20 missions, of which 6 are structural and the rest are generated FRAGOs.

**Act I — Learning to read.** Low stakes, Straight FRAGOs only, generous comms windows. The player learns four squad leaders' filters. No one important dies unless the player is careless.

**Act II — The first rotten order.** Shaded and Rotten FRAGOs enter. Comms windows shorten. The first veteran leader death happens here, ideally as a consequence of trusting a filter the player hadn't yet read. Replacements arrive and the player feels the blindness.

**Act III — Dark.** Long DARK stretches. Command Standing and Company Trust have diverged far enough that one of them is hostile. The Campaign Objective comes due.

**Endings:** a matrix of *Objective (held / lost)* × *Company (intact / gutted / mutinied)* × *Standing (in good order / relieved of command)*. Six to eight ending texts, each 200–400 words, written as an after-action review by someone who wasn't there and doesn't know what it cost.

**Replayability:** trait assignment, FRAGO honesty tiers, and enemy disposition are all re-rolled per campaign. The soldiers are the same names; they are not the same people.

---

## 13. SCREENS

Four. That's it.

1. **FEED** (primary) — chronological report stream, newest at top, conflicts flagged. Telemetry strip pinned to the bottom. Comms status pinned to the top.
2. **BOARD** — node map with auto-pins.
3. **COMPANY** — four squad cards, expandable to soldiers, traits and conditions visible.
4. **ORDERS** — squad selector, eight verbs, intent dropdown, confirm. Shows expected order latency before you commit.

Everything reachable in one tap from everything else. No submenus.

**Visual direction:** monospaced terminal, but warm — amber and bone on near-black, not the usual green-on-black cliché. Text is the art. Pixel portraits (reusable pipeline from *Masters of the Way*) are the only illustration, and they're small.

---

## 14. FIRST TEN MINUTES

The onboarding is the highest-risk part of the whole design. Spec it as tightly as the systems.

- **Turn 1.** One squad. One report. One order. No conflict, no latency. Player learns the report shape.
- **Turn 2.** Second squad appears. Their report disagrees with the first. The **CONFLICT** flag fires. Player must choose. Both choices are survivable.
- **Turn 3.** Whoever the player believed gets a trait revealed as *suspected*. The game says, in one line: *"You may be starting to learn how Rivas sees things."*
- **Turn 4.** First latency. Order lands two turns late. Nobody dies.
- **Turn 6.** First DARK window. Thirty seconds of no information, telemetry still running.
- **End of mission 1.** No debrief revealing ground truth. Just the next FRAGO.

No tutorial text boxes. No tooltips explaining wargame concepts, because there are none to explain.

---

## 15. ACCESSIBILITY & DIFFICULTY

| Option | Effect |
|---|---|
| **Assisted reading** | Suspected traits appear after 1 report instead of 2 |
| **Standard** | As specified |
| **Dark Air** | Traits never confirm past *suspected*. Conflict flags disabled. |
| **Slow comms** | Turn timer removed entirely; game is fully turn-based with no pressure |

Ship with **Slow comms** as the default. Real-time pressure adds nothing here and excludes people for no gain.

Text scaling, dyslexia-friendly font toggle, and full colour-blind support for the pin system (shapes, not just colours) are requirements, not options — the pin colours are load-bearing information.

---

## 16. SCOPE & TECH

**Stack:** React + Vite + TypeScript. Zustand for state. Seeded RNG. Versioned save/migration (reuse the pattern from *Masters of the Way*). Deploys to GitHub Pages. No backend.

**Why it's the right project for 20 hrs/week:** text-first means the art budget is near-zero, the node map is not a tilemap, and the report generator is templating, not simulation. The expensive part is writing, which is the thing you're actually good at.

**Content requirements:**

- ~20 traits with filter implementations
- ~120 report templates (situation / detail / recommendation variants across 8 verbs × 4 outcome bands)
- ~30 intercept fragments
- ~40 FRAGO templates across three honesty tiers
- 20 soldier names + personal threads, each written to imply which of STEADY / PRESS / LEVEL lands
- ~24 response lines for the three speech verbs × 4 Nerve states
- 8 ending texts
- 16 board nodes

**Vertical slice (6 weeks at 20 hrs):**

| Week | Deliverable |
|---|---|
| 1 | Data model, seeded resolution, turn loop, no UI |
| 2 | Report generator + 3 traits, console output only |
| 3 | FEED screen, telemetry strip, comms window states |
| 4 | ORDERS screen, 8 verbs, latency, intent |
| 5 | BOARD auto-pinning, conflict detection |
| 6 | COMPANY screen, Read mechanic, one playable mission |

Slice success criterion: **a playtester who has never played a wargame chooses to disbelieve a soldier, is wrong, and someone dies for it.** If that happens once, the design works.

---

## 17. RISKS

| Risk | Mitigation |
|---|---|
| Players find unreliable reporting *frustrating* rather than interesting | Traits must be learnable and permanently displayed once confirmed. Frustration comes from unfairness, not uncertainty. |
| Text-only feels dry in the first three minutes | Telemetry strip provides constant motion. Conflict flags provide colour. Front-load the first conflict to turn 2. |
| The board becomes a spreadsheet | Cap nodes at 20. Auto-pin by default. |
| Report templates read repetitively across a 5-hour campaign | Budget for 120 templates minimum, and vary by *reporter voice* not just outcome — same event, four leaders, four genuinely different texts. |
| Roster refill trivialises death | Enforce the rule in §3.1: replacements are never better *known*. Cohesion penalty and bandwidth loss must be visible on screen when a veteran dies. |
| §8.2 degenerates into a persuasion minigame with correct answers | No dialogue trees, three verbs only, one tap. Outcome depends on state the player already learned, not on guessing a keyword. If playtesters start describing it as "the dialogue system," it has gone wrong. |
| Nerve triage eats every order slot in Act III | See §19.1 — passive recovery may be required. Watch for players who stop commanding entirely. |

---

## 18. DECISIONS TAKEN (v0.2)

1. **Direct contact — RESOLVED, and narrowed.** The commander cannot ask for information, only manage the person: calm them, convince them, or tell them the truth. Specced as §8.2. The narrowing is what saves it — it adds a whole system without weakening the fog by a single line.
2. **Enemy voice — IN, from Act II.** Fragmentary intercepts, no confidence tag, unlearnable filter. §10.4.
3. **Posthumous reports — IN, unflagged.** §10.5.
4. **Company Trust — VISIBLE** on Standard, hidden on Dark Air. §10.3.

## 19. STILL OPEN

1. **Can Nerve be recovered without spending an order slot?** Rest, resupply and reinforcement probably ought to nudge it. If they don't, Act III becomes an unwinnable spiral where every window is spent on triage. Tune in the slice.
2. **Does the player see their own outgoing messages in the feed?** Recommend yes — a single grey line — because §10.5 only lands if the player can scroll back and find the thing they said to someone who could no longer hear it.
3. **How many intercepts per mission?** Too many and they become a reliable oracle; too few and the trap never springs. Start at one per two missions and tune upward.
4. **Does a Gone leader get relieved automatically, or does the player have to do it?** Making the player make that call by name is stronger. It may also be one cruelty too many.

---
