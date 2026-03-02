import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import configPrettier from "eslint-config-prettier";
import { importX as pluginImportX } from "eslint-plugin-import-x";
import pluginJsxA11y from "eslint-plugin-jsx-a11y";
// (!) There is no type definition for this package (https://github.com/eslint-community/eslint-plugin-promise/issues/488)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import pluginPromise from "eslint-plugin-promise";
import pluginReact from "eslint-plugin-react";
import { configs as pluginReactHooksConfigs } from "eslint-plugin-react-hooks";
import globals from "globals";
import { configs as tseslintConfigs } from "typescript-eslint";

/**
 * Configure ESLint rules for import order.
 */
const importConfig = {
  extends: [
    pluginImportX.flatConfigs.recommended,
    pluginImportX.flatConfigs.typescript,
  ],
  settings: {
    "import-x/internal-regex": "^@/",
  },
  rules: {
    "import-x/order": [
      "error",
      {
        groups: [
          "builtin", // Node.js built-in modules
          "external", // npm packages
          "internal", // paths aliased in tsconfig
          "parent", // imports from parent directories
          "sibling", // imports from sibling directories
          "index", // imports from the same directory
          "object", // object imports
          "type", // type imports
        ],
        "newlines-between": "always",
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
      },
    ],
    // TODO: check if we can delete this rule
    // "import-x/extensions": [
    //   "error",
    //   "ignorePackages",
    //   {
    //     ts: "never",
    //     tsx: "never",
    //   },
    // ],
    // TODO: check if we still need this rule
    // "import-x/no-unresolved": ["error", { ignore: Object.keys(peerDependencies) }],
  },
};

export default defineConfig([
  // Globally ignore certain directories - must be in a separate object
  {
    ignores: ["build/", "example/"],
  },

  // Global language options
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    // TODO: check if we still need these rules
    // rules: {
    //   "no-console": "warn",
    //   "arrow-body-style": ["error", "as-needed"],
    //   "prefer-arrow-callback": "error",
    // },
  },

  // JS
  eslint.configs.recommended,

  // TS
  tseslintConfigs.strictTypeChecked,
  tseslintConfigs.stylisticTypeChecked,
  {
    // Adds type information to the linting process
    // @see https://typescript-eslint.io/getting-started/typed-linting/
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
    },
  },

  // Import
  importConfig,

  // React
  pluginReact.configs.flat.recommended,
  pluginReact.configs.flat["jsx-runtime"],
  {
    settings: {
      react: {
        /**
         * TODO: Put it back to "detect" once "eslint-plugin-react" gets fixed
         * @see https://github.com/facebook/react/issues/35729
         */
        version: "19",
      },
    },
    // TODO: check if we still need these rules
    // rules: {
    //   "react/prop-types": "off",
    //   "react/jsx-filename-extension": ["error", { extensions: [".tsx"] }],
    //   "react/react-in-jsx-scope": "off",
    //   "react/destructuring-assignment": "error",
    // },
  },

  // React Hooks
  pluginReactHooksConfigs.flat["recommended-latest"],

  // JSX A11y
  pluginJsxA11y.flatConfigs.recommended,

  // Promise
  // (!) There is no type definition for this package (https://github.com/eslint-community/eslint-plugin-promise/issues/488)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  pluginPromise.configs["flat/recommended"],

  // (!) Keep Prettier last so it gets the chance to override all other configs
  configPrettier,
]);
