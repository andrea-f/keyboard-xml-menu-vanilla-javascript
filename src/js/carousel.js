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
    
    //Blocks key handling during animation.
    this.blockNav = false;
    
    this.focusReference = null;
    
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
    
    this.cssAnimation = {
        "horizontal": "marginLeft",
        "vertical": "marginTop"    
    };

    this.usingjQuery = false;
    //main.log(typeof $)
    if (typeof $ !== 'undefined')
        this.usingjQuery = true;

    //main.log("using jquery: "+this.usingjQuery)
    if (this.usingjQuery)
        this.animationDiv = $('div.'+this.ulClassName);
    
    this.scrolledMax = false;
    
    //Number with ID of last visible element.
    this.lastVisibleBefore = null;
    
    //String with either before or after movement for carousel animation.
    this.movementDirection = null;
    
    this.currentMargin = 0;
    
    //Object with possible movement directions.
    this.movDir = {
        "before": "before",
        "after": "after"           
    };        
    
    if (typeof this.arrowSize === 'undefined')
        this.arrowSize = 70;
    
    this.cursorControl = {
        "arrowAfter": "arrowAfter",
        "carousel": "carousel",
        "arrowBefore": "arrowBefore"
    };
    
    this.arrowLeftId = this.name+'_leftArrow';
    this.arrowRightId = this.name+'_rightArrow';
    this.arrowTopId = this.name+'_topArrow';
    this.arrowBottomId = this.name+'_bottomArrow';
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
 * Calculates max carousel size based on visible elements, arrows and item size.
 * @returns {getCarouselSize@call;getItemSize|getCarouselSize.visibleElements|getCarouselSize.arrowSize}
 */
carousel.prototype.getCarouselSize = function getCarouselSize() {
    return (this.getItemSize()*this.visibleElements)-(this.arrowSize);
};

/*
 * First function to be called upon object instantiation.
 */
