import jsTPS_Transaction from "../../common/jsTPS.js"
/**
 * AddSong_Transaction
 * 
 * This class represents a transaction that works with add song. 
 * It will be managed by the transaction stack.
 * 
 */
export default class AddSong_Transaction extends jsTPS_Transaction {
    constructor(initModel, initSong, initArtist,initYoutubeId) {
        super();
        this.model = initModel;
        this.song=initSong;
        this.artist=initArtist;
        this.youtubeId=initYoutubeId;
    }

    doTransaction() {
        this.model.addNewSong(this.song, this.artist, this.youtubeId);
    }
    
    undoTransaction() {
        this.model.removeSong(this.model.getPlaylistSize()-1);
    }
}