import React, { useState } from 'react';
import { Home, Users, DollarSign, Flame, MessageSquare, Share2, TrendingUp, X } from 'lucide-react';
import { useEffect, useRef } from 'react';  

// Supabase Configuration
const supabaseUrl = 'https://ltrdgyraevtxwroukxkt.supabase.co';
const  supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0cmRneXJhZXZ0eHdyb3VreGt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyODA5MDEsImV4cCI6MjA4MTg1NjkwMX0.hERWWr2FjKX9zJJVU3j8JjE2y1ZKJeQCsHyrm1yueEI';

const supabaseFetch = async (tableName, query = '', method = 'GET', body = null) => {
  try {
    const url = `${supabaseUrl}/rest/v1/${tableName}${query}`;
    const headers = {
      'apikey': supabaseAnonKey,
      'Authorization': `Bearer ${supabaseAnonKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    };
    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);
    const response = await fetch(url, options);
    if (response.status === 204) return null;
    return await response.json();
  } catch (e) {
    console.error("Database Error:", e);
    return null;
  }
};

// Create the REAL Supabase client
const supabase = window.supabase.createClient(supabaseUrl, supabaseAnonKey);

// --- DATABASE CONNECTION END ---
// This connects your old function calls to our new fetcher
const sendToSupabase = supabaseFetch;

const HomeScreen = ({ setCurrentScreen }) => (
  <div className="min-h-screen bg-gradient-to-b from-orange-100 to-pink-100 flex items-center justify-center p-4 pb-24">
    <div className="text-center relative z-10">
      <div className="text-8xl mb-6">🍽️</div>
      <h1 className="text-5xl font-bold text-black mb-4 drop-shadow-lg">DishiStudio</h1>
      <p className="text-xl text-black mb-8 drop-shadow-md">Share meals, build streaks with friends</p>
      <button
        onClick={() => setCurrentScreen('login')}
        className="bg-orange-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-orange-700 transition shadow-lg"
      >
        Get Started
      </button>
    </div>
  </div>
);

const FriendsScreen = ({
  user,
  friends,
  friendRequests,
  handleFriendRequest,
  sendFriendRequest,
  removeFriend,
  searchUsers,
  searchUsername,
  setSearchUsername,
  searchResults,
  showAddFriend,
  setShowAddFriend
}) => {
  // Filter pending requests where YOU are the receiver
  const myPendingRequests = friendRequests.filter(
    req => req.receiver_id === user?.id && req.status === 'pending'
  );

  // DEBUG: Log after myPendingRequests is defined
  console.log("=== FRIENDS SCREEN DEBUG ===");
  console.log("Current user:", user?.username, user?.id);
  console.log("All friend requests:", friendRequests);
  console.log("My pending requests:", myPendingRequests);
  console.log("===========================");

  return (
    <div className="pb-20">
      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-6">
        <h2 className="text-3xl font-bold mb-2">Friends</h2>
        <p className="opacity-90">Connect and share meals</p>
      </div>

      <div className="p-4 max-w-4xl mx-auto">
        {/* --- SECTION 1: INCOMING REQUESTS --- */}
        {myPendingRequests.length > 0 && (
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 mb-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Friend Requests ({myPendingRequests.length})
            </h3>
            <div className="space-y-3">
              {myPendingRequests.map(request => (
                <div key={request.id} className="bg-white rounded-lg p-4 flex items-center justify-between shadow-sm">
                  <div>
                    <p className="font-semibold text-gray-800">{request.sender_name || 'New User'}</p>
                    <p className="text-sm text-gray-500">@{request.sender_username}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleFriendRequest(request, true)}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleFriendRequest(request, false)}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-400"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- SECTION 2: SEARCH & ADD FRIENDS --- */}
        {!showAddFriend && friends.length === 0 && myPendingRequests.length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-12 text-center mb-4">
            <p className="text-xl text-gray-600 mb-2 font-bold">No friends yet</p>
            <button onClick={() => setShowAddFriend(true)} className="bg-purple-100 text-purple-700 px-6 py-2 rounded-full font-bold">
              Find People
            </button>
          </div>
        )}

        {!showAddFriend && (friends.length > 0 || myPendingRequests.length > 0) && (
          <div className="mb-4">
            <button onClick={() => setShowAddFriend(true)} className="w-full bg-purple-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-purple-600">
              + Add More Friends
            </button>
          </div>
        )}

        {showAddFriend && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-4 border border-purple-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Search Users</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1 block">
                  Search by Username
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={searchUsername}
                    onChange={(e) => setSearchUsername(e.target.value)}
                    placeholder="Enter username"
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    onKeyPress={(e) => e.key === 'Enter' && searchUsers()}
                    autoComplete="off"
                  />
                  <button
                    onClick={searchUsers}
                    className="bg-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-600"
                  >
                    Search
                  </button>
                </div>

                {searchResults.length > 0 && (
                  <div className="mt-6 border-t pt-4">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-3">Results</p>
                    <div className="space-y-2">
                      {searchResults.map(u => {
                        const isAlreadyFriend = friends.some(f => f.id === u.id);
                        const hasPendingRequest = friendRequests.some(
                          req => (req.sender_id === user?.id && req.receiver_id === u.id) ||
                                 (req.sender_id === u.id && req.receiver_id === user?.id)
                        );
                        
                        return (
                          <div key={u.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-semibold">{u.name || u.full_name}</p>
                              <p className="text-sm text-gray-500">@{u.username}</p>
                            </div>
                            <button
                              onClick={() => sendFriendRequest(u)}
                              disabled={u.id === user?.id || isAlreadyFriend || hasPendingRequest}
                              className={`px-4 py-2 rounded-lg font-semibold ${
                                u.id === user?.id 
                                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                  : isAlreadyFriend 
                                  ? 'bg-green-100 text-green-700 cursor-not-allowed' 
                                  : hasPendingRequest
                                  ? 'bg-yellow-100 text-yellow-700 cursor-not-allowed'
                                  : 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:shadow-lg'
                              }`}
                            >
                              {u.id === user?.id ? 'You' : isAlreadyFriend ? '✓ Friends' : hasPendingRequest ? 'Pending' : 'Add Friend'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
              <button onClick={() => setShowAddFriend(false)} className="w-full text-gray-500 py-2 text-sm hover:underline">
                Close Search
              </button>
            </div>
          </div>
        )}

        {/* --- SECTION 3: FRIENDS LIST --- */}
        {friends.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800">My Friends ({friends.length})</h3>
            {friends.map(friend => (
              <div key={friend.id} className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-2xl">
                      {friend.avatar || '🥗'}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{friend.name || friend.full_name}</h3>
                      <p className="text-xs text-gray-500">@{friend.username}</p>
                    </div>
                  </div>
                  <button onClick={() => removeFriend(friend.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                    <span className="text-xs font-bold uppercase">Remove</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const StreaksScreen = ({ friends, user }) => {
  const [streakData, setStreakData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchStreakData();
    }
  }, [user, friends]);

  const fetchStreakData = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      // Fetch all meal sharing activities involving this user
      const query = `?or=(sender_id.eq.${user.id},receiver_id.eq.${user.id})&action_type=eq.share_meal&select=*&order=created_at.desc`;
      const activities = await supabaseFetch('user_activity', query);
      
      if (!activities || activities.length === 0) {
        setStreakData([]);
        setLoading(false);
        return;
      }

      // Process streak data for each friend
      const streaksWithFriends = friends.map(friend => {
        // Get meals sent TO this friend
        const sentToFriend = activities.filter(
          act => act.sender_id === user.id && act.receiver_id === friend.id
        );
        
        // Get meals received FROM this friend
        const receivedFromFriend = activities.filter(
          act => act.sender_id === friend.id && act.receiver_id === user.id
        );

        // Calculate streak (consecutive days with reciprocal sharing)
        const streak = calculateStreak(sentToFriend, receivedFromFriend);
        
        // Calculate average meal price
        const allMeals = [...sentToFriend, ...receivedFromFriend];
        const avgPrice = allMeals.length > 0
          ? Math.round(allMeals.reduce((sum, act) => sum + (act.action_details?.budget || 0), 0) / allMeals.length)
          : 0;

        // Get recent meals
        const recentMeals = allMeals.slice(0, 5).map(act => ({
          name: act.action_details?.meal_name || 'Unknown Meal',
          price: act.action_details?.budget || 0,
          sender: act.sender_id === user.id ? 'You' : friend.name,
          date: new Date(act.created_at).toLocaleDateString()
        }));

        return {
          ...friend,
          streak,
          sentCount: sentToFriend.length,
          receivedCount: receivedFromFriend.length,
          avgPrice,
          recentMeals,
          totalShared: allMeals.length
        };
      });

      setStreakData(streaksWithFriends);
    } catch (error) {
      console.error('Error fetching streak data:', error);
      setStreakData([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStreak = (sent, received) => {
    // Group activities by date
    const sentDates = new Set(sent.map(act => new Date(act.created_at).toDateString()));
    const receivedDates = new Set(received.map(act => new Date(act.created_at).toDateString()));
    
    // Find dates where BOTH users shared meals
    const mutualDates = [...sentDates].filter(date => receivedDates.has(date));
    
    if (mutualDates.length === 0) return 0;

    // Sort dates and count consecutive days
    const sortedDates = mutualDates
      .map(d => new Date(d))
      .sort((a, b) => b - a); // Most recent first
    
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (let date of sortedDates) {
      const dayDiff = Math.floor((currentDate - date) / (1000 * 60 * 60 * 24));
      
      if (dayDiff === streak) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  const longestStreak = streakData.reduce((max, f) => Math.max(max, f.streak || 0), 0);
  const activeStreaks = streakData.filter(f => (f.streak || 0) > 0).length;

  return (
    <div className="pb-20">
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6">
        <h2 className="text-3xl font-bold mb-2 text-white">Streaks</h2>
        <p className="opacity-90">Keep the momentum going!</p>
      </div>
      
      <div className="p-4 max-w-4xl mx-auto">
        {loading ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <p className="text-gray-600">Loading streak data...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <Flame className="w-12 h-12 text-orange-500 mx-auto mb-2" />
                <p className="text-gray-600 text-sm">Longest Streak</p>
                <p className="text-4xl font-bold text-orange-600">{longestStreak}</p>
                <p className="text-xs text-gray-500 mt-1">consecutive days</p>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <TrendingUp className="w-12 h-12 text-green-500 mx-auto mb-2" />
                <p className="text-gray-600 text-sm">Active Streaks</p>
                <p className="text-4xl font-bold text-green-600">{activeStreaks}</p>
                <p className="text-xs text-gray-500 mt-1">friends</p>
              </div>
            </div>

            {streakData.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <Flame className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-xl text-gray-600 mb-2 font-bold">No streaks yet</p>
                <p className="text-gray-500">Share meals with friends to start building streaks!</p>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800">Leaderboard</h3>
                {streakData
                  .sort((a, b) => (b.streak || 0) - (a.streak || 0))
                  .map((friend, index) => (
                    <div key={friend.id} className="bg-white rounded-xl shadow-lg p-6">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-bold text-gray-400">#{index + 1}</span>
                          <span className="text-3xl">{friend.avatar || '🥗'}</span>
                          <div>
                            <span className="font-bold text-lg text-gray-800">{friend.name}</span>
                            <p className="text-xs text-gray-500">@{friend.username}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Flame className="w-6 h-6 text-orange-500" />
                          <span className="text-2xl font-bold text-orange-600">{friend.streak || 0}</span>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="bg-blue-50 rounded-lg p-3 text-center">
                          <p className="text-xs text-gray-600">Meals Sent</p>
                          <p className="text-xl font-bold text-blue-600">{friend.sentCount}</p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-3 text-center">
                          <p className="text-xs text-gray-600">Meals Received</p>
                          <p className="text-xl font-bold text-green-600">{friend.receivedCount}</p>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-3 text-center">
                          <p className="text-xs text-gray-600">Avg Price</p>
                          <p className="text-xl font-bold text-purple-600">KSh {friend.avgPrice}</p>
                        </div>
                      </div>

                      {/* Recent Meals */}
                      {friend.recentMeals && friend.recentMeals.length > 0 && (
                        <div className="border-t pt-4">
                          <p className="text-sm font-bold text-gray-700 mb-2">Recent Meals Shared:</p>
                          <div className="space-y-2">
                            {friend.recentMeals.map((meal, idx) => (
                              <div key={idx} className="flex justify-between items-center text-sm bg-gray-50 rounded-lg p-2">
                                <div>
                                  <span className="font-semibold text-gray-800">{meal.name}</span>
                                  <span className="text-gray-500 text-xs ml-2">by {meal.sender}</span>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold text-green-600">KSh {meal.price}</p>
                                  <p className="text-xs text-gray-500">{meal.date}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Streak Info */}
                      {friend.streak > 0 && (
                        <div className="mt-4 bg-orange-50 border-l-4 border-orange-500 rounded p-3">
                          <p className="text-sm text-orange-800">
                            🔥 <strong>{friend.streak} day streak!</strong> Keep sharing meals daily to maintain it.
                          </p>
                        </div>
                      )}

                      {friend.totalShared === 0 && (
                        <div className="mt-4 bg-gray-50 rounded p-3 text-center">
                          <p className="text-sm text-gray-600">
                            No meals shared yet. Send a meal to start your streak!
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const ShareScreen = ({ 
  selectedMeal, 
  friends, 
  selectedFriendsForMeal, 
  setSelectedFriendsForMeal, 
  sendMealToFriends, 
  setCurrentScreen 
}) => {
  const toggleFriendSelection = (friendId) => {
    setSelectedFriendsForMeal(prev => 
      prev.includes(friendId)
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId]
    );
  };

  return (
    <div className="pb-20">
      <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white p-6">
        <h2 className="text-3xl font-bold mb-2 text-white">Share Meal</h2>
        <p className="opacity-90">Send {selectedMeal?.name} to friends</p>
      </div>
      
      <div className="p-4 max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-2">{selectedMeal?.name}</h3>
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
            KSh {selectedMeal?.budget}
          </span>
          <p className="text-sm text-gray-600 mt-3">
            Selected {selectedFriendsForMeal.length} friend(s)
          </p>
        </div>

        <h3 className="text-lg font-bold text-gray-800 mb-4">Select friends</h3>
        
        {friends.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-600 mb-2 font-bold">No friends yet</p>
            <p className="text-gray-500">Add friends first to share meals!</p>
          </div>
        ) : (
          <>
            {friends.map(friend => {
              const isSelected = selectedFriendsForMeal.includes(friend.id);
              return (
                <div 
                  key={friend.id} 
                  className={`bg-white rounded-xl shadow-md p-6 mb-4 cursor-pointer transition-all ${
                    isSelected ? 'ring-4 ring-orange-500' : ''
                  }`}
                  onClick={() => toggleFriendSelection(friend.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">{friend.avatar || '🥗'}</div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{friend.name}</h3>
                        <p className="text-sm text-gray-500">@{friend.username}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Flame className="w-4 h-4 text-orange-500" />
                          <span className="text-sm text-gray-600">{friend.streak || 0} day streak</span>
                        </div>
                      </div>
                    </div>
                    <div className={`w-8 h-8 rounded-full border-4 flex items-center justify-center ${
                      isSelected ? 'bg-orange-500 border-orange-500' : 'bg-white border-gray-300'
                    }`}>
                      {isSelected && <span className="text-white text-lg">✓</span>}
                    </div>
                  </div>
                </div>
              );
            })}

            <button
              onClick={sendMealToFriends}
              disabled={selectedFriendsForMeal.length === 0}
              className={`w-full py-3 rounded-lg font-bold transition-all mb-2 ${
                selectedFriendsForMeal.length === 0
                  ? 'bg-gray-200 text-gray-500'
                  : 'bg-gradient-to-r from-orange-500 to-pink-500 text-white'
              }`}
            >
              Send to {selectedFriendsForMeal.length} Friend{selectedFriendsForMeal.length !== 1 ? 's' : ''}
            </button>
          </>
        )}

        <button
          onClick={() => {
            setSelectedFriendsForMeal([]);
            setCurrentScreen('suggestions');
          }}
          className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-bold"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

const BudgetScreen = ({ budget, setBudget, trackActivity }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempBudget, setTempBudget] = useState(budget);

  const saveBudget = () => {
    const oldBudget = budget;
    setBudget(tempBudget);
    setIsEditing(false);
    
    trackActivity('change_budget', {
      old_budget: oldBudget,
      new_budget: tempBudget,
      timestamp: new Date().toISOString()
    });
  };

  return (
    <div className="pb-20">
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6">
        <h2 className="text-3xl font-bold mb-2 text-white">Your Budget</h2>
        <p className="opacity-90">Track your meal spending</p>
      </div>
      
      <div className="p-4 max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-green-100">
          <div className="text-center mb-6">
            <p className="text-gray-600 mb-2">Weekly Budget</p>
            
            {isEditing ? (
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-gray-800">KSh</span>
                  <input
                    type="number"
                    value={tempBudget}
                    onChange={(e) => setTempBudget(Number(e.target.value))}
                    className="text-4xl font-bold text-gray-800 text-center border-2 border-green-500 rounded-lg px-4 py-2 w-56 focus:outline-none"
                    min="1000"
                    max="50000"
                  />
                </div>
                <div className="flex gap-2 mt-3">
                  <button onClick={saveBudget} className="bg-green-500 text-white px-6 py-2 rounded-lg font-bold">
                    Save
                  </button>
                  <button 
                    onClick={() => { setTempBudget(budget); setIsEditing(false); }} 
                    className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-bold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <span className="text-5xl font-bold text-gray-800">KSh {budget}</span>
                <button 
                  onClick={() => { 
                    setTempBudget(''); // Start blank when editing
                    setIsEditing(true); 
                  }} 
                  className="text-green-600 font-bold hover:underline"
                >
                  ✏️ Edit Budget
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm">Daily Average</p>
              <p className="text-2xl font-bold text-blue-600">KSh {Math.round(budget / 7)}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm">Per Meal</p>
              <p className="text-2xl font-bold text-purple-600">KSh {Math.round(budget / 21)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Budget Tips</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <span className="text-green-500 text-xl font-bold">✓</span>
              <span className="text-gray-700">Shop at local markets for fresh produce at lower prices</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 text-xl font-bold">✓</span>
              <span className="text-gray-700">Share ingredients with friends to reduce waste and costs</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const SuggestionsScreen = ({ 
  maxMealBudget, 
  setMaxMealBudget, 
  selectedCategory, 
  setSelectedCategory, 
  searchQuery, 
  setSearchQuery, 
  filteredMeals, 
  setViewingRecipe, 
  selectMeal, 
  setCurrentScreen, 
  trackActivity 
}) => {
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [tempMaxBudget, setTempMaxBudget] = useState(''); // CHANGED: Start blank

  const saveMealBudget = () => {
    const newBudget = Number(tempMaxBudget) || maxMealBudget;
    if (newBudget < 50) {
      alert("Max meal budget must be at least KSh 50");
      return;
    }
    
    const oldMaxBudget = maxMealBudget;
    setMaxMealBudget(newBudget);
    setIsEditingBudget(false);
    
    trackActivity('change_max_meal_budget', {
      old_max_budget: oldMaxBudget,
      new_max_budget: newBudget,
      timestamp: new Date().toISOString()
    });
  };

  return (
    <div className="pb-20">
      <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white p-6">
        <h2 className="text-2xl font-bold mb-2 text-white">Today's Suggestions</h2>
        <p className="text-base opacity-90">Delicious meals within your budget</p>
      </div>
      
      <div className="p-4 max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-orange-100">
          <div className="mb-6">
            <label className="text-lg font-bold text-gray-800 mb-3 block">Max Meal Budget</label>
            
            {isEditingBudget ? (
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-gray-800">KSh</span>
                <input
                  type="number"
                  value={tempMaxBudget}
                  onChange={(e) => setTempMaxBudget(e.target.value)}
                  placeholder={maxMealBudget.toString()}
                  className="text-2xl font-bold text-orange-600 border-2 border-orange-500 rounded-lg px-3 py-2 w-32 focus:outline-none"
                  min="50"
                  max="1000"
                  onFocus={(e) => e.target.select()}
                />
                <button onClick={saveMealBudget} className="bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold">
                  Save
                </button>
                <button 
                  onClick={() => { setTempMaxBudget(''); setIsEditingBudget(false); }} 
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-orange-600">KSh {maxMealBudget}</span>
                <button 
                  onClick={() => { 
                    setTempMaxBudget(''); 
                    setIsEditingBudget(true); 
                  }} 
                  className="text-orange-600 hover:text-orange-700 font-semibold text-sm"
                >
                  ✏️ Edit
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="text-lg font-bold text-gray-800 mb-3 block">Meal Category</label>
            <div className="flex gap-2 flex-wrap">
              {['All', 'Breakfast', 'Lunch', 'Dinner'].map(category => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    trackActivity('filter_category', { category: category, timestamp: new Date().toISOString() });
                  }}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="mt-6">
              <label className="text-lg font-bold text-gray-800 mb-3 block">Search Meals</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, ingredients..."
                  className="w-full p-3 pr-10 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {filteredMeals.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <p className="text-xl text-gray-600 mb-2">No meals found</p>
            <p className="text-gray-500">Try increasing your budget or search for something else</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {filteredMeals.map(meal => (
              <div key={meal.id} className="bg-white rounded-xl shadow-md p-6 border border-gray-50">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{meal.name}</h3>
                    <span className="inline-block mt-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {meal.category}
                    </span>
                  </div>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">
                    KSh {meal.budget}
                  </span>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <button onClick={() => setViewingRecipe(meal)} className="flex-1 bg-blue-500 text-white py-2 rounded-lg font-bold">
                    View
                  </button>
                  <button onClick={() => { selectMeal(meal); setCurrentScreen('share'); }} className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white py-2 rounded-lg font-bold">
                    Share
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const FeedbackScreen = ({ submitFeedback, trackActivity }) => {
  const [feedback, setFeedback] = useState('');

  return (
    <div className="pb-20">
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-6">
        <h2 className="text-3xl font-bold mb-2 text-white">Feedback</h2>
        <p className="opacity-90">Help us improve DishiStudio</p>
      </div>
      
      <div className="p-4 max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-50">
          <label className="text-lg font-bold text-gray-800 mb-3 block">
            Share your thoughts
          </label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="What do you think about DishiStudio? Any suggestions?"
            className="w-full p-4 border border-gray-300 rounded-lg mb-4 h-40 resize-none focus:ring-2 focus:ring-blue-500 outline-none"
          />
          
          <button
            onClick={() => {
              if (feedback.trim()) {
                submitFeedback(feedback);
                setFeedback('');
              }
            }}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all"
          >
            Submit Feedback
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mt-6 border border-gray-50">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Feedback</h3>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => {
                trackActivity('quick_feedback', { type: 'love_it', timestamp: new Date().toISOString() });
                alert('Thanks for the love! ❤️');
              }}
              className="p-3 border-2 border-gray-100 rounded-lg font-medium hover:border-blue-500 hover:bg-blue-50 transition-all text-left">
              😊 Love it!
            </button>
            <button 
              onClick={() => {
                trackActivity('quick_feedback', { type: 'need_more_meals', timestamp: new Date().toISOString() });
                alert('Thanks! We\'ll add more meals soon! 🍽️');
              }}
              className="p-3 border-2 border-gray-100 rounded-lg font-medium hover:border-blue-500 hover:bg-blue-50 transition-all text-left">
              🤔 Need more meals
            </button>
            <button 
              onClick={() => {
                trackActivity('quick_feedback', { type: 'budget_helpful', timestamp: new Date().toISOString() });
                alert('Glad the budget feature helps! 💰');
              }}
              className="p-3 border-2 border-gray-100 rounded-lg font-medium hover:border-blue-500 hover:bg-blue-50 transition-all text-left">
              💰 Budget helpful
            </button>
            <button 
              onClick={() => {
                trackActivity('quick_feedback', { type: 'love_streaks', timestamp: new Date().toISOString() });
                alert('Keep those streaks going! 🔥');
              }}
              className="p-3 border-2 border-gray-100 rounded-lg font-medium hover:border-blue-500 hover:bg-blue-50 transition-all text-left">
              👥 Love streaks
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const MealPlannerApp = () => {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const searchRef = useRef(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  // Check if the URL contains the recovery type
  const hash = window.location.hash;
  if (hash && hash.includes('type=recovery')) {
    setCurrentScreen('reset-password');
  }
}, []);

// Auto-focus when component loads
useEffect(() => {
  searchRef.current?.focus();
}, []);

// Allow typing anywhere to focus search
useEffect(() => {
  const handleKeyDown = (e) => {
    const tag = document.activeElement.tagName;

    if (
      tag !== 'INPUT' &&
      tag !== 'TEXTAREA' &&
      !e.ctrlKey &&
      !e.metaKey
    ) {
      searchRef.current?.focus();
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, []);

  const mealsData = [
  { id: 1, name: 'Millet / Uji Porridge', description: 'Traditional millet breakfast porridge', budget: 70, category: 'Breakfast', ingredients: ['Millet flour', 'Water', 'Optional milk'], recipe: '1. Boil water in a pot. 2. Mix millet flour with cold water to form a smooth paste. 3. Pour the paste into boiling water while stirring continuously. 4. Cook for 10-15 minutes while stirring. 5. Add milk if desired. 6. Serve hot.', healthScore: 5, culturalNote: 'Many Kenyans grew up taking uji before school or farm work', veg: true, leg: false, protein: false, lowSugar: true, lowSalt: true, moderateFats: true },
  { id: 2, name: 'Boiled Sweet Potatoes & Eggs', description: 'Boiled sweet potatoes with eggs', budget: 90, category: 'Breakfast', ingredients: ['Sweet potatoes', 'Eggs', 'Salt'], recipe: '1. Peel and wash sweet potatoes. 2. Boil sweet potatoes in salted water until tender (20-30 minutes). 3. In a separate pot, boil eggs for 10 minutes. 4. Drain and serve together.', healthScore: 5, culturalNote: 'A common student and bedsitter breakfast', veg: true, leg: false, protein: true, lowSugar: true, lowSalt: true, moderateFats: true },
  { id: 3, name: 'Boiled Maize & Greens', description: 'Boiled maize served with greens', budget: 80, category: 'Breakfast', ingredients: ['Dry maize', 'Sukuma wiki', 'Salt'], recipe: '1. Soak dry maize overnight. 2. Boil maize until tender (1-2 hours). 3. Wash and chop sukuma wiki. 4. Sauté greens with salt. 5. Serve maize with greens on the side.', healthScore: 4, culturalNote: 'Often sold early morning by roadside vendors', veg: true, leg: false, protein: false, lowSugar: true, lowSalt: true, moderateFats: true },
  { id: 4, name: 'Vegetable Omelette', description: 'Egg omelette with vegetables', budget: 110, category: 'Breakfast', ingredients: ['Eggs', 'Onion', 'Tomato', 'Spinach', 'Cooking oil'], recipe: '1. Chop onion, tomato, and spinach finely. 2. Beat eggs in a bowl with salt. 3. Heat oil in a pan. 4. Add vegetables and sauté for 2 minutes. 5. Pour in beaten eggs. 6. Cook until set, flip and cook other side. 7. Serve hot.', healthScore: 5, culturalNote: 'A quick filling breakfast when time is limited', veg: true, leg: false, protein: true, lowSugar: true, lowSalt: true, moderateFats: true },
  { id: 5, name: 'Mandazi & Milk', description: 'Fried dough served with milk', budget: 80, category: 'Breakfast', ingredients: ['Wheat flour', 'Sugar', 'Cooking oil', 'Milk'], recipe: '1. Mix flour, sugar, and a pinch of salt. 2. Add water gradually to form dough. 3. Let dough rest for 30 minutes. 4. Roll out and cut into triangles. 5. Heat oil and deep fry until golden brown. 6. Serve with warm milk.', healthScore: 2, culturalNote: 'Classic chai and mandazi combo especially on weekends', veg: false, leg: false, protein: false, lowSugar: false, lowSalt: false, moderateFats: true },
  { id: 6, name: 'Fruit Salad', description: 'Fresh mixed seasonal fruits', budget: 100, category: 'Breakfast', ingredients: ['Mango', 'Banana', 'Pawpaw', 'Orange'], recipe: '1. Wash all fruits thoroughly. 2. Peel and dice mango, banana, and pawpaw. 3. Peel and segment orange. 4. Mix all fruits in a bowl. 5. Chill and serve.', healthScore: 5, culturalNote: 'Common in urban homes and juice kiosks', veg: true, leg: false, protein: false, lowSugar: true, lowSalt: true, moderateFats: true },
  { id: 7, name: 'Tea & Whole Grain Toast', description: 'Tea served with whole grain toast', budget: 60, category: 'Breakfast', ingredients: ['Tea leaves', 'Water', 'Milk', 'Whole grain bread'], recipe: '1. Boil water with tea leaves. 2. Add milk and simmer for 2 minutes. 3. Strain tea. 4. Toast bread until golden. 5. Serve together.', healthScore: 4, culturalNote: 'The most normal weekday breakfast in Kenyan homes', veg: true, leg: false, protein: false, lowSugar: true, lowSalt: true, moderateFats: true },
  { id: 8, name: 'Egg Sandwich', description: 'Whole grain sandwich with eggs', budget: 110, category: 'Breakfast', ingredients: ['Whole grain bread', 'Eggs', 'Tomato'], recipe: '1. Boil or fry eggs. 2. Slice tomato thinly. 3. Toast bread. 4. Place egg and tomato between bread slices. 5. Cut and serve.', healthScore: 5, culturalNote: 'Popular with people rushing to work or class', veg: true, leg: false, protein: true, lowSugar: true, lowSalt: true, moderateFats: true },
  { id: 9, name: 'Sweet Potato & Eggs', description: 'Boiled sweet potato with eggs', budget: 90, category: 'Breakfast', ingredients: ['Sweet potatoes', 'Eggs', 'Salt'], recipe: '1. Peel and wash sweet potatoes. 2. Boil sweet potatoes in salted water until tender. 3. In a separate pot, boil eggs for 10 minutes. 4. Drain and serve together.', healthScore: 5, culturalNote: 'Affordable and filling upcountry breakfast', veg: true, leg: false, protein: true, lowSugar: true, lowSalt: true, moderateFats: true },
  { id: 10, name: 'Mandazi & Tea', description: 'Mandazi served with tea', budget: 70, category: 'Breakfast', ingredients: ['Wheat flour', 'Sugar', 'Cooking oil', 'Tea leaves', 'Milk'], recipe: '1. Prepare mandazi as described earlier. 2. Boil tea with milk. 3. Serve mandazi with hot tea.', healthScore: 2, culturalNote: 'Common kiosk breakfast combo', veg: false, leg: false, protein: false, lowSugar: false, lowSalt: false, moderateFats: true },
  { id: 11, name: 'Fruit Smoothie', description: 'Blended fruits with milk', budget: 100, category: 'Breakfast', ingredients: ['Banana', 'Mango', 'Milk'], recipe: '1. Peel and chop banana and mango. 2. Blend with milk until smooth. 3. Add ice if desired. 4. Serve immediately.', healthScore: 4, culturalNote: 'Popular with gym-goers and young professionals', veg: true, leg: false, protein: false, lowSugar: true, lowSalt: true, moderateFats: true },
  { id: 12, name: 'Arrow Roots & Tea', description: 'Boiled arrow roots with tea', budget: 70, category: 'Breakfast', ingredients: ['Arrow roots', 'Tea leaves', 'Milk'], recipe: '1. Wash and peel arrow roots. 2. Boil until tender (30-40 minutes). 3. Prepare tea with milk. 4. Serve together.', healthScore: 4, culturalNote: 'Very traditional breakfast in many Kenyan homes', veg: true, leg: false, protein: false, lowSugar: true, lowSalt: true, moderateFats: true },
  { id: 13, name: 'Boiled Cassava & Tea', description: 'Boiled cassava served with tea', budget: 70, category: 'Breakfast', ingredients: ['Cassava', 'Tea leaves', 'Milk'], recipe: '1. Peel and wash cassava. 2. Boil in salted water until tender (30-40 minutes). 3. Prepare milk tea. 4. Serve together.', healthScore: 4, culturalNote: 'Common in coastal and western Kenya', veg: true, leg: false, protein: false, lowSugar: true, lowSalt: true, moderateFats: true },
  { id: 14, name: 'Boiled Arrow Roots & Eggs', description: 'Arrow roots with boiled eggs', budget: 100, category: 'Breakfast', ingredients: ['Arrow roots', 'Eggs', 'Salt'], recipe: '1. Wash and peel arrow roots. 2. Boil until tender. 3. In a separate pot, boil eggs for 10 minutes. 4. Serve together.', healthScore: 5, culturalNote: 'A strong breakfast often taken by farmers', veg: true, leg: false, protein: true, lowSugar: true, lowSalt: true, moderateFats: true },
  { id: 15, name: 'Bread & Avocado', description: 'Bread served with avocado', budget: 80, category: 'Breakfast', ingredients: ['Bread', 'Avocado'], recipe: '1. Slice bread. 2. Cut avocado in half, remove seed. 3. Scoop avocado and mash with salt. 4. Spread on bread. 5. Serve.', healthScore: 4, culturalNote: 'Very popular when avocado is in season', veg: true, leg: false, protein: false, lowSugar: true, lowSalt: true, moderateFats: true },
  { id: 16, name: 'Boiled Eggs & Avocado', description: 'Boiled eggs served with avocado', budget: 90, category: 'Breakfast', ingredients: ['Eggs', 'Avocado'], recipe: '1. Boil eggs for 10 minutes. 2. Peel eggs. 3. Cut avocado in half. 4. Serve together with salt.', healthScore: 5, culturalNote: 'Simple protein plus healthy mafuta good fats', veg: true, leg: false, protein: true, lowSugar: true, lowSalt: true, moderateFats: true },
  { id: 17, name: 'Ugali & Sukuma Wiki', description: 'Ugali served with collard greens', budget: 120, category: 'Lunch', ingredients: ['Maize flour', 'Sukuma wiki', 'Cooking oil'], recipe: '1. Boil water in a sufuria. 2. Add maize flour gradually while stirring to avoid lumps. 3. Cook for 10 minutes, stirring constantly. 4. Wash and chop sukuma wiki. 5. Sauté with onions and tomatoes. 6. Serve ugali with sukuma.', healthScore: 5, culturalNote: 'If you say Kenyan food this is usually the first thing people think of', veg: true, leg: false, protein: false, lowSugar: true, lowSalt: true, moderateFats: true },
  { id: 18, name: 'Githeri (Maize & Beans)', description: 'Boiled maize and beans', budget: 130, category: 'Lunch', ingredients: ['Maize', 'Beans', 'Salt'], recipe: '1. Soak maize and beans overnight. 2. Boil together until tender (2-3 hours). 3. Add salt to taste. 4. Can add onions and tomatoes for flavor. 5. Serve hot.', healthScore: 5, culturalNote: 'Very common in central Kenya and school menus', veg: true, leg: true, protein: false, lowSugar: true, lowSalt: true, moderateFats: true },
  { id: 19, name: 'Grilled Fish with Vegetables', description: 'Grilled fish served with vegetables', budget: 250, category: 'Lunch', ingredients: ['Fish', 'Cabbage', 'Carrots'], recipe: '1. Clean and season fish with salt and lemon. 2. Grill fish until cooked through. 3. Chop cabbage and carrots. 4. Boil vegetables until tender. 5. Serve fish with vegetables.', healthScore: 5, culturalNote: 'Common lakeside meal especially around Kisumu', veg: true, leg: false, protein: true, lowSugar: true, lowSalt: true, moderateFats: true },
  { id: 20, name: 'Chapati with Vegetable Curry', description: 'Chapati served with vegetable curry', budget: 140, category: 'Lunch', ingredients: ['Wheat flour', 'Mixed vegetables', 'Spices'], recipe: '1. Make chapati dough with flour, water, and oil. 2. Roll out and cook on hot pan. 3. Cook mixed vegetables with curry spices. 4. Serve chapati with curry.', healthScore: 5, culturalNote: 'Often cooked on weekends or special days', veg: true, leg: true, protein: false, lowSugar: true, lowSalt: true, moderateFats: true },
  { id: 21, name: 'Ndengu Stew & Rice', description: 'Green grams served with rice', budget: 180, category: 'Lunch', ingredients: ['Ndengu', 'Rice', 'Onion', 'Tomato'], recipe: '1. Boil ndengu until tender. 2. Cook rice separately. 3. Fry onions and tomatoes. 4. Add boiled ndengu to tomato mixture. 5. Serve with rice.', healthScore: 5, culturalNote: 'Very common nyumba ya kupanga lunch', veg: true, leg: true, protein: false, lowSugar: true, lowSalt: true, moderateFats: true },
  { id: 22, name: 'Tilapia & Ugali', description: 'Grilled tilapia served with ugali', budget: 250, category: 'Dinner', ingredients: ['Tilapia', 'Maize flour'], recipe: '1. Clean and season tilapia. 2. Grill or fry fish. 3. Prepare ugali as usual. 4. Serve together with kachumbari.', healthScore: 5, culturalNote: 'A favourite around Lake Victoria', veg: true, leg: false, protein: true, lowSugar: true, lowSalt: true, moderateFats: true },
  { id: 23, name: 'Ndengu Chapati', description: 'Green grams served with chapati', budget: 150, category: 'Lunch', ingredients: ['Ndengu', 'Wheat flour'], recipe: '1. Boil ndengu with onions and tomatoes. 2. Prepare chapati dough. 3. Roll and cook chapati. 4. Serve ndengu with chapati.', healthScore: 5, culturalNote: 'Popular among students and bachelors', veg: true, leg: true, protein: false, lowSugar: true, lowSalt: true, moderateFats: true },
  { id: 24, name: 'Vegetable Stew with Rice', description: 'Mixed vegetable stew with rice', budget: 140, category: 'Dinner', ingredients: ['Rice', 'Carrots', 'Spinach', 'Tomato'], recipe: '1. Cook rice. 2. Dice carrots and chop spinach. 3. Fry vegetables with tomatoes. 4. Simmer until tender. 5. Serve with rice.', healthScore: 5, culturalNote: 'Healthy everyday nyumba ya kupanga meal', veg: true, leg: false, protein: false, lowSugar: true, lowSalt: true, moderateFats: true },
  { id: 25, name: 'Omena Stew & Ugali', description: 'Omena stew served with ugali', budget: 220, category: 'Dinner', ingredients: ['Omena', 'Tomato', 'Onion', 'Maize flour'], recipe: '1. Clean omena thoroughly. 2. Fry with onions and tomatoes. 3. Add water and simmer. 4. Prepare ugali. 5. Serve together.', healthScore: 5, culturalNote: 'Cheap but powerful protein in western Kenya', veg: true, leg: false, protein: true, lowSugar: true, lowSalt: true, moderateFats: true },
  { id: 26, name: 'Chicken & Vegetable Curry', description: 'Chicken cooked with vegetables', budget: 220, category: 'Dinner', ingredients: ['Chicken', 'Carrots', 'Peas', 'Spices'], recipe: '1. Cut chicken into pieces. 2. Fry chicken until browned. 3. Add vegetables and curry spices. 4. Simmer until cooked. 5. Serve with rice or chapati.', healthScore: 5, culturalNote: 'Home-style curry often cooked on Sundays', veg: true, leg: false, protein: true, lowSugar: true, lowSalt: true, moderateFats: true },
  { id: 27, name: 'Brown Rice & Beans', description: 'Brown rice with beans', budget: 180, category: 'Lunch', ingredients: ['Brown rice', 'Beans'], recipe: '1. Soak beans overnight. 2. Boil beans until tender. 3. Cook brown rice separately. 4. Serve together.', healthScore: 5, culturalNote: 'Chosen by people trying to eat healthier', veg: true, leg: true, protein: false, lowSugar: true, lowSalt: true, moderateFats: true },
  { id: 28, name: 'Ugali & Cabbage Stew', description: 'Ugali served with cabbage stew', budget: 120, category: 'Dinner', ingredients: ['Maize flour', 'Cabbage'], recipe: '1. Prepare ugali. 2. Chop cabbage. 3. Fry with onions and tomatoes. 4. Serve with ugali.', healthScore: 4, culturalNote: 'Budget-friendly end-month meal', veg: true, leg: false, protein: false, lowSugar: true, lowSalt: true, moderateFats: true },
  { id: 29, name: 'Matoke & Beef Stew', description: 'Matoke served with beef stew', budget: 220, category: 'Dinner', ingredients: ['Matoke', 'Beef', 'Spices'], recipe: '1. Peel and boil matoke. 2. Cook beef with onions and tomatoes. 3. Add spices and simmer. 4. Serve together.', healthScore: 5, culturalNote: 'Common in western Kenya homes', veg: true, leg: false, protein: true, lowSugar: true, lowSalt: true, moderateFats: true },
  { id: 30, name: 'Matoke & Chicken Stew', description: 'Matoke served with chicken stew', budget: 220, category: 'Dinner', ingredients: ['Matoke', 'Chicken'], recipe: '1. Peel and boil matoke. 2. Cook chicken with onions and tomatoes. 3. Serve together.', healthScore: 5, culturalNote: 'Seen as a healthier matoke option', veg: true, leg: false, protein: true, lowSugar: true, lowSalt: true, moderateFats: true },
  { id: 31, name: 'Rice & Mixed Legume Stew', description: 'Rice served with mixed legumes', budget: 180, category: 'Lunch', ingredients: ['Rice', 'Lentils', 'Beans'], recipe: '1. Cook rice. 2. Boil mixed legumes. 3. Add tomatoes and onions. 4. Serve with rice.', healthScore: 5, culturalNote: 'Affordable plant protein meal', veg: true, leg: true, protein: false, lowSugar: true, lowSalt: true, moderateFats: true },
  { id: 32, name: 'Chicken Stew & Ugali', description: 'Chicken stew with ugali', budget: 200, category: 'Dinner', ingredients: ['Chicken', 'Maize flour'], recipe: '1. Cook chicken with tomatoes and onions. 2. Prepare ugali. 3. Serve together.', healthScore: 5, culturalNote: 'Classic Sunday lunch meal', veg: true, leg: false, protein: true, lowSugar: true, lowSalt: true, moderateFats: true },
  { id: 33, name: 'Ugali & Beef Stew', description: 'Ugali served with beef stew', budget: 200, category: 'Dinner', ingredients: ['Maize flour', 'Beef'], recipe: '1. Cook beef stew with tomatoes. 2. Prepare ugali. 3. Serve together.', healthScore: 5, culturalNote: 'Very common across Kenyan households', veg: true, leg: false, protein: true, lowSugar: true, lowSalt: true, moderateFats: true },
  { id: 34, name: 'Rice & Cabbage Stew', description: 'Rice served with cabbage stew', budget: 130, category: 'Lunch', ingredients: ['Rice', 'Cabbage'], recipe: '1. Cook rice. 2. Prepare cabbage stew. 3. Serve together.', healthScore: 4, culturalNote: 'Simple healthy meal when money is tight', veg: true, leg: false, protein: false, lowSugar: true, lowSalt: true, moderateFats: true },
  { id: 35, name: 'Ugali & Spinach Stew', description: 'Ugali served with spinach', budget: 120, category: 'Dinner', ingredients: ['Maize flour', 'Spinach'], recipe: '1. Prepare ugali. 2. Cook spinach with onions. 3. Serve together.', healthScore: 5, culturalNote: 'Common when sukuma is replaced with spinach', veg: true, leg: false, protein: false, lowSugar: true, lowSalt: true, moderateFats: true },
  { id: 36, name: 'Pumpkin Leaves (Seveve) & Ugali', description: 'Ugali with pumpkin leaves', budget: 120, category: 'Dinner', ingredients: ['Maize flour', 'Pumpkin leaves'], recipe: '1. Prepare ugali. 2. Cook pumpkin leaves with onions and tomatoes. 3. Serve together.', healthScore: 5, culturalNote: 'A delicacy in western Kenya homes', veg: true, leg: false, protein: false, lowSugar: true, lowSalt: true, moderateFats: true },
  { id: 37, name: 'Ugali & Cowpea Leaves', description: 'Ugali with cowpea leaves', budget: 120, category: 'Dinner', ingredients: ['Maize flour', 'Cowpea leaves'], recipe: '1. Prepare ugali. 2. Cook cowpea leaves. 3. Serve together.', healthScore: 5, culturalNote: 'Often cooked during rainy seasons', veg: true, leg: false, protein: false, lowSugar: true, lowSalt: true, moderateFats: true },
  { id: 38, name: 'Rice & Fish Stew', description: 'Rice served with fish stew', budget: 220, category: 'Dinner', ingredients: ['Rice', 'Fish', 'Tomato'], recipe: '1. Cook rice. 2. Prepare fish stew. 3. Serve together.', healthScore: 5, culturalNote: 'Common in coastal and lakeside towns', veg: true, leg: false, protein: true, lowSugar: true, lowSalt: true, moderateFats: true },
  { id: 39, name: 'Mukimo', description: 'Mashed potatoes with maize and greens', budget: 150, category: 'Dinner', ingredients: ['Potatoes', 'Maize', 'Greens'], recipe: '1. Boil potatoes, maize, and greens. 2. Mash together. 3. Serve hot.', healthScore: 5, culturalNote: 'Traditional food from central Kenya', veg: true, leg: false, protein: false, lowSugar: true, lowSalt: true, moderateFats: true },
  { id: 40, name: 'Ugali & Goat Stew', description: 'Ugali served with goat meat stew', budget: 250, category: 'Dinner', ingredients: ['Maize flour', 'Goat meat'], recipe: '1. Cook goat meat until tender. 2. Prepare ugali. 3. Serve together.', healthScore: 5, culturalNote: 'Mostly cooked for guests or ceremonies', veg: true, leg: false, protein: true, lowSugar: true, lowSalt: true, moderateFats: true },
  { id: 41, name: 'Rice & Chicken Stew', description: 'Rice served with chicken stew', budget: 200, category: 'Dinner', ingredients: ['Rice', 'Chicken'], recipe: '1. Cook rice. 2. Prepare chicken stew. 3. Serve together.', healthScore: 5, culturalNote: 'Family meal often cooked on special days', veg: true, leg: false, protein: true, lowSugar: true, lowSalt: true, moderateFats: true },
  { id: 42, name: 'Ugali & Vegetable Curry', description: 'Ugali with mixed vegetable curry', budget: 130, category: 'Dinner', ingredients: ['Maize flour', 'Vegetables'], recipe: '1. Prepare ugali. 2. Cook mixed vegetables with curry spices. 3. Serve together.', healthScore: 5, culturalNote: 'Vegetarian option gaining popularity', veg: true, leg: false, protein: false, lowSugar: true, lowSalt: true, moderateFats: true },
  { id: 43, name: 'Rice & Beef Stew', description: 'Rice served with beef stew', budget: 200, category: 'Dinner', ingredients: ['Rice', 'Beef'], recipe: '1. Cook rice. 2. Prepare beef stew. 3. Serve together.', healthScore: 5, culturalNote: 'Common lunch in town hotels', veg: true, leg: false, protein: true, lowSugar: true, lowSalt: true, moderateFats: true },
  { id: 44, name: 'Ugali & Liver Stew', description: 'Ugali with liver stew', budget: 180, category: 'Dinner', ingredients: ['Maize flour', 'Liver'], recipe: '1. Prepare ugali. 2. Cook liver stew with onions and tomatoes. 3. Serve together.', healthScore: 5, culturalNote: 'Known for boosting iron levels', veg: true, leg: false, protein: true, lowSugar: true, lowSalt: true, moderateFats: true },
  { id: 45, name: 'Rice & Liver Stew', description: 'Rice served with liver stew', budget: 180, category: 'Dinner', ingredients: ['Rice', 'Liver'], recipe: '1. Cook rice. 2. Prepare liver stew. 3. Serve together.', healthScore: 5, culturalNote: 'Nutritious and filling meal', veg: true, leg: false, protein: true, lowSugar: true, lowSalt: true, moderateFats: true },
  { id: 46, name: 'Rice & Beans', description: 'Rice served with beans', budget: 150, category: 'Lunch', ingredients: ['Rice', 'Beans'], recipe: '1. Cook rice and beans separately. 2. Serve together.', healthScore: 5, culturalNote: 'End-month lifesaver meal', veg: true, leg: true, protein: false, lowSugar: true, lowSalt: true, moderateFats: true },
  { id: 47, name: 'Matumbo Stew & Ugali', description: 'Tripe stew served with ugali', budget: 180, category: 'Dinner', ingredients: ['Matumbo', 'Onion', 'Tomato', 'Maize flour'], recipe: '1. Clean matumbo thoroughly. 2. Boil until tender. 3. Fry with onions and tomatoes. 4. Prepare ugali. 5. Serve together.', healthScore: 4, culturalNote: 'Popular in local joints and markets', veg: true, leg: false, protein: true, lowSugar: true, lowSalt: true, moderateFats: true },
  { id: 48, name: 'Matumbo Stew & Rice', description: 'Tripe stew served with rice', budget: 180, category: 'Dinner', ingredients: ['Matumbo', 'Rice'], recipe: '1. Clean matumbo thoroughly. 2. Boil until tender. 3. Fry with onions and tomatoes. 4. Cook rice. 5. Serve together.', healthScore: 4, culturalNote: 'Common street food lunch option', veg: true, leg: false, protein: true, lowSugar: true, lowSalt: true, moderateFats: true },
  { id: 49, name: 'Rice & Minced Meat Stew', description: 'Rice with minced meat stew', budget: 180, category: 'Dinner', ingredients: ['Rice', 'Minced beef'], recipe: '1. Cook rice. 2. Prepare minced meat stew. 3. Serve together.', healthScore: 5, culturalNote: 'Easy to cook family meal', veg: true, leg: false, protein: true, lowSugar: true, lowSalt: true, moderateFats: true },
  { id: 50, name: 'Ugali & Minced Meat Stew', description: 'Ugali with minced meat stew', budget: 180, category: 'Dinner', ingredients: ['Maize flour', 'Minced beef'], recipe: '1. Prepare ugali. 2. Cook minced meat stew. 3. Serve together.', healthScore: 5, culturalNote: 'Common quick supper meal', veg: true, leg: false, protein: true, lowSugar: true, lowSalt: true, moderateFats: true },
  { id: 51, name: 'Spaghetti & Minced Meat Stew', description: 'Spaghetti served with minced meat', budget: 200, category: 'Dinner', ingredients: ['Spaghetti', 'Minced beef'], recipe: '1. Cook spaghetti according to package instructions. 2. Prepare minced meat stew. 3. Serve together.', healthScore: 3, culturalNote: 'Urban fusion dish especially for kids', veg: false, leg: false, protein: true, lowSugar: false, lowSalt: true, moderateFats: true },
  { id: 52, name: 'Ugali & Peas Stew', description: 'Ugali served with peas stew', budget: 140, category: 'Dinner', ingredients: ['Maize flour', 'Peas'], recipe: '1. Prepare ugali. 2. Cook peas stew with onions and tomatoes. 3. Serve together.', healthScore: 5, culturalNote: 'Plant protein option in many homes', veg: true, leg: true, protein: false, lowSugar: true, lowSalt: true, moderateFats: true },
  { id: 53, name: 'Grilled Chicken & Rice', description: 'Grilled chicken served with rice', budget: 220, category: 'Dinner', ingredients: ['Chicken', 'Rice'], recipe: '1. Season and grill chicken. 2. Cook rice. 3. Serve together.', healthScore: 5, culturalNote: 'Balanced protein meal from eateries', veg: true, leg: false, protein: true, lowSugar: true, lowSalt: true, moderateFats: true },
  { id: 54, name: 'Chapati & Beans Stew', description: 'Chapati served with beans stew', budget: 150, category: 'Lunch', ingredients: ['Wheat flour', 'Beans'], recipe: '1. Prepare chapati. 2. Cook beans stew. 3. Serve together.', healthScore: 5, culturalNote: 'Student-friendly and affordable meal', veg: true, leg: true, protein: false, lowSugar: true, lowSalt: true, moderateFats: true },
  { id: 55, name: 'Rice & Kamande', description: 'Rice served with pigeon peas', budget: 160, category: 'Dinner', ingredients: ['Rice', 'Pigeon peas'], recipe: '1. Cook rice. 2. Boil pigeon peas with onions and tomatoes. 3. Serve together.', healthScore: 5, culturalNote: 'Common in eastern and dry regions', veg: true, leg: true, protein: false, lowSugar: true, lowSalt: true, moderateFats: true },
  { id: 56, name: 'Chapati & Kamande', description: 'Chapati served with pigeon peas', budget: 160, category: 'Dinner', ingredients: ['Wheat flour', 'Pigeon peas'], recipe: '1. Prepare chapati. 2. Cook pigeon peas stew. 3. Serve together.', healthScore: 5, culturalNote: 'Traditional plant protein meal', veg: true, leg: true, protein: false, lowSugar: true, lowSalt: true, moderateFats: true },
  { id: 57, name: 'Chapati & Beef Stew', description: 'Chapati served with beef stew', budget: 200, category: 'Dinner', ingredients: ['Wheat flour', 'Beef'], recipe: '1. Prepare chapati. 2. Cook beef stew with onions and tomatoes. 3. Serve together.', healthScore: 5, culturalNote: 'Popular town and home meal', veg: true, leg: false, protein: true, lowSugar: true, lowSalt: true, moderateFats: true },
  { id: 58, name: 'Chapati & Beans', description: 'Chapati served with beans stew', budget: 150, category: 'Lunch', ingredients: ['Wheat flour', 'Beans', 'Onion', 'Tomato'], recipe: '1. Prepare chapati dough with flour, water, and oil. 2. Roll and cook on hot pan. 3. Boil beans with onions and tomatoes. 4. Serve together.', healthScore: 5, culturalNote: 'One of the most common affordable meals in Kenyan households and hostels', veg: true, leg: true, protein: false, lowSugar: true, lowSalt: true, moderateFats: true },
  { id: 59, name: 'Rice & Pigeon Peas', description: 'Rice served with pigeon peas stew', budget: 160, category: 'Lunch', ingredients: ['Rice', 'Pigeon peas', 'Onion', 'Tomato'], recipe: '1. Cook rice. 2. Boil pigeon peas. 3. Fry with onions and tomatoes. 4. Serve together.', healthScore: 5, culturalNote: 'Very common in eastern Kenya and dry regions', veg: true, leg: true, protein: false, lowSugar: true, lowSalt: true, moderateFats: true },
  { id: 60, name: 'Chapati & Pigeon Peas', description: 'Chapati served with pigeon peas stew', budget: 160, category: 'Lunch', ingredients: ['Wheat flour', 'Pigeon peas', 'Onion', 'Tomato'], recipe: '1. Prepare chapati. 2. Cook pigeon peas with onions and tomatoes. 3. Serve together.', healthScore: 5, culturalNote: 'Traditional plant-protein meal often cooked at home', veg: true, leg: true, protein: false, lowSugar: true, lowSalt: true, moderateFats: true },
  { id: 61, name: 'Chapati & Beef', description: 'Chapati served with beef stew', budget: 200, category: 'Lunch', ingredients: ['Wheat flour', 'Beef', 'Onion', 'Tomato'], recipe: '1. Prepare chapati. 2. Cook beef stew with onions and tomatoes. 3. Serve together.', healthScore: 5, culturalNote: 'A popular town and home meal especially on weekends', veg: true, leg: false, protein: true, lowSugar: true, lowSalt: true, moderateFats: true }
];
  
  const [allMeals, setAllMeals] = useState(mealsData);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [budget, setBudget] = useState(5000);
  const [maxMealBudget, setMaxMealBudget] = useState(250);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewingRecipe, setViewingRecipe] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mealHistory, setMealHistory] = useState([]);
  const [showRepeatNotification, setShowRepeatNotification] = useState(false);
  const [suggestedAlternatives, setSuggestedAlternatives] = useState([]);
  
  const filteredMeals = allMeals.filter(meal => {
  const withinBudget = meal.budget <= maxMealBudget;
  const matchesCategory = selectedCategory === 'All' || meal.category === selectedCategory;
  
  // Search filter
  const matchesSearch = searchQuery === '' || 
    meal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    meal.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    meal.ingredients.some(ing => ing.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (meal.culturalNote && meal.culturalNote.toLowerCase().includes(searchQuery.toLowerCase()));
  
  return withinBudget && matchesCategory && matchesSearch;
});
  
  const [friends, setFriends] = useState(() => {
    const stored = localStorage.getItem('friends');
    return stored ? JSON.parse(stored) : [];
  });
  
  const [friendRequests, setFriendRequests] = useState(() => {
    const stored = localStorage.getItem('friendRequests');
    return stored ? JSON.parse(stored) : [];
  });
  
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [searchUsername, setSearchUsername] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedFriendsForMeal, setSelectedFriendsForMeal] = useState([]);
   React.useEffect(() => {
    localStorage.setItem('friendRequests', JSON.stringify(friendRequests));
  }, [friendRequests]);
  React.useEffect(() => {
    localStorage.setItem('friends', JSON.stringify(friends));
  }, [friends]);

  // Load meal history on component mount
React.useEffect(() => {
  const loadMealHistory = async () => {
    if (user?.email) {
      try {
        const result = await window.storage.get(`meal_history_${user.email}`);
        if (result) {
          setMealHistory(JSON.parse(result.value));
        }
      } catch (error) {
        console.log('No meal history found');
        setMealHistory([]);
      }
    }
  };
  loadMealHistory();
}, [user]);

// Save meal history when it changes
React.useEffect(() => {
  const saveMealHistory = async () => {
    if (user?.email && mealHistory.length > 0) {
      try {
        await window.storage.set(`meal_history_${user.email}`, JSON.stringify(mealHistory));
      } catch (error) {
        console.error('Error saving meal history:', error);
      }
    }
  };
  saveMealHistory();
}, [mealHistory, user]);

const handleForgotPassword = async (email) => {
  if (!email) {
    alert("Please enter your email address first.");
    return;
  }

  try {
    // Get the current URL origin (works for localhost or deployed site)
    const redirectTo = `${window.location.origin}/#type=recovery`;
    
    const url = `${supabaseUrl}/auth/v1/recover`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'apikey': supabaseAnonKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        email,
        options: {
          redirectTo: redirectTo // Add this to specify where to redirect
        }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.msg || error.message);
    }

    alert("Check your email! A password reset link has been sent.");
  } catch (err) {
    alert("Error: " + err.message);
  }
};

   const handleUpdatePassword = async (newPassword) => {
  if (!newPassword || newPassword.length < 6) {
    alert("Password must be at least 6 characters");
    return;
  }

  try {
    // Extract the access token from the URL hash
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.substring(1));
    const accessToken = params.get('access_token');
    
    if (!accessToken) {
      alert("Invalid or expired reset link. Please request a new one.");
      return;
    }

    const url = `${supabaseUrl}/auth/v1/user`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${accessToken}`, // Use the token from URL
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ password: newPassword })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update password");
    }

    alert("Password updated successfully! Please login with your new password.");
    
    // Clear the hash and redirect to login
    window.location.hash = '';
    setCurrentScreen('login');
    
  } catch (err) {
    alert("Error: " + err.message);
  }
};

   const ResetPasswordScreen = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // NEW
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // NEW

  const handleSubmit = () => {
    if (!newPassword || newPassword.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    
    handleUpdatePassword(newPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-pink-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="text-5xl mb-4">🔐</div>
          <h2 className="text-2xl font-bold text-gray-800">Set New Password</h2>
          <p className="text-sm text-gray-600 mt-2">Choose a strong password for your account</p>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            New Password
          </label>
          {/* NEW: Password with visibility toggle */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password (min 6 characters)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <span className="text-xl">👁️</span> : <span className="text-xl">🙈</span>}
            </button>
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Confirm Password
          </label>
          {/* NEW: Confirm password with visibility toggle */}
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? <span className="text-xl">👁️</span> : <span className="text-xl">🙈</span>}
            </button>
          </div>
        </div>
        
        <button
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
        >
          Update Password
        </button>
        
        <button
          onClick={() => setCurrentScreen('login')}
          className="w-full mt-3 text-gray-600 hover:text-gray-800 text-sm font-medium"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

const handleLogin = async (email, password) => {
  setLoading(true);
  try {
    const supabaseUrl = 'https://ltrdgyraevtxwroukxkt.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0cmRneXJhZXZ0eHdyb3VreGt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyODA5MDEsImV4cCI6MjA4MTg1NjkwMX0.hERWWr2FjKX9zJJVU3j8JjE2y1ZKJeQCsHyrm1yueEI';
    const client = window.supabase.createClient(supabaseUrl, supabaseKey);

    const { data, error } = await client.auth.signInWithPassword({
      email: email.trim(),
      password: password,
    });

    if (error) throw error;

    if (data?.user) {
      // 1. Point to 'users' instead of 'profiles'
const { data: profile, error: profileError } = await client
  .from('users') 
  .select('*')
  .eq('id', data.user.id)
  .single();

if (profileError) console.error("Profile error:", profileError);

const userData = {
  id: data.user.id,
  email: data.user.email,
  // Map the correct columns from your SQL table
  username: profile?.username || data.user.email, 
  name: profile?.full_name || 'Dishi Member'
};

      // 1. Save to Storage FIRST so it's available on refresh
      localStorage.setItem('dishiUser', JSON.stringify(userData));
      
      // 2. Update States
      setUser(userData);
      setIsLoggedIn(true);
      
      // 3. THIS FIXES THE BLANK MIDDLE: Force the view to 'home' immediately
      setCurrentScreen('suggestions'); // Use 'suggestions' or whatever you want the home screen to be

      // 4. Trigger data fetch immediately using the data we just got
      // (Bypasses the delay of waiting for the 'user' state to refresh)
      await fetchFriendRequests(data.user.id);
      await fetchFriends(data.user.id);
    }
  } catch (error) {
    console.error("Login detail error:", error);
    alert("Login failed: " + error.message);
  } finally {
    setLoading(false);
  }
};

const renderContent = () => {
  // If not logged in, the main logic should handle the Login/Signup screen
  if (!isLoggedIn) return null;

  switch (currentScreen) {
    case 'home':
      return (
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Welcome back, {user?.name}!</h2>
          {/* Add your Dashboard/Main content here */}
          <div className="bg-orange-50 p-6 rounded-2xl border-2 border-orange-100">
            <p className="text-orange-800">Select a meal to get started with your streak!</p>
          </div>
        </div>
      );
    case 'planner':
      return <div className="p-4"><h3>Meal Planner Screen</h3></div>;
    case 'friends':
      // This is where your Friend Request UI from earlier goes
      return <FriendsScreen />; 
    case 'profile':
      return <div className="p-4"><h3>Your Profile Settings</h3></div>;
    default:
      return <div className="p-4"><h3>Home Screen</h3></div>;
  }
};

  const handleRegister = async (name, email, password, username, setIsRegistering) => {
  // 1. Basic Validation
  if (!name || !email || !password || !username) {
    alert("Please fill in all fields");
    return;
  }

  if (password.length < 6) {
    alert("Password must be at least 6 characters");
    return;
  }

  try {
    // 2. Create the account in Supabase Authentication
    const authResponse = await fetch(`${supabaseUrl}/auth/v1/signup`, {
      method: 'POST',
      headers: {
        'apikey': supabaseAnonKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        password: password,
        // This 'data' object stores info directly in the Auth user metadata
        data: {
          full_name: name,
          user_name: username
        }
      })
    });

    const authData = await authResponse.json();

    if (!authResponse.ok) {
      throw new Error(authData.msg || authData.message || "Registration failed");
    }

    // 3. Store the profile in your public 'users' table 
    // This makes the user "visible" in your regular database editor
    if (authData.id || authData.user?.id) {
      const userId = authData.id || authData.user.id;
      
      await supabaseFetch('users', '', 'POST', {
        id: userId,
        email: email,
        username: username,
        full_name: name,
        created_at: new Date().toISOString(),
        streak: 0
      });
    }

    alert("Registration successful! You can now log in.");
    
    // 4. Switch the UI back to the Login screen
    if (setIsRegistering) {
      setIsRegistering(false);
    }

  } catch (error) {
    console.error("Registration error:", error);
    alert(error.message);
  }
};

  const trackMeal = (meal) => {
  const existingMeal = mealHistory.find(m => m.id === meal.id);
  
  if (existingMeal) {
    // Meal has been taken before
    setShowRepeatNotification(true);
    
    // Find similar alternatives
    const alternatives = findSimilarMeals(meal);
    setSuggestedAlternatives(alternatives);
    
    // Update meal count
    setMealHistory(mealHistory.map(m => 
      m.id === meal.id 
        ? { ...m, count: m.count + 1, lastTaken: new Date().toISOString() }
        : m
    ));
    
    trackActivity('repeat_meal', {
      meal_name: meal.name,
      meal_id: meal.id,
      times_taken: existingMeal.count + 1,
      timestamp: new Date().toISOString()
    });
  } else {
    // First time taking this meal
    setMealHistory([...mealHistory, {
      id: meal.id,
      name: meal.name,
      count: 1,
      lastTaken: new Date().toISOString()
    }]);
    
    trackActivity('new_meal', {
      meal_name: meal.name,
      meal_id: meal.id,
      timestamp: new Date().toISOString()
    });
  }
};

const findSimilarMeals = (meal) => {
  // Find meals that are similar but not the same
  const similar = allMeals.filter(m => {
    if (m.id === meal.id) return false;
    
    // Calculate similarity score
    let score = 0;
    
    // Same category
    if (m.category === meal.category) score += 3;
    
    // Similar budget (within 30%)
    const budgetDiff = Math.abs(m.budget - meal.budget) / meal.budget;
    if (budgetDiff <= 0.3) score += 2;
    
    // Similar health score
    if (Math.abs(m.healthScore - meal.healthScore) <= 1) score += 1;
    
    // Shared ingredients
    const sharedIngredients = m.ingredients.filter(ing => 
      meal.ingredients.some(mealIng => 
        ing.toLowerCase().includes(mealIng.toLowerCase()) || 
        mealIng.toLowerCase().includes(ing.toLowerCase())
      )
    ).length;
    score += sharedIngredients;
    
    // Similar health attributes
    if (m.veg === meal.veg) score += 0.5;
    if (m.leg === meal.leg) score += 0.5;
    if (m.protein === meal.protein) score += 0.5;
    if (m.lowSugar === meal.lowSugar) score += 0.5;
    if (m.lowSalt === meal.lowSalt) score += 0.5;
    
    return score >= 3; // Threshold for similarity
  });
  
  // Sort by similarity and return top 3
  return similar.slice(0, 3);
};

const handleSignUp = async (email, password, username, fullName) => {
  setLoading(true);
  try {
    const supabaseUrl = 'https://YOUR_PROJECT_URL.supabase.co';
    const supabaseKey = 'YOUR_ANON_KEY';
    const client = window.supabase.createClient(supabaseUrl, supabaseKey);

    const { data: authData, error: authError } = await client.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;

    if (authData.user) {
      await client.from('profiles').insert([
        {
          id: authData.user.id,
          username: username.toLowerCase().trim(),
          full_name: fullName,
          created_at: new Date().toISOString(),
        },
      ]);

      const newUser = {
        id: authData.user.id,
        email: email,
        username: username,
        name: fullName
      };
      
      setUser(newUser);
      setIsLoggedIn(true);
      localStorage.setItem('dishiUser', JSON.stringify(newUser));
    }
  } catch (error) {
    alert(error.message);
  } finally {
    setLoading(false);
  }
};

const searchUsers = async () => {
  if (!searchUsername.trim()) return;

  try {
    // We call the database directly via URL
    const query = `?username=ilike.*${searchUsername}*&select=id,username,full_name`;
    const data = await supabaseFetch('users', query);

    if (data.length === 0) {
      alert("No users found.");
    }
    
    setSearchResults(data);
  } catch (err) {
    console.error(err);
    alert("Database Error: " + err.message);
  }
};

const removeFriend = async (friendId) => {
  if (!window.confirm("Are you sure you want to remove this friend?")) return;

  try {
    // We delete the friendship where you are either the sender or the receiver
    const { error } = await supabase
      .from('friendships')
      .delete()
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${friendId}),and(sender_id.eq.${friendId},receiver_id.eq.${user.id})`);

    if (error) throw error;

    // Update local state so the UI refreshes immediately
    setFriends(friends.filter(f => f.id !== friendId));
    alert("Friend removed");

  } catch (error) {
    console.error("Error removing friend:", error.message);
    alert("Could not remove friend. Please try again.");
  }
};

