# Offshore Creative Property

## Local development

From this folder, run `python3 -m http.server 8000 --directory dist` and visit http://localhost:8000/. Windows users can run `py -3` instead of `python3`. Stop the server with Ctrl+C.

## Editing

Edit page content and media references in `dist/index.html`, presentation in `dist/style.css`, and player, gallery, menu and WhatsApp form interactions in `dist/app.js`. Images, fonts, logos and posters live in `dist/assets/`. The GSAP browser library is bundled in `dist/gsap.min.js`. The project has no package installation or compilation step.

## Vercel deployment

Extract the ZIP, commit its contents to a GitHub repository, and import that repository into Vercel. Select the directory containing `vercel.json` as the project root. Use the Other framework preset, leave the build command empty, and publish `dist`. Deploy and check the resulting URL. The original Sites hosting manifest is also included.

## Video hosting

Native video players stream directly from the Offshorecreative GitHub repositories. Retain the corresponding poster and raw URL when updating a clip. Offscreen preview sources are deferred until needed. Videos and WhatsApp require network access.

Exact raw URLs for Casa Kong, Berawa and Villa Gima, Umalas were unavailable. Those cards show the project poster and link to the original film on YouTube. The site does not embed YouTube players.
