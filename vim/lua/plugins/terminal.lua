return {
  {
    "akinsho/toggleterm.nvim",
    version = "*",
    config = function()
      require("toggleterm").setup({
        size = function(term)
          if term.direction == "horizontal" then
            return 15
          elseif term.direction == "vertical" then
            return vim.o.columns * 0.4
          end
        end,
        open_mapping = [[<c-\>]],
        hide_numbers = true,
        shade_terminals = false,
        start_in_insert = true,
        insert_mappings = true,
        terminal_mappings = true,
        persist_size = true,
        persist_mode = true,
        direction = "float",
        close_on_exit = true,
        auto_scroll = true,
        float_opts = {
          border = "rounded",
          winblend = 0,
        },
      })

      -- Terminal rejimida tez chiqish va toggle qilish
      function _G.set_terminal_keymaps()
        local opts = { buffer = 0, silent = true }
        vim.keymap.set("t", "<C-\\>", [[<Cmd>ToggleTerm<CR>]], opts)
      end

      vim.api.nvim_create_autocmd("TermOpen", {
        pattern = "term://*toggleterm#*",
        callback = function()
          set_terminal_keymaps()
        end,
      })

      -- 1-5 raqamli terminallarni bevosita ochish / almashtirish:
      -- Masalan: <C-\>1, <C-\>2 yoki oddiygina 1<C-\>, 2<C-\>
      for i = 1, 5 do
        vim.keymap.set({ "n", "t" }, "<C-\\>" .. i, "<Cmd>" .. i .. "ToggleTerm<CR>", { silent = true, desc = "Toggle Terminal " .. i })
      end
    end,
  },
}
