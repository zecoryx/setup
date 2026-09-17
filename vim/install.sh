#!/usr/bin/env bash

set -e

# Colors
GREEN="\033[0;32m"
BLUE="\033[0;34m"
YELLOW="\033[1;33m"
CYAN="\033[0;36m"
NC="\033[0m"

echo -e "${CYAN}====================================================${NC}"
echo -e "${CYAN}   🚀 SWE Master Setup Installer (Neovim + Tmux + Ghostty)   ${NC}"
echo -e "${CYAN}====================================================${NC}\n"

DOTFILES_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_DIR="${XDG_CONFIG_HOME:-$HOME/.config}"
BIN_DIR="$HOME/.local/bin"

mkdir -p "$CONFIG_DIR"
mkdir -p "$BIN_DIR"

# 1. Check Package Manager & Core Tools
echo -e "${BLUE}[1/5] Checking core CLI tools...${NC}"
missing_pkgs=()
for tool in nvim tmux fzf bat zoxide rg; do
    if ! command -v "$tool" &>/dev/null; then
        missing_pkgs+=("$tool")
    fi
done

if [ ${#missing_pkgs[@]} -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Missing tools: ${missing_pkgs[*]}${NC}"
    echo -e "Please install them via your package manager:"
    if command -v pacman &>/dev/null; then
        echo -e "  👉 sudo pacman -S neovim tmux fzf bat zoxide ripgrep fd"
    elif command -v apt-get &>/dev/null; then
        echo -e "  👉 sudo apt install neovim tmux fzf bat zoxide ripgrep fd-find"
    elif command -v brew &>/dev/null; then
        echo -e "  👉 brew install neovim tmux fzf bat zoxide ripgrep fd"
    fi
else
    echo -e "${GREEN}✓ All core CLI tools are installed!${NC}"
fi

# 2. Symlink Configs
echo -e "\n${BLUE}[2/5] Creating configuration symlinks...${NC}"

# Neovim
if [ -d "$CONFIG_DIR/nvim" ] && [ ! -L "$CONFIG_DIR/nvim" ]; then
    echo -e "${YELLOW}Backing up existing ~/.config/nvim to ~/.config/nvim.backup${NC}"
    mv "$CONFIG_DIR/nvim" "$CONFIG_DIR/nvim.backup"
fi
rm -f "$CONFIG_DIR/nvim"; ln -s "$DOTFILES_DIR" "$CONFIG_DIR/nvim"
echo -e "${GREEN}✓ Linked ~/.config/nvim -> $DOTFILES_DIR${NC}"

# Tmux
mkdir -p "$CONFIG_DIR/tmux"
ln -sf "$DOTFILES_DIR/tmux/tmux.conf" "$CONFIG_DIR/tmux/tmux.conf"
echo -e "${GREEN}✓ Linked ~/.config/tmux/tmux.conf -> $DOTFILES_DIR/tmux/tmux.conf${NC}"

# Ghostty
if [ -f "$DOTFILES_DIR/ghostty/config" ]; then
    mkdir -p "$CONFIG_DIR/ghostty"
    ln -sf "$DOTFILES_DIR/ghostty/config" "$CONFIG_DIR/ghostty/config"
    echo -e "${GREEN}✓ Linked ~/.config/ghostty/config -> $DOTFILES_DIR/ghostty/config${NC}"
fi

# Scripts
chmod +x "$DOTFILES_DIR/tmux/bin/tmux-session-manager"
ln -sf "$DOTFILES_DIR/tmux/bin/tmux-session-manager" "$BIN_DIR/tmux-session-manager"
ln -sf "$DOTFILES_DIR/tmux/bin/tmux-session-manager" "$BIN_DIR/tmux-sessionizer"
ln -sf "$DOTFILES_DIR/tmux/bin/tmux-session-manager" "$BIN_DIR/ts"
echo -e "${GREEN}✓ Linked scripts in ~/.local/bin/ (ts, tmux-sessionizer, tmux-session-manager)${NC}"

# 3. Tmux Plugins (TPM)
echo -e "\n${BLUE}[3/5] Setting up Tmux Plugins (TPM)...${NC}"
TPM_DIR="$CONFIG_DIR/tmux/plugins/tpm"
if [ ! -d "$TPM_DIR" ]; then
    echo "Cloning TPM (Tmux Plugin Manager)..."
    git clone https://github.com/tmux-plugins/tpm "$TPM_DIR"
fi

SESSIONX_DIR="$CONFIG_DIR/tmux/plugins/tmux-sessionist"
if [ ! -d "$SESSIONX_DIR" ]; then
    echo "Cloning tmux-plugins/tmux-sessionist..."
    git clone https://github.com/tmux-plugins/tmux-sessionist "$SESSIONX_DIR"
fi

RESURRECT_DIR="$CONFIG_DIR/tmux/plugins/tmux-resurrect"
if [ ! -d "$RESURRECT_DIR" ]; then
    echo "Cloning tmux-plugins/tmux-resurrect..."
    git clone https://github.com/tmux-plugins/tmux-resurrect "$RESURRECT_DIR"
fi

CONTINUUM_DIR="$CONFIG_DIR/tmux/plugins/tmux-continuum"
if [ ! -d "$CONTINUUM_DIR" ]; then
    echo "Cloning tmux-plugins/tmux-continuum..."
    git clone https://github.com/tmux-plugins/tmux-continuum "$CONTINUUM_DIR"
fi
echo -e "${GREEN}✓ Tmux plugins installed and ready!${NC}"

# 4. Neovim Plugins (Lazy Sync)
echo -e "\n${BLUE}[4/5] Syncing Neovim Plugins via Lazy...${NC}"
if command -v nvim &>/dev/null; then
    nvim --headless "+Lazy! sync" +qa
    echo -e "${GREEN}✓ All Neovim plugins synced successfully!${NC}"
else
    echo -e "${YELLOW}⚠️  Neovim is not installed yet. Run 'nvim' once after installing to trigger plugin sync.${NC}"
fi

# 5. Reload active Tmux session if running
if [ -n "$TMUX" ]; then
    tmux source-file "$CONFIG_DIR/tmux/tmux.conf" 2>/dev/null || true
    echo -e "${GREEN}✓ Active Tmux configuration reloaded!${NC}"
fi

echo -e "\n${GREEN}====================================================${NC}"
echo -e "${GREEN}   ✨ SETUP SUCCESSFULLY COMPLETED! ✨             ${NC}"
echo -e "${GREEN}====================================================${NC}"
echo -e "📖 For all keybindings and workflow guide, check:"
echo -e "   ${CYAN}$DOTFILES_DIR/CHEATSHEET.md${NC}\n"
