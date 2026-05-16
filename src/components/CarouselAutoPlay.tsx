"use client";

import React, { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { gsap } from "gsap";

const CarouselRoot = styled("div", {
  shouldForwardProp: (prop) => !["width", "height", "background"].includes(prop as string),
})<{ width: string; height: string; background: string }>(({ width, height, background }) => ({
  position: "relative",
  width,
  height,
  background,
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


export interface CarouselAutoPlayProps {
  background: string;
  width: string;
  height: string;
  dotColor: string;
  activeDotColor: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  items: ReactNode[];
}

/**
 * CarouselAutoPlay
 *
 * Componente de carrossel com transição por fade (opacidade) e controle por “dots”.
 * Suporta autoplay opcional com intervalo configurável e aceita uma lista de slides
 * composta por qualquer elemento React (`ReactNode`).
 *
 * Diferente de um carrossel restrito a imagens, este componente permite renderizar
 * imagens, cards, banners, textos, componentes customizados ou qualquer outro conteúdo
 * React dentro de cada slide.
 *
 * O componente converte internamente a prop `items` usando `React.Children.toArray`,
 * garantindo uma lista estável de elementos renderizáveis. Uma chave derivada das keys
 * dos elementos, quando disponíveis, é utilizada para detectar alterações no conjunto
 * de slides, reinicializando o índice ativo e os estados/refs de animação para evitar
 * inconsistências quando arrays diferentes possuem o mesmo tamanho.
 *
 * Funcionalidades principais:
 * - Renderização de qualquer conteúdo React como slide.
 * - Transição suave entre slides via fade (GSAP).
 * - Autoplay opcional com intervalo configurável.
 * - Navegação manual por indicadores (dots).
 * - Reset automático do índice ativo quando o conjunto de slides muda.
 *
 * Tokens de estilo (ordem de prioridade):
 * - Não há tokens de Design System/Theme da Pipeline aplicáveis.
 * - Ordem de prioridade para cores dos indicadores (dots):
 *   1. Props do componente (`dotColor`, `activeDotColor`)
 *   2. Fallback interno: não há (as props são obrigatórias)
 *
 * Tipografia:
 * - O componente não define tipografia diretamente.
 * - Qualquer tipografia deve ser definida nos elementos passados em `items`.
 *
 * @param {object} props - Propriedades do componente.
 *
 * Estilo / Aparência
 *
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
 * @param {string} [props.background="transparent"]
 * Cor ou imagem de fundo aplicada ao container raiz do carrossel.
 * - Aceita qualquer valor CSS válido para `background`
 *   (ex.: `"transparent"`, `"#fff"`, `"linear-gradient(...)"`).
 *
 * @param {string} props.dotColor
 * Cor do indicador (dot) quando **inativo**.
 * - Aceita qualquer valor CSS válido (ex.: `"#999"`, `"rgba(0,0,0,.3)"`).
 * - Aplicado via styled prop em `Dot` para `backgroundColor` quando `isActive=false`.
 *
 * @param {string} props.activeDotColor
 * Cor do indicador (dot) quando **ativo**.
 * - Aceita qualquer valor CSS válido.
 * - Aplicado via styled prop em `Dot` para `backgroundColor` quando `isActive=true`.
 *
 * Comportamento
 *
 * @param {boolean} [props.autoPlay=true]
 * Habilita ou desabilita a troca automática de slides.
 * - Quando `false`, a navegação ocorre apenas via clique nos dots.
 *
 * @param {number} [props.autoPlayInterval=5000]
 * Intervalo, em milissegundos, entre trocas automáticas de slide quando `autoPlay=true`.
 * - Usado diretamente no `window.setInterval`.
 *
 * Conteúdo
 *
 * @param {React.ReactNode[]} props.items
 * Lista de slides do carrossel.
 * - Aceita qualquer conteúdo React, como:
 *   - imagens;
 *   - cards;
 *   - boxes;
 *   - textos;
 *   - componentes customizados;
 *   - fragments;
 *   - layouts completos.
 *
 * Recomenda-se que cada item do array possua uma `key` estável, principalmente quando
 * a lista puder ser alterada dinamicamente. Caso a `key` não seja informada, o componente
 * utiliza o índice como fallback.
 *
 * Quando o conjunto de slides muda, o componente:
 * - Reseta `activeIndex` para `0`;
 * - Reajusta refs (`slidesRef`) ao novo tamanho;
 * - Reinicializa opacidades para manter consistência visual.
 *
 * Validação
 * - Não há validação interna do conteúdo de cada slide.
 * - Quando `items` estiver vazio, o componente retorna `null`.
 * - Recomenda-se garantir `items.length > 0`.
 *
 * Eventos
 * - Não expõe callbacks externos.
 * - Interação disponível:
 *   - Clique nos dots altera o slide ativo via estado interno (`setActiveIndex`).
 *
 * @example
 * ```tsx
 * import React from "react";
 * import CarouselAutoPlay from "./CarouselAutoPlay";
 *
 * export function ExemploCarouselComImagens() {
 *   return (
 *     <CarouselAutoPlay
 *       width="100%"
 *       height="320px"
 *       dotColor="rgba(0,0,0,.25)"
 *       activeDotColor="rgba(0,0,0,.65)"
 *       items={[
 *         <img
 *           key="banner-1"
 *           src="/images/banner-1.jpg"
 *           alt="Banner 1"
 *           style={{ width: "100%", height: "100%", objectFit: "contain" }}
 *         />,
 *         <img
 *           key="banner-2"
 *           src="/images/banner-2.jpg"
 *           alt="Banner 2"
 *           style={{ width: "100%", height: "100%", objectFit: "contain" }}
 *         />,
 *         <img
 *           key="banner-3"
 *           src="/images/banner-3.jpg"
 *           alt="Banner 3"
 *           style={{ width: "100%", height: "100%", objectFit: "contain" }}
 *         />,
 *       ]}
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * import React from "react";
 * import { Box, Typography } from "@mui/material";
 * import CarouselAutoPlay from "./CarouselAutoPlay";
 *
 * export function ExemploCarouselComConteudoCustomizado() {
 *   return (
 *     <CarouselAutoPlay
 *       width="640px"
 *       height="360px"
 *       dotColor="#BDBDBD"
 *       activeDotColor="#424242"
 *       autoPlay={false}
 *       items={[
 *         <Box key="slide-1" p={4}>
 *           <Typography variant="h5">Slide 1</Typography>
 *           <Typography>Conteúdo personalizado do primeiro slide.</Typography>
 *         </Box>,
 *         <Box key="slide-2" p={4}>
 *           <Typography variant="h5">Slide 2</Typography>
 *           <Typography>Outro conteúdo renderizado dentro do carrossel.</Typography>
 *         </Box>,
 *         <Box key="slide-3" p={4}>
 *           <Typography variant="h5">Slide 3</Typography>
 *           <Typography>O slide pode conter qualquer componente React.</Typography>
 *         </Box>,
 *       ]}
 *     />
 *   );
 * }
 * ```
 */
const CarouselAutoPlay: React.FC<CarouselAutoPlayProps> = ({
  width,
  height,
  background = "transparent",
  dotColor,
  activeDotColor,
  autoPlay = true,
  autoPlayInterval = 5000,
  items,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const slidesRef = useRef<(HTMLDivElement | null)[]>([]);
  const prevIndexRef = useRef(0);

  const slides = useMemo(() => React.Children.toArray(items), [items]);

  const slidesKey = useMemo(
    () =>
      slides
        .map((slide, index) =>
          React.isValidElement(slide) && slide.key != null
            ? String(slide.key)
            : String(index)
        )
        .join("|"),
    [slides]
  );

  useEffect(() => {
    if (!slides.length) return;

    setActiveIndex(0);
    prevIndexRef.current = 0;
    slidesRef.current = slidesRef.current.slice(0, slides.length);
  }, [slidesKey, slides.length]);

  useEffect(() => {
    if (!slides.length) return;

    slidesRef.current.forEach((slide, index) => {
      if (!slide) return;
      gsap.killTweensOf(slide);
      gsap.set(slide, { opacity: index === activeIndex ? 1 : 0 });
    });

    prevIndexRef.current = activeIndex;
  }, [slidesKey, slides.length, activeIndex]);

  useEffect(() => {
    const current = slidesRef.current[activeIndex];
    if (!current) return;

    const prevIndex = prevIndexRef.current;
    const prev = slidesRef.current[prevIndex];

    if (prev && prev !== current) {
      gsap.killTweensOf(prev);
      gsap.to(prev, { opacity: 0, duration: 0.6, ease: "power2.out" });
    }

    gsap.killTweensOf(current);
    gsap.to(current, { opacity: 1, duration: 0.6, ease: "power2.out" });

    prevIndexRef.current = activeIndex;
  }, [activeIndex, slidesKey]);

  useEffect(() => {
    if (!autoPlay || !slides.length) return;

    const interval = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1 >= slides.length ? 0 : prev + 1));
    }, autoPlayInterval);

    return () => window.clearInterval(interval);
  }, [autoPlay, autoPlayInterval, slides.length]);

  const handleDotClick = (index: number) => setActiveIndex(index);

  if (!slides.length) return null;

  return (
    <CarouselRoot width={width} height={height} background={background}>
      <SlidesWrapper>
        {slides.map((slide, index) => (
          <Slide
            key={
              React.isValidElement(slide) && slide.key != null
                ? slide.key
                : index
            }
            ref={(el) => {
              slidesRef.current[index] = el;
            }}
            style={{ opacity: index === activeIndex ? 1 : 0 }}
          >
            {slide}
          </Slide>
        ))}
      </SlidesWrapper>

      <DotsWrapper>
        {slides.map((_, index) => (
          <Dot
            key={index}
            type="button"
            onClick={() => handleDotClick(index)}
            isActive={index === activeIndex}
            dotColor={dotColor}
            activeDotColor={activeDotColor}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </DotsWrapper>
    </CarouselRoot>
  );
};

CarouselAutoPlay.displayName = "CarouselAutoPlay";
export default CarouselAutoPlay;
