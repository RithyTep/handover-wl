export enum CommentType {
  JIRA = 'jira',
  SLACK = 'slack',
}

export const CommentTypeValues = Object.values(CommentType) as [CommentType, ...CommentType[]]
