classes = new Meteor.Collection("classes");

if (Meteor.isClient) {
  Accounts.ui.config({
    passwordSignupFields: 'USERNAME_ONLY'
  });

  Meteor.subscribe('userData');
  Meteor.subscribe('classes');
  
  Meteor.startup(function () {
    $("#newClassForm").hide();
  });

  Template.hello.events({
    'click input' : function () {
      // template data, if any, is available in 'this'
      console.log("clicked");
      $("#ohno").show();
    }
  });

  Template.menubar.events({
    'click #newClass' : function () {
      $("#newClassForm").show();
    }
  })

  Template.newClass.events({
    'click #newClass_submit' : function () {
      var name = $("#newClass_name").val();
      var user = Meteor.user().username;
      var startDate = $("#newClass_startDate").val();
      var endDate = $("#newClass_endDate").val();
      var freq = $("#newClass_freq").val();

      console.log(user);
      console.log(Meteor.userId());

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
    user.compositeRating = 0;
    return user;
  });

  Meteor.publish("classes", function () {
    return classes.find();
  });

  Meteor.publish("userData", function () {
    return Meteor.users.find();
  });

}