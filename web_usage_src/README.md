# ZenPulse Wellbeing

> **Mobile-First Digital Wellbeing Application**  
> Inspired by the native Android Digital Wellbeing experience. Built with React 19, TypeScript, Vite, Tailwind CSS, and custom SVG / Recharts data visualizations.

---

## 📱 Live Features Overview

### 1. Home Dashboard
- **Android Settings Style Header**: Clean header with branding, theme switcher, quick goals shortcut, and subtle collapse-on-scroll behavior.
- **Date Navigator**: Previous / next day switcher with smart labels ("Today", "Yesterday", "Mon, 19 Oct"), a Day / Week segmented toggle, and a **Calendar Bottom Sheet** to jump directly to any date in the last 90 days.
- **Screen Time Hero Card**: Bold headline showing total usage (e.g. `4h 32m`) with a delta chip versus the previous day or 7-day baseline (green down arrow = healthier/less, red up arrow = higher screen time).
- **24-Hour Stacked Hourly Bar Chart (Main Graph)**: 24 bars (00:00 to 23:00) stacked by the top 5 apps plus an "Other" segment. Tapping any bar reveals a detailed tooltip showing the exact hour range, minutes spent, top app, unlocks, and notifications. Features a dashed horizontal pace line showing the hourly goal pace.
- **Three Stat Sparkline Tiles**: Screen time, Notifications received, and Times unlocked with 7-day SVG sparklines and deltas.
- **Goal Ring Card**: Circular progress ring comparing today's usage against the daily goal (e.g. 4h), dynamically shifting colors from **Green (< 75%)** to **Amber (75-95%)** to **Red (> 95% / exceeded)**. Tapping opens a slider bottom sheet to edit the goal. Includes a live streak badge.
- **Most Used Apps List**: Displays app icons, names, categories, formatted usage times, and a relative thin progress bar proportional to the top app. "Show all apps" button expands the full list. Tapping any app navigates to its App Detail view.
- **Quick Action Cards**: Shortcuts for Focus Mode, Bedtime Mode, App Timers, Goals & Streaks, Protect Your Eyes, and Do Not Disturb.

---

### 2. Whole-Phone Graphs (Insights Screen)
A dedicated Insights dashboard featuring 4 tabs (**Screen time**, **Unlocks**, **Notifications**, **Patterns**) implementing all 13 specialized visual analytics:

1. **Daily Stacked Column Chart by Hour**: 24-hour breakdown stacked by top apps with interactive tooltips.
2. **Weekly Stacked Column Chart**: 7 bars (Mon–Sun) stacked by category (Social, Video, Games, Productivity, Communication, Other) with a dashed 7-day average line. Tapping a bar drills down into that day.
3. **30-Day Area/Line Trend**: Gradient-filled area chart with a 7-day moving average overlay and goal reference line, switchable between **7d / 30d / 90d**.
4. **Category Donut Chart**: Screen time distribution by category with the period total in the center. Tapping any slice filters the app list below.
5. **Horizontal Top 10 Apps Chart**: Top 10 apps ranked with percentage of total screen time directly visible on each bar.
6. **Calendar Heatmap (GitHub-Style)**: 12-week matrix (84 days) where cell color intensity indicates screen time. Tapping any cell jumps directly to that day.
7. **Hour-by-Weekday Heatmap (7x24 Matrix)**: Uncovers peak phone pickup and usage periods across Monday through Sunday.
8. **Unlocks Chart**: Hourly device unlocks paired with a 30-day daily average reference line and peak pickup hour metrics.
9. **Notifications Chart**: Hourly notification distribution paired with a ranked list of top notifying apps.
10. **Pickup-vs-Duration Scatter Plot**: 2D coordinate plot (X = opens, Y = total duration, Bubble size = notifications) identifying "quick-check" apps vs "long-session" apps.
11. **Sleep-Window Timeline**: 7-night timeline highlighting phone use around bedtime with the target bedtime window as a shaded band.
12. **Category Balance Radar Chart**: Concentric radar chart comparing category balance this week versus last week.
13. **Week-over-Week Comparison Card**: Paired bars for Mon–Sun comparing this week vs last week with overall percentage change.

*All charts feature accessible ARIA labels, interactive tooltips, smooth animations, legend entries, and a Colorblind-Safe (Okabe-Ito) palette option.*

---

### 3. Per-App Detail Screen
Tapping any application opens its dedicated usage page:
- Header with app icon, name, category, and today's usage.
- Hourly usage bar chart & Weekly 7-day bar chart with daily average line.
- 30-day line chart with goal/limit reference.
- 6 key metrics tiles: Open count, Notification count, Average session length, Longest session length, First use time, and Last use time.
- Chronological list of discrete usage sessions with start/end time and visual session length indicators.
- App Timer status card with remaining time and quick edit.
- Per-app notifications toggle and "Add to Focus mode" toggle.
- "Pause App for Today" button.
- **"Simulate Using App" (+15m)** demo button to advance usage and test timer expiration.

---

### 4. App Timers & Simulation
- List of all apps with their timer status ("No timer" or "45m daily").
- Set Timer bottom sheet with hour/minute selectors, active day-of-week chips (S M T W T F S), and daily reset time.
- **Time's Up Full-Screen Overlay**: When time expires (or during simulation), a full-screen overlay appears with "Close App" and "Ignore for 15 min".
- **5-Minute Warning Toast**: Triggers automatically as the timer approaches the limit.
- Timers reset daily at the configured reset time (default midnight).

