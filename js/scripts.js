// Global variables
const usersUrl = 'https://randomuser.me/api/?results=12&nat=us';
const galleryDiv = document.getElementById('gallery');
const randomUsers = [];

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
		generateMainData(card, user, 'medium');
		appendItems(galleryDiv, [card]);
	});
}

/**
 * Builds the data pieces of each user card such as name, email, location and image.
 * @param {DOMElement} parentElement - Parent element that data is associated with.
 * @param {object}     user - User object containing necessary data.
 * @param {string}     imgSize - Reference to size of image to be used from user.
 */
function generateMainData(parentElement, user, imgSize) {
	// Create elements that make up each employee card
	const { picture, name, email, location } = user;
	const fullName = `${name.first} ${name.last}`;
	// Create elements for card image
	const cardImgDiv = createElement('div', 'card-img-container');
	const img = createElement('img', 'card-img');
	img.src = imgSize === 'medium' ? picture.medium : picture.large;
	img.alt = 'profile picture';
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

// Helper functions
function createElement(el, className = null, textContent = null) {
	const element = document.createElement(el);
	element.className = className;
	element.textContent = textContent;
	return element;
}

function appendItems(parentElement, itemsToAppend) {
	itemsToAppend.forEach((item) => parentElement.appendChild(item));
}

function formatLocation(state) {}

getRandomUsers(usersUrl);
