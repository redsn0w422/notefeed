if (Meteor.isClient) {
  Template.hello.greeting = function () {
    return "Welcome to testmail.";
  };
  Template.hello.events({
    'click input' : function () {    
      Meteor.call('sendEmail',
            'yasha.mostofi@gmail.com',
            'nallink01@gmail.com',
            'Hello from Meteor!',
            'This is a test of Email.send.');           
    }
  });
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
}