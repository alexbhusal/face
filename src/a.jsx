import { useRef, useEffect } from "react";
import * as faceapi from "face-api.js";

function App() {
  const videoRef = useRef();
  const canvasRef = useRef();

  // LOAD FROM USEEFFECT
  useEffect(() => {
    startVideo();
    videoRef && loadModels();
  }, []);

  // OPEN YOUR FACE WEBCAM
  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((currentStream) => {
        videoRef.current.srcObject = currentStream;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // LOAD MODELS FROM FACE API
  const loadModels = () => {
    Promise.all([
      // Face detection and landmark models
      faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
      faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
      faceapi.nets.faceExpressionNet.loadFromUri("/models"),

      // Load age and gender detection models
      faceapi.nets.ageGenderNet.loadFromUri("/models"),
    ]).then(() => {
      faceMyDetect();
    });
  };

  const faceMyDetect = () => {
    setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions()
        .withAgeAndGender();

        detections.forEach(detection => {
          console.log('Face Landmarks: ', detection.landmarks);
        });

      // DRAW YOU FACE IN WEBCAM
      canvasRef.current.innerHTML = ""; // Clear canvas before drawing
      canvasRef.current.appendChild(
        faceapi.createCanvasFromMedia(videoRef.current)
      );

      faceapi.matchDimensions(canvasRef.current, {
        width: 940,
        height: 650,
      });

      const resized = faceapi.resizeResults(detections, {
        width: 940,
        height: 650,
      });

      // Draw detections, landmarks, expressions, age, and gender
      faceapi.draw.drawDetections(canvasRef.current, resized);
      faceapi.draw.drawFaceLandmarks(canvasRef.current, resized);
      faceapi.draw.drawFaceExpressions(canvasRef.current, resized);
      // Draw age and gender
      resized.forEach((detection) => {
        const { age, gender } = detection;
        const text = `${age.toFixed(0)} years, ${gender}`;

        // Draw age and gender on the face box
        new faceapi.draw.DrawTextField(
          [text],
          detection.detection.box.bottomRight
        ).draw(canvasRef.current);
      });
    }, 2000);
  };

  return (
    <>
      <h1 className="text-red-500 text-5xl text-center  mt-10">FACE-APP</h1>
      <div className="flex w-screen h-screen items-center justify-between">
        <div className=" m-[20px]">
          <video className="rounded-2xl border-4 border-dashed border-black" crossOrigin="anonymous" ref={videoRef} autoPlay></video>
        </div>
        <canvas ref={canvasRef} width="500" height="350"  />
      </div>
    </>
  );
}

export default App;
