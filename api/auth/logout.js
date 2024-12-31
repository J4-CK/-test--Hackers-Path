export default function handler(req, res) {
  res.setHeader('Set-Cookie', 'token=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0');
  res.status(200).json({ message: 'Logged out' });
}
