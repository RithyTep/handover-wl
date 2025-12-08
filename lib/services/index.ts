// Database exports
export {
  initDatabase,
  saveTicketData,
  loadTicketData,
  getSchedulerEnabled,
  setSchedulerEnabled,
  getScheduledComments,
  getEnabledScheduledComments,
  createScheduledComment,
  updateScheduledComment,
  deleteScheduledComment,
  updateCommentLastPosted,
  getTriggerTimes,
  setTriggerTimes,
  getSetting,
  setSetting,
  getBackups,
  getBackupById,
  createBackup,
  restoreFromBackup,
  cleanupOldBackups,
  transformBackupToItem,
  getCustomChannelId,
  setCustomChannelId,
  getMemberMentions,
  setMemberMentions,
  getEveningUserToken,
  setEveningUserToken,
  getNightUserToken,
  setNightUserToken,
  getEveningMentions,
  setEveningMentions,
  getNightMentions,
  setNightMentions,
  getThemePreference,
  setThemePreference,
  shutdown,
  checkHealth as checkDatabaseHealth,
} from "./database";

// Jira exports
export {
  fetchTickets,
  transformIssue,
  getTicketsWithSavedData,
  postComment,
  fetchTicketComments,
  getLatestWLTCComment,
  checkHealth as checkJiraHealth,
} from "./jira";

// Re-export JiraComment interface from types
export type { JiraComment } from "@/lib/types";

// Slack exports
export {
  postMessage,
  postThreadReply,
  updateMessage,
  getHistory,
  getThreadReplies,
  formatDate,
  formatTime,
  checkHealth as checkSlackHealth,
} from "./slack";
