# AI Terminal Cockpit (`ai-deck`) — v3

Yuqori unumdorlikka ega, terminal-native AI Mission Control paneli (**Claude Code** va **OpenCode** uchun). **Vague** dark mavzusi asosida yaratilgan.

---

## Arxitektura Tamoyili (Dual-Channel)

```text
┌─ ai-deck (Bun / Node TUI) ───────────────────────────────────────────────────┐
│                                                                              │
│  CHAP 60% (Monitoring Panellari)        O'NG 40% (Haqiqiy CLI PTY)           │
│  ┌─────────────────────────────┐        ┌─────────────────────────────┐      │
│  │ [1] AGENTS (30%)            │        │                             │      │
│  │  SDK orqali real agentlar   │        │  opencode --mini            │      │
│  ├─────────────────────────────┤        │  yoki                       │      │
│  │ [2] SKILLS / TOOLS (30%)    │        │  claude (interactive)       │      │
│  │  SDK orqali ishlatilgan tool│        │                             │      │
│  ├─────────────────────────────┤        │  Real CLI ishlaydi          │      │
│  │ [3] THINKING / TOKENS (40%) │        │  Foydalanuvchi to'g'ridan-  │      │
│  │  Token bar + thinking logi  │        │  to'g'ri CLI ga yozadi      │      │
│  └─────────────────────────────┘        └─────────────────────────────┘      │
│                                                                              │
│  ◄── Dual Channel ──►                   ◄── PTY Embed ──►                    │
│  SDK SSE/API orqali typed events        CLI stdin/stdout PTY                 │
└──────────────────────────────────────────────────────────────────────────────┘
```

1. **PTY kanal** → O'ng 40% ekranda to'liq rangli haqiqiy CLI (`opencode attach ... --mini` yoki `claude`) ishlaydi. Barcha foydalanuvchi yozishmalari to'g'ridan-to'g'ri CLI'ga boradi.
2. **SDK kanal** → `opencode serve` + `@opencode-ai/sdk` va `@anthropic-ai/claude-agent-sdk` orqali real-time agentlar, tool-chaqiruvlar, token sarfi va fikrlash jurnali olinadi. Statik/soxta ma'lumotlar yo'q.

---

## Tezkor Boshlash

### Tmux Ichida
Tmux ichidagi istalgan katalogdan:
* **`Ctrl + Space`** keyin **`a`** bosing.
* U avtomatik tarzda `2:ai` oynasini yaratadi yoki ochadi.

### To'g'ridan-to'g'ri Terminalda
```bash
~/Projects/setup/ai-workflow/bin/ai-deck
```

---

## Foydalanish Bosqichlari

1. **Ishga Tushirish**:
   `ai-deck` ochilganda barcha panellar toza holatda bo'ladi.
2. **Dvigatelni Tanlash**:
   `[4]` CLI panelida **`opencode`** yoki **`claude`** deb yozib `Enter` bosing.
3. **Ishlash**:
   Tanlangan CLI ochiladi. Unda topshiriq bering. Chap tarafdagi panellar SDK eventlari orqali real vaqtda to'lib boradi:
   - `[1] AGENTS` — asosiy agent va subagentlar holati
   - `[2] SKILLS / TOOLS` — ishlatilayotgan buyruqlar va toollar
   - `[3] THINKING / TOKENS` — token sarfi grafigi va tahlil loglari
4. **To'xtatish va Boshqasiga O'tish**:
   - `Esc` tugmasini ketma-ket 2 marta tez bosing (`Esc + Esc`, <300ms) → CLI to'xtaydi va dvigatel tanlash menyusiga qaytadi.

---

## Tugmalar Boshqaruvi

| Tugma | Rejim | Vazifasi |
| :--- | :--- | :--- |
| `Oddiy harflar` | CLI rejim | To'g'ridan-to'g'ri CLI stdin ga yoziladi |
| `Esc` (1 marta) | CLI rejim | Navigatsiya rejimiga o'tish (panellarni ko'rish) |
| `Esc + Esc` (<300ms)| Har qanday | Dvigatelni to'xtatish (CLI stop) va boshiga qaytish |
| `1` | Nav rejim | `[1] AGENTS` panelini tanlash |
| `2` | Nav rejim | `[2] SKILLS / TOOLS` panelini tanlash |
| `3` | Nav rejim | `[3] THINKING / TOKENS` panelini tanlash |
| `4` / `i` / `Enter` | Nav rejim | `[4] CLI` ga qaytish (yozish rejimi) |
| `↑` / `↓` | Nav rejim | Tanlangan panel ichida scroll qilish |
| `Ctrl + C` | CLI rejim | CLI ichida joriy buyruq/generatsiyani bekor qilish |
| `q` / `Ctrl + C` | Nav / Bo'sh | `ai-deck` dasturidan to'liq chiqish |
