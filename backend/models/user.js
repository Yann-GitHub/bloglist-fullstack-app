// Used for data modeling, validation and buisness logic
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    minlength: 3,
    required: true,
    unique: true,
  },
  name: String,
  passwordHash: {
    type: String,
    required: true,
  },
  //   notes: [
  //     {
  //       type: mongoose.Schema.Types.ObjectId,
  //       ref: "Note",
  //     },
  //   ],
});

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString(); // the id is a string representation of the _id
    delete returnedObject._id; // the _id should not be revealed
    delete returnedObject.__v; // the __v should not be revealed
    delete returnedObject.passwordHash; // the passwordHash should not be revealed
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
// module.exports = mongoose.model("User", userSchema);
