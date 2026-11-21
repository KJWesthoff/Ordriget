# Ordriget – Stavningens Eventyr

A Danish spelling RPG for an 11-year-old moving from US 5th grade to Danish 5th grade. It's a fantasy
adventure in an 8-bit style: turn-based battles, rune-door puzzles, villages with shops, bosses, levels,
equipment, cosmetics, pets, magic and a story about the villain Vrøvl.

All game text is in Danish. The spelling content focuses on the errors a bilingual child is most likely to make
(see [LEARNING.md](LEARNING.md)).

There are no dependencies and no build step. It's plain HTML, CSS and JavaScript modules, so it runs on GitHub
Pages as-is and works offline once loaded.

## Put it on GitHub Pages

```bash
cd SpellingRPG
git init && git add . && git commit -m "Ordriget"
git branch -M main
git remote add origin https://github.com/<your-user>/ordriget.git
git push -u origin main
```

Then on GitHub, go to **Settings → Pages → Build and deployment**, set **Source: Deploy from a branch**, and choose
**Branch: main / (root)**. The game will be at `https://<your-user>.github.io/ordriget/`.

## On the iPhone

1. Open the URL in **Safari**, tap **Share → Add to Home Screen**. This matters: Safari may delete website data
   after 7 days without use, but home-screen apps keep their data. The parent page also has a backup code.
2. **Danish voice (strongly recommended):** Settings → Accessibility → Spoken Content → Voices → Danish → download
   "Sara (Enhanced)". With a Danish voice the magic attacks become real *diktat* (hear the word, then spell it).
   Without one, the game briefly flashes the word and then hides it instead.
3. Check **⚙️ Indstillinger → Test stemmen** in the game menu.

## Run locally

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

(The page has to be served over HTTP because ES modules don't load from `file://`.)

## For the parent (☰ → 👪 Forældre)

- Accuracy, practice days and streak, plus a 7-day activity chart
- Mastery per area, and the words he finds hardest right now
- **Egne ord** (custom words): paste the weekly school spelling list, one word per line. Optionally add a sentence
  (`hjørne;Bolden ligger i ___.`), and use brackets to mark the tricky part so it becomes a letter-choice
  question (`sk[y]ld;Det er ikke din ___.`). Custom words are mixed into battles and the Training Tower.
- Backup and restore through a save code

## Code map

| File | What |
|---|---|
| `js/data/words.js` | Word lists per area (`s[ø]ster;Min ___ hedder Ida.;sister`) and the spelling tips |
| `js/data/story.js` | All story dialogue |
| `js/data/game.js` | Areas, monsters, items, magic, stats |
| `js/learn.js` | Spaced repetition (Leitner boxes), word picking, misspelling generator |
| `js/quiz.js` | Question screens and the "Se – Dæk – Skriv – Tjek" correction |
| `js/gfx.js` | Pixel-art sprites (text grids) and map/background generation |
| `js/audio.js` | Chiptune music, sound effects, Danish text-to-speech |
| `js/scenes/*` | Title, map, battle, puzzle, village, menus |

To add words, edit `js/data/words.js`. To push an update to phones that already have the game, bump `VERSION`
in `sw.js`.
