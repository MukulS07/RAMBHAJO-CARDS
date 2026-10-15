// Checks the card on real phone screen sizes: it must fit one screen with no
// scrolling, the photo arch must keep its 4:5 shape, and nothing may error.
//
//   npm i -D playwright && npx playwright install chromium
//   node tools/check_fit.mjs              -> checks index.html
//   node tools/check_fit.mjs d/name/index.html
//
// Screenshots land in tools/shots/.

import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const file = resolve(process.argv[2] || "index.html");
const url = pathToFileURL(file).href;
mkdirSync("tools/shots", { recursive: true });

// width x height in CSS px. The Safari row is an iPhone 17 with the address bar showing.
const screens = [
  ["iPhone SE (9:16)",         375, 667],
  ["iPhone 17",                402, 874],
  ["iPhone 17 + Safari bar",   402, 756],
  ["iPhone Air",               420, 912],
  ["iPhone 17 Pro Max",        440, 956],
  ["Android 9:20",             390, 867],
  ["Android 9:22",             390, 953],
  ["Side panel / tablet",      680, 900],
  ["Laptop",                  1440, 860],
];

const browser = await chromium.launch({ args: ["--use-gl=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist"] });
let failed = 0;

for (const [name, w, h] of screens) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  const errors = [];
  page.on("pageerror", e => errors.push(e.message));
  await page.goto(url);
  await page.waitForTimeout(3200);           // let the opening animation finish

  const r = await page.evaluate(() => {
    const doc = document.documentElement;
    const arch = document.querySelector(".arch").getBoundingClientRect();
    return {
      scrollH: doc.scrollHeight, scrollW: doc.scrollWidth,
      archRatio: +(arch.width / arch.height).toFixed(3),
    };
  });

  const fits = r.scrollH <= h && r.scrollW <= w;
  const archOk = Math.abs(r.archRatio - 0.8) < 0.01;
  const ok = fits && archOk && errors.length === 0;
  if (!ok) failed++;

  console.log(
    `${ok ? "PASS" : "FAIL"}  ${name.padEnd(24)} ${w}x${h}` +
    `  fits=${fits}  arch=${r.archRatio}${archOk ? "" : " (want 0.8)"}` +
    (errors.length ? `  errors=${errors.join(" | ")}` : "")
  );
  await page.screenshot({ path: `tools/shots/${name.replace(/[^a-z0-9]+/gi, "-")}.png` });
  await page.close();
}

await browser.close();
process.exit(failed ? 1 : 0);
