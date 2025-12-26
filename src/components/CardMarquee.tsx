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

interface CardMarqueeProps {
  direction?: "left" | "right";
  speed?: number;
  children: React.ReactNode[];
}

const CardMarquee: React.FC<CardMarqueeProps> = ({
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

export default CardMarquee;
