module.exports = class StudentManager {
  constructor({
    utils,
    cache,
    config,
    cortex,
    managers,
    validators,
    mongomodels,
  } = {}) {
    this.config = config;
    this.cortex = cortex;
    this.validators = validators;
    this.mongomodels = mongomodels;
    this.tokenManager = managers.token;
    this.classroomManager = managers.classroom;
    this.StudentModel = mongomodels["student"];
    this.userExposed = [
      "createStudent",
      "put=updateStudent",
      "delete=deleteStudent",
      "get=getAllStudents",
      "get=getSchoolStudents",
    ];
  }
  async getAllStudents({ __superAdminCheck }) {
    try {
      const students = await this.StudentModel.findAll();
      return students;
    } catch (error) {
      return { error: err };
    }
  }

  async getSchoolStudents({ schoolId, __schoolAdminCheck }) {
    try {
      const query = await this.StudentModel.find({})
        .populate({
          path: "classroom",
          match: { school: schoolId },
          populate: { path: "school" },
        })
        .exec();
      return students;
    } catch (error) {
      return { error: err };
    }
  }

  async createStudent({ name, age, classroomId, gender, __schoolAdminCheck }) {
    try {
      const student = new this.StudentModel({
        name,
        age,
        classroom: classroomId,
        gender,
      });
      const savedStudent = await student.save();
      return savedStudent;
    } catch (err) {
      return { error: err };
    }
  }

  // Update a Student
  async updateStudent({ studentId, updatedData, __schoolAdminCheck }) {
    try {
      const student = await this.StudentModel.findByIdAndUpdate(
        studentId,
        updatedData,
        {
          new: true,
        }
      );
      return student;
    } catch (error) {
      return { error: err };
    }
  }

  // Delete a Student
  async deleteStudent({ studentId, __schoolAdminCheck }) {
    try {
      const deletedStudent = await this.StudentModel.findByIdAndRemove(
        studentId
      );
      return deletedStudent;
    } catch (err) {
      return { error: err };
    }
  }

  async getStudentSchool({ studentId }) {
    const student = await this.StudentModel.findById(studentId);
    const studentClassroom = student.classroom;
    if (!student) {
      return { error: "Student not found" };
    }
    const schoolId = await this.classroomManager.getClassroomSchool({
      classroomId: studentClassroom,
    });

    return schoolId;
  }
};
