const secret = process.env.HRADB_A_MONGODB_SECRET;

exports.isAuthenticated = async (req, res, next) => {
  const token = req.headers.authorization;
  if (token !== secret) {
    return res.status(401).send({ error: "Acceso no autorizado." });
  }
  next();
};
