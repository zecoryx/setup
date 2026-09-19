### Yangi kompyuterda noldan o'rnatish:
1. Rasmiy Omarchy ISO orqali tizimni yuklang yoki toza Arch Linux o'rnatilgan tizimda quyidagi buyruqni bering:
   ```bash
   curl -sSL https://omarchy.org/install | bash
   ```
2. O'rnatish jarayonida o'zingizning apparat ta'minotingiz (Intel/AMD/Nvidia GPU) va kerakli xizmatlarni tanlaysiz.
3. Tizim o'rnatilgach, qayta yuklanadi (reboot).

### Barcha qo'shimcha paketlarni 1 ta buyruq bilan o'rnatish:
```bash
grep -v '^#' configs/packages-custom.txt | grep -v '^$' | xargs yay -S --needed
```

## 4. Shaxsiy Konfiguratsiyalar Xaritasi

`omarchy/configs/` papkasida saqlanayotgan barcha sozlamalar:

| Fayl | Joylashuv yo'li | Vazifasi |
|---|---|---|
| **`monitors.conf`** | `~/.config/hypr/monitors.conf` | Monitor 1.6 scaling va `GDK_SCALE=2` |
| **`input.conf`** | `~/.config/hypr/input.conf` | `caps:swapescape` (Caps Lock = Esc), touchpad natural scroll, sezgirlik |
| **`bindings.conf`** | `~/.config/hypr/bindings.conf` | Shaxsiy hotkeylar (Terminal, Tmux Work, 1Password, Spotify, Obsidian) |
| **`shell.json`** | `~/.config/omarchy/shell.json` | Yuqori panel vidjetlari: soat, ishchi stollar, tray, audio, internet |
| **`starship.toml`** | `~/.config/starship.toml` | Minimalist va tezkor terminal prompti |
| **`config.toml`** | `~/.config/mise/config.toml` | Dasturlash tillari va runtimelar |
| **`packages-custom.txt`** | `configs/packages-custom.txt` | Faqat Omarchy ustiga o'rnatiladigan maxsus paketlar |

---

## 5. Yangi Noutbukda Konfiguratsiyalarni Tiklash

Yangi kompyuterda Omarchy o'rnatilgach, butun muhitni tiklash:

```bash
# 1. Repositoriyani klonlash
git clone https://github.com/zecoryx/setup.git ~/Projects/setup

# 2. Omarchy sozlamalarini ulash (qo'shimcha dasturlari bilan birga)
cd ~/Projects/setup/omarchy
./install.sh --with-packages

# 3. Neovim va Tmux sozlamalarini ulash
cd ~/Projects/setup/vim
./install.sh
```
