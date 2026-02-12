/**
 * storage.js - 로컬 스토리지 관리 모듈
 * ABC 친구 도우미 v2
 */

const STORAGE_KEY = 'abcHelperState';
const STORAGE_MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24시간

const ABCStorage = {
    /**
     * 현재 앱 상태와 입력값을 로컬 스토리지에 저장
     * @param {Object} state - ABCHelper.state 객체
     */
    save(state) {
        try {
            const data = {
                state: state,
                counselorName: document.getElementById('counselor-name').value,
                clientName: document.getElementById('client-name').value,
                directA: document.getElementById('direct-a').value,
                directB: document.getElementById('direct-b').value,
                directC: document.getElementById('direct-c').value,
                empathyManual: document.getElementById('empathy-manual').value,
                helpfulThinking: document.getElementById('helpful-thinking').value,
                concreteHelp: document.getElementById('concrete-help').value,
                personalEncouragement: document.getElementById('personal-encouragement').value,
                timestamp: Date.now()
            };

            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.warn('저장 실패:', e);
        }
    },

    /**
     * 로컬 스토리지에서 저장된 데이터 불러오기
     * @returns {Object|null} 복원된 데이터 또는 null
     */
    load() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) return null;

        try {
            const data = JSON.parse(saved);

            // 24시간 초과 데이터 자동 삭제
            const age = Date.now() - data.timestamp;
            if (age > STORAGE_MAX_AGE_MS) {
                this.clear();
                return null;
            }

            return data;
        } catch (e) {
            console.error('데이터 로드 실패:', e);
            this.clear();
            return null;
        }
    },

    /**
     * 불러온 데이터를 DOM 입력 필드에 적용
     * @param {Object} data - load()에서 반환된 데이터
     */
    restoreInputs(data) {
        if (!data) return;

        document.getElementById('counselor-name').value = data.counselorName || '';
        document.getElementById('client-name').value = data.clientName || '';
        document.getElementById('direct-a').value = data.directA || '';
        document.getElementById('direct-b').value = data.directB || '';
        document.getElementById('direct-c').value = data.directC || '';
        document.getElementById('empathy-manual').value = data.empathyManual || '';
        document.getElementById('helpful-thinking').value = data.helpfulThinking || '';
        document.getElementById('concrete-help').value = data.concreteHelp || '';
        document.getElementById('personal-encouragement').value = data.personalEncouragement || '';
    },

    /**
     * 저장된 데이터 삭제
     */
    clear() {
        localStorage.removeItem(STORAGE_KEY);
    },

    /**
     * 자동 저장 시작 (30초 간격)
     * @param {Function} saveFn - 저장 함수
     * @returns {number} interval ID
     */
    startAutoSave(saveFn) {
        return setInterval(saveFn, 30000);
    }
};
