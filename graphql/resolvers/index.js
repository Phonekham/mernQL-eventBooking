const bcrypt = require("bcryptjs");

const Event = require("../../models/event");
const User = require("../../models/user");

const user = async userId => {
  try {
    const user = await User.findById(userId);
    return {
      ...user._doc,
      _id: user.id,
      createdEvents: events.bind(this, user._doc.createdEvents)
    };
  } catch (err) {
    throw err;
  }
};

const events = async eventsIds => {
  try {
    const events = await Event.find({ _id: { $in: eventsIds } });
    events.map(event => {
      return {
        ...event._doc,
        _id: event.id,
        creator: user.bind(this, event.creator)
      };
    });
    return events;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map(event => {
        return {
          ...event._doc /* _id: event._doc._id.toString() */,
          date: new Date().toISOString(),
          creator: user.bind(this, event._doc.creator)
        };
      });
    } catch (err) {
      console.log(err);
    }
  },
  createEvent: async args => {
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: args.eventInput.price,
      date: new Date(args.eventInput.date).toISOString(),
      creator: "5e5b8273a7f7ef3f0c07c3a0"
    });

    let createdEvent;

    try {
      const result = await event.save();
      createdEvent = {
        ...result._doc,
        date: new Date(args.eventInput.date).toISOString(),
        creator: user.bind(this, result._doc.creator)
      };
      const creator = await User.findById("5e5b8273a7f7ef3f0c07c3a0");
      if (!creator) {
        throw new Error("User not found already");
      }
      creator.createdEvents.push(event);
      await creator.save();
      return createdEvent;
    } catch (err) {
      throw err;
    }
  },
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
