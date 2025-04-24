import { useState } from 'react';

export default function CTFValidator() {
  const [showHint, setShowHint] = useState(false);
  const [flagInput, setFlagInput] = useState('');
  const [validationResult, setValidationResult] = useState(null);
  const [showStuckHelp, setShowStuckHelp] = useState(false);

  // This function validates the flag without directly exposing the answer
  // It uses a simple algorithm to check the answer
  const validateFlag = (input) => {
    // Convert to consistent format
    const processedInput = input.trim().toUpperCase().replace(/\s+/g, ' ');
    
    // The algorithm to validate without exposing the answer directly:
    
    // Check for correct number of words (5)
    const words = processedInput.split(' ');
    if (words.length !== 5) return false;
    
    // Check each word length is correct
    const expectedLengths = [7, 4, 7, 4, 7];
    for (let i = 0; i < 5; i++) {
      if (words[i].length !== expectedLengths[i]) return false;
    }
    
    // Check specific characters in key positions
    // We're checking for characters at specific positions rather than the whole string
    const checkPositions = [
      { word: 0, pos: 1, char: '4' },
      { word: 0, pos: 3, char: 'K' },
      { word: 1, pos: 1, char: '0' },
      { word: 2, pos: 1, char: '0' },
      { word: 3, pos: 1, char: '0' },
      { word: 4, pos: 4, char: 'L' }
    ];
    
    for (const check of checkPositions) {
      if (words[check.word].charAt(check.pos) !== check.char) return false;
    }
    
    // Final verification - compute a "checksum" of sorts
    const checksum = words.reduce((sum, word) => sum + 
      word.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0), 0);
    
    // The magic number is the sum of ASCII values for the correct phrase
    return checksum === 2028;
  };

  const handleValidate = () => {
    const isValid = validateFlag(flagInput);
    setValidationResult(isValid 
      ? "Congratulations! You've found all the flags and completed the CTF!" 
      : "Sorry, that's not right. Keep looking for all 5 flags!");
  };

  return (
    <div className="ctf-validator">
      <button 
        className="ctf-hint-btn pulse"
        onClick={() => setShowHint(!showHint)}
      >
        {showHint ? "Hide CTF Info" : "🚩 Capture The Flag Challenge 🚩"}
      </button>
      
      <div className={`ctf-hint-content ${showHint ? 'show' : ''}`}>
        <h3 className="ctf-title">🚩 Capture The Flag Challenge 🚩</h3>
        <div className="ctf-description">
          <p>There are 5 hidden flags throughout this website. Can you find them all?</p>
          <p>When found, combine them in numerical order to form a complete sentence.</p>
        </div>
        
        <div className="ctf-hints">
          <h4>Hints:</h4>
          <ul>
            <li><span className="hint-icon">📄</span> Look in page sources, comments, and hidden endpoints</li>
            <li><span className="hint-icon">🤖</span> The robots might know something...</li>
            <li><span className="hint-icon">👁️</span> Sometimes what's invisible can be revealed</li>
            <li><span className="hint-icon">📋</span> Headers can contain more than meets the eye</li>
            <li><span className="hint-icon">🔌</span> APIs are more than just what you see on the page</li>
          </ul>
        </div>
        
        <div className="ctf-validation">
          <input 
            type="text" 
            placeholder="Enter all 5 flags in order"
            value={flagInput}
            onChange={(e) => setFlagInput(e.target.value)}
            className="ctf-input"
          />
          <button 
            onClick={handleValidate}
            className="validate-btn"
          >
            Validate Flag
          </button>
        </div>
        
        {validationResult && (
          <div className={`validation-result ${validationResult.includes("Congratulations") ? "success" : "error"}`}>
            {validationResult}
          </div>
        )}
        
        {/* Still Stuck Button and Help Section */}
        <div className="stuck-help-section">
          <button 
            className="stuck-btn"
            onClick={() => setShowStuckHelp(!showStuckHelp)}
          >
            Still Stuck? Click for Detailed Help
          </button>
          
          {showStuckHelp && (
            <div className="stuck-content">
              <h4>Detailed Flag Locations:</h4>
              <ol>
                <li>
                  <strong>Flag 1:</strong> Check the bottom of the CIA Triad Quiz page. There's a hidden element that reveals itself on hover.
                </li>
                <li>
                  <strong>Flag 2:</strong> Robots.txt file is available at the root of the website - check what's in there!
                </li>
                <li>
                  <strong>Flag 3:</strong> Hidden in the Security Controls lesson presentation. Look for a special hint box.
                </li>
                <li>
                  <strong>Flag 4:</strong> Examine the page source of the Strong Passwords Quiz. Search for "meta" tags.
                </li>
                <li>
                  <strong>Flag 5:</strong> Visit the API endpoint at <code>/api/ctf/flag</code> directly in your browser. 
                  This flag is designed to make you check our <a href="https://github.com/J4-CK/-test--Hackers-Path" target="_blank" rel="noopener noreferrer">GitHub repository</a> where you'll find additional CTF guidance.
                </li>
              </ol>
              <p className="special-note">Remember: The CTF flags need to be combined in numerical order to form a complete sentence!</p>
            </div>
          )}
        </div>
      </div>
      
      <style jsx>{`
        .ctf-validator {
          margin-top: 30px;
          padding: 15px;
          border-top: 1px solid #ddd;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #000;
        }
        
        .ctf-hint-btn {
          background-color: #f0ad4e;
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 50px;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.3s ease;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          display: block;
          margin: 0 auto;
          font-size: 16px;
        }
        
        .ctf-hint-btn:hover {
          background-color: #ec971f;
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(0,0,0,0.15);
        }
        
        .pulse {
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(240, 173, 78, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(240, 173, 78, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(240, 173, 78, 0);
          }
        }
        
        .ctf-hint-content {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.5s ease-in-out, opacity 0.3s ease-in-out, transform 0.4s ease;
          opacity: 0;
          transform: translateY(-20px);
          margin-top: 0;
          background-color: #fff;
          border-radius: 10px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
          border-left: none;
        }
        
        .ctf-hint-content.show {
          max-height: 2000px; /* Increased from 1000px to allow more content */
          opacity: 1;
          transform: translateY(0);
          margin-top: 20px;
          padding: 25px;
          border-left: 5px solid #f0ad4e;
          overflow: visible; /* Added to ensure content isn't cut off */
        }
        
        .ctf-title {
          color: #000;
          text-align: center;
          font-size: 24px;
          margin-top: 0;
          padding-bottom: 10px;
          border-bottom: 2px solid #f0ad4e;
          margin-bottom: 20px;
        }
        
        .ctf-description {
          color: #000;
          text-align: center;
          font-size: 16px;
          margin-bottom: 20px;
          line-height: 1.6;
        }
        
        .ctf-description p {
          margin: 10px 0;
        }
        
        .ctf-hints {
          background-color: #f8f9fa;
          padding: 15px 20px;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        
        .ctf-hints h4 {
          color: #000;
          margin-top: 0;
          font-size: 18px;
          margin-bottom: 10px;
        }
        
        .ctf-hints ul {
          padding-left: 10px;
          list-style-type: none;
          color: #000;
        }
        
        .ctf-hints li {
          margin-bottom: 8px;
          padding: 5px 0;
          display: flex;
          align-items: flex-start;
          font-size: 15px;
          white-space: normal;
          overflow: visible;
          line-height: 1.4;
        }
        
        .hint-icon {
          display: inline-block;
          margin-right: 10px;
          font-size: 18px;
          flex-shrink: 0;
        }
        
        .ctf-validation {
          margin-top: 20px;
          display: flex;
          gap: 10px;
          width: 100%;
          max-width: 100%;
          flex-wrap: wrap; /* Allow elements to wrap on smaller screens */
        }
        
        .ctf-input {
          flex-grow: 1;
          padding: 12px 15px;
          border: 2px solid #ced4da;
          border-radius: 50px;
          font-size: 16px;
          color: #000;
          transition: all 0.3s ease;
          min-width: 200px; /* Ensure minimum width */
          width: calc(100% - 140px); /* Account for button width and gap */
          box-sizing: border-box;
          text-overflow: ellipsis; /* Add ellipsis for text overflow */
        }
        
        .ctf-input:focus {
          border-color: #f0ad4e;
          outline: none;
          box-shadow: 0 0 0 3px rgba(240, 173, 78, 0.25);
        }
        
        .validate-btn {
          background-color: #5cb85c;
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 50px;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.3s ease;
          white-space: nowrap;
          min-width: 120px;
        }
        
        .validate-btn:hover {
          background-color: #449d44;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        
        .validation-result {
          margin-top: 15px;
          padding: 15px;
          border-radius: 8px;
          font-weight: bold;
          animation: fadeIn 0.5s ease-in-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .success {
          background-color: #dff0d8;
          color: #3c763d;
          border-left: 4px solid #5cb85c;
        }
        
        .error {
          background-color: #f2dede;
          color: #a94442;
          border-left: 4px solid #d9534f;
        }

        /* Mobile Responsive Styles */
        @media (max-width: 768px) {
          .ctf-validation {
            flex-direction: column;
          }
          
          .ctf-input, .validate-btn {
            width: 100%;
          }
          
          .ctf-hints li {
            padding-right: 10px;
          }
          
          .ctf-hint-content.show {
            padding: 15px;
          }
          
          /* Allow text wrapping on mobile instead of horizontal scrolling */
          .ctf-hints ul {
            overflow-x: visible;
            white-space: normal;
            padding-bottom: 10px;
          }
        }

        /* Stuck Help Styles */
        .stuck-help-section {
          margin-top: 25px;
          text-align: center;
          border-top: 1px dashed #ddd;
          padding-top: 20px;
          margin-bottom: 20px; /* Added to ensure spacing at the bottom */
        }
        
        .stuck-btn {
          background-color: #5bc0de;
          color: white;
          border: none;
          padding: 10px 18px;
          border-radius: 50px;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.3s ease;
          margin: 0 auto;
          font-size: 15px;
        }
        
        .stuck-btn:hover {
          background-color: #31b0d5;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        
        .stuck-content {
          margin-top: 15px;
          background-color: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          border-left: 4px solid #5bc0de;
          text-align: left;
          animation: fadeIn 0.5s ease-in-out;
          overflow: visible; /* Added to ensure content isn't cut off */
          position: relative; /* Added to ensure proper stacking */
          z-index: 10; /* Added to ensure content appears above other elements */
        }
        
        .stuck-content h4 {
          color: #000;
          margin-top: 0;
          margin-bottom: 15px;
          border-bottom: 2px dashed #5bc0de;
          padding-bottom: 10px;
        }
        
        .stuck-content ol {
          padding-left: 25px;
          color: #000;
        }
        
        .stuck-content li {
          margin-bottom: 12px;
          line-height: 1.5;
        }
        
        .stuck-content code {
          background: #e9ecef;
          padding: 2px 5px;
          border-radius: 3px;
          font-family: monospace;
          color: #d63384;
        }
        
        .stuck-content a {
          color: #0d6efd;
          text-decoration: none;
          font-weight: bold;
        }
        
        .stuck-content a:hover {
          text-decoration: underline;
        }
        
        .special-note {
          margin-top: 15px;
          font-style: italic;
          background-color: #fff3cd;
          padding: 10px;
          border-radius: 5px;
          border-left: 4px solid #ffc107;
          color: #856404;
        }
        
        @media (max-width: 768px) {
          .stuck-content {
            padding: 15px;
          }
        }
      `}</style>
    </div>
  );
} 