/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { UserProfile, Roadmap, CareerGuidance, CareerGoal } from "./types";
import Onboarding from "./components/Onboarding";
import Assessment from "./components/Assessment";
import Dashboard from "./components/Dashboard";
import CareerEngine from "./components/CareerEngine";
import Login from "./components/Login";
import { auth, db } from "./lib/firebase";
import { onAuthStateChanged, User, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { handleFirestoreError, OperationType } from "./lib/firestoreUtils";
import { BookOpen, Brain, Briefcase, GraduationCap, Github, LogOut, User as UserIcon } from "lucide-react";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<"onboarding" | "assessment" | "dashboard" | "career">("onboarding");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [careerGuidance, setCareerGuidance] = useState<CareerGuidance | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchUserData(currentUser.uid);
      } else {
        setProfile(null);
        setRoadmap(null);
        setStep("onboarding");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const fetchUserData = async (uid: string) => {
    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setProfile(userSnap.data() as UserProfile);
        
        // Fetch last roadmap if exists
        const roadmapRef = doc(db, "roadmaps", `last_${uid}`);
        const roadmapSnap = await getDoc(roadmapRef);
        if (roadmapSnap.exists()) {
          setRoadmap(roadmapSnap.data() as Roadmap);
          setStep("dashboard");
        } else {
          setStep("assessment");
        }
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `users/${uid}`);
    }
  };

  const handleOnboardingComplete = async (newProfile: UserProfile) => {
    if (!user) return;
    try {
      const updatedProfile = { ...newProfile, uid: user.uid, updatedAt: new Date().toISOString() };
      await setDoc(doc(db, "users", user.uid), updatedProfile);
      setProfile(updatedProfile);
      setStep("assessment");
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
    }
  };

  const handleAssessmentComplete = async (results: any, generatedRoadmap: Roadmap) => {
    if (!user) return;
    try {
      const roadmapToSave = { ...generatedRoadmap, userId: user.uid, createdAt: new Date().toISOString() };
      await setDoc(doc(db, "roadmaps", `last_${user.uid}`), roadmapToSave);
      setRoadmap(roadmapToSave);
      setStep("dashboard");
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `roadmaps/last_${user.uid}`);
    }
  };

  const handleGoToCareer = (guidance: CareerGuidance) => {
    setCareerGuidance(guidance);
    setStep("career");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E4E3E0] flex items-center justify-center">
        <div className="font-mono text-xs uppercase animate-pulse">Initializing System...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      {/* Header */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center text-white font-bold shadow-sm">M</div>
          <h1 className="text-xl font-bold tracking-tight">AI Mentor Hub</h1>
        </div>
        
        <div className="flex items-center gap-6">
          {user && (
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold">{user.displayName || "Operator"}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-tighter">{profile?.careerGoal || "Evaluating"}</p>
              </div>
              {user.photoURL ? (
                <img src={user.photoURL} className="w-9 h-9 rounded-full border-2 border-indigo-100 object-cover" />
              ) : (
                <div className="w-9 h-9 bg-slate-100 rounded-full border-2 border-indigo-100 flex items-center justify-center text-slate-400">
                   <UserIcon size={16} />
                </div>
              )}
              <button 
                onClick={() => signOut(auth)} 
                className="ml-2 text-slate-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50"
                title="Sign Out"
              >
                 <LogOut size={16} />
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <aside className="w-20 lg:w-64 bg-white border-r border-slate-200 p-4 flex flex-col gap-2 shrink-0 overflow-y-auto">
          <NavItem icon={<BookOpen size={18} />} active={step === "onboarding"} onClick={() => setStep("onboarding")} label="Onboarding" disabled={!user} />
          <NavItem icon={<Brain size={18} />} active={step === "assessment"} onClick={() => setStep("assessment")} label="Knowledge Quiz" disabled={!profile || !user} />
          <NavItem icon={<GraduationCap size={18} />} active={step === "dashboard"} onClick={() => setStep("dashboard")} label="Learning Path" disabled={!roadmap || !user} />
          <NavItem icon={<Briefcase size={18} />} active={step === "career"} onClick={() => setStep("career")} label="Career Engine" disabled={!careerGuidance || !user} />
          
          <div className="mt-auto pt-6 border-t border-slate-100">
             <a 
              href="https://github.com" 
              target="_blank" 
              className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-indigo-600 transition-all rounded-xl hover:bg-indigo-50"
            >
              <Github size={20} />
              <span className="text-sm font-medium hidden lg:block">Repository</span>
            </a>
          </div>
        </aside>

        {/* Main Workspace */}
        <main className="flex-1 overflow-y-auto relative bg-slate-50/50">
          <AnimatePresence mode="wait">
            {!user ? (
              <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-8 lg:p-12 h-content">
                <Login />
              </motion.div>
            ) : (
              <div className="p-8 lg:p-10 max-w-6xl mx-auto w-full">
                {step === "onboarding" && (
                  <motion.div key="onboarding" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                    <Onboarding onComplete={handleOnboardingComplete} profileData={profile} />
                  </motion.div>
                )}

                {step === "assessment" && profile && (
                  <motion.div key="assessment" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                    <Assessment profile={profile} onComplete={handleAssessmentComplete} />
                  </motion.div>
                )}

                {step === "dashboard" && roadmap && profile && (
                  <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <Dashboard roadmap={roadmap} profile={profile} onGoToCareer={handleGoToCareer} />
                  </motion.div>
                )}

                {step === "career" && careerGuidance && profile && (
                  <motion.div key="career" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                    <CareerEngine guidance={careerGuidance} profile={profile} />
                  </motion.div>
                )}
              </div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Footer Status Bar */}
      <footer className="h-10 bg-slate-900 text-slate-400 px-6 flex items-center justify-between text-[10px] shrink-0 font-medium z-50">
        <div className="flex gap-6 uppercase tracking-wider">
          <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]"></div> Neural Core Active</span>
          <span className="hidden sm:inline">User Identity Verified</span>
          <span className="hidden sm:inline">Gemini v3 Flash Engine</span>
        </div>
        <div className="flex items-center gap-2">
          {user && <span className="opacity-60">{user.email}</span>}
          <span>AI Mentor Online</span>
        </div>
      </footer>
    </div>
  );
}

function NavItem({ icon, active, onClick, label, disabled }: { icon: React.ReactNode, active: boolean, onClick: () => void, label: string, disabled?: boolean }) {
  return (
    <button
      onClick={active ? undefined : onClick}
      disabled={disabled}
      className={`group flex items-center gap-3 w-full px-4 py-3.5 transition-all rounded-xl ${
        disabled ? "opacity-20 cursor-not-allowed grayscale" : ""
      } ${active ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "text-slate-500 hover:bg-slate-50 hover:text-indigo-600"}`}
    >
      <div className={`${active ? "text-white" : "text-slate-400 group-hover:text-indigo-600"} transition-colors`}>
        {icon}
      </div>
      <span className="text-sm font-semibold hidden lg:block tracking-tight">{label}</span>
    </button>
  );
}


