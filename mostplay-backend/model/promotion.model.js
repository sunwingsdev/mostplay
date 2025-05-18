const mongoose = require("mongoose");

const PromotionSchema = new mongoose.Schema(
  {
    img: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    title_bd: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    description_bd: {
      type: String,
      default: "",
    },
    game_type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MenuOption",
      required: true,
    },
    payment_methods: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "DepositPaymentMethod",
      required: true,
    }],
    promotion_bonuses: [{
      payment_method: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DepositPaymentMethod",
        required: true,
      },
      bonus_type: {
        type: String,
        enum: ["Fix", "Percentage"],
        default: "Fix",
      },
      bonus: {
        type: Number,
        default: 0,
      },
    }],
  },
  { timestamps: true }
);

const Promotion = mongoose.model("Promotion", PromotionSchema);

module.exports = Promotion;
