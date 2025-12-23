import React, { useState } from 'react';
import { Home, Users, DollarSign, Flame, MessageSquare, Share2, TrendingUp, X } from 'lucide-react';

// Supabase Configuration
const SUPABASE_URL = 'https://ltrdgyraevtxwroukxkt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0cmRneXJhZXZ0eHdyb3VreGt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyODA5MDEsImV4cCI6MjA4MTg1NjkwMX0.hERWWr2FjKX9zJJVU3j8JjE2y1ZKJeQCsHyrm1yueEI';

// Helper function to send data to Supabase
const sendToSupabase = async (table, data) => {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      console.error('Failed to send data to Supabase:', response.statusText);
    }
  } catch (error) {
    console.error('Error sending data to Supabase:', error);
  }
};

const MealPlannerApp = () => {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  
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
  
  const [allMeals] = useState(mealsData);
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

   const handleLogin = (email, password) => {
    // Get user from localStorage
    const users = JSON.parse(localStorage.getItem('allUsers') || '[]');
    const foundUser = users.find(u => u.email === email && u.password === password);
    
    if (!foundUser) {
      alert('Invalid email or password');
      return;
    }
    
    setUser({ name: foundUser.name, email: foundUser.email, username: foundUser.username });
    setIsLoggedIn(true);
    setCurrentScreen('suggestions');
    
    sendToSupabase('user_activity', {
      user_email: email,
      user_name: foundUser.name,
      action_type: 'login',
      action_details: { timestamp: new Date().toISOString() }
    });
  };

    const handleRegister = (name, email, password, username) => {
    // Get all users
    const users = JSON.parse(localStorage.getItem('allUsers') || '[]');
    
    // Check if username or email already exists
    if (users.find(u => u.username === username)) {
      alert('Username already taken');
      return;
    }
    if (users.find(u => u.email === email)) {
      alert('Email already registered');
      return;
    }
    
    // Create new user
    const newUser = { name, email, password, username, id: Date.now() };
    users.push(newUser);
    localStorage.setItem('allUsers', JSON.stringify(users));
    
    setUser({ name, email, username });
    setIsLoggedIn(true);
    setCurrentScreen('suggestions');
    
    sendToSupabase('user_activity', {
      user_email: email,
      user_name: name,
      action_type: 'register',
      action_details: { timestamp: new Date().toISOString(), username }
    });
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

  const searchUsers = () => {
    if (!searchUsername.trim()) {
      alert('Please enter a username to search');
      return;
    }
    
    const users = JSON.parse(localStorage.getItem('allUsers') || '[]');
    const results = users.filter(u => 
      u.username.toLowerCase().includes(searchUsername.toLowerCase()) && 
      u.username !== user?.username
    );
    
    setSearchResults(results);
    
    trackActivity('search_users', {
      search_query: searchUsername,
      results_count: results.length,
      timestamp: new Date().toISOString()
    });
  };

  const sendFriendRequest = (targetUser) => {
    // Check if already friends
    if (friends.find(f => f.username === targetUser.username)) {
      alert('You are already friends with this user');
      return;
    }
    
    // Check if request already sent
    const existingRequest = friendRequests.find(
      req => req.fromUsername === user.username && req.toUsername === targetUser.username
    );
    
    if (existingRequest) {
      alert('Friend request already sent');
      return;
    }
    
    // Create new request
    const newRequest = {
      id: Date.now(),
      fromUsername: user.username,
      fromName: user.name,
      toUsername: targetUser.username,
      toName: targetUser.name,
      status: 'pending',
      timestamp: new Date().toISOString()
    };
    
    setFriendRequests([...friendRequests, newRequest]);
    
    sendToSupabase('user_activity', {
      user_email: user?.email,
      user_name: user?.name,
      action_type: 'send_friend_request',
      action_details: {
        to_username: targetUser.username,
        timestamp: new Date().toISOString()
      }
    });
    
    alert(`Friend request sent to ${targetUser.name}!`);
    setSearchUsername('');
    setSearchResults([]);
  };

  const handleFriendRequest = (request, accept) => {
    if (accept) {
      // Add to both users' friend lists
      const avatars = ['👩', '👨', '👦', '👧', '👴', '👵', '🧑', '👨‍🦰', '👩‍🦰', '👨‍🦱', '👩‍🦱'];
      const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
      
      const newFriend = {
        id: Date.now(),
        name: request.fromName,
        username: request.fromUsername,
        avatar: randomAvatar,
        streak: 0,
        sentToday: false,
        receivedToday: false
      };
      
      setFriends([...friends, newFriend]);
      
      // Also add to the requester's friend list (in real app, this would be server-side)
      const allFriendLists = JSON.parse(localStorage.getItem('allFriendLists') || '{}');
      if (!allFriendLists[request.fromUsername]) {
        allFriendLists[request.fromUsername] = [];
      }
      allFriendLists[request.fromUsername].push({
        id: Date.now() + 1,
        name: user.name,
        username: user.username,
        avatar: randomAvatar,
        streak: 0,
        sentToday: false,
        receivedToday: false
      });
      localStorage.setItem('allFriendLists', JSON.stringify(allFriendLists));
      
      trackActivity('accept_friend_request', {
        from_username: request.fromUsername,
        timestamp: new Date().toISOString()
      });
    }
    
    // Remove request (whether accepted or denied, don't notify sender)
    setFriendRequests(friendRequests.filter(req => req.id !== request.id));
  };

  const selectMeal = (meal) => {
  trackMeal(meal);
  setSelectedMeal(meal);
};

  const submitFeedback = async (feedback) => {
    await sendToSupabase('feedback', {
      user_email: user?.email,
      user_name: user?.name,
      feedback_text: feedback
    });
    
    alert('Thank you for your feedback! 🎉');
    setCurrentScreen('suggestions');
  };

   const sendMealToFriends = () => {
    if (selectedFriendsForMeal.length === 0) {
      alert('Please select at least one friend');
      return;
    }
    
    setFriends(friends.map(f => 
      selectedFriendsForMeal.includes(f.id)
        ? { ...f, receivedToday: true, streak: f.streak + 1 }
        : f
    ));
    
    const friendNames = friends
      .filter(f => selectedFriendsForMeal.includes(f.id))
      .map(f => f.name)
      .join(', ');
    
    sendToSupabase('user_activity', {
      user_email: user?.email,
      user_name: user?.name,
      action_type: 'share_meal',
      action_details: {
        meal_name: selectedMeal?.name,
        meal_budget: selectedMeal?.budget,
        friend_count: selectedFriendsForMeal.length,
        friend_names: friendNames,
        timestamp: new Date().toISOString()
      }
    });
    
    alert(`Meal sent to ${selectedFriendsForMeal.length} friend(s)! 🎉`);
    setSelectedFriendsForMeal([]);
    setCurrentScreen('suggestions');
  };

  const trackActivity = (actionType, actionDetails) => {
    if (user) {
      sendToSupabase('user_activity', {
        user_email: user.email,
        user_name: user.name,
        action_type: actionType,
        action_details: actionDetails
      });
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

  const HomeScreen = () => (
    <div className="min-h-screen bg-gradient-to-b from-orange-100 to-pink-100 flex items-center justify-center p-4 pb-24">
    <div className="text-center relative z-10">
      <div className="text-8xl mb-6">🍽️</div>
      <h1 className="text-5xl font-bold text-purple mb-4 drop-shadow-lg">DishiStudio</h1>
      <p className="text-xl text-purple mb-8 drop-shadow-md">Share meals, build streaks with friends</p>
      <button
        onClick={() => setCurrentScreen('login')}
        className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
      >
        Get Started
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

    const handleInputChange = (field, value) => {
      setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
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
                  className="w-full p-3 border border-gray-300 rounded-lg"
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
                  className="w-full p-3 border border-gray-300 rounded-lg"
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
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
          
          <button
            onClick={() => isRegistering 
              ? handleRegister(formData.name, formData.email, formData.password, formData.username) 
              : handleLogin(formData.email, formData.password)}
            className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all mb-4"
          >
            {isRegistering ? 'Register' : 'Login'}
          </button>
          
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="w-full text-gray-600 hover:text-gray-800"
          >
            {isRegistering ? 'Already have an account? Login' : "Don't have an account? Register"}
          </button>
        </div>
      </div>
    );
  };

  const SuggestionsScreen = () => {
    const [isEditingBudget, setIsEditingBudget] = useState(false);
    const [tempMaxBudget, setTempMaxBudget] = useState(maxMealBudget);

    const saveMealBudget = () => {
      const oldMaxBudget = maxMealBudget;
      setMaxMealBudget(tempMaxBudget);
      setIsEditingBudget(false);
      
      trackActivity('change_max_meal_budget', {
        old_max_budget: oldMaxBudget,
        new_max_budget: tempMaxBudget,
        timestamp: new Date().toISOString()
      });
    };

    return (
      <div className="pb-20">
        <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Today's Suggestions</h2>
          <p className="text-base text-gray-600">Delicious meals within your budget</p>
        </div>
        
        <div className="p-4 max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="mb-6">
              <label className="text-lg font-bold text-gray-800 mb-3 block">Max Meal Budget</label>
              
              {isEditingBudget ? (
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-gray-800">KSh</span>
                  <input
                    type="number"
                    value={tempMaxBudget}
                    onChange={(e) => setTempMaxBudget(Number(e.target.value))}
                    className="text-2xl font-bold text-orange-600 border-2 border-orange-500 rounded-lg px-3 py-2 w-32"
                    min="50"
                    max="1000"
                  />
                  <button
                    onClick={saveMealBudget}
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-600 transition-all"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setTempMaxBudget(maxMealBudget);
                      setIsEditingBudget(false);
                    }}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-400 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-orange-600">KSh {maxMealBudget}</span>
                  <button
                    onClick={() => setIsEditingBudget(true)}
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
                        ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            <div className="mt-4">
  <label className="text-lg font-bold text-gray-800 mb-3 block">Search Meals</label>
  <div className="relative">
    <input
      type="text"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      onBlur={() => {
        if (searchQuery) {
          trackActivity('search_meals', { query: searchQuery, timestamp: new Date().toISOString() });
        }
      }}
      placeholder="Search by name, ingredients, or description..."
      className="w-full p-3 pr-10 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
    />
    {searchQuery && (
      <button
        onClick={() => setSearchQuery('')}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        ✕
      </button>
    )}
  </div>
  {searchQuery && (
    <p className="text-sm text-gray-600 mt-2">
      Found {filteredMeals.length} meal{filteredMeals.length !== 1 ? 's' : ''} matching "{searchQuery}"
    </p>
  )}
</div>
            </div>
          </div>

          {filteredMeals.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <p className="text-xl text-gray-600 mb-2">No meals found</p>
              <p className="text-gray-500">Try increasing your budget or selecting a different category</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {filteredMeals.map(meal => (
                <div key={meal.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{meal.name}</h3>
                      <span className="inline-block mt-1 text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        {meal.category}
                      </span>
                    </div>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                      KSh {meal.budget}
                    </span>
                  </div>
                  
                  {meal.culturalNote && (
                    <div className="mb-3 text-sm text-gray-600 italic bg-orange-50 p-2 rounded border-l-2 border-orange-400">
                      🇰🇪 {meal.culturalNote.substring(0, 60)}...
                    </div>
                  )}

                  <div className="mb-3 flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-sm">
                        {i < meal.healthScore ? '⭐' : '☆'}
                      </span>
                    ))}
                    <span className="text-xs text-gray-500 ml-1">Health</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {meal.ingredients.slice(0, 3).map((ing, i) => (
                      <span key={i} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                        {ing}
                      </span>
                    ))}
                    {meal.ingredients.length > 3 && (
                      <span className="text-gray-500 text-sm">+{meal.ingredients.length - 3} more</span>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setViewingRecipe(meal);
                        trackActivity('view_recipe', {
                          meal_name: meal.name,
                          meal_budget: meal.budget,
                          meal_category: meal.category,
                          timestamp: new Date().toISOString()
                        });
                      }}
                      className="flex-1 bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition-all"
                    >
                      View Recipe
                    </button>
                    <button
                      onClick={() => {
                        selectMeal(meal);
                        setCurrentScreen('share');
                      }}
                      className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
                    >
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

  const BudgetScreen = () => {
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
          <h2 className="text-3xl font-bold mb-2">Your Budget</h2>
          <p className="opacity-90">Track your meal spending</p>
        </div>
        
        <div className="p-4 max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
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
                      className="text-4xl font-bold text-gray-800 text-center border-2 border-green-500 rounded-lg px-4 py-2 w-56"
                      min="1000"
                      max="50000"
                    />
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={saveBudget}
                      className="bg-green-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-600 transition-all"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setTempBudget(budget);
                        setIsEditing(false);
                      }}
                      className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-400 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <span className="text-5xl font-bold text-gray-800">KSh {budget}</span>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-green-600 hover:text-green-700 font-semibold"
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
                <span className="text-green-500 text-xl">✓</span>
                <span className="text-gray-700">Shop at local markets for fresh produce at lower prices</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 text-xl">✓</span>
                <span className="text-gray-700">Share ingredients with friends to reduce waste and costs</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  };

  const FriendsScreen = () => {
    const myPendingRequests = friendRequests.filter(req => req.toUsername === user?.username && req.status === 'pending');
    
    return (
      <div className="pb-20">
        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-6">
          <h2 className="text-3xl font-bold mb-2">Friends</h2>
          <p className="opacity-90">Connect and share meals</p>
        </div>
        
        <div className="p-4 max-w-4xl mx-auto">
          {/* Friend Requests */}
          {myPendingRequests.length > 0 && (
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 mb-4">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Friend Requests ({myPendingRequests.length})
              </h3>
              <div className="space-y-3">
                {myPendingRequests.map(request => (
                  <div key={request.id} className="bg-white rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-800">{request.fromName}</p>
                      <p className="text-sm text-gray-500">@{request.fromUsername}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleFriendRequest(request, true)}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition-all"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleFriendRequest(request, false)}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-400 transition-all"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add Friend Section */}
          {showAddFriend && (
            <div className="bg-white rounded-xl shadow-md p-6 mb-4">
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
                      className="flex-1 p-3 border border-gray-300 rounded-lg"
                      onKeyPress={(e) => e.key === 'Enter' && searchUsers()}
                      autoComplete="off"
                  />
                    <button
                      onClick={searchUsers}
                      className="bg-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-600 transition-all"
                    >
                      Search
                    </button>
                  </div>
                </div>
                
                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div className="border-t pt-4 mt-4">
                    <p className="text-sm font-semibold text-gray-700 mb-3">
                      Search Results ({searchResults.length})
                    </p>
                    <div className="space-y-2">
                      {searchResults.map(result => (
                        <div key={result.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-semibold text-gray-800">{result.name}</p>
                            <p className="text-sm text-gray-500">@{result.username}</p>
                          </div>
                          <button
                            onClick={() => sendFriendRequest(result)}
                            className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
                          >
                            Add Friend
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <button
                  onClick={() => {
                    setShowAddFriend(false);
                    setSearchUsername('');
                    setSearchResults([]);
                  }}
                  className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Friends List */}
          {friends.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center mb-4">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-600 mb-2">No friends yet</p>
              <p className="text-gray-500">Search for users to add as friends!</p>
            </div>
          ) : (
            friends.map(friend => (
              <div key={friend.id} className="bg-white rounded-xl shadow-md p-6 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{friend.avatar}</div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{friend.name}</h3>
                      <p className="text-sm text-gray-500">@{friend.username}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Flame className="w-4 h-4 text-orange-500" />
                        <span className="text-sm text-gray-600">{friend.streak} day streak</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {friend.sentToday && !friend.receivedToday && (
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        Sent you a meal!
                      </span>
                    )}
                    {friend.receivedToday && (
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                        ✓ Sent today
                      </span>
                    )}
                    <button
                      onClick={() => {
                        if (window.confirm(`Remove ${friend.name} from friends?`)) {
                          setFriends(friends.filter(f => f.id !== friend.id));
                          trackActivity('remove_friend', {
                            friend_name: friend.name,
                            friend_username: friend.username,
                            timestamp: new Date().toISOString()
                          });
                          alert(`${friend.name} removed from friends`);
                        }
                      }}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}

          <button 
            onClick={() => setShowAddFriend(!showAddFriend)}
            className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all mt-4">
            {showAddFriend ? 'Cancel' : '+ Add Friend'}
          </button>
        </div>
      </div>
    );
  };

  const StreaksScreen = () => {
    const longestStreak = friends.reduce((max, f) => Math.max(max, f.streak), 0);
    const activeStreaks = friends.filter(f => f.streak > 0).length;

    return (
      <div className="pb-20">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6">
          <h2 className="text-3xl font-bold mb-2">Streaks</h2>
          <p className="opacity-90">Keep the momentum going!</p>
        </div>
        
        <div className="p-4 max-w-4xl mx-auto">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <Flame className="w-12 h-12 text-orange-500 mx-auto mb-2" />
              <p className="text-gray-600 text-sm">Longest Streak</p>
              <p className="text-4xl font-bold text-orange-600">{longestStreak}</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <TrendingUp className="w-12 h-12 text-green-500 mx-auto mb-2" />
              <p className="text-gray-600 text-sm">Active Streaks</p>
              <p className="text-4xl font-bold text-green-600">{activeStreaks}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Leaderboard</h3>
            <div className="space-y-3">
              {friends
                .sort((a, b) => b.streak - a.streak)
                .map((friend, index) => (
                  <div key={friend.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-gray-400">#{index + 1}</span>
                      <span className="text-2xl">{friend.avatar}</span>
                      <span className="font-semibold text-gray-800">{friend.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Flame className="w-5 h-5 text-orange-500" />
                      <span className="text-xl font-bold text-orange-600">{friend.streak}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ShareScreen = () => {
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
          <h2 className="text-3xl font-bold mb-2">Share Meal</h2>
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

          <h3 className="text-lg font-bold text-gray-800 mb-4">Select friends (tap to select multiple)</h3>
          
          {friends.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-600 mb-2">No friends yet</p>
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
                        <div className="text-4xl">{friend.avatar}</div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">{friend.name}</h3>
                          <p className="text-sm text-gray-500">@{friend.username}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Flame className="w-4 h-4 text-orange-500" />
                            <span className="text-sm text-gray-600">{friend.streak} day streak</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {friend.receivedToday && (
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                            ✓ Sent today
                          </span>
                        )}
                        <div className={`w-8 h-8 rounded-full border-4 flex items-center justify-center ${
                          isSelected 
                            ? 'bg-orange-500 border-orange-500' 
                            : 'bg-white border-gray-300'
                        }`}>
                          {isSelected && <span className="text-white text-lg">✓</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              <button
                onClick={sendMealToFriends}
                disabled={selectedFriendsForMeal.length === 0}
                className={`w-full py-3 rounded-lg font-semibold transition-all mb-2 ${
                  selectedFriendsForMeal.length === 0
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:shadow-lg'
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
            className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };

  const FeedbackScreen = () => {
    const [feedback, setFeedback] = useState('');

    return (
      <div className="pb-20">
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-6">
          <h2 className="text-3xl font-bold mb-2">Feedback</h2>
          <p className="opacity-90">Help us improve DishiStudio</p>
        </div>
        
        <div className="p-4 max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <label className="text-lg font-bold text-gray-800 mb-3 block">
              Share your thoughts
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="What do you think about DishiStudio? Any suggestions?"
              className="w-full p-4 border border-gray-300 rounded-lg mb-4 h-40 resize-none"
            />
            
            <button
              onClick={() => {
                submitFeedback(feedback);
                setFeedback('');
              }}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Submit Feedback
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Feedback</h3>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => {
                  trackActivity('quick_feedback', { type: 'love_it', timestamp: new Date().toISOString() });
                  alert('Thanks for the love! ❤️');
                }}
                className="p-3 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all">
                😊 Love it!
              </button>
              <button 
                onClick={() => {
                  trackActivity('quick_feedback', { type: 'need_more_meals', timestamp: new Date().toISOString() });
                  alert('Thanks! We\'ll add more meals soon! 🍽️');
                }}
                className="p-3 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all">
                🤔 Need more meals
              </button>
              <button 
                onClick={() => {
                  trackActivity('quick_feedback', { type: 'budget_helpful', timestamp: new Date().toISOString() });
                  alert('Glad the budget feature helps! 💰');
                }}
                className="p-3 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all">
                💰 Budget helpful
              </button>
              <button 
                onClick={() => {
                  trackActivity('quick_feedback', { type: 'love_streaks', timestamp: new Date().toISOString() });
                  alert('Keep those streaks going! 🔥');
                }}
                className="p-3 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all">
                👥 Love streaks
              </button>
            </div>
          </div>
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
    <div className="min-h-screen bg-gray-50">
      {!isLoggedIn && currentScreen === 'home' && <HomeScreen />}
      {!isLoggedIn && currentScreen === 'login' && <LoginScreen />}
      
      {isLoggedIn && (
        <>
          <NavBar />
          {currentScreen === 'suggestions' && <SuggestionsScreen />}
          {currentScreen === 'budget' && <BudgetScreen />}
          {currentScreen === 'friends' && <FriendsScreen />}
          {currentScreen === 'streaks' && <StreaksScreen />}
          {currentScreen === 'share' && <ShareScreen />}
          {currentScreen === 'feedback' && <FeedbackScreen />}
          <BottomNav />
          <RecipeModal />
        </>
      )}
    </div>
  );
};

export default MealPlannerApp;
