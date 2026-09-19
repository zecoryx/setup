#!/usr/bin/env bash

set -e

GREEN="\033[0;32m"
BLUE="\033[0;34m"
YELLOW="\033[1;33m"
NC="\033[0m"

DOTFILES_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_DIR="${XDG_CONFIG_HOME:-$HOME/.config}"
BIN_DIR="$HOME/.local/bin"

mkdir -p "$CONFIG_DIR"
mkdir -p "$BIN_DIR"

# Check core CLI dependencies
missing_pkgs=()
for tool in nvim tmux fzf bat zoxide rg; do
    if ! command -v "$tool" &>/dev/null; then
        missing_pkgs+=("$tool")
    fi
done

if [ ${#missing_pkgs[@]} -gt 0 ]; then
    echo -e "${YELLOW}Missing tools: ${missing_pkgs[*]}${NC}"
    echo "Install via package manager:"
    if command -v pacman &>/dev/null; then
        echo "  sudo pacman -S neovim tmux fzf bat zoxide ripgrep fd"
    elif command -v apt-get &>/dev/null; then
        echo "  sudo apt install neovim tmux fzf bat zoxide ripgrep fd-find"
    elif command -v brew &>/dev/null; then
        echo "  brew install neovim tmux fzf bat zoxide ripgrep fd"
    fi
else
    echo -e "${GREEN}Core CLI tools: OK${NC}"
fi

# Create configuration symlinks
if [ -d "$CONFIG_DIR/nvim" ] && [ ! -L "$CONFIG_DIR/nvim" ]; then
    echo "Backing up existing ~/.config/nvim to ~/.config/nvim.backup"
    mv "$CONFIG_DIR/nvim" "$CONFIG_DIR/nvim.backup"
fi
rm -f "$CONFIG_DIR/nvim"
ln -s "$DOTFILES_DIR" "$CONFIG_DIR/nvim"
echo -e "${GREEN}Linked: ~/.config/nvim -> $DOTFILES_DIR${NC}"

mkdir -p "$CONFIG_DIR/tmux"
ln -sf "$DOTFILES_DIR/tmux/tmux.conf" "$CONFIG_DIR/tmux/tmux.conf"
echo -e "${GREEN}Linked: ~/.config/tmux/tmux.conf -> $DOTFILES_DIR/tmux/tmux.conf${NC}"

if [ -f "$DOTFILES_DIR/ghostty/config" ]; then
    mkdir -p "$CONFIG_DIR/ghostty"
    ln -sf "$DOTFILES_DIR/ghostty/config" "$CONFIG_DIR/ghostty/config"
    echo -e "${GREEN}Linked: ~/.config/ghostty/config -> $DOTFILES_DIR/ghostty/config${NC}"
fi

chmod +x "$DOTFILES_DIR/tmux/bin/tmux-session-manager"
ln -sf "$DOTFILES_DIR/tmux/bin/tmux-session-manager" "$BIN_DIR/tmux-session-manager"
ln -sf "$DOTFILES_DIR/tmux/bin/tmux-session-manager" "$BIN_DIR/tmux-sessionizer"
ln -sf "$DOTFILES_DIR/tmux/bin/tmux-session-manager" "$BIN_DIR/ts"
echo -e "${GREEN}Linked: ~/.local/bin/ts -> $DOTFILES_DIR/tmux/bin/tmux-session-manager${NC}"

# Setup Tmux plugin manager and plugins
TPM_DIR="$CONFIG_DIR/tmux/plugins/tpm"
if [ ! -d "$TPM_DIR" ]; then
    git clone https://github.com/tmux-plugins/tpm "$TPM_DIR"
fi

for plugin in tmux-sessionist tmux-resurrect tmux-continuum; do
    target_dir="$CONFIG_DIR/tmux/plugins/$plugin"
    if [ ! -d "$target_dir" ]; then
        git clone "https://github.com/tmux-plugins/$plugin" "$target_dir"
    fi
done
echo -e "${GREEN}Tmux plugins: OK${NC}"

# Sync Neovim plugins
if command -v nvim &>/dev/null; then
    nvim --headless "+Lazy! sync" +qa
    echo -e "${GREEN}Neovim plugins: OK${NC}"
else
    echo -e "${YELLOW}Neovim is not installed yet. Run 'nvim' once installed to sync plugins.${NC}"
fi

# Reload active tmux configuration
if [ -n "$TMUX" ]; then
    tmux source-file "$CONFIG_DIR/tmux/tmux.conf" 2>/dev/null || true
    echo -e "${GREEN}Active Tmux reloaded${NC}"
fi

echo -e "${GREEN}Setup completed successfully.${NC}"
