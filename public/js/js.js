//Слайды
var slideWidth = 1440;
var slideArena = document.querySelector('.header-slide-arena');
var slideArray = {
	'header-slide-content': {
		'left': document.querySelector('.header-slide-btn.left'),
		'right':  document.querySelector('.header-slide-btn.right'),
		'arena': document.querySelector('.header-slide-arena'),
		'width': document.querySelector('.header-slide>ul>li')
	},
	/*'about-us-arena': {
		'left': document.querySelector('.about-us-btn.left'),
		'right': document.querySelector('.about-us-btn.right'),
		'arena': document.querySelector('.about-us-block-list'),
		'width': document.querySelector('.about-us-block-arena')
	}*/
};


slideArray['header-slide-content'].right.addEventListener('click', nextSlide);
slideArray['header-slide-content'].left.addEventListener('click', prevSlide);
/*slideArray['about-us-arena'].right.addEventListener('click', nextSlide);
slideArray['about-us-arena'].left.addEventListener('click', prevSlide);
*/
var functionClick = slideArray['header-slide-content'].right;

function autoClick(){
	var currentSlide = parseInt(slideArray['header-slide-content'].arena.dataset.current);
	var clickEvent = new Event('click');
	if(currentSlide == slideArray['header-slide-content'].arena.children.length - 1){
		functionClick = slideArray['header-slide-content'].left;
	}
	if(currentSlide == 0){
		functionClick = slideArray['header-slide-content'].right;
	}

	functionClick.dispatchEvent(clickEvent);
}

//setInterval(autoClick, 6000);

if(parseInt(slideArray['header-slide-content'].arena.dataset.current) == 0) slideArray['header-slide-content'].left.style.display = 'none';
//if(parseInt(slideArray['about-us-arena'].arena.dataset.current) == 0) slideArray['about-us-arena'].left.style.display = 'none';

function nextSlide(evt){
	var target = evt.target;
	var address = slideArray[target.parentNode.classList.value];
	var currentSlide = parseInt(address.arena.dataset.current);


	currentSlide = currentSlide + 1;

	if(currentSlide >= address.arena.children.length - 1){
		address.right.style.display = 'none';
	}
	address.left.style.display = 'block';
	address.arena.style.left = -currentSlide*address.width.offsetWidth + 'px';

	address.arena.dataset.current = currentSlide;
}

function prevSlide(evt){
	var target = evt.target;
	var address = slideArray[target.parentNode.classList.value];
	var currentSlide = parseInt(address.arena.dataset.current);

	currentSlide = currentSlide - 1;

	if(currentSlide <= 0){
		address.left.style.display = 'none';
	}
	address.right.style.display = 'block';
	address.arena.style.left = -currentSlide*(address.width.offsetWidth - 1) + 'px';

	address.arena.dataset.current = currentSlide;
}


var menuUpBtn = document.querySelector('.menu-up-btn');
var menuUp = document.querySelector('.menu-up-navigation');

var filter = 'all';

var filterConformity = {
	'all-courses': 'all',
	'brows-courses': 'brows',
	'eyelashes-courses': 'lashes',
	'lips-courses': 'lips'
};

var containerCourses = [];
var filteredContainerCourses = [];

var container = document.querySelector('.courses-content-main');

var coursesFilter = document.querySelector('.courses-filter').children;

for (var i = 0; i < coursesFilter.length; i++) {
    coursesFilter[i].addEventListener('click', selectedFilter);
}

function selectedFilter(event){
	var target = event.target;
	if(filterConformity[target.classList[0]] === filter){
		return;
	}
	filter = filterConformity[target.classList[0]];
	
    for (var i = 0; i < coursesFilter.length; i++) {
        coursesFilter[i].classList.remove('courses-active');
    }

	target.classList.add('courses-active');
	container.innerHTML = '';
	setActiveFilter(filter);
}

function addCoursesInForm(e){
	e.preventDefault();
	var target = e.target;

	if(target.getAttribute('data-id')){
		containerCourses.forEach(function(count){
			if(count['id'] == target.getAttribute('data-id')){
				boxServicesArr.push('Курс ' + count['name']);
			}
		});
		//choiceContent.classList.add('modal-content-show');
	}
}

