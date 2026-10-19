return {
  -- High-performance modern utilities and fuzzy finder
  {
    "folke/snacks.nvim",
    priority = 1000,
    lazy = false,
    opts = {
      bigfile = { enabled = true },
      notifier = { enabled = true, timeout = 3000 },
      quickfile = { enabled = true },
      scroll = { enabled = true },
      image = {
        enabled = true,
        doc = {
          enabled = true,
          inline = true,
          float = true,
        },
      },
      indent = {
        enabled = true,
        char = "│",
        animate = { enabled = false },
        scope = { enabled = true, char = "│" },
      },
      picker = {
        enabled = true,
        ui_select = true,
      },
      lazygit = {
        enabled = true,
      },
      terminal = {
        enabled = true,
        win = {
          style = "float",
          border = "rounded",
        },
      },
    },
    config = function(_, opts)
      vim.api.nvim_set_hl(0, "SnacksIndent", { fg = "#252530" })
      vim.api.nvim_set_hl(0, "SnacksIndentScope", { fg = "#6e94b2" })
      require("snacks").setup(opts)

      -- Floating terminal toggle (<C-\>); window style comes from opts.terminal.win
      vim.keymap.set({ "n", "t" }, "<C-\x5c>", function()
        Snacks.terminal.toggle()
      end, { desc = "Toggle terminal", silent = true })

      -- Optimize terminal buffer performance
      vim.api.nvim_create_autocmd("TermOpen", {
        pattern = "term://*",
        callback = function()
          vim.opt_local.foldmethod = "manual"
          vim.opt_local.relativenumber = false
          vim.opt_local.number = false
          vim.opt_local.signcolumn = "no"
          vim.opt_local.spell = false
        end,
      })
    end,
    keys = {
      -- One letter each: these are the keys pressed dozens of times a day
      { "<leader>f", function() Snacks.picker.files() end, desc = "Find files" },
      { "<leader>s", function() Snacks.picker.grep() end, desc = "Search text in project" },
      { "<leader>/", function() Snacks.picker.grep_buffers() end, desc = "Search text in open buffers" },
      { "<leader>b", function() Snacks.picker.buffers() end, desc = "Buffers" },

      { "<leader>i", function() Snacks.image.hover() end, desc = "Image preview" },
      { "<leader>gg", function() Snacks.lazygit() end, desc = "Lazygit floating window" },
    },
  },
}
