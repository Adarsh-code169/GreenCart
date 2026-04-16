import React, { useEffect } from 'react'
import MainBanner from '../components/MainBanner'
import Categories from '../components/Categories'
import BestSeller from '../components/BestSeller'
import BottomBanner from '../components/BottomBanner'
import NewsLetter from '../components/NewsLetter'
import FlashSale from '../components/FlashSale'

const Home = () => {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className='mt-8 md:mt-10 overflow-hidden' >
        <div className="reveal reveal-fade-up"><MainBanner/></div>
        <div className="reveal reveal-fade-up"><Categories/></div>
        <div className="reveal reveal-fade-up"><FlashSale/></div>
        <div className="reveal reveal-fade-up"><BestSeller/></div>
        <div className="reveal reveal-fade-up"><BottomBanner/></div>
        <div className="reveal reveal-fade-up"><NewsLetter/></div>

        <style dangerouslySetInnerHTML={{ __html: `
          .reveal {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.8s cubic-bezier(0.22, 1, 0.36, 1);
            will-change: transform, opacity;
          }
          .reveal-visible {
            opacity: 1;
            transform: translateY(0);
          }
          .reveal-fade-up {
            transition-delay: 0.1s;
          }
        `}} />
    </div>
  )
}

export default Home