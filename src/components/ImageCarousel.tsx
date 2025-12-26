"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { gsap } from "gsap";

const CarouselRoot = styled("div", {
  shouldForwardProp: (prop) => !["width", "height"].includes(prop as string),
})<{ width: string; height: string }>(({ width, height }) => ({
  position: "relative",
  width,
  height,
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
}));

const SlidesWrapper = styled(Box)({
  position: "relative",
  width: "100%",
  height: "100%",
  flex: 1,
});

const Slide = styled("div")(() => ({
  position: "absolute",
  width: "100%",
  height: "100%",
  opacity: 0,
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const SlideImage = styled("img")(() => ({
  width: "100%",
  height: "100%",
  objectFit: "contain",
  display: "block",
}));

const DotsWrapper = styled("div")({
  display: "flex",
  justifyContent: "center",
  gap: 8,
  padding: "8px 0",
});

interface DotProps {
  isActive?: boolean;
  dotColor?: string;
  activeDotColor?: string;
}

const Dot = styled("button", {
  shouldForwardProp: (prop) =>
    !["isActive", "dotColor", "activeDotColor"].includes(prop as string),
})<DotProps>(({ isActive, dotColor, activeDotColor }) => ({
  width: 10,
  height: 10,
  borderRadius: "50%",
  border: "none",
  padding: 0,
  cursor: "pointer",
  backgroundColor: isActive ? activeDotColor : dotColor,
  transition: "transform 0.2s ease, background-color 0.2s ease",
  outline: "none",
  "&:hover": { transform: "scale(1.1)" },
}));

export interface ImageCarouselImage {
  alt?: string;
  src: string;
}

export interface ImageCarouselProps {
  width: string;
  height: string;
  dotColor: string;
  activeDotColor: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  images: Array<string | ImageCarouselImage>;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({
  width,
  height,
  dotColor,
  activeDotColor,
  autoPlay = true,
  autoPlayInterval = 5000,
  images,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const slidesRef = useRef<(HTMLDivElement | null)[]>([]);
  const prevIndexRef = useRef(0);

  const normalizedImages: ImageCarouselImage[] = useMemo(
    () =>
      images.map((img) => (typeof img === "string" ? { src: img, alt: "" } : img)),
    [images]
  );

  // 🔑 chave baseada nos src (resolve troca de arrays com mesmo length)
  const imagesKey = useMemo(
    () => normalizedImages.map((i) => i.src).join("|"),
    [normalizedImages]
  );

  // Sempre que mudar o conjunto de imagens, resetar index e estados internos
  useEffect(() => {
    if (!normalizedImages.length) return;

    setActiveIndex(0);
    prevIndexRef.current = 0;

    // garante ref alinhado ao novo tamanho
    slidesRef.current = slidesRef.current.slice(0, normalizedImages.length);
  }, [imagesKey, normalizedImages.length]);

  // Inicializa opacidades sempre que mudar o conjunto de imagens (ou refs)
  useEffect(() => {
    if (!normalizedImages.length) return;

    slidesRef.current.forEach((slide, index) => {
      if (!slide) return;
      gsap.killTweensOf(slide);
      gsap.set(slide, { opacity: index === activeIndex ? 1 : 0 });
    });

    prevIndexRef.current = activeIndex;
  }, [imagesKey, normalizedImages.length, activeIndex]);

  // Anima transição (e também reage quando imagesKey muda)
  useEffect(() => {
    const slides = slidesRef.current;
    const current = slides[activeIndex];
    if (!current) return;

    const prevIndex = prevIndexRef.current;
    const prev = slides[prevIndex];

    if (prev && prev !== current) {
      gsap.killTweensOf(prev);
      gsap.to(prev, { opacity: 0, duration: 0.6, ease: "power2.out" });
    }

    gsap.killTweensOf(current);
    gsap.to(current, { opacity: 1, duration: 0.6, ease: "power2.out" });

    prevIndexRef.current = activeIndex;
  }, [activeIndex, imagesKey]);

  // Autoplay
  useEffect(() => {
    if (!autoPlay || !normalizedImages.length) return;

    const interval = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1 >= normalizedImages.length ? 0 : prev + 1));
    }, autoPlayInterval);

    return () => window.clearInterval(interval);
  }, [autoPlay, autoPlayInterval, normalizedImages.length]);

  const handleDotClick = (index: number) => setActiveIndex(index);

  if (!normalizedImages.length) return null;

  return (
    <CarouselRoot width={width} height={height}>
      <SlidesWrapper>
        {normalizedImages.map((image, index) => (
          <Slide
            key={image.src + index}
            ref={(el) => {
              slidesRef.current[index] = el;
            }}
            // ✅ garante que mesmo com autoPlay=false a primeira imagem apareça
            style={{ opacity: index === activeIndex ? 1 : 0 }}
          >
            <SlideImage src={image.src} alt={image.alt ?? ""} />
          </Slide>
        ))}
      </SlidesWrapper>

      <DotsWrapper>
        {normalizedImages.map((_, index) => (
          <Dot
            key={index}
            type="button"
            onClick={() => handleDotClick(index)}
            isActive={index === activeIndex}
            dotColor={dotColor}
            activeDotColor={activeDotColor}
            aria-label={`Ir para imagem ${index + 1}`}
          />
        ))}
      </DotsWrapper>
    </CarouselRoot>
  );
};

ImageCarousel.displayName = "ImageCarousel";
export default ImageCarousel;
