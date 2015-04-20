//Collection
var ItemList = Parse.Collection.extend({
	model: Item,
	query : new Parse.Query(Item),
	initialize : function () {
		var self = this;
		this.vent = vent;
		this.vent.on('showList', function () {
			self.fetchItem();
		})
	},
	fetchItem : function () {
		var currentUser = Parse.User.current(),
			self = this,
			result;

		currentUser.fetch().then(function(fetchedUser){
			return fetchedUser
		}).then(function (fetchedUser) {
			result = fetchedUser.get('group');
			self.query.equalTo('group', result);

			self.fetch();

		});
	}
});