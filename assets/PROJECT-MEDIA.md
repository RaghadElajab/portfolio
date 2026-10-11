# Project media provenance

All project video stills come from the existing portfolio's linked demos. They
are real project footage. No synthetic application screenshots were created.

| Asset | Source |
| --- | --- |
| `project-attendance.jpg` | Face-recognition demo, frame at 00:25: https://drive.google.com/file/d/1IJfpQDGhbCoxk3noxcqGk9atibL6a7k4/view |
| `project-ecoffe.jpg` | ECoffe gameplay demo, frame at 00:55: https://drive.google.com/file/d/1aO0PlffQ0hZNE9mr6IvJNMYv_o-qQBn4/view |
| `project-ecoffe-readme.png` | Original 1660 × 526 banner from the [ECoffe README](https://github.com/HindAlz/ECoffe-Sustainability-VR-Game/blob/main/README.md), downloaded unchanged from its [GitHub attachment](https://github.com/user-attachments/assets/1dc5488d-b2be-4b9e-95ff-681490097a49). Used for the project card and popup demo cover. |
| `project-garden-explore.jpg` | Drive's video thumbnail for Explore mode: https://drive.google.com/file/d/16YIivby9UVqaL-87qD3xmw4XMYHYh6Gt/view |
| `project-garden-guided.jpg` | Follow-Through mode, frame at 00:55: https://drive.google.com/file/d/1pA_FC78dUD3fdvYjJwU3ha01Hp7bTL0_/view |
| `project-garden-challenge.jpg` | Challenge mode, frame at 00:55: https://drive.google.com/file/d/1LXrEeqsohdFDi1Bn5aV8vzKk0rd1Eadu/view |

The four remaining header SVGs are labeled architecture, workflow, pipeline or
benchmark diagrams. Their content is grounded in the following repositories:

- https://github.com/RaghadElajab/crop-disease-classification
- https://github.com/RaghadElajab/networked-cli-shell
- https://github.com/RaghadElajab/car-price-prediction
- https://github.com/RaghadElajab/java-fitness-tracker

Run `python tools/build_project_visuals.py` from the repository root to rebuild
all four SVG headers and the three crop charts. The generator uses only the
Python standard library. Original PNG charts are retained for reference.

## ECoffe gameplay and systems diagrams

`ecoffe-gameplay-loop.svg` shows the player's shift and upgrade loop.
`ecoffe-systems.svg` shows the supporting systems beneath it. Both are
hand-authored SVGs, separate from the header generator above.

Connections were checked against the [ECoffe source](https://github.com/HindAlz/ECoffe-Sustainability-VR-Game):

- `Assets/OurScripts/CustomerSystem.cs`: orders use unlocked recipes;
  recipe and tableware checks affect scoring; the shift leads to waste sorting.
- `Assets/trashmanager.cs`: sorting bonuses, coins and the day review.
- `Assets/OurScripts/shop.cs` and `Assets/PlayerInventoryManager.cs`:
  purchases unlock recipes, preparation tools and café decorations.
- Shared progress is stored in the project's cloud database, retaining purchases,
  scores, and sustainability progress across shifts.
- `Assets/GPTDialogue.cs`: sustainability dialogue. The supplied project
  explanation confirms this feature; angry-customer spawning is commented out
  in the current repository snapshot. The diagrams describe the game systems,
  without implying that dialogue awards coins or scores.

Raghad also supplied the original implementation report and clarified that the
systems remain but the game is now fully VR. That report informs the drink and
cooking state, recipe book, décor perks, hand interactions, and special-customer
connections. Its older desktop/VR split and cross-mode cloud synchronization
are not used to describe the current experience.

The 100% grade and Raghad's later teaching-assistant appointment for outstanding
individual performance are first-person project context supplied by Raghad,
rather than repository claims.

## Crop chart data verification

The model accuracy chart uses the exact eight percentages in the crop repository's
README Model Comparison table. The redesigned bars use a zero baseline.

Confusion-matrix counts were recovered from the original PNG cell colors using
the exact Matplotlib `Blues` colormap used in the published notebook. Only exact
RGB matches were accepted. Integer counts were checked against the per-class
support totals printed in notebook cells 28 (maize) and 30 (cashew).
This produced a unique matching matrix for each crop. Every recovered cell maps
back to its original RGB color, every row matches the published support, and
diagonal totals reproduce the published accuracy.

Notebook source:
https://github.com/RaghadElajab/crop-disease-classification/blob/main/crop-disease-classification.ipynb

| Check | Maize | Cashew |
| --- | --- | --- |
| Color normalization maximum | 142 | 249 |
| Class support | 43, 101, 30, 140, 149, 186, 145 | 260, 59, 205, 206, 253 |
| Test images | 794 | 983 |
| Correct predictions | 682 | 941 |
| Calculated accuracy | 85.8942% | 95.7274% |
| Published rounded accuracy | 85.89% | 95.73% |

Class order and all individual counts are stored in the generator. The chart
labels normalize the source typo `grasshoper` to `Grasshopper` for readability.
Mint cells indicate correct classifications; pink cells indicate errors.
Cell values count individual images, and color intensity increases with count.

## Suggested short chart captions

- Model comparison: EfficientNet-B0 leads on both crops; bars show held-out test accuracy.
- Maize predictions: Most errors occur between leaf blight and leaf spot.
- Cashew predictions: All 205 healthy test leaves were correctly classified.
