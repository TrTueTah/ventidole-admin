// Analytics Request Types

export enum TimeRange {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

export type AnalyticsFilterREQ = {
  startDate?: string; // ISO 8601 format: YYYY-MM-DD
  endDate?: string; // ISO 8601 format: YYYY-MM-DD
  timeRange?: TimeRange;
};
