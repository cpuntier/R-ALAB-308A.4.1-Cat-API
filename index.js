import * as Carousel from "./Carousel.js";
import axios from "axios";

// The breed selection input element.
const breedSelect = document.getElementById("breedSelect");
// The information section div element.
const infoDump = document.getElementById("infoDump");
// The progress bar div element.
const progressBar = document.getElementById("progressBar");
// The get favourites button element.
const getFavouritesBtn = document.getElementById("getFavouritesBtn");

// Step 0: Store your API key here for reference and easy access.
const API_KEY =
  "live_oc3Tu0YjDffQRd7dAjGgkLGSsTSZs8qEh7DGGDpD5YrbXGWLNImtGYsa1Hhvpq3o";

axios.defaults.onDownloadProgress = updateProgress;
axios.defaults.headers = { "x-api-key": API_KEY };

/**
 * 1. Create an async function "initialLoad" that does the following:
 * - Retrieve a list of breeds from the cat API using fetch().
 * - Create new <options> for each of these breeds, and append them to breedSelect.
 *  - Each option should have a value attribute equal to the id of the breed.
 *  - Each option should display text equal to the name of the breed.
 * This function should execute immediately.
 */
async function initialLoad() {
  console.log("This is running now");

  const response = await axios
    .get(" https://api.thecatapi.com/v1/breeds")
    .then(function (response) {
      console.log(response.data);
      response.data.forEach((breed) => {
        const option = document.createElement("option");
        option.setAttribute("value", breed.id);
        option.textContent = breed.name;
        breedSelect.appendChild(option);
      });
    })
    .catch(function (error) {
      console.log("There was an error");
    })
    .finally(function () {
      console.log("Success");
    });
  console.log("This finished running");
}
initialLoad();
handlerBreedSelection();
/**
 * 2. Create an event handler for breedSelect that does the following:
 * - Retrieve information on the selected breed from the cat API using fetch().
 *  - Make sure your request is receiving multiple array items!
 *  - Check the API documentation if you're only getting a single object.
 * - For each object in the response array, create a new element for the carousel.
 *  - Append each of these new elements to the carousel.
 * - Use the other data you have been given to create an informational section within the infoDump element.
 *  - Be creative with how you create DOM elements and HTML.
 *  - Feel free to edit index.html and styles.css to suit your needs, but be careful!
 *  - Remember that functionality comes first, but user experience and design are important.
 * - Each new selection should clear, re-populate, and restart the Carousel.
 * - Add a call to this function to the end of your initialLoad function above to create the initial carousel.
 */
breedSelect.addEventListener("change", handlerBreedSelection);

async function handlerBreedSelection() {
  // let config = {
  //   headers: { "x-api-key": API_KEY },
  //   onDownloadProgress: updateProgress,
  // };
  const favourites = await getFavourites();

  const response = await axios
    .get(
      `https://api.thecatapi.com/v1/images/search?limit=10&breed_ids=${breedSelect.value}`
    )
    .then(function (response) {
      buildCarousel(response.data, favourites, breedSelect.value);
    })
    .catch(function (err) {
      console.log("There is a problem");
    });
}

/**
 * 3. Fork your own sandbox, creating a new one named "JavaScript Axios Lab."
 */
/**
 * 4. Change all of your fetch() functions to axios!
 * - axios has already been imported for you within index.js.
 * - If you've done everything correctly up to this point, this should be simple.
 * - If it is not simple, take a moment to re-evaluate your original code.
 * - Hint: Axios has the ability to set default headers. Use this to your advantage
 *   by setting a default header with your API key so that you do not have to
 *   send it manually with all of your requests! You can also set a default base URL!
 */
/**
 * 5. Add axios interceptors to log the time between request and response to the console.
 * - Hint: you already have access to code that does this!
 * - Add a console.log statement to indicate when requests begin.
 * - As an added challenge, try to do this on your own without referencing the lesson material.
 */
axios.interceptors.request.use((request) => {
  request.metadata = request.metadata || {};
  request.metadata.startTime = new Date().getTime();
  //console.log("THERE IS A REQUEST!!!");
  if (progressBar.style.width == "100%") {
    progressBar.style.width = "0%";
  }
  document.body.style.cursor = "progress";
  return request;
});