let objCourses = {};

/*Отрисовка в шаблоне*/
function getElementFromTemplate(data){
	var template = document.querySelector('#courses-template');
	var element;

    if('content' in template){
    	element = template.content.children[0].cloneNode(true);
    } else{
    	element = template.children[0].cloneNode(true);
    }

	var backgroundImage = new Image();
	var IMAGE_TIMEOUT = 10000;
	
	var imageLoadTimeout = setTimeout(function(){
		backgroundImage.src = '';
		element.classList.add('course-nophoto');
	}, IMAGE_TIMEOUT);

	// Изображения отличаются от обычных DOM-элементов тем, что
    // у после задания src они загружаются с сервера. Для проверки
    // загрузилось изображение или нет, существует событие load.
	backgroundImage.onload = function(){
		clearTimeout(imageLoadTimeout);
		element.querySelector('.courses-content-img').style.backgroundImage = 'url(\'' + backgroundImage.src + '\')';
	};
	backgroundImage.onerror = function(){
		element.classList.add('course-nophoto');
	};

	backgroundImage.src = data.img;

	element.getElementsByClassName('courses-content-h2')[0].firstElementChild.textContent = data.name;
	element.querySelector('.courses-content-durability').firstElementChild.textContent = data.durability;
	element.querySelector('.courses-content-price').firstElementChild.textContent = data.price;
	element.querySelector('.courses-content-durability').firstElementChild.textContent = data.durability;
	element.getElementsByClassName('courses-content-h2')[1].firstElementChild.textContent = data.name;
	element.querySelector('.courses-content-intended').firstElementChild.textContent = data.intended;
	//element.querySelector('.courses-content-description').firstElementChild.textContent = data.description;
	element.querySelector('.courses-btn-detail').dataset.val = data.id;
	element.querySelector('.courses-content-btn').dataset.id = data.id;
	
	objCourses[data.id] = data.description;

	return element;
}

function setActiveFilter(id){
	
	if (filter != 'all'){
		filteredContainerCourses = [];
		for (var i = 0; i < containerCourses.length; i++){
			if (containerCourses[i].category == filter || containerCourses[i].category == 'all'){
				filteredContainerCourses.push(containerCourses[i]);
			}
		}
	}
	else filteredContainerCourses = containerCourses.slice();
	renderContainer(filteredContainerCourses);
}


/**
   * Отрисовка списка продукции.
   */

function renderContainer(containerToRender){

	var fragment = document.createDocumentFragment();

	containerToRender.forEach(function(cont){
		var element = getElementFromTemplate(cont);
    	fragment.appendChild(element);
	});

	container.appendChild(fragment);
	container.addEventListener('click', addCoursesInForm);
}

/*Загрузка данных*/
function __jsonpFunction(data){
	containerCourses = data;
	setActiveFilter(filter);
}

var scriptEl = document.createElement('script');
scriptEl.src = 'public/js/data.js';
document.body.appendChild(scriptEl);


/*Меню перемещение*/
var menuUpNavigation = document.querySelector('.menu-up-navigation>ul').children;

for(var i = 0; i < menuUpNavigation.length; i++){
	menuUpNavigation[i].addEventListener('click', move);
}

	function move(event){
		event.preventDefault();
		menuUp.classList.remove('menu-show');
		var hash = '.' + event.target.getAttribute('id');
		if(hash == '.gallery') return;
		var V = 0.2;
		var w = window.pageYOffset;  // прокрутка
		var t = document.querySelector(hash).getBoundingClientRect().top;  // отступ от окна браузера до id
		var start = null;
		    if(hash == '.services') t = t - 70;
		    else if(hash == '.reviews') t = t - 120;
		    requestAnimationFrame(step);  // функция анимации
		    function step(time) {
			    if (start === null) start = time;
			    var progress = time - start,
			        r = (t < 0 ? Math.max(w - progress/V, w + t) : Math.min(w + progress/V, w + t));
			    window.scrollTo(0,r);
			    if (r != w + t) {
			        requestAnimationFrame(step)
			    } else {
			        location.hash = hash;  // URL с хэшем
		    	}
		    }
	}



/*Хочу скидку*/

