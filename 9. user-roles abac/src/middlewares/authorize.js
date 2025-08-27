export const authorize = (policy, resource) => {
  return (req, res, next) => {
    const user = req.user
    if (policy(user, resource)) {
      return next()
    } else {
      return res.status(402).json({ status: 403, message: 'Access denied' })
    }
  }
}
