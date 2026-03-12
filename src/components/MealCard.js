import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { supabaseFetch } from '../utils/supabaseClient';

const MealCard = ({ meal, user, setViewingRecipe, trackActivity, onDelete, onSelect, setCurrentScreen }) => {
    const [showMealTypePicker, setShowMealTypePicker] = useState(false);
    const [saving, setSaving] = useState(false);

    const handleMealTypeSelect = async (mealType) => {
        if (!user?.id) {
            alert("Please log in to save meals.");
            return;
        }
        setSaving(true);
        setShowMealTypePicker(false);

        // 1. Update local history (App.js state)
        if (onSelect) {
            onSelect(meal);
        }

        // 2. Prepare database payload
        const payload = {
            user_id: user.id,
            user_email: user.email,
            action_type: 'select_meal',
            action_details: {
                meal_id: meal.id,
                meal_name: meal.name,
                budget: meal.budget,
                category: meal.category,
                meal_type: mealType
            },
            created_at: new Date().toISOString()
        };

        // 3. Save to Supabase (This will now run because we removed 'return')
        try {
            await supabaseFetch('user_activity', '', 'POST', payload);
            alert(`Saved ${meal.name} as ${mealType} to your Week Plan!`);
        } catch (err) {
            console.error("DB Save Failed:", err);
            alert("Failed to save meal: " + err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-50 relative">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h3 className="text-xl font-bold text-gray-800">{meal.name}</h3>
                    <span className="inline-block mt-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {meal.category}
                    </span>
                    {meal.user_id && (
                        <span className="inline-block mt-1 ml-2 text-[10px] text-blue-500 bg-blue-50 px-2 py-1 rounded">
                            User Added
                        </span>
                    )}
                </div>
                <div className="flex flex-col items-end">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">
                        KSh {meal.budget}
                    </span>
                    {onDelete && (
                        <button
                            onClick={() => onDelete(meal.id, meal.name)}
                            className="mt-2 text-red-400 hover:text-red-600 p-1"
                            title="Delete my suggested meal"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            <div className="flex gap-2 mt-4">
                <button
                    onClick={() => setViewingRecipe(meal)}
                    className="flex-1 bg-blue-500 text-white py-2 rounded-lg font-bold"
                >
                    View
                </button>
                <button
                    onClick={() => {
                        if (!user?.id) { alert("Please log in to save meals."); return; }
                        setShowMealTypePicker(prev => !prev);
                    }}
                    disabled={saving}
                    className="flex-1 bg-green-500 text-white py-2 rounded-lg font-bold hover:bg-green-600 transition-colors"
                >
                    {saving ? 'Saving...' : 'Save'}
                </button>
            </div>

            {showMealTypePicker && (
                <div className="mt-3 rounded-xl overflow-hidden border-2 border-green-500 shadow-lg">
                    <p className="bg-green-500 text-white text-xs font-bold uppercase tracking-widest text-center py-2">
                        Which meal is this for?
                    </p>
                    <div className="flex">
                        {[
                            { label: 'Breakfast', icon: '☀️', bg: 'bg-amber-500' },
                            { label: 'Lunch', icon: '🥗', bg: 'bg-green-500' },
                            { label: 'Dinner', icon: '🌙', bg: 'bg-emerald-700' },
                        ].map(({ label, icon, bg }) => (
                            <button
                                key={label}
                                onClick={() => handleMealTypeSelect(label)}
                                className={`flex-1 ${bg} text-white py-3 font-bold text-sm flex flex-col items-center gap-1 hover:brightness-110 transition-all`}
                            >
                                <span className="text-lg">{icon}</span>
                                {label}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => setShowMealTypePicker(false)}
                        className="w-full bg-gray-100 text-gray-500 text-xs py-2 font-semibold hover:bg-gray-200 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
};

export default MealCard;