import { useMemo, useEffect } from 'react';
import { UserData, Expense } from '../types';
import { Plus, TrendingUp, Target, Award, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/currency';

interface DashboardProps {
  user: UserData;
  expenses: Expense[];
  updateUser: (updates: Partial<UserData>) => void;
}

export default function Dashboard({ user, expenses, updateUser }: DashboardProps) {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlyExpenses = useMemo(() => {
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
    });
  }, [expenses, currentMonth, currentYear]);

  const totalSpentThisMonth = useMemo(() => {
    return monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  }, [monthlyExpenses]);

  const budgetRemaining = user.monthlyBudget - totalSpentThisMonth;
  const budgetPercentage = user.monthlyBudget > 0 ? (totalSpentThisMonth / user.monthlyBudget) * 100 : 0;

  const todayExpenses = useMemo(() => {
    const today = new Date().toDateString();
    return expenses.filter(expense => new Date(expense.date).toDateString() === today);
  }, [expenses]);

  const todaySpent = todayExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const dailyBudget = user.monthlyBudget > 0 ? user.monthlyBudget / 30 : 0; // Rough daily budget
  const isUnderDailyBudget = dailyBudget > 0 ? todaySpent <= dailyBudget : true;

  // Check if user earned points for staying under daily budget
  const checkDailyBudgetBonus = () => {
    if (isUnderDailyBudget && todayExpenses.length > 0) {
      const today = new Date().toDateString();
      const lastBonusDate = localStorage.getItem('lastDailyBudgetBonus');
      
      if (lastBonusDate !== today) {
        updateUser({ points: user.points + 5 });
        localStorage.setItem('lastDailyBudgetBonus', today);
        // Show celebration message
        setTimeout(() => {
          alert('🎉 Great job! You stayed under your daily budget. +5 points!');
        }, 100);
      }
    }
  };

  // Check for daily budget bonus when spending changes
  useEffect(() => {
    checkDailyBudgetBonus();
  }, [todaySpent, isUnderDailyBudget, user.points, updateUser]);

  const categoryBreakdown = useMemo(() => {
    const breakdown: Record<string, number> = {};
    monthlyExpenses.forEach(expense => {
      breakdown[expense.category] = (breakdown[expense.category] || 0) + expense.amount;
    });
    return Object.entries(breakdown)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);
  }, [monthlyExpenses]);

  const getMotivationalMessage = () => {
    if (budgetPercentage <= 50) {
      return "You're doing amazing! Keep up the great work! 🌟";
    } else if (budgetPercentage <= 80) {
      return "You're on track! Stay mindful of your spending. 💪";
    } else if (budgetPercentage <= 100) {
      return "Almost at your budget limit. Consider slowing down. ⚠️";
    } else {
      return "Over budget this month. Let's plan better for next month! 📈";
    }
  };

  return (
    <div className="p-4 pb-20 lg:pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 lg:mb-8">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl lg:text-3xl font-bold text-warm-800">
            Hello, {user.name}! 👋
          </h1>
          <p className="text-warm-600">Welcome back to SpendWise</p>
        </div>
        <div className="text-left sm:text-right">
          <div className="flex items-center space-x-1 text-warm-400">
            <Award className="w-5 h-5" />
            <span className="font-semibold text-lg">{user.points}</span>
          </div>
          <p className="text-sm text-warm-600">Level {user.level}</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Left Column - Primary Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Add Expense Button */}
          <Link to="/add-expense" className="block">
            <div className="card bg-warm-400 text-white hover:bg-warm-500 transition-colors cursor-pointer">
              <div className="flex items-center justify-center space-x-2">
                <Plus className="w-6 h-6" />
                <span className="font-semibold">Add Expense</span>
              </div>
            </div>
          </Link>

          {/* Budget Overview */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-warm-800">Monthly Budget</h2>
              <DollarSign className="w-5 h-5 text-warm-400" />
            </div>
            
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4 text-center lg:text-left lg:flex lg:justify-between">
                <div className="lg:flex lg:justify-between lg:w-full lg:text-sm">
                  <span className="text-warm-600 block lg:inline">Spent</span>
                  <span className="font-semibold block lg:inline">{formatCurrency(totalSpentThisMonth)}</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center lg:text-left lg:flex lg:justify-between">
                <div className="lg:flex lg:justify-between lg:w-full lg:text-sm">
                  <span className="text-warm-600 block lg:inline">Budget</span>
                  <span className="font-semibold block lg:inline">{formatCurrency(user.monthlyBudget)}</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center lg:text-left lg:flex lg:justify-between">
                <div className="lg:flex lg:justify-between lg:w-full lg:text-sm">
                  <span className="text-warm-600 block lg:inline">Remaining</span>
                  <span className={`font-semibold block lg:inline ${budgetRemaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(Math.abs(budgetRemaining))}
                  </span>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-warm-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-300 ${
                    budgetPercentage <= 80 ? 'bg-green-500' : 
                    budgetPercentage <= 100 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
                />
              </div>
              
              <p className="text-sm text-center text-warm-600 mt-2">
                {getMotivationalMessage()}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - Stats & Categories */}
        <div className="space-y-6">
          {/* Today's Spending */}
          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-warm-800">Today's Spending</h2>
              <TrendingUp className="w-5 h-5 text-warm-400" />
            </div>
            
            <div className="text-center lg:text-left">
              <p className="text-2xl font-bold text-warm-800 mb-2">{formatCurrency(todaySpent)}</p>
              <p className="text-sm text-warm-600 mb-3">
                Daily budget: {formatCurrency(dailyBudget)}
              </p>
              <div className={`badge ${isUnderDailyBudget ? 'badge-success' : 'badge-warning'} w-full lg:w-auto justify-center`}>
                {isUnderDailyBudget ? 'On Track' : 'Over Budget'}
              </div>
            </div>
          </div>

          {/* Top Categories */}
          {categoryBreakdown.length > 0 && (
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-warm-800">Top Categories</h2>
                <Target className="w-5 h-5 text-warm-400" />
              </div>
              
              <div className="space-y-3">
                {categoryBreakdown.map(([category, amount]) => (
                  <div key={category} className="flex justify-between items-center">
                    <span className="capitalize text-warm-700">{category}</span>
                    <span className="font-semibold text-warm-800">{formatCurrency(amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Expenses */}
      {monthlyExpenses.length > 0 && (
        <div className="card">
          <h2 className="text-lg font-semibold text-warm-800 mb-4">Recent Expenses</h2>
          <div className="space-y-3">
            {monthlyExpenses.slice(-5).reverse().map((expense) => (
              <div key={expense.id} className="flex justify-between items-center py-2 border-b border-warm-200 last:border-b-0">
                <div>
                  <p className="font-medium text-warm-800">{expense.description}</p>
                  <p className="text-sm text-warm-600 capitalize">{expense.category}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-warm-800">{formatCurrency(expense.amount)}</p>
                  <p className="text-xs text-warm-600">
                    {new Date(expense.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {monthlyExpenses.length === 0 && (
        <div className="card text-center py-8">
          <div className="text-warm-400 mb-4">
            <DollarSign className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-warm-800 mb-2">No expenses yet</h3>
          <p className="text-warm-600 mb-4">Start tracking your expenses to see insights here</p>
          <Link to="/add-expense" className="btn-primary inline-block">
            Add Your First Expense
          </Link>
        </div>
      )}
    </div>
  );
}
