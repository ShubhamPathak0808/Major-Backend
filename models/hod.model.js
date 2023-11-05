const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

const hodSchema = new Schema({
  fName: { type: String, required: true, trim: true },
  lName: { type: String },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate(value)
    {
      if( !validator.isEmail(value)){
        throw new Error("Email is invalid");
      }
    }
  },
  password: { type: String, required: true, minlength: 5}
}, {
  timestamps: true,
});

hodSchema.pre("save", async function (next) {
  const hod = this;
  if (hod.isModified("password")) {
    hod.password = hod.password;
  }
  next();
});

hodSchema.methods.toJSON = function () {
  const hod = this
  const hodObject = hod.toObject()
  delete hodObject.password
  return hodObject;
}

const Hod = mongoose.model('Hod', hodSchema);

module.exports = Hod;