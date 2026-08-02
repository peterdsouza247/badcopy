import type { Nerve, SpeakVerb } from '../engine/types'

export interface Exchange {
  reply: string
  /**
   * Plain English, shown under the reply. The player should never have to
   * infer from tone what a conversation just did to someone.
   */
  effect: string
  nerveDelta: number
  trustDelta: number
  standingDelta?: number
  remember?: string
  requires?: string
  unless?: string
}

type Tree = Partial<Record<Nerve, Partial<Record<SpeakVerb, Exchange[]>>>>

/**
 * Three buttons and a person on the other end.
 *
 * Rules for every line in this file:
 *   1. Contractions. People say "don't" on a radio. Writing it out long makes
 *      four different characters sound like one robot.
 *   2. Self contained. A line must land even if the player has not read the
 *      dossier. Reward for knowing the backstory, never a requirement.
 *   3. Under twenty words. Radio discipline is the style guide.
 *   4. No dashes. Pauses are full stops and new lines.
 */
export const DIALOGUE: Record<string, Tree> = {
  // -----------------------------------------------------------------------
  // BALOGUN. Never refuses. Same word at every state, so the player can spend
  // him all the way down and the text will never warn them. Only the bar moves.
  // -----------------------------------------------------------------------
  balogun: {
    Steady: {
      STEADY: [{ reply: 'Copy. Nothing wrong here.', effect: 'He did not want reassurance. No change.', nerveDelta: 0, trustDelta: 0 }],
      PRESS: [{ reply: 'Moving.', effect: 'He goes. He always goes.', nerveDelta: 0, trustDelta: 0 }],
      LEVEL: [
        {
          requires: 'balogunThread',
          reply: "My brother's out that way, isn't he.\nAll right. Tell me the rest.",
          effect: 'You told him the truth about the east. It reached him. Steadier, and he trusts you more.',
          nerveDelta: 1,
          trustDelta: 6,
          remember: 'BALOGUN WILL REMEMBER THAT',
        },
        {
          reply: "I don't need the whole war, sir.\nJust my piece of it.",
          effect: 'He heard that as being managed. It cost him a step.',
          nerveDelta: -1,
          trustDelta: 0,
        },
      ],
    },
    Shaken: {
      STEADY: [{ reply: "I'm fine. Squad's fine.\nAnything else?", effect: 'He will not admit to needing it. No change.', nerveDelta: 0, trustDelta: 0 }],
      PRESS: [{ reply: 'Moving.', effect: 'He goes without arguing. It cost him a step and he did not say so.', nerveDelta: -1, trustDelta: 0 }],
      LEVEL: [
        {
          requires: 'balogunThread',
          reply: "My brother's out that way, isn't he.\nAll right. Tell me the rest.",
          effect: 'The one thing that reaches him. Steadier, and he trusts you more.',
          nerveDelta: 1,
          trustDelta: 6,
          remember: 'BALOGUN WILL REMEMBER THAT',
        },
        { reply: "Then that's what it is.\nWolfhound out.", effect: 'He took it flat. No change.', nerveDelta: 0, trustDelta: 0 },
      ],
    },
    Breaking: {
      STEADY: [{ reply: "Don't.\nJust give me something to do.", effect: 'A task steadies him where comfort will not. One step back.', nerveDelta: 1, trustDelta: 0 }],
      PRESS: [
        {
          reply: 'Moving.',
          effect: 'Same word as always. He is gone now, and he never once told you no.',
          nerveDelta: -1,
          trustDelta: -4,
          remember: 'WOLFHOUND HAS STOPPED ANSWERING',
        },
      ],
      LEVEL: [
        {
          requires: 'balogunThread',
          reply: "My brother's out that way, isn't he.\nAll right. Tell me the rest.",
          effect: 'You reached him at the last possible moment. Steadier, and he trusts you a great deal more.',
          nerveDelta: 1,
          trustDelta: 8,
          remember: 'BALOGUN WILL REMEMBER THAT',
        },
        {
          reply: "You're telling me this because you think I'm finished.",
          effect: 'He heard pity. Worse, and he trusts you less.',
          nerveDelta: -1,
          trustDelta: -3,
        },
      ],
    },
  },

  // -----------------------------------------------------------------------
  // RIVAS. Wrong and honest. The truth always reaches her. At Breaking it
  // buys her back at the cost of an order she will not follow.
  // -----------------------------------------------------------------------
  rivas: {
    Steady: {
      STEADY: [{ reply: 'Copy that.', effect: 'Took it well. A little steadier.', nerveDelta: 1, trustDelta: 0 }],
      PRESS: [{ reply: "Copy. Kestrel's moving.", effect: 'She goes, but it cost her a step.', nerveDelta: -1, trustDelta: 0 }],
      LEVEL: [
        {
          reply: "Thanks.\nNobody ever tells me the whole thing.",
          effect: 'Honesty is the cheapest thing you can give her, and it works. She trusts you more.',
          nerveDelta: 0,
          trustDelta: 6,
          remember: 'RIVAS WILL REMEMBER THAT',
        },
      ],
    },
    Shaken: {
      STEADY: [{ reply: "I don't need calming.\nI need you to believe me.", effect: 'Comfort is not what she is asking for. No change.', nerveDelta: 0, trustDelta: 0 }],
      PRESS: [
        {
          reply: "If I'm right about the count, you'll hear about it.\nMoving.",
          effect: 'She goes under protest. Worse, and she trusts you slightly less.',
          nerveDelta: -1,
          trustDelta: -2,
        },
      ],
      LEVEL: [
        {
          reply: "Right. Then give me Nayar on the shoulder.\nAnd stop asking me for numbers.",
          effect: 'She can carry bad news. She could not carry not knowing. Steadier, and she trusts you more.',
          nerveDelta: 1,
          trustDelta: 6,
          remember: 'RIVAS WILL REMEMBER THAT',
        },
      ],
    },
    Breaking: {
      STEADY: [{ reply: "People have said that to me before.", effect: 'She has heard it from liars. Worse.', nerveDelta: -1, trustDelta: 0 }],
      PRESS: [
        {
          reply: 'Yes sir.',
          effect: 'Three words from the most talkative person on the net. She is gone.',
          nerveDelta: -1,
          trustDelta: -6,
          remember: 'KESTREL HAS STOPPED ANSWERING',
        },
      ],
      LEVEL: [
        {
          reply: "Then it's happening again.\nI'm not moving these people. Put that in the file too.",
          effect: 'You got her back and she refused the order in the same breath. Both are true. Trust way up.',
          nerveDelta: 1,
          trustDelta: 10,
          remember: 'RIVAS WILL REMEMBER THAT',
        },
      ],
    },
  },

  // -----------------------------------------------------------------------
  // YARROW. Barely needs managing, and his replies arrive late like everything
  // else he sends. The only refusal in the game withdrawn in the same breath.
  // -----------------------------------------------------------------------
  yarrow: {
    Steady: {
      STEADY: [{ reply: "Appreciated.\nWe're all right down here.", effect: 'He genuinely is. No change.', nerveDelta: 0, trustDelta: 0 }],
      PRESS: [{ reply: "Understood.\nIt'll be slower than you want. Everything is.", effect: 'He will do it in his own time. No change.', nerveDelta: 0, trustDelta: 0 }],
      LEVEL: [{ reply: "Figured.\nThanks for saying it out loud.", effect: 'He had worked it out already. He trusts you more for saying it.', nerveDelta: 0, trustDelta: 5 }],
    },
    Shaken: {
      STEADY: [{ reply: "It's bad ground, that's all.\nWe'll manage it.", effect: 'Steadier. He mostly steadies himself.', nerveDelta: 1, trustDelta: 0 }],
      PRESS: [{ reply: "You'll have it.\nNot when you asked for it.", effect: 'He goes. Worse by a step.', nerveDelta: -1, trustDelta: 0 }],
      LEVEL: [{ reply: "That's about what I'd worked out.\nDoesn't change what we do.", effect: 'Steadier, and he trusts you more.', nerveDelta: 1, trustDelta: 4 }],
    },
    Breaking: {
      STEADY: [{ reply: "Yeah.\nAll right. Yeah.", effect: 'Three words from a man who speaks in paragraphs. It helped, barely.', nerveDelta: 1, trustDelta: 0 }],
      PRESS: [
        {
          reply: "No.\nNo, I'll do it. Anvil moving.",
          effect: 'He refused and took it back inside one transmission. He is gone.',
          nerveDelta: -1,
          trustDelta: -4,
          remember: 'ANVIL HAS STOPPED ANSWERING',
        },
      ],
      LEVEL: [
        {
          reply: "Nine days left.\nThat's the thing I keep catching on.\nDon't tell the lads I said it.",
          effect: 'The only time he mentions his rotation. Steadier, and he trusts you a great deal more.',
          nerveDelta: 1,
          trustDelta: 9,
          remember: 'YARROW WILL REMEMBER THAT',
        },
      ],
    },
  },

  // -----------------------------------------------------------------------
  // CALLOWAY. The same button at the same state inverts once she loses
  // someone. Before that, the truth knocks out a strut holding her up.
  // -----------------------------------------------------------------------
  calloway: {
    Steady: {
      STEADY: [{ reply: "I'm not worried, sir.", effect: 'She is not. That is the problem. No change.', nerveDelta: 0, trustDelta: 0 }],
      PRESS: [{ reply: "Already moving.\nIt was the right call.", effect: 'She was going anyway. No change.', nerveDelta: 0, trustDelta: 0 }],
      LEVEL: [
        {
          requires: 'callowayFirstLoss',
          reply: "All right.\nSay the rest of it.",
          effect: 'Since she lost someone she can hear this. She trusts you more.',
          nerveDelta: 0,
          trustDelta: 6,
          remember: 'CALLOWAY WILL REMEMBER THAT',
        },
        {
          reply: "Respectfully, that's not what my returns show.",
          effect: 'You contradicted her instruments. Worse, and she trusts you less.',
          nerveDelta: -1,
          trustDelta: -3,
        },
      ],
    },
    Shaken: {
      STEADY: [{ reply: "Understood. I've got it in hand.", effect: 'She says this at every state. No change.', nerveDelta: 0, trustDelta: 0 }],
      PRESS: [
        {
          reply: "Moving.\nThough the ground doesn't support that read.",
          effect: 'She goes, noting her objection. Worse by a step.',
          nerveDelta: -1,
          trustDelta: 0,
        },
      ],
      LEVEL: [
        {
          requires: 'callowayFirstLoss',
          reply: "I'd rather hear it from you than off the returns.\nGo on.",
          effect: 'Steadier, and she trusts you more.',
          nerveDelta: 1,
          trustDelta: 6,
          remember: 'CALLOWAY WILL REMEMBER THAT',
        },
        {
          reply: "Then one of us has bad information.\nMine's coming off the sensor.",
          effect: 'She trusts the instrument over you. Worse.',
          nerveDelta: -1,
          trustDelta: -2,
        },
      ],
    },
    Breaking: {
      STEADY: [{ reply: "I've got it in hand.", effect: 'She will not report being unsteady, so you cannot steady her. No change.', nerveDelta: 0, trustDelta: 0 }],
      PRESS: [{ reply: 'Moving.', effect: 'She is gone, still certain.', nerveDelta: -1, trustDelta: -4, remember: 'HARROW HAS STOPPED ANSWERING' }],
      LEVEL: [
        {
          requires: 'callowayFirstLoss',
          reply: "I don't know what I'm looking at any more.\nTell me what to do and I'll do it.\nI'm not asking you to be sure. I know better now.",
          effect: 'The confidence is gone and she is finally reachable. Steadier, and trust way up.',
          nerveDelta: 1,
          trustDelta: 10,
          remember: 'CALLOWAY WILL REMEMBER THAT',
        },
        {
          reply: "No. No, I've been right, I've been right the whole",
          effect: 'The first sentence she has ever failed to finish. She is gone.',
          nerveDelta: -1,
          trustDelta: -5,
        },
      ],
    },
  },
}

