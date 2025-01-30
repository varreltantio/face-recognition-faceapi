const video = document.getElementById("video");

Promise.all([
  faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
  faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
]).then(startWebcam);

function startWebcam() {
  navigator.mediaDevices
    .getUserMedia({
      video: true,
      audio: false,
    })
    .then((stream) => {
      video.srcObject = stream;
    })
    .catch((error) => {
      console.error(error);
    });
}

async function getLabels() {
  try {
    const response = await fetch("http://localhost:3000/api/labels");
    return await response.json();
  } catch (error) {
    console.error("Gagal mengambil label:", error);
    return [];
  }
}

async function getLabeledFaceDescriptions() {
  const labels = await getLabels();
  return Promise.all(
    labels.map(async (label) => {
      const descriptions = [];
      try {
        const response = await fetch(`http://localhost:3000/api/labels/${label}`);
        const files = await response.json();

        const imageFiles = files.filter(file =>
          /\.(png|jpe?g)$/i.test(file)
        );

        for (const imageFile of imageFiles) {
          try {
            const img = await faceapi.fetchImage(`./labels/${label}/${imageFile}`);
            const detections = await faceapi
              .detectSingleFace(img)
              .withFaceLandmarks()
              .withFaceDescriptor();
            if (detections) {
              descriptions.push(detections.descriptor);
            } else {
              console.warn(`Wajah tidak terdeteksi pada ${label}/${imageFile}`);
            }
          } catch (err) {
            console.warn(`Gagal memuat gambar ${label}/${imageFile}`);
          }
        }
      } catch (err) {
        console.warn(`Gagal membaca folder ${label}`);
      }
      return new faceapi.LabeledFaceDescriptors(label, descriptions);
    })
  );
}

video.addEventListener("play", async () => {
  const labeledFaceDescriptors = await getLabeledFaceDescriptions();
  const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors);

  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);

  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);

  setInterval(async () => {
    const detections = await faceapi
      .detectAllFaces(video)
      .withFaceLandmarks()
      .withFaceDescriptors();

    const resizedDetections = faceapi.resizeResults(detections, displaySize);

    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

    const results = resizedDetections.map((d) => {
      return faceMatcher.findBestMatch(d.descriptor);
    });
    results.forEach((result, i) => {
      const box = resizedDetections[i].detection.box;
      const drawBox = new faceapi.draw.DrawBox(box, {
        label: result,
      });
      drawBox.draw(canvas);
    });
  }, 100);
});
