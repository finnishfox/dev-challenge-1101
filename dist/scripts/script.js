class Comment {
    constructor(deleteButton = null) {
        if (deleteButton !== null) {
            this.deleteButton = deleteButton;
            this.deleteComment = this.deleteComment.bind(this);
            this.deleteButton.addEventListener('click', () => this.deleteComment(deleteButton));
        }
        this.addComment = this.addComment.bind(this);
    }

    addComment(event) {
        let input = event.target;
        let newCommentText = input.value;
        if (!newCommentText) return;
        let tooltip = input.closest('.tasks-table__tooltip');
        let list = tooltip.querySelector('.reviews');
        let commentTemplate = document.querySelector('#comment');
        commentTemplate.content.querySelector('.reviews__content').innerText = newCommentText;
        const comment = document.importNode(commentTemplate.content, true);
        if (list) { //there are some comments
            list.appendChild(comment);
        } else { //there are no comments, adding first comment
            let ul = document.createElement('ul');
            ul.className = 'reviews';
            ul.appendChild(comment);
            tooltip.insertBefore(ul, input);
        }
        new Comment(tooltip.querySelector('li:last-child .reviews__delete-button'));
        input.value = '';
    }

    deleteComment(deleteButton) {
        let comment = deleteButton.parentNode;
        let list = comment.parentNode;
        if (list.childNodes.length === 1) {
            list.remove();
            return;
        }
        comment.remove();
    }
}
(function () {
    class CommentTooltip {
        constructor(button) {
            this.button = button;
            this.handleKeyAction = this.handleKeyAction.bind(this);
            this.showTooltip = this.showTooltip.bind(this);
            button.addEventListener('click', () => this.showTooltip(button));
        }

        showTooltip(button) {
            let tooltipTemplate = document.querySelector('#add-comment-tooltip');
            let parent = button.parentElement;
            if (parent.querySelector('.tasks-table__tooltip') !== null) { // if tooltip already opened
                return;
            }

            let clone = document.importNode(tooltipTemplate.content, true);
            const input = clone.querySelector('.tasks-table__tooltip-input');
            parent.appendChild(clone);
            this.tooltip = input.parentNode;

            if (button.classList.contains('tasks-table__comment-button--commented')) {
                let commentsTemplate = document.querySelector('#comments-list');
                const comments = document.importNode(commentsTemplate.content, true);
                input.parentNode.insertBefore(comments,input);

                const deleteCommentButtons = document.querySelectorAll('.reviews__delete-button');
                deleteCommentButtons.forEach(deleteButton => {
                    new Comment(deleteButton);
                });
            }


            input.focus();
            button.classList.add('tasks-table__comment-button--pressed');
            document.addEventListener('keydown', this.handleKeyAction);
        }

        handleKeyAction(event) {
            if (event.key === "Escape") {
                document.removeEventListener('keydown', this.handleKeyAction);
                this.tooltip.parentNode.removeChild(this.tooltip);
                this.button.classList.remove('tasks-table__comment-button--pressed');
            }else if(event.key === "Enter"){
               new Comment().addComment(event);
            }
        }
    }

   function initCommentTooltips(){
    const addCommentButtons = document.querySelectorAll('.tasks-table__comment-button');
    addCommentButtons.forEach(button => {
        new CommentTooltip(button);
    });}

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initCommentTooltips);
    } else {
        new initCommentTooltips();
    }

})();
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
(function () {
    class Rating {
        constructor(button) {
            this.toggleRatingTooltip = this.toggleRatingTooltip.bind(this);
            this.showRatingTooltip = this.showRatingTooltip.bind(this);
            this.hideRatingTooltip = this.hideRatingTooltip.bind(this);
            this.setRange = this.setRange.bind(this);
            this.setInputValue = this.setInputValue.bind(this);
            this.changeRangeBackground = this.changeRangeBackground.bind(this);
            this.setRatingInTd = this.setRatingInTd.bind(this);
            this.getPercents = this.getPercents.bind(this);

            this.open = false;
            this.showRatingTooltipButton = button;

            this.showRatingTooltipButton.addEventListener('click', this.toggleRatingTooltip);

            document.addEventListener('closepopups', () => {
                if (this.open) this.hideRatingTooltip();
            })
        }


        toggleRatingTooltip() {
            if (this.open) {
                this.hideRatingTooltip();
            } else {
                this.showRatingTooltip();
            }
        }

        hideRatingTooltip() {
            this.open = false;
            const cell = this.showRatingTooltipButton.parentNode;
            const current = cell.querySelector('.tasks-table__rating-tooltip');
            //current.parentNode.removeChild(current);
            current.remove();
        }

        getPercents(rating, min, max) {
            return ((rating - min) * 100) / (max - min);
        }

        setRatingInTd(rating) {
            const column = this.ratingTooltip.closest('.tasks-table__column');
            column.querySelector('.tasks-table__rating').innerText = rating;
            const ratingLine = column.querySelector('.tasks-table__progress span');
            if (parseInt(rating) === 5) {
                ratingLine.classList.add('tasks-table__progress--full');
                ratingLine.style.width = '100%';
            } else {
                ratingLine.classList.remove('tasks-table__progress--full');
                const percents = this.getPercents(rating, this.min, this.max);
                ratingLine.style.width = `${percents}%`;
            }
        }

        showRatingTooltip() {
            document.dispatchEvent(new CustomEvent('closepopups'));
            this.open = true;
            let template = document.querySelector('#rating-tooltip');
            const rating = document.importNode(template.content, true);
            this.ratingTooltip = rating.querySelector('.tasks-table__rating-tooltip');
            this.ratingInput = rating.querySelector('.tasks-table__input-rating');
            this.rangeInput = rating.querySelector('.range');
            this.min = this.rangeInput.getAttribute('min');
            this.max = this.rangeInput.getAttribute('max');

            const cell = this.showRatingTooltipButton.parentNode;
            const current = cell.querySelector('.tasks-table__rating');
            if (!current) {
                cell.querySelector('.tasks-table__no-rated-text').remove();
                let ratingTemplate = document.querySelector('#rating');
                const ratingElement = document.importNode(ratingTemplate.content, true);
                cell.appendChild(ratingElement);
            }

            this.rangeInput.value = current === null ? 3 : current.innerText;
            this.ratingInput.value = this.rangeInput.value;
            this.changeRangeBackground();
            this.ratingInput.addEventListener('input', this.setRange);
            this.rangeInput.addEventListener('input', this.setInputValue);
            this.rangeInput.addEventListener('mouseup', () => {
                this.rangeInput.blur();
            });

            cell.appendChild(rating);
            document.dispatchEvent(new CustomEvent('ratingChanged', {
                detail: this.showRatingTooltipButton,
            }));
        }

        setRange(event) {
            this.rangeInput.value = event.target.value; //set range value from input field
            this.changeRangeBackground();
            this.setRatingInTd(this.rangeInput.value);
            document.dispatchEvent(new CustomEvent('ratingChanged', {
                detail: this.rangeInput,
            }));
        }

        setInputValue(event) {
            this.ratingInput.value = event.target.value;  //set input value from range
            this.changeRangeBackground();
            this.setRatingInTd(this.ratingInput.value);
            document.dispatchEvent(new CustomEvent('ratingChanged', {
                detail: this.rangeInput,
            }));
        }

        changeRangeBackground() {
            const percents = this.getPercents(this.rangeInput.value, this.min, this.max);
            this.rangeInput.style.backgroundImage = `linear-gradient(to right, #FFD200 0%, #FFD200 ${percents}%, #F0F0F0 ${percents}%, #F0F0F0 100%)`;
        }
    }

    function initRating() {
        const buttons = document.querySelectorAll('.tasks-table__rate-button');
        buttons.forEach(button => {
            new Rating(button);
        })
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initRating);
    } else {
        initRating();
    }

})();
(function () {
    class TableSave {
        constructor() {
            this.save = this.save.bind(this);

            this.saveButton = document.querySelector('.tasks-table__save-button');
            if(this.saveButton===null){
                return;
            }
            this.saveButton.addEventListener('click', this.save);
        }

        save() {
            document.dispatchEvent(new CustomEvent('tableSave'));
            this.saveButton.blur();
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", ()=>{new TableSave()});
    } else {
        new TableSave();
    }
})();
(function () {
    class TableSummary {
        constructor() {
            this.checkRatings = this.checkRatings.bind(this);
            document.addEventListener('ratingChanged', this.checkRatings);
        }

        getPercents(rating, min, max) {
            return ((rating - min) * 100) / (max - min);
        }

        checkRatings(event) {
            const row = event.detail.closest('.tasks-table__row');
            const inputs = row.querySelectorAll('.tasks-table__column:not(:last-child) .tasks-table__rating');
            if (inputs.length > 3) {
                row.classList.add('tasks-table__row--full');

                let output = row.lastChild.querySelector('.tasks-table__rating');
                if (output === null) {
                    let ratingTemplate = document.querySelector('#rating');
                    const ratingElement = document.importNode(ratingTemplate.content, true);
                    row.lastChild.appendChild(ratingElement);
                    output = row.lastChild.querySelector('.tasks-table__rating');
                }
                const range = row.lastChild.querySelector('.tasks-table__progress span');
                const summ = Array.from(inputs).reduce((acc, input) => {
                    return acc + parseInt(input.innerHTML,10)
                }, 0);
                const result = summ/inputs.length;
                output.innerHTML = result.toFixed(2);
                if (parseInt(result,10) === 5) {
                    range.classList.add('tasks-table__progress--full');
                    range.style.width = '100%';
                } else {
                    range.classList.remove('tasks-table__progress--full');
                    const percents = this.getPercents(result, 1, 5);
                    range.style.width = `${percents}%`;
                }
            }
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", ()=>{new TableSummary()});
    } else {
        new TableSummary();
    }

})();