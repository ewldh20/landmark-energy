# Background Image

The hero section currently uses an Unsplash image. To use your own image:

1. Add your image to the `public/` folder (e.g., `public/hero-background.jpg`)

2. Update `src/App.css` in the `.hero-background` class:

```css
.hero-background {
    background-image: url('/hero-background.jpg');
}
```

Or use an absolute URL to your image hosting service.

## Image Recommendations

- **Size**: 1920x1080 or larger
- **Format**: JPG or WebP for photos
- **Content**: Farm fields, agricultural landscapes, or renewable energy imagery
- **Optimization**: Compress the image to keep file size reasonable (< 500KB)
