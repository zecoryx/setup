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
│       ├── terminal.lua                   # Snacks suzuvchi va doimiy terminallar
│       ├── editor.lua                     # Qavslar, matn o'rash, izohlar va undotree
│       ├── colors.lua                     # Rang kodlari va TailwindCSS klasslari prevyusi
│       └── real_icons.lua                 # Terminalda vektor (SVG) piktogrammalarini chizish
│
├── tmux/
│   ├── tmux.conf                          # Tmux server va oynalar boshqaruvi sozlamalari
│   └── bin/
│       └── tmux-session-manager           # Loyihalar va sessiyalar o'rtasida fzf orqali tezkor o'tish
│
├── ghostty/
│   └── config                             # Ghostty terminal emulyatori sozlamalari (shrift, mavzu)
│
└── icons/
    └── vscode-symbols/                    # Terminalda ko'rsatiladigan outline va fayl SVG ikonkalar
        └── src/
            ├── symbol-icon-theme.json     # Ikonkalarning kengaytmalar bilan bog'lanish qoidalari
            └── icons/
                ├── files/                 # Fayl turlari uchun SVG ikonkalari
                └── folders/               # Faqat outline folder va folder-open SVG ikonkalari
```

---

## 2. Fayllar va Ularning Aniq Vazifalari

### Asosiy Fayllar (Root)
- **`init.lua`**: Neovim yuklanayotganda birinchi bo'lib ishga tushadi. Leader tugmasini (`Space`) belgilaydi va qat'iy tartibda uchta modulni yuklaydi: `config.options`, `config.lazy` va `config.keymaps`.
- **`lazy-lock.json`**: `lazy.nvim` tomonidan avtomatik boshqariladi. O'rnatilgan har bir plaginning aniq Git commit identifikatorini saqlaydi. Bu boshqa mashinada `install.sh` ishga tushirilganda aynan bir xil versiyalar o'rnatilishini kafolatlaydi.
- **`install.sh`**: Yangi kompyuterda yoki yangi muhitda CLI vositalarini tekshiradi, symlinklarni ulaydi, TPM plaginlarini yuklab oladi va Neovim plaginlarini boshlang'ich sinxronizatsiya qiladi.

### Asosiy Sozlamalar (`lua/config/`)
- **`options.lua`**: Vimning asosiy harakatlarini belgilaydi: 2 bo'shliqli tablar (`shiftwidth = 2`, `expandtab = true`), qator raqamlari (`number`, `relativenumber`), tizim clipboard integratsiyasi (`unnamedplus`), kursor harakati, vaqtinchalik swap fayllarini o'chirish va undofile orqali o'zgarishlar tarixini doimiy saqlash.
- **`lazy.lua`**: `lazy.nvim` plagin menejerining bootstrap qismi. Agar plagin menejeri diskda bo'lmasa, uni avtomatik yuklab oladi va `lua/plugins/` papkasidagi barcha modullarni avtomatik skanerlash qilib ulaydi.
- **`keymaps.lua`**: Plaginlarga bog'liq bo'lmagan yoki umumiy tizim miqyosidagi global tugmalar: oyna ajratish (split), tablar o'rtasida navigatsiya, saqlash (`Ctrl+s`), chiqish (`Ctrl+q`), qidiruv highlightini tozalash va Oil/Snacks uchun asosiy chaqiruvlar.

### Plaginlar Modullari (`lua/plugins/`)
- **`ui.lua`**: Vizual ko'rinish va ergonomika:
  - `vague.nvim`: Ranglar palitrasi.
  - `heirline.nvim`: Yengil va tezkor statusline (rejim, fayl nomi, git holati, LSP diagnostikasi).
  - `snacks.indent`: Indentatsiya chiziqlari.
  - `snacks.scroll` va `snacks.animate`: Kursor va sahifa siljishini silliqlash.
- **`oil.lua`**: Fayllar tizimini xuddi oddiy Vim buferi kabi tahrirlash imkonini beradi (`-` tugmasi). Fayllarni qayta nomlash, ko'chirish yoki o'chirish to'g'ridan-to'g'ri matn tahriri orqali bajariladi.
- **`snacks.lua`**: Tezkor qidiruv tizimi: fayllarni topish (`<leader><space>`), matn qidirish (`<leader>/`), ochiq buferlar (`<leader>,`), yaqinda ochilgan fayllar (`<leader>fr`) va git holati (`<leader>gs`).
- **`lsp.lua`**: Til serverlari ekotizimi:
  - `mason.nvim` va `mason-lspconfig.nvim`: Serverlarni avtomatik o'rnatish va boshqarish.
  - `nvim-lspconfig`: Serverlarni sozlash (vtsls, intelephense, pyright, lua_ls, tailwindcss va boshqalar).
  - Kod diagnostikasi (xatolar, ogohlantirishlar), inline hints va tahrirlovchi float oynalari.
- **`completion.lua`**: `blink.cmp` yuqori unumdorlikka ega avtoto'ldirish dvigateli. LSP, snippetlar, buferdagi so'zlar va fayl yo'llarini birlashtiradi.
- **`treesitter.lua`**: Kod sintaksisini daraxt ko'rinishida tahlil qiladi (AST). Ranglash, indentatsiya va kod bloklarini yig'ish (folding) uchun asosiy dvigatel.
- **`formatting.lua`**: `conform.nvim` yordamida faylni saqlash vaqtida avtomatik formatlash (`format_on_save`). Har bir til uchun kerakli formatlagichni ulaydi (Prettier, Pint, Stylua, Black).
- **`git.lua`**: `gitsigns.nvim` orqali fayl ichidagi qo'shilgan, o'zgartirilgan yoki o'chirilgan qatorlarni chap chekkada ko'rsatadi, inline blame va hunklarni boshqarishni ta'minlaydi.
- **`terminal.lua`**: `snacks.terminal` integratsiyasi. Suzuvchi yoki pastki terminallarni bir tugma bilan ochish va yashirish (`<c-/>` yoki `<c-_>`).
- **`editor.lua`**: Matn tahrirlash qulayliklari:
  - `mini.pairs`: Qavslar va qo'shtirnoqlarni avtomatik juftlash.
  - `mini.surround`: Qavslarni o'rash, o'zgartirish yoki olib tashlash.
  - `undotree`: Tahrirlashlar shajarasi va tarixini vizual ko'rish.
- **`colors.lua`**: Kod ichidagi HEX, RGB rang kodlari va TailwindCSS rangli klasslarining orqa fonini mos rangda bo'yab ko'rsatish (`nvim-highlight-colors`).
- **`real_icons.lua`**: Neovim ichida haqiqiy vektor (SVG) ikonkalarni terminalda chizib berish uchun `real-icons.nvim` integratsiyasi.

### Tmux Muhiti (`tmux/`)
- **`tmux.conf`**: Prefiks tugmasini `Ctrl+Space`ga o'rnatadi, intuitiv splitlar (`v` vertikal, `h` gorizontal), oynalar o'rtasida o'tish, Neovim va Tmux o'rtasida to'siqsiz harakat (`Ctrl+h/j/k/l`), TPM plaginlari va Vague mavzusidagi status paneli.
- **`tmux-session-manager`**: `fzf` asosidagi skript. Ochiq tmux sessiyalari va `~/Projects` katalogidagi loyihalar ro'yxatini chiqarib, ularga darhol ulanish, yangi sessiya ochish yoki o'chirish imkonini beradi.

### Ghostty Muhiti (`ghostty/`)
- **`config`**: Terminal shrifti, o'lchami, ranglar mavzusi, orqa fon shaffofligi va oyna chekka bo'shliqlarini (padding) belgilaydi.

---

## 3. Asosiy Sozlamalarni Tahrirlash

### Neovim parametrlarini o'zgartirish (`lua/config/options.lua`)
Redaktor harakati va tashqi ko'rinishiga oid barcha standart parametrlar shu yerda sozlanadi:
- Tab hajmini o'zgartirish:
  ```lua
  opt.shiftwidth = 4 -- standart 2 o'rniga 4 ta probel
  opt.tabstop = 4
  ```
- Nisbiy raqamlarni yoqish/o'chirish:
  ```lua
  opt.relativenumber = true -- faqat oddiy raqamlar kerak bo'lsa false qilinadi
  ```
- Kursor atrofida ko'rinadigan qatorlar zaxirasi:
  ```lua
  opt.scrolloff = 8 -- kursordan pastda va tepada kamida 8 qator doim ko'rinadi
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
- **Mavzu va ranglar**:
  ```ini
  theme = "vague"
  ```
- **Shaffoflik va chekka bo'shliqlar**:
  ```ini
  background-opacity = 0.95
  window-padding-x = 12
  window-padding-y = 12
  ```
- **Kursor stili**:
  ```ini
  cursor-style = "block"
  cursor-style-blink = false
  ```

### O'zgarishlarni tekshirish
Ghostty odatda `ghostty/config` faylidagi o'zgarishlarni saqlangandan so'ng darhol qayta yuklaydi. Agar avtomatik qo'llanmasa, yangi oyna ochish (`Ctrl+Shift+N`) kifoya qiladi.