/*
var discountBtn = document.querySelector('.discount-block');
var discountContent = document.querySelector('.modal-content-discount'); //Окно ПопАп Хочу скидку
*/

/*var close = document.getElementsByClassName('modal-content-close');*/

/*var pricelistBtn = document.getElementsByClassName('service-btn'); //Кнопка Узнать цены*/
/*var pricelistContent = document.querySelector('.modal-content-pricelist'); //Окно ПопАп Прайс лист*/
/*var galleryContent = document.querySelector('.modal-content-gallery');*/

var servicesCaption = document.getElementsByClassName('services-block-caption'); //Кнопка заголовок услуги в ПопАп Прайс Лист
var servicesList = document.getElementsByClassName('services-block-list'); //

/*var recordingBtn = document.getElementsByClassName('btn-entry-up'); //Кнопка для появления формы*/
/*var recordingBtnn = document.getElementsByClassName('courses-content-btn');*/
/*var recordingContent = document.querySelector('.modal-content-form'); //Окно Попап Форма записи*/
var choiceContent = document.querySelector('.modal-content-choice');

/*var overlay = document.querySelector('.overlay');*/

var boxArena = document.querySelector('.box-services-arena');

var containerForList = document.querySelector('.services-modal-list');
var servicesListData = [];

function __jsonpFunctionServices(data){
	servicesListData = data;
	renderingServicesHead(servicesListData);
}

var scriptServcses = document.createElement('script');
scriptServcses.src = 'public/js/data-service.js';
document.body.appendChild(scriptServcses);

var template = document.querySelector('#services-template');
var element;

//Объект содержащий ссылки на попап окна, в зависимости от нажатой кнопки
/*var popUpWindowArray = {
	'gallery': galleryContent,
	'service-btn': pricelistContent,
	'discount-block': discountContent,
	'btn-entry-up': recordingContent
}*/
//Объект содержащий ссылки на попап окна, в зависимости от нажатой кнопки Закрыть
/*var popUpWindowClosedArray = {
	'modal-content-pricelist': pricelistContent,
	'modal-content-discount': discountContent,
	'modal-content-form': recordingContent,
	'modal-content-choice': choiceContent
}*/

var servicesBlock = document.querySelector('.services-block');


var boxServicesArr = [];

/*discountBtn.addEventListener('click', popupOpenFunction); //Обработчик кнопки Хочу скидку*/

/*
//Обработчик закрытия на каждую кнопку
for (var i = 0; i < close.length; i++) {
	close[i].addEventListener('click', closeFunction);
}
//Обработчик на кнопки вызова формы для записи
for (var i = 0; i < recordingBtn.length; i++) {
	recordingBtn[i].addEventListener('click', popupOpenFunction);
}
*/

/*
function backgroundBlocker(event){
	if(event == 'open'){
		overlay.style.display = 'block';
		document.body.style.overflow = 'hidden';
	}
	else if(event == 'closed'){
		overlay.style.display = 'none';
		document.body.style.overflow = 'auto';
	}
}
*/
/*
function popupOpenChoice(){
	choiceContent.classList.add('modal-content-show');
	backgroundBlocker('open');
}
*/

function renderingBoxServices(){

	/*Отрисовка массива с выбранными услугами*/
	var num = 0;
	var template = document.querySelector('#box-services-template');
	var includeTextArea = document.querySelector('.form-form input[type=textarea]');
	var boxServicesTemplate;

	if('content' in template){
    	boxServicesTemplate = template.content.children[0].cloneNode(true);
    } else{
    	boxServicesTemplate = template.children[0].cloneNode(true);
    }

    if(includeTextArea.value) includeTextArea.value = '';
	boxArena.textContent = '';


	boxServicesArr.forEach(function(elem){
		boxServicesTemplate.querySelector('.box-services-element p').textContent = elem;
		boxServicesTemplate.querySelector('.box-services-element-close').dataset.num = num;

		num = num +1;
		boxArena.appendChild(boxServicesTemplate.cloneNode(true));
		includeTextArea.value += elem + '; ';
	});
}
/*
function popupOpenFunction(e){
	e.preventDefault();
	var popUpWindow = popUpWindowArray[e.target.classList[0]];
	var modal = document.querySelector('.modal');
	modal.hidden = false;
	popUpWindow.classList.add('modal-content-show');
			//Проверка принадлежит ли нажатая кнопка вызову ПопАп окна с прайс листом
	if(e.target.classList[0] == 'service-btn') serviceChoice(e.target.getAttribute('data-id'));
	if(e.target.classList[0] == 'btn-entry-up') renderingBoxServices();
	backgroundBlocker('open');
}*/
/*
function closeFunction(e){
	e.preventDefault();
	var popUpWindowClosed = popUpWindowClosedArray[e.target.parentElement.classList[0]];
	popUpWindowClosed.classList.remove("modal-content-show");
	if (e.target.parentElement.classList[0] == 'modal-content-choice') return;
	else backgroundBlocker('closed');
}


function closeAllPopUp(){
	for(var key in popUpWindowClosedArray){
		popUpWindowClosedArray[key].classList.remove('modal-content-show');
	}
}
*/


