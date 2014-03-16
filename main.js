/*** main.js file first entry point for application 
* 
* @author a.fassina
* @date 15-03-2014
* @license BSD Level 2.
* 
*****************************************************************************/



main = {
 
};

main.ctrl = {}

/** 
 * First function called on application initialization.
 * @namespace main
 * */
main.onLoad = function () {
    //Set log object.
    main.log("onLoad called!")
    this.setFocus();
    this.ctrl = new controller();
    this.ctrl.init();
    // Enable key event processing
    
    
    
};

main.setFocus = function() {
    document.getElementById("anchor").focus();
}

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
}
/*
 * Forces focus always on anchor.
 * @param {Object} event that happened.
 */
main.mouseClick = function (event) {
    this.setFocus();
}


/** 
 * Handle keydown events
 * @param {object} event is passed from index.html 
 * */
main.keyDown = function (event) {
        main.log("EVENT passed : " + event.keyCode);
	var keyCode = event.keyCode;
       
	//Handle key press events
	switch (keyCode) {
            case this.key.ENTER:
                main.log("ENTER KEY PRESSED!")
                this.ctrl.handleInput("ENTER")
                break;
            case this.key.UP:
                this.ctrl.handleInput("UP")
            	break;
            case this.key.DOWN:
                this.ctrl.handleInput("DOWN")
            	break;
            case this.key.HOME:
                
                this.ctrl.handleInput("HOME")
            	break;
            case this.key.BACK:
                main.log("BACK KEY PRESSED!")
                this.ctrl.handleInput("BACK")
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