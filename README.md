[Magic Puddle](https://pixievoltno1.com/web/MagicPuddle) is a simple procedurally-generated animation that produces colorful ripples for you to relax with, occasionally producing a burst of them in a special pattern. I've tried to make it easy for JavaScript newbies to modify and put their own lovely spins on it, and I'd love to see what you come up with~

# Recommended starting points

- `ripples.mjs` is where you'll find the factory function that the rest of Magic Puddle uses to make ripples.
- `surprises.mjs` defines the special ripple patterns that Magic Puddle randomly uses on occassion. Add your own!
- `magicPuddle.mjs` is the build tool's entry point into the code - everything other than the service worker must be imported directly or indirectly from here to run.

# Recommended build method: Remix on Glitch

If you're reading this on Glitch, you're already all set up to work on the code and have it automatically built for you - have fun! If not, [this link](https://glitch.com/edit/#!/remix/magic-puddle) opens a new Glitch project ready to edit.

# Setting up a local build

You'll need [Node](https://nodejs.org/) and [pnpm](https://pnpm.io/).

At the top of the [GitHub repo page](https://github.com/PixievoltNo1/Magic-Puddle) you'll find options for forking and/or downloading the code. Once you have the Git repo's files on your computer, open a terminal there and type `pnpm install` to do the first-time setup.

With all the setup done, you can use `pnpm start` to create Magic Puddle in a `build` folder and keep it automatically updated as you edit the source files, or use `pnpm run build` for a one-time build. You'll need an HTTP server of some sort pointed at `build` to try it in your browser; a great basic option is `npx http-server build` (npx is included with Node).