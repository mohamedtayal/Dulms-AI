/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║  MOSTAFA AI - Chat Application                                            ║
 * ║  Modern chat interface with GSAP animations                               ║
 * ╠══════════════════════════════════════════════════════════════════════════╣
 * ║  Features:                                                                ║
 * ║  • Smooth entrance animations                                            ║
 * ║  • Message animations with stagger                                       ║
 * ║  • Typing indicator with GSAP timeline                                   ║
 * ║  • Smart auto-scroll (pauses when user scrolls up)                       ║
 * ║  • Mock API with realistic delays                                        ║
 * ║  • Keyboard accessible                                                   ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 */

(function() {
  'use strict';

  // ═══════════════════════════════════════════════════════════════════════════
  // CONFIGURATION
  // ═══════════════════════════════════════════════════════════════════════════
  const CONFIG = {
    typingDelay: { min: 1000, max: 2500 },  // Bot "thinking" time
    messageDelay: 300,                       // Delay before showing bot response
    autoScrollThreshold: 100,                // Pixels from bottom to trigger auto-scroll
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // MOCK RESPONSES
  // Bot responses for demo purposes
  // ═══════════════════════════════════════════════════════════════════════════
  const BOT_RESPONSES = [
    'مرحباً! كيف يمكنني مساعدتك اليوم؟ 😊',
    'هذا سؤال رائع! دعني أفكر في الإجابة المناسبة...',
    'بالتأكيد، يسعدني مساعدتك في ذلك! 🚀',
    'شكراً لسؤالك. الذكاء الاصطناعي هو مجال واسع يشمل تعلم الآلة والتعلم العميق ومعالجة اللغات الطبيعية.',
    'أنا هنا لمساعدتك في أي وقت. هل لديك أسئلة أخرى؟',
    'هذه فكرة مثيرة للاهتمام! دعنا نستكشفها معاً.',
    'يمكنني مساعدتك في البرمجة، الترجمة، الكتابة، وأكثر من ذلك بكثير! 💡',
    'أتفهم ما تقصده. هل تريد المزيد من التفاصيل حول هذا الموضوع؟',
  ];

  // ═══════════════════════════════════════════════════════════════════════════
  // DOM ELEMENTS
  // ═══════════════════════════════════════════════════════════════════════════
  const elements = {
    chat: document.getElementById('chat'),
    messagesContainer: document.getElementById('messagesContainer'),
    messagesList: document.getElementById('messagesList'),
    typingIndicator: document.getElementById('typingIndicator'),
    chatForm: document.getElementById('chatForm'),
    messageInput: document.getElementById('messageInput'),
    sendBtn: document.getElementById('sendBtn'),
    panel: document.getElementById('panel'),
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // STATE
  // ═══════════════════════════════════════════════════════════════════════════
  const state = {
    isUserScrolling: false,
    isTyping: false,
    typingTimeline: null,
    messageCount: 0,
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // INITIALIZATION
  // ═══════════════════════════════════════════════════════════════════════════
  function init() {
    // Check for GSAP
    if (typeof gsap === 'undefined') {
      console.warn('GSAP not loaded. Animations disabled.');
      document.body.classList.add('no-js');
      initWithoutAnimations();
      return;
    }

    // Run entrance animations
    runEntranceAnimations();
    
    // Setup typing indicator animation
    setupTypingAnimation();
    
    // Bind events
    bindEvents();
    
    // Add welcome message
    setTimeout(() => {
      addMessage('مرحباً بك! أنا MOSTAFA AI، مساعدك الذكي. كيف يمكنني مساعدتك اليوم؟ ✨', 'bot');
    }, 800);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // ENTRANCE ANIMATIONS
  // ═══════════════════════════════════════════════════════════════════════════
  function runEntranceAnimations() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Chat container entrance
    tl.from(elements.chat, {
      y: 60,
      opacity: 0,
      scale: 0.95,
      duration: 0.8,
    });

    // Panel entrance (if visible)
    if (window.innerWidth >= 1025) {
      tl.from(elements.panel, {
        x: 40,
        opacity: 0,
        duration: 0.6,
      }, '-=0.4');

      // Panel actions stagger
      tl.from('.panel__action', {
        y: 20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.4,
      }, '-=0.3');
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // TYPING INDICATOR ANIMATION
  // ═══════════════════════════════════════════════════════════════════════════
  function setupTypingAnimation() {
    const dots = elements.typingIndicator.querySelectorAll('.chat__typing-dot');
    
    state.typingTimeline = gsap.timeline({ repeat: -1, paused: true });
    
    state.typingTimeline.to(dots, {
      y: -8,
      duration: 0.4,
      ease: 'power2.inOut',
      stagger: {
        each: 0.15,
        yoyo: true,
        repeat: 1,
      },
    });
  }

  function showTyping() {
    elements.typingIndicator.hidden = false;
    state.isTyping = true;
    
    // Animate typing indicator entrance
    gsap.fromTo(elements.typingIndicator, 
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
    );
    
    state.typingTimeline.play();
    scrollToBottom();
  }

  function hideTyping() {
    state.typingTimeline.pause();
    
    gsap.to(elements.typingIndicator, {
      opacity: 0,
      y: -10,
      duration: 0.2,
      ease: 'power2.in',
      onComplete: () => {
        elements.typingIndicator.hidden = true;
        state.isTyping = false;
      }
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // MESSAGE HANDLING
  // ═══════════════════════════════════════════════════════════════════════════
  function addMessage(text, sender = 'user') {
    const messageEl = createMessageElement(text, sender);
    elements.messagesList.appendChild(messageEl);
    state.messageCount++;
    
    // Animate message entrance
    animateMessageEntrance(messageEl, sender);
    
    // Auto-scroll
    scrollToBottom();
    
    return messageEl;
  }

  function createMessageElement(text, sender) {
    const isUser = sender === 'user';
    const time = new Date().toLocaleTimeString('ar-EG', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    const messageHTML = `
      <div class="message__avatar">
        <svg viewBox="0 0 24 24" fill="currentColor">
          ${isUser 
            ? '<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>'
            : '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>'
          }
        </svg>
      </div>
      <div class="message__content">
        <div class="message__bubble">${escapeHTML(text)}</div>
        <span class="message__time">${time}</span>
      </div>
    `;

    const div = document.createElement('div');
    div.className = `message message--${sender}`;
    div.innerHTML = messageHTML;
    div.setAttribute('role', 'article');
    div.setAttribute('aria-label', `رسالة من ${isUser ? 'أنت' : 'MOSTAFA AI'}`);
    
    return div;
  }

  function animateMessageEntrance(messageEl, sender) {
    const isUser = sender === 'user';
    
    gsap.fromTo(messageEl,
      {
        opacity: 0,
        y: 20,
        scale: 0.95,
        x: isUser ? -30 : 30,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        x: 0,
        duration: 0.5,
        ease: 'back.out(1.2)',
      }
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SEND MESSAGE
  // ═══════════════════════════════════════════════════════════════════════════
  function sendMessage(text) {
    if (!text.trim() || state.isTyping) return;

    // Add user message
    addMessage(text, 'user');
    
    // Clear input
    elements.messageInput.value = '';
    updateSendButton();
    
    // Animate send button
    animateSendButton();
    
    // Show typing and get bot response
    setTimeout(() => {
      showTyping();
      
      // Simulate bot response delay
      const delay = randomBetween(CONFIG.typingDelay.min, CONFIG.typingDelay.max);
      
      setTimeout(() => {
        hideTyping();
        
        setTimeout(() => {
          const response = getRandomResponse();
          addMessage(response, 'bot');
        }, CONFIG.messageDelay);
        
      }, delay);
    }, 300);
  }

  function animateSendButton() {
    // Press animation
    gsap.to(elements.sendBtn, {
      scale: 0.85,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: 'power2.inOut',
    });
    
    // Ripple effect
    elements.sendBtn.classList.add('ripple');
    setTimeout(() => elements.sendBtn.classList.remove('ripple'), 600);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SCROLL HANDLING
  // ═══════════════════════════════════════════════════════════════════════════
  function scrollToBottom(force = false) {
    if (state.isUserScrolling && !force) return;
    
    const container = elements.messagesContainer;
    
    gsap.to(container, {
      scrollTop: container.scrollHeight,
      duration: 0.4,
      ease: 'power2.out',
    });
  }

  function handleScroll() {
    const container = elements.messagesContainer;
    const { scrollTop, scrollHeight, clientHeight } = container;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    
    state.isUserScrolling = distanceFromBottom > CONFIG.autoScrollThreshold;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // EVENT BINDINGS
  // ═══════════════════════════════════════════════════════════════════════════
  function bindEvents() {
    // Form submit
    elements.chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      sendMessage(elements.messageInput.value);
    });

    // Input changes
    elements.messageInput.addEventListener('input', updateSendButton);
    
    // Keyboard shortcut (Enter to send)
    elements.messageInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage(elements.messageInput.value);
      }
    });

    // Scroll detection
    elements.messagesContainer.addEventListener('scroll', handleScroll);

    // Quick actions (panel)
    document.querySelectorAll('.panel__action').forEach(btn => {
      btn.addEventListener('click', () => {
        const prompt = btn.dataset.prompt;
        if (prompt) {
          elements.messageInput.value = prompt;
          updateSendButton();
          elements.messageInput.focus();
        }
      });
    });

    // Window resize - re-check panel visibility
    window.addEventListener('resize', debounce(() => {
      // Could add responsive adjustments here
    }, 250));
  }

  function updateSendButton() {
    const hasText = elements.messageInput.value.trim().length > 0;
    elements.sendBtn.disabled = !hasText;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // FALLBACK (No JS animations)
  // ═══════════════════════════════════════════════════════════════════════════
  function initWithoutAnimations() {
    bindEvents();
    addMessageNoAnimation('مرحباً بك! أنا MOSTAFA AI، مساعدك الذكي. كيف يمكنني مساعدتك اليوم؟ ✨', 'bot');
  }

  function addMessageNoAnimation(text, sender) {
    const messageEl = createMessageElement(text, sender);
    elements.messagesList.appendChild(messageEl);
    elements.messagesContainer.scrollTop = elements.messagesContainer.scrollHeight;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // UTILITIES
  // ═══════════════════════════════════════════════════════════════════════════
  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function getRandomResponse() {
    return BOT_RESPONSES[Math.floor(Math.random() * BOT_RESPONSES.length)];
  }

  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // START APPLICATION
  // ═══════════════════════════════════════════════════════════════════════════
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
