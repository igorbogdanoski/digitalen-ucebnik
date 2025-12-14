
export enum ContentType {
  TEXT = 'TEXT',
  FRACTION_BLOCK = 'FRACTION_BLOCK',
  EXAMPLE = 'EXAMPLE',
  IMAGE = 'IMAGE',
  TIP = 'TIP',
  LATEX_BLOCK = 'LATEX_BLOCK',
  CHARACTER_SPEECH = 'CHARACTER_SPEECH',
  FRACTION_CARDS = 'FRACTION_CARDS' // New type specifically for the colored card exercises
}

export enum ExerciseType {
  INPUT = 'INPUT',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  MATCHING = 'MATCHING'
}

export interface Fraction {
  numerator: string | number;
  denominator: string | number;
  whole?: string | number; 
}

export interface FractionCardData {
  label: string;
  fraction: Fraction;
  color: string; // CSS class for background color
}

export interface ContentBlock {
  type: ContentType;
  content?: string; // Can serve as the LaTeX string
  fraction?: Fraction;
  imageSrc?: string;
  listItems?: string[]; // Can contain LaTeX strings
  label?: string; // Character name or Title
  audioText?: string; // Specific text for TTS if different from content
  cards?: FractionCardData[]; // For the new card component
}

export interface QuestionPart {
  id: string;
  label?: string;
  
  // Legacy/Helper fields
  preText?: string;
  postText?: string;
  fractionQuestion?: Fraction;
  
  // PRIMARY DISPLAY FIELD FOR MATH
  latex?: string; // If present, this overrides the basic text/fraction fields
  
  correctAnswer: string;
  placeholder?: string;
  type?: 'INPUT' | 'SELECT' | 'INFO'; // Added INFO for static content in practice
  inputType?: 'TEXT' | 'FRACTION'; // New field to specify input interface
  options?: string[]; 
}

export interface Exercise {
  id: string;
  title: string;
  instruction: string;
  questions: QuestionPart[];
  displayMode?: 'LIST' | 'TABLE'; // New field to control layout
}

export interface LessonSection {
  id: string;
  title: string;
  theory: ContentBlock[];
  practice: Exercise[];
}

export interface Chapter {
  id: string;
  title: string;
  lessons: LessonSection[];
}
