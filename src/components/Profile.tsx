import { useState } from 'react';
import { UserData } from '../types';
import { User, Award, Target, Settings, Edit2, Save, X } from 'lucide-react';
import { formatCurrency } from '../utils/currency';

interface ProfileProps {
  user: UserData;
  updateUser: (updates: Partial<UserData>) => void;
}

export default function Profile({ user, updateUser }: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user.name,
    monthlyBudget: user.monthlyBudget.toString(),
    monthlyIncome: user.monthlyIncome.toString(),
  });

  const handleSave = () => {
    const monthlyBudget = parseFloat(editData.monthlyBudget);
    const monthlyIncome = parseFloat(editData.monthlyIncome);
    
    // Validate inputs
    if (!editData.name.trim()) {
      alert('Please enter a valid name');
      return;
    }
    
    if (isNaN(monthlyBudget) || monthlyBudget <= 0) {
      alert('Please enter a valid monthly budget');
      return;
    }
    
    if (isNaN(monthlyIncome) || monthlyIncome <= 0) {
      alert('Please enter a valid monthly income');
      return;
    }
    
    if (monthlyBudget > monthlyIncome) {
      alert('Monthly budget cannot be greater than monthly income');
      return;
    }
    
    updateUser({
      name: editData.name.trim(),
      monthlyBudget: monthlyBudget,
      monthlyIncome: monthlyIncome,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      name: user.name,
      monthlyBudget: user.monthlyBudget.toString(),
      monthlyIncome: user.monthlyIncome.toString(),
    });
    setIsEditing(false);
  };

  const totalSavings = user.monthlyIncome - user.monthlyBudget;
  const savingsRate = user.monthlyIncome > 0 ? (totalSavings / user.monthlyIncome) * 100 : 0;

  return (
    <div className="p-4 pb-20 lg:pb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 lg:mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-warm-800">Profile</h1>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-warm-600 hover:text-warm-800 transition-colors"
          >
            <Edit2 className="w-5 h-5" />
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="p-2 text-green-600 hover:text-green-800 transition-colors"
            >
              <Save className="w-5 h-5" />
            </button>
            <button
              onClick={handleCancel}
              className="p-2 text-red-600 hover:text-red-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Profile Info */}
          <div className="card">
        <div className="flex items-center mb-4">
          <div className="w-16 h-16 bg-warm-400 rounded-full flex items-center justify-center mr-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            {isEditing ? (
              <input
                type="text"
                value={editData.name}
                onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                className="input-field text-lg font-semibold"
              />
            ) : (
              <h2 className="text-xl font-semibold text-warm-800">{user.name}</h2>
            )}
            <p className="text-warm-600">{user.email}</p>
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-4 border-t border-warm-200">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 text-warm-400 mb-1">
              <Award className="w-4 h-4" />
              <span className="font-bold text-lg">{user.points}</span>
            </div>
            <p className="text-xs text-warm-600">Points</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-lg text-warm-800">Level {user.level}</p>
            <p className="text-xs text-warm-600">Current Level</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-lg text-warm-800">{user.badges.length}</p>
            <p className="text-xs text-warm-600">Badges</p>
          </div>
        </div>
      </div>

          {/* Financial Overview */}
          <div className="card">
        <div className="flex items-center mb-4">
          <Target className="w-5 h-5 text-warm-400 mr-2" />
          <h2 className="text-lg font-semibold text-warm-800">Financial Overview</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-warm-600">Monthly Income</span>
            {isEditing ? (
              <input
                type="number"
                value={editData.monthlyIncome}
                onChange={(e) => setEditData(prev => ({ ...prev, monthlyIncome: e.target.value }))}
                className="input-field w-24 text-right"
              />
            ) : (
              <span className="font-semibold text-warm-800">{formatCurrency(user.monthlyIncome)}</span>
            )}
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-warm-600">Monthly Budget</span>
            {isEditing ? (
              <input
                type="number"
                value={editData.monthlyBudget}
                onChange={(e) => setEditData(prev => ({ ...prev, monthlyBudget: e.target.value }))}
                className="input-field w-24 text-right"
              />
            ) : (
              <span className="font-semibold text-warm-800">{formatCurrency(user.monthlyBudget)}</span>
            )}
          </div>
          
          <div className="flex justify-between items-center pt-2 border-t border-warm-200">
            <span className="text-warm-600">Monthly Savings</span>
            <span className="font-semibold text-green-600">{formatCurrency(totalSavings)}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-warm-600">Savings Rate</span>
            <span className="font-semibold text-green-600">{savingsRate.toFixed(1)}%</span>
          </div>
        </div>
          </div>
        </div>

        {/* Achievements */}
      {user.badges.length > 0 && (
        <div className="card mb-6">
          <div className="flex items-center mb-4">
            <Award className="w-5 h-5 text-warm-400 mr-2" />
            <h2 className="text-lg font-semibold text-warm-800">Achievements</h2>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {user.badges.map((badge) => (
              <div key={badge.id} className="text-center p-3 bg-warm-100 rounded-lg">
                <div className="text-2xl mb-1">{badge.icon}</div>
                <p className="text-xs font-medium text-warm-800">{badge.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Savings Goals */}
      {user.savingsGoals.length > 0 && (
        <div className="card mb-6">
          <div className="flex items-center mb-4">
            <Target className="w-5 h-5 text-warm-400 mr-2" />
            <h2 className="text-lg font-semibold text-warm-800">Savings Goals</h2>
          </div>
          
          <div className="space-y-4">
            {user.savingsGoals.map((goal) => {
              const progress = (goal.currentAmount / goal.targetAmount) * 100;
              
              return (
                <div key={goal.id} className="p-3 bg-warm-100 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-warm-800">{goal.title}</h3>
                    <span className="text-sm text-warm-600">
                      {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                    </span>
                  </div>
                  
                  <div className="w-full bg-warm-200 rounded-full h-2">
                    <div
                      className="bg-warm-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  
                  <p className="text-xs text-warm-600 mt-1">
                    {progress.toFixed(1)}% complete
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Settings */}
      <div className="card">
        <div className="flex items-center mb-4">
          <Settings className="w-5 h-5 text-warm-400 mr-2" />
          <h2 className="text-lg font-semibold text-warm-800">Settings</h2>
        </div>
        
        <div className="space-y-3">
          <button className="w-full text-left p-3 hover:bg-warm-100 rounded-lg transition-colors">
            <span className="text-warm-700">Export Data</span>
          </button>
          <button className="w-full text-left p-3 hover:bg-warm-100 rounded-lg transition-colors">
            <span className="text-warm-700">Reset Progress</span>
          </button>
          <button className="w-full text-left p-3 hover:bg-warm-100 rounded-lg transition-colors">
            <span className="text-red-600">Clear All Data</span>
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}
