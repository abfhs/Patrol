const DateUtil = require("../dateUtil.js"); 
const puppeteer = require("puppeteer");

async function delay(ms) {
  await new Promise(resolve => setTimeout(resolve, ms));
}

async function captureNotice(page, siteTitle, url, dateXPath, titleXPath, buttonXPath) {
  var tempList = [];
  
  try {
    await page.goto(url, { waitUntil: 'load' });
    
    for (var i = 1; i <= 10; i++) {
      const dateHandle = await page.waitForXPath(dateXPath.replace('{i}', i));
      let dateText = await page.evaluate(element => element.textContent, dateHandle);
      dateText = dateText.replace(/\D/g, '');
      
      console.log(`${siteTitle}: ${dateText}`);
  
      let isToday = DateUtil.compareDate(dateText);
      if (isToday) {
        const titleHandle = await page.waitForXPath(titleXPath.replace('{i}', i));
        let titleText = await page.evaluate(element => element.textContent, titleHandle);
        titleText = titleText.replace(/\s+/g, ' ').trim()
  
        tempList.push({ [dateText]: titleText });
  
        buttonXPath = buttonXPath.replace('{i}', i);
        const buttonElement = await page.waitForXPath(buttonXPath);
  
        await buttonElement.click();
  
        await delay(3000);
  
        const filePath = `${global.folderPath}/${siteTitle}: ${titleText.replace(/\//g, '')}_${dateText}.jpg`;
  
        await page.screenshot({ path: filePath });
  
        await page.goto(url, { waitUntil: 'load' });
      }
    }
  } catch(e) {
    return { siteTitle: "fail" };
  }
  
  console.log(`end ========== ${siteTitle} ==========`);
  
  return { [siteTitle]: tempList };
}

async function Courtauction(page) {
  
  var siteTitle = "법원경매정보";
  console.log(`start ========== ${siteTitle} ==========`)

  var tempList = [];
  var tempJson = {};

  var trNo = 1;
  var errCnt = 0; //무한루프 방지용

  try{
    do{
      if(errCnt > 3){
        break;
      }
      const url = "https://www.courtauction.go.kr/";
      await page.goto(url, { waitUntil: 'load' }); // 브라우저 이동 후 페이지 로드 대기
      
      // 공지사항 페이지로 이동
      const titleFrames = page.frames();
      for (const frame of titleFrames) {
        try{
          const noticeXPath = `//*[@id="notice"]/h3/span/a`;
          const noticeElement = await frame.waitForXPath(noticeXPath, { timeout: 1000 });
          await noticeElement.click();
        } catch(e){
          continue;
        }
      }

      const frames = page.frames();
      for (const frame of frames) {
        try{
          // 게시물 날짜
          const datePath = `//*[@id="contents"]/div[3]/form[1]/table/tbody/tr[${trNo}]/td[4]`
          const elementHandle = await frame.waitForXPath(datePath, { timeout: 1000 });
          let dateText = await frame.evaluate(element => element.textContent, elementHandle);
          dateText = dateText.replace(/\D/g, '');
          
          console.log(`${siteTitle}: ${dateText}`)

          let isToday = DateUtil.compareDate(dateText);
          if(isToday){

            tempJson = {};

            // 제목 체크
            const titlePath = `//*[@id="contents"]/div[3]/form[1]/table/tbody/tr[${trNo}]/td[3]/a`;
            const titleHandle = await frame.waitForXPath(titlePath, { timeout: 1000 });
            let titleText = await frame.evaluate(element => element.textContent, titleHandle);
            titleText = titleText.replace(/\s+/g, ' ').trim()
            tempJson[dateText] = titleText;
            tempList.push(tempJson);

            // 해당 공지사항 상세 페이지로 이동
            const buttonXPath = `//*[@id="contents"]/div[3]/form[1]/table/tbody/tr[${trNo}]/td[3]/a`;
            const buttonElement = await frame.waitForXPath(buttonXPath, { timeout: 1000 });

            await buttonElement.click();

            await delay(3000);

            // 파일 경로
            const filePath = `${global.folderPath}/${siteTitle}: ${titleText}_${dateText}.jpg`;

            // 스크린샷 찍고 저장
            await page.screenshot({ path: filePath});
          }
          trNo++
          errCnt = 0;
          break
        }catch(e){
          errCnt++
          continue
        }
      }
    }while(trNo < 3)
  }catch(e){
    return {siteTitle: "fail"};
  }

  console.log(`end ========== ${siteTitle} ==========`)

  var resultJson = {};
  resultJson[siteTitle] = tempList;
  return resultJson;
}

