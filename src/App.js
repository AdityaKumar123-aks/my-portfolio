import React, { useState, useEffect, useRef } from "react";
import {
  Menu, X, Linkedin, Mail, Github, Sun, Moon, Download,
  ExternalLink, Award, Send, CheckCircle, AlertCircle,
  Zap, Cpu, Activity, Globe, Wrench, Users, Terminal,
  FileText, ArrowUp,
} from "lucide-react";

// ═══════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════

const profile = {
  name: "Aditya Kumar",
  bio: "M.Tech scholar at IIT Bombay designing efficient power systems from first principles — simulation through PCB layout to hardware testing. Specializing in LLC resonant converters, PFC circuits, and DSP-based motor drives.",
  photo: "/profile.jpg",
  social: {
    linkedin: "https://www.linkedin.com/in/aditya-kumar1357",
    github: "https://github.com/AdityaKumar123-aks",
    email: "adityakumarshakya63@gmail.com",
  },
  resume: "/Aditya_Kumar_Resume.pdf",
};

const stats = [
  { value: 1,   suffix: " kW",  label: "LLC Converter",  sub: "EV Charging Thesis" },
  { value: 3.3, suffix: " kW",  label: "PFC Converter",  sub: "Hardware Built",     dec: 1 },
  { value: 28,  suffix: "%",    label: "Ripple Reduced", sub: "VSC Optimization" },
  { value: 8,   suffix: "+",    label: "Real Projects",  sub: "Sim to Hardware" },
];

const projects = [
  {
    id: 1,
    title: "LLC Resonant Converter for EV Charging",
    subtitle: "M.Tech Thesis Project",
    category: "Power Electronics",
    period: "May 2025 – Present",
    highlight: "1 kW · 48 V · ZVS/ZCS Soft Switching",
    description:
      "Design and analysis of a 1 kW, 48 V LLC resonant DC-DC converter for EV charging using First Harmonic Approximation (FHA). Full PCB design in Altium Designer and DSP firmware on TMS320F28379D.",
    tools: ["PLECS", "Altium Designer", "TMS320F28379D", "FHA Analysis", "ZVS/ZCS"],
    github: "https://github.com/AdityaKumar123-aks/MTP_Design-of-LLC-Resonant-Converter/tree/LLC",
    image: "/LLC_Resonant_converter.png",
    featured: true,
    gradient: "from-amber-500 to-orange-600",
  },
  {
    id: 2,
    title: "PFC Converter for EV Charger",
    subtitle: "Hardware Development",
    category: "Power Electronics",
    period: "Aug 2024 – Present",
    highlight: "3.3 kW · Near-Unity Power Factor",
    description:
      "Designed and built a 3.3 kW Boost PFC converter for EV charging with near-unity power factor using analog control. Full hardware implementation from LTSpice simulation to Altium PCB.",
    tools: ["LTSpice", "Altium Designer", "Analog Control", "Boost PFC"],
    github: "https://github.com/AdityaKumar123-aks/Academic_Projects/tree/main/Design_and_Development_of_PFC_converter_for_EV_charger",
    image: "/Boost_pfc_converter.png",
    featured: true,
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    id: 3,
    title: "Flyback DC-DC Converter",
    subtitle: "Design & Hardware Implementation",
    category: "Power Electronics",
    period: "Aug – Nov 2024",
    highlight: "50 W · Isolated · Hardware Tested",
    description:
      "Designed and implemented a 50 W isolated flyback converter with custom transformer design from scratch. Complete workflow from PLECS simulation to PCB fabrication and hardware testing.",
    tools: ["PLECS", "Altium Designer", "Transformer Design", "PCB Layout"],
    github: "https://github.com/AdityaKumar123-aks/Academic_Projects/tree/main/Design_Simulation_and_Hardware_Development_of_Flyback_Converter",
    image: "/FLyback_converter.png",
    featured: false,
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    id: 4,
    title: "Back-to-Back 2-Level VSC",
    subtitle: "Performance Evaluation",
    category: "Power Quality",
    period: "Jan – Apr 2025",
    highlight: "28% Current Ripple Reduction",
    description:
      "Analyzed and optimized a back-to-back 2-level VSC. Compared CSVPWM vs. STPWM strategies, achieving 28% reduction in current ripple with CSVPWM in MATLAB/Simulink.",
    tools: ["MATLAB/Simulink", "CSVPWM", "STPWM", "Power Quality"],
    github: "https://github.com/AdityaKumar123-aks/Academic_Projects/tree/main/Performance_Evaluation_of_Back-to-Back_2-Level_VSC",
    image: "/Back-to-back_VSC.png",
    featured: true,
    gradient: "from-purple-500 to-violet-600",
  },
  {
    id: 5,
    title: "Loss Minimization – Induction Motor Drive",
    subtitle: "DSP Control Implementation",
    category: "Motor Drives",
    period: "Jan – Apr 2025",
    highlight: "7.46% Efficiency Improvement",
    description:
      "Implemented flux-optimization loss minimization on TMS320F28379D DSP for induction motor drives, achieving measurable efficiency gains across various load conditions.",
    tools: ["Code Composer Studio", "TMS320F28379D", "MATLAB", "Motor Control"],
    github: "https://github.com/AdityaKumar123-aks/Academic_Projects/tree/main/Loss_minimization_Control_of_an_Induction_Motor_Drive",
    image: "/Induction_motor_drive.png",
    featured: false,
    gradient: "from-red-500 to-rose-600",
  },
  {
    id: 6,
    title: "Single Phase Active Filter",
    subtitle: "Harmonic Compensation",
    category: "Power Quality",
    period: "Jan – Apr 2025",
    highlight: "THD < IEEE-519 Limit",
    description:
      "Designed a 1-phase APF using VSI with PI control to compensate load harmonics, achieving source current THD well below the IEEE-519 standard limit.",
    tools: ["MATLAB/Simulink", "VSI", "PI Control", "Power Quality"],
    github: "https://github.com/AdityaKumar123-aks/Academic_Projects/tree/main/Single_Phase_Active_Filter_for_Harmonic_Compensation",
    image: "/Single_phase_active_power_filter.png",
    featured: false,
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    id: 7,
    title: "EV Charging Infrastructure – Heavy Duty",
    subtitle: "Technical Seminar Report",
    category: "EV Systems",
    period: "Aug – Nov 2024",
    highlight: "CCS · CHAdeMO · MCS Standards",
    description:
      "Comprehensive analysis of EV fast-charging standards and grid integration challenges for heavy-duty vehicles, covering V2G technology and renewable energy integration.",
    tools: ["EV Standards", "Grid Integration", "V2G", "Renewables"],
    github: "https://github.com/AdityaKumar123-aks/Academic_Projects/tree/main/EV_charging_infrastructure_for_Heavy_Duty_Vehicles",
    image: null,
    featured: false,
    gradient: "from-green-500 to-emerald-600",
  },
  {
    id: 8,
    title: "Omni-directional Robotic Vehicle",
    subtitle: "B.Tech Final Year Project",
    category: "Robotics",
    period: "Jan – Apr 2023",
    highlight: "360° Holonomic Motion · Wireless Control",
    description:
      "Built an Arduino-based omnidirectional robot using mecanum wheels for 360° holonomic motion. Wireless Bluetooth control with real-time motor speed regulation.",
    tools: ["Arduino UNO", "Bluetooth HC-05", "Motor Control", "C"],
    github: "https://github.com/AdityaKumar123-aks/Academic_Projects/tree/main/Omni-directional_Robotic_Vehicle",
    image: null,
    featured: false,
    gradient: "from-indigo-500 to-purple-600",
  },
];

