const DateUtil = require("../dateUtil.js"); 
const puppeteer = require("puppeteer");

async function Car365(page) {
  
  var siteTitle = "자동차365";
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
      const url = "https://www.car365.go.kr/";
      await page.goto(url, { waitUntil: 'load' }); // 브라우저 이동 후 페이지 로드 대기
  
      // 공지사항 페이지로 이동
      const titleFrames = page.frames();
      for (const frame of titleFrames) {
        try{
          const noticeXPath = `//*[@id="home"]`;
          const noticeElement = await frame.waitForXPath(noticeXPath, { timeout: 1000 });
          await noticeElement.click();
        } catch(e){
          continue;
        }
      }

      const titleFrames2 = page.frames();
      for (const frame of titleFrames2) {
        try{
          const noticeXPath = `//*[@id="container"]/div[2]/div/h2/a`;
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
          const datePath = `//*[@id="wrap"]/div/div[2]/div/div[2]/table/tbody/tr[${trNo}]/td[5]`
          const elementHandle = await frame.waitForXPath(datePath, { timeout: 1000 });
          let dateText = await frame.evaluate(element => element.textContent, elementHandle);
          dateText = dateText.replace(/\D/g, '');
          
          console.log(`${siteTitle}: ${dateText}`)

          let isToday = DateUtil.compareDate(dateText);
          if(isToday){

            tempJson = {};

            // 제목 체크
            const titlePath = `//*[@id="wrap"]/div/div[2]/div/div[2]/table/tbody/tr[${trNo}]/td[2]/a`;
            const titleHandle = await frame.waitForXPath(titlePath, { timeout: 1000 });
            let titleText = await frame.evaluate(element => element.textContent, titleHandle);
            titleText = titleText.replace(/\s+/g, ' ').trim()
            tempJson[dateText] = titleText;
            tempList.push(tempJson);

            // 해당 공지사항 상세 페이지로 이동
            const buttonXPath = `//*[@id="wrap"]/div/div[2]/div/div[2]/table/tbody/tr[${trNo}]/td[2]/a`;
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
    }while(trNo < 10)
  }catch(e){
    return {siteTitle: "fail"};
  }

  console.log(`end ========== ${siteTitle} ==========`)

  var resultJson = {};
  resultJson[siteTitle] = tempList;
  return resultJson;
}
async function Total(page) {
  
  var siteTitle = "고용산재보험 토탈서비스";
  console.log(`start ========== ${siteTitle} ==========`)

  var tempList = [];
  var tempJson = {};

  var trNo = 0;
  var errCnt = 0; //무한루프 방지용

  try{
    do{
      if(errCnt > 3){
        break;
      }
      const url = "https://total.comwel.or.kr/";
      await page.goto(url, { waitUntil: 'load' }); // 브라우저 이동 후 페이지 로드 대기
  
      // 공지사항 페이지로 이동
      const titleFrames = page.frames();
      for (const frame of titleFrames) {
        try{
          const noticeXPath = `//*[@id="mf_wfm_content_anchor1"]`;
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
          const datePath = `//*[@id="mf_wfm_content_gridView_cell_${trNo}_2"]/nobr`
          const elementHandle = await frame.waitForXPath(datePath, { timeout: 1000 });
          let dateText = await frame.evaluate(element => element.textContent, elementHandle);
          dateText = dateText.replace(/\D/g, '');
          
          console.log(`${siteTitle}: ${dateText}`)

          let isToday = DateUtil.compareDate(dateText);
          if(isToday){

            tempJson = {};

            // 제목 체크
            const titlePath = `//*[@id="mf_wfm_content_gridView_cell_${trNo}_1"]/nobr/a`;
            const titleHandle = await frame.waitForXPath(titlePath, { timeout: 1000 });
            let titleText = await frame.evaluate(element => element.textContent, titleHandle);
            titleText = titleText.replace(/\s+/g, ' ').trim()
            tempJson[dateText] = titleText;
            tempList.push(tempJson);

            // 해당 공지사항 상세 페이지로 이동
            const buttonXPath = `//*[@id="mf_wfm_content_gridView_cell_${trNo}_1"]/nobr/a`;
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
    }while(trNo < 10)
  }catch(e){
    return {siteTitle: "fail"};
  }

  console.log(`end ========== ${siteTitle} ==========`)

  var resultJson = {};
  resultJson[siteTitle] = tempList;
  return resultJson;
}
async function Renthome(page) {
  const siteTitle = "렌트홈";
  console.log(`start ========== ${siteTitle} ==========`);
  
  const url = "https://www.renthome.go.kr/webportal/main/portalMainList.open";

  var tempList = [];
  
  try {
    //렌트홈 팝업 처리
    const newPagePromise = new Promise((resolve, reject) => {
      page.once('popup', (newPage) => {
        resolve(newPage);
      });
    });
    await page.goto(url, { waitUntil: 'load' });
    const newPage = await newPagePromise; 

    // 파일 경로
    const filePath = `${global.folderPath}/${siteTitle}: popup.jpg`;

    // 스크린샷 찍고 저장
    await newPage.screenshot({ path: filePath});
    
  } catch(e) {
    return { siteTitle: "fail" };
  }
  
  console.log(`end ========== ${siteTitle} ==========`);
  
  return { [siteTitle]: tempList };
}
async function Car(page) {
  const siteTitle = "자동차리콜센터";
  console.log(`start ========== ${siteTitle} ==========`);
  
  const url = "https://www.car.go.kr/rs/nct/list.do";
  const dateXPath = '//*[@id="content"]/div/ul[1]/li[{i}]/ol/li[2]';
  const titleXPath = '//*[@id="content"]/div/ul[1]/li[{i}]/a';
  const buttonXPath = '//*[@id="content"]/div/ul[1]/li[{i}]/a';
  
  var tempList = [];
  
  try {
    await page.goto(url, { waitUntil: 'load' });
    
    for (var i = 1; i <= 4; i++) {
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
  
        const filePath = `${global.folderPath}/${siteTitle}: ${titleText}_${dateText}.jpg`;
  
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
async function Kiscon(page) {
  const siteTitle = "국토교통부";
  console.log(`start ========== ${siteTitle} ==========`);
  
  const url = "http://www.kiscon.net/helpdesk/hlp_list.asp?section_flag=10";
  const dateXPath = '/html/body/form[1]/div[9]/div/div[2]/div/table/tbody/tr[{i}]/td[5]';
  const titleXPath = '/html/body/form[1]/div[9]/div/div[2]/div/table/tbody/tr[{i}]/td[2]/a';
  const buttonXPath = '/html/body/form[1]/div[9]/div/div[2]/div/table/tbody/tr[{i}]/td[2]/a';
  
  return await captureNotice(page, siteTitle, url, dateXPath, titleXPath, buttonXPath);
}
async function Gov(page) {
  const siteTitle = "정부24";
  console.log(`start ========== ${siteTitle} ==========`);
  
  const url = "https://www.gov.kr/portal/ntcItm";
  const dateXPath = '/html/body/div[1]/div[2]/div[2]/div[2]/div[2]/table/tbody/tr[{i}]/td[4]';
  const titleXPath = '/html/body/div[1]/div[2]/div[2]/div[2]/div[2]/table/tbody/tr[{i}]/td[3]/a/strong';
  const buttonXPath = '/html/body/div[1]/div[2]/div[2]/div[2]/div[2]/table/tbody/tr[{i}]/td[3]/a';
  
  return await captureNotice(page, siteTitle, url, dateXPath, titleXPath, buttonXPath);
}
async function Insure4(page) {
  const siteTitle = "4대사회보험";
  console.log(`start ========== ${siteTitle} ==========`);
  
  const url = "https://www.4insure.or.kr/ins4/ptl/noti/noti/NotiOrgLayout.do";
  const dateXPath = '//*[@id="contents"]/table/tbody/tr[{i}]/td[5]';
  const titleXPath = '//*[@id="contents"]/table/tbody/tr[{i}]/td[3]/a';
  const buttonXPath = '//*[@id="contents"]/table/tbody/tr[{i}]/td[3]/a';
  
  return await captureNotice(page, siteTitle, url, dateXPath, titleXPath, buttonXPath);
}
async function Wetax(page) {
  const siteTitle = "위택스";
  console.log(`start ========== ${siteTitle} ==========`);
  
  const url = "https://www.wetax.go.kr/main/?cmd=LPTIBA0R1";
  const dateXPath = '//*[@id="section"]/div/div[2]/div/div[1]/table/tbody/tr[{i}]/td[5]';
  const titleXPath = '//*[@id="section"]/div/div[2]/div/div[1]/table/tbody/tr[{i}]/td[3]/a';
  const buttonXPath = '//*[@id="section"]/div/div[2]/div/div[1]/table/tbody/tr[{i}]/td[3]/a';
  
  var tempList = [];
  
  try {
    await page.goto(url, { waitUntil: 'load' });
    
    for (var i = 1; i <= 15; i++) {
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
  
        const filePath = `${global.folderPath}/${siteTitle}: ${titleText}_${dateText}.jpg`;
  
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
async function Ei(page) {
  const siteTitle = "고용보험";
  console.log(`start ========== ${siteTitle} ==========`);
  
  const url = "https://www.ei.go.kr/ei/eih/cp/cc/ccNtbd/retrieveCcNtbdList.do";
  const dateXPath = '//*[@id="listForm"]/div/div[1]/div[3]/table/tbody/tr[{i}]/td[4]';
  const titleXPath = '//*[@id="listForm"]/div/div[1]/div[3]/table/tbody/tr[{i}]/td[2]/a';
  const buttonXPath = '//*[@id="listForm"]/div/div[1]/div[3]/table/tbody/tr[{i}]/td[2]/a';
  
  return await captureNotice(page, siteTitle, url, dateXPath, titleXPath, buttonXPath);
}
async function Kdca(page) {
  const siteTitle = "질병관리청";
  console.log(`start ========== ${siteTitle} ==========`);
  
  const url = "https://nip.kdca.go.kr/irhp/remd/goVcntNtfc.do?menuLv=2&menuCd=21";
  const dateXPath = '//*[@id="listForm"]/table/tbody/tr[{i}]/td[3]';
  const titleXPath = '//*[@id="listForm"]/table/tbody/tr[{i}]/td[2]/a';
  const buttonXPath = '//*[@id="listForm"]/table/tbody/tr[{i}]/td[2]/a';
  
  return await captureNotice(page, siteTitle, url, dateXPath, titleXPath, buttonXPath);
}
async function Hikorea(page) {
  const siteTitle = "하이코리아";
  console.log(`start ========== ${siteTitle} ==========`);
  
  const url = "https://www.hikorea.go.kr/board/BoardNtcListR.pt";
  const dateXPath = '//*[@id="content"]/div[2]/div/div[2]/div/table/tbody/tr[{i}]/td[5]';
  const titleXPath = '//*[@id="content"]/div[2]/div/div[2]/div/table/tbody/tr[{i}]/td[3]/a';
  const buttonXPath = '//*[@id="content"]/div[2]/div/div[2]/div/table/tbody/tr[{i}]/td[3]/a';
  
  return await captureNotice(page, siteTitle, url, dateXPath, titleXPath, buttonXPath);
}
async function Cartax(page) {
  const siteTitle = "교통위반단속";
  console.log(`start ========== ${siteTitle} ==========`);
  
  const url = "https://cartax.seoul.go.kr/cartax/bbs/B0000001/list.do?menuNo=200020";
  const dateXPath = '//*[@id="content"]/div[3]/table/tbody/tr[{i}]/td[3]/text()';
  const titleXPath = '//*[@id="content"]/div[3]/table/tbody/tr[{i}]/td[2]/a';
  const buttonXPath = '//*[@id="content"]/div[3]/table/tbody/tr[{i}]/td[2]/a';
  
  return await captureNotice(page, siteTitle, url, dateXPath, titleXPath, buttonXPath);
}
async function Hipass(page) {
  const siteTitle = "하이패스";
  console.log(`start ========== ${siteTitle} ==========`);
  
  const url = "https://www.hipass.co.kr/board/selectNoticeList.do";
  const dateXPath = '//*[@id="container"]/div[5]/div/div[2]/div[2]/div[3]/table/tbody/tr[{i}]/td[4]';
  const titleXPath = '//*[@id="container"]/div[5]/div/div[2]/div[2]/div[3]/table/tbody/tr[{i}]/td[3]/a';
  const buttonXPath = '//*[@id="container"]/div[5]/div/div[2]/div[2]/div[3]/table/tbody/tr[{i}]/td[3]/a';
  
  return await captureNotice(page, siteTitle, url, dateXPath, titleXPath, buttonXPath);
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
  Hipass  : Hipass,
  Cartax  : Cartax,
  Hikorea : Hikorea,
  Kdca    : Kdca,
  Ei      : Ei,
  Wetax   : Wetax,
  Insure4 : Insure4,
  Gov     : Gov,
  Kiscon  : Kiscon,
  Car     : Car,
  Renthome: Renthome,
  Total   : Total,
  Car365  : Car365,
};