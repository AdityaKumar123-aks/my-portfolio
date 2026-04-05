import React, { useState, useEffect, useRef } from "react";
import {
  Menu,
  X,
  Linkedin,
  Mail,
  Download,
  ExternalLink,
  Zap,
  Cpu,
  Server,
  Award,
  Briefcase,
  Activity,
  Layers,
  Terminal,
  Globe,
  PenTool,
  Send,
  Github,
  Sun,
  Moon,
  GraduationCap,
  Users,
  FileText,
  Wrench,
  ArrowUp,
  MessageSquare,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

// --- 1. Canvas Background: "Energy Flow" ---
const CircuitBackground = ({ darkMode }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", resize);
    resize();

    // Responsive particle count based on screen area
    const particleCount = Math.min(Math.floor((width * height) / 20000), 60);

    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.5, // Slowed down for non-distracting flow
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2 + 1,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Much dimmer colors for subtlety
      const particleColor = darkMode
        ? "rgba(52, 211, 153, 0.2)"
        : "rgba(15, 23, 42, 0.15)";
      const strokeColorBase = darkMode ? "52, 211, 153" : "100, 116, 139"; // Emerald or Slate-500

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off edges
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Draw node with glow effect
        ctx.fillStyle = particleColor;
        ctx.shadowColor = darkMode ? "rgba(52, 211, 153, 0.3)" : "rgba(15, 23, 42, 0.1)";
        ctx.shadowBlur = p.size * 3;
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
        ctx.shadowBlur = 0;

        // Connect nearby particles with Orthogonal Lines (Circuit Traces)
        particles.slice(i + 1).forEach((p2) => {
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Connection distance
          if (dist < 150) {
            ctx.beginPath();
            // Extremely faint lines
            ctx.strokeStyle = `rgba(${strokeColorBase}, ${0.08 - dist / 2500})`;
            ctx.lineWidth = 1;

            // PCB Trace Logic: Move Horizontal then Vertical (L-shape)
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p.y); // Horizontal segment
            ctx.lineTo(p2.x, p2.y); // Vertical segment
            ctx.stroke();
          }
        });
      });
      requestAnimationFrame(animate);
    };
    const animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, [darkMode]);

  return (
    <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />
  );
};

// --- 2. Custom Hooks & Components ---

// 3D Tilt Effect Hook
const useTilt = (intensity = 15) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -intensity;
      const rotateY = ((x - centerX) / centerX) * intensity;
      el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    };

    const handleLeave = () => {
      el.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    };

    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);
    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
    };
  }, [intensity]);

  return ref;
};

// Typing Animation Component
const TypeWriter = ({ words, darkMode }) => {
  const [currentWord, setCurrentWord] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const word = words[currentWord];
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (currentChar < word.length) {
            setCurrentChar(currentChar + 1);
          } else {
            setTimeout(() => setIsDeleting(true), 1500);
          }
        } else {
          if (currentChar > 0) {
            setCurrentChar(currentChar - 1);
          } else {
            setIsDeleting(false);
            setCurrentWord((currentWord + 1) % words.length);
          }
        }
      },
      isDeleting ? 40 : 80
    );
    return () => clearTimeout(timeout);
  }, [currentChar, isDeleting, currentWord, words]);

  return (
    <span className="inline-flex items-center">
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
        {words[currentWord].substring(0, currentChar)}
      </span>
      <span
        className={`inline-block w-[3px] h-[1.1em] ml-0.5 animate-pulse ${
          darkMode ? "bg-emerald-400" : "bg-emerald-600"
        }`}
      />
    </span>
  );
};

// Animated Counter
const AnimatedCounter = ({ target, duration = 1500, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const [setRef, visible] = useOnScreen({ threshold: 0.5 });

  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [visible, target, duration]);

  return <span ref={setRef}>{count}{suffix}</span>;
};

// Glowing Card Wrapper
const GlowCard = ({ children, className = "", darkMode }) => {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty("--mouse-x", `${x}px`);
    cardRef.current.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`relative group/glow ${className}`}
    >
      {darkMode && (
        <div
          className="absolute -inset-[1px] rounded-xl opacity-0 group-hover/glow:opacity-100 transition-opacity duration-500 blur-sm"
          style={{
            background: `radial-gradient(300px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(16,185,129,0.15), transparent 60%)`,
          }}
        />
      )}
      {children}
    </div>
  );
};

const useOnScreen = (options) => {
  const [ref, setRef] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.unobserve(entry.target);
      }
    }, options);
    if (ref) observer.observe(ref);
    return () => {
      if (ref) observer.unobserve(ref);
    };
  }, [ref, options]);

  return [setRef, visible];
};