const projectCategories = ["All", "Power Electronics", "Power Quality", "Motor Drives", "EV Systems", "Robotics"];

const skillGroups = [
  {
    title: "Simulation & Modeling",
    icon: "cpu",
    items: ["PLECS", "MATLAB/Simulink", "LTSpice", "Code Composer Studio", "SAM-NREL", "PVsyst"],
  },
  {
    title: "Design & Hardware",
    icon: "wrench",
    items: ["Altium Designer", "KiCAD", "PCB Layout", "Transformer Design", "Hardware Testing", "LaTeX"],
  },
  {
    title: "Programming",
    icon: "terminal",
    items: ["C (DSP/Embedded)", "MATLAB", "Python", "Arduino IDE", "HTML/CSS"],
  },
  {
    title: "Technical Domains",
    icon: "zap",
    items: ["Power Electronics", "EV Charging Systems", "Motor Drives", "Power Quality", "Renewable Energy", "Industrial IoT"],
  },
];

const certifications = [
  {
    title: "TI TMS320F28379D for Power Electronics",
    issuer: "Udemy",
    badge: "DSP",
    period: "Jan – Apr 2025",
    color: "amber",
    learnings: ["F28379D architecture & peripherals", "PIE module & GPIO configuration", "ePWM for converter control", "ADC and closed-loop implementation"],
  },
  {
    title: "EV Powertrain Performance Design",
    issuer: "Udemy",
    badge: "EV",
    period: "Jan – Apr 2025",
    color: "blue",
    learnings: ["Powertrain architectures & topologies", "Drive cycle simulation", "Motor & battery sizing", "EV system-level modeling"],
  },
  {
    title: "Introduction to Internet of Things",
    issuer: "NPTEL",
    badge: "IoT",
    period: "Jan – Apr 2022",
    color: "emerald",
    learnings: ["IoT architecture & protocols", "Industrial IoT applications", "Sensor integration", "Communication standards"],
  },
  {
    title: "Enhancing Soft Skills & Personality",
    issuer: "NPTEL",
    badge: "Pro",
    period: "Feb – Apr 2021",
    color: "purple",
    learnings: ["Growth mindset & learning", "Time management principles", "Professional communication", "Business etiquette"],
  },
];

const coursework = [
  { title: "Power Converters for EV Charging", topics: "PFC circuits, Phase-shifted full-bridge, LLC & DAB converters", tags: ["EV Systems", "Converters"] },
  { title: "Modeling & Control of IBRR", topics: "Small-signal modeling, SRF transformation, PR controller design", tags: ["Control Systems", "Power Electronics"] },
  { title: "Electric Drives", topics: "DC & AC motor drives, VSI-fed induction motor, Direct Torque Control", tags: ["Motor Drives"] },
  { title: "Energy Efficient Industrial Drives", topics: "Space vector PWM, bus clamping, closed-loop V/f control", tags: ["Industrial Drives", "SVPWM"] },
  { title: "Design & Evaluation of PV Plants", topics: "PV plant design, modelling & performance assessment using SAM/PVsyst", tags: ["Renewable Energy", "Solar"] },
  { title: "Power Generation & Systems Planning", topics: "Economic load dispatch, NPV, carbon capture, reliability, forecasting", tags: ["Power Systems", "Planning"] },
];

const education = [
  {
    degree: "M.Tech, Energy Science & Engineering",
    institution: "IIT Bombay",
    period: "2024 – Present",
    gpa: "CPI: 9.19 / 10",
    note: "Thesis: LLC Resonant Converter for EV Charging (1 kW, 48 V)",
    logo: "/IITB_logo.png",
  },
  {
    degree: "B.Tech, Electrical Engineering",
    institution: "REC Bijnor (AKTU)",
    period: "2019 – 2023",
    gpa: "GPA: 8.81 / 10",
    note: "AA Grade in Energy Efficient Industrial Drives | Final Project: Omni-directional Robot",
    logo: "/RECB_logo.jpg",
  },
];

const achievements = [
  { title: "GATE Top 2.55 Percentile", description: "EE 2024 — top 2.55% of 59,000+ candidates nationwide", year: "2024", gold: true },
  { title: "IIT Bombay M.Tech", description: "Admitted to Energy Science & Engineering specialization", year: "2024", gold: true },
  { title: "AA Grade — Industrial Drives", description: "Highest grade in Energy Efficient Industrial Drives at AKTU", year: "2023", gold: false },
  { title: "U.P. Chief Minister Award", description: "Awarded by Hon. Yogi Adityanath for 4th rank in district intermediate exams", year: "2018", gold: true },
  { title: "Vivek Shukla Memorial Award", description: "7th rank in district SSC examination", year: "2016", gold: false },
];

const leadership = [
  {
    role: "Corporate Relations Coordinator",
    org: "Energy Day 2025 — IIT Bombay",
    period: "Mar – Apr 2025",
    points: [
      "Managed 40+ industry coordinators & 16-member core team for 2-day event",
      "Achieved 100% YoY growth in student turnout (16 → 40 teams)",
      "Organized 3 Energy Case Competitions for 500+ students",
    ],
  },
  {
    role: "Teaching Assistant — Energy Lab III",
    org: "DESE, IIT Bombay",
    period: "Aug 2025 – Present",
    points: [
      "Managed lab operations with 2 TAs for 18 enrolled students",
      "Evaluated performance through vivas and report assessments",
    ],
  },
  {
    role: "Teaching Assistant — Electrical Networks Lab",
    org: "DESE, IIT Bombay",
    period: "Jan – Apr 2025",
    points: [
      "Collaborated with 12 TAs to evaluate 60+ students",
      "Designed & tested frequency response of passive circuits",
    ],
  },
  {
    role: "Event Coordinator — Advitya / Abhyuday",
    org: "IIT Bombay (Asia's Largest Student-Run NGO)",
    period: "Dec 2024 – Jan 2025",
    points: [
      "Organized health check-ups for 100+ community residents",
      "Distributed 3000+ refreshment packages and stationery items",
    ],
  },
];

