import React, { useState } from 'react';
import { Trash2, ShieldCheck, Edit2 } from 'lucide-react';
import { supabaseFetch } from '../utils/supabaseClient';

const AdminScreen = ({ user, allMeals, setAllMeals, setCurrentScreen }) => {
    const [mealData, setMealData] = useState({
        name: '', category: 'Lunch', budget: '', description: '', ingredients: '', recipe: '', healthScore: 3
    });
    const [editingMealId, setEditingMealId] = useState(null);
    const [loading, setLoading] = useState(false);

    // 🎯 NEW: Pulls meal data into the form
    const handleEditClick = (meal) => {
        setEditingMealId(meal.id);
        setMealData({
            name: meal.name,
            category: meal.category || 'Lunch',
            budget: meal.budget || '',
            description: meal.description || '',
            // Convert the array back to a comma-separated string for the textbox
            ingredients: Array.isArray(meal.ingredients) ? meal.ingredients.join(', ') : (meal.ingredients || ''),
            recipe: meal.recipe || '',
            healthScore: meal.health_score || meal.healthScore || 3
        });

        // Scrolls you to the top so you can see the form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // 🎯 NEW: Cancels the edit and clears the form
    const handleCancelEdit = () => {
        setEditingMealId(null);
        setMealData({ name: '', category: 'Lunch', budget: '', description: '', ingredients: '', recipe: '', healthScore: 3 });
    };

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
                ingredients: mealData.ingredients.split(',').map(i => i.trim()).filter(i => i), // Removes blank spaces
                recipe: mealData.recipe,
                health_score: Number(mealData.healthScore)
            };

            if (editingMealId) {
                // 🛠️ UPDATE EXISTING MEAL
                await supabaseFetch('meals', `?id=eq.${editingMealId}`, 'PATCH', payload);
                alert("Meal updated successfully!");

                // Update the local list so UI changes instantly
                setAllMeals(allMeals.map(m => m.id === editingMealId ? { ...m, ...payload } : m));
                setEditingMealId(null);
            } else {
                // 🚀 ADD NEW MEAL
                const newMeal = await supabaseFetch('meals', '', 'POST', payload);
                alert("Official meal added to the database!");

                if (newMeal && newMeal.length > 0) {
                    setAllMeals([...allMeals, newMeal[0]]);
                }
            }

            // Clear the form
            setMealData({ name: '', category: 'Lunch', budget: '', description: '', ingredients: '', recipe: '', healthScore: 3 });
        } catch (err) {
            console.error("Admin Action Failed:", err);
            alert("Failed to save: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteOfficialMeal = async (id, name) => {
        if (!window.confirm(`ADMIN WARNING: Are you sure you want to permanently delete ${name} from the official database?`)) return;

        try {
            await supabaseFetch('meals', `?id=eq.${id}`, 'DELETE');
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
                <form onSubmit={handleSubmit} className={`bg-white rounded-xl shadow-lg p-6 border-2 relative overflow-hidden ${editingMealId ? 'border-blue-500' : 'border-yellow-400'}`}>
                    <div className={`absolute top-0 left-0 w-full h-2 ${editingMealId ? 'bg-blue-500' : 'bg-yellow-400'}`}></div>

                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-gray-800">
                            {editingMealId ? '✏️ Edit Official Meal' : '✨ Add Official Meal'}
                        </h3>
                        {editingMealId && (
                            <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-bold animate-pulse">
                                EDITING MODE
                            </span>
                        )}
                    </div>

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

                    <div className="flex gap-3">
                        <button type="submit" disabled={loading} className={`flex-1 text-white py-3 rounded-lg font-bold transition-all shadow-md ${editingMealId ? 'bg-blue-500 hover:bg-blue-600' : 'bg-yellow-500 hover:bg-yellow-600'}`}>
                            {loading ? 'Saving...' : (editingMealId ? '💾 Save Changes' : '🚀 Publish Official Meal')}
                        </button>

                        {editingMealId && (
                            <button type="button" onClick={handleCancelEdit} className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-bold hover:bg-gray-300 transition-all">
                                Cancel
                            </button>
                        )}
                    </div>
                </form>

                {/* CURRENT OFFICIAL MEALS LIST */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Official Database ({allMeals.length} Meals)</h3>
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                        {allMeals.map(meal => (
                            <div key={meal.id} className={`flex justify-between items-center p-3 rounded-lg border transition-all ${editingMealId === meal.id ? 'bg-blue-50 border-blue-300' : 'bg-gray-50 border-gray-200'}`}>
                                <div>
                                    <p className="font-bold text-gray-800">{meal.name}</p>
                                    <p className="text-xs text-gray-500">{meal.category} • KSh {meal.budget}</p>
                                </div>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => handleEditClick(meal)}
                                        className="p-2 text-blue-500 hover:bg-blue-100 rounded-lg transition-colors"
                                        title="Edit meal"
                                    >
                                        <Edit2 className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteOfficialMeal(meal.id, meal.name)}
                                        className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                                        title="Delete official meal"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminScreen;