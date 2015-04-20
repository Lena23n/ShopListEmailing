// Model
var Item = Parse.Object.extend ("Item", {
	defaults: {
		title: 'Title...',
		quantity: '',
		done: false,
		group: ''
	},

	toggle: function() {
		this.set({done: !this.get("done")});
		this.save();
	}

});