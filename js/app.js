/**
 * app.js - 메인 애플리케이션 로직
 * ABC 친구 도우미 v2
 *
 * 의존성: data.js, ui.js, storage.js, export.js
 */

const ABCHelper = {
    // data.js에서 정의된 ABC_DATA의 내용을 가져옴
    ...ABC_DATA,

    // ==================== STATE ====================
    state: {
        currentStep: 0,
        worryMode: 'example',
        selectedWorry: null,
        selectedEmotions: [],
        empathy: {
            situation: '',
            belief: '',
            feeling: '',
            closing: '',
            manual: ''
        },
        help: {
            thinking: '',
            concrete: ''
        },
        encouragement: {
            randomMessage: '',
            personalMessage: '',
            twoWeekPromise: false,
            favorited: false
        }
    },

    // ==================== 초기화 ====================
    init() {
        this._loadFromStorage();
        this._setupEventListeners();
        this._setupKeyboardNavigation();
        ABCStorage.startAutoSave(() => this.saveToStorage());
    },

    _setupEventListeners() {
        // 헤더 입력
        document.getElementById('counselor-name').addEventListener('input', () => this.saveToStorage());
        document.getElementById('client-name').addEventListener('input', () => this.saveToStorage());

        // 직접 입력 모드
        document.getElementById('direct-a').addEventListener('input', () => this.saveToStorage());
        document.getElementById('direct-b').addEventListener('input', () => this.saveToStorage());
        document.getElementById('direct-c').addEventListener('input', () => this.saveToStorage());

        // Step 2 - 드롭다운과 직접 입력 연동
        document.getElementById('empathy-belief').addEventListener('change', (e) => {
            if (e.target.value) document.getElementById('empathy-belief-custom').value = '';
            this.updateEmpathyPreview();
            this.saveToStorage();
        });
        document.getElementById('empathy-feeling').addEventListener('change', (e) => {
            if (e.target.value) document.getElementById('empathy-feeling-custom').value = '';
            this.updateEmpathyPreview();
            this.saveToStorage();
        });
        document.getElementById('empathy-closing').addEventListener('change', (e) => {
            if (e.target.value) document.getElementById('empathy-closing-custom').value = '';
            this.updateEmpathyPreview();
            this.saveToStorage();
        });
        document.getElementById('empathy-belief-custom').addEventListener('input', (e) => {
            if (e.target.value) document.getElementById('empathy-belief').selectedIndex = 0;
            this.updateEmpathyPreview();
            this.saveToStorage();
        });
        document.getElementById('empathy-feeling-custom').addEventListener('input', (e) => {
            if (e.target.value) document.getElementById('empathy-feeling').selectedIndex = 0;
            this.updateEmpathyPreview();
            this.saveToStorage();
        });
        document.getElementById('empathy-closing-custom').addEventListener('input', (e) => {
            if (e.target.value) document.getElementById('empathy-closing').selectedIndex = 0;
            this.updateEmpathyPreview();
            this.saveToStorage();
        });
        document.getElementById('empathy-manual').addEventListener('input', () => this.saveToStorage());

        // Step 3
        document.getElementById('helpful-thinking').addEventListener('input', () => this.saveToStorage());
        document.getElementById('concrete-help').addEventListener('input', () => this.saveToStorage());

        // Step 4
        document.getElementById('personal-encouragement').addEventListener('input', () => this.saveToStorage());
        document.getElementById('two-week-promise').addEventListener('change', () => {
            this.state.encouragement.twoWeekPromise = document.getElementById('two-week-promise').checked;
            this.saveToStorage();
        });

        // 모달 외부 클릭 시 닫기
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                ABCUi.closeModal('help-modal');
            }
        });
    },

    // ==================== 키보드 접근성 ====================
    _setupKeyboardNavigation() {
        // 감정 카드 키보드 지원
        document.querySelectorAll('.emotion-card').forEach(card => {
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'checkbox');
            card.setAttribute('aria-checked', 'false');
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    card.click();
                }
            });
        });

        // 단계 원 키보드 지원
        document.querySelectorAll('.step-circle').forEach(circle => {
            const parent = circle.closest('.step-item');
            if (parent) {
                circle.setAttribute('tabindex', '0');
                circle.setAttribute('role', 'button');
                circle.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        parent.click();
                    }
                });
            }
        });
    },

    // ==================== 온보딩 ====================
    startApp() {
        ABCUi.hideOnboarding();
        setTimeout(() => {
            this.goToWorrySection();
        }, 100);
    },

    // ==================== 고민 입력 ====================
    switchWorryMode(mode) {
        this.state.worryMode = mode;

        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-pressed', 'false');
            if (btn.dataset.mode === mode) {
                btn.classList.add('active');
                btn.setAttribute('aria-pressed', 'true');
            }
        });

        document.querySelectorAll('.worry-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`worry-${mode}-mode`).classList.add('active');

        this.saveToStorage();
    },

    selectWorryCase() {
        const select = document.getElementById('worry-case-select');
        const caseId = select.value;

        if (!caseId) {
            document.getElementById('selected-worry-display').classList.add('hidden');
            this.state.selectedWorry = null;
            return;
        }

        const worry = this.worryCases[caseId];
        this.state.selectedWorry = worry;

        document.getElementById('display-a').textContent = worry.A;
        document.getElementById('display-b').textContent = worry.B;
        document.getElementById('display-c').textContent = worry.C;
        document.getElementById('selected-worry-display').classList.remove('hidden');

        // 자동 감정 선택
        this.resetEmotions(true);
        worry.emotions.forEach(emotionName => {
            const emotion = this.emotions.find(e => e.name === emotionName);
            if (emotion) {
                this.toggleEmotion(emotion.name, emotion.emoji, true);
            }
        });

        this.saveToStorage();
        ABCUi.showNotification('고민이 선택되었습니다!', 'success');
    },

    applyDirectInput() {
        const a = document.getElementById('direct-a').value.trim();
        const b = document.getElementById('direct-b').value.trim();
        const c = document.getElementById('direct-c').value.trim();

        if (!a || !b || !c) {
            ABCUi.showNotification('모든 항목을 입력해주세요', 'error');
            return;
        }

        const category = this._classifyCategory(a, b, c);

        this.state.selectedWorry = {
            title: '직접 입력',
            A: a, B: b, C: c,
            category: category,
            emotions: []
        };

        document.getElementById('display-a').textContent = a;
        document.getElementById('display-b').textContent = b;
        document.getElementById('display-c').textContent = c;
        document.getElementById('selected-worry-display').classList.remove('hidden');

        this.saveToStorage();
        ABCUi.showNotification('고민이 적용되었습니다!', 'success');
    },

    _classifyCategory(a, b, c) {
        const text = (a + b + c).toLowerCase();
        if (text.includes('발표') || text.includes('시험') || text.includes('성적') ||
            text.includes('선생님') || text.includes('숙제') || text.includes('학교')) return 'school';
        if (text.includes('친구') || text.includes('놀림') || text.includes('싸움') || text.includes('비밀')) return 'friend';
        if (text.includes('부모') || text.includes('엄마') || text.includes('아빠') ||
            text.includes('동생') || text.includes('가족')) return 'family';
        return 'emotion';
    },

    goToWorrySection() {
        this.state.currentStep = 0;
        document.querySelectorAll('.card').forEach(card => card.classList.add('hidden'));
        document.getElementById('worry-section').classList.remove('hidden');
        ABCUi.updateProgress(0);
    },

    // ==================== 단계 이동 ====================
    goToStep(step) {
        if (step === 1 && !this.state.selectedWorry) {
            ABCUi.showNotification('먼저 고민을 선택하거나 입력해주세요', 'error');
            return;
        }

        this.state.currentStep = step;

        if (step === 0) {
            this.goToWorrySection();
            return;
        }

        ABCUi.showSection(`step-${step}`);
        ABCUi.updateProgress(step);

        // 단계별 초기화
        if (step === 2) this._initStep2();
        else if (step === 3) this._initStep3();
    },

    nextStep() {
        const currentStep = this.state.currentStep;

        // 유효성 검사
        if (currentStep === 1 && this.state.selectedEmotions.length === 0) {
            ABCUi.showNotification('감정을 최소 1개 이상 선택해주세요', 'error');
            return;
        }
        if (currentStep === 2) {
            const empathy = document.getElementById('empathy-manual').value.trim() ||
                            document.getElementById('empathy-preview').textContent.trim();
            if (!empathy) {
                ABCUi.showNotification('공감 표현을 작성해주세요', 'error');
                return;
            }
        }
        if (currentStep === 3) {
            const thinking = document.getElementById('helpful-thinking').value.trim();
            const help = document.getElementById('concrete-help').value.trim();
            if (!thinking || !help) {
                ABCUi.showNotification('도움 방법을 모두 작성해주세요', 'error');
                return;
            }
        }

        this.goToStep(currentStep + 1);
    },

    prevStep() {
        if (this.state.currentStep > 1) {
            this.goToStep(this.state.currentStep - 1);
        }
    },

    // ==================== Step 1: 감정 ====================
    toggleEmotion(name, emoji, silent = false) {
        const card = document.querySelector(`.emotion-card[data-emotion="${name}"]`);
        const index = this.state.selectedEmotions.findIndex(e => e.name === name);

        if (index > -1) {
            this.state.selectedEmotions.splice(index, 1);
            if (card) {
                card.classList.remove('selected');
                card.setAttribute('aria-checked', 'false');
            }
        } else {
            this.state.selectedEmotions.push({ name, emoji });
            if (card) {
                card.classList.add('selected');
                card.setAttribute('aria-checked', 'true');
            }
        }

        ABCUi.renderEmotionTags(this.state.selectedEmotions, (index) => this.removeEmotion(index));
        this.saveToStorage();

        if (!silent) {
            ABCUi.showNotification(`${emoji} ${name} 감정이 ${index > -1 ? '제거' : '추가'}되었습니다`, 'success');
        }
    },

    addCustomEmotion() {
        const input = document.getElementById('custom-emotion-input');
        const name = input.value.trim();

        if (!name) { ABCUi.showNotification('감정을 입력해주세요', 'error'); return; }
        if (this.state.selectedEmotions.find(e => e.name === name)) {
            ABCUi.showNotification('이미 추가된 감정입니다', 'error'); return;
        }

        this.state.selectedEmotions.push({ name, emoji: '💭' });
        ABCUi.renderEmotionTags(this.state.selectedEmotions, (index) => this.removeEmotion(index));
        this.saveToStorage();
        input.value = '';
        ABCUi.showNotification(`${name} 감정이 추가되었습니다`, 'success');
    },

    removeEmotion(index) {
        const emotion = this.state.selectedEmotions[index];
        const card = document.querySelector(`.emotion-card[data-emotion="${emotion.name}"]`);
        if (card) {
            card.classList.remove('selected');
            card.setAttribute('aria-checked', 'false');
        }

        this.state.selectedEmotions.splice(index, 1);
        ABCUi.renderEmotionTags(this.state.selectedEmotions, (index) => this.removeEmotion(index));
        this.saveToStorage();
        ABCUi.showNotification('감정이 제거되었습니다', 'success');
    },

    resetEmotions(silent = false) {
        this.state.selectedEmotions = [];
        document.querySelectorAll('.emotion-card').forEach(card => {
            card.classList.remove('selected');
            card.setAttribute('aria-checked', 'false');
        });
        ABCUi.renderEmotionTags([], (index) => this.removeEmotion(index));
        this.saveToStorage();
        if (!silent) ABCUi.showNotification('감정이 초기화되었습니다', 'success');
    },

    // ==================== Step 2: 공감 표현 ====================
    _initStep2() {
        if (this.state.selectedWorry) {
            document.getElementById('empathy-situation').textContent = this.state.selectedWorry.A;
            this.state.empathy.situation = this.state.selectedWorry.A;
        }

        const beliefSelect = document.getElementById('empathy-belief');
        beliefSelect.innerHTML = '<option value="">-- 예시에서 선택하세요 --</option>' +
            this.thoughts.map(t => `<option value="${t}">${t}</option>`).join('');

        const feelingSelect = document.getElementById('empathy-feeling');
        feelingSelect.innerHTML = '<option value="">-- 예시에서 선택하세요 --</option>' +
            this.feelings.map(f => `<option value="${f}">${f}</option>`).join('');

        const closingSelect = document.getElementById('empathy-closing');
        closingSelect.innerHTML = '<option value="">-- 예시에서 선택하세요 --</option>' +
            this.closings.map(c => `<option value="${c}">${c}</option>`).join('');

        // 저장된 값 복원
        if (this.state.empathy.belief) {
            if (this.thoughts.includes(this.state.empathy.belief)) beliefSelect.value = this.state.empathy.belief;
            else document.getElementById('empathy-belief-custom').value = this.state.empathy.belief;
        }
        if (this.state.empathy.feeling) {
            if (this.feelings.includes(this.state.empathy.feeling)) feelingSelect.value = this.state.empathy.feeling;
            else document.getElementById('empathy-feeling-custom').value = this.state.empathy.feeling;
        }
        if (this.state.empathy.closing) {
            if (this.closings.includes(this.state.empathy.closing)) closingSelect.value = this.state.empathy.closing;
            else document.getElementById('empathy-closing-custom').value = this.state.empathy.closing;
        }
        if (this.state.empathy.manual) {
            document.getElementById('empathy-manual').value = this.state.empathy.manual;
        }

        this.updateEmpathyPreview();
    },

    updateEmpathyPreview() {
        const belief = document.getElementById('empathy-belief-custom').value.trim() || document.getElementById('empathy-belief').value;
        const feeling = document.getElementById('empathy-feeling-custom').value.trim() || document.getElementById('empathy-feeling').value;
        const closing = document.getElementById('empathy-closing-custom').value.trim() || document.getElementById('empathy-closing').value;

        this.state.empathy.belief = belief;
        this.state.empathy.feeling = feeling;
        this.state.empathy.closing = closing;

        let preview = '';
        if (this.state.empathy.situation) preview += `"${this.state.empathy.situation}"라고 생각했구나. `;
        if (belief) preview += `"${belief}"라는 생각이 들었구나. `;
        if (feeling) preview += `그래서 ${feeling.replace('요', '')}구나. `;
        if (closing) preview += closing;

        document.getElementById('empathy-preview').textContent = preview || '위에서 선택하거나 직접 입력하면 공감 표현이 자동으로 만들어집니다.';
    },

    autoCompleteEmpathy() {
        const preview = document.getElementById('empathy-preview').textContent;
        if (preview && preview !== '위에서 선택하거나 직접 입력하면 공감 표현이 자동으로 만들어집니다.') {
            document.getElementById('empathy-manual').value = preview;
            this.state.empathy.manual = preview;
            this.saveToStorage();
            ABCUi.showNotification('공감 표현이 자동 생성되었습니다', 'success');
        } else {
            ABCUi.showNotification('먼저 위의 항목들을 선택해주세요', 'error');
        }
    },

    resetEmpathy() {
        document.getElementById('empathy-belief').selectedIndex = 0;
        document.getElementById('empathy-feeling').selectedIndex = 0;
        document.getElementById('empathy-closing').selectedIndex = 0;
        document.getElementById('empathy-belief-custom').value = '';
        document.getElementById('empathy-feeling-custom').value = '';
        document.getElementById('empathy-closing-custom').value = '';
        document.getElementById('empathy-manual').value = '';

        this.state.empathy = { situation: this.state.empathy.situation, belief: '', feeling: '', closing: '', manual: '' };
        this.updateEmpathyPreview();
        this.saveToStorage();
        ABCUi.showNotification('공감 표현이 초기화되었습니다', 'success');
    },

    // ==================== Step 3: 도움 찾기 ====================
    _initStep3() {
        const category = this.state.selectedWorry?.category || 'emotion';
        const checklists = this.situationBasedChecklists[category];

        const thinkingContainer = document.getElementById('thinking-checklist');
        thinkingContainer.innerHTML = checklists.thinking.map((item, index) => `
            <div class="checklist-item">
                <input type="checkbox" id="thinking-${index}" value="${escapeHTML(item)}">
                <label for="thinking-${index}">${escapeHTML(item)}</label>
            </div>
        `).join('');

        const helpContainer = document.getElementById('help-checklist');
        helpContainer.innerHTML = checklists.help.map((item, index) => `
            <div class="checklist-item">
                <input type="checkbox" id="help-${index}" value="${escapeHTML(item)}">
                <label for="help-${index}">${escapeHTML(item)}</label>
            </div>
        `).join('');

        if (this.state.help.thinking) document.getElementById('helpful-thinking').value = this.state.help.thinking;
        if (this.state.help.concrete) document.getElementById('concrete-help').value = this.state.help.concrete;
    },

    applyThinkingChecklist() {
        const checked = Array.from(document.querySelectorAll('#thinking-checklist input[type="checkbox"]:checked'));
        const values = checked.map(cb => cb.value);
        if (values.length === 0) { ABCUi.showNotification('선택된 항목이 없습니다', 'error'); return; }

        const textarea = document.getElementById('helpful-thinking');
        const current = textarea.value.trim();
        textarea.value = current ? current + '\n\n' + values.join('\n') : values.join('\n');
        this.state.help.thinking = textarea.value;
        this.saveToStorage();
        checked.forEach(cb => cb.checked = false);
        ABCUi.showNotification('선택한 내용이 적용되었습니다', 'success');
    },

    applyHelpChecklist() {
        const checked = Array.from(document.querySelectorAll('#help-checklist input[type="checkbox"]:checked'));
        const values = checked.map(cb => cb.value);
        if (values.length === 0) { ABCUi.showNotification('선택된 항목이 없습니다', 'error'); return; }

        const textarea = document.getElementById('concrete-help');
        const current = textarea.value.trim();
        textarea.value = current ? current + '\n\n' + values.join('\n') : values.join('\n');
        this.state.help.concrete = textarea.value;
        this.saveToStorage();
        checked.forEach(cb => cb.checked = false);
        ABCUi.showNotification('선택한 내용이 적용되었습니다', 'success');
    },

    showHelpModal() {
        ABCUi.showModal('help-modal');
    },

    closeModal() {
        ABCUi.closeModal('help-modal');
    },

    // ==================== Step 4: 격려 ====================
    drawRandomMessage() {
        const randomIndex = Math.floor(Math.random() * this.encouragementMessages.length);
        const message = this.encouragementMessages[randomIndex];

        document.getElementById('random-message-text').textContent = message;
        document.querySelector('.random-message-emoji').textContent = '🎉';
        this.state.encouragement.randomMessage = message;
        this.saveToStorage();
        ABCUi.showNotification('격려 메시지가 뽑혔습니다!', 'success');
    },

    toggleFavorite() {
        const btn = document.getElementById('favorite-btn');
        this.state.encouragement.favorited = !this.state.encouragement.favorited;

        if (this.state.encouragement.favorited) {
            btn.classList.add('favorited');
            btn.setAttribute('aria-pressed', 'true');
            ABCUi.showNotification('즐겨찾기에 추가되었습니다', 'success');
        } else {
            btn.classList.remove('favorited');
            btn.setAttribute('aria-pressed', 'false');
            ABCUi.showNotification('즐겨찾기에서 제거되었습니다', 'success');
        }
        this.saveToStorage();
    },

    // ==================== 결과 ====================
    showResult() {
        const counselorName = escapeHTML(document.getElementById('counselor-name').value.trim() || '상담자');
        const clientName = escapeHTML(document.getElementById('client-name').value.trim() || '친구');
        const empathy = escapeHTML(document.getElementById('empathy-manual').value.trim() ||
                        document.getElementById('empathy-preview').textContent.trim());
        const thinking = escapeHTML(document.getElementById('helpful-thinking').value.trim());
        const help = escapeHTML(document.getElementById('concrete-help').value.trim());
        const personal = escapeHTML(document.getElementById('personal-encouragement').value.trim());
        const promise = document.getElementById('two-week-promise').checked;

        let resultHTML = `
            <div class="result-item step1">
                <h3 class="result-item-title"><span class="card-title-emoji">💙</span> Step 1: 마음 공감하기</h3>
                <div class="result-item-content">
                    <p><strong>${clientName}</strong>이(가) 느낀 감정:</p>
                    <p>${this.state.selectedEmotions.map(e => `${escapeHTML(e.emoji)} ${escapeHTML(e.name)}`).join(', ')}</p>
                </div>
            </div>
            <div class="result-item step2">
                <h3 class="result-item-title"><span class="card-title-emoji">💬</span> Step 2: 공감 표현하기</h3>
                <div class="result-item-content"><p>${empathy}</p></div>
            </div>
            <div class="result-item step3">
                <h3 class="result-item-title"><span class="card-title-emoji">🤝</span> Step 3: 도움 찾기</h3>
                <div class="result-item-content">
                    <p><strong>더 도움이 되는 생각:</strong></p><p>${thinking}</p><br>
                    <p><strong>구체적인 도움 방법:</strong></p><p>${help}</p>
                </div>
            </div>
            <div class="result-item step4">
                <h3 class="result-item-title"><span class="card-title-emoji">✨</span> Step 4: 격려하기</h3>
                <div class="result-item-content">`;

        if (this.state.encouragement.randomMessage) {
            resultHTML += `<p><strong>격려 메시지:</strong> ${escapeHTML(this.state.encouragement.randomMessage)}</p>`;
        }
        if (personal) resultHTML += `<p><strong>나만의 격려 메시지:</strong><br>${personal}</p>`;
        if (promise) resultHTML += `<p><strong>✓ 2주 후에 다시 만나기로 약속했어요</strong></p>`;

        resultHTML += `
                </div>
            </div>
            <div style="text-align: center; margin-top: 30px; padding: 20px; background: var(--color-accent-light); border-radius: var(--radius-md);">
                <p style="font-size: 18px; font-weight: 500; color: var(--color-ink);">
                    상담자: <strong>${counselorName}</strong> | 친구: <strong>${clientName}</strong>
                </p>
                <p style="font-size: 14px; color: var(--color-ink-soft); margin-top: 10px;">
                    작성일: ${new Date().toLocaleDateString('ko-KR')}
                </p>
            </div>`;

        document.getElementById('result-content').innerHTML = resultHTML;
        ABCUi.showSection('result-section');
        this.state.currentStep = 5;
        ABCUi.updateProgress(5);
    },

    // ==================== 내보내기 (export.js 위임) ====================
    downloadPNG() { ABCExport.downloadPNG(); },
    downloadPDF() { ABCExport.downloadPDF(); },

    newConsultation() {
        if (confirm('새로운 상담을 시작하시겠습니까? 현재 내용은 저장되지 않습니다.')) {
            this.resetAll();
        }
    },

    // ==================== 초기화 ====================
    resetAll() {
        if (!confirm('정말로 전체 초기화하시겠습니까?')) return;

        this.state = {
            currentStep: 0, worryMode: 'example', selectedWorry: null, selectedEmotions: [],
            empathy: { situation: '', belief: '', feeling: '', closing: '', manual: '' },
            help: { thinking: '', concrete: '' },
            encouragement: { randomMessage: '', personalMessage: '', twoWeekPromise: false, favorited: false }
        };

        document.getElementById('counselor-name').value = '';
        document.getElementById('client-name').value = '';
        document.getElementById('worry-case-select').selectedIndex = 0;
        document.getElementById('direct-a').value = '';
        document.getElementById('direct-b').value = '';
        document.getElementById('direct-c').value = '';
        document.getElementById('selected-worry-display').classList.add('hidden');

        this.resetEmotions(true);
        this.resetEmpathy();

        document.getElementById('helpful-thinking').value = '';
        document.getElementById('concrete-help').value = '';
        document.getElementById('personal-encouragement').value = '';
        document.getElementById('two-week-promise').checked = false;
        document.getElementById('favorite-btn').classList.remove('favorited');

        ABCStorage.clear();
        this.goToWorrySection();
        ABCUi.showNotification('전체 초기화되었습니다', 'success');
    },

    // ==================== 저장 (storage.js 위임) ====================
    saveToStorage() {
        ABCStorage.save(this.state);
    },

    _loadFromStorage() {
        const data = ABCStorage.load();
        if (!data) return;

        this.state = data.state;
        ABCStorage.restoreInputs(data);

        // UI 상태 복원
        if (this.state.selectedWorry) {
            document.getElementById('display-a').textContent = this.state.selectedWorry.A;
            document.getElementById('display-b').textContent = this.state.selectedWorry.B;
            document.getElementById('display-c').textContent = this.state.selectedWorry.C;
            document.getElementById('selected-worry-display').classList.remove('hidden');
        }

        ABCUi.renderEmotionTags(this.state.selectedEmotions, (index) => this.removeEmotion(index));

        if (this.state.encouragement.favorited) {
            document.getElementById('favorite-btn').classList.add('favorited');
        }

        ABCUi.showNotification('이전 작업 내용을 불러왔습니다', 'success');
    }
};

// ==================== 페이지 로드 시 초기화 ====================
document.addEventListener('DOMContentLoaded', () => {
    ABCHelper.init();
});
