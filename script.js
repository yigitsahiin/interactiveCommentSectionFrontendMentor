const COMMENTS_STORAGE_KEY = "commentsData";

function saveCommentsToLocalStorage() {
  localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(data.comments));
}

function loadCommentsFromLocalStorage() {
  const storedComments = localStorage.getItem(COMMENTS_STORAGE_KEY);
  if (storedComments) {
    data.comments = JSON.parse(storedComments);
  }
}

function init() {
  loadCommentsFromLocalStorage();
  renderComments();
}

function renderComments() {
  commentsContainer.innerHTML = "";
  for (const comment of data.comments) {
    commentsContainer.innerHTML += createCommentItem(comment);
  }
  bindEvents();
}

function handleNewCommentForm(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const formObj = Object.fromEntries(formData);
  formObj.id = createUniqueId();
  formObj.createdAt = "now";
  formObj.score = 0;
  formObj.replies = [];
  formObj.user = data.currentUser;

  data.comments.push(formObj);
  saveCommentsToLocalStorage();
  renderComments();

  e.target.reset();
}

function deleteComment(e) {
  e.preventDefault();
  const commentId = parseInt(this.dataset.commentid);
  const commentIndex = data.comments.findIndex(
    (comment) => comment.id === commentId
  );

  if (commentIndex !== -1) {
    data.comments.splice(commentIndex, 1);
    saveCommentsToLocalStorage();
    renderComments();
  }
}

function editComment(e) {
  e.preventDefault();
  const commentId = parseInt(this.dataset.commentid);
  const newComment = prompt("İçeriği neyle değiştirmek istersin?");
  const editedComment = data.comments.find(
    (comment) => comment.id === commentId
  );
  editedComment.content = newComment;
  saveCommentsToLocalStorage();
  renderComments();
}

function rateCommentUp(e) {
  e.preventDefault();
  const commentId = parseInt(this.dataset.commentid);
  const comment = searchCommentById(commentId);
  comment.score++;
  saveCommentsToLocalStorage();
  renderComments();
}

function rateCommentDown(e) {
  e.preventDefault();
  const commentId = parseInt(this.dataset.commentid);
  const comment = searchCommentById(commentId);
  comment.score--;
  saveCommentsToLocalStorage();
  renderComments();
}

function bindEvents() {
  const newCommentForm = document.querySelector(".new-comment form");
  const ratingUpBtns = document.querySelectorAll(".comment-rating-up");
  const ratingDownBtns = document.querySelectorAll(".comment-rating-down");
  const deleteBtns = document.querySelectorAll(".delete-btn");
  const editBtns = document.querySelectorAll(".edit-btn");

  for (const ratingUpBtn of ratingUpBtns) {
    ratingUpBtn.addEventListener("click", rateCommentUp);
  }

  for (const ratingDownBtn of ratingDownBtns) {
    ratingDownBtn.addEventListener("click", rateCommentDown);
  }

  for (const deleteBtn of deleteBtns) {
    deleteBtn.addEventListener("click", deleteComment);
  }

  for (const editBtn of editBtns) {
    editBtn.addEventListener("click", editComment);
  }

  newCommentForm.addEventListener("submit", handleNewCommentForm);
}

init();
