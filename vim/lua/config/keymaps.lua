local map = vim.keymap.set

-- Clear search highlight on Esc
map("n", "<Esc>", "<cmd>nohlsearch<CR>", { desc = "Clear search highlight" })

-- =========================
-- 🪟 Splitlar va O'lchamlar
-- =========================
-- Split ochish va yopish
map("n", "<leader>v", "<C-w>v", { desc = "Vertikal split (Yonma-yon)" })
map("n", "<leader>h", "<C-w>s", { desc = "Gorizontal split (Tepa-past)" })
map("n", "<leader>x", "<C-w>c", { desc = "Hozirgi splitni yopish" })
map("n", "<leader>=", "<C-w>=", { desc = "Splitlarni tenglashtirish" })

-- Maximize / Zoom: Splitni butun ekranga kattalashtirish va qaytarish
map("n", "<leader>m", function()
  if vim.t.maximized then
    vim.cmd("wincmd =")
    vim.t.maximized = false
  else
    vim.cmd("wincmd _")
    vim.cmd("wincmd |")
    vim.t.maximized = true
  end
end, { desc = "Splitni kattalashtirish / qaytarish (Maximize)" })

-- Shift + Strelkalar: Split o'lchamini o'zgartirish
map("n", "<S-Right>", "<cmd>vertical resize +3<CR>", { desc = "Enini uzaytirish" })
map("n", "<S-Left>", "<cmd>vertical resize -3<CR>", { desc = "Enini toraytirish" })
map("n", "<S-Up>", "<cmd>resize +3<CR>", { desc = "Balandlikni uzaytirish" })
map("n", "<S-Down>", "<cmd>resize -3<CR>", { desc = "Balandlikni qisqartirish" })

-- Move selected lines up/down in visual mode
map("v", "J", ":m '>+1<CR>gv=gv", { desc = "Move text down" })
map("v", "K", ":m '<-2<CR>gv=gv", { desc = "Move text up" })

-- Better indenting (stay in visual mode)
map("v", "<", "<gv")
map("v", ">", ">gv")

-- Paste without overwriting clipboard register
map("x", "<leader>p", '"_dP', { desc = "Paste without overwriting register" })

-- =========================
-- 📂 Fayllar va Explorer (Oil)
-- =========================
-- Space + o: Hozirgi ochiq fayl turgan papkani ochish
map("n", "<leader>o", "<Cmd>Oil<CR>", { desc = "Open Directory of Active File (Oil)" })

-- Space + e: Loyihaning bosh ildiz papkasini ochish
map("n", "<leader>e", "<Cmd>Oil .<CR>", { desc = "Open Project Explorer (Oil)" })

-- Minus (-): Papkalar bo'yicha yuqoriga / orqaga chiqish
map("n", "-", "<Cmd>Oil<CR>", { desc = "Open Parent Directory (Oil)" })

-- =========================
-- 📑 Bufferlar (Ochiq fayllar)
-- =========================
map("n", "H", "<Cmd>BufferLineCyclePrev<CR>", { desc = "Oldingi fayl", silent = true })
map("n", "L", "<Cmd>BufferLineCycleNext<CR>", { desc = "Keyingi fayl", silent = true })
map("n", "<leader>bd", "<Cmd>bdelete<CR>", { desc = "Hozirgi faylni yopish", silent = true })
map("n", "<leader>bo", function()
  local current = vim.fn.bufnr()
  vim.cmd('bufdo if bufnr("") != ' .. current .. ' | bdelete | endif')
end, { desc = "Boshqa barcha fayllarni yopish", silent = true })
map("n", "<leader>bD", "<Cmd>bufdo bdelete<CR>", { desc = "Barcha fayllarni yopish", silent = true })

-- Plugin Manager
map("n", "<leader>l", "<cmd>Lazy<CR>", { desc = "Lazy Plugin Manager" })
