/* global firebase moment */
// Steps to complete:

// 1. Initialize Firebase
// 2. Create button for adding new sheduled item (train) - then update the html + update the database
// When adding trains, administrators should be able to submit the following:
// Train Name
// Destination  
// First Train Time -- in military time
// Frequency -- in minutes
// 3. Create a way to retrieve sheduled items from the item database.
// 4. Create a way to calculate : 
// calculate when the next train will arrive; this should be relative to the current time.
// 5. Stylish & Responsive 

// 1. Initialize Firebase

// Initialize Firebase
var config = {
  apiKey: "AIzaSyD78sz7nhOJXqKj03Xqy65P7VwlzON1K3A",
  authDomain: "ge-gt-35a66.firebaseapp.com",
  databaseURL: "https://ge-gt-35a66.firebaseio.com",
  projectId: "ge-gt-35a66",
  storageBucket: "ge-gt-35a66.appspot.com",
  messagingSenderId: "795551094723"
};
firebase.initializeApp(config);

var database = firebase.database();

// 2. Form-Button for adding Items
$(document).ready(function () {
  $("#add-item-btn").on("click", function (event) {
    event.preventDefault();

    // Grabs user input
    var itmName = $("#item-name-input").val().trim();
    var itmDest = $("#dest-input").val().trim();
    var itmStart = moment($("#start-input").val().trim(), "HH:mm").format("X");
    var itmRate = $("#rate-input").val().trim();

    // Creates local "temporary" object for holding item data
    var newItm = {
      name: itmName,
      dest: itmDest,
      start: itmStart,
      rate: itmRate
    };

    // Uploads item data to the database
    database.ref('events').push(newItm);

    // Logs everything to console
    console.log(newItm.name);
    console.log(newItm.dest);
    console.log(newItm.start);
    console.log(newItm.rate);

    // Alert
    alert("Train successfully added");

    // Clears all of the text-boxes
    $("#item-name-input").val("");
    $("#desc-input").val("");
    $("#start-input").val("");
    $("#rate-input").val("");
  });
});
// 3. Create Firebase event for adding item to the database and a row in the html when a user adds an entry
database.ref('events').on("child_added", function (childSnapshot, prevChildKey) {

  console.log(childSnapshot.val());

  // Store everything into a variable.
  var itmName = childSnapshot.val().name;
  var itmDest = childSnapshot.val().dest;
  var itmStart = childSnapshot.val().start;
  var itmRate = childSnapshot.val().rate;

  // Event Info
  console.log(itmName);
  console.log(itmDest);
  console.log(itmStart);
  console.log(itmRate);

  // Prettify the item start
  var itmStartPretty = moment.unix(itmStart).format("HH:mm");
  console.log("Event TIME: " + itmStartPretty);

 
  // First Time (pushed back 1 year to make sure it comes before current time)
  var firstTimeConverted = moment(itmStart, "HH:mm").subtract(1, "years");
  console.log(firstTimeConverted);
  
  var startTimeConverted = moment(itmStart, "HH:mm");
  console.log("Start time : " + startTimeConverted);
  
  // Current Time
  var currentTime = moment();
  console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

  // Difference between the times
  var diffTime = moment().diff(moment(startTimeConverted), "minutes");
  console.log("DIFFERENCE IN TIME: " + diffTime);

  // Time apart (remainder)
  var tRemainder = diffTime % itmRate;
  console.log(tRemainder);

  // Minute Until Train
  var tMinutesTillTrain = itmRate - tRemainder;
  console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

  // Calculate the next arrival
  var nextTrain = moment().add(tMinutesTillTrain, "minutes");
  var itmNext = moment(nextTrain).format("HH:mm");
  console.log("ARRIVAL TIME: " + itmNext);
  


  // Add each train's data into the table
  $("#train-table > tbody").append("<tr><td>" + itmName + "</td><td>" + itmDest + "</td><td>" +
    itmRate + "</td><td>" + itmNext + "</td><td>" + tMinutesTillTrain + "</td></tr>");
});

// Example Time Math
// -----------------------------------------------------------------------------
// Assume Event start date of January 1, 2015
// Assume current date is March 1, 2016

// We know that this is 15 months.
// Now we will create code in moment.js to confirm that any attempt we use meets this test case


// Assume the following situations.

// (TEST 1)
// First Train of the Day is 3:00 AM
// Assume Train comes every 3 minutes.
// Assume the current time is 3:16 AM....
// What time would the next train be...? (Use your brain first)
// It would be 3:18 -- 2 minutes away

// (TEST 2)
// First Train of the Day is 3:00 AM
// Assume Train comes every 7 minutes.
// Assume the current time is 3:16 AM....
// What time would the next train be...? (Use your brain first)
// It would be 3:21 -- 5 minutes away


// ==========================================================

// Solved Mathematically
// Test case 1:
// 16 - 00 = 16
// 16 % 3 = 1 (Modulus is the remainder)
// 3 - 1 = 2 minutes away
// 2 + 3:16 = 3:18

// Solved Mathematically
// Test case 2:
// 16 - 00 = 16
// 16 % 7 = 2 (Modulus is the remainder)
// 7 - 2 = 5 minutes away
// 5 + 3:16 = 3:21

