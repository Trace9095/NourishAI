#!/usr/bin/env python3
"""App Store Connect screenshot generator — renders full-screen app UI at exact required sizes."""

import os
import glob

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
TEMPLATE_DIR = os.path.join(SCRIPT_DIR, "templates")
OUTPUT_DIR = os.path.join(SCRIPT_DIR, "output", "appstore")

# App Store Connect required sizes (full-screen, no phone frame)
SIZES = {
    "iphone-6.5": (1242, 2688),    # iPhone 11 Pro Max
    "iphone-6.7": (1284, 2778),    # iPhone 14 Pro Max
    "ipad-12.9":  (2048, 2732),    # iPad Pro 12.9"
}

SCREENSHOTS = [
    "appstore-01-hero",
    "appstore-02-ai-scan",
    "appstore-03-barcode",
    "appstore-04-meal-log",
    "appstore-05-ai-chat",
    "appstore-06-progress",
]


def render_screenshot(template_name, output_path, width, height):
    """Render an HTML template to PNG at exact dimensions."""
    template_path = os.path.join(TEMPLATE_DIR, f"{template_name}.html")
    if not os.path.exists(template_path):
        print(f"  SKIP: {template_name} (template not found)")
        return False

    try:
        from playwright.sync_api import sync_playwright
        with sync_playwright() as p:
            browser = p.chromium.launch()
            page = browser.new_page(viewport={"width": width, "height": height})
            page.goto(f"file://{os.path.abspath(template_path)}")
            page.wait_for_timeout(2000)  # Font loading
            page.screenshot(path=output_path, type="png")
            browser.close()
        size_kb = os.path.getsize(output_path) / 1024
        print(f"  PNG: {os.path.basename(output_path)} ({size_kb:.0f}KB)")
        return True
    except Exception as e:
        print(f"  ERROR: {str(e)[:200]}")
        return False


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    print("NourishAI — App Store Screenshot Generator")
    print("=" * 50)

    total = 0
    ok = 0

    for size_name, (width, height) in SIZES.items():
        print(f"\n{size_name} ({width}x{height}):")
        size_dir = os.path.join(OUTPUT_DIR, size_name)
        os.makedirs(size_dir, exist_ok=True)

        for template in SCREENSHOTS:
            total += 1
            out_path = os.path.join(size_dir, f"{template}.png")
            if render_screenshot(template, out_path, width, height):
                ok += 1

    print(f"\n{ok}/{total} screenshots generated")
    print(f"Output: {OUTPUT_DIR}/")


if __name__ == "__main__":
    main()
