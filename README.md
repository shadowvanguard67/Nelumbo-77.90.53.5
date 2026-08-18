# NelumboMC Website

Dark fantasy landing page for the NelumboMC Minecraft server running **NightfallCraft: The Casket of Reveries**.

## Quick Start

Open `index.html` in a browser, or serve locally:

```bash
# Python
python -m http.server 8080

# Node (npx)
npx serve .
```

Then visit `http://localhost:8080`.

## Structure

```
nelumbomc/
├── index.html      # Main page (all sections)
├── css/styles.css  # Dark fantasy theme & responsive layout
├── js/main.js      # Particles, scroll reveal, copy IP, nav
└── README.md
```

## Sections

1. **Hero** — Cinematic intro with Play Now / Join Discord CTAs and server IP
2. **About** — Server overview and modpack details
3. **Features** — Six feature cards (combat, bosses, quests, etc.)
4. **The World** — NightfallCraft world description with cinematic background
5. **How to Play** — Five-step join guide with CurseForge link
6. **Community** — Early-join messaging with Discord CTA
7. **Server Status** — Static server info (player count placeholder for future use)
8. **CurseForge** — Modpack download link
9. **Footer** — Links and server details

## Server Info

| Field    | Value                                      |
|----------|--------------------------------------------|
| IP       | 77.90.53.5                                 |
| Version  | 1.20.1                                     |
| Modpack  | NightfallCraft: The Casket of Reveries     |
| Discord  | https://discord.gg/Z9KqftFghK              |
| CurseForge | https://www.curseforge.com/members/u_888/projects |

## Dynamic Player Count

The "Players Online" field in the Server Status section uses `data-dynamic="players"` and displays `—` by default. Wire it to a server status API later by updating the element in `js/main.js`.

## Deployment

This is a static site — deploy to any static host (GitHub Pages, Netlify, Cloudflare Pages, etc.). No build step required.
