import { create } from "zustand";

const useApplicationStore = create((set) => ({
  started: false,
  token: "",
  // Personal Information
  personalInfo: {
    fullName: "",
    email: "",
    jobSearchStatus: "actively",
    agreedToTerms: false,
    agreedToTerms1: false,
    agreedToTerms2: false,
  },

  // BusinessType
  businessType: null,

  // Location
  location: {
    country: "",
    state: "",
    city: "",
    isMoving: false,
  },

  // Role and Skills
  selectedRoles: [],
  mainSkills: [],
  relevantSkills: [],

  // Experience and Rate
  experience: {},
  monthlyRate: null,

  // Preferences
  commitment: [],
  englishLevel: "",
  availability: {
    fullTime: "",
    partTime: "",
  },

  // Links
  links: {
    linkedin: "",
    github: "",
    custom: "",
  },

  // Quiz
  quizAnswers: [],

  // Actions
  setStart: (param) => set(() => ({ started: param })),
  setToken: (param) => set(() => ({ token: param })),
  setPersonalInfo: (info) =>
    set((state) => ({ personalInfo: { ...state.personalInfo, ...info } })),
  setLocation: (loc) =>
    set((state) => ({ location: { ...state.location, ...loc } })),
  setSelectedRoles: (roles) => set({ selectedRoles: roles }),
  setMainSkills: (skills) => set({ mainSkills: skills }),
  setRelevantSkills: (skills) => set({ relevantSkills: skills }),
  setExperience: (exp) =>
    set((state) => ({ experience: { ...state.experience, ...exp } })),
  setMonthlyRate: (rate) => set({ monthlyRate: rate }),
  setCommitment: (comm) => set({ commitment: comm }),
  setEnglishLevel: (level) => set({ englishLevel: level }),
  setAvailability: (avail) =>
    set((state) => ({ availability: { ...state.availability, ...avail } })),
  setLinks: (links) =>
    set((state) => ({ links: { ...state.links, ...links } })),
  addQuizAnswer: (answer) =>
    set((state) => ({ quizAnswers: [...state.quizAnswers, answer] })),
  setBusinessType: (businessType) => set({ businessType }),
}));

export default useApplicationStore;
