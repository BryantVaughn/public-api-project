// Global variables
const employeesUrl = 'https://randomuser.me/api/?results=12&nat=us';
const galleryDiv = document.getElementById('gallery');
const searchContainer = document.querySelector('.search-container');
const randomEmployees = [];

// Fetch functions

/**
 * Makes a request to the passed url and parses the json response.
 * @param  {string} url - URL string of API endpoint.
 * @return {object} Returns JSON object of API response.
 */
async function fetchData(url) {
	try {
		const res = await fetch(url);
		return await res.json();
	} catch (err) {
		throw err;
	}
}

/**
 * Uses fetchData function to make API call then extracts the array of
 * employees received from the Random User API to build the employee cards.
 * @param {string} url - URL string of API endpoint.
 */
async function getRandomEmployees(url) {
	const data = await fetchData(url);
	const employees = data.results;
	generateEmployeeCards(employees);
}

// Generate HTML pieces

/**
 * Creates a card for each employee and appends it to the gallery.
 * @param {Array} employees - An array of employee objects retrieved from API.
 */
function generateEmployeeCards(employees) {
	employees.forEach((employee, idx) => {
		employee.shown = true;
		randomEmployees.push(employee);
		const card = createElement('div', 'card');
		card.id = idx;
		generateMainData(card, employee);
		appendItems(galleryDiv, [card]);
	});
}

/**
 * Builds the data pieces of each employee card such as name, email,
 * location and image.
 * @param {DOMElement} parentElement - Parent element that data is associated with.
 * @param {object}     employee - Employee object containing necessary data.
 */
function generateMainData(parentElement, employee) {
	// Create elements that make up each employee card
	const { picture, name, email, location } = employee;
	const fullName = `${name.first} ${name.last}`;
	// Create elements for card image
	const cardImgDiv = createElement('div', 'card-img-container');
	const img = generateProfileImg(picture.medium, false);
	appendItems(cardImgDiv, [img]);

	// Create elements for card text info
	const cardInfoDiv = createElement('div', 'card-info-container');
	const employeeName = createElement('h3', 'card-name cap', fullName);
	employeeName.id = 'name';
	const employeeEmail = createElement('p', 'card-text', email);
	const employeeLocation = createElement('p', 'card-text cap', location.city);
	const employeeData = [employeeName, employeeEmail, employeeLocation];
	appendItems(cardInfoDiv, employeeData);

	// Append image and data to card
	const cardElements = [cardImgDiv, cardInfoDiv];
	appendItems(parentElement, cardElements);
}

/**
 * Generates necessary elements with employee data to display in modal.
 * @param  {DOMElement} parentNode - Container that modal data will attach to.
 * @param  {object} 		employee - Employee object containing necessary data.
 * @return {DOMElement} infoContainer - Returns data container for modal.
 */
function generateModalData(parentNode, employee) {
	const { name, picture, email, location, cell, dob } = employee;
	const fullName = `${name.first} ${name.last}`;

	// Create modal info container and components
	const infoContainer = createElement('div', 'modal-info-container');
	const employeeImg = generateProfileImg(picture.large, true);
	const employeeName = createElement('h3', 'modal-name cap', fullName);
	employeeName.id = 'name';
	const employeeEmail = createElement('p', 'modal-text', email);
	const employeeCity = createElement('p', 'modal-text cap', location.city);
	const hr = createElement('hr');
	const employeeCell = createElement(
		'p',
		'modal-text',
		formatPhoneNumber(cell)
	);
	const employeeAddress = createElement(
		'p',
		'modal-text',
		streetAddressBuilder(location)
	);
	const employeeDOB = createElement(
		'p',
		'modal-text',
		`Birthday: ${formatDate(dob.date)}`
	);

	// Append components to container
	const modalComponents = [
		employeeImg,
		employeeName,
		employeeEmail,
		employeeCity,
		hr,
		employeeCell,
		employeeAddress,
		employeeDOB
	];
	appendItems(infoContainer, modalComponents);
	appendItems(parentNode, [infoContainer]);
}

/**
 * Creates and appends the components of the modal scroll div to DOM.
 * @return {DOMElement} scrollContainer - Returns container for modal scroll btns.
 */
function generateModalScroll() {
	const scrollContainer = createElement('div', 'modal-btn-container');

	const prevBtn = createElement('button', 'modal-prev btn', 'Prev');
	prevBtn.id = 'modal-prev';
	prevBtn.type = 'button';

	const nextBtn = createElement('button', 'modal-next btn', 'Next');
	nextBtn.id = 'modal-next';
	nextBtn.type = 'button';

	appendItems(scrollContainer, [prevBtn, nextBtn]);
	return scrollContainer;
}

/**
 * Generates main modal and container when employee card is clicked.
 * @param {object} employee - Employee object from clicked card.
 */
