var Filter = Base.extend({
	constructor: function() {
		this.showDocuments = ko.observable(true);
		this.showSpreadsheets = ko.observable(true);
		this.showSurveys = ko.observable(true);
		this.textFilter = ko.observable();
	},
	itemMatchesFilter: function(item) {
		// ShowDocumentFilter
		if (item instanceof Document && !this.showDocuments()) {
			return false;
		} 
		// ShowSpreadsheetFilter
		if (item instanceof Spreadsheet && !this.showSpreadsheets()) {
			return false;
		}
		// showSurveys
		if (item instanceof Survey && !this.showSurveys()) {
			return false;
		}
		// TextFilter
		var textFilter = this.textFilter();

		if (!textFilter) {
			// no filter specified
			return true;
		}

		return item.matchesTextFilter(textFilter);
	}
});