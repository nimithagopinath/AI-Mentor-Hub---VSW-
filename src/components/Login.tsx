import React from "react";
import { signInWithGoogle } from "../lib/firebase";
import { LogIn } from "lucide-react";

export default function Login() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-12">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-4xl mx-auto shadow-xl shadow-indigo-100 mb-8">
           M
        </div>
        <h2 className="text-4xl lg:text-6xl font-extrabold text-slate-800 tracking-tight leading-tight">
          Secure <br /> 
          <span className="text-indigo-600">Access Key</span>
        </h2>
        <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed">
          Authentication is required to synchronize your personalized learning data across the neural cloud.
        </p>
      </div>

      <button
        onClick={() => signInWithGoogle()}
        className="group flex items-center gap-4 px-10 py-5 bg-indigo-600 text-white rounded-2xl text-base font-bold hover:bg-indigo-700 hover:scale-[1.02] transition-all shadow-xl shadow-indigo-100"
      >
        <LogIn size={20} />
        Continue with Google
      </button>

      <div className="max-w-xs text-center">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-loose">
          Authorized nodes only. Data integrity verified by Firebase Security.
        </p>
      </div>
    </div>
  );
}
