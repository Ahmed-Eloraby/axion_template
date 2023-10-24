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
      "get=getAllStudents",
      "put=updateStudent",
      "delete=deleteStudent",
      "get=getStudentSchool",
    ];
  }

  async createStudent({ name, age, classroom, gender }) {
    try {
      const student = new this.StudentModel({
        name,
        age,
        classroom,
        gender,
      });
      const savedStudent = await student.save();
      return savedStudent;
    } catch (err) {
      return { error: err };
    }
  }

  // Read Students
  async getAllStudents({ __longToken }) {
    try {
      const students = await this.StudentModel.find().populate("classroom");
      return students;
    } catch (error) {
      return { error: err };
    }
  }

  // Update a Student
  async updateStudent({ studentId, updatedData }) {
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
  async deleteStudent({ studentId }) {
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
    console.log(studentClassroom);
    if (!student) {
      return { error: "Student not found" };
    }
    const schoolId = await this.classroomManager.getClassroomSchool({
      classroomId: studentClassroom,
    });

    console.log(schoolId);

    return schoolId;
  }
};