carousel.prototype.generateSubList = function generateSubList() {
    var total = this.items.length;
    this.mainPosition.setLength(total);
    this.position.setLength(this.total);
    this.subListPosition.setLength(this.visibleElements);
    var html = "",
        mainCarouselSize = this.getCarouselSize();
    html += "<div class='"+this.ulClassName+" '>";   
    for (var s = 0; s < total; s++) {        
        if (this.useArrows) {
            for (var c = 0; c < this.items[s].length; c++) {      
                html+= this.template(s,c);
            }
        } else {
            
            html += this.template(s);
        }          
    }    
    html += "</div>";
    this.lastVisibleBefore = 0;
    this.lastVisibleAfter = this.visibleElements;
    //Set focus to first element in list.    
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
    
    if (this.useArrows) {        
        this.items = [];        
        this.setFocus();
        var itemsTmp = this.subItems,
            visibElements = this.visibleElements;    
        for(var i=0;i<itemsTmp.length/visibElements;i++){
            this.items[i]=[];
            for(var j=0;j<Math.min(visibElements,itemsTmp.length-(visibElements*i));j++){
                this.items[i].push(itemsTmp[i*visibElements+j]);
            }
        } 
        var arrows = this.makeArrows();
        return arrows.before + this.generateSubList() + arrows.after;
    } else {        
        this.items = this.subItems;
        //this.focus = "#"+this.name+"-"+this.position.getIndex();
        if (this.usingjQuery)
            this.setFocus();
        return this.generateSubList();
    }    
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
 * Calls side functions to set focus and check if it is case to animate carousel or not.
 */
carousel.prototype.handleMovement  = function handleMovement() {
    this.setFocus();    
    this.scrollList();
};

/*
 * Generates left arrow HTML or gets HTML passed in from params.
 * @returns {Object} arrowsHtml Includes HTML defining before and after arrows using framework.
 */
carousel.prototype.makeArrows = function () {

    /*
     * Assigns from params carousel direction to correctly handle navigation.
     */
    var dir = this.direction, 
        /*
         * Maps direction configuration before and after to top/bottom, 
         * left/right depending on carousel orientation.
         */
        DIRECTION_CONFIG = {
            "vertical": {
                "before": "top",
                "after": "bottom"
            },
            "horizontal": {
                "before": "left",
                "after": "right"
            }
        },
        /*
         * Maps carousel direction after/before with corresponding arrow ids.
         */
        DIRECTION_IDS = {
            "vertical": {
                "before": this.arrowTopId,
                "after": this.arrowBottomId
            },
            "horizontal": {
                "before": this.arrowLeftId,
                "after": this.arrowRightId
            }
        },
        arrowsType = ["before","after"];   
    /*
     * Generate arrows before and after html.
     */
    var arrowsHtml = {
            "before":"",
            "after":""
        };
    for (var s = 0; s < arrowsType.length; s++) {
        /*
         * Check if element HTML is defined, if not use default.
         */
        var arrowImage = " ",
        //var arrowImage = "<img src='images/arrow_"+DIRECTION_CONFIG[dir][arrowsType[s]]+".png' />",
            arrowInfo = "<div class='arrow'>"+arrowImage+"</div>";
        arrowsHtml[arrowsType[s]] = "<div id='"+DIRECTION_IDS[dir][arrowsType[s]]+"' class='"+DIRECTION_IDS[dir][arrowsType[s]]+' '+DIRECTION_CONFIG[dir][arrowsType[s]]+'Arrow'+"'>"+arrowInfo+"</div>";         
        //sd.log(arrowsHtml[arrowsType[s]]);
    }    
    /*
     * Return HTML components for horizontal/vertical scrolling left/right, top/bottom.
     */    
    return arrowsHtml;
};

/*
 * Sets focus class on current index and removes it from last focused element.
 */
carousel.prototype.setFocus = function setFocus() {    
    this.oldFocus = this.focus;
    if (this.useArrows) {
        this.focus = "#"+this.name+this.mainPosition.getIndex()+"-"+this.subListPosition.getIndex();
        
    } else {
        this.focus = "#"+this.name+"-"+this.position.getIndex();
    }
    main.log(this.focus)
    if (this.usingjQuery) {
        this.focusReference = $(this.focus);
        this.oldFocusReference = $(this.oldFocus);
        //sd.log("[carousel.setFocus] focus id: "+this.focus + " oldfocus: "+this.oldFocus);
        this.oldFocusReference.removeClass('focus');
        this.focusReference.addClass('focus');
    } else {
        this.focusReference = document.getElementById(this.focus);
        this.oldFocusReference = document.getElementById(this.oldFocus);

        this.focusReference.className=this.focusReference.className.replace('focus',""); // first remove the class name if that already exists
        this.focusReference.className = this.focusReference.className + 'focus';

        this.oldFocusReference.className=this.focusReference.className.replace('focus',""); // first remove the class name if that already exists
        this.oldFocusReference.className = this.focusReference.className + 'focus';
    }
};

/*
 * Decides wether to animate carousel or not.
 * @param {Boolean} Whether or not to animate scrolling.
 */
carousel.prototype.scrollList = function scrollList(animate) {    
    if (typeof animate === 'undefined')
        animate = this.scrollFlag();
    //sd.log("[scrollList] animate: "+animate)
    if (animate) {
        switch (this.direction) {
            case this.dirs.horizontal:
                this.animateHorizontalScroll();
                break;
            case this.dirs.vertical:
                this.animateVerticalScroll();
                break;
        }
    }
};

/*
 * Returns carousel li size, either width or height depending on carousel direction.
 * @return {Number} Size in pixels of li.
 */
carousel.prototype.getItemSize = function getVisible() {
    var itemSize = Math.max(this.totalSize/this.visibleElements);
    return itemSize;
}

carousel.prototype.getMaxMargin = function getMaxMargin() {
    return parseInt("-"+(this.getItemSize()*((this.position.getLength()-1) - this.visibleElements)));
}

carousel.prototype.getCurrentMargin = function getCurrentMargin() {
    //Check if animation div is undefined width, if it has, assign it.
    //This is done for first time reference.
    
    if (typeof this.animationDiv.css('width') === 'undefined')        
        this.animationDiv = $('div.'+this.ulClassName);
    return parseInt(this.animationDiv.css(this.cssAnimation[this.direction]).split('px')[0]);    
    
}

/*
 * Sets animation to true or false for forward, next increasing element, in carousel
 * @return {Boolean} whether to animate carousel or not.
 */
carousel.prototype.scrollFlag = function scrollFlag() {
    this.lastVisibleBefore = ((this.position.getLength()-1) - this.visibleElements);
    var currMargin = Math.abs(this.currentMargin),
        maxMargin = Math.abs(this.getMaxMargin());
    
    if (this.position.getIndex()=== this.position.getLength()-1) {
            this.scrolledMax = true;
            //this.maxMargin = $("."+this.ulClassName).css(this.cssAnimation[this.direction])
            
    }
    sd.log("maxMargin: "+ maxMargin+" margin top: "+ currMargin +" scrolledmax: "+this.scrolledMax+" position length: "+this.position.getLength() + " position index: " + this.position.getIndex() + " visible elements: " + this.visibleElements)
    if (this.position.getIndex() >= this.visibleElements && this.position.getIndex()< this.position.getLength()-1  && this.movementDirection === this.movDir.after) {
        //this.lastVisibleBefore = (this.position.getIndex() - this.visibleElements)+1;
        if (this.scrolledMax && ((this.position.getLength() - this.position.getIndex()) <= this.visibleElements) )
            return false;
        if (!this.scrolledMax && currMargin < maxMargin) {
            // && this.maxMargin
            return true;
        } else {
            return false;
        }
    } else if (this.lastVisibleBefore >= this.position.getIndex()  && this.movementDirection === this.movDir.before && this.position.getIndex()>0) {
        this.scrolledMax = false;
        if (-currMargin < 1) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }   
};

/*
 * Sets animation parameters including duration of animation.
 * Margin displacement based on item size.
 * Sets whether the movement should be positive or negative.
 * @return {Object} Carousel animation parameters based on direction.
 */
carousel.prototype.getAnimationParameters = function getAnimationParameters() {    
        var disp;
        if (this.useArrows) 
            disp = this.movement+(this.getCarouselSize() - this.getItemSize());            
        if (!this.useArrows)
            disp = this.movement+ this.getItemSize();        
        var animationDuration = 1000,
            //div = "."+this.ulClassName,
            currMarg = this.getCurrentMargin(),
            movement = currMarg + parseInt(disp),
            movPx = movement + "px";    
    return {
        "disp": disp,
        "duration": animationDuration,
        //"div": div,
        "currMarg": currMarg,
        "movement": movement,
        "movPx": movPx,
        "cssAnimation": this.cssAnimation[this.direction]
    };
};

/*
 * Handles horizontal scroll using jQuery animate.
 * Moves margin left by amount set through parameters in `getAnimationParameters`.
 * Blocks key handling while animation is occurring to avoid crashing carousel.
 */
carousel.prototype.animateHorizontalScroll = function animateHorizontalScroll() {
    var animationParam = this.getAnimationParameters();
    //Block navigation.
    this.blockNav = true;
    var tmp = this;
    this.animationDiv.animate(
        {marginLeft:animationParam.movPx},
        animationParam.duration,
        function(){
            tmp.animationDiv.css(animationParam.cssAnimation,animationParam.movPx);
            tmp.currentMargin = tmp.getCurrentMargin();
            //Enables navigation again after animation has finished.
            
            tmp.blockNav = false;
        }
    );
}

/*
 * Handles vertical scroll using jQuery animate.
 * Moves margin left by amount set through parameters in `getAnimationParameters`.
 * Blocks key handling while animation is occurring to avoid crashing carousel.
 */
carousel.prototype.animateVerticalScroll = function animateVerticalScroll() {
    var animationParam = this.getAnimationParameters();
    var anim = this.animationDiv;
    sd.log("anim: "+ anim.css('width'));
    //Block navigation.
    this.blockNav = true;
    var tmp = this;
    anim.animate(
        {marginTop:animationParam.movPx},
        animationParam.duration,
        function(){
            anim.css(animationParam.cssAnimation,animationParam.movPx);
            tmp.currentMargin = tmp.getCurrentMargin();
            //Enables navigation again after animation has finished.
            tmp.blockNav = false;
        }
    );
};

/*
 * Handles key left/top when carousel is focused. 
 * Goes to previous element in carousel.
 */
carousel.prototype.keyBefore = function keyBefore() {
    if (this.blockNav)
        return;
    this.movementDirection = this.movDir.before;
    this.movement = "+";    
    if (this.position.getIndex() > 0) {
        this.position.dec(); 
        if (this.useArrows) {
                if (this.subListPosition.getIndex() === 0) {
                    if (this.mainPosition.getIndex()>0) {
                        this.subListPosition.setIndex(this.subListPosition.getLength()); 
                        this.mainPosition.dec();                        
                        this.scrollList(true);
                    }
                } else if (this.subListPosition.getIndex() > 0) {
                    this.subListPosition.dec();
                }
                
        }
        if (!this.useArrows) {
            if (this.currentMargin < 1)
                this.scrollList();
        }    
    }
    this.setFocus();    
};

/*
 * Handles key right/bottom when carousel is focused.
 * Goes to next element in carousel.
 */
carousel.prototype.keyAfter = function keyAfter() {
    if (this.blockNav)
        return;
    this.movementDirection = this.movDir.after;
    this.movement = "-";
    var currMargin = Math.abs(this.currentMargin),
        maxMargin = Math.abs(this.getMaxMargin());
    //sd.log(" mainpos: " +this.mainPosition.getIndex() + " sublistpos: "+this.subListPosition.getIndex() + " pos: "+this.position.getIndex())
    if (this.position.getIndex() < (this.position.getLength()-1)) {
        this.position.inc();
        if (this.useArrows) {
            this.subListPosition.inc();
            if (this.subListPosition.getIndex() === this.subListPosition.getLength()) {
                this.mainPosition.inc();
                this.subListPosition.setIndex(0);   
                this.scrollList(true);
            }
        }
        this.setFocus();    
        if (!this.useArrows) {                
            if (currMargin <= maxMargin)
                this.scrollList();
        }
    }    
    
};