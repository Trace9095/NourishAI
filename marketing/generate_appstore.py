#!/usr/bin/env python3
"""App Store Connect screenshot generator — renders full-screen app UI at exact required sizes."""

import os
import tempfile

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
TEMPLATE_DIR = os.path.join(SCRIPT_DIR, "templates")
OUTPUT_DIR = os.path.join(SCRIPT_DIR, "output", "appstore")

# App Store Connect required sizes (full-screen, no phone frame)
SIZES = {
    "iphone-6.5": (1242, 2688),    # iPhone 11 Pro Max
    "iphone-6.7": (1284, 2778),    # iPhone 14 Pro Max
    "ipad-12.9":  (2048, 2732),    # iPad Pro 12.9"
    "watch-45mm": (396, 484),      # Apple Watch Series 7-9 (45mm)
    "watch-ultra": (410, 502),     # Apple Watch Ultra
}

# iPhone/iPad screenshots (6 templates)
SCREENSHOTS = [
    "appstore-01-hero",
    "appstore-02-ai-scan",
    "appstore-03-barcode",
    "appstore-04-meal-log",
    "appstore-05-ai-chat",
    "appstore-06-progress",
]

# Apple Watch screenshots (3 templates)
WATCH_SCREENSHOTS = [
    "appstore-watch-01-rings",
    "appstore-watch-02-macros",
    "appstore-watch-03-meal",
]

# CSS injected into iPad renders to hide Dynamic Island and fix status bar
IPAD_CSS = """
<style>
/* iPad: No Dynamic Island */
.dynamic-island { display: none !important; }

/* iPad: Centered status bar time (no notch gap) */
.status-bar {
  justify-content: space-between !important;
  padding-top: 0.8vh !important;
}
.status-bar-left,
.status-time {
  width: auto !important;
}

/* Reduce top padding since no Dynamic Island */
.content {
  padding-top: 1vh !important;
}
</style>
"""


def render_screenshot(template_name, output_path, width, height, size_name):
    """Render an HTML template to PNG at exact dimensions."""
    template_path = os.path.join(TEMPLATE_DIR, f"{template_name}.html")
    if not os.path.exists(template_path):
        print(f"  SKIP: {template_name} (template not found)")
        return False

    try:
        from playwright.sync_api import sync_playwright

        # Read template HTML
        with open(template_path, "r", encoding="utf-8") as f:
            html_content = f.read()

        # For iPad sizes, inject CSS to hide Dynamic Island and adjust status bar
        render_path = template_path
        tmp_file = None

        if size_name.startswith("ipad"):
            html_content = html_content.replace("</head>", IPAD_CSS + "</head>")
            tmp_file = tempfile.NamedTemporaryFile(
                mode="w", suffix=".html", delete=False, dir=TEMPLATE_DIR
            )
            tmp_file.write(html_content)
            tmp_file.close()
            render_path = tmp_file.name

        with sync_playwright() as p:
            browser = p.chromium.launch()
            page = browser.new_page(viewport={"width": width, "height": height})
            page.goto(f"file://{os.path.abspath(render_path)}")
            page.wait_for_timeout(2000)  # Font loading
            page.screenshot(path=output_path, type="png")
            browser.close()

        # Clean up temp file
        if tmp_file and os.path.exists(tmp_file.name):
            os.unlink(tmp_file.name)

        size_kb = os.path.getsize(output_path) / 1024
        print(f"  PNG: {os.path.basename(output_path)} ({size_kb:.0f}KB)")
        return True
    except Exception as e:
        print(f"  ERROR: {str(e)[:200]}")
        # Clean up temp file on error too
        if tmp_file and os.path.exists(tmp_file.name):
            os.unlink(tmp_file.name)
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

        # Determine which template list to use
        is_watch = size_name.startswith("watch")
        template_list = WATCH_SCREENSHOTS if is_watch else SCREENSHOTS

        for template in template_list:
            total += 1
            out_path = os.path.join(size_dir, f"{template}.png")
            if render_screenshot(template, out_path, width, height, size_name):
                ok += 1

    print(f"\n{ok}/{total} screenshots generated")
    print(f"Output: {OUTPUT_DIR}/")


if __name__ == "__main__":
    main()