const sendFriendRequest = async (targetUser) => {
  if (targetUser.id === user.id) {
    alert("You cannot add yourself as a friend.");
    return;
  }

  try {
    // 1. Check for existing requests
    const checkQuery = `?or=(and(sender_id.eq.${user.id},receiver_id.eq.${targetUser.id}),and(sender_id.eq.${targetUser.id},receiver_id.eq.${user.id}))&select=id,status`;
    const existingRequest = await supabaseFetch('friend_requests', checkQuery);

    if (existingRequest && existingRequest.length > 0) {
      alert(`A friend request is already ${existingRequest[0].status}.`);
      return;
    }

    // 2. Insert ONLY into friend_requests (NOT friendships yet!)
    const payload = {
      sender_id: user.id,
      receiver_id: targetUser.id,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    console.log("Sending friend request:", payload);
    const result = await supabaseFetch('friend_requests', '', 'POST', payload);

    if (result) {
      // 3. Track activity
      trackActivity('send_friend_request', {
        to_user_id: targetUser.id,
        to_username: targetUser.username,
        timestamp: new Date().toISOString()
      });

      // 4. Update UI
      alert(`Friend request sent to @${targetUser.username}!`);
      setSearchUsername('');
      setSearchResults([]);
      
      console.log("✅ Friend request sent successfully!");
    } else {
      alert('Failed to send friend request');
    }
  } catch (error) {
    console.error('Error sending friend request:', error);
    alert('Failed to send request: ' + error.message);
  }
};

 const handleFriendRequest = async (request, accept) => {
  try {
    if (accept) {
      // 1. Update friend_requests table to 'accepted'
      const updatePayload = { status: 'accepted' };
      const updateResult = await supabaseFetch('friend_requests', `?id=eq.${request.id}`, 'PATCH', updatePayload);
      
      console.log("Friend request updated:", updateResult);
      
      // 2. Create friendship record (this is when we add to friendships table)
      const friendshipPayload = {
        sender_id: request.sender_id,
        receiver_id: request.receiver_id,
        status: 'accepted',
        created_at: new Date().toISOString()
      };
      
      const friendshipResult = await supabaseFetch('friendships', '', 'POST', friendshipPayload);
      console.log("Friendship created:", friendshipResult);
      
      // 3. Track activity
      trackActivity('accept_friend_request', {
        from_user_id: request.sender_id,
        timestamp: new Date().toISOString()
      });
      
    } else {
      // Decline: Just delete the friend request
      await supabaseFetch('friend_requests', `?id=eq.${request.id}`, 'DELETE');
      
      trackActivity('decline_friend_request', {
        from_user_id: request.sender_id,
        timestamp: new Date().toISOString()
      });
    }

    // 4. Refresh the friends list and requests
    await fetchFriends(user.id);
    await fetchFriendRequests(user.id);
    
    alert(accept ? "Friend added! 🎉" : "Request declined");
    
  } catch (error) {
    console.error("Friend request error:", error);
    alert("Update failed: " + error.message);
  }
};

useEffect(() => {
  console.log("👀 useEffect triggered, user:", user?.id);
  
  if (user?.id) {
    console.log("🚀 Fetching friends and requests...");
    fetchFriends(user.id);
    fetchFriendRequests(user.id);
  } else {
    console.log("⚠️ No user, clearing data");
    setFriends([]);
    setFriendRequests([]);
  }
}, [user]);

const fetchFriends = async (userId) => {
  if (!userId) {
    userId = user?.id;
  }
  
  if (!userId) return;

  try {
    // Get all accepted friendships
    const query = `?status=eq.accepted&or=(sender_id.eq.${userId},receiver_id.eq.${userId})&select=id,sender_id,receiver_id`;
    const data = await supabaseFetch('friendships', query);

    if (!data || data.length === 0) {
      setFriends([]);
      return;
    }

    // Get friend profiles
    const formatted = await Promise.all(
      data.map(async (f) => {
        const friendId = f.sender_id === userId ? f.receiver_id : f.sender_id;
        const friendQuery = `?id=eq.${friendId}&select=id,username,full_name`;
        const friendData = await supabaseFetch('users', friendQuery);
        
        if (friendData && friendData[0]) {
          return {
            id: friendData[0].id,
            name: friendData[0].full_name || friendData[0].username,
            username: friendData[0].username,
            avatar: '🥗',
            streak: 0
          };
        }
        return null;
      })
    );

    setFriends(formatted.filter(f => f !== null));
  } catch (err) {
    console.error("Fetch Friends Error:", err);
    setFriends([]);
  }
};

const fetchFriendRequests = async (userId) => {
  console.log("🔍 fetchFriendRequests called with userId:", userId);
  
  if (!userId) {
    console.log("❌ No userId provided");
    return;
  }

  try {
    // Build the URL manually for debugging
    const query = `?receiver_id=eq.${userId}&status=eq.pending&select=*`;
    const url = `${supabaseUrl}/rest/v1/friend_requests${query}`;
    
    console.log("📡 Fetching from:", url);
    
    const response = await fetch(url, {
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    console.log("📦 Raw friend_requests data:", data);

    if (!data || data.length === 0) {
      console.log("⚠️ No pending requests found");
      setFriendRequests([]);
      return;
    }

    // Get sender details for each request
    const formatted = await Promise.all(
      data.map(async (req) => {
        console.log("👤 Fetching sender details for:", req.sender_id);
        
        const senderQuery = `?id=eq.${req.sender_id}&select=id,username,full_name`;
        const senderData = await supabaseFetch('users', senderQuery);
        
        console.log("👤 Sender data:", senderData);
        
        return {
          ...req,
          sender_name: senderData?.[0]?.full_name || 'Unknown User',
          sender_username: senderData?.[0]?.username || 'unknown'
        };
      })
    );

    console.log("✅ Formatted friend requests:", formatted);
    setFriendRequests(formatted);
    
  } catch (error) {
    console.error('❌ Error fetching requests:', error);
    setFriendRequests([]);
  }
};

  const selectMeal = (meal) => {
  trackMeal(meal);
  setSelectedMeal(meal);
};

  const submitFeedback = async (text) => {
  if (!text.trim()) return;

  const payload = {
    feedback_text: text,
    user_email: user?.email || 'anonymous@example.com',
    user_id: user?.id || null,
    created_at: new Date().toISOString()
  };

  try {
    const result = await supabaseFetch('feedback', '', 'POST', payload);
    
    if (result) {
      alert("Thank you for your feedback!");
      trackActivity('submit_feedback', { feedback_length: text.length });
    } else {
      alert("Failed to send feedback. Please try again.");
    }
  } catch (error) {
    console.error("Feedback error:", error);
    alert("Error sending feedback: " + error.message);
  }
};
const sendMealToFriends = async () => {
  if (!selectedMeal || selectedFriendsForMeal.length === 0) {
    alert("Please select a meal and at least one friend");
    return;
  }

  try {
    // Create activity records for each friend
    const mealPromises = selectedFriendsForMeal.map(async (friendId) => {
      const payload = {
        user_id: user.id,
        user_email: user.email,
        sender_id: user.id,
        receiver_id: friendId,
        action_type: 'share_meal',
        action_details: { 
          meal_name: selectedMeal.name, 
          budget: selectedMeal.budget,
          meal_id: selectedMeal.id,
          category: selectedMeal.category
        },
        created_at: new Date().toISOString()
      };
      
      console.log("📤 Sharing meal:", payload);
      return await supabaseFetch('user_activity', '', 'POST', payload);
    });

    const results = await Promise.all(mealPromises);
    console.log("✅ Meals shared:", results);

    alert(`🎉 ${selectedMeal.name} shared with ${selectedFriendsForMeal.length} friend(s)!`);
    
    // Track the activity
    trackActivity('share_meals_bulk', {
      meal_name: selectedMeal.name,
      friends_count: selectedFriendsForMeal.length,
      timestamp: new Date().toISOString()
    });

    // Reset and go back
    setSelectedFriendsForMeal([]);
    setCurrentScreen('suggestions');
    
  } catch (err) {
    console.error("Error sharing meals:", err);
    alert("Failed to share meal. Please try again.");
  }
};

  const trackActivity = async (action, details = {}) => {
  // Don't track if no user
  if (!user?.id || !user?.email) {
    console.log("⚠️ No user logged in, skipping activity track");
    return;
  }
  
  try {
    const payload = {
      user_id: user.id,
      user_email: user.email,
      action_type: action,
      action_details: details,
      created_at: new Date().toISOString()
    };
    
    console.log("📊 Tracking activity for:", user.email, "Action:", action);
    console.log("Payload:", payload);
    
    const result = await supabaseFetch('user_activity', '', 'POST', payload);
    
    if (result) {
      console.log("✅ Activity tracked successfully!");
    } else {
      console.error("❌ Activity tracking returned null");
    }
  } catch (error) {
    console.error("❌ Activity tracking error:", error);
  }
};

  const NavBar = () => (
    <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white p-4 shadow-lg">
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold">🍽️ DishiStudio</h1>
        {isLoggedIn && (
          <div className="flex items-center gap-2">
            <span className="text-sm">{user?.name}</span>
          </div>
        )}
      </div>
    </div>
  );

  const BottomNav = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
      <div className="flex justify-around items-center max-w-6xl mx-auto">
        <button onClick={() => { setCurrentScreen('suggestions'); trackActivity('navigate', { screen: 'suggestions' }); }} className="flex flex-col items-center p-3 hover:bg-gray-50">
          <Home className="w-6 h-6" />
          <span className="text-xs mt-1">Home</span>
        </button>
        <button onClick={() => { setCurrentScreen('budget'); trackActivity('navigate', { screen: 'budget' }); }} className="flex flex-col items-center p-3 hover:bg-gray-50">
          <DollarSign className="w-6 h-6" />
          <span className="text-xs mt-1">Budget</span>
        </button>
        <button onClick={() => { setCurrentScreen('friends'); trackActivity('navigate', { screen: 'friends' }); }} className="flex flex-col items-center p-3 hover:bg-gray-50">
          <Users className="w-6 h-6" />
          <span className="text-xs mt-1">Friends</span>
        </button>
        <button onClick={() => { setCurrentScreen('streaks'); trackActivity('navigate', { screen: 'streaks' }); }} className="flex flex-col items-center p-3 hover:bg-gray-50">
          <Flame className="w-6 h-6" />
          <span className="text-xs mt-1">Streaks</span>
        </button>
        <button onClick={() => { setCurrentScreen('feedback'); trackActivity('navigate', { screen: 'feedback' }); }} className="flex flex-col items-center p-3 hover:bg-gray-50">
          <MessageSquare className="w-6 h-6" />
          <span className="text-xs mt-1">Feedback</span>
        </button>
      </div>
    </div>
  );

  const LoginScreen = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    username: ''
  });
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // NEW: Track visibility

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-pink-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border border-orange-100">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          {isRegistering ? 'Create Account' : 'Welcome Back'}
        </h2>
        
        {isRegistering && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                placeholder="Choose a unique username"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>
          </>
        )}
        
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Password
          </label>
          {/* NEW: Password input with eye icon */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? (
                <span className="text-xl">👁️</span>
              ) : (
                <span className="text-xl">🙈</span>
              )}
            </button>
          </div>
          
          {!isRegistering && (
            <div className="flex justify-end mt-2">
              <button
                type="button"
                onClick={() => handleForgotPassword(formData.email)}
                className="text-xs font-semibold text-orange-600 hover:text-orange-700 transition-colors"
              >
                Forgot Password?
              </button>
            </div>
          )}
        </div>
        
        <button
          onClick={() => isRegistering 
            ? handleRegister(formData.name, formData.email, formData.password, formData.username, setIsRegistering) 
            : handleLogin(formData.email, formData.password)}
          className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all mb-4"
        >
          {isRegistering ? 'Register' : 'Login'}
        </button>
        
        <button
          onClick={() => setIsRegistering(!isRegistering)}
          className="w-full text-gray-600 hover:text-gray-800 text-sm font-medium"
        >
          {isRegistering ? 'Already have an account? Login' : "Don't have an account? Register"}
        </button>
      </div>
    </div>
  );
};

  const RecipeModal = () => {
    if (!viewingRecipe) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-pink-500 text-white p-6 flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold mb-2">{viewingRecipe.name}</h2>
              <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
                {viewingRecipe.category}
              </span>
            </div>
            <button
              onClick={() => setViewingRecipe(null)}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6">
            {viewingRecipe.description && (
              <div className="mb-6">
                <p className="text-gray-700 text-lg">{viewingRecipe.description}</p>
              </div>
            )}

            {viewingRecipe.culturalNote && (
              <div className="mb-6 bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
                <h3 className="text-sm font-bold text-orange-800 mb-1 flex items-center gap-2">
                  <span>🇰🇪</span> Cultural Note
                </h3>
                <p className="text-gray-700 italic">{viewingRecipe.culturalNote}</p>
              </div>
            )}

            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-gray-600 mb-1">Budget</h3>
                  <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-bold text-lg">
                    KSh {viewingRecipe.budget}
                  </span>
                </div>
                <div className="text-right">
                  <h3 className="text-sm font-bold text-gray-600 mb-1">Health Score</h3>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-2xl">
                        {i < viewingRecipe.healthScore ? '⭐' : '☆'}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3">Health Attributes</h3>
              <div className="flex flex-wrap gap-2">
                {viewingRecipe.veg && (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                    ✓ Vegetables
                  </span>
                )}
                {viewingRecipe.leg && (
                  <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-semibold">
                    ✓ Legumes
                  </span>
                )}
                {viewingRecipe.protein && (
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                    ✓ Protein
                  </span>
                )}
                {viewingRecipe.lowSugar && (
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">
                    ✓ Low Sugar
                  </span>
                )}
                {viewingRecipe.lowSalt && (
                  <span className="bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full text-sm font-semibold">
                    ✓ Low Salt
                  </span>
                )}
                {viewingRecipe.moderateFats && (
                  <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-semibold">
                    ✓ Moderate Fats
                  </span>
                )}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3">Ingredients</h3>
              <ul className="space-y-2">
                {viewingRecipe.ingredients.map((ing, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-700">
                    <span className="text-orange-500">•</span>
                    {ing}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-3">Recipe</h3>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                {viewingRecipe.recipe}
              </p>
            </div>

            <button
              onClick={() => {
                selectMeal(viewingRecipe);
                setViewingRecipe(null);
                setCurrentScreen('share');
              }}
              className="w-full mt-6 bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Share This Meal
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 1. AUTHENTICATION SCREENS (Before Login) */}
      {!isLoggedIn && currentScreen === 'home' && (
        <HomeScreen setCurrentScreen={setCurrentScreen} />
      )}
      
      {!isLoggedIn && currentScreen === 'login' && (
        <LoginScreen 
          handleLogin={handleLogin} 
          setCurrentScreen={setCurrentScreen} 
          loading={loading}
        />
      )}
      
      {currentScreen === 'reset-password' && (
        <ResetPasswordScreen setCurrentScreen={setCurrentScreen} />
      )}
      
      {/* 2. LOGGED IN APP STRUCTURE */}
      {isLoggedIn && (
        <>
          <NavBar user={user} />
          
          <main className="flex-1 overflow-y-auto pb-20">
            {/* Logic: If just logged in or on suggestions, show suggestions */}
            {(currentScreen === 'suggestions' || currentScreen === 'login') && (
              <SuggestionsScreen 
                maxMealBudget={maxMealBudget}
                setMaxMealBudget={setMaxMealBudget}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filteredMeals={filteredMeals}
                setViewingRecipe={setViewingRecipe}
                selectMeal={selectMeal}
                setCurrentScreen={setCurrentScreen}
                trackActivity={trackActivity}
              />
            )}
            
            {currentScreen === 'budget' && (
  <BudgetScreen 
    budget={budget} 
    setBudget={setBudget} 
    trackActivity={trackActivity} 
  />
)}
            
            {currentScreen === 'friends' && (
              <FriendsScreen 
                user={user}
                friends={friends}
                friendRequests={friendRequests}
                handleFriendRequest={handleFriendRequest}
                sendFriendRequest={sendFriendRequest}
                removeFriend={removeFriend}
                searchUsers={searchUsers}
                searchUsername={searchUsername}
                setSearchUsername={setSearchUsername}
                searchResults={searchResults}
                showAddFriend={showAddFriend}
                setShowAddFriend={setShowAddFriend}
              />
            )}
            
{currentScreen === 'streaks' && (
  <StreaksScreen friends={friends} user={user} />
)}

{/* SHARE */}
{currentScreen === 'share' && (
  <ShareScreen 
    selectedMeal={selectedMeal}
    friends={friends}
    selectedFriendsForMeal={selectedFriendsForMeal}
    setSelectedFriendsForMeal={setSelectedFriendsForMeal}
    sendMealToFriends={sendMealToFriends}
    setCurrentScreen={setCurrentScreen}
  />
)}
            {currentScreen === 'feedback' && (
  <FeedbackScreen 
    submitFeedback={submitFeedback} 
    trackActivity={trackActivity} 
  />
)}
          </main>

          <BottomNav currentScreen={currentScreen} setCurrentScreen={setCurrentScreen} />
          <RecipeModal 
            viewingRecipe={viewingRecipe} 
            setViewingRecipe={setViewingRecipe} 
          />
        </>
      )}
    </div>
  );
};

export default MealPlannerApp;
