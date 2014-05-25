classes = new Meteor.Collection("classes");

Meteor.methods({
  addClass: function (name, user, keywords, startDate, endDate, freq) {

    classes.insert({'name':name, 'user':user, 'keywords':keywords, 'startDate':startDate,
        'endDate':endDate, 'freq':freq, 'notes':[], 'ratingTotal': 0, 'numRatings': 0, 'rating': null});
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
    subscriptionList.push(classID);
    Meteor.users.update({'username': name}, {$set: {'sub_classes': subscriptionList}});
  },

  updateRating: function (newRating, classID) {
    var ratingInt = parseInt(newRating);
    var classObj = classes.findOne({_id: classID});
    var ratingTotal = classObj.ratingTotal + ratingInt;
    var numRatings = classObj.numRatings + 1;
    var rating = (ratingTotal + 0.0)/numRatings;
    rating = Math.round(rating*100)/100;
    classes.update({_id: classID}, {$set: {'ratingTotal': ratingTotal, 'numRatings': numRatings, 'rating': rating}});
  },

  addNotes: function (filename, classID) {
    var classObj = classes.findOne({_id: classID});
    var notesList = classObj.notes;
    notesList.push(filename);
    classes.update({_id: classID}, {$set: {'notes': notesList}});
  }
});

if (Meteor.isClient) {
  Accounts.ui.config({
    passwordSignupFields: 'USERNAME_AND_EMAIL'
  });
  Template.hello.events({
    'click input' : function () {    
      for(users in Meteor.users.find())
      {
        for(id in user.sub_classes) 
        {
          if(id.indexof(this._id) >-1)
          {
            Meteor.call('sendEmail',
               this.user.emails.address,
                users.emails.address,
                this.user.name + 'Has just uploaded a new set of notes!'); 
          }
        }
    }
  });

  // Accounts.config({
  //   sendVerificationEmail: 'true'
  // });

  // Meteor.autosubscribe(function() {
  //   classes.find().observe({
  //     added: function(item) {
  //       var newHTML = '';

  //       for (var classy in classes.find())
  //       {
  //         newHTML = newHTML + '<div class="btn-group" id="browseClass_'+classy._id;
  //         newHTML = newHTML +'"><button class="btn btn-default" type="button" data-toggle="modal" data-target="#'+classy._id+'">';
  //         newHTML = newHTML +classy.name+' by '+classy.user+' (rating: '+classy.rating+')</button>';
  //         newHTML = newHTML + '<button class="btn btn-default dropdown-toggle" data-toggle="dropdown" type="button"><span class="caret">';
  //         newHTML = newHTML + '</span><span class="sr-only"></span>';
  //         newHTML = newHTML + '</button><ul class="dropdown-menu" role="menu"><li><a href="#" data-toggle="modal" data-target="#';
  //         newHTML = newHTML +classy._id+'">View Class</a></li>';
  //         newHTML = newHTML + '<li><a href="#" id="subscribeButton">Subscribe</a></li></ul><br/></div>';
  //         newHTML = newHTML + '<div class="modal fade" id="'+classy._id+'" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">';
  //         newHTML = newHTML + '<div class="modal-dialog"><div class="modal-content"><div class="modal-header">';
  //         newHTML = newHTML + '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button></div>';
  //         newHTML = newHTML + '<div class="modal-body">this is class '+classy.name+'</div>';
  //         newHTML = newHTML + '<div class="modal-footer">';
  //         newHTML = newHTML + '<button type="button" class="btn btn-success" data-dismiss="modal" id="subscribeButton">Subscribe!</button>';
  //         newHTML = newHTML + '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button></div></div></div>';
  //       }

  //       $("#browseClassesTemplate").html(newHTML);
  //       $("#browseClassesDiv").html("{{> browseClasses}}");

  //    }
  //   });
  // });

  Meteor.subscribe('userData');
  Meteor.subscribe('classes');
  
  Meteor.startup(function () {
    // $("#newClassForm").hide();
    // $("#browseClassesDiv").hide();
    // $("#userProfile").hide();
    $(".modal").hide();
  });
  //   var newHTML = '';

  //   for (var classy in classes.find())
  //   {
  //     newHTML = newHTML + '<div class="btn-group" id="browseClass_'+classy._id;
  //     newHTML = newHTML +'"><button class="btn btn-default" type="button" data-toggle="modal" data-target="#'+classy._id+'">';
  //     newHTML = newHTML +classy.name+' by '+classy.user+' (rating: '+classy.rating+')</button>';
  //     newHTML = newHTML + '<button class="btn btn-default dropdown-toggle" data-toggle="dropdown" type="button"><span class="caret">';
  //     newHTML = newHTML + '</span><span class="sr-only"></span>';
  //     newHTML = newHTML + '</button><ul class="dropdown-menu" role="menu"><li><a href="#" data-toggle="modal" data-target="#';
  //     newHTML = newHTML +classy._id+'">View Class</a></li>';
  //     newHTML = newHTML + '<li><a href="#" id="subscribeButton">Subscribe</a></li></ul><br/></div>';
  //     newHTML = newHTML + '<div class="modal fade" id="'+classy._id+'" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">';
  //     newHTML = newHTML + '<div class="modal-dialog"><div class="modal-content"><div class="modal-header">';
  //     newHTML = newHTML + '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button></div>';
  //     newHTML = newHTML + '<div class="modal-body">this is class '+classy.name+'</div>';
  //     newHTML = newHTML + '<div class="modal-footer">';
  //     newHTML = newHTML + '<button type="button" class="btn btn-success" data-dismiss="modal" id="subscribeButton">Subscribe!</button>';
  //     newHTML = newHTML + '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button></div></div></div>';
  //   } 

  // $("#browseClassesTemplate").html(newHTML);
  // $("#browseClassesDiv").html("{{> browseClasses}}");
  // });

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

      Meteor.call('addClass', name, user, keywords, startDate, endDate, freq);
      
      //$("#newClass_modal_body").val("Class creation successful!");
    }
  });

  // Template.uploadPdf.events({
  //     'change input': function(ev) {  
  //       _.each(ev.currentTarget.files, function(file) {
  //       Meteor.saveFile(file, file.name);
  //     });
  //   }
  // });

  Template.menubar.events({
    'click #search' : function (event) {
      var query = $("#searchBar").val();
      var classes_found = [];
      var index = 0;
      for (var classy in classes.find())
      {
        if (classy.name.indexOf(query) > -1)
        {
          classes_found[index] = classy._id;
          index++;
        }
      }
    }
  });

  Template.browseClasses.events({
    'click .ratingUpdate': function (event) {
      var classID = $(event.target).attr("data-classID");
      var selectID = "#ratingSelect" + classID;
      var rating = $(selectID).val();
      Meteor.call("updateRating", rating, classID);
    },
    'click .fileUpload': function (event) {
      var classID = $(event.target).attr("data-classID");
      var fileInputID = "#file" + classID;
      var file = $(fileInputID)[0].files[0];
      Meteor.saveFile(file, file.name);
      Meteor.call("addNotes", file.name, classID);
    },
    'click #subscribeButton' : function (event) {
      var classID = $(event.target).attr("data-classID");
      Meteor.call("addSubscription", Meteor.user().username, classID);
    }
  });

  Template.browseClasses.classes = function () {
    return classes.find();
  };

  Template.browseClasses.btnType = function() {
    if (Meteor.user() == null)
    {
      return false;
    }
    var classID = this._id
    var sub_class = classes.findOne({_id: classID});
    if (Meteor.user().sub_classes.indexOf(classID) != -1)
    {
      return "btn-success";
    }
    else if (sub_class.user === Meteor.user().username)
    {
      return "btn-info";
    }
    else
    {
      return "btn-default";
    }
  };

  Template.browseClasses.isSubscriber = function () {
    if (Meteor.user() == null)
    {
      return false;
    }
    var classID = this._id
    var sub_class = classes.findOne({_id: classID});
    return Meteor.user().sub_classes.indexOf(classID) != -1;
  };

  Template.browseClasses.isUploader = function () {
    if (Meteor.user() == null)
    {
      return false;
    }
    var classID = this._id
    var sub_class = classes.findOne({_id: classID});
    return sub_class.user === Meteor.user().username;
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
