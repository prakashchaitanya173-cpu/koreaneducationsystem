// Korean Education System Website Interactive Logic
document.addEventListener('DOMContentLoaded', () => {
  const data = window.KOREAN_EDU_DATA;
  let currentLang = 'en';
  try {
    currentLang = localStorage.getItem('korean_edu_lang') || 'en';
  } catch (e) {
    currentLang = 'en';
  }
  let activeStageId = 'kindergarten';
  let activeSuneungPeriod = 0;
  let currentQuizIndex = 0;
  let quizScore = 0;
  let selectedQuizAnswers = {};

  // DOM Elements
  const langToggleBtn = document.getElementById('lang-toggle-btn');
  const langLabel = document.getElementById('lang-label');
  const searchInput = document.getElementById('global-search-input');
  const searchResultsBox = document.getElementById('search-results-dropdown');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const backToTopBtn = document.getElementById('back-to-top');

  // Initialize
  initLanguage();
  highlightActiveNav();
  initOpeningSequence();
  renderStages();
  renderSchoolLife();
  renderSuneung();
  renderComparison('all');
  renderFacts();
  renderFaqs('all');
  initQuiz();
  initContactForm();
  initMobileMenu();
  initScrollListeners();
  initSearch();

  // --------------------------------------------------------------------------
  // Navigation & Active Link Highlight
  // --------------------------------------------------------------------------
  function highlightActiveNav() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('nav a, #mobile-menu a').forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;
      const targetPage = href.split('#')[0] || 'index.html';
      if (
        (targetPage === currentPath) ||
        (currentPath === '' && targetPage === 'index.html') ||
        (currentPath === '/' && targetPage === 'index.html')
      ) {
        link.classList.add('text-[#D82B38]', 'font-extrabold', 'border-b-2', 'border-[#D82B38]');
      }
    });
  }

  // --------------------------------------------------------------------------
  // Language Management
  // --------------------------------------------------------------------------
  function initLanguage() {
    data.currentLang = currentLang;
    if (langLabel) {
      langLabel.textContent = currentLang === 'en' ? '한국어' : 'English';
    }
    applyLanguageTranslations();

    if (langToggleBtn) {
      langToggleBtn.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'ko' : 'en';
        data.currentLang = currentLang;
        try {
          localStorage.setItem('korean_edu_lang', currentLang);
        } catch (e) {}
        if (langLabel) {
          langLabel.textContent = currentLang === 'en' ? '한국어' : 'English';
        }
        applyLanguageTranslations();
      });
    }
  }

  function applyLanguageTranslations() {
    // Update all elements with data-en and data-ko
    document.querySelectorAll('[data-en]').forEach(el => {
      const text = currentLang === 'ko' ? el.getAttribute('data-ko') : el.getAttribute('data-en');
      if (text) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = text;
        } else {
          el.innerHTML = text;
        }
      }
    });

    // Re-render dynamic sections with updated language
    renderStages();
    renderSchoolLife();
    renderSuneung();
    renderComparison(document.querySelector('.comp-filter-btn.active')?.dataset.category || 'all');
    renderFacts();
    renderFaqs(document.querySelector('.faq-filter-btn.active')?.dataset.category || 'all');
    renderQuizQuestion();
  }

  // --------------------------------------------------------------------------
  // Education Stages Section
  // --------------------------------------------------------------------------
  function renderStages() {
    const container = document.getElementById('stages-container');
    const tabsContainer = document.getElementById('stage-tabs');
    if (!container || !tabsContainer) return;

    // Render Stage Tabs
    tabsContainer.innerHTML = data.stages.map((stage) => {
      const isActive = stage.id === activeStageId;
      const title = currentLang === 'ko' ? stage.nameKo : stage.nameEn;
      const age = currentLang === 'ko' ? stage.ageKo : stage.ageEn;
      return `
        <button 
          onclick="window.selectStage('${stage.id}')"
          class="stage-tab-btn flex-1 text-left px-5 py-3.5 rounded-xl transition-all duration-200 border ${
            isActive 
              ? 'bg-[#0F2B5C] text-white border-[#0F2B5C] shadow-lg shadow-blue-950/20' 
              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
          }"
        >
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold uppercase tracking-wider ${isActive ? 'text-red-300' : 'text-slate-400'}">${stage.durationEn}</span>
            <span class="text-xs px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}">${stage.koreanTerm}</span>
          </div>
          <div class="font-bold text-base mt-1">${title}</div>
          <div class="text-xs mt-0.5 ${isActive ? 'text-blue-200' : 'text-slate-500'}">${age}</div>
        </button>
      `;
    }).join('');

    // Render Active Stage Card
    const current = data.stages.find(s => s.id === activeStageId) || data.stages[0];
    const isKo = currentLang === 'ko';
    
    container.innerHTML = `
      <div class="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden hover-lift transition-all">
        <div class="p-6 md:p-8 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-slate-50 to-white">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${current.badgeColor}">
              <span class="w-2 h-2 rounded-full bg-current animate-ping"></span>
              <span>${isKo ? current.compulsoryKo : current.compulsoryEn}</span>
            </div>
            <h3 class="text-2xl md:text-3xl font-extrabold text-[#0F2B5C] mt-2">
              ${isKo ? current.nameKo : current.nameEn}
            </h3>
            <p class="text-slate-500 text-sm mt-1">
              ${isKo ? '대상 연령: ' + current.ageKo + ' | 수업 연한: ' + current.durationKo : 'Ages: ' + current.ageEn + ' | Duration: ' + current.durationEn}
            </p>
          </div>
          <div class="text-right">
            <span class="text-5xl font-black text-slate-200">${current.koreanTerm}</span>
          </div>
        </div>

        <div class="p-6 md:p-8 space-y-6">
          <div>
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              ${isKo ? '교육 개요 및 목적' : 'Stage Overview & Core Purpose'}
            </h4>
            <p class="text-slate-700 leading-relaxed text-base font-medium">
              ${isKo ? current.summaryKo : current.summaryEn}
            </p>
            <p class="text-slate-600 text-sm mt-2">
              ${isKo ? current.purposeKo : current.purposeEn}
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
            <div>
              <h4 class="text-xs font-bold uppercase tracking-wider text-[#0F2B5C] mb-3 flex items-center gap-2">
                <svg class="w-4 h-4 text-[#D82B38]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                ${isKo ? '주요 특징 및 교육과정' : 'Key Curricular Highlights'}
              </h4>
              <ul class="space-y-2.5">
                ${(isKo ? current.highlightsKo : current.highlightsEn).map(item => `
                  <li class="flex items-start text-sm text-slate-700 gap-2.5">
                    <span class="inline-block w-1.5 h-1.5 rounded-full bg-[#0F2B5C] mt-2 shrink-0"></span>
                    <span>${item}</span>
                  </li>
                `).join('')}
              </ul>
            </div>

            <div class="bg-slate-50 rounded-xl p-5 border border-slate-200/80">
              <h4 class="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-2">
                <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                ${isKo ? '표준 일과 시간' : 'Typical Daily Schedule'}
              </h4>
              <p class="text-sm font-semibold text-slate-800">
                ${isKo ? current.dailyRoutineKo : current.dailyRoutineEn}
              </p>
              <div class="mt-4 pt-3 border-t border-slate-200 text-xs text-slate-500">
                ${isKo ? '※ 방과후 프로그램 및 방학 중 돌봄교실 지원' : '※ Includes government after-school care and enrichment options.'}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  window.selectStage = function(id) {
    activeStageId = id;
    renderStages();
  };

  // --------------------------------------------------------------------------
  // School Life Section
  // --------------------------------------------------------------------------
  function renderSchoolLife() {
    const container = document.getElementById('school-life-container');
    if (!container) return;
    const isKo = currentLang === 'ko';

    container.innerHTML = data.schoolLife.map(item => `
      <div class="bg-white rounded-2xl border border-slate-200/90 shadow-md p-6 md:p-7 hover-lift transition-all flex flex-col justify-between">
        <div>
          <div class="w-12 h-12 rounded-xl bg-blue-50 text-[#0F2B5C] flex items-center justify-center mb-4 border border-blue-100">
            ${getIconSvg(item.icon)}
          </div>
          <h3 class="text-xl font-bold text-[#0F2B5C] mb-2">
            ${isKo ? item.titleKo : item.titleEn}
          </h3>
          <p class="text-sm text-slate-600 leading-relaxed mb-4">
            ${isKo ? item.descriptionKo : item.descriptionEn}
          </p>
        </div>
        <div class="pt-4 border-t border-slate-100">
          <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            ${isKo ? '핵심 포인트' : 'Core Aspects'}
          </h4>
          <ul class="space-y-2">
            ${(isKo ? item.keyPointsKo : item.keyPointsEn).map(pt => `
              <li class="flex items-start text-xs text-slate-700 gap-2">
                <span class="text-[#D82B38] font-bold mt-0.5">•</span>
                <span>${pt}</span>
              </li>
            `).join('')}
          </ul>
        </div>
      </div>
    `).join('');
  }

  // --------------------------------------------------------------------------
  // Suneung & Examinations Section
  // --------------------------------------------------------------------------
  function renderSuneung() {
    const isKo = currentLang === 'ko';
    const s = data.suneung;

    // Measures
    const measuresContainer = document.getElementById('suneung-measures');
    if (measuresContainer) {
      const list = isKo ? s.nationalMeasuresKo : s.nationalMeasuresEn;
      measuresContainer.innerHTML = list.map(m => `
        <div class="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/15 text-white">
          <div class="w-10 h-10 rounded-lg bg-red-600/30 text-rose-300 flex items-center justify-center mb-3">
            ${getIconSvg(m.icon)}
          </div>
          <h4 class="font-bold text-base mb-1.5">${m.title}</h4>
          <p class="text-xs text-slate-200 leading-relaxed">${m.desc}</p>
        </div>
      `).join('');
    }

    // Timetable
    const timetableContainer = document.getElementById('suneung-timetable');
    if (timetableContainer) {
      timetableContainer.innerHTML = s.schedule.map((item, idx) => {
        const isListening = idx === 3;
        return `
          <div class="p-4 rounded-xl border ${isListening ? 'bg-rose-50/80 border-rose-300' : 'bg-white border-slate-200'} flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div class="flex items-center gap-3">
              <span class="px-2.5 py-1 rounded-md text-xs font-extrabold ${isListening ? 'bg-rose-600 text-white' : 'bg-[#0F2B5C] text-white'}">
                ${item.period}
              </span>
              <div>
                <h5 class="font-bold text-slate-900 text-sm">
                  ${isKo ? item.subjectKo : item.subjectEn}
                </h5>
                <p class="text-xs text-slate-500">${item.time}</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              ${isListening ? `<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-100 text-rose-800"><svg class="w-3 h-3 text-rose-600" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z"></path></svg>${isKo ? '항공기 통제 시간' : 'No-Fly Period'}</span>` : ''}
              <span class="text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">${item.qCount}</span>
            </div>
          </div>
        `;
      }).join('');
    }

    // Admissions Split
    const splitContainer = document.getElementById('suneung-admissions-split');
    if (splitContainer) {
      const split = isKo ? s.admissionsSplitKo : s.admissionsSplitEn;
      splitContainer.innerHTML = `
        <div class="bg-blue-50 border border-blue-200 rounded-xl p-5">
          <div class="flex items-center justify-between mb-2">
            <h5 class="font-bold text-[#0F2B5C] text-sm">${isKo ? '수시 모집 (Susie - Early)' : 'Susie (Early Rolling Admission)'}</h5>
            <span class="text-xs font-extrabold px-2 py-0.5 rounded-full bg-blue-600 text-white">~78%</span>
          </div>
          <p class="text-xs text-slate-600 leading-relaxed">${split.susie}</p>
        </div>
        <div class="bg-rose-50 border border-rose-200 rounded-xl p-5">
          <div class="flex items-center justify-between mb-2">
            <h5 class="font-bold text-rose-900 text-sm">${isKo ? '정시 모집 (Jeongsi - Regular)' : 'Jeongsi (Regular CSAT Admission)'}</h5>
            <span class="text-xs font-extrabold px-2 py-0.5 rounded-full bg-rose-600 text-white">~22%</span>
          </div>
          <p class="text-xs text-slate-600 leading-relaxed">${split.jeongsi}</p>
        </div>
      `;
    }
  }

  // --------------------------------------------------------------------------
  // Korea vs India Education Comparison
  // --------------------------------------------------------------------------
  function renderComparison(filter) {
    const container = document.getElementById('comparison-container');
    if (!container) return;
    const isKo = currentLang === 'ko';

    container.innerHTML = data.comparison.map(row => `
      <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover-lift transition-all">
        <div class="bg-slate-100/80 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
          <h4 class="font-bold text-sm text-[#0F2B5C]">${isKo ? row.categoryKo : row.categoryEn}</h4>
          <span class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">${isKo ? '비교 분석' : 'Comparative Metric'}</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          <div class="p-5 bg-gradient-to-br from-blue-50/40 to-transparent">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-base">🇰🇷</span>
              <span class="text-xs font-bold uppercase tracking-wider text-[#0F2B5C]">${isKo ? '대한민국 (South Korea)' : 'South Korea'}</span>
            </div>
            <p class="text-sm text-slate-700 leading-relaxed">
              ${isKo ? row.koreaKo : row.koreaEn}
            </p>
          </div>
          <div class="p-5 bg-gradient-to-br from-amber-50/30 to-transparent">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-base">🇮🇳</span>
              <span class="text-xs font-bold uppercase tracking-wider text-amber-900">${isKo ? '인도 (India)' : 'India'}</span>
            </div>
            <p class="text-sm text-slate-700 leading-relaxed">
              ${isKo ? row.indiaKo : row.indiaEn}
            </p>
          </div>
        </div>
      </div>
    `).join('');
  }

  // --------------------------------------------------------------------------
  // Interesting Facts Section
  // --------------------------------------------------------------------------
  function renderFacts() {
    const container = document.getElementById('facts-container');
    if (!container) return;
    const isKo = currentLang === 'ko';

    container.innerHTML = data.interestingFacts.map(fact => `
      <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover-lift transition-all flex flex-col justify-between group">
        <div>
          ${fact.image ? `
            <div class="relative h-48 w-full overflow-hidden bg-slate-900">
              <img 
                src="${fact.image}" 
                alt="${isKo ? fact.imageAltKo : fact.imageAltEn}" 
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                loading="lazy"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none"></div>
              
              <!-- Stat Badge Overlay -->
              <div class="absolute bottom-3 left-4 right-4 flex items-end justify-between text-white pointer-events-none">
                <div>
                  <span class="text-[11px] font-extrabold uppercase tracking-wider text-rose-300 drop-shadow-sm block mb-0.5">
                    ${isKo ? fact.statLabelKo : fact.statLabelEn}
                  </span>
                  <span class="text-2xl sm:text-3xl font-black tracking-tight drop-shadow-md text-white">
                    ${fact.stat}
                  </span>
                </div>
                <div class="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center shadow-lg">
                  ${getIconSvg(fact.icon)}
                </div>
              </div>
            </div>
          ` : `
            <div class="p-6 pb-0 flex items-center justify-between mb-4">
              <span class="text-3xl font-black text-[#0F2B5C] tracking-tight">${fact.stat}</span>
              <div class="w-10 h-10 rounded-xl bg-red-50 text-[#D82B38] flex items-center justify-center">
                ${getIconSvg(fact.icon)}
              </div>
            </div>
          `}
          <div class="p-6">
            <h4 class="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#0F2B5C] transition-colors mb-2 leading-snug">
              ${isKo ? fact.titleKo : fact.titleEn}
            </h4>
            <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
              ${isKo ? fact.descKo : fact.descEn}
            </p>
          </div>
        </div>

        <div class="px-6 pb-5 pt-0 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-500">
          <span class="flex items-center gap-1.5 text-emerald-700">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            ${isKo ? '공식 교육 지표' : 'Verified Metric'}
          </span>
          <span class="text-slate-400 font-mono text-[10px]">#Facts</span>
        </div>
      </div>
    `).join('');
  }

  // --------------------------------------------------------------------------
  // Frequently Asked Questions (FAQ)
  // --------------------------------------------------------------------------
  function renderFaqs(category) {
    const container = document.getElementById('faq-container');
    if (!container) return;
    const isKo = currentLang === 'ko';

    const filtered = category === 'all' 
      ? data.faqs 
      : data.faqs.filter(f => f.categoryEn.toLowerCase() === category.toLowerCase());

    container.innerHTML = filtered.map((faq, idx) => `
      <div class="faq-item border border-slate-200 rounded-xl bg-white overflow-hidden shadow-sm transition-all">
        <button 
          type="button" 
          onclick="window.toggleFaq(${idx})" 
          class="w-full text-left px-6 py-4.5 flex items-center justify-between gap-4 font-bold text-slate-800 text-sm md:text-base hover:text-[#0F2B5C] transition-colors"
          aria-expanded="false"
        >
          <span class="flex items-center gap-3">
            <span class="w-6 h-6 rounded-full bg-blue-100 text-[#0F2B5C] text-xs flex items-center justify-center font-extrabold shrink-0">Q</span>
            <span>${isKo ? faq.qKo : faq.qEn}</span>
          </span>
          <svg class="faq-icon w-5 h-5 text-slate-400 transition-transform duration-200 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
        </button>
        <div class="faq-answer px-6 pb-5 pt-1 text-xs md:text-sm text-slate-600 leading-relaxed hidden border-t border-slate-100 bg-slate-50/50">
          <p class="pt-3">${isKo ? faq.aKo : faq.aEn}</p>
        </div>
      </div>
    `).join('');
  }

  window.toggleFaq = function(idx) {
    const items = document.querySelectorAll('.faq-item');
    if (items[idx]) {
      const answer = items[idx].querySelector('.faq-answer');
      const icon = items[idx].querySelector('.faq-icon');
      const isHidden = answer.classList.contains('hidden');
      
      // Close all others
      items.forEach(it => {
        it.querySelector('.faq-answer')?.classList.add('hidden');
        it.querySelector('.faq-icon')?.classList.remove('rotate-180');
      });

      if (isHidden) {
        answer.classList.remove('hidden');
        icon.classList.add('rotate-180');
      }
    }
  };

  // --------------------------------------------------------------------------
  // Interactive Quiz
  // --------------------------------------------------------------------------
  function initQuiz() {
    currentQuizIndex = 0;
    quizScore = 0;
    selectedQuizAnswers = {};
    renderQuizQuestion();
  }

  function renderQuizQuestion() {
    const quizCard = document.getElementById('quiz-card');
    if (!quizCard) return;
    const isKo = currentLang === 'ko';
    const total = data.quiz.length;

    // Completed state
    if (currentQuizIndex >= total) {
      const percentage = Math.round((quizScore / total) * 100);
      quizCard.innerHTML = `
        <div class="text-center py-10 px-6 space-y-4">
          <div class="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl font-black">
            🎉
          </div>
          <h3 class="text-2xl font-black text-[#0F2B5C]">
            ${isKo ? '퀴즈 완료! 축하합니다!' : 'Quiz Completed! Great Job!'}
          </h3>
          <p class="text-slate-600 text-sm max-w-md mx-auto">
            ${isKo 
              ? `총 ${total}문제 중 ${quizScore}문제를 맞히셨습니다 (${percentage}%). 한국의 교육 제도에 대해 많은 것을 배우셨네요!` 
              : `You scored ${quizScore} out of ${total} (${percentage}%). You are now well-versed in South Korea's education landscape!`}
          </p>
          <div class="pt-4">
            <button 
              onclick="window.restartQuiz()" 
              class="px-6 py-3 rounded-xl bg-[#0F2B5C] text-white font-bold text-sm hover:bg-blue-900 transition-all shadow-md"
            >
              ${isKo ? '퀴즈 다시 풀기' : 'Restart Quiz'}
            </button>
          </div>
        </div>
      `;
      return;
    }

    const q = data.quiz[currentQuizIndex];
    const questionText = isKo ? q.questionKo : q.questionEn;
    const options = isKo ? q.optionsKo : q.optionsEn;
    const hasAnswered = selectedQuizAnswers.hasOwnProperty(currentQuizIndex);

    quizCard.innerHTML = `
      <div class="space-y-6">
        <div class="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
          <span>${isKo ? `질문 ${currentQuizIndex + 1} / ${total}` : `Question ${currentQuizIndex + 1} of ${total}`}</span>
          <span class="text-[#0F2B5C] font-extrabold">${isKo ? `점수: ${quizScore}` : `Score: ${quizScore}`}</span>
        </div>

        <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div class="bg-[#D82B38] h-full transition-all duration-300" style="width: ${((currentQuizIndex + 1) / total) * 100}%"></div>
        </div>

        <h4 class="text-lg md:text-xl font-bold text-slate-900 leading-snug">
          ${questionText}
        </h4>

        <div class="space-y-3">
          ${options.map((opt, oIdx) => {
            let btnStyle = 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50';
            if (hasAnswered) {
              if (oIdx === q.correctIndex) {
                btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-semibold';
              } else if (selectedQuizAnswers[currentQuizIndex] === oIdx) {
                btnStyle = 'bg-rose-50 border-rose-300 text-rose-900 line-through';
              } else {
                btnStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
              }
            }
            return `
              <button 
                onclick="window.selectQuizOption(${oIdx})"
                ${hasAnswered ? 'disabled' : ''}
                class="w-full text-left p-4 rounded-xl border text-sm transition-all flex items-center justify-between gap-3 ${btnStyle}"
              >
                <span>${opt}</span>
                ${hasAnswered && oIdx === q.correctIndex ? '<span class="text-emerald-600 font-bold">✓</span>' : ''}
                ${hasAnswered && selectedQuizAnswers[currentQuizIndex] === oIdx && oIdx !== q.correctIndex ? '<span class="text-rose-600 font-bold">✕</span>' : ''}
              </button>
            `;
          }).join('')}
        </div>

        ${hasAnswered ? `
          <div class="p-4 rounded-xl ${selectedQuizAnswers[currentQuizIndex] === q.correctIndex ? 'bg-emerald-50 border border-emerald-200 text-emerald-900' : 'bg-amber-50 border border-amber-200 text-amber-900'} text-xs leading-relaxed">
            <span class="font-bold">${isKo ? '해설: ' : 'Explanation: '}</span>
            <span>${isKo ? q.explanationKo : q.explanationEn}</span>
          </div>

          <div class="flex justify-end pt-2">
            <button 
              onclick="window.nextQuizQuestion()" 
              class="px-5 py-2.5 rounded-xl bg-[#0F2B5C] text-white font-bold text-xs hover:bg-blue-900 transition-all shadow-md"
            >
              ${currentQuizIndex + 1 < total ? (isKo ? '다음 질문 →' : 'Next Question →') : (isKo ? '결과 보기' : 'See Results')}
            </button>
          </div>
        ` : ''}
      </div>
    `;
  }

  window.selectQuizOption = function(idx) {
    if (selectedQuizAnswers.hasOwnProperty(currentQuizIndex)) return;
    const q = data.quiz[currentQuizIndex];
    selectedQuizAnswers[currentQuizIndex] = idx;
    if (idx === q.correctIndex) {
      quizScore++;
    }
    renderQuizQuestion();
  };

  window.nextQuizQuestion = function() {
    currentQuizIndex++;
    renderQuizQuestion();
  };

  window.restartQuiz = function() {
    initQuiz();
  };

  // --------------------------------------------------------------------------
  // Contact Form
  // --------------------------------------------------------------------------
  function initContactForm() {
    const form = document.getElementById('contact-form');
    const toast = document.getElementById('contact-toast');
    if (!form || !toast) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const isKo = currentLang === 'ko';
      const name = document.getElementById('contact-name')?.value;
      
      // Show Toast
      toast.classList.remove('hidden');
      toast.innerHTML = `
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
          <div>
            <div class="font-bold text-xs">${isKo ? '메시지가 성공적으로 전송되었습니다!' : 'Thank you, your message has been sent!'}</div>
            <div class="text-[11px] text-slate-500">${isKo ? `${name} 님의 문의가 접수되었습니다.` : `We received your inquiry, ${name}.`}</div>
          </div>
        </div>
      `;

      form.reset();
      setTimeout(() => {
        toast.classList.add('hidden');
      }, 5000);
    });
  }

  // --------------------------------------------------------------------------
  // Global Live Search
  // --------------------------------------------------------------------------
  function initSearch() {
    if (!searchInput || !searchResultsBox) return;

    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      if (!query || query.length < 2) {
        searchResultsBox.classList.add('hidden');
        return;
      }

      const results = [];
      const isKo = currentLang === 'ko';

      // Search Stages
      data.stages.forEach(s => {
        if (
          s.nameEn.toLowerCase().includes(query) || 
          s.nameKo.toLowerCase().includes(query) || 
          s.summaryEn.toLowerCase().includes(query) || 
          s.summaryKo.toLowerCase().includes(query)
        ) {
          results.push({
            type: isKo ? '교육 단계' : 'Stage',
            title: isKo ? s.nameKo : s.nameEn,
            target: 'education-structure'
          });
        }
      });

      // Search Suneung
      if (
        'suneung csat exam 수능 대학수학능력시험 test schedule 엿 listening flight'.includes(query)
      ) {
        results.push({
          type: isKo ? '시험 및 입시' : 'Examinations',
          title: isKo ? '대학수학능력시험 (수능) & 내신' : 'Suneung (CSAT) & National Test Day',
          target: 'examinations'
        });
      }

      // Search School Life
      data.schoolLife.forEach(item => {
        if (
          item.titleEn.toLowerCase().includes(query) || 
          item.titleKo.toLowerCase().includes(query) || 
          item.descriptionEn.toLowerCase().includes(query)
        ) {
          results.push({
            type: isKo ? '학교 생활' : 'School Life',
            title: isKo ? item.titleKo : item.titleEn,
            target: 'school-life'
          });
        }
      });

      // Search Comparison
      if ('india compare difference calendar board cbse jee neet vs'.includes(query)) {
        results.push({
          type: isKo ? '한-인 교육 비교' : 'Comparison',
          title: isKo ? '한국 vs 인도 교육 체계 비교' : 'Korean Education vs Indian Education',
          target: 'comparison'
        });
      }

      // Search FAQs
      data.faqs.forEach(f => {
        if (f.qEn.toLowerCase().includes(query) || f.qKo.toLowerCase().includes(query) || f.aEn.toLowerCase().includes(query)) {
          results.push({
            type: 'FAQ',
            title: isKo ? f.qKo : f.qEn,
            target: 'faq'
          });
        }
      });

      // Render Dropdown
      if (results.length === 0) {
        searchResultsBox.innerHTML = `
          <div class="p-4 text-xs text-slate-500 text-center">
            ${isKo ? '일치하는 검색 결과가 없습니다.' : 'No matching results found.'}
          </div>
        `;
      } else {
        searchResultsBox.innerHTML = results.slice(0, 5).map(r => `
          <button 
            onclick="window.jumpToSection('${r.target}')"
            class="w-full text-left p-3 hover:bg-slate-50 border-b border-slate-100 last:border-0 flex items-center justify-between"
          >
            <div>
              <span class="text-[10px] font-extrabold uppercase tracking-wider text-[#D82B38] px-1.5 py-0.5 rounded bg-rose-50">${r.type}</span>
              <p class="text-xs font-bold text-slate-800 mt-1">${r.title}</p>
            </div>
            <span class="text-xs text-slate-400">→</span>
          </button>
        `).join('');
      }

      searchResultsBox.classList.remove('hidden');
    });

    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !searchResultsBox.contains(e.target)) {
        searchResultsBox.classList.add('hidden');
      }
    });
  }

  const targetPageMap = {
    'education-structure': 'structure.html',
    'school-life': 'school-life.html',
    'examinations': 'examinations.html',
    'comparison': 'comparison.html',
    'facts': 'facts.html',
    'quiz': 'quiz.html',
    'faq': 'faq.html',
    'contact': 'faq.html#contact',
    'home': 'index.html'
  };

  window.jumpToSection = function(id) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      if (searchResultsBox) searchResultsBox.classList.add('hidden');
      if (searchInput) searchInput.value = '';
    } else if (targetPageMap[id]) {
      window.location.href = targetPageMap[id];
    }
  };

  // --------------------------------------------------------------------------
  // Mobile Menu & Scroll
  // --------------------------------------------------------------------------
  function initMobileMenu() {
    if (!mobileMenuBtn || !mobileMenu) return;
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
    // Close on navigation link click
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => mobileMenu.classList.add('hidden'));
    });
  }

  function initScrollListeners() {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTopBtn?.classList.remove('hidden');
      } else {
        backToTopBtn?.classList.add('hidden');
      }
    });
    backToTopBtn?.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --------------------------------------------------------------------------
  // Full-Screen 5-Second Opening Sequence ("안녕하세요") Controller
  // --------------------------------------------------------------------------
  function initOpeningSequence() {
    const overlay = document.getElementById('intro-overlay');
    if (!overlay) {
      document.body.classList.remove('intro-active');
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = prefersReducedMotion ? 2800 : 5000;
    let isDismissed = false;

    function finishIntro() {
      if (isDismissed) return;
      isDismissed = true;
      document.body.classList.remove('intro-active');
      overlay.classList.add('intro-dismissed');
      setTimeout(() => {
        overlay.style.display = 'none';
        overlay.setAttribute('aria-hidden', 'true');
      }, 450);
    }

    // Auto finish after exactly 5 seconds (5000ms)
    setTimeout(finishIntro, duration);
  }

  // Helper SVG Icons
  function getIconSvg(name) {
    switch(name) {
      case 'sparkles':
        return '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>';
      case 'book-open':
        return '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>';
      case 'school':
        return '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>';
      case 'award':
        return '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg>';
      case 'graduation-cap':
        return '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 14l9-5-9-5-9 5 9 5z"></path><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path></svg>';
      case 'clock':
        return '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
      case 'shirt':
        return '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h10M5 7l2-4h10l2 4v12a2 2 0 01-2 2H7a2 2 0 01-2-2V7z"></path></svg>';
      case 'users':
        return '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>';
      case 'music':
        return '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12 0c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path></svg>';
      case 'plane':
        return '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>';
      case 'shield-alert':
        return '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>';
      case 'building-2':
        return '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>';
      case 'heart':
        return '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>';
      case 'trophy':
        return '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>';
      case 'cpu':
        return '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path></svg>';
      case 'trending-up':
        return '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>';
      case 'globe':
        return '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>';
      case 'flame':
        return '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"></path></svg>';
      default:
        return '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
    }
  }
});
