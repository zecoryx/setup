-- Leader key must be set before any plugin is loaded
vim.g.mapleader = " "
vim.g.maplocalleader = " "

-- Completely disable netrw at startup (replaced by oil.nvim)
vim.g.loaded_netrw = 1
vim.g.loaded_netrwPlugin = 1

-- Load core modules
require("config.options")
require("config.keymaps")
require("config.lazy")
