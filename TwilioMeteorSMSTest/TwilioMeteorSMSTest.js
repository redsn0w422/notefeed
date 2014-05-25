if (Meteor.isClient) {
  Template.hello.greeting = function () {
    return "Welcome to TwilioMeteorSMSTest.";
  };

  Template.hello.events({
    'click input': function () {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        console.log("You pressed the button");
    }
  });
}

if (Meteor.isServer) {
  Meteor.methods(function () {
    var twilio = Twilio('ACee327ef099cd64a7a2bbe1d3de1c7693', '9d28c4c4f87c1cb08204de6102ca191b');
    twilio.sendSms({
      to: '+16308544699',
      from: '+13312156675',
      body: 'Twilio/Meteor Test Message'
    }, function (err, responseData) {
      if (!err) {
        console.log(responseData.from);
        console.log(responseData.body);
      }
    }
    )
    // code to run on server at startup
  });
}
