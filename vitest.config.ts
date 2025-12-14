import { defineConfig } from "vitest/config"
import path from "path"

export default defineConfig({
	test: {
		globals: true,
		environment: "happy-dom",
		setupFiles: ["./vitest.setup.ts"],
		include: ["**/__tests__/**/*.test.ts", "**/__tests__/**/*.test.tsx"],
		exclude: ["node_modules", ".next", "dist"],
		coverage: {
			provider: "v8",
			reporter: ["text", "json", "html"],
			exclude: [
				"node_modules/",
				"dist/",
				".next/",
				"**/*.d.ts",
				"**/__tests__/**",
				"**/__mocks__/**",
				"vitest.config.ts",
				"vitest.setup.ts",
			],
			thresholds: {
				statements: 70,
				branches: 70,
				functions: 70,
				lines: 70,
			},
		},
		testTimeout: 10000,
		hookTimeout: 10000,
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./"),
		},
	},
})
