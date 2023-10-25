module.exports = ({ meta, config, managers }) => {
  return async ({ req, res, next }) => {
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
    if (decoded.userKey.role !== "superadmin") {
      let testSchool = null;
      const school = decoded.userKey.school;
      if (req.body.studentId) {
        const studentSchool = await managers.student.getStudentSchool({
          studentId: req.body.studentId,
        });
        testSchool = studentSchool;
      } else if (req.body.classroomId) {
        const classSchool = await managers.classroom.getClassroomSchool({
          classroomId: req.body.classroomId,
        });
        testSchool = classSchool;
      } else if (req.body.schoolId) {
        testSchool = req.body.schoolId;
      }
      if (testSchool != school)
        return managers.responseDispatcher.dispatch(res, {
          ok: false,
          code: 401,
          errors: "Permission Required",
        });
    }
    next(decoded);
  };
};
