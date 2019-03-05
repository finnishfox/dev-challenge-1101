(function () {
    class CommentTooltip {
        constructor(button) {
            this.button = button;
            this.handleKeyAction = this.handleKeyAction.bind(this);
            this.showTooltip = this.showTooltip.bind(this);
            this.closeTooltip = this.closeTooltip.bind(this);
            this.hideOnClickOutside = this.hideOnClickOutside.bind(this);
            button.addEventListener('click', () => this.showTooltip(button));
        }

        hideOnClickOutside(event) {
            const tooltip = event.target.closest('.tooltip');
            if (tooltip === null) {
                document.removeEventListener('click', this.hideOnClickOutside);
                this.closeTooltip();
            }
        }


        showTooltip(button) {
            let tooltipTemplate = document.querySelector('#add-comment-tooltip');
            let parent = button.parentElement;
            if (parent.querySelector('.tasks-table__tooltip') !== null) { // if tooltip already opened
                return;
            }
            let openedTooltip = document.querySelector('.tasks-table__tooltip');
            if (openedTooltip !== null) {
                openedTooltip.parentElement.querySelector('.tasks-table__comment-button')
                    .classList.remove('tasks-table__comment-button--pressed');
                openedTooltip.remove();
            }

            let clone = document.importNode(tooltipTemplate.content, true);
            const input = clone.querySelector('.tasks-table__tooltip-input');
            parent.appendChild(clone);
            this.tooltip = input.parentNode;

            if (button.classList.contains('tasks-table__comment-button--commented')) {
                let commentsTemplate = document.querySelector('#comments-list');
                const comments = document.importNode(commentsTemplate.content, true);
                input.parentNode.insertBefore(comments, input);

                const deleteCommentButtons = document.querySelectorAll('.reviews__delete-button');
                deleteCommentButtons.forEach(deleteButton => {
                    new Comment(deleteButton);
                });
            }


            input.focus();
            button.classList.add('tasks-table__comment-button--pressed');
            document.addEventListener('keydown', this.handleKeyAction);
            event.stopPropagation();
            event.preventDefault();
            document.addEventListener('click', this.hideOnClickOutside);
        }

        closeTooltip() {
            this.tooltip.parentNode.removeChild(this.tooltip);
            this.button.classList.remove('tasks-table__comment-button--pressed');
        }

        handleKeyAction(event) {
            if (event.key === "Escape") {
                document.removeEventListener('keydown', this.handleKeyAction);
                this.closeTooltip();
            } else if (event.key === "Enter") {
                new Comment().addComment(event);
            }
        }
    }

    function initCommentTooltips() {
        const addCommentButtons = document.querySelectorAll('.tasks-table__comment-button');
        addCommentButtons.forEach(button => {
            new CommentTooltip(button);
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initCommentTooltips);
    } else {
        new initCommentTooltips();
    }

})();