axios.interceptors.response.use(
  (response) => {
    response.config.metadata.endTime = new Date().getTime();
    response.config.metadata.durationInMS =
      response.config.metadata.endTime - response.config.metadata.startTime;
    //console.log("A response came in!");

    console.log(
      `Request took ${response.config.metadata.durationInMS} milliseconds.`
    );
    document.body.style.cursor = "";
    return response;
  },
  (error) => {
    error.config.metadata.endTime = new Date().getTime();
    error.config.metadata.durationInMS =
      error.config.metadata.endTime - error.config.metadata.startTime;

    console.log(
      `Request took ${error.config.metadata.durationInMS} milliseconds.`
    );
    throw error;
  }
);

/**
 * 6. Next, we'll create a progress bar to indicate the request is in progress.
 * - The progressBar element has already been created for you.
 *  - You need only to modify its "width" style property to align with the request progress.
 * - In your request interceptor, set the width of the progressBar element to 0%.
 *  - This is to reset the progress with each request.
 * - Research the axios onDownloadProgress config option.
 * - Create a function "updateProgress" that receives a ProgressEvent object.
 *  - Pass this function to the axios onDownloadProgress config option in your event handler.
 * - console.log your ProgressEvent object within updateProgess, and familiarize yourself with its structure.
 *  - Update the progress of the request using the properties you are given.
 * - Note that we are not downloading a lot of data, so onDownloadProgress will likely only fire
 *   once or twice per request to this API. This is still a concept worth familiarizing yourself
 *   with for future projects.
 */

function updateProgress(progressEvent) {
  //console.log("Current proggress", progressEvent);
  const percentCompleted = (progressEvent.loaded / progressEvent.total) * 100;
  //console.log(percentCompleted);
  progressBar.style.width = percentCompleted + "%";
}

/**
 * 7. As a final element of progress indication, add the following to your axios interceptors:
 * - In your request interceptor, set the body element's cursor style to "progress."
 * - In your response interceptor, remove the progress cursor style from the body element.
 */
/**
 * 8. To practice posting data, we'll create a system to "favourite" certain images.
 * - The skeleton of this function has already been created for you.
 * - This function is used within Carousel.js to add the event listener as items are created.
 *  - This is why we use the export keyword for this function.
 * - Post to the cat API's favourites endpoint with the given ID.
 * - The API documentation gives examples of this functionality using fetch(); use Axios!
 * - Add additional logic to this function such that if the image is already favourited,
 *   you delete that favourite using the API, giving this function "toggle" functionality.
 * - You can call this function by clicking on the heart at the top right of any image.
 */
export async function favourite(imgId) {
  const heart = document.getElementById(imgId);
  // console.log("is this heart?", heart);

  // your code here
  let favId;
  const favourites = await getFavourites();
  if (heart.className === "favourite-button-clicked") {
    // console.log("heart is red");
    // heart.lastElementChild.classList.remove("favourite-button-clicked");
    // heart.lastElementChild.classList.add("favourite-button");
    heart.className = "favourite-button";
  } else {
    // console.log("jeart is pink");
    //    heart.lastElementChild.style.color = "red";
    heart.className = "favourite-button-clicked";
  }
  //console.log("his is the imgId", imgId);
  let favInfo = isFavourite(imgId, favourites);

  console.log("This is what you clicked on", imgId.target);

  if (favInfo[0]) {
    //console.log("Need To delete");
    const deleteFavourite = await axios.delete(
      `https://api.thecatapi.com/v1/favourites/${favInfo[1]}`
    );
  } else {
    const favbtn = document.querySelector(".favourite-button");
    // console.log("Adding image to favorites");
    const newFavorite = await axios.post(
      "https://api.thecatapi.com/v1/favourites",
      { image_id: imgId, sub_id: imgId + "12" }
    );
  }
  //console.log("There are your favourites", favourites);
}
/**
 * 9. Test your favourite() function by creating a getFavourites() function.
 * - Use Axios to get all of your favourites from the cat API.
 * - Clear the carousel and display your favourites when the button is clicked.
 *  - You will have to bind this event listener to getFavouritesBtn yourself.
 *  - Hint: you already have all of the logic built for building a carousel.
 *    If that isn't in its own function, maybe it should be so you don't have to
 *    repeat yourself in this section.
 */
