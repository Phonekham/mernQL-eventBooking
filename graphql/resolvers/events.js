const Event = require("../../models/event");
const User = require("../../models/user");
const { dateToString } = require("../../helpers/date");
const { transformEvent } = require("./merge");

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map(event => {
        return transformEvent(event);
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
      date: dateToString(args.eventInput.date),
      creator: "5e5b8273a7f7ef3f0c07c3a0"
    });

    let createdEvent;

    try {
      const result = await event.save();
      createdEvent = transformEvent(result);
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
  }
};
