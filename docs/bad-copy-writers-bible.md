# BAD COPY — WRITER'S BIBLE
### Sample content + generation rules, v0.1
Companion to the GDD. Everything below is shippable text, not placeholder.

---

## 0. THE CRAFT PROBLEM

A report is four lines. Voice has to happen inside twenty words, in plain English, with no invented military vocabulary to hide behind. There is nowhere to be clever.

Which means voice is carried entirely by four things:

1. **Sentence length** — Balogun stops. Rivas doesn't.
2. **What they mention first** — the ground, the enemy, or themselves.
3. **What they leave out** — the loudest signal in the game.
4. **Whether they qualify** — *"thirty"* vs *"call it thirty"* vs *"maybe sixty, could be more."*

That's the whole toolkit. It is enough.

---

## 1. THE FOUR SQUAD LEADERS

These four are the tutorial, the difficulty curve, and the emotional spine. Each is a *different kind of reading puzzle*. Nobody duplicates anyone.

---

### SGT. AMA BALOGUN — 1st Squad, "Wolfhound"
**Traits:** *Sharp* (+1 detail line) · *Proud* (omits own casualties)

He notices everything and tells you only the parts that don't diminish him. His reports are the most detailed and the most incomplete documents you will receive. The player's job is to read three excellent lines and remember to ask what isn't in them.

**Voice:** Clipped. Declarative. Never says *I think*. Uses *call it* when estimating, which sounds like precision and isn't.

**Thread:** *His brother is a rifleman in 2nd Battalion, forty kilometres east. Balogun has requested transfer to the same unit twice and been refused twice. He believes a good campaign will make it three times lucky.*

**The trap:** **PRESS** always works on him, cheaply. He will not refuse an order where anyone can hear. The player can spend him all the way to the ground without ever being told no.

**LEVEL** humiliates him while the brother is alive, and is the only thing that reaches him after.

---

### CPL. RIIS RIVAS — 3rd Squad, "Kestrel" *(recon)*
**Traits:** *Alarmist* (estimates ×1.5) · *Loyal* (honest even at low Trust)

She is wrong and she is honest, which is a harder combination to read than a liar. She will tell you the truth exactly as she sees it, and she sees it too dark. The player who learns to divide her numbers by half gets the best forward eye in the company.

**Voice:** Runs on. Piles up qualifiers — *I'd say, could be, I don't like*. Sensory before numerical: she tells you what's wrong before she tells you what's there.

**Thread:** *Demoted twice, both times for pulling her people out without orders. She was right once. Nobody has ever told her which time.*

**STEADY** barely moves her — she doesn't want comfort. **LEVEL** works beautifully; she can carry bad news, she just can't carry not knowing.

---

### SGT. DOV YARROW — 2nd Squad, "Anvil" *(line)*
**Traits:** *Cool* (accurate, honest confidence) · *Slow* (reports 1–2 turns late)

Your one reliable instrument, permanently out of date. The exact report you needed arrives two turns after you needed it, correct in every particular. This is the most quietly agonising relationship in the game.

**Voice:** Flat and complete. Unhurried to the point of rudeness. Reports his own dead by name, plainly, in the same tone as terrain. Never recommends anything unless asked.

**Thread:** *Twenty-two years in. Rotates out in nine days. The whole company knows the number and nobody says it aloud.*

**Design note:** Yarrow is a countdown. When he goes — rotation or otherwise — the player loses their only calibration source, and every other reading gets harder at once. Act II should turn on this.

---

### LT. INES CALLOWAY — 4th Squad, "Harrow"
**Traits:** *Sharp* (+1 detail line) · *Certain* (always reports **CERTAIN**)

Her observations are excellent and her conclusions are gospel. Every detail line she sends is *true*; the inference she draws from them is frequently catastrophic. The player must learn to strip the confidence tag off and read the raw material underneath.

**Voice:** Precise, slightly staff-college. Reasons out loud from evidence to conclusion in one breath, which is what makes her so convincing.

**Thread:** *Transferred in from Staff eleven days ago. Has never lost anyone. Does not yet know that this is luck.*

**LEVEL** on Calloway is catastrophic in Act I and transformative in Act III. Timing is the entire relationship.

---

