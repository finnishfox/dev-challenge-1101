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
            console.log('inputs: ',inputs);
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
                    console.log(input.innerHTML);
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

    new TableSummary();

})();