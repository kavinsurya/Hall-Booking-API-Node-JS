const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const uniqid = require("uniqid");

//middleware
const app = express();
app.use(cors());
app.use(bodyParser.json());


let roomsAvailable = [];
let roomNo = 1000;
let romeBooked = [];

//date and time format
let date = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/;
let time = /^(0[0-9]|1\d|2[0-3])\:(00)/;


//api to get rooms available
app.get("/roomsAvailable", function (req, res) {
    res.json({
        output: roomsAvailable,
    });
});

//api to get rooms booked
app.get("/romesBooked", function (req, res) {
    res.json({
        output: romeBooked,
    });
});


//Api to create new room
app.post("/createRoom", function (req, res) {
    let room = {};
    room.id = uniqid();
    room.roomNo = roomNo;
    room.romeBooked = [];
    if (req.body.noSeats) {
        room.noSeats = req.body.noSeats;
    }
    else {
        res.status(400).json({
            output: " Mention the no of beds in the Room",
        });
    }
    if (req.body.amenities) {
        room.amenities = req.body.amenities;
    }
    else {
        res.status(400).json({
            output: "Mention the Amenities ",
        });
    }
    if (req.body.price) {
        room.price = req.body.price;
    }
    else {
        res.status(400).json({
            output: "Mention price per hour for Room",
        });
    }
    roomsAvailable.push(room);
    roomNo++;
    res.status(200).json({
        output: "Room Created Successfully",
    });
});


//Api for booking new halls
app.post("/booking", function (req, res) {
    let room = {};
    room.id = uniqid();
    room.roomNo = roomNo;
    room.bookings = [];
    if(req.body.noSeats){room.noSeats = req.body.noSeats} else{res.status(400).json({ output: 'Please specify No of seats for Room'})};
    if(req.body.amenities){room.amenities = req.body.amenities} else{res.status(400).json({ output: 'Please specify all Amenities for Room in Array format'})};
    if(req.body.price){room.price = req.body.price} else{res.status(400).json({ output: 'Please specify price per hour for Room'})};
    rooms.push(room);
    roomNo++;
    res.status(200).json({ output: 'Room Created Successfully'}) 
});

app.post("/createBooking", function (req, res) {
    let booking = {};
    booking.id = uniqid();
    if(req.body.custName){booking.custName = req.body.custName} else{res.status(400).json({ output: 'Please specify customer Name for booking.'})};
    if(req.body.date){
        if (date_regex.test(req.body.date)) {
            booking.date = req.body.date
        } else{
            res.status(400).json({ output: 'Please specify date in MM/DD/YYYY'})
        }
    } else{
        res.status(400).json({ output: 'Please specify date for booking.'})
    }

    if(req.body.startTime){
        if (time_regex.test(req.body.startTime)) {
            booking.startTime = req.body.startTime
        } else{
            res.status(400).json({ output: 'Please specify time in hh:min(24-hr format) where minutes should be 00 only'})
        }
    } else{
        res.status(400).json({ output: 'Please specify Starting time for booking.'})
    }

    if(req.body.endTime){
        if (time_regex.test(req.body.endTime)) {
            booking.endTime = req.body.endTime
        } else{
            res.status(400).json({ output: 'Please specify time in hh:min(24-hr format) where minutes should be 00 only'})
        }
    } else{
        res.status(400).json({ output: 'Please specify Ending time for booking.'})
    }

    const availableRooms = rooms.filter(room => {
        if(room.bookings.length == 0){
            return true;
        } else{
            room.bookings.filter(book =>{
                if((book.date == req.body.date) ){
                    if((parseInt((book.startTime).substring(0, 1)) > parseInt((req.body.startTime).substring(0, 1)) ) && 
                    (parseInt((book.startTime).substring(0, 1)) > parseInt((req.body.endTime).substring(0, 1)) ) ){ 
                        if((parseInt((book.startTime).substring(0, 1)) < parseInt((req.body.startTime).substring(0, 1)) ) && 
                          (parseInt((book.startTime).substring(0, 1)) < parseInt((req.body.endTime).substring(0, 1)) ) ){ 
                            return true;
                        }
                    }
                }
                else{
                    return true;
                }
            })

        }
    });
    if(availableRooms.length == 0){res.status(400).json({ output: 'No Available Rooms on Selected Date and Time'})}
   else{
    roomRec = availableRooms[0];
   let count =0;
   rooms.forEach(element => {
       if(element.roomNo == roomRec.roomNo){
        rooms[count].bookings.push({
            custName: req.body.custName,
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            date: req.body.date
        })
       }
       count++;
   });
   let bookingRec = req.body;
   bookingRec.roomNo = roomRec.roomNo;
   bookingRec.cost = parseInt(roomRec.price) * (parseInt((bookingRec.endTime).substring(0, 1)) - parseInt((bookingRec.startTime).substring(0, 1)));


   bookings.push(bookingRec);
   res.status(200).json({ output: 'Room Booking Successfully'}) 
}
});
// app.post("/booking", function (req, res) {
//     let booking = {};
//     booking.id = uniqid();
//     if (req.body.custName) {
//         booking.custName = req.body.custName;
//     }
//     else {
//         res.status(400).json({
//             output: "Please mention customer Name for booking.",
//         });
//     }
//     if (req.body.date) {
//         if (date.test(req.body.date)) {
//             booking.date = req.body.date;
//         }
//         else {
//             res.status(400).json({
//                 output: "Please mention date in MM/DD/YYYY",
//             });
//         }
//     }
//     else {
//         res.status(400).json({
//             output: "Please mention date for booking.",
//         });
//     }

