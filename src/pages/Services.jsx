import { motion } from "framer-motion";
import { 
  Sparkles,
  ChevronRight,
  ArrowRight,
  Globe,
  Rocket
} from "lucide-react";
import "../styles/Services.css";

const Services = () => {
  const programs = [
    {
      title: "Full-Stack Development",
      image: "/programs/fullstack.jpg",
      category: "Web Development",
      description: "Build complete web applications from frontend to backend",
      color: "#3b82f6"
    },
    {
      title: "AI & Machine Learning",
      image: "/programs/ai-ml.jpg",
      category: "Data Science",
      description: "Create intelligent systems and predictive models",
      color: "#8b5cf6"
    },
    {
      title: "Mobile App Development",
      image: "/programs/mobile.jpg",
      category: "Mobile Development",
      description: "Build cross-platform iOS and Android applications",
      color: "#10b981"
    },
    {
      title: "Graphics Design",
      image: "/programs/graphics.jpg",
      category: "Design",
      description: "Create stunning visual designs and graphics",
      color: "#f59e0b"
    },
    {
      title: "UI/UX Design",
      image: "/programs/uiux.jpg",
      category: "Design",
      description: "Create exceptional digital user experiences",
      color: "#ec4899"
    },
    {
      title: "Cybersecurity",
      image: "/programs/cyber.jpg",
      category: "Security",
      description: "Protect systems and data from digital threats",
      color: "#ef4444"
    },
    {
      title: "DevOps Engineering",
      image: "/programs/devops.jpg",
      category: "DevOps",
      description: "Master cloud infrastructure and deployment",
      color: "#0ea5e9"
    },
    {
      title: "3D Modeling & Animation",
      image: "/programs/3dmodeling.jpg",
      category: "Design",
      description: "Create stunning 3D models and animations",
      color: "#f97316"
    }
  ];

  return (
    <div className="services-page">
      {/* Hero Section */}
      <section className="services-hero">
        <div className="hero-background-pattern"></div>
        <div className="services-hero-container">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="services-hero-content"
          >
            <div className="brand-badge">
              <Sparkles size={20} />
              <span>CERESENSE PROGRAMS</span>
            </div>
            
            <h1 className="services-hero-title">
              <span className="ceresense-text">CERESENSE</span>
              <span className="hero-subtitle">Immerse in Excellence</span>
            </h1>
            
            <p className="services-hero-description">
              Choose your path to tech mastery. Each CERESENSE program is a carefully crafted 
              journey from fundamentals to expertise, designed for real-world impact.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Programs Grid - Minimalist */}
      <section className="programs-section">
        <div className="programs-container">
          <div className="programs-grid">
            {programs.map((program, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="program-card"
              >
                <div className="program-image-container">
                  <img 
                    src={program.image} 
                    alt={program.title}
                    className="program-image"
                  />
                  <div 
                    className="program-category"
                    style={{ 
                      background: program.color,
                      border: `1px solid ${program.color}`
                    }}
                  >
                    {program.category}
                  </div>
                  <div className="program-overlay">
                    <div className="overlay-content">
                      <h3 className="program-title-overlay">{program.title}</h3>
                      <p className="program-description-overlay">{program.description}</p>
                      {/* <a href={`/programs/${program.title.toLowerCase().replace(/\s+/g, '-')}`} className="overlay-button">
                        Learn More
                        <ArrowRight size={16} />
                      </a> */}
                    </div>
                  </div>
                </div>
                
                <div className="program-info">
                  <h3 className="program-title">{program.title}</h3>
                  <p className="program-description">{program.description}</p>
                  <a href={`/programs/${program.title.toLowerCase().replace(/\s+/g, '-')}`} className="program-link" style={{ color: program.color }}>
                  
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="services-cta">
        <div className="cta-background-pattern"></div>
        <div className="cta-container">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="cta-content"
          >
            <div className="cta-icon">
              <Rocket size={48} />
            </div>
            
            <h2 className="cta-title">
              Not Sure Which Program is Right for You?
            </h2>
            
            <p className="cta-description">
              Schedule a free consultation with our career advisors. We'll help you 
              choose the perfect program based on your goals and background.
            </p>
            
            <div className="cta-actions">
              <motion.a
                href="/schedule"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="primary-cta-button"
              >
                Book Free Consultation
                <ChevronRight size={20} />
              </motion.a>
              
              <motion.a
                href="/programs"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="secondary-cta-button"
              >
                View All Programs
                <Globe size={20} />
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Services;