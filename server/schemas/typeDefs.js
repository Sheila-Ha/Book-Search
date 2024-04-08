const typeDefs = `#graphql

type User {
    _id: ID
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]
}

type Book {
    _id: ID
    authors: [String]
    description: String
    bookId: String
    image: String
    link: String
    title: String
}

type Auth {
    token: ID!
    user: User
}

type Query {
    users: [User]
    user(username: String!): User
    me: User
    books(username: String): [Book]
    book(bookId: ID!): Book
}

input BookInput {
  bookId: ID!
  authors: [String]!
  description: String
  title: String!
  image: String
  link: String
}

type Mutation {
  addUser(
    username: String!, 
    email: String!,
    password: String!
    ): Auth 
  login(
    email: String!, 
    password: String!
    ): Auth 
  saveBook(
    userId: ID!,
    bookData: BookInput!
    ): User 
  removeBook(
    userId: ID!,
    bookId: ID!
    ): User
  }
`;

module.exports = typeDefs;
