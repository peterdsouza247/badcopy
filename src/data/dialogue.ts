import type { Nerve, SpeakVerb } from '../engine/types'

export interface Exchange {
  reply: string
  nerveDelta: number
  trustDelta: number
  standingDelta?: number
  /** Shown as a Telltale style toast when it fires. */
  remember?: string
  /** Requires this flag to be set, otherwise falls through to the default. */
  requires?: string
  /** Forbidden when this flag is set. */
  unless?: string
}

type Tree = Partial<Record<Nerve, Partial<Record<SpeakVerb, Exchange[]>>>>

/**
 * Three buttons and a person on the other end. There is no dialogue tree in
 * the branching sense, because there is nothing to solve. There is only a
 * person you either know or do not.
 *
 * House style: no dashes anywhere. Pauses are full stops and new lines.
 */
export const DIALOGUE: Record<string, Tree> = {
  // -----------------------------------------------------------------------
  // BALOGUN. The trap. His answer to PRESS is the same word at every state.
  // The player can spend him all the way down and the text will never once
  // tell them they are doing it. Only the bar moves.
  // -----------------------------------------------------------------------
  balogun: {
    Steady: {
      STEADY: [{ reply: 'Understood.', nerveDelta: 0, trustDelta: 0 }],
      PRESS: [{ reply: 'Moving.', nerveDelta: 0, trustDelta: 0 }],
      LEVEL: [
        {
          requires: 'balogunThread',
          reply: 'Femi is east of that line, is he not.\nAll right. Tell me what you need.',
          nerveDelta: 1,
          trustDelta: 6,
          remember: 'BALOGUN WILL REMEMBER THAT',
        },
        {
          reply: 'I do not need the whole picture, sir.\nI need the part that is mine.',
          nerveDelta: -1,
          trustDelta: 0,
        },
      ],
    },
    Shaken: {
      STEADY: [{ reply: 'I am fine. Squad is fine.\nWas there something else?', nerveDelta: 0, trustDelta: 0 }],
      PRESS: [{ reply: 'Moving.', nerveDelta: -1, trustDelta: 0 }],
      LEVEL: [
        {
          requires: 'balogunThread',
          reply: 'Femi is east of that line, is he not.\nAll right. Tell me what you need.',
          nerveDelta: 1,
          trustDelta: 6,
          remember: 'BALOGUN WILL REMEMBER THAT',
        },
        { reply: 'Then that is what it is.\nWolfhound out.', nerveDelta: 0, trustDelta: 0 },
      ],
    },
    Breaking: {
      STEADY: [{ reply: 'Do not. Just give me something to do.', nerveDelta: 1, trustDelta: 0 }],
      PRESS: [{ reply: 'Moving.', nerveDelta: -1, trustDelta: -4, remember: 'WOLFHOUND HAS STOPPED ANSWERING' }],
      LEVEL: [
        {
          requires: 'balogunThread',
          reply: 'Femi is east of that line, is he not.\nAll right. Tell me what you need.',
          nerveDelta: 1,
          trustDelta: 8,
          remember: 'BALOGUN WILL REMEMBER THAT',
        },
        {
          reply: 'You are telling me this because you think I am finished.',
          nerveDelta: -1,
          trustDelta: -3,
        },
      ],
    },
  },

  // -----------------------------------------------------------------------
  // RIVAS. Wrong and honest. LEVEL is the key that always fits, and at
  // Breaking it buys her back at the cost of an order she will not follow.
  // -----------------------------------------------------------------------
  rivas: {
    Steady: {
      STEADY: [{ reply: 'Copy that.', nerveDelta: 1, trustDelta: 0 }],
      PRESS: [{ reply: 'Copy. Kestrel moving.', nerveDelta: -1, trustDelta: 0 }],
      LEVEL: [
        {
          reply: 'Thank you.\nNobody does that.',
          nerveDelta: 0,
          trustDelta: 6,
          remember: 'RIVAS WILL REMEMBER THAT',
        },
      ],
    },
    Shaken: {
      STEADY: [{ reply: 'I do not need steadying.\nI need you to believe me.', nerveDelta: 0, trustDelta: 0 }],
      PRESS: [
        { reply: 'If I am right about the count, you are going to hear about it.\nMoving.', nerveDelta: -1, trustDelta: -2 },
      ],
      LEVEL: [
        {
          reply: 'Right. Then I want Nayar on the shoulder and I want you to stop asking me for numbers.',
          nerveDelta: 1,
          trustDelta: 6,
          remember: 'RIVAS WILL REMEMBER THAT',
        },
      ],
    },
    Breaking: {
      STEADY: [{ reply: 'You have said that before.', nerveDelta: -1, trustDelta: 0 }],
      PRESS: [{ reply: 'Yes sir.', nerveDelta: -1, trustDelta: -6, remember: 'KESTREL HAS STOPPED ANSWERING' }],
      LEVEL: [
        {
          reply: 'So it is the second one.\nIt is the second one again.\nThen I am not moving these people and you can put that in the file too.',
          nerveDelta: 1,
          trustDelta: 10,
          remember: 'RIVAS WILL REMEMBER THAT',
        },
      ],
    },
  },

  // -----------------------------------------------------------------------
  // YARROW. Barely needs managing, and talking to him is subject to his Slow
  // trait, so you can steady a man about a situation that resolved twenty
  // minutes ago. The only refusal in the game that is withdrawn in the same
  // transmission.
  // -----------------------------------------------------------------------
  yarrow: {
    Steady: {
      STEADY: [{ reply: 'Appreciated.\nWe are all right down here.', nerveDelta: 0, trustDelta: 0 }],
      PRESS: [{ reply: 'Understood.\nIt will be slower than you want. Everything is.', nerveDelta: 0, trustDelta: 0 }],
      LEVEL: [{ reply: 'Figured.\nThanks for saying it out loud.', nerveDelta: 0, trustDelta: 5 }],
    },
    Shaken: {
      STEADY: [{ reply: 'It is a bad piece of ground, that is all it is.\nWe will manage it.', nerveDelta: 1, trustDelta: 0 }],
      PRESS: [{ reply: 'You will have it.\nNot by the time you asked for.', nerveDelta: -1, trustDelta: 0 }],
      LEVEL: [{ reply: 'That is about what I had worked out.\nDoes not change what we do.', nerveDelta: 1, trustDelta: 4 }],
    },
    Breaking: {
      STEADY: [{ reply: 'Yeah.\nAll right. Yeah.', nerveDelta: 1, trustDelta: 0 }],
      PRESS: [
        { reply: 'No.\nNo, I will do it. Anvil moving.', nerveDelta: -1, trustDelta: -4, remember: 'ANVIL HAS STOPPED ANSWERING' },
      ],
      LEVEL: [
        {
          reply: 'Nine days.\nI keep on nine days, is the thing.\nDo not tell the lads I said that.',
          nerveDelta: 1,
          trustDelta: 9,
          remember: 'YARROW WILL REMEMBER THAT',
        },
      ],
    },
  },

  // -----------------------------------------------------------------------
  // CALLOWAY. The only character where the same button at the same state has an
  // inverted outcome depending on where the campaign is. The pivot is her
  // first loss. Before it, the truth destroys a structure holding her up.
  // -----------------------------------------------------------------------
  calloway: {
    Steady: {
      STEADY: [{ reply: 'I am not concerned, sir.', nerveDelta: 0, trustDelta: 0 }],
      PRESS: [{ reply: 'Already moving.\nIt was the correct call.', nerveDelta: 0, trustDelta: 0 }],
      LEVEL: [
        {
          requires: 'callowayFirstLoss',
          reply: 'All right.\nSay the rest of it.',
          nerveDelta: 0,
          trustDelta: 6,
          remember: 'CALLOWAY WILL REMEMBER THAT',
        },
        { reply: 'With respect, that is not what the returns show.', nerveDelta: -1, trustDelta: -3 },
      ],
    },
    Shaken: {
      STEADY: [{ reply: 'Understood. I have it in hand.', nerveDelta: 0, trustDelta: 0 }],
      PRESS: [{ reply: 'Moving.\nThough I would note the ground does not support the assessment.', nerveDelta: -1, trustDelta: 0 }],
      LEVEL: [
        {
          requires: 'callowayFirstLoss',
          reply: 'I would like to hear it from you and not from the returns.\nGo on.',
          nerveDelta: 1,
          trustDelta: 6,
          remember: 'CALLOWAY WILL REMEMBER THAT',
        },
        { reply: 'Then one of us has bad information, and I am reading mine directly.', nerveDelta: -1, trustDelta: -2 },
      ],
    },
    Breaking: {
      STEADY: [{ reply: 'I have it in hand.', nerveDelta: 0, trustDelta: 0 }],
      PRESS: [{ reply: 'Moving.', nerveDelta: -1, trustDelta: -4, remember: 'HARROW HAS STOPPED ANSWERING' }],
      LEVEL: [
        {
          requires: 'callowayFirstLoss',
          reply: 'I do not know what I am looking at any more.\nTell me what to do and I will do it.\nThat is not me asking you to be certain. I know better now.',
          nerveDelta: 1,
          trustDelta: 10,
          remember: 'CALLOWAY WILL REMEMBER THAT',
        },
        { reply: 'No. No, I have been right, I have been right the whole', nerveDelta: -1, trustDelta: -5 },
      ],
    },
  },
}

