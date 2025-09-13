const express = require("express");
const router = express.Router();

router.post("/check", (req, res) => {
  const { password } = req.body;

  if (password === 12341) {
    return res.json({ success: true });
  } else {
    return res.status(401).json({ success: false, msg: "Invalid password" });
  }
});

module.exports = router;