/*Прайс-лист*/

if('content' in template){
    element = template.content.cloneNode(true);
} else{
    element = template.cloneNode(true);
}

var choiceModal = '';

function renderingServicesHead(bd){
	var current = 0;

	bd.forEach(function(count){
		console.log(count);
		var block = element.querySelector('.services-block');
		var blockServices = containerForList.appendChild(block.cloneNode(true));
		var servicesBlockCaption = element.querySelector('.services-block-caption');
		var servicesBlockList = element.querySelector('.services-block-list');
		var servicesBlockSubtitle = element.querySelector('.services-block-subtitle');

		servicesBlockCaption.dataset.current = current;
		servicesBlockCaption.firstElementChild.textContent = count.header;
		blockServices.appendChild(servicesBlockCaption.cloneNode(true));
		current++;

		blockServices.addEventListener('click', decorServices);
		choiceModal = new Modal('services-modal-list', 'services-elem-btn', 'modal-content-choice');

		var list = blockServices.appendChild(servicesBlockList.cloneNode(true));

		if('subtitle' in count){
			count.subtitle.forEach(function(countCount){
				servicesBlockSubtitle.textContent = countCount.sublitename;
				list.appendChild(servicesBlockSubtitle.cloneNode(true));
				countCount.data.forEach(function(countUnderUnder){
					list.appendChild(renderingServicesElement(countUnderUnder));
				});
			});
		}
		else{
			count.data.forEach(function(countUnder){
				list.appendChild(renderingServicesElement(countUnder));
			});
		}

		if ('comment' in count) {
			let comment =  document.createElement('P');

			comment.classList.add('services-block-comment');
			comment.textContent = count.comment;

			list.appendChild(comment);
		}
	});
	for(var i = 0; i < servicesCaption.length; i++){
		servicesCaption[i].addEventListener("click", functionDeployment);
	}
}

function renderingServicesElement(coundUnder){
	var servicesBlockElem = element.querySelector('.services-block-elem').cloneNode(true);

	servicesBlockElem.querySelector('.services-elem-service').firstElementChild.textContent = coundUnder.name;
	servicesBlockElem.querySelector('.services-elem-price').firstElementChild.textContent = coundUnder.price;
	servicesBlockElem.querySelector('.services-elem-btn').dataset.id = coundUnder.id;

	return servicesBlockElem;
}

function functionDeployment(e){

	var target = e.target;
	if(target.tagName == 'P') target = e.target.parentElement;
	if(!target.classList.contains('click')){
		closeDeployment(servicesList);
		closeDeployment(servicesCaption);
		openDeployment(target);
		openDeployment(target.nextElementSibling);
	}
	else {
		closeDeployment(servicesList);
		closeDeployment(servicesCaption);
	}
}

/*for(var i = 0; i < pricelistBtn.length; i++){
    pricelistBtn[i].addEventListener('click', popupOpenFunction);
}*/

function closeDeployment(cl){
	for(var i = 0; i < cl.length; i++){
		cl[i].classList.remove('click');
	}
}

function openDeployment(e){
	e.classList.add('click');
}

