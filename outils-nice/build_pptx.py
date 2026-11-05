import json, io, sys
from PIL import Image
from pptx import Presentation
from pptx.util import Inches, Pt
mask_path=sys.argv[1]; out=sys.argv[2]; label=sys.argv[3]
base=Image.open(mask_path).convert('RGB').resize((1920,1080))
meta=json.load(open('states/meta.json'))
prs=Presentation(); prs.slide_width=Inches(13.333); prs.slide_height=Inches(7.5)
blank=prs.slide_layouts[6]
import os; os.makedirs('composites',exist_ok=True)
for m in meta:
    im=base.copy(); im.paste(Image.open(m['file']).convert('RGB'),(52,52))
    fn=f"composites/s{m['slide']:02d}_{m['click']:02d}.jpg"; im.save(fn,'JPEG',quality=90,optimize=True)
    sl=prs.slides.add_slide(blank)
    sl.shapes.add_picture(fn,0,0,width=prs.slide_width,height=prs.slide_height)
    etape = f"Diapositive {m['slide']}/14 · clic {m['click']}/{m['total']}" if m['total'] else f"Diapositive {m['slide']}/14"
    suite = "Clic suivant : élément suivant sur cette diapositive." if m['click']<m['total'] else "Clic suivant : diapositive suivante."
    sl.notes_slide.notes_text_frame.text = f"{etape} — {m['title']}\n{suite}\n\nNOTES : {m['notes']}"
prs.save(out); print(out, len(meta),'slides', os.path.getsize(out)//1024,'KB')
