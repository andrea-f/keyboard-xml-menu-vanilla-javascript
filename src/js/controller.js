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
      * Holds retrieved data.
      */
     this.data = null;

     /*
      * Holds carousel reference.
      */
     this.dataCarousel = null;
}

controller.prototype.init = function init() {
    this.loadXMLData();
    //this.generateCarousel();
    this.initializeUI();


}


controller.prototype.generateCarousel = function generateCarousel() {
    var name = "videos",
        direction = "horizontal",
        visibleElements = 6,
        entries = this.entries,
        totSize = 960,
        params = {
            "name": name,
                    "direction": direction,
                    "visibleElements": visibleElements,
                    "total": entries.length,
                    "subItems": entries,
                    "useArrows": true,
                    "totalSize": totSize,
                    "template": function(j,i) {
                        var html = "", f;
                        if (i === 0 && j === 0) {
                            f = "focus";
                        } else {
                            f = "";
                        }
                        //sd.log("items template: "+j+" subitems template: "+i)
                        html += "<p ><span class='files' >"+this.data[j][i].name+"</span></p>";
                        return html;
                    }
                };
    this.dataCarousel = new carousel();
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
    var d = this.data.getElementsByTagName("folder")
    main.log(d)
    //alert(d.nodeName)
    //prints home!
    //alert(d.getAttribute('title'))
    //alert(d.nodeValue)
    for (var o=0; o<d.length; o++){
       main.log(d[o].getAttribute('title'))
    }
}

controller.prototype.generateUI = function generateUI() {
    var data = this.data;
    for (obj in data) {
        main.log(data.obj);
    }
}

