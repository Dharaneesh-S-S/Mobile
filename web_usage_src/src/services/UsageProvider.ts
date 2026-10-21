import { AppInfo, AppUsageSummary, DailyUsage, UsageSession } from '../types'

/**
 * UsageProvider Interface
 *
 * This contract isolates the data access layer.
 * To replace the mock dataset with real Android data:
 * 1. Implement this interface in an `AndroidUsageStatsProvider.ts` class.
 * 2. Bridge to Android native `UsageStatsManager` using `window.AndroidBridge` (JavascriptInterface)
 *    or Flutter WebView's `postMessage` protocol.
 * 3. Swap the provider in `src/services/index.ts`.
 */
export interface UsageProvider {
  /**
   * Retrieves daily usage aggregated data for a specific date (YYYY-MM-DD).
   */
  getDailyUsage(date: string): Promise<DailyUsage>

  /**
   * Retrieves usage records for an inclusive date range.
   */
  getUsageRange(startDate: string, endDate: string): Promise<DailyUsage[]>

  /**
   * Gets list of registered applications.
   */
  getApps(): Promise<AppInfo[]>

  /**
   * Gets detailed per-app metrics over a time period.
   */
  getAppUsage(appId: string, startDate: string, endDate: string): Promise<AppUsageSummary>

  /**
   * Records a new active session (used by simulator or real-time tracker).
   */
  recordSession(session: UsageSession): Promise<void>

  /**
   * Check if running on real Android hardware vs mock web environment.
   */
  isNativeSource(): boolean

  /**
   * Synchronize from native device OS if available.
   */
  syncFromNative(): Promise<void>
}
