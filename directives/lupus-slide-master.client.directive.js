'use strict';
angular.module('lupus-widgets')
    .
directive('lupusSlideMaster', ['$q', '$interval', '$timeout', '$window',
    function ($q, $interval, $timeout, $window) {
        return {
            transclude: true,
            replace: true,
            template: '<div class="lupus-slide-master">\
			<div class="lupus-slide-master-main-wrapper" data-ng-class="{\'loading\':loading, \'slideChange\': slideChange}" data-ng-style="{\'width\':totalWidth + \'px\',\'transform\':\'translate3d(-\' + currentTranslate + \'px, 0, 0)\'}">\
				<div lupus-slide-master-slide-wrapper data-ng-repeat="image in images" data-ng-if="!image.error"></div>\
			</div>\
		</div>',
            //restrict: 'E',
            link: function postLink($scope, element, attrs) {
                var slider = null,
                    waitForResize,
                    eachOneCallback = function (resolve) {
                        resolve.image.width = resolve.imgElm[0].getBoundingClientRect().width;

                    },
                    eachOneErrCallback = function (resolve) {
                        $scope.images.slice(resolve.index, 1);
                    },
                    setFrameWidth = function () {
                        $scope.frameWidth = element[0].getBoundingClientRect()
                            .width;
                    },
                    slowSlide = function () {

                        $scope.currentTranslate = $scope.images[$scope.currentSlide]
                            .slideSlowTranslate;

                    },
                    nextSlide = function () {
                        $scope.currentSlide = ($scope.currentSlide + 1) %
                            $scope.images.length;
                        $scope.slideChange = true;
                        $timeout(function () {
                            $scope.currentTranslate = $scope.images[$scope.currentSlide]
                                .mainWrapperTranslateStart;
                            $timeout(function () {
                                $scope.slideChange = false;
                                $timeout(function () {
                                    slowSlide();
                                }, 1100);
                            }, 1000);
                        }, 1000);
                    },
                    initSlider = function () {
                        if (slider)
                            $interval.cancel(slider);

                        $scope.currentTranslate = 0;
                        $scope.currentSlide = 0;
                        var prevTranslate = 0;

                        setFrameWidth();
                        angular.forEach($scope.images, function (image) {

                            if (!image.error) {
                                $scope.totalWidth = $scope.totalWidth +
                                    image.width;
                                image.mainWrapperTranslateStart =
                                    prevTranslate;
                                image.slideSlowTranslate = prevTranslate +
                                    image.width - $scope.frameWidth;
                                prevTranslate = prevTranslate + image.width;
                            }
                        });
                        $scope.loading = false;
                        slowSlide();
                        slider = $interval(function () {
                            nextSlide();
                        }, 9000);
                    };
                $scope.stop = function () {
                    $interval.cancel(slider);
                    $scope.currentTranslate = 0;
                    $scope.currentSlide = 0;
                };
                $scope.loadPromises = [];
                $scope.loading = true;
                $scope.totalWidth = 0;
                angular.forEach($scope.images, function (image) {
                    image.defered = $q.defer();
                    $scope.loadPromises.push(image.defered.promise.then(
                        eachOneCallback).catch(eachOneErrCallback));
                });
                $q.all($scope.loadPromises).finally(function () {
                    initSlider();
                });

                $window.addEventListener('resize', function () {
                    
                    if (waitForResize)
                        $timeout.cancel(waitForResize);
                    waitForResize = $timeout(function () {
                        $scope.stop();
                        initSlider();
                        
                    }, 3000);
                });
            }
        };
    }
]).directive('lupusSlideMasterSlideWrapper', [

    function () {
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
		<div class="lupus-slide-master-slide-wrapper" >\
			<img lupus-slide-master-image >\
		</div>',
            // templateUrl: '',
            replace: true,
            transclude: true,
            // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
            link: function ($scope, iElm, iAttrs, controller) {
                //console.log($scope);
            }
        };
    }
]).directive('lupusSlideMasterImage', [

        function () {
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
            link: function ($scope, iElm, iAttrs, controller) {
                iElm.on('load', function () {
                    $scope.image.loaded = true;
                    $scope.$parent.$digest();
                    console.log('LOADED', $scope.image);

                    $scope.image.defered.resolve({
                        imgElm: iElm,
                        image: $scope.image
                    });
                })
                    .on('error', function () {
                        $scope.image.error = true;
                        $scope.image.defered.reject({
                            imgElm: iElm,
                            index: $scope.$index
                        });
                        console.warn('Image could not found.',
                            $scope.image);
                    });
            }
        };
        }
    ]);