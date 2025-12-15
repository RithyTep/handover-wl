export default defineEventHandler(async () => {
  return {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    framework: 'nuxt',
    version: '3.x',
  }
})
