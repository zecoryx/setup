# Loyiha Tuzilmasi va Tahrirlash Qo'llanmasi

Ushbu qo'llanma `setup/vim/` arxitekturasi, har bir fayl va papkaning vazifasi hamda konfiguratsiyalarni xavfsiz tahrirlash, yangi plaginlar qo'shish yoki o'chirish, Tmux va Ghostty sozlamalarini moslashtirish bo'yicha to'liq qo'llanmadir.

Tugmalar birikmasi va buyruqlar shpargalkasi uchun [CHEATSHEET.md](CHEATSHEET.md) fayliga qarang.

---

## 1. Umumiy Arxitektura va Fayllar Xaritasi

Muhit sozlamalari markazlashgan holda `~/Projects/setup/vim` katalogida joylashgan bo'lib, tizimdagi standart konfiguratsiya yo'llariga symlink qilingan:
- `~/.config/nvim` -> `~/Projects/setup/vim`
- `~/.config/tmux/tmux.conf` -> `~/Projects/setup/vim/tmux/tmux.conf`
- `~/.config/ghostty/config` -> `~/Projects/setup/vim/ghostty/config`
- `~/.local/bin/ts` -> `~/Projects/setup/vim/tmux/bin/tmux-session-manager`

Repositorydagi istalgan fayl tahrirlanganda o'zgarishlar darhol tegishli dasturda aks etadi.

```text
setup/vim/
├── init.lua                               # Neovim boshlang'ich nuqtasi (options, lazy, keymaps)
├── lazy-lock.json                         # Barcha plaginlarning barqaror commit hash xaritasi
├── install.sh                             # Yangi tizimda bir buyruq bilan sozlash skripti
├── README.md                              # Loyiha haqida qisqacha ma'lumot
├── CHEATSHEET.md                          # Klaviatura tugmalari shpargalkasi
├── structure.md                           # Arxitektura va tahrirlash qo'llanmasi
│
├── lua/
│   ├── config/                            # Neovim asosiy sozlamalari
│   │   ├── options.lua                    # Redaktor xatti-harakatlari va vim optsiyalar
│   │   ├── lazy.lua                       # lazy.nvim plagin menejerini initsializatsiya qilish
│   │   └── keymaps.lua                    # Global tugmalar birikmasi (navigatsiya, splitlar, bufferlar)
│   │
│   └── plugins/                           # Modulli plagin sozlamalari (har biri alohida kategoriya)
│       ├── ui.lua                         # Vague mavzusi, statusline, indentatsiya, animatsiyalar
│       ├── oil.lua                        # Bufer asosidagi fayllar boshqaruvchisi
│       ├── snacks.lua                     # Fuzzy finder, live grep, fayllar qidiruvi va UI vositalari
│       ├── lsp.lua                        # Mason, nvim-lspconfig, til serverlari va diagnostika
│       ├── completion.lua                 # Blink.cmp avtoto'ldirish dvigateli
│       ├── treesitter.lua                 # Sintaksisni ranglash va AST tahlili
│       ├── formatting.lua                 # Conform.nvim avtomatik kod tekislash (format on save)
│       ├── git.lua                        # Gitsigns git holati, diff va o'zgarishlar
│       ├── editor.lua                     # Qavslarni juftlash va Flash sakrash
│       └── colors.lua                     # Rang kodlari va TailwindCSS klasslari prevyusi
│
├── tmux/
│   ├── tmux.conf                          # Tmux server va oynalar boshqaruvi sozlamalari
│   └── bin/
│       └── tmux-session-manager           # Loyihalar va sessiyalar o'rtasida fzf orqali tezkor o'tish
│
└── ghostty/
    └── config                             # Ghostty terminal emulyatori sozlamalari (shrift, mavzu)
```

---

## 2. Fayllar va Ularning Aniq Vazifalari

