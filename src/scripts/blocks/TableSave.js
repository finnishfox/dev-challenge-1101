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