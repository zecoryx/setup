# Neovim & Dev Workflow Setup

Complete configuration for Neovim, Tmux, and Ghostty.

## Quickstart (New Machine Setup)

Run the following commands in your terminal:

```bash
git clone https://github.com/zecoryx/setup.git ~/Projects/setup
cd ~/Projects/setup/vim
./install.sh
```

The `install.sh` script automatically:
1. Verifies required tools (`nvim`, `tmux`, `fzf`, `zoxide`, `bat`, `ripgrep`).
2. Symlinks configurations into `~/.config/`.
3. Installs Tmux plugins.
4. Syncs and builds all Neovim plugins headlessly.

## Documentation & Guides

* [CHEATSHEET.md](CHEATSHEET.md) — Complete keyboard shortcut reference.
* [structure.md](structure.md) — Architecture, configuration manual, and customization guide.

## Directory Structure

* `init.lua`, `lua/` — Neovim options, keymaps, and plugins.
* `tmux/` — Tmux configuration and session management script.
* `ghostty/` — Ghostty terminal configuration.
* `install.sh` — Automated setup script.

## Optional Dev Plugins (API & Testing)

The following plugins can be added to `lua/plugins/` when needed:
* **API Client**: `mistweaverco/kulala.nvim` (send REST/HTTP requests directly from `.http` files inside Neovim).
* **Automated Testing**: `nvim-neotest/neotest` with `V13Axel/neotest-pest` and `olimorris/neotest-phpunit` (run and inspect test suites next to code).

## Updating and Saving Changes

Changes made to Neovim or Tmux configs are reflected directly here via symlinks. To push updates to GitHub:

```bash
cd ~/Projects/setup
git add .
git commit -m "update workflow configs"
git push
```
