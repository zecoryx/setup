return {
  -- 🎨 Vague: Clean, low-contrast, non-rainbow dark theme (Grok / Antigravity / Cursor style)
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

  -- 💎 Symbols by Miguel Solorio (Exact minimal outline icons from your VSCode link)
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

  -- 📑 Bufferline: Visual tabs for open buffers at the top
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

  -- 📊 Minimalist Sleek Statusline (Matching Vague theme)
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

  -- ⚡ Tmux + Neovim Seamless Navigation (<C-h>, <C-j>, <C-k>, <C-l>)
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
      { "<c-h>", "<cmd><C-U>TmuxNavigateLeft<cr>", desc = "Navigate Left (Tmux/Nvim)" },
      { "<c-j>", "<cmd><C-U>TmuxNavigateDown<cr>", desc = "Navigate Down (Tmux/Nvim)" },
      { "<c-k>", "<cmd><C-U>TmuxNavigateUp<cr>", desc = "Navigate Up (Tmux/Nvim)" },
      { "<c-l>", "<cmd><C-U>TmuxNavigateRight<cr>", desc = "Navigate Right (Tmux/Nvim)" },
    },
  },

  -- 🗺️ Which-Key: Interactive menu for shortcuts
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
        { "<leader><space>", desc = "Find Files (Instant)" },
        { "<leader>o", desc = "Open Directory (Oil)" },
        { "<leader>e", desc = "Project Explorer (Oil .)" },
        { "<leader>v", desc = "Vertical Split" },
        { "<leader>h", desc = "Horizontal Split" },
        { "<leader>x", desc = "Close Split" },
        { "<leader>m", desc = "Maximize Split" },
        { "<leader>l", desc = "Lazy Plugins Manager" },
        { "<leader>b", group = "Buffers (Tabs)" },
        { "<leader>f", group = "Find / Search (Picker)" },
        { "<leader>g", group = "Git Tools" },
        { "<leader>s", group = "Search & Replace" },
        { "<leader>c", group = "Code Actions / Format" },
        { "<leader>t", group = "Toggles" },
      },
    },
  },
}
