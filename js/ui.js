/**
 * ui.js - UI 관련 로직 (알림, 모달, 애니메이션, 단계 전환, 진행률)
 * ABC 친구 도우미 v2
 */

// HTML 이스케이프 유틸리티 (XSS 방지)
function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

const ABCUi = {
    // ==================== 내부 상태 ====================
    _toastTimer: null,
    _focusTrap: null,

    // ==================== 알림 (Toast) ====================
    showNotification(message, type = 'success') {
        const toast = document.getElementById('toast');
        const icon = document.getElementById('toast-icon');
        const messageEl = document.getElementById('toast-message');

        if (!toast || !icon || !messageEl) {
            console.warn('알림 요소를 찾을 수 없습니다.');
            return;
        }

        // 기존 타이머 정리
        if (this._toastTimer) {
            clearTimeout(this._toastTimer);
            this._toastTimer = null;
        }

        toast.className = `toast ${type}`;
        icon.textContent = type === 'success' ? '✓' : '!';
        messageEl.textContent = message;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');

        toast.classList.add('show');

        // 스크린 리더 안내
        this.announceToScreenReader(message);

        // 3초 후 자동 숨김
        this._toastTimer = setTimeout(() => {
            toast.classList.remove('show');
            this._toastTimer = null;
        }, 3000);
    },

    // ==================== 모달 ====================
    showModal(id) {
        const modal = document.getElementById(id);
        if (!modal) return;

        modal.classList.add('show');
        modal.setAttribute('aria-hidden', 'false');

        // 완전한 포커스 트랩 설정
        this._setupFocusTrap(modal);

        // ESC 키로 모달 닫기
        modal._escHandler = (e) => {
            if (e.key === 'Escape') {
                this.closeModal(id);
            }
        };
        document.addEventListener('keydown', modal._escHandler);

        // 스크린 리더 안내
        const modalTitle = modal.querySelector('h2, h3, [role="heading"]');
        if (modalTitle) {
            this.announceToScreenReader(`모달 열림: ${modalTitle.textContent}`);
        }
    },

    closeModal(id) {
        const modal = document.getElementById(id);
        if (!modal) return;

        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');

        // ESC 핸들러 제거
        if (modal._escHandler) {
            document.removeEventListener('keydown', modal._escHandler);
            delete modal._escHandler;
        }

        // 포커스 트랩 제거
        this._removeFocusTrap();

        // 스크린 리더 안내
        this.announceToScreenReader('모달 닫힘');
    },

    /**
     * 포커스 트랩 설정 (모달 내에서만 Tab 이동)
     * @private
     */
    _setupFocusTrap(modal) {
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        // 첫 요소로 포커스 이동
        firstElement.focus();

        // Tab 키 트랩
        this._focusTrap = (e) => {
            if (e.key !== 'Tab') return;

            if (e.shiftKey) {
                // Shift + Tab
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                // Tab
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        };

        modal.addEventListener('keydown', this._focusTrap);
    },

    /**
     * 포커스 트랩 제거
     * @private
     */
    _removeFocusTrap() {
        if (this._focusTrap) {
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => {
                modal.removeEventListener('keydown', this._focusTrap);
            });
            this._focusTrap = null;
        }
    },

    // ==================== 단계 전환 애니메이션 ====================
    /**
     * 모든 카드를 숨기고 지정된 요소를 페이드 인 효과로 보여줌
     * @param {string} showId - 보여줄 요소의 ID
     */
    showSection(showId) {
        // 모든 카드와 결과 섹션 숨기기
        document.querySelectorAll('.card').forEach(card => {
            card.classList.add('hidden');
            card.classList.remove('fade-enter');
        });

        const resultSection = document.getElementById('result-section');
        if (resultSection) {
            resultSection.classList.add('hidden');
            resultSection.classList.remove('fade-enter');
        }

        // 대상 섹션 표시
        const target = document.getElementById(showId);
        if (target) {
            target.classList.remove('hidden');
            target.classList.add('fade-enter');

            // 접근성: 섹션 제목 읽기
            const heading = target.querySelector('h2, h3, [role="heading"]');
            if (heading) {
                this.announceToScreenReader(`섹션 전환: ${heading.textContent}`);
            }
        }

        // 상단으로 스크롤
        window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    // ==================== 진행률 업데이트 ====================
    /**
     * 진행률 바와 단계 표시를 업데이트
     * @param {number} step - 현재 단계 (0~5)
     */
    updateProgress(step) {
        const progressPercent = document.getElementById('progress-percent');
        const progressBar = document.getElementById('step-line-progress');

        if (!progressPercent || !progressBar) {
            console.warn('진행률 요소를 찾을 수 없습니다.');
            return;
        }

        const progress = Math.min((step / 4) * 100, 100);
        progressPercent.textContent = Math.round(progress);
        progressBar.style.width = progress + '%';

        // 스크린 리더 안내
        this.announceToScreenReader(`진행률 ${Math.round(progress)}%, 4단계 중 ${step}단계`);

        // 단계 아이템 상태 업데이트
        document.querySelectorAll('.step-item').forEach((item, index) => {
            const stepNum = index + 1;
            item.classList.remove('active', 'completed');
            item.setAttribute('aria-current', 'false');

            if (stepNum === step) {
                item.classList.add('active');
                item.setAttribute('aria-current', 'step');
            } else if (stepNum < step) {
                item.classList.add('completed');
            }
        });
    },

    // ==================== 온보딩 ====================
    hideOnboarding() {
        const onboarding = document.getElementById('onboarding');
        const app = document.getElementById('app');

        if (!onboarding || !app) {
            console.warn('온보딩/앱 요소를 찾을 수 없습니다.');
            return;
        }

        onboarding.classList.add('hidden');
        app.classList.add('visible');

        // 스크린 리더 안내
        this.announceToScreenReader('ABC 친구 도우미 시작');

        // 첫 번째 입력 필드로 포커스 이동
        const firstInput = app.querySelector('input');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    },

    // ==================== 감정 태그 UI 렌더링 ====================
    renderEmotionTags(emotions, onRemoveCallback) {
        const display = document.getElementById('selected-emotions-display');
        const list = document.getElementById('selected-emotions-list');

        if (!display || !list) {
            console.warn('감정 태그 표시 요소를 찾을 수 없습니다.');
            return;
        }

        if (emotions.length === 0) {
            display.classList.add('hidden');
            return;
        }

        display.classList.remove('hidden');

        // XSS 방지: DOM 직접 생성 방식으로 변경
        list.innerHTML = '';
        emotions.forEach((emotion, index) => {
            const tag = document.createElement('div');
            tag.className = 'emotion-tag';

            const span = document.createElement('span');
            span.textContent = `${emotion.emoji} ${emotion.name}`;

            const btn = document.createElement('button');
            btn.type = 'button'; // 명시적 타입 지정
            btn.className = 'remove-emotion-btn';
            btn.textContent = '×';
            btn.setAttribute('aria-label', `${emotion.name} 감정 제거`);
            btn.addEventListener('click', () => {
                onRemoveCallback(index);
                // 스크린 리더 안내
                this.announceToScreenReader(`${emotion.name} 감정 제거됨`);
            });

            tag.appendChild(span);
            tag.appendChild(btn);
            list.appendChild(tag);
        });

        // 스크린 리더 안내
        this.announceToScreenReader(`선택된 감정 ${emotions.length}개`);
    },

    // ==================== 접근성 헬퍼 ====================
    /**
     * 스크린 리더용 라이브 리전에 메시지 전달
     * @param {string} message - 안내 메시지
     */
    announceToScreenReader(message) {
        let region = document.getElementById('sr-live-region');

        if (!region) {
            region = document.createElement('div');
            region.id = 'sr-live-region';
            region.className = 'sr-only';
            region.setAttribute('role', 'status');
            region.setAttribute('aria-live', 'polite');
            region.setAttribute('aria-atomic', 'true');
            region.style.cssText = `
                position: absolute;
                width: 1px;
                height: 1px;
                padding: 0;
                margin: -1px;
                overflow: hidden;
                clip: rect(0, 0, 0, 0);
                white-space: nowrap;
                border-width: 0;
            `;
            document.body.appendChild(region);
        }

        // 내용 업데이트 (스크린 리더가 읽도록)
        region.textContent = message;

        // 같은 메시지 연속 안내를 위해 리셋
        setTimeout(() => {
            if (region) region.textContent = '';
        }, 1000);
    },

    /**
     * 요소로 포커스 이동
     * @param {string} elementId - 대상 요소 ID
     */
    focusElement(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.focus();
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    },

    // ==================== 유틸리티 ====================
    /**
     * 디바운스 함수
     * @param {Function} func - 실행할 함수
     * @param {number} wait - 대기 시간 (ms)
     * @returns {Function} 디바운스된 함수
     */
    debounce(func, wait = 300) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * 스로틀 함수
     * @param {Function} func - 실행할 함수
     * @param {number} limit - 실행 간격 (ms)
     * @returns {Function} 스로틀된 함수
     */
    throttle(func, limit = 300) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func(...args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    /**
     * 클린업 (메모리 누수 방지)
     */
    cleanup() {
        if (this._toastTimer) {
            clearTimeout(this._toastTimer);
            this._toastTimer = null;
        }
        this._removeFocusTrap();
    }
};

// 전역 접근을 위한 export
window.ABCUi = ABCUi;

// 페이지 언로드 시 클린업
window.addEventListener('beforeunload', () => {
    ABCUi.cleanup();
});
