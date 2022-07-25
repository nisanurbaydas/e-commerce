const Mongoose = require('mongoose');

const UserSchema = new Mongoose.Schema(
  {
    first_name: String,
    last_name: String,
    email: {
      type: String,
      unique: true,
    },
    password: String,
    addresses: [
      {
        title: String,
        address1: String,
        addresses2: String,
        country: String,
        province: String,
        code: String,
      },
    ],
    phones: [
      {
        number: String,
        type: String,
      },
    ],
    //favorites:[], //Product ref
    isAdmin: Boolean,
  },
  { timestamps: true, versionKey: false }
);

module.exports = Mongoose.model('User', UserSchema);
