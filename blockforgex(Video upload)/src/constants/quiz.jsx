const quizs = [
  {
    id: 1,
    question: "What does JSON stand for?",
    options: [
      "JavaScript Object Notation",
      "Java Serialized Object Notation",
      "JavaScript Oriented Notation",
      "Java Standard Object Notation",
    ],
    correctAnswer: 0,
  },
  {
    id: 2,
    question: "Which data types are supported by JSON?",
    options: [
      "String, Number, Boolean, Object, Array, Null",
      "String, Integer, Float, Object, List, Undefined",
      "Text, Number, True/False, Dictionary, List, None",
      "String, Decimal, Boolean, Hash, Vector, Null",
    ],
    correctAnswer: 0,
  },
  {
    id: 3,
    question: "What is the file extension for JSON files?",
    options: [".jsn", ".json", ".js", ".jso"],
    correctAnswer: 1,
  },
  {
    id: 4,
    question: "Which function is used to parse JSON in JavaScript?",
    options: [
      "JSON.parse()",
      "JSON.stringify()",
      "JSON.decode()",
      "JSON.evaluate()",
    ],
    correctAnswer: 0,
  },
  {
    id: 5,
    question: "What is the MIME type for JSON?",
    options: ["text/json", "application/json", "data/json", "json/application"],
    correctAnswer: 1,
  },
  {
    id: 6,
    question: "Which character is used to separate key-value pairs in JSON?",
    options: [":", ";", "=", "-"],
    correctAnswer: 0,
  },
  {
    id: 7,
    question: "What is JSONP?",
    options: [
      "JSON Parser",
      "JSON Protocol",
      "JSON with Padding",
      "JSON Processor",
    ],
    correctAnswer: 2,
  },
  {
    id: 8,
    question: "Which function converts a JavaScript object to a JSON string?",
    options: [
      "JSON.parse()",
      "JSON.stringify()",
      "JSON.encode()",
      "JSON.serialize()",
    ],
    correctAnswer: 1,
  },
  {
    id: 9,
    question: "In JSON, what symbols are used to represent an array?",
    options: ["{}", "[]", "()", "<>"],
    correctAnswer: 1,
  },
  {
    id: 10,
    question: "What is the main advantage of using JSON over XML?",
    options: [
      "JSON is more secure",
      "JSON is faster and lighter",
      "JSON supports more data types",
      "JSON has better browser support",
    ],
    correctAnswer: 1,
  },
  {
    id: 11,
    question: "What is a smart contract?",
    options: [
      "A legal document",
      "Self-executing code on the blockchain",
      "A type of cryptocurrency",
      "A digital signature",
    ],
    correctAnswer: 1,
  },
  {
    id: 12,
    question: "What does SQL stand for?",
    options: [
      "Structured Query Language",
      "Simple Query Language",
      "Structured Question Language",
      "Simple Question Language",
    ],
    correctAnswer: 0,
  },
  {
    id: 13,
    question: "Which of the following is a NoSQL database?",
    options: ["MySQL", "PostgreSQL", "MongoDB", "SQLite"],
    correctAnswer: 2,
  },
  {
    id: 14,
    question: "What is the primary function of a load balancer?",
    options: [
      "Distribute incoming network traffic across multiple servers",
      "Monitor server performance",
      "Store user data",
      "Encrypt network communications",
    ],
    correctAnswer: 0,
  },
  {
    id: 15,
    question:
      "Which programming language is primarily used for Android app development?",
    options: ["JavaScript", "Python", "Java", "Swift"],
    correctAnswer: 2,
  },
  {
    id: 16,
    question: "What does the acronym 'API' stand for?",
    options: [
      "Application Programming Interface",
      "Advanced Programming Interface",
      "Application Processing Interface",
      "Automated Programming Interface",
    ],
    correctAnswer: 0,
  },
  {
    id: 17,
    question: "What is the purpose of version control systems like Git?",
    options: [
      "To store and manage different versions of files",
      "To control access to a network",
      "To automate testing",
      "To deploy applications",
    ],
    correctAnswer: 0,
  },
  {
    id: 18,
    question: "Which of the following is a front-end JavaScript framework?",
    options: ["Laravel", "Django", "React", "Flask"],
    correctAnswer: 2,
  },
  {
    id: 19,
    question: "What does CSS stand for?",
    options: [
      "Cascading Style Sheets",
      "Cascading Script Sheets",
      "Code Styling Sheets",
      "Creative Style Sheets",
    ],
    correctAnswer: 0,
  },
];

const quizzes = [
  {
    count: 0,
    question: "Describe your experience in business development.",
    options: [
      "What industries or sectors have you primarily worked in, and what types of companies have you worked with?",
      "Can you provide an example of a successful business development strategy you've executed in the past?",
    ],
  },
  {
    count: 1,
    question: "How do you identify and pursue new business opportunities?",
    options: [
      "What methods or tools do you use to research and analyze potential leads?",
      "How do you decide which opportunities to prioritize and pursue?",
    ],
  },
  {
    count: 2,
    question: "Tell us about a time you successfully closed a difficult deal.",
    options: [
      "What challenges did you face, and how did you overcome them?",
      "What was your approach to negotiation during this deal?",
    ],
  },
];

export const getQuestions = (roles, skills, count = 10) => {
  // const shuffled = quizs.slice().sort(() => 0.5 - Math.random());
  // return shuffled.slice(0, count);
  return quizzes;
};