export const GENERIC: Tree = {
  Steady: {
    STEADY: [{ reply: 'Copy.', effect: 'No change.', nerveDelta: 0, trustDelta: 0 }],
    PRESS: [{ reply: 'Moving.', effect: 'They go. No change.', nerveDelta: 0, trustDelta: 0 }],
    LEVEL: [{ reply: 'Understood, sir.', effect: 'They trust you slightly more.', nerveDelta: 0, trustDelta: 2 }],
  },
  Shaken: {
    STEADY: [{ reply: "Copy. We're holding.", effect: 'A little steadier.', nerveDelta: 1, trustDelta: 0 }],
    PRESS: [{ reply: 'Moving.', effect: 'They go. Worse by a step.', nerveDelta: -1, trustDelta: 0 }],
    LEVEL: [{ reply: 'Understood.', effect: 'Steadier, and they trust you more.', nerveDelta: 1, trustDelta: 3 }],
  },
  Breaking: {
    STEADY: [{ reply: 'Copy.', effect: 'It helped a little.', nerveDelta: 1, trustDelta: 0 }],
    PRESS: [{ reply: 'Moving.', effect: 'They go. Worse, and they trust you less.', nerveDelta: -1, trustDelta: -3 }],
    LEVEL: [{ reply: 'Understood.', effect: 'Steadier, and they trust you more.', nerveDelta: 1, trustDelta: 4 }],
  },
}

/** What each button actually does, in words a first time player can act on. */
export const SPEAK_BLURB: Record<SpeakVerb, string> = {
  STEADY: 'Calm them down. Safe, and often not enough.',
  PRESS: 'Force the order through. They will obey and it will cost them.',
  LEVEL: 'Tell them everything, including the frightening part.',
}

export const THREAD_HINT: Record<string, string> = {
  balogun: 'His brother is in the battalion east of here.',
  rivas: 'She pulled her people out once and was right. Nobody ever told her which time.',
  yarrow: 'Nine days from going home.',
  calloway: 'She has never lost anyone yet.',
}

export function pickExchange(
  voice: string,
  nerve: Nerve,
  verb: SpeakVerb,
  flags: Record<string, boolean>,
): Exchange | null {
  const tree = DIALOGUE[voice] ?? GENERIC
  const list = tree[nerve]?.[verb] ?? GENERIC[nerve]?.[verb]
  if (!list || list.length === 0) return null
  for (const ex of list) {
    if (ex.requires && !flags[ex.requires]) continue
    if (ex.unless && flags[ex.unless]) continue
    return ex
  }
  return list[list.length - 1]
}
