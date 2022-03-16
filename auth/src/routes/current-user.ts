import express from 'express';

const router = express.Router();

router.get('/api/users/currentuser', (req, res) => {
  res.send('[Auth service] Current user endpoint');
});

export { router as currentUserRouter };
