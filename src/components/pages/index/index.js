// Подключение функционала "Чертоги Фрилансера"
import { FLS } from "@js/common/functions.js"

// Функция для получения названия месяца в родительном падеже
function getMonthNameInGenitive(monthIndex) {
	const months = [
		'Январе',
		'Феврале',
		'Марте',
		'Апреле',
		'Мае',
		'Июне',
		'Июле',
		'Августе',
		'Сентябре',
		'Октябре',
		'Ноябре',
		'Декабре'
	];
	return months[monthIndex];
}

// Обновление месяца в бейдже
function updateMonthBadge() {
	const monthBadge = document.querySelector('[data-fls-month-badge]');
	const monthNameElement = document.querySelector('[data-fls-month-name]');
	
	if (monthBadge && monthNameElement) {
		const currentDate = new Date();
		const currentMonth = currentDate.getMonth(); // 0-11
		const monthName = getMonthNameInGenitive(currentMonth);
		monthNameElement.textContent = monthName;
	}
}

// Обработка отправки формы
function initFormHandler() {
	document.addEventListener('formSent', function(e) {
		const form = e.detail.form;
		const formId = form.getAttribute('data-fls-form');
		const formType = form.getAttribute('data-fls-form-type');
		
		// Определяем, какое сообщение показывать
		const isOrderForm = formType === 'order' || formId === 'order';
		
		// Закрываем попап
		if (window.flsPopup && window.flsPopup.isOpen) {
			window.flsPopup.close();
			
			// Показываем сообщение после закрытия попапа с задержкой
			setTimeout(() => {
				if (isOrderForm) {
					showOrderSuccessMessage();
				} else {
					showSuccessMessage();
				}
			}, 600); // Задержка для завершения анимации закрытия
		} else {
			// Если попап уже закрыт, показываем сообщение сразу
			if (isOrderForm) {
				showOrderSuccessMessage();
			} else {
				showSuccessMessage();
			}
		}
	});

	// Сброс валидации при открытии попапа
	document.addEventListener('afterPopupOpen', function(e) {
		if (e.detail && e.detail.popup) {
			const popup = e.detail.popup;
			const popupElement = popup.targetOpen.element;
			
			if (popupElement) {
				const popupId = popupElement.getAttribute('data-fls-popup');
				const form = popupElement.querySelector('[data-fls-form]');
				
				if (form && (popupId === 'form-popup' || popupId === 'order-popup')) {
					// Сбрасываем форму
					form.reset();
					
					// Очищаем все ошибки вручную
					const inputs = form.querySelectorAll('input, textarea, select');
					inputs.forEach(input => {
						// Убираем классы ошибок
						input.classList.remove('--form-error', '--form-success', '--form-focus');
						
						// Убираем классы ошибок у родителя
						if (input.parentElement) {
							input.parentElement.classList.remove('--form-error', '--form-success', '--form-focus');
						}
						
						// Удаляем сообщения об ошибках
						const errorElement = input.parentElement?.querySelector('[data-fls-form-error]');
						if (errorElement) {
							errorElement.remove();
						}
					});
					
					// Обновляем цену для формы заказа
					if (popupId === 'order-popup') {
						const select = form.querySelector('select[name="package"]');
						if (select) {
							updateOrderPrice(select);
						}
					}
				}
			}
		}
	});
}

// Показ сообщения об успешной отправке
function showSuccessMessage() {
	// Создаем элемент сообщения
	const message = document.createElement('div');
	message.className = 'success-message';
	message.textContent = 'Ваша заявка успешно отправлена';
	message.style.cssText = `
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background-color: #e86192;
		color: #fff;
		padding: 30px 60px;
		border-radius: 10px;
		font-size: 20px;
		font-weight: 500;
		z-index: 10000;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
		animation: fadeIn 0.3s ease;
	`;
	
	// Добавляем анимацию
	const style = document.createElement('style');
	style.textContent = `
		@keyframes fadeIn {
			from {
				opacity: 0;
				transform: translate(-50%, -50%) scale(0.9);
			}
			to {
				opacity: 1;
				transform: translate(-50%, -50%) scale(1);
			}
		}
		@keyframes fadeOut {
			from {
				opacity: 1;
				transform: translate(-50%, -50%) scale(1);
			}
			to {
				opacity: 0;
				transform: translate(-50%, -50%) scale(0.9);
			}
		}
	`;
	document.head.appendChild(style);
	
	// Добавляем сообщение на страницу
	document.body.appendChild(message);
	
	// Удаляем сообщение через 4 секунды
	setTimeout(() => {
		message.style.animation = 'fadeOut 0.3s ease';
		setTimeout(() => {
			message.remove();
			style.remove();
		}, 300);
	}, 4000);
}

