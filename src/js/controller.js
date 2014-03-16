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
     this.location = "http://localhost/wordpress/content.xml"

     /*
      * Holds elements from retrieved data in array format.
      */
     this.items = null;
     /*
      * Holds retrieved data.
      */
     this.data = null;

     /*
      * Holds carousel reference.
      */
     this.dataCarousel = null;

     this.carouselPosition = new position();
     this.carouselPosition.setIndex();

     this.carouselList = []

     this.uint = new ui();

     this.input = {
         "ENTER": "ENTER",
         "UP": "UP",
         "DOWN": "DOWN",
         "BACK": "BACK",
         "HOME": "HOME"
     }
}

controller.prototype.init = function init() {
    this.loadXMLData();
    //this.generateCarousel();
    this.displayUI();


}

controller.prototype.displayUI = function displayUI() {
    this.carouselPosition.setIndex(-1);
    main.log("displayUI: " + this.carouselPosition.getIndex())
    this.uint.displayElements(this.carouselList[this.carouselPosition.getIndex()].getHtml());
}

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
                    "useArrows": false,
                    "totalSize": totSize,
                    "template": function(i) {
                        var html = "", f, p;
                        if (i === 0) {
                            this.focus = this.name+"-"+i
                            f = 'focus'
                            //html += "<p ><span class='links focus' id='top-"+i+"'>"+this.name+"</span></p>";
                        } else {
                            f = ""
                        }
                        if (typeof this.items[i].parent !== 'undefined') {
                            p = this.items[i].parent;
                        } else {
                            p = ''
                        }
                        html += "<p ><span class='"+this.items[i].classType+" "+f+" parent-"+p+"' id='"+this.name+"-"+i+"' >"+this.items[i].name+"</span></p>";

                        return html;
                    }
                };
    
    this.carouselList[g] = new carousel(params);
    html = this.carouselList[g].getHtml()
    
    this.carouselPosition.inc(1)
    this.carouselPosition.setLength(this.carouselList.length)
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
        var d = this.data.getElementsByTagName("folder")
        this.xmlToArray1()
    } else {
        main.log("Error in reading XML.")
    }
    //alert(d.nodeName)
    //prints home!
    //alert(d.getAttribute('title'))
    //alert(d.nodeValue)
    
}

controller.prototype.traverseData = function traverseData(name) {
    for (var g = 0; g < this.carouselList.length; g++) {
        if (name === this.carouselList[g].name)
            this.carouselPosition.setIndex(g)
            //break;
    }
    return this.carouselList[this.carouselPosition.getIndex()].getHtml()
}

controller.prototype.handleInput = function handleInput(inputType) {
    var index = this.carouselPosition.getIndex()

    switch (inputType) {
        case this.input.ENTER:
            this.carouselPosition.setOldIndex(index)
            var elemIndex = this.carouselList[index].items[this.carouselList[index].position.getIndex()];
            //alert()
            //this.carouselPosition.setIndex(go)
            if (elemIndex.classType == 'links') {
                html = this.traverseData(elemIndex.name)
                this.uint.displayElements(this.carouselList[this.carouselPosition.getIndex()].getHtml());
            } else {
                alert(elemIndex.name)
            }
            
            break;
        case this.input.UP:
            this.carouselList[index].keyBefore();
            break;
        case this.input.DOWN:
            main.log("itemsize: "+this.carouselList[0].getItemSize())//this.carouselPosition.getIndex()
            //this.carouselList[0].setFocus()
            this.carouselList[index].keyAfter();
            break;
        case this.input.HOME:
            this.carouselPosition.setIndex(0)
            this.uint.displayElements(this.carouselList[0].getHtml());
            break;
        case this.input.BACK:
            //subIndex = this.carouselList[this.carouselPosition.getIndex()].position.getIndex()
            oldIndex = this.carouselPosition.getOldIndex()
            parent = this.carouselList[index].items[0].parent
            html = this.traverseData(parent)
            main.log("parent BACK: "+parent)
            
            this.uint.displayElements(html);
            
            break;
    }
}

controller.prototype.xmlToArray1 = function xmlToArray1() {
    root = this.data['documentElement'];
   
    
    //Root of data has attirbutes
    docElement = root.getElementsByTagName("folder")[0].getAttribute('title')
    docItem = root.getElementsByTagName("item")[0].getAttribute('title')
    
    //alert(docElement + " " + docItem);
    this.cycleXML(root)
    return;
    //First element under root
    firstElement = docElement['firstChild'].getElementsByTagName("item");
    

}

controller.prototype.cycleXML = function cycleXML(root) {
    //rootTagsItem = root.getElementsByTagName("item");
    //rootTagsFolder = root.getElementsByTagName("folder")
    rootChildren = root.childNodes;
    var children = []
    //main.log("folder title: "+root.getAttribute('title'));
    folderName = root.getAttribute('title');
    parentName = ''
    //main.log(root.parentNode)
    try{
        if (root.parentNode.hasAttribute('title')) {
            //main.log('has attribute...')
            
            parentName = root.parentNode.getAttribute('title')
            
        } else {
            main.log('doesnt have attribute...')
        }
    } catch (err) {
        parentName = 'Home'
    }
    //main.log("folderName: "+folderName+" parentName: "+parentName)
    var elems = []
    var it = {};
    it = {
        "name": folderName,
        "classType": "links",
        "parent": parentName
    }
    main.log(it)
    elems.push(it);
    for (var c=0; c<rootChildren.length; c++) {
        if (rootChildren.item(c).tagName === 'item') {
            it = {
                "name": rootChildren.item(c).getAttribute('title'),
                "classType": "files",
                "parent": folderName
            }
            elems.push(it);
        }
        if (rootChildren[c].tagName === 'folder') {
            subItems = rootChildren[c];
            it = {
                "name": rootChildren.item(c).getAttribute('title'),
                "classType": "links",
                "parent": folderName
            }            
            elems.push(it);
            children.push(subItems);
            //main.log(it)
        }
        
    }
    
    this.generateCarousel(folderName, elems)
    if (children.length > 0) {
        this.traverseXML(children);
    }
}

controller.prototype.traverseXML = function traverseXML(children) {
    childrenLen = children.length;
    for (var d = 0; d < childrenLen; d++) {
        this.cycleXML(children[d])
    }


}



controller.prototype.generateUI = function generateUI() {
    var data = this.data;
    for (obj in data) {
        main.log(data.obj);
    }
}

