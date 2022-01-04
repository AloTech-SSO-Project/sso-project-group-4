const httpStatus = require("http-status");
// Set urls allowed
const allowedUrls = {
  "http://localhost:5001": true,
  "http://localhost:4000": true,
};

const authentication = (req, res, next) => {
  const { redirectURL } = req.query;

  if (redirectURL != undefined || redirectURL != null) {
    const url = new URL(redirectURL);
    if (allowedUrls[url.origin] !== true) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .send({ message: "You are not allowed to access the sso-server" });
    }
    // if url not allowed, redirect to SSO-auth
    return res.redirect(`http://localhost:4000/?redirectURL=${redirectURL}`);
  }

  next();
};

module.exports = authentication;