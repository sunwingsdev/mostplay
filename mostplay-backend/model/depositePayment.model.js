const mongoose = require("mongoose");

const depositPaymentMethodSchema = new mongoose.Schema({
  methodName: {
    type: String,
    required: true,
  },
  methodNameBD: {
    type: String,
    required: true,
  },
  agentWalletNumber: {
    type: String,
    required: true,
  },
  agentWalletText: {
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
    default: "",
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
  paymentPageImage: {
    type: String,
    default: "",
  },
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
  backgroundColor: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  buttonColor: {
    type: String,
    required: true,
  }

});

const DepositPaymentMethod = mongoose.model("DepositPaymentMethod", depositPaymentMethodSchema);

module.exports = DepositPaymentMethod;
