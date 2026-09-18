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

      -- ⚡ Ctrl+\ => Snacks floating terminal (ToggleTerm o'rniga)
      -- Snacks.terminal terminalni fonda keshlab qo'yadi,
      -- ikkinchi ochilishda deyarli 0ms da paydo bo'ladi
      vim.keymap.set({ "n", "t" }, "<C-\\>", function()
        Snacks.terminal.toggle(nil, {
          win = {
            style = "float",
            border = "rounded",
            position = "float",
          },
        })
      end, { desc = "Toggle Terminal (Snacks)", silent = true })

      -- Terminal buferini yengil qilish
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
