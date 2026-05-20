import { useEffect, useRef } from "react";
import gsap from "gsap";
import "./App.css";

const imageModules = import.meta.glob("./assets/*.{jpg,jpeg,png,webp}", {
  eager: true,
});
const images = Object.values(imageModules)
  .map((mod) => mod.default)
  .sort(() => Math.random() - 0.5);

const loopedImages = [images[images.length - 1], ...images, images[0]];

export default function App() {
  const loaderRef = useRef(null);
  const countRef = useRef(null);
  const titleRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    gsap.set(".corner", { opacity: 0 });
    gsap.set(titleRef.current, { opacity: 0 });

    const counter = { val: 0 };
    gsap.to(counter, {
      val: 100,
      duration: 2,
      ease: "power2.inOut",
      onUpdate: () => {
        if (countRef.current) {
          countRef.current.textContent = Math.round(counter.val);
        }
      },
      onComplete: () => {
        gsap.to(loaderRef.current, {
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
          onComplete: () => {
            loaderRef.current.style.display = "none";
            gsap.to(titleRef.current, {
              opacity: 1,
              duration: 0.8,
              ease: "power2.out",
            });
            gsap.to(".corner", {
              opacity: 1,
              duration: 0.8,
              ease: "power2.out",
              delay: 0.5,
            });
          },
        });
      },
    });
  }, []);

  useEffect(() => {
    const dot = document.querySelector(".cursor-dot");
    const ring = document.querySelector(".cursor-ring");

    let mouseX = 0,
      mouseY = 0;
    let ringX = 0,
      ringY = 0;

    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      gsap.to(dot, {
        x: mouseX,
        y: mouseY,
        xPercent: -50,
        yPercent: -50,
        duration: 0.1,
        ease: "power2.out",
      });
    };

    const animate = () => {
      ringX += (mouseX - ringX) * 0.08;
      ringY += (mouseY - ringY) * 0.08;
      gsap.set(ring, { x: ringX, y: ringY, xPercent: -50, yPercent: -50 });
      requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMove);
    animate();

    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // Start at first real slide (index 1, skipping the prepended clone)
    el.scrollTop = el.clientHeight;

    const handleScrollEnd = () => {
      const tolerance = 5;
      const lastCloneTop = (loopedImages.length - 1) * el.clientHeight;

      // At end clone → jump to first real slide
      if (Math.abs(el.scrollTop - lastCloneTop) <= tolerance) {
        el.scrollTo({ top: el.clientHeight, behavior: "instant" });
      }

      // At beginning clone → jump to last real slide
      if (el.scrollTop <= tolerance) {
        el.scrollTo({
          top: lastCloneTop - el.clientHeight,
          behavior: "instant",
        });
      }
    };

    el.addEventListener("scrollend", handleScrollEnd);

    return () => el.removeEventListener("scrollend", handleScrollEnd);
  }, []);

  return (
    <>
      <div className="loader" ref={loaderRef}>
        <span className="loader-count" ref={countRef}>
          0
        </span>
      </div>

      <div className="cursor-dot" />
      <div className="cursor-ring" />

      <a
        href="https://www.instagram.com/matreding"
        target="_blank"
        rel="noreferrer"
        className="corner top-left"
      >
        Instagram
      </a>
      <a
        href="https://unsplash.com/@matreding?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQMMjU2MjgxMDQwNTU4AAGn_COrY9a61nS7ohmi5Hq5DmZajVA3IdJQ1gaEpXiiSnLVFJ9IyxmrGhW9ER8_aem_khaFveROIH2fMtEm_BISAQ"
        target="_blank"
        rel="noreferrer"
        className="corner top-center"
      >
        Unsplash
      </a>

      <a
        href="https://www.paypal.com/donate?business=contact%40matreding.com&item_name=Mathias+Reding+-+Unsplash&currency_code=USD"
        target="_blank"
        rel="noreferrer"
        className="corner top-right"
      >
        Support Me
      </a>

      <span className="corner bottom-left">French Photographer</span>
      <span className="corner bottom-center">Based in Canada</span>
      <span className="corner bottom-right">Sport & Reportage</span>

      <div className="title" ref={titleRef}>
        MATHIAS REDING
      </div>

      <div className="scroll-container" ref={scrollRef}>
        {loopedImages.map((src, i) => (
          <div className="slide" key={i}>
            <img src={src} alt="" />
          </div>
        ))}
      </div>
    </>
  );
}
