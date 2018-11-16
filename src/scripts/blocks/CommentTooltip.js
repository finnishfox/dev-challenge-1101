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