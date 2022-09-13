/**
 * PlaylistController.js
 * 
 * This class provides responses for all user interface interactions.
 * 
 * @author McKilla Gorilla
 * @author ?
 */
export default class PlaylisterController {
    constructor() { }

    /*
        setModel 

        We are using an MVC-type approach, so this controller class
        will respond by updating the application data, which is managed
        by the model class. So, this function registers the model 
        object with this controller.
    */
    setModel(initModel) {
        this.model = initModel;
        this.initHandlers();
    }

    /*
        initHandlers

        This function defines the event handlers that will respond to interactions
        with all the static user interface controls, meaning the controls that
        exist in the original Web page. Note that additional handlers will need
        to be initialized for the dynamically loaded content, like for controls
        that are built as the user interface is interacted with.
    */
    initHandlers() {
        // SETUP THE TOOLBAR BUTTON HANDLERS
        this.initEditToolbarHandlers();

        // SETUP THE MODAL HANDLERS
        this.initModalHandlers();
    }

    /*
        initEditToolbarHandlers

        Specifies event handlers for buttons in the toolbar.
    */
    initEditToolbarHandlers() {
        // HANDLER FOR ADDING A NEW LIST BUTTON
        document.getElementById("add-list-button").onmousedown = (event) => {
            let newList = this.model.addNewList("Untitled", []);
            this.model.loadList(newList.id);
            this.model.saveLists();
            
        }
        // HANDLER FOR UNDO BUTTON
        document.getElementById("undo-button").onmousedown = (event) => {
            this.model.undo();
        }
        // HANDLER FOR REDO BUTTON
        document.getElementById("redo-button").onmousedown = (event) => {
            this.model.redo();
        }
        // HANDLER FOR CLOSE LIST BUTTON
        document.getElementById("close-button").onmousedown = (event) => {
            this.model.unselectAll();
            this.model.unselectCurrentList();

            //foolproof
            //close the list, enable add-list-button and disable add,redo,undo,close
            this.model.view.enableButton("add-list-button");
            //CLOSE LIST->SET CURRENTLIST AS NULL->DISABLE ADDSONG,UNDO,REDO,CLOSE
            if(this.model.currentList==null){
                this.model.view.disableButton("add-song-button");
                this.model.view.disableButton("undo-button");
                this.model.view.disableButton("redo-button");
                this.model.view.disableButton("close-button");
            }
        }
        // HANDLER FOR ADDING A NEW SONG BUTTON
        document.getElementById("add-song-button").onmousedown = (event) => {
            //let newSong = this.model.addNewSong("Untitled", "Unknown","dQw4w9WgXcQ");
            let newSong =  { //create a song object
                title:"Untitled", 
                artist:"Unknown",
                youTubeId:"dQw4w9WgXcQ"
            };
            //add the transaction into the stack and perform do
            this.model.addSongTransaction(newSong.title, newSong.artist, newSong.youTubeId);

            //foolproof
            //ADD A SONG STILL COUNT AS EDIT->CURRENTLIST NOT NULL-> SO DISABLE ADD LIST
            if(!(this.model.currentList==null)){
                this.model.view.disableButton("add-list-button");
            }
        }
    }

