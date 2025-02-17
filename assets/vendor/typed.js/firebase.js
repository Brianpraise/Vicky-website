// Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "vickyportfolio-166f8.firebaseapp.com",
    projectId: "vickyportfolio-166f8",
    storageBucket: "vickyportfolio-166f8.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID",
    databaseURL: "https://vickyportfolio-166f8-default-rtdb.firebaseio.com"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();
const database = firebase.database();

function uploadVideo() {
    const file = document.getElementById("videoUpload").files[0];
    if (!file) {
        alert("Please select a video to upload!");
        return;
    }

    const storageRef = storage.ref('videos/' + file.name);
    const uploadTask = storageRef.put(file);

    uploadTask.on('state_changed', 
        (snapshot) => {
            let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
        }, 
        (error) => {
            console.error("Upload failed:", error);
        }, 
        () => {
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                database.ref('videos').push({
                    url: downloadURL
                });
                alert("Video uploaded successfully!");
                loadVideos();
            });
        }
    );
}

// Function to Load and Display Videos
function loadVideos() {
    const videoList = document.getElementById("videoList");
    videoList.innerHTML = "";
    
    database.ref('videos').once('value', (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            let videoData = childSnapshot.val();
            let videoElement = document.createElement("video");
            videoElement.src = videoData.url;
            videoElement.controls = true;
            videoElement.style.width = "100%";
            videoList.appendChild(videoElement);
        });
    });
}

// Load videos on page load
document.addEventListener("DOMContentLoaded", loadVideos);
