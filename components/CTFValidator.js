import { useState } from 'react';

export default function CTFValidator() {
  const [showHint, setShowHint] = useState(false);
  const [flagInput, setFlagInput] = useState('');
  const [validationResult, setValidationResult] = useState(null);

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
    return checksum === 3113;
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
        className="ctf-hint-btn"
        onClick={() => setShowHint(!showHint)}
      >
        {showHint ? "Hide CTF Info" : "Show CTF Info"}
      </button>
      
      {showHint && (
        <div className="ctf-hint-content">
          <h3>🚩 Capture The Flag Challenge 🚩</h3>
          <p>There are 5 hidden flags throughout this website. Can you find them all?</p>
          <p>When found, combine them in numerical order to form a complete sentence.</p>
          <p>Hints:</p>
          <ul>
            <li>Look in page sources, comments, and hidden endpoints</li>
            <li>The robots might know something...</li>
            <li>Sometimes what's invisible can be revealed</li>
            <li>Headers can contain more than meets the eye</li>
            <li>APIs are more than just what you see on the page</li>
          </ul>
          
          <div className="ctf-validation">
            <input 
              type="text" 
              placeholder="Enter the complete flag (all 5 parts combined)"
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
        </div>
      )}
      
      <style jsx>{`
        .ctf-validator {
          margin-top: 30px;
          padding: 15px;
          border-top: 1px solid #ddd;
        }
        
        .ctf-hint-btn {
          background-color: #f0ad4e;
          color: white;
          border: none;
          padding: 10px 15px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
        }
        
        .ctf-hint-content {
          margin-top: 15px;
          padding: 15px;
          background-color: #f8f9fa;
          border-radius: 5px;
          border-left: 4px solid #f0ad4e;
        }
        
        .ctf-validation {
          margin-top: 15px;
          display: flex;
          gap: 10px;
        }
        
        .ctf-input {
          flex-grow: 1;
          padding: 8px 12px;
          border: 1px solid #ced4da;
          border-radius: 4px;
        }
        
        .validate-btn {
          background-color: #5cb85c;
          color: white;
          border: none;
          padding: 8px 15px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
        }
        
        .validation-result {
          margin-top: 10px;
          padding: 10px;
          border-radius: 4px;
        }
        
        .success {
          background-color: #dff0d8;
          color: #3c763d;
        }
        
        .error {
          background-color: #f2dede;
          color: #a94442;
        }
      `}</style>
    </div>
  );
} 