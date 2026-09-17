local opt = vim.opt

-- Line numbers
opt.number = true
opt.relativenumber = true

-- Tabs & Indentation
opt.tabstop = 4
opt.shiftwidth = 4
opt.expandtab = true
opt.autoindent = true
opt.smartindent = true

-- Line wrapping
opt.wrap = false

-- Search settings
opt.ignorecase = true
opt.smartcase = true
opt.hlsearch = true
opt.incsearch = true

-- Visuals & UX (Clean bottom area)
opt.termguicolors = true
opt.cursorline = true
opt.signcolumn = "yes"
opt.scrolloff = 8
opt.sidescrolloff = 8

-- Eliminate 3-line bottom clutter:
opt.cmdheight = 0        -- Hide command line when not typing ':' (removes middle line!)
opt.showmode = false     -- Don't show '-- INSERT --' (statusline handles it)
opt.laststatus = 3       -- Single unified global statusline

-- Timing (fast response)
opt.timeoutlen = 300
opt.updatetime = 100

-- Window splits
opt.splitright = true
opt.splitbelow = true

-- Clipboard integration
opt.clipboard = "unnamedplus"

-- Undo & Backup
opt.undofile = true
opt.swapfile = false
opt.backup = false

-- Whitespace
opt.list = false
