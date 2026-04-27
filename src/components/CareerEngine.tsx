import React from "react";
import { CareerGuidance, UserProfile, CareerGoal } from "../types";
import { 
  Briefcase, Rocket, Globe, FileText, Monitor, TrendingUp, 
  ArrowRight, Zap, Target, Users, Landmark, LayoutDashboard,
  Calendar, CheckCircle2, ChevronRight, Settings, Layers, Download
} from "lucide-react";
import { motion } from "motion/react";

interface CareerEngineProps {
  guidance: CareerGuidance;
  profile: UserProfile;
}

export default function CareerEngine({ guidance, profile }: CareerEngineProps) {
  const downloadStrategy = () => {
    const content = `
# AI MENTOR HUB - CAREER STRATEGY DASHBOARD
**Objective:** ${profile.careerGoal.replace('_', ' ').toUpperCase()}

## STRATEGIC OVERVIEW
${guidance.strategicOverview.explanation}

**3-6 Month Success Metric:** ${guidance.strategicOverview.successMetrics3To6Months}

## EXECUTION BLUEPRINT
${guidance.executionBlueprint.map((phase, i) => `
### Phase 0${i + 1}: ${phase.phaseTitle}
- Actions: ${phase.actions.join(', ')}
- Tools: ${phase.tools.join(', ')}
- Outcome: ${phase.outcome}
`).join('\n')}

## PROJECT ROADMAP
${guidance.projectRoadmap.map((p, i) => `
### ${i + 1}. ${p.name}
- Build: ${p.buildInstructions}
- Skills: ${p.skillsProved}
- Value: ${p.realWorldValue}
`).join('\n')}

## MARKET STRATEGY
- Validation/Positioning: ${guidance.marketStrategy.validationOrPositioning}
- Acquisition/Networking: ${guidance.marketStrategy.acquisitionOrNetworking}
- Funding/Resume Advice: ${guidance.marketStrategy.fundingOrResumeAdvice}

## OPPORTUNITIES & EXPOSURE
- Events: ${guidance.opportunitiesExposure.events.join(', ')}
- Communities: ${guidance.opportunitiesExposure.communities.join(', ')}

## 4-WEEK ACTION PLAN
${guidance.actionPlan4Weeks.map(week => `
### Week ${week.weekNumber}
${week.tasks.map(t => `- ${t}`).join('\n')}
`).join('\n')}

## SUCCESS METRICS
- Progress Definition: ${guidance.successMetrics.progressDefinition}
- Checkpoints: ${guidance.successMetrics.measurableCheckpoints.join(', ')}
    `.trim();

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-mentor-career-strategy.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-12 max-w-5xl mx-auto pb-20"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-10">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600">
            <LayoutDashboard size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest leading-none">Career Engine v4.0</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-slate-800 tracking-tight leading-none leading-none">
            {profile.careerGoal === CareerGoal.FOUNDER ? "Founder Launchpad" : 
             profile.careerGoal === CareerGoal.JOB ? "Career Accelerator" :
             profile.careerGoal === CareerGoal.FREELANCER ? "Freelance Portal" : "Pivot Strategy"}
          </h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={downloadStrategy}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-orange-600 transition-all shadow-xl shadow-slate-200"
          >
            <Download size={18} /> Download Strategy
          </button>
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-800 rounded-2xl font-bold text-sm hover:border-indigo-400 transition-all shadow-sm"
          >
            <ArrowRight size={18} className="rotate-[-45deg]" /> Print PDF
          </button>
        </div>
      </div>

      {/* 🧭 1. Strategic Overview */}
      <motion.section variants={itemVariants} className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100">
            <Target size={20} />
          </div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Strategic Overview</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 p-8 bg-white border border-slate-200 rounded-[2.5rem] shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Globe size={12} /> The Mission Context
            </p>
            <p className="text-xl font-bold text-slate-700 leading-relaxed italic">
              "{guidance.strategicOverview.explanation}"
            </p>
          </div>
          <div className="p-8 bg-slate-900 text-white rounded-[2.5rem] shadow-xl shadow-slate-200 flex flex-col justify-center">
            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3 border-b border-white/10 pb-2">3–6 Month KPI</p>
            <p className="text-base font-bold leading-relaxed">{guidance.strategicOverview.successMetrics3To6Months}</p>
          </div>
        </div>
      </motion.section>

      {/* 🛠 2. Execution Roadmap (Phases) */}
      <motion.section variants={itemVariants} className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
            <Layers size={20} />
          </div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Execution Roadmap</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {guidance.executionBlueprint.map((phase, idx) => (
            <div key={idx} className={`p-6 rounded-3xl border transition-all ${
              idx === 0 
                ? "bg-slate-50 border-slate-200 opacity-60" 
                : "bg-white border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-200"
            }`}>
              <div className="flex justify-between items-start mb-4">
                <span className={`text-[10px] font-black uppercase tracking-widest ${idx === 0 ? "text-slate-400" : "text-indigo-500"}`}>
                  Phase 0{idx + 1}
                </span>
                {idx === 0 && <span className="text-[9px] font-bold text-slate-500 px-2 py-0.5 bg-slate-200 rounded-full">Completed</span>}
              </div>
              <h3 className="text-base font-black text-slate-800 mb-4">{phase.phaseTitle}</h3>
              
              {idx > 0 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Priority Actions</p>
                    <ul className="space-y-1.5">
                      {phase.actions.map((action, i) => (
                        <li key={i} className="text-[11px] font-bold text-slate-600 flex gap-2">
                          <CheckCircle2 size={12} className="text-indigo-400 shrink-0 mt-0.5" /> {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Toolstack</p>
                    <div className="flex flex-wrap gap-1">
                      {phase.tools.map((tool, i) => (
                        <span key={i} className="text-[9px] font-bold px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded border border-slate-200">{tool}</span>
                      ))}
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-50 text-indigo-600 font-bold text-[10px] uppercase">
                    Outcome: {phase.outcome}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.section>

      {/* 💻 3. Project Roadmap */}
      <motion.section variants={itemVariants} className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100">
            <Monitor size={20} />
          </div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Project Protocols</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {guidance.projectRoadmap.map((project, idx) => (
            <div key={idx} className="group bg-white border border-slate-100 rounded-[2rem] p-8 flex flex-col gap-6 hover:border-indigo-500 hover:shadow-2xl hover:shadow-indigo-50 transition-all">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 bg-slate-900 group-hover:bg-indigo-600 transition-colors rounded-2xl flex items-center justify-center text-white font-black text-lg">
                  {idx + 1}
                </div>
                <div className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-indigo-100 italic">
                  {project.skillsProved}
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-black text-slate-800">{project.name}</h3>
                <p className="text-sm font-medium text-slate-600 leading-relaxed min-h-[60px]">
                  {project.buildInstructions}
                </p>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3 mt-4">
                  <Zap size={16} className="text-indigo-500 shrink-0" />
                  <p className="text-xs font-bold text-slate-700">{project.realWorldValue}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* 📈 4. Strategy Section */}
        <motion.section variants={itemVariants} className="space-y-8">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
               <TrendingUp size={20} />
             </div>
             <h2 className="text-2xl font-black text-slate-800">Market Strategy</h2>
          </div>
          
          <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-indigo-100/50 space-y-8">
            <StrategyBlock icon={<Target className="text-indigo-400" />} title="Validation & Positioning" content={guidance.marketStrategy.validationOrPositioning} />
            <StrategyBlock icon={<Users className="text-indigo-400" />} title="Growth & Networking" content={guidance.marketStrategy.acquisitionOrNetworking} />
            <StrategyBlock icon={<FileText className="text-indigo-400" />} title="Strategic Advice" content={guidance.marketStrategy.fundingOrResumeAdvice} />
            
            <div className="pt-4 flex flex-wrap gap-2">
              {guidance.marketStrategy.platforms.map((p, i) => (
                <span key={i} className="px-4 py-2 bg-white/5 rounded-2xl text-[10px] font-black border border-white/10 hover:border-indigo-400 transition-colors uppercase tracking-widest">
                  {p}
                </span>
              ))}
            </div>
          </div>
        </motion.section>

        {/* 🌍 5. Opportunities & Exposure */}
        <motion.section variants={itemVariants} className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
              <Globe size={20} />
            </div>
            <h2 className="text-2xl font-black text-slate-800">Global Exposure</h2>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <div className="p-8 bg-white border border-slate-100 rounded-3xl shadow-sm space-y-6">
               <div className="space-y-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Users size={12} /> Communities & Circles
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {guidance.opportunitiesExposure.communities.map((item, i) => (
                      <span key={i} className="px-4 py-2 bg-slate-50 text-slate-800 text-[10px] font-bold rounded-xl border border-slate-100 uppercase tracking-tight">{item}</span>
                    ))}
                  </div>
               </div>

               <div className="space-y-4 pt-4 border-t border-slate-50">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Calendar size={12} /> Events & Hubs
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {guidance.opportunitiesExposure.events.map((item, i) => (
                      <span key={i} className="px-4 py-2 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-xl border border-indigo-100 uppercase tracking-tight">{item}</span>
                    ))}
                  </div>
               </div>

               <div className="space-y-4 pt-4 border-t border-slate-50">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 text-indigo-500">
                    <Zap size={12} /> Priority Links
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {guidance.resourceLinks.map((link, i) => (
                      <a 
                        key={i} 
                        href={link.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:border-indigo-400 hover:bg-white transition-all group"
                      >
                        <div className="flex flex-col">
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter mb-0.5">{link.category}</span>
                          <span className="text-xs font-bold text-slate-800 group-hover:text-indigo-600">{link.label}</span>
                        </div>
                        <ArrowRight size={14} className="text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                      </a>
                    ))}
                  </div>
               </div>
            </div>
          </div>
        </motion.section>
      </div>

      {/* 🗓 6. 4-Week Action Plan */}
      <motion.section variants={itemVariants} className="space-y-8 mt-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 border border-orange-100">
            <Calendar size={20} />
          </div>
          <h2 className="text-2xl font-black text-slate-800">Action Protocol: Week-by-Week</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {guidance.actionPlan4Weeks.map((week) => (
            <div key={week.weekNumber} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:border-orange-300 transition-all">
              <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-4">Sprint Week — 0{week.weekNumber}</p>
              <div className="space-y-3">
                {week.tasks.map((task, i) => (
                  <div key={i} className="flex gap-3 text-xs font-bold text-slate-700 leading-snug">
                    <div className="w-1.5 h-1.5 bg-orange-400 rounded-full shrink-0 mt-1" />
                    {task}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* 🚀 7. Success Metrics */}
      <motion.section variants={itemVariants} className="p-12 bg-slate-50 border border-slate-200 rounded-[3rem] text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-6 py-2 bg-white rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-500 border border-slate-200 shadow-sm">
           Verification Checkpoints
        </div>
        <div className="space-y-4">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Progress Threshold</p>
          <h2 className="text-3xl font-black text-slate-800 italic leading-snug">" {guidance.successMetrics.progressDefinition} "</h2>
        </div>
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          {guidance.successMetrics.measurableCheckpoints.map((cp, i) => (
            <div key={i} className="px-8 py-5 bg-white rounded-[2rem] border border-slate-200 text-sm font-black text-slate-800 uppercase tracking-tighter flex items-center gap-4 shadow-sm hover:border-indigo-400 transition-all">
              <div className="w-3 h-3 bg-green-500 rounded-full shadow-[0_0_12px_rgba(34,197,94,0.4)]" /> {cp}
            </div>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
}

function StrategyBlock({ icon, title, content }: { icon: React.ReactNode, title: string, content: string }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 text-[10px] uppercase font-black tracking-widest text-indigo-400 bg-white/5 w-fit px-3 py-1 rounded-lg">
        {icon} {title}
      </div>
      <p className="text-base font-semibold leading-relaxed opacity-90">{content}</p>
    </div>
  );
}
