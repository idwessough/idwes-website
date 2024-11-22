from PIL import Image
import pillow_heif
import sys

def heic_to_png(input_path, output_path):
    print(input_path, output_path)
    # Register HEIF opener with Pillow
    pillow_heif.register_heif_opener()
    # Open the HEIC image
    image = Image.open(input_path)
    # Save the image in PNG format
    image.save(output_path, format="PNG")
    print(f"Converted {input_path} to {output_path}")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python heic_to_png.py input.heic output.png")
    else:
        print(sys.argv)
        input_file = sys.argv[1]
        output_file = sys.argv[2]
        print(input_file, output_file)
        heic_to_png(input_file, output_file)