//     if (req.body.startTime) {
//         if (time.test(req.body.startTime)) {
//             booking.startTime = req.body.startTime;
//         }
//         else {
//             res.status(400).json({
//                 output:
//                     "Please mnetion time in 24-hr format with minutes 00",
//             });
//         }
//     } else {
//         res.status(400).json({
//             output: "Please mentio starting time.",
//         });
//     }

//     if (req.body.endTime) {
//         if (time.test(req.body.endTime)) {
//             booking.endTime = req.body.endTime;
//         }
//         else {
//             res.status(400).json({
//                 output:
//                     "Please mnetion time in 24-hr format with minutes 00",
//             });
//         }
//     }
//     else {
//         res.status(400).json({
//             output: "Please mention ending time for booking.",
//         });
//     }

//     const availableRooms = roomsAvailable.filter((room) => {
//         if (room.romeBooked.length == 0) {
//             return true;
//         }
//         else {
//             room.romeBooked.filter((book) => {
//                 if (book.date == req.body.date) {
//                     if (
//                         parseInt(book.startTime.substring(0, 1)) >
//                         parseInt(req.body.startTime.substring(0, 1)) &&
//                         parseInt(book.startTime.substring(0, 1)) >
//                         parseInt(req.body.endTime.substring(0, 1))
//                     ) {
//                         if (
//                             parseInt(book.startTime.substring(0, 1)) <
//                             parseInt(req.body.startTime.substring(0, 1)) &&
//                             parseInt(book.startTime.substring(0, 1)) <
//                             parseInt(req.body.endTime.substring(0, 1))
//                         ) {
//                             return true;
//                         }
//                     }
//                 }
//                 else {
//                     return true;
//                 }
//             });
//         }
//     });
//     if (availableRooms.length == 0) {
//         res
//             .status(400)
//             .json({
//                 output: "No Available Rooms on Selected Date "
//             });
//     }
//     else {
//         roomRecord = availableRooms[0];
//         let count = 0;
//         roomsAvailable.forEach((element) => {
//             if (element.roomNo == roomRecord.roomNo) {
//                 roomsAvailable[count].romeBooked.push({
//                     custName: req.body.custName,
//                     startTime: req.body.startTime,
//                     endTime: req.body.endTime,
//                     date: req.body.date,
//                 });
//             }
//             count++;
//         });
//         let booking = req.body;
//         booking.roomNo = roomRecord.roomNo;
//         booking.cost =
//             parseInt(roomRecord.price) *
//             (parseInt(booking.endTime) - parseInt(booking.startTime));

//         romeBooked.push(booking);
//         res.status(200).json({
//             output: "Room Booked Successfully",
//         });
//     }
// });



app.listen(3000, () => {
    console.log("Listening to port 3000");
});
