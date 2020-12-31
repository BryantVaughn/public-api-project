// Global variables
const usersUrl = 'https://randomuser.me/api/?results=12&nat=us';
const galleryDiv = document.getElementById('gallery');
const searchContainer = document.querySelector('.search-container');
const randomUsers = [];
let overlayView;

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
 * users received from the Random User API to build the user cards.
 * @param {string} url - URL string of API endpoint.
 */
async function getRandomUsers(url) {
	const data = await fetchData(url);
	const users = data.results;
	generateUserCards(users);
}

// Generate HTML pieces

/**
 * Creates a card for each user and appends it to the gallery.
 * @param {Array} users - An array of user objects retrieved from API.
 */
function generateUserCards(users) {
	users.forEach((user, idx) => {
		user.shown = true;
		randomUsers.push(user);
		const card = createElement('div', 'card');
		card.id = idx;
		generateMainData(card, user);
		appendItems(galleryDiv, [card]);
	});
}

/**
 * Builds the data pieces of each user card such as name, email, location and image.
 * @param {DOMElement} parentElement - Parent element that data is associated with.
 * @param {object}     user - User object containing necessary data.
 */
function generateMainData(parentElement, user) {
	// Create elements that make up each employee card
	const { picture, name, email, location } = user;
	const fullName = `${name.first} ${name.last}`;
	// Create elements for card image
	const cardImgDiv = createElement('div', 'card-img-container');
	const img = generateProfileImg(picture.medium, false);
	appendItems(cardImgDiv, [img]);

	// Create elements for card text info
	const cardInfoDiv = createElement('div', 'card-info-container');
	const userName = createElement('h3', 'card-name cap', fullName);
	userName.id = 'name';
	const userEmail = createElement('p', 'card-text', email);
	const userLocation = createElement('p', 'card-text cap', location.city);
	const userData = [userName, userEmail, userLocation];
	appendItems(cardInfoDiv, userData);

	// Append image and data to card
	const cardElements = [cardImgDiv, cardInfoDiv];
	appendItems(parentElement, cardElements);
}

/**
 * Generates necessary elements with user data to display in modal.
 * @param  {object} 		user - User object containing necessary data.
 * @return {DOMElement} infoContainer - Returns data container for modal.
 */
function generateModalData(user) {
	const { name, picture, email, location, cell, dob } = user;
	const fullName = `${name.first} ${name.last}`;

	// Create modal info container and components
	const infoContainer = createElement('div', 'modal-info-container');
	const userImg = generateProfileImg(picture.large, true);
	const userName = createElement('h3', 'modal-name cap', fullName);
	name.id = 'name';
	const userEmail = createElement('p', 'modal-text', email);
	const userCity = createElement('p', 'modal-text cap', location.city);
	const hr = createElement('hr');
	const userCell = createElement('p', 'modal-text', formatPhoneNumber(cell));
	const userAddress = createElement(
		'p',
		'modal-text',
		streetAddressBuilder(location)
	);
	const userDOB = createElement(
		'p',
		'modal-text',
		`Birthday: ${formatDate(dob.date)}`
	);

	// Append components to container
	const modalComponents = [
		userImg,
		userName,
		userEmail,
		userCity,
		hr,
		userCell,
		userAddress,
		userDOB
	];
	appendItems(infoContainer, modalComponents);
	return infoContainer;
}

/**
 * Generates main modal and container when employee card is clicked.
 * @param {object} user - User object from clicked card.
 */
function generateOverlay(user) {
	// Create modal container and model elements
	const modalContainer = createElement('div', 'modal-container');
	const modal = createElement('div', 'modal');

	// Create modal components
	const closeBtn = createElement('button', 'modal-close-btn');
	const closeText = createElement('strong', 'btn-text', 'X');
	closeBtn.type = 'button';
	closeBtn.id = 'modal-close-btn';
	appendItems(closeBtn, [closeText]);
	const modalData = generateModalData(user);

	// Append modal components and modal to container
	const modalComponents = [closeBtn, modalData];
	appendItems(modal, modalComponents);
	appendItems(modalContainer, [modal]);

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
	overlayView = currNode.id;
	generateOverlay(randomUsers[overlayView]);
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
	randomUsers.forEach((user, idx) => {
		const searchVal = searchInput.value.toLowerCase();
		const fullName = `${user.name.first} ${user.name.last}`.toLowerCase();
		if (fullName.includes(searchVal)) {
			user.shown = true;
			const idxStr = `${idx}`;
			filteredEmployees.push({ ...user, idxStr });
		} else {
			user.shown = false;
		}
	});
	updateEmployees(filteredEmployees);
}

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

// Event listeners

document.addEventListener('DOMContentLoaded', () => {
	getRandomUsers(usersUrl);
	generateSearchField();
});

galleryDiv.addEventListener('click', handleUserClick);

function addModalListener(modalEl) {
	modalEl.addEventListener('click', (evt) => {
		const className = evt.target.className;
		if (
			className === 'modal-container' ||
			className === 'modal-close-btn' ||
			className === 'btn-text'
		) {
			clearElement(modalEl.firstElementChild);
			removeModal(modalEl);
		}
	});
}

function addSearchInputListener(formEl) {
	formEl
		.querySelector('.search-input')
		.addEventListener('keyup', filterEmployees);
	formEl.addEventListener('submit', filterEmployees);
}