export const GENERIC: Tree = {
  Steady: {
    STEADY: [{ reply: 'Copy.', nerveDelta: 0, trustDelta: 0 }],
    PRESS: [{ reply: 'Moving.', nerveDelta: 0, trustDelta: 0 }],
    LEVEL: [{ reply: 'Understood, sir.', nerveDelta: 0, trustDelta: 2 }],
  },
  Shaken: {
    STEADY: [{ reply: 'Copy. We are holding.', nerveDelta: 1, trustDelta: 0 }],
    PRESS: [{ reply: 'Moving.', nerveDelta: -1, trustDelta: 0 }],
    LEVEL: [{ reply: 'Understood.', nerveDelta: 1, trustDelta: 3 }],
  },
  Breaking: {
    STEADY: [{ reply: 'Copy.', nerveDelta: 1, trustDelta: 0 }],
    PRESS: [{ reply: 'Moving.', nerveDelta: -1, trustDelta: -3 }],
    LEVEL: [{ reply: 'Understood.', nerveDelta: 1, trustDelta: 4 }],
  },
}

export const SPEAK_BLURB: Record<SpeakVerb, string> = {
  STEADY: 'Calm them down.',
  PRESS: 'Override the refusal. Spend them.',
  LEVEL: 'Tell them the whole truth, including the part that will frighten them.',
}

/** Shown under the button once the soldier's thread is known. */
export const THREAD_HINT: Record<string, string> = {
  balogun: 'His brother is in 2nd Battalion.',
  rivas: 'She was right once. Nobody told her which time.',
  yarrow: 'Nine days to rotation.',
  calloway: 'She has never lost anyone.',
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
