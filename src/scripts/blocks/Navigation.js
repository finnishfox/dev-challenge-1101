(function () {
    class Navigation {
        constructor() {
            this.button = document.querySelector('.navigation__toggle-button');
            this.list = document.querySelector('.navigation__list');
            this.button.addEventListener('click', this.toggle.bind(this));
        }

        toggle() {
            this.list.classList.toggle('navigation__list--open');
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", ()=>{new Navigation()});
    } else {
        new Navigation();
    }

})();