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
  width_image?: string;
  height_image?: string;
}

/**
 * CarouselCircular
 *
 * Componente de carrossel animado com disposição circular simulada, responsável por exibir
 * uma sequência de imagens com destaque progressivo no item central e transição automática
 * em intervalos regulares. O componente utiliza Framer Motion para animações de posição,
 * escala e opacidade, criando um efeito visual de profundidade.
 *
 * Funcionalidades principais:
 * - Rotação automática dos itens em intervalo fixo.
 * - Destaque visual do item central (escala e z-index maiores).
 * - Animação suave de transição horizontal entre os itens.
 * - Exibição de legenda sincronizada com o item ativo.
 *
 * Tokens de estilo (ordem de prioridade):
 * - Não há integração com tokens de Design System ou Theme da Pipeline.
 * - Estilos são definidos diretamente via `sx`, propriedades inline e variantes do MUI.
 *
 * Tipografia:
 * - Utiliza o componente `Typography` do Material UI.
 * - Variante fixa `h5`.
 * - Ordem de prioridade:
 *   1. Prop `color`
 *   2. Fallback padrão do MUI para a variante `h5`
 *
 * @param {object} props - Propriedades do componente.
 *
 * Estilo / Aparência
 * @param {DataCarouselCircular[]} props.images
 * Lista de dados do carrossel.
 * Cada item deve conter:
 * - `src`: URL da imagem.
 * - `caption`: Texto exibido como legenda quando o item estiver ativo.
 * Observação: o componente assume que o array possui ao menos um item.
 *
 * @param {string} props.margin
 * Valor de margem aplicado ao container principal.
 * - Aceita qualquer valor CSS válido (ex.: `"16px"`, `"32px auto"`).
 * - Aplicado diretamente na propriedade `sx.margin`.
 *
 * @param {string} props.color
 * Cor aplicada ao texto da legenda.
 * - Aceita qualquer valor CSS válido ou cor do tema MUI.
 * - Aplicado diretamente na prop `color` do `Typography`.
 *
 * Validação
 * - Não há validação interna de props.
 * - O componente assume que:
 *   - `images.length > 0`
 *   - As URLs de imagem são válidas.
 *
 * Eventos
 * - Não expõe eventos ou callbacks externos.
 * - A rotação é controlada internamente via `setInterval` (`useEffect`).
 *
 * @example
 * ```tsx
 * import React from "react";
 * import CarouselCircular from "./CarouselCircular";
 *
 * const images = [
 *   { src: "/images/img-1.jpg", caption: "Primeira imagem" },
 *   { src: "/images/img-2.jpg", caption: "Segunda imagem" },
 *   { src: "/images/img-3.jpg", caption: "Terceira imagem" },
 *   { src: "/images/img-4.jpg", caption: "Quarta imagem" },
 * ];
 *
 * export function ExemploCarouselCircular() {
 *   return (
 *     <CarouselCircular
 *       images={images}
 *       margin="32px 0"
 *       color="primary.main"
 *     />
 *   );
 * }
 * ```
 */


const CarouselCircular: React.FC<CarouselCircularProps> = ({ images, margin, color, width_image = '200px', height_image = '140px' }) => {
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
                width: width_image,
                height: height_image,
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
