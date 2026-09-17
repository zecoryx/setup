return {
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
      words = { enabled = true },
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
    },
    config = function(_, opts)
      vim.api.nvim_set_hl(0, "SnacksIndent", { fg = "#252530" })
      vim.api.nvim_set_hl(0, "SnacksIndentScope", { fg = "#6e94b2" })
      require("snacks").setup(opts)
    end,
    keys = {
      -- ⚡ Instant Find Files with <Space><Space>
      { "<leader><space>", function() Snacks.picker.files() end, desc = "Find Files (Instant)" },

      -- 🔍 Fuzzy Finder (Snacks Picker)
      { "<leader>ff", function() Snacks.picker.files() end, desc = "Find Files" },
      { "<leader>fg", function() Snacks.picker.grep() end, desc = "Live Grep (Search Code)" },
      { "<leader>fb", function() Snacks.picker.buffers() end, desc = "Find Buffers" },
      { "<leader>fr", function() Snacks.picker.recent() end, desc = "Recent Files" },
      { "<leader>fs", function() Snacks.picker.smart() end, desc = "Smart Find Files" },
      { "<leader>fc", function() Snacks.picker.files({ cwd = vim.fn.stdpath("config") }) end, desc = "Find Config Files" },

      -- 🖼️ Hover Image Preview
      { "<leader>mi", function() Snacks.image.hover() end, desc = "Hover Image Preview" },

      -- 🚀 Floating Dev Tools
      { "<leader>gg", function() Snacks.lazygit() end, desc = "Lazygit (Floating)" },
    },
  },
}
