# Neovim & Dev Muhiti Tuzilmasi va Tahrirlash Qo'llanmasi

Ushbu hujjat `setup/vim/` ichidagi barcha sozlamalar qanday tuzilgani, qaysi fayl nima vazifani bajarishi va kelgusida biror narsani o'zgartirish kerak bo'lganda uni qayerdan va qanday to'g'rilash mumkinligini tushuntiradi.

---

## 1. Umumiy Arxitektura va Papkalar Xaritasi

Barcha konfiguratsiyalar `~/Projects/setup/vim` ichida saqlanadi va operatsion tizimning `~/.config` papkasiga symlink (havola) qilingan:
* `~/.config/nvim` ──► `~/Projects/setup/vim`
* `~/.config/tmux/tmux.conf` ──► `~/Projects/setup/vim/tmux/tmux.conf`
* `~/.config/ghostty/config` ──► `~/Projects/setup/vim/ghostty/config`

> **Asosiy qoida:** `setup/vim/` ichidagi istalgan faylni tahrirlaganingizda, o'zgarishlar darhol butun tizimda ishlaydi. Alohida nusxa ko'chirib o'tirish shart emas.

```text
vim/
├── init.lua                   # Neovim start nuqtasi (options, lazy, keymaps'ni yuklaydi)
├── lazy-lock.json             # O'rnatilgan plaginlarning barqaror commit/versiyalari
├── install.sh                 # Yangi kompyuterda avtomatik o'rnatish skripti
├── README.md                  # Inglizcha umumiy yo'riqnoma
├── CHEATSHEET.md              # Barcha klaviatura tugmalari shpargalkasi
├── structure.md               # Ushbu tahrirlash qo'llanmasi
│
├── lua/
│   ├── config/                # Neovimning ichki shaxsiy sozlamalari
│   │   ├── options.lua        # Qator raqamlari, tablar, clipboard, xotira
│   │   ├── keymaps.lua        # Asosiy tugmalar birikmasi (splits, oil, buffers)
│   │   ├── lazy.lua           # Lazy.nvim plagin menejeri sozlamasi
│   │   └── autocmds.lua       # Avtomatik hodisalar (matndan nusxa olganda miltillash va h.k.)
│   │
│   └── plugins/               # Har bir plagin uchun alohida modulli fayllar
│       ├── lsp.lua            # Mason, nvim-lspconfig, til serverlari, auto-import va diagnostika
│       ├── colors.lua         # TailwindCSS va HEX/RGB ranglar prevyusi
│       ├── terminal.lua       # Snacks suzuvchi terminal
│       ├── oil.lua            # Oil.nvim — fayllar boshqaruvchisi
│       ├── snacks.lua         # Snacks.nvim — tezkor qidiruv (picker), lazygit
│       ├── ui.lua             # Vague tema, statusline, bufferline, which-key
│       ├── real_icons.lua     # Miguel Solorio'ning VSCode uslubidagi ikonkalar to'plami
│       ├── completion.lua     # Blink.cmp — kodni avtoto'ldirish tizimi
│       ├── formatting.lua     # Conform.nvim — avtomatik kod tekislash (Pint, Prettier)
│       ├── git.lua            # Gitsigns, Diffview, Octo (GitHub PR/Issues)
│       ├── editor.lua         # Flash, Undotree, Trouble, Yanky, Mini.pairs
│       └── treesitter.lua     # Kod ranglari va sintaksis daraxti
│
├── tmux/                      # Terminal multiplexer sozlamalari
│   ├── tmux.conf              # Tmux asosiy konfiguratsiyasi (prefix, splitlar, sessiyalar)
│   └── bin/
│       └── tmux-session-manager # Fzf asosidagi sessiyalar boshqaruvchisi
│
├── ghostty/                   # Ghostty terminal emulyatori
│   └── config                 # Shrift, fon shaffofligi, o'lchamlar
│
└── icons/                     # Maxsus ikonka paketlari
    └── vscode-symbols/
```

---

## 2. Asosiy Sozlamalarni Tahrirlash (`lua/config/`)

### `options.lua` (Vim xatti-harakatlari)
Agar indent (probellar soni), qator raqamlari yoki clipboardni o'zgartirmoqchi bo'lsangiz:
* **Fayl yo'li:** `lua/config/options.lua`
* **Nimalarni o'zgartirish mumkin:**
  - `opt.number = true` — Chapdagi qator raqamini yoqish/o'chirish.
  - `opt.relativenumber = true` — Nisbiy qator raqamlari.
  - `opt.tabstop = 4` va `opt.shiftwidth = 4` — Tab bosilganda nechta probel surilishi (masalan, PHP/Laravel uchun 4, JS uchun 2 qilish mumkin).
  - `opt.clipboard = "unnamedplus"` — Tizim (OS) xotirasi bilan nusxalashni birlashtirish.

