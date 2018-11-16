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