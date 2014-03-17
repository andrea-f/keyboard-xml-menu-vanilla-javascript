/*
 * @author Andrea Fassina.
 * Code provided by  Code is under bsd license 2.
 * controller.js holds data fetching capability.
 * @date 15-03-2014
 */

function carousel(params){
    
    //Assigns passed in parameters to this instance of carousel.
    this.assignParamsToThis(params);
    
    //Assigns items generation template to this instance.
    this.template = params.template;
    
    //Is double array with total items/visible elements
    this.items = null;
    
    //HTML element ID of currently focused element.
    this.focus = null;
    
    //HTML element ID of last focused element.
    this.oldFocus = null;    
   
    //Holds focus reference
    this.focusReference = null;

    //Holds old focus reference
    this.oldFocusReference = null;
    
    //HTML class name to assign to carousel ul container.
    this.ulClassName = this.name+"_ul";
    
    //HTML class name to assign to carousel li items.
    this.ilClassName = this.name+"_li";
    
    //String with either horizontal or vertical movement.
    this.movement = null;
    
    //Object with possible movements.
    this.dirs = {
        "horizontal": "horizontal",
        "vertical": "vertical"
    };
    
    //Number with ID of last visible element.
    this.lastVisibleBefore = null;
}
/*
 * Assigns passed parameters to instance to instance itself.
 * @param {type} obj
 */
carousel.prototype.assignParamsToThis = function assignParamsToThis(obj) {
    for (var prop in obj) {
        if (typeof obj[prop] !== 'function'){
            this[prop] = obj[prop];
        }
    }   
}; 

/*
 * First function to be called upon object instantiation.
 */
carousel.prototype.generateSubList = function generateSubList() {
    var total = this.items.length;
    this.mainPosition.setLength(total);
    this.position.setLength(this.total);
    this.subListPosition.setLength(this.visibleElements);
    var html = "";
    for (var s = 0; s < total; s++) {        
        html += this.template(s);                  
    }    
    this.lastVisibleBefore = 0;
    this.lastVisibleAfter = this.visibleElements;
    return html;
};


/*
 * Calculate how many boxes you need to fit all the returned elements,
 * Given the maximum number of visible elements.
 * This will be the main carousel. 
 * Each box will be a subdivision of #of visible elements.
 * Their number will be based on the total of returned items from WS.
 */
carousel.prototype.generateList = function generateList() {
    //Holds carousel current index.
    this.position = new position();    
    this.position.setIndex();
    
    //Holds carousel sublist index.
    this.subListPosition = new position();
    this.subListPosition.setIndex();
    
    //Holds main carousel current index.
    this.mainPosition = new position();
    this.mainPosition.setIndex();    
    this.items = this.subItems;
    return this.generateSubList();
        
};

/*
 * Generates carousel HTML.
 * @return {String} with carousel HTML.
 */
carousel.prototype.getHtml = function getHtml() {
    var carouselHtml = this.generateList();
    return carouselHtml;
};

/*
 * Sets focus class on current index and removes it from last focused element.
 */
carousel.prototype.setFocus = function setFocus() {    
    this.oldFocus = this.focus;
    this.focus = this.name+"-"+this.position.getIndex();
    this.focusReference = document.getElementById(this.focus);
    this.oldFocusReference = document.getElementById(this.oldFocus);
    this.oldFocusReference.className=this.oldFocusReference.className.replace('focus',"");
    this.focusReference.className=this.focusReference.className.replace('focus',""); // first remove the class name if that already exists
    this.focusReference.className = this.focusReference.className + ' focus';    
};

/*
 * Handles key left/top when carousel is focused. 
 * Goes to previous element in carousel.
 */
carousel.prototype.keyBefore = function keyBefore() {
    if (this.position.getIndex() > 0) {
        this.position.dec();         
    }
    this.setFocus();
};

/*
 * Handles key right/bottom when carousel is focused.
 * Goes to next element in carousel.
 */
carousel.prototype.keyAfter = function keyAfter() {
    if (this.position.getIndex() < (this.position.getLength()-1)) {
        this.position.inc();   
    }    
    this.setFocus();   
};