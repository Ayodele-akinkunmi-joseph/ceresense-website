import { motion } from "framer-motion";
import { 
  Target, 
  Users, 
  TrendingUp, 
  Award,
  Rocket,
  Lightbulb,
  Globe,
  Heart,
  ChevronRight,
  Sparkles,
  Brain,
  Zap,
  Shield,
  Star,
  Compass,
  Layers
} from "lucide-react";
import "../styles/About.css";

const About = () => {
  const values = [
    {
      icon: <Brain size={32} />,
      title: "Intellectual Rigor",
      description: "We believe in depth over breadth, ensuring every concept is mastered before moving forward."
    },
    {
      icon: <Zap size={32} />,
      title: "Accelerated Excellence",
      description: "Compressing years of industry experience into intensive, transformative learning journeys."
    },
    {
      icon: <Shield size={32} />,
      title: "Integrity First",
      description: "Transparent outcomes, honest guidance, and ethical practices in everything we do."
    },
    {
      icon: <Compass size={32} />,
      title: "Future-Forward Vision",
      description: "Anticipating industry shifts and preparing learners for tomorrow's challenges today."
    }
  ];

  const pillars = [
    {
      title: "Technical Mastery",
      description: "Deep, practical understanding of modern technologies and architectures.",
      icon: <Layers size={28} />
    },
    {
      title: "Professional Acumen",
      description: "Soft skills, communication, and industry best practices for career success.",
      icon: <Users size={28} />
    },
    {
      title: "Innovation Mindset",
      description: "Creative problem-solving and adaptability in fast-evolving tech landscapes.",
      icon: <Lightbulb size={28} />
    },
    {
      title: "Global Perspective",
      description: "Understanding diverse markets and cross-cultural collaboration opportunities.",
      icon: <Globe size={28} />
    }
  ];

  const milestones = [
    { year: "2019", title: "Genesis", description: "CERESENSE founded with a vision to redefine tech education." },
    { year: "2022", title: "Expansion", description: "Launched specialized tracks in AI, Cloud, and Web3 technologies." },
    { year: "2024", title: "Innovation Lab", description: "Established R&D division for next-gen learning methodologies." },
     { year: "2025", title: "Validation", description: "First cohort achieves 92% placement with top tech firms." },
      { year: "2026", title: "Innovation Lab", description: "Established R&D division for next-gen learning methodologies." }
  ];

  const team = [
    {
      name: "Samuel Tomori",
      role: "CEO 1",
      bio: "The dynamic CEO 1 of Ceresense, brings expertise in technology and leadership, driving innovation and success.",
      image: "/team1.jpg"
    },
    {
      name: "Johnson Aluko",
      role: "CEO 2",
      bio: "The visionary CEO 2 of Ceresense, leads with a passion for tech innovation and a purpose to making a better world.",
      image: "/team2.jpg"
    },
    // {
    //   name: "ABDULAFEEZ SHITTU",
    //   role: "Sofware Dev Officer",
    //   bio: "Our Software Development Officer, is a coding wizard dedicated to crafting top-notch tech solutions, driving our innovation forward",
    //   image: "/team4.jpg"
    // },
    // {
    //   name: "Balogun Emmanuel",
    //   role: "Digital Marketing/Graphic design",
    //   bio: "Our Digital Marketing and Graphic Design team combines creativity and strategy to deliver visually stunning and effective digital campaigns",
    //   image: "/team3.jpg"
    // }
  ];

  return (
    <div className="about-page">
      {/* Hero Section - Brand Focused */}
      <section className="about-hero">
        <div className="hero-background-pattern"></div>
        <div className="about-hero-container">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="about-hero-content"
          >
            <div className="brand-badge">
              <Sparkles size={20} />
              <span>ABOUT CERESENSE</span>
            </div>
            
            <h1 className="about-hero-title">
              <span className="ceresense-text">CERESENSE</span>
              <span className="hero-subtitle">Redefining Tech Education</span>
            </h1>
            
            <p className="about-hero-description">
              <strong>CERESENSE</strong> represents more than an educational platform it's a movement. 
              We bridge the gap between academic theory and industry practice through 
              meticulously crafted learning experiences that transform potential into excellence.
            </p>
            
            <div className="brand-quote">
              <div className="quote-icon">"</div>
              <p className="quote-text">
                Where <span className="highlight">potential</span> meets <span className="highlight">purpose</span>, 
                and <span className="highlight">aspiration</span> becomes <span className="highlight">achievement</span>.
              </p>
            </div>
          </motion.div>
          
        
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="philosophy-section">
        <div className="philosophy-container">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="philosophy-content"
          >
            <h2 className="section-title">
              The <span className="ceresense-accent">CERESENSE</span> Philosophy
            </h2>
            <p className="philosophy-description">
              At <strong>CERESENSE</strong>, we believe education should be a transformative force not just 
              a transactional exchange. Our approach combines academic rigor with industry relevance, 
              creating learning experiences that are both intellectually challenging and practically applicable.
            </p>
            <p className="philosophy-description">
              We don't just teach technology; we cultivate the mindset, discipline, and creativity 
              required to excel in today's dynamic digital landscape. Every program is a carefully 
              curated journey from novice to practitioner to innovator.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="philosophy-visual"
          >
            <div className="visual-circle">
              <span className="circle-text">CERESENSE</span>
              <div className="circle-ring"></div>
              <div className="circle-dots">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pillars of Excellence */}
      <section className="pillars-section">
        <div className="pillars-container">
          <div className="section-header">
            <div className="section-subtitle">Our Framework</div>
                  <h2 
                    className="section-title" 
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'center', 
                      alignItems: 'center'
                    }}
                  >
                    Pillars of <span className="ceresense-accent">Excellence</span>
                  </h2>
            <p className="section-description">
              The foundational principles that define the CERESENSE learning experience
            </p>
          </div>

          <div className="pillars-grid">
            {pillars.map((pillar, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="pillar-card"
              >
                <div className="pillar-icon">
                  {pillar.icon}
                </div>
                <h3 className="pillar-title">{pillar.title}</h3>
                <p className="pillar-description">{pillar.description}</p>
                <div className="pillar-number">0{index + 1}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="values-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="values-header"
          >
            <div>
          <h2 
  className="section-title"
  style={{
    textAlign: 'center',
    margin: '0 auto',
    display: 'block',
    width: '100%',
    maxWidth: '800px',
    fontSize: '38px',
    fontWeight: '800',
    color: '#0f172a',
    lineHeight: '1.2'
  }}
>
  Our <span className="ceresense-accent" style={{ color: '#2563eb' }}>Core Values</span>
</h2>
            </div>
            <p className="section-description">
              The principles that guide every decision, interaction, and innovation at CERESENSE
            </p>
          </motion.div>

          <div className="values-grid">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="value-card"
              >
                <div className="value-card-header">
                  <div className="value-icon-wrapper">
                    {value.icon}
                  </div>
                  <h3 className="value-title">{value.title}</h3>
                </div>
                <p className="value-description">{value.description}</p>
                <div className="value-ornament">
                  <span className="ornament-text">CERESENSE</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="timeline-section">
        <div className="timeline-container">
          <div className="section-header">
            <div className="section-subtitle">Our Evolution</div>
                          <div style={{ display: 'flex', 
                 justifyContent: 'center', 
              alignItems: 'center' }}>
                <h2 className="section-title">
                  The <span className="ceresense-accent">CERESENSE</span> Journey
                </h2>
              </div>
          </div>

          <div className="timeline">
            <div className="timeline-line"></div>
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                viewport={{ once: true }}
                className="timeline-item"
              >
                <div className="timeline-marker">
                  <div className="marker-dot"></div>
                  <div className="marker-year">{milestone.year}</div>
                </div>
                <div className="timeline-content">
                  <h3 className="timeline-title">{milestone.title}</h3>
                  <p className="timeline-description">{milestone.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="leadership-section">
        <div className="leadership-container">
          <div className="section-header">
            <div className="section-subtitle">Guiding Vision</div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <h2 className="section-title">
                
                The <span className="ceresense-accent">CERESENSE</span> Leadership
              </h2>
            </div>
            <p className="section-description">
              A team of visionaries, educators, and industry pioneers committed to transforming tech education
            </p>
          </div>

          <div className="leadership-grid">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="leadership-card"
              >
                <div className="leadership-image-container">
                  <div className="leadership-image">
                    <img src={member.image} alt={member.name} />
                  </div>
                  <div className="leadership-badge">
                    <span>CERESENSE</span>
                  </div>
                </div>
                <div className="leadership-info">
                  <h3 className="leadership-name">{member.name}</h3>
                  <p className="leadership-role">{member.role}</p>
                  <p className="leadership-bio">{member.bio}</p>
                  <div className="leadership-signature">
                    <span className="signature-line"></span>
                    <span className="signature-text">CERESENSE Leadership</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Manifesto Section */}
<section className="manifesto-section">
  <div className="manifesto-container">
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="manifesto-content"
    > {/* Missing closing bracket added here */}
      <div className="manifesto-icon">
        <Rocket size={48} />
      </div>
      <h2 className="manifesto-title">THE CERESENSE MANIFESTO</h2>
      <div className="manifesto-text">
        <p>We believe in the power of <strong>transformative education</strong>.</p>
        <p>We commit to <strong>excellence over expediency</strong>.</p>
        <p>We champion <strong>depth over superficiality</strong>.</p>
        <p>We build <strong>careers, not just skills</strong>.</p>
        <p>We foster <strong>innovation through discipline</strong>.</p>
        <p className="manifesto-signature">
          <strong>This is CERESENSE.</strong> This is the future of tech education.
        </p>
      </div>
      
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="manifesto-cta"
      >
        <a href="http://portal.ceresense.com.ng/" className="manifesto-button">
          Join the Movement
          <ChevronRight size={20} />
        </a>
        <p className="cta-note">
          Become part of something bigger. Transform with <strong>CERESENSE</strong>.
        </p>
      </motion.div>
    </motion.div>
  </div>
</section>
    </div>
  );
};

export default About;