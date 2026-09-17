return {
  {
    "nvim-treesitter/nvim-treesitter",
    branch = "main",
    build = ":TSUpdate",
    lazy = false,
    config = function()
      local function enable_highlighting(buf)
        local filetype = vim.bo[buf].filetype
        if filetype == "" then
          return
        end
        pcall(vim.treesitter.start, buf, filetype)
      end

      pcall(function()
        require("nvim-treesitter").install({
          "bash",
          "diff",
          "html",
          "css",
          "javascript",
          "typescript",
          "tsx",
          "json",
          "yaml",
          "lua",
          "markdown",
          "markdown_inline",
          "php",
          "sql",
          "dockerfile",
        })
      end)

      vim.api.nvim_create_autocmd("FileType", {
        callback = function(args)
          enable_highlighting(args.buf)
        end,
      })

      enable_highlighting(vim.api.nvim_get_current_buf())
    end,
  },
}
