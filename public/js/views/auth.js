var AuthView = Backbone.View.extend({
    id: ('auth-wrap'),
    template: _.template($('#auth-view').html()),
    events: {
        "click #auth": "login",
        "click #signUp": "signUp"
    },
    initialize: function () {
        this.vent = vent;
        console.log('Auth is ready');

    },
    render: function () {
        if (!this.template) {
            return false;
        }
        var html = this.template();

        this.$el.html(html);
        return this;
    },
    login: function () {

        var self = this,
            login = this.$el.find('#login').val(),
            pass = this.$el.find('#password').val();

        Parse.User.logIn(login, pass, {
            success: function (user) {
                self.authSuccess();
            },
            error: function (user, error) {
                self.showError(error.message);
            }
        });
    },
    signUp: function () {
        var self = this,
            user = new Parse.User(),
            login = this.$el.find('#newLogin').val(),
            pass = this.$el.find('#newPassword').val(),
            mail = this.$el.find('#mail').val(),
            groupName = this.$el.find('#role').val(),
            isFieldFilled = !login.length || !pass.length || !mail.length || !groupName.length;

        if (isFieldFilled) {
            this.showError('verify your credentials, please');
            return false;
        }

        user.set("username", login);
        user.set("password", pass);
        user.set("email", mail);

        user.signUp(null, {
            success: function (user) {
                var query = new Parse.Query(Group);
                query.equalTo('name', groupName);

                //todo simplify promises
                query.find()
                    .then(function (groups) {

                        if (groups.length > 0) {
                            var currentGroup = groups[0];

                            var relation = currentGroup.relation("Users");
                            relation.add(user);
                            currentGroup.save();

                            console.log(currentGroup, 'add to group');
                            user.set("group", currentGroup);
                            return user.save();
                        } else {
                            var groupList = new Group({name: groupName});
                            groupList.save()
                                .then(function (group) {
                                    console.log(group);
                                    var relation = group.relation("Users");
                                    relation.add(user);
                                    group.save();

                                    user.set('group', group);
                                    return user.save();
                                });
                        }

                    }).then(function () {
                        self.authSuccess();
                    });
            },
            error: function (user, error) {
                self.showError(error.code + " " + error.message);
            }
        });
    },
    showError: function (error) {
        alert(error);
    },
    authSuccess: function () {
        this.$el.find('input').val('');
        this.vent.trigger('loginSuccess');
    }
});


// todo promise practice


var defer = $.Deferred();
defer.then(function () {
    setTimeout(function () {
        console.log(1);
        // continue
    }, 50);

    return 1;
}).then(function (a) {
    console.log(a += 1);
    return a;
}).then(function (b) {
    console.log(b += 1);
});

defer.resolve();