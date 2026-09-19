return {
  -- Real-time color highlighting for TailwindCSS and HEX/RGB values
  {
    "brenoprata10/nvim-highlight-colors",
    event = { "BufReadPre", "BufNewFile" },
    opts = {
      render = "background",
      enable_named_colors = true,
      enable_tailwind = true,
      enable_short_hex = true,
      virtual_symbol = "■",
    },
  },
}