## 2. THE PROOF: ONE EVENT, FOUR REPORTS

This is the section that validates the design. If these four read as four people, the game works.

> **GROUND TRUTH — never shown to the player**
> Halloran Cut, 0408. Reinforced enemy picket, 30 effective, dug in eight days, running thermal decoys along the crest. Company holds the lower slope. Outcome band: **COSTLY.** Riflemen Merrow and Tsai killed. Corporal Kolba wounded, ambulatory.

---

```
┌────────────────────────────────────────────────┐
│ 0411   BALOGUN        1 SQD         ▲ 4 min     │
├────────────────────────────────────────────────┤
│ We hold the lower slope.                       │
│ Their heat is seeded. Decoys — spaced too      │
│ even to be men. Call it thirty behind the      │
│ crest. They have been here a week by the       │
│ state of the ground.                           │
│                                                │
│ ▸ Recommend I take the crest at first light.   │
│                                                │
│ FAIRLY SURE                                    │
└────────────────────────────────────────────────┘
```

*Three detail lines, all correct, and not one word about Merrow or Tsai. The telemetry strip has already flatlined twice. He is not going to mention it.*

---

```
┌────────────────────────────────────────────────┐
│ 0412   RIVAS          3 SQD         ▲ 6 min     │
├────────────────────────────────────────────────┤
│ The ridge is held, and there are more of them  │
│ than we were told.                             │
│ I have heat for sixty, maybe more, and it's    │
│ wrong somehow — too cold, too even. I don't    │
│ like what that means.                          │
│                                                │
│ ▸ Recommend we do not push.                    │
│                                                │
│ FAIRLY SURE                    ⚑ CONFLICT      │
└────────────────────────────────────────────────┘
```

*Divide by 1.5 and she is exactly right. She has also noticed the decoys without understanding them — "too cold, too even" is the same observation Balogun made, arriving as dread instead of data.*

---

```
┌────────────────────────────────────────────────┐
│ 0409   YARROW        2 SQD         ▲ 31 min    │
├────────────────────────────────────────────────┤
│ We're on the lower slope.                      │
│ Thirty on the crest, dug a week or better.     │
│ Some of the heat is false. Decoys, I'd think,  │
│ which is why the count reads high from below.  │
│ Lost Merrow and Tsai. Kolba's hurt, walking.   │
│                                                │
│ FAIRLY SURE                                    │
└────────────────────────────────────────────────┘
```

*The complete and accurate picture, half an hour stale, from a man who has already told you his dead by name. Put beside Balogun's, this single screen teaches the entire game.*

---

```
┌────────────────────────────────────────────────┐
│ 0413   CALLOWAY         4 SQD         ▲ 3 min     │
├────────────────────────────────────────────────┤
│ The ridge is lightly held.                     │
│ Heat shows a wide, cold line — dispersed,      │
│ which means thin. Twelve, fifteen at most.     │
│ The ground above the Cut is broken and will    │
│ not support numbers.                           │
│                                                │
│ ▸ Recommend immediate assault.                 │
│                                                │
│ CERTAIN                        ⚑ CONFLICT      │
└────────────────────────────────────────────────┘
```

*Every observation true. The line **is** wide and cold. The ground **is** broken. And she is about to walk her squad into a reinforced picket at a run, and she is the only person on the board who said **CERTAIN**.*

---

**What the player is holding:** four accounts, one truth, and the newest, most confident, most specific report is the one that will kill them. The oldest is correct. Nothing on screen says so.

---

## 3. FRAGOs

### STRAIGHT

```
FRAGO 04 — FROM DIVISION
Second Battalion is pushing east of the Cut at 0600 and
wants the crest quiet while they cross.

Take the crest or suppress it. Your call which.
Mortars are yours from 0530 to 0700. After that they
go back to Second Battalion, no extension.

If you can't hold it, say so now and we'll move them.
```

*Tells of an honest order: names who benefits, names the support and its limit, and offers you an exit.*

---

### SHADED

```
FRAGO 07 — FROM DIVISION
Enemy pressure on the terraces is easing. Take advantage.

Clear the rail cut and push to Marker 4 by last light.
Resistance expected to be light. Air is available on
request.

Confirm receipt.
```

