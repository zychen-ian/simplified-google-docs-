ko.bindingHandlers.slideUpdate = {
	// element: element on the DOM to be applied
	// valueAccessor: a function that returns a value (dynamic to ensure to get the latest value)
	// allBindingsAccessor: give you access to all elements on the DOM
	// viewModel: current view model
	// bindingContext: $data, $index, $parent
	// init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

	// },
	update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
		// You should use ko.utils.unwrapObservable in cases 
		/// where you don't know if you have been given an observable or not.
		var visible = ko.utils.unwrapObservable(valueAccessor()); ///?

		var $element = $(element);
		console.log($element);

		// Replace the element with a clone
		// becuase the original element might be updated and we wanna preserve its state
		var $clone = $element.clone();
		$clone.insertAfter($element);
		$element.hide();

		// Animate hiding the clone
		$clone.slideUp('slow', function() {
			// Remove after it's hidden to prevent memory leaks
			$clone.remove();
		});

		if (visible) {
			$element.slideDown('slow');
		}

	}
};