async function Fss(page) {
  const siteTitle = "금융감독원";
  console.log(`start ========== ${siteTitle} ==========`);
  
  const url = "https://www.fss.or.kr/fss/bbs/B0000190/list.do?menuNo=200221";
  const dateXPath = '//*[@id="content"]/div[2]/table/tbody/tr[{i}]/td[4]/text()';
  const titleXPath = '//*[@id="content"]/div[2]/table/tbody/tr[{i}]/td[2]/a';
  const buttonXPath = '//*[@id="content"]/div[2]/table/tbody/tr[{i}]/td[2]/a';
  
  return await captureNotice(page, siteTitle, url, dateXPath, titleXPath, buttonXPath);
}

async function Tp(page) {
  const siteTitle = "사학연금";
  console.log(`start ========== ${siteTitle} ==========`);
  
  const url = "https://www.tp.or.kr/tp-kr/bbs/i-151/list.do";
  const dateXPath = '//*[@id="frmBbs"]/div[1]/div[2]/div/ul/li[{i}]/div[2]/ul/li[2]/text()';
  const titleXPath = '//*[@id="frmBbs"]/div[1]/div[2]/div/ul/li[{i}]/div[2]/a';
  const buttonXPath = '//*[@id="frmBbs"]/div[1]/div[2]/div/ul/li[{i}]/div[2]/a';
  
  return await captureNotice(page, siteTitle, url, dateXPath, titleXPath, buttonXPath);
}

async function Geps(page) {

  const siteTitle = "공무원연금공단";
  console.log(`start ========== ${siteTitle} ==========`);
  
  const url = "https://www.geps.or.kr/notiCommunication_notice_center";
  const dateXPath = '//*[@id="datatable-default"]/tbody/tr[{i}]/td[4]';
  const titleXPath = '//*[@id="datatable-default"]/tbody/tr[{i}]/td[3]/a';
  const buttonXPath = '//*[@id="datatable-default"]/tbody/tr[{i}]/td[3]/a';
  
  return await captureNotice(page, siteTitle, url, dateXPath, titleXPath, buttonXPath);
}

async function Childschoolinfo(page) {
  const siteTitle = "유치원알리미";
  console.log(`start ========== ${siteTitle} ==========`);
  
  const url = "https://e-childschoolinfo.moe.go.kr/customMt/notice/list.do";
  const dateXPath = '//*[@id="resultArea"]/div[2]/table/tbody/tr[{i}]/td[3]';
  const titleXPath = '//*[@id="resultArea"]/div[2]/table/tbody/tr[{i}]/td[2]/a';
  const buttonXPath = '//*[@id="resultArea"]/div[2]/table/tbody/tr[{i}]/td[2]/a';
  
  return await captureNotice(page, siteTitle, url, dateXPath, titleXPath, buttonXPath);
}

async function Schoolinfo(page) {
  const siteTitle = "학교알리미";
  console.log(`start ========== ${siteTitle} ==========`);
  
  const url = "https://www.schoolinfo.go.kr/ng/no/pnngno_a01_l0.do";
  const dateXPath = '//*[@id="contents"]/div/div/div[2]/table/tbody/tr[{i}]/td[3]/text()';
  const titleXPath = '//*[@id="contents"]/div/div/div[2]/table/tbody/tr[{i}]/td[2]/a/text()';
  const buttonXPath = '//*[@id="contents"]/div/div/div[2]/table/tbody/tr[${i}]/td[2]/a';
  
  return await captureNotice(page, siteTitle, url, dateXPath, titleXPath, buttonXPath);
}

