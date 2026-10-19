# Tmux Plaginlar va Sessiya Boshqaruvi

Ushbu hujjat `tmux.conf` tomonidan **haqiqatda yuklanadigan** plaginlarni va sessiyalarni
boshqarish vositalarini tavsiflaydi. Diskda bo'lsa-yu, `tmux.conf`da `@plugin` qatori
bo'lmasa — TPM uni yuklamaydi. Shuning uchun bu ro'yxat `tmux.conf` bilan bir xil bo'lishi shart.

---

## 1. Yuklanadigan Plaginlar

| # | Plagin | Manba | Vazifasi |
|---|---|---|---|
| 1 | **TPM** | [tmux-plugins/tpm](https://github.com/tmux-plugins/tpm) | Plagin menejeri: o'rnatish, yangilash, tozalash |
| 2 | **tmux-resurrect** | [tmux-plugins/tmux-resurrect](https://github.com/tmux-plugins/tmux-resurrect) | Sessiya, oyna va panellarni diskka saqlash / tiklash |
| 3 | **tmux-continuum** | [tmux-plugins/tmux-continuum](https://github.com/tmux-plugins/tmux-continuum) | Resurrect holatini fonda avtomatik saqlab borish |
| 4 | **tmux-sessionist** | [tmux-plugins/tmux-sessionist](https://github.com/tmux-plugins/tmux-sessionist) | Sessiyalar uchun qo'shimcha yengil buyruqlar |

### `tmux-resurrect`
Tmux muhitini diskka yozadi (`~/.local/share/tmux/resurrect/`).
- `Prefix + Ctrl+s` — saqlash (`tmux.conf`da aniq bind qilingan, xabar chiqaradi)
- `Prefix + Ctrl+r` — oxirgi saqlangan holatni tiklash
- `@resurrect-strategy-nvim 'session'` — Neovim buferlari ham tiklanadi

### `tmux-continuum`
`tmux-resurrect` ustida ishlaydi, har 10 daqiqada avtomatik saqlaydi.
- `@continuum-save-interval '10'` — saqlash davri (daqiqa)
- `@continuum-restore 'off'` — tmux ishga tushganda **avtomatik tiklanmaydi** (ataylab:
  tiklash `Prefix + Ctrl+r` bilan qo'lda bajariladi). Avtomatik tiklash kerak bo'lsa `'on'` qiling.

### `tmux-sessionist`
Prefiks ostidagi sessiya utilitalari (manbadan tekshirilgan standart tugmalar):
`g` — nomi bo'yicha sessiyaga o'tish, `C` — yangi sessiya, `X` — sessiyani o'chirish,
`S` — oxirgi ikki sessiya orasida almashish, `t` — panelni boshqa sessiyaga ko'chirish,
`@` — panelni yangi oynaga ajratish.

---

## 2. Sessiya Menejeri (plagin emas, repo skripti)

Sessiyalarni fuzzy tanlash uchun tashqi plagin **ishlatilmaydi** — buning o'rniga
repodagi o'z skripti bor: `tmux/bin/tmux-session-manager`.

- **Chaqirish**:
  - `Prefix + f` — tmux popup oynasida ochiladi
  - yoki terminalda `ts` (shuningdek `tmux-sessionizer`, `tmux-session-manager` nomlari bilan)
- **Nima qiladi**: ochiq tmux sessiyalari **va** `~/Projects` ichidagi loyihalarni bitta
  `fzf` ro'yxatida ko'rsatadi. Loyiha tanlansa — shu papkada yangi sessiya yaratib ulaydi.
- **Tugmalar**: `Enter` — ulanish/almashish, `Ctrl+x` — sessiyani o'chirish, `Ctrl+n` — yangi sessiya.
- **Bog'liqlik**: faqat `fzf`.

> Eslatma: `tmux-sessionx` va `tmux-fzf` plaginlari avval diskda yotgan, lekin `tmux.conf`da
> ro'yxatdan o'tmagani uchun hech qachon yuklanmagan. Yuqoridagi skript ularning ishini
> bajargani uchun ikkalasi olib tashlandi. Kerak bo'lsa `tmux.conf`ga `@plugin` qatorini
> qo'shib, `Prefix + I` bosish kifoya.

---

## 3. Bog'liq CLI Vositalari

- **`fzf`** — fuzzy tanlash dvigateli (sessiya menejeri uchun **majburiy**)
- **`ripgrep` (`rg`)** — Neovim live grep uchun
- **`zoxide` (`z`)** — tez-tez ishlatiladigan papkalarga o'tish (shellda, `.zshrc`da ulangan)
- **`bat`** — sintaksis ranglari bilan fayl ko'rish
- **`lazygit`** — Neovimdan `<leader>gg` bilan ochiladi
- **`gh`** — GitHub CLI, `octo.nvim` shunga tayanadi

`install.sh` birinchi to'rttasining mavjudligini tekshiradi.

---

## 4. Joylashuv va TPM Boshqaruvi

```text
~/.config/tmux/
├── tmux.conf -> ~/Projects/setup/vim/tmux/tmux.conf
└── plugins/
    ├── tpm/
    ├── tmux-resurrect/
    ├── tmux-continuum/
    └── tmux-sessionist/
```

- `Prefix + I` — `tmux.conf`dagi yangi plaginlarni o'rnatish
- `Prefix + U` — plaginlarni yangilash
- `Prefix + Alt + u` — `tmux.conf`dan olib tashlangan plaginlarni diskdan tozalash
