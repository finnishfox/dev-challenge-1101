(function () {
    class TableSave {
        constructor() {
            this.save = this.save.bind(this);

            this.saveButton = document.querySelector('.tasks-table__save-button');
            this.saveButton.addEventListener('click', this.save);
        }

        save() {
            document.dispatchEvent(new CustomEvent('tableSave'));
            this.saveButton.blur();
        }
    }

    new TableSave();
})();