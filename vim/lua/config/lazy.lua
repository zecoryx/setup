-- Bootstrap lazy.nvim package manager if not already installed
local lazypath = vim.fn.stdpath("data") .. "/lazy/lazy.nvim"
if not (vim.uv or vim.loop).fs_stat(lazypath) then
  local lazyrepo = "https://github.com/folke/lazy.nvim.git"
  local out = vim.fn.system({ "git", "clone", "--filter=blob:none", "--branch=stable", lazyrepo, lazypath })
  if vim.v.shell_error ~= 0 then
    vim.api.nvim_echo({
      { "Failed to clone lazy.nvim:\n", "ErrorMsg" },
      { out, "WarningMsg" },
      { "\nPress any key to exit..." },
    }, true, {})
    vim.fn.getchar()
    os.exit(1)
  end
end
vim.opt.rtp:prepend(lazypath)

-- Initialize lazy.nvim
require("lazy").setup({
  -- Load all plugin specifications from lua/plugins/
  spec = {
    { import = "plugins" },
  },

  -- Plugin defaults: track latest stable versions
  defaults = {
    lazy = false,
    version = false,
  },

  -- Floating UI styling
  ui = {
    border = "rounded",
  },

  -- No update polling, no "config changed" toasts
  checker = {
    enabled = false,
  },
  change_detection = {
    notify = false,
  },

  -- Disable unused built-in Vim plugins (this also sets vim.g.loaded_netrw)
  performance = {
    rtp = {
      disabled_plugins = {
        "gzip",
        "tarPlugin",
        "tohtml",
        "tutor",
        "zipPlugin",
        "netrw",
        "netrwPlugin",
        "netrwSettings",
        "netrwFileHandlers",
      },
    },
  },
})
