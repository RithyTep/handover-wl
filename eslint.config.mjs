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

			// Max parameters (5 max - allows for common patterns)
			"max-params": ["warn", { max: 5 }],

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
					allow: ["warn", "error", "info"],
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
		// Relaxed rules for React components (JSX is verbose)
		files: ["components/**/*.tsx", "app/**/*.tsx"],
		rules: {
			"max-lines-per-function": [
				"warn",
				{
					max: 200, // JSX components with forms/modals need more space
					skipBlankLines: true,
					skipComments: true,
					IIFEs: true,
				},
			],
			"max-statements": ["warn", { max: 40 }],
			complexity: ["warn", { max: 15 }], // UI logic can have more branches
		},
	},
	{
		// Relaxed rules for test files
		files: [
			"**/*.test.ts",
			"**/*.test.tsx",
			"**/__tests__/**/*.ts",
			"**/__tests__/**/*.tsx",
			"server/**/__tests__/**/*.ts",
			"vitest.setup.ts",
		],
		rules: {
			"max-lines": "off",
			"max-lines-per-function": "off",
			"max-statements": "off",
			complexity: "off",
		},
	},
	{
		// Relaxed rules for API routes (handlers can be larger)
		files: ["app/api/**/route.ts"],
		rules: {
			"max-lines": ["warn", { max: 200, skipBlankLines: true, skipComments: true }],
			"max-lines-per-function": [
				"warn",
				{
					max: 80,
					skipBlankLines: true,
					skipComments: true,
					IIFEs: true,
				},
			],
			"max-statements": ["warn", { max: 25 }],
			complexity: ["warn", { max: 12 }],
		},
	},
	{
		// Relaxed rules for hooks (often contain complex logic)
		files: ["hooks/**/*.ts", "hooks/**/*.tsx"],
		rules: {
			"max-lines-per-function": [
				"warn",
				{
					max: 100,
					skipBlankLines: true,
					skipComments: true,
					IIFEs: true,
				},
			],
			"max-statements": ["warn", { max: 35 }],
		},
	},
	{
		// Relaxed rules for column definitions and configuration-heavy files
		files: ["**/columns.tsx", "**/columns.ts"],
		rules: {
			"max-lines": "off",
			"max-lines-per-function": "off",
		},
	},
	{
		// Relaxed rules for services (business logic can be complex)
		// Note: Test files inside services are handled by the test files override
		files: ["server/services/*.ts", "lib/services/**/*.ts"],
		ignores: ["**/__tests__/**"],
		rules: {
			"max-lines-per-function": [
				"warn",
				{
					max: 60,
					skipBlankLines: true,
					skipComments: true,
					IIFEs: true,
				},
			],
			"max-statements": ["warn", { max: 25 }],
			complexity: ["warn", { max: 12 }],
		},
	},
	{
		// Relaxed rules for security code (validation requires many checks)
		files: ["lib/security/**/*.ts"],
		rules: {
			"max-lines-per-function": [
				"warn",
				{
					max: 60,
					skipBlankLines: true,
					skipComments: true,
					IIFEs: true,
				},
			],
			"max-statements": ["warn", { max: 30 }],
			complexity: ["warn", { max: 15 }],
		},
	},
	{
		// Relaxed rules for scheduler (complex async flows)
		files: ["lib/scheduler/**/*.ts"],
		rules: {
			"max-lines-per-function": [
				"warn",
				{
					max: 60,
					skipBlankLines: true,
					skipComments: true,
					IIFEs: true,
				},
			],
			"max-statements": ["warn", { max: 25 }],
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
