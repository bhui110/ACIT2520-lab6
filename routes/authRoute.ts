import express from "express";
import passport from 'passport';
import { ensureAdmin, forwardAuthenticated } from "../middleware/checkAuth";

declare module "express-session" {
  interface SessionData {
    error: string;
    messages: string[];
  }
}

const router = express.Router();

router.get("/login", forwardAuthenticated, (req, res) => {
  const messages = req.session.messages || [];
  req.session.messages = [];
  res.render("login", { messages });
})

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/auth/login",
    failureMessage: true
  })
);

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) console.log(err);
  });
  res.redirect("/auth/login");
});

router.get('/github',
  passport.authenticate('github', { scope: ['user:email'] }));

router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('/dashboard');
  });

router.get("/admin", ensureAdmin, (req, res) => {
  res.render("admin", {
    user: req.user
  });
});
export default router;
