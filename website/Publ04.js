const DateUtil = require("../dateUtil.js"); 
const puppeteer = require("puppeteer");

async function Hometax(page) {
  const siteTitle = "홈택스";
  console.log(`start ========== ${siteTitle} ==========`);
  
  var tempList = [];
  var tempJson = {};

  var trNo = 0;
  var errCnt = 0; //무한루프 방지용
  
  try {
    do{
      if(errCnt > 3){
        break;
      }
      const url = "https://www.hometax.go.kr/websquare/websquare.wq?w2xPath=/ui/pp/index.xml&tmIdx=0&tm2lIdx=&tm3lIdx=";
      await page.goto(url, { waitUntil: 'load' }); // 브라우저 이동 후 페이지 로드 대기
      const noticeXpath = '//*[@id="grpAnnc"]'

      await delay(3000);
      
      // 첫 통신 때는 메인배너 스샷 후 진행
      if(trNo == 0){
        const filePath = `${global.folderPath}/${siteTitle}: 메인배너.jpg`;
        await page.screenshot({ path: filePath});
      }

      const noticeElement = await page.waitForXPath(noticeXpath);
      await noticeElement.click();

      await delay(3000);

      const frames = page.frames();
      for (const frame of frames) {
        try{
          // 게시물 날짜
          const datePath = `//*[@id="grdList_cell_${trNo}_4"]/span`
          const elementHandle = await frame.waitForXPath(datePath, { timeout: 1000 });
          let dateText = await frame.evaluate(element => element.textContent, elementHandle);
          dateText = dateText.replace(/\D/g, '');
          
          console.log(`${siteTitle}: ${dateText}`)

          let isToday = DateUtil.compareDate(dateText);
          if(isToday){

            tempJson = {};

            // 제목 체크
            const titlePath = `//*[@id="grdList_cell_${trNo}_2"]/span/a`;
            const titleHandle = await frame.waitForXPath(titlePath, { timeout: 1000 });
            let titleText = await frame.evaluate(element => element.textContent, titleHandle);
            titleText = titleText.replace(/\s+/g, ' ').trim()
            tempJson[dateText] = titleText;
            tempList.push(tempJson);

            // 해당 공지사항 상세 페이지로 이동
            const buttonXPath = `//*[@id="grdList_cell_${trNo}_2"]/span/a`;
            const buttonElement = await frame.waitForXPath(buttonXPath, { timeout: 1000 });

            await buttonElement.click();

            await delay(3000);

            // 파일 경로
            const filePath = `${global.folderPath}/${siteTitle}: ${titleText.replace(/\//g, '')}_${dateText}.jpg`;

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
    }while(trNo < 6)
  } catch(e) {
    return { siteTitle: "fail" };
  }
  
  console.log(`end ========== ${siteTitle} ==========`);
  
  return { [siteTitle]: tempList };
}
async function Nps(page) {
  
  const siteTitle = "국민연금";
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
      const url = "https://www.nps.or.kr/jsppage/news/new_news/new_news_01.jsp";
      await page.goto(url, { waitUntil: 'load' }); // 브라우저 이동 후 페이지 로드 대기

      const frames = page.frames();
      for (const frame of frames) {
        try{
          // 게시물 날짜
          const datePath = `/html/body/div[1]/table/tbody/tr[${trNo}]/td[5]`
          const elementHandle = await frame.waitForXPath(datePath, { timeout: 1000 });
          let dateText = await frame.evaluate(element => element.textContent, elementHandle);
          dateText = dateText.replace(/\D/g, '');
          
          console.log(`${siteTitle}: ${dateText}`)

          let isToday = DateUtil.compareDate(dateText);
          if(isToday){

            tempJson = {};

            // 제목 체크
            const titlePath = `/html/body/div[1]/table/tbody/tr[${trNo}]/td[2]/a`;
            const titleHandle = await frame.waitForXPath(titlePath, { timeout: 1000 });
            let titleText = await frame.evaluate(element => element.textContent, titleHandle);
            titleText = titleText.replace(/\s+/g, ' ').trim()
            tempJson[dateText] = titleText;
            tempList.push(tempJson);

            // 해당 공지사항 상세 페이지로 이동
            const buttonXPath = `/html/body/div[1]/table/tbody/tr[${trNo}]/td[2]/a`;
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
    }while(trNo < 16)
  }catch(e){
    return {siteTitle: "fail"};
  }

  console.log(`end ========== ${siteTitle} ==========`)

  var resultJson = {};
  resultJson[siteTitle] = tempList;
  return resultJson;
}
async function Dhlottery(page) {
  const siteTitle = "동행복권";
  console.log(`start ========== ${siteTitle} ==========`);

  const url = "https://www.dhlottery.co.kr/service.do?method=noticeList";
  const dateXPath = '//*[@id="article"]/div[2]/div/div/table/tbody/tr[{i}]/td[4]';
  const titleXPath = '//*[@id="article"]/div[2]/div/div/table/tbody/tr[{i}]/td[2]/a';
  const buttonXPath = '//*[@id="article"]/div[2]/div/div/table/tbody/tr[{i}]/td[2]/a';
  
  return await captureNotice(page, siteTitle, url, dateXPath, titleXPath, buttonXPath);
}
async function Molit(page) {
  const siteTitle = "부동산 거래관리시스템";
  console.log(`start ========== ${siteTitle} ==========`);
  
  const url = "https://rtms.molit.go.kr/wc/bull/egovBullList.do?listGbn=2";
  const dateXPath = '//*[@id="searchVO"]/div/div[2]/div[2]/div[2]/div[2]/div[2]/table/tbody/tr[{i}]/td[4]';
  const titleXPath = '//*[@id="searchVO"]/div/div[2]/div[2]/div[2]/div[2]/div[2]/table/tbody/tr[{i}]/td[2]';
  const buttonXPath = '//*[@id="searchVO"]/div/div[2]/div[2]/div[2]/div[2]/div[2]/table/tbody/tr[{i}]/td[2]';
  
  return await captureNotice(page, siteTitle, url, dateXPath, titleXPath, buttonXPath);
}
async function Cashgate(page) {
  const siteTitle = "전자민원캐시";
  console.log(`start ========== ${siteTitle} ==========`);
  
  const url = "https://minwon.cashgate.co.kr/retrieveBoardList.do";
  const dateXPath = '//*[@id="articleSection"]/div[1]/table/tbody/tr[{i}]/td[3]';
  const titleXPath = '//*[@id="articleSection"]/div[1]/table/tbody/tr[{i}]/td[2]/a';
  const buttonXPath = '//*[@id="articleSection"]/div[1]/table/tbody/tr[{i}]/td[2]/a';
  
  return await captureNotice(page, siteTitle, url, dateXPath, titleXPath, buttonXPath);
}
async function Scourt(page) {
  const siteTitle = "전자후견등기시스템";
  console.log(`start ========== ${siteTitle} ==========`);
  
  const url = "https://egdrs.scourt.go.kr/ug/NtcMttrInq.do";
  const dateXPath = '//*[@id="container"]/div/section/div[2]/div/table/tbody/tr[{i}]/td[5]';
  const titleXPath = '//*[@id="container"]/div/section/div[2]/div/table/tbody/tr[{i}]/td[3]/a';
  const buttonXPath = '//*[@id="container"]/div/section/div[2]/div/table/tbody/tr[{i}]/td[3]/a';
  
  return await captureNotice(page, siteTitle, url, dateXPath, titleXPath, buttonXPath);
}
async function Eais(page) {
  const siteTitle = "세움터";
  console.log(`start ========== ${siteTitle} ==========`);
  
  const url = "https://www.eais.go.kr/moct/awp/afa01/AWPAFA01L01";
  const dateXPath = '//*[@id="container"]/div[2]/div/div[3]/table/tbody/tr[{i}]/td[3]';
  const titleXPath = '//*[@id="container"]/div[2]/div/div[3]/table/tbody/tr[{i}]/td[2]/a';
  const buttonXPath = '//*[@id="container"]/div[2]/div/div[3]/table/tbody/tr[{i}]/td[2]/a';
  
  return await captureNotice(page, siteTitle, url, dateXPath, titleXPath, buttonXPath);
}
async function Koroad(page) {
  const siteTitle = "도로교통공단";
  console.log(`start ========== ${siteTitle} ==========`);
  
  const url = "https://www.koroad.or.kr/main/board/1/board_list.do";
  const dateXPath = '//*[@id="content"]/section/div/table/tbody/tr[{i}]/td[5]/span';
  const titleXPath = '//*[@id="content"]/section/div/table/tbody/tr[{i}]/td[3]/div/a';
  const buttonXPath = '//*[@id="content"]/section/div/table/tbody/tr[{i}]/td[3]/div/a';
  
  var tempList = [];
  
  try {
    await page.goto(url, { waitUntil: 'load' });
    
    for (var i = 1; i <= 13; i++) {
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
  
        let filePath = `${global.folderPath}/${siteTitle}: ${titleText.replace(/\//g, '')}_${dateText}.jpg`;
  
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

async function delay(ms) {
  await new Promise(resolve => setTimeout(resolve, ms));
}


module.exports = {
  Koroad    : Koroad,
  Eais      : Eais,
  Scourt    : Scourt,
  Cashgate  : Cashgate,
  Molit     : Molit,
  Dhlottery : Dhlottery,
  Nps       : Nps,
  Hometax   : Hometax,
};