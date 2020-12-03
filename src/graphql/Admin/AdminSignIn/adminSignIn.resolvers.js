const adminSignIn = async (parent, args, ctx, info) => {
  const { password } = args;

  if (password === "12345678") {
    return true;
  } else {
    return false;
  }
};

export default {
  Mutation: {
    adminSignIn
  },
  Query: {}
};
