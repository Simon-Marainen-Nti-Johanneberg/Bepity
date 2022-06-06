var express = require('express');
var app = express();

app.set("view engine", "ejs")
app.use(express.static('public'));


app.get('/', function (req, res) {
   res.render("index")
})



const userRouter = require("./routes/users")
app.use("/users", userRouter)

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://127.0.0.1:8081")
})