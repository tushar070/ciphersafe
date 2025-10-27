import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, Unlock, Shield, Key, Eye, EyeOff, Cpu, 
  ArrowRight, Server, Smartphone, Laptop, Cloud,
  CheckCircle, XCircle, Clock, Zap
} from 'lucide-react';

const InteractiveSecurityDemo = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [inputText, setInputText] = useState('MySecretPassword123!');
  const [encryptedText, setEncryptedText] = useState('');
  const [showOriginal, setShowOriginal] = useState(false);

  const steps = [
    { title: 'Input Data', description: 'You enter your sensitive information' },
    { title: 'Client Encryption', description: 'Data encrypted on your device' },
    { title: 'Secure Transmission', description: 'Encrypted data sent to servers' },
    { title: 'Zero-Knowledge Storage', description: 'We never see your data' },
    { title: 'Secure Access', description: 'Only you can decrypt and access' }
  ];

  // Simulate encryption process
  useEffect(() => {
    if (isEncrypting) {
      const timer = setTimeout(() => {
        setEncryptedText(btoa(inputText).replace(/./g, '•'));
        setIsEncrypting(false);
        setActiveStep(2);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isEncrypting, inputText]);

  // Auto-advance demo
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isEncrypting && !isDecrypting) {
        setActiveStep((prev) => (prev + 1) % steps.length);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [isEncrypting, isDecrypting, steps.length]);

  const handleEncrypt = () => {
    setIsEncrypting(true);
    setActiveStep(1);
  };

  const handleDecrypt = () => {
    setIsDecrypting(true);
    setTimeout(() => {
      setIsDecrypting(false);
      setShowOriginal(true);
      setActiveStep(4);
    }, 1500);
  };

  const resetDemo = () => {
    setActiveStep(0);
    setIsEncrypting(false);
    setIsDecrypting(false);
    setShowOriginal(false);
    setEncryptedText('');
  };

  return (
    <section className="relative z-10 py-20 lg:py-32">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
            See The <span className="text-gradient">Magic</span> Happen
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Watch how your data stays secure from end to end with our zero-knowledge architecture
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          
          {/* Left Side - Process Visualization */}
          <div className="space-y-8">
            {/* Progress Steps */}
            <div className="space-y-6">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  className={`flex items-center space-x-4 p-4 rounded-2xl transition-all duration-300 ${
                    index === activeStep
                      ? 'bg-gradient-to-r from-cyan-500/20 to-purple-600/20 border border-cyan-500/30 shadow-lg'
                      : 'bg-gray-800/30 border border-gray-700/30'
                  }`}
                  whileHover={{ scale: 1.02 }}
                >
                  <motion.div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      index === activeStep
                        ? 'bg-gradient-to-br from-cyan-500 to-purple-600'
                        : 'bg-gray-700'
                    }`}
                    animate={{
                      scale: index === activeStep ? [1, 1.1, 1] : 1,
                    }}
                    transition={{ duration: 2, repeat: index === activeStep ? Infinity : 0 }}
                  >
                    {index === activeStep ? (
                      <Zap className="w-5 h-5 text-white" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-gray-400" />
                    )}
                  </motion.div>
                  <div className="flex-1">
                    <h3 className={`font-semibold ${
                      index === activeStep ? 'text-cyan-300' : 'text-gray-400'
                    }`}>
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-500">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Security Badges */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: Shield, label: 'AES-256', color: 'from-green-500 to-cyan-500' },
                { icon: Cpu, label: 'Client-Side', color: 'from-purple-500 to-pink-500' },
                { icon: Key, label: 'Zero-Knowledge', color: 'from-orange-500 to-red-500' },
              ].map((badge, index) => (
                <motion.div
                  key={index}
                  className="text-center p-4 rounded-xl bg-gray-800/30 border border-gray-700/30"
                  whileHover={{ y: -5 }}
                >
                  <div className={`w-12 h-12 mx-auto mb-2 rounded-xl bg-gradient-to-br ${badge.color} flex items-center justify-center`}>
                    <badge.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm text-gray-300 font-medium">{badge.label}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Side - Interactive Demo */}
          <div className="premium-card rounded-3xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              Live Encryption Demo
            </h3>

            {/* Data Flow Visualization */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <motion.div
                  className={`text-center flex-1 ${
                    activeStep >= 0 ? 'text-cyan-300' : 'text-gray-500'
                  }`}
                >
                  <Smartphone className="w-8 h-8 mx-auto mb-2" />
                  <span className="text-sm">Your Device</span>
                </motion.div>
                
                <motion.div
                  animate={{ x: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <ArrowRight className="w-6 h-6 text-cyan-400" />
                </motion.div>

                <motion.div
                  className={`text-center flex-1 ${
                    activeStep >= 2 ? 'text-cyan-300' : 'text-gray-500'
                  }`}
                >
                  <Cloud className="w-8 h-8 mx-auto mb-2" />
                  <span className="text-sm">Secure Cloud</span>
                </motion.div>
              </div>

              {/* Animated Connection Line */}
              <div className="relative h-2 bg-gray-700 rounded-full mb-8">
                <motion.div
                  className="absolute h-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ 
                    width: activeStep >= 2 ? '100%' : activeStep >= 1 ? '50%' : '0%' 
                  }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Input Section */}
            <div className="space-y-4 mb-6">
              <label className="text-gray-300 text-sm font-medium">Enter text to encrypt:</label>
              <div className="relative">
                <input
                  type={showOriginal ? "text" : "password"}
                  value={showOriginal ? inputText : encryptedText || inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="w-full p-4 rounded-xl bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                  placeholder="Enter sensitive data..."
                />
                <button
                  onClick={() => setShowOriginal(!showOriginal)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-300 transition-colors"
                >
                  {showOriginal ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Encryption Status */}
            <div className="mb-6 p-4 rounded-xl bg-gray-800/50 border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300 text-sm">Encryption Status:</span>
                <div className="flex items-center space-x-2">
                  {isEncrypting ? (
                    <>
                      <Clock className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-400 text-sm">Encrypting...</span>
                    </>
                  ) : encryptedText ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-green-400 text-sm">Encrypted</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-red-400" />
                      <span className="text-red-400 text-sm">Not Encrypted</span>
                    </>
                  )}
                </div>
              </div>
              
              {/* Encryption Bar */}
              <div className="w-full bg-gray-700 rounded-full h-2">
                <motion.div
                  className="h-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ 
                    width: isEncrypting ? '100%' : encryptedText ? '100%' : '0%' 
                  }}
                  transition={{ duration: isEncrypting ? 2 : 0.5 }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <motion.button
                onClick={handleEncrypt}
                disabled={isEncrypting || encryptedText}
                whileHover={{ scale: disabled ? 1 : 1.05 }}
                whileTap={{ scale: disabled ? 1 : 0.95 }}
                className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                  isEncrypting || encryptedText
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'cyber-button text-white'
                }`}
              >
                {isEncrypting ? (
                  <span className="flex items-center justify-center space-x-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Lock className="w-4 h-4" />
                    </motion.div>
                    <span>Encrypting...</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center space-x-2">
                    <Lock className="w-4 h-4" />
                    <span>Encrypt Data</span>
                  </span>
                )}
              </motion.button>

              <motion.button
                onClick={encryptedText ? handleDecrypt : resetDemo}
                disabled={isDecrypting}
                whileHover={{ scale: disabled ? 1 : 1.05 }}
                whileTap={{ scale: disabled ? 1 : 0.95 }}
                className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                  isDecrypting
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                }`}
              >
                {encryptedText ? (
                  isDecrypting ? (
                    <span className="flex items-center justify-center space-x-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Unlock className="w-4 h-4" />
                      </motion.div>
                      <span>Decrypting...</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center space-x-2">
                      <Unlock className="w-4 h-4" />
                      <span>Decrypt Data</span>
                    </span>
                  )
                ) : (
                  <span>Reset Demo</span>
                )}
              </motion.button>
            </div>

            {/* Security Explanation */}
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ 
                opacity: encryptedText ? 1 : 0,
                height: encryptedText ? 'auto' : 0 
              }}
              className="mt-6 p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20"
            >
              <h4 className="text-cyan-300 font-semibold mb-2">🔒 What Just Happened?</h4>
              <p className="text-cyan-100 text-sm">
                Your data was encrypted <strong>locally on your device</strong> before being transmitted. 
                Even if intercepted, the encrypted data is useless without your master password.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Additional Security Features */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {[
            {
              title: "End-to-End Encryption",
              description: "Your data is encrypted before it leaves your device and only decrypted when you access it.",
              icon: Shield
            },
            {
              title: "Zero-Knowledge Architecture",
              description: "We never have access to your encryption keys or unencrypted data.",
              icon: EyeOff
            },
            {
              title: "Military-Grade Algorithms",
              description: "Using AES-256, PBKDF2, and other industry-standard encryption protocols.",
              icon: Cpu
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="text-center p-6 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-purple-600/10 border border-cyan-500/20"
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-white font-semibold mb-2">{feature.title}</h4>
              <p className="text-gray-300 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default InteractiveSecurityDemo;