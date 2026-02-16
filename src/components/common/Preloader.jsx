import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trefoil } from "ldrs/react";
import "ldrs/react/Trefoil.css";

const Preloader = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onFinish, 600);
          return 100;
        }
        return prev + 1;
      });
    }, 25);

    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#f3f4f6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          width: '380px',
          height: '320px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
        }}
      >
        {/* Logo */}
        <div style={{ 
          marginBottom: '2rem', 
          textAlign: 'center',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <img 
            src="/logo.png" 
            alt="CERESENSE Logo" 
            style={{
              height: '60px',
              width: 'auto',
              objectFit: 'contain'
            }}
          />
        </div>

       

        {/* Progress */}
        <div style={{ width: '100%' }}>
          {/* Progress Bar */}
          <div style={{
            width: '100%',
            backgroundColor: '#e5e7eb',
            borderRadius: '9999px',
            height: '0.5rem',
            marginBottom: '0.75rem',
          }}>
            <motion.div 
              style={{
                backgroundColor: '#2563eb',
                height: '100%',
                borderRadius: '9999px',
              }}
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          
          {/* Percentage */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
          }}>
            <span style={{
              fontSize: '0.875rem',
              fontWeight: 'bold',
              color: '#1d4ed8',
            }}>
              {progress}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preloader;