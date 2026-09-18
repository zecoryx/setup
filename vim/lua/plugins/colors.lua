return {
  -- 🎨 TailwindCSS & HEX/RGB real-time color highlights in buffer
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
