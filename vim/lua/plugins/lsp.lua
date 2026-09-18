return {
  -- 📦 Mason: Portable package manager for LSP servers
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

  -- 🔌 Mason-lspconfig & nvim-lspconfig
  {
    "neovim/nvim-lspconfig",
    event = { "BufReadPre", "BufNewFile" },
    dependencies = {
      "williamboman/mason.nvim",
      "williamboman/mason-lspconfig.nvim",
      "saghen/blink.cmp",
    },
    config = function()
      -- 🎨 Diagnostics UI configuration
      vim.diagnostic.config({
        virtual_text = {
          prefix = "●",
          spacing = 2,
        },
        signs = {
          text = {
            [vim.diagnostic.severity.ERROR] = "",
            [vim.diagnostic.severity.WARN] = "",
            [vim.diagnostic.severity.HINT] = "",
            [vim.diagnostic.severity.INFO] = "",
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
      vim.keymap.set("n", "[d", vim.diagnostic.goto_prev, { desc = "Previous Diagnostic" })
      vim.keymap.set("n", "]d", vim.diagnostic.goto_next, { desc = "Next Diagnostic" })
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

          -- 🎯 Go to Definition & Navigation
          map("gd", function()
            local ok, snacks = pcall(require, "snacks")
            if ok and snacks.picker and snacks.picker.lsp_definitions then
              snacks.picker.lsp_definitions()
            else
              vim.lsp.buf.definition()
            end
          end, "Go to Definition")

          map("gD", vim.lsp.buf.declaration, "Go to Declaration")

          map("gr", function()
            local ok, snacks = pcall(require, "snacks")
            if ok and snacks.picker and snacks.picker.lsp_references then
              snacks.picker.lsp_references()
            else
              vim.lsp.buf.references()
            end
          end, "Go to References")

          map("gi", function()
            local ok, snacks = pcall(require, "snacks")
            if ok and snacks.picker and snacks.picker.lsp_implementations then
              snacks.picker.lsp_implementations()
            else
              vim.lsp.buf.implementation()
            end
          end, "Go to Implementation")

          map("gy", function()
            local ok, snacks = pcall(require, "snacks")
            if ok and snacks.picker and snacks.picker.lsp_type_definitions then
              snacks.picker.lsp_type_definitions()
            else
              vim.lsp.buf.type_definition()
            end
          end, "Type Definition")

          -- 📖 Hover Documentation & Signature
          map("K", function()
            vim.lsp.buf.hover({ border = "rounded" })
          end, "Hover Documentation")

          map("gK", function()
            vim.lsp.buf.signature_help({ border = "rounded" })
          end, "Signature Documentation")

          -- ⚡ Code Actions & Rename
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

      -- Get capabilities supported by blink.cmp
      local capabilities = require("blink.cmp").get_lsp_capabilities()

      local lspconfig = require("lspconfig")

      -- Mason LSPConfig automatically installs and configures servers
      require("mason-lspconfig").setup({
        ensure_installed = {
          "ts_ls",
          "tailwindcss",
          "html",
          "cssls",
          "jsonls",
          "lua_ls",
        },
        automatic_installation = true,
        handlers = {
          -- Default handler
          function(server_name)
            lspconfig[server_name].setup({
              capabilities = capabilities,
            })
          end,

          -- ⚡ TypeScript / JavaScript with Auto-Import
          ["ts_ls"] = function()
            lspconfig.ts_ls.setup({
              capabilities = capabilities,
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
          end,

          -- 🎨 TailwindCSS Language Server
          ["tailwindcss"] = function()
            lspconfig.tailwindcss.setup({
              capabilities = capabilities,
              filetypes = {
                "html",
                "css",
                "scss",
                "javascript",
                "javascriptreact",
                "typescript",
                "typescriptreact",
              },
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
          end,

          -- 🌙 Lua Language Server
          ["lua_ls"] = function()
            lspconfig.lua_ls.setup({
              capabilities = capabilities,
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
          end,
        },
      })
    end,
  },
}
