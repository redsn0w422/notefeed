classes = new Meteor.Collection("classes");

if (Meteor.isClient) {
  Meteor.subscribe('userData');
  Meteor.subscribe('classes');
  
  Meteor.startup(function () {
    $("#ohno").hide();
  });

  Template.hello.events({
    'click input' : function () {
      // template data, if any, is available in 'this'
      console.log("clicked");
      $("#ohno").show();
    }
  });

  Template.newClass.events({
    'click #newClass_submit' : function () {
      console.log("jeej");
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