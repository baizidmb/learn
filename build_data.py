import sys, re, ast, json

sys.stdout.reconfigure(encoding='utf-8')

html_path = r"C:\Users\bayzi\CrossDevice\baizid's S25 Ultra\storage\Download\marissa-ro-en-study.html"
with open(html_path, 'r', encoding='utf-8') as f:
    content = f.read()

def parse_var(var_name):
    m = re.search(r'(?:const|let|var)\s+' + var_name + r'\s*=\s*(\[[\s\S]*?\]);\s*\n', content)
    return ast.literal_eval(m.group(1))

menu_data = parse_var('MENU')
ingr_data = parse_var('INGR')
vocab_data = parse_var('VOCAB')
talk_data = parse_var('TALK')

# 1. Generate menuData.ts
menu_items = []
item_idx = 1
for cat_ro, cat_en, dishes in menu_data:
    for dish in dishes:
        name_ro, name_en, ing_ro_str, ing_en_str, weight, price = dish
        ing_ro_list = [i.strip() for i in ing_ro_str.split(',') if i.strip()]
        ing_en_list = [i.strip() for i in ing_en_str.split(',') if i.strip()]
        try:
            price_num = float(price) if '.' in price else int(price)
        except:
            price_num = 0
            
        menu_items.append({
            'id': f'menu-{item_idx}',
            'category': cat_ro,
            'categoryEn': cat_en,
            'nameRo': name_ro,
            'nameEn': name_en,
            'ingredientsRo': ing_ro_list,
            'ingredientsEn': ing_en_list,
            'weight': weight,
            'price': price_num,
            'allergens': []
        })
        item_idx += 1

with open(r'src/data/menuData.ts', 'w', encoding='utf-8') as f:
    f.write('import { MenuItem } from "../types";\n\nexport const MENU_ITEMS: MenuItem[] = ')
    json.dump(menu_items, f, ensure_ascii=False, indent=2)
    f.write(';\n')

print(f'Wrote {len(menu_items)} items to src/data/menuData.ts')

# 2. Generate glossaryData.ts
glossary_items = []
glo_idx = 1
for cat_ro, cat_en, terms in ingr_data:
    for term_ro, term_en in terms:
        glossary_items.append({
            'id': f'glo-ingr-{glo_idx}',
            'category': cat_ro,
            'categoryEn': cat_en,
            'ro': term_ro,
            'en': term_en,
            'type': 'ingredient'
        })
        glo_idx += 1

vocab_idx = 1
for cat_ro, cat_en, terms in vocab_data:
    for term_ro, term_en in terms:
        glossary_items.append({
            'id': f'glo-vocab-{vocab_idx}',
            'category': cat_ro,
            'categoryEn': cat_en,
            'ro': term_ro,
            'en': term_en,
            'type': 'kitchen-vocab'
        })
        vocab_idx += 1

with open(r'src/data/glossaryData.ts', 'w', encoding='utf-8') as f:
    f.write('import { GlossaryTerm } from "../types";\n\nexport const GLOSSARY_TERMS: GlossaryTerm[] = ')
    json.dump(glossary_items, f, ensure_ascii=False, indent=2)
    f.write(';\n')

print(f'Wrote {len(glossary_items)} terms to src/data/glossaryData.ts')

# 3. Generate conversationData.ts
talk_items = []
talk_idx = 1
for scen_ro, scen_en, lines in talk_data:
    for speaker, ro_line, en_line in lines:
        talk_items.append({
            'id': f'conv-{talk_idx}',
            'scenario': scen_ro,
            'scenarioEn': scen_en,
            'speaker': speaker,
            'ro': ro_line,
            'en': en_line
        })
        talk_idx += 1

with open(r'src/data/conversationData.ts', 'w', encoding='utf-8') as f:
    f.write('import { ConversationLine } from "../types";\n\nexport const CONVERSATION_LINES: ConversationLine[] = ')
    json.dump(talk_items, f, ensure_ascii=False, indent=2)
    f.write(';\n')

print(f'Wrote {len(talk_items)} lines to src/data/conversationData.ts')
