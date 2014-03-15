function menu(params){
    //Assigns passed in parameters to this instance of carousel.
    this.assignParamsToThis(params);
    
    this.isVisible = null;
    
    //Sets menu id and class name.
    this.menuElement = this.name+"Menu";
    
    //Sets jquery menu id reference
    this.menuRef = $('#'+this.menuElement);
    
    this.activeMenu = null;
}

/*
 * Assigns passed parameters to instance to instance itself.
 * @param {type} obj
 */
menu.prototype.assignParamsToThis = function assignParamsToThis(obj) {
    for (var prop in obj) {
        if (typeof obj[prop] !== 'function'){
            this[prop] = obj[prop];
        }
    }   
} 



/*
 * Calls server to load more results based on current information - menu name, current page.
 * @returns {undefined}
 */
menu.prototype.loadMore = function loadMore() {
    
}

/*
 * Toggles menu on or off.
 */
menu.prototype.toggleMenuVisibility = function toggleMenuVisibility() {
    var disp;
    if (this.isVisible)
        disp = 'block';
    if (!this.isVisible)
        disp = 'none';    
    
    this.menuRef.animate(
        {display:disp},
        500,
        function(){
            this.menuRef.css('display',disp);

        }
    );
    
    this.isVisible = !this.isVisible;    
};

menu.prototype.createMenu = function createMenu() {
    var menuHtml = this.getHtmlTag();
    $('body').append(menuHtml);
};

/*
 * Creates an html tag.
 * @param {String} elementName is name of id and class that will be assigned to element.
 * @return {Object} jquery html object.
 */
menu.prototype.getHtmlTag = function createTag(elementName) {
    if (typeof elementName === 'undefined')
        elementName = this.menuElement;
    return $("<div class='"+elementName+"' id='"+elementName+"'></div>");
};


/*
 * Returns menu reference.
 * @return {Object} jquery id menu reference.
 */
menu.prototype.getMenuObjectReference = function getMenuObjectReference() {
    return this.menuRef;
};


/*
 * Sets menu html.
 * @param {String} html to put in menu.
 */
menu.prototype.setHtml = function setHtml(html) {
    this.menuRef.html(html);
};