### Asosiy Fayllar (Root)
- **`init.lua`**: Neovim yuklanayotganda birinchi bo'lib ishga tushadi. Leader tugmasini (`Space`) belgilaydi va qat'iy tartibda uchta modulni yuklaydi: `config.options`, `config.keymaps` va `config.lazy`.
- **`lazy-lock.json`**: `lazy.nvim` tomonidan avtomatik boshqariladi. O'rnatilgan har bir plaginning aniq Git commit identifikatorini saqlaydi. Bu boshqa mashinada `install.sh` ishga tushirilganda aynan bir xil versiyalar o'rnatilishini kafolatlaydi.
- **`install.sh`**: Yangi kompyuterda yoki yangi muhitda CLI vositalarini tekshiradi, symlinklarni ulaydi, TPM plaginlarini yuklab oladi va Neovim plaginlarini boshlang'ich sinxronizatsiya qiladi.

### Asosiy Sozlamalar (`lua/config/`)
- **`options.lua`**: Vimning asosiy harakatlarini belgilaydi: 4 bo'shliqli tablar (`tabstop = 4`, `shiftwidth = 4`, `expandtab = true`), qator raqamlari (`number`, `relativenumber`), tizim clipboard integratsiyasi (`unnamedplus`), kursor harakati, vaqtinchalik swap fayllarini o'chirish va undofile orqali o'zgarishlar tarixini doimiy saqlash.
- **`lazy.lua`**: `lazy.nvim` plagin menejerining bootstrap qismi. Agar plagin menejeri diskda bo'lmasa, uni avtomatik yuklab oladi va `lua/plugins/` papkasidagi barcha modullarni avtomatik skanerlash qilib ulaydi.
- **`keymaps.lua`**: Plaginlarga bog'liq bo'lmagan yoki umumiy tizim miqyosidagi global tugmalar: oyna ajratish `<leader>w` guruhi ostida (`wv`, `wh`, `wx`, `wz`, `w=`) va o'lchamlash, bufer/tablar o'rtasida navigatsiya (`H`/`L`), qidiruv highlightini `Esc` bilan tozalash, visual rejimda qatorlarni ko'chirish (`J`/`K`) va Oil chaqiruvlari (`-`, `<leader>o`, `<leader>e`).

### Plaginlar Modullari (`lua/plugins/`)
- **`ui.lua`**: Vizual ko'rinish va ergonomika:
  - `vague.nvim`: Ranglar palitrasi (colorscheme).
  - `lualine.nvim`: Global statusline (rejim, fayl nomi, diagnostika, git branch, qator raqami).
  - `nvim-web-devicons`: Fayl ikonkalari va loyihaga xos override'lar (`package.json`, `artisan`, `.env` ...).
  - `vim-tmux-navigator`: `Ctrl+h/j/k/l` bilan Neovim splitlari va tmux panellari orasida uzluksiz harakat.
  - `which-key.nvim`: `<leader>` bosilganda tugmalar menyusi.
- **`oil.lua`**: Fayllar tizimini xuddi oddiy Vim buferi kabi tahrirlash imkonini beradi (`-` tugmasi). Fayllarni qayta nomlash, ko'chirish yoki o'chirish to'g'ridan-to'g'ri matn tahriri orqali bajariladi.
- **`snacks.lua`**: Eng katta modul. Fuzzy picker `<leader>s` guruhi ostida: `sf` fayl nomi, `sb` ochiq fayllar, `ss` loyiha matni, `s/` ochiq fayllar matni. `<leader>s` bosilganda which-key menyusi o'zi chiqadi. Shuningdek: suzuvchi terminal (`Ctrl+\`), LazyGit (`<leader>gg`), rasm prevyusi (`<leader>i`), notifier, indent chiziqlari va `bigfile` optimizatsiyasi.

  > Tugmalar ataylab bitta harf: `<leader>` ostida **bitta ham** 'ham mapping, ham prefiks' holati qolmagan, shuning uchun hech bir tugma `timeoutlen` (300ms) kutmaydi.
