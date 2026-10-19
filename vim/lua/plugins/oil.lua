return {
  -- File manager buffer editor
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
        ["<Esc>"] = "actions.parent",
        ["<BS>"] = "actions.parent",
        ["-"] = "actions.parent",
        ["<CR>"] = "actions.select",
        ["q"] = "actions.close",
        ["<C-c>"] = "actions.close",
        ["g."] = "actions.toggle_hidden",
      },
      view_options = {
        show_hidden = false,
      },
    },
    config = function(_, opts)
      local function dir_hl()
        vim.api.nvim_set_hl(0, "OilDirIcon", { link = "Directory" })
      end
      dir_hl()
      vim.api.nvim_create_autocmd("ColorScheme", { callback = dir_hl })

      require("oil").setup(opts)
    end,
  },
}
