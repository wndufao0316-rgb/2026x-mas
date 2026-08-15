export const GOOGLE_APPS_SCRIPT_CODE = `/**
 * ====================================================================
 * JOSHUA JEONG_PRAISE CONCERT - [운명: 창조의 뜻]
 * Google Sheets -> 모바일 브로슈어 웹앱 연동 스크립트 (Code.gs)
 * ====================================================================
 * 
 * [설치 및 배포 방법]
 * 1. 구글 드라이브에서 새 'Google 스프레드시트'를 생성합니다.
 * 2. 1행 헤더를 다음과 같이 작성합니다 (A열 ~ K열):
 *    A: 순서 | B: 악장구분 | C: 곡명 | D: 테마 | E: 성경구절 | F: 출연진 | G: 사진URL | H: 사진설명 | I: 가사글귀 | J: 곡해설 | K: 연주시간
 * 3. 상단 메뉴 [확장 프로그램] > [Apps Script]를 클릭합니다.
 * 4. 기존 코드를 모두 지우고 본 스크립트(Code.gs) 전체를 복사하여 붙여넣습니다.
 * 5. 상단 우측 파란색 [배포] 버튼 > [새 배포] 클릭
 *    - 유형 선택: [웹 앱] (톱니바퀴 아이콘)
 *    - 설명: 찬양콘서트 브로슈어 API
 *    - 다음 사용자로 실행: [나] (본인 계정)
 *    - 액세스 권한이 있는 사용자: [모든 사용자] (Anyone) 필수 선택!
 * 6. [배포] 버튼을 누른 후 생성된 [웹 앱 URL] (https://script.google.com/macros/s/.../exec)을 복사합니다.
 * 7. 브로슈어 웹앱의 [관리자 모드(a7890)] > [구글 시트 연동]에 URL을 입력하면 즉시 동기화됩니다.
 */

function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("행사순서") || ss.getSheets()[0];
    var data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      return createJsonResponse({
        status: "empty",
        items: [],
        message: "스프레드시트에 데이터가 없습니다. 2행부터 행사 순서를 입력해주세요."
      });
    }

    var headers = data[0];
    var rows = data.slice(1);
    var items = [];

    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      if (!row[0] && !row[2]) continue; // 빈 행 제외

      var orderNum = Number(row[0]) || (i + 1);
      
      items.push({
        id: "item-" + (i + 1),
        order: orderNum,
        actTitle: String(row[1] || ("제" + (i + 1) + " 순서")),
        songTitle: String(row[2] || "찬양 곡명"),
        theme: String(row[3] || ""),
        scripture: String(row[4] || ""),
        performer: String(row[5] || ""),
        imageUrl: String(row[6] || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80"),
        imageCaption: String(row[7] || ""),
        lyrics: String(row[8] || ""),
        commentary: String(row[9] || ""),
        duration: String(row[10] || "")
      });
    }

    // 작성/등록 순서(오름차순) 기준 정렬
    items.sort(function(a, b) {
      return a.order - b.order;
    });

    var result = {
      status: "success",
      totalCount: items.length,
      syncedAt: new Date().toISOString(),
      items: items
    };

    // JSONP 지원
    if (e && e.parameter && e.parameter.callback) {
      var callback = e.parameter.callback;
      return ContentService
        .createTextOutput(callback + "(" + JSON.stringify(result) + ");")
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }

    return createJsonResponse(result);

  } catch (error) {
    return createJsonResponse({
      status: "error",
      message: error.toString()
    });
  }
}

function createJsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
`;

export const GOOGLE_SHEET_SAMPLE_CSV = `순서\t악장구분\t곡명\t테마\t성경구절\t출연진\t사진URL\t사진설명\t가사글귀\t곡해설\t연주시간
1\t서곡 (Overture)\t태초의 빛과 생명의 숨결\t창조의 서막\t창세기 1:1-3\t오케스트라 & 오르간\thttps://images.unsplash.com/photo-1511671782779-c97d3d27a1d4\t혼돈과 흑암 속의 첫 빛\t빛이 있으라 하시매\t우주 만물의 탄생 묘사\t06:15
2\t제1악장 : 소명\t진흙 속에 불어넣은 생기\t인간 창조\t이사야 43:1\t정여호수아\thttps://images.unsplash.com/photo-1514525253161-7a46d19cd819\t토기장이의 손길\t내가 너를 지명하여 불렀나니\t바리톤 솔로와 첼로의 조화\t05:40
3\t제2악장 : 연단\t광야의 밤, 약속의 등불\t섭리의 밤\t신명기 8:2\t앙상블\thttps://images.unsplash.com/photo-1469474968028-56623f02e42e\t거친 광야 길\t길이 보이지 않던 곳에서\t고난 속 빚어가시는 은혜\t04:55
4\t제3악장 : 구속\t골고다 언덕의 운명적 사랑\t십자가의 완성\t요한복음 19:30\t콰이어\thttps://images.unsplash.com/photo-1507692049790-de58290a4334\t희생의 십자가\t다 이루었다 선포하신 순종\t창조의 뜻이 도달하는 절정\t07:10
5\t제4악장 : 헌신\t주의 손에 이끌리어\t결단의 찬양\t로마서 12:1\t정여호수아\thttps://images.unsplash.com/photo-1519671482749-fd09be7ccebf\t온전한 산 제물\t주여 내가 여기 있나이다\t청지기로 살아갈 다짐\t05:30
6\t피날레\t창조주를 향한 영원한 송축\t영원한 찬송\t요한계시록 4:11\t전 출연진\thttps://images.unsplash.com/photo-1465847899084-d164df4dedc6\t영원한 찬양의 대합창\t할렐루야 전능하신 주\t전 회중과 함께 부르는 대단원\t06:45`;
