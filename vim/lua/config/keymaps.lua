local map = vim.keymap.set

-- Search: Clear highlights with Esc
map("n", "<Esc>", "<cmd>nohlsearch<CR>", { desc = "Clear search highlight" })

-- Window splits & layout
map("n", "<leader>wv", "<C-w>v", { desc = "Vertical split" })
map("n", "<leader>wh", "<C-w>s", { desc = "Horizontal split" })
map("n", "<leader>wx", "<C-w>c", { desc = "Close current split" })
map("n", "<leader>w=", "<C-w>=", { desc = "Equalize split sizes" })

-- Window split zoom / maximize toggle
map("n", "<leader>wz", function()
  if vim.t.maximized then
    vim.cmd("wincmd =")
    vim.t.maximized = false
  else
    vim.cmd("wincmd _")
    vim.cmd("wincmd |")
    vim.t.maximized = true
  end
end, { desc = "Toggle maximize split (same letter as tmux prefix z)" })

-- Window split resizing (Shift + Arrow keys)
map("n", "<S-Right>", "<cmd>vertical resize +3<CR>", { desc = "Increase window width" })
map("n", "<S-Left>", "<cmd>vertical resize -3<CR>", { desc = "Decrease window width" })
map("n", "<S-Up>", "<cmd>resize +3<CR>", { desc = "Increase window height" })
map("n", "<S-Down>", "<cmd>resize -3<CR>", { desc = "Decrease window height" })

-- Line movement (Visual mode J/K)
map("v", "J", ":m '>+1<CR>gv=gv", { desc = "Move selected lines down" })
map("v", "K", ":m '<-2<CR>gv=gv", { desc = "Move selected lines up" })

-- Indentation (Stay in visual mode)
map("v", "<", "<gv", { desc = "Indent left" })
map("v", ">", ">gv", { desc = "Indent right" })

-- Clipboard: Paste without overwriting register
map("x", "<leader>p", '"_dP', { desc = "Paste without overwriting register" })

-- File explorer (Oil.nvim)
map("n", "<leader>o", "<Cmd>Oil<CR>", { desc = "Open parent directory of active file" })
map("n", "<leader>e", "<Cmd>Oil .<CR>", { desc = "Open project root directory" })
map("n", "-", "<Cmd>Oil<CR>", { desc = "Open parent directory" })

-- Buffers
map("n", "H", "<Cmd>bprevious<CR>", { desc = "Previous buffer", silent = true })
map("n", "L", "<Cmd>bnext<CR>", { desc = "Next buffer", silent = true })
map("n", "<leader>q", "<Cmd>bdelete<CR>", { desc = "Close current buffer", silent = true })

-- Plugin manager (Lazy)
map("n", "<leader>l", "<cmd>Lazy<CR>", { desc = "Lazy plugin manager" })
