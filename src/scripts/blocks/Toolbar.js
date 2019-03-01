(function () {
    class Toolbar {
        constructor() {
            this.hoverIcons = this.hoverIcons.bind(this);
            this.hoverTimeLine = this.hoverTimeLine.bind(this);
            const toolbarIcons = document.querySelectorAll('.toolbar__icon-wrapper');
            const timeline = document.querySelector('.time');
            toolbarIcons.forEach(icon => icon.addEventListener('touchend', this.hoverIcons));
            timeline.addEventListener('touchend',this.hoverTimeLine);
        }

        hoverIcons(event) {
            event.currentTarget.classList.toggle('toolbar__icon-wrapper--opened');
        }

        hoverTimeLine(){
            event.currentTarget.classList.toggle('time--touched');
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
            new Toolbar()
        });
    } else {
        new Toolbar();
    }
})();