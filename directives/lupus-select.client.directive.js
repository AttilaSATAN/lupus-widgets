'use strict';

angular.module('lupus-widgets').directive('lupusSelect', [
	function() {
		return {
			template: '<div></div>',
			restrict: 'E',
			link: function postLink(scope, element, attrs) {
				// Lupus select directive logic 
				// ...
				
				element.text('this is the lupusSelect directive');
			}
		};
	}
]);