- **`lsp.lua`**: Til serverlari ekotizimi:
  - `mason.nvim` va `mason-lspconfig.nvim`: Serverlarni avtomatik o'rnatish va boshqarish.
  - `ensure_installed` ro'yxati: `ts_ls`, `tailwindcss`, `html`, `cssls`, `jsonls`, `lua_ls`.
  - **Muhim**: `mason-lspconfig` v2 serverlarni o'zi yoqadi va eski `handlers = {}` optsiyasini
    qo'llamaydi. Shuning uchun har bir server sozlamasi `vim.lsp.config("<server>", {...})`
    orqali beriladi (`lsp.lua` oxiridagi blok), `require("lspconfig")[...].setup()` orqali emas.
    `blink.cmp` capabilities'i `vim.lsp.config("*", {...})` bilan hammasiga ulanadi.
  - Kod diagnostikasi (xatolar, ogohlantirishlar), inlay hints (`<leader>th`) va float oynalar.
- **`completion.lua`**: `blink.cmp` yuqori unumdorlikka ega avtoto'ldirish dvigateli. LSP, snippetlar, buferdagi so'zlar va fayl yo'llarini birlashtiradi.
- **`treesitter.lua`**: Kod sintaksisini daraxt ko'rinishida tahlil qiladi (AST). Ranglash uchun asosiy dvigatel. `main` branch ishlatiladi va 14 til parseri avtomatik o'rnatiladi.
- **`formatting.lua`**: `conform.nvim` yordamida faylni saqlash vaqtida avtomatik formatlash (`format_on_save`). Har bir til uchun kerakli formatlagichni ulaydi: `prettierd`/`prettier` (JS, TS, JSON, HTML, CSS), `pint` (PHP), `stylua` (Lua).
- **`git.lua`**: ikki plagin:
  - `gitsigns.nvim`: chap chekkada qo'shilgan/o'zgartirilgan/o'chirilgan qatorlar, inline blame va hunk boshqaruvi (`]c`, `<leader>gp`, `<leader>gs`).
  - `diffview.nvim`: o'zgarishlarni yonma-yon taqqoslash va fayl tarixi (`<leader>gd`, `<leader>gh`) - **agent yozgan kodni review qilish uchun asosiy vosita**.
- **`editor.lua`**: Matn tahrirlash qulayliklari:
  - `mini.pairs`: Qavslar va qo'shtirnoqlarni avtomatik juftlash.
  - `flash.nvim`: `s` bilan ekrandagi istalgan joyga sakrash.
  - `flash.nvim`: `s` bilan ekrandagi istalgan joyga ikki harfda sakrash.
- **`colors.lua`**: Kod ichidagi HEX, RGB rang kodlari va TailwindCSS rangli klasslarining orqa fonini mos rangda bo'yab ko'rsatish (`nvim-highlight-colors`).

