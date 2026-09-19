# Omarchy O'rnatish va Sozlamalar Qo'llanmasi

Ushbu qo'llanma **Omarchy** tizimini yangi kompyuterda o'rnatish, tizimga qo'shimcha ravishda o'rnatilgan paketlarni aniqlash va shaxsiy konfiguratsiyalarni qayta tiklash uchun mo'ljallangan.

---

## 1. Omarchy Nima va Qanday O'rnatiladi?

**Omarchy** — bu Arch Linux asosida qurilgan, Wayland (`Hyprland`), `Quickshell` va avtomatlashtirilgan mavzular dvigateliga ega zamonaviy desktop muhitidir.

### Yangi kompyuterda noldan o'rnatish:
1. Rasmiy Omarchy ISO orqali tizimni yuklang yoki toza Arch Linux o'rnatilgan tizimda quyidagi buyruqni bering:
   ```bash
   curl -sSL https://omarchy.org/install | bash
   ```
2. O'rnatish jarayonida o'zingizning apparat ta'minotingiz (Intel/AMD/Nvidia GPU) va kerakli xizmatlarni tanlaysiz.
3. Tizim o'rnatilgach, qayta yuklanadi (reboot).

---

## 2. Omarchy Standart Beradigan vs Qo'lda O'rnatilgan Paketlar

> **Muhim:** Omarchy o'rnatilganda Hyprland, Quickshell, Docker, Git, Tmux, Fzf, Zoxide, Ripgrep, Pipewire audio va asosiy drayverlar **avtomatik o'rnatiladi**. Ularni qayta o'rnatish shart emas!

Faqatgina Omarchy ustiga **tanlab olingan zarur paketlar** [packages-custom.txt](configs/packages-custom.txt) faylida toifalarga ajratilgan:

### 1) Ma'lumotlar Bazasi
* `postgresql`

### 2) Tahrirlovchi & Terminal Dasturlari
* `neovim` (Asosiy kod muharriri)
* `ghostty` (GPU terminal)
* `yazi` va `chafa` (Terminal fayllar menejeri va rasm ko'ruvchi)
* `zsh-autosuggestions` (Zsh buyruqlar avtotaklif)
* `github-cli` (`gh`) va `gemini-cli`
* `termius` (SSH client)

### 3) Kundalik Ish va Muloqot Ilovalari
* `zen-browser-bin` (Zen brauzer)
* `notion-app-electron` (Notion)
* `ayugram-desktop-bin` (AyuGram / Telegram)
* `wps-office` (WPS Office)
* `obsidian` (Eslatmalar va bilimlar bazasi)

### 4) Uskuna & Xavfsizlik Yordamchilari
* `fprintd` va `libfprint` (Noutbuk barmoq izi skaneri)
* `copyq` (Clipboard tarixi)
* `libqalculate` (Kalkulyator dvigateli)
* `porty-bin` (Port forwarding)
* `webcamoid` (Webcam boshqaruvi)
* `minecraft-launcher`

### Barcha qo'shimcha paketlarni 1 ta buyruq bilan o'rnatish:
```bash
grep -v '^#' configs/packages-custom.txt | grep -v '^$' | xargs yay -S --needed
```

---

## 3. Dasturlash Tillari va CLI Vositalari (`mise`)

`configs/mise/config.toml` fayli orqali quyidagi dasturlar versiyalari boshqariladi:
- **Runtimes**: `bun`, `node`, `go`.
- **AI CLI**: `claude`, `codex`, `opencode`.
- **GitHub**: `gh`.

Ular `install.sh` skripti orqali `mise install -y` buyrug'i bilan avtomatik o'rnatiladi.

---

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
