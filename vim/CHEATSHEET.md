# Klaviatura Shpargalkasi

Faqat **kundalik ishlatiladiganlar**. Qolganini yodlash shart emas — pastdagi
"Qolganini qanday topish" bo'limiga qarang.

```
  SESSIYA (loyiha)  →  WINDOW (tab)  →  PANEL (split)  →  NEOVIM
  Ctrl+Space f         Alt+Shift+h/l    Ctrl+h/j/k/l      Space ...
```

---

## Eng ko'p bosiladigan 6 ta

| Tugma | Vazifasi |
| :--- | :--- |
| `Ctrl+h` `j` `k` `l` | Panellar va splitlar orasida yurish — **prefiks kerak emas** |
| `Space` `s` `f` | Fayl topish (nomi bo'yicha) |
| `Space` `s` `s` | Matn qidirish (butun loyiha) |
| `H` / `L` | Oldingi / keyingi fayl (bufer) |
| `g` `d` | Funksiya yaratilgan joyiga sakrash |
| `K` | Tip va dokumentatsiyani ko'rish |

---

## Tmux

| Tugma | Vazifasi |
| :--- | :--- |
| `Ctrl+Space` `f` | **Sessiya / loyiha menejeri** |
| `Alt+Shift+h` / `l` | Window (tab) almashtirish |
| `Ctrl+Space` `c` | Yangi window |
| `Ctrl+Space` `v` | Yonma-yon bo'lish |
| `Ctrl+Space` `h` | Tepa-past bo'lish |
| `Ctrl+Space` `x` | Panelni yopish |
| `Ctrl+Space` `z` | Kattalashtirish / qaytarish |
| `Shift` + strelka | Panel o'lchami (chap/o'ng = width, tepa/past = height) |
| `Ctrl+Space` `d` | Sessiyadan chiqish (fonda qoladi) |

## Neovim — fayl va qidiruv

| Tugma | Vazifasi |
| :--- | :--- |
| `Space` `s` `f` | Fayl nomi bo'yicha |
| `Space` `s` `s` | Matn — butun loyiha |
| `Space` `s` `b` | Ochiq fayllar ro'yxati |
| `Space` `s` `/` | Matn — faqat ochiq fayllar |
| `Space` `e` | Fayl menejeri (Oil) — loyiha ildizi |
| `-` | Fayl menejeri — yuqori papka |
| `Space` `q` | Hozirgi faylni yopish |
| `/` | Hozirgi fayl ichida qidirish |
| `Esc` | Qidiruv highlightini tozalash |

**Qidiruv oynasi ichida:** `Ctrl+j`/`Ctrl+k` — yurish · `Enter` — ochish ·
**`Ctrl+v` — splitda ochish** · `Esc` — bekor qilish

## Neovim — kod

| Tugma | Vazifasi |
| :--- | :--- |
| `g` `d` | Definition — yaratilgan joyiga |
| `g` `r` | References — qayerlarda ishlatilgan |
| `K` | Hover — tip va dokumentatsiya |
| `Space` `c` `a` | Code Action — auto-import, tezkor tuzatish |
| `Space` `c` `r` | Rename — butun loyiha bo'ylab |
| `Space` `c` `f` | Formatlash |
| `]` `d` / `[` `d` | Keyingi / oldingi xatoga sakrash |
| `g` `c` `c` | Qatorni izohga aylantirish |
| `s` | Flash — ekranda istalgan joyga 2 harfda sakrash |

## Neovim — git

| Tugma | Vazifasi |
| :--- | :--- |
| `Space` `g` `g` | **LazyGit** |
| `Space` `g` `d` | **Diffview** — o'zgarishlarni taqqoslash |
| `]` `c` / `[` `c` | Keyingi / oldingi o'zgargan blok |
| `Space` `g` `p` | Blok o'zgarishini ko'rish |
| `Space` `g` `s` | Blokni stage qilish |
| `Space` `g` `r` | Blokni bekor qilish |

## Neovim — vositalar

| Tugma | Vazifasi |
| :--- | :--- |
| `Ctrl+\` | Suzuvchi terminal |
| `Space` `d` | Lazydocker |
| `Space` `p` | Lazysql |

---

## Qolganini qanday topish

Hammasini yodlash shart emas — ikkala dastur ham **o'zi ko'rsatadi**:

| Bosing | Nima bo'ladi |
| :--- | :--- |
| `Space` va kuting | Neovimning barcha tugmalari menyusi chiqadi |
| `Space` `g` (yoki `s`, `c`, `t`) | Shu guruh ichidagilar ro'yxati |
| `Ctrl+Space` `?` | tmux'ning **barcha** tugmalari ro'yxati |
| `Ctrl+Space` `q` | Panellarga raqam chiqadi — ko'p panel bo'lganda |

### Kamdan-kam, lekin kerak bo'lganda

| Tugma | Vazifasi |
| :--- | :--- |
| `Ctrl+Space` `;` | Oxirgi ikki panel orasida tez almashish |
| `Ctrl+Space` `l` | Oxirgi ikki window orasida tez almashish |
| `Ctrl+Space` `E` | Panellarni teng taqsimlash |
| `Ctrl+Space` `[` | Copy mode — tepaga aylantirish va nusxalash |
| `Ctrl+Space` `Ctrl+s` / `Ctrl+r` | Sessiyalarni saqlash / tiklash |
| `Ctrl+w` `c` | Neovimda ochilib qolgan splitni yopish |
