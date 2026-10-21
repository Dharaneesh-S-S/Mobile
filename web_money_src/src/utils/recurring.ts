import { addDays, addMonths, addWeeks, addYears, isAfter, isBefore, parseISO, startOfDay } from 'date-fns';
import { db } from '../db';
import { Record, RecurringRule } from '../types/money';

export interface RecurringExecutionResult {
  generatedCount: number;
  generatedRecords: Record[];
  pendingConfirmationRules: RecurringRule[];
}

export function calculateNextDueDate(rule: RecurringRule, fromDate: Date = new Date()): Date {
  const current = new Date(fromDate);
  switch (rule.frequency) {
    case 'daily':
      return addDays(current, 1);
    case 'weekly':
      return addWeeks(current, 1);
    case 'monthly':
      if (rule.dayOfMonth) {
        const nextMonth = addMonths(current, 1);
        const maxDays = new Date(nextMonth.getFullYear(), nextMonth.getMonth() + 1, 0).getDate();
        const targetDay = Math.min(rule.dayOfMonth, maxDays);
        return new Date(nextMonth.getFullYear(), nextMonth.getMonth(), targetDay, current.getHours(), current.getMinutes());
      }
      return addMonths(current, 1);
    case 'yearly':
      return addYears(current, 1);
    case 'customDays':
      return addDays(current, rule.intervalDays || 1);
    default:
      return addMonths(current, 1);
  }
}

export async function processDueRecurringRules(targetDate: Date = new Date()): Promise<RecurringExecutionResult> {
  const allRules = await db.recurringRules.toArray();
  const generatedRecords: Record[] = [];
  const pendingConfirmationRules: RecurringRule[] = [];

  const targetDayStart = startOfDay(targetDate);

  for (const rule of allRules) {
    let nextDue = parseISO(rule.nextDueDate);

    // If next due is on or before target date
    while (!isAfter(startOfDay(nextDue), targetDayStart)) {
      // Check end conditions
      if (rule.endType === 'count' && rule.endCount && rule.executionCount >= rule.endCount) {
        break;
      }
      if (rule.endType === 'date' && rule.endDate && isAfter(nextDue, parseISO(rule.endDate))) {
        break;
      }

      if (!rule.autoAdd) {
        pendingConfirmationRules.push(rule);
        break;
      }

      // Generate transaction record
      const recordId = `rec-rec-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
      const newRecord: Record = {
        id: recordId,
        accountId: rule.accountId,
        type: rule.type,
        amountPaise: rule.amountPaise,
        dateTime: nextDue.toISOString(),
        description: rule.description,
        categoryId: rule.categoryId,
        walletId: rule.walletId,
        toWalletId: rule.toWalletId,
        feePaise: rule.feePaise,
        memo: rule.memo ? `${rule.memo} (Recurring)` : 'Recurring payment',
        recurringId: rule.id,
        splitLines: rule.splitLines,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      generatedRecords.push(newRecord);

      // Advance due date and execution count
      const updatedExecutionCount = rule.executionCount + 1;
      const subsequentDue = calculateNextDueDate(rule, nextDue);

      rule.executionCount = updatedExecutionCount;
      rule.lastExecutedDate = nextDue.toISOString();
      rule.nextDueDate = subsequentDue.toISOString();

      await db.recurringRules.update(rule.id, {
        executionCount: updatedExecutionCount,
        lastExecutedDate: rule.lastExecutedDate,
        nextDueDate: rule.nextDueDate,
      });

      nextDue = subsequentDue;
    }
  }

  if (generatedRecords.length > 0) {
    await db.records.bulkPut(generatedRecords);
  }

  return {
    generatedCount: generatedRecords.length,
    generatedRecords,
    pendingConfirmationRules,
  };
}
