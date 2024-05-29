const fs = require('fs');
const path = require('path');
const moment = require('moment');

function classification() {
    const screenshotsFolder = path.join('./screenshots/', moment().format('YYYYMMDD'));
    const destinationFolderDone = path.join(screenshotsFolder, 'done');
    const destinationFolderTrash = path.join(screenshotsFolder, 'trash');
    
    const keywordArray = ['작업', '시스템', '서비스', '중단', '정기', '점검', '자치', '홈택스', '렌트홈'];
    
    // 폴더 내 파일 목록 가져오기
    const files = fs.readdirSync(screenshotsFolder);

    // done 폴더 생성
    if (!fs.existsSync(destinationFolderDone)) {
        fs.mkdirSync(destinationFolderDone);
    }

    // trash 폴더 생성
    if (!fs.existsSync(destinationFolderTrash)) {
        fs.mkdirSync(destinationFolderTrash);
    }

    let doneFileCount = 0; // done 폴더 안의 파일 수
    let trashFileCount = 0; // trash 폴더 안의 파일 수

    files.forEach(file => {
        const filePath = path.join(screenshotsFolder, file);

        // 파일명에서 확장자가 '.jpg'로 끝나는지 확인
        const isJpgFile = path.extname(file).toLowerCase() === '.jpg';

        if (isJpgFile) {
            // 파일명에서 키워드가 있는지 확인
            const hasKeyword = keywordArray.some(keyword => file.includes(keyword));

            // 이동할 폴더 경로 설정
            const destinationFolder = hasKeyword ? destinationFolderDone : destinationFolderTrash;
            const destinationPath = path.join(destinationFolder, file);

            // 파일 이동
            fs.renameSync(filePath, destinationPath);

            // 이동된 파일 수 카운트
            if (destinationFolder === destinationFolderDone) {
                doneFileCount++;
            } else if (destinationFolder === destinationFolderTrash) {
                trashFileCount++;
            }
        }
    });

    // done 폴더와 trash 폴더 안의 파일 수 반환
    return {
        doneFileCount,
        trashFileCount
    };
}

module.exports = classification;
module.exports = {
    classification : classification,
  };