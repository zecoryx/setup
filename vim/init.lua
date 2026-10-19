-- Bytecode cache loader: faster startup and Lua module loading
vim.loader.enable()

-- Leader key must be set before any plugin is loaded
vim.g.mapleader = " "
vim.g.maplocalleader = " "

-- Load core modules
require("config.options")
require("config.keymaps")
require("config.lazy")
