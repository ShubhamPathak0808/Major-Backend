const express = require("express");
// const qrcode = require("qrcode");                   //new added part for qr code functionality
const Attendance = require("../models/attendance");
const attendanceResponse = require("../models/AttendanceResponse");
const router = new express.Router();

router.get("/attendence/course/:course_id", async (req, res) => {
	console.log(req.params.course_id);
	const course_id = req.params.course_id;

	try {
		const attendance = await Attendance.find({ course_id: course_id });
		//  console.log(attendance);
		if (!attendance || attendance.length == 0)
			return res
				.status(404)
				.send({ success: false, data: "No response found" });

		res.send({ success: true, data: attendance });
	} catch (error) {
		res.status(500).send({ success: false, error });
	}
});
router.post("/attendence", async (req, res, next) => {
	// const attendance = new Attendance(req.body);         //old part

  const { duration, ...attendanceData } = req.body; //updated part starts

	// Convert duration from minutes to seconds
	const durationInSeconds = duration * 60;

	// Create a new Attendance instance
	const attendance = new Attendance({
		...attendanceData,
		duration: durationInSeconds, // Update the duration in seconds
	});                                 //updated part ends

	// console.log(attendance);
	try {
	  await attendance.save();
	  res.send({ data: attendance, success: true });
	} catch (error) {
	  console.log(error);
	  res.status(400).send(error);
	}

	// const { duration, ...attendanceData } = req.body; //updated part

	// // Convert duration from minutes to seconds
	// const durationInSeconds = duration * 60;

	// // Create a new Attendance instance
	// const attendance = new Attendance({
	// 	...attendanceData,
	// 	duration: durationInSeconds, // Update the duration in seconds
	// });

	// try {
	// 	// Save the attendance
	// 	await attendance.save();

	// 	// Decrease the duration by one second every second
	// 	const interval = setInterval(async () => {
	// 		attendance.duration -= 1;
	// 		await attendance.save();

	// 		// Check if the duration has reached 0
	// 		if (attendance.duration <= 0) {
	// 			clearInterval(interval);
	// 		}
	// 	}, 1000); // Run the interval every second (1000 milliseconds)

	// 	res.send({ data: attendance, success: true });
	// } catch (error) {
	// 	console.log(error);
	// 	res.status(400).send(error);
	// }
});
// http://localhost:8000/api/attendence/${attendenceId}
router.get("/attendence/:id", async (req, res) => {
	const _id = req.params.id;

	// const qr_url = `http://localhost:3000/attendence/${_id}`              //new part added

	try {
		const attendance = await Attendance.findById({ _id });
		if (!attendance)
			return res
				.status(404)
				.send({ success: false, data: "No Attendance found" });

		res.send({ success: true, data: attendance });

		// qrcode.toDataURL(qr_url, (err, src) => {                        //new part addition starts here
		// 	if (err) res.send("Something went wrong!!");
		// 	res.render("scan", {
		// 	  qr_code: src,
		// 	});
		//   });                                                               //new part addition ends here

	} catch (error) {
		res.status(500).send({ success: false, error });
	}
});
//   http://localhost:8000/api/attendence/hasSubmitted/${attendenceId}/${user._id}
router.get(
	"/attendence/hasSubmitted/:attendanceId/:studentId",
	async (req, res) => {
		const attendance_id = req.params.attendanceId;
		const student_id = req.params.studentId;
		try {
			const response = await attendanceResponse.findOne({
				attendance_id,
				student_id,
			});
			if (!response) return res.send({ success: false, data: false });

			res.send({ success: true, data: true });
		} catch (error) {
			res.status(500).send({ success: false, error });
		}
	}
);

// Function to start the duration update functionality                              //new added part starts
const startDurationUpdate = (attendance) => {
  // Decrease the duration by one second every second
  const interval = setInterval(async () => {
    // Check if isActive is still true
    const updatedAttendance = await Attendance.findById(attendance._id);
    if (!updatedAttendance.is_active) {
      clearInterval(interval);
      return;
    }

    updatedAttendance.duration -= 1;
    await updatedAttendance.save();

    // Check if the duration has reached 0
    if (updatedAttendance.duration <= 1) {
      updatedAttendance.is_active = false ;
      updatedAttendance.duration = 0;
      await updatedAttendance.save();
      clearInterval(interval);
      return;
    }
  }, 1000); // Run the interval every second (1000 milliseconds)
};                                                                                    //new added part ends

//   http://localhost:8000/api/startAttendence/${attendenceId}
router.post("/startAttendence/:id", async (req, res) => {
	const _id = req.params.id;
	try {
		const attendance = await Attendance.findByIdAndUpdate(
			_id,
			{
				is_active: true,
			},
			{ new: true, runValidators: true }
		);

    // Start the duration update functionality
    if (attendance.is_active) {                          //new added part starts
      startDurationUpdate(attendance);
    }                                                   //new added part ends

		res.send({ data: attendance, success: true });
		console.log(attendance);
	} catch (error) {
		console.log(error);
		res.status(400).send(error);
	}
});

//   http://localhost:8000/api/endAttendence/${attendenceId}
router.post("/endAttendence/:id", async (req, res) => {
	const _id = req.params.id;
	try {
		const attendance = await Attendance.findByIdAndUpdate(
			_id,
			{
				is_active: false,
			},
			{ new: true, runValidators: true }
		);
		res.send({ data: attendance, success: true });
	} catch (error) {
		console.log(error);
		res.status(400).send(error);
	}
});
//   http://localhost:8000/api/assignment/${assID}
router.post("/submitAttendence", async (req, res) => {
	const ar = new attendanceResponse(req.body);
	try {
		const student = await attendanceResponse.find({
			attendance_id: req.body.attendance_id,
			student_id: req.body.student_id,
		});

		if (student.length > 0) {
			return res.send({ success: false, data: "Submission exists" });
		} else {
			await ar.save();
			res.send({ data: ar, success: true });
		}
	} catch (error) {
		console.log(error);
		res.status(400).send(error);
	}
});
router.get("/attendenceResult/:id", async (req, res) => {
	const _id = req.params.id;
	try {
		const attendenceResult = await attendanceResponse.find({
			attendance_id: _id,
		});
		if (!attendenceResult || attendenceResult.length == 0)
			return res
				.status(404)
				.send({ success: false, data: "No response found" });

		res.send({ success: true, data: attendenceResult });
	} catch (error) {
		res.status(500).send({ success: false, error });
	}
});

module.exports = router;
