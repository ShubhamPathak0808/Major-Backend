const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const attendanceResponseSchema = new Schema({
  attendance_id: { type: String, required: true},
  student_id: {type: String, required: true},
  // course_id:{type: String, required: true},         //updated part addition of field in schema
  student_name: { type: String },
  date: { type: Date, default: Date.now },              //updated part addition of field in schema
  timestamp: { type: Date, default: Date.now },         //updated part addition of field in schema
});

const attendanceResponse = mongoose.model('AttendanceResponse', attendanceResponseSchema);

module.exports = attendanceResponse;
