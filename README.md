# Bad Copy

You command a company you will never see. Everything you know is what somebody
chose to tell you, and every one of them tells it differently.

A report only military campaign game set in Noctis Labyrinthus, Mars, 2141.
Permadeath. The roster refills. What does not refill is your ability to read
the person who died.

## The one mechanic

The simulation is honest. The report is not.

Ground truth is resolved cleanly and then passed through the reporting
soldier's personal filter on the way up to you. Filters scale enemy estimates,
drop casualty lines, thin the detail, force the confidence tag, or hold the
whole transmission back a turn or two. Nothing is randomly noisy. If you learn
the filter you can invert it, and that is the entire mastery curve.

Sol 3 is the proof. Four squads report one ridge:

| Reporter | Says | Confidence | Arrives |
| --- | --- | --- | --- |
| Yarrow | 30 | Fairly sure | two windows late |
| Balogun | 40 | Fairly sure | on time, no mention of his dead |
| Rivas | 60 | Fairly sure | on time |
| Calloway | 20 | **Certain** | on time |

There were thirty. The newest, most specific, only confident report is the one
that gets people killed. The board flags the disagreement and never tells you
who is right, because nothing in this game ever confirms anything.

## Running it

```
npm install
npm run dev
```

## Deploying to GitHub Pages

1. Push to `main`.
2. Repository settings, Pages, set Source to **GitHub Actions**.

`base` is set to `'./'` so the build works at any repo name and on a custom
domain. Do not set it to an absolute path unless you add a client side router,
because an absolute base that does not match the repo name serves a blank page
with no error.

The workflow in `.github/workflows/deploy.yml` builds and publishes on every
push to `main`.

## Where the content lives

All writing is data. The engine never needs touching to add a sol.

| File | What is in it |
| --- | --- |
| `src/data/campaign.ts` | Every mission, FRAGO text, honesty tier, Salk lines |
| `src/data/cast.ts` | Soldiers, traits, threads, replacement pool |
| `src/data/dialogue.ts` | Every conversation branch across nerve states |
| `src/data/board.ts` | Nodes, routes, comms state, hidden enemy strength |
| `src/engine/voices.ts` | The prose filters. One function per person |

Act I, sols 1 to 7, is written. Acts II and III have their real FRAGO text and
structure in place and are marked `stub: true`, so the whole campaign runs and
the remaining work is writing rather than engineering.

## House style

No dashes anywhere in game text. Radio traffic breaks on full stops and new
lines, which is how people actually speak into a microphone. Enemy counts are
rounded and hedged, never exact. Nobody is eloquent about death.