async function Academyinfo(page) {
  const siteTitle = "대학알리미";
  console.log(`start ========== ${siteTitle} ==========`);
  
  const url = "https://www.academyinfo.go.kr/brd/brd0480/selectListLink.do?bbs_gubun=notice#1";
  const dateXPath = '//*[@id="tbResult"]/tr[{i}]/td[3]';
  const titleXPath = '//*[@id="tbResult"]/tr[{i}]/td[2]/a';
  const buttonXPath = '//*[@id="tbResult"]/tr[{i}]/td[2]/a';
  
  return await captureNotice(page, siteTitle, url, dateXPath, titleXPath, buttonXPath);
}

async function Hira(page) {
  const siteTitle = "건강보험심사평가원";
  console.log(`start ========== ${siteTitle} ==========`);
  
  const url = "https://www.hira.or.kr/bbsDummy.do?pgmid=HIRAA020002000100&WT.gnb=%EA%B3%B5%EC%A7%80%EC%82%AC%ED%95%AD";
  const dateXPath = '//*[@id="bbsEngineThreadVO"]/div[3]/table/tbody/tr[{i}]/td[4]';
  const titleXPath = '//*[@id="bbsEngineThreadVO"]/div[3]/table/tbody/tr[{i}]/td[2]/a';
  const buttonXPath = '//*[@id="bbsEngineThreadVO"]/div[3]/table/tbody/tr[{i}]/td[2]/a';
  
  return await captureNotice(page, siteTitle, url, dateXPath, titleXPath, buttonXPath);
}

async function Iros(page) {
  const siteTitle = "인터넷등기소";
  console.log(`start ========== ${siteTitle} ==========`);
  
  const url = "http://www.iros.go.kr/pos1/pfrontservlet?cmd=PCMS6GetBoardC&menuid=001004003001&boardTypeID=2";
  const dateXPath = '//*[@id="searchForm"]/div[3]/table/tbody/tr[{i}]/td[2]';
  const titleXPath = '//*[@id="searchForm"]/div[3]/table/tbody/tr[{i}]/td[1]/a/strong';
  const buttonXPath = '//*[@id="searchForm"]/div[3]/table/tbody/tr[{i}]/td[1]/a';

  var tempList = [];
  
  try {
    await page.goto(url, { waitUntil: 'load' });
    
    for (var i = 1; i <= 10; i++) {
      const dateHandle = await page.waitForXPath(dateXPath.replace('{i}', i));
      let dateText = await page.evaluate(element => element.textContent, dateHandle);
      dateText = dateText.replace(/\D/g, '');
      
      console.log(`${siteTitle}: ${dateText}`);
  
      let isToday = DateUtil.compareDate(dateText);
      if (isToday) {
        const titleHandle = await page.waitForXPath(titleXPath.replace('{i}', i));
        let titleText = await page.evaluate(element => element.textContent, titleHandle);
        titleText = titleText.replace(/\s+/g, ' ').trim()
  
        tempList.push({ [dateText]: titleText });
  
        const buttonElement = await page.waitForXPath(buttonXPath.replace('{i}', i));
  
        await buttonElement.click();
  
        await delay(5000);
  
        const filePath = `${global.folderPath}/${siteTitle}: ${titleText.replace(/\//g, '')}_${dateText}.jpg`;
  
        await page.screenshot({ path: filePath });
  
        await page.goto(url, { waitUntil: 'load' });

        await delay(5000);
      }
    }
  } catch(e) {
    return { siteTitle: "fail" };
  }
  
  console.log(`end ========== ${siteTitle} ==========`);
  
  return { [siteTitle]: tempList };
}



module.exports = {
  Iros              : Iros,
  Hira              : Hira,
  Academyinfo       : Academyinfo,
  Schoolinfo        : Schoolinfo,
  Childschoolinfo   : Childschoolinfo,
  Geps              : Geps,
  Tp                : Tp,
  Fss               : Fss,
  Courtauction      : Courtauction,
};