import React from 'react';

const Footer = () => {
  return (
    <div className="w-full md:w-[calc(100%-12rem)] mx-auto mt-4">
      <footer className="flex flex-col items-center justify-around w-full py-16 text-sm bg-slate-50 text-gray-800/70">
        <a href="http://phraseworks.com">
          <img src="/images/pw-full.svg" className="w-[220px]" alt="Logo Image" loading="lazy" />
        </a>
        <p className="mt-4 text-center">
          Copyright © 2025 <a href="https://phraseworks.com">Phraseworks</a>. All rights reservered.
        </p>
        {/* <div class="flex items-center gap-4 mt-6"> */}
        {/* <a href="#" class="font-medium text-gray-800 hover:text-black transition-all">
            Brand Guidelines
          </a> */}
        {/* <div class="h-4 w-px bg-black/20"></div>
          <a href="#" class="font-medium text-gray-800 hover:text-black transition-all">
            Trademark Policy
          </a> */}
        {/* </div> */}
      </footer>
    </div>
  );
};

export default Footer;
