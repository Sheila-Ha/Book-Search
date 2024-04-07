const { User } = require("../models");
const { signToken, AuthenticationError } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, { user }, context) => {
      // if user is provided as an argument, use that id, otherwise use the one from the auth middleware's user
      if (context.user) {
        return User.findOne({ _id: user ? user._id : context.user._id });
      }
      throw AuthenticationError;
    },
  },
};

Mutation: {
  login: async (parent, { email, password }) => {
    const user = await User.findOne({ email });
    if (!user) {
      throw AuthenticationError;
    }

    const correctPw = await user.isCorrectPassword(password);

    if (!correctPw) {
      throw AuthenticationError;
    }
    const token = signToken(user);
    return { token, user };
  };

  addUser: async (parent, { username, email, password }) => {
    const user = await User.create({ username, email, password });
    if (!user) {
      throw AuthenticationError;
    }
    const token = signToken(user);
    return { token, user };
  };

  saveBook: async (parent, { input }, context) => {
    if (context.user) {
      return User.findOneAndUpdate(
        { _id: context.user.id },
        { $addToSet: { saveBooks: input } },
        { new: true, runValidators: true }
      );
    }
    throw AuthenticationError;
  };

  removeBook: async (parent, { bookId }, context) => {
    if (context.user) {
      return User.findOneAndUpdate(
        { _id: context.user._id },
        { $pull: { saveBooks: { bookId } } }
      );
    }
    throw AuthenticationError;
  };
}

module.exports = resolvers;
