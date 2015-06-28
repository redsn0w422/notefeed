classes = new Meteor.Collection("classes");

Meteor.methods({
  addClass: function (name, user, keywords, startDate, endDate, freq) {

    classes.insert({'name':name, 'user':user, 'keywords':keywords, 'startDate':startDate,
        'endDate':endDate, 'freq':freq, 'notes':[], 'ratingTotal': 0, 'numRatings': 0, 'rating': null});
  },

  addSubscription: function (name, classID) {
    var user = Meteor.users.findOne({'username': name});
    var subscriptionList = user.sub_classes;
    subscriptionList.push(classID);
    var userRatings = user.ratings;
    userRatings.push(0);
    Meteor.users.update({'username': name}, {$set: {'sub_classes': subscriptionList, 'ratings': userRatings}});
  },

  updateRating: function (newRateString, classID, classIDIndex) {
    var userRatings = Meteor.user().ratings;
    var oldRating = parseInt(userRatings[classIDIndex]);
    var firstRating = (oldRating === 0);
    var newRating = parseInt(newRateString);
    userRatings[classIDIndex] = newRating;
    var classObj = classes.findOne({_id: classID});

    var ratingTotal = classObj.ratingTotal - oldRating + newRating;
    var numRatings = classObj.numRatings;
    if (firstRating) {
      numRatings = numRatings + 1;
    }
    var rating = (ratingTotal + 0.0)/numRatings;
    rating = Math.round(rating*100)/100;
    Meteor.users.update({_id: Meteor.user()._id}, {$set: {'ratings': userRatings}});
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

  Meteor.subscribe('userData');
  Meteor.subscribe('classes');
  
  Meteor.startup(function () {
    $(".modal").hide();
    Session.set("filterVal", "1");
  });


  Template.menubar.events({
    'click #searchFilter': function () {
      Session.set("filterVal", $("#searchFilter").val());
    }
  });

  Template.newClass.events({
    'click #newClass_submit' : function () {
      var name = $("#newClass_name").val();
      var user = Meteor.user().username;
      var keywords = $("#newClass_keywords").val();
      var startDate = $("#newClass_startDate").val();
      var endDate = $("#newClass_endDate").val();
      var freq = $("#newClass_freq").val();

      Meteor.call('addClass', name, user, keywords, startDate, endDate, freq);
    }
  });

  Template.menubar.events({
    'click #search' : function (event) {
      Session.set("filterVal", parseInt(Session.get("filterVal")) + 4);
    }
  });

  Template.browseClasses.events({
    'click .ratingUpdate': function (event) {
      var classID = $(event.target).attr("data-classID");
      var classIDIndex = Meteor.user().sub_classes.indexOf(classID);
      var selectID = "#ratingSelect" + classID;
      var rating = $(selectID).val();
      Meteor.call("updateRating", rating, classID, classIDIndex);
    },
    'click .fileUpload': function (event) {
      var classID = $(event.target).attr("data-classID");
      var classOwnerName = classes.findOne({"_id":classID}).user;
      var classOwnerEmail = Meteor.users.findOne({"username":classOwnerName}).emails[0].address;
      var fileInputID = "#file" + classID;
      var file = $(fileInputID)[0].files[0];
      Meteor.saveFile(file, file.name);
      Meteor.call("addNotes", file.name, classID);

      var cursor = Meteor.users.find();
      cursor.forEach(function(user) 
      {
        for(var i=0; i<user.sub_classes.length; i++) 
        {
          var id = user.sub_classes[i];

          if(id === classID)
          {
              Meteor.call('sendEmail',
                user.emails[0].address,
                classOwnerEmail,
                classOwnerName + ' update!',
                classOwnerName + ' has just uploaded a new set of notes!');
          }
        }
      });
    },
    'click #subscribeButton' : function (event) {
      var classID = $(event.target).attr("data-classID");
      Meteor.call("addSubscription", Meteor.user().username, classID);
    }
  });

    Template.browseClasses.rating = function () {
      if (this.rating == null)
      {
        return "none yet";
      }
      else
      {
        return this.rating;
      }

    };

    Template.browseClasses.classes = function () {
    console.log("classes updated");
    if (Meteor.user() == null)
    {
      return classes.find();
    }

    var filterVal = Session.get("filterVal");
    filterVal = parseInt(filterVal);
    console.log(filterVal);
    switch(filterVal) {
      case 1: // all
      console.log(classes.find());
        return classes.find();
        break;
      case 2: // uploading to
      console.log(classes.find({'user': Meteor.user().username}));
        return classes.find({'user': Meteor.user().username});
        break;
      case 3: //subscribing to
        var idList = Meteor.user().sub_classes;
        return classes.find({_id: {$in: idList}});
        break;
      default:
        var query = $("#searchBar").val();
        query = query.toLowerCase();
        var classes_found = [];
        var index = 0;
        var cursor = classes.find();
        cursor.forEach(function (doc) {
          console.log(doc);
          console.log(doc.name);
          if (doc.name.toLowerCase().indexOf(query) > -1)
          {
            console.log("yay");
            classes_found.push( doc._id);
            index++;
          }
        });

        return classes.find({_id: {$in: classes_found}});
        break;
      }
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
  Meteor.methods({
    sendEmail: function (to, from, subject, text) {
      check([to, from, subject, text], [String]);
      this.unblock();
      Email.send({
      to: to,
      from: from,
      subject: subject,
      text: text
      });
    }
  });
  
  Meteor.startup(function () {    
    process.env.MAIL_URL = 'smtp://ymostofi:CodeDay2014@smtp.sendgrid.com:587/';          
  });


  Accounts.onCreateUser(function(options, user) {
    user.sub_classes = [];
    user.ratings = [];
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
