# Face Recognition Project

This project uses face recognition with the `face-api.js` library to identify faces from images dynamically loaded from the server. The goal is to train a face recognition model with labeled images, and then match faces from a webcam stream.

## Features
- Dynamically loads labeled images from the server.
- Uses the `face-api.js` library for face detection and recognition.
- Matches faces detected in a webcam stream with the preloaded labeled face descriptors.
- Supports multiple image formats: `.png`, `.jpg`, and `.jpeg`,.

## Technologies Used
- **JavaScript**: For the main face recognition logic.
- **face-api.js**: A JavaScript library for face detection and recognition.
- **Express**: For setting up the server and serving image files (if you're using Node.js).
- **HTML5**: For video capture and display.

## Setup

### Prerequisites
- Node.js and npm (for the server side if you're running it locally).
- `face-api.js` library (included in the project).
  
### Steps to Run the Project

1. **Clone the repository:**

   ```bash
   git clone https://github.com/varreltantio/face-recognition-javascript-webcam.git
   cd face-recognition-project

2. **Install dependencies:**

   ```bash
   npm install

3. **Start the server:**

   ```bash
   node server.js

4. **Open the project in a browser:**
Open the index.html file in your browser or navigate to http://localhost:3000 (if the server is running).