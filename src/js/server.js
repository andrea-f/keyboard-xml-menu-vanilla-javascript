/*
 * @author Andrea Fassina.
 * Code provided by  Code is under bsd license 2.
 * server.js holds data fetching capability.
 * @date 15-03-2014
 */



/*
 * Server object for fetching data.
 * Currently supported XML
 * @param {Object} params holds configuration information.
 */
function server(params) {

    /*
     * Holds loaded XML document.
     */
    this.xmlDoc = null;
}

/*
 * Loads XML file for usage.
 * @param {String} location place of XML file, either local or remote.
 * @return {Object} xmlDoc file from server with xml information.
 */
server.prototype.loadXML = function loadXML(location) {    
    if (window.XMLHttpRequest) {
        xhttp=new XMLHttpRequest();
    }
    else {
        xhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xhttp.open("GET", location, false);
    xhttp.send();
    xmlDoc=xhttp.responseXML;
    console.log(xmlDoc)
    this.setXMLDoc(xmlDoc);
    return xmlDoc
}

/*
 * Sets server xml doc reference.
 * @param {Object} xmlDoc file from server with xml information.
 */
server.prototype.setXMLDoc = function setXMLDoc(xmlDoc) {
    if (typeof xmlDoc === 'undefined') {
        this.xmlDoc = xmlDoc;
    }
}
