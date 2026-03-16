# Articlos — Marketing Site

A pixel-perfect, static marketing website for [articlos.app](https://articlos.app).

## Files

```
articlos-site/
├── index.html     # Main page
├── style.css      # All styles
├── main.js        # Interactivity (nav scroll, reveal animations, mobile menu)
├── favicon.svg    # App icon
└── README.md      # This file
```

## Deploy to GitHub Pages

### 1. Create a GitHub repository

Go to [github.com/new](https://github.com/new) and create a new repository.
- Name it `articlos-site` (or any name you prefer)
- Set it to **Public** (required for free GitHub Pages)

### 2. Push the files

```bash
cd articlos-site
git init
git add .
git commit -m "Initial commit: Articlos marketing site"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### 3. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages** (left sidebar)
3. Under **Source**, select **Deploy from a branch**
4. Choose **main** branch and **/ (root)** folder
5. Click **Save**

Your site will be live at:
`https://YOUR_USERNAME.github.io/YOUR_REPO/`

### 4. Custom domain (optional)

If you want to serve from `articlos.app` or a subdomain:
1. In Settings → Pages, add your custom domain
2. Add a `CNAME` file to the repo root with your domain name:
   ```
   articlos.app
   ```
3. Update your DNS provider to point to GitHub Pages

---

## Customization

- **Colors**: Edit CSS variables at the top of `style.css`
- **Content**: All copy lives in `index.html`
- **Pricing**: Update the three `.pricing-card` blocks in `index.html`
- **CTA links**: All `href="https://articlos.app"` links point to the live app

## Tech

Pure HTML/CSS/JS — no build step, no dependencies, no framework.
