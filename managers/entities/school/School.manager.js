module.exports = class SchoolManager {
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
    this.SchoolModel = mongomodels["school"];
    this.userExposed = [
      "createSchool",
      "get=getAllSchools",
      "put=updateSchool",
      "delete=deleteSchool",
    ];
  }

  async createSchool({ name, __superAdminCheck }) {
    try {
      const school = new this.SchoolModel({
        name,
      });
      const savedSchool = await school.save();
      return savedSchool;
    } catch (err) {
      return { error: err };
    }
  }

  async getAllSchools({ __superAdminCheck }) {
    try {
      const schools = await this.SchoolModel.find();
      return schools;
    } catch (err) {
      return { error: err };
    }
  }

  async updateSchool({ schoolId, updatedData, __superAdminCheck }) {
    try {
      const school = await this.SchoolModel.findByIdAndUpdate(
        schoolId,
        updatedData,
        { new: true }
      );
      return school;
    } catch (err) {
      return { error: err };
    }
  }

  async deleteSchool({ schoolId, __superAdminCheck }) {
    try {
      const deletedSchool = await this.SchoolModel.findByIdAndRemove(schoolId);
      return deletedSchool;
    } catch (err) {
      return { error: err };
    }
  }
};
