const mongoose = require("mongoose");

const withdrawPaymentMethodSchema = new mongoose.Schema({
  methodName: {
    type: String,
    required: true,
  },
  methodNameBD: {
    type: String,
    required: true,
  },
  methodImage: {
    type: String,
    required: true,
  },
  gateway: {
    type: [String],
    default: [],
  },
  color: {
    type: String,
    required: true,
  },
  backgroundColor: {
    type: String,
    required: true,
  },
  buttonColor: {
    type: String,
    required: true,
  },
  userInputs: [
    {
      type: {
        type: String,
        enum: ["number", "text", "file"],
        default: "text",
        required: true,
      },
      isRequired: {
        type: String,
        default: "true",
      },
      label: {
        type: String,
        default: "",
      },
      labelBD: {
        type: String,
        default: "",
      },
      fieldInstruction: {
        type: String,
        default: "",
      },
      fieldInstructionBD: {
        type: String,
        default: "",
      },
      name: {
        type: String,
        required: true,
      },
    },
  ],
  instruction: {
    type: String,
    default: "",
  },
  instructionBD: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
});

const WithdrawPaymentMethod = mongoose.model("WithdrawPaymentMethod", withdrawPaymentMethodSchema);

module.exports = WithdrawPaymentMethod;