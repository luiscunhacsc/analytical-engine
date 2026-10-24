# The Analytical Engine

**An interactive homage to Charles Babbage and Ada Lovelace.**

Follow a calculation through the cards, the mill, and the store. This browser-based reconstruction brings the ideas behind the Analytical Engine into view, one arithmetic operation at a time.

> “The Analytical Engine weaves algebraical patterns just as the Jacquard-loom weaves flowers and leaves.”
>
> — Ada Lovelace, [Note A, 1843](https://www.fourmilab.ch/babbage/sketch.html#NoteA)

## For Charles. For Ada.

Charles Babbage envisioned a programmable calculating machine built from wheels, with a **mill** to perform arithmetic and a **store** to hold numbers. Ada Lovelace explored the possibilities of that design in her 1843 translation and extensive notes on Luigi Federico Menabrea’s account. Her notes describe repeated operations, a method for calculating Bernoulli numbers, and the possibility of working with symbols beyond numerical quantities. Their ideas can be explored in the [original account and Lovelace’s Notes](https://www.yorku.ca/pclassic/Lovelace/lovelace.htm).

This project celebrates their shared curiosity: Babbage’s determination to give calculation a mechanism, and Lovelace’s imagination about what such a mechanism could express. Its invitation is simple: load the cards, watch the numbers move, and follow the reasoning for yourself.

## Start exploring

Clone the repository, or download and extract its ZIP:

```sh
git clone https://github.com/luiscunhacsc/analytical-engine-main.git
cd analytical-engine-main
```

Open **`index.html`** in a modern browser with JavaScript enabled. No installation, package manager, build step, or server is required. The simulation works locally and offline; archive links open external websites.

If you prefer a local server and have Python installed, run this from the project directory:

```sh
python -m http.server 8000 --bind 127.0.0.1
```

Then visit [localhost:8000](http://localhost:8000).

### Your first calculation

1. Select **Take the guided tour**, or begin with the preloaded Bernoulli program.
2. Press **Step** to execute one operation. Inspect **The card deck**, **The store**, and the **Calculation journal** to see what changed.
3. Press **Run engine** to finish the calculation. Use the pace selector to slow down or speed up execution.
4. The default result is **−1/30**: B₇ in Ada’s notation, B₈ in modern notation. Its 25 card rows execute 36 operations because a cycle repeats.
5. Choose **Save the calculation** to download a text journal with the starting values, operations, result, and source.

Use **Undo last operation** to retrace a step, **Reset machine** to start the current program again, or **Adjust the inputs** to try another calculation or arithmetic mode.

## Three programs to explore

| Program | Historical connection | Default calculation | Result in exact mode |
| --- | --- | --- | --- |
| **Bernoulli numbers** | Executable reconstruction of Lovelace’s Note G table | Calculate B₇ (modern B₈) from earlier Bernoulli values | `-1/30` |
| **A cycle of multiplication** | Repeated multiplication described in Lovelace’s Note B | `5 × 98⁷`, using seven multiplications | `434062766623360` |
| **Two unknowns, revealed** | A modern teaching example inspired by the simultaneous equations in Menabrea’s account | `2x + y = 5` and `x − y = 1` | `x = 2`, `y = 1` |

The Bernoulli program supports `n = 1…6`; the multiplication program supports exponents `1…12`. Multiplication inputs and equation coefficients accept integers, decimals, or fractions such as `1/6`.

## Inside the engine

- **Cards direct the work.** Each displayed card pairs an arithmetic operation with the source and destination columns it uses.
- **The store remembers.** Inspect the numbered columns to follow inputs, intermediate values, and results.
- **The mill calculates.** Addition, subtraction, multiplication, and division move the program forward.
- **Cycles repeat instructions.** The journal records every executed operation, including repeated cards.

The interface includes a guided tour, explanations of the machine’s parts, downloadable calculation journals, and **Parchment** and **Midnight blue** themes. The selected theme is saved locally when browser storage is available.

### Two arithmetic models

| Mode | Behavior |
| --- | --- |
| **Exact fractions** (default) | Uses JavaScript `BigInt` numerators and denominators to preserve rational values without rounding. A teaching-model limit caps numerators and denominators at 250 digits. |
| **Decimal wheels** | Uses 40 total digits with a fixed scale of 20 decimal places. Values are truncated toward zero after each operation; overflow stops the calculation. |

Exact fractions are a modern teaching aid. The decimal mode’s 20-place scale is also a project convention, not a claim about a fixed historical configuration.

## Historical care

This is a **logical reconstruction** for learning. The mill, store, arithmetic operations, variable cards, and repeated cycles are informed by the historical account. The schematic, animation, punched-hole patterns, paired card display, pacing, and undo controls are explanatory choices. Mechanical timing, carrying mechanisms, physical tolerances, and full card control are outside the simulation’s scope.

The Note G implementation makes its interpretation explicit:

- Row 4 uses `(2n − 1) / (2n + 1)`, correcting the reversed division in the printed table.
- Row 24 explicitly negates the accumulated sum to obtain the new Bernoulli number.
- Earlier Bernoulli values are supplied as starting data; the repeated cycle is executed by the engine.
- Ada’s B₁, B₃, B₅, and B₇ correspond to modern B₂, B₄, B₆, and B₈.

The multiplication deck uses a modern register arrangement. The simultaneous-equations deck and its default coefficients are teaching examples inspired by Menabrea, rather than a transcription or an Ada-authored program. Each program exposes its source and interpretation in the interface and exported journal.

## Working on the project

The application uses plain HTML, CSS, and JavaScript, with no third-party runtime dependencies or build tooling. Edit the files and refresh the browser.

| File | Purpose |
| --- | --- |
| [`index.html`](index.html) | Page structure, controls, historical context, and archive links |
| [`engine.js`](engine.js) | Fraction arithmetic, program definitions, store, card execution, history, and trace |
| [`app.js`](app.js) | Machine drawing, interface updates, playback, input forms, guided tour, and journal export |
| [`styles.css`](styles.css) | Layout, typography, responsive styling, and animation |
| [`theme.js`](theme.js) | Theme selection, persistence, and synchronization between tabs |
| [`themes.css`](themes.css) | Theme colors and appearance overrides |

`engine.js` exposes the `AnalyticalEngine` namespace. Scripts load in order without ES modules so that opening `index.html` directly remains supported.

Contributions to historical accuracy, explanations, accessibility, and the simulation are welcome. For historical changes, include a source and explain any interpretive choices. After changing the engine, check the three default results above; after interface changes, check stepping, undo, reset, journal export, and both themes.

## Read the original ideas

- [Sketch of the Analytical Engine, with Lovelace’s Notes A–G](https://www.fourmilab.ch/babbage/sketch.html) — Menabrea’s account, translated and annotated by Lovelace; includes Notes B and G behind the demonstrations.
- [Lovelace’s Notes at York University](https://www.yorku.ca/pclassic/Lovelace/lovelace.htm) — an independent transcription with a link to the translated memoir.
- [Babbage’s surviving Analytical Engine trial model](https://collection.sciencemuseumgroup.org.uk/objects/co62245/babbages-analytical-engine-1834-1871-trial-model-analytical-engines) — the Science Museum Group’s record of a portion of the mill and printing mechanism.

## License

[MIT](LICENSE) · Copyright © 2026 Luís Simões-Cunha.

---

*For Charles. For Ada. And for every idea ahead of its time.*
