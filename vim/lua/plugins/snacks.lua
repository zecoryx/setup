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
      statuscolumn = { enabled = false },
      scroll = { enabled = true },
      words = { enabled = false },
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
        only_scope = false,
        only_current = false,
        animate = { enabled = false },
        scope = { enabled = true, char = "│" },
      },
      picker = {
        enabled = true,
        ui_select = true,
        sources = {
          files = {
            hidden = false,
            ignored = false,
          },
        },
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

      -- Floating terminal toggle (<C-\>)
      vim.keymap.set({ "n", "t" }, "<C-\x5c>", function()
        Snacks.terminal.toggle(nil, {
          win = {
            style = "float",
            border = "rounded",
            position = "float",
          },
        })
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
      -- Instant file picker
      { "<leader><space>", function() Snacks.picker.files() end, desc = "Find files (Instant)" },

      -- Fuzzy finders
      { "<leader>ff", function() Snacks.picker.files() end, desc = "Find files" },
      { "<leader>fg", function() Snacks.picker.grep() end, desc = "Live grep" },
      { "<leader>fb", function() Snacks.picker.buffers() end, desc = "Find buffers" },
      { "<leader>fr", function() Snacks.picker.recent() end, desc = "Recent files" },
      { "<leader>fs", function() Snacks.picker.smart() end, desc = "Smart find files" },
      { "<leader>fc", function() Snacks.picker.files({ cwd = vim.fn.stdpath("config") }) end, desc = "Find config files" },

      -- Image preview
      { "<leader>mi", function() Snacks.image.hover() end, desc = "Hover image preview" },

      -- Git UI (Lazygit)
      { "<leader>gg", function() Snacks.lazygit() end, desc = "Lazygit floating window" },
    },
  },
}
