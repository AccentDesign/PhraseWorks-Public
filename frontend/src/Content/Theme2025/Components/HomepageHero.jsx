import React, { useState } from 'react';

const HomepageHero = () => {
  const textToCopy = 'npm install -g phraseworks@latest';
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 200); // reset after 1s
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="w-full md:w-[calc(100%-12rem)] mx-auto">
      <div className="flex flex-col items-center bg-gradient-to-b from-black to-[#1A0033] text-white pb-16 text-sm relative">
        <img
          src="/images/gridPatternBg.svg"
          alt="hero-bg"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />

        <h1 className="text-4xl md:text-6xl text-center font-medium max-w-3xl mt-5 bg-gradient-to-r from-white to-[#748298] text-transparent bg-clip-text mt-20">
          Welcome.
        </h1>
        <p className="text-slate-100 md:text-base max-md:px-2 text-center max-w-xl mt-3">
          Welcome to the site, we hope you find the content interesting!
        </p>

        <a
          href="http://phraseworks.com"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 mt-8 rounded-full transition"
        >
          <span>Find out more about Phraseworks</span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.166 10h11.667m0 0L9.999 4.167M15.833 10l-5.834 5.834"
              stroke="#fff"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>

        {/* Copy command block */}
        <div className="bg-gradient-to-t from-indigo-900 to-slate-600 p-px rounded-md mt-8 mb-20">
          <div className="flex items-center gap-4 bg-black rounded-md px-4 py-3">
            $ <span>{textToCopy}</span>
            <button
              onClick={handleCopy}
              className={`p-2 rounded transition-colors duration-300 ${
                copied ? 'bg-green-600' : 'bg-transparent'
              }`}
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 17 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14.498 5.5h-7.5a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h7.5a1.5 1.5 0 0 0 1.5-1.5V7a1.5 1.5 0 0 0-1.5-1.5"
                  stroke="#fff"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2.5 11.5c-.825 0-1.5-.675-1.5-1.5V2.5C1 1.675 1.675 1 2.5 1H10c.825 0 1.5.675 1.5 1.5"
                  stroke="#fff"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomepageHero;