    /*
        initModalHandlers

        Specifies  event handlers for when confirm and cancel buttons
        are pressed in the three modals.
    */
    initModalHandlers() {
        // RESPOND TO THE USER CONFIRMING TO DELETE A PLAYLIST
        let deleteListConfirmButton = document.getElementById("delete-list-confirm-button");
        deleteListConfirmButton.onclick = (event) => {
            // NOTE THAT WE SET THE ID OF THE LIST TO REMOVE
            // IN THE MODEL OBJECT AT THE TIME THE ORIGINAL
            // BUTTON PRESS EVENT HAPPENED
            let deleteListId = this.model.getDeleteListId();

            // DELETE THE LIST, THIS IS NOT UNDOABLE
            this.model.deleteList(deleteListId);

            // ALLOW OTHER INTERACTIONS
            this.model.toggleConfirmDialogOpen();

            // CLOSE THE MODAL
            let deleteListModal = document.getElementById("delete-list-modal");
            deleteListModal.classList.remove("is-visible");
            
            //foolproof
            //IF DELETE LIST WHEN NO LIST IS SELECTED
            if(!(this.model.hasCurrentList())){
                this.model.view.enableButton("add-list-button");
                this.model.view.disableButton("add-song-button");
                this.model.view.disableButton("redo-button");
                this.model.view.disableButton("undo-button");
                this.model.view.disableButton("close-button");
            }
            //If DELETE LIST WHEN THERE IS A SELECTED LIST
            else{
                this.model.view.disableButton("add-list-button");
                this.model.view.enableButton("add-song-button");
                this.model.view.enableButton("redo-button");
                this.model.view.enableButton("undo-button");
                this.model.view.enableButton("close-button");
            }
        }

        // RESPOND TO THE USER CLOSING THE DELETE PLAYLIST MODAL
        let deleteListCancelButton = document.getElementById("delete-list-cancel-button");
        deleteListCancelButton.onclick = (event) => {
            // ALLOW OTHER INTERACTIONS
            this.model.toggleConfirmDialogOpen();
            
            // CLOSE THE MODAL
            let deleteListModal = document.getElementById("delete-list-modal");
            deleteListModal.classList.remove("is-visible");

            //foolproof
            //IF CLOSE DELETE LIST WHEN NO LIST IS SELECTED
            if(!(this.model.hasCurrentList())){
                this.model.view.enableButton("add-list-button");
                this.model.view.disableButton("add-song-button");
                this.model.view.disableButton("redo-button");
                this.model.view.disableButton("undo-button");
                this.model.view.disableButton("close-button");
            }
            


        }      
        
        // RESPOND TO THE USER CONFIRMING TO DELETE A SONG
        let deleteSongConfirmButton = document.getElementById("delete-song-confirm-button");
        deleteSongConfirmButton.onclick = (event) => {
            // NOTE THAT WE SET THE ID OF THE LIST TO REMOVE
            // IN THE MODEL OBJECT AT THE TIME THE ORIGINAL
            // BUTTON PRESS EVENT HAPPENED
            let deleteSongIndex = this.model.getDeleteSongIndex();

            // DELETE THE SONG, THIS IS NOT UNDOABLE
            this.model.removeSongTransaction(deleteSongIndex);
            

            // ALLOW OTHER INTERACTIONS
            this.model.toggleConfirmDialogOpen();

            // CLOSE THE MODAL
            let deleteSongModal = document.getElementById("delete-song-modal");
            deleteSongModal.classList.remove("is-visible");

            //foolproof
            //DELETE SONG STILL COUNT AS EDIT->CURRENTLIST NOT NULL-> SO DISABLE ADD LIST
            if(!(this.model.currentList==null)){
                this.model.view.disableButton("add-list-button");
            }
        }

        // RESPOND TO THE USER CLOSING THE DELETE SONG MODAL
        let deleteSongCancelButton = document.getElementById("delete-song-cancel-button");
        deleteSongCancelButton.onclick = (event) => {
            // ALLOW OTHER INTERACTIONS
            this.model.toggleConfirmDialogOpen();
            
            // CLOSE THE MODAL
            let deleteSongModal = document.getElementById("delete-song-modal");
            deleteSongModal.classList.remove("is-visible");

            //foolproof
            //DELETE SONG STILL COUNT AS EDIT->CURRENTLIST NOT NULL-> SO DISABLE ADD LIST
            if(!(this.model.currentList==null)){
                this.model.view.disableButton("add-list-button");
            }
        }      

         // RESPOND TO THE USER CONFIRMING TO EDIT A PLAYLIST
         let editListConfirmButton = document.getElementById("edit-song-confirm-button");
         editListConfirmButton.onclick = (event) => {
             // NOTE THAT WE SET THE INDEX OF THE SONG TO EDIT
             // IN THE MODEL OBJECT AT THE TIME THE ORIGINAL
             // BUTTON PRESS EVENT HAPPENED
             let editSongIndex = this.model.getEditSongIndex();
             //GET THE VALUE FOR NEW SONG, ARTIST AND YOUTUBEID
             let newSongName=document.getElementById("edit-song-prompt").value;
             let newArtistName=document.getElementById("edit-artist-prompt").value;
             let newYoutubeId=document.getElementById("edit-youtubeid-prompt").value;

             // EDIT THE LIST AND ADD TO TRANSACTION, THIS IS NOT UNDOABLE
             this.model.editSongTransaction(editSongIndex,newSongName,newArtistName,newYoutubeId);
             
             // ALLOW OTHER INTERACTIONS
             this.model.toggleConfirmDialogOpen();
 
             // CLOSE THE MODAL
             let editSongModal = document.getElementById("edit-song-modal");
             editSongModal.classList.remove("is-visible");
            
             //foolproof
            //EDIT A SONG->CURRENTLIST NOT NULL-> SO DISABLE ADD LIST
            if(!(this.model.currentList==null)){
                this.model.view.disableButton("add-list-button");
            }
             
         }

        // RESPOND TO THE USER CLOSING THE EDIT SONG MODAL
        let editSongCancelButton = document.getElementById("edit-song-cancel-button");
        editSongCancelButton.onclick = (event) => {
            // ALLOW OTHER INTERACTIONS
            this.model.toggleConfirmDialogOpen();
            
            // CLOSE THE MODAL
            let editSongModal = document.getElementById("edit-song-modal");
            editSongModal.classList.remove("is-visible");

            //foolproof
            //EDIT SONG STILL COUNT AS EDIT->CURRENTLIST NOT NULL-> SO DISABLE ADD LIST
            if(!(this.model.currentList==null)){
                this.model.view.disableButton("add-list-button");
            }
        }  

    }

