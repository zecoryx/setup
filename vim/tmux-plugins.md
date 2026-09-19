# Tmux O'rnatilgan Plaginlar va Vositalar

Ushbu hujjatda tizimda (`~/.config/tmux/plugins/`) mavjud bo'lgan, Tmux bilan birga ishlatiladigan barcha o'rnatilgan plaginlar, ularning vazifalari, sozlamalari va kerakli CLI bog'liqliklari keltirilgan.

---

## 1. O'rnatilgan Tmux Plaginlari Ro'yxati

| # | Plagin | Manba (Repository) | Asosiy Vazifasi |
|---|---|---|---|
| 1 | **TPM** | [tmux-plugins/tpm](https://github.com/tmux-plugins/tpm) | Tmux plaginlarini avtomatik yuklash, o'rnatish va yangilash menejeri |
| 2 | **tmux-sessionx** | [omerxx/tmux-sessionx](https://github.com/omerxx/tmux-sessionx) | Jonli preview va `zoxide` (`z`) integratsiyasiga ega fuzzy sessiyalar menejeri |
| 3 | **tmux-fzf** | [sainnhe/tmux-fzf](https://github.com/sainnhe/tmux-fzf) | Fzf orqali barcha Tmux sessiyalari, oynalari, panellari va buyruqlarini qidirish |
| 4 | **tmux-resurrect** | [tmux-plugins/tmux-resurrect](https://github.com/tmux-plugins/tmux-resurrect) | Kompyuter o'chirilganda yoki qayta yoqilganda sessiyalar va splitlarni xotirada saqlash/tiklash |
| 5 | **tmux-continuum** | [tmux-plugins/tmux-continuum](https://github.com/tmux-plugins/tmux-continuum) | Har 10–15 daqiqada sessiyalarni avtomatik saqlab borish |
| 6 | **tmux-sessionist** | [tmux-plugins/tmux-sessionist](https://github.com/tmux-plugins/tmux-sessionist) | Sessiyalar bo'yicha tezkor yordamchi buyruqlar va navigatsiya |

---

## 2. Plaginlarning Batafsil Tavsifi

### 1. `omerxx/tmux-sessionx`
- **Tavsif**: Neovim va Tmux hamjamiyatida eng ommabop interaktiv sessiyalar menejeri.
- **Xususiyatlari**:
  - Tanlangan sessiya ichidagi kod/fayllarni yon tomonda jonli (preview) qilib ko'rsatadi.
  - `zoxide` (`z`) bilan to'liq integratsiya qilingan: kompyuterda eng ko'p ishlatilgan kataloglarni darhol yangi sessiya sifatida ochish imkonini beradi.
  - Sessiyalarni ro'yxat ichidan turib o'chirish (`Alt+Backspace` yoki `Ctrl+x`), qayta nomlash (`Ctrl+r`) va oynalar ro'yxatiga o'tish (`Ctrl+w`).
- **Ishlatiladigan CLI vositalari**: `fzf`, `bat`, `zoxide`.

### 2. `sainnhe/tmux-fzf`
- **Tavsif**: Tmux'dagi barcha obyektlarni `fzf` orqali boshqarish uchun keng qamrovli vosita.
- **Xususiyatlari**:
  - Ochiq sessiyalar, oynalar va panellarni qidirib topish va almashtirish.
  - Tmux buyruqlarini nomma-nom qidirib ishga tushirish.
  - Tmux clipboard (bufer) tarixini qidirish va joriy oynaga qo'yish.

### 3. `tmux-plugins/tmux-resurrect`
- **Tavsif**: Tmux muhitini qo'lda xotiraga saqlash va tiklash.
- **Standart tugmalar**:
  - `Prefix + Ctrl+s` — Barcha sessiyalar, oynalar va Neovim holatini diskka saqlaydi (`~/.local/share/tmux/resurrect/`).
  - `Prefix + Ctrl+r` — Oxirgi saqlangan holatni qayta tiklaydi.

### 4. `tmux-plugins/tmux-continuum`
- **Tavsif**: `tmux-resurrect` bilan birga ishlaydi va sessiyalarni ma'lum vaqt oralig'ida (masalan, har 10 daqiqada) fonda avtomatik saqlab turadi.
- **Parametr**: `set -g @continuum-save-interval '10'`

### 5. `tmux-plugins/tmux-sessionist`
- **Tavsif**: Tmux sessiyalarini boshqarish uchun qo'shimcha yengil utilitalar to'plami.

---

## 3. Bog'liq CLI Vositalari (Tizimda O'rnatilgan)

Ushbu plaginlarning to'liq va tez ishlashi uchun zarur bo'lgan tashqi terminal vositalari:
- **`zoxide` (`z`)**: `/usr/bin/zoxide` — Eng ko'p kirilgan papkalarni avtomatik eslab qoluvchi CD almashtiruvchisi.
- **`fzf`**: `/usr/bin/fzf` — Fuzzy qidiruv dvigateli.
- **`bat`**: `/usr/bin/bat` — Sintaksis ranglariga ega fayllarni ko'rish vositasi (`sessionx` preview uchun).
- **`gh`**: `/home/zecoryx/.local/bin/gh` — GitHub rasmiy CLI vositasi.
- **`ghui`**: `/home/zecoryx/.local/bin/ghui` — GitHub uchun interaktiv TUI boshqaruv paneli.
- **`lazygit`**: `/usr/bin/lazygit` — Terminal Git boshqaruvchisi.

---

## 4. Plaginlar Joylashuvi va TPM Boshqaruvi

Barcha plaginlar quyidagi katalogda saqlanadi:
```text
~/.config/tmux/plugins/
├── tpm/
├── tmux-sessionx/
├── tmux-fzf/
├── tmux-resurrect/
├── tmux-continuum/
└── tmux-sessionist/
```

TPM orqali plaginlarni boshqarish:
- `Prefix + I` — Yangi plaginlarni o'rnatish.
- `Prefix + U` — O'rnatilgan plaginlarni yangilash.
- `Prefix + Alt + u` — Ro'yxatdan olib tashlangan plaginlarni diskdan tozalash.
