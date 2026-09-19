return {
  -- Git signs in gutter with inline blame
  {
    "lewis6991/gitsigns.nvim",
    event = { "BufReadPre", "BufNewFile" },
    opts = {
      signs = {
        add = { text = "▎" },
        change = { text = "▎" },
        delete = { text = "" },
        topdelete = { text = "" },
        changedelete = { text = "▎" },
        untracked = { text = "▎" },
      },
      current_line_blame = true,
      current_line_blame_opts = {
        delay = 300,
        virt_text_pos = "eol",
      },
      current_line_blame_formatter = "   <author>, <author_time:%R> • <summary>",
      on_attach = function(bufnr)
        local gs = require("gitsigns")
        local function map(mode, l, r, desc)
          vim.keymap.set(mode, l, r, { buffer = bufnr, desc = "Git: " .. desc })
        end

        -- Hunk navigation
        map("n", "]c", function()
          if vim.wo.diff then
            vim.cmd.normal({ "]c", bang = true })
          else
            gs.nav_hunk("next")
          end
        end, "Next hunk")

        map("n", "[c", function()
          if vim.wo.diff then
            vim.cmd.normal({ "[c", bang = true })
          else
            gs.nav_hunk("prev")
          end
        end, "Prev hunk")

        -- Hunk actions
        map("n", "<leader>hp", gs.preview_hunk, "Preview hunk")
        map("n", "<leader>hr", gs.reset_hunk, "Reset hunk")
        map("n", "<leader>hs", gs.stage_hunk, "Stage hunk")
        map("n", "<leader>hb", function() gs.blame_line({ full = true }) end, "Blame line (Full)")
        map("n", "<leader>tb", gs.toggle_current_line_blame, "Toggle line blame")
      end,
    },
  },

  -- Visual diff and file history viewer
  {
    "sindrets/diffview.nvim",
    cmd = { "DiffviewOpen", "DiffviewClose", "DiffviewFileHistory" },
    keys = {
      { "<leader>gd", "<cmd>DiffviewOpen<cr>", desc = "Open git diffview" },
      { "<leader>gh", "<cmd>DiffviewFileHistory %<cr>", desc = "Current file git history" },
    },
    opts = {
      enhanced_diff_hl = true,
      view = {
        default = {
          layout = "diff2_horizontal",
        },
      },
    },
  },

  -- 3-Way merge conflict resolution
  {
    "akinsho/git-conflict.nvim",
    version = "*",
    event = "BufReadPre",
    opts = {
      default_mappings = true,
      disable_diagnostics = true,
    },
    keys = {
      { "<leader>gc", "<cmd>GitConflictListQf<cr>", desc = "List git conflicts (Quickfix)" },
    },
  },

  -- GitHub issues and pull requests integration
  {
    "pwntester/octo.nvim",
    cmd = { "Octo" },
    dependencies = {
      "nvim-lua/plenary.nvim",
      "echasnovski/mini.icons",
    },
    opts = {
      enable_builtin = true,
      default_to_projects_v2 = true,
      default_merge_method = "squash",
      picker = "snacks",
    },
    keys = {
      { "<leader>gi", "<cmd>Octo issue list<cr>", desc = "GitHub issues" },
      { "<leader>gp", "<cmd>Octo pr list<cr>", desc = "GitHub pull requests" },
      { "<leader>gr", "<cmd>Octo repo list<cr>", desc = "GitHub repositories" },
      { "<leader>go", "<cmd>Octo<cr>", desc = "Octo menu" },
    },
  },
}
