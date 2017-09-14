var ItemBase = Base.extend({
	templateName: null,
	constructor: function(title) {
		this.title = ko.observable(title);
	},
	toJSON: function() {
		var cleaned = ko.toJS(this);

		cleaned.type = cleaned.templateName.replace('-template', '');
		// remove key-pair completely
		delete cleaned.templateName;

		return cleaned;
	},
	fromJSON: function(json) {
		this.title(json.title);
	}
});