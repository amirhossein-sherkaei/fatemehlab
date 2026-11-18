Fatemeh Beauty Land - Home banners

Place your approved homepage banner images in this folder.
Supported formats: .webp, .jpg, .jpeg, .png, .avif

Naming convention:
  01-spring.webp          desktop / default banner
  01-spring-mobile.webp   optional mobile version for the same banner
  02-new-arrivals.webp
  02-new-arrivals-mobile.webp

The Phase 2 PowerShell script detects these images when it is first run and creates
src/data/home-banners.json automatically. Banners are displayed in filename order.
Every banner links to /products by default. The JSON file can later be customized
with a different href for each slide.

Use optimized images and keep mobile and desktop variants at their intended aspect
ratios. Avoid placing private or source files in this public folder.
