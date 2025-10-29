import os
import json
from deep_translator import GoogleTranslator

EN_DIR = "i18n/en"
TARGET_LANGUAGES = ["sv", "fr", "es"]
BASE_OUTPUT_DIR = "i18n"

# Keys to skip translation for — these are used in code logic (e.g., image names)
PROTECTED_KEYS = {
    "CrownRituals", "GlowRoots", "EssenceEchoes",
    "BotanicBrews", "LiquidGolds", "SoulSeasonings"
}

def translate_recursive(obj):
    if isinstance(obj, dict):
        return {
            k: translate_recursive(v) if k not in PROTECTED_KEYS else v
            for k, v in obj.items()
        }
    elif isinstance(obj, list):
        return [translate_recursive(i) for i in obj]
    elif isinstance(obj, str):
        try:
            return GoogleTranslator(source="en", target=lang).translate(obj)
        except Exception as e:
            print(f"❌ Error translating '{obj}' to {lang}: {e}")
            return obj
    else:
        return obj

for filename in os.listdir(EN_DIR):
    if not filename.endswith(".json"):
        continue

    english_path = os.path.join(EN_DIR, filename)
    with open(english_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    for lang in TARGET_LANGUAGES:
        translated_data = translate_recursive(data)

        out_dir = os.path.join(BASE_OUTPUT_DIR, lang)
        os.makedirs(out_dir, exist_ok=True)
        out_path = os.path.join(out_dir, filename)

        if os.path.exists(out_path):
            print(f"⏭ Skipped {lang}/{filename} (already exists)")
            continue

        with open(out_path, "w", encoding="utf-8") as out_file:
            json.dump(translated_data, out_file, ensure_ascii=False, indent=2)
            print(f"✅ Translated {filename} → {lang}/{filename}")
