// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-storage.js";
import { getDatabase, ref as dbRef, push, set, onValue, onDisconnect } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "vickychepkorirportfolio.firebaseapp.com",
  projectId: "vickychepkorirportfolio",
  storageBucket: "vickychepkorirportfolio.appspot.com",
  messagingSenderId: "832198336772",
  appId: "1:832198336772:web:083fcf0555d499a64ab051",
  databaseURL: "https://vickyportfolio-166f8-default-rtdb.firebaseio.com/" 
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const database = getDatabase(app);

// Upload Video Function
document.getElementById("uploadBtn").addEventListener("click", uploadVideo);

async function uploadVideo() {
  const file = document.getElementById("videoUpload").files[0];
  if (!file) {
    alert("Please select a video file.");
    return;
  }

  const fileName = file.name;
  const fileRef = storageRef(storage, `videos/${fileName}`);
  const uploadTask = uploadBytesResumable(fileRef, file);

  const progressContainer = document.createElement('div');
  progressContainer.innerHTML = '<p>Uploading... 0%</p><progress value="0" max="100"></progress>';
  document.getElementById('videoList').appendChild(progressContainer);

  uploadTask.on('state_changed',
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      progressContainer.querySelector('p').textContent = `Uploading... ${progress.toFixed(2)}%`;
      progressContainer.querySelector('progress').value = progress;
    },
    (error) => {
      console.error("Upload failed:", error);
      progressContainer.innerHTML = `<p>Upload failed: ${error.message}</p>`;
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        saveVideoToDatabase(fileName, downloadURL, progressContainer);
      });
    }
  );
}

// Save Video URL to Firebase Database
async function saveVideoToDatabase(fileName, videoURL, progressContainer) {
  const videosRef = dbRef(database, "videos");
  const newVideoRef = push(videosRef);

  try{
    await set(newVideoRef, { name: fileName, url: videoURL });
    console.log("Video URL saved to database.");
    progressContainer.remove();
    displayVideos();
  } catch (error) {
    console.error("Error saving to database:", error);
    progressContainer.innerHTML = `<p>Database save failed: ${error.message}</p>`;
  }
}

// Display Videos from Database
function displayVideos() {
  const videoList = document.getElementById("videoList");
  videoList.innerHTML = ""; // Clear previous entries

  const videosRef = dbRef(database, "videos");
  onValue(videosRef, (snapshot) => {
    videoList.innerHTML = "";
    snapshot.forEach((childSnapshot) => {
      const videoData = childSnapshot.val();
      const videoElement = document.createElement("video");
      videoElement.src = videoData.url;
      videoElement.controls = true;
      videoElement.style = "width: 100%; max-width: 600px; margin-top: 10px;";
      videoElement.title = videoData.name; //Added title attribute for better UX
      videoList.appendChild(videoElement);
    });
  }, {onlyOnce: true}); //onlyOnce to prevent multiple renders on update

}

// Load Videos on Page Load
document.addEventListener("DOMContentLoaded", displayVideos);