getFavouritesBtn.addEventListener("click", buildFavourites);

async function getFavourites() {
  const favourites = await axios.get("https://api.thecatapi.com/v1/favourites");
  return favourites.data;
}

function isFavourite(imgId, favourites) {
  let isFavourite = false;
  let favId;
  for (let i in favourites) {
    if (favourites[i]["image_id"] === imgId) {
      isFavourite = true;
      favId = favourites[i]["id"];
      break;
    }
  }
  //console.log("HERE IS THE RESULT OF ISFAVOURITE FUNCTION", isFavourite, favId);
  return [isFavourite, favId]; // returns arry with boolean and id of that favorite for deletion
}

async function buildFavourites() {
  const favourites = await getFavourites();
  const myFavourites = [];
  for (let i in favourites) {
    myFavourites.push(favourites[i].image);
  }
  buildCarousel(myFavourites, favourites, "favourite");
}

async function buildCarousel(response, favourites, breedName) {
  infoDump.innerHTML = "";
  Carousel.clear();
  const breedInfo = await axios.get(
    `https://api.thecatapi.com/v1/images/search?breed_ids=${breedName}`
  );
  if (breedInfo.data.length > 0) {
    //console.log("Check out this object!" /*breedInfo.data[0].breeds*/);
    let tablerow = "";
    let breedInfoData = breedInfo.data[0].breeds[0];
    let breedInfoKeys = Object.keys(breedInfoData);
    infoDump.innerHTML = breedInfoData.description;
    infoDump.innerHTML +=
      "<br><br><h2>Here are some stats on the breed below</h2><h6>(Number ratings are on a scale of 0-5)</h6>";
    infoDump.innerHTML += "<table>";
    let tableHTML = "<table>";
    for (let i in breedInfoKeys) {
      console.log(breedInfoKeys[i]);
      console.log(breedInfoData[breedInfoKeys[i]]);
      if (
        breedInfoKeys[i] != "description" &&
        breedInfoKeys[i] != "country_code" //dont account for description of country code to minimize redundancy
      ) {
        if (breedInfoKeys[i] == "weight") {
          tablerow =
            "<tr><td>" +
            breedInfoKeys[i] +
            "</td><td> Imperial : " +
            breedInfoData[breedInfoKeys[i]]["imperial"] +
            " Metric: " +
            breedInfoData[breedInfoKeys[i]]["metric"];
          ("</td></tr>");
          console.log(tablerow);
          tableHTML += tablerow;
        } else {
          tablerow =
            "<tr><td>" +
            breedInfoKeys[i] +
            "</td><td>" +
            breedInfoData[breedInfoKeys[i]] +
            "</td></tr>";
          console.log(tablerow);
          tableHTML += tablerow;
        }
      }
    }
    tableHTML += "</table>";
    infoDump.innerHTML += tableHTML;
    console.log(tableHTML);
  } else {
    infoDump.innerHTML = "Sorry. No cats to show :[";
  }
  if (breedName === "favourite") {
    infoDump.innerHTML = "Here are your favorite images";
  }
  // console.log("1Here is the data", response);
  response.forEach((cat) => {
    let carouselItem = Carousel.createCarouselItem(cat.url, "blah", cat.id);
    const favBtn = carouselItem.querySelector(".favourite-button");
    favBtn.setAttribute("id", cat.id);
    let favInfo = isFavourite(cat.id, favourites);
    //  console.log("Is this cat a favorite?", favInfo[0]);
    if (favInfo[0]) {
      console.log("This cat is a favorite now it has a red heart");
      favBtn.className = "favourite-button-clicked";
    }
    Carousel.appendCarousel(carouselItem);
  });
}

/**
 * 10. Test your site, thoroughly!
 * - What happens when you try to load the Malayan breed?
 *  - If this is working, good job! If not, look for the reason why and fix it!
 * - Test other breeds as well. Not every breed has the same data available, so
 *   your code should account for this.
 */
