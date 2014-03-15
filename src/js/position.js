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
    this.oldIndex = this.index;
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
    if (typeof offset === 'undefined')
        offset = 1;
    if (this.index < this.len) {
        this.index += offset;    
    } else {
        this.index = this.len - 1;
    }
};

/*
 * Decreases current carousel index.
 * @param {Number} Decreases index by this amount.
 */
position.prototype.dec = function dec(offset) {
    if (typeof offset === 'undefined')
        offset = 1;
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