import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, DollarSign, Tag, FileText } from 'lucide-react';
import { ExpenseCategory } from '../types';
import { getCurrencySymbol } from '../utils/currency';

interface ExpenseFormProps {
  onAddExpense: (expense: {
    amount: number;
    category: ExpenseCategory;
    description: string;
  }) => void;
}

const categories: { value: ExpenseCategory; label: string; emoji: string }[] = [
  { value: 'food', label: 'Food & Dining', emoji: '🍽️' },
  { value: 'transport', label: 'Transportation', emoji: '🚗' },
  { value: 'entertainment', label: 'Entertainment', emoji: '🎬' },
  { value: 'shopping', label: 'Shopping', emoji: '🛍️' },
  { value: 'bills', label: 'Bills & Utilities', emoji: '📄' },
  { value: 'health', label: 'Health & Fitness', emoji: '💊' },
  { value: 'education', label: 'Education', emoji: '📚' },
  { value: 'other', label: 'Other', emoji: '📦' },
];

export default function ExpenseForm({ onAddExpense }: ExpenseFormProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    amount: '',
    category: '' as ExpenseCategory,
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.category || !formData.description) {
      alert('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      onAddExpense({
        amount: parseFloat(formData.amount),
        category: formData.category,
        description: formData.description.trim(),
      });

      // Show success message
      alert('🎉 Expense added! +1 point earned!');
      
      // Reset form and navigate back
      setFormData({ amount: '', category: '' as ExpenseCategory, description: '' });
      navigate('/');
    } catch (error) {
      alert('Error adding expense. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = formData.amount && formData.category && formData.description.trim();

  return (
    <div className="p-4 pb-20 lg:pb-6">
      {/* Header */}
      <div className="flex items-center mb-6 lg:mb-8">
        <button
          onClick={() => navigate('/')}
          className="p-2 -ml-2 text-warm-600 hover:text-warm-800 transition-colors lg:hidden"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl lg:text-3xl font-bold text-warm-800 ml-2 lg:ml-0">Add Expense</h1>
      </div>

      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8">
        {/* Amount Input */}
        <div className="card">
          <div className="flex items-center mb-4">
            <DollarSign className="w-5 h-5 text-warm-400 mr-2" />
            <h2 className="text-lg font-semibold text-warm-800">Amount</h2>
          </div>
          
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-warm-600 text-sm">
              {getCurrencySymbol()}
            </span>
            <input
              type="number"
              step="0.01"
              min="0"
              className="input-field pl-12 text-lg"
              placeholder="0"
              value={formData.amount}
              onChange={(e) => handleInputChange('amount', e.target.value)}
            />
          </div>
        </div>

        {/* Category Selection */}
        <div className="card">
          <div className="flex items-center mb-4">
            <Tag className="w-5 h-5 text-warm-400 mr-2" />
            <h2 className="text-lg font-semibold text-warm-800">Category</h2>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {categories.map((category) => (
              <button
                key={category.value}
                type="button"
                onClick={() => handleInputChange('category', category.value)}
                className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                  formData.category === category.value
                    ? 'border-warm-400 bg-warm-100'
                    : 'border-warm-200 hover:border-warm-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{category.emoji}</span>
                  <span className="text-sm font-medium text-warm-800">
                    {category.label}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Description Input */}
        <div className="card">
          <div className="flex items-center mb-4">
            <FileText className="w-5 h-5 text-warm-400 mr-2" />
            <h2 className="text-lg font-semibold text-warm-800">Description</h2>
          </div>
          
          <input
            type="text"
            className="input-field"
            placeholder="What did you spend on?"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            maxLength={100}
          />
          <p className="text-xs text-warm-600 mt-2">
            {formData.description.length}/100 characters
          </p>
        </div>

        {/* Quick Suggestions */}
        {formData.category && (
          <div className="card">
            <h3 className="text-sm font-medium text-warm-700 mb-3">Quick suggestions:</h3>
            <div className="flex flex-wrap gap-2">
              {getQuickSuggestions(formData.category).map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => handleInputChange('description', suggestion)}
                  className="px-3 py-1 bg-warm-100 text-warm-700 rounded-full text-sm hover:bg-warm-200 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

          {/* Submit Button */}
          <div className="lg:relative lg:bottom-auto lg:left-auto lg:right-auto lg:p-0 lg:bg-transparent lg:border-t-0 fixed bottom-20 left-0 right-0 p-4 bg-white border-t border-warm-200 lg:mt-8">
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed max-w-md mx-auto lg:max-w-none"
            >
              {isSubmitting ? 'Adding...' : 'Add Expense (+1 point)'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function getQuickSuggestions(category: ExpenseCategory): string[] {
  const suggestions: Record<ExpenseCategory, string[]> = {
    food: ['Coffee', 'Lunch', 'Groceries', 'Dinner', 'Rolex (chapati)'],
    transport: ['Boda boda', 'Matatu', 'Bus fare', 'Fuel', 'Taxi'],
    entertainment: ['Movie', 'Concert', 'Games', 'DSTV', 'Books'],
    shopping: ['Clothes', 'Electronics', 'Home goods', 'Gifts', 'Personal care'],
    bills: ['Internet', 'Airtime', 'Electricity', 'Water', 'Insurance'],
    health: ['Pharmacy', 'Clinic visit', 'Gym', 'Medicine', 'Health insurance'],
    education: ['Books', 'Course', 'School supplies', 'Tuition', 'Workshop'],
    other: ['Miscellaneous', 'Emergency', 'Donation', 'Fees', 'Other'],
  };
  
  return suggestions[category] || [];
}
