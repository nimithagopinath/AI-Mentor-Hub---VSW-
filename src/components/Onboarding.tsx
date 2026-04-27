import React, { useState } from "react";
import { UserProfile, CareerGoal, SkillLevel } from "../types";
import { ArrowRight, User, Target, Clock, Star, Zap } from "lucide-react";

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
  profileData?: UserProfile | null;
}

export default function Onboarding({ onComplete, profileData }: OnboardingProps) {
  const [profile, setProfile] = useState<Partial<UserProfile>>(profileData || {
    interests: [],
    careerGoal: CareerGoal.JOB,
    timeAvailability: "5 hours/week",
    skillLevel: SkillLevel.BEGINNER
  });

  const [interestInput, setInterestInput] = useState("");

  const addInterest = () => {
    if (interestInput.trim() && !profile.interests?.includes(interestInput.trim())) {
      setProfile({ ...profile, interests: [...(profile.interests || []), interestInput.trim()] });
      setInterestInput("");
    }
  };

  const removeInterest = (interest: string) => {
    setProfile({ ...profile, interests: profile.interests?.filter((i) => i !== interest) });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (profile.interests && profile.interests.length > 0) {
      onComplete(profile as UserProfile);
    }
  };

  return (
    <div className="space-y-12 max-w-2xl">
      <div className="space-y-4">
        <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 tracking-tight leading-tight">
          Configure Your <br /> 
          <span className="text-indigo-600">Learning Parameters</span>
        </h2>
        <p className="text-slate-500 text-sm leading-relaxed max-w-md">
          Define your current skill set and aspirations to initialize the neural synthesis for your personalized roadmap.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Interests */}
        <section className="space-y-4">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            01 — Skill Interests
          </label>
          <div className="flex gap-2 p-1.5 bg-white border border-slate-200 rounded-xl shadow-sm focus-within:border-indigo-300 focus-within:ring-4 focus-within:ring-indigo-50 transition-all">
            <input
              type="text"
              placeholder="e.g. Next.js, Cloud Arch, UI Design..."
              className="flex-1 bg-transparent px-4 py-2 text-sm focus:outline-none placeholder-slate-300"
              value={interestInput}
              onChange={(e) => setInterestInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addInterest())}
            />
            <button
              type="button"
              onClick={addInterest}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 active:scale-95 transition-all shadow-md shadow-indigo-100"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.interests?.map((interest) => (
              <span
                key={interest}
                onClick={() => removeInterest(interest)}
                className="px-3 py-1.5 bg-slate-100 text-[11px] font-semibold text-slate-600 rounded-lg hover:bg-red-50 hover:text-red-500 hover:border-red-100 border border-slate-100 cursor-pointer transition-all flex items-center gap-2"
              >
                {interest} <span className="opacity-40 text-xs">✕</span>
              </span>
            ))}
          </div>
        </section>

        {/* Career Goal */}
        <section className="space-y-4">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            02 — Strategic Objective
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.values(CareerGoal).map((goal) => (
              <button
                key={goal}
                type="button"
                onClick={() => setProfile({ ...profile, careerGoal: goal })}
                className={`py-3 px-2 rounded-xl text-xs font-bold transition-all border ${
                  profile.careerGoal === goal
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100"
                    : "bg-white text-slate-600 border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30"
                }`}
              >
                {goal.replace("_", " ")}
              </button>
            ))}
          </div>
        </section>

        {/* Skill Level */}
        <section className="space-y-4">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            03 — Self-Assessment Level
          </label>
          <div className="grid grid-cols-3 gap-3">
            {Object.values(SkillLevel).map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setProfile({ ...profile, skillLevel: level })}
                className={`py-3 px-2 rounded-xl text-xs font-bold transition-all border flex flex-col items-center gap-1 ${
                  profile.skillLevel === level
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100"
                    : "bg-white text-slate-600 border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30"
                }`}
              >
                <span className="capitalize">{level}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Time Availability */}
        <section className="space-y-4">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            04 — Periodic Bandwidth
          </label>
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <select
              value={profile.timeAvailability}
              onChange={(e) => setProfile({ ...profile, timeAvailability: e.target.value })}
              className="w-full bg-transparent px-4 py-3.5 text-sm font-medium text-slate-600 focus:outline-none appearance-none cursor-pointer"
            >
              <option value="2 hours/week text-slate-400">02 hrs / week — Lite Exploration</option>
              <option value="5 hours/week text-slate-400">05 hrs / week — Standard Growth</option>
              <option value="10 hours/week text-slate-400">10 hrs / week — Intensive Study</option>
              <option value="20 hours/week text-slate-400">20 hrs / week — Professional Immersion</option>
            </select>
          </div>
        </section>

        <button
          type="submit"
          disabled={!profile.interests || profile.interests.length === 0}
          className="w-full py-4 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-xl shadow-slate-200 hover:bg-slate-800 active:scale-[0.98] transition-all disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          Begin Roadmapping <ArrowRight size={18} />
        </button>
      </form>
    </div>
  );
}
