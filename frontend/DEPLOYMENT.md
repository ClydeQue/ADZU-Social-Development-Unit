# Frontend Deployment Guide - Vercel

## Image Loading Issues Fixed

### Problem
Images in `/public/` folder weren't loading on Vercel deployment due to:
1. Missing Vercel configuration for static assets
2. Incorrect asset importing in React components

### Solution

#### 1. Created `vercel.json` Configuration
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "routes": [
    { "src": "/images/(.*)", "dest": "/images/$1" },
    { "src": "/logos/(.*)", "dest": "/logos/$1" },
    { "src": "/icons/(.*)", "dest": "/icons/$1" },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

#### 2. Updated Vite Configuration
- Added `assetsDir: 'assets'`
- Specified `publicDir: 'public'`
- Proper asset handling for production

#### 3. Fixed Image Imports
**Before (Problematic):**
```jsx
<img src="/logos/adzuSeal.png" alt="AdZU Seal" />
backgroundImage: "url('/images/login.webp')"
```

**After (Fixed):**
```jsx
import adzuSeal from '/logos/adzuSeal.png';
import loginBg from '/images/login.webp';

<img src={adzuSeal} alt="AdZU Seal" />
backgroundImage: `url(${loginBg})`
```

## Deployment Steps

1. **Build locally to test:**
   ```bash
   cd frontend
   npm run build
   npm run preview  # Test the build locally
   ```

2. **Deploy to Vercel:**
   ```bash
   vercel  # Deploy from frontend folder
   ```

3. **Verify assets:**
   - Check that images load correctly
   - Verify background images display
   - Test on different devices/browsers

## Asset Organization

```
frontend/public/
├── images/
│   └── login.webp
├── logos/
│   ├── adzuSeal.png
│   └── adzuSeal.svg
└── icons/
    └── (app icons)
```

## Best Practices

1. **Always import static assets** in React components
2. **Use Vite's asset handling** - paths starting with `/` resolve to public folder
3. **Optimize images** - use WebP for better performance
4. **Cache headers** - configured in vercel.json for optimal loading

## Troubleshooting

- **Images still not loading?** Clear Vercel cache and redeploy
- **404 on assets?** Check that files exist in `/public/` folder
- **Wrong paths?** Ensure imports use correct paths from `/public/`
