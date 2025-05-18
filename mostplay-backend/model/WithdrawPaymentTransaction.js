const mongoose = require("mongoose");

const withdrawPaymentTransactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  paymentMethod: {
    methodName: {
      type: String,
      required: true,
    },
    methodImage: {
      type: String,
      required: true,
    },
    gateway: {
      type: String,
      default: "",
    },
  },
  channel: {
    type: String,
    default: "",
  },
  amount: {
    type: Number,
    required: true,
    min: 200,
    max: 30000,
  },
  userInputs: [
    {
      name: {
        type: String,
        required: true,
      },
      value: {
        type: String,
        required: true,
      },
      label: {
        type: String,
        required: true,
      },
      labelBD: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        enum: ["number", "text", "file"],
        required: true,
      },
    },
  ],
  status: {
    type: String,
    enum: ["pending", "completed", "failed", "cancelled"],
    default: "pending",
  },
  reason: {
    type: String,
    default: "",
    required: function () {
      return ["failed", "cancelled"].includes(this.status);
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

withdrawPaymentTransactionSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Export the model, reusing it if already defined
module.exports = mongoose.models.WithdrawPaymentTransaction || mongoose.model("WithdrawPaymentTransaction", withdrawPaymentTransactionSchema);