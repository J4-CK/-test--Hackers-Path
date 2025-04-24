const words = ['H4CK3RS', 'L0V3', 'S0LV1NG', 'C00L', 'PUZZL3S'];
const checksum = words.reduce((sum, word) => sum + 
  word.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0), 0);
console.log("Checksum:", checksum);

// Check all positions in the validation code
const checkPositions = [
  { word: 0, pos: 1, char: '4' },
  { word: 0, pos: 3, char: 'K' },
  { word: 1, pos: 1, char: '0' },
  { word: 2, pos: 1, char: '0' },
  { word: 3, pos: 1, char: '0' },
  { word: 4, pos: 4, char: 'L' }
];

for (const check of checkPositions) {
  const char = words[check.word].charAt(check.pos);
  console.log(`Word ${check.word}, Position ${check.pos}: Expected ${check.char}, Got ${char}`);
}

// Print all characters in all words
words.forEach((word, wordIndex) => {
  console.log(`\nWord ${wordIndex}: ${word}`);
  for (let i = 0; i < word.length; i++) {
    console.log(`  Position ${i}: ${word[i]} (${word[i].charCodeAt(0)})`);
  }
}); 