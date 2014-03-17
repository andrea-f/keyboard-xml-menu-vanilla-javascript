/*
 * @author Andrea Fassina.
 * Code provided by  Code is under bsd license 2.
 * controller.js holds data fetching capability.
 * @date 15-03-2014
 */

function position(params){
    //Holds carousel current index.
    this.index = null;
    
    //Previous index than current.
    this.oldIndex = null;
    
    //List length
    this.len = null;
}

/*
 * Sets carousel index.
 * @param {Number} 0 based number for carousel index.
 */
position.prototype.setIndex = function setIndex(index) {
    if(this.getIndex()===index)
        return;
    if ( (index<0) ){
        index = 0;
    }
    if ((index>=this.len) ){
        index = this.len-1;
    }
    if (typeof index === 'undefined')
        index = 0;
    this.setOldIndex(this.index);
    this.index = index;
};

/*
 * Returns current index.
 * @return {Number} with current index.
 */
position.prototype.getIndex = function getIndex() {
    return this.index;
};

/*
 * Increases current index.
 * @param {Number} Increases index by this amount.
 */
position.prototype.inc = function inc(offset) {
    this.setOldIndex();
    if (typeof offset === 'undefined') {
        offset = 1;
        if (this.index < this.len) {
            this.index += offset;
        } else {
            this.index = this.len - 1;
        }
    } else {
        this.index += offset;
    }
    
};

/*
 * Decreases current carousel index.
 * @param {Number} Decreases index by this amount.
 */
position.prototype.dec = function dec(offset) {
    this.setOldIndex();
    if (typeof offset === 'undefined') {
        offset = 1;
    }
    if (this.index > 0) 
        this.index -= offset;    
};

/*
 * Sets list length to ease increase and decrease process.
 * @param {Number} total list length.
 */
position.prototype.setLength = function setLength(total) {
    if (typeof total !== 'undefined')
        this.len = total;
};

/*
 * Returns list length.
 * @return {Number} list length.
 */
position.prototype.getLength = function getLength() {
    return this.len;
};

/*
 * Sets old index.
 * @type {Number} oldpos number to set old index to.
 */
position.prototype.setOldIndex = function setOldIndex(oldpos) {
    if (typeof oldpos === 'undefined')
        oldpos = this.index
    this.oldIndex = oldpos;
}

/*
 * Returns old index.
 */
position.prototype.getOldIndex = function getOldIndex() {
    return this.oldIndex;
}