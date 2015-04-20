var application = {
	views : {},
	models : {},
	constructors : {
		views : {},
		models : {}
	}
};

application.constructors.form = FormView;
application.constructors.auth = AuthView;
application.constructors.productView = ProductList;
application.constructors.list = ItemList;
application.constructors.container = null;

Parse.initialize("YZp2Tqvez72boawZIl1Q6imzyfJvytJuvtmzrvz7", "UvDJCduCQ8b5NSpnBIu5KlypZvTSqgg2Y62QIoJ2");

var vent = _.extend({}, Backbone.Events);

var Container = Backbone.View.extend({
	el : ('#application'),
	vent : null,
	collection: null,
	views : {
		addForm : null,
		list : null,
		auth : null
	},

	initialize : function () {
		var self = this;
		this.vent = vent;

		self.showAuth();

		this.vent.on('loginSuccess', function () {
			self.showList();
		});

		this.vent.on('showAuthView', function () {
			self.showAuth();
		});
	},
	showAuth : function () {
		this.clearContainer();
		var authContainer = this.$el.find('#authContainer');

		this.views.auth = new application.constructors.auth({});

		authContainer.html(this.views.auth.render().el);
	},
	showList : function () {
		this.clearContainer();
		var formContainer = this.$el.find('#formContainer'),
			listContainer;

		this.collection = new application.constructors.list();
		this.views.addForm = new application.constructors.form({model: this.collection});
		this.views.list = new application.constructors.productView({model: this.collection});

		formContainer.append(this.views.addForm.render().el);

		listContainer = this.$el.find('#item-list-block');

		listContainer.append(this.views.list.render().el);
		this.vent.trigger('showList');
	},
	clearContainer : function () {
		var authContainer = this.$el.find('#authContainer');
		var formContainer = this.$el.find('#formContainer');

		authContainer.empty();
		formContainer.empty();
	}
});

window.addEventListener('load', function () {
	var container = new Container();
});
