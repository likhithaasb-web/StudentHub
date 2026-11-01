import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization required. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'studenthub_super_secret_jwt_key_2026';

    const decoded = jwt.verify(token, secret);
    req.userId = decoded.userId;
    req.userRole = decoded.role || 'student';
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired authentication token.' });
  }
};

export const requireRole = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      if (!req.userId) {
        return res.status(401).json({ message: 'Authentication required.' });
      }

      let role = req.userRole;
      if (!role || role === 'student') {
        const user = await User.findById(req.userId).select('role');
        if (user) {
          role = user.role;
          req.userRole = role;
        }
      }

      if (!allowedRoles.includes(role)) {
        return res.status(403).json({
          message: `Access denied. Privileged role required (${allowedRoles.join(', ')}). Your role is: ${role || 'student'}.`,
        });
      }

      next();
    } catch (err) {
      return res.status(500).json({ message: 'Authorization check failed.', error: err.message });
    }
  };
};