    /*
        registerListSelectHandlers

        This function specifies event handling for interactions with a
        list selection controls in the left toolbar. Note that we say these
        are for dynamic controls because the items in the playlists list is
        not known, it can be any number of items. It's as many items as there
        are playlists, and users can add new playlists and delete playlists.
        Note that the id provided must be the id of the playlist for which
        to register event handling.
    */
    registerListSelectHandlers(id) {
        // HANDLES SELECTING A PLAYLIST
        document.getElementById("playlist-" + id).onmousedown = (event) => {
            // MAKE SURE NOTHING OLD IS SELECTED
            this.model.unselectAll();

            // GET THE SELECTED LIST
            this.model.loadList(id);

            //selected a list to edit->, disable add-list-buttons
            this.model.view.disableButton("add-list-button");
            //selected a list->enable add-song-buttons
            this.model.view.enableButton("add-song-button");
        }

        // HANDLES DELETING A PLAYLIST
        document.getElementById("delete-list-" + id).onmousedown = (event) => {
            // DON'T PROPOGATE THIS INTERACTION TO LOWER-LEVEL CONTROLS
            this.ignoreParentClick(event);

            // RECORD THE ID OF THE LIST THE USER WISHES TO DELETE
            // SO THAT THE MODAL KNOWS WHICH ONE IT IS
            this.model.setDeleteListId(id);

            // VERIFY THAT THE USER REALLY WANTS TO DELETE THE PLAYLIST
            // THE CODE BELOW OPENS UP THE LIST DELETE VERIFICATION DIALOG
            this.listToDeleteIndex = this.model.getListIndex(id);
            let listName = this.model.getList(this.listToDeleteIndex).getName();
            let deleteSpan = document.getElementById("delete-list-span");
            deleteSpan.innerHTML = "";
            deleteSpan.appendChild(document.createTextNode(listName));
            let deleteListModal = document.getElementById("delete-list-modal");

            // OPEN UP THE DIALOG
            deleteListModal.classList.add("is-visible");
            this.model.toggleConfirmDialogOpen();
        }
        // FOR RENAMING THE LIST NAME
        document.getElementById("list-card-text-" + id).ondblclick = (event) => {
            let text = document.getElementById("list-card-text-" + id)
            // CLEAR THE TEXT
            text.innerHTML = "";

            // ADD A TEXT FIELD
            let textInput = document.createElement("input");
            textInput.setAttribute("type", "text");
            textInput.setAttribute("id", "list-card-text-input-" + id);
            textInput.setAttribute("value", this.model.currentList.getName());
            textInput.style.width = "100%"

            // CHANGE THE CONTROL TO AN EDITABLE TEXT FIELD
            text.appendChild(textInput);
            this.model.refreshToolbar();

            // SPECIFY HANDLERS FOR THE TEXT FIELD
            textInput.ondblclick = (event) => {
                this.ignoreParentClick(event);
            }
            textInput.onkeydown = (event) => {
                if (event.key === 'Enter') {
                    this.model.renameCurrentList(event.target.value, id);
                    this.model.refreshToolbar();
                }
            }
            textInput.onblur = (event) => {
                this.model.renameCurrentList(event.target.value, id);
                this.model.refreshToolbar();
            }
            textInput.focus();
            let temp = textInput.value;
            textInput.value = "";
            textInput.value = temp;
        }
        
    }

