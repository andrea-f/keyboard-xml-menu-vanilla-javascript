/*
 * @author Andrea Fassina.
 * Code provided by  Code is under bsd license 2.
 * controller.js holds data fetching capability.
 * @date 15-03-2014
 */



/*
 * Server object for fetching data.
 * Currently supported XML
 * @param {Object} params holds configuration information.
 */
function controller(params) {

    /*
     * Holds loaded XML document.
     */
     this.location = "data/content.xml";

     /*
      * Holds elements from retrieved data in array format.
      */
     this.items = null;
     /*
      * Holds retrieved data.
      */
     this.data = null;

     /*
      * Holds number of total items in retrieved data.
      */
     this.totalItems = 0;

     /*
      * Holds carousel reference.
      */
     this.dataCarousel = null;

     /*
      * Holds reference to current carousel position in respect to all generated.
      */
     this.carouselPosition = new position();
     
     /*
      * Sets carousel position to 0.
      */
     this.carouselPosition.setIndex();

     /*
      * Holds list of available carousels.
      */
     this.carouselList = []

     /*
      * Instantiate new user interface instance.
      */
     this.uint = new ui();

     /*
      * Maps available input.
      */
     this.input = {
         "ENTER": "ENTER",
         "UP": "UP",
         "DOWN": "DOWN",
         "BACK": "BACK",
         "HOME": "HOME"
     };
}

/*
 * Initializes controller.
 */
controller.prototype.init = function init() {
    this.loadXMLData();
    this.displayUI();
};

/*
 * Draws first carousel on UI.
 */
controller.prototype.displayUI = function displayUI() {
    this.carouselPosition.setIndex(0);
    this.uint.displayElements(this.carouselList[this.carouselPosition.getIndex()].getHtml());
};

/*
 * Generates carosuel instance.
 * @param {String} folderName name of carousel.
 * @param {Array} elems List of objects which will be put in carousel.
 */
controller.prototype.generateCarousel = function generateCarousel(folderName,elems) {
    var g = this.carouselPosition.getIndex();
    var name = folderName,
        direction = "vertical",
        visibleElements = 6,
        entries = elems,
        totSize = 840,
        params = {
            "name": name,
            "direction": direction,
            "visibleElements": visibleElements,
            "total": entries.length,
            "subItems": entries,
            "totalSize": totSize,
            "template": function(i) {
                var html = "", f, p;
                if (i === 0) {
                    this.focus = this.name+"-"+i;
                    f = 'focus';
                } else {
                    f = "";
                }
                if (typeof this.items[i].parent !== 'undefined') {
                    p = this.items[i].parent;
                } else {
                    p = '';
                }
                html += "<p ><span class='"+this.items[i].classType+" "+f+" parent-"+p+"' id='"+this.name+"-"+i+"' >"+this.items[i].name+"</span></p>";
                return html;
            }
        };
    this.carouselList[g] = new carousel(params);
    html = this.carouselList[g].getHtml();
    this.carouselPosition.inc(1);
    this.carouselPosition.setLength(this.carouselList.length);
}

/*
 * Loads XML file for usage.
 * @param {String} location place of XML file, either local or remote.
 */
controller.prototype.loadXMLData = function loadXML(location) {
    if (typeof location === 'undefined')
        location = this.location;
    var connection = new server();
    this.data = connection.loadXML(location);
    if (typeof this.data === "object") {
        var d = this.data['documentElement'];
        this.cycleXML(d);
    } else {
        main.log("Error in reading XML.");
    }
};


/*
 * Looks through carousel names to match folder.
 * @type {Object} info holds name of clicked item and parent of current item.
 * @return {String} html of selected carousel.
 */
controller.prototype.traverseData = function traverseData(info) {
    for (var g = 0; g <= this.carouselList.length-1; g++) {
        if (info['name'] === this.carouselList[g].name) {
            this.carouselPosition.setIndex(g);
            if (info['parent'] === this.carouselList[g].items[0].parent) {
                break;
            }
        }
    }
    return this.carouselList[this.carouselPosition.getIndex()].getHtml();
};

/*
 * Event dispatcher based on input type.
 * @type {String} inputType what key was pressed. * 
 */
controller.prototype.handleInput = function handleInput(inputType) {
    var index = this.carouselPosition.getIndex();
    switch (inputType) {
        case this.input.ENTER:
            this.carouselPosition.setOldIndex(index)
            var elemIndex = this.carouselList[index].items[this.carouselList[index].position.getIndex()];
            if (elemIndex.classType === 'links') {
                html = this.traverseData({"name":elemIndex.name, "parent": elemIndex.parent})
                this.uint.displayElements(this.carouselList[this.carouselPosition.getIndex()].getHtml());
            } else {
                alert(elemIndex.name)
            }            
            break;
        case this.input.UP:
            this.carouselList[index].keyBefore();
            break;
        case this.input.DOWN:
            this.carouselList[index].keyAfter();
            break;
        case this.input.HOME:
            this.carouselPosition.setIndex(0)
            this.uint.displayElements(this.carouselList[0].getHtml());
            break;
        case this.input.BACK:
            parent = this.carouselList[index].items[0].parent
            html = this.traverseData({"name":parent,"parent": ""})
            this.uint.displayElements(html);            
            break;
    }
};

/*
 * Goes through root to save sub nodes and items.
 * @type {Object} root holds node reference information.
 */
controller.prototype.cycleXML = function cycleXML(root) {
    if (typeof root !== 'undefined') {
        var rootChildren = root.childNodes,
            children = [],
            folderName = root.getAttribute('title'),
            parentName = '',
            elems = [],
            it = {};
        try{
            parentName = root.parentNode.getAttribute('title')
        } catch (err) {
            parentName = 'Home';
        }
        it = {
            "name": folderName,
            "classType": "links",
            "parent": parentName
        };
        elems.push(it);
        for (var c=0; c<rootChildren.length; c++) {
            if (rootChildren.item(c).tagName === 'item') {
                it = {
                    "name": rootChildren.item(c).getAttribute('title'),
                    "classType": "files",
                    "parent": folderName
                }
                elems.push(it);
            } else if (rootChildren[c].tagName === 'folder') {
                subItems = rootChildren[c];
                it = {
                    "name": rootChildren.item(c).getAttribute('title'),
                    "classType": "links",
                    "parent": folderName
                }
                elems.push(it);
                children.push(subItems);
            }
        }
        this.generateCarousel(folderName, elems)
        if (children.length > 0) {
            this.exploreChildren(children, elems.length+1);
        }
    } 
};

/*
 * Calls cycleXML for all children of all items.
 * @type {Object} Holds sub nodes discovered.
 * @type {Number} Total elements in data.
 */
controller.prototype.exploreChildren = function exploreChildren(children, total) {
    if (this.totalItems < total)
        this.totalItems = total;
    var childrenLen = this.totalItems;
    for (var d = 0; d < childrenLen; d++) {
        this.cycleXML(children[d]);
    }
};

