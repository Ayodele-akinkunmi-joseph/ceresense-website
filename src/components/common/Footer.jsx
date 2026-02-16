import { useState } from "react";
import { NavLink } from "react-router-dom";
import { 
  Mail, 
  Phone, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  Send,
  Headphones,
  GraduationCap,
  Code,
  Target
} from "lucide-react";
import "../../styles/footer.css";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const currentYear = new Date().getFullYear();

  const contactInfo = [
    { 
      icon: <Mail size={18} />, 
      text: "admin@ceresense.com.ng", 
      href: "mailto:admin@ceresense.com.ng",
      label: "Email"
    },
    { 
      icon: <Phone size={18} />, 
      text: "(+234) 706-341-9718", 
      href: "tel:+2347063419718",
      label: "Main Office"
    },
    { 
      icon: <Headphones size={18} />, 
      text: "(+234) 803-643-6594", 
      href: "tel:+2348036436594",
      label: "Support"
    },
  ];

  const socialLinks = [
    { icon: <Facebook size={20} />, label: "Facebook", href: "https://facebook.com/ceresense", color: "#1877F2" },
    // { icon: <Twitter size={20} />, label: "Twitter", href: "https://twitter.com/ceresense", color: "#1DA1F2" },
    { icon: <Instagram size={20} />, label: "Instagram", href: "https://www.instagram.com/ceresense?igsh=NXpoaWo0N29zdTc0", color: "#E4405F" },
    { icon: <Linkedin size={20} />, label: "LinkedIn", href: "https://www.linkedin.com/in/ceresense-training-institute-5410ba259?utm_source=share_via&utm_content=profile&utm_medium=member_android", color: "#0A66C2" },
  ];

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        alert(`Thank you for subscribing to CERESENSE updates! We'll email you at: ${email}`);
        setEmail("");
        setSubscribed(false);
      }, 500);
    }
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* Main Footer Content - Only brand + newsletter side by side */}
        <div className="footer-main">
          
          {/* Brand & Newsletter Section - Side by side */}
          <div className="footer-brand-newsletter">
            {/* Brand Section */}
            <div className="footer-brand-section">
              <div className="brand-header">
                <img 
                  src="/logo.png" 
                  alt="CERESENSE Logo" 
                  className="footer-logo"
                />
                <p className="tagline">Intelligent Solutions for Tomorrow</p>
              </div>
              
              <p className="brand-description">
                CERESENSE transforms aspiring individuals into industry-ready tech professionals 
                through cutting-edge curriculum and hands-on training.
              </p>
              
              <div className="brand-icons">
                <div className="brand-icon">
                  <GraduationCap size={20} />
                  <span>Expert Training</span>
                </div>
                <div className="brand-icon">
                  <Code size={20} />
                  <span>Hands-on Projects</span>
                </div>
                <div className="brand-icon">
                  <Target size={20} />
                  <span>Career Focus</span>
                </div>
              </div>
            </div>

            {/* Newsletter Section - Beside brand */}
            <div className="newsletter-section">
              <h3 className="newsletter-title">Stay Ahead with CERESENSE</h3>
              <p className="newsletter-subtitle">
                Get updates on new programs, events, and tech insights
              </p>
              
              <form onSubmit={handleSubscribe} className="newsletter-form">
                <div className="input-group">
                  <input
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="newsletter-input"
                    required
                    disabled={subscribed}
                  />
                  <button 
                    type="submit" 
                    className={`newsletter-button ${subscribed ? 'subscribed' : ''}`}
                    disabled={subscribed}
                  >
                    {subscribed ? (
                      <span className="button-text">Subscribed!</span>
                    ) : (
                      <>
                        <Send size={18} />
                        <span className="button-text">Subscribe</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="privacy-note">
                  By subscribing, you agree to our Privacy Policy. We respect your privacy.
                </p>
              </form>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="contact-section">
          <div className="contact-grid">
            {contactInfo.map((contact, index) => (
              <a
                key={index}
                href={contact.href}
                className="contact-item"
                aria-label={contact.label}
              >
                <div className="contact-icon-wrapper">
                  <div className="contact-icon">
                    {contact.icon}
                  </div>
                  <span className="contact-label">{contact.label}</span>
                </div>
                <span className="contact-text">{contact.text}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Social & Copyright Section */}
        <div className="footer-bottom">
          <div className="social-section">
            <h4 className="social-title">Connect with us</h4>
            <div className="social-links">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                  aria-label={social.label}
                  style={{ '--social-color': social.color }}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
          
          <div className="copyright-section">
            <div className="copyright">
              © {currentYear} <span className="highlight">CERESENSE</span>. All rights reserved.
            </div>
            <div className="footer-legal">
              <NavLink to="/privacy" className="legal-link">Privacy Policy</NavLink>
              <span className="divider">•</span>
              <NavLink to="/terms" className="legal-link">Terms of Service</NavLink>
              <span className="divider">•</span>
              <NavLink to="/cookies" className="legal-link">Cookie Policy</NavLink>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;