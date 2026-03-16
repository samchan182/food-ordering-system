import { Router } from 'express';
import passport from 'passport';

const router = Router();

// Step 1: redirect user to Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Step 2: Google redirects back here after login
router.get('/google/callback',
  (req, res, next) => {
    passport.authenticate('google', (err, user, info) => {
      if (err) {
        console.error('OAuth Error:', err);
        return res.status(500).send(`Auth failed: ${err.message} — ${JSON.stringify(err)}`);
      }
      if (!user) {
        console.error('No user returned:', info);
        return res.redirect('/');
      }
      req.logIn(user, (loginErr) => {
        if (loginErr) return next(loginErr);
        return res.redirect('/');
      });
    })(req, res, next);
  }
);

// Logout
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

// Return current logged-in user info (called by frontend)
router.get('/me', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ loggedIn: true, name: req.user.displayName, email: req.user.emails[0].value });
  } else {
    res.json({ loggedIn: false });
  }
});

export default router;
