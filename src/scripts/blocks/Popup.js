(function () {
    class Popup {
        constructor() {
            this.togglePopup = this.togglePopup.bind(this);

            this.popup = document.querySelector('.popup');
            if(this.popup===null){
                return;
            }
            this.backgroundOverlay = document.querySelector('.popup__background-overlay');
            this.closePopupButton = document.querySelector('.popup__close-button');
            this.editButton = document.querySelector('.popup__edit-button');

            this.closePopupButton.addEventListener('click',this.togglePopup);
            this.editButton.addEventListener('click',this.togglePopup);
            document.addEventListener('tableSave',this.togglePopup);

        }

        togglePopup(){
            this.popup.classList.toggle('popup--opened');
            this.backgroundOverlay.classList.toggle('popup__background-overlay--visible');
        }

    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", ()=>{new Popup()});
    } else {
        new Popup();
    }
})();