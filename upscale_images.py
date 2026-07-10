import os
import glob
from PIL import Image

public_dir = r"c:\yazilim_projeler\zPompaj_DHES\app\public\pdhes-nedir"
images = glob.glob(os.path.join(public_dir, "img-*.webp"))

print(f"Processing {len(images)} images...")

for img_path in images:
    try:
        with Image.open(img_path) as img:
            width, height = img.size
            
            # 1. Crop bottom 52 pixels to remove watermark
            cropped_height = max(1, height - 52)
            cropped = img.crop((0, 0, width, cropped_height))
            
            # 2. Upscale by 2x
            new_size = (width * 2, cropped_height * 2)
            upscaled = cropped.resize(new_size, Image.Resampling.LANCZOS)
            
            # 3. Save
            upscaled.save(img_path, "WEBP", quality=95)
        print(f"Processed {os.path.basename(img_path)}")
    except Exception as e:
        print(f"Failed {os.path.basename(img_path)}: {e}")

print("Done!")
