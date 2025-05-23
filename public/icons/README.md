# GPT Power-Ups Icons

This directory contains the extension icons in various sizes.

## Design Concept

The icon features a sophisticated, artistic design with modern aesthetics:

- **Purple Background**: Rich purple gradient background (#5F43BB) providing a premium, tech-focused appearance
- **Pink Paintbrush Element**: Vibrant pink artistic brush stroke (#F45183) representing the drawing functionality
- **White Artistic Elements**: Clean white geometric shapes adding contrast and visual interest
- **Complex Composition**: Multi-layered design with various artistic elements creating depth
- **Professional Appeal**: Sophisticated color palette and composition suitable for a productivity extension

## Design Characteristics

- **Artistic Style**: Complex, visually rich design with multiple layers and elements
- **High Contrast**: Strong color contrast ensuring visibility at all sizes
- **Premium Feel**: Sophisticated color scheme and composition
- **Scalable Elements**: Design maintains clarity when scaled to different sizes
- **Brand Identity**: Distinctive appearance that stands out among other extensions

## Files

- `icon.svg` - Source SVG file (1024x1024)
- `icon16.png` - 16x16 browser tab icon
- `icon48.png` - 48x48 toolbar icon
- `icon128.png` - 128x128 Chrome Web Store icon
- `icon256.png` - 256x256 high-resolution icon for documentation

## Regenerating Icons

To regenerate the PNG icons from the SVG source:

```bash
# Install ImageMagick if not already installed
brew install imagemagick

# Generate all sizes
magick public/icons/icon.svg -resize 16x16 public/icons/icon16.png
magick public/icons/icon.svg -resize 48x48 public/icons/icon48.png
magick public/icons/icon.svg -resize 128x128 public/icons/icon128.png
magick public/icons/icon.svg -resize 256x256 public/icons/icon256.png
```

## Colors Used

- Primary Background: Purple (#5F43BB)
- Artistic Elements: Pink (#F45183)
- Contrast Elements: White (#FAFAFC, #F9F8FB)
- Secondary Elements: Various grays and additional accent colors
- Dark Elements: Dark gray/black (#141414) for depth 