module.exports = class User {
  constructor({
    utils,
    cache,
    config,
    cortex,
    managers,
    validators,
    mongomodels,
  } = {}) {
    this.utils = utils;
    this.config = config;
    this.cortex = cortex;
    this.validators = validators;
    this.mongomodels = mongomodels;
    this.tokenManager = managers.token;
    this.UserModel = mongomodels["user"];
    this.usersCollection = "users";
    this.userExposed = ["createSuperAdmin", "createSchoolAdmin", "signIn"];
  }

  async createSuperAdmin({ username, password }) {
    try {
      const hashedPassword = await this.utils.hash(password);
      const role = "superadmin";
      console.log(hashedPassword);
      const superAdmin = new this.UserModel({
        username: username,
        password: hashedPassword,
        role: role,
      });
      const savedSuperAdmin = await superAdmin.save();
      return savedSuperAdmin;
    } catch (err) {
      return { error: err };
    }
  }

  async createSchoolAdmin({ username, password, school, __superAdminCheck }) {
    try {
      const hashedPassword = await this.utils.hash(password);
      const role = "schooladmin";
      const schoolAdmin = new this.UserModel({
        username: username,
        password: hashedPassword,
        role: role,
        school: school,
      });
      const savedSchoolAdmin = await schoolAdmin.save();
      return savedSchoolAdmin;
    } catch (err) {
      return { error: err };
    }
  }

  async signIn({ username, password }) {
    try {
      const admin = await this.UserModel.findOne({ username });
      if (!admin) throw new Error("Invalid Credentials");
      if (!(await this.utils.verifyHash(password, admin.password)))
        throw new Error("Invalid Credentials");
      console.log(admin);
      const token = this.tokenManager.genLongToken({
        userId: admin._id,
        userKey: {
          school: admin.school,
          role: admin.role,
        },
      });
      return token;
    } catch (err) {
      console.log(err);
      return { error: err };
    }
  }
};
