# News mock

One page: `news/mock/news-mock.html`, built from `tooling/mock-src/pages/news.html` by `node tooling/build-mocks.mjs`. It replaces `/news` and takes over the souvenir journal, which the live site embeds separately on the home page. The page is a page head (eyebrow, `h1` "News", one paragraph) and three cards. Each card is an Omega Year eyebrow and a heading whose only content is a link to the Issuu document: "Achievement Week 2025: Impactful Service Through Intentional Friendship" (Omega Year 2026 newsletters), "Lambda Xi Achievement Week 2024: A Resounding Success" (Omega Year 2025 newsletters), and "Lambda Xi Achievement Week Journal" (souvenir journal).

## What is real, what is inferred, what is sample

The three titles and Issuu links come from the live embeds (`lambda_xi_oy26_newsletters`, `lambda_xi_rok_hard_news_oy_25`) and from the journal linked on the home page (`lambda_xi_achievement_week_journal`). Titles were checked against the chapter's own PDF copies: the OY25 volume is 51 pages and its first page carries that headline; the November 2025 issue opens with the Achievement Week 2025 article and names Bro. Charlesvester Wims as editor; the journal is 23 pages. The live page had no `h1`, only the `h2` "RoK Hard News!"; the `h1` "News" and the page-head paragraph are new copy for this rebuild. At the operator's direction the cards carry titles only: no descriptions, no page counts, no "Read on Issuu" buttons, no "Also on the site" list, and no provenance note. Nothing on the page is sample or placeholder content.

## Step counts

| Task | Live | Repo mock | This mock |
|---|---|---|---|
| Open the current newsletter | close a popup, scroll to the embed, page through the Issuu flipbook | 1 click, to `lambdaxi1911.com/news`, which will not exist after migration | 1 click, straight to the Issuu document |
| Open last year's newsletter | same, second embed further down the page | same dead link | 1 click |
| Open the journal | not on this page; embedded separately on Home | not present | 1 click |

## Everything the live page did, and where it is here

| Live capability | Here |
|---|---|
| Two Issuu flipbook viewers in iframes (the OY26 one nested through a Strikingly proxy) | Two heading links to the same Issuu documents; no iframe, no Issuu script |
| Souvenir journal embedded on Home | A third card here, linking to the same Issuu document |
| "RoK Hard News!" as an `h2`, no `h1` | `h1` "News" |
| No table of contents, no issue dates, no article text | Titles only, per operator direction; no dates or article text added |

## Verification

`verify.json`: axe-core zero violations at 320, 375, 768, 1280 and 1440 in light and dark; no horizontal overflow; every focus stop has a visible indicator (11 stops at 320-768, 18 at 1280-1440); the theme dropdown is keyboard-operable and closes on Escape; theme persists after reload and follows the OS.

### frontend-reviewer result, 24 September 2026

| Finding | Action |
|---|---|
| Two descriptive lines had no source in the repo | Verified against the chapter's PDFs, then removed with all other descriptions at the operator's direction |
| Three identical "Read on Issuu" link texts | Buttons removed; each heading link now carries the document title |
| Editor-facing roadmap copy and a "PDF hosting pending" pill in the data-note | Note removed |
| Title and `h1` differ ("News and Newsletters \| Lambda Xi Chapter" vs "News") | Open, cosmetic |
| No README | This file |
