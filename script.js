document.addEventListener('DOMContentLoaded', function() {
  // Initialize AOS
  AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true
  });
  
  // Slide functionality
  let slides = document.querySelectorAll('.slide');
  let currentSlide = 0;
  const totalSlides = slides.length;
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const slideCounter = document.getElementById('slide-counter');
  const slideIndicators = document.querySelector('.slide-indicators');
  const progressBar = document.getElementById('progress-bar');
  
  // Initialize slide counter
  updateSlideCounter();
  
  // Create slide indicators
  createSlideIndicators();
  
  // Show first slide
  showSlide(currentSlide);
  
  // Event listeners for navigation
  prevBtn.addEventListener('click', prevSlide);
  nextBtn.addEventListener('click', nextSlide);
  
  // Keyboard navigation
  document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
      nextSlide();
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      prevSlide();
    } else if (e.key === 'f' || e.key === 'F') {
      toggleFullscreen();
    }
  });
  
  // Fullscreen toggle
  const fullscreenToggle = document.getElementById('fullscreen-toggle');
  fullscreenToggle.addEventListener('click', toggleFullscreen);
  
  // Functions
  function updateSlideCounter() {
    slideCounter.textContent = `${currentSlide + 1}/${totalSlides}`;
  }
  
  function createSlideIndicators() {
    for (let i = 0; i < totalSlides; i++) {
      const indicator = document.createElement('div');
      indicator.className = 'indicator';
      indicator.addEventListener('click', function() {
        goToSlide(i);
      });
      slideIndicators.appendChild(indicator);
    }
  }
  
  function updateSlideIndicators() {
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach((indicator, index) => {
      if (index === currentSlide) {
        indicator.classList.add('active');
      } else {
        indicator.classList.remove('active');
      }
    });
  }
  
  function updateProgressBar() {
    const progress = ((currentSlide + 1) / totalSlides) * 100;
    progressBar.style.width = `${progress}%`;
  }
  
  function showSlide(index) {
    // Hide all slides
    gsap.to(slides, {
      opacity: 0,
      duration: 0.3,
      ease: "power2.inOut",
      onComplete: function() {
        slides.forEach(slide => {
          slide.classList.remove('active');
        });
        // Show the current slide
        slides[index].classList.add('active');
        gsap.to(slides[index], {
          opacity: 1,
          duration: 0.5,
          ease: "power2.inOut",
          onComplete: function() {
            // Once the slide is visible, animate its content
            animateSlideContent(slides[index]);
          }
        });
      }
    });
    
    // Update UI
    updateSlideCounter();
    updateSlideIndicators();
    updateProgressBar();
  }
  
  function animateSlideContent(slide) {
    // Animate headings
    gsap.from(slide.querySelectorAll('h1, h2, h3'), {
      y: 20,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: "power2.out"
    });
    
    // Animate chart containers
    gsap.from(slide.querySelectorAll('.chart-container'), {
      scale: 0.9,
      opacity: 0,
      duration: 0.8,
      delay: 0.3,
      ease: "power2.out"
    });
    
    // Animate other elements
    gsap.from(slide.querySelectorAll('.stat-highlights, .key-insights, .experience-opportunity, .revenue-container, .recommendations, .napkin-container, .timeline-container'), {
      y: 30,
      opacity: 0,
      duration: 0.8,
      delay: 0.5,
      stagger: 0.2,
      ease: "power2.out"
    });
  }
  
  function nextSlide() {
    if (currentSlide < totalSlides - 1) {
      currentSlide++;
      showSlide(currentSlide);
    }
  }
  
  function prevSlide() {
    if (currentSlide > 0) {
      currentSlide--;
      showSlide(currentSlide);
    }
  }
  
  function goToSlide(index) {
    if (index >= 0 && index < totalSlides) {
      currentSlide = index;
      showSlide(currentSlide);
    }
  }
  
  function toggleFullscreen() {
    const container = document.querySelector('.slide-container');
    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      fullscreenToggle.innerHTML = '<i class="fas fa-compress"></i>';
    } else {
      document.exitFullscreen();
      fullscreenToggle.innerHTML = '<i class="fas fa-expand"></i>';
    }
  }
  
  // Clickable stats with source info
  const clickableStats = document.querySelectorAll('.clickable-stat');
  const statModal = document.getElementById('stat-modal');
  const closeModal = document.getElementById('close-modal');
  const modalTitle = document.querySelector('.modal-title');
  const modalText = document.querySelector('.modal-text');
  const modalSource = document.querySelector('.modal-source');
  
  clickableStats.forEach(stat => {
    stat.addEventListener('click', function() {
      // Get the statistic text
      const statText = this.textContent;
      
      // Find the citation based on the text
      const citation = sourceCitations[findCitationKey(statText)];
      
      if (citation) {
        modalTitle.textContent = "Source Information";
        modalText.textContent = citation.detail || statText;
        
        if (citation.source) {
          modalSource.innerHTML = `<strong>Source:</strong> ${citation.source}`;
          if (citation.link) {
            modalSource.innerHTML += ` <a href="${citation.link}" target="_blank"><i class="fas fa-external-link-alt"></i></a>`;
          }
        } else {
          modalSource.innerHTML = '';
        }
        
        statModal.style.display = 'flex';
      }
    });
  });
  
  closeModal.addEventListener('click', function() {
    statModal.style.display = 'none';
  });
  
  window.addEventListener('click', function(event) {
    if (event.target === statModal) {
      statModal.style.display = 'none';
    }
  });
  
  function findCitationKey(text) {
    // Simple matching to find the most relevant citation key
    for (const key in sourceCitations) {
      if (text.includes(key) || key.includes(text)) {
        return key;
      }
    }
    return "general";
  }
  
  // Charts Initialization
  initCharts();
});

