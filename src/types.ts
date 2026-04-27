export enum CareerGoal {
  JOB = 'job',
  FREELANCER = 'freelancer',
  FOUNDER = 'founder',
  CAREER_SWITCH = 'career_switch'
}

export enum SkillLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced'
}

export interface UserProfile {
  id?: string;
  email?: string;
  interests: string[];
  careerGoal: CareerGoal;
  timeAvailability: string; // e.g., "5 hours/week"
  skillLevel?: SkillLevel;
  knowledgeGaps?: string[];
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  platform: 'YouTube' | 'Coursera' | 'Udemy' | 'Khan Academy';
  difficulty: SkillLevel;
  duration: string;
  tags: string[];
  thumbnail?: string;
}

export interface RoadmapStep {
  title: string;
  level: SkillLevel;
  resources: Resource[];
  estimateHours: number;
  milestone: string;
}

export interface Roadmap {
  steps: RoadmapStep[];
  weeklySchedule: string[]; // List of strings explaining the plan
  recommendationReason: string;
}

export interface CareerPhase {
  phaseTitle: string;
  actions: string[];
  tools: string[];
  outcome: string;
}

export interface CareerProject {
  name: string;
  buildInstructions: string;
  skillsProved: string;
  realWorldValue: string;
}

export interface CareerActionPlanWeek {
  weekNumber: number;
  tasks: string[];
}

export interface ResourceLink {
  label: string;
  url: string;
  category: string;
}

export interface CareerGuidance {
  strategicOverview: {
    explanation: string;
    successMetrics3To6Months: string;
  };
  executionBlueprint: CareerPhase[];
  projectRoadmap: CareerProject[];
  marketStrategy: {
    validationOrPositioning: string;
    acquisitionOrNetworking: string;
    platforms: string[];
    fundingOrResumeAdvice: string;
  };
  opportunitiesExposure: {
    events: string[];
    communities: string[];
    platforms: string[];
  };
  resourceLinks: ResourceLink[];
  actionPlan4Weeks: CareerActionPlanWeek[];
  successMetrics: {
    progressDefinition: string;
    measurableCheckpoints: string[];
  };
}
