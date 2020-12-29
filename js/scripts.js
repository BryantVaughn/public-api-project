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
	});
}

// Helper functions
function createElement(el, className) {}

getRandomUsers(usersUrl);
