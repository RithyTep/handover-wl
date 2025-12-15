// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  // TypeScript configuration
  typescript: {
    strict: true,
    typeCheck: false, // Disable during build, run separately with npm run typecheck
  },

  // Global CSS
  css: ['~/assets/css/main.css'],

  // Modules
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    'shadcn-nuxt',
  ],

  // shadcn-nuxt configuration
  shadcn: {
    prefix: '',
    componentDir: './components/ui',
  },

  // Runtime config (environment variables)
  runtimeConfig: {
    // Server-only (private)
    databaseUrl: process.env.DATABASE_URL,
    jiraUrl: process.env.JIRA_URL,
    jiraEmail: process.env.JIRA_EMAIL,
    jiraApiToken: process.env.JIRA_API_TOKEN,
    slackBotToken: process.env.SLACK_BOT_TOKEN,
    slackUserToken: process.env.SLACK_USER_TOKEN,
    slackChannelId: process.env.SLACK_CHANNEL_ID,
    groqApiKey: process.env.GROQ_API_KEY,
    openaiApiKey: process.env.OPENAI_API_KEY,

    // Client-exposed (public)
    public: {
      appUrl: process.env.APP_URL || 'http://localhost:3001',
      jiraUrl: process.env.JIRA_URL,
    },
  },

  // Nitro server configuration
  nitro: {
    experimental: {
      tasks: true,
    },
    // Scheduled tasks
    scheduledTasks: {
      // Run hourly backup at the top of each hour
      '0 * * * *': ['hourly-backup'],
      // Check for scheduled comments every minute
      '* * * * *': ['check-comments'],
    },
  },

  // App configuration
  app: {
    head: {
      title: 'Jira Slack Integration',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
    },
  },

  // Development server port (different from Next.js)
  devServer: {
    port: 3001,
  },
})
