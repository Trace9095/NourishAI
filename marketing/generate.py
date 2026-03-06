#!/usr/bin/env python3
"""
NourishAI Marketing Engine — Post & Reel Generator
Renders branded Instagram posts (PNG) and short-form videos (MP4) from HTML templates.

Uses Playwright (headless Chromium) for rendering, ffmpeg for video encoding.

Sizes:
  Feed:  1080x1080 (square PNG)
  Story: 1080x1920 (vertical PNG)
  Reel:  1080x1920 (vertical MP4, 16-18 seconds, 30fps)

Usage:
  python3 generate.py                          # All posts
  python3 generate.py --feed-only              # Feed PNGs only
  python3 generate.py --reels-only             # Reels MP4 only
  python3 generate.py --post nai-2026-03-06    # Single post by ID prefix
  python3 generate.py --list                   # Dry run — list all posts
  python3 generate.py --force                  # Regenerate even if files exist
"""

import argparse
import json
import os
import subprocess
import sys
import time
import glob

# Paths
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
TEMPLATE_DIR = os.path.join(SCRIPT_DIR, "templates")
CALENDAR_DIR = os.path.join(SCRIPT_DIR, "calendar")
OUTPUT_DIR = os.path.join(SCRIPT_DIR, "output")

# Dimensions
FEED_SIZE = (1080, 1080)
STORY_SIZE = (1080, 1920)
REEL_SIZE = (1080, 1920)
REEL_DURATION = 17  # seconds
REEL_FPS = 30


def load_calendars():
    """Load all calendar JSON files."""
    posts = []
    for cal_file in sorted(glob.glob(os.path.join(CALENDAR_DIR, "*.json"))):
        with open(cal_file, "r") as f:
            cal = json.load(f)
            posts.extend(cal if isinstance(cal, list) else cal.get("posts", []))
    return posts


def render_template(template_name, data, output_path, width, height):
    """Render an HTML template with placeholder substitution to PNG."""
    template_path = os.path.join(TEMPLATE_DIR, f"{template_name}.html")
    if not os.path.exists(template_path):
        print(f"  ERROR: Template not found: {template_path}")
        return False

    with open(template_path, "r") as f:
        html = f.read()

    # Replace placeholders
    for key, value in data.items():
        html = html.replace(f"{{{{{key}}}}}", str(value))

    # Write temp HTML
    temp_html = os.path.join(OUTPUT_DIR, "_temp_render.html")
    with open(temp_html, "w") as f:
        f.write(html)

    # Render with Playwright
    try:
        from playwright.sync_api import sync_playwright
        with sync_playwright() as p:
            browser = p.chromium.launch()
            page = browser.new_page(viewport={"width": width, "height": height})
            page.goto(f"file://{temp_html}")
            page.wait_for_timeout(500)  # Let fonts load
            page.screenshot(path=output_path, type="png")
            browser.close()
        print(f"  PNG: {os.path.basename(output_path)}")
        return True
    except ImportError:
        # Fallback to npx playwright
        js_script = f"""
const {{ chromium }} = require('playwright');
(async () => {{
    const browser = await chromium.launch();
    const page = await browser.newPage({{ viewport: {{ width: {width}, height: {height} }} }});
    await page.goto('file://{temp_html}');
    await page.waitForTimeout(500);
    await page.screenshot({{ path: '{output_path}', type: 'png' }});
    await browser.close();
}})();
"""
        js_temp = os.path.join(OUTPUT_DIR, "_temp_render.js")
        with open(js_temp, "w") as f:
            f.write(js_script)
        result = subprocess.run(["node", js_temp], capture_output=True, text=True)
        if result.returncode == 0:
            print(f"  PNG: {os.path.basename(output_path)}")
            return True
        else:
            print(f"  ERROR: {result.stderr[:200]}")
            return False
    finally:
        if os.path.exists(temp_html):
            os.remove(temp_html)


