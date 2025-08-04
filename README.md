[Magic Puddle](https://pixievoltno1.com/web/MagicPuddle) is a simple procedurally-generated animation that produces colorful ripples for you to relax with, occasionally producing a burst of them in a special pattern. I've tried to make it easy for JavaScript newbies to modify and put their own lovely spins on it, and I'd love to see what you come up with~

# Recommended starting points

- `ripples.mjs` is where you'll find the factory function that the rest of Magic Puddle uses to make ripples.
- `surprises.mjs` defines the special ripple patterns that Magic Puddle randomly uses on occassion. Add your own!
- `magicPuddle.mjs` is the build tool's entry point into the code - everything other than the service worker must be imported directly or indirectly from here to run.

# Remixing with GitHub Pages

To quickly set up a publicly-viewable remix of Magic Puddle:

1. At the top of the [GitHub repo page](https://github.com/PixievoltNo1/Magic-Puddle), click Fork to copy the repo to your own GitHub account.
2. On your repo's page, go to Settings > Pages, and change Source to GitHub Actions.
3. (Optional) Go to Actions > Deploy to GitHub Pages and click "Run workflow". In about a minute, [your name].github.io/Magic-Puddle/ will be live with your copy of Magic Puddle. If you skip this step, it'll still go live after your commit your first changes.

Now whenever you commit changes to your repo, they'll be live on [your name].github.io/Magic-Puddle/ in about a minute. For a fully-featured editor you can use in your browser without setting up Git or any other software, you can [try github.dev](https://docs.github.com/en/codespaces/the-githubdev-web-based-editor).

# Setting up a local build

To set up development on your own computer, you'll need [Node](https://nodejs.org/) and [pnpm](https://pnpm.io/).

At the top of the [GitHub repo page](https://github.com/PixievoltNo1/Magic-Puddle) you'll find options for forking and/or downloading the code. Once you have the Git repo's files on your computer, open a terminal there and type `pnpm install` to do the first-time setup.

Once setup is done, `pnpm start` creates the `build` folder, starts a watcher to rebuild it as you make changes, and starts an HTTP server so you can see your work in the browser! You can also use `pnpm run build --watch` for just the build and the watcher, or just `pnpm run build` for a one-time build.

If you want to show off your remix to the world using a host other than GitHub Pages, e.g. Neocities, upload only the contents of the build folder you created with one of the above commands.
