const DateUtil = require("../dateUtil.js"); 
const puppeteer = require("puppeteer");

async function delay(ms) {
  await new Promise(resolve => setTimeout(resolve, ms));
}

async function Uplus(page) {
  
  var siteTitle = "유플러스";
  console.log(`start ========== ${siteTitle} ==========`)

  var tempList = [];
  var tempJson = {};

  try{
    const url = "https://www.lguplus.com/support/service/notice";
    await page.goto(url, { waitUntil: 'load' }); // 브라우저 이동 후 페이지 로드 대기

    for(var i = 1; i <= 10; i++){
      // 게시물 날짜
      const datePath = `//*[@id="__BVID__397"]/tbody/tr[${i}]/td[3]`
      const elementHandle = await page.waitForXPath(datePath);
      let dateText = await page.evaluate(element => element.textContent, elementHandle);
      dateText = dateText.replace(/\D/g, '');
      
      console.log(`${siteTitle}: ${dateText}`)

      let isToday = DateUtil.compareDate(dateText);
      if(isToday){

        tempJson = {};

        // 제목 체크
        let pageCount = 250 + i;
        const titlePath = `//*[@id="_uid_${pageCount}"]`;
        const titleHandle = await page.waitForXPath(titlePath);
        let titleText = await page.evaluate(element => element.textContent, titleHandle);
        tempJson[dateText] = titleText;
        tempList.push(tempJson);

        // 해당 공지사항 상세 페이지로 이동
        const buttonXPath = `//*[@id="_uid_${pageCount}"]`;
        const buttonElement = await page.waitForXPath(buttonXPath);

        await buttonElement.click('button', { clickCount: 2 }); // 더블클릭 수행

        await delay(3000);

        // 파일 경로
        const filePath = `${global.folderPath}/${siteTitle}: ${dateText}.jpg`;

        // 스크린샷 찍고 저장
        await page.screenshot({ path: filePath});

        // 공지를 캡쳐하면 다시 목록 페이지로 돌아간다.
        await page.goto(url, { waitUntil: 'load' });
        // await page.goBack();

      }
    }
  } catch(e) {
    return {siteTitle: "fail"};
  }

  console.log(`end ========== ${siteTitle} ==========`)

  var resultJson = {};
  resultJson[siteTitle] = tempList;
  return resultJson;
}

async function KT(page) {
  
  var siteTitle = "KT";
  console.log(`start ========== ${siteTitle} ==========`)

  var tempList = [];
  var tempJson = {};

  try{
    const url = "https://inside.kt.com/html/notice/notice_list.html";
    await page.goto(url, { waitUntil: 'load' }); // 브라우저 이동 후 페이지 로드 대기

    for(var i = 1; i <= 10; i++){
      // 게시물 날짜
      const datePath = `//*[@id="notice-area"]/div/a[${i}]/p/text()[2]`
      const elementHandle = await page.waitForXPath(datePath);
      let dateText = await page.evaluate(element => element.textContent, elementHandle);
      dateText = dateText.replace(/\D/g, '');
      
      console.log(`${siteTitle}: ${dateText}`)

      let isToday = DateUtil.compareDate(dateText);
      if(isToday){

        tempJson = {};

        // 제목 체크
        const titlePath = `//*[@id="notice-area"]/div/a[${i}]/div/text()`
        const titleHandle = await page.waitForXPath(titlePath);
        let titleText = await page.evaluate(element => element.textContent, titleHandle);
        tempJson[dateText] = titleText;
        tempList.push(tempJson);

        // 해당 공지사항 상세 페이지로 이동
        const buttonXPath = `//*[@id="notice-area"]/div/a[${i}]/div`;
        const buttonElement = await page.waitForXPath(buttonXPath);

        await buttonElement.click();

        await delay(3000);

        // 파일 경로
        const filePath = `${global.folderPath}/${siteTitle}: ${dateText}.jpg`;

        // 스크린샷 찍고 저장
        await page.screenshot({ path: filePath});

        // 공지를 캡쳐하면 다시 목록 페이지로 돌아간다.
        await page.goto(url, { waitUntil: 'load' });
        // await page.goBack();

      }
    }

  } catch(e) {
    return {siteTitle: "fail"};
  }

  console.log(`end ========== ${siteTitle} ==========`)

  var resultJson = {};
  resultJson[siteTitle] = tempList;
  return resultJson;
  
}

async function SKT(page) {
  
  var siteTitle = "SKT";
  console.log(`start ========== ${siteTitle} ==========`)

  var tempList = [];
  var tempJson = {};

  try{
    const url = "https://www.tworld.co.kr/normal.do?serviceId=S_ETC_0021&viewId=V_CMN_0004";
    await page.goto(url, { waitUntil: 'load' }); // 브라우저 이동 후 페이지 로드 대기

    for(var i = 1; i <= 12; i++){
      // 게시물 날짜
      const datePath = `//*[@id="tabCon2"]/div[2]/table/tbody/tr[${i}]/td[4]`
      const elementHandle = await page.waitForXPath(datePath);
      let dateText = await page.evaluate(element => element.textContent, elementHandle);
      dateText = dateText.replace(/\D/g, '');
      
      console.log(`${siteTitle}: ${dateText}`)

      let isToday = DateUtil.compareDate(dateText);
      if(isToday){

        tempJson = {};

        // 제목 체크
        const titlePath = `//*[@id="tabCon2"]/div[2]/table/tbody/tr[${i}]/td[3]`
        const titleHandle = await page.waitForXPath(titlePath);
        let titleText = await page.evaluate(element => element.textContent, titleHandle);
        titleText = titleText.replace(/[\t\n]/g, '');
        tempJson[dateText] = titleText;
        tempList.push(tempJson);

        // 해당 공지사항 상세 페이지로 이동
        const buttonXPath = `//*[@id="tabCon2"]/div[2]/table/tbody/tr[${i}]/td[3]/a`;
        const buttonElement = await page.waitForXPath(buttonXPath);

        await buttonElement.click();

        await delay(3000);

        // 파일 경로
        const filePath = `${global.folderPath}/${siteTitle}: ${dateText}.jpg`;

        // 스크린샷 찍고 저장
        await page.screenshot({ path: filePath});

        // 공지를 캡쳐하면 다시 목록 페이지로 돌아간다.
        await page.goto(url, { waitUntil: 'load' });
        // await page.goBack();

      }
    }

  } catch(e) {
    return {siteTitle: "fail"};
  }

  console.log(`end ========== ${siteTitle} ==========`)

  var resultJson = {};
  resultJson[siteTitle] = tempList;
  return resultJson;
  
}


module.exports = {
  Uplus : Uplus,
  KT    : KT,
  SKT   : SKT,
};