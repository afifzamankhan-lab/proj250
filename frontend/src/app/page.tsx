'use client';

import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  Calendar,
  Award,
  ShieldCheck,
  UserCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Laptop,
  Code2,
  Building2,
  ChevronRight,
  Sparkles,
  RefreshCw,
  Lock,
} from 'lucide-react';

// Data types
type StudentProfile = {
  name: string;
  regNo: string;
  semester: string;
  session: string;
  hall: string;
  cgpa: string;
  role: string;
  email: string;
};

const students: Record<string, StudentProfile> = {
  '2023331020': {
    name: 'Afif Zaman Khan',
    regNo: '2023331020',
    semester: '4th Semester (2-2)',
    session: '2023-2024',
    hall: 'Shah Paran Hall',
    cgpa: '3.89',
    role: 'Student (Lead)',
    email: 'student@student.sust.edu',
  },
  '2023331088': {
    name: 'Usama',
    regNo: '2023331088',
    semester: '4th Semester (2-2)',
    session: '2023-2024',
    hall: 'Shah Paran Hall',
    cgpa: '3.87',
    role: 'Student (Partner)',
    email: 'partner@student.sust.edu',
  },
};

const courses22 = [
  { code: 'CSE 0610 2250', title: 'Project Work II', credit: 1.5, type: 'Lab', instructor: 'Prof. Dr. M. Rezaul Karim', room: 'IICT-304 Software Lab' },
  { code: 'CSE 0612 2260', title: 'Web Technologies', credit: 2.0, type: 'Lab', instructor: 'Department Faculty', room: 'IICT-305 Network Lab' },
  { code: 'CSE 0613 2234', title: 'Introduction to Competitive Programming', credit: 1.5, type: 'Lab', instructor: 'Coach / Faculty', room: 'Software Lab 2' },
  { code: 'CSE 0613 2247', title: 'Theory of Computation', credit: 3.0, type: 'Theory', instructor: 'Dr. M. Rezaul Karim', room: 'Gallery 1 (IICT)' },
  { code: 'CSE 0541 2257', title: 'Numerical Analysis', credit: 2.0, type: 'Theory', instructor: 'Course Teacher', room: 'Room 205 (IICT)' },
  { code: 'CSE 0688 2292', title: 'Introduction to Data Science Lab', credit: 1.5, type: 'Lab', instructor: 'Lab Faculty', room: 'AI & Data Lab' },
  { code: 'CSE 0541 2258', title: 'Numerical Analysis Lab', credit: 1.5, type: 'Lab', instructor: 'Lab Instructor', room: 'Computing Lab 1' },
  { code: 'MAT 0541 2204D', title: 'Complex Variables, Laplace Transform & Fourier Series', credit: 3.0, type: 'Theory', instructor: 'Mathematics Dept.', room: 'Room 205 (IICT)' },
  { code: 'EEE 0714 2201D', title: 'Digital Logic Design', credit: 3.0, type: 'Theory', instructor: 'EEE Dept. Faculty', room: 'Gallery 1 (IICT)' },
  { code: 'EEE 0714 2202D', title: 'Digital Logic Design Lab', credit: 2.0, type: 'Lab', instructor: 'EEE Lab Faculty', room: 'Hardware Lab' },
];

const pastSemesters = [
  {
    semester: '1st Semester (1-1)',
    sgpa: '3.86',
    credits: 10.5,
    courses: [
      { code: 'CSE 0613 1133', title: 'Structured Programming', credit: 3.0, grade: 'A+', point: '4.00' },
      { code: 'CSE 0613 1134', title: 'Structured Programming Lab', credit: 1.5, grade: 'A+', point: '4.00' },
      { code: 'MAT 0541 1101D', title: 'Differential & Integral Calculus', credit: 3.0, grade: 'A', point: '3.75' },
      { code: 'PHY 0533 1101D', title: 'Physics for Engineers', credit: 3.0, grade: 'A', point: '3.75' },
    ],
  },
  {
    semester: '2nd Semester (1-2)',
    sgpa: '3.88',
    credits: 10.5,
    courses: [
      { code: 'CSE 0613 1233', title: 'Object Oriented Programming', credit: 3.0, grade: 'A+', point: '4.00' },
      { code: 'CSE 0613 1234', title: 'Object Oriented Programming Lab', credit: 1.5, grade: 'A+', point: '4.00' },
      { code: 'MAT 0541 1201D', title: 'Coordinate Geometry & Linear Algebra', credit: 3.0, grade: 'A-', point: '3.50' },
      { code: 'EEE 0714 1201D', title: 'Electrical Circuit Analysis', credit: 3.0, grade: 'A', point: '3.75' },
    ],
  },
  {
    semester: '3rd Semester (2-1)',
    sgpa: '3.93',
    credits: 10.5,
    courses: [
      { code: 'CSE 0613 2133', title: 'Data Structures and Algorithms I', credit: 3.0, grade: 'A+', point: '4.00' },
      { code: 'CSE 0613 2134', title: 'Data Structures & Algorithms I Lab', credit: 1.5, grade: 'A+', point: '4.00' },
      { code: 'CSE 0613 2147', title: 'Discrete Mathematics', credit: 3.0, grade: 'A+', point: '4.00' },
      { code: 'STA 0542 2101D', title: 'Statistics for Engineers', credit: 3.0, grade: 'A', point: '3.75' },
    ],
  },
];

