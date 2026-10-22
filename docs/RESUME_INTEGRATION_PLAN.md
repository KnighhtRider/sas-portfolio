# Resume integration plan

## Objective

Make Vivek's resume easy for a recruiter to find from the Overview and Contact pages, while keeping project discovery as the primary Overview action. Use the existing local PDF as the source asset; do not create a second copy or introduce a resume viewer dependency.

## Current state

- Resume file: `public/resume/vivek_Thakur_Resume.pdf` (present and owner-provided).
- Public URL: `/resume/vivek_Thakur_Resume.pdf` (static file path; preserve filename casing).
- `PROFILE.resumeHref` points to `/resume/vivek_Thakur_Resume.pdf`.
- The content checker accepts safe local PDF paths under `/resume/`.
- The command palette already exposes a resume action when the profile path points to an existing local PDF.
- Overview currently has `Explore projects` as its primary action and `Contact` as secondary.

## Recommended experience

### Overview

- Add a quiet `View resume` text link alongside or immediately below the existing secondary action.
- Keep `Explore projects` as the only filled primary button; do not introduce a third equally prominent button.
- Use a document/download icon with an accessible label. Make the link available only when the configured local PDF exists.
- Open the PDF in a separate browser tab for quick review, with `rel="noopener noreferrer"`; preserve a direct download action on Contact.

### Contact

- Add a dedicated resume row/card after the professional profile links, visually consistent with those rows and the existing thin-border design.
- Include two clearly named actions: `View resume` (new tab) and `Download PDF` (download attribute). Identify the document as a PDF in visible text and accessible names.
- If the file is missing or the configured path is invalid, omit the resume section cleanly. Never render a dead link.

### Command palette

- Reuse the existing conditional resume command. Confirm its label and activation open the same local PDF path configured in profile data.
- Keep the action conditional on the file existing, as `getCommandPaletteData()` already checks.

## Implementation sequence (Phase 12, with Phase 13 palette verification)

1. The PDF is linked, but before production release the owner must confirm it is the intended public version and review its visible text for accuracy, stale contact details, placeholders, and confidential client or patient information.
2. The profile path, Overview tertiary link, Contact resume row, and command-palette action are implemented. The same safe local PDF path is used throughout.
3. The pages and command palette omit the action if the file is absent or the path fails the existing safe-path validation.
4. `docs/ABOUT_CONTACT.md` and `docs/CONTENT_GUIDE.md` record the canonical file path and owner review requirement.
5. Phase checks cover the links and download behavior; the owner still needs to review and open the PDF before public release.

## Scope and safeguards

- No resume content is copied into page markup or duplicated in profile fields.
- No fabricated file size, update date, experience claim, or summary is displayed.
- Do not expose the file through a remote URL, embed third-party viewer, or send it to an external service.
- Preserve the existing portfolio confidentiality rules. If the PDF includes sensitive client details, revise or replace the PDF with an owner-approved public version before exposing it.
- Keep the user in control of the original PDF; implementation only references the file in `public/resume`.

## Manual acceptance checklist

- [ ] `/resume/vivek_Thakur_Resume.pdf` opens directly and returns the intended PDF.
- [ ] Overview keeps `Explore projects` as its primary action and offers a clearly discoverable but quiet `View resume` link.
- [ ] Contact offers distinct `View resume` and `Download PDF` actions with understandable accessible names.
- [ ] Keyboard users can reach and activate each resume action; focus state is visible.
- [ ] The Contact download saves the PDF, and the view action opens it in a separate tab.
- [ ] Removing or renaming the PDF causes all resume entry points to disappear without broken links.
- [ ] The owner has reviewed the resume's facts and confidentiality before public release.
