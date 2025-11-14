import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import ExpenseForm from './components/ExpenseForm';
import Onboarding from './components/Onboarding';
import Profile from './components/Profile';
import Challenges from './components/Challenges';
import Navigation from './components/Navigation';
import { UserData, Expense } from './types';

function App() {
  const [user, setUser] = useState<UserData | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  // Load data from localStorage on app start
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('spendwise-user');
      const savedExpenses = localStorage.getItem('spendwise-expenses');
      
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      
      if (savedExpenses) {
        setExpenses(JSON.parse(savedExpenses));
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
      // Clear corrupted data
      localStorage.removeItem('spendwise-user');
      localStorage.removeItem('spendwise-expenses');
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      try {
        localStorage.setItem('spendwise-user', JSON.stringify(user));
      } catch (error) {
        console.error('Error saving user data to localStorage:', error);
      }
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem('spendwise-expenses', JSON.stringify(expenses));
    } catch (error) {
      console.error('Error saving expenses to localStorage:', error);
    }
  }, [expenses]);

  const addExpense = (expense: Omit<Expense, 'id' | 'date'>) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };
    
    setExpenses(prev => [...prev, newExpense]);
    
    // Award points for logging expense
    if (user) {
      setUser(prev => prev ? { ...prev, points: prev.points + 1 } : null);
    }
  };

  const updateUser = (updates: Partial<UserData>) => {
    setUser(prev => prev ? { ...prev, ...updates } : null);
  };

  // Show onboarding if no user data
  if (!user) {
    return <Onboarding onComplete={setUser} />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-warm-50">
        {/* Mobile Layout */}
        <div className="lg:hidden">
          <div className="max-w-md mx-auto bg-white min-h-screen shadow-lg">
            <Routes>
              <Route 
                path="/" 
                element={
                  <Dashboard 
                    user={user} 
                    expenses={expenses} 
                    updateUser={updateUser}
                  />
                } 
              />
              <Route 
                path="/add-expense" 
                element={<ExpenseForm onAddExpense={addExpense} />} 
              />
              <Route 
                path="/profile" 
                element={<Profile user={user} updateUser={updateUser} />} 
              />
              <Route 
                path="/challenges" 
                element={<Challenges user={user} />} 
              />
            </Routes>
            <Navigation />
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:flex min-h-screen">
          {/* Desktop Sidebar */}
          <div className="w-64 bg-white border-r border-warm-200 shadow-sm">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-10 h-10 bg-warm-400 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">S</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-warm-800">SpendWise</h1>
                  <p className="text-sm text-warm-600">Financial Wellness</p>
                </div>
              </div>
              
              {/* User Info */}
              <div className="mb-8 p-4 bg-warm-50 rounded-lg">
                <h2 className="font-semibold text-warm-800">{user.name}</h2>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-1">
                    <span className="text-warm-400">⭐</span>
                    <span className="text-sm font-medium">{user.points}</span>
                  </div>
                  <div className="text-sm text-warm-600">Level {user.level}</div>
                </div>
              </div>
            </div>
            <Navigation />
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-auto">
            <div className="max-w-6xl mx-auto p-6">
              <Routes>
                <Route 
                  path="/" 
                  element={
                    <Dashboard 
                      user={user} 
                      expenses={expenses} 
                      updateUser={updateUser}
                    />
                  } 
                />
                <Route 
                  path="/add-expense" 
                  element={<ExpenseForm onAddExpense={addExpense} />} 
                />
                <Route 
                  path="/profile" 
                  element={<Profile user={user} updateUser={updateUser} />} 
                />
                <Route 
                  path="/challenges" 
                  element={<Challenges user={user} />} 
                />
              </Routes>
            </div>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
