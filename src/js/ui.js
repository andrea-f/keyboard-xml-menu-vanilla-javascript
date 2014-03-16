/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

//Code provided by www.dinx.tv code is under bsd license

function ui(params) {
    this.content = document.getElementById('content');
}

ui.prototype.displayElements = function displayElements(data) {
    //main.log(data)
    this.content.innerHTML = data;
}