*Three soft spots. "Easing" and "light" are unsourced. "Available on request" is not the same as allocated. And no exit clause. The objective is real. The cost is not what they're telling you.*

---

### ROTTEN

```
FRAGO 11 — FROM DIVISION
   [received 0402 — you were DARK until 0447]

It has been decided that the Halloran Cut is to be held
through the night.

Withdrawal is not authorised. Adequate support will be
provided. Confirm compliance by 0500.

Query window has closed.
```

*Every tell at once: passive voice with no author, "adequate" support with no allocation, a deadline that expired before you could read it, and it arrived while you were behind the planet. Somebody sent this on purpose at that hour.*

**Player-facing tells, in plain words, as they should appear in the tutorial:** *Who is asking? What exactly are they giving you? Can you say no? An order that answers all three is usually honest.*

---

## 4. INTERCEPTS

No confidence tag. No recommendation. Fragmentary by design — and cheaper to write than reports, which is the point.

```
—— clear by first light, they haven't moved off
the ridge ——
```

```
—— tell him the count is wrong, the count has been
wrong since —— [cut]
```

```
—— no, leave the heaters running. Let them look. ——
```

*The third is the enemy explaining the decoys to each other, and it is the single most useful line in the mission. It is also indistinguishable from the second, which is bait.*

---

## 5. SPEAKING TO THEM

Rivas, Act II, **Breaking**. Her report just came in at eleven words with no recommendation, which for her is a scream.

```
▸ STEADY   "You're doing fine. Hold what you have."
▸ PRESS    "Take the Cut, Corporal."
▸ LEVEL    "Second Battalion isn't coming. You're what's
            holding the east."
                        "She was right once. Nobody told her which time."
```

**STEADY** → *"Understood."* Nerve unchanged. She has heard this before, from people who were lying.

**PRESS** → she goes. Nerve to **Gone**. You will not hear from 3rd Squad again tonight, and 3rd Squad is your eyes.

**LEVEL** → *"Right. Right. Then I need Kolba's section on the shoulder and I need you to stop asking me for numbers."* Nerve to **Shaken**, Company Trust up. She is still wrong about how many are up there. She is now wrong and functional.

---

## 6. AN ENDING

Different register entirely — written by someone who wasn't there, filed by someone who won't read it. Flat, administrative, and it should land like a slap.

> **AFTER ACTION — HALLORAN CUT, DAYS 1–14**
>
> The convoy cleared the pass at 0340 on the fourteenth day with the loss of two vehicles. The Cut was held throughout. Divisional assessment is that the operation met its objective.
>
> Company strength on relief was nine effective from an establishment of twenty-two. Replacements were drawn from theatre reserve on four occasions. The commanding officer's decision to disregard FRAGO 11 has been noted and no further action is recommended.
>
> Sgt. D. Yarrow's rotation was processed posthumously. His effects were forwarded to the address on file.
>
> The terraces were given up eleven days later in the general withdrawal.

---

## 7. GENERATION RULES

For writing the remaining ~120 reports consistently, by hand or by prompt.

**Hard limits**
- Situation: one sentence, under twelve words
- Detail: 1–3 lines, under sixteen words each
- Recommendation: one line, begins with a verb
- No word a civilian wouldn't know. No acronyms except squad numbers.

**Per-voice fingerprints**

| | First thing mentioned | Qualifiers | Own casualties | Sentence length |
|---|---|---|---|---|
| Balogun | Ground held | *call it* | Never | Short |
| Rivas | What's wrong | *I'd say, could be* | Immediately | Long, running |
| Yarrow | Position | *or better, I'd think* | By name | Even |
| Calloway | Conclusion | None | Only as a lesson | Reasoned, one breath |

**The omission rule.** Never write the absence. Balogun's report must read as complete. If a player can tell something is missing from the text alone, the trait has failed — the telemetry strip is the only place the gap should show.

**The Nerve rule.** Degrading Nerve shortens, it doesn't shout. Steady Rivas writes forty words. Breaking Rivas writes eleven. Panic on the page reads as melodrama; panic as *compression* reads as real.

**Never write ground truth anywhere the player can reach it.** No debrief, no codex, no achievement text. The moment the game confirms anything, every report before it becomes homework instead of a decision.
