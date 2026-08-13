from PIL import Image, ImageDraw, ImageFont
import os

def create_pwa_icon(size, is_maskable=False, output_path="public/icon-192.png"):
    # Dark slate/cast-iron background
    img = Image.new("RGBA", (size, size), (20, 18, 16, 255))
    draw = ImageDraw.Draw(img)

    margin = int(size * (0.15 if is_maskable else 0.1))
    rect_coords = [margin, margin, size - margin, size - margin]
    
    # Outer ticket border in brass gold
    draw.rounded_rectangle(rect_coords, radius=int(size * 0.08), fill=(30, 27, 24, 255), outline=(217, 155, 38, 255), width=max(2, int(size * 0.02)))
    
    # Inner paprika red accent stripe
    header_h = int(size * 0.12)
    draw.rectangle([margin + 2, margin + 2, size - margin - 2, margin + header_h], fill=(224, 90, 54, 255))
    
    # Ticket Lines
    line_x_start = margin + int(size * 0.1)
    line_x_end = size - margin - int(size * 0.1)
    
    y1 = margin + header_h + int(size * 0.12)
    y2 = y1 + int(size * 0.1)
    y3 = y2 + int(size * 0.1)
    
    line_w = max(2, int(size * 0.03))
    draw.line([line_x_start, y1, line_x_end, y1], fill=(250, 246, 237, 255), width=line_w)
    draw.line([line_x_start, y2, line_x_start + int((line_x_end - line_x_start) * 0.7), y2], fill=(250, 246, 237, 255), width=line_w)
    draw.line([line_x_start, y3, line_x_start + int((line_x_end - line_x_start) * 0.4), y3], fill=(250, 246, 237, 255), width=line_w)
    
    # Paprika status dot
    dot_r = int(size * 0.04)
    dot_cx = line_x_end - dot_r
    dot_cy = y3
    draw.ellipse([dot_cx - dot_r, dot_cy - dot_r, dot_cx + dot_r, dot_cy + dot_r], fill=(224, 90, 54, 255))

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    img.save(output_path, "PNG")
    print(f"Generated {output_path} ({size}x{size})")

create_pwa_icon(192, False, "public/icon-192.png")
create_pwa_icon(512, False, "public/icon-512.png")
create_pwa_icon(512, True, "public/icon-maskable-512.png")