function serviceChoice(dataId){
	dataId = Number(dataId[dataId.length - 1] - 1);
	if(!servicesCaption[dataId].classList.contains('click')){
		var clickEvent = new Event('click');
		servicesCaption[dataId].dispatchEvent(clickEvent);
	}
	else return;
}


/*Переход от закупки до формы*/

function decorServices(e){
	var target = e.target;
	if(target.getAttribute('data-id') || target.parentElement.getAttribute('data-id')){
		if(target.parentElement.getAttribute('data-id')) target = target.parentElement;
		//popupOpenChoice();
		var nameService = target.parentElement.querySelector('.services-elem-service p').textContent;
		var headService = target.parentElement.parentElement.parentElement.querySelector('.services-block-caption p').textContent;
		boxServicesArr.push(headService + ' ' + nameService);
	}
}

/*Кнопка Оформить*/

var btnForm = document.querySelector('.btn-form');
btnForm.addEventListener('click', orderProcessing);

function orderProcessing(e){
	e.preventDefault();
	renderingBoxServices();
	choiceModal.close();
	choiceModal.close();
	formBtnModal.open();
	/*closeAllPopUp();

	recordingContent.classList.add('modal-content-show');
	backgroundBlocker('open');

	var eventClick = new Event('click');
	recordingBtn[0].dispatchEvent(eventClick);
	*/
}

document.querySelector('.courses').addEventListener('click', function(e){
	e.preventDefault();
	let target = e.target;
	let attribute = target.dataset.id;
	if(attribute){
		formBtnModal.open();
		renderingBoxServices();	
	}
});
	
document.querySelector('.services').addEventListener('click', function(e){
	e.preventDefault();
	let target = e.target;
	let attribute = target.dataset.id;
	if(attribute) serviceChoice(attribute);
});

/*Кнопка Добавить*/

var btnAdd = document.querySelector('.btn-add-service');
btnAdd.addEventListener('click', addInBox);

function addInBox(e){
	e.preventDefault();
	/*choiceContent.classList.remove('modal-content-show');*/
	choiceModal.close();
}

boxArena.addEventListener('click', deleteServiceInBox);

function deleteServiceInBox(e){
	e.preventDefault();
	var target = e.target;
	if(target.getAttribute('class') == 'box-services-element-close'){
		boxServicesArr.splice(target.getAttribute('data-num'),1);
		renderingBoxServices();
	}
}

menuUpBtn.addEventListener('click', function(e){
	e.preventDefault();
	menuUp.classList.toggle('menu-show');
});



//класс Модальное окно
let windowModal = [];

function Modal(block, btn, modal){
	
	this.block;
	this.btn = btn;
	this.modal = document.querySelector('.' + modal);
	let self = this;

	if(block) {
		let arrBtn = document.querySelector('.' + block);
		arrBtn.onclick = function(e){
			let target = e.target;
			while(target != this){
				if(target.classList.contains(btn)){
					self.open();
					return false;
				}
				target = target.parentElement;
			}
		}
	}
	else {
		let arrBtn = document.querySelectorAll('.' + btn);
		for(let i = 0; i < arrBtn.length; i++){
			arrBtn[i].onclick = function(){
				self.open();
				return false;
			}
		}
	}

	let close = this.modal.querySelector('.modal-close');
	close.onclick = function(){
		self.close();
		return false; 	
	};

	Modal.prototype.open = function(){
		document.querySelector('body').style.cssText = 'overflow: hidden;';
		this.modal.parentElement.hidden = false;
		this.modal.classList.add('modal-content-show');
		windowModal.push(this.modal);
	};

	Modal.prototype.close = function(){
		let len = windowModal.length;
		let a = windowModal[len - 1];
		if(len < 2) document.querySelector('body').style.cssText = '';
		a.classList.remove('modal-content-show');
		a.parentElement.hidden = true;
		windowModal.splice(-1, 1);
	};
};

let disontModal = new Modal(false, 'discount-block', 'modal-content-discount');
let galleryModal = new Modal(false, 'gallery', 'modal-content-gallery');
let priceListModal = new Modal('services', 'service-btn', 'modal-content-pricelist');
let formBtnModal = new Modal(false, 'btn-entry-up', 'modal-content-form');
let formCursesModal = new Modal('courses', 'courses-content-btn', 'modal-content-form');
let detailCurseModal = new Modal('courses', 'courses-btn-detail', 'modal-content-detail');

