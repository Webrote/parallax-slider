// jQuery(document).ready(function($) {
//     $.smScroll({
//     	step:150,
//     	speed:500,
//     });
// });
;(function ($) {
	'use strict'

	$.smScroll = function (options) {

		var defaults = {
			step: 50,
			speed: 500,
			ease: 'swing',
			target: $('body'),
			container: $(window),
		};

		var sets = $.extend({},defaults,options);

		var container = sets.container,
			viewport = container.height(),
			step = sets.step,
			top = 0,
			whell = false;

		var target = (sets.target.selector == 'body')
			? ((navigator.userAgent.indexOf('AppleWebKit') !== -1) ? $('body') : $('html'))
			: container;
		target.mousewheel(function (event, delta) {
			whell = true;

			if (delta < 0) { //down
				top = ((top + viewport) >= sets.target.outerHeight(true)) ? top : top +=step;
			} else { //up
				top = (top <= 0) ? 0 : top-=step;
			}
			target.stop().animate({scrollTop: top}, sets.speed, sets.ease, function () {
				whell = false;
			});

			return false;
		});

		container
			.on('resize', function (e) {
				viewport = container.height();
			})
			.on('scroll', function (e) {
				if (!whell) {
					top = container.scrollTop();
				}
			})
	};
}(jQuery));