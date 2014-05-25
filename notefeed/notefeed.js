classes = new Meteor.Collection("classes");

Meteor.methods({
  addClass: function (name, user, keywords, startDate, endDate, freq) {

    classes.insert({'name':name, 'user':user, 'keywords':keywords, 'startDate':startDate,
        'endDate':endDate, 'freq':freq, 'notes':[], 'rating':0});
    //check(arg1, String);
    //check(arg2, [Number]);
    // .. do stuff ..
    // if (you want to throw an error)
    //   throw new Meteor.Error(404, "Can't find my pants");
    // return "some return value";
  },

  addSubscription: function (name, classID) {
    var user = Meteor.users.findOne({'username': name});
    var subscriptionList = user.sub_classes;

  }
});

if (Meteor.isClient) {
  Accounts.ui.config({
    passwordSignupFields: 'USERNAME_AND_EMAIL'
  });

  // Accounts.config({
  //   sendVerificationEmail: 'true'
  // });

  Meteor.autosubscribe(function() {
    classes.find().observe({
      added: function(item) {
        var newHTML = '';

        for (var classy in classes.find())
        {
          newHTML += '<div class="btn-group" id="browseClass_'+classy._id+'">
      <button class="btn btn-default" type="button" data-toggle="modal" data-target="#'+classy._id+'">'+classy.name+' by '+classy.user+' (rating: '+classy.rating+')</button>
      <button class="btn btn-default dropdown-toggle" data-toggle="dropdown" type="button">
        <span class="caret"></span>
            <span class="sr-only"></span>
      </button>
      <ul class="dropdown-menu" role="menu">
        <li><a href="#" data-toggle="modal" data-target="#'+classy._id+'">View Class</a></li>
            <li><a href="#" id="subscribeButton">Subscribe</a></li>
        </ul>
      <br/>
    </div>

    <div class="modal fade" id="'+classy._id+'" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        </div>
        <div class="modal-body">
          this is class '+classy.name+'
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-success" data-dismiss="modal" id="subscribeButton">Subscribe!</button>
          <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
        </div>
      </div>
    </div>';
        }

        $("#browseClassesDiv").html(newHTML);
     }
    });
  });

  Meteor.subscribe('userData');
  Meteor.subscribe('classes');
  
  Meteor.startup(function () {
    // $("#newClassForm").hide();
    // $("#browseClassesDiv").hide();
    // $("#userProfile").hide();
    $(".modal").hide();
  });

  // Template.menubar.events({
  //   'click #newClass' : function () {
  //     $("#newClassForm").show();
  //     $("#browseClassesDiv").hide();
  //     $("#userProfile").hide();

  //   },
  //   'click #browseClasses' : function () {
  //     $("#newClassForm").hide();
  //     $("#browseClassesDiv").show();
  //     $("#userProfile").hide();

  //   },
  //   'click #meLink' : function () {
  //     $("#userProfile").show();
  //     $("#browseClassesDiv").hide();
  //     $("#newClassForm").hide();
  //   }
  // });

  Template.newClass.events({
    'click #newClass_submit' : function () {
      var name = $("#newClass_name").val();
      var user = Meteor.user().username;
      var keywords = $("#newClass_keywords").val();
      var startDate = $("#newClass_startDate").val();
      var endDate = $("#newClass_endDate").val();
      var freq = $("#newClass_freq").val();

      console.log("called new class submit");

      Meteor.call('addClass', name, user, keywords, startDate, endDate, freq);
      
      //$("#newClass_modal_body").val("Class creation successful!");
    }
  });

  Template.browseClasses.events({
    'click #subscribeButton' : function () {
      Meteor.call("addSubscription", Meteor.user().username);
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

  // Template.classPage.
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });


  Accounts.onCreateUser(function(options, user) {
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