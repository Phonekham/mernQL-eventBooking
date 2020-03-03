const bcrypt = require("bcryptjs");
const User = require("../../models/user");

module.exports = {
  createUser: async args => {
    try {
      const existingUser = await User.findOne({ email: args.userInput.email });
      if (existingUser) {
        throw new Error("User exist already");
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
      const user = new User({
        email: args.userInput.email,
        password: hashedPassword
      });
      const result = await user.save();
      return { ...result._doc, _id: result._id, password: null };
    } catch (err) {
      throw err;
    }
  }
};
