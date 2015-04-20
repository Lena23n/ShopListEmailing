var FormView = Backbone.View.extend({
    id: ("app"),
    template: _.template($('#form-view').html()),
    events: {
        "click #add": "createOnClickAddButton",
        "click #logout": "logout"
    },

    inputs: {
        name: null,
        quantity: null
    },

    items: null,

    view: null,

    initialize: function () {
        this.vent = vent;
    },

    render: function () {
        if (!this.template) {
            return false;
        }
        var html = this.template();

        this.$el.html(html);
        return this;
    },

    createOnClickAddButton: function () {
        this.inputs.name = $("#new-item");
        this.inputs.quantity = $("#count");

        var self = this,
            name = this.inputs.name.val(),
            quantity = this.inputs.quantity.val(),
            currentUser = Parse.User.current(),
            newACL,
            itemName = null,
            itemQuantity = null,
            group = null,
            item;

        if (!name || !quantity) {
            alert('You should fill in all the fields');
            return false;
        }

        currentUser.fetch().then(function(fetchedUser){
            return fetchedUser
        }).then(function (fetchedUser) {
            group = fetchedUser.get('group');

            console.log(group);
            newACL = new Parse.ACL();

            newACL.setPublicReadAccess(true);
            newACL.setPublicWriteAccess(true);

            item = {
                title: name,
                quantity: quantity,
                group: group
            };

            var data = _.extend({
                ACL: newACL
            }, item);

            console.log('save item');
            return self.model.create(data, {
                validate: true,
                error: function (model, error) {
                    self.showError(error)
                }
            });

        }).then(function (item) {
            var users = new Parse.Query(Parse.User);
            users.equalTo('group', group);

            itemName = item.toJSON().title;
            itemQuantity = item.toJSON().quantity;

            console.log(itemName, itemQuantity);

            console.log('clear input');
            self.inputs.name.val('');
            self.inputs.quantity.val('');

            return users.find();
        }).then(function (userArray) {
            console.log(userArray);
            var array = {
                itemName: itemName,
                itemQuantity: itemQuantity,
                users: []
            };

            for(var i = 0; i < userArray.length; i++) {
                var user = userArray[i].toJSON().username,
                    mail = userArray[i].toJSON().email;

                array.users.push(
                    {
                        username: user,
                        email: mail
                    }
                );
            }

            if(array.users.length >= 0) {
                Parse.Cloud.run('sendMail', array, {
                    success: function(result) {
                        console.log(result);
                    },
                    error: function(error) {
                    }
                });
            }
        });
    },


    logout: function () {
        Parse.User.logOut();
        this.showAuthView();
    },
    showAuthView: function () {
        this.vent.trigger('showAuthView');
    }
});