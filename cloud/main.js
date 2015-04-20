
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});


Parse.Cloud.define("sendMail", function(request, response) {

  var itemName = request.params.itemName,
      itemQuantity = request.params.itemQuantity,
      text = "Hello, dear User! New item "
          + itemName + " - " + "count - " + itemQuantity + " was added to your list";

  var Mandrill = require('mandrill');
  Mandrill.initialize('3k4990grJOJ7x-2x-AoCRA');

  for ( var i = 0; i < request.params.users.length; i++) {

    var userName = request.params.users[i].username,
        userMail = request.params.users[i].email;

    Mandrill.sendEmail({
      message: {
        text: text,
        subject: "Check new Item in you List",
        from_email: "parse@cloudcode.com",
        from_name: "Lena23n",
        to: [
          {
            email: userMail,
            name: userName
          }
        ]
      },
      async: true
    },{
      success: function(httpResponse) {
        console.log(httpResponse);
        response.success("Email sent!");
      },
      error: function(httpResponse) {
        console.error(httpResponse);
        response.error("Uh oh, something went wrong");
      }
    });
  }
});