// ═══════════════════════════════════════════════════════════════
// HOOKS & UTILITIES
// ═══════════════════════════════════════════════════════════════

const useOnScreen = (threshold = 0.1) => {
  const [ref, setRef] = useState(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.unobserve(entry.target); } },
      { threshold }
    );
    obs.observe(ref);
    return () => obs.unobserve(ref);
  }, [ref, threshold]);
  return [setRef, visible];
};

const Reveal = ({ children, delay = 0, direction = "up", className = "" }) => {
  const [setRef, visible] = useOnScreen(0.1);
  const hidden = direction === "left" ? "-translate-x-8" : direction === "right" ? "translate-x-8" : "translate-y-8";
  return (
    <div
      ref={setRef}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${visible ? "opacity-100 translate-x-0 translate-y-0" : `opacity-0 ${hidden}`} ${className}`}
    >
      {children}
    </div>
  );
};

const AnimatedCounter = ({ target, suffix = "", dec = 0 }) => {
  const [count, setCount] = useState(0);
  const [setRef, visible] = useOnScreen(0.5);
  useEffect(() => {
    if (!visible) return;
    const steps = 60; const dur = 1200;
    const inc = target / steps;
    let cur = 0;
    const t = setInterval(() => {
      cur += inc;
      if (cur >= target) { setCount(target); clearInterval(t); }
      else setCount(parseFloat(cur.toFixed(dec)));
    }, dur / steps);
    return () => clearInterval(t);
  }, [visible, target, dec]);
  return <span ref={setRef}>{dec > 0 ? count.toFixed(dec) : Math.floor(count)}{suffix}</span>;
};

const TypeWriter = ({ words }) => {
  const [wi, setWi] = useState(0);
  const [ci, setCi] = useState(0);
  const [del, setDel] = useState(false);
  useEffect(() => {
    const word = words[wi];
    const t = setTimeout(() => {
      if (!del) {
        if (ci < word.length) setCi(c => c + 1);
        else setTimeout(() => setDel(true), 1800);
      } else {
        if (ci > 0) setCi(c => c - 1);
        else { setDel(false); setWi(i => (i + 1) % words.length); }
      }
    }, del ? 35 : 75);
    return () => clearTimeout(t);
  }, [ci, del, wi, words]);
  return (
    <span>
      <span className="text-amber-600">{words[wi].substring(0, ci)}</span>
      <span className="inline-block w-0.5 h-5 bg-amber-600 ml-0.5 animate-pulse align-middle" />
    </span>
  );
};

const SectionHeader = ({ eyebrow, title, subtitle, center = false, darkMode }) => (
  <div className={`mb-12 ${center ? "text-center" : ""}`}>
    {eyebrow && (
      <p className={`text-xs font-bold tracking-widest uppercase mb-3 ${darkMode ? "text-amber-400" : "text-amber-600"}`}>
        {eyebrow}
      </p>
    )}
    <h2 className={`text-3xl md:text-4xl font-serif font-bold ${darkMode ? "text-white" : "text-stone-900"}`}>
      {title}
    </h2>
    {subtitle && (
      <p className={`mt-3 text-base leading-relaxed max-w-2xl ${center ? "mx-auto" : ""} ${darkMode ? "text-slate-400" : "text-stone-500"}`}>
        {subtitle}
      </p>
    )}
  </div>
);

// ═══════════════════════════════════════════════════════════════
// NAVBAR
// ═══════════════════════════════════════════════════════════════

const Navbar = ({ darkMode, toggleDark }) => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const links = [
    { label: "About", href: "#about" },
    { label: "Projects", href: "#projects" },
    { label: "Skills", href: "#skills" },
    { label: "Education", href: "#education" },
    { label: "Contact", href: "#contact" },
  ];
  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
      scrolled
        ? darkMode
          ? "bg-slate-950/95 backdrop-blur-sm border-b border-slate-800 shadow-lg"
          : "bg-white/95 backdrop-blur-sm border-b border-stone-200 shadow-md"
        : "bg-transparent"
    }`}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-amber-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-serif font-bold text-sm">AK</span>
          </div>
          <span className={`font-semibold text-sm hidden sm:block ${darkMode ? "text-white" : "text-stone-900"}`}>
            Aditya Kumar
          </span>
        </a>
        <nav className="hidden md:flex items-center gap-7">
          {links.map(l => (
            <a key={l.label} href={l.href}
              className={`text-sm font-medium transition-colors ${darkMode ? "text-slate-400 hover:text-amber-400" : "text-stone-600 hover:text-amber-600"}`}>
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button onClick={toggleDark} aria-label="Toggle dark mode"
            className={`p-2 rounded-lg transition-colors ${darkMode ? "text-slate-400 hover:text-white hover:bg-slate-800" : "text-stone-500 hover:text-stone-900 hover:bg-stone-100"}`}>
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <a href={profile.resume} download
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-lg transition-colors">
            <FileText size={14} />Resume
          </a>
          <button onClick={() => setOpen(!open)} aria-label="Menu"
            className={`md:hidden p-2 rounded-lg ${darkMode ? "text-slate-300" : "text-stone-700"}`}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      {open && (
        <div className={`md:hidden px-6 pb-5 border-t ${darkMode ? "bg-slate-950 border-slate-800" : "bg-white border-stone-200"}`}>
          {links.map(l => (
            <a key={l.label} href={l.href} onClick={() => setOpen(false)}
              className={`flex py-3 text-sm font-medium border-b ${darkMode ? "text-slate-300 border-slate-800" : "text-stone-600 border-stone-100"}`}>
              {l.label}
            </a>
          ))}
          <a href={profile.resume} download className="mt-4 flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-amber-600 text-white text-sm font-semibold rounded-lg">
            <Download size={14} />Download Resume
          </a>
        </div>
      )}
    </header>
  );
};

// ═══════════════════════════════════════════════════════════════
// HERO
// ═══════════════════════════════════════════════════════════════

const HeroSection = ({ darkMode }) => {
  const [imgErr, setImgErr] = useState(false);
  return (
    <section id="home"
      className={`min-h-screen pt-16 flex items-center ${darkMode ? "bg-slate-950" : "bg-stone-50"}`}
      style={{
        backgroundImage: darkMode
          ? "radial-gradient(circle, rgba(251,191,36,0.05) 1px, transparent 1px)"
          : "radial-gradient(circle, rgba(100,80,30,0.07) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }}>
      <div className="max-w-6xl mx-auto px-6 py-24 w-full">
        <div className="grid lg:grid-cols-2 gap-14 items-center">

          {/* Left */}
          <div>
            <Reveal>
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6 border ${
                darkMode ? "bg-amber-400/10 text-amber-400 border-amber-400/25" : "bg-amber-50 text-amber-700 border-amber-200"
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                Open to Opportunities
              </div>
            </Reveal>

            <Reveal delay={80}>
              <div className="flex flex-wrap gap-2 mb-6">
                {["IIT Bombay M.Tech", "GATE Top 2.55%", "8+ Real Projects"].map(b => (
                  <span key={b} className={`px-3 py-1 rounded-full text-xs font-medium border ${
                    darkMode ? "bg-slate-800 text-slate-300 border-slate-700" : "bg-white text-stone-700 border-stone-300 shadow-sm"
                  }`}>{b}</span>
                ))}
              </div>
            </Reveal>

            <Reveal delay={140}>
              <h1 className={`text-5xl md:text-6xl lg:text-7xl font-serif font-bold leading-tight mb-5 ${darkMode ? "text-white" : "text-stone-900"}`}>
                Aditya<br />Kumar
              </h1>
            </Reveal>

            <Reveal delay={200}>
              <div className={`text-lg md:text-xl font-medium mb-6 ${darkMode ? "text-slate-300" : "text-stone-600"}`}>
                <TypeWriter words={["Power Electronics Engineer", "EV Charging Specialist", "DSP Control Developer", "PCB Hardware Designer"]} />
              </div>
            </Reveal>

            <Reveal delay={250}>
              <p className={`text-base leading-relaxed mb-8 max-w-lg ${darkMode ? "text-slate-400" : "text-stone-600"}`}>
                {profile.bio}
              </p>
            </Reveal>

            <Reveal delay={300}>
              <div className="flex flex-wrap gap-3 mb-8">
                <a href="#projects"
                  className="flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-600/25">
                  View Projects <ExternalLink size={15} />
                </a>
                <a href={profile.resume} download
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold border-2 transition-all hover:-translate-y-0.5 ${
                    darkMode ? "border-slate-600 text-slate-300 hover:border-amber-400 hover:text-amber-400" : "border-stone-300 text-stone-700 hover:border-amber-600 hover:text-amber-600"
                  }`}>
                  <Download size={15} />Download CV
                </a>
              </div>
            </Reveal>

            <Reveal delay={350}>
              <div className="flex items-center gap-3 flex-wrap">
                <a href={profile.social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
                  className={`p-2.5 rounded-xl border transition-all hover:-translate-y-0.5 ${darkMode ? "border-slate-700 text-slate-400 hover:border-amber-400 hover:text-amber-400" : "border-stone-200 text-stone-500 hover:border-amber-500 hover:text-amber-600"}`}>
                  <Linkedin size={19} />
                </a>
                <a href={profile.social.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub"
                  className={`p-2.5 rounded-xl border transition-all hover:-translate-y-0.5 ${darkMode ? "border-slate-700 text-slate-400 hover:border-amber-400 hover:text-amber-400" : "border-stone-200 text-stone-500 hover:border-amber-500 hover:text-amber-600"}`}>
                  <Github size={19} />
                </a>
                <a href={`mailto:${profile.social.email}`}
                  onClick={e => { e.preventDefault(); window.location.href = `mailto:${profile.social.email}`; }}
                  aria-label="Email"
                  className={`p-2.5 rounded-xl border transition-all hover:-translate-y-0.5 ${darkMode ? "border-slate-700 text-slate-400 hover:border-amber-400 hover:text-amber-400" : "border-stone-200 text-stone-500 hover:border-amber-500 hover:text-amber-600"}`}>
                  <Mail size={19} />
                </a>
                <span className={`text-sm ${darkMode ? "text-slate-500" : "text-stone-400"}`}>{profile.social.email}</span>
              </div>
            </Reveal>
          </div>

          {/* Right: Photo */}
          <Reveal direction="right" className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 opacity-20 blur-2xl scale-110" />
              <div className={`relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 shadow-2xl ${
                darkMode ? "border-amber-400/50 shadow-amber-500/10" : "border-amber-500/60 shadow-amber-400/20"
              }`}>
                {!imgErr ? (
                  <img src="/profile.jpg" alt="Aditya Kumar"
                    className="w-full h-full object-cover object-top"
                    onError={() => setImgErr(true)} />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                    <span className="text-white text-7xl font-serif font-bold select-none">AK</span>
                  </div>
                )}
              </div>
              <div className={`absolute -bottom-3 -right-3 md:-bottom-4 md:-right-4 w-20 h-20 rounded-2xl border flex items-center justify-center shadow-xl ${
                darkMode ? "bg-slate-900 border-slate-700" : "bg-white border-stone-200"
              }`}>
                <div className="text-center">
                  <div className="text-xl font-bold text-amber-600">9.19</div>
                  <div className={`text-xs mt-0.5 ${darkMode ? "text-slate-400" : "text-stone-500"}`}>CPI</div>
                </div>
              </div>
              <div className={`absolute -top-3 -left-3 md:-top-4 md:-left-4 px-3 py-2 rounded-xl border shadow-xl ${
                darkMode ? "bg-slate-900 border-slate-700" : "bg-white border-stone-200"
              }`}>
                <div className="text-xs font-bold text-amber-600 text-center">GATE</div>
                <div className={`text-xs font-semibold text-center ${darkMode ? "text-white" : "text-stone-900"}`}>2.55%</div>
              </div>
            </div>
          </Reveal>

        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════
// STATS
// ═══════════════════════════════════════════════════════════════

const StatsSection = ({ darkMode }) => (
  <section className={`py-12 border-y ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-stone-200"}`}>
    <div className="max-w-6xl mx-auto px-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 80} className="text-center">
            <div className={`text-3xl md:text-4xl font-serif font-bold ${darkMode ? "text-amber-400" : "text-amber-600"}`}>
              <AnimatedCounter target={s.value} suffix={s.suffix} dec={s.dec || 0} />
            </div>
            <div className={`text-sm font-semibold mt-1 ${darkMode ? "text-white" : "text-stone-900"}`}>{s.label}</div>
            <div className={`text-xs mt-0.5 ${darkMode ? "text-slate-500" : "text-stone-400"}`}>{s.sub}</div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

// ═══════════════════════════════════════════════════════════════
// ABOUT
// ═══════════════════════════════════════════════════════════════

const AboutSection = ({ darkMode }) => (
  <section id="about" className={`py-20 ${darkMode ? "bg-slate-950" : "bg-stone-50"}`}>
    <div className="max-w-6xl mx-auto px-6">
      <div className="grid lg:grid-cols-2 gap-16 items-start">
        <Reveal>
          <SectionHeader eyebrow="About Me" title="From Equations to Hardware" darkMode={darkMode} />
          <p className={`text-base leading-relaxed mb-5 ${darkMode ? "text-slate-400" : "text-stone-600"}`}>
            I'm an M.Tech scholar at IIT Bombay with a passion for making power systems smarter and more efficient.
            My journey began with a GATE Top 2.55% rank among 59,000+ engineers — and that same rigor defines everything I build.
          </p>
          <p className={`text-base leading-relaxed mb-5 ${darkMode ? "text-slate-400" : "text-stone-600"}`}>
            My thesis on LLC Resonant Converters for EV Charging demonstrates my end-to-end engineering capability:
            FHA theory → PLECS simulation → Altium PCB layout → TMS320F28379D firmware, all on the same project.
          </p>
          <p className={`text-base leading-relaxed mb-8 ${darkMode ? "text-slate-400" : "text-stone-600"}`}>
            With 8+ hardware projects spanning EV charging, motor drives, and power quality, I bring both
            academic depth and industry-ready practical skills to every challenge.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { icon: <Cpu size={18} />, text: "Simulation → Hardware" },
              { icon: <Zap size={18} />, text: "Power Electronics Depth" },
              { icon: <Award size={18} />, text: "IIT Bombay · CPI 9.19" },
            ].map(item => (
              <div key={item.text} className={`flex items-center gap-3 p-3 rounded-xl border ${
                darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-stone-200 shadow-sm"
              }`}>
                <span className={`flex-shrink-0 ${darkMode ? "text-amber-400" : "text-amber-600"}`}>{item.icon}</span>
                <span className={`text-sm font-medium ${darkMode ? "text-slate-300" : "text-stone-700"}`}>{item.text}</span>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal direction="right" delay={150}>
          <div className={`rounded-2xl border overflow-hidden ${darkMode ? "border-slate-800 bg-slate-900" : "border-stone-200 bg-white shadow-sm"}`}>
            <div className={`px-6 py-4 border-b ${darkMode ? "border-slate-800" : "border-stone-200"}`}>
              <h3 className={`font-serif font-bold text-lg ${darkMode ? "text-white" : "text-stone-900"}`}>Why Hire Me?</h3>
            </div>
            <div className="px-6 py-5 space-y-5">
              {[
                { title: "Simulation to Silicon", desc: "I design in PLECS/LTSpice, lay out PCBs in Altium, and test hardware on the bench — full-stack power engineer." },
                { title: "DSP Firmware Skills", desc: "Hands-on TMS320F28379D coding — ePWM, ADC, PIE configuration for real closed-loop converter control." },
                { title: "Proven Academic Excellence", desc: "IIT Bombay CPI 9.19, GATE Top 2.55%, 8+ hardware projects with measurable, real outcomes." },
                { title: "Leadership & Mentoring", desc: "Managed 500+ student events, evaluated 78+ students as Teaching Assistant at IIT Bombay." },
              ].map((item, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-1.5 rounded-full bg-amber-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className={`text-sm font-semibold ${darkMode ? "text-white" : "text-stone-900"}`}>{item.title}</p>
                    <p className={`text-sm mt-0.5 ${darkMode ? "text-slate-400" : "text-stone-500"}`}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);

// ═══════════════════════════════════════════════════════════════
// PROJECTS
// ═══════════════════════════════════════════════════════════════

const categoryIcon = {
  "Power Electronics": <Zap size={52} />,
  "Power Quality": <Activity size={52} />,
  "Motor Drives": <Cpu size={52} />,
  "EV Systems": <Globe size={52} />,
  "Robotics": <Terminal size={52} />,
};

const ProjectsSection = ({ darkMode }) => {
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? projects : projects.filter(p => p.category === active);
  return (
    <section id="projects" className={`py-20 ${darkMode ? "bg-slate-900" : "bg-white"}`}>
      <div className="max-w-6xl mx-auto px-6">
        <Reveal>
          <SectionHeader
            eyebrow="Featured Projects"
            title="Real Engineering. Real Results."
            subtitle="8 projects spanning EV charging, motor drives, and power quality — from MATLAB simulation to physical PCB hardware."
            darkMode={darkMode}
          />
        </Reveal>

        <Reveal delay={80}>
          <div className="flex flex-wrap gap-2 mb-10">
            {projectCategories.map(cat => (
              <button key={cat} onClick={() => setActive(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  active === cat
                    ? "bg-amber-600 text-white shadow-md shadow-amber-600/20"
                    : darkMode
                      ? "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}>
                {cat}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-6">
          {filtered.map((project, i) => (
            <Reveal key={project.id} delay={i * 60}>
              <div className={`group rounded-2xl border overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                darkMode ? "bg-slate-800 border-slate-700 hover:border-amber-400/30 hover:shadow-amber-500/5" : "bg-white border-stone-200 hover:border-amber-300 hover:shadow-stone-200/80"
              }`}>
                <div className={`h-44 relative overflow-hidden bg-gradient-to-br ${project.gradient}`}>
                  {project.image ? (
                    <img src={project.image} alt={project.title}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"
                      style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)", backgroundSize: "18px 18px" }}>
                      <div className="text-white opacity-40">{categoryIcon[project.category]}</div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full border border-white/20">
                      {project.category}
                    </span>
                    {project.featured && (
                      <span className="bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">Featured</span>
                    )}
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <p className={`text-xs font-medium mb-1 ${darkMode ? "text-slate-500" : "text-stone-400"}`}>{project.period}</p>
                      <h3 className={`font-serif font-bold text-lg leading-tight ${darkMode ? "text-white" : "text-stone-900"}`}>{project.title}</h3>
                    </div>
                    <a href={project.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub"
                      className={`flex-shrink-0 p-2 rounded-lg border transition-colors ${
                        darkMode ? "border-slate-600 text-slate-400 hover:border-amber-400 hover:text-amber-400" : "border-stone-200 text-stone-400 hover:border-amber-500 hover:text-amber-600"
                      }`}>
                      <Github size={16} />
                    </a>
                  </div>

                  <p className={`text-xs font-semibold mb-3 ${darkMode ? "text-amber-400" : "text-amber-600"}`}>▸ {project.highlight}</p>

                  <p className={`text-sm leading-relaxed mb-4 line-clamp-3 ${darkMode ? "text-slate-400" : "text-stone-600"}`}>{project.description}</p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.tools.map(tool => (
                      <span key={tool} className={`text-xs px-2 py-0.5 rounded-md font-medium ${darkMode ? "bg-slate-700 text-slate-300" : "bg-stone-100 text-stone-700"}`}>
                        {tool}
                      </span>
                    ))}
                  </div>

                  <div className={`pt-3 border-t ${darkMode ? "border-slate-700" : "border-stone-100"}`}>
                    <a href={project.github} target="_blank" rel="noopener noreferrer"
                      className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${darkMode ? "text-slate-400 hover:text-amber-400" : "text-stone-500 hover:text-amber-600"}`}>
                      <Github size={14} />View on GitHub<ExternalLink size={12} className="ml-auto" />
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════
// SKILLS
// ═══════════════════════════════════════════════════════════════

const skillIconEl = { cpu: <Cpu size={22} />, wrench: <Wrench size={22} />, terminal: <Terminal size={22} />, zap: <Zap size={22} /> };

const SkillsSection = ({ darkMode }) => (
  <section id="skills" className={`py-20 ${darkMode ? "bg-slate-950" : "bg-stone-50"}`}>
    <div className="max-w-6xl mx-auto px-6">
      <Reveal>
        <SectionHeader eyebrow="Technical Skills" title="Tools of the Trade"
          subtitle="Comprehensive proficiency across simulation, hardware design, programming, and power electronics domains."
          darkMode={darkMode} />
      </Reveal>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {skillGroups.map((group, i) => (
          <Reveal key={group.title} delay={i * 80}>
            <div className={`h-full p-6 rounded-2xl border ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-stone-200 shadow-sm"}`}>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${darkMode ? "bg-amber-400/10 text-amber-400" : "bg-amber-100 text-amber-600"}`}>
                {skillIconEl[group.icon]}
              </div>
              <h3 className={`font-serif font-bold text-base mb-4 ${darkMode ? "text-white" : "text-stone-900"}`}>{group.title}</h3>
              <div className="flex flex-wrap gap-1.5">
                {group.items.map(item => (
                  <span key={item} className={`text-xs px-2.5 py-1 rounded-full font-medium border ${
                    darkMode ? "bg-slate-800 text-slate-300 border-slate-700" : "bg-stone-50 text-stone-700 border-stone-200"
                  }`}>{item}</span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

// ═══════════════════════════════════════════════════════════════
// CERTIFICATIONS
// ═══════════════════════════════════════════════════════════════

const certBadgeStyle = (color, darkMode) => {
  const map = {
    amber:   darkMode ? "bg-amber-400/10 text-amber-400 border-amber-400/20"       : "bg-amber-100 text-amber-700 border-amber-200",
    blue:    darkMode ? "bg-blue-400/10 text-blue-400 border-blue-400/20"           : "bg-blue-100 text-blue-700 border-blue-200",
    emerald: darkMode ? "bg-emerald-400/10 text-emerald-400 border-emerald-400/20" : "bg-emerald-100 text-emerald-700 border-emerald-200",
    purple:  darkMode ? "bg-purple-400/10 text-purple-400 border-purple-400/20"    : "bg-purple-100 text-purple-700 border-purple-200",
  };
  return map[color] || map.amber;
};

const CertificationsSection = ({ darkMode }) => (
  <section id="certifications" className={`py-20 ${darkMode ? "bg-slate-900" : "bg-white"}`}>
    <div className="max-w-6xl mx-auto px-6">
      <Reveal>
        <SectionHeader eyebrow="Professional Certifications" title="Continuous Learning"
          subtitle="Industry-recognized certifications in DSP, EV technology, IoT, and professional development."
          darkMode={darkMode} />
      </Reveal>
      <div className="grid md:grid-cols-2 gap-6">
        {certifications.map((cert, i) => (
          <Reveal key={cert.title} delay={i * 80}>
            <div className={`p-6 rounded-2xl border h-full ${darkMode ? "bg-slate-800 border-slate-700" : "bg-stone-50 border-stone-200"}`}>
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm border flex-shrink-0 ${certBadgeStyle(cert.color, darkMode)}`}>
                  {cert.badge}
                </div>
                <div>
                  <h3 className={`font-serif font-bold text-base leading-snug ${darkMode ? "text-white" : "text-stone-900"}`}>{cert.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs font-semibold ${darkMode ? "text-amber-400" : "text-amber-600"}`}>{cert.issuer}</span>
                    <span className={`text-xs ${darkMode ? "text-slate-500" : "text-stone-400"}`}>· {cert.period}</span>
                  </div>
                </div>
              </div>
              <p className={`text-xs font-bold uppercase tracking-wide mb-2 ${darkMode ? "text-slate-500" : "text-stone-400"}`}>Key Learnings</p>
              <ul className="space-y-1.5">
                {cert.learnings.map(l => (
                  <li key={l} className={`flex items-start gap-2 text-sm ${darkMode ? "text-slate-400" : "text-stone-600"}`}>
                    <span className="mt-2 w-1 h-1 rounded-full bg-amber-500 flex-shrink-0" />
                    {l}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

// ═══════════════════════════════════════════════════════════════
// COURSEWORK
// ═══════════════════════════════════════════════════════════════

const CourseworkSection = ({ darkMode }) => (
  <section id="coursework" className={`py-20 ${darkMode ? "bg-slate-950" : "bg-stone-50"}`}>
    <div className="max-w-6xl mx-auto px-6">
      <Reveal>
        <SectionHeader eyebrow="Relevant Coursework" title="Specialized Curriculum"
          subtitle="Graduate-level courses at IIT Bombay focused on power electronics, EV systems, and motor drives."
          darkMode={darkMode} />
      </Reveal>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {coursework.map((course, i) => (
          <Reveal key={course.title} delay={i * 60}>
            <div className={`p-5 rounded-2xl border h-full transition-colors ${
              darkMode ? "bg-slate-900 border-slate-800 hover:border-amber-400/30" : "bg-white border-stone-200 hover:border-amber-200 shadow-sm"
            }`}>
              <div className="flex items-start gap-3">
                <div className="mt-1.5 w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" />
                <div>
                  <h3 className={`font-serif font-bold text-base leading-snug mb-2 ${darkMode ? "text-white" : "text-stone-900"}`}>{course.title}</h3>
                  <p className={`text-sm leading-relaxed mb-3 ${darkMode ? "text-slate-400" : "text-stone-600"}`}>{course.topics}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {course.tags.map(tag => (
                      <span key={tag} className={`text-xs px-2 py-0.5 rounded-md font-medium ${darkMode ? "bg-amber-400/10 text-amber-400" : "bg-amber-50 text-amber-700"}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

// ═══════════════════════════════════════════════════════════════
// EDUCATION & ACHIEVEMENTS & LEADERSHIP
// ═══════════════════════════════════════════════════════════════

const EducationSection = ({ darkMode }) => (
  <section id="education" className={`py-20 ${darkMode ? "bg-slate-900" : "bg-white"}`}>
    <div className="max-w-6xl mx-auto px-6">

      <Reveal>
        <SectionHeader eyebrow="Education & Milestones" title="Academic Journey" darkMode={darkMode} />
      </Reveal>

      <div className="space-y-5 mb-16">
        {education.map((edu, i) => (
          <Reveal key={edu.institution} delay={i * 100}>
            <div className={`flex gap-5 p-6 rounded-2xl border ${darkMode ? "bg-slate-800 border-slate-700" : "bg-stone-50 border-stone-200"}`}>
              <div className={`w-14 h-14 rounded-xl border flex-shrink-0 flex items-center justify-center overflow-hidden ${
                darkMode ? "bg-slate-700 border-slate-600" : "bg-white border-stone-200 shadow-sm"
              }`}>
                <img src={edu.logo} alt={edu.institution} className="w-10 h-10 object-contain"
                  onError={e => { e.target.style.display = "none"; }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className={`font-serif font-bold text-lg ${darkMode ? "text-white" : "text-stone-900"}`}>{edu.degree}</h3>
                    <p className={`font-semibold mt-0.5 ${darkMode ? "text-amber-400" : "text-amber-600"}`}>{edu.institution}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={`text-sm font-bold ${darkMode ? "text-white" : "text-stone-800"}`}>{edu.gpa}</p>
                    <p className={`text-xs mt-0.5 ${darkMode ? "text-slate-500" : "text-stone-400"}`}>{edu.period}</p>
                  </div>
                </div>
                <p className={`text-sm mt-2 ${darkMode ? "text-slate-400" : "text-stone-500"}`}>{edu.note}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <h3 className={`text-2xl font-serif font-bold mb-8 ${darkMode ? "text-white" : "text-stone-900"}`}>Scholastic Achievements</h3>
      </Reveal>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
        {achievements.map((ach, i) => (
          <Reveal key={ach.title} delay={i * 70}>
            <div className={`p-5 rounded-2xl border ${darkMode ? "bg-slate-800 border-slate-700" : "bg-stone-50 border-stone-200"}`}>
              <div className="flex items-start gap-3">
                <Award size={20} className={`flex-shrink-0 mt-0.5 ${ach.gold ? "text-amber-500" : "text-slate-400"}`} />
                <div>
                  <p className={`text-xs font-bold mb-1 ${darkMode ? "text-amber-400" : "text-amber-600"}`}>{ach.year}</p>
                  <h4 className={`font-semibold text-sm leading-snug mb-1 ${darkMode ? "text-white" : "text-stone-900"}`}>{ach.title}</h4>
                  <p className={`text-xs leading-relaxed ${darkMode ? "text-slate-400" : "text-stone-500"}`}>{ach.description}</p>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <h3 className={`text-2xl font-serif font-bold mb-8 ${darkMode ? "text-white" : "text-stone-900"}`}>Leadership & Experience</h3>
      </Reveal>
      <div className="grid md:grid-cols-2 gap-5">
        {leadership.map((role, i) => (
          <Reveal key={role.role} delay={i * 70}>
            <div className={`p-5 rounded-2xl border h-full ${darkMode ? "bg-slate-800 border-slate-700" : "bg-stone-50 border-stone-200"}`}>
              <div className="flex items-start gap-3 mb-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${darkMode ? "bg-amber-400/10" : "bg-amber-50"}`}>
                  <Users size={17} className={darkMode ? "text-amber-400" : "text-amber-600"} />
                </div>
                <div>
                  <h4 className={`font-semibold text-sm leading-snug ${darkMode ? "text-white" : "text-stone-900"}`}>{role.role}</h4>
                  <p className={`text-xs mt-0.5 font-medium ${darkMode ? "text-amber-400" : "text-amber-600"}`}>{role.org}</p>
                  <p className={`text-xs ${darkMode ? "text-slate-500" : "text-stone-400"}`}>{role.period}</p>
                </div>
              </div>
              <ul className="space-y-1.5">
                {role.points.map(pt => (
                  <li key={pt} className={`flex items-start gap-2 text-xs leading-relaxed ${darkMode ? "text-slate-400" : "text-stone-600"}`}>
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-amber-500 flex-shrink-0" />
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>

    </div>
  </section>
);

// ═══════════════════════════════════════════════════════════════
// CONTACT
// ═══════════════════════════════════════════════════════════════

const ContactSection = ({ darkMode }) => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle");

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("https://formspree.io/f/mzddggqo", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(form),
      });
      setStatus(res.ok ? "success" : "error");
      if (res.ok) setForm({ name: "", email: "", message: "" });
    } catch { setStatus("error"); }
  };

  const inputCls = darkMode
    ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-amber-400"
    : "bg-stone-50 border-stone-300 text-stone-900 placeholder-stone-400 focus:border-amber-500";

  return (
    <section id="contact" className={`py-20 ${darkMode ? "bg-slate-950" : "bg-stone-50"}`}>
      <div className="max-w-6xl mx-auto px-6">
        <Reveal>
          <SectionHeader eyebrow="Get In Touch" title="Let's Connect"
            subtitle="Open to full-time roles, internships, and research collaborations in power electronics and EV charging."
            center darkMode={darkMode} />
        </Reveal>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <Reveal>
            <div className="space-y-5">
              <div>
                <h3 className={`font-serif font-bold text-xl mb-2 ${darkMode ? "text-white" : "text-stone-900"}`}>Reach Out Directly</h3>
                <p className={`text-sm leading-relaxed ${darkMode ? "text-slate-400" : "text-stone-600"}`}>
                  Whether you're a recruiter, researcher, or fellow engineer — I'm happy to discuss power electronics,
                  EV charging systems, or potential opportunities.
                </p>
              </div>
              {[
                { icon: <Mail size={20} />, label: "Email", value: profile.social.email, href: `mailto:${profile.social.email}`, onClick: e => { e.preventDefault(); window.location.href = `mailto:${profile.social.email}`; } },
                { icon: <Linkedin size={20} />, label: "LinkedIn", value: "linkedin.com/in/aditya-kumar1357", href: profile.social.linkedin },
                { icon: <Github size={20} />, label: "GitHub", value: "github.com/AdityaKumar123-aks", href: profile.social.github },
              ].map(item => (
                <a key={item.label} href={item.href} onClick={item.onClick}
                  target={item.onClick ? undefined : "_blank"} rel="noopener noreferrer"
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-all hover:-translate-y-0.5 ${
                    darkMode ? "bg-slate-900 border-slate-800 hover:border-amber-400/40" : "bg-white border-stone-200 hover:border-amber-300 shadow-sm"
                  }`}>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${darkMode ? "bg-amber-400/10 text-amber-400" : "bg-amber-50 text-amber-600"}`}>
                    {item.icon}
                  </div>
                  <div>
                    <p className={`text-xs font-semibold uppercase tracking-wide ${darkMode ? "text-slate-500" : "text-stone-400"}`}>{item.label}</p>
                    <p className={`text-sm font-medium ${darkMode ? "text-slate-300" : "text-stone-700"}`}>{item.value}</p>
                  </div>
                </a>
              ))}
            </div>
          </Reveal>

          <Reveal direction="right" delay={150}>
            <form onSubmit={handleSubmit} className={`p-6 rounded-2xl border ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-stone-200 shadow-sm"}`}>
              {status === "success" ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <CheckCircle size={48} className="text-emerald-500 mb-4" />
                  <h3 className={`font-serif font-bold text-xl mb-2 ${darkMode ? "text-white" : "text-stone-900"}`}>Message Sent!</h3>
                  <p className={`text-sm ${darkMode ? "text-slate-400" : "text-stone-500"}`}>Thank you — I'll get back to you within 24 hours.</p>
                  <button onClick={() => setStatus("idle")} className="mt-5 text-sm text-amber-600 hover:underline">Send another message</button>
                </div>
              ) : (
                <>
                  <h3 className={`font-serif font-bold text-lg mb-5 ${darkMode ? "text-white" : "text-stone-900"}`}>Send a Message</h3>
                  <div className="space-y-4">
                    {[
                      { id: "name", label: "Your Name", type: "text", placeholder: "John Doe" },
                      { id: "email", label: "Email Address", type: "email", placeholder: "john@company.com" },
                    ].map(f => (
                      <div key={f.id}>
                        <label htmlFor={f.id} className={`block text-xs font-semibold uppercase tracking-wide mb-1.5 ${darkMode ? "text-slate-400" : "text-stone-500"}`}>{f.label}</label>
                        <input id={f.id} type={f.type} required placeholder={f.placeholder}
                          value={form[f.id]} onChange={e => setForm(prev => ({ ...prev, [f.id]: e.target.value }))}
                          className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors ${inputCls}`} />
                      </div>
                    ))}
                    <div>
                      <label htmlFor="message" className={`block text-xs font-semibold uppercase tracking-wide mb-1.5 ${darkMode ? "text-slate-400" : "text-stone-500"}`}>Message</label>
                      <textarea id="message" required rows={4} placeholder="I'd love to discuss..."
                        value={form.message} onChange={e => setForm(prev => ({ ...prev, message: e.target.value }))}
                        className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors resize-none ${inputCls}`} />
                    </div>
                    {status === "error" && (
                      <div className="flex items-center gap-2 text-red-500 text-sm">
                        <AlertCircle size={16} />Something went wrong. Please email directly.
                      </div>
                    )}
                    <button type="submit" disabled={status === "sending"}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors">
                      {status === "sending" ? (
                        <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending...</>
                      ) : (
                        <><Send size={16} />Send Message</>
                      )}
                    </button>
                  </div>
                </>
              )}
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════
// FOOTER
// ═══════════════════════════════════════════════════════════════

const Footer = ({ darkMode }) => (
  <footer className={`py-8 border-t ${darkMode ? "bg-slate-950 border-slate-800" : "bg-white border-stone-200"}`}>
    <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div>
        <span className={`font-serif font-bold ${darkMode ? "text-white" : "text-stone-900"}`}>Aditya Kumar</span>
        <span className={`text-xs ml-2 ${darkMode ? "text-slate-500" : "text-stone-400"}`}>Power Electronics & EV Charging Engineer</span>
      </div>
      <div className="flex items-center gap-2">
        {[
          { href: profile.social.linkedin, icon: <Linkedin size={17} />, label: "LinkedIn" },
          { href: profile.social.github, icon: <Github size={17} />, label: "GitHub" },
          { href: `mailto:${profile.social.email}`, icon: <Mail size={17} />, label: "Email", onClick: e => { e.preventDefault(); window.location.href = `mailto:${profile.social.email}`; } },
        ].map(item => (
          <a key={item.label} href={item.href} onClick={item.onClick}
            target={item.onClick ? undefined : "_blank"} rel="noopener noreferrer" aria-label={item.label}
            className={`p-2 rounded-lg transition-colors ${darkMode ? "text-slate-500 hover:text-amber-400" : "text-stone-400 hover:text-amber-600"}`}>
            {item.icon}
          </a>
        ))}
      </div>
      <p className={`text-xs ${darkMode ? "text-slate-600" : "text-stone-400"}`}>© 2025 Aditya Kumar. All rights reserved.</p>
    </div>
  </footer>
);

// ═══════════════════════════════════════════════════════════════
// SCROLL TO TOP
// ═══════════════════════════════════════════════════════════════

const ScrollToTop = ({ darkMode }) => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const fn = () => setShow(window.scrollY > 400);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  if (!show) return null;
  return (
    <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Back to top"
      className={`fixed bottom-6 right-6 z-50 p-3 rounded-xl border shadow-lg transition-all hover:-translate-y-0.5 ${
        darkMode ? "bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700" : "bg-white border-stone-200 text-amber-600 hover:bg-stone-50"
      }`}>
      <ArrowUp size={18} />
    </button>
  );
};

// ═══════════════════════════════════════════════════════════════
// APP
// ═══════════════════════════════════════════════════════════════

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  return (
    <div className={`font-sans ${darkMode ? "bg-slate-950 text-slate-100" : "bg-stone-50 text-stone-900"}`}>
      <Navbar darkMode={darkMode} toggleDark={() => setDarkMode(d => !d)} />
      <HeroSection darkMode={darkMode} />
      <StatsSection darkMode={darkMode} />
      <AboutSection darkMode={darkMode} />
      <ProjectsSection darkMode={darkMode} />
      <SkillsSection darkMode={darkMode} />
      <CertificationsSection darkMode={darkMode} />
      <CourseworkSection darkMode={darkMode} />
      <EducationSection darkMode={darkMode} />
      <ContactSection darkMode={darkMode} />
      <Footer darkMode={darkMode} />
      <ScrollToTop darkMode={darkMode} />
    </div>
  );
}
