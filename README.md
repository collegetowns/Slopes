# Policy Slopes Live

Students place policies on a precision–flexibility / federal–state–local slope from their phones, and the class average appears on the projected board. It works like Poller Crowd: students scan a QR code and join anonymously, with no accounts or apps.

## What's in the folder

| File | What it is |
|---|---|
| `index.html` | The **board**: open it on the projector computer. |
| `join.html` | The **phone page**: students reach it through the QR code. |
| `group.html` | The **one-device-per-group** version (no phones needed). A single self-contained file: groups take turns on one computer and print a lift pass. |
| `js/config.js` | Settings. It already holds the same Supabase project as Poller Crowd. |
| `js/common.js`, `js/board.js`, `js/join.js` | The app. |
| `js/vendor/` | Supabase and QR-code libraries, bundled so nothing loads from a CDN. |
| `css/styles.css` | Styles. |

## Put it online

This repo is set up for **GitHub Pages**, like Poller Crowd: in the repo's **Settings → Pages**, choose **Deploy from a branch**, branch `main`, folder `/ (root)`. To use a custom domain (for example `slopes.collegetowns.org`), enter it there and add a matching DNS record, as you did for Poller Crowd.

Or upload the whole folder to any static host.

Keep the folder structure as it is.

The board builds its QR code from its own web address, so phones are always sent to the `join.html` next to it.

## Try it before class (demo mode)

Add `?demo=1` to the board address, for example `.../index.html?demo=1`. In demo mode, the board and the "phones" are tabs in **one browser**. Open the join link in a few tabs to play every role yourself. Nothing goes over the internet.

Demo mode also turns on automatically if `js/config.js` has no Supabase settings.

## Running a class

1. Open `index.html` on the projector, type a class name (or leave it blank for a pun), and click **Open the lift**.
2. Students scan the big QR code, pick a character, color, style and ride, and tap **Hop on the lift**.
3. Click **Start the first case**. Phones show the case and a small slope to tap. Students tap, then **Lock in** (or **Re-run** to clear the spot). The board counts who has locked in, but spots stay hidden.
4. Click **Reveal the class average**. The students' characters and the average appear on the board, and phones say "Eyes up!"
5. **Draw the next case**, click one of the **Up next** cards, or **Skip** any card. **Skip this case** drops the case on the lift.
6. **Hit the Lodge** to finish, then print or save the class **lift pass** (PNG or PDF).

If the board computer refreshes, click **Resume session**: the riders and their spots come back. Students who refresh their phones stay signed in as the same rider.

## Notes

- Only live messages pass through Supabase; nothing is saved there. The session is saved on the board computer only.
- Poller Crowd notes that the shared Supabase connection handles about 200 people at once. Policy Slopes Live uses the same project, so the two apps share that limit.
- The policy list is in `js/common.js`, at the top under `STARTER`.

## License

MIT, like the other College Towns apps.
