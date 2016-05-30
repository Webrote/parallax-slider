# Простенький jQuery слайдер prlxslider.js с параллакс эффектом  при прокрутке страницы.

## Использование.

Подключаем стили:
```
<link rel="stylesheet" href="css/prlxslider.css">
```

Подключаем библиотеки:
```
<script src="https://code.jquery.com/jquery-1.8.3.min.js" integrity="sha256-YcbK69I5IXQftf/mYD8WY0/KmEDCv1asggHpJk1trM8=" crossorigin="anonymous"></script>
<script type="text/javascript" src="js/prlxslider.js"></script>
```


HTML-разметка:
```html
<div id="prlx-slider-1" class="prlx-slider">
	<ul>
		<li data-url="img/1.jpg" class="hide">
			<div class="prlx-slider-caption">
				<div>
					<p>Caption #1</p>
				</div>
			</div>
		</li>
		<li data-url="img/2.jpg" class="hide">
			<div class="prlx-slider-caption">
				<div>
					<p>Caption #1</p>
				</div>
			</div>
		</li>
		<li data-url="img/3.jpg" class="hide">
			<div class="prlx-slider-caption">
				<div>
					<p>Caption #1</p>
				</div>
			</div>
		</li>
	</ul>
</div>
```


И запускаем сам слайдер:
```javascript
<script>
	$(document).ready(function () {
		$('#prlx-slider-1').prlxSlider({
			animationTime: 500, // время анимации, за которое слайды сменяют друг друга (ms); 
			autoplay: true, 	// авто-смена слайдов (true, false);
			autoplayTime: 3000,	// время между автоматической сменой слайдов (ms);
			arrows: true,		// стрелки влево, вправо (true, false);
			arrowsHide:true,	// скрыть стрелки, если курсор не наведен на область слайда (true, false);
			pagination: true,	// пагинация (true, false);
			pauseOnHover: true,	// включить паузу, при наведении курсора на область слайда (true, false);
		});
	});
</script>
```

#### Демо:
```
<a href="http://parallax-slider.webrote.ru/">Demo</a>
http://parallax-slider.webrote.ru/
```