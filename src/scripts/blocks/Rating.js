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