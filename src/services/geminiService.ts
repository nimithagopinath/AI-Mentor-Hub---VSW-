import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, Roadmap, CareerGuidance, SkillLevel, CareerGoal } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function generateAssessmentQuiz(profile: UserProfile) {
  const level = profile.skillLevel || SkillLevel.BEGINNER;
  const prompt = `Generate a 5-question technical quiz to assess the knowledge of a user who considers themselves at a ${level} level in ${profile.interests.join(", ")}.
  Goal: Becoming a ${profile.careerGoal}.
  
  For each question:
  - Provide a clear technical question.
  - Provide 4 distinct options.
  - Specify the 'correctAnswer' (the exact text of the correct option).
  - Provide an 'explanation' explaining why it's correct and common pitfalls.
  
  Return the quiz as a JSON array of objects.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctAnswer: { type: Type.STRING },
            explanation: { type: Type.STRING }
          },
          required: ["id", "question", "options", "correctAnswer", "explanation"]
        }
      }
    }
  });

  return JSON.parse(response.text);
}

export async function generateRoadmap(profile: UserProfile, assessmentResults: any): Promise<Roadmap> {
  const level = profile.skillLevel || SkillLevel.BEGINNER;
  const prompt = `Based on this user profile:
  Interests: ${profile.interests.join(", ")}
  Self-reported Level: ${level}
  Career Goal: ${profile.careerGoal}
  Time Availability: ${profile.timeAvailability}
  Technical Assessment Results: ${JSON.stringify(assessmentResults)}

  Generate a structured learning roadmap.
  Include 3 main steps (Phase 1, Phase 2, Phase 3).
  Adjust the difficulty of Phase 1 based on the reported level and assessment score.
  
  For each step, describe the learning goals and list 2 specific curated resources.

  CRITICAL LINKING GUIDELINES:
  - You MUST provide DIRECT links to specific resources, not search pages.
  - YouTube: Use "https://www.youtube.com/watch?v=[VIDEO_ID]" (Verify the ID matches a real video if possible)
  - Udemy: Use "https://www.udemy.com/course/[COURSE_SLUG]/"
  - Coursera: Use "https://www.coursera.org/learn/[COURSE_SLUG]"
  - Khan Academy: Use direct article or video links.
  
  Only recommend top-tier resources. For each resource, explain exactly why it was chosen.
  
  Also provide a weekly schedule and explain the recommendation reason.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          steps: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                level: { type: Type.STRING },
                estimateHours: { type: Type.NUMBER },
                milestone: { type: Type.STRING },
                resources: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      title: { type: Type.STRING },
                      description: { type: Type.STRING },
                      url: { type: Type.STRING },
                      platform: { type: Type.STRING },
                      difficulty: { type: Type.STRING },
                      duration: { type: Type.STRING },
                      tags: { type: Type.ARRAY, items: { type: Type.STRING } }
                    }
                  }
                }
              }
            }
          },
          weeklySchedule: { type: Type.ARRAY, items: { type: Type.STRING } },
          recommendationReason: { type: Type.STRING }
        },
        required: ["steps", "weeklySchedule", "recommendationReason"]
      }
    }
  });

  return JSON.parse(response.text);
}

