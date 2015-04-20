var ProductList = Backbone.View.extend({
	tagName: 'ol',
	id: 'item-list',
	template: _.template($('#one-item-template').html()),
	events: {
		"click .toggle": "toggleDone",
		"click a.destroy": "clear"
	},

	initialize: function () {
		this.listenTo(this.model, 'all', this.render);
	},

	render: function () {
		if (!this.template) {
			return false;
		}

		var data = null;

		if (this.model) {
			data = this.model.toJSON();
		}
		var html = this.template({model: data});

		this.$el.html(html);

		console.log('List render');
		return this;
	},

	toggleDone: function(e) {
		var idx, modelToToggle;

		idx = $(e.currentTarget).closest('li').index();
		modelToToggle = this.model.at(idx);

		console.log(idx);
		console.log(modelToToggle);

		modelToToggle.toggle();
	},


	clear: function(e) {
		var idx, modelToDestroy;

		idx = $(e.currentTarget).closest('li').index();
		modelToDestroy = this.model.at(idx);

		modelToDestroy.destroy();
	}

});

