const { Router } = require("express");
const { body } = require("express-validator");
const authService = require("../services/auth.service");
const validateRequest = require("../middlewares/error.middleware").validateRequest;
const authMiddleware = require("../middlewares/auth.middleware");

const router = Router();

router.post(
  "/register",
  [
    body("username").notEmpty(),
    body("email").isEmail(),
    body("password").isLength({ min: 8 }),
    body("phone").optional().isMobilePhone("any"),
    validateRequest,
  ],
  authService.register
);

router.post(
    "/login",
    [body("email").isEmail(), body("password").notEmpty(), validateRequest],
    authService.login
  );
  
  router.get("/userMe", authMiddleware, async (req: any, res: any) => {
    try {
      const user = await authService.getUserMe(req.user.id);
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      const { password, password_salt, ...userData } = user;
      res.json(userData);
    } catch (error) {
      console.error("Profile error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });


module.exports = router;
