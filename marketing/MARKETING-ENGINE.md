# NourishAI Marketing Engine — Complete Documentation

> **Last Updated:** 2026-03-06 (Session 79)
> **Owner:** Trace Hildebrand | CEO@epicai.ai
> **Location:** `~/Documents/APPS/CLIENT-SITES/NourishAI-main/marketing/`

## What This Is

A self-contained Instagram marketing content generator that produces:
- **Feed posts** (1080x1080 PNG) — branded square images
- **Story posts** (1080x1920 PNG) — vertical images
- **Reels** (1080x1920 MP4, 15s, 30fps) — animated short-form video

Uses HTML/CSS templates rendered via Playwright (headless Chromium) + ffmpeg for video encoding.

---

## Architecture Overview

```
User writes calendar JSON → generate.py reads it → loads HTML template
→ replaces {{PLACEHOLDERS}} → Playwright renders to PNG/frames
→ ffmpeg encodes frames to MP4 → output ready for Instagram
```

### For Reels Specifically:
```
1. Load HTML template (contains CSS @keyframes animations)
2. Replace {{PLACEHOLDERS}} with data from calendar JSON
3. Open in Playwright at 1080x1920 viewport
4. PAUSE all CSS animations via Web Animations API
5. For each frame (0 to totalFrames):
   a. SEEK all animations to exact time: currentTime = (frame/30)*1000
   b. Take screenshot → frame_XXXXX.png
6. ffmpeg encodes frames to MP4 (H.264, CRF 18, 30fps)
7. Clean up temp files
```

The **pause+seek** approach is critical — it gives frame-accurate control over CSS animations. Without it, animations run in real-time during rendering, causing timing drift.

---

## Folder Structure

```
marketing/
├── MARKETING-ENGINE.md          ← This file
├── generate.py                   ← Main generator (serial, all post types)
├── generate_parallel.py          ← Parallel reel renderer (multiprocessing)
├── calendar/                     ← Content calendar JSONs (one per month)
│   ├── march-2026.json
│   ├── april-2026.json
│   ├── may-2026.json
│   └── june-2026.json
├── templates/                    ← HTML templates
│   ├── feed-macro-tip.html       ← Feed: numbered tip card
│   ├── feed-photo-feature.html   ← Feed: photo-first feature
│   ├── feed-stat-card.html       ← Feed: bold stat highlight
│   ├── story-feature.html        ← Story: feature showcase (SVG icons)
│   ├── story-before-after.html   ← Story: comparison
│   ├── reel-ai-scan.html         ← Reel: AI photo scanning demo
│   ├── reel-speed-demo.html      ← Reel: speed comparison
│   ├── reel-macro-rings.html     ← Reel: SVG ring visualization
│   ├── reel-day-tracker.html     ← Reel: day timeline
│   ├── reel-barcode-scan.html    ← Reel: barcode scanning
│   ├── reel-weekly-progress.html ← Reel: weekly calendar rings
│   ├── reel-before-after.html    ← Reel: manual vs AI comparison
│   ├── reel-social-proof.html    ← Reel: user count + reviews
│   ├── reel-protein-goal.html    ← Reel: protein ring filling
│   └── reel-menu-scan.html       ← Reel: restaurant menu AI
├── fonts/                         ← (reserved for self-hosted fonts)
├── scripts/                       ← (reserved for utility scripts)
└── output/
    ├── feed/                      ← Generated feed PNGs
    ├── story/                     ← Generated story PNGs
    └── reels/                     ← Generated reel MP4s
```

---

## Dependencies

```bash
# Python packages
pip install playwright

# Browser binary
python -m playwright install chromium

# Video encoding (macOS)
brew install ffmpeg

# Verify
python3 -c "from playwright.sync_api import sync_playwright; print('OK')"
ffmpeg -version
```

---

## Commands

### generate.py (Serial — All Post Types)

```bash
# Generate all posts (feed + story + reels)
python3 marketing/generate.py

# Feed PNGs only
python3 marketing/generate.py --feed-only

# Reels MP4 only
python3 marketing/generate.py --reels-only

# Single post by ID prefix
python3 marketing/generate.py --post nai-2026-03-06

# List all posts (dry run)
python3 marketing/generate.py --list

# Force regenerate existing files
python3 marketing/generate.py --force
```

### generate_parallel.py (Parallel — Reels Only)

```bash
# Render all reels in parallel (8 workers)
python3 marketing/generate_parallel.py
```

Uses Python `multiprocessing.Pool` with up to 8 workers. Each worker gets its own temp directory (`_frames_{pid}`) so there's no file collision. Uses `-preset fast` for quicker encoding.

