import random

# Mood-based prompts
MOOD_TEMPLATES = {
    "happy": [
        "What made you smile today?",
        "What went well today?",
        "Okay spill — what was today's main character moment?",
        "What tiny thing secretly made your day better?",
        "If today had a highlight reel, what’s in it?"
    ],

    "sad": [
        "What is weighing on your heart?",
        "Do you want to talk about what hurt you today?",
        "If your mood had a soundtrack today, what would it be?",
        "What felt heavier than it should have?",
        "Do you want to vent it out or just sit with it?"
    ],

    "angry": [
        "What got on your nerves today?",
        "What frustrated you the most?",
        "Who/what tested your patience like crazy today?",
        "If you could send one brutally honest message, what would it say?",
        "What made you go ‘I’m done’ internally?"
    ],

    "anxious": [
        "What are you worried about right now?",
        "What thoughts are looping in your mind?",
        "What ‘what if’ is bothering you the most?",
        "If your brain had tabs open, which one is the loudest?",
        "What feels uncertain or out of control?"
    ],

    "excited": [
        "What are you looking forward to?",
        "What made today exciting?",
        "What’s giving you butterflies (the good kind)?",
        "What are you low-key hyped about?",
        "If you could fast-forward time, what moment are you jumping to?"
    ],

    "tired": [
        "What drained your energy today?",
        "Did something exhaust you emotionally?",
        "What felt like too much effort today?",
        "Are you physically tired, mentally tired, or ‘life tired’?",
        "What would recharge you right now?"
    ],

    "neutral": [
        "How was your day overall?",
        "Anything noteworthy today?",
        "Was today just… a day?",
        "If today was a color, what would it be?",
        "Nothing dramatic or something subtle happened?"
    ],

    "grateful": [
        "What are you grateful for today?",
        "Who made your day better?",
        "What’s one thing today that you’d want to keep forever?",
        "What small moment felt unexpectedly nice?",
        "Who or what deserves a quiet thank you from you today?"
    ],

    "lonely": [
        "Did you feel disconnected today?",
        "Do you wish someone was there for you?",
        "Who did you miss today?",
        "Did you want to talk to someone but didn’t?",
        "What kind of connection were you craving?"
    ],

    "overwhelmed": [
        "What feels too much right now?",
        "What is piling up in your mind?",
        "If everything had a pause button, what would you stop first?",
        "What’s making you feel stretched too thin?",
        "What’s one thing you wish you could just drop for a while?"
    ]
}


# Validate mood
def is_valid_mood(mood: str) -> bool:
    return mood in MOOD_TEMPLATES


# Mood → color mapping (for calendar / UI)
MOOD_COLORS = {
    "happy": "#FFD700",        # gold
    "sad": "#6495ED",          # blue
    "angry": "#FF4C4C",        # red
    "anxious": "#9370DB",      # purple
    "excited": "#FF8C00",      # orange
    "tired": "#A9A9A9",        # gray
    "neutral": "#D3D3D3",      # light gray
    "grateful": "#32CD32",     # green
    "lonely": "#708090",       # slate gray
    "overwhelmed": "#8B0000"   # dark red
}


def get_mood_color(mood: str) -> str:
    return MOOD_COLORS.get(mood, "#000000")


# Get random prompt for a mood
def get_prompt_for_mood(mood: str) -> str:
    prompts = MOOD_TEMPLATES.get(mood, ["How was your day?"])
    return random.choice(prompts)