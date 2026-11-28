# Existing article refreshes

These are editorial drafts for the existing SpiderMonkey (`10rsmd`) and Go roadmap (`ybi36e`) articles. They are not imported by the application and merging the branch does not publish them.

Each file contains the original title and introduction as review guards, a direct opening answer, two useful answer sections, primary sources and links to existing Monkeys pages. The original title, URL, article ID, author, publication date and unrelated blocks stay unchanged. Review the listed factual issues in the older body before any public editorial update.

For a local file preview, export the article from the local backend, then run:

    node scripts/preview-article-refresh.mjs original-local-article.json docs/seo/content-refreshes/10rsmd.json NEW-local-preview.json

Use `ybi36e.json` for the Go roadmap. The tool has no network or publishing capability, refuses to overwrite a file, and stops if the original article changed. Review and publish through the normal authorized article workflow later; no production content is changed by these files.

Measurement: compare the actual page-specific queries, impressions, CTR, clicks and average position for matched full reporting windows after the relevant code and content are live. Keep the technical deployment date and any later editorial publication date separate.