export async function generateCareerGuidance(profile: UserProfile): Promise<CareerGuidance> {
  const prompt = `Role: You are an expert career strategist, startup advisor, and mentor for beginners. 
  Generate a structured, actionable Career Guidance Dashboard for "AI Mentor Hub".

  🎯 INPUT
  User Skill Level: ${profile.skillLevel}
  Domain: ${profile.interests.join(", ")}
  Strategic Objective: ${profile.careerGoal}

  ⚠️ STRICT RULES
  - ONLY generate content for the selected objective: ${profile.careerGoal}.
  - DO NOT mix multiple career paths.
  - DO NOT write long paragraphs. Use structured sections and bullet points.
  - Create beginner-friendly, actionable advice.
  - Include real platforms/tools (e.g., Y Combinator, Product Hunt, Upwork, LinkedIn).

  🧩 OUTPUT STRUCTURE
  1. Strategic Overview: 2-3 lines explaining the path and success in 3–6 months.
  2. Execution Roadmap: 4 phases (Foundation, Build, Launch/Apply, Scale). 
     - Phase 1 (Foundation) should be concise (covered in Learning Path).
     - Phase 2/3/4 must include: Key Actions, Tools/Platforms, and Outcome.
  3. Project Roadmap: 3–5 real projects. 
     - Founder: Startup ideas/MVPs.
     - Job: Portfolio-ready technical projects.
     - Freelance: Client-style work.
     - Switch: Bridge between old and new career.
  4. Strategy Section:
     - Founder: Validation, MVP approach, GTM, Funding (Bootstrap/Angel/YC), Launch (Product Hunt).
     - Job: Resume, Portfolio, Job Apps, Networking (LinkedIn), Interviews.
     - Freelance: Platforms (Upwork/Fiverr), First clients, Pricing, Credibility.
     - Switch: Leverage past exp, Skill mapping, Rebranding, Transition plan.
  5. Opportunities & Exposure: Communities, Events, Platforms, Hackathons (e.g. YC, Product Hunt, specific domain meetups).
  6. Resource Links: Provide 3-5 high-quality DIRECT links to relevant resources (e.g., YC Library, specific job boards, community URLs).
  7. 4-Week Action Plan: Task-based weekly plan.
  8. Success Metrics: Progress definition and measurable checkpoints.

  Return as JSON matching the schema.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          strategicOverview: {
            type: Type.OBJECT,
            properties: {
              explanation: { type: Type.STRING },
              successMetrics3To6Months: { type: Type.STRING }
            },
            required: ["explanation", "successMetrics3To6Months"]
          },
          executionBlueprint: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                phaseTitle: { type: Type.STRING },
                actions: { type: Type.ARRAY, items: { type: Type.STRING } },
                tools: { type: Type.ARRAY, items: { type: Type.STRING } },
                outcome: { type: Type.STRING }
              },
              required: ["phaseTitle", "actions", "tools", "outcome"]
            }
          },
          projectRoadmap: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                buildInstructions: { type: Type.STRING },
                skillsProved: { type: Type.STRING },
                realWorldValue: { type: Type.STRING }
              },
              required: ["name", "buildInstructions", "skillsProved", "realWorldValue"]
            }
          },
          marketStrategy: {
            type: Type.OBJECT,
            properties: {
              validationOrPositioning: { type: Type.STRING },
              acquisitionOrNetworking: { type: Type.STRING },
              platforms: { type: Type.ARRAY, items: { type: Type.STRING } },
              fundingOrResumeAdvice: { type: Type.STRING }
            },
            required: ["validationOrPositioning", "acquisitionOrNetworking", "platforms", "fundingOrResumeAdvice"]
          },
          opportunitiesExposure: {
            type: Type.OBJECT,
            properties: {
              events: { type: Type.ARRAY, items: { type: Type.STRING } },
              communities: { type: Type.ARRAY, items: { type: Type.STRING } },
              platforms: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["events", "communities", "platforms"]
          },
          resourceLinks: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                label: { type: Type.STRING },
                url: { type: Type.STRING },
                category: { type: Type.STRING }
              },
              required: ["label", "url", "category"]
            }
          },
          actionPlan4Weeks: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                weekNumber: { type: Type.NUMBER },
                tasks: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["weekNumber", "tasks"]
            }
          },
          successMetrics: {
            type: Type.OBJECT,
            properties: {
              progressDefinition: { type: Type.STRING },
              measurableCheckpoints: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["progressDefinition", "measurableCheckpoints"]
          }
        },
        required: [
          "strategicOverview", 
          "executionBlueprint", 
          "projectRoadmap", 
          "marketStrategy", 
          "opportunitiesExposure", 
          "resourceLinks",
          "actionPlan4Weeks", 
          "successMetrics"
        ]
      }
    }
  });

  return JSON.parse(response.text);
}
