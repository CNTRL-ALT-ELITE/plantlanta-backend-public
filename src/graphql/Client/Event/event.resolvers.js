import EventModel from "../../../MongoDB/Event";

const createNewEvent = async (parent, args, ctx, info) => {
  const { event } = args;
  console.log(event);
  const query = await EventModel.create(event);

  return query;
};

const updateExistingEvent = async (parent, args, ctx, info) => {
  const { event, id } = args;

  const query = await EventModel.updateOne({ _id: id }, { $set: event });

  return query.nModified > 0;
};

const removeExistingEvent = async (parent, args, ctx, info) => {
  const { id } = args;

  const query = await EventModel.remove({ _id: id }, { justOne: true });
  return query.deletedCount > 0;
};

const updateEventImage = async (parent, args, ctx, info) => {
  const { id, imageURL } = args;
  const query = await EventModel.updateOne(
    { _id: id },
    { $set: { original_image_url: imageURL } }
  );

  return query.nModified > 0;
};

const updateEventAdditionalImages = async (parent, args, ctx, info) => {
  const { id, imageURLs } = args;
  console.log(imageURLs);
  const query = await EventModel.updateOne(
    { _id: id },
    { $addToSet: { additional_pictures: imageURLs } }
  );

  return query.nModified > 0;
};

const newSignup = async (parent, args, ctx, info) => {
  const { id, name, email } = args;
  const signUp = {
    name,
    email
  };

  const query = await EventModel.updateOne(
    {
      _id: id
    },
    {
      $push: { signUps: signUp }
    }
  );

  console.log(query);

  if (query.nModified > 0) {
    return {
      success: true,
      error: ""
    };
  } else {
    return {
      success: false,
      error: ""
    };
  }
};

const getEvents = async (parent, args, ctx, info) => {
  const events = await EventModel.find();

  return events;
};

export default {
  Mutation: {
    createNewEvent,
    updateExistingEvent,
    removeExistingEvent,
    updateEventImage,
    updateEventAdditionalImages,
    newSignup
  },
  Query: {
    getEvents
  }
};
