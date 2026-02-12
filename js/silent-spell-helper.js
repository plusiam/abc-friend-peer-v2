/**
 * 🤫 조용한 맞춤법 도우미
 * 상담에 방해되지 않으면서 최소한의 도움만 제공
 */

class SilentSpellHelper {
    constructor() {
        this.enabled = true;
        this.lastCorrection = 0;
        this.cooldown = 8000; // 8초 쿨다운 (너무 자주 수정하지 않기)
        this.maxChangesPerSession = 3; // 세션당 최대 3번만 수정
        this.correctionCount = 0;
        
        // 정말 필요한 최소한의 수정만
        this.criticalCorrections = {
            // 시제 명확화 (상담 이해에 중요)
            '했엇어요': '했었어요',
            '했엇어': '했었어',
            '갔엇어요': '갔었어요', 
            '갔엇어': '갔었어',
            
            // 의미 전달 개선 (상담 맥락에서 중요)
            '안되요': '안 돼요',
            '안되': '안 돼',
            '않되': '안 돼',
            
            // 기본 가독성 (소통에 필수)
            '몰르겠어요': '모르겠어요',
            '몰르겠어': '모르겠어',
            '알르겠어요': '알겠어요',
            '알르겠어': '알겠어'
        };
        
        // 절대 수정하지 않을 상황들 (감정/상담 핵심 내용)
        this.protectedPhrases = [
            '속상해', '화나', '기뻐', '슬퍼', '무서워',
            '친구가', '엄마가', '아빠가', '선생님이',
            '나는', '내가', '우리가', '정말', '너무'
        ];
        
        // 상담 단계별 처리 방식
        this.stepSettings = {
            'empathy': { enabled: false }, // 감정 공감: 수정 안함
            'expression': { enabled: true, gentle: true }, // 공감 표현: 매우 조심스럽게
            'solution': { enabled: true, gentle: false }, // 해결방안: 일반적으로
            'encouragement': { enabled: false }, // 격려: 수정 안함
            'general': { enabled: true, gentle: true } // 일반: 조심스럽게
        };
    }
    
    /**
     * 메인 처리 함수
     * @param {string} text - 원본 텍스트
     * @param {HTMLElement} element - 입력 요소
     * @param {string} step - 현재 상담 단계
     */
    process(text, element, step = 'general') {
        if (!this.enabled || !text.trim()) return text;
        
        // 쿨다운 체크
        if (Date.now() - this.lastCorrection < this.cooldown) {
            return text;
        }
        
        // 세션 제한 체크
        if (this.correctionCount >= this.maxChangesPerSession) {
            return text;
        }
        
        // 단계별 설정 체크
        const settings = this.stepSettings[step] || { enabled: true };
        if (!settings.enabled) {
            return text;
        }
        
        // 보호된 내용 체크 (감정/상담 핵심)
        if (this.isProtectedContent(text)) {
            return text;
        }
        
        // 상담에 중요한 내용인지 체크
        if (!this.isCriticalForCounseling(text)) {
            return text;
        }
        
        // 조용한 수정 실행
        const corrected = this.silentCorrect(text);
        
        if (corrected !== text) {
            this.applySilentCorrection(element, text, corrected);
            this.lastCorrection = Date.now();
            this.correctionCount++;
        }
        
        return corrected;
    }
    
    /**
     * 보호된 내용인지 확인 (감정 표현, 상담 핵심 내용)
     */
    isProtectedContent(text) {
        return this.protectedPhrases.some(phrase => 
            text.toLowerCase().includes(phrase)
        );
    }
    
    /**
     * 상담 이해에 중요한 내용인지 확인
     */
    isCriticalForCounseling(text) {
        const patterns = Object.keys(this.criticalCorrections);
        return patterns.some(pattern => text.includes(pattern));
    }
    
    /**
     * 조용한 수정 (최소한만)
     */
    silentCorrect(text) {
        let corrected = text;
        let changeCount = 0;
        const maxChanges = 2; // 한 번에 최대 2개만 수정
        
        for (const [wrong, right] of Object.entries(this.criticalCorrections)) {
            if (changeCount >= maxChanges) break;
            
            if (corrected.includes(wrong)) {
                corrected = corrected.replace(new RegExp(wrong, 'g'), right);
                changeCount++;
            }
        }
        
        return corrected;
    }
    
    /**
     * 커서 위치 보존하며 조용히 적용
     */
    applySilentCorrection(element, original, corrected) {
        if (!element || original === corrected) return;
        
        // 현재 커서 위치 저장
        const start = element.selectionStart;
        const end = element.selectionEnd;
        
        // 조용히 텍스트 교체
        element.value = corrected;
        
        // 커서 위치 복원 (길이 차이 고려)
        const lengthDiff = corrected.length - original.length;
        const newStart = Math.max(0, start + lengthDiff);
        const newEnd = Math.max(0, end + lengthDiff);
        
        element.setSelectionRange(newStart, newEnd);
        
        // 완전히 조용히 (어떤 시각적 피드백도 없음)
        // 알림, 색상 변화, 애니메이션 등 일체 없음
    }
    
