let express = require('express');
let mongoose = require('mongoose');
let cors = require('cors');
let bodyParser = require('body-parser');
let mongoDb = require('./db');

const BookRoute = require('./BookRoute')
const UsersRoute = require('./UsersRoute')
const StudentRouter = require('./routes/student.routes')
const TeacherRouter = require('./routes/teacher.routes')
const HodRouter = require('./routes/hod.routes')
const CourseRoute = require('./routes/course.routes');
const NoteRouter = require('./routes/note.routes');
const AssignmentRouter = require('./routes/AssignmentRouter');
const MessageRouter = require('./routes/message.routes');
const QuizRouter = require('./routes/quiz.routes');
const ResetPasswordRouter = require('./routes/resetPassword.routes');
const AttendanceRouter = require('./routes/attendanceRouter');
const path = require('path');
mongoose.Promise = global.Promise;
mongoose.connect(mongoDb.database, {
    useUnifiedTopology: true,
    useNewUrlParser: true
}).then(() => {
  console.log('Database connected!')
},
error => {
    console.log(error)
  }
)

const app = express();
app.use(express.urlencoded({ extended: true }));
var  jsonParser = app.use(express.json());
// app.use(express.static('public'))
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use('/', BookRoute)
app.use('/user',UsersRoute)

app.use('/api',StudentRouter);
app.use('/api',TeacherRouter);
app.use('/api',HodRouter);
app.use('/api',CourseRoute);
app.use('/api',NoteRouter);
app.use('/api',AssignmentRouter);
app.use('/api',MessageRouter);
app.use('/api',QuizRouter);
app.use('/api',ResetPasswordRouter);
app.use('/api',AttendanceRouter);




const port = 8000 ;
const server = app.listen(port, () => {
  console.log('Connected on : ' + port)
})

app.use(function (err, req, res, next) {
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send(err.message);
});