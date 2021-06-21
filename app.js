const express = require("express");
const bodyParser = require ("body-parser");
const request = require("request");
const https = require ("https");

const app = express();

app.use(express.static("public")); //this is code to enable the css and images - which are static to be rendered when sending the
//html file below. Static means it is not a url but a file localy.

app.use(bodyParser.urlencoded({extended:true})); //basic code to be able to use body parser

app.listen(process.env.PORT, function(){ //process.env.PORT is a dynamic port for heroku, intead of picking one specific one like 3000.
    console.log("Im listeneing on port 3000.");
});

app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){ //post listens and captures the data filled on the form
  const firstName= req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const data = { //data is a JSON object to send the data to mailchimp
    members: [
      {
      email_address:email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
      }
    ]
  };
  const jsonData = JSON.stringify(data);

  const url = "https://us18.api.mailchimp.com/3.0/lists/159d4d78ca";

  const options = { //object to pass as a varaible below
    method: "POST",
    body: data,
    auth:"leo:21da32714367b53810cc71a3e30fa1b0-us18"
  };

  const request = https.request(url, options, function(response){ //https. allows us to get data from an external server. But it also alows to pass a third variable in the form of POST to post data on mailchimp in the form of options
    if(response.statusCode===200){
      res.sendFile(__dirname + "/success.html");
    }
    else {
      res.sendFile(__dirname + "/failure.html")
    }

    response.on("data", function(data){
      console.log(JSON.parse(data))
    });
  });

  request.write(jsonData); //this sends the jsonData to be witten in the mailchimp server
  request.end();
});

  app.post("/failure", function(req, res){ //this second post request is for a button in the failure page to rediect the user to the homepage.
    res.redirect("/");
  });
