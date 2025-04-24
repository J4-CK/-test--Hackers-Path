# Hacker's Path - CTF Challenge Guide

This guide will help you locate and capture all 5 flags hidden throughout the Hacker's Path application.

## Introduction

The Capture The Flag (CTF) challenge consists of 5 hidden flags that, when combined in numerical order, form a complete sentence. Each flag is hidden in a different location using various techniques that test your cybersecurity skills.

## Flag Locations

### Flag 1: H4CK3RS
**Location**: CIA-Triad-Quiz page  
**How to find it**:
1. Navigate to the CIA Triad Quiz page at `/quiz/CIA-Triad-Quiz`
2. Look for a small, partially visible light purple button with a dashed border at the bottom-right corner of the page
3. Hover over it to make it more visible, then click to reveal the full flag

**Technical details**: The flag is implemented as a subtle fixed element at the bottom-right of the screen that becomes more visible on hover and fully revealed when clicked.

### Flag 2: L0V3
**Location**: robots.txt  
**How to find it**:
1. Access the robots.txt file by navigating to `/robots.txt`
2. Look for a comment in the file that contains the flag (line 8)

**Note**: The robots.txt file contains instructions for web crawlers and is a common place to check during security assessments.

### Flag 3: S0LV1NG
**Location**: Security Controls lesson  
**How to find it**:
1. Navigate to the Security Controls lesson at `/lessons/security-controls-presentation`
2. In the first slide, look for a hint box with the text "Did you know? Security is all about finding hidden information."
3. The flag is displayed in a purple container within this hint box

**Technical details**: The flag is now clearly visible in a formatted hint box on the first page of the lesson.

### Flag 4: C00L
**Location**: Strong Passwords Quiz metadata  
**How to find it**:
1. Navigate to the Strong Passwords Quiz at `/quiz/strong-passwords-quiz`
2. View the page source (right-click > View Page Source)
3. Look in the HTML metadata section (the `<head>` tag)
4. Find a meta tag that contains the flag

**Technical details**: The flag is hidden in a meta tag that isn't visible on the page itself.

### Flag 5: PUZZL3S
**Location**: API endpoint  
**How to find it**:
1. Access the API endpoint at `/api/ctf/flag`
2. You can do this by simply navigating to that URL in your browser
3. The response contains the fifth flag

**Command to access the flag**:
```
curl http://localhost:3000/api/ctf/flag
```

## Combining the Flags

Once you've found all 5 flags, combine them in numerical order to form the complete sentence:

"H4CK3RS L0V3 S0LV1NG C00L PUZZL3S"

Enter this phrase in the CTF Validator on the homepage to complete the challenge.

## Hints for Finding Flags

- **Explore Different Areas**: Flags are hidden in various parts of the application
- **Check Standard Web Files**: Look in common web files like robots.txt
- **Examine Page Source**: Some flags may be hidden in HTML metadata or comments
- **Try API Endpoints**: Test API endpoints to see if they return flags
- **Look for Visual Cues**: Some flags are hidden in plain sight with visual indicators

Good luck and happy hunting! 