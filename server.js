const Telecom   = require('./website/Telecom.js');
const Publ01    = require('./website/Publ01.js');
const Publ02    = require('./website/Publ02.js');
const Publ04    = require('./website/Publ04.js');
const puppeteer = require("puppeteer");
const fs        = require("fs");
const otherUtil = require("./otherUtil.js");

global.folderPath = "";

async function SiteCheck() {  

    var resultList = [];

    // // 오늘날짜 폴더 생성
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const folderName = year + month + day;
    const folderPath = `screenshots/${folderName}`;
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
        console.log("폴더가 생성되었습니다.");
    }

    this.folderPath = folderPath;

    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 1440 });

    //========================= 크롤링 start

    // 공공기관 01
    const publ01Websites = [
        Publ01.Iros,           // 인터넷 등기소
        Publ01.Hira,           // 건강보험 심사 평가원
        Publ01.Academyinfo,    // 대학알리미
        Publ01.Schoolinfo,     // 학교알리미
        Publ01.Childschoolinfo,// 유치원알리미
        Publ01.Geps,           // 공무원연금공단
        Publ01.Tp,             // 사학연금
        Publ01.Fss,            // 금융감독원
        Publ01.Courtauction    // 법원경매정보
    ];
    for (const website of publ01Websites) {
        const result = await website(page);
        resultList.push(result);
    }

    // // 공공기관 02
    const publ02Websites = [
        Publ02.Hipass,   // 하이패스
        Publ02.Cartax,   // 교통위반단속
        Publ02.Hikorea,  // 하이코리아
        Publ02.Kdca,     // 질병관리청
        Publ02.Ei,       // 고용보험
        Publ02.Wetax,    // 위택스
        Publ02.Insure4,  // 4대사회보험
        Publ02.Gov,      // 정부24
        Publ02.Kiscon,   // 국토교통부
        Publ02.Car,      // 자동차리콜센터
        Publ02.Renthome, // 렌트홈
        Publ02.Total,    // 고용산재보험 토탈서비스
        Publ02.Car365    // 자동차365
    ];
    for (const website of publ02Websites) {
        const result = await website(page);
        resultList.push(result);
    }

    // // 공공기관 04
    // // 안전보건공단 kosha 공지사항 없는듯?
    // // Molit 안됨 (부동산거래관리시스템)
    const publ04Websites = [
        Publ04.Koroad,     // 도로교통공단
        Publ04.Eais,       // 세움터
        Publ04.Scourt,     // 전자후견등기시스템
        Publ04.Cashgate,   // 전자민원캐시
        Publ04.Dhlottery,  // 동행복권
        Publ04.Nps,        // 국민연금
        Publ04.Hometax     // 홈택스
        // Publ04.Molit    // 부동산거래관리시스템
    ];
    for (const website of publ04Websites) {
        const result = await website(page);
        resultList.push(result);
    }

    // 통신사
    // var uplus   = await Telecom.Uplus(page) //유플러스
    // var kt      = await Telecom.KT(page) //KT
    // var skt     = await Telecom.SKT(page) //SKT
    // resultList.push(uplus);
    // resultList.push(kt);
    // resultList.push(skt);

    //========================= 크롤링 end

    // 결과값을 txt 파일로 저장
    const listText = JSON.stringify(resultList);
    fs.writeFileSync(`screenshots/${folderName}/result.txt`, listText);

    // 브라우저 종료
    await browser.close();

    // 스크린샷을 키워드로 분류
    const countJson = otherUtil.classification();
    console.log(JSON.stringify(countJson));

}

SiteCheck();

