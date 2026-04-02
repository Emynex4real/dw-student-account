// Course detail data — modules and comments per course.
// Mirrors the structure from MarketingPage. Replace with API calls when backend is ready.

export interface Lesson {
  id: number;
  title: string;
  duration: string;
  completed: boolean;
  active: boolean;
}

export interface CourseModule {
  title: string;
  lessons: Lesson[];
}

export interface Comment {
  id: number;
  user: string;
  date: string;
  text: string;
}

export interface ClassReplay {
  id: number;
  title: string;
  date: string;
  duration: string;
  instructor: string;
  active: boolean;
  assignmentUrl: string | null;
}

export interface CourseDetail {
  id: number;
  modules: CourseModule[];
  comments: Comment[];
  classReplays: ClassReplay[];
}

const courseDetails: CourseDetail[] = [
  {
    id: 1, // Digital Marketing Mastery
    modules: [
      {
        title: "Introduction to Digital Marketing",
        lessons: [
          { id: 1, title: "Introduction to Selling", duration: "12:45", completed: false, active: true },
          { id: 2, title: "Target Market Research", duration: "18:20", completed: false, active: false },
          { id: 3, title: "How to Sell to a Local Market", duration: "15:10", completed: false, active: false },
          { id: 4, title: "Sales Funnel & Psychology of Sales", duration: "22:05", completed: false, active: false },
        ],
      },
      {
        title: "Facebook Ads",
        lessons: [
          { id: 5, title: "How to Create a Facebook Page", duration: "10:15", completed: false, active: false },
          { id: 6, title: "Creating a Business Manager", duration: "14:30", completed: false, active: false },
          { id: 7, title: "Intro to Facebook Ads", duration: "25:00", completed: false, active: false },
          { id: 8, title: "How to Setup Re-targeting Ads", duration: "19:45", completed: false, active: false },
        ],
      },
      {
        title: "Google & SEO",
        lessons: [
          { id: 9, title: "Introduction to Google Apps", duration: "11:20", completed: false, active: false },
          { id: 10, title: "Understanding How SEO Works", duration: "30:15", completed: false, active: false },
          { id: 11, title: "Google Search Ads", duration: "28:40", completed: false, active: false },
        ],
      },
      {
        title: "WordPress",
        lessons: [
          { id: 12, title: "How to Install WordPress", duration: "15:00", completed: false, active: false },
          { id: 13, title: "How to Buy a Domain Name", duration: "08:50", completed: false, active: false },
          { id: 14, title: "Building a Landing Page", duration: "45:20", completed: false, active: false },
        ],
      },
    ],
    comments: [
      { id: 1, user: "Fred Chukwuemeka Ekpeti", date: "2026-01-16", text: "It was a very informative and engaging lecture. The concepts were explained clearly and were easy to relate to real-life applications. I am pleased to be a student here." },
      { id: 2, user: "Giveaway User", date: "2026-01-15", text: "I am really overwhelmed going through the courses." },
      { id: 3, user: "Anonymous User", date: "2025-12-23", text: "You are so wonderful. To be part of this program is an opportunity. Forward ever, backward never." },
      { id: 4, user: "Giveaway User", date: "2025-12-14", text: "I cannot download the courses. The Download button is not getting the courses for me. Please help me." },
    ],
    classReplays: [
      { id: 1, title: "Live Class 1 — Introduction & Course Overview", date: "Jan 10, 2026", duration: "1h 52m", instructor: "Lex Olowo", active: true, assignmentUrl: "/assignments/dm-class1-assignment.pdf" },
      { id: 2, title: "Live Class 2 — Facebook Ads Deep Dive", date: "Jan 17, 2026", duration: "2h 05m", instructor: "Lex Olowo", active: false, assignmentUrl: "/assignments/dm-class2-assignment.pdf" },
      { id: 3, title: "Live Class 3 — Google Ads & SEO Q&A", date: "Jan 24, 2026", duration: "1h 38m", instructor: "Lex Olowo", active: false, assignmentUrl: "/assignments/dm-class3-assignment.pdf" },
      { id: 4, title: "Live Class 4 — WordPress Setup Walkthrough", date: "Jan 31, 2026", duration: "1h 45m", instructor: "Lex Olowo", active: false, assignmentUrl: null },
    ],
  },
  {
    id: 2, // Advanced Web Development Bootcamp
    modules: [
      {
        title: "HTML & CSS Foundations",
        lessons: [
          { id: 1, title: "Structure of a Web Page", duration: "14:00", completed: true, active: false },
          { id: 2, title: "CSS Box Model & Flexbox", duration: "22:30", completed: true, active: false },
          { id: 3, title: "Responsive Design with Media Queries", duration: "18:45", completed: false, active: true },
          { id: 4, title: "CSS Grid Layout", duration: "20:10", completed: false, active: false },
        ],
      },
      {
        title: "JavaScript & React",
        lessons: [
          { id: 5, title: "ES6+ Fundamentals", duration: "30:00", completed: false, active: false },
          { id: 6, title: "React Components & Props", duration: "25:15", completed: false, active: false },
          { id: 7, title: "State Management with Hooks", duration: "28:00", completed: false, active: false },
          { id: 8, title: "React Router & Navigation", duration: "22:40", completed: false, active: false },
        ],
      },
      {
        title: "Node.js & Backend",
        lessons: [
          { id: 9, title: "Node.js Basics & Express", duration: "35:00", completed: false, active: false },
          { id: 10, title: "REST API Design", duration: "40:20", completed: false, active: false },
          { id: 11, title: "Authentication with JWT", duration: "32:15", completed: false, active: false },
        ],
      },
      {
        title: "Databases & Deployment",
        lessons: [
          { id: 12, title: "MongoDB & Mongoose", duration: "28:00", completed: false, active: false },
          { id: 13, title: "Deploying with Vercel & Railway", duration: "20:00", completed: false, active: false },
          { id: 14, title: "CI/CD Pipeline Basics", duration: "18:30", completed: false, active: false },
        ],
      },
    ],
    comments: [
      { id: 1, user: "Chidi Okafor", date: "2026-02-10", text: "The React section is incredibly well structured. I finally understand hooks after watching this." },
      { id: 2, user: "Amara Nwosu", date: "2026-02-08", text: "Best web dev course I've taken. The projects are real-world and very practical." },
      { id: 3, user: "Tunde Adeyemi", date: "2026-01-30", text: "The Node.js section is a bit fast but overall excellent content." },
    ],
    classReplays: [
      { id: 1, title: "Live Class 1 — HTML & CSS Foundations Review", date: "Feb 3, 2026", duration: "2h 10m", instructor: "Michael Balogun", active: true, assignmentUrl: "/assignments/wd-class1-assignment.pdf" },
      { id: 2, title: "Live Class 2 — React Hooks & State Management", date: "Feb 10, 2026", duration: "2h 30m", instructor: "Michael Balogun", active: false, assignmentUrl: "/assignments/wd-class2-assignment.pdf" },
      { id: 3, title: "Live Class 3 — Building a REST API with Node.js", date: "Feb 17, 2026", duration: "2h 15m", instructor: "Michael Balogun", active: false, assignmentUrl: "/assignments/wd-class3-assignment.pdf" },
      { id: 4, title: "Live Class 4 — Deploying Full-Stack Apps", date: "Feb 24, 2026", duration: "1h 55m", instructor: "Michael Balogun", active: false, assignmentUrl: null },
      { id: 5, title: "Live Class 5 — Code Review & Project Q&A", date: "Mar 3, 2026", duration: "1h 40m", instructor: "Michael Balogun", active: false, assignmentUrl: "/assignments/wd-class5-assignment.pdf" },
    ],
  },
  {
    id: 3, // UI/UX Design Fundamentals
    modules: [
      {
        title: "Design Thinking",
        lessons: [
          { id: 1, title: "What is UX Design?", duration: "10:00", completed: false, active: true },
          { id: 2, title: "User Research Methods", duration: "20:15", completed: false, active: false },
          { id: 3, title: "Empathy Maps & Personas", duration: "17:30", completed: false, active: false },
        ],
      },
      {
        title: "Wireframing & Prototyping",
        lessons: [
          { id: 4, title: "Low-Fidelity Wireframes", duration: "15:20", completed: false, active: false },
          { id: 5, title: "High-Fidelity Mockups in Figma", duration: "35:00", completed: false, active: false },
          { id: 6, title: "Interactive Prototyping", duration: "28:45", completed: false, active: false },
        ],
      },
      {
        title: "UI Design Principles",
        lessons: [
          { id: 7, title: "Color Theory & Typography", duration: "22:00", completed: false, active: false },
          { id: 8, title: "Design Systems & Component Libraries", duration: "30:10", completed: false, active: false },
          { id: 9, title: "Accessibility in UI Design", duration: "18:00", completed: false, active: false },
        ],
      },
      {
        title: "Usability Testing",
        lessons: [
          { id: 10, title: "Planning a Usability Test", duration: "12:30", completed: false, active: false },
          { id: 11, title: "Analysing Test Results", duration: "16:00", completed: false, active: false },
        ],
      },
    ],
    comments: [
      { id: 1, user: "Ngozi Eze", date: "2026-01-20", text: "Sarah is an amazing teacher. The Figma tutorials alone are worth the price." },
      { id: 2, user: "Emeka Obi", date: "2026-01-18", text: "I went from zero design knowledge to building my first portfolio. Highly recommend." },
      { id: 3, user: "Fatima Bello", date: "2026-01-10", text: "Would love more content on mobile design patterns but overall great course." },
    ],
    classReplays: [
      { id: 1, title: "Live Class 1 — Design Thinking Workshop", date: "Jan 12, 2026", duration: "1h 30m", instructor: "Sarah Johnson", active: true, assignmentUrl: "/assignments/ux-class1-assignment.pdf" },
      { id: 2, title: "Live Class 2 — Figma Prototyping Live Session", date: "Jan 19, 2026", duration: "2h 00m", instructor: "Sarah Johnson", active: false, assignmentUrl: "/assignments/ux-class2-assignment.pdf" },
      { id: 3, title: "Live Class 3 — Portfolio Review & Feedback", date: "Jan 26, 2026", duration: "1h 45m", instructor: "Sarah Johnson", active: false, assignmentUrl: null },
    ],
  },
  {
    id: 4, // Data Science & Machine Learning
    modules: [
      {
        title: "Python for Data Science",
        lessons: [
          { id: 1, title: "Python Basics & Data Types", duration: "20:00", completed: true, active: false },
          { id: 2, title: "NumPy & Pandas Essentials", duration: "35:30", completed: false, active: true },
          { id: 3, title: "Data Cleaning & Preprocessing", duration: "28:15", completed: false, active: false },
        ],
      },
      {
        title: "Data Visualisation",
        lessons: [
          { id: 4, title: "Matplotlib & Seaborn", duration: "25:00", completed: false, active: false },
          { id: 5, title: "Interactive Charts with Plotly", duration: "20:45", completed: false, active: false },
          { id: 6, title: "Building Dashboards", duration: "30:00", completed: false, active: false },
        ],
      },
      {
        title: "Machine Learning Fundamentals",
        lessons: [
          { id: 7, title: "Supervised vs Unsupervised Learning", duration: "22:00", completed: false, active: false },
          { id: 8, title: "Linear & Logistic Regression", duration: "40:00", completed: false, active: false },
          { id: 9, title: "Decision Trees & Random Forests", duration: "35:20", completed: false, active: false },
          { id: 10, title: "Model Evaluation & Tuning", duration: "30:00", completed: false, active: false },
        ],
      },
      {
        title: "Deep Learning & TensorFlow",
        lessons: [
          { id: 11, title: "Neural Networks Explained", duration: "45:00", completed: false, active: false },
          { id: 12, title: "Building Models with TensorFlow", duration: "50:00", completed: false, active: false },
          { id: 13, title: "Deploying ML Models", duration: "28:00", completed: false, active: false },
        ],
      },
    ],
    comments: [
      { id: 1, user: "Yusuf Lawal", date: "2026-02-20", text: "Dr. Emmanuel breaks down complex concepts so well. The ML section is gold." },
      { id: 2, user: "Chioma Okonkwo", date: "2026-02-15", text: "I had no data science background and now I can build models. Incredible course." },
    ],
    classReplays: [
      { id: 1, title: "Live Class 1 — Python & Pandas Hands-On", date: "Feb 5, 2026", duration: "2h 20m", instructor: "Dr. Emmanuel Ade", active: true, assignmentUrl: "/assignments/ds-class1-assignment.pdf" },
      { id: 2, title: "Live Class 2 — Data Visualisation with Seaborn", date: "Feb 12, 2026", duration: "1h 50m", instructor: "Dr. Emmanuel Ade", active: false, assignmentUrl: "/assignments/ds-class2-assignment.pdf" },
      { id: 3, title: "Live Class 3 — ML Model Building Workshop", date: "Feb 19, 2026", duration: "2h 40m", instructor: "Dr. Emmanuel Ade", active: false, assignmentUrl: null },
      { id: 4, title: "Live Class 4 — TensorFlow Deep Dive & Q&A", date: "Feb 26, 2026", duration: "2h 15m", instructor: "Dr. Emmanuel Ade", active: false, assignmentUrl: "/assignments/ds-class4-assignment.pdf" },
    ],
  },
  {
    id: 5, // Financial Literacy & Investment
    modules: [
      {
        title: "Money Fundamentals",
        lessons: [
          { id: 1, title: "Understanding Your Income & Expenses", duration: "14:00", completed: false, active: true },
          { id: 2, title: "Budgeting Strategies That Work", duration: "18:30", completed: false, active: false },
          { id: 3, title: "Building an Emergency Fund", duration: "12:00", completed: false, active: false },
        ],
      },
      {
        title: "Saving & Investing",
        lessons: [
          { id: 4, title: "The Power of Compound Interest", duration: "16:45", completed: false, active: false },
          { id: 5, title: "Stocks, Bonds & Mutual Funds", duration: "25:00", completed: false, active: false },
          { id: 6, title: "Introduction to Crypto Assets", duration: "22:10", completed: false, active: false },
        ],
      },
      {
        title: "Nigerian Financial Landscape",
        lessons: [
          { id: 7, title: "How the NSE Works", duration: "20:00", completed: false, active: false },
          { id: 8, title: "Investing with Cowrywise & Risevest", duration: "15:30", completed: false, active: false },
          { id: 9, title: "Real Estate as an Investment", duration: "28:00", completed: false, active: false },
        ],
      },
    ],
    comments: [
      { id: 1, user: "Blessing Osei", date: "2026-03-01", text: "This course changed how I think about money. I've already started investing!" },
      { id: 2, user: "Rotimi Adesanya", date: "2026-02-25", text: "The Nigerian financial tools section is very relevant and practical." },
      { id: 3, user: "Adaeze Mba", date: "2026-02-20", text: "Clear, simple, and actionable. Exactly what financial education should look like." },
    ],
    classReplays: [
      { id: 1, title: "Live Class 1 — Flutter Setup & First App", date: "Mar 5, 2026", duration: "1h 25m", instructor: "Chioma Nnamdi", active: true, assignmentUrl: "/assignments/flutter-class1-assignment.pdf" },
      { id: 2, title: "Live Class 2 — Widgets & Layouts Deep Dive", date: "Mar 12, 2026", duration: "1h 50m", instructor: "Chioma Nnamdi", active: false, assignmentUrl: null },
      { id: 3, title: "Live Class 3 — State Management & Navigation Q&A", date: "Mar 19, 2026", duration: "1h 35m", instructor: "Chioma Nnamdi", active: false, assignmentUrl: "/assignments/flutter-class3-assignment.pdf" },
    ],
  },
  {
    id: 6, // Public Speaking & Communication
    modules: [
      {
        title: "Foundations of Communication",
        lessons: [
          { id: 1, title: "Why Communication Skills Matter", duration: "10:00", completed: false, active: true },
          { id: 2, title: "Verbal vs Non-verbal Communication", duration: "15:20", completed: false, active: false },
          { id: 3, title: "Active Listening Techniques", duration: "12:45", completed: false, active: false },
        ],
      },
      {
        title: "Public Speaking Mastery",
        lessons: [
          { id: 4, title: "Overcoming Stage Fright", duration: "18:00", completed: false, active: false },
          { id: 5, title: "Structuring a Compelling Speech", duration: "22:30", completed: false, active: false },
          { id: 6, title: "Storytelling for Impact", duration: "25:00", completed: false, active: false },
          { id: 7, title: "Handling Q&A Sessions", duration: "14:15", completed: false, active: false },
        ],
      },
      {
        title: "Professional Communication",
        lessons: [
          { id: 8, title: "Email & Written Communication", duration: "16:00", completed: false, active: false },
          { id: 9, title: "Presenting with Slides Effectively", duration: "20:00", completed: false, active: false },
          { id: 10, title: "Negotiation & Persuasion", duration: "28:00", completed: false, active: false },
        ],
      },
    ],
    comments: [
      { id: 1, user: "Kelechi Eze", date: "2026-03-10", text: "I presented at a conference last week using techniques from this course. It went amazingly well!" },
      { id: 2, user: "Zainab Umar", date: "2026-03-05", text: "The storytelling module alone is worth it. My presentations have improved drastically." },
    ],
    classReplays: [
      { id: 1, title: "Live Class 1 — Cybersecurity Fundamentals & Threat Landscape", date: "Mar 7, 2026", duration: "1h 20m", instructor: "James Okonkwo", active: true, assignmentUrl: "/assignments/cyber-class1-assignment.pdf" },
      { id: 2, title: "Live Class 2 — Network Security & Firewalls Q&A", date: "Mar 14, 2026", duration: "1h 45m", instructor: "James Okonkwo", active: false, assignmentUrl: "/assignments/cyber-class2-assignment.pdf" },
      { id: 3, title: "Live Class 3 — Ethical Hacking Live Demo", date: "Mar 21, 2026", duration: "2h 00m", instructor: "James Okonkwo", active: false, assignmentUrl: null },
    ],
  },
];

export function getCourseDetail(courseId: number): CourseDetail | undefined {
  return courseDetails.find((c) => c.id === courseId);
}

export interface CourseCatalogItem {
  id: number;
  title: string;
  instructor: string;
}

export const courseCatalog: CourseCatalogItem[] = [
  { id: 1, title: 'Digital Marketing Mastery', instructor: 'Lex Olowo' },
  { id: 2, title: 'Advanced Web Development Bootcamp', instructor: 'Michael Balogun' },
  { id: 3, title: 'UI/UX Design Fundamentals', instructor: 'Sarah Johnson' },
  { id: 4, title: 'Data Science & Machine Learning', instructor: 'Dr. Emmanuel Ade' },
  { id: 5, title: 'Mobile App Development with Flutter', instructor: 'Chioma Nnamdi' },
  { id: 6, title: 'Cybersecurity Fundamentals', instructor: 'James Okonkwo' },
];
