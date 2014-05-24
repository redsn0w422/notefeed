classes = new Meteor.Collection("classes");

Meteor.methods({
  addClass: function (name, user, startDate, endDate, freq) {

    classes.insert({'name':name, 'user':user, 'startDate':startDate,
        'endDate':endDate, 'freq':freq, 'notes':[], 'rating':0});
    //check(arg1, String);
    //check(arg2, [Number]);
    // .. do stuff ..
    // if (you want to throw an error)
    //   throw new Meteor.Error(404, "Can't find my pants");
    // return "some return value";
  }
});

if (Meteor.isClient) {
  Accounts.ui.config({
    passwordSignupFields: 'USERNAME_AND_EMAIL'
  });

  // Accounts.config({
  //   sendVerificationEmail: 'true'
  // });

  Meteor.subscribe('userData');
  Meteor.subscribe('classes');
  
  Meteor.startup(function () {
    $("#newClassForm").hide();
    $("#browseClassesDiv").hide();
  });

  Template.menubar.events({
    'click #newClass' : function () {
      $("#newClassForm").show();
      $("#browseClassesDiv").hide();
      $("#userProfile").hide();

    },
    'click #browseClasses' : function () {
      $("#newClassForm").hide();
      $("#browseClassesDiv").show();
      $("#userProfile").hide();

    },
    'click #meLink' : function () {
      $("#userProfile").show();
      $("#browseClassesDiv").hide();
      $("#newClassForm").hide();
    }
  });

  Template.newClass.events({
    'click #newClass_submit' : function () {
      var name = $("#newClass_name").val();
      var user = Meteor.user().username;
      var startDate = $("#newClass_startDate").val();
      var endDate = $("#newClass_endDate").val();
      var freq = $("#newClass_freq").val();

      Meteor.call('addClass', name, user, startDate, endDate, freq);
    }
  });

  Template.browseClasses.classes = function () {
    return classes.find();
  };

  Template.userProfile.user = function () { 
    return Meteor.user();
  };

  Template.userProfile.ownedClasses = function () {
    if (Meteor.user() == null)
    {
      return classes.find();
    }
    else
    {
      return classes.find({'user':Meteor.user().username});
    }
    
  };

  Template.userProfile.username = function () { 
    if (Meteor.user() == null)
    {
      return "null";
    }
    else
    {
      return Meteor.user().username;
    }
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