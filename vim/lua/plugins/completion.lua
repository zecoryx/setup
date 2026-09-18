return {
  {
    "saghen/blink.cmp",
    lazy = false,
    version = "*",
    dependencies = {
      "rafamadriz/friendly-snippets",
    },
    opts = {
      keymap = {
        preset = "enter",
        ["<C-Space>"] = { "show", "show_documentation", "hide_documentation" },
        ["<C-b>"] = { "scroll_documentation_up", "fallback" },
        ["<C-f>"] = { "scroll_documentation_down", "fallback" },
        ["<Tab>"] = { "select_next", "snippet_forward", "fallback" },
        ["<S-Tab>"] = { "select_prev", "snippet_backward", "fallback" },
      },
      appearance = {
        nerd_font_variant = "mono",
      },
      completion = {
        documentation = {
          auto_show = true,
          auto_show_delay_ms = 200,
          window = { border = "rounded" },
        },
        menu = {
          border = "rounded",
        },
        list = {
          selection = { preselect = false, auto_insert = false },
        },
      },
      sources = {
        default = { "snippets", "buffer", "path" },
      },
      fuzzy = { implementation = "prefer_rust_with_warning" },
    },
  },
}
