const Mongoose = require('mongoose');

const CategorySchema = new Mongoose.Schema(
  {
    name: String,
  },
  { timestamps: true, versionKey: false }
);

module.exports = Mongoose.model('Category', CategorySchema);
