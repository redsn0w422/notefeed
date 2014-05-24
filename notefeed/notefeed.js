classes = new Meteor.Collection("classes");

$("#ohno").hide();

if (Meteor.isClient) {
  Meteor.subscribe('userData');
  Meteor.subscribe('classes');

  var meButton = document.getElementById("meLink");

  meButton.onclick = function() {
            $("#ohno").show();
            return false;
          };

  Template.hello.greeting = function () {
    return "Welcome to notefeed.";
  };

  Template.hello.events({
    'click input' : function () {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        console.log("You pressed the button");
    }
  });

  Template.class.classes = function() {
    return classes.find();
  };
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });


  Accounts.onCreateUser(function(options, user) {
    user.own_classes = [];
    user.sub_classes = [];
    return user;
  });

  Meteor.publish("classes", function () {
    return classes.find();
  });

  Meteor.publish("userData", function () {
    return Meteor.users.find();
  });

}
