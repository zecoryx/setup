return {
  -- Low-contrast dark colorscheme (Vague)
  {
    "vague2k/vague.nvim",
    lazy = false,
    priority = 1000,
    config = function()
      require("vague").setup({
        transparent = false,
        style = {
          comments = "italic",
          keywords = "bold",
        },
      })
      vim.cmd.colorscheme("vague")
    end,
  },

  -- Fallback file icons with custom overrides
  {
    "nvim-tree/nvim-web-devicons",
    lazy = false,
    opts = {
      default = true,
      color_icons = true,
      override = {
        [".env"] = { icon = "", color = "#8b949e", name = "Env" },
        [".env.example"] = { icon = "", color = "#8b949e", name = "EnvExample" },
        [".fallowrc.json"] = { icon = "", color = "#d19a66", name = "Fallow" },
        [".gitignore"] = { icon = "", color = "#e06c75", name = "Gitignore" },
        [".prettierrc"] = { icon = "", color = "#56b6c2", name = "Prettier" },
        [".rr.yaml"] = { icon = "", color = "#c678dd", name = "RoadRunner" },
        ["AGENTS.md"] = { icon = "", color = "#61afef", name = "Agents" },
        ["artisan"] = { icon = "", color = "#e06c75", name = "Artisan" },
        ["bun.lock"] = { icon = "", color = "#abb2bf", name = "BunLock" },
        ["composer.json"] = { icon = "", color = "#d19a66", name = "ComposerJson" },
        ["composer.lock"] = { icon = "", color = "#d19a66", name = "ComposerLock" },
        ["Dockerfile"] = { icon = "󰡨", color = "#61afef", name = "Dockerfile" },
        ["eslint.config.js"] = { icon = "", color = "#98c379", name = "Eslint" },
        ["package.json"] = { icon = "", color = "#98c379", name = "PackageJson" },
        ["phpunit.xml"] = { icon = "󰙨", color = "#e06c75", name = "PhpUnit" },
        ["pint.json"] = { icon = "", color = "#d19a66", name = "PintJson" },
        ["supervisord.conf"] = { icon = "", color = "#8b949e", name = "Supervisor" },
        ["tsconfig.json"] = { icon = "", color = "#61afef", name = "TsConfig" },
      },
    },
  },

  -- Buffer tabs at the top of the editor
  {
    "akinsho/bufferline.nvim",
    event = "VeryLazy",
    dependencies = { "nvim-tree/nvim-web-devicons" },
    opts = {
      options = {
        mode = "buffers",
        show_buffer_close_icons = false,
        show_close_icon = false,
        always_show_bufferline = true,
        separator_style = "thin",
        diagnostics = false,
        custom_filter = function(buf_number)
          local ft = vim.bo[buf_number].filetype
          local skip = { ["grug-far"] = true, oil = true, snacks_terminal = true, toggleterm = true, qf = true }
          return not skip[ft]
        end,
      },
    },
  },

  -- Minimalist global statusline
  {
    "nvim-lualine/lualine.nvim",
    event = "VeryLazy",
    dependencies = { "nvim-tree/nvim-web-devicons" },
    opts = {
      options = {
        theme = "auto",
        globalstatus = true,
        component_separators = { left = "", right = "" },
        section_separators = { left = "", right = "" },
        disabled_filetypes = { statusline = { "oil" } },
      },
      sections = {
        lualine_a = { { "mode" } },
        lualine_b = { { "filename", path = 1, file_status = true } },
        lualine_c = {},
        lualine_x = {
          { "diagnostics" },
          { "branch", icon = "" },
        },
        lualine_y = {},
        lualine_z = { { "location" } },
      },
    },
  },

  -- Seamless navigation between Neovim splits and Tmux panes
  {
    "christoomey/vim-tmux-navigator",
    cmd = {
      "TmuxNavigateLeft",
      "TmuxNavigateDown",
      "TmuxNavigateUp",
      "TmuxNavigateRight",
      "TmuxNavigatePrevious",
    },
    keys = {
      { "<c-h>", "<cmd><C-U>TmuxNavigateLeft<cr>", desc = "Navigate left (Tmux/Nvim)" },
      { "<c-j>", "<cmd><C-U>TmuxNavigateDown<cr>", desc = "Navigate down (Tmux/Nvim)" },
      { "<c-k>", "<cmd><C-U>TmuxNavigateUp<cr>", desc = "Navigate up (Tmux/Nvim)" },
      { "<c-l>", "<cmd><C-U>TmuxNavigateRight<cr>", desc = "Navigate right (Tmux/Nvim)" },
    },
  },

  -- Interactive keybinding guide popup
  {
    "folke/which-key.nvim",
    event = "VeryLazy",
    opts = {
      preset = "modern",
      win = {
        border = "rounded",
        padding = { 1, 2 },
      },
      spec = {
        { "<leader><space>", desc = "Find files (Instant)" },
        { "<leader>o", desc = "Open directory (Oil)" },
        { "<leader>e", desc = "Project explorer (Oil)" },
        { "<leader>v", desc = "Vertical split" },
        { "<leader>h", desc = "Horizontal split" },
        { "<leader>x", desc = "Close split" },
        { "<leader>m", desc = "Maximize split" },
        { "<leader>l", desc = "Lazy plugin manager" },
        { "<leader>b", group = "Buffers (Tabs)" },
        { "<leader>f", group = "Find / Search (Picker)" },
        { "<leader>g", group = "Git tools" },
        { "<leader>s", group = "Search & replace" },
        { "<leader>c", group = "Code actions / Format" },
        { "<leader>t", group = "Toggles" },
      },
    },
  },
}
