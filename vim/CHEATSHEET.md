# Klaviatura Shpargalkasi (Cheatsheet)

---

## 1. Tmux va Sessiyalar
> Eslatma: `Ctrl + Space` bosib qo'yib yuboriladi, keyin kerakli harf bosiladi.

| Tugma | Vazifasi |
| :--- | :--- |
| `Ctrl + Space` keyin `f` | **Sessiya/loyiha menejeri** (fzf popup: ochiq sessiyalar + `~/Projects`) |
| `Ctrl + Space` keyin `s` | Barcha sessiyalar daraxti (`Enter` — kirish, `x` keyin `y` — o'chirish) |
| `Ctrl + Space` keyin `w` | Barcha oynalar (windows) daraxti |
| `Ctrl + Space` keyin `Ctrl + s` | Hozirgi sessiyalarni xotiraga saqlash |
| `Ctrl + Space` keyin `Ctrl + r` | Saqlangan sessiyalarni qayta tiklash |
| `Ctrl + Space` keyin `r` | Sessiya nomini o'zgartirish |
| `Ctrl + Space` keyin `d` | Sessiyadan chiqish (orqa fonda qoladi) |
| `Ctrl + Space` keyin `c` | Yangi oyna (window) ochish |
| `Shift + Alt + h` / `l` | Oynalar (tablar) bo'yicha chapga / o'ngga o'tish |
| `Ctrl + Space` keyin `g` | Nomi bo'yicha sessiyaga o'tish (sessionist) |
| `Ctrl + Space` keyin `S` | Oxirgi ikki sessiya orasida tez almashish (sessionist) |
| `Ctrl + Space` keyin `X` | Hozirgi sessiyani o'chirish (sessionist) |

Terminal buyruqlari:
* `tmux attach` — Oxirgi sessiyaga ulanish
* `tmux attach -t <nomi>` — Aniq bitta sessiyaga ulanish
* `tmux list-sessions` — Barcha sessiyalar ro'yxatini ko'rish
* `ts` — Sessiya/loyiha menejerini terminaldan ochish (`Prefix + f` bilan bir xil)

---

## 2. Splitlar va Harakat (Tmux + Neovim bir xil va sodda)

### Neovim ichida:
| Tugma | Vazifasi |
| :--- | :--- |
> **Barcha split amallari `Space + w` ostida** (w = window). Bosganingizda menyu o'zi chiqadi.
> Ikkinchi harf tmux bilan **aynan bir xil**: `v`, `h`, `x`, `z`.

| Tugma | Vazifasi |
| :--- | :--- |
| `Space + w` keyin `v` | Vertikal split (yonma-yon oyna ochish) |
| `Space + w` keyin `h` | Gorizontal split (tepa-pastga oyna ochish) |
| `Space + w` keyin `x` | Hozirgi splitni yopish |
| `Space + w` keyin `z` | Splitni butun ekranga kattalashtirish / qaytarish |
| `Space + w` keyin `=` | Barcha splitlarni tenglashtirish |
| `Ctrl + h / j / k / l` | Splitlar orasida harakatlanish (prefiks kerak emas) |
| `Shift + Strelkalar` | Split o'lchamini o'zgartirish — **nvim ichida nvim splitini, shellda tmux panelini** (`Ctrl+h/j/k/l` kabi) |

### Tmux ichida:
| Tugma | Vazifasi |
| :--- | :--- |
| `Ctrl + Space` keyin `v` | Vertikal split (yonma-yon o'ngga) |
| `Ctrl + Space` keyin `h` | Gorizontal split (tepa-pastga) |
| `Ctrl + Space` keyin `x` | Hozirgi splitni yopish |
| `Ctrl + Space` keyin `z` | Splitni butun ekranga kattalashtirish / qaytarish (Zoom) |

---

## 3. Fayllar va Qidiruv (Neovim)

> **Barcha qidiruvlar `Space + s` ostida.** Uni bosganingizda menyu o'zi chiqadi —
> hech narsa yodlash shart emas:
>
> ```
>  Space + s  →   f   fayl nomi bo'yicha   (butun loyiha)
>                 b   ochiq fayllar
>                 s   matn ichidan         (butun loyiha)
>                 /   matn ichidan         (faqat ochiq fayllar)
>
>  /          →   hozirgi fayl ichida (oddiy vim qidiruvi, leader kerak emas)
> ```

| Tugma | Vazifasi |
| :--- | :--- |
| `Space + s` keyin `f` | Fayl **nomi** bo'yicha qidiruv (butun loyiha) |
| `Space + s` keyin `s` | **Matn** qidirish (butun loyiha, o'zim yozaman) |
| `Space + s` keyin `/` | **Matn** qidirish — faqat ochiq fayllar ichida |
| `Space + o` | Hozirgi fayl turgan papkani ochish (Oil explorer) |
| `Space + e` | Loyihaning bosh ildiz papkasini ochish (Oil project root) |
| `-` (minus) | Papkalar iyerarxiyasida 1 qadam yuqoriga / orqaga chiqish |
| `Space + s` keyin `b` | Ochiq turgan fayllar ro'yxati (Buffers picker) |
| `H` / `L` | Ochiq fayllar orasida chapga / o'ngga o'tish |
| `Space + q` | Hozirgi faylni yopish (buffer) |

---

## 4. LSP, Kod Navigatsiyasi va Diagnostika

| Tugma | Vazifasi |
| :--- | :--- |
| `g + d` | Go to Definition (Funksiya/o'zgaruvchi yaratilgan joyiga sakrash) |
| `g + D` | Go to Declaration (E'lon qilingan joyiga sakrash) |
| `g + r` | References (Kodning qayerlarida ishlatilgani ro'yxati) |
| `g + i` | Implementation (Interfeysning amalga oshirilgan joyi) |
| `g + y` | Type Definition (Tip ta'riflangan joyi) |
| `K` | Hover Docs (Funksiya/klass tipi va dokumentatsiyasini float oynada ko'rish) |
| `g + K` | Signature Help (Funksiya qabul qiluvchi argumentlar ro'yxati) |
| `Space + c + a` | Code Action (Auto-import, tezkor tuzatishlar va refaktoring) |
| `Space + c + r` | Rename Symbol (Nomini butun loyiha bo'ylab xavfsiz o'zgartirish) |
| `[ + d` / `] + d` | Oldingi / keyingi xatolik yoki ogohlantirishga sakrash |
| `Space + c + d` | Kursordagi diagnostika (xatolik) matnini float oynada to'liq ko'rish |
| `Space + t + h` | Inlay Hints (kod ustidagi yashirin tiplarni ko'rsatish/yashirish) |

---

## 5. Kodlash, Terminallar va Tahrirlash

| Tugma | Vazifasi |
| :--- | :--- |
| `s` | Flash: ko'rinib turgan istalgan so'zga 2 harfda sakrash |
| `Space + c + f` | Kodni tekislash/formatlash (Conform: Prettier, Pint, Stylua) |
| `Space + p` (visualda) | Nusxalangan matnni almashtirib yubormasdan ustiga qo'yish |
| `Ctrl + \` | Tezkor suzuvchi (float) terminalni ochish / yashirish (Snacks) |
| `Space + l` | Lazy plagin menejerini ochish |

---

## 6. Git va GitHub

| Tugma | Vazifasi |
| :--- | :--- |
| `Space + g + g` | LazyGit oynasini ochish |
| `Space + d` | Lazydocker (suzuvchi terminalda) |
| `Space + p` | Lazysql (suzuvchi terminalda) |
| `Space + g + d` | Git o'zgarishlarni taqqoslash (Diffview) |
| `Space + g + h` | Faylning commitlar tarixi |
| `] + c` / `[ + c` | Keyingi / oldingi o'zgargan blokka (hunk) sakrash |
| `Space + g + p` | Hunk o'zgarishini float oynada ko'rish (preview) |
| `Space + g + s` | Hunkni stage qilish |
| `Space + g + r` | Hunkni bekor qilish (reset) |
| `Space + g + b` | Qator uchun to'liq git blame |
| `Space + t + b` | Inline blame matnini yoqish / o'chirish |

---

## 7. Asosiy Vim Tugmalari

| Tugma | Vazifasi |
| :--- | :--- |
| `w` / `b` | So'zma-so'z oldinga / orqaga sakrash |
| `0` / `$` | Qator boshi / qator oxiri |
| `gg` / `G` | Faylning eng boshiga / eng oxiriga sakrash |
| `:15` | 15-qatorga to'g'ridan-to'g'ri sakrash |
| `Ctrl + d` / `Ctrl + u` | Yarim sahifa pastga / tepaga silliq aylantirish |
| `dd` / `yy` | Qatorni qirqib olish / nusxalash |
| `u` / `Ctrl + r` | Bekor qilish (Undo) / qaytarish (Redo) |
| `o` / `O` | Pastdan / tepadan yangi qator ochib yozish |
