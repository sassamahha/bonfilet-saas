"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

// SwiperのCSSをインポート
import "swiper/css";
import "swiper/css/pagination";

const SLIDER_IMAGES = [
  "/images/bonfilets01.jpg",
  "/images/bonfilets02.jpg",
  "/images/bonfilets03.jpg",
  "/images/bonfilets04.jpg",
  "/images/bonfilets05.jpg",
  "/images/bonfilets06.jpg",
  "/images/bonfilets07.jpg",
];

export default function ImageSlider() {
  return (
    <div className="w-full">
      {/* PC版: 横長の1枚画像（768px以上） */}
      <div className="hidden md:block">
        <div className="flex justify-center">
          <img
            src="/images/bonfilets00.jpg"
            alt="Bonfilet"
            className="h-[600px] w-auto object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
            }}
          />
        </div>
      </div>

      {/* スマホ版: Swiperスライダー（768px未満） */}
      <div className="block md:hidden px-4 py-8">
        <Swiper
          modules={[Pagination]}
          spaceBetween={8}
          slidesPerView={1}
          loop={true}
          pagination={{
            clickable: true,
          }}
          className="w-full"
        >
          {SLIDER_IMAGES.map((src, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-full bg-slate-100 rounded-lg overflow-hidden">
                <img
                  src={src}
                  alt={`Bonfilet ${index + 1}`}
                  className="w-full h-auto object-contain"
                  style={{ maxHeight: "400px" }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
