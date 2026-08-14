import re, json, sys

sys.stdout.reconfigure(encoding='utf-8')

with open('extracted_menu_docx.txt', 'r', encoding='utf-8') as f:
    lines = [l.strip() for l in f.readlines() if l.strip()]

# Dictionary for common Romanian culinary term translations to English
TRANSLATIONS = {
    "mic dejun": "Breakfast Plate",
    "cartofi prăjiți cu ouă și slănină": "Fried Potatoes with Eggs & Bacon",
    "omletă cu şuncă și caşcaval": "Ham & Cheese Omelet",
    "omletă ţărănească cu slănină și ceapă": "Country Omelet with Bacon & Onion",
    "marissa breakfast": "Marissa Special Breakfast",
    "platou mic dejun": "Breakfast Platter",
    "bruschete cu roșii": "Tomato Bruschetta",
    "bacon prăjit/slănină prăjită": "Fried Bacon / Pork Belly",
    "cremvurşti": "Hot Dogs / Frankfurters",
    "telemea": "Salty Telemea Cheese",
    "caşcaval": "Yellow Cheese",
    "lapte": "Milk",
    "iaurt": "Yogurt",
    "unt porţionat": "Portion Butter",
    "cacao cu lapte": "Hot Cocoa with Milk",
    "cereale cu lapte": "Cereal with Milk",
    "gem": "Fruit Jam",
    "miere": "Honey",
    "mici": "Traditional Mititei Minced Rolls",
    "caşcaval pane": "Breaded Fried Cheese",
    "mămăligă cu brânză şi smântână": "Polenta with Cheese & Sour Cream",
    "burger de vită": "Beef Burger with Fries",
    "burger crispy": "Crispy Chicken Burger",
    "shaorma la farfurie": "Chicken Shawarma Platter",
    "ultra cheeseburger": "Ultra Cheeseburger",
    "ciorbă de burtă": "Beef Tripe Soup",
    "ciorbă rădăuțeană": "Radauti Chicken Garlic Soup",
    "ciorbă de văcuță": "Traditional Beef Soup",
    "supă de pui cu tăiței": "Chicken Noodle Soup",
    "ciorbă de fasole cu afumătură": "Bean Soup with Smoked Meat",
    "platou marissa": "Marissa House Platter",
    "platou tradițional": "Traditional Romanian Platter",
    "platou cald": "Hot Mix Grill Platter",
    "platou brânzeturi": "Assorted Cheese Board",
    "șnițel de pui": "Chicken Schnitzel",
    "piept de pui la grătar": "Grilled Chicken Breast",
    "ostropel de pui": "Garlic Chicken Stew",
    "cordon bleu de pui": "Chicken Cordon Bleu",
    "ceafă de porc la grătar": "Grilled Pork Neck",
    "tochitură moldovenească": "Moldavian Pork Stew",
    "sarmale cu mămăligă": "Stuffed Cabbage Rolls",
    "antrecot de vită": "Grilled Ribeye Steak",
    "mușchi de vită": "Beef Tenderloin Steak",
    "păstrăv la grătar": "Grilled Whole Trout",
    "crap prăjit": "Fried Carp Fillet",
    "somon la grătar": "Grilled Salmon Fillet",
    "doradă la grătar": "Grilled Sea Bream",
    "cartofi prăjiți": "French Fries",
    "cartofi țărănești": "Country Style Potatoes",
    "piure de cartofi": "Mashed Potatoes",
    "mămăliguță": "Warm Polenta",
    "mujdei de usturoi": "Garlic Dip (Mujdei)",
    "smântână": "Sour Cream",
    "papanași": "Papanasi Doughnuts with Jam & Sour Cream",
    "clătite cu finetti": "Crepes with Nutella",
    "clătite cu dulceață": "Crepes with Jam",
    "pizza margherita": "Margherita Pizza",
    "pizza prosciutto e funghi": "Prosciutto & Mushroom Pizza",
    "pizza quattro formaggi": "Quattro Formaggi Pizza",
    "espresso": "Espresso Coffee",
    "cappuccino": "Cappuccino",
    "caffe latte": "Caffe Latte",
    "ceai cald": "Hot Tea",
    "apă minerală": "Sparkling Mineral Water",
    "apă plată": "Still Mineral Water",
    "limonadă": "Fresh Lemonade",
    "bere ciuc": "Ciuc Beer",
    "bere ursus": "Ursus Beer",
    "bere heineken": "Heineken Beer"
}

# Translate ingredient strings
ING_MAP = {
    "ou prăjit": "fried egg",
    "cremvurști": "hot dogs",
    "roșie": "tomato",
    "roșii": "tomatoes",
    "cașcaval": "yellow cheese",
    "ulei de floarea soarelui": "sunflower oil",
    "condimente": "seasoning",
    "ou": "egg",
    "ouă": "eggs",
    "ceapă": "onion",
    "slănină de porc": "pork bacon",
    "cartofi prăjiți": "french fries",
    "șuncă": "ham",
    "chiflă": "bun",
    "cremă de brânză": "cream cheese",
    "ou poșat": "poached egg",
    "bacon": "bacon",
    "sos olandez": "hollandaise sauce",
    "salată mixtă": "mixed salad",
    "mix de semințe": "seed mix",
    "unt": "butter",
    "gem": "jam",
    "mezel": "cold cuts",
    "telemea": "salty cheese",
    "pâine": "bread",
    "pătrunjel verde": "fresh parsley",
    "ulei de măsline": "olive oil",
    "bacon/slănină": "bacon / pork belly",
    "lapte": "milk",
    "iaurt": "yogurt",
    "zahăr": "sugar",
    "pudră de cacao": "cocoa powder",
    "cereale pentru micul dejun": "breakfast cereal",
    "mici": "minced meat rolls",
    "muştar": "mustard",
    "mozzarella": "mozzarella cheese",
    "pesmet": "breadcrumbs",
    "făină de grâu": "wheat flour",
    "brânză de vaci": "cottage cheese",
    "apă": "water",
    "făină de mălai": "cornmeal",
    "sare": "salt",
    "carne vită": "beef meat",
    "brânză chedar": "cheddar cheese",
    "castraveți murați": "pickled cucumbers",
    "sos cheddar": "cheddar sauce",
    "piept de pui": "chicken breast",
    "salată sezon": "seasonal salad",
    "maioneză": "mayonnaise",
    "carne de pui": "chicken meat",
    "lipie": "pita bread",
    "varză": "cabbage",
    "ketchup": "ketchup",
    "burtă de vită": "beef tripe",
    "legume asortate": "mixed vegetables",
    "smântână": "sour cream",
    "usturoi": "garlic",
    "oțet": "vinegar",
    "făină": "flour"
}

