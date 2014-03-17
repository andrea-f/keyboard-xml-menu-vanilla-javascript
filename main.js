/*** main.js file first entry point for application 
* 
* @author a.fassina
* @date 15-03-2014
* @license BSD Level 2.
* 
*****************************************************************************/



main = {
 
};

// Will hold new controller.
main.ctrl = {}

/** 
 * First function called on application initialization.
 * @namespace main
 * */
main.onLoad = function () {
    //HELLO WORLD!
    main.log("onLoad called!");
    this.setFocus();
    this.ctrl = new controller();
    this.ctrl.init();    
};

/*
 * Enable key event processing.
 */ 
main.setFocus = function() {
    document.getElementById("anchor").focus();
}


/*
 * Maps key name with key number.
 */
main.key = {
    "ENTER": 13,
    "UP": 38,
    "DOWN": 40,
    /*
     * 66 Is G code in keyboard.
     */
    "BACK": 66,
    /*
     * 73 Is H code in keyboard.
     */
    "HOME": 72
};

/*
 * Forces focus always on anchor.
 * @param {Object} event that happened.
 */
main.mouseClick = function (event) {
    this.setFocus();
};

/** 
 * Handle keydown events
 * @param {object} event is passed from index.html 
 * */
main.keyDown = function (event) {
        var keyCode = event.keyCode;
       
	//Handle key press events
	switch (keyCode) {
            case this.key.ENTER:
                this.ctrl.handleInput(this.ctrl.input.ENTER);
                break;
            case this.key.UP:
                this.ctrl.handleInput(this.ctrl.input.UP);
            	break;
            case this.key.DOWN:
                this.ctrl.handleInput(this.ctrl.input.DOWN);
            	break;
            case this.key.HOME:                
                this.ctrl.handleInput(this.ctrl.input.HOME);
            	break;
            case this.key.BACK:
                this.ctrl.handleInput(this.ctrl.input.BACK);
            	break;
	}	
};

/*
 * Loads data from API and sends results to UI
 */
main.loadXMLdata = function () {
    //ac.menuControl.welcomeImage(true);
    //sd.log("displaying welcome image...");
    sd.serverData.loadChannel();
};

/*
 * Logging functionality.
 * @type {String} or {Object} to print to console.
 */
main.log = function (text) {
    if (typeof text === 'string') {
        console.log("LOG: " + text)        
    }
    if (typeof text === 'object') {
        for (prop in text) {
            console.log("LOG: " + prop + " : " + text[prop])
        }
    }
}