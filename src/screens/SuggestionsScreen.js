import React, { useState } from 'react';
import MealCard from '../components/MealCard';

const SuggestionsScreen = ({
    user,
    maxMealBudget,
    setMaxMealBudget,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    filteredMeals,
    setViewingRecipe,
    setCurrentScreen,
    trackActivity,
    selectMeal
}) => {
    const [isEditingBudget, setIsEditingBudget] = useState(false);
    const [tempMaxBudget, setTempMaxBudget] = useState('');

    const saveMealBudget = () => {
        const newBudget = Number(tempMaxBudget) || maxMealBudget;
        if (newBudget < 50) {
            alert("Max meal budget must be at least KSh 50");
            return;
        }
        setMaxMealBudget(newBudget);
        setIsEditingBudget(false);
        trackActivity('change_max_meal_budget', { old_max_budget: maxMealBudget, new_max_budget: newBudget });
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
                                />
                                <button onClick={saveMealBudget} className="bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold">Save</button>
                                <button onClick={() => setIsEditingBudget(false)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold">Cancel</button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <span className="text-3xl font-bold text-orange-600">KSh {maxMealBudget}</span>
                                <button onClick={() => setIsEditingBudget(true)} className="text-orange-600 hover:text-orange-700 font-semibold text-sm">✏️ Edit</button>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="text-lg font-bold text-gray-800 mb-3 block">Meal Category</label>
                        <div className="flex gap-2 flex-wrap">
                            {['All', 'Breakfast', 'Lunch', 'Dinner'].map(category => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${selectedCategory === category ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-md' : 'bg-gray-100 text-gray-700'}`}
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
                                {/* ADDED BACK: Clear Search button */}
                                {searchQuery && (
                                    <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
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
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                        {filteredMeals.map(meal => (
                            <MealCard
                                key={meal.id}
                                meal={meal}
                                user={user}
                                setViewingRecipe={setViewingRecipe}
                                trackActivity={trackActivity}
                                onSelect={selectMeal}
                                setCurrentScreen={setCurrentScreen} // FIXED: Passing the steering wheel
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SuggestionsScreen;