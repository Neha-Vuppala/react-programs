import jwt from "jsonwebtoken";

function generateToken(user) {
  return jwt.sign(
    {
      sub: String(user.id),
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
}

export default generateToken;