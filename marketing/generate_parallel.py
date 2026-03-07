#!/usr/bin/env python3
"""Parallel reel renderer — renders all reels simultaneously using multiprocessing."""

import json
import os
import glob
import subprocess
import shutil
from multiprocessing import Pool, cpu_count

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
TEMPLATE_DIR = os.path.join(SCRIPT_DIR, "templates")
CALENDAR_DIR = os.path.join(SCRIPT_DIR, "calendar")
OUTPUT_DIR = os.path.join(SCRIPT_DIR, "output")
REEL_FPS = 30
REEL_DURATION = 15
REEL_SIZE = (1080, 1920)


def render_single_reel(args):
    """Render a single reel — designed to run in a separate process."""
    pid, template, data = args
    template_path = os.path.join(TEMPLATE_DIR, f"{template}.html")
    output_path = os.path.join(OUTPUT_DIR, "reels", f"{pid}.mp4")

    if not os.path.exists(template_path):
        return f"SKIP {pid}: template not found"

    with open(template_path, "r") as f:
        html = f.read()
    for key, value in data.items():
        html = html.replace(f"{{{{{key}}}}}", str(value))

    # Each process gets its own temp dir
    frames_dir = os.path.join(OUTPUT_DIR, f"_frames_{pid}")
    os.makedirs(frames_dir, exist_ok=True)
    temp_html = os.path.join(OUTPUT_DIR, f"_temp_{pid}.html")

    with open(temp_html, "w") as f:
        f.write(html)

    total_frames = REEL_DURATION * REEL_FPS
    width, height = REEL_SIZE

    try:
        from playwright.sync_api import sync_playwright
        with sync_playwright() as p:
            browser = p.chromium.launch()
            page = browser.new_page(viewport={"width": width, "height": height})
            page.goto(f"file://{os.path.abspath(temp_html)}")
            page.wait_for_timeout(200)
            page.evaluate("""() => {
                document.getAnimations().forEach(a => a.pause());
            }""")

            for i in range(total_frames):
                frame_path = os.path.join(frames_dir, f"frame_{i:05d}.png")
                time_ms = (i / REEL_FPS) * 1000
                page.evaluate(f"""(t) => {{
                    document.getAnimations().forEach(a => {{
                        a.currentTime = t;
                    }});
                }}""", time_ms)
                page.screenshot(path=frame_path, type="png")

            browser.close()

        # Encode to MP4
        ffmpeg_cmd = [
            "ffmpeg", "-y",
            "-framerate", str(REEL_FPS),
            "-i", os.path.join(frames_dir, "frame_%05d.png"),
            "-c:v", "libx264",
            "-pix_fmt", "yuv420p",
            "-crf", "18",
            "-preset", "fast",
            "-vf", f"scale={width}:{height}",
            output_path
        ]
        result = subprocess.run(ffmpeg_cmd, capture_output=True, text=True)
        if result.returncode == 0:
            size_mb = os.path.getsize(output_path) / (1024 * 1024)
            return f"OK {pid} ({size_mb:.1f}MB)"
        else:
            return f"FFMPEG ERROR {pid}: {result.stderr[:200]}"
    except Exception as e:
        return f"ERROR {pid}: {str(e)[:200]}"
    finally:
        if os.path.exists(frames_dir):
            shutil.rmtree(frames_dir)
        if os.path.exists(temp_html):
            os.remove(temp_html)


def main():
    os.makedirs(os.path.join(OUTPUT_DIR, "reels"), exist_ok=True)

    # Load all reel posts
    posts = []
    for cal_file in sorted(glob.glob(os.path.join(CALENDAR_DIR, "*.json"))):
        with open(cal_file, "r") as f:
            cal = json.load(f)
            posts.extend(cal)

    reels = [(p["id"], p["template"], p.get("data", {})) for p in posts if p.get("type") == "reel"]
    print(f"Rendering {len(reels)} reels in parallel ({REEL_DURATION}s each, {REEL_FPS}fps, {REEL_DURATION * REEL_FPS} frames)")

    # Use up to 8 parallel workers (limited by CPU/RAM)
    workers = min(8, len(reels), cpu_count())
    print(f"Using {workers} parallel workers\n")

    with Pool(workers) as pool:
        results = pool.map(render_single_reel, reels)

    print("\n=== Results ===")
    for r in results:
        print(f"  {r}")

    ok = sum(1 for r in results if r.startswith("OK"))
    print(f"\n{ok}/{len(reels)} reels rendered successfully")


if __name__ == "__main__":
    main()
