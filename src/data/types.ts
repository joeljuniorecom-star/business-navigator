/**
 * Domain types for Business Fit.
 * Everything here is source-agnostic: questions and businesses can later come
 * from a JSON file, a CMS or a database without touching the UI layer.
 */

export type TraitKey =
  | "tech"
  | "creative"
  | "social"
  | "sales"
  | "analytic"
  | "ops"
  | "patience"
  | "risk"
  | "capital"
  | "time"
  | "autonomy"
  | "structure"
  | "writing"
  | "video"
  | "b2b"
  | "b2c"
  | "reasoning";

export type Traits = Partial<Record<TraitKey, number>>;

export interface QuizModule {
  id: string;
  label: string;
  short: string;
  intro: string;
}

export interface Option {
  id: string;
  label: string;
  hint?: string;
  icon?: string;
  value?: number;
  traits?: Traits;
}

export type QuestionType =
  | "single"
  | "multi"
  | "scale"
  | "interest_scale"
  | "skill_scale"
  | "range_choice"
  | "country_select"
  | "slider"
  | "grid"
  | "matrix"
  | "sequence";

export interface Question {
  id: string;
  moduleId: string;
  type: QuestionType;
  title: string;
  subtitle?: string;
  /** Questions sharing a group id are displayed together on one screen. */
  group?: string;
  options?: Option[];
  /** multi */
  min?: number;
  max?: number;
  /** scale */
  scaleLabels?: [string, string];
  /** scale / slider trait mapping (value normalised 0..1 multiplied by traits) */
  traits?: Traits;
  /** slider */
  sliderMin?: number;
  sliderMax?: number;
  sliderStep?: number;
  sliderUnit?: string;
  sliderDefault?: number;
  /** matrix / sequence */
  cells?: string[];
  sequence?: string[];
  answerId?: string;
}

export type AnswerValue = string | string[] | number;
export type Answers = Record<string, AnswerValue>;

export interface Business {
  id: string;
  name: string;
  tagline: string;
  emoji: string;
  category: string;
  description: string;
  traits: Traits;
  capital: string;
  capitalMin: number;
  timeToFirstEuro: string;
  potential: string;
  difficulty: number;
  scalability: number;
  skills: string[];
  risks: string[];
  day: { time: string; task: string }[];
  why: string[];
}

export interface SubScores {
  profil: number;
  budget: number;
  competences: number;
  potentiel: number;
  style: number;
}

export interface BusinessResult {
  business: Business;
  score: number;
  sub: SubScores;
  reasons: string[];
}
