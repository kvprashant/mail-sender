SSR.compileTemplate('emailTemplate', Assets.getText('i-gctbc-template.html'));

function getEmails() {
  var emails = Emails.find({ EMAIL_TYPE: { $ne: "none" }});
  return emails;
}

function getHtml(name, email, _id) {
  if(name=="")
    name="there";
  //TODO load from settings
  var html = SSR.render('emailTemplate', 
    { name: name, 
      email: email,
      url: "",
      _id: _id
    });
  return html;
}

Meteor.startup(function () {
  //TODO load from settings
  Meteor.Mandrill.config({
    username: "",
    key: ""
  });

  Meteor.methods({
    sendSegmentMail: function(emails, subject) {
      var counter=0;
      var emailList = emails.split('\n');
      _.each(emailList, function(email){
        Meteor.call('sendEmail', email, "", [], subject, getHtml("", email, "default"), getHtml("", email, "default"));
        counter=counter+1;
      });
      console.log(counter + " emails have been sent.");        
    },
    sendSubscribersEmail: function(subject) {
      var counter = 0;
      var emails = getEmails();
      emails.forEach(function(row){
        Meteor.call('sendEmail', row.email_address, "", [], subject, getHtml(row.name, row.email_address, row._id), getHtml(row.name, row.email_address, row._id));
        counter=counter+1;
      });
      console.log(counter + " emails have been sent.");
    },
    sendEmail: function (to, from, cc, subject, text, html) {
      check(to, String);
      check(cc, [String]);
      //TODO load from settings
      var from = ""

      // Let other method calls from the same client start running,
      // without waiting for the email sending to complete.
      this.unblock();

      Email.send({
        to: to,
        from: from,
        cc: cc,
        subject: subject,
        text: text,
        html: html
      });
    }
  });

});