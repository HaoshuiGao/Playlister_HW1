import jsTPS_Transaction from "../../common/jsTPS.js"
/**
 * RemoveSong_Transaction
 * 
 * This class represents a transaction that works with remove song. 
 * It will be managed by the transaction stack.
 * 
 */
export default class RemoveSong_Transaction extends jsTPS_Transaction {
    constructor(initModel, initDeleteSongIndex,deletedSongObject) {
        super();
        this.model = initModel;
        this.deleteSongIndex=initDeleteSongIndex;
        this.deletedSong=deletedSongObject;
    }

    doTransaction() {
        this.model.removeSong(this.deleteSongIndex);
    }
    
    undoTransaction() {
        this.model.insertDeletedSongBack(this.deleteSongIndex,this.deletedSong);
    }
}