document.querySelector('.courses').addEventListener('click', function(e){
	e.preventDefault();
	let target = e.target;
	while(target != this){
		if(target.classList.contains('courses-btn-detail')){
			document.querySelector('.detail_text').innerHTML = objCourses[target.dataset.val];
			return;
		}
		target = target.parentElement;
	}

})

window.addEventListener('keydown', function(e){
	if (e.keyCode === 27) {
		while(windowModal.length > 0){
			disontModal.close();
		}
	}
});

__jsonpFunctionGallery({
	1: "1.jpg",
	2: "2.jpg",
	3: "4.jpg",
	4: "5.jpg",
	5: "7.jpg",
	6: "8.jpg",
	7: "9.jpg",
	8: "10.jpg",
	9: "11.jpg",
	10: "12.jpg",
	11: "13.jpg",
	12: "14.jpg",
	13: "15.jpg",
	14: "16.jpg",
	15: "17.jpg",
	16: "19.jpg",
	17: "21.jpg",
	18: "22.jpg",
	19: "23.jpg",
	20: "24.jpg",
	21: "26.jpg",
	22: "27.jpg",
	23: "28.jpg",
	24: "29.jpg",
	25: "30.jpg",
	26: "32.jpg",
	27: "34.jpg",
	28: "35.jpg",
	29: "36.jpg",
	30: "37.jpg",
	31: "38.jpg"
});

function __jsonpFunctionGallery(data){
	galleryList = data;
	renderingGallery(galleryList);
}

let galleryImgActive = null;
let windowGallery = document.querySelector('.modal-gallery-img');

document.querySelector('.gallery-list').addEventListener('click', function(e){
	e.preventDefault();
	let target = e.target;
	while(target != this){
		if(target.dataset.img){
			windowGallery.innerHTML = '';
			let element = document.createElement('img');
			element.src = '../public/img/gallery/max/' + galleryList[target.dataset.img];
			galleryImgActive = +target.dataset.img;
			windowGallery.appendChild(element);
			return;
		}
		target = target.parentElement;
	}
});

/*Убрать выделение кнопки*/
document.querySelector('.btn-gallery.left').onmousedown = function(e){
	return false;
}

document.querySelector('.btn-gallery.right').onmousedown = function(e){
	return false;
}

document.querySelector('.btn-gallery.left').addEventListener('click',function(e){
	e.preventDefault();
	if(!galleryList[galleryImgActive - 1]) return;
	else {
		galleryImgActive = galleryImgActive - 1;
		windowGallery.querySelector('img').src = '../public/img/gallery/max/' + galleryList[galleryImgActive];
	}
});

document.querySelector('.btn-gallery.right').addEventListener('click',function(e){
	e.preventDefault();
	if(!galleryList[galleryImgActive + 1]) return;
	else {
		galleryImgActive = galleryImgActive + 1;
		windowGallery.querySelector('img').src = '../public/img/gallery/max/' + galleryList[galleryImgActive];
	}
});

function renderingGallery(objPicture){
	let fragment = document.createDocumentFragment();
	let containerforGallery = document.querySelector('.gallery-list').firstElementChild;

	for(let cont in objPicture){	//objPicture.forEach(function(cont)
		let element = getElementForGallery(objPicture[cont], cont);
    	fragment.appendChild(element);
    	//arrGallery.push(cont);
	};

	containerforGallery.appendChild(fragment);
	let galSlideModal = new Modal('modal-content-gallery', 'gallery-img', 'modal-gallery-window');
}

/*Отрисовка в шаблоне*/
function getElementForGallery(data, id){
	let imgBlock = document.createElement('img');
	let address = 'public/img/gallery/';
	imgBlock.src = address + 'min/' + data;
	imgBlock.dataset.img = id;

	let a = document.createElement('a');
	a.href = "#0";
	a.classList.add('gallery-img');
	a.appendChild(imgBlock);
	let li = document.createElement('li');
	li.appendChild(a);
	return li;
}

document.querySelector('.btn-inst').addEventListener('click', function(){
	window.open('https://www.instagram.com/dianovapermanent_foto/');
});
