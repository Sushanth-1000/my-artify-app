"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface WelcomeScreenProps {
  onFinish: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 3000); // Auto-fade after 3 seconds

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <AnimatePresence>
      <motion.div
        key="welcome"
        className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-700 via-pink-600 to-red-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
      >
        <motion.h1
          className="text-white text-6xl font-extrabold drop-shadow-lg"
          initial={{ scale: 0.8, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 10 }}
        >
          Welcome to Artify
        </motion.h1>
      </motion.div>
    </AnimatePresence>
  );
};

export default WelcomeScreen;
