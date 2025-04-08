import { useState, useRef } from "react";

export default function LoveButton() {
  const [question, setQuestion] = useState("Do you love me?");
  const [gifSrc, setGifSrc] = useState(
    "https://media.tenor.com/tHIWuvLhtlYAAAAj/dudu-dudu-bubu.gif"
  );
  const noBtnRef = useRef(null);
  const wrapperRef = useRef(null);

  const handleYesClick = () => {
    setQuestion("I love you too !!");
    setGifSrc("https://media.tenor.com/hmYv6-dCkGgAAAAi/bubu-dudu-bubu.gif");
  };

  const handleNoHover = () => {
    if (noBtnRef.current && wrapperRef.current) {
      const wrapperRect = wrapperRef.current.getBoundingClientRect();
      const noBtnRect = noBtnRef.current.getBoundingClientRect();

      const maxX = Math.max(0, wrapperRect.width - noBtnRect.width - 10);
      const maxY = Math.max(0, wrapperRect.height - noBtnRect.height - 10);

      const randomX = Math.random() * maxX;
      const randomY = Math.random() * maxY;

      noBtnRef.current.style.transform = `translate(${randomX}px, ${randomY}px)`;
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 overflow-hidden">
      <div
        ref={wrapperRef}
        className="relative flex flex-col items-center p-6 bg-pink-300 shadow-lg rounded-lg max-w-sm w-full h-80"
      >
        <h2 className="text-xl font-bold text-red-500 mb-3">{question}</h2>
        <img src={gifSrc} alt="gif" className="w-52 mb-3" />
        <div className="relative w-full flex justify-center gap-3">
          <button
            className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition"
            onClick={handleYesClick}
          >
            Yes
          </button>
          <button
            ref={noBtnRef}
            className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition absolute"
            onMouseOver={handleNoHover}
            style={{ position: "absolute" }}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}
