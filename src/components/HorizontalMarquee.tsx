import React, { useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { Box, styled } from "@mui/material";

const ContainerSafe = styled('div')`            
  overflow: hidden;
  width: 100%;
  position: relative;
  display: flex;
  justify-content: center;
`;

const OuterWrapper = styled('div')`
  width: 100%;
  overflow: hidden;
  position: relative;
  display: flex;
  justify-content: center;
`;

const InnerWrapper = styled('div')`
  width: 100%;
  max-width: 100vw;
  position: relative;
  overflow: hidden;
`;

const MotionDiv = styled(motion.div)`
  display: flex;
  gap: 48px;
  white-space: nowrap;
  height: fit-content;
`;

interface HorizontalMarqueeProps {
  direction?: "left" | "right";
  speed?: number;
  children: React.ReactNode[];
}

/**
 * HorizontalMarquee
 *
 * Componente de marquee horizontal para exibição contínua (loop infinito) de uma sequência
 * de elementos React, como cards, imagens, chips, logos ou qualquer conteúdo renderizável.
 * A continuidade do efeito é obtida duplicando os `children` e animando o deslocamento no eixo X
 * com Framer Motion.
 *
 * Funcionalidades principais:
 * - Rolagem horizontal contínua com repetição infinita (loop).
 * - Controle de direção do movimento (esquerda/direita).
 * - Controle de velocidade por duração da animação.
 * - Duplica automaticamente os itens para evitar “cortes” no fim do percurso.
 *
 * Tokens de estilo (ordem de prioridade):
 * - Não há tokens de Design System/Theme aplicáveis neste componente.
 * - Estilos são definidos internamente via `styled` (containers) e `sx` no wrapper de cada item (`Box`).
 *
 * Tipografia:
 * - Não se aplica. O componente não define tipografia; a tipografia é responsabilidade do conteúdo
 *   fornecido em `children`.
 *
 * @param {object} props - Propriedades do componente.
 *
 * Estilo / Aparência
 * @param {"left" | "right"} [props.direction="left"]
 * Direção do deslocamento horizontal.
 * - `"left"`: anima o conteúdo para valores negativos no eixo X (movimento para a esquerda).
 * - `"right"`: anima o conteúdo para valores positivos no eixo X (movimento para a direita).
 * Observação: a distância é calculada a partir de `scrollWidth / 2`, considerando que os itens
 * são duplicados internamente (`[...children, ...children]`).
 *
 * @param {number} [props.speed=50]
 * Duração da animação em segundos (quanto maior o valor, mais lenta a movimentação).
 * - O valor é aplicado como `transition.x.duration` (Framer Motion).
 * - A animação utiliza `ease: "linear"`, `repeat: Infinity` e `repeatType: "loop"`.
 *
 * @param {React.ReactNode[]} props.children
 * Lista de elementos renderizados no marquee.
 * - O componente **duplica** o array para criar continuidade visual (`[...children, ...children]`).
 * - Recomenda-se fornecer itens com largura previsível (ex.: cards com `minWidth`/`width`)
 *   para estabilidade do cálculo de `scrollWidth`.
 *
 * Validação
 * - Não há validações internas.
 * - O componente assume que `children` é um array de nós React (`React.ReactNode[]`).
 *
 * Eventos
 * - Não expõe eventos/callbacks.
 * - A animação é controlada internamente via `useAnimation()` do Framer Motion.
 *
 * @example
 * ```tsx
 * import React from "react";
 * import HorizontalMarquee from "./HorizontalMarquee";
 * import { Box, Chip } from "@mui/material";
 *
 * export function ExemploChips() {
 *   return (
 *     <Box sx={{ width: "100%" }}>
 *       <HorizontalMarquee direction="left" speed={30}>
 *         {[
 *           <Chip key="a" label="Produto" />,
 *           <Chip key="b" label="Benefícios" />,
 *           <Chip key="c" label="Ofertas" />,
 *           <Chip key="d" label="Novidades" />,
 *         ]}
 *       </HorizontalMarquee>
 *     </Box>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * import React from "react";
 * import HorizontalMarquee from "./HorizontalMarquee";
 * import { Box } from "@mui/material";
 *
 * export function ExemploImagens() {
 *   return (
 *     <Box sx={{ width: "100%" }}>
 *       <HorizontalMarquee direction="right" speed={45}>
 *         {[
 *           <img key="1" src="/logos/logo-1.svg" alt="Logo 1" height={32} />,
 *           <img key="2" src="/logos/logo-2.svg" alt="Logo 2" height={32} />,
 *           <img key="3" src="/logos/logo-3.svg" alt="Logo 3" height={32} />,
 *         ]}
 *       </HorizontalMarquee>
 *     </Box>
 *   );
 * }
 * ```
 */


const HorizontalMarquee: React.FC<HorizontalMarqueeProps> = ({
  direction = "left",
  speed = 50,
  children,
}) => {
  const controls = useAnimation();
  const marqueeRef = useRef<HTMLDivElement>(null);
  const distanceRef = useRef<number>(0);

  useEffect(() => {
    const marquee = marqueeRef.current;
    if (marquee) {
      const totalWidth = marquee.scrollWidth / 2; // já que você duplica os children
      distanceRef.current = direction === "left" ? -totalWidth : totalWidth;

      controls.start({
        x: [0, distanceRef.current],
        transition: {
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: speed,
            ease: "linear",
          },
        },
      });
    }
  }, [controls, direction, speed, children.length]); 

  return (
    <ContainerSafe>
      <OuterWrapper>
        <InnerWrapper>
          <MotionDiv ref={marqueeRef} animate={controls}>
            {[...children, ...children].map((child, index) => (
              <Box key={index} sx={{width: "fit-content", height: "fit-content"}}>
                {child}
              </Box>
            ))}
          </MotionDiv>
        </InnerWrapper>
      </OuterWrapper>
    </ContainerSafe>
  );
};

export default HorizontalMarquee;
