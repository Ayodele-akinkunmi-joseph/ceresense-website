import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [navbarHeight, setNavbarHeight] = useState(64);

  // Handle scroll effect and screen size
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Adjust navbar height when mobile menu opens
      if (mobile && mobileMenuOpen) {
        setNavbarHeight(280); // Approximate height when mobile menu is open
      } else {
        setNavbarHeight(64);
      }
    };

    // Initial check
    checkMobile();

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', checkMobile);
    };
  }, [mobileMenuOpen]);

  // Update navbar height when mobile menu opens/closes
  useEffect(() => {
    if (isMobile) {
      setNavbarHeight(mobileMenuOpen ? 280 : 64);
    } else {
      setNavbarHeight(64);
    }
  }, [mobileMenuOpen, isMobile]);

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/services", label: "Services" },
    { path: "/gallery", label: "Gallery" },
    { path: "/blog", label: "Blog" },
  ];

  // Hover state handlers
  const [hoveredLink, setHoveredLink] = useState(null);
  const [mobileMenuHover, setMobileMenuHover] = useState(false);

  // Calculate mobile menu button styles
  const getMobileMenuButtonStyles = () => {
    const baseStyles = {
      padding: '0.5rem',
      borderRadius: '0.5rem',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.3s ease',
    };

    if (isScrolled || isMobile) {
      return {
        ...baseStyles,
        backgroundColor: mobileMenuHover ? 'rgba(37, 99, 235, 0.2)' : 'rgba(37, 99, 235, 0.1)',
        color: '#2563eb',
        border: '1px solid rgba(37, 99, 235, 0.3)',
      };
    }
    
    // At top of page on desktop - glassmorphism
    return {
      ...baseStyles,
      backgroundColor: mobileMenuHover ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.15)',
      color: 'black',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      backdropFilter: 'blur(10px)',
    };
  };

  // Check if we should use glassmorphism
  const shouldUseGlassmorphism = !isMobile && !isScrolled;

  // Main nav styles - Glassmorphism at top on desktop, White after scroll or on mobile
  const styles = {
    nav: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000, // Increased z-index
      backgroundColor: shouldUseGlassmorphism 
        ? 'rgba(255, 255, 255, 0.1)'
        : 'rgba(255, 255, 255, 0.98)',
      backdropFilter: shouldUseGlassmorphism ? 'blur(15px)' : 'blur(10px)',
      borderBottom: shouldUseGlassmorphism 
        ? '1px solid rgba(255, 255, 255, 0.2)'
        : '1px solid rgba(229, 231, 235, 0.6)',
      transition: 'all 0.3s ease',
    },
    container: {
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '0 1rem',
    },
    logoContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      textDecoration: 'none',
      zIndex: 1001,
    },
    logoImage: {
      height: '40px',
      width: 'auto',
      transition: 'transform 0.3s ease',
    },
    navLink: (isActive) => ({
      color: shouldUseGlassmorphism 
        ? (isActive ? '#2563eb' : 'rgba(0, 0, 0, 0.9)')
        : (isActive ? '#2563eb' : '#374151'),
      fontWeight: isActive ? '600' : '500',
      padding: '0.5rem 1rem',
      borderRadius: '0.5rem',
      textDecoration: 'none',
      transition: 'all 0.3s ease',
      position: 'relative',
      textShadow: shouldUseGlassmorphism ? '0 1px 2px rgba(0, 0, 0, 0.2)' : 'none',
    }),
    navLinkHover: {
      backgroundColor: shouldUseGlassmorphism 
        ? 'rgba(255, 255, 255, 0.15)'
        : 'rgba(37, 99, 235, 0.1)',
    },
  };

  return (
    <>
      <nav style={styles.nav}>
        <div style={styles.container}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
            
            {/* Logo with Image */}
            <NavLink 
              to="/" 
              style={styles.logoContainer}
            >
              <img 
                src="/logo.png" 
                alt="CERESENSE Logo" 
                style={styles.logoImage}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              />
            </NavLink>

            {/* Desktop Navigation */}
            <div style={{ display: 'none', alignItems: 'center', gap: '0.5rem' }} className="desktop-nav">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  style={({ isActive }) => ({
                    ...styles.navLink(isActive),
                    ...(hoveredLink === item.path && styles.navLinkHover)
                  })}
                  onMouseEnter={() => setHoveredLink(item.path)}
                  onMouseLeave={() => setHoveredLink(null)}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>

            {/* Right Side */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                style={{
                  ...getMobileMenuButtonStyles(),
                  ...(mobileMenuHover && { transform: 'scale(1.05)' })
                }}
                onMouseEnter={() => setMobileMenuHover(true)}
                onMouseLeave={() => setMobileMenuHover(false)}
                className="mobile-menu-btn"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X size={24} />
                ) : (
                  <Menu size={24} />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div 
              className="mobile-menu"
              style={{ 
                padding: '1rem 0', 
                borderTop: '1px solid rgba(229, 231, 235, 0.6)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                backgroundColor: 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(10px)',
                margin: '0 -1rem',
                paddingLeft: '1rem',
                paddingRight: '1rem',
                animation: 'slideDown 0.3s ease forwards',
              }}
            >
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  style={({ isActive }) => ({
                    color: isActive ? '#2563eb' : '#374151',
                    fontWeight: isActive ? '600' : '500',
                    padding: '0.75rem 1rem',
                    backgroundColor: isActive ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
                    borderRadius: '0.5rem',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                  })}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          )}
        </div>

        {/* Add media queries for responsive design */}
        <style>{`
          @media (min-width: 768px) {
            .desktop-nav {
              display: flex !important;
            }
            .mobile-menu-btn {
              display: none !important;
            }
          }
          
          /* Smooth transitions */
          * {
            transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, backdrop-filter 0.3s ease;
          }
          
          /* Mobile menu animations */
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .mobile-menu {
            animation: slideDown 0.3s ease forwards;
          }
          
          /* Logo hover effect */
          img[alt="CERESENSE Logo"]:hover {
            transform: scale(1.05);
          }
        `}</style>
      </nav>
      
      {/* DYNAMIC SPACER DIV */}
      <div style={{
        height: `${navbarHeight}px`,
        width: '100%',
        transition: 'height 0.3s ease',
      }} />
    </>
  );
};

export default Navbar;