### Tmux Muhiti (`tmux/`)
- **`tmux.conf`**: `is_vim` sharti yordamida `Ctrl+h/j/k/l` (navigatsiya) va `Shift+strelka`
  (o'lcham) **qaysi qatlamda turganingizga qarab** ishlaydi: nvim ichida nvim splitini,
  shellda tmux panelini. Prefiks tugmasini `Ctrl+Space`ga o'rnatadi, intuitiv splitlar (`v` vertikal, `h` gorizontal), oynalar o'rtasida o'tish, Neovim va Tmux o'rtasida to'siqsiz harakat (`Ctrl+h/j/k/l`), sessiya menejeri popup'i (`Prefix + f`), TPM plaginlari va Vague mavzusidagi status paneli.
- **`tmux-session-manager`**: `fzf` asosidagi skript. Ochiq tmux sessiyalari va `~/Projects` katalogidagi loyihalar ro'yxatini chiqarib, ularga darhol ulanish, yangi sessiya ochish yoki o'chirish imkonini beradi.

### Ghostty Muhiti (`ghostty/`)
- **`config`**: Terminal shrifti, o'lchami, ranglar mavzusi, orqa fon shaffofligi va oyna chekka bo'shliqlarini (padding) belgilaydi.

---

## 3. Asosiy Sozlamalarni Tahrirlash

### Neovim parametrlarini o'zgartirish (`lua/config/options.lua`)
Redaktor harakati va tashqi ko'rinishiga oid barcha standart parametrlar shu yerda sozlanadi:
- Tab hajmini o'zgartirish:
  ```lua
  opt.shiftwidth = 2 -- hozirgi standart 4; 2 ta probel kerak bo'lsa
  opt.tabstop = 2
  ```
- Nisbiy raqamlarni yoqish/o'chirish:
  ```lua
  opt.relativenumber = true -- faqat oddiy raqamlar kerak bo'lsa false qilinadi
  ```
- Kursor atrofida ko'rinadigan qatorlar zaxirasi:
  ```lua
  opt.scrolloff = 16 -- kursordan pastda va tepada kamida 16 qator doim ko'rinadi
  ```

### Tugmalar birikmasini o'zgartirish (`lua/config/keymaps.lua`)
Yangi klaviatura yorliqlari `vim.keymap.set` orqali qo'shiladi:
```lua
-- Format: vim.keymap.set(rejim, tugma, buyruq, optsiyalar)
-- Rejimlar: 'n' (normal), 'i' (insert), 'v' (visual), 'x' (visual block)

-- Misol: Yangi fayl ochish uchun tezkor tugma
vim.keymap.set("n", "<leader>fn", "<cmd>enew<cr>", { desc = "New empty buffer" })

-- Misol: Butun matnni tanlash
vim.keymap.set("n", "<C-a>", "ggVG", { desc = "Select all" })
```

---

## 4. Plaginlar Bilan Ishlash (lazy.nvim)

Barcha plaginlar `lua/plugins/` katalogidagi fayllar orqali deklarativ tarzda boshqariladi.

### Yangi plagin qo'shish

1. `lua/plugins/` papkasida yangi `.lua` fayl yarating (masalan, `lua/plugins/database.lua`) yoki mos mavzudagi mavjud faylga qo'shing.
2. Quyidagi standart Lazy spec strukturasidan foydalaning:

```lua
return {
  "kristijanhusak/vim-dadbod-ui",
  dependencies = {
    { "tpope/vim-dadbod", lazy = true },
    { "kristijanhusak/vim-dadbod-completion", ft = { "sql", "mysql", "plsql" }, lazy = true },
  },
  cmd = {
    "DBUI",
    "DBUIToggle",
    "DBUIAddConnection",
    "DBUIFindBuffer",
  },
  init = function()
    vim.g.db_ui_use_nerd_fonts = 1
  end,
}
```

3. Plagin parametrlari turlari:
   - `lazy = true`: Plagin darhol emas, talab qilinganda yuklanadi.
   - `event = "BufReadPost"`: Fayl ochilganda yuklanadi.
   - `cmd = { "Command" }`: Ko'rsatilgan buyruq terilganda yuklanadi.
   - `keys = { { "<leader>x", "<cmd>...", desc = "..." } }`: Tugma bosilganda yuklanadi.
   - `opts = { ... }`: Plaginning `setup(opts)` funksiyasiga uzatiladigan parametrlar.
   - `config = function(_, opts) ... end`: Maxsus sozlash logikasi kerak bo'lganda.

4. Faylni saqlang va Neovimda plaginni o'rnating:
   - Neovimni qayta ishga tushiring yoki buyruq bering:
     ```text
     :Lazy
     ```
   - Yangi plagin avtomatik yuklab olinadi va o'rnatiladi.

### Plaginni o'chirish yoki vaqtincha to'xtatish

- **Vaqtincha o'chirish:** Plagin konfiguratsiyasiga `enabled = false` qatorini qo'shing:
  ```lua
  return {
    "folke/todo-comments.nvim",
    enabled = false, -- plagin yuklanmaydi
  }
  ```
- **Butunlay olib tashlash:**
  1. `lua/plugins/` ichidagi tegishli faylni yoki plagin blokini o'chiring.
  2. Neovim ichida quyidagi buyruqni bering:
     ```text
     :Lazy clean
     ```
  3. `lazy.nvim` keraksiz fayllarni diskdan xavfsiz o'chiradi.

---

## 5. Tmux Sozlamalarini Tahrirlash

Tmux konfiguratsiyasi `tmux/tmux.conf` faylida saqlanadi.

### Asosiy sozlamalar yo'nalishi
- **Prefiks tugmasi**: Standart `Ctrl+Space` etib belgilangan:
  ```tmux
  unbind C-b
  set -g prefix C-Space
  bind C-Space send-prefix
  ```
- **Yangi tugmalar biriktirish**:
  ```tmux
  # Yangi oynani joriy katalogda ochish
  bind c new-window -c "#{pane_current_path}"
  
  # Maxsus buyruqni ishga tushirish tugmasi
  bind g new-window -c "#{pane_current_path}" "lazygit"
  ```
- **Status panel ranglari**:
  Pastki status panel Vague mavzusidagi `#141415`, `#252530` va `#6e94b2` ranglariga sozlangan. Formatni o'zgartirish uchun `status-left` va `status-right` qatorlarini tahrirlang.

### O'zgarishlarni qo'llash (Reload)
Konfiguratsiya tahrirlangach, Tmuxni butunlay yopish shart emas:
- Tmux ichida buyruq satrida:
  ```text
  Ctrl+Space keyin :source-file ~/.config/tmux/tmux.conf
  ```
- Yoki terminal buyrug'i orqali:
  ```bash
  tmux source-file ~/.config/tmux/tmux.conf
  ```

### Tmux Session Manager skriptini moslashtirish (`tmux/bin/tmux-session-manager`)
Ushbu skript loyihalarni `~/Projects` papkasidan qidiradi.
- Agar boshqa papkalarni ham qidiruvga qo'shmoqchi bo'lsangiz, `get_list()` funksiyasi ichidagi `find` qatorini kengaytiring:
  ```bash
  find ~/Projects ~/Work ~/Personal -mindepth 1 -maxdepth 1 -type d 2>/dev/null
  ```

---

## 6. Ghostty Sozlamalarini Tahrirlash

Ghostty konfiguratsiyasi `ghostty/config` faylida saqlanadi.

### Keng tarqalgan parametrlarni o'zgartirish
- **Shrift va uning o'lchami**:
  ```ini
  font-family = "JetBrainsMono Nerd Font"
  font-size = 14
  ```
- **Mavzu va ranglar**: ranglar bu fayldan **emas**, omarchy'dan keladi:
  ```ini
  config-file = ?"~/.local/state/omarchy/current/theme/ghostty.conf"
  ```
  Ya'ni terminal ranglarini `omarchy-theme-set` almashtiradi. Qo'lda qat'iy mavzu
  qo'ymoqchi bo'lsangiz, avval shu `config-file` qatorini olib tashlang, aks holda
  omarchy mavzusi ustidan yozadi. Neovim (`vague`) va tmux status paneli esa o'z
  ranglarini alohida saqlaydi — omarchy mavzusi ularni o'zgartirmaydi.
- **Shaffoflik va chekka bo'shliqlar**:
  ```ini
  background-opacity = 0.95
  window-padding-x = 12
  window-padding-y = 12
  ```
- **Kursor stili**: configda faqat `cursor-style-blink = false` bor.
  `cursor-style`ning default'i allaqachon `block`, shuning uchun uni yozish shart emas:
  ```ini
  cursor-style-blink = false
  # boshqa shakl kerak bo'lsa: cursor-style = bar | underline
  ```

- **Shell**: configda `command` **ataylab yo'q**. Ghostty `/etc/passwd`dagi shellni
  (`/usr/bin/zsh`) **login shell** sifatida ishga tushiradi. `command = /usr/bin/zsh`
  deb yozsangiz u login bo'lmaydi va `/etc/profile` sourcelanmaydi — tmux esa login
  shell beradi, natijada tmux ichidagi va tashqarisidagi muhit farq qiladi.

### O'zgarishlarni tekshirish
Ghostty odatda `ghostty/config` faylidagi o'zgarishlarni saqlangandan so'ng darhol qayta yuklaydi. Agar avtomatik qo'llanmasa, yangi oyna ochish (`Ctrl+Shift+N`) kifoya qiladi.
