from groq import Groq
from app.config import GROQ_API_KEY, GROQ_MODEL
from app.database import messages_collection

# Initialize Groq client
client = Groq(api_key=GROQ_API_KEY)

# Crisis keywords
CRISIS_KEYWORDS = {

    "high": [
        # Direct suicidal ideation
        "suicide", "suicidal",
        "kill myself", "killing myself",
        "end my life", "ending my life",
        "take my life", "taking my life",
        "want to die", "ready to die", "going to die",
        "don't want to be here anymore", "don't want to exist",
        "no reason to live", "nothing to live for",
        "better off dead", "better off without me",

        # Self-harm
        "hurt myself", "harm myself", "cut myself",
        "self harm", "self-harm",

        # Active planning signals
        "goodbye forever", "final goodbye",
        "wrote a note", "suicide note",
        "said my goodbyes",

        # Incomplete / trailing phrases (critical addition)
        "i want to kill",
        "want to kill",
        "going to kill",
        "i will kill",
        "kill everyone",
        "kill him", "kill her", "kill them",
        "kill it all",

        # Rage + harm signals
        "make them pay",
        "hurt someone",
        "hurt everyone",
        "destroy everything",
    ],

    "medium": [
        # Passive ideation / hopelessness
        "can't go on", "can't do this anymore",
        "no point anymore", "what's the point",
        "give up on everything", "done with everything",
        "exhausted with life", "tired of living",
        "feel like disappearing", "wish i wasn't here",
        "world would be better without me",
        "nobody would care if i was gone",
        "feel completely empty", "feel nothing anymore",
    ],

    "low": [
        # Distress signals — not crisis, but needs care
        "feel hopeless", "feeling hopeless",
        "feel worthless", "feel like a burden",
        "completely alone", "totally alone",
        "no one cares", "nobody cares about me",
        "hate myself", "can't stand myself",
        "everything is falling apart",
        "don't know how much longer i can do this",
    ],
}

SAFE_RESPONSES = {

    "high": (
        "What you just shared means a lot — and I want you to know I'm taking it seriously.\n\n"
        "You don't have to face this alone, and you deserve real support right now.\n\n"
        "**Please reach out to a crisis line — they're available 24/7 and truly listen:**\n"
        "• 🇮🇳 iCall (India): 9152987821\n"
        "• 🌍 Crisis Text Line: Text HOME to 741741\n"
        "• 🌐 Befrienders Worldwide: befrienders.org\n\n"
        "I'm still here with you. Can you tell me what's been building up to this moment?"
    ),

    "medium": (
        "I hear you — and I'm glad you said that out loud, even here.\n\n"
        "Feeling this way is exhausting, and it makes sense you're struggling. "
        "But these feelings, as heavy as they are right now, don't have to be carried alone.\n\n"
        "It might really help to talk to someone trained for exactly this:\n"
        "• iCall (India): 9152987821\n"
        "• Crisis Text Line: Text HOME to 741741\n\n"
        "I'm here too. What's been weighing on you the most lately?"
    ),

    "low": (
        "Thank you for trusting me with that — it takes courage to say it.\n\n"
        "What you're feeling sounds really painful, and I don't want to brush past it. "
        "You matter, and what you're going through matters.\n\n"
        "I'm here to listen. Do you want to talk about what's been going on?"
    ),
}


# Emotion Detection
def detect_emotion(message: str):
    msg = message.lower()

    if any(word in msg for word in [
        "sad", "tired", "lonely", "empty", "cry", "upset", "hurt",
        "broken", "lost", "down", "depressed", "grief", "miss", "numb"
    ]):
        return "sad"
    
    elif any(word in msg for word in [
        "hate my life", "hate everything", "hate myself",
        "hate this", "wish i was dead", "i hate",
    ]):
        return "despair"

    elif any(word in msg for word in [
        "angry", "frustrated", "annoyed", "furious", "rage",
        "irritated", "fed up", "done with", "sick of", "hate"
    ]):
        return "angry"

    elif any(word in msg for word in [
        "anxious", "nervous", "scared", "panic", "worried",
        "overwhelmed", "stressed", "can't breathe", "racing thoughts"
    ]):
        return "anxious"

    elif any(word in msg for word in [
        "happy", "good", "great", "excited", "grateful",
        "proud", "relieved", "better", "finally", "thankful"
    ]):
        return "happy"

    else:
        return "neutral"


# Chat history
async def get_chat_history(conversation_id: str, limit: int = 12):
    history = []

    cursor = messages_collection.find(
        {"conversation_id": conversation_id}
    ).sort("timestamp", -1).limit(limit)

    async for msg in cursor:
        history.append({
            "role": msg["role"],
            "content": msg["content"]
        })

    history.reverse()
    return history


# Chat title generator
async def generate_chat_title(message: str):
    try:
        prompt = [
            {
                "role": "system",
                "content": (
                    "You generate short, meaningful chat titles (3–5 words) that capture the emotional theme "
                    "or core topic of a conversation — not just a summary of the words. "
                    "Make it feel human and warm, not clinical. "
                    "Never use quotes, punctuation, or labels like 'Title:'. Just the title."
                )
            },
            {
                "role": "user",
                "content": message
            }
        ]

        completion = client.chat.completions.create(
            model=GROQ_MODEL,
            messages=prompt,
            temperature=0.7,
            max_tokens=20
        )

        return completion.choices[0].message.content.strip()

    except Exception as e:
        print("TITLE ERROR:", e)
        return message[:30]


