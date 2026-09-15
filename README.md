# Real or AI?

**Real or AI?** is a standalone, five-round visual challenge for exhibitions and the web. Players have 25 seconds per image to decide whether it is a verified photograph or an AI-generated scene, then receive immediate feedback and educational clues for generated images.

## Stack

React, Vite, TypeScript, React Router, Framer Motion, Lucide React, canvas-confetti, Vitest, and React Testing Library. The first version has no backend; sound preference and best score are stored locally in the browser.

## Run locally

```bash
npm install
npm run optimize:images
npm run dev
```

Open the local address printed by Vite.

## Quality checks

```bash
npm test
npm run lint
npm run typecheck
npm run build
```

## Manage the image collection

Original files stay in `assets/real` and `assets/ai`.

1. Add a verified photograph to `assets/real`, or a confirmed generated image to `assets/ai`.
2. Run `npm run optimize:images`. The reusable script applies the same WebP settings to both categories and writes optimized copies under `src/assets/game-images`.
3. Add the generated neutral import and its typed record in `src/data/imageCatalog.ts`. Use the next neutral ID, write scene-only alt text, and never reveal the answer in the alt text.
4. For an AI image, add a short clue that refers only to a genuinely visible detail. If there is no reliable artifact, say so honestly.
5. To temporarily exclude an image, set `active: false` on its catalogue record.

Vite emits every image with a neutral content hash, so production image URLs do not reveal their category or source filename. The client-side catalogue necessarily contains the answers; this is acceptable for a casual game but is not tamper-proof against someone deliberately inspecting the JavaScript bundle.

## Change game settings

Edit `src/config/gameConfig.ts` to change the title, number of rounds, timer duration, warning threshold, sound, or confetti. Selection logic automatically balances any valid round count between both categories. Theme tokens live at the top of `src/styles/global.css`.

## Deploy to Vercel

1. Push this folder to a Git repository.
2. Import the repository in Vercel.
3. Choose **Vite** (normally detected automatically).
4. Use `npm run build` as the build command and `dist` as the output directory.
5. Deploy. `vercel.json` sends refreshed React Router URLs back to `index.html`.

No environment variables are required. A future shared homepage can link directly to this deployment URL. If an explicit “back to all games” action is later desired, add a configurable external URL to `gameConfig.ts` and a button beside the existing home action; do not hard-code it into a page.

## Current limitations

- Progress and player name are intentionally session-only; refreshing a round starts from the game home.
- Best score and sound preference are device-local and do not sync between browsers.
- Because classification data is client-side, a determined player can inspect the compiled code to discover answers.
