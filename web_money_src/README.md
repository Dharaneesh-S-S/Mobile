# RupeeFlow — Personal Money Studio

RupeeFlow is a mobile-first, installable personal money manager PWA built with React, TypeScript, Vite, Tailwind CSS, Recharts, Dexie (IndexedDB), and date-fns. It features a dark UI with glassmorphism accents, Indian Rupee (₹) formatting with Indian digit grouping (`1,23,456`), and integer paise storage for zero floating-point errors.

---

## Key Highlights & Features

### 0. Currency & Precision
- **Indian Rupee Standard**: All values formatted with `Intl.NumberFormat('en-IN')` (e.g. `7,209`, `12,179`, `1,23,456`, `12,34,567`).
- **Paise Integer Storage**: Stored internally as integer paise (`₹1 = 100 paise`), ensuring precision with zero floating-point drift.
- **Negative Value Formatting**: Displays minus before the symbol (e.g. `-₹37`, `-₹1,382`).
- **Compact Calendar & Badge Formats**: Supports `1.5K`, `1.2L`, `2.5L`, `3.5Cr` or full exact formatting via Settings.

### 1. App Shell & Navigation
- **5-Slot Bottom Navigation**: Transaction, Calendar, Center Elevated `+` Action Button, Statistic, Wallet.
- **Shared Top Header**: Displays Account name ("Personal", "Work", "Family"), total net worth balance with hide/show eye toggle (`₹ ••••••`), account switcher dropdown, and screen-specific action icons.
- **Month / Period Navigator**: `‹` Prev, Title (e.g. "Oct 2026"), `›` Next, with quick selector for Day, Week, Month, Year, All Time.
- **Desktop Phone Frame**: Authentic smartphone frame mockup with toggle to expanded widescreen mode.

### 2. Transaction Tab
- **Period Overview Card**: Period Income (blue), Expense (red with minus), Total (white/emerald), with `(i)` calculation info modal.
- **Quick-Add Bar**: Natural language parser input (e.g. `"lunch 90 food"`, `"swiggy 350"`, `"salary 75000"`) for one-tap transaction logging.
- **Grouped by Day**: Big date numbers, weekday, month-year, and daily net total.
- **Row Details**: Round colored category icons, description, wallet name, amount in ₹, and transaction time.
- **Multi-Select & Bulk Actions**: Long-press to enter multi-select; bulk delete, bulk category change, bulk wallet change, and duplicate/copy.
- **Global Search**: Query by description, memo, category, wallet, amount range, and date range; filter chips; live sum of matching items.

### 3. Calendar Tab
- **Summary Strip**: Period Income, Expense, Total at a glance.
- **Month Grid**: Weekdays Sun–Sat (Sunday highlighted in red; option for Monday start).
- **Stacked Daily Activity**: Income (blue, showing "0" when no income on active days), Expense (red with minus), and Net (white/emerald).
- **Today Highlight & Day Bottom Sheet**: Tapping any day opens transactions for that day with a quick "Add record for this day" button.
- **Compact View Toggle**: Pinch/toggle for compact calendar badges.

### 4. Statistic Tab
- **Balance Card**: Opening and Ending ledger balance for the period side-by-side.
- **Cash Flow Overview & Breakdown**: "Show more" modal showing daily average spending, highest day, transaction count, and savings rate (%).
- **Donut & Bar Charts**: Donut chart with total in center (`Expense -₹11,731`), legend with percentages, and toggle to horizontal bars.
- **Category Ranking Modal**: Detailed ranking list with animated progress bars and drilldown to category transactions.
- **Trend Chart**: Daily bar chart of Income vs Expense, with switch for Net curve.
- **Wallet Usage**: Spending breakdown per wallet.
- **Top 5 Expenses**: The largest single transactions in the period.

### 5. Add / Edit Record (+ Button)
- **Income, Expense, Transfer Tabs**: Context-aware color themes and fields.
- **Built-in Calculator Keypad**: Tappable amount field opening arithmetic keypad (`+`, `-`, `×`, `÷`, `.`, `=`, `Done`), evaluating expressions like `120+45*2`.
- **Autocomplete Suggestions**: Auto-fills category, wallet, and usual amount from past history.
- **Receipt Photo Attachments**: Multi-image receipt uploads stored as Blobs with image preview modal.
- **Templates**: Floating button with saved templates for one-tap filling + "Save as template".
- **Atomic Transfers**: From wallet → To wallet with optional transfer fee tracking.

### 6. Wallet Tab
- **Wallets Grid**: Colored tiles showing name, icon, and dynamic live balance derived from transactions.
- **Wallet Detail**: Balance adjustments (with auto-adjustment record), monthly in/out stats, records, archive, and delete.
- **Budgets**: Spending limits with visual progress bars (green → amber → red) and alert threshold (e.g. 80%).
- **Savings Goals**: Target amount, target date, progress percentage, monthly savings needed, deposit/withdraw actions, and confetti celebrations.
- **Debts & Loans**: "I owe" and "Owed to me" tracking with partial repayments and settlement status.
- **Recurring Rules**: Automatic scheduler generating due transactions on app start with toast notifications.

### 7. Security & Backup
- **Passcode Protection**: Optional 4–6 digit PIN lock with biometric WebAuthn option.
- **CSV Export & Import**: Export records with details; import with column mapping and duplicate detection.
- **Full JSON Backup & Restore**: One-click download and restore.
- **Monthly Printable Statement**: Clean printable statement view (`window.print()`).
- **Realistic Indian Demo Data**: Pre-loaded 2 months of realistic Indian rupee transactions (Salary, Rent, BESCOM electricity, Blinkit groceries, Swiggy, Zepto, Metro UPI, Diwali sweets) across UPI, Cash, and Meal Card, with clear sample data button in Settings.

---

## Run & Development Instructions

### Run Dev Server
```bash
cd web_money_src
npm install
npm run dev -- --port 5178
```
Open [http://127.0.0.1:5178/](http://127.0.0.1:5178/) in your browser.

### Run Unit Tests
```bash
cd web_money_src
npm test
```
All 11 unit tests covering formatting, paise math, calculator expression evaluation, wallet balance aggregation, recurring due date generation, and CSV import mapping will run and pass.

### Build Production Bundle
```bash
cd web_money_src
npm run build
```
Generates production assets in `web_money_src/dist/` (deployed to `web/money/` for Flutter Web).

---

## List of Anything Not Implemented
- **None**: All features described in sections 0 to 12 of the prompt have been fully implemented and verified.