**Speed comparison:** 16 reels serial = ~40 min. Parallel = ~4 min.

---

## Calendar JSON Format

Each month gets its own JSON file. Format is a flat array of post objects:

```json
[
  {
    "id": "nai-2026-03-06-feed-macro-tip",
    "date": "2026-03-06",
    "type": "feed",
    "template": "feed-macro-tip",
    "data": {
      "HEADLINE": "3 Macro Mistakes",
      "TIP1_TITLE": "Skipping Protein at Breakfast",
      "TIP1_DESC": "Front-load protein to curb cravings",
      "TIP2_TITLE": "Ignoring Fiber",
      "TIP2_DESC": "25-30g daily keeps you full longer",
      "TIP3_TITLE": "Fear of Fats",
      "TIP3_DESC": "Healthy fats fuel hormones and joints"
    },
    "caption": "Stop making these 3 macro mistakes...",
    "hashtags": "#NourishAI #MacroTracking #NutritionTips"
  },
  {
    "id": "nai-2026-03-16-reel-scan",
    "date": "2026-03-16",
    "type": "reel",
    "template": "reel-ai-scan",
    "data": {}
  }
]
```

### Post Fields

| Field | Required | Description |
|-------|----------|-------------|
| `id` | Yes | Unique ID: `nai-{date}-{slug}` |
| `date` | Yes | `YYYY-MM-DD` |
| `type` | Yes | `feed`, `story`, or `reel` |
| `template` | Yes | HTML template filename (without `.html`) |
| `data` | No | Key-value pairs for `{{PLACEHOLDER}}` substitution |
| `caption` | No | Instagram caption text |
| `hashtags` | No | Hashtag string |

### ID Naming Convention
```
nai-2026-03-06-feed-macro-tip
│   │          │    │
│   │          │    └── slug (descriptive)
│   │          └── type (feed/story/reel)
│   └── date (YYYY-MM-DD)
└── brand prefix
```

---

## Template System — {{PLACEHOLDER}} Tokens

Templates use double-curly-brace tokens: `{{KEY_NAME}}`

The generator replaces them with values from the calendar JSON `data` object:

```python
for key, value in data.items():
    html = html.replace(f"{{{{{key}}}}}", str(value))
```

### Feed Template Placeholders

**feed-macro-tip.html:**
`{{HEADLINE}}`, `{{TIP1_TITLE}}`, `{{TIP1_DESC}}`, `{{TIP2_TITLE}}`, `{{TIP2_DESC}}`, `{{TIP3_TITLE}}`, `{{TIP3_DESC}}`

**feed-photo-feature.html:**
`{{HEADLINE}}`, `{{SUBTITLE}}`, `{{DESCRIPTION}}`

**feed-stat-card.html:**
`{{STAT_NUMBER}}`, `{{STAT_LABEL}}`, `{{DESCRIPTION}}`

### Story Template Placeholders

**story-feature.html:**
`{{HEADLINE}}`, `{{FEATURE_1_TITLE}}`, `{{FEATURE_1_DESC}}`, `{{FEATURE_2_TITLE}}`, `{{FEATURE_2_DESC}}`, `{{FEATURE_3_TITLE}}`, `{{FEATURE_3_DESC}}`

**story-before-after.html:**
`{{HEADLINE}}`, `{{BEFORE_TEXT}}`, `{{AFTER_TEXT}}`

### Reel Templates
Most reel templates have NO placeholders — they're self-contained animated HTML with hardcoded NourishAI content. This is intentional: reel content is brand-specific and visual, not data-driven.

---

## Reel Template Anatomy

Every reel template follows this structure:

### CSS Structure
```css
/* 1. Canvas setup */
body { width: 1080px; height: 1920px; background: #0A0A14; }

/* 2. Ambient gradient orbs (3 large blurred circles) */
.orb { position: absolute; border-radius: 50%; filter: blur(100px); }

/* 3. Floating particles (8 small dots rising) */
.particle { animation: particleUp Xs ease-in-out Ys infinite; }

/* 4. Film grain overlay */
.grain { background-image: url("data:image/svg+xml,..."); opacity: 0.04; }

/* 5. Scene containers (4 scenes, absolutely positioned) */
.scene { position: absolute; inset: 0; }

/* 6. Scene timing (15 seconds total) */
.scene-hook    { animation: sceneIn 0.6s 0.3s, sceneOut 0.5s 3.0s; }
.scene-main    { animation: sceneIn 0.6s 3.5s, sceneOut 0.5s 7.5s; }
.scene-support { animation: sceneIn 0.6s 8.0s, sceneOut 0.5s 11.5s; }
.scene-cta     { animation: sceneIn 0.8s 12.0s; }  /* No sceneOut — stays */

/* 7. Internal element stagger (within each scene) */
.feature-item:nth-child(1) { animation: slideRight 0.5s 8.2s; }
.feature-item:nth-child(2) { animation: slideRight 0.5s 8.5s; }
/* ... stagger by 0.3s each */

/* 8. CTA effects */
.cta-button { animation: pulse 2s 12.5s infinite; }
.cta-button::after { animation: shimmer 3s 12.5s infinite; }
```

