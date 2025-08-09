export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "right-image": "linear-gradient(45deg, #141466 0%, #5258fb 100%)",
        "background-image": "linear-gradient(135deg, rgb(100, 195, 133) 0%, #5258fb 50%, rgb(160, 144, 232) 100%)",
      },
      keyframes: {
        toastIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        toastOut: {
          "0%": { opacity: 1 },
          "100%": { opacity: 0 },
        },
      },
      animation: {
        toastIn: "toastIn 0.3s ease-out forwards",
        toastOut: "toastOut 0.3s ease-out forwards",
      },
    },
  },
  plugins: [],
};