    /**
     * ABC 친구 도우미의 입력 요소들에 적용 - 🔧 수정됨
     */
    attachToElements() {
        // 실제 HTML 요소들과 매칭되는 셀렉터로 수정
        const inputs = document.querySelectorAll(`
            #empathy-text,
            #new-thinking,
            #help-suggestions,
            #personal-encouragement,
            #counselor-name,
            #client-name,
            #custom-a,
            #custom-b,
            #custom-c,
            #custom-emotion
        `);
        
        console.log(`🤫 조용한 맞춤법 도우미: ${inputs.length}개 요소에 적용됩니다.`);
        
        inputs.forEach(element => {
            if (element) {
                this.setupElement(element);
                console.log(`✅ 적용됨: ${element.id || element.tagName}`);
            }
        });
    }
    
    /**
     * 개별 요소에 이벤트 설정
     */
    setupElement(element) {
        if (element.dataset.silentSpellHelperAttached) return;
        
        let typingTimer;
        const delay = 3000; // 3초 후 체크 (충분히 길게)
        
        element.addEventListener('input', () => {
            clearTimeout(typingTimer);
            
            typingTimer = setTimeout(() => {
                const step = this.detectStep(element);
                const original = element.value;
                const corrected = this.process(original, element, step);
                
                // 이미 process에서 적용했으므로 여기서는 추가 작업 없음
            }, delay);
        });
        
        // 포커스를 잃을 때도 한 번 체크 (매우 조용히)
        element.addEventListener('blur', () => {
            setTimeout(() => {
                const step = this.detectStep(element);
                const original = element.value;
                this.process(original, element, step);
            }, 500);
        });
        
        element.dataset.silentSpellHelperAttached = 'true';
    }
    
    /**
     * 현재 상담 단계 감지 - 🔧 수정됨
     */
    detectStep(element) {
        const id = element.id;
        
        // ID 기반 단계 감지
        if (id === 'empathy-text') return 'expression';
        if (id === 'new-thinking' || id === 'help-suggestions') return 'solution';
        if (id === 'personal-encouragement') return 'encouragement';
        if (['counselor-name', 'client-name', 'custom-emotion'].includes(id)) return 'general';
        if (['custom-a', 'custom-b', 'custom-c'].includes(id)) return 'empathy';
        
        // 부모 요소에서 단계 정보 찾기
        const section = element.closest('#step1, #step2, #step3, #step4');
        if (section) {
            const stepNum = section.id.replace('step', '');
            switch(stepNum) {
                case '1': return 'empathy';
                case '2': return 'expression';
                case '3': return 'solution';
                case '4': return 'encouragement';
            }
        }
        
        return 'general';
    }
    
    /**
     * 세션 초기화 (새로운 상담 시작 시)
     */
    resetSession() {
        this.correctionCount = 0;
        this.lastCorrection = 0;
    }
    
    /**
     * 설정 업데이트
     */
    updateSettings(settings) {
        Object.assign(this, settings);
    }
    
    /**
     * 통계 정보 (개발/디버깅용)
     */
    getStats() {
        return {
            correctionsThisSession: this.correctionCount,
            lastCorrectionTime: this.lastCorrection,
            enabled: this.enabled
        };
    }
}

// 전역 인스턴스 생성
const silentHelper = new SilentSpellHelper();

// ABC 친구 도우미와 통합 - 🔧 수정됨
function initSilentSpellHelper() {
    // DOM이 로드된 후와 ABCHelper 초기화 후 실행
    function tryAttach() {
        // ABCHelper가 있고 초기화된 후에만 실행
        if (typeof ABCHelper !== 'undefined') {
            silentHelper.attachToElements();
            console.log('🤫 조용한 맞춤법 도우미가 ABCHelper와 연동되었습니다.');
        } else {
            // ABCHelper가 아직 없으면 잠시 후 재시도
            setTimeout(tryAttach, 1000);
        }
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', tryAttach);
    } else {
        tryAttach();
    }
    
    // 동적으로 추가되는 요소들 감지 - 🔧 수정됨
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) { // Element node
                    // 특정 요소들만 감지하도록 최적화
                    const inputs = node.querySelectorAll(`
                        textarea[id*="empathy"],
                        textarea[id*="thinking"], 
                        textarea[id*="suggestions"],
                        textarea[id*="encouragement"],
                        input[id*="name"],
                        textarea[id*="custom"]
                    `);
                    inputs.forEach(input => silentHelper.setupElement(input));
                }
            });
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// 새 상담 시작 시 호출할 함수
function startNewCounseling() {
    silentHelper.resetSession();
}

// 기능 켜기/끄기 (필요시)
function toggleSilentHelper(enabled = !silentHelper.enabled) {
    silentHelper.enabled = enabled;
    console.log(`조용한 맞춤법 도우미: ${enabled ? '활성화' : '비활성화'}`);
}

// 🔧 수정된 초기화 - 지연 실행으로 안정성 확보
setTimeout(() => {
    initSilentSpellHelper();
}, 2000); // 2초 후 초기화 (ABCHelper 초기화 완료 대기)

// 개발자용 전역 접근
window.silentSpellHelper = {
    instance: silentHelper,
    toggle: toggleSilentHelper,
    resetSession: startNewCounseling,
    stats: () => silentHelper.getStats(),
    attachNow: () => silentHelper.attachToElements() // 수동 연결용
};

console.log('🤫 조용한 맞춤법 도우미가 준비되었습니다. 상담에 집중하세요!');