const Mongoose = require('mongoose');

const ProductSchema = new Mongoose.Schema(
  {
    name: String,
    description: String,
    stock: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      default: 0.0,
    },
    ratings: {
      type: Number,
      default: 0,
    },
    user_id: {
      type: Mongoose.Types.ObjectId,
      ref: 'User',
    },
    category_id: {
      type: Mongoose.Types.ObjectId,
      ref: 'Category',
    },
    images: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
    category: {
      type: String,
      required: [true, 'Please select category for this product'],
      enum: {
        values: ['Electronics', 'Cameras', 'Laptops', 'Accessories', 'Headphones', 'Food', 'Books', 'Clothes/Shoes', 'Beauty/Health', 'Sports', 'Outdoor', 'Home'],
        message: 'Please select correct category for product',
      },
    },
    seller: String,
    numOfReviews: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        user: {
          type: Mongoose.Schema.ObjectId,
          ref: 'User',
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        rating: {
          type: Number,
          required: true,
        },
        comment: {
          type: String,
          required: true,
        },
      },
    ],
    // user: {
    //   type: mongoose.Schema.ObjectId,
    //   ref: 'User',
    //   required: true,
    // },
  },
  { timestamps: true, versionKey: false }
);

module.exports = Mongoose.model('Product', ProductSchema);