### HTML Structure
```html
<body>
  <!-- Background layers -->
  <div class="orb orb-1"></div>
  <div class="orb orb-2"></div>
  <div class="orb orb-3"></div>
  <div class="particle"></div> <!-- x8 -->
  <div class="grain"></div>

  <!-- Scene 1: Hook -->
  <div class="scene scene-hook">
    <div class="hook-text">BIG BOLD TEXT</div>
  </div>

  <!-- Scene 2: Main content -->
  <div class="scene scene-main">
    <!-- Phone mockup, demo, comparison, etc -->
  </div>

  <!-- Scene 3: Supporting detail -->
  <div class="scene scene-support">
    <!-- Features, stats, testimonials -->
  </div>

  <!-- Scene 4: CTA -->
  <div class="scene scene-cta">
    <div class="cta-logo"><span class="green">Nourish</span>AI</div>
    <div class="cta-tagline">AI-Powered Nutrition Tracking</div>
    <div class="cta-button">Download Free</div>
  </div>
</body>
```

### Scene Timing (15 seconds)

| Scene | Start | End | Duration | Purpose |
|-------|-------|-----|----------|---------|
| 1: Hook | 0.3s | 3.0s | 2.7s | Stop the scroll — bold text, provocative question |
| 2: Main | 3.5s | 7.5s | 4.0s | Core demo — phone mockup, scanning, comparison |
| 3: Support | 8.0s | 11.5s | 3.5s | Proof — features, stats, social proof |
| 4: CTA | 12.0s | 15.0s | 3.0s | Drive action — logo, download button, shimmer |

**Gap between scenes:** 0.5s (sceneOut fade + sceneIn fade-up)

### Seamless Loop Fade

Every reel fades to the dark background in the last 1 second so it loops seamlessly. Viewers can't tell where the reel starts or ends.

```css
.loop-fade {
  position: absolute;
  inset: 0;
  background: #0A0A14;
  opacity: 0;
  z-index: 200;         /* Above grain (z:100) */
  pointer-events: none;
  animation: loopFadeIn 1s ease-in 14.0s forwards;
}
@keyframes loopFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

**How it works:** Reel starts from dark bg (scene 1 fades in at 0.3s). Loop-fade returns to that same dark state at 14.0s-15.0s. When the video loops, the transition is invisible. Formula: `delay = REEL_DURATION - 1.0`.

---

## Brand Colors (NourishAI)

| Token | Hex | Usage |
|-------|-----|-------|
| bg | `#0A0A14` | Body background |
| card | `#12121A` | Card/container backgrounds |
| green | `#34C759` | Primary brand, success, CTA |
| orange | `#FF9500` | Accent, calories |
| protein | `#FF6B6B` | Protein macro color |
| carbs | `#4ECDC4` | Carbs macro color |
| fat | `#FFE66D` | Fat macro color |
| water | `#5AC8FA` | Water, info, blue accents |
| white | `rgba(255,255,255,0.85)` | Primary text |
| white-dim | `rgba(255,255,255,0.5)` | Secondary text |

---

## Visual Effects Breakdown

### Gradient Orbs
3 large blurred circles that slowly pulse in opacity (0.06 → 0.14). Each has a different brand color and is offset from the edges so only the glow is visible. Creates depth without distraction.

### Floating Particles
8 small circles (3-6px) that float upward from bottom to top. Varied speeds (8-13s), varied opacity (0.2-0.4), varied colors (green, orange, blue). Creates ambient motion.

### Film Grain
SVG noise pattern at 4% opacity applied as a full-screen overlay. Adds subtle texture that prevents the "too clean" digital look.

### Shimmer Sweep
Linear gradient that sweeps across the CTA button. `left: -100%` → `left: 200%` over 3 seconds. Creates a premium "light reflection" effect.

### Pulse
CTA button gently scales 1.0 → 1.04 → 1.0 with enhanced box-shadow. Creates a "breathing" alive feel.

---

## Rendering Pipeline — Technical Details

### Frame-Accurate Capture (Web Animations API)

The key technique that makes this work is **pausing CSS animations and seeking to exact times**:

```javascript
// 1. Pause ALL animations on the page
document.getAnimations().forEach(a => a.pause());

// 2. For each video frame, seek to exact time
document.getAnimations().forEach(a => {
    a.currentTime = timeInMilliseconds;
});
```

