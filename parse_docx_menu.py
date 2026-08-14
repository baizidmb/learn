import re, json

with open('extracted_menu_docx.txt', 'r', encoding='utf-8') as f:
    lines = [l.strip() for l in f.readlines() if l.strip()]

print(f"Total lines: {len(lines)}")

# We will parse categories and dishes
# Skip allergen header lines (lines 0..23)
start_idx = 0
for idx, line in enumerate(lines):
    if line.startswith("Mic dejun") and idx > 20:
        start_idx = idx
        break

print(f"Menu items start at line {start_idx}: {lines[start_idx]}")

dishes = []
current_category = "Mic dejun"
current_category_en = "Breakfast"

# Category mapping to English
CAT_EN_MAP = {
    "Mic dejun": "Breakfast",
    "Gustări Reci/Calde": "Hot & Cold Starters",
    "Fast Food": "Fast Food & Burgers",
    "Ciorbe/supe": "Soups & Broths",
    "Platouri": "Platters & Boards",
    "Preparate din pui": "Chicken Dishes",
    "Preparate din pasăre": "Poultry Dishes",
    "Preparate din porc": "Pork Dishes",
    "Preparate din vită": "Beef Dishes",
    "Preparate din peşte": "Fish & Seafood",
    "Preparate din pește": "Fish & Seafood",
    "Garnituri": "Side Dishes",
    "Sosuri": "Sauces & Dips",
    "Sosuri/Garnituri": "Sides & Sauces",
    "Paste": "Pasta & Italian",
    "Salate": "Salads",
    "Salate însoțitoare": "Side Salads",
    "Desert": "Desserts",
    "Pizza": "Pizza",
    "Băuturi": "Drinks & Beverage",
    "Băuturi calde": "Hot Drinks & Coffee",
    "Băuturi răcoritoare": "Soft Drinks",
    "Cocktailuri": "Cocktails & Spirits",
    "Bere": "Beer",
    "Vinuri": "Wines"
}

i = start_idx
while i < len(lines):
    line = lines[i]
    
    # Check if line is a category header
    for cat_key in CAT_EN_MAP.keys():
        if line.lower() == cat_key.lower() or (len(line) < 30 and cat_key.lower() in line.lower() and not 'lei' in line.lower() and not '(' in line):
            current_category = cat_key
            current_category_en = CAT_EN_MAP[cat_key]
            # print(f"Found Category: {current_category}")
            break
            
    # Check if line looks like a dish title: e.g. "Mic dejun 3,7 300gr. 25,00 lei" or "Ciorbă de burtă 1, 3, 7 100gr/300ml 29,00 lei"
    if 'lei' in line.lower() or 'gr' in line.lower() or 'ml' in line.lower():
        # Match dish line pattern
        # Extract price if present
        price_match = re.search(r'(\d+[,.]?\d*)\s*lei', line, re.IGNORECASE)
        price = 0
        if price_match:
            try:
                price = float(price_match.group(1).replace(',', '.'))
            except:
                price = 0
                
        # Extract weight if present
        weight_match = re.search(r'(\d+[\d/]*\s*(?:gr|g|ml|buc|pah|st)?\.?)', line, re.IGNORECASE)
        weight = ""
        if weight_match:
            weight = weight_match.group(1).strip()
            
        # Extract allergen codes (e.g. "1, 3, 7" or "3,7" or "1, 3, 7, 9, 10")
        allergens = []
        allergen_match = re.search(r'(\d+(?:\s*,\s*\d+)+)', line)
        if allergen_match:
            try:
                allergens = [int(a.strip()) for a in allergen_match.group(1).split(',') if a.strip().isdigit() and 1 <= int(a.strip()) <= 14]
            except:
                allergens = []
                
        # Extract dish name (strip weight, price, allergen numbers)
        clean_name = re.sub(r'(\d+(?:\s*,\s*\d+)+)', '', line)
        clean_name = re.sub(r'(\d+[\d/]*\s*(?:gr|g|ml|buc|pah|st)?\.?)', '', clean_name, flags=re.IGNORECASE)
        clean_name = re.sub(r'(\d+[,.]?\d*)\s*lei', '', clean_name, flags=re.IGNORECASE)
        clean_name = clean_name.replace('_____', '').strip(' ._-')
        
        # Check next line for ingredients inside parentheses (e.g. "(ou prăjit, cremvurști...)")
        ing_ro_list = []
        ing_en_list = []
        if i + 1 < len(lines) and lines[i+1].startswith('('):
            ing_str = lines[i+1].strip('() ')
            ing_ro_list = [ing.strip() for ing in ing_str.split(',') if ing.strip()]
            i += 1
            
        if clean_name and len(clean_name) > 2:
            dishes.append({
                'id': f"docx-dish-{len(dishes)+1}",
                'category': current_category,
                'categoryEn': current_category_en,
                'nameRo': clean_name,
                'nameEn': clean_name, # Translated via dict if available
                'ingredientsRo': ing_ro_list,
                'ingredientsEn': ing_ro_list,
                'weight': weight,
                'price': price,
                'allergens': allergens
            })

    i += 1

print(f"Extracted {len(dishes)} dishes from docx menu!")
if dishes:
    print("Sample dish:", dishes[0])
