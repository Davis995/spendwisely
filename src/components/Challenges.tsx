import { useState, useMemo } from 'react';
import { UserData, Challenge } from '../types';
import { Trophy, Target, Calendar, Award, Star, CheckCircle } from 'lucide-react';

interface ChallengesProps {
  user: UserData;
}

// Sample challenges - in a real app, these would come from an API
const sampleChallenges: Challenge[] = [
  {
    id: '1',
    title: 'Budget Streak',
    description: 'Stay under your daily budget for 7 days in a row',
    type: 'daily_budget',
    target: 7,
    currentProgress: 0,
    pointsReward: 50,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    isCompleted: false,
    isActive: true,
  },
  {
    id: '2',
    title: 'Expense Logger',
    description: 'Log at least one expense every day for a week',
    type: 'expense_logging',
    target: 7,
    currentProgress: 0,
    pointsReward: 30,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    isCompleted: false,
    isActive: true,
  },
  {
    id: '3',
    title: 'Food Budget Challenge',
    description: 'Spend less than UGX 70,000 on food this week',
    type: 'category_limit',
    target: 70000,
    currentProgress: 0,
    pointsReward: 40,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    isCompleted: false,
    isActive: true,
  },
  {
    id: '4',
    title: 'No Spend Day',
    description: 'Have a complete no-spend day',
    type: 'no_spend_day',
    target: 1,
    currentProgress: 0,
    pointsReward: 25,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    isCompleted: false,
    isActive: true,
  },
];

export default function Challenges({ user }: ChallengesProps) {
  const [challenges] = useState<Challenge[]>(sampleChallenges);
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');

  const activeChallenges = useMemo(() => {
    return challenges.filter(challenge => challenge.isActive && !challenge.isCompleted);
  }, [challenges]);

  const completedChallenges = useMemo(() => {
    return challenges.filter(challenge => challenge.isCompleted);
  }, [challenges]);

  const joinChallenge = () => {
    // In a real app, this would update the challenge status
    alert('🎯 Challenge joined! Start tracking your progress!');
  };

  const getChallengeIcon = (type: Challenge['type']) => {
    switch (type) {
      case 'daily_budget':
        return <Target className="w-6 h-6" />;
      case 'expense_logging':
        return <Calendar className="w-6 h-6" />;
      case 'category_limit':
        return <Star className="w-6 h-6" />;
      case 'no_spend_day':
        return <Award className="w-6 h-6" />;
      default:
        return <Trophy className="w-6 h-6" />;
    }
  };

  const getProgressColor = (progress: number, target: number) => {
    const percentage = (progress / target) * 100;
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-warm-400';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-gray-300';
  };

  const formatTimeRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours}h left`;
  };

  return (
    <div className="p-4 pb-20 lg:pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 lg:mb-8 space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-warm-800">Challenges</h1>
          <p className="text-warm-600">Complete challenges to earn points and badges</p>
        </div>
        <div className="text-right">
          <div className="flex items-center space-x-1 text-warm-400">
            <Trophy className="w-5 h-5" />
            <span className="font-semibold">{user.points}</span>
          </div>
          <p className="text-xs text-warm-600">Total Points</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex mb-6">
        <button
          onClick={() => setActiveTab('active')}
          className={`flex-1 py-2 px-4 text-center font-medium rounded-l-lg transition-colors ${
            activeTab === 'active'
              ? 'bg-warm-400 text-white'
              : 'bg-warm-200 text-warm-700 hover:bg-warm-300'
          }`}
        >
          Active ({activeChallenges.length})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`flex-1 py-2 px-4 text-center font-medium rounded-r-lg transition-colors ${
            activeTab === 'completed'
              ? 'bg-warm-400 text-white'
              : 'bg-warm-200 text-warm-700 hover:bg-warm-300'
          }`}
        >
          Completed ({completedChallenges.length})
        </button>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Active Challenges */}
        {activeTab === 'active' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {activeChallenges.length === 0 ? (
            <div className="card text-center py-8">
              <Trophy className="w-12 h-12 text-warm-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-warm-800 mb-2">No active challenges</h3>
              <p className="text-warm-600">Check back later for new challenges!</p>
            </div>
          ) : (
            activeChallenges.map((challenge) => (
              <div key={challenge.id} className="card">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-warm-100 rounded-lg text-warm-400">
                      {getChallengeIcon(challenge.type)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-warm-800">{challenge.title}</h3>
                      <p className="text-sm text-warm-600">{challenge.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 text-warm-400">
                      <Award className="w-4 h-4" />
                      <span className="font-semibold">{challenge.pointsReward}</span>
                    </div>
                    <p className="text-xs text-warm-600">points</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-warm-600">Progress</span>
                    <span className="font-semibold text-warm-800">
                      {challenge.currentProgress} / {challenge.target}
                    </span>
                  </div>
                  <div className="w-full bg-warm-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(
                        challenge.currentProgress,
                        challenge.target
                      )}`}
                      style={{
                        width: `${Math.min((challenge.currentProgress / challenge.target) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Time and Action */}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-warm-600">
                    ⏰ {formatTimeRemaining(challenge.endDate)}
                  </span>
                  <button
                    onClick={() => joinChallenge()}
                    className="btn-secondary text-sm py-2 px-4"
                  >
                    Join Challenge
                  </button>
                </div>
              </div>
            ))
          )}
          </div>
        )}

        {/* Completed Challenges */}
        {activeTab === 'completed' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {completedChallenges.length === 0 ? (
            <div className="card text-center py-8">
              <CheckCircle className="w-12 h-12 text-warm-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-warm-800 mb-2">No completed challenges yet</h3>
              <p className="text-warm-600">Complete your first challenge to see it here!</p>
            </div>
          ) : (
            completedChallenges.map((challenge) => (
              <div key={challenge.id} className="card opacity-75">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg text-green-600">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-warm-800">{challenge.title}</h3>
                      <p className="text-sm text-warm-600">{challenge.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 text-green-600">
                      <Award className="w-4 h-4" />
                      <span className="font-semibold">+{challenge.pointsReward}</span>
                    </div>
                    <p className="text-xs text-warm-600">earned</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-sm text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span>Challenge completed!</span>
                </div>
              </div>
            ))
          )}
          </div>
        )}

        {/* Weekly Leaderboard */}
        <div className="card mt-6">
        <div className="flex items-center mb-4">
          <Trophy className="w-5 h-5 text-warm-400 mr-2" />
          <h2 className="text-lg font-semibold text-warm-800">Weekly Leaderboard</h2>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-yellow-100 rounded-lg">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🥇</span>
              <div>
                <p className="font-semibold text-warm-800">You</p>
                <p className="text-sm text-warm-600">This week</p>
              </div>
            </div>
            <span className="font-bold text-warm-800">{user.points} pts</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-warm-100 rounded-lg">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🥈</span>
              <div>
                <p className="font-semibold text-warm-800">Sarah M.</p>
                <p className="text-sm text-warm-600">This week</p>
              </div>
            </div>
            <span className="font-bold text-warm-800">245 pts</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-warm-100 rounded-lg">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🥉</span>
              <div>
                <p className="font-semibold text-warm-800">Alex K.</p>
                <p className="text-sm text-warm-600">This week</p>
              </div>
            </div>
            <span className="font-bold text-warm-800">198 pts</span>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
