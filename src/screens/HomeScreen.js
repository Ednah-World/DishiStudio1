import React from 'react';

const HomeScreen = ({ setCurrentScreen }) => (
    <div className="min-h-screen bg-gradient-to-b from-orange-100 to-pink-100 flex items-center justify-center p-4 pb-24">
        <div className="text-center relative z-10">
            <div className="text-8xl mb-6">🍽️</div>
            <h1 className="text-5xl font-bold text-black mb-4 drop-shadow-lg">DishiStudio</h1>
            <p className="text-xl text-black mb-8 drop-shadow-md">Eat affordably. Stay consistent.</p>
            <button
                onClick={() => setCurrentScreen('login')}
                className="bg-orange-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-orange-700 transition shadow-lg"
            >
                Get Started
            </button>
        </div>
    </div>
);

export default HomeScreen;