---

### 5. Focus Mode
- Multi-select distracting apps grid with search filter.
- Start on demand or set a recurring schedule.
- "Take a break" button (+5m / +10m / +15m) that temporarily unblocks apps.
- Session streak counter and 7-day focus session history bar chart.
- Quick Settings tile mockup.

---

### 6. Bedtime Mode (Wind Down)
- 24-hour circular dial with interactive bedtime and wake-up handles.
- Day-of-week schedule chips.
- **Live Grayscale Mode Simulation**: Toggling grayscale applies a real-time CSS filter (`grayscale(100%)`) across the entire application.
- Toggles for Do Not Disturb, Dim Wallpaper, Lower Brightness, and Always-On Display Off.
- 7-night sleep summary chart showing phone use past bedtime.

---

### 7. Protect Your Eyes (Blue Light Filter)
- Toggle blue light filter on/off.
- Intensity slider (10% to 90%) with a **live warm amber tint overlay** applied across the screen.
- Schedule options: Sunset to Sunrise, Custom Schedule, or Always On.

---

### 8. Do Not Disturb & Notifications
- DND master toggle.
- Exceptions selector: Calls from (Anyone, Contacts, Starred Favorites, None), Repeat Callers, and Alarms.
- Today's notification summary with counts per app.

---

### 9. Goals, Streaks & Achievements
- Set daily screen time goal and daily unlocks limit.
- Streak counter for days under goal with a 7-day streak chip row.
- Milestone Badges (Goal Pioneer, 7-Day Champion, Night Owl Cured, Focus Master). Tapping an unlocked badge triggers a **confetti burst** (`canvas-confetti`).
- Monday Weekly Summary Card highlighting the biggest improvement and a wellness suggestion.

---

### 10. Settings & Customization
- Theme switcher: Light / Dark / System.
- Chart Palette: Default / Colorblind-Safe.
- 12h / 24h time format.
- Smartphone Frame Mockup toggle on desktop.
- Export usage data as **CSV** or **JSON**.
- Demo Data Profile Regenerator: Switch between **Low (~2.5h/d)**, **Medium (~4.5h/d)**, and **High (~7.0h/d)** usage profiles.
- Clear all stored data option.

---

## 🛠️ Running the Application

### 1. Standalone Web App
```bash
cd web_usage_src
npm install --legacy-peer-deps
npm run dev
```
Open [http://127.0.0.1:5175/](http://127.0.0.1:5175/) in your browser.

### 2. Run Unit Tests
```bash
npm test
```
Runs the Vitest test suite testing aggregation roll-ups, averages, deltas, streaks, and dataset mathematical consistency.

### 3. Build for Production
```bash
npm run build
```
Generates optimized static assets in `dist/`.

---

## 🔌 Swapping in a Real Android Data Source

The data layer is isolated behind the `UsageProvider` interface (`src/services/UsageProvider.ts`):

```typescript
export interface UsageProvider {
  getDailyUsage(date: string): Promise<DailyUsage>;
  getUsageRange(startDate: string, endDate: string): Promise<DailyUsage[]>;
  getApps(): Promise<AppInfo[]>;
  getAppUsage(appId: string, startDate: string, endDate: string): Promise<AppUsageSummary>;
  recordSession(session: UsageSession): Promise<void>;
  isNativeSource(): boolean;
  syncFromNative(): Promise<void>;
}
```

### Steps to connect real Android `UsageStatsManager`:
1. **Android Permission**: In `AndroidManifest.xml`, request `<uses-permission android:name="android.permission.PACKAGE_USAGE_STATS" tools:ignore="ProtectedPermissions" />`.
2. **Native Bridge**: In your Android native code or Flutter WebView bridge, expose a Javascript interface:
   ```kotlin
   class UsageStatsBridge(private val context: Context) {
       private val usageStatsManager = context.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager

       @JavascriptInterface
       fun queryUsageStats(beginTime: Long, endTime: Long): String {
           val stats = usageStatsManager.queryUsageStats(UsageStatsManager.INTERVAL_DAILY, beginTime, endTime)
           return Gson().toJson(stats)
       }
   }
   ```
3. **Provider Implementation**: Create `src/services/AndroidUsageStatsProvider.ts` implementing `UsageProvider`:
   ```typescript
   export class AndroidUsageStatsProvider implements UsageProvider {
     async getDailyUsage(date: string): Promise<DailyUsage> {
       if (window.AndroidBridge) {
         const raw = window.AndroidBridge.queryUsageStats(...)
         return JSON.parse(raw)
       }
       return mockUsageProvider.getDailyUsage(date)
     }
   }
   ```
4. **Swap in Application**: In `src/App.tsx`, instantiate `new AndroidUsageStatsProvider()` in place of `mockUsageProvider`.

---

## 📝 Short List of Simulated Web Features
Since a standard browser sandbox cannot modify OS-level settings:
- **Grayscale Filter**: Simulated using CSS `filter: grayscale(100%)` across the app container.
- **Blue Light Filter**: Simulated using a floating multiply-blend amber overlay (`mix-blend-mode: multiply`).
- **Do Not Disturb**: Managed within the app state and alert notifications.
- **Real-Time App Blocking**: Tested via the interactive "Simulate using app" button which triggers the native "Time's up" overlay.
