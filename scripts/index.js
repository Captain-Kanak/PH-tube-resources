// console.log("js connected");

function removeActiveClass() {
  const activeButtons = document.getElementsByClassName("active");
  // console.log(activeButtons);

  for (let btn of activeButtons) {
    btn.classList.remove("active");
  }
}

function loadCategories() {
  // fetch particular data
  fetch("https://openapi.programming-hero.com/api/phero-tube/categories")
    .then((response) => response.json())
    .then((data) => displayCategories(data.categories));
}

function loadVideos(searchInput = "") {
  fetch(`https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchInput}`)
    .then((response) => response.json())
    .then((data) => {
      removeActiveClass()
      document.getElementById("btn-all").classList.add("active");
      displayVideos(data.videos)
    });
}

function loadVideoDetails(videoID) {
  // console.log(videoID);

  const url = `https://openapi.programming-hero.com/api/phero-tube/video/${videoID}`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => displayVideoDetails(data.video))
}

function displayVideoDetails(video) {
  // console.log(video);

  document.getElementById("video_details").showModal();
  const detailsContainer = document.getElementById("details_container");
  detailsContainer.innerHTML = `
  <div class="card bg-base-100 image-full shadow-sm">
    <figure>
      <img src="${video.thumbnail}" alt="" />
    </figure>
    <div class="card-body">
      <h2 class="card-title">Video Title: ${video.title}</h2>
      <h2>Author Name: <span class="text-xl">${video.authors[0].profile_name}</span></h2>
      <h2>
      ${video.authors[0].verified == true ?
      `This User is Verified`
      : `This User is not Verified`}
      </h2>
      <h2>Video Views: ${video.others.views}</h2>
      <p>Video Desccription: ${video.description}</p>
    </div>
  </div>
  `
}

function loadVideosByCategories(id) {
  const url = `https://openapi.programming-hero.com/api/phero-tube/category/${id}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      removeActiveClass();
      const activeButton = document.getElementById(`btn-${id}`)
      activeButton.classList.add("active")
      // console.log(activeButton);

      displayVideos(data.category)
    })
}

function displayCategories(categories) {
  // console.log(categories);

  // get the container
  const categoryContainer = document.getElementById("category-container");

  // loop operation on Array of Object
  for (let cat of categories) {
    // console.log(cat);

    // create element
    const categoryDiv = document.createElement("div");
    categoryDiv.innerHTML = `
    <button id="btn-${cat.category_id}" onclick="loadVideosByCategories(${cat.category_id})" 
      class="btn btn-sm hover:bg-[#FF1F3D] hover:text-white">
      ${cat.category}
    </button>
    `;
    // append the element
    categoryContainer.append(categoryDiv);
  }
}

function displayVideos(videos) {
  // console.log(videos);

  // get the container
  const videosContainer = document.getElementById("videos-container");

  videosContainer.innerHTML = "";

  if (videos.length == 0) {
    videosContainer.innerHTML = `
    <div class="py-20 col-span-full flex flex-col items-center justify-center gap-5">
      <img class="w-[140px]" src="./assets/Icon.png" alt="">
      <h2 class="text-3xl font-bold">Oops!! Sorry, There is no content here</h2>
    </div>
    `;
    return;
  }

  // loop operation on Array of Object
  videos.forEach((video) => {
    // console.log(video);

    // create element
    const videoCard = document.createElement("div");
    videoCard.innerHTML = `
    <div class="bg-base-100">
      <figure class="relative">
        <img class="w-full h-[200px] object-cover rounded-lg" src="${video.thumbnail}" alt="" />
        <span class="bg-black text-white text-sm font-light absolute bottom-2 right-2 py-1 px-2 rounded-lg">
          3hrs 56 min ago
        </span>
      </figure>
      <div class="py-5 flex gap-5 px-0">
        <!-- profile -->
        <div>
          <div class="avatar">
              <div class="w-10 rounded-full">
                <img src="${video.authors[0].profile_picture}" />
              </div>
          </div>
        </div>
        <!-- intro -->
        <div class="space-y-2">
          <h2 class="text-base font-bold">${video.title}</h2>
          <h4 class="text-sm text-gray-500 flex items-center gap-2">
            ${video.authors[0].profile_name}
            ${video.authors[0].verified == true ?
        `<img class="w-5" src="https://img.icons8.com/?size=100&id=98A4yZTt9abw&format=png&color=000000" alt="">`
        : ``}
          </h4>
          <p class="text-sm text-gray-500">${video.others.views} views</p>
        </div>
      </div>
      <button onclick="loadVideoDetails('${video.video_id}')" class="btn btn-block">Video Details</button>
    </div>
    `;

    // append the element
    videosContainer.append(videoCard);
  });
}

document.getElementById("search-input").addEventListener("keyup", (text) => {
  const input = text.target.value;
  // console.log(input);

  loadVideos(input);
})

loadCategories();
// loadVideos();
