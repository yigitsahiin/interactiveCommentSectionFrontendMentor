const data = {
  currentUser: {
    image: {
      png: "https://picsum.photos/id/237/30/30",
      webp: "./images/avatars/image-juliusomo.webp",
    },
    id: 3,
    username: "juliusomo",
  },
  comments: [
    {
      id: 1,
      content:
        "Impressive! Though it seems the drag feature could be improved. But overall it looks incredible. You've nailed the design and the responsiveness at various breakpoints works really well.",
      createdAt: "1 month ago",
      score: 12,
      user: {
        id: 2,
        image: {
          png: "./images/avatars/image-amyrobson.png",
          webp: "./images/avatars/image-amyrobson.webp",
        },
        username: "amyrobson",
      },
      replies: [],
    },
    {
      id: 2,
      content:
        "Woah, your project looks awesome! How long have you been coding for? I'm still new, but think I want to dive into React as well soon. Perhaps you can give me an insight on where I can learn React? Thanks!",
      createdAt: "2 weeks ago",
      score: 5,
      user: {
        id: 1,
        image: {
          png: "./images/avatars/image-maxblagun.png",
          webp: "./images/avatars/image-maxblagun.webp",
        },
        username: "maxblagun",
      },
      replies: [
        {
          id: 3,
          content:
            "If you're still new, I'd recommend focusing on the fundamentals of HTML, CSS, and JS before considering React. It's very tempting to jump ahead but lay a solid foundation first.",
          createdAt: "1 week ago",
          score: 4,
          replyingTo: "maxblagun",
          user: {
            image: {
              png: "./images/avatars/image-ramsesmiron.png",
              webp: "./images/avatars/image-ramsesmiron.webp",
            },
            username: "ramsesmiron",
          },
        },
        {
          id: 4,
          content:
            "I couldn't agree more with this. Everything moves so fast and it always seems like everyone knows the newest library/framework. But the fundamentals are what stay constant.",
          createdAt: "2 days ago",
          score: 2,
          replyingTo: "ramsesmiron",
          user: {
            image: {
              png: "./images/avatars/image-juliusomo.png",
              webp: "./images/avatars/image-juliusomo.webp",
            },
            username: "juliusomo",
          },
        },
      ],
    },
  ],
};

function localStorageExists() {
  //eğer localde comment değişkenini buluyorsan yeni yazdıgımı burada güncelle eger bulamazsan comments datadaki commentsdir zaten hali hazırda var güvence aslında burası.
  let comments;
  const cachedComments = localStorage.getItem("comments");
  if (cachedComments) {
    comments = JSON.parse(cachedComments);
  } else {
    comments = data.comments;
    localStorage.setItem("comments", JSON.stringify(comments));
  }

  return comments;
}

function saveTheLocalStorage(object) {
  let comments = localStorageExists();
  comments.push(object);
  localStorage.setItem("comments", JSON.stringify(comments));
}

const commentsContainer = document.querySelector(".comments");

function createCommentItem(comment) {
  const { id, content, createdAt, score, user } = comment;
  return `
  
  <div class="comment" data-commentid="${id}">
      <div class="comment-rating">
          <a href="#" class="comment-rating-up" data-commentid="${id}">
              +
          </a>
          <strong>${score}</strong>
          <a href="#" class="comment-rating-down" data-commentid="${id}">
              -
          </a>
          
      </div>
      <div class="comment-body">
          <div class="comment-header">
              <div class="profile-info">
                  <img src="https://picsum.photos/id/${user.id}/40/40" alt="">
                  <strong>${user.username}</strong>
                  <span>${createdAt}</span>
              </div>
              ${
                comment.user.id === data.currentUser.id
                  ? `<div><a class="delete-btn" href="#" data-commentid="${id}">
                          Sil
                      </a>
                      <a class="edit-btn" href="#" data-commentid="${id}">
                          Düzenle
                      </a></div>`
                  : `<a class="reply-btn" href="#" data-commentid="${id}">
                      Cevap Yaz
                  </a>`
              }
          </div>
          <p contenteditable="false">${content}</p>
          <div class="update-comment-div" style="display:none;">
              <textarea></textarea>
              <button data-commentid="${id}" class="update-comment">Güncelle</button>
          </div>
      </div>
  </div>
  `;
}

