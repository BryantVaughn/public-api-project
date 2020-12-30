// Helper functions

/**
 * Creates a new DOM element and applies classes and/or text content if specified.
 * @param  {string} 		el - Type of element to create.
 * @param  {string} 		className - Class to apply to new element.
 * @param  {string} 		textContent - Text to include within element tags.
 * @return {DOMElement} Returns the new created element.
 */
function createElement(el, className = null, textContent = null) {
	const element = document.createElement(el);
	element.className = className;
	element.textContent = textContent;
	return element;
}

/**
 * Creates an image object and applies correct source and class.
 * @param  {string}     imgSrc - Source for the image.
 * @param  {boolean}    isModal - True if building image for modal.
 * @return {DOMElement} img - returns img DOM element.
 */
function generateProfileImg(imgSrc, isModal) {
	const imgClass = isModal ? 'modal-img' : 'card-img';
	const img = createElement('img', imgClass);
	img.id = 'profile picture';
	img.src = imgSrc;
	return img;
}

/**
 * Appends a list of DOM elements to a single parent in order.
 * @param {DOMElement} parentElement - Element that will have items appended to it.
 * @param {Array} 		 itemsToAppend - An array of DOM elements to append to parent.
 */
function appendItems(parentElement, itemsToAppend) {
	itemsToAppend.forEach((item) => parentElement.appendChild(item));
}

function formatPhoneNumber(phone) {
	if (phone[4] === ')') return `${phone.slice(0, 5)} ${phone.slice(6)}`;
	return phone;
}

function streetAddressBuilder(locationObj) {
	const addNumber = locationObj.street.number;
	const streetName = locationObj.street.name;
	const city = locationObj.city;
	const state = abbrState(locationObj.state);
	const postCode = locationObj.postcode;
	return `${addNumber} ${streetName} ${city}, ${state} ${postCode}`;
}

function abbrState(inputState) {
	const states = [
		['Arizona', 'AZ'],
		['Alabama', 'AL'],
		['Alaska', 'AK'],
		['Arkansas', 'AR'],
		['California', 'CA'],
		['Colorado', 'CO'],
		['Connecticut', 'CT'],
		['Delaware', 'DE'],
		['Florida', 'FL'],
		['Georgia', 'GA'],
		['Hawaii', 'HI'],
		['Idaho', 'ID'],
		['Illinois', 'IL'],
		['Indiana', 'IN'],
		['Iowa', 'IA'],
		['Kansas', 'KS'],
		['Kentucky', 'KY'],
		['Louisiana', 'LA'],
		['Maine', 'ME'],
		['Maryland', 'MD'],
		['Massachusetts', 'MA'],
		['Michigan', 'MI'],
		['Minnesota', 'MN'],
		['Mississippi', 'MS'],
		['Missouri', 'MO'],
		['Montana', 'MT'],
		['Nebraska', 'NE'],
		['Nevada', 'NV'],
		['New Hampshire', 'NH'],
		['New Jersey', 'NJ'],
		['New Mexico', 'NM'],
		['New York', 'NY'],
		['North Carolina', 'NC'],
		['North Dakota', 'ND'],
		['Ohio', 'OH'],
		['Oklahoma', 'OK'],
		['Oregon', 'OR'],
		['Pennsylvania', 'PA'],
		['Rhode Island', 'RI'],
		['South Carolina', 'SC'],
		['South Dakota', 'SD'],
		['Tennessee', 'TN'],
		['Texas', 'TX'],
		['Utah', 'UT'],
		['Vermont', 'VT'],
		['Virginia', 'VA'],
		['Washington', 'WA'],
		['West Virginia', 'WV'],
		['Wisconsin', 'WI'],
		['Wyoming', 'WY']
	];

	const stateArr = states.filter((state) => {
		return state[0] === inputState;
	});

	const stateAbbr = stateArr[0][1];
	return stateAbbr;
}

function formatDate(dateString) {
	const date = new Date(dateString);
	const month = padNumWithZeros(date.getMonth() + 1, 2);
	const day = padNumWithZeros(date.getDate(), 2);
	const year = date.getYear();
	return `${month}/${day}/${year}`;
}

function padNumWithZeros(num, targetLength) {
	return num.toString().padStart(targetLength, '0');
}
