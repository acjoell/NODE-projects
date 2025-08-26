import jwt from 'jsonwebtoken'

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({ message: 'No token, authorization denied' })
  }

  const [scheme, token] = authHeader.split(' ')
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Invalid token format' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded // puedes pasar user id, role, etc.
    console.log('Decoded user:', req.user)
    next()
  } catch (e) {
    return res.status(403).json({
      message: 'Token is not valid',
      error: e.message
    })
  }
}

export default verifyToken
