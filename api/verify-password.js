export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { password } = req.body

  if (!password) {
    return res.status(400).json({ error: 'Password required' })
  }

  const correctPassword = process.env.UPLOAD_PASSWORD

  if (!correctPassword) {
    return res.status(500).json({ error: 'Server misconfigured: UPLOAD_PASSWORD env var not set' })
  }

  if (password === correctPassword) {
    return res.status(200).json({ success: true })
  }

  return res.status(401).json({ error: 'Invalid password' })
}