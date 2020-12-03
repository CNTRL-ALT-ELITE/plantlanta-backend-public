import UserModel from "../../../MongoDB/User";

const newUserSignup = async (parent, args, ctx, info) => {
  const { name, email } = args;

  const fetchUser = await UserModel.findOne({
    email
  });

  if (fetchUser !== null && fetchUser !== undefined) {
    return "Email already exists";
  }

  const newUser = await UserModel.create({
    name,
    email
  });

  if (newUser !== null && newUser !== undefined) {
    return "";
  } else {
    return "Error! try again later.";
  }
};

export default {
  Mutation: {
    newUserSignup
  },
  Query: {}
};
