# Public API Project

The goal of this project was to dynamically build elements utilizing data returned from an API request. For this project I used the public [Random User Generator API](https://randomuser.me/) to build a fictional directory of employees for the Awesome Startup company. On page load, I send a request to the API for 12 random users and then build the employee cards with the returned data. You can then filter the 12 employees using the search input in the top right corner. You can also click on the employee cards to open a more detailed modal display for each card.

## Extras

### Modal Scroll

I added functionality to this page to allow users to scroll through all displayed employee cards when the modal is opened, and it will only display info for cards still shown.

### Style Changes

I selected a light blue background color and new Google Font for the page (Rubik). I also added box shadows to the card elements and search input.