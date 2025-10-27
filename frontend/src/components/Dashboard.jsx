import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  LogOut, 
  Plus, 
  Search, 
  Copy, 
  Trash2, 
  Check, 
  X,
  Lock,
  Key,
  Globe,
  User,
  Settings,
  Bell,
  Cpu,
  Battery,
  Activity,
  Sparkles,
  Filter,
  Menu,
  Briefcase,
  Home,
  CreditCard,
  Download,
  Moon,
  Sun,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// Floating Particles Component
const FloatingParticles = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-blue-400/20 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 100 - 50, 0],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  );
};

// Navbar Component
const Navbar = ({ user, onLogout, onSettings, onNotifications }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          {/* Left Section - Brand */}
          <div className="navbar-brand">
            <motion.div 
              className="navbar-logo"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <Shield className="navbar-logo-icon" />
            </motion.div>
            <h1 className="navbar-title">CipherSafe</h1>
          </div>

          {/* Desktop User & Actions */}
          <div className="navbar-user">
            {/* User Info */}
            <div className="user-info">
              <div className="user-avatar">
                {user?.email?.charAt(0).toUpperCase() || 'T'}
              </div>
              <div className="user-details">
                <p className="user-email">{user?.email || 't@gmail.com'}</p>
                <p className="user-status">Secure</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="navbar-actions">
              <motion.button 
                className="navbar-btn" 
                onClick={onSettings}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Settings"
              >
                <Settings size={20} />
              </motion.button>
              
              <motion.button 
                className="navbar-btn relative" 
                onClick={onNotifications}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Notifications"
              >
                <Bell size={20} />
                <div className="notification-badge">3</div>
              </motion.button>
              
              <motion.button 
                className="logout-btn"
                onClick={onLogout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Logout"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </motion.button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={20} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mobile-menu-overlay"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="mobile-menu"
            >
              <div className="mobile-menu-header">
                <div className="flex items-center gap-3">
                  <div className="navbar-logo">
                    <Shield className="navbar-logo-icon" />
                  </div>
                  <h1 className="navbar-title">CipherSafe</h1>
                </div>
                <button 
                  className="mobile-menu-close"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mobile-user-info">
                <div className="user-avatar">
                  {user?.email?.charAt(0).toUpperCase() || 'T'}
                </div>
                <div className="user-details">
                  <p className="user-email">{user?.email || 't@gmail.com'}</p>
                  <p className="user-status">Secure</p>
                </div>
              </div>

              <div className="mobile-actions">
                <button 
                  className="mobile-action-btn"
                  onClick={() => {
                    onSettings();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <Settings size={20} />
                  <span>Settings</span>
                </button>
                
                <button 
                  className="mobile-action-btn relative"
                  onClick={() => {
                    onNotifications();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <Bell size={20} />
                  <span>Notifications</span>
                  <div className="notification-badge">3</div>
                </button>
                
                <button 
                  className="mobile-action-btn !text-red-400 !border-red-400/20 !bg-red-400/10"
                  onClick={() => {
                    onLogout();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

// Settings Panel Component
const SettingsPanel = ({ isOpen, onClose, showAlert, theme, setTheme }) => {
  const [settings, setSettings] = useState({
    autoLock: true,
    twoFactor: false,
    biometric: true,
    autoSync: true,
    passwordGenerator: true
  });

  const toggleSetting = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    showAlert(`${key.replace(/([A-Z])/g, ' $1')} ${!settings[key] ? 'enabled' : 'disabled'}`, 'success');
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    showAlert(`${newTheme === 'dark' ? 'Dark' : 'Light'} mode enabled`, 'success');
  };

  const SettingItem = ({ label, description, isEnabled, onToggle }) => (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
      <div className="flex-1 mr-4">
        <p className="text-white font-semibold text-base">{label}</p>
        <p className="text-gray-400 text-sm mt-1">{description}</p>
      </div>
      <button
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
          isEnabled ? 'bg-green-500' : 'bg-gray-600'
        }`}
        role="switch"
        aria-checked={isEnabled}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            isEnabled ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-xl flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className="bg-slate-800 rounded-3xl p-8 max-w-md w-full border border-white/10 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Settings</h2>
                <p className="text-gray-400 text-sm">Manage your security preferences</p>
              </div>
              <button 
                onClick={onClose} 
                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-8 max-h-[60vh] overflow-y-auto pr-2">
              {/* Appearance Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  {theme === 'dark' ? <Moon className="w-5 h-5 text-blue-400" /> : <Sun className="w-5 h-5 text-yellow-400" />}
                  <h3 className="text-lg font-semibold text-white">Appearance</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex-1 mr-4">
                      <p className="text-white font-semibold text-base">Dark Mode</p>
                      <p className="text-gray-400 text-sm mt-1">Use dark theme</p>
                    </div>
                    <button
                      onClick={toggleTheme}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        theme === 'dark' ? 'bg-green-500' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          theme === 'dark' ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Security Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-blue-400" />
                  <h3 className="text-lg font-semibold text-white">Security</h3>
                </div>
                
                <div className="space-y-3">
                  <SettingItem
                    label="Auto Lock"
                    description="Lock after 10 minutes of inactivity"
                    isEnabled={settings.autoLock}
                    onToggle={() => toggleSetting('autoLock')}
                  />
                  
                  <SettingItem
                    label="Two-Factor Authentication"
                    description="Require 2FA for login"
                    isEnabled={settings.twoFactor}
                    onToggle={() => toggleSetting('twoFactor')}
                  />
                  
                  <SettingItem
                    label="Biometric Unlock"
                    description="Use fingerprint or face recognition"
                    isEnabled={settings.biometric}
                    onToggle={() => toggleSetting('biometric')}
                  />
                </div>
              </div>

              {/* Preferences Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Settings className="w-5 h-5 text-purple-400" />
                  <h3 className="text-lg font-semibold text-white">Preferences</h3>
                </div>
                
                <div className="space-y-3">
                  <SettingItem
                    label="Auto Sync"
                    description="Automatically sync your vault"
                    isEnabled={settings.autoSync}
                    onToggle={() => toggleSetting('autoSync')}
                  />
                  
                  <SettingItem
                    label="Password Generator"
                    description="Suggest strong passwords"
                    isEnabled={settings.passwordGenerator}
                    onToggle={() => toggleSetting('passwordGenerator')}
                  />
                </div>
              </div>
            </div>

            <div className="flex space-x-4 mt-8 pt-6 border-t border-white/10">
              <button
                onClick={onClose}
                className="flex-1 py-3.5 rounded-2xl border-2 border-white/20 text-white font-semibold hover:bg-white/10 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-3.5 rounded-2xl bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-all duration-300 shadow-lg"
              >
                Save Settings
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Quick Actions Component
const QuickActions = ({ onAddPassword, onGeneratePassword, onExport, onSecurityCheck, showAlert, passwords }) => {
  const actions = [
    { 
      icon: Plus, 
      label: 'Add Password', 
      color: 'blue', 
      action: onAddPassword
    },
    { 
      icon: Key, 
      label: 'Generate', 
      color: 'green', 
      action: onGeneratePassword
    },
    { 
      icon: Shield, 
      label: 'Security', 
      color: 'purple', 
      action: onSecurityCheck
    },
    { 
      icon: Download, 
      label: 'Export', 
      color: 'yellow', 
      action: onExport
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-8"
    >
      <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={action.action}
            className={`p-4 rounded-2xl bg-${action.color}-500/10 border border-${action.color}-500/20 backdrop-blur-sm text-white flex flex-col items-center gap-3 hover:bg-${action.color}-500/20 transition-all duration-300 group`}
          >
            <div className={`p-3 rounded-2xl bg-${action.color}-500/20 group-hover:bg-${action.color}-500/30 transition-all duration-300`}>
              <action.icon className="w-6 h-6" />
            </div>
            <span className="text-sm font-semibold">{action.label}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

// Password Categories Component
const PasswordCategories = ({ passwords, onCategorySelect, selectedCategory }) => {
  const categories = [
    { id: 'all', name: 'All Passwords', icon: Globe, count: passwords.length, color: 'gray' },
    { id: 'social', name: 'Social Media', icon: User, count: passwords.filter(p => p.category === 'social').length, color: 'blue' },
    { id: 'work', name: 'Work', icon: Briefcase, count: passwords.filter(p => p.category === 'work').length, color: 'green' },
    { id: 'personal', name: 'Personal', icon: Home, count: passwords.filter(p => p.category === 'personal').length, color: 'purple' },
    { id: 'finance', name: 'Finance', icon: CreditCard, count: passwords.filter(p => p.category === 'finance').length, color: 'yellow' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="mb-8"
    >
      <h3 className="text-xl font-semibold text-white mb-4">Categories</h3>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {categories.map((category) => (
          <motion.button
            key={category.id}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onCategorySelect(category.id)}
            className={`flex items-center space-x-3 px-4 py-3 rounded-2xl border-2 min-w-max transition-all duration-300 ${
              selectedCategory === category.id
                ? `bg-${category.color}-500/20 border-${category.color}-500/50 text-white`
                : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
            }`}
          >
            <category.icon className="w-4 h-4" />
            <div className="text-left">
              <div className="font-semibold text-sm">{category.name}</div>
              <div className="text-xs opacity-70">{category.count} items</div>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

// Main Dashboard Component
function Dashboard() {
  const { user, logout } = useAuth();
  const [passwords, setPasswords] = useState([]);
  const [masterPassword, setMasterPassword] = useState('');
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newPassword, setNewPassword] = useState({
    website: '',
    username: user?.email || '',
    password: '',
    category: 'personal'
  });
  const [alert, setAlert] = useState({ message: '', type: '' });
  const [vaultUnlocked, setVaultUnlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    if (vaultUnlocked) {
      loadVault();
    }
  }, [vaultUnlocked]);

  useEffect(() => {
    if (user?.email) {
      setNewPassword(prev => ({ ...prev, username: user.email }));
    }
  }, [user?.email]);

  const showAlert = (message, type) => {
    setAlert({ message, type });
    setTimeout(() => setAlert({ message: '', type: '' }), 4000);
  };

  const loadVault = async () => {
    try {
      setIsLoading(true);
      setTimeout(() => {
        const mockPasswords = [
          {
            id: 1,
            website: 'google.com',
            username: user?.email || 'i@gmail.com',
            password: 'encrypted-password-1',
            strength: 85,
            category: 'personal',
            createdAt: new Date().toISOString()
          },
          {
            id: 2,
            website: 'github.com',
            username: user?.email || 'i@gmail.com',
            password: 'encrypted-password-2',
            strength: 92,
            category: 'work',
            createdAt: new Date().toISOString()
          },
          {
            id: 3,
            website: 'facebook.com',
            username: user?.email || 'i@gmail.com',
            password: 'encrypted-password-3',
            strength: 78,
            category: 'social',
            createdAt: new Date().toISOString()
          }
        ];
        setPasswords(mockPasswords);
        setIsLoading(false);
        showAlert('🔓 Vault unlocked successfully!', 'success');
      }, 1500);
    } catch (error) {
      console.error('Error loading vault:', error);
      showAlert('❌ Error loading vault', 'error');
      setIsLoading(false);
    }
  };

  const handleAddPassword = async (e) => {
    e.preventDefault();
    
    const updatedPasswords = [...passwords, { 
      ...newPassword, 
      id: Date.now(),
      createdAt: new Date().toISOString(),
      strength: calculatePasswordStrength(newPassword.password)
    }];
    
    setPasswords(updatedPasswords);
    setNewPassword({ 
      website: '', 
      username: user?.email || '',
      password: '',
      category: 'personal'
    });
    setShowPasswordForm(false);
    showAlert('🎉 Password added securely!', 'success');
  };

  const handleDeletePassword = async (id) => {
    const updatedPasswords = passwords.filter(pwd => pwd.id !== id);
    setPasswords(updatedPasswords);
    showAlert('🗑️ Password deleted', 'success');
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    showAlert(`📋 ${type} copied to clipboard!`, 'success');
  };

  const calculatePasswordStrength = (password) => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    return Math.min(strength, 100);
  };

  const generateStrongPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 16; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPassword({ ...newPassword, password });
    showAlert('🔐 Strong password generated!', 'success');
  };

  const exportPasswords = () => {
    if (passwords.length === 0) {
      showAlert('No passwords to export', 'warning');
      return;
    }
    const dataStr = JSON.stringify(passwords, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cipher-safe-passwords-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showAlert('📤 Passwords exported successfully!', 'success');
  };

  const runSecurityCheck = () => {
    const weakPasswords = passwords.filter(pwd => pwd.strength < 50);
    const duplicateWebsites = findDuplicateWebsites(passwords);
    
    let message = 'Security Check: ';
    if (weakPasswords.length > 0) {
      message += `${weakPasswords.length} weak passwords found. `;
    }
    if (duplicateWebsites.length > 0) {
      message += `${duplicateWebsites.length} duplicate websites found. `;
    }
    if (weakPasswords.length === 0 && duplicateWebsites.length === 0) {
      message = '✅ All passwords are secure!';
    }
    
    showAlert(message, weakPasswords.length > 0 || duplicateWebsites.length > 0 ? 'warning' : 'success');
  };

  const findDuplicateWebsites = (passwords) => {
    const seen = new Set();
    const duplicates = [];
    
    passwords.forEach(pwd => {
      if (seen.has(pwd.website)) {
        duplicates.push(pwd.website);
      } else {
        seen.add(pwd.website);
      }
    });
    
    return duplicates;
  };

  const emergencyLockdown = () => {
    setPasswords([]);
    setMasterPassword('');
    setVaultUnlocked(false);
    showAlert('🚨 Emergency lockdown activated! All data cleared.', 'warning');
  };

  const filteredPasswords = passwords
    .filter(pwd => 
      pwd.website.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pwd.username.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(pwd => 
      selectedCategory === 'all' || pwd.category === selectedCategory
    );

  const handleMasterPasswordSubmit = async (e) => {
    e.preventDefault();
    setVaultUnlocked(true);
  };

  const stats = [
    { icon: Shield, title: 'Security Score', value: '98%', subtitle: 'Excellent', color: 'green', delay: 0.1 },
    { icon: Battery, title: 'Passwords', value: passwords.length, subtitle: 'Total stored', color: 'blue', delay: 0.2 },
    { icon: Cpu, title: 'Encryption', value: 'AES-256', subtitle: 'Military grade', color: 'purple', delay: 0.3 },
    { icon: Activity, title: 'Last Sync', value: 'Now', subtitle: 'Up to date', color: 'yellow', delay: 0.4 },
  ];

  if (!vaultUnlocked) {
    return (
      <div className="min-h-screen animated-bg flex items-center justify-center p-4 relative overflow-hidden">
        <FloatingParticles />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="premium-card rounded-3xl p-8 max-w-md w-full relative z-10"
        >
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity }
              }}
              className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 flex items-center justify-center shadow-2xl relative overflow-hidden"
            >
              <Lock className="w-10 h-10 text-white" />
            </motion.div>
            
            <motion.h2 
              className="text-4xl font-bold text-white mb-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Unlock Your <span className="text-gradient">Vault</span>
            </motion.h2>
            <motion.p 
              className="text-gray-300 text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Enter your master password to access your secure passwords
            </motion.p>
          </motion.div>

          <form onSubmit={handleMasterPasswordSubmit} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Master Password
              </label>
              <div className="relative">
                <Key className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type="password"
                  value={masterPassword}
                  onChange={(e) => setMasterPassword(e.target.value)}
                  required
                  minLength="8"
                  className="input-field w-full pl-12 pr-4 py-4 rounded-2xl text-white placeholder-gray-400 focus:outline-none text-lg"
                  placeholder="Enter your master password"
                />
              </div>
            </motion.div>

            <motion.button
              whileHover={{ 
                scale: 1.05,
                y: -2,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="btn-primary w-full py-5 rounded-2xl text-white font-semibold text-lg flex items-center justify-center space-x-3 shadow-2xl"
            >
              <Lock className="w-6 h-6" />
              <span>Unlock Secure Vault</span>
              <Sparkles className="w-5 h-5" />
            </motion.button>
          </form>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={emergencyLockdown}
            className="w-full mt-4 p-4 rounded-2xl bg-red-500/20 border border-red-500/30 text-red-400 font-semibold flex items-center justify-center gap-2 hover:bg-red-500/30 transition-all duration-300"
          >
            <AlertTriangle size={20} />
            Emergency Lockdown
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen animated-bg relative overflow-hidden">
      <FloatingParticles />
      
      <Navbar 
        user={user}
        onLogout={logout}
        onSettings={() => setShowSettings(true)}
        onNotifications={() => setShowNotifications(true)}
      />

      <div className="main-content">
        <div className="container mx-auto px-6 py-8 relative z-10">
          {/* Alert */}
          <AnimatePresence>
            {alert.message && (
              <motion.div
                initial={{ opacity: 0, y: -100, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -100, scale: 0.8 }}
                className={`fixed top-24 left-1/2 transform -translate-x-1/2 z-50 px-6 py-4 rounded-2xl backdrop-blur-xl border-2 ${
                  alert.type === 'success' 
                    ? 'bg-green-500/20 border-green-500/40 text-green-300' 
                    : alert.type === 'warning'
                    ? 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300'
                    : 'bg-red-500/20 border-red-500/40 text-red-300'
                } shadow-2xl`}
              >
                <div className="flex items-center space-x-3">
                  {alert.type === 'success' ? 
                    <Check className="w-5 h-5" /> : 
                    alert.type === 'warning' ?
                    <AlertTriangle className="w-5 h-5" /> :
                    <X className="w-5 h-5" />
                  }
                  <span className="font-medium">{alert.message}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stats Cards */}
          <motion.div
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: stat.delay }}
                whileHover={{ 
                  scale: 1.05,
                  y: -5,
                  transition: { duration: 0.2 }
                }}
                className="premium-card rounded-3xl p-6 relative overflow-hidden group cursor-pointer"
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
                      <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
                      <p className="text-gray-500 text-xs mt-1">{stat.subtitle}</p>
                    </div>
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                      className="p-3 rounded-2xl bg-blue-500/20 backdrop-blur-sm"
                    >
                      <stat.icon className="w-6 h-6 text-blue-400" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Quick Actions */}
          <QuickActions 
            onAddPassword={() => setShowPasswordForm(true)}
            onGeneratePassword={generateStrongPassword}
            onExport={exportPasswords}
            onSecurityCheck={runSecurityCheck}
            showAlert={showAlert}
            passwords={passwords}
          />

          {/* Password Categories */}
          <PasswordCategories 
            passwords={passwords}
            onCategorySelect={setSelectedCategory}
            selectedCategory={selectedCategory}
          />

          {/* Search and Actions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col lg:flex-row gap-6 mb-8"
          >
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="🔍 Search passwords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 text-lg"
              />
            </div>

            {/* Filter and Add Buttons */}
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilterOptions(!showFilterOptions)}
                className="px-6 py-4 rounded-2xl border border-white/20 text-white font-semibold backdrop-blur-sm hover:bg-white/10 transition-all duration-300 flex items-center space-x-2"
              >
                <Filter className="w-5 h-5" />
                <span>Filter</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowPasswordForm(true)}
                className="px-8 py-4 rounded-2xl bg-blue-500 text-white font-semibold flex items-center space-x-3 shadow-2xl hover:bg-blue-600 transition-all duration-300"
              >
                <Plus className="w-5 h-5" />
                <span>Add Password</span>
                <Sparkles className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>

          {/* Filter Options */}
          {showFilterOptions && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-2xl bg-white/5 border border-white/10"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button 
                  onClick={() => setSearchTerm('')}
                  className="p-3 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 text-sm font-medium hover:bg-blue-500/30 transition-all duration-300"
                >
                  Clear Search
                </button>
                <button 
                  onClick={() => setSelectedCategory('all')}
                  className="p-3 rounded-xl bg-green-500/20 text-green-400 border border-green-500/30 text-sm font-medium hover:bg-green-500/30 transition-all duration-300"
                >
                  Show All
                </button>
                <button 
                  onClick={() => {
                    const weak = passwords.filter(p => p.strength < 50);
                    showAlert(`Found ${weak.length} weak passwords`, 'warning');
                  }}
                  className="p-3 rounded-xl bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 text-sm font-medium hover:bg-yellow-500/30 transition-all duration-300"
                >
                  Find Weak
                </button>
                <button 
                  onClick={() => {
                    const sorted = [...passwords].sort((a, b) => b.strength - a.strength);
                    setPasswords(sorted);
                    showAlert('Sorted by strength', 'success');
                  }}
                  className="p-3 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 text-sm font-medium hover:bg-purple-500/30 transition-all duration-300"
                >
                  Sort by Strength
                </button>
              </div>
            </motion.div>
          )}

          {/* Password List */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="premium-card rounded-3xl p-12 text-center">
                <div className="loading-dots mx-auto mb-6">
                  <div></div><div></div><div></div><div></div>
                </div>
                <p className="text-gray-400 text-lg">Loading your secure vault...</p>
              </div>
            ) : filteredPasswords.length === 0 ? (
              <div className="premium-card rounded-3xl p-12 text-center">
                <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center">
                  <Key className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">No Passwords Yet</h3>
                <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
                  Your secure vault is empty. Start by adding your first password to keep it safe and encrypted.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowPasswordForm(true)}
                  className="px-8 py-4 rounded-2xl bg-blue-500 text-white font-semibold flex items-center space-x-3 mx-auto shadow-2xl hover:bg-blue-600 transition-all duration-300"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Your First Password</span>
                  <Sparkles className="w-4 h-4" />
                </motion.button>
              </div>
            ) : (
              filteredPasswords.map((pwd, index) => (
                <motion.div
                  key={pwd.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ 
                    scale: 1.02,
                    y: -2,
                    transition: { duration: 0.2 }
                  }}
                  className="premium-card rounded-3xl p-6 cursor-pointer group relative overflow-hidden"
                >
                  <div className="relative z-10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        <motion.div
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.5 }}
                          className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg"
                        >
                          <Globe className="w-6 h-6 text-white" />
                        </motion.div>

                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-white mb-1 flex items-center space-x-2">
                            <span>{pwd.website}</span>
                            {pwd.strength >= 75 && (
                              <Shield className="w-4 h-4 text-green-400" />
                            )}
                          </h4>
                          
                          <p className="text-gray-400 flex items-center space-x-2">
                            <User className="w-4 h-4" />
                            <span>{pwd.username}</span>
                          </p>

                          <div className="flex items-center space-x-3 mt-3">
                            <div className="flex items-center space-x-2 flex-1">
                              <div className="w-20 bg-gray-700 rounded-full h-2 overflow-hidden">
                                <div 
                                  className={`h-2 rounded-full ${
                                    pwd.strength < 40 ? 'bg-red-500' : 
                                    pwd.strength < 70 ? 'bg-yellow-500' : 'bg-green-500'
                                  }`}
                                  style={{ width: `${pwd.strength}%` }}
                                />
                              </div>
                              <span className={`text-xs font-medium ${
                                pwd.strength < 40 ? 'text-red-400' : 
                                pwd.strength < 70 ? 'text-yellow-400' : 'text-green-400'
                              }`}>
                                {pwd.strength}%
                              </span>
                            </div>
                            
                            <span className="text-xs text-gray-500">
                              {new Date(pwd.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <motion.button
                          whileHover={{ scale: 1.1, y: -1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => { e.stopPropagation(); copyToClipboard(pwd.username, 'Username'); }}
                          className="p-3 rounded-2xl bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-all duration-300 backdrop-blur-sm"
                          title="Copy username"
                        >
                          <User className="w-4 h-4" />
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.1, y: -1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => { e.stopPropagation(); copyToClipboard(pwd.password, 'Password'); }}
                          className="p-3 rounded-2xl bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-all duration-300 backdrop-blur-sm"
                          title="Copy password"
                        >
                          <Key className="w-4 h-4" />
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.1, y: -1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => { e.stopPropagation(); handleDeletePassword(pwd.id); }}
                          className="p-3 rounded-2xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all duration-300 backdrop-blur-sm"
                          title="Delete password"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Emergency Lockdown Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={emergencyLockdown}
            className="w-full mt-8 p-4 rounded-2xl bg-red-500/20 border border-red-500/30 text-red-400 font-semibold flex items-center justify-center gap-2 hover:bg-red-500/30 transition-all duration-300"
          >
            <AlertTriangle size={20} />
            Emergency Lockdown
          </motion.button>
        </div>
      </div>

      {/* Add Password Modal */}
      <AnimatePresence>
        {showPasswordForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-xl flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              className="bg-slate-800 rounded-3xl p-8 max-w-md w-full border border-white/10 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-white">Add New Password</h3>
                <motion.button
                  whileHover={{ scale: 1.2, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowPasswordForm(false)}
                  className="p-2 rounded-2xl text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              <form onSubmit={handleAddPassword} className="space-y-6">
                {/* Website Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Website
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={newPassword.website}
                      onChange={(e) => setNewPassword({...newPassword, website: e.target.value})}
                      required
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all duration-300"
                      placeholder="Enter website (e.g., google.com)"
                    />
                  </div>
                </div>

                {/* Username Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={newPassword.username}
                      onChange={(e) => setNewPassword({...newPassword, username: e.target.value})}
                      required
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all duration-300"
                      placeholder="Enter username or email"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={newPassword.password}
                      onChange={(e) => setNewPassword({...newPassword, password: e.target.value})}
                      required
                      className="w-full pl-12 pr-32 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all duration-300"
                      placeholder="Enter secure password"
                    />
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={generateStrongPassword}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 rounded-xl bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30 transition-all duration-300 text-sm font-medium"
                    >
                      Generate
                    </motion.button>
                  </div>
                  
                  {/* Password Strength Meter */}
                  {newPassword.password && (
                    <div className="mt-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-400">Password Strength</span>
                        <span className={`text-sm font-semibold ${
                          calculatePasswordStrength(newPassword.password) < 40 ? 'text-red-400' : 
                          calculatePasswordStrength(newPassword.password) < 70 ? 'text-yellow-400' : 'text-green-400'
                        }`}>
                          {calculatePasswordStrength(newPassword.password) < 40 ? 'Weak' : 
                           calculatePasswordStrength(newPassword.password) < 70 ? 'Good' : 'Strong'}
                        </span>
                      </div>
                      
                      <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                        <motion.div
                          className={`h-2 rounded-full ${
                            calculatePasswordStrength(newPassword.password) < 40 ? 'bg-red-500' : 
                            calculatePasswordStrength(newPassword.password) < 70 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${calculatePasswordStrength(newPassword.password)}%` }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Category Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Category
                  </label>
                  <select
                    value={newPassword.category || 'personal'}
                    onChange={(e) => setNewPassword({...newPassword, category: e.target.value})}
                    className="w-full px-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all duration-300"
                  >
                    <option value="social">Social Media</option>
                    <option value="work">Work</option>
                    <option value="personal">Personal</option>
                    <option value="finance">Finance</option>
                  </select>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 pt-4">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowPasswordForm(false)}
                    className="flex-1 py-4 rounded-2xl border-2 border-white/20 text-white font-semibold backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 py-4 rounded-2xl bg-blue-500 text-white font-semibold flex items-center justify-center space-x-2 shadow-xl hover:bg-blue-600 transition-all duration-300"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Add Password</span>
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Panel */}
      <SettingsPanel 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)}
        showAlert={showAlert}
        theme={theme}
        setTheme={setTheme}
      />
    </div>
  );
}

export default Dashboard;