function createUniqueId() {
  let id = 1;
  const commentIds = data.comments.map((comment) => comment.id);
  while (commentIds.includes(id)) {
    id++;
  }
  return id;
}
let toDeleteComment = null;
const dialog = document.querySelector("dialog");
function deleteComment(e) {
  e.preventDefault();
  const commentId = parseInt(this.dataset.commentid);
  const comment = searchCommentById(commentId);
  toDeleteComment = comment;
  dialog.showModal();
  bindEvents();
}

function deleteCommentFunc(e) {
  e.preventDefault();
  const commentIndex = data.comments.indexOf(toDeleteComment);
  if (e.target.id === "delete") {
    data.comments.splice(commentIndex, 1);
    localStorage.setItem("comments", JSON.stringify(data.comments)); // LocalStorage güncellendi
    renderComments();
  }
  dialog.close();
}

function editComment(e) {
  e.preventDefault();
  const commentId = parseInt(this.dataset.commentid);
  // const newComment = prompt("İçeriği neyle değiştirmek istersin?");
  const editedComment = data.comments.find(
    (comment) => comment.id === commentId
  );
  const textareaDiv =
    e.target.parentElement.parentElement.nextElementSibling.nextElementSibling;
  textareaDiv.style.display = "block";

  // editedComment.content = newComment;
  // renderComments();
  // this.parentElement.parentElement.nextElementSibling.setAttribute("contenteditable", true);
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

  renderComments();

  e.target.reset();
}

function updateComment(e) {
  e.preventDefault();
  const commentId = parseInt(e.target.dataset.commentid);
  const editedComment = data.comments.find(
    (comment) => comment.id === commentId
  );
  const newComment = e.target.previousElementSibling.value;
  editedComment.content = newComment;
  localStorage.setItem("comments", JSON.stringify(data.comments)); // LocalStorage güncellendi
  renderComments();
}

function bindEvents() {
  const newCommentForm = document.querySelector(".new-comment form");
  const ratingUpBtns = document.querySelectorAll(".comment-rating-up");
  const ratingDownBtns = document.querySelectorAll(".comment-rating-down");
  const deleteBtns = document.querySelectorAll(".delete-btn");
  const editBtns = document.querySelectorAll(".edit-btn");
  const dialogBtns = document.querySelectorAll(".dialog-btn");
  const updateCommentBtns = document.querySelectorAll(".update-comment");

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

  for (const dialogBtn of dialogBtns) {
    dialogBtn.addEventListener("click", deleteCommentFunc);
  }

  for (const updateCommentBtn of updateCommentBtns) {
    updateCommentBtn.addEventListener("click", updateComment);
  }

  newCommentForm.addEventListener("submit", handleNewCommentForm);
}

function searchCommentById(id) {
  let searchedComment = null;
  for (const comment of data.comments) {
    if (comment.id === id) {
      searchedComment = comment;
      break;
    }
  }
  return searchedComment;
}

function rateCommentUp(e) {
  e.preventDefault();
  const commentId = parseInt(this.dataset.commentid);
  const comment = searchCommentById(commentId);
  comment.score++;

  renderComments();
}

function rateCommentDown(e) {
  e.preventDefault();
  const commentId = parseInt(this.dataset.commentid);
  const comment = searchCommentById(commentId);
  comment.score--;

  renderComments();
}

function renderComments() {
  commentsContainer.innerHTML = "";
  for (const comment of data.comments) {
    commentsContainer.innerHTML += createCommentItem(comment);
  }
  bindEvents();
}

function init() {
  const cachedComments = localStorage.getItem("comments");
  if (cachedComments) {
    data.comments = JSON.parse(cachedComments);
  } else {
    localStorage.setItem("comments", JSON.stringify(data.comments));
  }
  renderComments();
}

init();
