if (Meteor.isClient) {
  Template.example.events({
      'change input': function(ev) {  
        _.each(ev.currentTarget.files, function(file) {
        Meteor.saveFile(file, file.name);
      });
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
