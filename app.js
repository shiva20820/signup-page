const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});
app.post("/", (req, res) => {
  const firstName = req.body.Fname;
  const lastName = req.body.Lname;
  const email = req.body.email;
  const password = req.body.password;
  console.log(firstName, lastName, email, password);

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
        password: password,
      },
    ],
  };

  const jsonData = JSON.stringify(data);
  const url = "https://us14.api.mailchimp.com/3.0/lists/0a9f94c3c0";
  const options = {
    method: "POST",
    auth: "shiva:8442ed86f94bdfa59588278044cef9bf-us14",
  };
  const request = https.request(url, options, (response) => {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", function (data) {
      data = JSON.parse(jsonData);
      console.log(data);
    });
  });
  request.write(jsonData);
  request.end();
});

app.post("/failure", (req, res) => {
  res.redirect("/");
});
app.listen(3000, function () {
  console.log("server is running at 3000");
});