// Source citations
const sourceCitations = {
  // Screen Time
  "7.7 hours": {
    detail: "Teens spend an average of 7.7 hours per day on screens for entertainment purposes, not including time spent for school or homework.",
    source: "Common Sense Media, 2021",
    link: "https://www.commonsensemedia.org/research/the-common-sense-census-media-use-by-tweens-and-teens-2021"
  },
  "3.1 hours on video": {
    detail: "Of the 7.7 hours of daily screen time, teens spend approximately 3.1 hours watching videos, including streaming content, short-form video, and user-generated content.",
    source: "Common Sense Media, 2021",
    link: "https://www.commonsensemedia.org/research/the-common-sense-census-media-use-by-tweens-and-teens-2021"
  },
  
  // Platform Usage
  "YouTube (77%)": {
    detail: "77% of teens use YouTube daily, making it the most widely used social platform among 13-18 year olds.",
    source: "Pew Research Center, 2022",
    link: "https://www.pewresearch.org/internet/2022/08/10/teens-social-media-and-technology-2022/"
  },
  "TikTok (69%)": {
    detail: "69% of teens use TikTok daily, with 25% reporting they are on the platform 'almost constantly'.",
    source: "Pew Research Center, 2022",
    link: "https://www.pewresearch.org/internet/2022/08/10/teens-social-media-and-technology-2022/"
  },
  
  // ADHD
  "20% diagnosed with ADHD": {
    detail: "Approximately 20% of teens today have been diagnosed with ADHD, a significant increase from previous generations.",
    source: "CDC National Survey of Children's Health, 2022",
    link: "https://www.cdc.gov/ncbddd/adhd/data.html"
  },
  "68% Consume short-form content": {
    detail: "Teens with ADHD consume 68% of their video content as short-form (under 10 minutes), compared to 42% for neurotypical teens.",
    source: "finalinfo.md Survey Data",
    link: ""
  },
  
  // Influencers
  "70% trust influencers": {
    detail: "70% of teens trust social media influencers more than traditional celebrities when making purchase decisions or forming opinions.",
    source: "finalinfo.md Survey",
    link: ""
  },
  "61% of teens purchase": {
    detail: "61% of consumers have purchased items after seeing influencer recommendations, compared to only 3% influenced by celebrity endorsements.",
    source: "finalinfo.md Survey",
    link: ""
  },
  
  // Disney Experience
  "75% of teens more likely to visit": {
    detail: "75% of surveyed teens stated they would be more likely to visit Disney parks if offered exclusive interactive digital elements or experiences.",
    source: "finalinfo.md Survey",
    link: ""
  },
  "55% rate digital interactivity": {
    detail: "55% of teens rated digital interactivity as extremely or very important when considering theme park experiences.",
    source: "finalinfo.md Survey",
    link: ""
  },
  "~15% of Disney park visitors": {
    detail: "Recent data suggest that teenagers (13-18) make up a relatively small share of Disney's theme park visitors at approximately 15%.",
    source: "ConnollyCove Analysis cited in finalinfo.md",
    link: ""
  },
  
  // Revenue
  "Experiences drive 70%": {
    detail: "While Experiences represent only 36% of Disney's revenue, they generate approximately 70% of the company's operating income, making them disproportionately valuable to profitability.",
    source: "Disney Financial Analysis, Q1 2025",
    link: ""
  },
  
  // General
  "general": {
    detail: "This statistic is based on research compiled for the Disney Teen Engagement Strategy presentation.",
    source: "Multiple sources in finalinfo.md",
    link: ""
  }
};

// Charts
function initCharts() {
  // Initialize Screen Time Distribution Chart
  const screenTimeCtx = document.getElementById('screenTimeChart');
  if (screenTimeCtx) {
    new Chart(screenTimeCtx, {
      type: 'doughnut',
      data: {
        labels: ['Video Content (3.1 hrs)', 'Gaming (2.1 hrs)', 'Social Media (1.8 hrs)', 'Other (0.7 hrs)'],
        datasets: [{
          data: [3.1, 2.1, 1.8, 0.7],
          backgroundColor: [
            'rgba(75, 192, 192, 0.8)',
            'rgba(153, 102, 255, 0.8)',
            'rgba(255, 159, 64, 0.8)',
            'rgba(201, 203, 207, 0.8)'
          ],
          borderColor: [
            'rgb(75, 192, 192)',
            'rgb(153, 102, 255)',
            'rgb(255, 159, 64)',
            'rgb(201, 203, 207)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: {
                size: 14
              },
              color: '#fff'
            }
          },
          title: {
            display: true,
            text: 'Teen Daily Screen Time Distribution (7.7 Hours Total)',
            font: {
              size: 16,
              weight: 'bold'
            },
            color: '#fff',
            padding: {
              top: 10,
              bottom: 20
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.raw || 0;
                const percentage = Math.round((value / 7.7) * 100);
                return `${label}: ${value} hrs (${percentage}% of daily screen time)`;
              }
            }
          }
        }
      }
    });
  }
} 