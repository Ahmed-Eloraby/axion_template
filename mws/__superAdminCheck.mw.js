module.exports = ({ meta, config, managers }) => {
  return ({ req, res, next }) => {
    if (!req.headers.token) {
      console.log("token required but not found");
      return managers.responseDispatcher.dispatch(res, {
        ok: false,
        code: 401,
        errors: "unauthorized",
      });
    }
    let decoded = null;
    try {
      console.log(req.headers.token);
      decoded = managers.token.verifyLongToken({ token: req.headers.token });
      if (!decoded) {
        console.log("failed to decode-1");
        return managers.responseDispatcher.dispatch(res, {
          ok: false,
          code: 401,
          errors: "unauthorized",
        });
      }
    } catch (err) {
      console.log("failed to decode-2");
      return managers.responseDispatcher.dispatch(res, {
        ok: false,
        code: 401,
        errors: "unauthorized",
      });
    }
    console.log(decoded);
    if (decoded.userKey.role !== "superadmin") {
      console.log("Not a SuperAdmin");
      return managers.responseDispatcher.dispatch(res, {
        ok: false,
        code: 401,
        errors: "Permission Required",
      });
    }
    next(decoded);
  };
};
