document.addEventListener('DOMContentLoaded', function() {
  // Initialize AOS
  AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true
  });
  
  // DOM Elements
  const slides = document.querySelectorAll('.slide');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const slideCounter = document.querySelector('.slide-counter');
  const progressBar = document.querySelector('.progress-bar');
  const fullscreenToggle = document.querySelector('.fullscreen-toggle');
  const speakerNotesButton = document.querySelector('.speaker-notes-button');
  const speakerNotesPanel = document.querySelector('.speaker-notes-panel');
  const speakerNotesCloseBtn = document.querySelector('.speaker-notes-panel .close-btn');
  
  // State
  let currentSlideIndex = 0;
  const totalSlides = slides.length;
  
  // Initialize Slide Indicators
  const slideIndicatorsContainer = document.querySelector('.slide-indicators');
  if (slideIndicatorsContainer) {
  for (let i = 0; i < totalSlides; i++) {
    const indicator = document.createElement('div');
    indicator.classList.add('indicator');
    if (i === 0) indicator.classList.add('active');
    indicator.addEventListener('click', () => goToSlide(i));
      slideIndicatorsContainer.appendChild(indicator);
    }
  }
  
  // Functions
  function showSlide(index) {
    // Hide all slides
    slides.forEach(slide => {
      slide.classList.remove('active');
    });
    
    // Show the current slide
    slides[index].classList.add('active');
    
    // Update indicators
    const indicators = document.querySelectorAll('.indicator');
    if (indicators.length > 0) {
      indicators.forEach(ind => ind.classList.remove('active'));
      indicators[index].classList.add('active');
    }
    
    // Update progress bar
    const progress = ((index + 1) / totalSlides) * 100;
    progressBar.style.width = `${progress}%`;
    
    // Update slide counter
    if (slideCounter) {
      slideCounter.textContent = `${index + 1} / ${totalSlides}`;
    }
    
    // Update speaker notes
    updateSpeakerNotes(index);
  }
  
  function goToSlide(index) {
    // Handle out of bounds
    if (index < 0) {
      currentSlideIndex = totalSlides - 1;
    } else if (index >= totalSlides) {
      currentSlideIndex = 0;
    } else {
      currentSlideIndex = index;
    }
    
    showSlide(currentSlideIndex);
  }
  
  function nextSlide() {
    goToSlide(currentSlideIndex + 1);
    createSparkleEffect(nextBtn);
  }
  
  function prevSlide() {
    goToSlide(currentSlideIndex - 1);
    createSparkleEffect(prevBtn);
  }
  
  function updateSpeakerNotes(slideIndex) {
    // If speaker notes panel exists
    if (speakerNotesPanel) {
      // Clear current notes
      const notesContent = speakerNotesPanel.querySelector('.notes-content');
      if (notesContent) {
        // Try to get notes from current slide
        const currentSlide = slides[slideIndex];
        const slideNotes = currentSlide.getAttribute('data-notes');
        
        if (slideNotes) {
          // Convert to HTML with proper formatting
          let formattedHtml = '';
          const lines = slideNotes.split('\n');
          let scriptContent = [];
          let additionalInfo = [];
          let inAdditionalInfo = false;
          
          // Process each line
          lines.forEach(line => {
            line = line.trim();
            if (!line) return;
            
            // Check if line starts with bullet or dash
            if (line.startsWith('•') || line.startsWith('-')) {
              inAdditionalInfo = true;
              additionalInfo.push(line);
            } else {
              if (!inAdditionalInfo) {
                scriptContent.push(line);
              } else {
                additionalInfo.push(line);
              }
            }
          });
          
          // Format script content with paragraph spacing
          if (scriptContent.length > 0) {
            scriptContent.forEach(paragraph => {
              formattedHtml += `<p>${paragraph}</p>`;
            });
          }
          
          // Add additional info section if there are bullet points
          if (additionalInfo.length > 0) {
            formattedHtml += '<p><strong>ADDITIONAL INFO</strong></p><ul>';
            additionalInfo.forEach(info => {
              // Remove bullet or dash if present
              if (info.startsWith('•') || info.startsWith('-')) {
                info = info.substring(1).trim();
              }
              formattedHtml += `<li>${info}</li>`;
            });
            formattedHtml += '</ul>';
          }
          
          notesContent.innerHTML = formattedHtml;
        } else {
          notesContent.innerHTML = '<p>No speaker notes for this slide.</p>';
        }
      }
    }
  }
  
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      fullscreenToggle.innerHTML = '<i class="fas fa-compress"></i>';
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        fullscreenToggle.innerHTML = '<i class="fas fa-expand"></i>';
      }
    }
    createSparkleEffect(fullscreenToggle);
  }
  
  function toggleSpeakerNotes() {
    if (speakerNotesPanel) {
      speakerNotesPanel.classList.toggle('active');
      createSparkleEffect(speakerNotesButton);
    }
  }
  
  function closeSpeakerNotes() {
    if (speakerNotesPanel) {
      speakerNotesPanel.classList.remove('active');
    }
  }
  
  function createSparkleEffect(element) {
    // Create sparkle elements
    const numSparkles = 5;
    
    for (let i = 0; i < numSparkles; i++) {
      const sparkle = document.createElement('div');
      sparkle.classList.add('sparkle');
      
      // Position randomly around the element
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Random position in a circle around the element
      const angle = Math.random() * Math.PI * 2;
      const distance = 20 + Math.random() * 30;
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;
      
      sparkle.style.left = `${x}px`;
      sparkle.style.top = `${y}px`;
      
      // Add to body
      document.body.appendChild(sparkle);
      
      // Remove after animation completes
      setTimeout(() => {
        sparkle.remove();
      }, 1000);
    }
  }
  
  // Event Listeners
  if (prevBtn) prevBtn.addEventListener('click', prevSlide);
  if (nextBtn) nextBtn.addEventListener('click', nextSlide);
  if (fullscreenToggle) fullscreenToggle.addEventListener('click', toggleFullscreen);
  if (speakerNotesButton) speakerNotesButton.addEventListener('click', toggleSpeakerNotes);
  if (speakerNotesCloseBtn) speakerNotesCloseBtn.addEventListener('click', closeSpeakerNotes);
  
  // Keyboard Navigation
  document.addEventListener('keydown', function(e) {
    switch(e.key) {
      case 'ArrowRight':
      case ' ':
        nextSlide();
        break;
      case 'ArrowLeft':
        prevSlide();
        break;
      case 'f':
        toggleFullscreen();
        break;
      case 'n':
        toggleSpeakerNotes();
        break;
      case 'Escape':
        closeSpeakerNotes();
        break;
    }
  });
  
  // Initialize chart data loading and rendering
  function initCharts() {
    const platformChartCanvas = document.getElementById('platform-chart');
    
    if (platformChartCanvas) {
      const platformCtx = platformChartCanvas.getContext('2d');
      
      // Chart data from our survey
      const platformData = {
        labels: ['YouTube', 'TikTok', 'Snapchat', 'Instagram', 'Facebook', 'Discord', 'Twitter/X'],
      datasets: [{
          label: 'Teen Platform Usage 2023 (%)',
          data: [93, 63, 60, 59, 33, 28, 20],
        backgroundColor: [
            'rgba(255, 0, 0, 0.7)',      // YouTube red
            'rgba(0, 0, 0, 0.7)',         // TikTok dark
            'rgba(255, 252, 0, 0.7)',     // Snapchat yellow
            'rgba(131, 58, 180, 0.7)',    // Instagram purple
            'rgba(59, 89, 152, 0.7)',     // Facebook blue
            'rgba(114, 137, 218, 0.7)',   // Discord blurple
            'rgba(29, 161, 242, 0.7)'     // Twitter blue
          ],
          borderColor: [
            'rgba(255, 0, 0, 1)',
            'rgba(0, 0, 0, 1)',
            'rgba(255, 252, 0, 1)',
            'rgba(131, 58, 180, 1)',
            'rgba(59, 89, 152, 1)',
            'rgba(114, 137, 218, 1)',
            'rgba(29, 161, 242, 1)'
          ],
          borderWidth: 1
        }]
      };
      
      // Chart options
      const platformOptions = {
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              callback: function(value) {
                return value + '%';
              }
            }
          }
        },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
                return context.parsed.y + '% of teens';
              }
            }
          }
        },
        responsive: true,
        maintainAspectRatio: false
      };
      
      // Create chart
      new Chart(platformCtx, {
        type: 'bar',
        data: platformData,
        options: platformOptions
      });
    }
    
    // Other charts can be added here
  }
  
  // Initialize revenue bars with animation
  function initRevenueBars() {
    const revenueBars = document.querySelectorAll('.revenue-value');
    if (revenueBars.length > 0) {
      revenueBars.forEach(bar => {
        const targetWidth = bar.getAttribute('data-width');
        if (targetWidth) {
          setTimeout(() => {
            bar.style.width = targetWidth;
          }, 500);
        }
      });
    }
  }
  
  // Add interactive elements to the experience sections
  function enhanceExperienceSection() {
    // Original experience opportunity section
    const expSection = document.querySelector('.experience-opportunity');
    if (expSection) {
      expSection.addEventListener('click', () => {
        createSparkleEffect(expSection);
      });
    }
    
    // New experience examples
    const expExamples = document.querySelectorAll('.experience-example');
    if (expExamples.length > 0) {
      expExamples.forEach(example => {
        example.addEventListener('mouseenter', () => {
          createSparkleEffect(example);
        });
      });
    }
    
    // Make stat highlights interactive
    const statHighlights = document.querySelectorAll('.stat-highlight');
    if (statHighlights.length > 0) {
      statHighlights.forEach(stat => {
        stat.addEventListener('click', () => {
          createSparkleEffect(stat);
        });
      });
    }
  }
  
  // Add click effects to recommendation cards
  function enhanceRecommendations() {
    const recommendationCards = document.querySelectorAll('.recommendation-card');
    if (recommendationCards.length > 0) {
      recommendationCards.forEach(card => {
        card.addEventListener('click', () => {
          createSparkleEffect(card);
          
          // Add a subtle pulse animation
          card.classList.add('pulse-animation');
          setTimeout(() => {
            card.classList.remove('pulse-animation');
          }, 800);
        });
      });
    }
  }
  
  // Add floating effect to Disney logo
  function enhanceDisneyLogo() {
    const disneyLogo = document.querySelector('.disney-logo');
    if (disneyLogo) {
      disneyLogo.addEventListener('mouseenter', () => {
        createSparkleEffect(disneyLogo);
      });
    }
  }
  
  // Initialize napkin animation
  function initNapkinAnimation() {
    const napkinWritings = document.querySelectorAll('.napkin-writing');
    if (napkinWritings.length > 0) {
      napkinWritings.forEach(writing => {
        // Animation happens via CSS, but we could add more interactivity here
      });
    }
  }
  
  // Initialize everything and show first slide
  showSlide(currentSlideIndex);
  initCharts();
  initRevenueBars();
  enhanceExperienceSection();
  enhanceRecommendations();
  enhanceDisneyLogo();
  initNapkinAnimation();
  
  // For demo purposes, add some sparkles on page load
  setTimeout(() => {
    const title = document.querySelector('h1');
    if (title) createSparkleEffect(title);
  }, 1000);
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