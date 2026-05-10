// fixed the logic for the deployment 
const authService = require("../services/auth.service");
const prisma = require("../config/prisma");

const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const result = await authService.registerUser(
      name,
      email,
      password
    );

    res.cookie("token", result.token, cookieOptions);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: result.user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await authService.loginUser(
      email,
      password
    );

    res.cookie("token", result.token, cookieOptions);

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: result.user,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

const logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  });

  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
};

const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        platformRole: true,
        createdAt: true,
      },
    });

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
  logout,
};


// const authService = require("../services/auth.service");
// const prisma = require("../config/prisma");


// const register = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     const result = await authService.registerUser(
//       name,
//       email,
//       password
//     );

//     res.cookie("token", result.token, {
//       httpOnly: true,
//       secure: false,
//       sameSite: "lax",
//     });

//     res.status(201).json({
//       success: true,
//       message: "User registered successfully",
//       user: result.user,
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const result = await authService.loginUser(
//       email,
//       password
//     );

//     res.cookie("token", result.token, {
//       httpOnly: true,
//       secure: false,
//       sameSite: "lax",
//     });

//     res.status(200).json({
//       success: true,
//       message: "Login successful",
//       user: result.user,
//     });
//   } catch (error) {
//     res.status(401).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// const logout = async (req, res) => {
//   res.clearCookie("token", {
//     httpOnly: true,
//     secure: false,
//     sameSite: "lax",
//   });

//   res.status(200).json({
//     success: true,
//     message: "Logout successful",
//   });
// };


// const getMe = async (req, res) => {
//   try {
//     const user = await prisma.user.findUnique({
//       where: {
//         id: req.user.id,
//       },
//       select: {
//         id: true,
//         name: true,
//         email: true,
//         platformRole: true,
//         createdAt: true,
//       },
//     });

//     res.status(200).json({
//       success: true,
//       user,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// module.exports = {
//   register,
//   login,
//   getMe,
//   logout,
// };