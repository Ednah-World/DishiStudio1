import React, { useState, useEffect, useRef } from 'react';
import { Menu, Users, X } from 'lucide-react';

const NavBar = ({ isLoggedIn, user, handleLogout, setCurrentScreen }) => {
    const [showAppendices, setShowAppendices] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        if (!showAppendices) return;
        const handleOutsideClick = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setShowAppendices(false);
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, [showAppendices]);

    return (
        <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white p-4 shadow-lg sticky top-0 z-40">
            <div className="flex justify-between items-center max-w-6xl mx-auto">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setShowAppendices(!showAppendices)}
                        className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-all"
                    >
                        <Menu className="w-6 h-6 text-white" />
                    </button>
                    <h1 className="text-2xl font-bold text-white">🍽️ DishiStudio</h1>
                </div>
                {isLoggedIn && (
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => { setCurrentScreen('community-suggestions'); setShowAppendices(false); }}
                            className="bg-white text-orange-600 px-3 py-1 rounded-lg text-xs font-bold hover:bg-orange-50"
                        >
                            Suggestions
                        </button>
                        <span className="text-sm font-semibold text-white hidden sm:block">{user?.name}</span>
                    </div>
                )}
            </div>

            {showAppendices && (
                <div ref={menuRef} className="absolute top-16 left-4 bg-white rounded-xl shadow-2xl border border-gray-100 p-4 w-64 text-gray-800 z-50">
                    <div className="space-y-2">
                        <p className="text-xs font-bold text-gray-400 uppercase mb-2">My Account</p>
                        <button
                            onClick={() => { setCurrentScreen('profile'); setShowAppendices(false); }}
                            className="w-full text-left p-2 hover:bg-orange-50 rounded-lg flex items-center gap-2"
                        >
                            <Users className="w-4 h-4 text-orange-400" /> Profile & Legal
                        </button>
                        <button
                            onClick={() => { handleLogout(); setShowAppendices(false); }}
                            className="w-full text-left p-2 hover:bg-red-50 text-red-600 rounded-lg flex items-center gap-2"
                        >
                            <X className="w-4 h-4" /> Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NavBar;