import bcrypt from "bcrypt";
import pool from "../config/database.js";
import generateToken from "../utils/generateToken.js";
import { OAuth2Client } from "google-auth-library";

const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;
const BCRYPT_ROUNDS = 12;

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
};

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID
);

function setAuthCookie(res, user) {
  const token = generateToken(user);

  res.cookie("token", token, {
    ...COOKIE_OPTIONS,
    maxAge: COOKIE_MAX_AGE,
  });
}

function clearAuthCookie(res) {
  res.clearCookie("token", COOKIE_OPTIONS);
}

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

function normalizeEmail(value) {
  return typeof value === "string"
    ? value.trim().toLowerCase()
    : "";
}

function isValidEmail(email) {
  return (
    email.length <= 255 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  );
}

function isDuplicateEntry(error) {
  return error?.code === "ER_DUP_ENTRY";
}

export async function register(req, res) {
  try {
    const name =
      typeof req.body?.name === "string"
        ? req.body.name.trim()
        : "";

    const email = normalizeEmail(req.body?.email);

    const password =
      typeof req.body?.password === "string"
        ? req.body.password
        : "";

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required.",
      });
    }

    if (name.length > 100) {
      return res.status(400).json({
        message: "Name must not exceed 100 characters.",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        message: "Please enter a valid email address.",
      });
    }

    if (
      password.length < 8 ||
      Buffer.byteLength(password, "utf8") > 72
    ) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters and no more than 72 bytes.",
      });
    }

    const [existingUsers] = await pool.execute(
      "SELECT id FROM users WHERE email = ? LIMIT 1",
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    const passwordHash = await bcrypt.hash(
      password,
      BCRYPT_ROUNDS
    );

    const [result] = await pool.execute(
      `INSERT INTO users (name, email, password_hash)
       VALUES (?, ?, ?)`,
      [name, email, passwordHash]
    );

    const user = {
      id: result.insertId,
      name,
      email,
      role: "student",
    };

    setAuthCookie(res, user);

    return res.status(201).json({
      message: "Account created successfully.",
      user: publicUser(user),
    });
  } catch (error) {
    if (isDuplicateEntry(error)) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    console.error("Registration error:", error.message);

    return res.status(500).json({
      message: "Unable to create your account right now.",
    });
  }
}

export async function login(req, res) {
  try {
    const email = normalizeEmail(req.body?.email);

    const password =
      typeof req.body?.password === "string"
        ? req.body.password
        : "";

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        message: "Please enter a valid email address.",
      });
    }

    const [users] = await pool.execute(
      `SELECT id, name, email, password_hash, role
       FROM users
       WHERE email = ?
       LIMIT 1`,
      [email]
    );

    const user = users[0];

    if (!user || !user.password_hash) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    setAuthCookie(res, user);

    return res.status(200).json({
      message: "Login successful.",
      user: publicUser(user),
    });
  } catch (error) {
    console.error("Login error:", error.message);

    return res.status(500).json({
      message: "Unable to log in right now.",
    });
  }
}

export async function googleLogin(req, res) {
  try {
    const credential =
      typeof req.body?.credential === "string"
        ? req.body.credential
        : "";

    if (!credential) {
      return res.status(400).json({
        message: "Google credential is required.",
      });
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      console.error("GOOGLE_CLIENT_ID is not configured.");

      return res.status(500).json({
        message: "Google sign-in is not configured correctly.",
      });
    }
    let payload;

    try {
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      payload = ticket.getPayload();
    } catch {
      return res.status(401).json({
        message: "Invalid Google credential. Please try again.",
      });
    }

    if (
      !payload ||
      !payload.sub ||
      !payload.email ||
      payload.email_verified !== true
    ) {
      return res.status(401).json({
        message: "Your Google account could not be verified.",
      });
    }

    const googleId = payload.sub;
    const email = normalizeEmail(payload.email);

    const name =
      typeof payload.name === "string" && payload.name.trim()
        ? payload.name.trim().slice(0, 100)
        : email.split("@")[0].slice(0, 100);

    if (!isValidEmail(email)) {
      return res.status(401).json({
        message: "Your Google account could not be verified.",
      });
    }

    const [googleUsers] = await pool.execute(
      `SELECT id, name, email, role, password_hash, google_id
       FROM users
       WHERE google_id = ?
       LIMIT 1`,
      [googleId]
    );

    let user = googleUsers[0];

    if (!user) {
      const [emailUsers] = await pool.execute(
        `SELECT id, name, email, role, password_hash, google_id
         FROM users
         WHERE email = ?
         LIMIT 1`,
        [email]
      );

      const existingUser = emailUsers[0];

      if (existingUser) {
       
        if (
          existingUser.google_id &&
          existingUser.google_id !== googleId
        ) {
          return res.status(409).json({
            message:
              "This email is already linked to another Google account.",
          });
        }

        if (!existingUser.google_id) {
          const [updateResult] = await pool.execute(
            `UPDATE users
             SET google_id = ?
             WHERE id = ? AND google_id IS NULL`,
            [googleId, existingUser.id]
          );

          if (updateResult.affectedRows !== 1) {
            return res.status(409).json({
              message:
                "Your account could not be linked. Please try again.",
            });
          }
        }

        user = {
          id: existingUser.id,
          name: existingUser.name,
          email: existingUser.email,
          role: existingUser.role,
          google_id: googleId,
        };
      } else {

        const [result] = await pool.execute(
          `INSERT INTO users (name, email, google_id)
           VALUES (?, ?, ?)`,
          [name, email, googleId]
        );

        user = {
          id: result.insertId,
          name,
          email,
          role: "student",
          google_id: googleId,
        };
      }
    }
    setAuthCookie(res, user);

    return res.status(200).json({
      message: "Google sign-in successful.",
      user: publicUser(user),
    });
  } catch (error) {
    if (isDuplicateEntry(error)) {
      return res.status(409).json({
        message:
          "This account already exists or has already been linked. Please try signing in again.",
      });
    }

    console.error("Google login error:", error.message);

    return res.status(500).json({
      message: "Unable to complete Google sign-in right now.",
    });
  }
}

export async function getMe(req, res) {
  try {
    if (!req.user?.id) {
      clearAuthCookie(res);

      return res.status(401).json({
        message: "Please log in to continue.",
      });
    }

    const [users] = await pool.execute(
      `SELECT id, name, email, role
       FROM users
       WHERE id = ?
       LIMIT 1`,
      [req.user.id]
    );

    if (users.length === 0) {
      clearAuthCookie(res);

      return res.status(401).json({
        message: "Your account could not be found.",
      });
    }

    return res.status(200).json({
      user: publicUser(users[0]),
    });
  } catch (error) {
    console.error("Session check error:", error.message);

    return res.status(500).json({
      message: "Unable to check your session.",
    });
  }
}

export function logout(req, res) {
  clearAuthCookie(res);

  return res.status(200).json({
    message: "Logged out successfully.",
  });
}
