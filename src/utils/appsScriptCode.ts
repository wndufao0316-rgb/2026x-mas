export const GOOGLE_APPS_SCRIPT_CODE = `/**
 * ====================================================================
 * JOSHUA JEONG_PRAISE CONCERT - [운명: 창조의 뜻]
 * Google Sheets <-> 모바일 브로슈어 웹앱 양방향 연동 스크립트 (Code.gs)
 * ====================================================================
 * 
 * [설치 및 배포 방법]
 * 1. 구글 드라이브에서 새 'Google 스프레드시트'를 생성합니다.
 * 2. 상단 메뉴 [확장 프로그램] > [Apps Script]를 클릭합니다.
 * 3. 기존 코드를 모두 지우고 본 스크립트(Code.gs) 전체를 복사하여 붙여넣고 저장(Ctrl+S)합니다.
 * 4. 상단 우측 파란색 [배포] 버튼 > [새 배포] 클릭
 *    - 유형 선택: [웹 앱] (톱니바퀴 아이콘)
 *    - 설명: 찬양콘서트 브로슈어 양방향 API
 *    - 다음 사용자로 실행: [나] (본인 계정)
 *    - 액세스 권한이 있는 사용자: [모든 사용자] (Anyone) 필수 선택!
 * 5. [배포] 버튼을 누른 후 생성된 [웹 앱 URL] (https://script.google.com/macros/s/.../exec)을 복사합니다.
 * 6. 브로슈어 웹앱의 [구글 시트 연동]에 URL을 등록하면 웹앱에서 수정한 글귀와 사진이 구글 시트에 즉시 반영됩니다!
 */

// 1. 구글 시트 -> 브로슈어 웹앱 데이터 불러오기 (GET)
function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // 1) 행사 순서 시트 읽기
    var sheet = ss.getSheetByName("행사순서") || ss.getSheets()[0];
    var data = sheet.getDataRange().getValues();
    var items = [];

    if (data.length > 1) {
      var rows = data.slice(1);
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

      // 순서 기준 정렬
      items.sort(function(a, b) {
        return a.order - b.order;
      });
    }

    // 2) 행사 정보(메타데이터) 시트 읽기 (존재하는 경우)
    var metaSheet = ss.getSheetByName("행사정보");
    var metadata = {};
    if (metaSheet) {
      var metaData = metaSheet.getDataRange().getValues();
      for (var m = 1; m < metaData.length; m++) {
        var key = String(metaData[m][0] || '').trim();
        var val = String(metaData[m][1] || '').trim();
        if (key) metadata[key] = val;
      }
    }

    var result = {
      status: "success",
      totalCount: items.length,
      syncedAt: new Date().toISOString(),
      items: items,
      metadata: Object.keys(metadata).length > 0 ? metadata : null
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

// 2. 브로슈어 웹앱 -> 구글 시트로 수정된 글귀, 사진, 순서 즉시 저장 및 반영 (POST)
function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var payload = {};
    
    if (e && e.postData && e.postData.contents) {
      payload = JSON.parse(e.postData.contents);
    } else if (e && e.parameter && e.parameter.data) {
      payload = JSON.parse(e.parameter.data);
    }

    var items = payload.items || [];
    var metadata = payload.metadata || {};
    var guestbook = payload.guestbook || [];

    // 1) 행사 순서(곡 목록, 사진, 가사, 해설) 시트 업데이트
    var sheet = ss.getSheetByName("행사순서");
    if (!sheet) {
      sheet = ss.insertSheet("행사순서", 0);
    }
    
    // 시트 전체 초기화 및 헤더 작성
    sheet.clear();
    var headers = [
      ["순서", "악장구분", "곡명", "테마", "성경구절", "출연진", "사진URL", "사진설명", "가사글귀", "곡해설", "연주시간"]
    ];
    sheet.getRange(1, 1, 1, headers[0].length).setValues(headers)
      .setFontWeight("bold")
      .setBackground("#e8e4d8")
      .setFontColor("#2a1b0a");

    if (items && items.length > 0) {
      // 순서 정렬
      items.sort(function(a, b) {
        return (a.order || 0) - (b.order || 0);
      });

      var rows = items.map(function(item, idx) {
        return [
          item.order || (idx + 1),
          item.actTitle || "",
          item.songTitle || "",
          item.theme || "",
          item.scripture || "",
          item.performer || "",
          item.imageUrl || "",
          item.imageCaption || "",
          item.lyrics || "",
          item.commentary || "",
          item.duration || ""
        ];
      });

      sheet.getRange(2, 1, rows.length, headers[0].length).setValues(rows);
    }

    // 2) 행사 정보(표지/초대의 글/글귀) 시트 업데이트
    if (metadata && Object.keys(metadata).length > 0) {
      var metaSheet = ss.getSheetByName("행사정보");
      if (!metaSheet) {
        metaSheet = ss.insertSheet("행사정보");
      }
      metaSheet.clear();
      var metaHeaders = [["항목키 (Key)", "설정 내용 (Value)", "설명"]];
      metaSheet.getRange(1, 1, 1, 3).setValues(metaHeaders)
        .setFontWeight("bold")
        .setBackground("#d7ccc8")
        .setFontColor("#2a1b0a");

      var metaRows = [
        ["concertTitle", metadata.concertTitle || "", "공연 대제목"],
        ["concertSubtitle", metadata.concertSubtitle || "", "공연 영문 소제목"],
        ["themeQuote", metadata.themeQuote || "", "표지 테마 성경말씀"],
        ["date", metadata.date || "", "공연 일시"],
        ["venue", metadata.venue || "", "공연 장소"],
        ["welcomePage2Heading", metadata.welcomePage2Heading || "", "초대의 글(1: 사진) 제목"],
        ["welcomePage2Subtitle", metadata.welcomePage2Subtitle || "", "초대의 글(1: 사진) 영문소제목"],
        ["welcomePage2DedicationHeader", metadata.welcomePage2DedicationHeader || "", "초대의 글(1) 묵상 소제목"],
        ["welcomePage2ImageUrl", metadata.welcomePage2ImageUrl || "", "초대의 글(1) 사진 웹 URL"],
        ["welcomePage2ImageCaption", metadata.welcomePage2ImageCaption || "", "초대의 글(1) 사진 캡션"],
        ["welcomePage2Message", metadata.welcomePage2Message || "", "초대의 글(1) 묵상 글귀"],
        ["welcomeHeading", metadata.welcomeHeading || "", "초대의 글(2: 본문) 제목"],
        ["welcomeSubtitle", metadata.welcomeSubtitle || "", "초대의 글(2: 본문) 영문소제목"],
        ["welcomeDedicationHeader", metadata.welcomeDedicationHeader || "", "초대의 글(2) 헌사 헤더"],
        ["welcomeMessage", metadata.welcomeMessage || "", "초대의 글(2) 본문 인사말"],
        ["dedicationText", metadata.dedicationText || "", "헌사의 글"],
        ["tocHeading", metadata.tocHeading || "", "목차 헤더 제목"],
        ["tocSubtitle", metadata.tocSubtitle || "", "목차 영문 소제목"]
      ];

      metaSheet.getRange(2, 1, metaRows.length, 3).setValues(metaRows);
    }

    // 3) 방명록 시트 업데이트
    if (guestbook && guestbook.length > 0) {
      var gbSheet = ss.getSheetByName("방명록");
      if (!gbSheet) {
        gbSheet = ss.insertSheet("방명록");
      }
      gbSheet.clear();
      gbSheet.getRange(1, 1, 1, 3).setValues([["작성일시", "작성자(이름)", "축복의 메시지"]])
        .setFontWeight("bold")
        .setBackground("#dfba73")
        .setFontColor("#2a1b0a");

      var gbRows = guestbook.map(function(entry) {
        return [
          entry.createdAt || "",
          entry.name || "",
          entry.message || ""
        ];
      });
      gbSheet.getRange(2, 1, gbRows.length, 3).setValues(gbRows);
    }

    return createJsonResponse({
      status: "success",
      message: "웹앱에서 수정한 모든 글귀와 사진이 구글 시트에 성공적으로 반영되었습니다!",
      savedAt: new Date().toISOString(),
      itemCount: items.length
    });

  } catch (error) {
    return createJsonResponse({
      status: "error",
      message: "구글 시트 저장 중 오류가 발생했습니다: " + error.toString()
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

