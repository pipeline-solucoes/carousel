"use client";

import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface DataCarouselCircular {
  src: string;
  caption: string;  
}

interface CarouselCircularProps {
  images: DataCarouselCircular[];
  margin: string;
  color: string;
}

const CarouselCircular: React.FC<CarouselCircularProps> = ({ images, margin, color }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length); // decrementa
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  // calcula posição relativa de cada item em relação ao central
  const getPosition = (index: number) => {
    const middle = 2; // posição central na tela
    let pos = index - currentIndex;
    if (pos < -Math.floor(images.length / 2)) pos += images.length;
    if (pos > Math.floor(images.length / 2)) pos -= images.length;
    return pos;
  };

  const getScale = (pos: number) => {
    switch (pos) {
      case 0:
        return 2.0;
      case -1:
      case 1:
        return 1.5;
      default:
        return 1.0;
    }
  };

  const getZIndex = (pos: number) => {
    switch (pos) {
      case 0:
        return 3;
      case -1:
      case 1:
        return 2;
      default:
        return 1;
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        width: "100%",
        minHeight: "350px",
        margin: margin,
        overflow: "hidden",
      }}
    >
      {/* Área das imagens */}
      <Box
        flex={1}
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{
          position: "relative",
          width: "100%",
          minHeight: "250px",
        }}
      >
        {images.map((item, index) => {
          const pos = getPosition(index);
          return (
            <motion.img
              key={`${item.src}-${index}`}
              src={item.src}
              style={{
                position: "absolute",
                width: "200px",
                height: "140px",
                borderRadius: "12px",
                objectFit: "cover",
                zIndex: getZIndex(pos),
              }}
              animate={{
                x: pos * 220, // deslocamento horizontal
                scale: getScale(pos),
                opacity: pos === 0 ? 1 : 0.8,
              }}
              transition={{
                duration: 1, // transição mais suave
                ease: "easeInOut",
              }}
            />
          );
        })}
      </Box>

      {/* Área da legenda */}
      <Box
        sx={{
          minHeight: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          gap: "16px",
        }}
      >
        <Typography variant="h5" textAlign="center" maxWidth="80%" color={color}>
          {images[currentIndex].caption}
        </Typography>
      </Box>
    </Box>
  );
};

export default CarouselCircular;
