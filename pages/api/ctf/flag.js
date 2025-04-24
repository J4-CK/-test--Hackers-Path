export default function handler(req, res) {
  // This endpoint is part of a Capture The Flag challenge
  res.status(200).json({ 
    message: "Congratulations on finding this endpoint!",
    flag: "PUZZL3S",
    flagNumber: 5,
    hint: "Combine all 5 flags in numerical order to form a complete sentence."
  });
} 