const Reveal = ({ children, className = "", delay = 0, direction = "up" }) => {
  const [setRef, visible] = useOnScreen({ threshold: 0.1 });
  const transform =
    direction === "up"
      ? "translate-y-12"
      : direction === "left"
      ? "-translate-x-12"
      : "translate-x-12";

  return (
    <div
      ref={setRef}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-1000 cubic-bezier(0.22, 1, 0.36, 1) transform ${
        visible
          ? "opacity-100 translate-y-0 translate-x-0"
          : `opacity-0 ${transform}`
      } ${className}`}
    >
      {children}
    </div>
  );
};

const SectionHeading = ({ number, title, darkMode }) => (
  <div
    className={`flex items-end gap-4 mb-12 border-b pb-4 ${
      darkMode ? "border-white/10" : "border-slate-200"
    }`}
  >
    <span className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 to-cyan-500 opacity-80 font-mono">
      {number}
    </span>
    <h2
      className={`text-3xl md:text-4xl font-bold mb-1 ${
        darkMode ? "text-white" : "text-slate-900"
      }`}
    >
      {title}
    </h2>
  </div>
);

// 3D Tilt Card wrapper for Hero
const HeroCard = ({ children, darkMode }) => {
  const tiltRef = useTilt(8);
  return (
    <div ref={tiltRef} style={{ transition: "transform 0.15s ease-out" }}>
      {children}
    </div>
  );
};

// --- 3. Main Application ---

const Portfolio = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  // Default to Light Mode (false)
  const [darkMode, setDarkMode] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setPageLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  // Submission Status State
  const [formStatus, setFormStatus] = useState({
    submitting: false,
    succeeded: false,
    error: null,
  });

  // SEO & Meta Tags Implementation
  useEffect(() => {
    document.title = "Aditya Kumar | Power Electronics Engineer";
    const metaTags = [
      {
        name: "description",
        content: "Portfolio of Aditya Kumar — Power Electronics Engineer & M.Tech Scholar at IIT Bombay, specializing in high-efficiency converter design for EV battery charging, PCB design, and embedded control systems.",
      },
      {
        property: "og:title",
        content: "Aditya Kumar | Power Electronics Engineer",
      },
      {
        property: "og:description",
        content:
          "Explore the portfolio of a Power Electronics Engineer specializing in EV infrastructure.",
      },
      { property: "og:type", content: "website" },
      {
        property: "og:image",
        content: "https://github.com/AdityaKumar123-aks.png",
      },
      { property: "og:url", content: window.location.href },
    ];

    metaTags.forEach((tag) => {
      let element;
      if (tag.name) {
        element = document.querySelector(`meta[name="${tag.name}"]`);
        if (!element) {
          element = document.createElement("meta");
          element.setAttribute("name", tag.name);
          document.head.appendChild(element);
        }
        element.setAttribute("content", tag.content);
      } else if (tag.property) {
        element = document.querySelector(`meta[property="${tag.property}"]`);
        if (!element) {
          element = document.createElement("meta");
          element.setAttribute("property", tag.property);
          document.head.appendChild(element);
        }
        element.setAttribute("content", tag.content);
      }
    });
  }, []);

  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      // Works regardless of whether the container or window is scrolling
      const scrollTop = container.scrollTop || window.scrollY || 0;
      setScrolled(scrollTop > 20);
      setShowBackToTop(scrollTop > 400);
      const sections = [
        "home",
        "about",
        "skills",
        "projects",
        "education",
        "leadership",
        "contact",
      ];
      const current = sections.find((s) => {
        const el = document.getElementById(s);
        return (
          el &&
          el.getBoundingClientRect().top >= -100 &&
          el.getBoundingClientRect().top <= 300
        );
      });
      if (current) setActiveSection(current);
    };

    // Listen on both container and window to handle all environments
    container.addEventListener("scroll", handleScroll);
    window.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // --- Handlers ---

  const scrollTo = (id) => {
    setIsMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToTop = () => {
    // Cover both scroll contexts
    window.scrollTo({ top: 0, behavior: "smooth" });
    const container = scrollContainerRef.current;
    if (container) container.scrollTop = 0;
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Form Submission with Formspree (via standard FormData)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ submitting: true, succeeded: false, error: null });

    const form = e.target;
    const data = new FormData(form);

    try {
      const response = await fetch("https://formspree.io/f/mzddggqo", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        setFormStatus({ submitting: false, succeeded: true, error: null });
        setFormData({ name: "", email: "", subject: "", message: "" });
        form.reset(); // Clear the form
      } else {
        const data = await response.json();
        // Robust error string extraction
        let errorMessage = "Submission failed";
        if (data && typeof data === "object") {
          if (data.error && typeof data.error === "string") {
            errorMessage = data.error;
          } else if (data.errors && Array.isArray(data.errors)) {
            errorMessage = data.errors.map((err) => err.message).join(", ");
          } else {
            errorMessage = "Something went wrong. Please try again.";
          }
        }
        setFormStatus({
          submitting: false,
          succeeded: false,
          error: errorMessage,
        });
      }
    } catch (error) {
      setFormStatus({
        submitting: false,
        succeeded: false,
        error: "Network error. Please try again.",
      });
    }
  };

  // --- Data ---

  const profile = {
    name: "Aditya Kumar",
    role: "Power Electronics Engineer",
    tagline: "Building the Neural Network of Sustainable Energy",
    bio: "M.Tech Scholar at IIT Bombay. I bridge the gap between theoretical control systems and practical hardware implementation to build next-gen EV charging infrastructure.",
    social: {
      linkedin: "https://www.linkedin.com/in/aditya-kumar1357",
      github: "https://github.com/AdityaKumar123-aks",
      email: "mailto:adityakumarshakya63@gmail.com",
    },
    resume: "/Aditya_Kumar_Resume.pdf",
  };

  const skillsData = [
    {
      category: "Simulation",
      icon: <Activity size={24} />,
      items: "Simulink, PLECS, LTSpice, PVsyst",
      color: "text-blue-400",
    },
    {
      category: "Hardware Design",
      icon: <Layers size={24} />,
      items: "Altium Designer, PCB Layout",
      color: "text-amber-400",
    },
    {
      category: "Lab Equipment",
      icon: <Server size={24} />,
      items:
        "DSO (Tektronix/Keysight), Power Analyzer (Hioki), Thermal Cameras, LCR Meters",
      color: "text-purple-400",
    },
    {
      category: "Prototyping & Testing",
      icon: <Wrench size={24} />,
      items:
        "Double Pulse Test (DPT), Efficiency Mapping, Magnetics Design, SMD Soldering",
      color: "text-rose-400",
    },
    {
      category: "Embedded Systems",
      icon: <Cpu size={24} />,
      items: "Code Composer Studio, TI TMSF28379D",
      color: "text-emerald-400",
    },
    {
      category: "Programming & Tools",
      icon: <Terminal size={24} />,
      items: "C, Python, MATLAB, LaTeX, Inkscape",
      color: "text-cyan-400",
    },
  ];

  const projects = [
    {
      title: "LLC Resonant Converter",
      type: "M.Tech Thesis",
      specs: "1kW | 48V | ZVS/ZCS",
      desc: "High-efficiency converter for EV battery charging. Validated gain equations via FHA method and implemented soft switching.",
      tech: ["PLECS", "Altium", "DSP F28379D"],
      image:
        "https://github.com/AdityaKumar123-aks/MyPortfolio/blob/main/LLC_Resonant_converter.png?raw=true",
      hoverImage:
        "https://github.com/AdityaKumar123-aks/MTP_Design-of-LLC-Resonant-Converter/blob/LLC/Figures%20and%20Waveforms/Setup.jpg?raw=true",
      repo: "https://github.com/AdityaKumar123-aks/MTP_Design-of-LLC-Resonant-Converter",
      report:
        "https://github.com/AdityaKumar123-aks/MTP_Design-of-LLC-Resonant-Converter/blob/LLC/Documentation/Stage_1_Report.pdf",
    },
    {
      title: "3.3kW PFC Converter",
      type: "Course Project",
      specs: "Boost PFC | Analog Ctrl",
      desc: "Designed a Boost PFC converter with analog controller in cascade with diode bridge rectifier for grid stability.",
      tech: ["LTSpice", "Hardware", "Analog"],
      image:
        "https://github.com/AdityaKumar123-aks/MyPortfolio/blob/main/Boost_pfc_converter.png?raw=true",
      hoverImage:
        "https://github.com/AdityaKumar123-aks/Academic_Projects/blob/main/Design_and_Development_of_PFC_converter_for_EV_charger/Figures_and_Waveforms/Hardware%20Setup.png?raw=true",
      repo: "https://github.com/AdityaKumar123-aks/Academic_Projects/tree/main/Design_and_Development_of_PFC_converter_for_EV_charger",
      report:
        "https://github.com/AdityaKumar123-aks/Academic_Projects/blob/main/Design_and_Development_of_PFC_converter_for_EV_charger/Documentation/Report_EN665_Boost_PFC_Project.pdf",
    },
    {
      title: "Back-to-Back VSC",
      type: "Analysis",
      specs: "2-Level | CSVPWM",
      desc: "Evaluated VSC performance. Achieved 28% reduction in source current and 22% THD reduction using CSVPWM.",
      tech: ["MATLAB", "Simulink", "Thermal"],
      image:
        "https://github.com/AdityaKumar123-aks/MyPortfolio/blob/main/Back-to-back_VSC.png?raw=true",
      hoverImage:
        "https://github.com/AdityaKumar123-aks/Academic_Projects/blob/main/Performance_Evaluation_of_Back-to-Back_2-Level_VSC/Assignment_2/Figures%20and%20Waveforms/SVPWM.png?raw=true",
      repo: "https://github.com/AdityaKumar123-aks/Academic_Projects/tree/main/Performance_Evaluation_of_Back-to-Back_2-Level_VSC",
      report:
        "https://github.com/AdityaKumar123-aks/Academic_Projects/blob/main/Performance_Evaluation_of_Back-to-Back_2-Level_VSC/Assignment_2/Documentation/Assign_2_solution.pdf",
    },
    {
      title: "50W Flyback Converter",
      type: "Prototype",
      specs: "5V | 10A | Isolated",
      desc: "Compact DC-DC power supply. Custom magnetics design (5:1 transformer) and full hardware execution.",
      tech: ["Magnetics", "PCB Design", "Hardware"],
      image:
        "https://github.com/AdityaKumar123-aks/MyPortfolio/blob/main/FLyback_converter.png?raw=true",
      hoverImage:
        "https://github.com/AdityaKumar123-aks/Academic_Projects/blob/main/Design_Simulation_and_Hardware_Development_of_Flyback_Converter/Figures%20and%20Waveforms/circuit.png?raw=true",
      repo: "https://github.com/AdityaKumar123-aks/Academic_Projects/tree/main/Design_Simulation_and_Hardware_Development_of_Flyback_Converter",
      report:
        "https://github.com/AdityaKumar123-aks/Academic_Projects/blob/main/Design_Simulation_and_Hardware_Development_of_Flyback_Converter/Documentation/Design%20Flyback%20converter%20with%20LM3481%20Boost%20controller.pdf",
    },
    {
      title: "Induction Motor Drive",
      type: "Optimization",
      specs: "PRF Control | Efficiency",
      desc: "Implemented PRF control strategy achieving 7.46% efficiency improvement over constant V/f control.",
      tech: ["Motor Control", "Microprocessor", "MATLAB"],
      image:
        "https://github.com/AdityaKumar123-aks/MyPortfolio/blob/main/Induction_motor_drive.png?raw=true",
      hoverImage:
        "https://github.com/AdityaKumar123-aks/Academic_Projects/blob/main/Loss_minimization_Control_of_an_Induction_Motor_Drive/Figures/Adaptive_Controller_Block_Diagram.jpg?raw=true",
      repo: "https://github.com/AdityaKumar123-aks/Academic_Projects/tree/main/Loss_minimization_Control_of_an_Induction_Motor_Drive",
      report:
        "https://github.com/AdityaKumar123-aks/Academic_Projects/blob/main/Loss_minimization_Control_of_an_Induction_Motor_Drive/Documentation/Project%20-%20Loss_minimization_control_of_an_induction_motor_drive.pdf",
    },
    {
      title: "Active Power Filter",
      type: "Power Quality",
      specs: "Harmonics < 5%",
      desc: "Designed 1-Phase APF to reduce source current harmonics below IEEE-519 limits using PI regulation.",
      tech: ["PI Control", "Simulation", "Power Quality"],
      image:
        "https://github.com/AdityaKumar123-aks/MyPortfolio/blob/main/Single_phase_active_power_filter.png?raw=true",
      hoverImage:
        "https://github.com/AdityaKumar123-aks/Academic_Projects/blob/main/Single_Phase_Active_Filter_for_Harmonic_Compensation/Figures%20and%20Waveforms/Screenshot%202025-05-05%20013655.png?raw=true",
      repo: "https://github.com/AdityaKumar123-aks/Academic_Projects/tree/main/Single_Phase_Active_Filter_for_Harmonic_Compensation",
      report:
        "https://github.com/AdityaKumar123-aks/Academic_Projects/blob/main/Single_Phase_Active_Filter_for_Harmonic_Compensation/Documentation/Project_report.pdf",
    },
  ];

  const education = [
    {
      degree: "M.Tech (Energy Science & Engineering)",
      inst: "Indian Institute of Technology Bombay",
      time: "2024 - 2026",
      score: "CPI: 9.19",
      courses: "Power Converters, Electric Drives",
      logo: "/IITB_logo.png",
    },
    {
      degree: "B.Tech (Electrical Engineering)",
      inst: "Rajkiya Engineering College Bijnor",
      time: "2019 - 2023",
      score: "GPA: 8.81",
      courses: "Power Electronics, Electrical Machines",
      logo: "/RECB_logo.jpg",
    },
    {
      degree: "Intermediate (Class XII)",
      inst: "Ch. Sughar Singh Inter College",
      time: "2017 - 2018",
      score: "90.00% | Rank 4 in district",
      courses: "Physics, Math",
      logo: "/CSSIC_logo.jpg",
    },
  ];

  const pors = [
    {
      role: "Corporate Relations Coordinator",
      org: "Energy Day, IIT Bombay",
      time: "Mar '25",
      desc: "Managed 100% YoY growth in industry participation.",
      logo: "/ED_logo.jpg",
    },
    {
      role: "Event Coordinator",
      org: "Advitya, IIT Bombay",
      time: "Dec '24",
      desc: "Organized health camp for 1000+ residents.",
      logo: "/ABHYUDAY_logo.png",
    },
    {
      role: "Teaching Assistant",
      org: "EMPES Lab, IIT Bombay",
      time: "Jan '25",
      desc: "Managed lab operations & evaluated 60+ students.",
      logo: "/EMPES_logo.jpg",
    },
    {
      role: "Campus Ambassador",
      org: "Rendezvous, IIT Delhi",
      time: "Apr '21 - Jun '21",
      desc: "Conducted engaging online sessions to boost participation in cultural fest competitions.",
      logo: "/RENDEZVOUS_logo.jpg",
    },
  ];

  return (
    <div
      ref={scrollContainerRef}
      className={`min-h-screen font-sans overflow-x-hidden transition-all duration-700 ${
        pageLoaded ? "opacity-100" : "opacity-0"
      } ${
        darkMode
          ? "bg-[#030712] text-slate-300 selection:bg-emerald-500/30 selection:text-emerald-200"
          : "bg-slate-50 text-slate-700 selection:bg-emerald-500/20 selection:text-emerald-700"
      }`}
    >
      <CircuitBackground darkMode={darkMode} />

      {/* --- Floating Navbar --- */}
      <nav
        className={`fixed top-4 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "px-4" : "px-0 md:px-6"
        }`}
      >
        <div
          className={`max-w-5xl mx-auto backdrop-blur-md border transition-all duration-300 rounded-2xl flex items-center justify-between px-6 py-3 ${
            scrolled
              ? darkMode
                ? "bg-[#0f172a]/80 border-white/10 shadow-lg shadow-emerald-900/10"
                : "bg-white/80 border-slate-200 shadow-lg shadow-slate-200/50"
              : "bg-transparent border-transparent"
          }`}
        >
          <div
            className={`text-xl font-bold tracking-tight cursor-pointer flex items-center gap-2 ${
              darkMode ? "text-white" : "text-slate-900"
            }`}
            onClick={() => scrollTo("home")}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <Zap size={18} fill="currentColor" />
            </div>
            {/* Wrap name in span to keep together and avoid flex gap separation */}
            <span>
              {"Aditya"}
              <span className="text-emerald-500 hidden sm:inline"> Kumar</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1">
            {["About", "Skills", "Projects", "Education", "Contact"].map((item) => (
              <button
                key={item}
                onClick={() => scrollTo(item.toLowerCase())}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  activeSection === item.toLowerCase()
                    ? darkMode
                      ? "text-white bg-white/10"
                      : "text-emerald-700 bg-emerald-50"
                    : darkMode
                    ? "text-slate-400 hover:text-white hover:bg-white/5"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                {item}
              </button>
            ))}

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`ml-2 p-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                darkMode
                  ? "text-slate-400 hover:text-white hover:bg-white/10"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label={
                darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"
              }
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* DOWNLOAD RESUME - CORRECTED LINK */}
            <a
              href={profile.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label="Download Resume"
            >
              RESUME <Download size={14} />
            </a>
          </div>

          <button
            className={`md:hidden ${
              darkMode ? "text-white" : "text-slate-900"
            }`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        <div
          className={`md:hidden absolute top-full left-4 right-4 mt-2 border rounded-xl overflow-hidden transition-all duration-300 origin-top backdrop-blur-xl ${
            darkMode
              ? "bg-[#1e293b]/90 border-white/10 shadow-xl shadow-black/20"
              : "bg-white/90 border-slate-200 shadow-xl"
          } ${isMenuOpen ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"}`}
        >
          <div className="flex flex-col p-2">
            {["About", "Skills", "Projects", "Education", "Contact"].map(
              (item) => (
                <button
                  key={item}
                  onClick={() => scrollTo(item.toLowerCase())}
                  className={`text-left py-3 px-4 rounded-lg ${
                    darkMode
                      ? "text-slate-300 hover:text-white hover:bg-white/5"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  {item}
                </button>
              )
            )}
            <div className="flex items-center justify-between px-4 py-3">
              <span className={darkMode ? "text-slate-300" : "text-slate-600"}>
                Theme
              </span>
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg ${
                  darkMode ? "bg-white/10" : "bg-slate-100"
                }`}
                aria-label="Toggle Dark Mode"
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
            {/* DOWNLOAD RESUME - MOBILE - CORRECTED LINK */}
            <a
              href={profile.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="text-left py-3 px-4 text-emerald-500 font-bold hover:bg-emerald-50/10 rounded-lg"
              aria-label="Download Resume"
            >
              Download Resume
            </a>
          </div>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <section
        id="home"
        className="relative min-h-screen flex items-center justify-center pt-20 px-6 z-10"
      >
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <Reveal>
              <div
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono mb-6 ${
                  darkMode
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                    : "bg-emerald-50 border-emerald-200 text-emerald-700"
                }`}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                OPEN TO OPPORTUNITIES
              </div>
              <h1
                className={`text-6xl md:text-8xl font-bold tracking-tighter leading-none mb-4 ${
                  darkMode ? "text-white" : "text-slate-900"
                }`}
              >
                ADITYA <br />
                <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-500 pb-1 pr-2">
                  KUMAR
                </span>
              </h1>
              <div className="h-1 w-24 bg-gradient-to-r from-emerald-500 to-transparent rounded-full"></div>
            </Reveal>

            <Reveal delay={100}>
              <h2
                className={`text-xl md:text-2xl font-light leading-relaxed max-w-lg ${
                  darkMode ? "text-slate-400" : "text-slate-600"
                }`}
              >
                <span
                  className={`font-medium ${
                    darkMode ? "text-white" : "text-slate-900"
                  }`}
                >
                  Power Electronics Engineer
                </span>{" "}
                specializing in{" "}
                <TypeWriter
                  words={[
                    "EV Charger Design",
                    "Converter Topologies",
                    "Soft Switching",
                    "PCB & Hardware",
                    "Control Systems",
                  ]}
                  darkMode={darkMode}
                />
              </h2>
            </Reveal>

            <Reveal delay={200}>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => scrollTo("projects")}
                  className={`px-8 py-4 font-bold rounded-lg transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    darkMode
                      ? "bg-white text-black hover:bg-emerald-400"
                      : "bg-slate-900 text-white hover:bg-emerald-600"
                  }`}
                >
                  View Projects
                </button>
                <a
                  href={profile.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit LinkedIn Profile"
                  className={`px-8 py-4 border font-bold rounded-lg transition-all flex items-center gap-2 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    darkMode
                      ? "bg-white/5 text-white border-white/10 hover:bg-white/10"
                      : "bg-white text-slate-900 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <Linkedin size={20} /> Connect
                </a>
                <a
                  href={profile.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit GitHub Profile"
                  className={`px-8 py-4 border font-bold rounded-lg transition-all flex items-center gap-2 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    darkMode
                      ? "bg-white/5 text-white border-white/10 hover:bg-white/10"
                      : "bg-white text-slate-900 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <Github size={20} /> GitHub
                </a>
              </div>
            </Reveal>
          </div>

          {/* Hero Visual - Tech Card with 3D Tilt */}
          <Reveal delay={300} className="hidden lg:block relative">
            <div
              className={`absolute inset-0 bg-gradient-to-tr blur-[100px] rounded-full animate-pulse ${
                darkMode
                  ? "from-emerald-500/30 to-blue-500/30"
                  : "from-emerald-300/40 to-blue-300/40"
              }`}
            ></div>
            <HeroCard darkMode={darkMode}>
            <div
              className={`relative backdrop-blur-xl border rounded-2xl p-8 shadow-2xl transition-all duration-700 group ${
                darkMode
                  ? "bg-[#0f172a]/80 border-white/10 shadow-emerald-500/5"
                  : "bg-white/90 border-slate-200"
              }`}
            >
              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">
                    Current Status
                  </div>
                  <div
                    className={`text-2xl font-bold flex items-center gap-2 ${
                      darkMode ? "text-white" : "text-slate-900"
                    }`}
                  >
                    M.Tech Scholar{" "}
                    <Cpu size={20} className="text-emerald-500" />
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">
                    Institute
                  </div>
                  <div
                    className={`text-2xl font-bold ${
                      darkMode ? "text-white" : "text-slate-900"
                    }`}
                  >
                    IIT Bombay
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div
                  className={`flex justify-between items-center p-3 rounded-lg border transition-colors ${
                    darkMode
                      ? "bg-white/5 border-white/5 group-hover:border-emerald-500/30"
                      : "bg-slate-50 border-slate-100 group-hover:border-emerald-500/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/20 rounded text-emerald-500">
                      <Activity size={18} />
                    </div>
                    <span
                      className={`font-medium ${
                        darkMode ? "text-slate-300" : "text-slate-700"
                      }`}
                    >
                      GATE Qualified
                    </span>
                  </div>
                  <span className="font-mono text-emerald-500 font-bold">
                    Top 2.5%
                  </span>
                </div>
                <div
                  className={`flex justify-between items-center p-3 rounded-lg border transition-colors ${
                    darkMode
                      ? "bg-white/5 border-white/5 group-hover:border-cyan-500/30"
                      : "bg-slate-50 border-slate-100 group-hover:border-cyan-500/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-cyan-500/20 rounded text-cyan-500">
                      <Award size={18} />
                    </div>
                    <span
                      className={`font-medium ${
                        darkMode ? "text-slate-300" : "text-slate-700"
                      }`}
                    >
                      Current CPI
                    </span>
                  </div>
                  <span className="font-mono text-cyan-500 font-bold">
                    9.19
                  </span>
                </div>
              </div>

              {/* Code/Schematic Decoration */}
              <div
                className={`h-1 rounded-full overflow-hidden flex ${
                  darkMode ? "bg-slate-800" : "bg-slate-200"
                }`}
              >
                <div className="w-1/3 h-full bg-emerald-500 animate-pulse"></div>
                <div className="w-1/3 h-full bg-cyan-500 animate-pulse delay-75"></div>
                <div className="w-1/3 h-full bg-blue-500 animate-pulse delay-150"></div>
              </div>
            </div>
            </HeroCard>
          </Reveal>
        </div>
      </section>

      {/* --- About Section --- */}
      <section id="about" className="py-24 px-6 relative z-10">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-16 items-start">
          <div className="md:col-span-2">
            <Reveal>
              <SectionHeading
                number="01"
                title="About Me"
                darkMode={darkMode}
              />
              <div
                className={`space-y-6 text-lg leading-relaxed ${
                  darkMode ? "text-slate-400" : "text-slate-700"
                }`}
              >
                <p>
                  I am an electrical engineer driven by the challenge of
                  optimizing energy systems. Currently, as an{" "}
                  <strong className="text-emerald-500 font-medium">
                    M.Tech Scholar at IIT Bombay
                  </strong>
                  , my research centers on the design and control of power
                  electronic converters for electric vehicle applications.
                </p>
                <p>
                  My approach combines rigorous theoretical analysis with
                  hands-on hardware implementation. I have successfully designed
                  and tested multiple power converters, from simulation in{" "}
                  <strong
                    className={darkMode ? "text-slate-200" : "text-slate-800"}
                  >
                    PLECS/MATLAB
                  </strong>{" "}
                  to PCB fabrication and validation in the lab.
                </p>
                <div className="flex gap-4 pt-4">
                  <div
                    className={`border p-4 rounded-xl flex-1 text-center transition-all duration-300 hover:scale-105 ${
                      darkMode
                        ? "bg-emerald-900/10 border-emerald-500/20 hover:bg-emerald-900/20 hover:shadow-lg hover:shadow-emerald-500/10"
                        : "bg-emerald-50 border-emerald-200 hover:bg-emerald-100 hover:shadow-lg"
                    }`}
                  >
                    <div
                      className={`text-3xl font-bold mb-1 ${
                        darkMode ? "text-white" : "text-slate-900"
                      }`}
                    >
                      <AnimatedCounter target={6} />
                    </div>
                    <div className="text-xs text-emerald-500 uppercase tracking-wider font-bold">
                      Major Projects
                    </div>
                  </div>
                  <div
                    className={`border p-4 rounded-xl flex-1 text-center transition-all duration-300 hover:scale-105 ${
                      darkMode
                        ? "bg-cyan-900/10 border-cyan-500/20 hover:bg-cyan-900/20 hover:shadow-lg hover:shadow-cyan-500/10"
                        : "bg-cyan-50 border-cyan-200 hover:bg-cyan-100 hover:shadow-lg"
                    }`}
                  >
                    <div
                      className={`text-3xl font-bold mb-1 ${
                        darkMode ? "text-white" : "text-slate-900"
                      }`}
                    >
                      9.19
                    </div>
                    <div className="text-xs text-cyan-500 uppercase tracking-wider font-bold">
                      CPI at IIT Bombay
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={200} className="relative group">
            <div className="absolute inset-0 bg-emerald-500 rounded-lg rotate-6 opacity-20 group-hover:rotate-3 transition-all duration-300"></div>
            <div
              className={`relative border p-8 rounded-lg shadow-xl ${
                darkMode
                  ? "bg-[#0f1629] border-white/10"
                  : "bg-white border-slate-200"
              }`}
            >
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: <Zap />, label: "Power Electronics" },
                  { icon: <Cpu />, label: "Control Systems" },
                  { icon: <Activity />, label: "Simulation" },
                  { icon: <Server />, label: "Hardware" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className={`flex flex-col items-center justify-center p-4 rounded-lg transition-colors ${
                      darkMode
                        ? "bg-white/5 hover:bg-white/10"
                        : "bg-slate-50 hover:bg-slate-100"
                    }`}
                  >
                    <div className="text-emerald-500 mb-2">{item.icon}</div>
                    <span
                      className={`text-xs text-center ${
                        darkMode ? "text-slate-300" : "text-slate-600"
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* --- Skills Section --- */}
      <section
        id="skills"
        className={`py-24 px-6 border-y relative z-10 ${
          darkMode
            ? "bg-[#0B1120] border-white/5"
            : "bg-slate-50 border-slate-200"
        }`}
      >
        <div className="max-w-6xl mx-auto">
          <SectionHeading number="02" title="Tech Stack" darkMode={darkMode} />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skillsData.map((skill, idx) => (
              <Reveal key={idx} delay={idx * 100} className="h-full">
                <GlowCard darkMode={darkMode} className="h-full">
                  <div
                    className={`relative group h-full p-6 rounded-xl border transition-all duration-300 flex flex-col items-start gap-4 hover:-translate-y-1 ${
                      darkMode
                        ? "bg-[#111827] border-white/5 hover:border-emerald-500/50 hover:shadow-[0_4px_20px_rgba(16,185,129,0.1)]"
                        : "bg-white border-slate-200 hover:border-emerald-500/30 hover:shadow-xl"
                    }`}
                  >
                    <div
                      className={`${skill.color} p-3 rounded-lg transition-all group-hover:scale-110 duration-300 ${
                        darkMode ? "bg-white/5" : "bg-slate-50"
                      }`}
                    >
                      {skill.icon}
                    </div>
                    <div>
                      <h3
                        className={`text-xl font-bold mb-2 group-hover:text-emerald-500 transition-colors ${
                          darkMode ? "text-white" : "text-slate-900"
                        }`}
                      >
                        {skill.category}
                      </h3>
                      <p
                        className={`text-sm leading-relaxed ${
                          darkMode ? "text-slate-400" : "text-slate-600"
                        }`}
                      >
                        {skill.items}
                      </p>
                    </div>
                    {/* Animated bottom bar on hover */}
                    <div className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-b-xl bg-gradient-to-r from-emerald-500 to-cyan-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
                  </div>
                </GlowCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* --- Projects Section --- */}
      <section id="projects" className="py-24 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            number="03"
            title="Engineering Projects"
            darkMode={darkMode}
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p, i) => (
              <Reveal key={i} delay={i * 100}>
                <GlowCard darkMode={darkMode}>
                <div
                  className={`group rounded-xl border overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl flex flex-col h-full ${
                    darkMode
                      ? "bg-[#0f172a] border-white/10 hover:border-emerald-500/30 hover:shadow-emerald-500/10"
                      : "bg-white border-slate-200 hover:border-emerald-300"
                  }`}
                >
                  {/* Image Container */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-200 dark:bg-slate-800">
                    {/* Hover Image (Background) */}
                    <img
                      src={p.hoverImage}
                      alt={`${p.title} detail`}
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://placehold.co/600x400/10b981/ffffff?text=Image+Missing";
                      }}
                    />
                    {/* Main Image (Foreground - fades out on hover) */}
                    <img
                      src={p.image}
                      alt={p.title}
                      className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://placehold.co/600x400/10b981/ffffff?text=Image+Missing";
                      }}
                    />

                    {/* Overlay Gradient for text readability if needed, but text is below. Maybe just a subtle border? */}
                    <div
                      className={`absolute inset-0 border-b ${
                        darkMode ? "border-white/5" : "border-slate-100"
                      }`}
                    ></div>

                    {/* Type Badge (moved to top left over image?) Or keep inside? */}
                    <div className="absolute top-3 left-3">
                      <span
                        className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded backdrop-blur-md ${
                          darkMode
                            ? "bg-black/60 text-white"
                            : "bg-white/90 text-slate-800"
                        }`}
                      >
                        {p.type}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <h3
                        className={`text-xl font-bold ${
                          darkMode ? "text-white" : "text-slate-900"
                        }`}
                      >
                        {p.title}
                      </h3>
                    </div>

                    <div className="mb-3">
                      <span
                        className={`text-xs font-mono ${
                          darkMode ? "text-cyan-400" : "text-cyan-600"
                        }`}
                      >
                        {p.specs}
                      </span>
                    </div>

                    <p
                      className={`text-sm leading-relaxed mb-4 line-clamp-3 ${
                        darkMode ? "text-slate-400" : "text-slate-700"
                      }`}
                    >
                      {p.desc}
                    </p>

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {p.tech.map((t, i) => (
                        <span
                          key={i}
                          className={`text-[10px] px-1.5 py-0.5 rounded border ${
                            darkMode
                              ? "border-slate-700 text-slate-400"
                              : "border-slate-200 text-slate-600"
                          }`}
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Buttons Footer */}
                    <div className="mt-auto flex gap-3 pt-3 border-t border-dashed border-slate-200 dark:border-slate-800">
                      <a
                        href={p.repo}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`View Source Code for ${p.title}`}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                          darkMode
                            ? "bg-white/5 hover:bg-white/10 text-white"
                            : "bg-slate-50 hover:bg-slate-100 text-slate-700"
                        }`}
                      >
                        <Github size={14} /> Code
                      </a>
                      <a
                        href={p.report}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`View Project Report for ${p.title}`}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                          darkMode
                            ? "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400"
                            : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        <FileText size={14} /> Report
                      </a>
                    </div>
                  </div>
                </div>
                </GlowCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* --- Education Timeline --- */}
      <section
        id="education"
        className={`py-24 px-6 relative z-10 ${
          darkMode ? "bg-[#0B1120]" : "bg-slate-50"
        }`}
      >
        <div className="max-w-4xl mx-auto">
          <SectionHeading
            number="04"
            title="Education & Milestones"
            darkMode={darkMode}
          />

          <div className="relative pl-8 md:pl-12 space-y-12">
            {/* PCB Trace Line */}
            <div
              className={`absolute left-3 top-2 bottom-2 w-0.5 bg-gradient-to-b from-emerald-500 via-cyan-500 opacity-50 ${
                darkMode ? "to-slate-800" : "to-slate-200"
              }`}
            ></div>

            {education.map((edu, i) => (
              <Reveal key={i} direction="left" delay={i * 150}>
                <div className="relative">
                  {/* Node Point */}
                  <div
                    className={`absolute -left-[41px] md:-left-[57px] top-1 w-6 h-6 border-2 border-emerald-500 rounded-full flex items-center justify-center z-10 shadow-lg ${
                      darkMode ? "bg-[#0B1120]" : "bg-slate-50"
                    }`}
                  >
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  </div>

                  <div
                    className={`p-6 rounded-xl border transition-all duration-300 hover:-translate-y-1 ${
                      darkMode
                        ? "bg-[#1e293b]/40 border-white/5 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/5"
                        : "bg-white border-slate-200 hover:border-emerald-500/50 shadow-sm hover:shadow-lg"
                    }`}
                  >
                    <div className="flex gap-6 items-start">
                      {/* Logo Box - Increased size */}
                      <div
                        className={`flex-shrink-0 w-20 h-20 md:w-24 md:h-24 p-2 rounded-xl flex items-center justify-center bg-white border border-slate-100`}
                      >
                        <img
                          src={edu.logo}
                          alt={`${edu.inst} Logo`}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>

                      <div className="flex-grow">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-1">
                          <h3
                            className={`text-xl font-bold ${
                              darkMode ? "text-white" : "text-slate-900"
                            }`}
                          >
                            {edu.inst}
                          </h3>
                          <span
                            className={`text-sm font-mono px-2 py-1 rounded w-fit ${
                              darkMode
                                ? "text-slate-400 bg-black/20"
                                : "text-slate-600 bg-slate-100"
                            }`}
                          >
                            {edu.time}
                          </span>
                        </div>
                        <div className="text-lg text-emerald-500 font-medium mb-2">
                          {edu.degree}
                        </div>
                        <div className="flex flex-wrap gap-3 mb-4">
                          <span
                            className={`text-sm font-bold px-2 py-1 rounded border ${
                              darkMode
                                ? "text-white bg-white/5 border-white/5"
                                : "text-slate-800 bg-slate-100 border-slate-200"
                            }`}
                          >
                            {edu.score}
                          </span>
                        </div>
                        <p
                          className={`text-sm border-t pt-3 mt-1 ${
                            darkMode
                              ? "text-slate-400 border-white/5"
                              : "text-slate-600 border-slate-100"
                          }`}
                        >
                          <span
                            className={`font-mono text-xs uppercase mr-2 ${
                              darkMode ? "text-slate-500" : "text-slate-500"
                            }`}
                          >
                            Focus:
                          </span>
                          {edu.courses}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* --- Leadership & PORs --- */}
      <section id="leadership" className="py-24 px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <SectionHeading number="05" title="Leadership" darkMode={darkMode} />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pors.map((por, i) => (
              <Reveal key={i} delay={i * 100}>
                <div
                  className={`p-6 rounded-xl border transition-all duration-300 h-full hover:-translate-y-2 flex flex-col items-center text-center ${
                    darkMode
                      ? "bg-[#0f172a] border-white/10 hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/10"
                      : "bg-white border-slate-200 hover:border-emerald-500/30 shadow-sm hover:shadow-xl"
                  }`}
                >
                  <div className="mb-4 w-24 h-24 flex items-center justify-center p-2 rounded-xl bg-white border border-slate-100 shadow-sm overflow-hidden">
                    <img
                      src={por.logo}
                      alt={`${por.org} Logo`}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <h3
                    className={`font-bold text-base mb-1 ${
                      darkMode ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {por.role}
                  </h3>
                  <div
                    className={`text-xs mb-4 ${
                      darkMode ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    {por.org} <span className="text-slate-400 mx-1">•</span>{" "}
                    {por.time}
                  </div>
                  <p
                    className={`text-xs leading-relaxed ${
                      darkMode ? "text-slate-400" : "text-slate-600"
                    }`}
                  >
                    {por.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* --- Contact Section --- */}
      <section id="contact" className="py-24 relative overflow-hidden z-10">
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/10 to-transparent pointer-events-none"></div>
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeading
            number="06"
            title="Get In Touch"
            darkMode={darkMode}
          />

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column: Text & Socials */}
            <div className="space-y-8 text-center lg:text-left">
              <Reveal>
                <h3
                  className={`text-4xl md:text-5xl font-bold tracking-tight mb-4 ${
                    darkMode ? "text-white" : "text-slate-900"
                  }`}
                >
                  Let's Build the <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
                    Future Together
                  </span>
                </h3>
                <p
                  className={`text-lg leading-relaxed max-w-md mx-auto lg:mx-0 ${
                    darkMode ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  Whether you have a question about my research, a potential
                  collaboration, or just want to discuss the future of power
                  electronics, I'd love to hear from you.
                </p>

                <div className="flex justify-center lg:justify-start gap-4 mt-8">
                  <a
                    href={profile.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-4 rounded-full border transition-all hover:-translate-y-1 ${
                      darkMode
                        ? "bg-[#1e293b] border-white/10 hover:bg-[#334155] text-white"
                        : "bg-white border-slate-200 hover:bg-slate-50 text-slate-900"
                    }`}
                    aria-label="LinkedIn"
                  >
                    <Linkedin size={24} />
                  </a>
                  <a
                    href={profile.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-4 rounded-full border transition-all hover:-translate-y-1 ${
                      darkMode
                        ? "bg-[#1e293b] border-white/10 hover:bg-[#334155] text-white"
                        : "bg-white border-slate-200 hover:bg-slate-50 text-slate-900"
                    }`}
                    aria-label="GitHub"
                  >
                    <Github size={24} />
                  </a>
                  <a
                    href={profile.social.email}
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.href = profile.social.email;
                    }}
                    className={`p-4 rounded-full border transition-all hover:-translate-y-1 ${
                      darkMode
                        ? "bg-[#1e293b] border-white/10 hover:bg-[#334155] text-white"
                        : "bg-white border-slate-200 hover:bg-slate-50 text-slate-900"
                    }`}
                    aria-label="Email"
                  >
                    <Mail size={24} />
                  </a>
                </div>
              </Reveal>
            </div>

            {/* Right Column: Form with glassmorphism */}
            <div
              className={`p-6 md:p-8 rounded-2xl border shadow-xl backdrop-blur-sm transition-all duration-300 ${
                darkMode
                  ? "bg-[#0f172a]/80 border-white/10 hover:border-emerald-500/20 hover:shadow-emerald-500/5"
                  : "bg-white/80 border-slate-200 hover:shadow-2xl"
              }`}
            >
              {!formStatus.succeeded ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="name"
                      className={`block text-sm font-bold mb-2 ${
                        darkMode ? "text-slate-300" : "text-slate-700"
                      }`}
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg outline-none transition-all border ${
                        darkMode
                          ? "bg-[#1e293b] border-slate-700 text-white focus:border-emerald-500"
                          : "bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-500"
                      }`}
                      placeholder="Your Name"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className={`block text-sm font-bold mb-2 ${
                        darkMode ? "text-slate-300" : "text-slate-700"
                      }`}
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg outline-none transition-all border ${
                        darkMode
                          ? "bg-[#1e293b] border-slate-700 text-white focus:border-emerald-500"
                          : "bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-500"
                      }`}
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className={`block text-sm font-bold mb-2 ${
                        darkMode ? "text-slate-300" : "text-slate-700"
                      }`}
                    >
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg outline-none transition-all border ${
                        darkMode
                          ? "bg-[#1e293b] border-slate-700 text-white focus:border-emerald-500"
                          : "bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-500"
                      }`}
                      placeholder="Project Inquiry / Collaboration"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className={`block text-sm font-bold mb-2 ${
                        darkMode ? "text-slate-300" : "text-slate-700"
                      }`}
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows="4"
                      value={formData.message}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg outline-none transition-all border ${
                        darkMode
                          ? "bg-[#1e293b] border-slate-700 text-white focus:border-emerald-500"
                          : "bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-500"
                      }`}
                      placeholder="How can we work together?"
                    ></textarea>
                  </div>

                  {formStatus.error && (
                    <div className="text-red-500 text-sm flex items-center gap-2">
                      <AlertCircle size={16} /> {formStatus.error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={formStatus.submitting}
                    className={`w-full py-4 font-bold rounded-lg shadow-lg transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 ${
                      formStatus.submitting
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-600 hover:to-cyan-700 text-white shadow-emerald-500/20"
                    }`}
                  >
                    {formStatus.submitting ? (
                      "Sending..."
                    ) : (
                      <>
                        Send Message <Send size={18} />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-500 mb-4">
                    <CheckCircle size={32} />
                  </div>
                  <h3
                    className={`text-2xl font-bold mb-2 ${
                      darkMode ? "text-white" : "text-slate-900"
                    }`}
                  >
                    Message Sent!
                  </h3>
                  <p className={darkMode ? "text-slate-400" : "text-slate-600"}>
                    Thanks for reaching out. I'll get back to you as soon as
                    possible.
                  </p>
                  <button
                    onClick={() =>
                      setFormStatus({
                        submitting: false,
                        succeeded: false,
                        error: null,
                      })
                    }
                    className="mt-6 text-emerald-500 font-bold hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <footer
          className={`py-10 text-center text-sm font-mono border-t mt-24 ${
            darkMode
              ? "bg-[#050914] border-white/5 text-slate-400"
              : "bg-slate-50 border-slate-200 text-slate-600"
          }`}
        >
          <div className="flex justify-center gap-6 mb-4">
            {[
              { href: profile.social.linkedin, icon: <Linkedin size={18} />, label: "LinkedIn" },
              { href: profile.social.github, icon: <Github size={18} />, label: "GitHub" },
              { href: profile.social.email, icon: <Mail size={18} />, label: "Email" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.label !== "Email" ? "_blank" : undefined}
                rel={link.label !== "Email" ? "noopener noreferrer" : undefined}
                onClick={
                  link.label === "Email"
                    ? (e) => {
                        e.preventDefault();
                        window.location.href = link.href;
                      }
                    : undefined
                }
                className={`transition-all hover:-translate-y-1 ${
                  darkMode
                    ? "text-slate-500 hover:text-emerald-400"
                    : "text-slate-400 hover:text-emerald-600"
                }`}
                aria-label={link.label}
              >
                {link.icon}
              </a>
            ))}
          </div>
          <p>
            © {new Date().getFullYear()} Aditya Kumar. Engineered with React &
            Tailwind.
          </p>
        </footer>
      </section>

      {/* --- Back to Top Button --- */}
      <button
        onClick={scrollToTop}
        aria-label="Back to Top"
        className={`fixed bottom-8 right-8 p-3 rounded-full shadow-xl transition-all duration-500 transform hover:scale-110 z-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
          showBackToTop
            ? "translate-y-0 opacity-100"
            : "translate-y-16 opacity-0"
        } ${
          darkMode
            ? "bg-emerald-600 text-white hover:bg-emerald-500"
            : "bg-emerald-500 text-white hover:bg-emerald-600"
        }`}
      >
        <ArrowUp size={24} />
      </button>
    </div>
  );
};

export default Portfolio;
