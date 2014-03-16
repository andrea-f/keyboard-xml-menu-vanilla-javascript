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
     this.carouselPosition.setIndex(0);

     this.carouselList = []
}

controller.prototype.init = function init() {
    this.loadXMLData();
    //this.generateCarousel();
    this.displayUI();


}

controller.prototype.displayUI = function displayUI() {
    uint = new ui();
    uint.displayElements(this.carouselList[-1].getHtml());
}

controller.prototype.generateCarousel = function generateCarousel(folderName,elems) {
    var i = this.carouselPosition.getIndex();
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
                        var html = "", f;
                        if (i === 0) {
                            f = "focus";
                            html += "<p ><span class='links' >"+this.name+"</span></p>";
                        } else {
                            f = "";
                        }
                        //sd.log("items template: "+j+" subitems template: "+i)
                        //.getAttribute('title')

                        html += "<p ><span class='"+this.items[i].classType+"' >"+this.items[i].name+"</span></p>";
                        return html;
                    }
                };
    
    this.carouselList[i] = new carousel(params);
    main.log("Generating carousel: " + folderName + " with index num: "+i+" \n" + this.carouselList[i].getHtml() + " \n")
    
    //this.carouselList[i].setFocus();
    //main.log(this.carouselList[i].getHtml())
    this.carouselPosition.inc(1)
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
    //main.log(firstElement)//.getNamedItem('title').value)

}

controller.prototype.cycleXML = function cycleXML(root) {
    //rootTagsItem = root.getElementsByTagName("item");
    //rootTagsFolder = root.getElementsByTagName("folder")
    rootChildren = root.childNodes;
    var children = []
    //main.log("folder title: "+root.getAttribute('title'));
    folderName = root.getAttribute('title');
    var elems = []
    var it = {};
    for (var c=0; c<rootChildren.length; c++) {
        if (rootChildren.item(c).tagName === 'item') {
            it = {
                "name": rootChildren.item(c).getAttribute('title'),
                "classType": "files"
            }
            elems.push(it);
        }
        if (rootChildren[c].tagName === 'folder') {
            subItems = rootChildren[c];
            it = {
                "name": rootChildren.item(c).getAttribute('title'),
                "classType": "links"
            }            
            elems.push(it);
            children.push(subItems);
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
    /*for (var r = 0; r< rootTagsFolder.length; r ++ ) {
        folder = rootTagsFolder[r];
        main.log("folder: "+folder.getAttribute('title'))
        folderInFolder = folder.getElementsByTagName("folder");
        for (var v = 0; v < folderInFolder.length; v++) {
            itemsInFolder = folderInFolder[v].getElementsByTagName('item');
            subItemsLen = itemsInFolder.length;
            main.log(folderInFolder[v].getAttribute('title'));
            for (var t=0; t<subItemsLen; t++) {
                if (itemsInFolder[t].getAttribute('title')) {
                    main.log("item: "+itemsInFolder[t].getAttribute('title'))
                } else {
                    main.log("Error malformed XML.")
                }

            }
        }
    }*/



controller.prototype.xmlToArray = function xmlToArray() {
    folders = this.data.getElementsByTagName("folder");
    items = this.data.getElementsByTagName("item");
    home = folders.firstChild//.getAttribute('title')
    this.items = []
    root = folders[0]
for (i=0;i<root.childNodes.length;i++)
  {
  main.log('hhhh')
  main.log("x: "+root.childNodes[i]);
  //main.log(": ");
  //main.log(x[i].childNodes[0].nodeValue);
  //main.log("<br>");
  }

   

    if (folders.hasChildNodes) {
        children = folders.childNodes;
        for (c in children) {
            //smain.log("children:" + children[c] + " c: " +c )
            var subfolder = children
            //main.log("len: "+subfolder[0].nodeName)
        }

    }
    for (var o=0; o<folders.length; o++){
       //main.log(folders[o])
       main.log("folders: "+folders[o].getAttribute('title'));
       nodes = folders[o].childNodes;
       for (prop in nodes) {
           //main.log(prop + " : "+ nodes[prop])
       }
       for (var r = 0; r < nodes.length; r++) {
           //main.log("fl: "+nodes[r]['childNodes'])
           for (prop1 in nodes[r]['childNodes'].item(0)) {
               main.log(prop1 +" :<: ")//+nodes[r][prop1])
           }
           subnodes = nodes[r]['childNodes'];
           for (var g = 0; g< subnodes; g++) {
               main.log(subnodes.item(g))
               for (sss in subnodes.item(g)) {
                   main.log(sss + " :sss: " + subnodes.item(g)[sss])
               }
           }
       }
       
       // First array of folders.
       this.items[o] = [];
       for (var s = 0; s < folders[o].childNodes.length; s++) {
           this.items[o][s] = folders[o].childNodes[s]
       }
    }
    //main.log(this.items)
}

controller.prototype.generateUI = function generateUI() {
    var data = this.data;
    for (obj in data) {
        main.log(data.obj);
    }
}

