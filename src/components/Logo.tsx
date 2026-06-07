import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export default function Logo({ className = '', size = 48 }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transform transition-transform hover:scale-105 duration-300"
      >
        {/* Soft shadow background for logo boundary */}
        <circle cx="250" cy="250" r="230" fill="#ffffff" className="dark:fill-slate-900" filter="drop-shadow(0 10px 15px rgba(0,0,0,0.06))" />
        
        {/* The open book left page (Indigo) */}
        <path
          d="M 120 180 Q 200 130 250 230 L 250 380 Q 200 280 120 330 Z"
          fill="#4f46e5"
          stroke="#1e293b"
          strokeWidth="16"
          strokeLinejoin="round"
        />

        {/* The open book right page (Violet) */}
        <path
          d="M 380 180 Q 300 130 250 230 L 250 380 Q 300 280 380 330 Z"
          fill="#a855f7"
          stroke="#1e293b"
          strokeWidth="16"
          strokeLinejoin="round"
        />

        {/* Central spine highlight page fold */}
        <path
          d="M 250 230 L 250 380"
          stroke="#ffffff"
          strokeWidth="10"
          strokeLinecap="round"
        />

        {/* Play Button symbol on the center binding */}
        <polygon
          points="235,285 235,325 270,305"
          fill="#1e293b"
          stroke="#1e293b"
          strokeWidth="4"
          strokeLinejoin="round"
        />

        {/* Extra pages background highlights under book binding wings */}
        <path
          d="M 160 150 Q 210 120 235 180"
          stroke="#1e293b"
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 340 150 Q 290 120 265 180"
          stroke="#1e293b"
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
        />

        {/* The cheerful smiley curve underneath */}
        <path
          d="M 170 340 Q 250 430 330 340"
          stroke="#1e293b"
          strokeWidth="18"
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Smile dimple Left */}
        <path
          d="M 155 345 Q 165 330 180 345"
          stroke="#1e293b"
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
        />

        {/* Smile dimple Right */}
        <path
          d="M 345 345 Q 335 330 320 345"
          stroke="#1e293b"
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      <div>
        <span className="font-sans font-extrabold tracking-tight text-xl text-slate-900 dark:text-white leading-none block">
          Fun With <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Learn</span>
        </span>
        <span className="font-mono text-[9px] tracking-widest text-slate-450 uppercase leading-none block mt-0.5">
          interactive classroom
        </span>
      </div>
    </div>
  );
}
