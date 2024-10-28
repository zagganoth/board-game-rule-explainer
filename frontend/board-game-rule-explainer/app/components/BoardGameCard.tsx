'use client';
import React from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { BackgroundGradient } from '../../components/ui/background-gradient';

export default function BoardGameCard(props: { gameName: string }) {
  return (
    <div>
      <BackgroundGradient className="rounded-[22px] p-4 sm:p-10 bg-white dark:bg-zinc-900">
        <Image
          src={`/boardgamedefault.png`}
          alt="jordans"
          height="400"
          width="400"
          className="object-contain"
        />
        <p className="text-base sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200">
          {props.gameName}
        </p>

        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
        </p>
        <button className="rounded-full pl-4 pr-1 py-1 text-white flex items-center space-x-1 bg-black mt-4 text-xs font-bold dark:bg-zinc-800">
          <span>Complexity</span>
          <span className="bg-zinc-700 rounded-full text-[0.6rem] px-2 py-0 text-white">
            <div className="flex">
              <Star fill="yellow" size={12} />
              <Star fill="yellow" size={12} />
              <Star fill="yellow" size={12} />
            </div>
          </span>
        </button>
      </BackgroundGradient>
    </div>
  );
}
