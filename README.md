# 成語遊戲

A static web game for learning Chinese idioms (chengyu). Drag four
characters into the correct order to match an idiom shown by its
illustration.

## Run locally

```
python3 -m http.server 8000
open http://localhost:8000
```

Or open `index.html` directly in a browser.

## Files

- `index.html` — landing page
- `pregame.html` — level select (Quick / 1–25 / 26–50)
- `chengyu.html` — the game
- `dictionary4.html` — idiom dictionary
- `idiomsMasterList.js` — idiom data
- `game.js`, `dictionary4.js` — page logic
- `styles.css` — shared styles
- `imgs/` — idiom illustrations
