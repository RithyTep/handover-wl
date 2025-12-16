import { z } from "zod"

const envSchema = z.object({
	NODE_ENV: z
		.enum(["development", "production", "test"])
		.default("development"),

	APP_URL: z.string().url().default("http://localhost:3000"),
	PORT: z.coerce.number().positive().default(3000),

	DATABASE_URL: z.string().min(1),
	DATABASE_URL_UNPOOLED: z.string().min(1).optional(),

	JIRA_URL: z.string().url(),
	JIRA_EMAIL: z.string().email(),
	JIRA_API_TOKEN: z.string().min(1),

	SLACK_BOT_TOKEN: z.string().optional(),
	SLACK_USER_TOKEN: z.string().optional(),
	SLACK_WEBHOOK_URL: z.string().url().optional(),
	SLACK_CHANNEL_ID: z.string().optional(),
	SLACK_CHANNEL: z.string().optional(),

	GROQ_API_KEY: z.string().optional(),
	OPENAI_API_KEY: z.string().optional(),
	AI_PROVIDER: z.enum(["groq", "openai"]).default("groq"),

	SCHEDULE_ENABLED: z
		.string()
		.default("false")
		.transform((val) => val === "true"),

	LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
})

const clientEnvSchema = z.object({
	NEXT_PUBLIC_APP_URL: z.string().url().optional(),
})

function parseEnv<T extends z.ZodType>(
	schema: T,
	env: Record<string, string | undefined>
): z.infer<T> {
	const result = schema.safeParse(env)

	if (!result.success) {
		const errors = result.error.flatten().fieldErrors as Record<
			string,
			string[] | undefined
		>
		const errorMessages = Object.entries(errors)
			.map(([key, messages]) => `  ${key}: ${messages?.join(", ")}`)
			.join("\n")

		throw new Error(
			`❌ Invalid environment variables:\n${errorMessages}\n\n` +
				`Please check your .env file or environment configuration.`
		)
	}

	return result.data
}

export const env = parseEnv(envSchema, process.env)

export const clientEnv = parseEnv(clientEnvSchema, {
	NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
})

export type Env = z.infer<typeof envSchema>
export type ClientEnv = z.infer<typeof clientEnvSchema>

export const isProduction = env.NODE_ENV === "production"
export const isDevelopment = env.NODE_ENV === "development"
export const isTest = env.NODE_ENV === "test"

export function getJiraConfig() {
	return {
		baseUrl: env.JIRA_URL,
		email: env.JIRA_EMAIL,
		apiToken: env.JIRA_API_TOKEN,
	}
}

export function getSlackConfig() {
	return {
		botToken: env.SLACK_BOT_TOKEN,
		userToken: env.SLACK_USER_TOKEN,
		webhookUrl: env.SLACK_WEBHOOK_URL,
		channelId: env.SLACK_CHANNEL_ID || env.SLACK_CHANNEL,
	}
}

export function getAppConfig() {
	return {
		url: env.APP_URL,
		port: env.PORT,
		nodeEnv: env.NODE_ENV,
		schedulerEnabled: env.SCHEDULE_ENABLED,
		logLevel: env.LOG_LEVEL,
	}
}

export function getAIConfig() {
	return {
		provider: env.AI_PROVIDER,
		groqApiKey: env.GROQ_API_KEY,
		openaiApiKey: env.OPENAI_API_KEY,
		apiKey:
			env.AI_PROVIDER === "groq" ? env.GROQ_API_KEY : env.OPENAI_API_KEY,
		baseUrl:
			env.AI_PROVIDER === "groq"
				? "https://api.groq.com/openai/v1"
				: undefined,
		model:
			env.AI_PROVIDER === "groq" ? "llama-3.3-70b-versatile" : "gpt-4o-mini",
	}
}