function generateOverlay(employee) {
	// Create modal container and model elements
	const modalContainer = createElement('div', 'modal-container');
	const modal = createElement('div', 'modal');

	// Create modal components
	const closeBtn = createElement('button', 'modal-close-btn');
	const closeText = createElement('strong', 'btn-text', 'X');
	closeBtn.type = 'button';
	closeBtn.id = 'modal-close-btn';
	appendItems(closeBtn, [closeText]);
	generateModalData(modal, employee);
	const modalScroll = generateModalScroll();

	// Append modal components and modal to container
	appendItems(modal, [closeBtn]);
	appendItems(modalContainer, [modal, modalScroll]);

	// Append modal container to DOM
	addModalListener(modalContainer);
	galleryDiv.insertAdjacentElement('afterend', modalContainer);
}

/**
 * Builds the search field to allow for employee queries.
 */
function generateSearchField() {
	// Create components of search
	const form = createElement('form');
	form.action = '#';
	form.method = 'get';

	const search = createElement('input', 'search-input');
	search.type = 'search';
	search.id = 'search-input';
	search.placeholder = 'Search...';

	const submit = createElement('input', 'search-submit');
	submit.type = 'submit';
	submit.value = '\ud83d\udd0d';
	submit.id = 'search-submit';

	// Append inputs and form to DOM
	const inputs = [search, submit];
	appendItems(form, inputs);
	appendItems(searchContainer, [form]);

	addSearchInputListener(form);
}

// Event callbacks

/**
 * Handles user click on employee card.
 * @param {object} evt - Click event object.
 */
function handleUserClick(evt) {
	let currNode = evt.target;
	// Set currNode as the card div if card was clicked
	while (currNode.className !== 'gallery' && currNode.className !== 'card') {
		currNode = currNode.parentNode;
	}
	generateOverlay(randomEmployees[currNode.id]);
}

/**
 * Removes modal element from DOM.
 * @param {DOMElement} modalEl - Modal container element.
 */
function removeModal(modalEl) {
	modalEl.parentNode.removeChild(modalEl);
}

// Search functionality

/**
 * Filters shown employee cards based on search input value.
 * @param {object} evt - Event object
 */
function filterEmployees(evt) {
	const searchInput = document.querySelector('.search-input');

	// Prevent reload on submit event
	if (evt.type === 'submit') evt.preventDefault();

	const filteredEmployees = [];
	randomEmployees.forEach((employee, idx) => {
		const searchVal = searchInput.value.toLowerCase();
		const fullName = `${employee.name.first} ${employee.name.last}`.toLowerCase();
		if (fullName.includes(searchVal)) {
			employee.shown = true;
			const idxStr = `${idx}`;
			filteredEmployees.push({ ...employee, idxStr });
		} else {
			employee.shown = false;
		}
	});
	updateEmployees(filteredEmployees);
}

/**
 * Updates the displayed employee cards based on the search input.
 * @param {Array} employees - An array of filtered employee objects
 */
function updateEmployees(employees) {
	const indexList = employees.map((employee) => employee.idxStr);

	const employeeCards = galleryDiv.querySelectorAll('.card');
	for (let employeeCard of employeeCards) {
		if (!indexList.includes(employeeCard.id)) {
			employeeCard.style.display = 'none';
		} else {
			employeeCard.style.display = '';
		}
	}
}

// Modal scroll functionality

/**
 * Scrolls through shown employee cards based on direction passed in.
 * @param {string} direction - Describes the direction to scroll.
 */
function scrollModal(direction) {
	const shownEmployeeEmail = document.querySelector('.modal-text').textContent;
	const shownEmployees = randomEmployees.filter((employee) => {
		if (employee.shown) return employee;
	});

	let idx = findWithAttr(shownEmployees, 'email', shownEmployeeEmail);

	const modal = document.querySelector('.modal');
	modal.removeChild(modal.querySelector('.modal-info-container'));

	if (direction === 'modal-prev') {
		if (idx === 0) idx = shownEmployees.length;
		generateModalData(modal, shownEmployees[(idx - 1) % shownEmployees.length]);
	} else {
		generateModalData(modal, shownEmployees[(idx + 1) % shownEmployees.length]);
	}
}

// Event listeners

document.addEventListener('DOMContentLoaded', () => {
	getRandomEmployees(employeesUrl);
	generateSearchField();
});

galleryDiv.addEventListener('click', handleUserClick);

function addModalListener(modalEl) {
	modalEl.addEventListener('click', (evt) => {
		const { target } = evt;
		if (
			target.className === 'modal-container' ||
			target.className === 'modal-close-btn' ||
			target.className === 'btn-text'
		) {
			clearElement(modalEl.firstElementChild);
			removeModal(modalEl);
		} else if (target.id === 'modal-prev' || target.id === 'modal-next') {
			scrollModal(target.id);
		}
	});
}

function addSearchInputListener(formEl) {
	formEl
		.querySelector('.search-input')
		.addEventListener('keyup', filterEmployees);
	formEl.addEventListener('submit', filterEmployees);
}
