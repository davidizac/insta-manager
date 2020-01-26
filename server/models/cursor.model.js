const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cursorSchema = new Schema(
  {
    cursor: { type: String, required: true }
  },
  { capped: { size: 2048, max: 1 } }
);

const CursorModel = mongoose.model("Cursor", cursorSchema, "cursors");

module.exports = CursorModel;
