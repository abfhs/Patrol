function compareDate(dateText) {
  // 숫자만 남기고 나머지 제거
  var cleanedDateText = dateText.replace(/\D/g, '');

  // 오늘 날짜 가져오기
  var today = new Date();

  // 오늘부터 4일 전까지의 날짜를 숫자 형태로 변환하여 배열에 저장
  var dateTextsToCompare = [];
  for (var i = 0; i <= 4; i++) {
    var compareDate = new Date(today.getTime() - (i * 24 * 60 * 60 * 1000));
    var compareText = compareDate.getFullYear() * 10000 + (compareDate.getMonth() + 1) * 100 + compareDate.getDate();
    dateTextsToCompare.push(compareText);
  }

  // 특정 날짜를 숫자 형태로 변환
  var dateNumber = parseInt(cleanedDateText);

  // 날짜 비교
  if (dateTextsToCompare.includes(dateNumber)) {
    return true;
  } else {
    return false;
  }
}


module.exports = {
    compareDate: compareDate
  };
