import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <p>Hacker's Path &copy; {currentYear} All rights reserved.</p>
      <p><a href="https://github.com/hackerspathorg/hackerspath" target="_blank" rel="noopener noreferrer">GitHub</a></p>
    </footer>
  );
  
} 