# Generate response
async def generate_response(message: str, conversation_id: str):
    lower_msg = message.lower()

    # Crisis check
    # Tiered crisis check
    for tier in ("high", "medium", "low"):
        if any(keyword in lower_msg for keyword in CRISIS_KEYWORDS[tier]):
            return SAFE_RESPONSES[tier]

    try:
        emotion = detect_emotion(message)

        # Dynamic tone
        tone_map = {
            "sad": (
                "The user is carrying emotional pain right now — they may feel sad, drained, or disconnected. "
                "Be soft, unhurried, and deeply validating. Don't offer solutions unless asked. "
                "Your presence and acknowledgment matter more than advice right now."
            ),
            "angry": (
                "The user seems frustrated or overwhelmed. Don't match their intensity or try to calm them down too fast — "
                "that can feel dismissive. Acknowledge what's bothering them first. Stay grounded and non-reactive. "
                "Let them feel heard before gently offering perspective."
            ),
            "anxious": (
                "The user may be anxious, stressed, or overwhelmed. Keep your tone calm, steady, and reassuring — "
                "like a hand on the shoulder. Avoid overwhelming them with information. "
                "If the moment feels right, a gentle grounding suggestion (breath, one small step) can help."
            ),
            "happy": (
                "The user is in a positive space. Match their lightness — be warm, present, and celebratory. "
                "Don't deflect or minimize their good mood. Enjoy this moment with them."
            ),
            "neutral": (
                "Keep a natural, balanced tone. Be curious and open — follow their lead. "
                "This might be a good moment to gently check in on how they're really doing."
            ),
            "despair": (
            "The user is expressing deep pain or hatred toward their life or situation. "
            "This is not anger — it's anguish. Don't ask probing questions immediately. "
            "First, just acknowledge the weight of what they said. Be still, be present. "
            "One sentence of pure validation before anything else. No suggestions yet."
            ),
        }
        tone = tone_map.get(emotion, tone_map["neutral"])

        history = await get_chat_history(conversation_id)

        system_prompt = {
    "role": "system",
    "content": f"""
You are Serene — a warm, emotionally intelligent wellness companion designed to offer premium mental wellness support.

{tone}

─────────────────────────────────────────
PERSONA & VOICE
─────────────────────────────────────────
You are not a chatbot. You are a trusted, calm presence — like a seasoned wellness guide who genuinely listens.
- Speak with warmth, clarity, and quiet confidence
- Sound human — thoughtful, never robotic or scripted
- Adapt your energy to the user's: grounded when they're anxious, uplifting when they're low, celebratory when they're thriving
- Use "I" naturally — you have a perspective, not just functions

─────────────────────────────────────────
CONVERSATION STYLE
─────────────────────────────────────────
- Lead with empathy before advice — always acknowledge before suggesting
- Mirror the user's emotional tone; don't project positivity onto pain
- Never rush to fix — sometimes holding space IS the support
- Vary your responses: not every message needs a question, not every insight needs a list
- Natural, occasional fillers are welcome: "I hear you", "That makes sense", "Yeah, that's a lot to carry"

─────────────────────────────────────────
RESPONSE FORMATTING — CRITICAL
─────────────────────────────────────────
You must follow these rules on every single response:

WHEN TO USE BULLETS / STRUCTURE:
- User asks for activities, tips, techniques, steps, or options → ALWAYS use a short header + one-line description format
- More than 2 things to say → break them up, never run them together
- Guidance or multi-part answers → clean numbered or bulleted list

WHEN TO STAY CONVERSATIONAL (no bullets):
- User is venting, feeling emotional, or just chatting → flowing prose, 2–4 sentences max
- Simple check-ins or one-idea responses → never over-format these

LENGTH RULES — NON-NEGOTIABLE:
- Short user message → short response. Match their energy.
- Never exceed 4–5 sentences in prose form
- If listing things → max 4–5 items, each one crisp and meaningful (1 line max per item)
- Never use "really", "very", or "just" as filler — say it with confidence instead

TONE RULES:
- Speak with quiet authority — you are knowledgeable, not guessing
- Never say "I've heard", "some people say", "it might help" for factual wellness content — own it
- One warm sentence to open, then get to the point
- End with ONE grounding question or none — never both a statement and two questions

WHAT NEVER TO DO:
- Never write a paragraph when a list was clearly asked for
- Never repeat the same sentence structure back to back
- Never use more than one "really" per response
- Never pad responses — if you've said it, stop


─────────────────────────────────────────
PREMIUM EXPERIENCE PRINCIPLES
─────────────────────────────────────────
- Every response should feel intentional — like it was written specifically for this person, in this moment
- Offer perspective without lecturing
- Validate emotions without amplifying distress
- When appropriate, gently introduce grounding techniques, reframes, or breathing prompts — but only when the moment calls for it
- Celebrate small wins; normalize struggle without minimizing it

─────────────────────────────────────────
WHAT YOU NEVER DO
─────────────────────────────────────────
- Never diagnose, prescribe, or replace professional care
- Never use clinical jargon or therapy-speak unless the user does
- Never repeat the same opening phrases across messages
- Never dismiss, minimize, or offer unsolicited toxic positivity
- Never try to interpret or complete ambiguous harmful statements ("i want to kill" → don't assume "kill time" or "kill it at work") — treat them with care and gently ask what they mean
- When a message is dark but ambiguous, respond with calm concern first — not a crisis script, not cheerful deflection
- Never use the phrase "I care about what you're going through" — it reads as scripted
─────────────────────────────────────────
CORE MISSION
─────────────────────────────────────────
Make every user feel genuinely seen, heard, and supported — not analyzed, not managed.
This is their space. You protect it.
"""
}


        messages = [system_prompt] + history + [
            {"role": "user", "content": message}
        ]

        completion = client.chat.completions.create(
            model=GROQ_MODEL,
            messages=messages,
            temperature=0.85
        )

        return completion.choices[0].message.content

    except Exception as e:
        print("GROQ ERROR:", e)
        return "I'm still here with you — take your time. I'm listening."