// src/components/BottomNav.js
import React from 'react';
import { Home, Calendar, DollarSign, MessageSquare } from 'lucide-react';

const BottomNav = ({ setCurrentScreen, trackActivity }) => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
        <div className="flex justify-around items-center max-w-6xl mx-auto">
            <button onClick={() => { setCurrentScreen('suggestions'); trackActivity('navigate', { screen: 'suggestions' }); }} className="flex flex-col items-center p-3 hover:bg-gray-50">
                <Home className="w-6 h-6" />
                <span className="text-xs mt-1">Home</span>
            </button>
            <button onClick={() => { setCurrentScreen('week-planner'); trackActivity('navigate', { screen: 'week-planner' }); }} className="flex flex-col items-center p-3 hover:bg-gray-50">
                <Calendar className="w-6 h-6" />
                <span className="text-xs mt-1">Week</span>
            </button>
            <button onClick={() => { setCurrentScreen('budget'); trackActivity('navigate', { screen: 'budget' }); }} className="flex flex-col items-center p-3 hover:bg-gray-50">
                <DollarSign className="w-6 h-6" />
                <span className="text-xs mt-1">Budget</span>
            </button>
            <button onClick={() => { setCurrentScreen('feedback'); trackActivity('navigate', { screen: 'feedback' }); }} className="flex flex-col items-center p-3 hover:bg-gray-50">
                <MessageSquare className="w-6 h-6" />
                <span className="text-xs mt-1">Feedback</span>
            </button>
        </div>
    </div>
);

export default BottomNav;