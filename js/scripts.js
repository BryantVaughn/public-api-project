// Global variables
const usersUrl = 'https://randomuser.me/api/?results=12&nat=us';
const galleryDiv = document.getElementById('gallery');
const randomUsers = [];

// Fetch functions
async function fetchData(url) {
	try {
		const res = await fetch(url);
		return await res.json();
	} catch (err) {
		throw err;
	}
}

async function getRandomUsers(url) {
	const data = await fetchData(url);
	const users = data.results;
	generateUserCards(users);
}

// Generate HTML pieces
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

function formatLocation(location) {}

getRandomUsers(usersUrl);
