return {
  {
    "stevearc/oil.nvim",
    dependencies = { "nvim-tree/nvim-web-devicons" },
    lazy = false,
    opts = {
      default_file_explorer = true,
      delete_to_trash = true,
      skip_confirm_for_simple_edits = true,
      columns = {
        {
          "icon",
          directory = "",
          default_file = "",
          add_padding = true,
        },
      },
      keymaps = {
        ["<Esc>"] = "actions.parent",      -- Esc orqaga (yuqoriga) chiqadi
        ["<BS>"] = "actions.parent",       -- Backspace orqaga
        ["-"] = "actions.parent",          -- Minus orqaga
        ["<CR>"] = "actions.select",       -- Enter papkaga kiradi yoki faylni ochadi
        ["q"] = "actions.close",           -- q yopadi
        ["<C-c>"] = "actions.close",
        ["g."] = "actions.toggle_hidden",  -- Yashirin fayllarni ko'rsatish/yashirish
      },
      view_options = {
        show_hidden = false,
      },
    },
    config = function(_, opts)
      vim.api.nvim_set_hl(0, "OilDirIcon", { fg = "#7e9cd8" })
      require("oil").setup(opts)
    end,
  },
}
