/**
 * CampusConnect — Air University Kamra Academic Constants & Taxonomy
 */

export const AU_CAMPUS_NAME = "Air University Kamra";
export const APP_NAME = "CampusConnect";
export const EMAIL_DOMAIN = ".edu.pk";

export const DEPARTMENTS = [
  { id: "cs", name: "Computer Science", code: "BSCS", icon: "Code2" },
  { id: "cyber", name: "Cyber Security", code: "BSCY", icon: "Shield" },
  { id: "ai", name: "Artificial Intelligence", code: "BSAI", icon: "Brain" },
  { id: "me", name: "Mechanical Engineering", code: "BSME", icon: "Wrench" },
  { id: "bba", name: "Business Administration", code: "BBA", icon: "Briefcase" },
  { id: "ae", name: "Aeronautical Engineering", code: "BSAE", icon: "Plane" },
];

export const BATCH_YEARS = [2021, 2022, 2023, 2024, 2025, 2026];

export const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

export const EXAM_TERMS = [
  { id: "midterm", label: "Midterm Examination" },
  { id: "final", label: "Final / Terminal Examination" },
];

export const ANNOUNCEMENT_CATEGORIES = [
  { id: "academic", label: "Academic & Exams", color: "blue" },
  { id: "admin", label: "Administration & Registrations", color: "purple" },
  { id: "urgent", label: "Urgent Advisories & Closures", color: "amber" },
  { id: "events", label: "Campus & Sports Events", color: "emerald" },
];

export const DEMO_USERS = {
  student: {
    id: "u-student-01",
    email: "farhan.220198@kamra.au.edu.pk",
    fullName: "Farhan Khattak",
    username: "farhankhattak",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    role: "student",
    department: "Cyber Security",
    studentId: "220198-BSCY",
    batchYear: 2022,
    bio: "Cyber Security undergraduate at AU Kamra. Passionate about reverse engineering, CTFs, and distributed systems.",
    followersCount: 142,
    followingCount: 89,
  },
  moderator: {
    id: "u-mod-01",
    email: "tariq.moderation@kamra.au.edu.pk",
    fullName: "Dr. Tariq Mahmood",
    username: "dr_tariq",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    role: "moderator",
    department: "Computer Science",
    studentId: "FAC-CS-041",
    batchYear: 2018,
    bio: "Associate Professor & Campus Disciplinary / Content Reviewer at Air University Kamra.",
    followersCount: 420,
    followingCount: 35,
  },
  faculty: {
    id: "u-faculty-01",
    email: "asim.dean@kamra.au.edu.pk",
    fullName: "Prof. Asim Munir",
    username: "prof_asim",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    role: "faculty",
    department: "Aeronautical Engineering",
    studentId: "FAC-AE-002",
    batchYear: 2015,
    bio: "Head of Academic Affairs & Faculty Advisor at AU Kamra. Official institutional notices & exam coordination.",
    followersCount: 890,
    followingCount: 12,
  },
  admin: {
    id: "u-admin-01",
    email: "admin.it@kamra.au.edu.pk",
    fullName: "AU Kamra IT Directorate",
    username: "au_it_admin",
    avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    role: "admin",
    department: "Administration",
    studentId: "ADMIN-AU-01",
    batchYear: 2012,
    bio: "System Administrator & Registrar Office Portal Manager. Oversees campus policy, security and user management.",
    followersCount: 1250,
    followingCount: 5,
  },
};