### `keymaps.lua` (Tugmalar birikmasi)
Yangi qisqa tugma qo'shish yoki mavjudlarini o'zgartirish:
* **Fayl yo'li:** `lua/config/keymaps.lua`
* **Sintaksis:** `map("rejim", "bosiladigan_tugma", "bajariladigan_buyruq", { desc = "Izoh" })`
* **Rejimlar:**
  - `"n"` — Normal rejim (fayl ko'rilayotgan payt)
  - `"v"` / `"x"` — Visual rejim (matn belgilanganda)
  - `"i"` — Insert rejim (matn yozilayotganda)
  - `"t"` — Terminal rejim
* **Misol (Yangi tugma qo'shish):**
  ```lua
  -- Faylni tezda saqlash uchun Space + s qilish:
  map("n", "<leader>s", "<cmd>w<CR>", { desc = "Faylni saqlash" })
  ```

---

## 3. Plaginlarni Tahrirlash (`lua/plugins/`)

### 1. `terminal.lua` (Doimiy terminallar)
* **Vazifasi:** `Ctrl + \` bosilganda ekranning o'rtasida suzuvchi terminal chiqaradi. 1, 2, 3 raqamli terminallar jarayonni saqlab qoladi (`lazygit` yoki `php artisan` o'chmaydi).
* **Nimalarni o'zgartirish mumkin:**
  - `direction = "float"` — agar terminalni pastdan gorizontal chiqmoqchi qilsangiz, `"horizontal"` ga o'zgartirasiz.
  - `size` — gorizontal/vertikal terminal balandligi yoki eni.

### 2. `oil.lua` (Fayllar boshqaruvchisi)
* **Vazifasi:** Fayllar tuzilmasini oddiy matn faylidek tahrirlash (`Space + o` yoki `Space + e`).
* **Nimalarni o'zgartirish mumkin:**
  - `show_hidden = false` — nuqta bilan boshlanuvchi yashirin fayllar (masalan `.env`, `.gitignore`) standart holatda ko'rinmasligi. Uni `true` qilsangiz doim ko'rinadi.
  - `keymaps` blokida `Esc`, `Enter`, `q` harakatlarini o'zgartirish.

### 3. `snacks.lua` (Fayllar qidiruvi va Picker)
* **Vazifasi:** `Space + Space` (fayl qidirish), `Space + fg` (kod ichidan matn qidirish), indent chiziqlari, tasvir (rasm) ko'rish.
* **Nimalarni o'zgartirish mumkin:**
  - `hidden = false` — fayl qidirganda `.env` kabilarni qidiruvga qo'shish yoki qo'shmaslik.
  - `keys` bo'limida yangi qidiruv turlarini (masalan, diagnostika yoki buyruqlar tarixini) kiritish.

### 4. `ui.lua` (Tashqi ko'rinish, Tablar va Status Bar)
* **Vazifasi:** Rang mavzusi, tepada turuvchi ochiq fayllar paneli (`bufferline`), pastdagi qator (`lualine`) va qisqa tugmalar ko'rsatgichi (`which-key`).
* **Nimalarni o'zgartirish mumkin:**
  - Rang mavzusini almashtirish (hozirgi minimal `vague` o'rniga boshqa tema qo'yish).
  - `lualine` bo'limlarida qaysi ma'lumotlar (git branch, fayl nomi, xatolar soni) ko'rinishini tanlash.
  - `which-key.nvim` dagi guruhlar nomlarini o'zgartirish.

### 5. `formatting.lua` (Kodni tekislash — Format on Save)
* **Vazifasi:** Fayl saqlanganda (`:w`) avtomatik kodni tartibga solish (`conform.nvim`).
* **Qo'llab-quvvatlanadigan formatlagichlar:**
  - PHP: `pint` (Laravel)
  - JavaScript / TypeScript: `prettier`
  - Lua: `stylua`
* **Qanday o'zgartiriladi:**
  - Agar faylni saqlaganda avtomatik tekislanishini xohlamasangiz, `format_on_save` blokini o'chirishingiz yoki `timeout_ms` ni o'zgartirishingiz mumkin.

### 6. `lsp.lua` (LSP, Mason va Diagnostika)
* **Vazifasi:** TypeScript, React, TailwindCSS, HTML, CSS, JSON va Lua uchun to'liq til serverlarini (LSP) o'rnatish va sozlash.
  - `gd` — Go to Definition
  - `K` — Hover documentation
  - `Space + ca` — Code Action (auto-import va tezkor tuzatish)
  - `Space + cr` — Rename symbol
  - `[d` / `]d` — Oldingi/keyingi diagnostika xatosi
  - Real-time qizil/sariq xatolik belgilari va chiziqlari.

### 7. `colors.lua` (TailwindCSS va Ranglar Prevyusi)
* **Vazifasi:** `nvim-highlight-colors` orqali kod ichidagi barcha TailwindCSS rang sinflari (masalan `bg-red-500`, `text-sky-400`) va HEX/RGB kodlarini real rangli fon bilan bo'yab ko'rsatish.

### 8. `completion.lua` (Blink.cmp avtoto'ldirish)
* **Vazifasi:** Kod yozayotganda LSP, snippetlar, fayl yo'llari va bufer so'zlaridan tezkor takliflar (IntelliSense), auto-import va parametrlar yordamchisi chiqarib berish.
* **Nimalarni o'zgartirish mumkin:**
  - `sources.default` da qaysi manbalar ishlashi (`lsp`, `path`, `snippets`, `buffer`).
  - Taklif oynasidagi tugmalar: `Enter` qabul qiladi, `Tab` keyingisiga o'tadi, `Ctrl + Space` takliflarni majburiy chaqiradi.

### 7. `git.lua` (Git va GitHub vositalari)
* **Vazifasi:**
  - `gitsigns` — kod qatori yonida qo'shilgan/o'chirilgan belgilar (yashil/qizil chiziqlar).
  - `diffview` — git commitlar va branchlarni yonma-yon solishtirish (`Space + gd`).
  - `octo` — Neovim ichidan GitHub PR va Issue'larni boshqarish (`Space + gp`).
  - `git-conflict` — Merge konfliktlarni tugma bilan yechish (`co`, `ct`, `cb`).

### 8. `editor.lua` (Harakat va Tarix)
* **Vazifasi:**
  - `flash.nvim` — ekrandagi istalgan joyga `s` bosib 2 ta harf bilan sakrash.
  - `undotree` — barcha o'zgarishlar daraxti (`Space + u`).
  - `trouble.nvim` — kod xatolari va funksiyalar ro'yxati (`Space + xx`, `Space + cs`).
  - `grug-far.nvim` — butun loyiha bo'yicha so'zni topib ommaviy almashtirish (`Space + sr`).
  - `yanky.nvim` — nusxalash tarixi (`p` dan keyin `Ctrl + p` bosib avvalgi nusxalanganlarni ko'rish).

---

## 4. Yangi Plagin Qo'shish yoki O'chirish

Plaginlarni boshqarish juda oson qilingan, chunki har bir plagin alohida faylda turadi:

### Yangi plagin qo'shish:
1. `setup/vim/lua/plugins/` ichida yangi `.lua` fayl oching (masalan: `my_plugin.lua`).
2. Ichiga plaginning GitHub manzilini va sozlamasini yozing:
   ```lua
   return {
     {
       "muallif/plagin-nomi.nvim",
       event = "VeryLazy",
       opts = {},
     },
   }
   ```
3. Neovimni qayta oching — `lazy.nvim` yangi plaginni avtomatik internetdan yuklab oladi.

### Plaginni o'chirish:
* O'sha plagin turgan faylni `lua/plugins/` ichidan o'chirib tashlang yoki fayl ichidagi qismini olib tashlang.
* Neovimda `:Lazy clean` buyrug'ini bering — diskdagi keraksiz fayllar o'chiriladi.

---

## 5. Tmux Sozlamalarini Tahrirlash (`tmux/tmux.conf`)

* **Fayl yo'li:** `setup/vim/tmux/tmux.conf`
* **Nimalarni o'zgartirish mumkin:**
  - `set -g prefix C-Space` — Asosiy prefix tugmasi (hozirda `Ctrl + Space`).
  - `bind v split-window -h` — Vertikal split tugmasi.
  - `bind h split-window -v` — Gorizontal split tugmasi.
  - `status-style` — Pastdagi panel rangi (Vague temasi asosida sozlangan).
* **O'zgarishlarni darhol qo'llash:**
  Tmux ichida turib quyidagi buyruqni bering:
  ```bash
  tmux source-file ~/.config/tmux/tmux.conf
  ```

---

## 6. Ghostty Sozlamalarini Tahrirlash (`ghostty/config`)

* **Fayl yo'li:** `setup/vim/ghostty/config`
* **Nimalarni o'zgartirish mumkin:**
  - `font-family` — Terminal shrifti (masalan: JetBrains Mono Nerd Font).
  - `font-size` — Shrift kattaligi (masalan: `13`).
  - `theme` — Rang sxemasi.
  - `background-opacity` — Terminal foni shaffofligi (masalan: `0.95`).

---
