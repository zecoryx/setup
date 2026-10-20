local map = vim.keymap.set

-- Search: Clear highlights with Esc
map("n", "<Esc>", "<cmd>nohlsearch<CR>", { desc = "Clear search highlight" })

-- No window/split keymaps: panes are tmux's job here. The splits diffview and
-- the picker still open are handled with vim's own <C-w> commands.

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
