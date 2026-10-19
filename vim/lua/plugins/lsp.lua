return {
  -- Portable package manager for LSP servers, formatters, and linters
  {
    "williamboman/mason.nvim",
    cmd = "Mason",
    build = ":MasonUpdate",
    opts = {
      ui = {
        border = "rounded",
        icons = {
          package_installed = "✓",
          package_pending = "➜",
          package_uninstalled = "✗",
        },
      },
    },
  },

  -- Native LSP configuration and language server management
  {
    "neovim/nvim-lspconfig",
    event = { "BufReadPre", "BufNewFile" },
    dependencies = {
      "williamboman/mason.nvim",
      "williamboman/mason-lspconfig.nvim",
      "saghen/blink.cmp",
    },
    config = function()
      -- Diagnostics UI appearance and signs
      vim.diagnostic.config({
        virtual_text = {
          prefix = "●",
          spacing = 2,
        },
        signs = {
          text = {
            [vim.diagnostic.severity.ERROR] = "",
            [vim.diagnostic.severity.WARN] = "",
            [vim.diagnostic.severity.HINT] = "",
            [vim.diagnostic.severity.INFO] = "",
          },
        },
        underline = true,
        update_in_insert = false,
        severity_sort = true,
        float = {
          border = "rounded",
          source = "always",
        },
      })

      -- Diagnostic global keymaps
      vim.keymap.set("n", "[d", function()
        vim.diagnostic.jump({ count = -1, float = true })
      end, { desc = "Previous Diagnostic" })

      vim.keymap.set("n", "]d", function()
        vim.diagnostic.jump({ count = 1, float = true })
      end, { desc = "Next Diagnostic" })

      vim.keymap.set("n", "<leader>cd", function()
        vim.diagnostic.open_float({ border = "rounded" })
      end, { desc = "Line Diagnostics (Float)" })

      -- Keymaps on LSP attach
      vim.api.nvim_create_autocmd("LspAttach", {
        group = vim.api.nvim_create_augroup("UserLspConfig", {}),
        callback = function(ev)
          local map = function(keys, func, desc, mode)
            mode = mode or "n"
            vim.keymap.set(mode, keys, func, { buffer = ev.buf, desc = "LSP: " .. desc })
          end

          -- Navigation & definitions. snacks.nvim loads eagerly, so its picker is always there.
          map("gd", function() Snacks.picker.lsp_definitions() end, "Go to Definition")

          map("gD", vim.lsp.buf.declaration, "Go to Declaration")

          map("gr", function() Snacks.picker.lsp_references() end, "Go to References")

          map("gi", function() Snacks.picker.lsp_implementations() end, "Go to Implementation")

          map("gy", function() Snacks.picker.lsp_type_definitions() end, "Type Definition")

          -- Hover documentation & signature help
          map("K", function()
            vim.lsp.buf.hover({ border = "rounded" })
          end, "Hover Documentation")

          map("gK", function()
            vim.lsp.buf.signature_help({ border = "rounded" })
          end, "Signature Documentation")

          -- Code actions and refactoring
          map("<leader>ca", vim.lsp.buf.code_action, "Code Action", { "n", "v" })
          map("<leader>cr", vim.lsp.buf.rename, "Rename Symbol")

          -- Inlay hints toggle
          local client = vim.lsp.get_client_by_id(ev.data.client_id)
          if client and client:supports_method("textDocument/inlayHint", { bufnr = ev.buf }) then
            map("<leader>th", function()
              vim.lsp.inlay_hint.enable(not vim.lsp.inlay_hint.is_enabled({ bufnr = ev.buf }), { bufnr = ev.buf })
            end, "Toggle Inlay Hints")
          end
        end,
      })

      -- Per-server settings. mason-lspconfig v2 enables installed servers itself,
      -- so overrides must go through vim.lsp.config (its old `handlers` option is gone).
      vim.lsp.config("*", {
        capabilities = require("blink.cmp").get_lsp_capabilities(),
      })

      -- TypeScript & JavaScript with auto-import and inlay hints
      vim.lsp.config("ts_ls", {
        settings = {
          typescript = {
            inlayHints = {
              includeInlayParameterNameHints = "all",
              includeInlayParameterNameHintsWhenArgumentMatchesName = false,
              includeInlayFunctionParameterTypeHints = true,
              includeInlayVariableTypeHints = false,
              includeInlayPropertyDeclarationTypeHints = true,
              includeInlayFunctionLikeReturnTypeHints = true,
              includeInlayEnumMemberValueHints = true,
            },
            suggest = {
              completeFunctionCalls = true,
            },
            preferences = {
              includeCompletionsForModuleExports = true,
              quotePreference = "auto",
            },
          },
          javascript = {
            suggest = {
              completeFunctionCalls = true,
            },
            preferences = {
              includeCompletionsForModuleExports = true,
              quotePreference = "auto",
            },
          },
        },
      })

      -- TailwindCSS: also complete classes inside cva()/cx()/cn() helpers
      vim.lsp.config("tailwindcss", {
        settings = {
          tailwindCSS = {
            experimental = {
              classRegex = {
                { "cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]" },
                { "cx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)" },
                { "cn\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)" },
              },
            },
          },
        },
      })

      -- Lua language server
      vim.lsp.config("lua_ls", {
        settings = {
          Lua = {
            diagnostics = {
              globals = { "vim", "Snacks" },
            },
            workspace = {
              checkThirdParty = false,
            },
            telemetry = { enable = false },
          },
        },
      })

      require("mason-lspconfig").setup({
        ensure_installed = {
          "ts_ls",
          "tailwindcss",
          "html",
          "cssls",
          "jsonls",
          "lua_ls",
        },
      })
    end,
  },
}
