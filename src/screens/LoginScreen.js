import React, { useState } from 'react';

const LoginScreen = ({ handleLogin, handleRegister, handleForgotPassword, loading }) => {
    const [formData, setFormData] = useState({ email: '', password: '', name: '', username: '' });
    const [isRegistering, setIsRegistering] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleInputChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 to-pink-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border border-orange-100">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                    {isRegistering ? 'Create Account' : 'Welcome Back'}
                </h2>
                {isRegistering && (
                    <>
                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                            <input type="text" placeholder="Full name" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
                            <input type="text" placeholder="Username" value={formData.username} onChange={(e) => handleInputChange('username', e.target.value)} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" />
                        </div>
                    </>
                )}
                <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                    <input type="email" placeholder="Email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" />
                </div>
                <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                    <div className="relative">
                        <input type={showPassword ? "text" : "password"} placeholder="Password" value={formData.password} onChange={(e) => handleInputChange('password', e.target.value)} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                            {showPassword ? '👁️' : '🙈'}
                        </button>
                    </div>
                </div>
                {!isRegistering && (
                    <button type="button" onClick={() => handleForgotPassword(formData.email)} className="text-xs font-semibold text-orange-600 mb-4 block ml-auto">
                        Forgot Password?
                    </button>
                )}
                <button
                    onClick={() => isRegistering
                        ? handleRegister(formData.name, formData.email, formData.password, formData.username, setIsRegistering)
                        : handleLogin(formData.email, formData.password)
                    }
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg disabled:opacity-60"
                >
                    {loading ? 'Please wait...' : isRegistering ? 'Register' : 'Login'}
                </button>
                <button onClick={() => setIsRegistering(!isRegistering)} className="w-full text-gray-600 mt-4 text-sm">
                    {isRegistering ? 'Already have an account? Login' : "Don't have an account? Register"}
                </button>
            </div>
        </div>
    );
};

export default LoginScreen;