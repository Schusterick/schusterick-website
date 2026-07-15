# schusterick.com

Personal site for Will Schusterick — 3× U.S. Champion, CEO of Prodigy Disc, and disc golf course designer.

Static site (HTML/CSS/JS, no build step). Deployed via GitHub Pages to **schusterick.com**.

## Structure
- `index.html` — the page
- `styles.css` — design system
- `main.js` — nav, scroll reveal, contact-form handling
- `assets/` — images and logo marks
- `CNAME` — custom domain for GitHub Pages

## Local preview
```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Notes
- Contact form posts to Formspree — set the form's `action` in `index.html` to your Formspree endpoint.
- Instagram feed uses a Behold widget; YouTube shows the latest uploads playlist.
