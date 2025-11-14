import { useState } from 'react';
import { UserData } from '../types';
import { User, DollarSign, Target } from 'lucide-react';
import { formatCurrency, getCurrencyName } from '../utils/currency';

interface OnboardingProps {
  onComplete: (user: UserData) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    monthlyIncome: '',
    monthlyBudget: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleComplete = () => {
    const monthlyIncome = parseFloat(formData.monthlyIncome);
    const monthlyBudget = parseFloat(formData.monthlyBudget);
    
    // Validate all inputs before creating user
    if (!formData.name.trim() || !formData.email.trim()) {
      alert('Please fill in all required fields');
      return;
    }
    
    if (isNaN(monthlyIncome) || monthlyIncome <= 0) {
      alert('Please enter a valid monthly income');
      return;
    }
    
    if (isNaN(monthlyBudget) || monthlyBudget <= 0) {
      alert('Please enter a valid monthly budget');
      return;
    }
    
    if (monthlyBudget > monthlyIncome) {
      alert('Monthly budget cannot be greater than monthly income');
      return;
    }
    
    const user: UserData = {
      id: Date.now().toString(),
      name: formData.name.trim(),
      email: formData.email.trim(),
      monthlyIncome: monthlyIncome,
      monthlyBudget: monthlyBudget,
      points: 0,
      level: 1,
      badges: [],
      savingsGoals: [],
      createdAt: new Date().toISOString(),
    };
    
    onComplete(user);
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.name.trim() && formData.email.trim();
      case 2:
        return formData.monthlyIncome && parseFloat(formData.monthlyIncome) > 0;
      case 3:
        return formData.monthlyBudget && parseFloat(formData.monthlyBudget) > 0;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-warm-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md lg:max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-warm-800 mb-2">Welcome to SpendWise</h1>
          <p className="text-warm-600">Your journey to financial wellness starts here</p>
        </div>

        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full ${
                    i <= step ? 'bg-warm-400' : 'bg-warm-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-warm-600">Step {step} of 3</span>
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <User className="w-12 h-12 text-warm-400 mx-auto mb-2" />
                <h2 className="text-xl font-semibold text-warm-800">Tell us about yourself</h2>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-warm-700 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-warm-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  className="input-field"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <DollarSign className="w-12 h-12 text-warm-400 mx-auto mb-2" />
                <h2 className="text-xl font-semibold text-warm-800">What's your monthly income?</h2>
                <p className="text-warm-600 text-sm mt-2">This helps us personalize your experience (in {getCurrencyName()})</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-warm-700 mb-2">
                  Monthly Income (UGX)
                </label>
                <input
                  type="number"
                  className="input-field"
                  placeholder="0"
                  value={formData.monthlyIncome}
                  onChange={(e) => handleInputChange('monthlyIncome', e.target.value)}
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <Target className="w-12 h-12 text-warm-400 mx-auto mb-2" />
                <h2 className="text-xl font-semibold text-warm-800">Set your monthly budget</h2>
                <p className="text-warm-600 text-sm mt-2">How much do you want to spend each month? (in {getCurrencyName()})</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-warm-700 mb-2">
                  Monthly Budget (UGX)
                </label>
                <input
                  type="number"
                  className="input-field"
                  placeholder="0"
                  value={formData.monthlyBudget}
                  onChange={(e) => handleInputChange('monthlyBudget', e.target.value)}
                />
              </div>
              
              {formData.monthlyBudget && formData.monthlyIncome && (
                <div className="bg-warm-100 p-3 rounded-lg">
                  <p className="text-sm text-warm-700">
                    You'll save approximately{' '}
                    <span className="font-semibold">
                      {formatCurrency(parseFloat(formData.monthlyIncome) - parseFloat(formData.monthlyBudget))}
                    </span>{' '}
                    per month!
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-between mt-8">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="btn-secondary"
              >
                Back
              </button>
            )}
            
            <div className="ml-auto">
              {step < 3 ? (
                <button
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleComplete}
                  disabled={!isStepValid()}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Get Started
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
