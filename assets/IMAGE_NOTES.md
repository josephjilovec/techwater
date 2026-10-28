# Website imagery and the sample report

## Original concept imagery, October 2026

The water-horizon, water-texture, and property-context images were generated with the built-in image-generation tool for TechWater. They are illustrative: no real customer property, water-quality result, installed hardware, or measured conservation outcome is represented. Exact prompts, source paths, image dimensions, and optimized file hashes are in `ocean-images.json`.

Each image has responsive WebP derivatives at up to 640, 1000, and 1600 pixels wide, without upscaling. The property source is 1536 pixels wide; its `-1600` filename denotes the largest variant, with the actual 1536w descriptor used in HTML. Native HTML supplies the report cards, chart, labels, and interaction states; image generation is not used to render precise records or calculations.

The design reference informed the scale of typography, layered water imagery, and a long-scroll narrative. No reference-site artwork, photography, code, wording, or fonts were copied.

## Fictional Water Use Review

`water-use-review.svg` is the original accessible vector sample report. `water-use-review.png` is its retained raster export. Both are unchanged.

Period A: 24,000 US gallons / 30 days = 800 US gallons/day. Period B: 31,500 / 35 days = 900 US gallons/day. Billed consumption increased 31.25% (displayed as 31.3%); daily consumption increased 12.5%. The example does not establish a cause or claim completed client results.

## Retained source assets

`hero.webp` and `hero-768.webp` are older AI-generated meter-hardware concepts, retained unchanged as source assets. Neither is displayed by the current website.

## Font

Manrope is self-hosted from the Google Fonts source, with its original SIL Open Font License in `fonts/OFL.txt`. See `fonts/README.md` for attribution.
