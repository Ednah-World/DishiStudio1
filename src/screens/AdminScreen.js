import React, { useState } from 'react';
import { Trash2, ShieldCheck } from 'lucide-react';
import { supabaseFetch } from '../utils/supabaseClient';

const AdminScreen = ({ user, allMeals, setAllMeals, setCurrentScreen }) => {
    const [mealData, setMealData] = useState({
        name: '', category: 'Lunch', budget: '', description: '', ingredients: '', recipe: '', healthScore: 3
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!mealData.name || !mealData.budget) return alert("Name and budget are required.");

        setLoading(true);
        try {
            const payload = {
                name: mealData.name,
                category: mealData.category,
                budget: Number(mealData.budget),
                description: mealData.description,
                ingredients: mealData.ingredients.split(',').map(i => i.trim()),
                recipe: mealData.recipe,
                healthScore: Number(mealData.healthScore)
            };

            // Post directly to the OFFICIAL meals table
            const newMeal = await supabaseFetch('meals', '', 'POST', payload);

            alert("Official meal added to the database!");

            // If Supabase returns the created meal, add it to the list instantly. Otherwise, prompt a refresh.
            if (newMeal && newMeal.length > 0) {
                setAllMeals([...allMeals, newMeal[0]]);
            } else {
                alert("Meal saved! Please refresh the app to see it in the main list.");
            }

            // Clear the form
            setMealData({ name: '', category: 'Lunch', budget: '', description: '', ingredients: '', recipe: '', healthScore: 3 });
        } catch (err) {
            console.error("Admin Add Failed:", err);
            alert("Failed to add meal: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteOfficialMeal = async (id, name) => {
        if (!window.confirm(`ADMIN WARNING: Are you sure you want to permanently delete ${name} from the official database?`)) return;

        try {
            await supabaseFetch('meals', `?id=eq.${id}`, 'DELETE');
            // Remove it from the local state so it disappears instantly
            setAllMeals(allMeals.filter(m => m.id !== id));
            alert(`${name} deleted permanently.`);
        } catch (err) {
            alert("Failed to delete: " + err.message);
        }
    };

    return (
        <div className="pb-20">
            <div className="bg-gradient-to-r from-yellow-500 to-amber-600 text-white p-6 shadow-md">
                <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck className="w-8 h-8" />
                    <h2 className="text-3xl font-bold">Admin Panel</h2>
                </div>
                <p className="opacity-90">Manage official DishiStudio meals</p>
            </div>

            <div className="p-4 max-w-4xl mx-auto space-y-6">
                {/* ADMIN FORM */}
                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 border-2 border-yellow-400 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-yellow-400"></div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Add Official Meal</h3>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Meal Name</label>
                            <input type="text" value={mealData.name} onChange={e => setMealData({ ...mealData, name: e.target.value })} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none" required />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Price (KSh)</label>
                            <input type="number" value={mealData.budget} onChange={e => setMealData({ ...mealData, budget: e.target.value })} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none" required />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                            <select value={mealData.category} onChange={e => setMealData({ ...mealData, category: e.target.value })} className="w-full p-3 border rounded-lg outline-none">
                                <option>Breakfast</option><option>Lunch</option><option>Dinner</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Health Score (1-5)</label>
                            <input type="number" min="1" max="5" value={mealData.healthScore} onChange={e => setMealData({ ...mealData, healthScore: e.target.value })} className="w-full p-3 border rounded-lg outline-none" />
                        </div>
                    </div>

                    <div className="space-y-4 mb-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Short Description</label>
                            <textarea value={mealData.description} onChange={e => setMealData({ ...mealData, description: e.target.value })} className="w-full p-3 border rounded-lg outline-none h-16" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Ingredients (comma separated)</label>
                            <textarea value={mealData.ingredients} onChange={e => setMealData({ ...mealData, ingredients: e.target.value })} className="w-full p-3 border rounded-lg outline-none h-16" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Recipe</label>
                            <textarea value={mealData.recipe} onChange={e => setMealData({ ...mealData, recipe: e.target.value })} className="w-full p-3 border rounded-lg outline-none h-24" />
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-yellow-500 text-white py-3 rounded-lg font-bold hover:bg-yellow-600 transition-all shadow-md">
                        {loading ? 'Saving...' : '🚀 Publish Official Meal'}
                    </button>
                </form>

                {/* CURRENT OFFICIAL MEALS LIST */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Official Database ({allMeals.length} Meals)</h3>
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                        {allMeals.map(meal => (
                            <div key={meal.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                                <div>
                                    <p className="font-bold text-gray-800">{meal.name}</p>
                                    <p className="text-xs text-gray-500">{meal.category} • KSh {meal.budget}</p>
                                </div>
                                <button
                                    onClick={() => handleDeleteOfficialMeal(meal.id, meal.name)}
                                    className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                                    title="Delete official meal"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminScreen;