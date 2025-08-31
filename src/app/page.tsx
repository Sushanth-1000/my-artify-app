"use client";

import { useState } from "react";
import WelcomeScreen from "@/components/WelcomeScreen";
import MainLayout from "@/components/MainLayout";

export default function HomePage() {
  const [showWelcome, setShowWelcome] = useState(true);

  return (
    <>
      {showWelcome ? (
        <WelcomeScreen onFinish={() => setShowWelcome(false)} />
      ) : (
        <MainLayout />
      )}
    </>
  );
}

