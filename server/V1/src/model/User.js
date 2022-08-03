const Mongoose = require('mongoose');

const UserSchema = new Mongoose.Schema(
  {
    name: String,
    email: {
      type: String,
      unique: true,
    },
    password: String,
    avatar: {
      public_id: {
        type: String,
        //required: true,
      },
      url: {
        type: String,
        //required: true,
      },
    },
    isAdmin: Boolean,
  },
  { timestamps: true, versionKey: false }
);

module.exports = Mongoose.model('User', UserSchema);