def render_reel(template_name, data, output_path):
    """Render an animated HTML template to MP4 via frame capture + ffmpeg."""
    template_path = os.path.join(TEMPLATE_DIR, f"{template_name}.html")
    if not os.path.exists(template_path):
        print(f"  ERROR: Template not found: {template_path}")
        return False

    with open(template_path, "r") as f:
        html = f.read()

    for key, value in data.items():
        html = html.replace(f"{{{{{key}}}}}", str(value))

    temp_html = os.path.join(OUTPUT_DIR, "_temp_reel.html")
    with open(temp_html, "w") as f:
        f.write(html)

    frames_dir = os.path.join(OUTPUT_DIR, "_frames")
    os.makedirs(frames_dir, exist_ok=True)

    total_frames = REEL_DURATION * REEL_FPS
    width, height = REEL_SIZE

    print(f"  Rendering {total_frames} frames at {REEL_FPS}fps...")

    try:
        from playwright.sync_api import sync_playwright
        with sync_playwright() as p:
            browser = p.chromium.launch()
            page = browser.new_page(viewport={"width": width, "height": height})
            page.goto(f"file://{temp_html}")

            # Capture frames
            for i in range(total_frames):
                frame_path = os.path.join(frames_dir, f"frame_{i:05d}.png")
                # Wait for the animation to progress
                ms = int((i / REEL_FPS) * 1000)
                if i == 0:
                    page.wait_for_timeout(100)
                else:
                    page.wait_for_timeout(int(1000 / REEL_FPS))
                page.screenshot(path=frame_path, type="png")

                # Progress indicator
                if (i + 1) % (REEL_FPS * 2) == 0:
                    print(f"    Frame {i+1}/{total_frames} ({(i+1)*100//total_frames}%)")

            browser.close()

        # Encode to MP4 with ffmpeg
        print(f"  Encoding MP4...")
        ffmpeg_cmd = [
            "ffmpeg", "-y",
            "-framerate", str(REEL_FPS),
            "-i", os.path.join(frames_dir, "frame_%05d.png"),
            "-c:v", "libx264",
            "-pix_fmt", "yuv420p",
            "-crf", "18",
            "-preset", "slow",
            "-vf", f"scale={width}:{height}",
            output_path
        ]
        result = subprocess.run(ffmpeg_cmd, capture_output=True, text=True)
        if result.returncode == 0:
            size_mb = os.path.getsize(output_path) / (1024 * 1024)
            print(f"  MP4: {os.path.basename(output_path)} ({size_mb:.1f}MB)")
            return True
        else:
            print(f"  FFMPEG ERROR: {result.stderr[:300]}")
            return False

    except ImportError:
        print("  ERROR: playwright not installed. Run: pip install playwright && playwright install chromium")
        return False
    finally:
        # Cleanup frames
        import shutil
        if os.path.exists(frames_dir):
            shutil.rmtree(frames_dir)
        if os.path.exists(temp_html):
            os.remove(temp_html)


def main():
    parser = argparse.ArgumentParser(description="NourishAI Marketing Engine")
    parser.add_argument("--feed-only", action="store_true", help="Feed PNGs only")
    parser.add_argument("--reels-only", action="store_true", help="Reels MP4 only")
    parser.add_argument("--post", type=str, help="Single post by ID prefix")
    parser.add_argument("--list", action="store_true", help="List all posts (dry run)")
    parser.add_argument("--force", action="store_true", help="Regenerate existing files")
    args = parser.parse_args()

    posts = load_calendars()
    print(f"\nNourishAI Marketing Engine")
    print(f"{'='*40}")
    print(f"Found {len(posts)} posts\n")

    for subdir in ["feed", "story", "reels"]:
        os.makedirs(os.path.join(OUTPUT_DIR, subdir), exist_ok=True)

    for post in posts:
        pid = post["id"]
        ptype = post.get("type", "feed")
        template = post["template"]
        data = post.get("data", {})

        # Filter
        if args.post and not pid.startswith(args.post):
            continue
        if args.feed_only and ptype != "feed":
            continue
        if args.reels_only and ptype != "reel":
            continue

        if args.list:
            print(f"  [{ptype.upper():5s}] {pid} — {template}")
            continue

        print(f"\n[{ptype.upper()}] {pid}")

        if ptype == "feed":
            out_path = os.path.join(OUTPUT_DIR, "feed", f"{pid}.png")
            if os.path.exists(out_path) and not args.force:
                print(f"  SKIP (exists)")
                continue
            render_template(template, data, out_path, *FEED_SIZE)

        elif ptype == "story":
            out_path = os.path.join(OUTPUT_DIR, "story", f"{pid}.png")
            if os.path.exists(out_path) and not args.force:
                print(f"  SKIP (exists)")
                continue
            render_template(template, data, out_path, *STORY_SIZE)

        elif ptype == "reel":
            out_path = os.path.join(OUTPUT_DIR, "reels", f"{pid}.mp4")
            if os.path.exists(out_path) and not args.force:
                print(f"  SKIP (exists)")
                continue
            render_reel(template, data, out_path)

    if not args.list:
        print(f"\nDone! Output in: {OUTPUT_DIR}/")


if __name__ == "__main__":
    main()
