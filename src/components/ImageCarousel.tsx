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

/**
 * ImageCarousel
 *
 * Componente de carrossel de imagens com transição por fade (opacidade) e controle por “dots”.
 * Suporta autoplay opcional com intervalo configurável e aceita a lista de imagens tanto como
 * URLs (`string`) quanto como objetos contendo `src` e `alt`.
 *
 * O componente normaliza a prop `images` internamente para `ImageCarouselImage[]` e utiliza
 * uma chave derivada dos `src` (`imagesKey`) para detectar troca do conjunto de imagens,
 * reinicializando o índice ativo e os estados/refs de animação para evitar inconsistências
 * quando arrays diferentes possuem o mesmo tamanho.
 *
 * Funcionalidades principais:
 * - Renderização de imagens com ajuste por `object-fit: contain`.
 * - Transição suave entre slides via fade (GSAP).
 * - Autoplay opcional com intervalo configurável.
 * - Navegação manual por indicadores (dots).
 * - Normalização de entrada (`string` → `{ src, alt }`) mantendo compatibilidade de uso.
 *
 * Tokens de estilo (ordem de prioridade):
 * - Não há tokens de Design System/Theme da Pipeline aplicáveis.
 * - Ordem de prioridade para cores dos indicadores (dots):
 *   1. Props do componente (`dotColor`, `activeDotColor`)
 *   2. Fallback interno: não há (as props são obrigatórias)
 *
 * Tipografia:
 * - Não se aplica. O componente não renderiza texto tipográfico (exceto `aria-label` em botões).
 *
 * @param {object} props - Propriedades do componente.
 *
 * Estilo / Aparência
 * @param {string} props.width
 * Largura do carrossel aplicada diretamente no container raiz.
 * - Aceita qualquer valor CSS válido (ex.: `"100%"`, `"640px"`, `"40rem"`).
 * - Aplicado via styled prop em `CarouselRoot`.
 *
 * @param {string} props.height
 * Altura do carrossel aplicada diretamente no container raiz.
 * - Aceita qualquer valor CSS válido (ex.: `"320px"`, `"50vh"`).
 * - Aplicado via styled prop em `CarouselRoot`.
 *
 * @param {string} props.dotColor
 * Cor do indicador (dot) quando **inativo**.
 * - Aceita qualquer valor CSS válido (ex.: `"#999"`, `"rgba(0,0,0,.3)"`, `"primary.main"`).
 * - Aplicado via styled prop em `Dot` para `backgroundColor` quando `isActive=false`.
 *
 * @param {string} props.activeDotColor
 * Cor do indicador (dot) quando **ativo**.
 * - Aceita qualquer valor CSS válido.
 * - Aplicado via styled prop em `Dot` para `backgroundColor` quando `isActive=true`.
 *
 * @param {boolean} [props.autoPlay=true]
 * Habilita ou desabilita a troca automática de slides.
 * - Quando `false`, a navegação ocorre apenas via clique nos dots.
 *
 * @param {number} [props.autoPlayInterval=5000]
 * Intervalo (em milissegundos) entre trocas automáticas de slide quando `autoPlay=true`.
 * - Usado diretamente no `window.setInterval`.
 *
 * @param {Array<string | ImageCarouselImage>} props.images
 * Lista de imagens do carrossel.
 * - Aceita:
 *   - `string`: interpretada como `src` e normalizada para `{ src, alt: "" }`.
 *   - `ImageCarouselImage`: objeto com `src` e `alt` opcional.
 * - Quando o conjunto de imagens muda (detecção por `src`), o componente:
 *   - Reseta `activeIndex` para `0`;
 *   - Reajusta refs (`slidesRef`) ao novo tamanho;
 *   - Reinicializa opacidades para manter consistência visual.
 *
 * Validação
 * - Não há validação interna de formato/URL.
 * - Quando `images` estiver vazio, o componente retorna `null`.
 * - Recomenda-se garantir `images.length > 0` e `src` válido.
 *
 * Eventos
 * - Não expõe callbacks externos.
 * - Interação disponível:
 *   - Clique nos dots altera o slide ativo via estado interno (`setActiveIndex`).
 *
 * @example
 * ```tsx
 * import React from "react";
 * import ImageCarousel from "./ImageCarousel";
 *
 * export function ExemploImageCarouselSimples() {
 *   return (
 *     <ImageCarousel
 *       width="100%"
 *       height="320px"
 *       dotColor="rgba(0,0,0,.25)"
 *       activeDotColor="rgba(0,0,0,.65)"
 *       images={[
 *         "/images/banner-1.jpg",
 *         "/images/banner-2.jpg",
 *         "/images/banner-3.jpg",
 *       ]}
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * import React from "react";
 * import ImageCarousel, { ImageCarouselImage } from "./ImageCarousel";
 *
 * export function ExemploImageCarouselComAlt() {
 *   const images: ImageCarouselImage[] = [
 *     { src: "/images/produto-1.png", alt: "Produto 1" },
 *     { src: "/images/produto-2.png", alt: "Produto 2" },
 *     { src: "/images/produto-3.png", alt: "Produto 3" },
 *   ];
 *
 *   return (
 *     <ImageCarousel
 *       width="640px"
 *       height="360px"
 *       dotColor="#BDBDBD"
 *       activeDotColor="#424242"
 *       autoPlay={false}
 *       images={images}
 *     />
 *   );
 * }
 * ```
 */

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