    /*
        registerItemHandlers

        This function specifies event handling for interactions with the
        playlist song items, i.e. cards. Note that we say these
        are for dynamic controls because the cards in the playlist are
        not known, it can be any number of songs. It's as many cards as there
        are songs in the playlist, and users can add and remove songs.
    */
    registerItemHandlers() {
        
        // SETUP THE HANDLERS FOR ALL SONG CARDS, WHICH ALL GET DONE
        // AT ONCE EVERY TIME DATA CHANGES, SINCE IT GETS REBUILT EACH TIME
        for (let i = 0; i < this.model.getPlaylistSize(); i++) {
            // GET THE CARD
            let card = document.getElementById("playlist-card-" + (i + 1));
            
            // NOW SETUP ALL CARD DRAGGING HANDLERS AS THE USER MAY WISH TO CHANGE
            // THE ORDER OF SONGS IN THE PLAYLIST

            // MAKE EACH CARD DRAGGABLE
            card.setAttribute('draggable', 'true')

            // WHEN DRAGGING STARTS RECORD THE INDEX
            card.ondragstart = (event) => {
                card.classList.add("is-dragging");
                event.dataTransfer.setData("from-id", i);
            }

            // WE ONLY WANT OUR CODE, NO DEFAULT BEHAVIOR FOR DRAGGING
            card.ondragover = (event) => {
                event.preventDefault();
            }

            // STOP THE DRAGGING LOOK WHEN IT'S NOT DRAGGING
            card.ondragend = (event) => {
                card.classList.remove("is-dragging");
            }

            // WHEN AN ITEM IS RELEASED WE NEED TO MOVE THE CARD
            card.ondrop = (event) => {
                event.preventDefault();
                // GET THE INDICES OF WHERE THE CARD IS BRING DRAGGED FROM AND TO
                let fromIndex = Number.parseInt(event.dataTransfer.getData("from-id"));
                let toIndex = Number.parseInt(event.target.id.split("-")[2]) - 1;

                // ONLY ADD A TRANSACTION IF THEY ARE NOT THE SAME
                // AND BOTH INDICES ARE VALID
                if ((fromIndex !== toIndex)
                    && !isNaN(fromIndex) 
                    && !isNaN(toIndex)) {
                    this.model.addMoveSongTransaction(fromIndex, toIndex);
                }
            }
        }

        //FOR DELETING A SONG
        for (let i = 0; i < this.model.getPlaylistSize(); i++) {
            // GET THE CARD
            let card = document.getElementById("delete-song-playlist-card-" + (i + 1));
         // HANDLES DELETING A SONG
            card.onmousedown = (event) => {
            // DON'T PROPOGATE THIS INTERACTION TO LOWER-LEVEL CONTROLS
            this.ignoreParentClick(event);
            
            // RECORD THE INDEX OF THE SONG THE USER WISHES TO DELETE
            // SO THAT THE MODAL KNOWS WHICH ONE IT IS
            this.model.setDeleteSongIndex(i);

            // VERIFY THAT THE USER REALLY WANTS TO DELETE THE SONG
            // THE CODE BELOW OPENS UP THE LIST DELETE VERIFICATION DIALOG
            let songName = this.model.getSong(i).title;
            let deleteSpanSong = document.getElementById("delete-song-span");
            deleteSpanSong.innerHTML = "";
            deleteSpanSong.appendChild(document.createTextNode(songName));
            let deleteSongModal = document.getElementById("delete-song-modal");

            // OPEN UP THE DIALOG
            deleteSongModal.classList.add("is-visible");
            this.model.toggleConfirmDialogOpen();
        }
    }

        //FOR EDITING A SONG
        for (let i = 0; i < this.model.getPlaylistSize(); i++) {
            // GET THE CARD
            let card = document.getElementById("playlist-card-" + (i + 1));
         // HANDLES EDITING A SONG
         // CHECK TAHT EACH SONG IS I
            card.ondblclick = (event) => {
            // DON'T PROPOGATE THIS INTERACTION TO LOWER-LEVEL CONTROLS
            this.ignoreParentClick(event);
            
            // RECORD THE INDEX OF THE SONG THE USER WISHES TO EDIT
            // SO THAT THE MODAL KNOWS WHICH ONE IT IS
            this.model.setEditSongIndex(i);

            // VERIFY THAT THE USER REALLY WANTS TO DELETE THE SONG
            // THE CODE BELOW OPENS UP THE LIST DELETE VERIFICATION DIALOG
        
            
           // let songName = this.model.getSong(i).title;
           //SET THE VALUE TO RESPECTIVE TITLE,ARTIST AND YOUTUBEID: USED FOR DEFAULT VALUE IN EDIT BOXES
            document.getElementById("edit-song-prompt").value=this.model.getSong(i).title;
            document.getElementById("edit-artist-prompt").value=this.model.getSong(i).artist;
            document.getElementById("edit-youtubeid-prompt").value=this.model.getSong(i).youTubeId;
            
            let editSongModal = document.getElementById("edit-song-modal");
           
            // OPEN UP THE DIALOG
            editSongModal.classList.add("is-visible");
            this.model.toggleConfirmDialogOpen();
        }
    }

    }

    /*
        ignoreParentClick

        This function makes sure the event doesn't get propogated
        to other controls.
    */
    ignoreParentClick(event) {
        event.cancelBubble = true;
        if (event.stopPropagation) event.stopPropagation();
    }
}
