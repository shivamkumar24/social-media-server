const validateInputs = (req, res, next) => {
  const errors = [];

  if (!req.body.username || req.body.username.trim() === "") {
    errors.push({ message: "Username is required" });
  }

  if (
    !req.body.email ||
    req.body.email.trim() === "" ||
    !isValidEmail(req.body.email)
  ) {
    errors.push({ message: "Email is required or invalid" });
  }

  if (!req.body.password || req.body.password.length < 6) {
    errors.push({
      message: "Password is required and must be at least 6 characters long",
    });
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors: errors });
  }

  next();
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

module.exports = {
  validateInputs,
};
