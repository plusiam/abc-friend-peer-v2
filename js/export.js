/**
 * export.js - 내보내기 기능 (PNG, PDF, 인쇄)
 * ABC 친구 도우미 v2
 */

const ABCExport = {
    /**
     * 결과 영역을 PNG 이미지로 다운로드
     * @param {string} elementId - 캡처할 요소 ID
     */
    downloadPNG(elementId = 'result-content') {
        const element = document.getElementById(elementId);
        if (!element) {
            ABCUi.showNotification('내보낼 콘텐츠를 찾을 수 없습니다', 'error');
            return;
        }

        ABCUi.showNotification('이미지 생성 중...', 'success');

        html2canvas(element, {
            scale: 2,
            backgroundColor: '#FFFFFF',
            logging: false,
            useCORS: true
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = `ABC상담결과_${this._getDateString()}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();

            ABCUi.showNotification('이미지로 저장되었습니다', 'success');
        }).catch(err => {
            console.error('PNG 생성 실패:', err);
            ABCUi.showNotification('이미지 저장에 실패했습니다', 'error');
        });
    },

    /**
     * 결과 영역을 PDF 파일로 다운로드
     * @param {string} elementId - 캡처할 요소 ID
     */
    downloadPDF(elementId = 'result-content') {
        const element = document.getElementById(elementId);
        if (!element) {
            ABCUi.showNotification('내보낼 콘텐츠를 찾을 수 없습니다', 'error');
            return;
        }

        ABCUi.showNotification('PDF 생성 중...', 'success');

        html2canvas(element, {
            scale: 2,
            backgroundColor: '#FFFFFF',
            logging: false,
            useCORS: true
        }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jspdf.jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const pageWidth = 210;
            const pageHeight = 297;
            const margin = 10;
            const imgWidth = pageWidth - (margin * 2);
            const imgHeight = canvas.height * imgWidth / canvas.width;

            // 여러 페이지 지원
            let heightLeft = imgHeight;
            let position = margin;

            pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
            heightLeft -= (pageHeight - margin * 2);

            while (heightLeft > 0) {
                position = -(pageHeight - margin * 2) * (Math.ceil((imgHeight - heightLeft) / (pageHeight - margin * 2))) + margin;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
                heightLeft -= (pageHeight - margin * 2);
            }

            pdf.save(`ABC상담결과_${this._getDateString()}.pdf`);
            ABCUi.showNotification('PDF로 저장되었습니다', 'success');
        }).catch(err => {
            console.error('PDF 생성 실패:', err);
            ABCUi.showNotification('PDF 저장에 실패했습니다', 'error');
        });
    },

    /**
     * 인쇄 기능
     */
    print() {
        window.print();
    },

    /**
     * 날짜 문자열 생성 (파일명용)
     * @returns {string} YYYY-MM-DD 형식
     * @private
     */
    _getDateString() {
        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
};
