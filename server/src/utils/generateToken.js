import jwt from 'jsonwebtoken'
export const generateToken = (id) => {
  return jwt.sign({ token: id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};
