module.exports = class ClassroomManager {
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
    this.ClassroomModel = mongomodels["classroom"];
    this.userExposed = [
      "createClassroom",
      "get=getAllClassrooms",
      "put=updateClassroom",
      "delete=deleteClassroom",
    ];
  }

  //
  async createClassroom({ name, schoolId, __schoolAdminCheck }) {
    try {
      const classroom = new this.ClassroomModel({
        name,
        school: schoolId,
      });
      const savedClassroom = await classroom.save();
      return savedClassroom;
    } catch (err) {
      return { error: err };
    }
  }

  async getAllClassrooms({ schoolId, __schoolAdminCheck }) {
    try {
      const classrooms = await this.ClassroomModel.find({
        school: schoolId,
      }).populate("school");
      return classrooms;
    } catch (err) {
      return { error: err };
    }
  }

  async updateClassroom({ classroomId, updatedData, __schoolAdminCheck }) {
    try {
      const classroom = await this.ClassroomModel.findByIdAndUpdate(
        classroomId,
        updatedData,
        { new: true }
      );
      return classroom;
    } catch (err) {
      return { error: err };
    }
  }

  async deleteClassroom({ classroomId, __schoolAdminCheck }) {
    try {
      const deletedClassroom = await this.ClassroomModel.findByIdAndRemove(
        classroomId
      );
      return deletedClassroom;
    } catch (err) {
      return { error: err };
    }
  }

  async getClassroomSchool({ classroomId }) {
    const classroom = await this.ClassroomModel.findById(classroomId);
    console.log(classroomId);
    if (!classroom) throw "Invalid Classroom";
    return classroom.school;
  }
};
