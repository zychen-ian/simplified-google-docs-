//JQuery on load
//JQuery function is executed after DOM is loaded
$(function () {
	ko.observable['fn'].equalityComparer = function(a, b) {
        return a === b;
    };

    var viewModel = new KnockoutDocs();

    // viewModel.selectedItem.subscribe(function(newValue {
    // 	debugger;
    // }));
    //Use ko.applyBindings() for data binding
    ko.applyBindings(viewModel);

    // viewModel.load();
});

