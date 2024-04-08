const { User, Book } = require("../models");
const { signToken, AuthenticationError } = require("../utils/auth");

const resolvers = {
  Query: {
    //  get a single user by their username
    me: async (parent, args, context) => {
      // if user is provided as an argument, use that id, otherwise use the one from the auth middleware's user
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate("saveBooks");
      }
      throw new AuthenticationError("You need to be logged in!");
    },
  },

  Mutation: {
    // login a user with a username and password
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      // if user is not found, throw an error
      if (!user) {
        throw new AuthenticationError();
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError();
      }
      const token = signToken(user);
      return { token, user };
    },

    // add a user with a username, email, and password
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      if (!user) {
        throw new AuthenticationError;
      }
      const token = signToken(user);
      return { token, user };
    },

    // save a book to a user's account
    saveBook: async (_, { userId, bookData }, context) => {
      // if (context.user) {
      //   return User.findOneAndUpdate(
      //     { _id: context.user.id },
      //     { $addToSet: { saveBooks: input } },
      //     { new: true, runValidators: true }
      //   );
      // }
      // throw AuthenticationError;
      const user = await User.findOneAndUpdate(
        userId,
        { $push: { saveBooks: bookData } },
        { new: true }
      );
      return user;
    },

    // remove a book from a user's account, savedBooks
    removeBook: async (parent, { userId, bookId }, context) => {
      if (context.user) {
        return User.findOneAndUpdate(
          { _id: userId },
          { $pull: { saveBooks: { bookId } } },
          { new: true }
        );
      }
      throw new AuthenticationError("You need to be logged in!");
    }
  }
};

module.exports = resolvers;
