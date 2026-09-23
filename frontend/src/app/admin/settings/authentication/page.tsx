"use client";
import React, { useEffect, useState } from 'react';
import { Mail, Phone, Globe, ShieldCheck } from 'lucide-react';

export default function SettingsAuthenticationPage() {
  const [settings, setSettings] = useState({
    enableEmail: true,
    enablePhone: false,
    enableGoogle: false,
    require2FA: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('http://localhost:3001/system-config/auth');
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
        }
      } catch (e) {
        console.error("Failed to fetch auth settings", e);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch('http://localhost:3001/system-config/auth', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      alert('Authentication settings saved successfully!');
    } catch (e) {
      console.error(e);
      alert('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  const ConfigOption = ({ title, desc, icon: Icon, configKey }: any) => {
    const isActive = settings[configKey as keyof typeof settings];
    return (
      <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl ${isActive ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-700 text-slate-400'}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-white font-bold">{title}</h3>
            <p className="text-slate-400 text-sm mt-1">{desc}</p>
          </div>
        </div>
        <button 
          onClick={() => handleToggle(configKey as keyof typeof settings)}
          className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${isActive ? 'bg-indigo-500' : 'bg-slate-600'}`}
        >
          <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${isActive ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      </div>
    );
  };

  if (loading) {
    return <div className="p-8 text-slate-400">Loading settings...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-300 w-full pb-12">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Settings &gt; Authentication</h1>
          <p className="text-slate-400 mt-2 text-sm">Configure how users log into the marketplace.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] disabled:opacity-50">
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </header>

      <div className="space-y-4">
        <ConfigOption 
          title="Email / Password Login" 
          desc="Allow users to sign up and log in using their email address and a password." 
          icon={Mail} 
          configKey="enableEmail" 
        />
        <ConfigOption 
          title="Phone / SMS Login" 
          desc="Allow users to authenticate via SMS One-Time Passwords (OTP)." 
          icon={Phone} 
          configKey="enablePhone" 
        />
        <ConfigOption 
          title="Google Single Sign-On" 
          desc="Allow 1-click registration and login via Google accounts." 
          icon={Globe} 
          configKey="enableGoogle" 
        />
        <ConfigOption 
          title="Require 2FA for Admin" 
          desc="Enforce Two-Factor Authentication for all Admin and Super Admin roles." 
          icon={ShieldCheck} 
          configKey="require2FA" 
        />
      </div>
    </div>
  );
}
