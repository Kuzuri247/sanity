import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MoveUpRight } from "lucide-react";

const NewsItem = ({ title, description, url, urlToImage }) => {
  return (
    <div className="flex flex-col justify-between rounded-lg bg-black pb-4 cursor-pointer group relative transition-all">
      <div className="h-full w-full">
        <Image
          src={urlToImage}
          width={400}
          height={400}
          className="h-[400px] w-auto object-cover rounded-t-lg"
          alt={title}
        />
      </div>

      <div className="text-md font-bold text-slate-200 p-4 ">{title}</div>

      <div>
        <p className="text-sm text-gray-400 px-4">{description}</p>
      </div>

      <div className="hidden group-hover:flex transition-all flex-col p-[10px] justify-center items-center bg-[rgba(0,0,0,0.95)] h-full w-full absolute top-0">
        <Link
          className="bg-black text-white font-semibold hover:bg-tertiary transition-all text-[15px] px-2 py-2 border border-slate-700 rounded-lg"
          href={url}
          target="_blank"
          aria-label="read-article"
        >
          <div className="flex items-center">
            <span className=" px-2 ">Read Article</span>
            <MoveUpRight />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default NewsItem;
