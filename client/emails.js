Template.mailer.helpers({
  email: function () {
    var html = Meteor.call('getHtml');
    return html;
  }
})

Template.mailer.events({
  'click a.seg': function (event) {
    var emails = $('textarea').val();
    var subject = $('input').val();
    Meteor.call('sendSegmentMail', emails, subject);
  },
  'click a.subs': function () {
    var subject = $('input').val();
    Meteor.call('sendSubscribersEmail', subject);
  }
})