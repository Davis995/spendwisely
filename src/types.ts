export interface UserData {
  id: string;
  name: string;
  email: string;
  monthlyIncome: number;
  monthlyBudget: number;
  points: number;
  level: number;
  badges: Badge[];
  savingsGoals: SavingsGoal[];
  createdAt: string;
}

export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  date: string;
  isRecurring?: boolean;
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  isCompleted: boolean;
  createdAt: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
  category: BadgeCategory;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: ChallengeType;
  target: number;
  currentProgress: number;
  pointsReward: number;
  startDate: string;
  endDate: string;
  isCompleted: boolean;
  isActive: boolean;
}

export type ExpenseCategory = 
  | 'food'
  | 'transport'
  | 'entertainment'
  | 'shopping'
  | 'bills'
  | 'health'
  | 'education'
  | 'other';

export type BadgeCategory = 
  | 'streak'
  | 'savings'
  | 'consistency'
  | 'milestone'
  | 'challenge';

export type ChallengeType = 
  | 'daily_budget'
  | 'weekly_savings'
  | 'expense_logging'
  | 'category_limit'
  | 'no_spend_day';

export interface DailyStats {
  date: string;
  totalSpent: number;
  budgetLimit: number;
  expenseCount: number;
  isUnderBudget: boolean;
}

export interface WeeklyStats {
  weekStart: string;
  weekEnd: string;
  totalSpent: number;
  budgetLimit: number;
  categoryBreakdown: Record<ExpenseCategory, number>;
  dailyStats: DailyStats[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  pointsAwarded: number;
  unlockedAt: string;
}
