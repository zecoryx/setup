return {
  -- ⚡ Auto-close brackets, quotes, etc.
  {
    "echasnovski/mini.pairs",
    event = "InsertEnter",
    version = false,
    opts = {},
  },

  -- ⚡ Flash.nvim: Ultra-fast motion jump across visible screen
  {
    "folke/flash.nvim",
    event = "VeryLazy",
    opts = {
      labels = "asdfghjklqwertyuiopzxcvbnm",
      search = {
        mode = "exact",
      },
    },
    keys = {
      {
        "s",
        mode = { "n", "x", "o" },
        function()
          require("flash").jump()
        end,
        desc = "Flash Jump",
      },
      {
        "S",
        mode = { "n", "x", "o" },
        function()
          require("flash").treesitter()
        end,
        desc = "Flash Treesitter Select",
      },
      {
        "r",
        mode = "o",
        function()
          require("flash").remote()
        end,
        desc = "Remote Flash",
      },
      {
        "R",
        mode = { "o", "x" },
        function()
          require("flash").treesitter_search()
        end,
        desc = "Treesitter Search",
      },
    },
  },

  -- 🔍 Search & Replace across entire project
  {
    "MagicDuck/grug-far.nvim",
    cmd = "GrugFar",
    keys = {
      {
        "<leader>sr",
        function()
          require("grug-far").open()
        end,
        desc = "Search and Replace (grug-far)",
      },
      {
        "<leader>sw",
        function()
          require("grug-far").open({ prefills = { search = vim.fn.expand("<cword>") } })
        end,
        desc = "Search Word under Cursor (grug-far)",
      },
    },
    opts = {
      windowCreationCommand = "tabnew",
    },
  },

  -- ⏳ Undotree: Visual time-travel history
  {
    "mbbill/undotree",
    cmd = "UndotreeToggle",
    keys = {
      { "<leader>u", "<cmd>UndotreeToggle<cr>", desc = "Toggle Undo Tree" },
    },
    config = function()
      vim.g.undotree_WindowLayout = 2
      vim.g.undotree_SplitWidth = 35
      vim.g.undotree_SetFocusWhenToggle = 1
    end,
  },

  -- 🎯 Trouble.nvim: Diagnostics, symbols and references list
  {
    "folke/trouble.nvim",
    cmd = { "Trouble" },
    opts = {
      modes = {
        diagnostics = {
          auto_open = false,
          auto_close = true,
        },
      },
    },
    keys = {
      { "<leader>xx", "<cmd>Trouble diagnostics toggle<cr>", desc = "Diagnostics (Trouble)" },
      { "<leader>xX", "<cmd>Trouble diagnostics toggle filter.buf=0<cr>", desc = "Buffer Diagnostics (Trouble)" },
      { "<leader>cs", "<cmd>Trouble symbols toggle focus=false<cr>", desc = "Symbols (Trouble)" },
      { "<leader>cl", "<cmd>Trouble lsp toggle focus=false win.position=right<cr>", desc = "LSP Definitions / References" },
      { "<leader>xL", "<cmd>Trouble loclist toggle<cr>", desc = "Location List (Trouble)" },
      { "<leader>xQ", "<cmd>Trouble qflist toggle<cr>", desc = "Quickfix List (Trouble)" },
    },
  },

  -- 📋 Yanky.nvim: Clipboard History with Cycle Paste
  {
    "gbprod/yanky.nvim",
    event = { "BufReadPost", "BufNewFile" },
    opts = {
      ring = { history_length = 100 },
      highlight = { timer = 150 },
    },
    keys = {
      { "p", "<Plug>(YankyPutAfter)", mode = { "n", "x" }, desc = "Put after" },
      { "P", "<Plug>(YankyPutBefore)", mode = { "n", "x" }, desc = "Put before" },
      { "gp", "<Plug>(YankyGPutAfter)", mode = { "n", "x" }, desc = "GPut after" },
      { "gP", "<Plug>(YankyGPutBefore)", mode = { "n", "x" }, desc = "GPut before" },
      { "<c-p>", "<Plug>(YankyPreviousEntry)", desc = "Cycle backward through history" },
      { "<c-n>", "<Plug>(YankyNextEntry)", desc = "Cycle forward through history" },
      { "<leader>y", "<cmd>YankyRingHistory<cr>", desc = "Open Yank History" },
    },
  },
}
