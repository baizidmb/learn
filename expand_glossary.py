import json

# Read existing glossary items
with open('src/data/glossaryData.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Parse JSON array out of file
import re
m = re.search(r'export const GLOSSARY_TERMS: GlossaryTerm\[\] = (\[[\s\S]*?\]);', content)
if not m:
    print("Could not find GLOSSARY_TERMS in file!")
    exit(1)

existing_terms = json.loads(m.group(1))
print(f"Existing terms count: {len(existing_terms)}")

# New Day-to-Day & Workplace Vocabulary Terms
new_work_daily_terms = [
    # Zi de zi & Saluturi (Daily Essentials & Greetings)
    {"id": "glo-daily-1", "category": "Zi de zi & Saluturi", "categoryEn": "Daily Essentials & Greetings", "ro": "Bună dimineața!", "en": "Good morning!", "type": "kitchen-vocab"},
    {"id": "glo-daily-2", "category": "Zi de zi & Saluturi", "categoryEn": "Daily Essentials & Greetings", "ro": "Bună ziua!", "en": "Good afternoon / Hello!", "type": "kitchen-vocab"},
    {"id": "glo-daily-3", "category": "Zi de zi & Saluturi", "categoryEn": "Daily Essentials & Greetings", "ro": "Bună seara!", "en": "Good evening!", "type": "kitchen-vocab"},
    {"id": "glo-daily-4", "category": "Zi de zi & Saluturi", "categoryEn": "Daily Essentials & Greetings", "ro": "La revedere!", "en": "Goodbye!", "type": "kitchen-vocab"},
    {"id": "glo-daily-5", "category": "Zi de zi & Saluturi", "categoryEn": "Daily Essentials & Greetings", "ro": "Mulțumesc frumos!", "en": "Thank you very much!", "type": "kitchen-vocab"},
    {"id": "glo-daily-6", "category": "Zi de zi & Saluturi", "categoryEn": "Daily Essentials & Greetings", "ro": "Cu plăcere!", "en": "You're welcome!", "type": "kitchen-vocab"},
    {"id": "glo-daily-7", "category": "Zi de zi & Saluturi", "categoryEn": "Daily Essentials & Greetings", "ro": "Mă scuzați / Scuze", "en": "Excuse me / Sorry", "type": "kitchen-vocab"},
    {"id": "glo-daily-8", "category": "Zi de zi & Saluturi", "categoryEn": "Daily Essentials & Greetings", "ro": "Ce mai faci? / Cum ești?", "en": "How are you?", "type": "kitchen-vocab"},
    {"id": "glo-daily-9", "category": "Zi de zi & Saluturi", "categoryEn": "Daily Essentials & Greetings", "ro": "Sunt bine, mulțumesc!", "en": "I'm fine, thank you!", "type": "kitchen-vocab"},
    {"id": "glo-daily-10", "category": "Zi de zi & Saluturi", "categoryEn": "Daily Essentials & Greetings", "ro": "Pe mâine!", "en": "See you tomorrow!", "type": "kitchen-vocab"},

    # Muncă & Program (Work & Workplace Terms)
    {"id": "glo-work-1", "category": "Muncă & Program", "categoryEn": "Work & Workplace", "ro": "Tură de muncă", "en": "Work shift", "type": "kitchen-vocab"},
    {"id": "glo-work-2", "category": "Muncă & Program", "categoryEn": "Work & Workplace", "ro": "Tură de dimineață / seară", "en": "Morning / Evening shift", "type": "kitchen-vocab"},
    {"id": "glo-work-3", "category": "Muncă & Program", "categoryEn": "Work & Workplace", "ro": "Pauză de masă", "en": "Meal break / Lunch break", "type": "kitchen-vocab"},
    {"id": "glo-work-4", "category": "Muncă & Program", "categoryEn": "Work & Workplace", "ro": "Manager / Șef de sală", "en": "Manager / Floor supervisor", "type": "kitchen-vocab"},
    {"id": "glo-work-5", "category": "Muncă & Program", "categoryEn": "Work & Workplace", "ro": "Coleg de muncă", "en": "Work colleague / Coworker", "type": "kitchen-vocab"},
    {"id": "glo-work-6", "category": "Muncă & Program", "categoryEn": "Work & Workplace", "ro": "Salariu / Chenzină", "en": "Salary / Paycheck", "type": "kitchen-vocab"},
    {"id": "glo-work-7", "category": "Muncă & Program", "categoryEn": "Work & Workplace", "ro": "Bacșiș", "en": "Tips", "type": "kitchen-vocab"},
    {"id": "glo-work-8", "category": "Muncă & Program", "categoryEn": "Work & Workplace", "ro": "Ore suplimentare", "en": "Overtime hours", "type": "kitchen-vocab"},
    {"id": "glo-work-9", "category": "Muncă & Program", "categoryEn": "Work & Workplace", "ro": "Zi liberă / Concediu", "en": "Day off / Vacation leave", "type": "kitchen-vocab"},
    {"id": "glo-work-10", "category": "Muncă & Program", "categoryEn": "Work & Workplace", "ro": "Uniformă de lucru", "en": "Work uniform", "type": "kitchen-vocab"},

    # Numere & Bani (Numbers & Currency)
    {"id": "glo-num-1", "category": "Numere & Bani", "categoryEn": "Numbers & Currency", "ro": "Unu, doi, trei, patru, cinci", "en": "One, two, three, four, five", "type": "kitchen-vocab"},
    {"id": "glo-num-2", "category": "Numere & Bani", "categoryEn": "Numbers & Currency", "ro": "Șase, șapte, opt, nouă, zece", "en": "Six, seven, eight, nine, ten", "type": "kitchen-vocab"},
    {"id": "glo-num-3", "category": "Numere & Bani", "categoryEn": "Numbers & Currency", "ro": "Douăzeci, cincizeci, sută", "en": "Twenty, fifty, hundred", "type": "kitchen-vocab"},
    {"id": "glo-num-4", "category": "Numere & Bani", "categoryEn": "Numbers & Currency", "ro": "Bani / Cash", "en": "Money / Cash", "type": "kitchen-vocab"},
    {"id": "glo-num-5", "category": "Numere & Bani", "categoryEn": "Numbers & Currency", "ro": "Rest (schimb)", "en": "Change (money returned)", "type": "kitchen-vocab"},
    {"id": "glo-num-6", "category": "Numere & Bani", "categoryEn": "Numbers & Currency", "ro": "Total de plată", "en": "Total amount to pay", "type": "kitchen-vocab"},

    # Timp & Calendar (Time & Calendar)
    {"id": "glo-time-1", "category": "Timp & Calendar", "categoryEn": "Time & Calendar", "ro": "Azi / Astăzi", "en": "Today", "type": "kitchen-vocab"},
    {"id": "glo-time-2", "category": "Timp & Calendar", "categoryEn": "Time & Calendar", "ro": "Mâine / Poimâine", "en": "Tomorrow / Day after tomorrow", "type": "kitchen-vocab"},
    {"id": "glo-time-3", "category": "Timp & Calendar", "categoryEn": "Time & Calendar", "ro": "Ieri", "en": "Yesterday", "type": "kitchen-vocab"},
    {"id": "glo-time-4", "category": "Timp & Calendar", "categoryEn": "Time & Calendar", "ro": "Dimineața / Seara", "en": "In the morning / evening", "type": "kitchen-vocab"},
    {"id": "glo-time-5", "category": "Timp & Calendar", "categoryEn": "Time & Calendar", "ro": "Acum / Imediat", "en": "Now / Right away", "type": "kitchen-vocab"},
    {"id": "glo-time-6", "category": "Timp & Calendar", "categoryEn": "Time & Calendar", "ro": "Zilele săptămânii", "en": "Days of the week (Luni, Marți...)", "type": "kitchen-vocab"},

    # Direcții & Urgențe (Directions & Safety)
    {"id": "glo-dir-1", "category": "Direcții & Urgențe", "categoryEn": "Directions & Safety", "ro": "Unde este...?", "en": "Where is...?", "type": "kitchen-vocab"},
    {"id": "glo-dir-2", "category": "Direcții & Urgențe", "categoryEn": "Directions & Safety", "ro": "La stânga / La dreapta", "en": "To the left / To the right", "type": "kitchen-vocab"},
    {"id": "glo-dir-3", "category": "Direcții & Urgențe", "categoryEn": "Directions & Safety", "ro": "Înainte / Drept", "en": "Straight ahead", "type": "kitchen-vocab"},
    {"id": "glo-dir-4", "category": "Direcții & Urgențe", "categoryEn": "Directions & Safety", "ro": "Ieșire de urgență", "en": "Emergency exit", "type": "kitchen-vocab"},
    {"id": "glo-dir-5", "category": "Direcții & Urgențe", "categoryEn": "Directions & Safety", "ro": "Ajutor! / Atenție!", "en": "Help! / Caution!", "type": "kitchen-vocab"},
    {"id": "glo-dir-6", "category": "Direcții & Urgențe", "categoryEn": "Directions & Safety", "ro": "Trusă de prim ajutor", "en": "First aid kit", "type": "kitchen-vocab"},

    # Expresii & Verbe uzuale (Common Verbs & Phrases)
    {"id": "glo-verb-1", "category": "Expresii & Verbe uzuale", "categoryEn": "Common Verbs & Phrases", "ro": "Vreau / Doresc...", "en": "I want / I would like...", "type": "kitchen-vocab"},
    {"id": "glo-verb-2", "category": "Expresii & Verbe uzuale", "categoryEn": "Common Verbs & Phrases", "ro": "Am nevoie de...", "en": "I need...", "type": "kitchen-vocab"},
    {"id": "glo-verb-3", "category": "Expresii & Verbe uzuale", "categoryEn": "Common Verbs & Phrases", "ro": "Nu înțeleg, puteți repeta?", "en": "I don't understand, can you repeat?", "type": "kitchen-vocab"},
    {"id": "glo-verb-4", "category": "Expresii & Verbe uzuale", "categoryEn": "Common Verbs & Phrases", "ro": "Vorbiți engleză?", "en": "Do you speak English?", "type": "kitchen-vocab"},
    {"id": "glo-verb-5", "category": "Expresii & Verbe uzuale", "categoryEn": "Common Verbs & Phrases", "ro": "Învăț limba română", "en": "I am learning Romanian", "type": "kitchen-vocab"},
    {"id": "glo-verb-6", "category": "Expresii & Verbe uzuale", "categoryEn": "Common Verbs & Phrases", "ro": "A curăța / A spăla", "en": "To clean / To wash", "type": "kitchen-vocab"}
]

all_terms = existing_terms + new_work_daily_terms
print(f"Total updated terms: {len(all_terms)}")

with open('src/data/glossaryData.ts', 'w', encoding='utf-8') as f:
    f.write('import { GlossaryTerm } from "../types";\n\nexport const GLOSSARY_TERMS: GlossaryTerm[] = ')
    json.dump(all_terms, f, ensure_ascii=False, indent=2)
    f.write(';\n')

print("Glossary data updated successfully!")
