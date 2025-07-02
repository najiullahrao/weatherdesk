"use client";

import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Eye, EyeOff, Mail, Lock, User, MapPin, Thermometer, Wind, Droplets } from 'lucide-react';
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function WeatherDeskLanding() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  const [currentWeatherIcon, setCurrentWeatherIcon] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const weatherIcons = [Sun, Cloud, CloudRain];
  const weatherAnimations = [
    'animate-pulse',
    'animate-bounce',
    'animate-pulse'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWeatherIcon((prev) => (prev + 1) % weatherIcons.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (isLogin) {
      // Login flow (NextAuth session)
      const res = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        callbackUrl: "/dashboard"
      });
      // Optionally handle errors or success UI here
    } else {
      // Register flow
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Registration failed");
      } else {
        setSuccess("Registration successful! Redirecting to login...");
        setTimeout(() => setIsLogin(true), 1500);
      }
    }
  };

  const WeatherIcon = weatherIcons[currentWeatherIcon];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white bg-opacity-10 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-blue-300 bg-opacity-20 rounded-full animate-bounce"></div>
        <div className="absolute bottom-32 left-20 w-40 h-40 bg-purple-300 bg-opacity-15 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-28 h-28 bg-indigo-300 bg-opacity-20 rounded-full animate-bounce"></div>
          </div>
          
      {/* Floating Weather Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-16 left-1/4 animate-float">
          <Cloud className="w-8 h-8 text-white text-opacity-30" />
        </div>
        <div className="absolute top-32 right-1/3 animate-float" style={{ animationDelay: '1s' }}>
          <Sun className="w-6 h-6 text-yellow-300 text-opacity-40" />
        </div>
        <div className="absolute bottom-40 left-1/3 animate-float" style={{ animationDelay: '2s' }}>
          <CloudRain className="w-7 h-7 text-blue-300 text-opacity-30" />
            </div>
          </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-8 items-center">
          
          {/* Left Side - Brand & Info */}
          <div className="text-center lg:text-left space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-center lg:justify-start space-x-3">
                <div className="relative">
                  <WeatherIcon className={`w-12 h-12 text-white ${weatherAnimations[currentWeatherIcon]}`} />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-ping"></div>
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold text-white">
                  Weather<span className="text-gradient bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Desk</span>
                </h1>
              </div>

              <p className="text-xl text-blue-100 max-w-md mx-auto lg:mx-0">
                Your personal weather command center. Get real-time forecasts, detailed analytics, and beautiful weather insights.
              </p>
                  </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0">
              <div className="flex items-center space-x-3 text-white">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="text-sm">Location-based forecasts</span>
              </div>

              <div className="flex items-center space-x-3 text-white">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Thermometer className="w-5 h-5" />
                </div>
                <span className="text-sm">Detailed analytics</span>
                </div>
              
              <div className="flex items-center space-x-3 text-white">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Wind className="w-5 h-5" />
                </div>
                <span className="text-sm">Wind & pressure data</span>
            </div>

              <div className="flex items-center space-x-3 text-white">
                <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Droplets className="w-5 h-5" />
                  </div>
                <span className="text-sm">Humidity tracking</span>
              </div>
            </div>
          </div>

          {/* Right Side - Auth Form */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-md">
              <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white border-opacity-20">
                
                {/* Form Toggle */}
                <div className="flex bg-white bg-opacity-10 rounded-2xl p-1 mb-8">
                  <button
                    type="button"
                    onClick={() => setIsLogin(true)}
                    className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                      isLogin 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
                        : 'text-white text-opacity-70 hover:text-opacity-100'
                    }`}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsLogin(false)}
                    className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                      !isLogin 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
                        : 'text-white text-opacity-70 hover:text-opacity-100'
                    }`}
                  >
                    Register
                  </button>
                      </div>

                {/* Form */}
                <form className="space-y-6" onSubmit={handleSubmit}>
                  {!isLogin && (
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white text-opacity-50" />
                      <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-4 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-xl text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:border-opacity-50 focus:bg-opacity-20 transition-all duration-300"
                        required={!isLogin}
                      />
                    </div>
                  )}

                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white text-opacity-50" />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-4 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-xl text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:border-opacity-50 focus:bg-opacity-20 transition-all duration-300"
                      required
                    />
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white text-opacity-50" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-12 py-4 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-xl text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:border-opacity-50 focus:bg-opacity-20 transition-all duration-300"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-opacity-50 hover:text-opacity-100 transition-all duration-300"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
            </div>

                  {!isLogin && (
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white text-opacity-50" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-4 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-xl text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:border-opacity-50 focus:bg-opacity-20 transition-all duration-300"
                        required={!isLogin}
                      />
                    </div>
                  )}

                  {isLogin && (
                    <div className="flex items-center justify-between">
                      <label className="flex items-center space-x-2 text-white text-opacity-70 text-sm">
                        <input type="checkbox" className="w-4 h-4 rounded border-white border-opacity-30 bg-transparent" />
                        <span>Remember me</span>
                      </label>
                      <button type="button" className="text-blue-300 hover:text-blue-200 text-sm transition-colors duration-300">
                        Forgot password?
                      </button>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    {isLogin ? 'Sign In to Dashboard' : 'Create Account'}
                  </button>
                </form>

                {/* Social Login */}
                <div className="mt-8 pt-6 border-t border-white border-opacity-20">
                  <p className="text-center text-white text-opacity-70 text-sm mb-4">Or continue with</p>
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                      className="flex-1 py-3 bg-white bg-opacity-10 hover:bg-opacity-20 text-white rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                      <span className="text-sm font-medium">Google</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .text-gradient {
          background: linear-gradient(45deg, #fbbf24, #f97316);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>
    </div>
  );
}