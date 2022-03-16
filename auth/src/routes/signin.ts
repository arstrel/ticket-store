import express from 'express';

const router = express.Router();

router.post('/api/users/signin', (req, res) => {
  res.send('[Auth service] Signin endpoint');
});

export { router as signinRouter };