This is critical because:
- CSS animations run in real-time. Screenshot capture takes ~50ms per frame.
- Over 450 frames (15s x 30fps), timing drift would be 22+ seconds.
- Pause+seek gives perfect frame alignment regardless of capture speed.

### ffmpeg Encoding

```bash
ffmpeg -y \
  -framerate 30 \
  -i frames/frame_%05d.png \
  -c:v libx264 \
  -pix_fmt yuv420p \
  -crf 18 \
  -preset slow \
  -vf scale=1080:1920 \
  output.mp4
```

| Flag | Purpose |
|------|---------|
| `-y` | Overwrite without asking |
| `-framerate 30` | Input frame rate |
| `-c:v libx264` | H.264 codec (universal) |
| `-pix_fmt yuv420p` | Pixel format for device compat |
| `-crf 18` | Quality (18 = visually lossless) |
| `-preset slow` | Better compression (`fast` for parallel) |

### Parallel Rendering (generate_parallel.py)

Uses Python `multiprocessing.Pool`:
- Up to 8 workers (limited by CPU/RAM)
- Each worker gets isolated temp directory: `_frames_{post_id}`
- Each worker launches its own Playwright browser instance
- Uses `-preset fast` (speed over compression)
- Results collected via `pool.map()`

---

## How to Create a New Reel Template

### Step 1: Create the HTML file
```bash
cp marketing/templates/reel-ai-scan.html marketing/templates/reel-new-template.html
```

### Step 2: Modify the content
Keep the boilerplate (orbs, particles, grain, shared animations). Replace only the 4 scene `<div>` contents.

### Step 3: Set scene timing
Follow the 15-second timing structure. Update all `animation:` delay values.

### Step 4: Add to calendar JSON
```json
{
  "id": "nai-2026-04-15-reel-new-template",
  "date": "2026-04-15",
  "type": "reel",
  "template": "reel-new-template",
  "data": {}
}
```

### Step 5: Generate
```bash
python3 marketing/generate.py --post nai-2026-04-15 --force
```

### Step 6: Copy to backend
```bash
cp marketing/output/reels/nai-2026-04-15-reel-new-template.mp4 \
   backend/public/images/instagram/reels/
```

---

## How to Add a New Month

1. Create `marketing/calendar/{month}-{year}.json`
2. Add post entries (mix of feed, story, reel types)
3. Copy to `backend/lib/instagram-{month}-{year}.json` (for admin calendar page)
4. Run generator: `python3 marketing/generate.py --force`
5. Copy outputs to `backend/public/images/instagram/`

---

## Deployment Workflow

```bash
# 1. Generate all content
cd /path/to/NourishAI-main
python3 marketing/generate.py --force

# 2. For reels only (faster with parallel)
python3 marketing/generate_parallel.py

# 3. Copy to backend public dir
cp marketing/output/feed/*.png backend/public/images/instagram/feed/
cp marketing/output/story/*.png backend/public/images/instagram/story/
cp marketing/output/reels/*.mp4 backend/public/images/instagram/reels/

# 4. Sync calendar JSONs
cp marketing/calendar/*.json backend/lib/

# 5. Git commit + push
git add backend/public/images/instagram/ backend/lib/instagram-*.json
git commit -m "feat: update Instagram content"
git push origin main
```

---

## Adapting This Engine for Another Project

To reuse this engine for a different brand/app:

1. **Copy the marketing/ folder** to the new project
2. **Update brand colors** in all templates (find/replace hex values)
3. **Update brand name** in CTA scenes (logo text, tagline)
4. **Create new reel content** — modify scene 1-3 content per brand
5. **Create calendar JSONs** with new post IDs (use `{brand}-{date}-{slug}` pattern)
6. **Update generate.py paths** (SCRIPT_DIR, OUTPUT_DIR, etc.)

For a full reusable template, see: `MARKETING-ENGINES/REEL-ENGINE-TEMPLATE.md`

---

## Content Statistics

| Type | Templates | Posts (Mar-Jun 2026) |
|------|-----------|---------------------|
| Feed | 3 | 50 |
| Story | 2 | 15 |
| Reel | 10 | 16 |
| **Total** | **15** | **81** |

---

## Known Issues

1. **Playwright font loading:** First-render fonts may not load if Google Fonts CDN is slow. The generator waits 200-500ms but self-hosted fonts are more reliable.
2. **File size:** Reels with lots of visual content can exceed 3MB. Reduce CRF to 20 if needed.
3. **macOS Playwright path:** If `playwright install chromium` fails, try `python3 -m playwright install chromium`.
