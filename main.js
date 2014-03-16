/*** main.js file first entry point for application 
* 
* @author a.fassina
* @date 15-03-2014
* @license BSD Level 2.
* 
*****************************************************************************/



main = {


};

/** 
 * First function called on application initialization.
 * @namespace main
 * */
main.onLoad = function () {
    //Set log object.
    main.log("onLoad called!")
    this.setFocus();
    var ctrl = new controller();
    ctrl.init();
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
    "HOME": 73
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
                break;
            case this.key.UP:
                main.log("UP KEY PRESSED!")
            	break;
            case this.key.DOWN:
                main.log("DOWN KEY PRESSED!")
            	break;
            case this.key.HOME:
                main.log("HOME KEY PRESSED!")
            	break;
            case this.key.BACK:
                main.log("BACK KEY PRESSED!")
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