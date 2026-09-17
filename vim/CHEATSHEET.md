# Klaviatura Shpargalkasi (Cheatsheet)

---

## 1. Tmux va Sessiyalar
> Eslatma: `Ctrl + Space` bosib qo'yib yuboriladi, keyin kerakli harf bosiladi.

| Tugma | Vazifasi |
| :--- | :--- |
| `Ctrl + Space` keyin `s` | Barcha sessiyalar daraxti (`Enter` — kirish, `x` keyin `y` — o'chirish) |
| `Ctrl + Space` keyin `w` | Barcha oynalar (windows) daraxti |
| `Ctrl + Space` keyin `Ctrl + s` | Hozirgi sessiyalarni xotiraga saqlash |
| `Ctrl + Space` keyin `Ctrl + r` | Saqlangan sessiyalarni qayta tiklash |
| `Ctrl + Space` keyin `r` | Sessiya nomini o'zgartirish |
| `Ctrl + Space` keyin `N` | Yangi nomli sessiya ochish |
| `Ctrl + Space` keyin `d` | Sessiyadan chiqish (orqa fonda qoladi) |
| `Ctrl + Space` keyin `c` | Yangi oyna (window) ochish |
| `Shift + Alt + h` / `l` | Oynalar (tablar) bo'yicha chapga / o'ngga o'tish |

Terminal buyruqlari:
* `tmux attach` — Oxirgi sessiyaga ulanish
* `tmux attach -t <nomi>` — Aniq bitta sessiyaga ulanish
* `tmux list-sessions` — Barcha sessiyalar ro'yxatini ko'rish

---

## 2. Splitlar va Harakat (Tmux + Neovim bir xil va sodda)

### Neovim ichida:
| Tugma | Vazifasi |
| :--- | :--- |
| `Space + v` | Vertikal split (yonma-yon oyna ochish) |
| `Space + h` | Gorizontal split (tepa-pastga oyna ochish) |
| `Space + x` | Hozirgi splitni yopish |
| `Space + m` | Splitni butun ekranga kattalashtirish / qaytarish (Maximize) |
| `Space + =` | Barcha splitlarni tenglashtirish |
| `Ctrl + h / j / k / l` | Splitlar orasida harakatlanish |
| `Shift + Strelkalar` | Split o'lchamini kengaytirish / toraytirish |

### Tmux ichida:
| Tugma | Vazifasi |
| :--- | :--- |
| `Ctrl + Space` keyin `v` | Vertikal split (yonma-yon o'ngga) |
| `Ctrl + Space` keyin `h` | Gorizontal split (tepa-pastga) |
| `Ctrl + Space` keyin `x` | Hozirgi splitni yopish |
| `Ctrl + Space` keyin `z` | Splitni butun ekranga kattalashtirish / qaytarish (Zoom) |

---

## 3. Fayllar va Qidiruv (Neovim)

| Tugma | Vazifasi |
| :--- | :--- |
| `Space + Space` | Fayl nomi bo'yicha tezkor qidiruv |
| `Space + f + g` | Kod ichidan matn qidirish (Live Grep) |
| `Space + o` | Hozirgi fayl turgan papkani ochish (Oil explorer) |
| `Space + e` | Loyihaning bosh ildiz papkasini ochish (Oil project root) |
| `-` (minus) | Papkalar iyerarxiyasida 1 qadam yuqoriga / orqaga chiqish |
| `Space + f + b` | Ochiq turgan fayllar ro'yxati (Buffers picker) |
| `H` / `L` | Ochiq fayllar orasida chapga / o'ngga o'tish |
| `Space + b + d` | Hozirgi faylni yopish |
| `Space + b + o` | Boshqa hamma fayllarni yopib, faqat bittasini qoldirish |
| `Space + b + D` | Barcha ochiq fayllarni birdaniga yopish |

---

## 4. Kodlash, Terminallar va Tahrirlash

| Tugma | Vazifasi |
| :--- | :--- |
| `s` | Flash: ko'rinib turgan istalgan so'zga 2 harfda sakrash |
| `Space + c + f` | Kodni tekislash/formatlash (Pint yoki Prettier) |
| `Space + s + r` | Loyiha bo'yicha so'zlarni ommaviy almashtirish (Grug-far) |
| `Space + x + x` | Loyihadagi xatolar ro'yxati (Trouble diagnostics) |
| `Space + c + s` | Funksiya va metodlar ro'yxati (Trouble symbols) |
| `Space + u` | O'zgarishlar tarixi daraxti (Undotree) |
| `p` | Joylashtirish (Paste) |
| `Space + p` (visualda) | Nusxalangan matnni almashtirib yubormasdan (xotirani buzmasdan) ustiga qo'yish |
| `Ctrl + p` / `Ctrl + n` | `p` dan keyin: oldin nusxalangan matnlarni almashtirib ko'rish (Yanky) |
| `Space + y` | Nusxalangan matnlar tarixi ro'yxati |
| `Ctrl + \` | Terminalni ochish / yashirish (ToggleTerm) |
| `1` .. `5` keyin `Ctrl + \` | 1-, 2-, 3-, 4-, 5-raqamli doimiy terminallar (jarayonlar o'chmaydi) |

---

## 5. Git va GitHub

| Tugma | Vazifasi |
| :--- | :--- |
| `Space + g + g` | LazyGit oynasini ochish |
| `Space + g + d` | Git o'zgarishlarni taqqoslash (Diffview) |
| `Space + g + h` | Faylning commitlar tarixi |
| `Space + g + p` | GitHub Pull Requestlar ro'yxati (Octo) |
| `Space + g + i` | GitHub Issuelar ro'yxati |
| `co` | Merge konfliktda: bizning tarafni olish |
| `ct` | Merge konfliktda: ularning tarafini olish |
| `cb` | Merge konfliktda: ikkala tarafni ham saqlash |
| `]x` / `[x` | Keyingi / oldingi konfliktga sakrash |

---

## 6. Asosiy Vim Tugmalari

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
