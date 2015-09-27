
Resolutions  = new Mongo.Collection('resolutions');

if (Meteor.isClient) {

  Meteor.subscribe("resolutions");

  Template.body.helpers({
    resolutions:function(){
      if(Session.get('hide-achieved')){
           return Resolutions.find({checked:{$ne: true}});
      }else{
        return Resolutions.find();
      }
    },

    hideAchieved:function(){
      return Session.get('hide-achieved');
    }


  });

  Template.body.events({

    'submit form':function(e){

      //get value
      var title = e.target.titleinput.value;
      //set value to nothing
      e.target.titleinput.value = "";
      e.preventDefault();
      
      if(title.length>0){
        //call addResolutions function with the parameter title
        Meteor.call('addResolution',title);
      }

      //so page doesn't refresh
      return false;

    },

    'change #hide-achieved': function(e){
      Session.set('hide-achieved', event.target.checked);
    }


  });

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

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup



  });

  Meteor.publish("resolutions", function(){
    return Resolutions.find({
      $or:[
        //if private is not set to true
        { private:{ $ne: true } },
        // & owner is not the Meteor User
        { owner: this.userId }
      ]

    });

  });
}

Meteor.methods({
  
  addResolution: function(title){
      //insert resolution into db
      Resolutions.insert({
        title: title,
        createdAt: new Date(),
        checked: false,
        owner: Meteor.userId()
      });
  },

  updateResolution: function(id, checked){
    var res = Resolutions.findOne(id);

    //error if user isn't owner of resolution
    if(res.owner !== Meteor.userId()){
      throw new Meteor.Error('not-authorized');
    }

    //update this resolution
    Resolutions.update(id, {
      //choose what to update
      $set:{
        //set it to the oposite of what it is
        checked: !checked
      }
    });

  },

  deleteResolution: function(id){
    var res = Resolutions.findOne(id);

    //error if user isn't owner of resolution
    if(res.owner !== Meteor.userId()){
      throw new Meteor.Error('not-authorized');
    }

    //remove resolution function is called on
    Resolutions.remove(id);
  },

  setPrivate:function(id, private){

    var res = Resolutions.findOne(id);
    
    if(res.owner !== Meteor.userId()){
      throw new Meteor.Error('not-authorized');
    }
    
    Resolutions.update(id, {
      $set:{private: private}
    });
  
  }
});
