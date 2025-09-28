export interface Answer {
  text: string;
  category: string;
}

export interface Question {
  quiz_name: string;
  question: string;
  answers: {
    A: Answer;
    B: Answer;
    C: Answer;
    D: Answer;
  };
  type: "secure" | "insecure";
  order: number;
}

export interface QuestionnaireResponse {
  success: boolean;
  message: string;
  data: Question[];
}

export interface SurveyAnswer {
  questionIndex: number;
  questionOrder: number;
  selectedOption: "A" | "B" | "C" | "D";
  category: string;
  quizName: string;
}

export interface SurveySubmission {
  type: "secure" | "insecure";
  answers: SurveyAnswer[];
  completedAt: string;
}

// Insecure Survey Result (Pahlawan)
export interface InsecureArchetypeType {
  main: string;
  secondary: string;
}

export interface InsecureArchetype {
  type: InsecureArchetypeType;
  character: string;
  habits: string;
  description: string;
  power: string;
}

export interface InsecureLearn {
  mode: string;
  style: string;
}

export interface InsecureMission {
  first: {
    title: string;
    text: string;
  };
  second: {
    title: string;
    text: string;
  };
}

export interface InsecureSurveyResultData {
  archtype: InsecureArchetype;
  learn: InsecureLearn;
  fuel: string;
  mission: InsecureMission;
}

// Secure Survey Result (Navigator)
export interface SecureArchetype {
  primary: string;
  secondary: string;
  description: string;
}

export interface SecureSurveyResultData {
  archtype: SecureArchetype;
  archtype_character: string;
  archtype_values: string[];
  tools: string;
  ideal_field: string;
  carier_path: string[];
  personal_message: string;
  mission: {
    carier: string;
    practice: string;
  };
}

// Union type for both result formats
export type SurveyResultData =
  | SecureSurveyResultData
  | InsecureSurveyResultData;

// Type guards to distinguish between the two
export function isSecureResult(
  data: SurveyResultData
): data is SecureSurveyResultData {
  return "archtype_character" in data;
}

export function isInsecureResult(
  data: SurveyResultData
): data is InsecureSurveyResultData {
  return "learn" in data;
}

export interface SurveyResultResponse {
  success: boolean;
  message: string;
  data: SurveyResultData;
}