// Показ сообщения об успешной покупке
function showOrderSuccessMessage() {
	// Удаляем предыдущее сообщение, если есть
	const existingMessage = document.querySelector('.order-success-message');
	if (existingMessage) {
		existingMessage.remove();
	}
	
	// Создаем элемент сообщения
	const message = document.createElement('div');
	message.className = 'order-success-message';
	message.textContent = 'Покупка совершена успешно';
	message.style.cssText = `
		position: fixed !important;
		top: 50% !important;
		left: 50% !important;
		transform: translate(-50%, -50%) !important;
		background-color: #e86192 !important;
		color: #fff !important;
		padding: 30px 60px !important;
		border-radius: 10px !important;
		font-size: 20px !important;
		font-weight: 500 !important;
		z-index: 99999 !important;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3) !important;
		pointer-events: none !important;
		white-space: nowrap !important;
	`;
	
	// Добавляем анимацию (если еще не добавлена)
	if (!document.getElementById('success-message-animations')) {
		const style = document.createElement('style');
		style.id = 'success-message-animations';
		style.textContent = `
			@keyframes fadeIn {
				from {
					opacity: 0;
					transform: translate(-50%, -50%) scale(0.9);
				}
				to {
					opacity: 1;
					transform: translate(-50%, -50%) scale(1);
				}
			}
			@keyframes fadeOut {
				from {
					opacity: 1;
					transform: translate(-50%, -50%) scale(1);
				}
				to {
					opacity: 0;
					transform: translate(-50%, -50%) scale(0.9);
				}
			}
			.order-success-message {
				animation: fadeIn 0.3s ease;
			}
		`;
		document.head.appendChild(style);
	}
	
	// Добавляем сообщение на страницу
	document.body.appendChild(message);
	
	// Удаляем сообщение через 4 секунды
	setTimeout(() => {
		message.style.animation = 'fadeOut 0.3s ease';
		setTimeout(() => {
			message.remove();
		}, 300);
	}, 4000);
}

// Обработка выбора пакета услуг
function initServicePackages() {
	// Обработка клика по кнопке выбора пакета
	document.querySelectorAll('[data-service-package]').forEach(button => {
		button.addEventListener('click', function() {
			const packageValue = this.getAttribute('data-service-package');
			const packagePrice = this.getAttribute('data-service-price');
			
			// Сохраняем выбранный пакет для установки при открытии модального окна
			sessionStorage.setItem('selectedPackage', packageValue);
		});
	});

	// Установка предвыбранного пакета при открытии модального окна
	document.addEventListener('afterPopupOpen', function(e) {
		if (e.detail && e.detail.popup) {
			const popup = e.detail.popup;
			const popupElement = popup.targetOpen.element;
			
			if (popupElement && popupElement.getAttribute('data-fls-popup') === 'order-popup') {
				// Получаем сохраненный пакет
				const selectedPackage = sessionStorage.getItem('selectedPackage');
				
				if (selectedPackage) {
					// Небольшая задержка для инициализации компонента селекта
					setTimeout(() => {
						// Находим оригинальный select (он скрыт внутри компонента)
						const originalSelect = popupElement.querySelector('select[name="package"]');
						if (originalSelect) {
							// Устанавливаем значение
							originalSelect.value = selectedPackage;
							
							// Триггерим событие change для обновления компонента
							const changeEvent = new Event('change', { bubbles: true });
							originalSelect.dispatchEvent(changeEvent);
							
							// Обновляем цену
							updateOrderPrice(originalSelect);
							
							// Очищаем сохраненное значение
							sessionStorage.removeItem('selectedPackage');
						}
					}, 100);
				}
			}
		}
	});

	// Обновление цены при изменении селекта
	// Используем делегирование событий для отслеживания изменений в селекте
	document.addEventListener('change', function(e) {
		if (e.target && e.target.name === 'package' && e.target.hasAttribute('data-fls-select')) {
			updateOrderPrice(e.target);
		}
	});
}

// Обновление цены в модальном окне
function updateOrderPrice(select) {
	const selectedOption = select.options[select.selectedIndex];
	const price = selectedOption.getAttribute('data-price');
	const priceElement = document.getElementById('total-price');
	
	if (priceElement && price) {
		priceElement.textContent = price;
	}
}

// Инициализация при загрузке
if (document.querySelector('[data-fls-month-badge]')) {
	window.addEventListener('load', updateMonthBadge);
}

// Инициализация обработчика формы
window.addEventListener('load', initFormHandler);

// Инициализация пакетов услуг
window.addEventListener('load', initServicePackages);

// Инициализация FAQ аккордеона
function initFAQ() {
	const faqItems = document.querySelectorAll('.faq__item');
	
	faqItems.forEach(item => {
		const question = item.querySelector('.faq__question');
		
		if (question) {
			question.addEventListener('click', function() {
				const isOpen = item.classList.contains('faq__item--open');
				
				// Закрываем все элементы
				faqItems.forEach(faqItem => {
					faqItem.classList.remove('faq__item--open');
				});
				
				// Открываем текущий элемент, если он был закрыт
				if (!isOpen) {
					item.classList.add('faq__item--open');
				}
			});
		}
	});
}

// Инициализация FAQ
window.addEventListener('load', initFAQ);