const routines = [
  { day: 'Sunday', time: '11:00 AM - 01:00 PM', course: 'CSE 0610 2250: Project Work II', room: 'Software Engg Lab (IICT-304)', type: 'Lab' },
  { day: 'Monday', time: '02:00 PM - 04:30 PM', course: 'CSE 0612 2260: Web Technologies', room: 'Network Lab (IICT-305)', type: 'Lab' },
  { day: 'Tuesday', time: '09:00 AM - 10:30 AM', course: 'CSE 0613 2247: Theory of Computation', room: 'Gallery 1 (IICT)', type: 'Theory' },
  { day: 'Wednesday', time: '10:30 AM - 12:00 PM', course: 'EEE 0714 2201D: Digital Logic Design', room: 'Room 205 (IICT)', type: 'Theory' },
  { day: 'Thursday', time: '02:00 PM - 04:30 PM', course: 'EEE 0714 2202D: Digital Logic Design Lab', room: 'Hardware Lab', type: 'Lab' },
];

export default function Home() {
  const [lang, setLang] = useState<'en' | 'bn'>('en');
  const [activeTab, setActiveTab] = useState<'courses' | 'routine' | 'transcript' | 'partners' | 'security'>('courses');
  const [activeRoll, setActiveRoll] = useState<string>('2023331020');
  const [activePastSem, setActivePastSem] = useState<number>(2); // 3rd semester default

  const currentStudent = students[activeRoll] || students['2023331020'];

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col">
      {/* Top University Announcement Bar */}
      <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-indigo-950 border-b border-cyan-800/30 px-4 py-2 text-xs flex justify-between items-center text-slate-300">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-medium text-cyan-300">
            {lang === 'en' ? 'SUST CSE Academic Portal' : 'সাস্ট সিএসই একাডেমিক পোর্টাল'}
          </span>
          <span className="text-slate-500">•</span>
          <span>{lang === 'en' ? 'Session 2023-2024 • 4th Semester (2-2)' : 'সেশন ২০২৩-২০২৪ • ৪র্থ সেমিস্টার (২-২)'}</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-400 font-semibold text-[11px] transition-colors"
          >
            {lang === 'en' ? 'বাংলা সংস্করণ' : 'English View'}
          </button>
          <a
            href="https://github.com/afifzamankhan-lab/proj250"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>
        </div>
      </div>

      {/* Main Brand Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-700 p-0.5 shadow-lg shadow-cyan-500/20 flex items-center justify-center font-bold text-xl text-white">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-lg sm:text-xl text-white tracking-tight">
                  {lang === 'en' ? 'Department of Computer Science & Engineering' : 'কম্পিউটার সায়েন্স অ্যান্ড ইঞ্জিনিয়ারিং বিভাগ'}
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/50">
                  SUST 23 Batch
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {lang === 'en'
                  ? 'Shahjalal University of Science and Technology, Sylhet'
                  : 'শাহজালাল বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়, সিলেট'}
              </p>
            </div>
          </div>

          {/* Student Profile Switcher */}
          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-xl p-1.5 self-start md:self-auto">
            <span className="text-[11px] font-medium text-slate-400 px-2">
              {lang === 'en' ? 'Active Profile:' : 'সক্রিয় প্রোফাইল:'}
            </span>
            <button
              onClick={() => setActiveRoll('2023331020')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeRoll === '2023331020'
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Afif (1020)
            </button>
            <button
              onClick={() => setActiveRoll('2023331088')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeRoll === '2023331088'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Usama (1088)
            </button>
          </div>
        </div>
      </header>

      {/* Hero Stats Card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-2 w-full">
        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-cyan-950/40 border border-slate-800/80 shadow-2xl relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  {lang === 'en' ? 'Enrolled & Verified' : 'নিবন্ধিত ও ভেরিফাইড'}
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-300 font-mono">Reg: {currentStudent.regNo}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {currentStudent.name}
              </h2>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                <span>{currentStudent.hall}</span>
                <span>•</span>
                <span>{currentStudent.session} Session</span>
                <span>•</span>
                <span className="text-cyan-400 font-medium">B.Sc. (Engg.) in CSE</span>
              </p>
            </div>

            {/* Metric Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto">
              <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 text-center">
                <div className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Cumulative CGPA</div>
                <div className="text-xl font-extrabold text-cyan-400 mt-0.5">{currentStudent.cgpa}</div>
                <div className="text-[10px] text-emerald-400 font-medium">UGC 4.0 Scale</div>
              </div>

              <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 text-center">
                <div className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Completed Cr.</div>
                <div className="text-xl font-extrabold text-indigo-400 mt-0.5">31.5</div>
                <div className="text-[10px] text-slate-400">1-1, 1-2, 2-1 Done</div>
              </div>

              <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 text-center">
                <div className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Running 2-2</div>
                <div className="text-xl font-extrabold text-emerald-400 mt-0.5">21.0 Cr</div>
                <div className="text-[10px] text-slate-400">10 Courses Total</div>
              </div>

              <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 text-center">
                <div className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Attendance</div>
                <div className="text-xl font-extrabold text-amber-400 mt-0.5">97.2%</div>
                <div className="text-[10px] text-emerald-400">Regular Status</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 w-full">
        <div className="flex items-center gap-2 border-b border-slate-800/90 pb-3 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('courses')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'courses'
                ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{lang === 'en' ? '4th Sem Courses (10)' : '৪র্থ সেমিস্টার কোর্সসমূহ (১০)'}</span>
          </button>

          <button
            onClick={() => setActiveTab('routine')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'routine'
                ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>{lang === 'en' ? 'Class Routine' : 'ক্লাস রুটিন'}</span>
          </button>

          <button
            onClick={() => setActiveTab('transcript')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'transcript'
                ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>{lang === 'en' ? 'Past Semesters Transcript' : 'পূর্ববর্তী ট্রান্সক্রিপ্ট ও CGPA'}</span>
          </button>

          <button
            onClick={() => setActiveTab('partners')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'partners'
                ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>{lang === 'en' ? 'Partner Profiles (Afif & Usama)' : 'টিম মেম্বার প্রোফাইল'}</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'security'
                ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{lang === 'en' ? 'Viva Defense & Security' : 'ভাইভা ডিফেন্স ও সিকিউরিটি'}</span>
          </button>
        </div>
      </section>

      {/* Main Tab Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full">
        {/* Tab 1: Running 4th Semester Courses */}
        {activeTab === 'courses' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>{lang === 'en' ? 'Official 4th Semester (2-2) Curriculum' : 'অফিসিয়াল ৪র্থ সেমিস্টার (২-২) সিলেবাস'}</span>
                  <span className="text-xs font-normal text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                    Total: 21.0 Credits
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  {lang === 'en'
                    ? 'All 10 active courses registered for session 2023-2024 at Department of CSE, SUST.'
                    : 'সাস্ট সিএসই বিভাগের ২০২৩-২০২৪ সেশনে নিবন্ধিত সকল ১০টি কোর্স।'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {courses22.map((course, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-900/90 transition-all duration-200 flex flex-col justify-between group shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950/70 px-2 py-0.5 rounded border border-cyan-800/50">
                          {course.code}
                        </span>
                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                            course.type === 'Lab'
                              ? 'bg-purple-950/60 text-purple-300 border border-purple-800/40'
                              : 'bg-blue-950/60 text-blue-300 border border-blue-800/40'
                          }`}
                        >
                          {course.type}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">{course.credit} Cr.</span>
                      </div>
                      <h4 className="font-bold text-white text-sm sm:text-base group-hover:text-cyan-300 transition-colors">
                        {course.title}
                      </h4>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <span className="truncate">{course.instructor}</span>
                    <span className="text-slate-500 shrink-0 font-mono text-[11px]">{course.room}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Class Routine */}
        {activeTab === 'routine' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">
                  {lang === 'en' ? '4th Semester Class & Lab Schedule' : '৪র্থ সেমিস্টার ক্লাস ও ল্যাব রুটিন'}
                </h3>
                <p className="text-xs text-slate-400">
                  {lang === 'en'
                    ? 'IICT Building, Department of Computer Science & Engineering, SUST'
                    : 'আইআইসিটি ভবন, কম্পিউটার সায়েন্স অ্যান্ড ইঞ্জিনিয়ারিং বিভাগ, সাস্ট'}
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-900/60">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-950/80 text-slate-400 uppercase text-[11px] font-semibold border-b border-slate-800">
                    <tr>
                      <th className="px-4 py-3">Day</th>
                      <th className="px-4 py-3">Time Slot</th>
                      <th className="px-4 py-3">Course</th>
                      <th className="px-4 py-3">Room / Venue</th>
                      <th className="px-4 py-3">Category</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/70">
                    {routines.map((item, i) => (
                      <tr key={i} className="hover:bg-slate-850/50 transition-colors">
                        <td className="px-4 py-3.5 font-bold text-cyan-400">{item.day}</td>
                        <td className="px-4 py-3.5 font-mono text-slate-300 text-xs">{item.time}</td>
                        <td className="px-4 py-3.5 font-semibold text-white">{item.course}</td>
                        <td className="px-4 py-3.5 text-slate-300 text-xs">{item.room}</td>
                        <td className="px-4 py-3.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                              item.type === 'Lab'
                                ? 'bg-purple-950/70 text-purple-300 border border-purple-800/40'
                                : 'bg-blue-950/70 text-blue-300 border border-blue-800/40'
                            }`}
                          >
                            {item.type}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <p className="text-xs text-slate-500 italic">
              * Note: Routine timings are editable in real-time from the admin and teacher routine module.
            </p>
          </div>
        )}

        {/* Tab 3: Past Semesters Transcript */}
        {activeTab === 'transcript' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-white">
                  {lang === 'en' ? 'Official Academic Grade Transcript' : 'অফিসিয়াল একাডেমিক ট্রান্সক্রিপ্ট'}
                </h3>
                <p className="text-xs text-slate-400">
                  {lang === 'en'
                    ? 'Verified Semester Grade Point Average (SGPA) & UGC 4.0 Cumulative CGPA'
                    : 'যাচাইকৃত সেমিস্টার জিপিএ ও ইউজিসি ৪.০ কিউমুলেটিভ সিজিপিএ'}
                </p>
              </div>

              {/* Semester Buttons */}
              <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-xl">
                {pastSemesters.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActivePastSem(idx)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      activePastSem === idx
                        ? 'bg-cyan-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {s.semester.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Semester Detail Card */}
            {pastSemesters[activePastSem] && (
              <div className="border border-slate-800 rounded-xl bg-slate-900/60 overflow-hidden">
                <div className="bg-slate-950/70 px-4 py-3 border-b border-slate-800 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-white text-sm">{pastSemesters[activePastSem].semester}</h4>
                    <span className="text-xs text-slate-400">{pastSemesters[activePastSem].credits} Credits Taken</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 uppercase font-semibold">Semester SGPA: </span>
                    <span className="text-lg font-extrabold text-cyan-400">
                      {pastSemesters[activePastSem].sgpa}
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-slate-900/90 text-slate-400 text-[11px] uppercase border-b border-slate-800">
                      <tr>
                        <th className="px-4 py-2.5">Course Code</th>
                        <th className="px-4 py-2.5">Course Title</th>
                        <th className="px-4 py-2.5">Credit</th>
                        <th className="px-4 py-2.5">Letter Grade</th>
                        <th className="px-4 py-2.5">Grade Point</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-200">
                      {pastSemesters[activePastSem].courses.map((c, i) => (
                        <tr key={i} className="hover:bg-slate-850/40">
                          <td className="px-4 py-3 font-mono text-cyan-400 font-bold">{c.code}</td>
                          <td className="px-4 py-3 font-medium text-white">{c.title}</td>
                          <td className="px-4 py-3 text-slate-300">{c.credit}</td>
                          <td className="px-4 py-3 font-bold text-emerald-400">{c.grade}</td>
                          <td className="px-4 py-3 font-mono font-bold text-cyan-300">{c.point}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Partner Profiles */}
        {activeTab === 'partners' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-white">
                {lang === 'en' ? 'Project Team Members (SUST CSE Batch 2023)' : 'প্রজেক্ট টিম মেম্বারদের পরিচিতি'}
              </h3>
              <p className="text-xs text-slate-400">
                Course: CSE 0610 2250 (Project Work II) • Instructor: Prof. Dr. M. Rezaul Karim
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Afif Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 shadow-xl">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/50">
                      Team Lead & Core Backend
                    </span>
                    <h4 className="text-xl font-extrabold text-white mt-2">Afif Zaman Khan</h4>
                    <p className="text-sm font-mono text-cyan-400 font-semibold">Reg No: 2023331020</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-xl border border-cyan-500/30">
                    AZ
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-xs text-slate-300 pt-3 border-t border-slate-800">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Department:</span>
                    <span className="font-medium text-slate-200">Computer Science & Engineering</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Hall:</span>
                    <span className="font-medium text-slate-200">Shah Paran Hall, SUST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Current Semester:</span>
                    <span className="font-medium text-emerald-400 font-bold">4th Semester (2-2)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Cumulative CGPA:</span>
                    <span className="font-bold text-cyan-400 font-mono">3.89 / 4.00</span>
                  </div>
                </div>
              </div>

              {/* Usama Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 shadow-xl">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-950 text-indigo-400 border border-indigo-800/50">
                      Project Partner
                    </span>
                    <h4 className="text-xl font-extrabold text-white mt-2">Usama</h4>
                    <p className="text-sm font-mono text-indigo-400 font-semibold">Reg No: 2023331088</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold text-xl border border-indigo-500/30">
                    U
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-xs text-slate-300 pt-3 border-t border-slate-800">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Department:</span>
                    <span className="font-medium text-slate-200">Computer Science & Engineering</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Hall:</span>
                    <span className="font-medium text-slate-200">Shah Paran Hall, SUST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Current Semester:</span>
                    <span className="font-medium text-emerald-400 font-bold">4th Semester (2-2)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Cumulative CGPA:</span>
                    <span className="font-bold text-indigo-400 font-mono">3.87 / 4.00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Viva Defense & Security Live Tester */}
        {activeTab === 'security' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>{lang === 'en' ? 'Backend Architecture & Defense Cheatsheet' : 'ব্যাকএন্ড আর্কিটেকচার ও ভাইভা প্রস্তুতি'}</span>
              </h3>
              <p className="text-xs text-slate-400">
                Key technical highlights to demonstrate live in front of the lab instructor.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm mb-2">
                  <Lock className="w-4 h-4" />
                  <span>Dual-Token JWT Security</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  15-min short-lived access token + 7-day refresh token stored as SHA-256 hash in DB. Strict keyfunc algorithm check prevents <code className="text-cyan-300 bg-slate-950 px-1 py-0.5 rounded">alg: none</code> forgery.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm mb-2">
                  <Clock className="w-4 h-4" />
                  <span>Token-Bucket Rate Limiter</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Built from scratch in Go using <code className="text-amber-300 bg-slate-950 px-1 py-0.5 rounded">sync.Mutex</code> and IP maps. Limits login to 5 req/min with HTTP 429 and dynamic <code className="text-amber-300 bg-slate-950 px-1 py-0.5 rounded">Retry-After</code> headers.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Brute-Force Account Shield</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Locks student or teacher account for 15 minutes automatically after 5 consecutive incorrect password attempts, protecting against credential stuffing.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/90 text-xs text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="font-bold text-white">Full Defense Documentation Available: </span>
                <span>Refer to <span className="text-cyan-400 font-mono">VIVA_DEFENSE_DAY1.md</span> in repository root.</span>
              </div>
              <a
                href="https://github.com/afifzamankhan-lab/proj250/blob/main/VIVA_DEFENSE_DAY1.md"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition-colors flex items-center gap-1.5 self-start sm:self-auto"
              >
                <span>Open Viva Guide</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/70 bg-slate-950/80 py-4 text-center text-xs text-slate-500">
        <p>
          © 2026 Department of Computer Science & Engineering, Shahjalal University of Science & Technology (SUST).
        </p>
        <p className="text-[11px] text-slate-600 mt-0.5">
          Developed by Afif Zaman Khan (2023331020) & Usama (2023331088) • Course: CSE 0610 2250 (Project Work II)
        </p>
      </footer>
    </div>
  );
}
