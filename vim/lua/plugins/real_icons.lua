return {
  -- High-resolution SVG icon rendering for Ghostty and Kitty terminals
  {
    "Mirsmog/real-icons.nvim",
    lazy = false,
    priority = 1000,
    opts = function()
      return {
        pack = "symbols",
        packs = {
          symbols = {
            type = "vscode",
            path = vim.fn.stdpath("config") .. "/icons/vscode-symbols",
            manifest = "src/symbol-icon-theme.json",
          },
        },
        integrations = {
          oil = true,
          lualine = false,
          snacks_picker = true,
        },
      }
    end,
    config = function(_, opts)
      require("real-icons").setup(opts)
    end,
  },
}
