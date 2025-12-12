/**
 * ESLint Configuration - Clean Code 2025
 *
 * Enforces clean code standards:
 * - File size limits
 * - Function complexity
 * - TypeScript strict rules
 */

import tseslint from "@typescript-eslint/eslint-plugin"
import tsparser from "@typescript-eslint/parser"

export default [
	{
		// File patterns to lint
		files: ["**/*.ts", "**/*.tsx"],

		// Language options with TypeScript parser
		languageOptions: {
			ecmaVersion: 2024,
			sourceType: "module",
			parser: tsparser,
			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
			},
		},

		plugins: {
			"@typescript-eslint": tseslint,
		},

		rules: {
			// ============================================
			// File & Function Size Limits
			// ============================================

			// Max lines per file (warning at 250)
			"max-lines": [
				"warn",
				{
					max: 250,
					skipBlankLines: true,
					skipComments: true,
				},
			],

			// Max lines per function (50 lines)
			"max-lines-per-function": [
				"warn",
				{
					max: 50,
					skipBlankLines: true,
					skipComments: true,
					IIFEs: true,
				},
			],

			// Cyclomatic complexity (max 10)
			complexity: ["warn", { max: 10 }],

			// Max parameters (4 max)
			"max-params": ["warn", { max: 4 }],

			// Max nesting depth (4 levels)
			"max-depth": ["warn", { max: 4 }],

			// Max statements per function
			"max-statements": ["warn", { max: 20 }],

			// ============================================
			// TypeScript Rules
			// ============================================

			// Warn on any type
			"@typescript-eslint/no-explicit-any": "warn",

			// Unused variables (allow underscore prefix)
			"@typescript-eslint/no-unused-vars": [
				"warn",
				{
					argsIgnorePattern: "^_",
					varsIgnorePattern: "^_",
				},
			],

			// ============================================
			// Code Quality
			// ============================================

			// No console.log (use logger)
			"no-console": [
				"warn",
				{
					allow: ["warn", "error"],
				},
			],

			// Prefer const
			"prefer-const": "error",

			// No var
			"no-var": "error",

			// Strict equality
			eqeqeq: ["error", "always", { null: "ignore" }],
		},
	},
	{
		// Relaxed rules for config files and types
		files: ["**/*.config.{js,ts,mjs}", "**/types/**/*.ts", "**/*.d.ts"],
		rules: {
			"max-lines": "off",
			"max-lines-per-function": "off",
		},
	},
	{
		// Stricter rules for API routes (should be thin)
		files: ["app/api/**/route.ts"],
		rules: {
			"max-lines": ["warn", { max: 100, skipBlankLines: true, skipComments: true }],
		},
	},
	{
		// Ignore patterns
		ignores: [
			"node_modules/**",
			".next/**",
			"lib/generated/**",
			"**/*.d.ts",
			"*.config.*",
		],
	},
]
