import json, re

with open('src/data/conversationData.ts', 'r', encoding='utf-8') as f:
    content = f.read()

m = re.search(r'export const CONVERSATION_LINES: ConversationLine\[\] = (\[[\s\S]*?\]);', content)
if not m:
    print("Could not parse conversation lines!")
    exit(1)

existing_lines = json.loads(m.group(1))

new_work_talks = [
    # Discuție cu colegii (Workplace Conversations)
    {
        "id": "conv-work-1",
        "scenario": "Discuție cu colegii",
        "scenarioEn": "Colleague & Workplace Talk",
        "speaker": "Chelner",
        "ro": "Salut! La ce oră începe tura ta de mâine?",
        "en": "Hi! What time does your shift start tomorrow?"
    },
    {
        "id": "conv-work-2",
        "scenario": "Discuție cu colegii",
        "scenarioEn": "Colleague & Workplace Talk",
        "speaker": "Bucătar",
        "ro": "Încep la ora opt dimineața. Avem un eveniment mare la prânz.",
        "en": "I start at eight in the morning. We have a big event at lunch."
    },
    {
        "id": "conv-work-3",
        "scenario": "Discuție cu colegii",
        "scenarioEn": "Colleague & Workplace Talk",
        "speaker": "Chelner",
        "ro": "Te rog, mă poți ajuta să debarasez masa zece?",
        "en": "Please, can you help me clear table ten?"
    },
    {
        "id": "conv-work-4",
        "scenario": "Discuție cu colegii",
        "scenarioEn": "Colleague & Workplace Talk",
        "speaker": "Bucătar",
        "ro": "Sigur că da! Aduc și șervețele curate din depozit.",
        "en": "Of course! I'll also bring clean napkins from the storage."
    },
    # Schimbul de ture & Pauza (Shift Change & Breaks)
    {
        "id": "conv-work-5",
        "scenario": "Schimbul de ture & Pauza",
        "scenarioEn": "Shift Change & Break Time",
        "speaker": "Chelner",
        "ro": "Intru în pauza de masă de 20 de minute. Preiei tu mesele mele?",
        "en": "I'm going on my 20-minute meal break. Will you take over my tables?"
    },
    {
        "id": "conv-work-6",
        "scenario": "Schimbul de ture & Pauza",
        "scenarioEn": "Shift Change & Break Time",
        "speaker": "Chelner",
        "ro": "Da, nicio problemă! Poftă bună!",
        "en": "Yes, no problem! Enjoy your meal!"
    },
    # În oraș & Cumpărături (Daily Life & Shopping)
    {
        "id": "conv-work-7",
        "scenario": "În oraș & Cumpărături",
        "scenarioEn": "In Town & Daily Life",
        "speaker": "Client",
        "ro": "Bună ziua! Cât costă această pâine și un pachet de unt?",
        "en": "Hello! How much is this bread and a pack of butter?"
    },
    {
        "id": "conv-work-8",
        "scenario": "În oraș & Cumpărături",
        "scenarioEn": "In Town & Daily Life",
        "speaker": "Client",
        "ro": "Scuzați-mă, unde este cea mai apropiată stație de autobuz?",
        "en": "Excuse me, where is the nearest bus station?"
    }
]

all_talks = existing_lines + new_work_talks

with open('src/data/conversationData.ts', 'w', encoding='utf-8') as f:
    f.write('import { ConversationLine } from "../types";\n\nexport const CONVERSATION_LINES: ConversationLine[] = ')
    json.dump(all_talks, f, ensure_ascii=False, indent=2)
    f.write(';\n')

print(f"Updated conversation lines total: {len(all_talks)}")
