
if (Meteor.isClient) {

  Meteor.subscribe("resolutions");

  Template.resolution.helpers({

    isOwner:function(){
      return this.owner === Meteor.userId();
    }

  });

  Template.resolution.events({

    'click .toggle-checked':function(e){
        Meteor.call('updateResolution', this._id, this.checked);
    },

    'click .delete': function(e){
      //update this resolution
        Meteor.call("deleteResolution", this._id);

    },

    'click .toggle-private': function(e){
      //set whether resolution is private
        Meteor.call("setPrivate", this._id, !this.private);

    }
  });

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });

}