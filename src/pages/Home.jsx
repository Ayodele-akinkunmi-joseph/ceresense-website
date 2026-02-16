import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  Play, 
  Users, 
  TrendingUp, 
  Award,
  Target,
  Clock,
  Zap,
  Brain,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  GraduationCap
} from "lucide-react";
import "../styles/Home.css";

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [progress, setProgress] = useState(0);
  const autoPlayRef = useRef(null);
  const progressRef = useRef(null);
  const slideDirection = useRef(1);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Banner Carousel Slides
  const slides = [
    {
      id: 1,
      image: "/bg1.jpg",
      overlayColor: "rgba(15, 23, 42, 0.7)"
    },
    {
      id: 2,
      image: "/bg2.jpg",
      overlayColor: "rgba(30, 41, 59, 0.75)"
    },
    {
      id: 3,
      image: "/bg5.jpg",
      overlayColor: "rgba(51, 65, 85, 0.8)"
    },
    {
      id: 4,
      image: "/bg4.jpg",
      overlayColor: "rgba(71, 85, 105, 0.7)"
    }
  ];

  // Static content configuration
  const staticContent = {
    badge: "Future-Ready Education",
    title: "Building Future-Ready Tech Professionals",
    highlight: "Future-Ready",
    description: "CERESENSE transforms aspiring individuals into industry-ready tech professionals through cutting-edge curriculum and hands-on training.",
    primaryButton: "Explore Programs",
    primaryLink: "https://portal.ceresense.com.ng/landing",
    secondaryButton: "2026 Cohort",
    secondaryLink: "http://portal.ceresense.com.ng/",
    stats: [
      { number: "127+", label: "Students Trained", icon: <GraduationCap size={24} /> },
      { number: "10+", label: "Real Projects", icon: <Zap size={24} /> },
      { number: "32+", label: "Expert Mentors", icon: <Users size={24} /> },
      { number: "24/7", label: "Learning Support", icon: <Clock size={24} /> }
    ],
    icon: <Brain size={20} />
  };

  const features = [
    {
      icon: <Target size={24} />,
      title: "Industry-Focused Curriculum",
      description: "Learn skills that are in high demand with our industry-aligned courses designed by experts."
    },
    {
      icon: <Clock size={24} />,
      title: "Flexible Learning",
      description: "Study at your own pace with recorded sessions, live classes, and 24/7 access to resources."
    },
    {
      icon: <Zap size={24} />,
      title: "Hands-on Projects",
      description: "Build real-world projects that showcase your skills and enhance your portfolio."
    },
    {
      icon: <Users size={24} />,
      title: "Mentorship",
      description: "Get guidance from industry professionals and career coaches throughout your journey."
    },
    {
      icon: <TrendingUp size={24} />,
      title: "Career Support",
      description: "Access job placement assistance, resume reviews, and interview preparation."
    },
    {
      icon: <Award size={24} />,
      title: "Certification",
      description: "Earn recognized certificates that validate your skills to employers worldwide."
    },
  ];

  const clearIntervals = useCallback(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }
    if (progressRef.current) {
      clearInterval(progressRef.current);
      progressRef.current = null;
    }
  }, []);

  const startAutoPlay = useCallback(() => {
    clearIntervals();
    setProgress(0);

    progressRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          nextSlide();
          return 0;
        }
        return prev + (100 / 80);
      });
    }, 100);

    autoPlayRef.current = setInterval(() => {
      nextSlide();
    }, 8000);
  }, [clearIntervals]);

  useEffect(() => {
    startAutoPlay();
    return () => clearIntervals();
  }, [startAutoPlay, clearIntervals]);

  const nextSlide = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    slideDirection.current = 1;
    setCurrentSlide(prev => (prev + 1) % slides.length);
    setProgress(0);
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating, slides.length]);

  const prevSlide = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    slideDirection.current = -1;
    setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
    setProgress(0);
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating, slides.length]);

  const goToSlide = (index) => {
    if (isAnimating || index === currentSlide) return;
    setIsAnimating(true);
    slideDirection.current = index > currentSlide ? 1 : -1;
    setProgress(0);
    setCurrentSlide(index);
    setTimeout(() => setIsAnimating(false), 500);
    clearIntervals();
    startAutoPlay();
  };

  const handleMouseEnter = clearIntervals;
  const handleMouseLeave = startAutoPlay;

  const backgroundVariants = {
    enter: {
      scale: 1.1,
      opacity: 0
    },
    center: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    },
    exit: {
      scale: 1.1,
      opacity: 0,
      transition: {
        duration: 0.5,
        ease: "easeIn"
      }
    }
  };

  const contentVariants = {
    hidden: {
      opacity: 0,
      y: 40
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <main className="home-container">
      {/* Hero Carousel Section */}
      <section 
        className="hero-section"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-label="Hero carousel"
      >
        {/* Carousel Navigation */}
        <button 
          className="carousel-button prev-button"
          onClick={prevSlide}
          aria-label="Previous slide"
        >
          <ChevronLeft size={24} />
        </button>
        
        <button 
          className="carousel-button next-button"
          onClick={nextSlide}
          aria-label="Next slide"
        >
          <ChevronRight size={24} />
        </button>

        {/* Slides Container */}
        <div className="slides-container">
          <AnimatePresence mode="popLayout" custom={slideDirection.current} initial={false}>
            <motion.div
              key={`bg-${slides[currentSlide].id}`}
              custom={slideDirection.current}
              variants={backgroundVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="slide-background"
              style={{ 
                backgroundImage: `url(${slides[currentSlide].image})`
              }}
            />
          </AnimatePresence>
          
          {/* Gradient Overlay */}
          <div 
            className="slide-overlay"
            style={{
              background: `linear-gradient(135deg, ${slides[currentSlide].overlayColor} 0%, rgba(0, 0, 0, 0.4) 100%)`
            }}
          />
          
          {/* Content Container */}
          <div className="hero-container">
            <div className="hero-content-wrapper">
              {/* Left Column - Main Content */}
              <motion.div
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                className="hero-content"
              >
                <motion.div variants={itemVariants} className="hero-badge">
                  {staticContent.icon}
                  <span>{staticContent.badge}</span>
                </motion.div>

                <motion.h1 variants={itemVariants} className="hero-title">
                  {staticContent.title.split(staticContent.highlight).map((part, i, arr) => (
                    <span key={i}>
                      {part}
                      {i < arr.length - 1 && (
                        <span className="highlight">{staticContent.highlight}</span>
                      )}
                    </span>
                  ))}
                </motion.h1>

                <motion.p variants={itemVariants} className="hero-description">
                  {staticContent.description}
                </motion.p>

                <motion.div variants={itemVariants} className="hero-buttons">
                  <motion.a
                    href={staticContent.primaryLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="primary-button"
                  >
                    {staticContent.primaryButton}
                    <ArrowRight size={20} />
                  </motion.a>
                  
                  <motion.a
                    href={staticContent.secondaryLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="secondary-button"
                  >
                    <Play size={16} />
                    {staticContent.secondaryButton}
                  </motion.a>
                </motion.div>
              </motion.div>

              {/* Right Column - Stats Section with Sliding Cards */}
              <motion.div 
                variants={itemVariants}
                className="stats-section"
              >
                <div className="stats-header">
                  <GraduationCap size={20} />
                  <h3 className="stats-title">CERESENSE ALUMNI</h3>
                </div>
                
                <div className="stats-slider-container">
                  <div 
                    className="stats-slider"
                    style={{
                      animation: isMobile ? 'slideStatsVertical 16s ease-in-out infinite' : 'none',
                    }}
                  >
                    {staticContent.stats.map((stat, index) => (
                      <div key={index} className="stat-slide">
                        <div className="stat-item">
                          <div className="stat-icon">{stat.icon}</div>
                          <div className="stat-content">
                            <div className="stat-number">{stat.number}</div>
                            <div className="stat-label">{stat.label}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-container">
          <div 
            className="progress-bar" 
            style={{ width: `${progress}%` }}
            aria-label={`Slide progress: ${Math.round(progress)}%`}
          />
        </div>

        {/* Dots Indicator */}
        <div className="dots-container" role="tablist">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              aria-selected={index === currentSlide}
              role="tab"
            />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.3 }}
            className="section-header"
          >
            <div className="section-title-stack">
              <span className="section-subtitle">WHY CHOOSE CERESENSE</span>
              <h2 className="section-title">Your Path to Tech Excellence</h2>
              <p className="section-description">
                We combine industry expertise with innovative learning methods to ensure your success
              </p>
            </div>
          </motion.div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -5 }}
                viewport={{ once: true, amount: 0.2 }}
                className="feature-card"
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.3 }}
          className="cta-content"
        >
          <span className="cta-subtitle">Start Your Journey Today</span>
          <h2 className="cta-title">Ready to Transform Your Career?</h2>
          <p className="cta-description">
            Join thousands of successful professionals who launched their tech careers with CERESENSE
          </p>
          
          <motion.a
            href="https://portal.ceresense.com.ng/landing"
            target="_blank"
            rel="noopener noreferrer"
            className="cta-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Apply Now
            <ArrowRight size={20} />
          </motion.a>
          
          <div className="cta-guarantee">
            <CheckCircle size={16} />
            <span>No commitment required</span>
            <span className="divider">•</span>
            <CheckCircle size={16} />
            <span>Free consultation available</span>
          </div>
        </motion.div>
      </section>
    </main>
  );
};

export default Home;