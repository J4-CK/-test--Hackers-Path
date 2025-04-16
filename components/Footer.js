import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <p>Hacker's Path &copy; {currentYear} All rights reserved.</p>
    </footer>
  );
} 