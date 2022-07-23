const Mongoose = require('mongoose');

const ProductSchema = new Mongoose.Schema(
  {
    name: String,
    description: String,
    quantity: Number,
    unit_price: Number,
    // user_id: {
    //   type: Mongoose.Types.ObjectId,
    //   ref: 'User',
    // },
    // category_id: {
    //     type: Mongoose.Types.ObjectId,
    //     ref: 'Category'
    // },
    media: String,
    comments: [
      {
        comment: String,
        rate: Number,
        created_at: Date,
        // user_id: {
        //   type: Mongoose.Types.ObjectId,
        //   ref: 'user',
        // },
      },
    ],
  },
  { timestamps: true, versionKey: false }
);

module.exports = Mongoose.model('Product', ProductSchema);
