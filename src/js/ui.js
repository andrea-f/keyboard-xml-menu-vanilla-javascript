/*
 * @author Andrea Fassina.
 * Code provided by  Code is under bsd license 2.
 * controller.js holds data fetching capability.
 * @date 15-03-2014
 */

/*
 * Ui object
 * @param {Object} params
 * @returns {ui}
 */
function ui(params) {
    this.content = document.getElementById('content');
}

/*
 * Displays elements on screen.
 * @type {String} data html to display.
 */
ui.prototype.displayElements = function displayElements(data) {
    //main.log(data)
    this.content.innerHTML = data;
};
