// Global variables
const usersUrl = 'https://randomuser.me/api/?results=12&nat=us';
const galleryDiv = document.getElementById('gallery');
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

function generateOverlay(user) {
	console.log(user);
	// Create modal container and model elements
	const modalContainer = createElement('div', 'modal-container');
	const modal = createElement('div', 'modal');

	// Create modal components
	const closeBtn = createElement('button', 'modal-close-btn');
	const closeText = createElement('strong', null, 'X');
	closeBtn.type = 'button';
	closeBtn.id = 'modal-close-btn';
	appendItems(closeBtn, [closeText]);
	const modalData = generateModalData(user);

	// Append modal components and modal to container
	const modalComponents = [closeBtn, modalData];
	appendItems(modal, modalComponents);
	appendItems(modalContainer, [modal]);

	// Append modal container to DOM
	galleryDiv.insertAdjacentElement('afterend', modalContainer);
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

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
	getRandomUsers(usersUrl);
});

galleryDiv.addEventListener('click', handleUserClick);