def translate_name(name_ro):
    low = name_ro.lower()
    for key, val in TRANSLATIONS.items():
        if key in low:
            return val
    # Generic fallback translation formatting
    return name_ro.title()

def translate_ings(ing_ro_list):
    res = []
    for ing in ing_ro_list:
        low = ing.lower().strip()
        tr = ING_MAP.get(low, low)
        res.append(tr)
    return res

# Parse categories and items
start_idx = 23 # Skip disclaimer lines
items = []
current_cat = "Mic dejun"
current_cat_en = "Breakfast"

i = start_idx
while i < len(lines):
    line = lines[i]
    
    # Category detection
    if line in ["Mic dejun", "Gustări Reci/Calde", "Fast Food", "Ciorbe/supe", "Platouri", "Preparate din pui", "Preparate din porc", "Preparate din vită", "Preparate din pește", "Preparate din peşte", "Garnituri", "Sosuri", "Paste", "Salate", "Desert", "Pizza", "Băuturi", "Băuturi calde", "Băuturi răcoritoare", "Cocktailuri", "Bere", "Vinuri"]:
        current_cat = line
        if "Mic" in line: current_cat_en = "Breakfast"
        elif "Gustări" in line: current_cat_en = "Starters & Appetizers"
        elif "Fast" in line: current_cat_en = "Fast Food & Burgers"
        elif "Ciorbe" in line: current_cat_en = "Soups & Broths"
        elif "Platouri" in line: current_cat_en = "Platters & Boards"
        elif "pui" in line: current_cat_en = "Chicken Dishes"
        elif "porc" in line: current_cat_en = "Pork Dishes"
        elif "vită" in line: current_cat_en = "Beef Dishes"
        elif "pește" in line or "peşte" in line: current_cat_en = "Fish & Seafood"
        elif "Garnituri" in line: current_cat_en = "Side Dishes"
        elif "Sosuri" in line: current_cat_en = "Sauces & Dips"
        elif "Paste" in line: current_cat_en = "Pasta"
        elif "Salate" in line: current_cat_en = "Salads"
        elif "Desert" in line: current_cat_en = "Desserts"
        elif "Pizza" in line: current_cat_en = "Pizza"
        elif "Băuturi" in line: current_cat_en = "Drinks & Beverages"
        i += 1
        continue

    # Look for dish lines containing price ("lei")
    if 'lei' in line.lower():
        # Match price
        price_m = re.search(r'(\d+[,.]?\d*)\s*lei', line, re.IGNORECASE)
        price = float(price_m.group(1).replace(',', '.')) if price_m else 0
        
        # Match weight
        weight_m = re.search(r'(\d+[\d/]*\s*(?:gr|g|ml|buc|pah|st)?\.?)', line, re.IGNORECASE)
        weight = weight_m.group(1).strip() if weight_m else ""
        
        # Match allergen indices
        allergens = []
        all_m = re.search(r'(\d+(?:\s*,\s*\d+)+)', line)
        if all_m:
            parts = all_m.group(1).split(',')
            for p in parts:
                p_str = p.strip()
                if p_str.isdigit() and 1 <= int(p_str) <= 14:
                    allergens.append(int(p_str))
                    
        # Extract title
        title = line
        title = re.sub(r'(\d+[,.]?\d*)\s*lei', '', title, flags=re.IGNORECASE)
        title = re.sub(r'(\d+(?:\s*,\s*\d+)+)', '', title)
        title = re.sub(r'(\d+[\d/]*\s*(?:gr|g|ml|buc|pah|st)?\.?)', '', title, flags=re.IGNORECASE)
        title = title.replace('_____', '').strip(' ._-')
        
        # Check next line for ingredients in parentheses
        ing_ro = []
        ing_en = []
        if i + 1 < len(lines) and lines[i+1].startswith('('):
            raw_ing = lines[i+1].strip('() ')
            ing_ro = [x.strip() for x in raw_ing.split(',') if x.strip()]
            ing_en = translate_ings(ing_ro)
            i += 1

        if len(title) > 2 and not title.startswith("Informații"):
            items.append({
                'id': f"docx-{len(items)+1}",
                'category': current_cat,
                'categoryEn': current_cat_en,
                'nameRo': title,
                'nameEn': translate_name(title),
                'ingredientsRo': ing_ro,
                'ingredientsEn': ing_en,
                'weight': weight,
                'price': price,
                'allergens': allergens
            })

    i += 1

print(f"Parsed {len(items)} items from DOCX menu!")

with open('src/data/menuData.ts', 'w', encoding='utf-8') as f:
    f.write('import { MenuItem } from "../types";\n\nexport const MENU_ITEMS: MenuItem[] = ')
    json.dump(items, f, ensure_ascii=False, indent=2)
    f.write(';\n')

print("Saved menuData.ts successfully!")
