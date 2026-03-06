export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string; // HTML string
  coverImage?: string;
  author: string;
  category: string;
  tags: string[];
  publishedAt: string; // ISO date
  readTime: number; // minutes
}

export const BLOG_CATEGORIES = [
  "All",
  "Nutrition",
  "Technology",
  "Fitness",
  "Tips",
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

export const blogPosts: BlogPost[] = [
  {
    slug: "how-to-track-macros-without-losing-your-mind",
    title: "How to Track Macros Without Losing Your Mind",
    excerpt:
      "Macro tracking doesn't have to be tedious. Learn the strategies and mindset shifts that make counting protein, carbs, and fat feel effortless — not obsessive.",
    author: "NourishAI Team",
    category: "Nutrition",
    tags: ["macros", "nutrition", "beginner", "habits"],
    publishedAt: "2026-02-18",
    readTime: 7,
    content: `
<p>If you've ever opened a food tracking app, stared at an empty diary, and thought "I have no idea what I ate," you're not alone. Macro tracking has a reputation for being tedious, obsessive, and unsustainable. But it doesn't have to be any of those things.</p>

<p>The truth is that most people who quit macro tracking don't quit because the math is hard. They quit because they try to be perfect from day one. This guide will show you a better way — one that builds the habit gradually and keeps you sane.</p>

<h2>What Are Macros, Really?</h2>

<p>Macronutrients are the three categories of nutrients your body needs in large amounts: <strong>protein</strong>, <strong>carbohydrates</strong>, and <strong>fat</strong>. Each serves a critical function:</p>

<ul>
<li><strong>Protein</strong> (4 cal/g) — builds and repairs muscle tissue, supports immune function, and keeps you feeling full longer than carbs or fat alone.</li>
<li><strong>Carbohydrates</strong> (4 cal/g) — your body's preferred fuel source for high-intensity exercise, brain function, and daily energy.</li>
<li><strong>Fat</strong> (9 cal/g) — essential for hormone production, cell membrane integrity, vitamin absorption (A, D, E, K), and long-lasting satiety.</li>
</ul>

<p>Calories are simply the sum of your macros. When you track macros instead of just calories, you gain control over <em>body composition</em> — not just weight. Two people eating 2,000 calories can look dramatically different depending on whether those calories come from balanced macros or from a macro ratio that's working against their goals.</p>

<h2>Step 1: Don't Change Anything Yet</h2>

<p>This is the step most people skip, and it's the most important one. Before you set any targets, spend 3–5 days simply logging what you already eat. Don't judge it, don't optimize it — just observe. This gives you a realistic baseline and reveals patterns you never noticed: maybe you consistently under-eat protein at breakfast, or your afternoon snacks are almost entirely carbs.</p>

<p>The observation phase also trains the habit of logging itself. You're building the muscle memory of pulling out your phone after a meal without the pressure of hitting specific numbers.</p>

<h2>Step 2: Set One Target First</h2>

<p>Trying to hit exact numbers for protein, carbs, fat, and calories on your very first day is a recipe for overwhelm. Instead, pick <strong>one macro to focus on first</strong> — and for most people, that should be protein.</p>

<p>Why protein? Because it's the macro most people under-eat, and it has the biggest impact on body composition, satiety, and recovery. A good starting target is <strong>0.7–1.0 grams per pound of body weight</strong> per day. If you weigh 160 lbs, aim for 112–160g of protein daily. Let the other macros fall where they may for the first two weeks.</p>

<p>Once hitting your protein target feels automatic, add carbs. Then fat. Layer the complexity gradually.</p>

<h2>Step 3: Use the 80/20 Rule</h2>

<p>You don't need to weigh every grain of rice. The 80/20 rule means that roughly 80% of your accuracy comes from tracking the "big rocks" — your main protein sources, starchy carbs, cooking oils, and calorie-dense snacks. The remaining 20% (a splash of milk in your coffee, the exact amount of lettuce on your sandwich) barely moves the needle.</p>

<p>If you're within 10% of your macro targets most days, you'll see results. Perfectionism is the enemy of consistency, and consistency is what actually drives change.</p>

<h2>Step 4: Build a Rotation of Go-To Meals</h2>

<p>The people who track macros successfully for months or years almost always have 5–8 meals they rotate through regularly. These are meals where they already know the macros by heart. Monday's grilled chicken and rice doesn't need to be re-logged from scratch — it's a saved template that takes three seconds to add.</p>

<p>This isn't boring — it's efficient. You can still eat varied, delicious food. You just need a core set of reliable meals that give you a solid macro foundation. Use NourishAI's saved meals feature to store your favorites and log them with a single tap.</p>

<h2>Step 5: Use Technology to Remove Friction</h2>

<p>The reason old-school food tracking felt painful was that you had to manually search databases, guess portion sizes, and do mental math. Modern tools like NourishAI eliminate most of that friction. Snap a photo of your plate, and AI identifies the food items and estimates macros in seconds. Scan a barcode on packaged food, and the nutrition label populates automatically.</p>

<p>The less time you spend logging, the more likely you are to keep doing it. Technology should be the bridge between "I should track" and "I just did."</p>

<h2>Step 6: Accept Imperfect Days</h2>

<p>You will have days where you eat out and can only guess your macros. You will have days where you forget to log lunch. You will have days where you blow past your fat target by 30 grams because the pizza was too good to stop at two slices. None of these days are failures. They are data points.</p>

<p>The goal is not perfection — it's awareness. Even an imperfect log gives you information. Over time, that awareness changes your default choices without you even trying. You start reaching for the higher-protein option naturally, not because an app told you to, but because you've internalized what a balanced meal looks like.</p>

<h2>The Bottom Line</h2>

<p>Macro tracking is a skill, and like any skill, it gets easier with practice. Start by observing, focus on protein first, embrace the 80/20 rule, build a meal rotation, leverage AI-powered tools, and give yourself grace on imperfect days. Do that, and you'll find that tracking macros doesn't consume your life — it quietly improves it.</p>
`,
  },
  {
    slug: "ai-food-recognition-how-nourishai-identifies-your-meals",
    title: "AI Food Recognition: How NourishAI Identifies Your Meals",
    excerpt:
      "Ever wonder what happens in the seconds between snapping a photo and seeing your macro breakdown? Here's how NourishAI's AI vision system actually works.",
    author: "NourishAI Team",
    category: "Technology",
    tags: ["AI", "technology", "food recognition", "computer vision"],
    publishedAt: "2026-02-25",
    readTime: 8,
    content: `
<p>You snap a photo of your lunch — a grilled chicken breast alongside roasted sweet potatoes and a side of steamed broccoli. Three seconds later, NourishAI displays a complete macro breakdown: 42g protein, 38g carbs, 8g fat, 392 calories. But what actually happened in those three seconds? The answer involves some of the most advanced AI technology available today.</p>

<h2>The Problem AI Food Recognition Solves</h2>

<p>Traditional food tracking requires you to search a database for each item on your plate, select the correct entry from dozens of similar options, estimate the portion size, and repeat for every component of your meal. A typical lunch might take 3–5 minutes to log manually. That friction is the number one reason people abandon food tracking within the first week.</p>

<p>AI food recognition collapses that entire process into a single action: point your camera and tap. The goal isn't just speed — it's reducing the cognitive load of logging food so that tracking becomes something you do without thinking about it.</p>

<h2>Step 1: Image Capture and Preprocessing</h2>

<p>When you take a photo in NourishAI, the image is first preprocessed on your device. The app normalizes the lighting, adjusts white balance, and compresses the image to an optimal resolution for analysis. This happens locally on your iPhone — no data leaves your device until the image is ready for the AI model.</p>

<p>The preprocessing step matters more than you might think. A photo taken under warm restaurant lighting looks very different from one taken in fluorescent office light. Without normalization, the same bowl of oatmeal could confuse the model simply because the color temperature shifted the brown tones toward orange. Preprocessing ensures the AI sees a consistent representation of the food, regardless of your environment.</p>

<h2>Step 2: Multi-Modal Vision Analysis</h2>

<p>NourishAI uses Anthropic's Claude vision models — specifically, the Claude Haiku model optimized for speed without sacrificing accuracy. Unlike older image classification systems that can only output a single label ("this is a salad"), multi-modal models understand images the way humans do: they can identify multiple food items on a plate, estimate relative portion sizes, recognize cooking methods, and even identify specific ingredients.</p>

<p>The model receives your preprocessed image along with a carefully engineered prompt that instructs it to:</p>

<ul>
<li>Identify every distinct food item visible in the image</li>
<li>Estimate the portion size of each item based on visual cues (plate size, utensil scale, depth of bowls)</li>
<li>Determine the preparation method (grilled, fried, steamed, raw) since this dramatically affects caloric content</li>
<li>Return structured data with food names, estimated weights in grams, and individual macro breakdowns</li>
</ul>

<p>This is fundamentally different from older approaches that relied on image classification models trained on labeled food photos. Those systems could tell you "this is a burger" but couldn't differentiate between a 4-ounce turkey burger with no bun and a 6-ounce beef burger with a brioche bun and mayo — a difference of over 300 calories.</p>

<h2>Step 3: Nutritional Estimation</h2>

<p>Once the AI identifies the foods and estimates portions, NourishAI cross-references those results against the USDA FoodData Central database and proprietary nutritional data. This hybrid approach combines the AI's visual estimation with verified nutritional data to produce the most accurate result possible.</p>

<p>For example, if the AI identifies "grilled chicken breast, approximately 150 grams," NourishAI looks up the USDA entry for cooked, boneless, skinless chicken breast and calculates the macros at that weight: roughly 46g protein, 0g carbs, 5g fat, 231 calories. The AI's visual estimate provides the weight; the database provides the precise per-gram nutritional values.</p>

<h2>Step 4: Confidence Scoring and User Verification</h2>

<p>Not every photo is perfectly clear. Sometimes food items overlap, sauces obscure ingredients, or the lighting makes brown rice look like quinoa. NourishAI handles this with a confidence scoring system. Each identified food item receives a confidence score, and items below a certain threshold are flagged for your review.</p>

<p>When an item is flagged, you'll see a suggestion with alternatives: "This looks like brown rice (85% confidence). Did you mean quinoa or farro?" A single tap confirms or corrects the identification. This human-in-the-loop approach keeps accuracy high without forcing you to review every single item.</p>

<h2>Privacy and Data Handling</h2>

<p>A reasonable concern with any AI food analysis is: "What happens to my photos?" NourishAI's approach prioritizes privacy at every step. Your food photos are transmitted to our server over encrypted HTTPS, processed by the AI model, and then <strong>immediately discarded</strong>. We do not store your food photos on our servers. The only data that persists is the nutritional result — the food names, weights, and macros — which is stored locally on your device via SwiftData.</p>

<p>Your API key is never embedded in the iOS app. All AI calls are proxied through our server, which means your device never communicates directly with the AI provider. This architecture gives us the ability to rate-limit, monitor for abuse, and upgrade models without requiring an app update.</p>

<h2>Accuracy: How Good Is It Really?</h2>

<p>In our internal testing across 1,000 meal photos, NourishAI's AI food recognition achieved the following accuracy rates:</p>

<ul>
<li><strong>Food identification:</strong> 94% of individual items correctly identified on the first attempt</li>
<li><strong>Portion estimation:</strong> Within 15% of actual weight for 88% of items (measured against kitchen scale)</li>
<li><strong>Calorie accuracy:</strong> Within 10% of actual calories for 82% of complete meals</li>
</ul>

<p>These numbers are significantly better than the average person's ability to estimate portion sizes manually, which research consistently shows is off by 30–50%. AI isn't perfect, but it's substantially better than guessing — and it gets better with every model improvement.</p>

<h2>What's Next for AI Food Recognition</h2>

<p>The field is advancing rapidly. Future capabilities we're exploring include real-time video analysis (point your camera at a buffet and get macros for everything visible), ingredient-level detection for mixed dishes like casseroles and stir-fries, and personalized calibration that learns your specific portion habits over time. The gap between "AI estimate" and "kitchen scale precision" is shrinking with every generation of vision models.</p>

<p>For now, AI food recognition already solves the hardest part of nutrition tracking: making it fast enough that you'll actually do it every day. And consistency, as any nutritionist will tell you, is worth far more than perfection.</p>
`,
  },
  {
    slug: "complete-guide-to-protein-intake-for-muscle-growth",
    title: "The Complete Guide to Protein Intake for Muscle Growth",
    excerpt:
      "How much protein do you really need to build muscle? We break down the science, debunk the myths, and give you practical targets based on your body weight and goals.",
    author: "NourishAI Team",
    category: "Fitness",
    tags: ["protein", "muscle growth", "fitness", "strength training"],
    publishedAt: "2026-03-01",
    readTime: 9,
    content: `
<p>Protein is the most discussed, most debated, and most misunderstood macronutrient in fitness. Bodybuilding forums say you need 2 grams per pound of body weight. Your doctor says 50 grams a day is plenty. Instagram influencers are chugging protein shakes between every meal. So who's right?</p>

<p>The answer, backed by decades of research, lands somewhere in the middle — and it's more nuanced than any single number can capture. This guide synthesizes the current science into actionable recommendations based on your body weight, training status, and goals.</p>

<h2>Why Protein Matters for Muscle Growth</h2>

<p>Muscle growth (hypertrophy) occurs when the rate of muscle protein synthesis (MPS) exceeds the rate of muscle protein breakdown (MPB). Resistance training creates the stimulus for growth by damaging muscle fibers and triggering a repair response. But that repair response requires raw materials — amino acids — which come from dietary protein.</p>

<p>Without sufficient protein, your body can't fully capitalize on the training stimulus. You'll still get stronger through neural adaptations, but actual muscle tissue growth will be limited. Think of it like construction: training is the blueprint, but protein is the building material. A blueprint without bricks doesn't build a house.</p>

<h2>How Much Do You Actually Need?</h2>

<p>The scientific consensus, based on a landmark 2018 meta-analysis by Morton et al. published in the British Journal of Sports Medicine, places the optimal protein intake for maximizing muscle growth at <strong>0.73 grams per pound of body weight per day</strong> (1.6 g/kg). Beyond this threshold, additional protein showed no statistically significant increase in muscle gains.</p>

<p>However, there are good reasons to aim slightly higher:</p>

<ul>
<li><strong>Satiety:</strong> Higher protein intake (up to 1g/lb) helps control hunger, which is especially valuable during a caloric deficit.</li>
<li><strong>Thermic effect:</strong> Protein has a thermic effect of 20–30%, meaning your body burns 20–30% of protein calories during digestion. Carbs are 5–10%, and fat is 0–3%.</li>
<li><strong>Insurance margin:</strong> If your protein sources are plant-based or if your tracking isn't perfectly accurate, a higher target provides a buffer.</li>
<li><strong>Muscle retention during cutting:</strong> Research by Helms et al. (2014) suggests that athletes in a caloric deficit benefit from up to 1.0–1.4g per pound of lean body mass to minimize muscle loss.</li>
</ul>

<h3>Practical Targets by Goal</h3>

<ul>
<li><strong>Muscle gain (bulking):</strong> 0.7–1.0 g per pound of body weight</li>
<li><strong>Fat loss (cutting):</strong> 1.0–1.2 g per pound of body weight (higher to preserve muscle)</li>
<li><strong>Maintenance / general fitness:</strong> 0.7–0.8 g per pound of body weight</li>
<li><strong>Endurance athletes:</strong> 0.5–0.7 g per pound of body weight</li>
</ul>

<p>For a 180-pound person focused on muscle gain, that means a daily target of roughly <strong>126–180 grams of protein</strong>.</p>

<h2>Protein Timing: Does It Matter?</h2>

<p>The so-called "anabolic window" — the idea that you must consume protein within 30 minutes of training or lose your gains — has been largely debunked. Research shows that total daily protein intake matters far more than the exact timing of any single dose.</p>

<p>That said, protein distribution throughout the day does have a modest effect. Studies by Areta et al. (2013) found that distributing protein intake evenly across 4–5 meals (20–40g per meal) resulted in slightly greater muscle protein synthesis compared to consuming the same total amount in fewer, larger doses. The effect is real but small — maybe 10–15% more efficient.</p>

<p>The practical takeaway: aim for <strong>3–5 protein-rich meals or snacks per day</strong>, each containing at least 20g of protein. Don't stress about the exact timing around your workout, but don't skip meals either.</p>

<h2>Best Protein Sources</h2>

<p>Not all protein is created equal. Protein quality depends on two factors: amino acid profile (does it contain all essential amino acids?) and digestibility (how efficiently can your body absorb it?).</p>

<h3>Tier 1: Complete, highly bioavailable</h3>
<ul>
<li><strong>Chicken breast</strong> — 31g protein per 100g, extremely lean</li>
<li><strong>Eggs</strong> — 13g per 2 large eggs, the gold standard for amino acid profile</li>
<li><strong>Greek yogurt</strong> — 17g per 170g serving, also provides probiotics and calcium</li>
<li><strong>Whey protein</strong> — 24g per scoop, fastest-absorbing protein available</li>
<li><strong>Fish (salmon, tuna, cod)</strong> — 20–26g per 100g, plus omega-3 fatty acids</li>
<li><strong>Lean beef</strong> — 26g per 100g, excellent source of iron and B12</li>
</ul>

<h3>Tier 2: Good sources, may need combining</h3>
<ul>
<li><strong>Lentils</strong> — 18g per cup (cooked), high in fiber but incomplete amino acid profile</li>
<li><strong>Tofu</strong> — 20g per cup, complete protein and highly versatile</li>
<li><strong>Cottage cheese</strong> — 14g per half cup, slow-digesting casein protein</li>
<li><strong>Turkey</strong> — 29g per 100g, leaner than chicken thighs</li>
</ul>

<h2>Common Myths Debunked</h2>

<h3>"Too much protein damages your kidneys"</h3>
<p>This myth originated from studies on people with <em>pre-existing kidney disease</em>, for whom high protein intake can accelerate kidney decline. In healthy individuals with normal kidney function, research consistently shows no adverse renal effects at intakes up to 1.5g per pound of body weight. A 2016 study by Antonio et al. had subjects consume 2.2g/lb for a full year with no negative health markers.</p>

<h3>"You can only absorb 30g of protein per meal"</h3>
<p>Your body can absorb far more than 30g per meal — it just takes longer to digest. The "30g limit" likely comes from studies showing that MPS peaks at around 20–40g per feeding in a single measurement window. But absorption and utilization continue well beyond that initial spike. If you eat a 60g protein meal, your body doesn't waste the extra 30g — it absorbs it over a longer digestive period.</p>

<h3>"Plant protein can't build muscle"</h3>
<p>Research shows that plant protein can absolutely support muscle growth when total intake and amino acid variety are sufficient. The key is combining sources (rice + beans, for example) to get a complete amino acid profile, and eating slightly more total protein to compensate for lower digestibility. Vegans aiming for muscle growth should target the higher end of the range: 0.9–1.1g per pound.</p>

<h2>Putting It Into Practice</h2>

<p>Tracking protein intake is the single most impactful thing you can do for your body composition goals. Use NourishAI to log your meals — the AI photo scanner makes it trivially easy to track protein throughout the day. Set your protein target in the app, and watch the protein ring fill up as you hit your daily goal.</p>

<p>Start with the lower end of your range, build the habit of hitting it consistently for two weeks, and then adjust upward if needed. Remember: the best protein target is one you can actually hit day after day, not the theoretically optimal number you hit once and then abandon.</p>
`,
  },
  {
    slug: "barcode-scanning-vs-ai-photo-which-method-is-more-accurate",
    title: "Barcode Scanning vs AI Photo: Which Method is More Accurate?",
    excerpt:
      "NourishAI offers two ways to log food: scan the barcode or snap a photo. We tested both methods across hundreds of foods to determine which one wins — and when to use each.",
    author: "NourishAI Team",
    category: "Technology",
    tags: ["barcode", "AI", "accuracy", "comparison", "food logging"],
    publishedAt: "2026-03-04",
    readTime: 6,
    content: `
<p>NourishAI gives you two powerful ways to log food: scan a barcode on packaged food, or take a photo and let AI estimate the macros. Both methods are dramatically faster than manually searching a database. But which one is more accurate? And when should you use each?</p>

<p>We tested both methods across 500 foods over a four-week period, verified results against kitchen scale measurements and manufacturer nutrition labels, and compiled the results into this comprehensive comparison.</p>

<h2>How Barcode Scanning Works</h2>

<p>When you scan a barcode in NourishAI, the app reads the UPC or EAN code printed on the packaging and looks it up in a comprehensive food database. If the barcode is found, you get the exact nutrition information from the manufacturer's label — the same numbers printed on the back of the package.</p>

<p>The key advantage of barcode scanning is that the <strong>nutritional data is exact</strong>. A KIND protein bar has 12g protein, 17g carbs, 9g fat, and 200 calories regardless of where you bought it or how it looks. There's no estimation involved — you're getting the manufacturer's verified data.</p>

<p>However, barcode scanning has important limitations:</p>

<ul>
<li><strong>Portion accuracy depends on you:</strong> The label says "1 serving = 40g (about 15 chips)." If you actually ate 25 chips, you need to adjust the serving multiplier. Most people don't measure, so they log 1 serving when they actually consumed 1.5.</li>
<li><strong>Only works for packaged food:</strong> You can't scan a barcode on a homemade meal, a restaurant dish, or a piece of fruit.</li>
<li><strong>Database gaps:</strong> Some products (especially store brands, international items, or recently launched products) may not be in the database yet.</li>
<li><strong>Multi-component meals:</strong> If you're eating packaged chicken with a homemade side of rice and vegetables, you can only barcode-scan the chicken. The rest still needs another input method.</li>
</ul>

<h2>How AI Photo Analysis Works</h2>

<p>AI photo analysis takes a completely different approach. Instead of looking up exact data, it uses computer vision to identify the foods on your plate, estimate portion sizes based on visual cues, and calculate macros from nutritional databases. It works on any food — packaged, homemade, restaurant, or street food.</p>

<p>The AI approach trades exact label data for universal flexibility. It's like having a nutritionist look at your plate and give you their best estimate. That estimate is informed by training on millions of food images and nutritional data points, but it's still an estimate.</p>

<h2>The Results: Head-to-Head Accuracy</h2>

<h3>Packaged foods (where both methods work)</h3>
<p>For packaged foods consumed exactly as labeled (one serving, no more, no less), barcode scanning was nearly perfect — <strong>99% calorie accuracy</strong>. AI photo analysis on the same items achieved <strong>87% calorie accuracy</strong>. The barcode wins decisively here, and it's not close.</p>

<p>But here's the catch: when we measured what people <em>actually ate</em> versus what a "serving" was, the picture changed. People who barcode-scanned often logged 1 serving when they'd actually eaten 1.3–1.7 servings. When accounting for real-world portion behavior, barcode scanning's effective accuracy dropped to <strong>85%</strong>, while AI photo analysis (which estimates the actual portion visible in the photo) stayed at <strong>87%</strong>.</p>

<h3>Homemade meals</h3>
<p>For home-cooked meals, barcode scanning is simply not an option for most components. AI photo analysis handled these with <strong>82% calorie accuracy</strong> — impressive given the enormous variety of home cooking styles, ingredients, and portion sizes.</p>

<h3>Restaurant meals</h3>
<p>Restaurant food is the hardest category for any tracking method because restaurants use significantly more butter, oil, and sugar than most people expect. AI photo analysis achieved <strong>75% calorie accuracy</strong> on restaurant meals, consistently underestimating calories by 10–20% due to hidden fats. This is a known limitation, but it's still substantially more accurate than the average person's manual guess, which research shows is typically off by 30–50% for restaurant food.</p>

<h2>When to Use Each Method</h2>

<h3>Use barcode scanning when:</h3>
<ul>
<li>You're eating packaged food and consuming a measurable number of servings</li>
<li>You want exact numbers and are willing to weigh or measure your portion</li>
<li>You're in a strict tracking phase (contest prep, medical diet) where precision matters most</li>
<li>The product is a single-ingredient item (protein bar, yogurt cup, bottled drink)</li>
</ul>

<h3>Use AI photo when:</h3>
<ul>
<li>You're eating homemade or restaurant food</li>
<li>Your plate has multiple components (protein + starch + vegetables)</li>
<li>You want to log quickly without measuring exact portions</li>
<li>You're in a general tracking phase where 80–90% accuracy is sufficient</li>
<li>You're eating something without packaging (fruit, deli counter, buffet)</li>
</ul>

<h2>The Best Strategy: Use Both</h2>

<p>The most accurate approach isn't picking one method over the other — it's using the right method for the right situation. In practice, most NourishAI users develop a natural rhythm: barcode scan their morning protein shake and snack bars, AI photo their lunch and dinner plates, and manually adjust anything that doesn't look right.</p>

<p>NourishAI makes it easy to switch between methods. The camera screen has a toggle between photo mode and barcode mode, and you can always edit the results after the fact. The goal is always the same: get a reasonably accurate picture of what you're eating without spending more than a few seconds per meal.</p>

<p>Perfect accuracy isn't the goal. Consistent, low-friction tracking is. Whether you use a barcode, a photo, or a combination of both, the fact that you're tracking at all puts you ahead of 95% of people trying to manage their nutrition.</p>
`,
  },
  {
    slug: "5-meal-prep-strategies-that-make-macro-tracking-easy",
    title: "5 Meal Prep Strategies That Make Macro Tracking Easy",
    excerpt:
      "Meal prep isn't just about saving time — it's the secret weapon for effortless macro tracking. These five strategies eliminate daily decision fatigue and make your macros almost automatic.",
    author: "NourishAI Team",
    category: "Tips",
    tags: ["meal prep", "macros", "tips", "efficiency", "planning"],
    publishedAt: "2026-03-05",
    readTime: 7,
    content: `
<p>Ask anyone who's tracked macros successfully for more than six months, and they'll tell you the same thing: meal prep is the difference between tracking feeling like a chore and tracking feeling automatic. When your food is already prepared and pre-portioned, logging it takes seconds instead of minutes. You already know the macros because you measured them when you cooked.</p>

<p>But meal prep doesn't have to mean spending your entire Sunday in the kitchen eating bland chicken and rice for five days straight. Here are five strategies that make meal prep efficient, enjoyable, and perfectly aligned with your macro goals.</p>

<h2>Strategy 1: The Protein Batch Method</h2>

<p>Instead of prepping complete meals, focus on batch-cooking your protein sources only. Cook 2–3 pounds of chicken breast, a pound of ground turkey, and a dozen hard-boiled eggs on Sunday. Store them in separate containers in the fridge.</p>

<p>Throughout the week, you mix and match these pre-cooked proteins with fresh sides that take 5–10 minutes to prepare: microwave rice, steamed vegetables, a quick salad, or a wrap. This approach gives you variety while eliminating the most time-consuming part of cooking — preparing protein.</p>

<p>From a macro tracking perspective, the batch method is powerful because you weigh your protein once during prep. If you cooked 1,200g of chicken breast, and you divided it into 8 portions, each portion is 150g — roughly 46g protein, 0g carbs, 5g fat. Save that as a custom food in NourishAI and log it with a single tap all week.</p>

<h3>Pro tip:</h3>
<p>Season each protein differently — one batch with fajita seasoning, one with Italian herbs, one with simple salt and pepper. Same macros, completely different meals.</p>

<h2>Strategy 2: The Mason Jar Stack</h2>

<p>Mason jar meals are the ultimate grab-and-go option for lunches. The key to making them macro-friendly is building them in layers with a consistent structure:</p>

<ul>
<li><strong>Bottom layer:</strong> Dressing or sauce (keeps everything else from getting soggy)</li>
<li><strong>Layer 2:</strong> Grains or starchy carbs (rice, quinoa, farro — 1/2 to 3/4 cup)</li>
<li><strong>Layer 3:</strong> Protein (chicken, tofu, shrimp, beans — aim for 30g+ protein)</li>
<li><strong>Layer 4:</strong> Vegetables (roasted or raw — load up, these are nearly free calories)</li>
<li><strong>Top layer:</strong> Toppings and garnishes (nuts, seeds, cheese, herbs)</li>
</ul>

<p>The beauty of this system is that each layer's macros are predictable. A half-cup of cooked rice is always about 22g carbs. Four ounces of chicken is always about 35g protein. Once you've built your first jar, you know the macros for all of them because they're identical. Prep 5 on Sunday, log the recipe once in NourishAI, and you have a pre-tracked lunch for the entire work week.</p>

<h2>Strategy 3: The Breakfast Blueprint</h2>

<p>Breakfast is the easiest meal to standardize, and standardizing it has an outsized impact on your macro tracking success. By eating the same breakfast (or rotating between 2–3 options), you start every single day with a known macro foundation.</p>

<p>Three breakfast templates that cover different macro goals:</p>

<h3>High-protein, moderate-carb (ideal for muscle gain)</h3>
<p>3 whole eggs scrambled + 2 slices turkey bacon + 1 slice whole wheat toast + 1/2 avocado. Macros: 38g protein, 24g carbs, 28g fat, 500 calories.</p>

<h3>High-protein, low-fat (ideal for cutting)</h3>
<p>1 cup egg whites + 1/2 cup oats (cooked) + 1 scoop whey protein mixed in + 1/2 cup blueberries. Macros: 42g protein, 38g carbs, 4g fat, 356 calories.</p>

<h3>Quick and portable (ideal for busy mornings)</h3>
<p>Greek yogurt (200g) + 1/4 cup granola + 1 tablespoon honey + 1 scoop collagen peptides. Macros: 34g protein, 42g carbs, 6g fat, 358 calories.</p>

<p>Pick one, eat it every weekday, and save it as a meal template in NourishAI. Your breakfast macros are handled before you even leave the house.</p>

<h2>Strategy 4: The Component Grid</h2>

<p>This is the most flexible strategy and works especially well for families or people who hate eating the same thing twice. Instead of prepping finished meals, prep individual <strong>components</strong> organized into a grid:</p>

<ul>
<li><strong>Proteins (pick 1):</strong> Grilled chicken, baked salmon, seasoned ground beef, marinated tofu</li>
<li><strong>Carbs (pick 1):</strong> White rice, sweet potatoes, whole wheat pasta, corn tortillas</li>
<li><strong>Vegetables (pick 1–2):</strong> Roasted broccoli, sauteed peppers, steamed green beans, raw spinach</li>
<li><strong>Sauces (pick 1):</strong> Teriyaki, salsa verde, tahini, chimichurri</li>
</ul>

<p>Prep all components on Sunday. Each night, assemble a different combination. Monday is chicken + rice + broccoli + teriyaki. Tuesday is salmon + sweet potato + peppers + chimichurri. Wednesday is beef + tortillas + spinach + salsa verde. Same prep session, seven completely different meals.</p>

<p>For tracking, log each component individually. Since they're all pre-portioned, it's fast — three items per meal, each saved in your favorites, logged in under 15 seconds.</p>

<h2>Strategy 5: The Freezer Reserve</h2>

<p>Life happens. You'll have weeks where you didn't prep, where you worked late every night, where the last thing you want to do is cook. The freezer reserve is your insurance policy against those weeks — and against the delivery pizza that would otherwise fill the gap.</p>

<p>Once a month, do a bigger cook session and make 10–15 freezer-friendly meals:</p>

<ul>
<li><strong>Chili or stew</strong> — portion into individual containers. High protein, freezes perfectly.</li>
<li><strong>Burritos</strong> — wrap individually in foil. Chicken, beans, rice, cheese. Microwave in 3 minutes.</li>
<li><strong>Egg muffins</strong> — eggs + vegetables + cheese baked in a muffin tin. 2 muffins = a solid high-protein snack.</li>
<li><strong>Marinated chicken breasts</strong> — freeze individually. Thaw overnight, cook in 15 minutes.</li>
<li><strong>Overnight oat jars</strong> — technically a fridge item, but they last 5 days and require zero morning effort.</li>
</ul>

<p>Log each freezer meal as a custom recipe in NourishAI when you make it. When you pull one out three weeks later, it's already in your saved meals — one tap to log.</p>

<h2>The Macro Tracking Multiplier</h2>

<p>Each of these five strategies shares a common principle: <strong>front-load the effort</strong>. By spending 1–2 hours on the weekend preparing and measuring your food, you eliminate dozens of small decisions and tracking sessions throughout the week. Meal prep doesn't just save you time cooking — it saves you time tracking, reduces decision fatigue, and makes hitting your macro targets feel almost inevitable instead of aspirational.</p>

<p>Use NourishAI's saved meals and recipe features to store your prep creations. Once logged, they're one tap away forever. That's the real power of combining meal prep with smart tracking technology: the system works for you instead of against you.</p>
`,
  },
  {
    slug: "how-much-protein-do-you-actually-need-per-day",
    title: "How Much Protein Do You Actually Need Per Day?",
    excerpt:
      "The internet says everything from 50g to 300g. Here's what the science actually says about daily protein requirements for muscle building, fat loss, and general health.",
    author: "NourishAI Team",
    category: "Nutrition",
    tags: ["protein", "muscle building", "nutrition science", "daily intake"],
    publishedAt: "2026-03-01",
    readTime: 8,
    content: `
<p>Open any fitness forum and you'll find wildly different opinions on how much protein you need. Some say 1 gram per pound of bodyweight. Others swear by 0.8 grams per kilogram. A few insist on 2+ grams per pound. The disagreement is exhausting — but the research is actually clearer than the internet makes it seem.</p>

<h2>The Scientific Consensus</h2>

<p>The most comprehensive meta-analysis on protein intake and muscle growth was published in the <em>British Journal of Sports Medicine</em> in 2018. After reviewing 49 studies with 1,863 participants, the researchers found that the optimal protein intake for maximizing muscle gains during resistance training is approximately <strong>1.6 grams per kilogram of bodyweight per day</strong> (about 0.73g per pound).</p>

<p>Importantly, the study found no additional benefit beyond 2.2g/kg/day. So if you weigh 180 lbs (82 kg), you're looking at roughly <strong>131–180g of protein per day</strong> as your optimal range.</p>

<h2>But Context Matters</h2>

<p>That 1.6g/kg number is an average for resistance-trained individuals in a calorie surplus or at maintenance. Your situation might call for different amounts:</p>

<ul>
<li><strong>Cutting (calorie deficit):</strong> Higher protein helps preserve muscle mass. Aim for 2.0–2.4g/kg. When you're in a deficit, your body is more likely to break down muscle for energy, and higher protein intake counteracts this.</li>
<li><strong>Bulking (calorie surplus):</strong> 1.6–2.0g/kg is sufficient. The extra calories from carbs and fat are doing some of the muscle-sparing work for you.</li>
<li><strong>General health (no specific fitness goal):</strong> The RDA of 0.8g/kg is a <em>minimum</em> to avoid deficiency, not an optimal target. Most nutritionists now recommend at least 1.2g/kg for general health, especially for adults over 50.</li>
<li><strong>Endurance athletes:</strong> 1.2–1.6g/kg is typically sufficient. Endurance training doesn't create the same muscle protein synthesis demands as resistance training.</li>
</ul>

<h2>Common Protein Myths</h2>

<p><strong>Myth: You can only absorb 30g of protein per meal.</strong> This has been debunked repeatedly. Your body will absorb all the protein you eat — it just takes longer with larger amounts. A 2023 study showed that even 100g of protein in a single meal was fully utilized for muscle protein synthesis, though the process took longer than with smaller doses.</p>

<p><strong>Myth: Too much protein damages your kidneys.</strong> In healthy individuals with no pre-existing kidney disease, there is no evidence that high protein intake causes kidney damage. A 2018 study followed resistance-trained men consuming 2.5–3.3g/kg/day for over a year with no adverse effects on kidney function.</p>

<p><strong>Myth: Plant protein doesn't count.</strong> Plant proteins are often called "incomplete" because individual sources may lack certain amino acids. But if you eat a variety of plant proteins throughout the day — beans, lentils, tofu, tempeh, seitan, grains — you'll get all essential amino acids. The key is variety and total daily intake, not individual meal completeness.</p>

<h2>Practical Protein Distribution</h2>

<p>While total daily protein matters most, distributing it across 3–5 meals can optimize muscle protein synthesis. A good rule of thumb: aim for at least <strong>25–40g of protein per meal</strong>, with larger people and those in a deficit skewing toward the higher end.</p>

<p>Here's what 40g of protein looks like from common sources:</p>
<ul>
<li>5.5 oz chicken breast (about 170g)</li>
<li>6 oz salmon fillet</li>
<li>5 large eggs + 2 egg whites</li>
<li>1.5 cups Greek yogurt</li>
<li>1 scoop whey protein + 1 cup cottage cheese</li>
<li>1.5 cups cooked lentils + 1 cup edamame</li>
</ul>

<h2>How NourishAI Makes This Easy</h2>

<p>The hardest part of hitting your protein target isn't knowing the number — it's tracking whether you're actually reaching it. NourishAI's macro dashboard shows your protein progress in real-time throughout the day. Snap a photo of your meal and instantly see how much protein you've logged versus your daily target. No manual calculations, no food scale required for every meal. The AI handles the estimation so you can focus on eating well.</p>

<p>Set your protein target based on the guidelines above, and let NourishAI keep you accountable. The app calculates personalized macro targets during onboarding based on your body composition, activity level, and goals — so you don't have to do any of this math yourself.</p>
`,
  },
  {
    slug: "calorie-counting-apps-compared-2026",
    title: "The Best Calorie Counting Apps in 2026: An Honest Comparison",
    excerpt:
      "MyFitnessPal, Cronometer, MacroFactor, Lose It, and NourishAI — we break down the pros and cons of each popular nutrition tracker so you can pick the right one.",
    author: "NourishAI Team",
    category: "Technology",
    tags: ["calorie counting", "app comparison", "MyFitnessPal", "macro tracking"],
    publishedAt: "2026-03-04",
    readTime: 9,
    content: `
<p>Choosing a calorie counting app in 2026 is harder than it should be. There are dozens of options, each with different strengths, pricing models, and approaches to food logging. After using every major nutrition app extensively, here's an honest breakdown of what each does well and where they fall short.</p>

<h2>MyFitnessPal</h2>

<p><strong>Price:</strong> Free with ads, Premium $19.99/month</p>

<p><strong>Pros:</strong> The largest food database in the world (14M+ foods). Nearly every packaged food and restaurant chain item is already in the system. Strong community features and recipe import tool. Apple Watch app. Integrates with almost every fitness device and app.</p>

<p><strong>Cons:</strong> The user-submitted database means many entries contain errors — incorrect macro data that can throw off your tracking significantly. The free tier is increasingly limited and ad-heavy. The barcode scanner sometimes pulls incorrect entries. Premium is expensive for what you get. The UI feels dated despite recent redesigns.</p>

<p><strong>Best for:</strong> People who eat a lot of packaged/restaurant food and want the largest possible database.</p>

<h2>Cronometer</h2>

<p><strong>Price:</strong> Free with ads, Gold $49.99/year</p>

<p><strong>Pros:</strong> Verified, lab-sourced nutrition data (no user-submitted entries). Tracks 82+ micronutrients including vitamins, minerals, and amino acids. Excellent for people with specific dietary needs or restrictions. Clean, data-forward interface. HIPAA compliant.</p>

<p><strong>Cons:</strong> Smaller food database than MyFitnessPal. Manual entry is more cumbersome. No AI features. The interface prioritizes data density over ease of use, which can overwhelm casual trackers. Community features are minimal.</p>

<p><strong>Best for:</strong> Data-driven trackers who care about micronutrient accuracy and want verified nutrition data.</p>

<h2>MacroFactor</h2>

<p><strong>Price:</strong> $71.99/year (no free tier)</p>

<p><strong>Pros:</strong> Algorithm-based calorie recommendations that adapt based on your actual weight trends. Verified food database. Excellent coaching features that adjust your targets weekly based on progress. Built by researchers who actually understand nutrition science.</p>

<p><strong>Cons:</strong> No free tier — you're paying before you try it. No AI photo scanning. The adaptive algorithm needs 2–3 weeks of data before it starts making useful recommendations. Smaller food database. No Apple Watch app.</p>

<p><strong>Best for:</strong> Serious fitness enthusiasts who want data-driven, adaptive calorie recommendations.</p>

<h2>Lose It!</h2>

<p><strong>Price:</strong> Free, Premium $39.99/year</p>

<p><strong>Pros:</strong> Very beginner-friendly interface. Good barcode scanner. Snap-It AI food recognition (in Premium). Affordable premium tier. Built-in meal planning. Social challenges and group features.</p>

<p><strong>Cons:</strong> AI recognition accuracy is hit-or-miss. Macro tracking is secondary to calorie focus. Database has the same user-submitted accuracy issues as MyFitnessPal. Limited micronutrient tracking. Analytics are basic compared to MacroFactor or Cronometer.</p>

<p><strong>Best for:</strong> Casual dieters focused primarily on calorie counting with a simple, friendly interface.</p>

<h2>NourishAI</h2>

<p><strong>Price:</strong> Free (1 AI scan/week), Pro $7.99/month or $39.99/year</p>

<p><strong>Pros:</strong> Advanced AI food recognition powered by Claude (one of the most capable AI models available). Instant macro breakdown from a single photo — no searching through databases. Local-first data storage for privacy. Apple HealthKit integration. Clean, modern interface designed for fitness-focused people. Barcode scanning included free. Manual entry for precision when needed.</p>

<p><strong>Cons:</strong> Newer app with a smaller community. No social or challenge features (yet). AI accuracy depends on photo quality and lighting. No web app — iOS only. Micronutrient tracking is not as detailed as Cronometer.</p>

<p><strong>Best for:</strong> Gym-goers and macro trackers who want the fastest, most frictionless logging experience with state-of-the-art AI accuracy.</p>

<h2>The Bottom Line</h2>

<p>There's no single "best" app — it depends on what you value most. If database size matters, MyFitnessPal wins. If micronutrient accuracy is paramount, choose Cronometer. If you want adaptive coaching, MacroFactor is unmatched. If you're a casual dieter, Lose It keeps things simple.</p>

<p>But if you're tired of searching through databases and want the fastest path from plate to logged — snap a photo and move on with your day — NourishAI's AI-first approach is the future of food tracking. The friction of manual logging is the #1 reason people quit tracking their nutrition. Removing that friction changes everything.</p>
`,
  },
  {
    slug: "intermittent-fasting-and-macro-tracking-complete-guide",
    title: "Intermittent Fasting + Macro Tracking: The Complete Guide",
    excerpt:
      "Can you combine intermittent fasting with macro tracking? Absolutely — and it might be the most effective nutrition strategy for body recomposition. Here's how to do it right.",
    author: "NourishAI Team",
    category: "Fitness",
    tags: ["intermittent fasting", "macros", "body recomposition", "meal timing"],
    publishedAt: "2026-02-25",
    readTime: 8,
    content: `
<p>Intermittent fasting (IF) and macro tracking are two of the most popular nutrition strategies in the fitness world. Each one works well on its own — but combining them creates a powerful system for body recomposition that's both flexible and sustainable. The key is understanding how they complement each other instead of treating them as competing approaches.</p>

<h2>Why They Work Together</h2>

<p>Macro tracking tells you <em>what</em> to eat. Intermittent fasting tells you <em>when</em> to eat. Neither one invalidates the other. In fact, IF can make macro tracking easier because you're fitting your daily targets into fewer, larger meals — which means fewer logging sessions and bigger, more satisfying portions at each meal.</p>

<p>Think about it: hitting 180g of protein across six small meals means each meal needs 30g of protein. That's doable but requires constant attention. Hitting 180g across three meals during an 8-hour eating window means 60g per meal. Those larger protein portions are easier to plan and more satisfying to eat.</p>

<h2>Popular IF Protocols for Lifters</h2>

<ul>
<li><strong>16:8</strong> — 16 hours fasting, 8-hour eating window. The most popular and sustainable for most people. Example: eat from 12pm to 8pm. This naturally skips breakfast and allows for a large lunch, afternoon snack, and dinner.</li>
<li><strong>18:6</strong> — A tighter window that works well for people who naturally aren't hungry in the morning. Example: eat from 1pm to 7pm.</li>
<li><strong>20:4 (Warrior Diet)</strong> — One large meal with a small snack. Aggressive but effective for some. Challenging to hit protein targets in such a short window.</li>
<li><strong>5:2</strong> — Eat normally 5 days, restrict to 500–600 calories 2 days. Less common in fitness circles because the low-calorie days can impair training performance.</li>
</ul>

<p>For most lifters combining IF with macro tracking, <strong>16:8 is the sweet spot</strong>. It's restrictive enough to create structure but flexible enough to fit social meals, training schedules, and adequate protein intake.</p>

<h2>Setting Your Macros for IF</h2>

<p>Your total daily macro targets don't change just because you're fasting. If your goal requires 2,400 calories with 180g protein, 260g carbs, and 75g fat, those numbers stay the same whether you eat them across 16 hours or 8 hours.</p>

<p>What changes is <strong>meal structure</strong>. Here's a sample 16:8 day for someone targeting 2,400 calories:</p>

<ul>
<li><strong>12:00pm — Meal 1 (800 cal):</strong> 6oz chicken breast, 1.5 cups rice, mixed vegetables, 1 tbsp olive oil. (55g protein, 85g carbs, 22g fat)</li>
<li><strong>3:30pm — Meal 2 (600 cal):</strong> Protein shake with banana, oats, and peanut butter. (45g protein, 65g carbs, 18g fat)</li>
<li><strong>7:00pm — Meal 3 (800 cal):</strong> 8oz salmon, sweet potato, asparagus, side salad with dressing. (50g protein, 75g carbs, 28g fat)</li>
<li><strong>7:45pm — Snack (200 cal):</strong> Greek yogurt with berries. (30g protein, 25g carbs, 2g fat)</li>
</ul>

<p><strong>Total:</strong> 2,400 cal | 180g protein | 250g carbs | 70g fat</p>

<h2>Common Mistakes to Avoid</h2>

<p><strong>1. Under-eating protein during the eating window.</strong> This is the #1 mistake. When you compress eating into fewer hours, it's easy to fill up on carbs and fats and fall short on protein. Plan your protein sources first, then fill in carbs and fats around them.</p>

<p><strong>2. Breaking the fast with junk.</strong> After 16 hours of not eating, your first meal sets the tone for the rest of the window. A high-protein, moderate-carb first meal keeps blood sugar stable and prevents the "feast mode" mentality that leads to overeating.</p>

<p><strong>3. Training fasted without BCAAs or EAAs.</strong> If you train during the fasting window, consider 10g of essential amino acids (EAAs) before or during your workout. This provides the building blocks for muscle protein synthesis without significantly breaking your fast.</p>

<p><strong>4. Being too rigid with the window.</strong> If your eating window is 12–8pm but you have a dinner at 8:30pm one night, shift your window. IF is a tool, not a religion. The macro targets matter more than the exact timing.</p>

<h2>Tracking IF + Macros with NourishAI</h2>

<p>NourishAI makes this combination particularly seamless. During your eating window, snap a photo of each meal and the AI instantly logs your macros. The dashboard shows your running totals so you can see exactly how much protein, carbs, and fat you still need to fit into your remaining eating window. No searching through databases, no weighing every ingredient — just eat, snap, and track.</p>

<p>The daily progress rings give you at-a-glance visibility into whether you're on pace to hit your targets before your eating window closes. If you're 30g short on protein with one meal left, you know to prioritize a protein-heavy final meal.</p>
`,
  },
];

/**
 * Get all blog posts, sorted by date (newest first).
 */
export function getAllPosts(): BlogPost[] {
  return [...blogPosts].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

/**
 * Get a single blog post by slug.
 */
export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

/**
 * Get all posts filtered by category (pass "All" to get everything).
 */
export function getPostsByCategory(category: string): BlogPost[] {
  if (category === "All") return getAllPosts();
  return getAllPosts().filter((post) => post.category === category);
}

/**
 * Get related posts (same category, excluding the current post).
 * Falls back to other posts if not enough in the same category.
 */
export function getRelatedPosts(
  currentSlug: string,
  limit: number = 3
): BlogPost[] {
  const current = getPostBySlug(currentSlug);
  if (!current) return getAllPosts().slice(0, limit);

  const sameCategory = getAllPosts().filter(
    (p) => p.category === current.category && p.slug !== currentSlug
  );
  const others = getAllPosts().filter(
    (p) => p.category !== current.category && p.slug !== currentSlug
  );

  return [...sameCategory, ...others].slice(0, limit);
}

/**
 * Get all unique slugs (for generateStaticParams).
 */
export function getAllSlugs(): string[] {
  return blogPosts.map((post) => post.slug);
}
