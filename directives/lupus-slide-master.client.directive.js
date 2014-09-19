'use strict';

angular.module('lupus-widgets').
directive('lupusSlideMaster', [
	function() {
		return {
			transclude: true,

			template: '\
		<div class="lupus-slide-master">\
			<div class="lupus-slide-master-main-wrapper">\
				<div lupus-slide-master-slide-wrapper data-ng-repeat="image in images"></div>\
			</div>\
		</div>',
			//restrict: 'E',
			link: function postLink(scope, element, attrs) {
				// Lupus slide master directive logic
				// ...
				scope.images= [{
					src:'modules/core/img/banners/construction-2.jpg'
				},
				{
					src:'modules/core/img/banners/restorasyon.jpg'
				}];
			}
		};
	}
]).
directive('lupusSlideMasterSlideWrapper', [function(){
	// Runs during compile
	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		// scope: {}, // {} = isolate, true = child, false/undefined = no change
		// controller: function($scope, $element, $attrs, $transclude) {},
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		// restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
		template: '\
		<div class="lupus-slide-master-slide-wrapper">\
			<img lupus-slide-master-image>\
		</div>',
		// templateUrl: '',
		replace: true,
		transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		link: function($scope, iElm, iAttrs, controller) {
			
		}
	};
}]).directive('lupusSlideMasterImage', [function(){
	// Runs during compile
	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		// scope: {}, // {} = isolate, true = child, false/undefined = no change
		// controller: function($scope, $element, $attrs, $transclude) {},
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		// restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
		template: '<img data-ng-src="{{image.src}}" alt="" class="img-vertical-responsive ">',
		// templateUrl: '',
		replace: true,
		transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		link: function($scope, iElm, iAttrs, controller) {
			iElm.on('load',function (){
				alert("aşk")
			})
		}
	};
}]);