/* =======================================
 * Small slider vs parallax effect 'prlxSlider'
 * v.0.1
 * author D.K.
 * ======================================*/
(function ($) {
	$.fn.prlxSlider = function (options) {
		// функция для определения поддержки браузером css-стиля transition
		// Возвращает либо false, если браузер не поддерживает,
		// либо префиксы -webkit, -voz, -o, -ms взависимости от браузера,
		// либо пустую строку, если браузер поддерживает стиль transition
		function getPrefix(el) {
			var prefixes = ["Webkit", "Moz", "O", "ms"];
			for (var i = 0; i < prefixes.length; i++) {
				if (prefixes[i] + "Transition" in el.style) {
					return '-'+prefixes[i].toLowerCase()+'-';
				};
			};
			return "transition" in el.style ? "" : false;
		};
		// Настройки поумолчанию
		var defaults = {
			animationTime: 500, // время анимации, за которое слайды сменяют друг друга (ms); 
			autoplay: true, 	// авто-смена слайдов (true, false);
			autoplayTime: 3000,	// время между автоматической сменой слайдов (ms);
			arrows: true,		// стрелки влево, вправо (true, false);
			arrowsHide:true,	// скрыть стрелки, если курсор не наведен на область слайда (true, false);
			pagination: true,	// пагинация (true, false);
			pauseOnHover: true,	// включить паузу, при наведении курсора на область слайда (true, false);
		};
		var sets = $.extend({},defaults,options);

		var _this = $(this),
			_window = $(window),
			activeSlide,
			newSlide,
			totalSlides,
			storeArray,
			play,
			isAnimation = false,
			prefix = getPrefix(_this[0]);

		var imagesWrapper,
			imageHolder,
			captionWrapper,
			captionHolder,
			captionHolderContainer,
			arrows,
			pagers,
			pager;

		return this.each(function () {
			var slider = {
				init: function () {
					storeArray = [];
					// сохраняем url картинок и содержимое заголовков (captions) в масиве
					$('ul li', _this).each(function () {
						storeArray.push([$(this).data('url'), $(this).html()]);
					});

					// чистим содержимое контейнера (ul>li)
					_this.html('');

					totalSlides = storeArray.length;

					// вставляем контейнеры для картинок
					_this.append("<div id='prlx-images-wrapper'>");
					imagesWrapper = $('#prlx-images-wrapper');
					for (var i = 0; i < totalSlides; i++) {
						imagesWrapper.append("<div class='prlx-image-holder'><img src='' alt=''></div>")
					}
					imageHolder = $('> .prlx-image-holder', imagesWrapper);

					// вставляем контейнеры для заголовков
					_this.append("<div id='prlx-captions-wrapper'><div class='container'></div></div>");
					captionWrapper = $('#prlx-captions-wrapper');
					captionHolderContainer = $('> .container', captionWrapper);
					for (var i = 0; i < totalSlides; i++) {
						captionHolderContainer.append("<div class='prlx-caption-holder'></div>");
					}
					captionHolder = $('> .prlx-caption-holder', captionHolderContainer);

					// подготовка слайдера к работе: вставляем в теги "img" в аттрибут "src" адрес картинки,
					// с дальнейшей подгонкой размеров картинок под размер контейнера (slideResize);
					// вставляем тексты заголовков в контейнеры для заголовков (captions);
					slider.prepare();

					// добавляем стрелки, если нужно
					if (sets.arrows) {
						slider.arrows.create()
					}

					// добавляем пагинацию, если нужно
					if (sets.pagination) {
						slider.pagination.create()
					}

					// включаем автоплэй, если нужно
					if (sets.autoplay) {
						slider.autoplay()
					}

					// запускаем триггеры
					slider.triggers()
				},
				prepare: function () {
					$('> img', imageHolder).each(function (index,el) {
						$(el).attr('src', storeArray[index][0]);
						$(el).on('load', function () {
							$(this).off('load');
							slider.slide.slideResize($(this), imagesWrapper);
						})
					});
					captionHolder.each(function (i) {
						$(this).html(storeArray[i][1]);
					});

					activeSlide = 0;
					// плавное появление первого слайда
					if (!prefix) {
						imageHolder.eq(activeSlide).css('z-index', 3).animate({'opacity': 1}, sets.animationTime);
						captionHolder.eq(activeSlide).css('z-index', 3).animate({'opacity': 1}, sets.animationTime);	
					} else {
						slider.setCssTransition(activeSlide, sets.animationTime);

						setTimeout(function () {
							imageHolder.eq(activeSlide).css('z-index', 3).addClass('animation');
							captionHolder.eq(activeSlide).css('z-index', 3).addClass('animation');
						},10);
					}
				},
				cleanUp: function () {
					imageHolder.eq(activeSlide).removeAttr('style');
					captionHolder.eq(activeSlide).removeAttr('style');
					activeSlide = newSlide;
					isAnimation = false;
				},
				slide: {
					slideResize: function (obj, container) {
						var imgHeight,
							imgWidth,
							imgRatio,
							newImgHeight,
							newImgWidth,
							newImgTop=0,
							newImgLeft=0,
							containerHeight,
							containerWidth,
							containerRatio;

						imgHeight = obj.height();
						imgWidth = obj.width();
						imgRatio = imgHeight / imgWidth;
						containerHeight = container.height();
						containerWidth = container.width();
						containerRatio = containerHeight / containerWidth;

						if (containerRatio > imgRatio) {
							newImgHeight = containerHeight;
							newImgWidth = Math.round(imgWidth*containerHeight/imgHeight)
							newImgTop = 0;
							newImgLeft = -(newImgWidth - containerWidth)*0.5;

						} else {
							newImgWidth = containerWidth;
							newImgHeight = Math.round(imgHeight*containerWidth/imgWidth)
							newImgTop = -(newImgHeight - containerHeight)*0.5;
							newImgLeft = 0;
						}

						obj.css({
							'height': newImgHeight,
							'width': newImgWidth,
							'top': newImgTop,
							'left': newImgLeft
						});
					},
					slideScroll: function () {
						var _thisOffsetTop = _this.offset().top,	// величина смещения контейнера слайдера сверху от начала страницы
							_thisHeight = _this.height(),			// высота контейнера слайдера
							_windowHeight = _window.height(),		// высота окна
							_windowScrollTop = _window.scrollTop();	// величина прокрутки окна

						var higher = _thisOffsetTop < _windowHeight + _windowScrollTop, // true, если верхняя граница контейнера слайдера выше нижней границы экрана;
							lower = _windowScrollTop < _thisOffsetTop + _thisHeight;	// true, если нижняя граница конт-ра слайдера ниже верхней границы экрана;

						if (higher && lower) {
							var x = _windowScrollTop;
							imagesWrapper.css('top', parseInt(x / 2) + 'px');
							captionWrapper.css('top', parseInt(x / 2 / 1.75) + 'px');	
						}
						
					},
					prev: function () {
						newSlide = (activeSlide == 0) ? totalSlides-1 : activeSlide - 1;
						slider.animation();
					},
					next: function () {
						newSlide = (activeSlide == totalSlides-1) ? 0 : activeSlide + 1;
						slider.animation();
					}
				},
				zindex: function () {
					imageHolder.eq(activeSlide).css('z-index', 2);
					imageHolder.eq(newSlide).css('z-index', 3);

					captionHolder.eq(activeSlide).css('z-index', 2);
					captionHolder.eq(newSlide).css('z-index', 3);
				},
				setCssTransition: function (slide, duration) {
					// применяем CSS свойства элементам, которые должны анимироваться
					var style = {};
					style[prefix+'transition'] = 'opacity ' + duration + 'ms ease';
					imageHolder.eq(slide).css(style);
					captionHolder.eq(slide).css(style);
				},
				animation: function () {
					if (isAnimation) return false; // если идет процесс анимации не реагируем на нажатие элементов упраления (стрелок и пагинацию);
					isAnimation = true;

					slider.zindex();
					if (!prefix) { // если нет пооддержки css transition, используем метод jQuery .animation();
						imageHolder.eq(activeSlide).animate({'opacity': 0}, sets.animationTime);
						imageHolder.eq(newSlide).animate({'opacity': 1}, sets.animationTime);
						captionHolder.eq(activeSlide).animate({'opacity': 0}, sets.animationTime);
						captionHolder.eq(newSlide).animate({'opacity': 1}, sets.animationTime, slider.cleanUp);
					} else { // иначе используем css transition;
						imageHolder.eq(activeSlide).removeClass('animation');
						captionHolder.eq(activeSlide).removeClass('animation');
						slider.setCssTransition(newSlide, sets.animationTime);
						imageHolder.eq(newSlide).addClass('animation');
						captionHolder.eq(newSlide).addClass('animation');
						
						// по окончании анимации удаляем стили у пред-его слайда, меняем номер слайда.
						var animTimer = setTimeout(function () {
							slider.cleanUp();
						},sets.animationTime);
					};
				},
				pause: function () {
					clearInterval(play)
				},
				autoplay: function () {
					play = setInterval(function () {
						slider.slide.next();
						if (sets.pagination) {
							slider.pagination.update();
						}
					}, sets.autoplayTime);
				},
				arrows: {
					create: function () {
						_this.append($("<div />").addClass('slider-arrows'));
						arrows = $('> .slider-arrows', _this);
						arrows.append($("<div />").addClass("prev").attr("data-target","prev").text(String.fromCharCode(8249)));
						arrows.append($("<div />").addClass("next").attr("data-target","next").text(String.fromCharCode(8250)));
					},
					trigger: function () {
						arrows.children().click(function () {
							var target = $(this).attr('data-target');
							switch (target) {
								case "prev":
									slider.slide.prev()
								break;
								case "next":
									slider.slide.next()
								break;
							}
							if (sets.pagination) {
								slider.pagination.update();
							}
						});
						if (sets.arrowsHide) {
							arrows.hide();
							_this.hover(function () {
								arrows.show()
							},
							function () {
								arrows.hide()
							})
						}
					}
				},
				pagination: {
					create: function () {
						_this.append($("<ul />").addClass('slider-pagers'));
						pagers = $('> .slider-pagers', _this);
						for (var i = 0; i < totalSlides; i++) {
							pagers.append($("<li />").attr("data-target", i).text(i));
						};
						pager = $('> li', pagers);
						$('> li:first', pagers).addClass('active');
					},
					trigger: function () {
						pager.click(function () {
							if (!isAnimation) {
								newSlide = Number($(this).attr('data-target'));
								if (newSlide == activeSlide) {
									return false;
								}
								slider.pagination.update();
								slider.animation();
							}
						});
					},
					update: function () {
						pagers.children().removeClass('active').eq(newSlide).addClass('active');
					}
				},
				triggers: function () {
					if (sets.arrows) {
						slider.arrows.trigger();
					}
					if (sets.pagination) {
						slider.pagination.trigger();
					}
					if (sets.pauseOnHover) {
						_this.hover(function () {
							slider.pause()
						},
						function () {
							if (sets.autoplay) {
								slider.autoplay()
							}
						})
					};
					$(window).on("resize", function () {
						$('> img', imageHolder).each(function (i,e) {
							slider.slide.slideResize($(e), imagesWrapper);
						})
					});
					$(window).on("scroll", function () {
						slider.slide.slideScroll();
					}).trigger("scroll");
				}
			};
			slider.init();			
		})
	}
}(jQuery));