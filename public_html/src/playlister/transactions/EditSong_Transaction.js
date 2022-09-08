import jsTPS_Transaction from "../../common/jsTPS.js"
/**
 * EditSong_Transaction
 * 
 * This class represents a transaction that works with drag
 * and drop. It will be managed by the transaction stack.
 * 
 * @author McKilla Gorilla
 * @author ?
 */
export default class EditSong_Transaction extends jsTPS_Transaction {
    constructor(initModel,editSongIndex,newSongName,newArtistName,newYoutubeId) {
        super();
        this.model = initModel;
        this.editSongIndex = editSongIndex;
        this.oldSongName= this.model.currentList.songs[this.editSongIndex].title;
        this.oldArtistName=this.model.currentList.songs[this.editSongIndex].artist;
        this.oldYoutubeId=this.model.currentList.songs[this.editSongIndex].youTubeId;
        this.newSongName = newSongName;
        this.newArtistName=newArtistName;
        this.newYoutubeId=newYoutubeId;
    }

    doTransaction() {
        this.model.editSong(this.editSongIndex,this.newSongName,this.newArtistName,this.newYoutubeId)
    }
    
    undoTransaction() {
        this.model.editSong(this.editSongIndex,this.oldSongName,this.oldArtistName,this.oldYoutubeId);
    }
}