import { useEffect, useRef, useState, ReactNode } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { styled } from '@mui/material';

const CarouselWrapper = styled('div')(() => ({
  position: 'relative',
  width: '100%',
  margin: '0 auto',
  overflow: 'hidden',

  '@media (min-width:1921px)': { maxWidth: '1920px' },
  '@media (min-width:1441px) and (max-width:1920px)': { maxWidth: '1500px' },
  '@media (min-width:1280px) and (max-width:1440px)': { maxWidth: '1200px' },
  '@media (min-width:960px) and (max-width:1279px)': { maxWidth: '940px' },
  '@media (min-width:600px) and (max-width:959px)': { maxWidth: '600px' },
  '@media (max-width:599px)': { maxWidth: '300px' },
}));

const CarouselContainer = styled(motion.div)(() => ({
  display: 'flex',
  gap: '24px',
}));

const ButtonContainer = styled(motion.div)(() => ({
  display: 'flex',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: '16px 8px',
  boxSizing: 'border-box',
}));

const ButtonStyle = styled('button', {
  shouldForwardProp: (prop) =>
    !['background_color', 'background_color_hover', 'color', 'color_hover', 'border_radius'].includes(prop as string),
})<{
  background_color: string;
  background_color_hover: string;
  color: string;
  color_hover: string;
  border_radius: string;
}>(({ background_color, background_color_hover, color, color_hover, border_radius }) => ({
  backgroundColor: background_color,
  color: color,
  border: 'none',
  padding: '8px',
  cursor: 'pointer',
  borderRadius: border_radius,
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: background_color_hover,
    color: color_hover,
  },
}));

const PaginationWrapper = styled('div')(() => ({
  display: 'flex',
  justifyContent: 'center',
  gap: '8px',
  marginTop: '16px',
}));

const Dot = styled('button', {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active: boolean; color: string }>(({ active, color }) => ({
  width: '10px',
  height: '10px',
  borderRadius: '50%',
  border: 'none',
  backgroundColor: active ? color : '#ccc',
  transition: 'background-color 0.3s',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: color,
  },
}));

interface CarrosselProps {
  children: ReactNode;
  cardsCount: number;
  cardWidth: number;
  background_color_button: string;
  background_color_hover_button: string;
  color_button: string;
  color_hover_button: string;
  color_dot_active: string;
  border_radius_button: string;
  texto?: string;
}

const Carrossel: React.FC<CarrosselProps> = ({
  children,
  cardsCount,
  cardWidth,
  background_color_button,
  background_color_hover_button,
  color_button,
  color_hover_button,
  color_dot_active,
  border_radius_button,
  texto,
}) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [maxOffset, setMaxOffset] = useState(0);
  const [visibleCards, setVisibleCards] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);

  const GAP = 24;
  const x = useMotionValue(0);

  // Calcula cards visíveis e maxOffset
  useEffect(() => {
    const calculateVisibleCards = () => {
      if (wrapperRef.current) {
        const wrapperWidth = wrapperRef.current.offsetWidth;
        const totalCardWidth = (cardWidth + GAP) * cardsCount;
        const maxScroll = wrapperWidth - totalCardWidth;
        const visible = Math.floor(wrapperWidth / (cardWidth + GAP));
        setVisibleCards(visible > 0 ? visible : 1);
        setMaxOffset(maxScroll < 0 ? maxScroll : 0);
      }
    };

    calculateVisibleCards();

    const resizeObserver = new ResizeObserver(() => {
      calculateVisibleCards();
    });

    if (wrapperRef.current) resizeObserver.observe(wrapperRef.current);

    return () => resizeObserver.disconnect();
  }, [cardsCount, cardWidth]);

  const totalPages = Math.ceil(cardsCount / visibleCards);

  // Atualiza currentPage quando arrasta
  useEffect(() => {
    const unsubscribe = x.onChange((latestX) => {
      const page = Math.round(-latestX / ((cardWidth + GAP) * visibleCards));
      setCurrentPage(Math.min(Math.max(page, 0), totalPages - 1));
    });
    return () => unsubscribe();
  }, [x, cardWidth, visibleCards, totalPages]);

  const goToPage = (pageIndex: number) => {
    const newPosition = -((cardWidth + GAP) * visibleCards * pageIndex);
    const clamped = Math.max(newPosition, maxOffset);
    x.set(clamped);
    setCurrentPage(pageIndex);
  };

  const handlePrev = () => {
    if (currentPage > 0) goToPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) goToPage(currentPage + 1);
  };

  return (
    <CarouselWrapper ref={wrapperRef} id="carrossel">
      <ButtonContainer>
        {texto && <span style={{ flex: 1 }}>{texto}</span>}

        <ButtonStyle
          onClick={handlePrev}
          background_color={background_color_button}
          background_color_hover={background_color_hover_button}
          color={color_button}
          color_hover={color_hover_button}
          border_radius={border_radius_button}
          aria-label= "botão mover carrossel para a esquerda" 
        >
          <ChevronLeft />
        </ButtonStyle>

        <ButtonStyle
          onClick={handleNext}
          background_color={background_color_button}
          background_color_hover={background_color_hover_button}
          color={color_button}
          color_hover={color_hover_button}
          border_radius={border_radius_button}
          aria-label= "botão mover carrossel para a direita" 
        >
          <ChevronRight />
        </ButtonStyle>
      </ButtonContainer>

      <CarouselContainer
        style={{ x }}
        drag="x"
        dragConstraints={{ left: maxOffset, right: 0 }}
        whileTap={{ cursor: 'grabbing' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {children}
      </CarouselContainer>

      <PaginationWrapper>
        {Array.from({ length: totalPages }).map((_, index) => (
          <Dot
            key={index}
            color={color_dot_active}
            active={index === currentPage}
            onClick={() => goToPage(index)}
            aria-label= {`marcador ${index}`}
          />
        ))}
      </PaginationWrapper>
    </CarouselWrapper>
  );
};

export default Carrossel;
