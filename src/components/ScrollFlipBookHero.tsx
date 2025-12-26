"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { styled } from "@mui/material/styles";
import gsap from "gsap";

const SHEETS = 10;

const HOLD_DESKTOP = 1.6;
const TURN_DESKTOP = 1.55;

const HOLD_MOBILE = 2.2;
const TURN_MOBILE = 1.75;

export type ScrollFlipBookHeroProps = {
  bookScale?: number;
  coverSrc?: string;
};

const CoverImg = styled("img")(() => ({
  overflow: "hidden",
  width: "100%",
  height: "100%",
  display: "block",
  boxSizing: "border-box",
  objectFit: "cover",
  borderRadius: "0 5% 5% 0",
}));

const PageImage = styled("img")(() => ({
  overflow: "hidden",
  width: "100%",
  height: "100%",
  display: "block",
  boxSizing: "border-box",
  objectFit: "cover",
  borderRadius: "0 5% 5% 0",
  padding: "16px",
}));

const PageImageBack = styled("img")(() => ({
  overflow: "hidden",
  width: "100%",
  height: "100%",
  display: "block",
  boxSizing: "border-box",
  objectFit: "cover",
  borderRadius: "5% 0 0 5%",
  padding: "16px",
}));

export default function ScrollFlipBookHero({
  bookScale = 1,
  coverSrc = "/capa.png",
}: ScrollFlipBookHeroProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const bookRef = useRef<HTMLDivElement | null>(null);
  const [coverReady, setCoverReady] = useState(false);

  // ✅ Preload + decode da capa
  useEffect(() => {
    let alive = true;

    if (typeof window === "undefined") {
      setCoverReady(true);
      return;
    }

    const img = new window.Image();
    img.src = coverSrc;

    const done = async () => {
      try {
        // @ts-ignore
        if (img.decode) await img.decode();
      } catch {}
      if (!alive) return;
      setCoverReady(true);
    };

    if (img.complete) {
      void done();
    } else {
      img.addEventListener("load", () => void done(), { once: true });
      img.addEventListener("error", () => void done(), { once: true });
    }

    return () => {
      alive = false;
    };
  }, [coverSrc]);

  useLayoutEffect(() => {
    if (!coverReady) return;

    const rootEl = rootRef.current;
    const bookEl = bookRef.current;
    if (!rootEl || !bookEl) return;

    const pages = Array.from(bookEl.querySelectorAll<HTMLElement>(".book__page"));
    if (!pages.length) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      const setInitial = () => {
        pages.forEach((page, index) => {
          const t = page as gsap.TweenTarget;

          gsap.set(t, {
            transformOrigin: "0% 50%",
            transformStyle: "preserve-3d",
            force3D: true,
            willChange: "transform",
            z: index === 0 ? 60 : -index,
            zIndex: index === 0 ? 3000 : 1000 - index,
          });

          gsap.set(t, { clearProps: "rotationY" });
        });
      };

      const buildTimeline = (opts: { hold: number; turn: number }) => {
        const { hold, turn } = opts;

        setInitial();

        const tl: gsap.core.Timeline = gsap.timeline({ repeat: -1, repeatDelay: 0.8 });
        tl.eventCallback("onRepeat", () => setInitial());

        const cover = pages[0] as gsap.TweenTarget;

        // warm up
        tl.to(cover, { rotationY: 0.01, duration: 0.001, ease: "none", immediateRender: false }, 0);
        tl.to(cover, { rotationY: 0, duration: 0.001, ease: "none", immediateRender: false }, 0.002);

        pages.forEach((page, index) => {
          if (index === pages.length - 1) return;

          const target = page as gsap.TweenTarget;

          // ✅ CAPA: overload compatível (targets, duration, fromVars, toVars, position)
          if (index === 0) {
            tl.fromTo(
              target,
              turn, // duration
              { rotationY: 0 },
              {
                rotationY: -180,
                ease: "power3.inOut",
                immediateRender: false,
                onStart: () => {
                  gsap.set(target, { zIndex: 5000 });
                },
                onComplete: () => {
                  gsap.set(target, { z: -13, zIndex: 1000 - index });
                },
              },
              `+=${hold}`
            );
            return;
          }

          // Páginas internas
          tl.to(
            target,
            { rotationY: -180, duration: turn, ease: "power3.inOut", immediateRender: false },
            `+=${hold}`
          );
          tl.to(
            target,
            { z: index, duration: 0.12, ease: "power1.out", immediateRender: false },
            "<+=0.02"
          );
        });

        return tl;
      };

      mm.add("(min-width: 900px)", () => {
        const tl = buildTimeline({ hold: HOLD_DESKTOP, turn: TURN_DESKTOP });
        return () => {
          tl.kill();
        };
      });

      mm.add("(max-width: 899px)", () => {
        const tl = buildTimeline({ hold: HOLD_MOBILE, turn: TURN_MOBILE });
        return () => {
          tl.kill();
        };
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        const tl = buildTimeline({ hold: 2.5, turn: 0.01 });
        return () => {
          tl.kill();
        };
      });

      return () => {
        mm.revert();
      };
    }, rootRef);

    return () => {
      ctx.revert();
    };
  }, [coverReady]);

  const FrontHalf = ({ children }: { children?: React.ReactNode }) => (
    <div className="page__half page__half--front">{children}</div>
  );
  const BackHalf = ({ children }: { children?: React.ReactNode }) => (
    <div className="page__half page__half--back">{children}</div>
  );

  return (
    <div
      ref={rootRef}
      className="bookHost"
      style={{
        width: "30vmin",
        height: "40vmin",
        minWidth: 150,
        minHeight: 200,
        position: "relative",
        ["--book-scale" as any]: bookScale,
      }}
    >
      {coverReady ? (
        <div className="book" ref={bookRef}>
          <div className="book__spine" />

          <div className="page book__page book__cover book__cover--front">
            <FrontHalf>
              <CoverImg src={coverSrc} alt="Capa" />
            </FrontHalf>
            <BackHalf />
          </div>

          {Array.from({ length: SHEETS }).map((_, p) => {
            const leftNumber = p * 2 + 1;
            const rightNumber = p * 2 + 2;

            return (
              <div key={`sheet-${p}`} className="page book__page">
                <FrontHalf>
                  <PageImage src="/img_a_autora_e3.webp" alt={`Página ${leftNumber}`} />
                  <span className="page__number">{leftNumber}</span>
                </FrontHalf>
                <BackHalf>
                  <PageImageBack src="/img_a_colecao.webp" alt={`Página ${rightNumber}`} />
                  <span className="page__number">{rightNumber}</span>
                </BackHalf>
              </div>
            );
          })}

          <div className="page book__page book__cover book__cover--back">
            <FrontHalf />
            <BackHalf>
              <span className="code">CONTRA CAPA</span>
            </BackHalf>
          </div>
        </div>
      ) : (
        <div style={{ width: "100%", height: "100%" }} />
      )}

      <style>{`
        * { box-sizing: border-box; }

        .bookHost{ overflow: visible; }

        .page{
          height: 100%;
          width: 100%;
          position: relative;
          transform-style: preserve-3d;
        }

        .page__number{
          position: absolute;
          color: hsl(0, 0%, 50%);
          bottom: 1rem;
          font-size: 1.2vmin;
        }
        .page__half--front .page__number{ right: 1rem; }
        .page__half--back .page__number{ left: 1rem; }

        .page__half{
          display:flex; align-items:center; justify-content:center;
          height:100%;
          position:absolute; top:0; left:0; width:100%;

          /* ✅ remove clip-path (principal causa do “desfoque”) */
          overflow: hidden;

          /* ✅ micro-z estabiliza textura durante a rotação */
          transform: rotateY(calc(var(--rotation) * 1deg))
            translate3d(0, 0, calc((0.5 * var(--coefficient)) * 1px))
            translateZ(0.01px);
        }

        .page__half--front{
          --rotation: 0;
          --coefficient: 0;
          backface-visibility: hidden;
          border-radius: 0 5% 5% 0;
        }

        .page__half--back{
          --rotation: 180;
          --coefficient: 2;
          border-radius: 5% 0 0 5%;
          backface-visibility: hidden;
        }

        .book{
          height: 100%;
          width: 100%;
          position: relative;

          transform: scale(var(--book-scale, 1));
          transform-origin: top left;

          transform-style: preserve-3d;
          perspective: 1200px;
          z-index: 10;
          will-change: transform;
        }

        .book__spine{
          left: 0;
          top: 50%;
          height: 94%;
          width: 12px;
          position: absolute;
          background: black;
          transform-origin: 0 50%;
          transform: translate3d(0, -50%, -13px);
        }

        .book__page{
          position: absolute;
          left: 2%;
          top: 50%;
          border-radius: 0 5% 5% 0;
          transform: translate(0, -50%);
          height: 94%;
          width: 94%;
          transform-origin: 0% 50%;
        }

        .book__cover{ border-radius: 0 5% 5% 0; }
        .book__cover--front .page__half--back{ border-right: 1rem solid black; }
        .book__cover--back .page__half--front{ border-left: 1rem solid black; }

        .book__page:not(.book__cover) .page__half{
          background: white;
          backface-visibility: hidden;
        }

        .book__cover .page__half{ background: hsl(0, 0%, 10%); }
        .book__cover--front .page__half--front{ background: transparent; }

        .code{
          line-height: 1.2;
          font-family: monospace;
          white-space: pre-line;
          max-width: 100%;
          max-height: 100%;
          font-weight: 700;
          color: hsl(0, 0% 96%);
          border-radius: 8px;
          display: block;
          overflow: hidden;
          padding: 12px;
          text-align: center;
        }
      `}</style>
    </div>
  );
}
