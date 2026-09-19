#!/usr/bin/env bash

set -e

GREEN="\033[0;32m"
BLUE="\033[0;34m"
YELLOW="\033[1;33m"
NC="\033[0m"

DOTFILES_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_DIR="${XDG_CONFIG_HOME:-$HOME/.config}"

echo -e "${BLUE}Setting up Omarchy custom configurations...${NC}"

# 1. Hyprland configuration overrides
mkdir -p "$CONFIG_DIR/hypr"
for f in monitors.conf input.conf bindings.conf; do
    ln -sf "$DOTFILES_DIR/configs/hypr/$f" "$CONFIG_DIR/hypr/$f"
    echo -e "${GREEN}Linked: ~/.config/hypr/$f${NC}"
done

# 2. Omarchy Shell configuration (Top Bar)
mkdir -p "$CONFIG_DIR/omarchy"
if [ -f "$DOTFILES_DIR/configs/omarchy/shell.json" ]; then
    ln -sf "$DOTFILES_DIR/configs/omarchy/shell.json" "$CONFIG_DIR/omarchy/shell.json"
    echo -e "${GREEN}Linked: ~/.config/omarchy/shell.json${NC}"
fi

# 3. Starship prompt configuration
if [ -f "$DOTFILES_DIR/configs/starship.toml" ]; then
    ln -sf "$DOTFILES_DIR/configs/starship.toml" "$CONFIG_DIR/starship.toml"
    echo -e "${GREEN}Linked: ~/.config/starship.toml${NC}"
fi

# 4. Mise development runtimes configuration
mkdir -p "$CONFIG_DIR/mise"
if [ -f "$DOTFILES_DIR/configs/mise/config.toml" ]; then
    ln -sf "$DOTFILES_DIR/configs/mise/config.toml" "$CONFIG_DIR/mise/config.toml"
    echo -e "${GREEN}Linked: ~/.config/mise/config.toml${NC}"
fi

# 5. Install custom packages added on top of Omarchy (optional: --with-packages)
if [ "$1" == "--with-packages" ]; then
    if command -v yay &>/dev/null; then
        echo -e "${BLUE}Installing custom user packages on top of Omarchy...${NC}"
        grep -v '^#' "$DOTFILES_DIR/configs/packages-custom.txt" | grep -v '^$' | xargs yay -S --needed --noconfirm
        echo -e "${GREEN}Custom packages: OK${NC}"
    else
        echo -e "${YELLOW}yay not found. Install custom packages manually from configs/packages-custom.txt${NC}"
    fi
fi

# 6. Install tools via Mise if available
if command -v mise &>/dev/null; then
    echo -e "${BLUE}Installing Mise development runtimes (Node, Bun, Go, GH, AI tools)...${NC}"
    mise install -y
    echo -e "${GREEN}Mise tools: OK${NC}"
fi

# 7. Apply Solitude theme if Omarchy CLI is available
if command -v omarchy-theme-set &>/dev/null; then
    omarchy-theme-set solitude
    echo -e "${GREEN}Theme set to Solitude${NC}"
fi

# 8. Reload Hyprland configuration
if command -v hyprctl &>/dev/null; then
    hyprctl reload 2>/dev/null || true
    echo -e "${GREEN}Hyprland reloaded${NC}"
fi

echo -e "${GREEN}Omarchy setup completed successfully.${NC}"
