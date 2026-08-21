export const GOOGLE_APPS_SCRIPT_CODE = `/**
 * ====================================================================
 * JOSHUA JEONG_PRAISE CONCERT - [운명: 창조의 뜻]
 * Google Sheets <-> 모바일 브로슈어 웹앱 실시간 양방향 연동 스크립트 (Code.gs)
 * ====================================================================
 * 
 * [스프레드시트 3번째 탭 '방명록' 실시간 자동 연동 배포 4단계 (1분 소요)]
 * 1. 구글 스프레드시트 상단 메뉴 [확장 프로그램] > [Apps Script]를 클릭합니다.
 * 2. 기존 코드를 모두 지우고 본 스크립트(Code.gs) 전체를 복사하여 붙여넣고 저장(Ctrl+S)합니다.
 * 3. 상단 우측 파란색 [배포] 버튼 > [새 배포] 클릭
 *    - 유형 선택: [웹 앱] (톱니바퀴 아이콘)
 *    - 설명: 찬양콘서트 브로슈어 방명록 및 순서 실시간 연동 API
 *    - 다음 사용자로 실행: [나] (본인 계정)
 *    - 액세스 권한이 있는 사용자: [모든 사용자] (Anyone) ★필수 선택★
 * 4. [배포] 버튼을 누른 후 생성된 [웹 앱 URL] (https://script.google.com/macros/s/.../exec)을 복사합니다.
 * 5. 브로슈어 웹앱의 [설정 > 구글 시트 연동]에 해당 웹 앱 URL을 등록하면
 *    웹에서 남긴 모든 방명록이 구글 시트 3번째 탭(방명록)에 즉시 자동 기록됩니다!
 */

// 3번째 탭 '방명록' 시트 안전 탐색 함수 (직접 실행 시에도 스프레드시트 자동 연결)
function getGuestbookSheet(ss) {
  if (!ss) {
    ss = SpreadsheetApp.getActiveSpreadsheet();
  }
  var sheet = ss.getSheetByName("방명록");
  if (sheet) return sheet;
  var allSheets = ss.getSheets();
  for (var s = 0; s < allSheets.length; s++) {
    var sName = allSheets[s].getName();
    if (sName.indexOf("방명록") !== -1 || sName.toLowerCase().indexOf("guestbook") !== -1) {
      return allSheets[s];
    }
  }
  // 3번째 탭 (인덱스 2) 반환
  if (allSheets.length >= 3) {
    return allSheets[2];
  }
  var newSheet = ss.insertSheet("방명록");
  newSheet.appendRow(["작성일시", "작성자(이름)", "축복의 메시지"]);
  newSheet.getRange(1, 1, 1, 3).setFontWeight("bold").setBackground("#dfba73").setFontColor("#2a1b0a");
  return newSheet;
}

// Apps Script 상단에서 [▶ 실행] 버튼을 눌러 테스트할 수 있는 진단 함수
function testRun() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var gbSheet = getGuestbookSheet(ss);
  Logger.log("연결된 스프레드시트 이름: " + ss.getName());
  Logger.log("방명록 탭 이름: " + gbSheet.getName());
  Logger.log("방명록 현재 등록된 행 수: " + gbSheet.getLastRow());
  Logger.log("현재 날짜 포맷 테스트: " + formatDate());
  Logger.log("★ 성공: 구글 시트 및 방명록 탭이 완벽하게 연결되었습니다.");
  Logger.log("★ 이제 우측 상단 [배포 > 새 배포 > 웹 앱 (액세스 권한: 모든 사용자)]으로 배포하시면 됩니다.");
}

// 1. 구글 시트 -> 브로슈어 웹앱 데이터 불러오기 및 방명록 실시간 등록 (GET)
function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var param = (e && e.parameter) ? e.parameter : {};

    // 1-1. 단일 방명록 실시간 작성 요청 처리 (?action=add_guestbook)
    if (param.action === "add_guestbook" || param.action === "guestbook") {
      var name = String(param.name || "익명의 성도").trim();
      var message = String(param.message || "").trim();
      var createdAt = String(param.createdAt || formatDate(new Date())).trim();

      if (message) {
        var gbSheet = getGuestbookSheet(ss);
        if (gbSheet.getLastRow() === 0) {
          gbSheet.appendRow(["작성일시", "작성자(이름)", "축복의 메시지"]);
          gbSheet.getRange(1, 1, 1, 3).setFontWeight("bold").setBackground("#dfba73").setFontColor("#2a1b0a");
        }
        gbSheet.appendRow([createdAt, name, message]);
      }

      var gbResult = {
        status: "success",
        message: "방명록이 구글 시트 3번째 탭(방명록)에 성공적으로 등록되었습니다.",
        entry: { name: name, message: message, createdAt: createdAt }
      };

      if (param.callback) {
        return ContentService.createTextOutput(param.callback + "(" + JSON.stringify(gbResult) + ");")
          .setMimeType(ContentService.MimeType.JAVASCRIPT);
      }
      return createJsonResponse(gbResult);
    }

    // 1-2. 행사 순서 시트 읽기 (1번째 탭)
    var sheet = ss.getSheetByName("행사순서") || ss.getSheetByName("행사 순서") || ss.getSheetByName("순서") || ss.getSheetByName("Program") || ss.getSheets()[0];
    var data = sheet ? sheet.getDataRange().getValues() : [];
    var items = [];

    if (data.length > 1) {
      var headerRow = data[0].map(function(h) { 
        return String(h || "").trim().toLowerCase().replace(/\s+/g, ""); 
      });

      function findColIndex(keywords, defaultIndex) {
        for (var k = 0; k < keywords.length; k++) {
          var kw = keywords[k].toLowerCase();
          for (var col = 0; col < headerRow.length; col++) {
            if (headerRow[col].indexOf(kw) !== -1) {
              return col;
            }
          }
        }
        return (defaultIndex < headerRow.length) ? defaultIndex : -1;
      }

      var colOrder = findColIndex(["순서", "order", "번호", "no"], 0);
      var colAct = findColIndex(["악장", "act", "파트", "part", "구분"], 1);
      var colTitle = findColIndex(["곡명", "제목", "song", "title", "찬양"], 2);
      var colTheme = findColIndex(["테마", "theme", "소제목", "주제"], 3);
      var colScripture = findColIndex(["성경", "말씀", "scripture"], 4);
      var colPerformer = findColIndex(["출연", "찬양자", "performer", "연주"], 5);
      var colImage = findColIndex(["사진url", "imageurl", "사진링크", "이미지", "사진"], 6);
      var colCaption = findColIndex(["사진설명", "caption", "설명글", "캡션"], 7);
      var colLyrics = findColIndex(["가사", "lyrics", "글귀", "본문"], 8);
      var colCommentary = findColIndex(["곡해설", "해설", "commentary", "묵상", "곡설명"], 9);
      var colDuration = findColIndex(["연주시간", "시간", "duration", "소요시간"], 10);

      var rows = data.slice(1);
      for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        var hasContent = row.some(function(cell) {
          return String(cell || "").trim().length > 0;
        });
        if (!hasContent) continue; // 완전히 빈 행 건너뛰기

        var rawOrder = colOrder !== -1 ? String(row[colOrder] || "").replace(/[^0-9]/g, "") : "";
        var orderNum = rawOrder ? parseInt(rawOrder, 10) : (i + 1);

        items.push({
          id: "prog-sheet-" + (i + 1),
          order: isNaN(orderNum) ? (i + 1) : orderNum,
          actTitle: String((colAct !== -1 ? row[colAct] : "") || ("Part " + (i + 1))).trim(),
          songTitle: String((colTitle !== -1 ? row[colTitle] : "") || ("찬양 " + (i + 1))).trim(),
          theme: String((colTheme !== -1 ? row[colTheme] : "") || "").trim(),
          scripture: String((colScripture !== -1 ? row[colScripture] : "") || "").trim(),
          performer: String((colPerformer !== -1 ? row[colPerformer] : "") || "").trim(),
          imageUrl: String((colImage !== -1 && String(row[colImage] || "").indexOf("http") === 0 ? row[colImage] : "") || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80").trim(),
          imageCaption: String((colCaption !== -1 ? row[colCaption] : "") || "").trim(),
          lyrics: String((colLyrics !== -1 ? row[colLyrics] : "") || "").trim(),
          commentary: String((colCommentary !== -1 ? row[colCommentary] : "") || "").trim(),
          duration: String((colDuration !== -1 ? row[colDuration] : "") || "").trim()
        });
      }

      items.sort(function(a, b) {
        return a.order - b.order;
      });
    }

    // 1-3. 행사 정보(메타데이터) 시트 읽기 (2번째 탭)
    var metaSheet = ss.getSheetByName("행사정보") || ss.getSheetByName("행사 정보") || (ss.getSheets().length >= 2 ? ss.getSheets()[1] : null);
    var metadata = {};
    if (metaSheet) {
      var metaData = metaSheet.getDataRange().getValues();
      for (var m = 1; m < metaData.length; m++) {
        var key = String(metaData[m][0] || '').trim();
        var val = String(metaData[m][1] || '').trim();
        if (key) metadata[key] = val;
      }
    }

    // 1-4. 방명록 시트 읽기 (3번째 탭)
    var guestbookSheet = getGuestbookSheet(ss);
    var guestbook = [];
    if (guestbookSheet) {
      var gbData = guestbookSheet.getDataRange().getValues();
      if (gbData.length > 1) {
        for (var g = 1; g < gbData.length; g++) {
          var gRow = gbData[g];
          var msg = String(gRow[2] || "").trim();
          var name = String(gRow[1] || "성도").trim();
          var rawDate = gRow[0];
          var dateStr = "";
          if (rawDate instanceof Date) {
            dateStr = formatDate(rawDate);
          } else {
            dateStr = String(rawDate || "").trim();
          }

          // 샘플 찌꺼기 데이터 자동 제외
          if (msg && 
              msg.indexOf("창조의 뜻을 묵상하는") === -1 && 
              msg.indexOf("첫 곡부터 눈물과 감격이") === -1 &&
              msg.indexOf("인생의 창조목적") === -1 &&
              msg.indexOf("귀한 찬양 콘서트에 함께할 수 있어") === -1) {
            guestbook.push({
              id: "gb-sheet-" + g,
              createdAt: dateStr,
              name: name || "익명의 성도",
              message: msg
            });
          }
        }
        // 최신 방명록이 위로 오도록 역순 정렬
        guestbook.reverse();
      }
    }

    var result = {
      status: "success",
      totalCount: items.length,
      syncedAt: new Date().toISOString(),
      items: items,
      metadata: Object.keys(metadata).length > 0 ? metadata : null,
      guestbook: guestbook
    };

    if (param.callback) {
      return ContentService
        .createTextOutput(param.callback + "(" + JSON.stringify(result) + ");")
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

// 2. 브로슈어 웹앱 -> 구글 시트로 방명록 실시간 작성 및 전체 데이터 저장 (POST)
function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var payload = {};
    
    if (e && e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (pErr) {
        payload = {};
      }
    } else if (e && e.parameter && e.parameter.data) {
      try {
        payload = JSON.parse(e.parameter.data);
      } catch (pErr) {
        payload = {};
      }
    }

    // 2-1. 단일 방명록 실시간 추가 요청 (action === 'add_guestbook')
    if (payload.action === "add_guestbook" || payload.action === "guestbook") {
      var entry = payload.entry || payload;
      var name = String(entry.name || "익명의 성도").trim();
      var message = String(entry.message || "").trim();
      var createdAt = String(entry.createdAt || formatDate(new Date())).trim();

      var gbSheet = getGuestbookSheet(ss);
      if (gbSheet.getLastRow() === 0) {
        gbSheet.appendRow(["작성일시", "작성자(이름)", "축복의 메시지"]);
        gbSheet.getRange(1, 1, 1, 3).setFontWeight("bold").setBackground("#dfba73").setFontColor("#2a1b0a");
      }

      if (message) {
        gbSheet.appendRow([createdAt, name, message]);
      }

      return createJsonResponse({
        status: "success",
        message: "방명록이 구글 시트 3번째 탭(방명록)에 성공적으로 등록되었습니다!",
        entry: { name: name, message: message, createdAt: createdAt }
      });
    }

    // 2-2. 관리자 전체 데이터 동기화 저장 (action === 'save')
    if (payload.action === "save") {
      var items = payload.items || [];
      var metadata = payload.metadata || {};
      var guestbook = payload.guestbook || [];

      // [1] 행사 순서 시트 업데이트 (1번째 탭) - items가 존재할 때만 덮어쓰기하여 데이터 손실 방지
      if (items && items.length > 0) {
        var sheet = ss.getSheetByName("행사순서") || ss.getSheetByName("행사 순서") || ss.getSheets()[0];
        if (!sheet) {
          sheet = ss.insertSheet("행사순서", 0);
        }
        sheet.clear();
        var headers = [
          ["순서", "악장구분", "곡명", "테마", "성경구절", "출연진", "사진URL", "사진설명", "가사글귀", "곡해설", "연주시간"]
        ];
        sheet.getRange(1, 1, 1, headers[0].length).setValues(headers)
          .setFontWeight("bold")
          .setBackground("#e8e4d8")
          .setFontColor("#2a1b0a");

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

    // [2] 행사 정보 시트 업데이트 (2번째 탭)
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

    // [3] 방명록 시트 업데이트 (3번째 탭)
    if (guestbook && guestbook.length > 0) {
      var gbSheet = getGuestbookSheet(ss);
      gbSheet.clear();
      gbSheet.getRange(1, 1, 1, 3).setValues([["작성일시", "작성자(이름)", "축복의 메시지"]])
        .setFontWeight("bold")
        .setBackground("#dfba73")
        .setFontColor("#2a1b0a");

      var gbRows = guestbook.map(function(ent) {
        return [
          ent.createdAt || "",
          ent.name || "",
          ent.message || ""
        ];
      });
      gbSheet.getRange(2, 1, gbRows.length, 3).setValues(gbRows);
    }

    return createJsonResponse({
      status: "success",
      message: "웹앱에서 수정한 모든 내용과 방명록이 구글 시트에 성공적으로 반영되었습니다!",
      savedAt: new Date().toISOString()
    });

  } catch (error) {
    return createJsonResponse({
      status: "error",
      message: "구글 시트 저장 중 오류가 발생했습니다: " + error.toString()
    });
  }
}

function formatDate(d) {
  if (!d || !(d instanceof Date) || isNaN(d.getTime())) {
    d = new Date();
  }
  var year = d.getFullYear();
  var month = ("0" + (d.getMonth() + 1)).slice(-2);
  var day = ("0" + d.getDate()).slice(-2);
  var hours = ("0" + d.getHours()).slice(-2);
  var minutes = ("0" + d.getMinutes()).slice(-2);
  return year + ". " + month + ". " + day + " " + hours + ":" + minutes;
}

function createJsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data || {}))
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

