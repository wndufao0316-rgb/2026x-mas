import { BrochureData } from '../types';

export const initialBrochureData: BrochureData = {
  googleSheetUrl: "https://docs.google.com/spreadsheets/d/1Dzu4WZ9qJa4Eq_RYQI2dM6xIFEdlzlTmPQ0UT-TJh70/edit?usp=sharing",
  metadata: {
    concertSubtitle: "JOSHUA JEONG_PRAISE CONCERT",
    concertTitle: "운명(運命):\n창조의 뜻",
    themeQuote: "우리가 살아도 주를 위하여 살고 죽어도 주를 위하여 죽나니 (롬 14:8)",
    date: "2026. 09. 20 (SUN) PM 6:30",
    venue: "헤리티지 클래식 오디토리움 (Heritage Auditorium)",
    
    // Page 1: 들어가는 말 (PROLOG - 사진 및 그림 해설)
    welcomePage2Heading: "들어가는 말",
    welcomePage2Subtitle: "PROLOG",
    welcomePage2DedicationHeader: '"우리의 운명은 정해져 있을까요?"',
    welcomePage2ImageUrl: "https://mblogthumb-phinf.pstatic.net/MjAxOTA0MDVfMjgw/MDAxNTU0NDU1NTIwODg4.qVBjRmk5GNgqOdJW9ZSZPwG4nG5zsqN2js40KPtL5Vkg.kgfdR2_MUAZ7zGVDl0tUS6MxFyQaDpMM0sPuJqXZgFQg.JPEG.cityofgold316/%EC%A0%95%EB%AA%85%EC%84%9D_%EA%B7%B8%EB%A6%BC_%EC%9A%B4%EB%AA%85.jpg?type=w800",
    welcomePage2ImageCaption: "2011년 아르헨티나 국제 아트 페어 대표작 '운명'",
    welcomePage2Message: `희로애락이 반복되는 인생이라지만,
어쩐지 기쁨보다는 슬픔과 불안, 허무함이 더 자주 찾아오는 것 같았습니다.
'이게 정말로 인생일까? 살아있으니 그저 되는 대로 사는 것이 정말 내 운명일까?' 하는 깊은 질문에서 오늘 이 자리가 시작되었습니다.

위의 작품을 한번 보실까요?
아르헨티나 세계 아트 페어 수상작인 회화, <운명>입니다.

벼랑 끝에 선 달팽이 한 마리와 그를 노리는 황새가 보입니다.
황새의 눈에는 이 달팽이가 그저 한 끼 식사일 뿐입니다.
'콕 찍으면 끝난다' 하며 비웃고 있죠. 달팽이의 걸음은 황새 앞에서는 초침 앞에 시침처럼 아득히 느립니다.
객관적으로 보면 완벽한 절망이지요.
하지만 달팽이는 말합니다.
'나는 산다.'
황새의 강한 먹선 밑으로, 죽음에 굴하지 않는 달팽이의 슬프지만 강인한 의지가 보이시나요? 마치 베토벤의 '운명' 교향곡이 시각화된 것처럼 말이죠.

이 작품의 달팽이처럼, 우리네 인생도 마찬가지라고 생각됩니다.
단순히 주어진 운명에 굴복하는 것이 아니라, 포기하지 않고 '나' 본연의 의미를 찾아 나아가는 것.

그 참된 의미를 찾아가는 여정에 여러분을 초대합니다.`,
    
    // Page 2: 작곡가 소개 (INTRODUCTION - 본문 소개글)
    welcomeHeading: "작곡가",
    welcomeSubtitle: "INTRODUCTION",
    welcomeDedicationHeader: "JOSHUA JEONG",
    welcomeMessage: `작곡가 JOSHUA JEONG은 9세부터 인생의 곤고함과 허무함을 느끼며 신앙생활을 시작하였습니다.
하나님과 예수님을 최우선 순위로 사랑하며 모시고 섬기는 것을 낙으로 삼고 성장하였고, 신앙이 깊어질 수록 예수님에 대한 사랑은 커져만 갔고 그를 만나고자하는 마음은 깊어만 갔습니다. 21년간 밤낮으로 산 기도를 하였고 전도를 하며 아픈 자들을 위해 기도해주고, 동네 미친 사람을 데려다 밥을 주며 살뜰하게 보살피며 예수님의 마음과 삶을 실천하고자 몸부림친 청년기를 지나 인생의 창조 목적 그 뜻을 깨달은 후 창조자께 작곡/작사/노래 하며 영광돌리셨습니다.
신앙이 곧 삶이 된 JOSHUA JEONG을 여러분께 소개합니다.`,

    dedicationText: `오케스트레이션: 헤리티지 필하모닉\n합창: 글로리아 콰이어\n기획 및 총괄: 헤리티지 프레이즈 위원회`,

    // Page 3: 행사 순서 (Event Schedule)
    tocHeading: "행사 순서",
    tocSubtitle: "Event Schedule"
  },
  guestbook: [
    {
      id: "gb-1",
      name: "김하늘",
      message: "창조의 뜻을 묵상하는 귀한 찬양 콘서트에 함께할 수 있어 큰 은혜입니다. 진심으로 축복합니다!",
      createdAt: "2026. 09. 20 18:40"
    },
    {
      id: "gb-2",
      name: "이은혜",
      message: "첫 곡부터 눈물과 감격이 넘칩니다. 모든 순서마다 하나님의 임재가 가득하길 기도합니다.",
      createdAt: "2026. 09. 20 18:55"
    }
  ],
  items: [
    {
      id: "prog-1",
      order: 1,
      actTitle: "제1장",
      songTitle: "Part 1. 창조",
      theme: "태초에 하나님의 말씀이 있었으니",
      scripture: "창세기 1:1-3",
      performer: "영상",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/2/29/The_Creation_of_Adam_perspective_fix.jpg?utm_source=ko.wikipedia.org&utm_campaign=index&utm_content=original",
      imageCaption: "천지창조",
      lyrics: "♬메인 테마곡 : 천지창조",
      commentary: `태초에 하나님 말씀으로 천지를 창조하셨습니다.
“빛이 있으라!” 하시니 빛이 있었고,
“궁창이 있어 물과 물로 나뉘라” 하시어 하늘을 창조하셨으며,
“땅과 물을 나뉘어 땅엔 식물들이 있으라.” 하시니 채소 열매 맺는 나무가,
“해와 달과 별들을 창조”하셔 계절과 시간을 알 수 있게 하셨다.
다섯 번째 날에는 “바다에 물고기, 하늘에는 새들”을 창조하셨으며,
“땅에 모든 동물들을 창조, 자기 형상대로 남자 여자를 창조”하시고 만물을 주관하고 다스려라! 하시며 천지창조를 마치시고 거룩하고 복 되게 하시며 안식 하셨다.`,
      duration: "5:00"
    },
    {
      id: "prog-2",
      order: 2,
      actTitle: "제2장",
      songTitle: "Part 2. 인생, 문제의 연속",
      theme: "나의 운명은 정해져 있는 걸까?",
      scripture: "-",
      performer: "드라마",
      imageUrl: "https://v1.padlet.pics/1/image.webp?t=c_limit%2Cdpr_2%2Ch_975%2Cw_975&url=https%3A%2F%2Fpadlet-artifacts.storage.googleapis.com%2F42298654b1115a557fbb8f2d23cda8ae1a5f17d2%2Fcc0be69a7f4d5eff276360d5ef831012-h-b038cad86043d91a1ffe1bee651b9bf1.png",
      imageCaption: "인생, 문제의 연속",
      lyrics: "-",
      commentary: `누구나 한 번쯤 문득 멈춰 서서 묻게 됩니다.
‘정말 사람의 운명은 정해져 있는 걸까?’, ‘내 인생은 어디로 향하고 있을까…’
남들처럼 평범하게 살고 싶었을 뿐인데, 돌아보면 늘 '흘러가는 대로' 살아온 날들에 씁쓸한 후회가 남습니다. 또한 열심히 살았다고 생각했는데 어느 순간 밀려오는 공허함은 SNS 속 반짝이는 타인의 행복을 볼 때마다 내 삶의 무게는 더욱 무겁게만 느껴집니다.

인생, 희로애락의 연속이라지만
우리에게 허락된 삶은 기쁨과 즐거움보다 슬픔과 노여움이 더 잦았던 것 같습니다.
불안하고, 흔들리고, 때로는 숨이 턱끝까지 차오르는 날들.

하지만 그 무거운 마음 뒤에는 간절한 소망이 숨어 있습니다.
‘이렇게 살고 싶지 않다. 내 삶을 가치 있게 가꾸고 싶다.’ 고.

여기,
지친 마음을 다잡고, 삶의 진짜 의미를 찾아 한 걸음 내딛으려는 사람들의 이야기가 지금 시작됩니다.`,
      duration: "7:00"
    },
    {
      id: "prog-3",
      order: 3,
      actTitle: "제3장",
      songTitle: "Part 3. 인생, 그 해답의 열쇠",
      theme: "주가 답이다",
      scripture: "누가복음5:1~11/요한복음4:3~26",
      performer: "연극",
      imageUrl: "https://v1.padlet.pics/3/image.webp?t=c_limit%2Cdpr_2%2Ch_858%2Cw_1528&url=https%3A%2F%2Fu1.padletusercontent.com%2Fuploads%2Fpadlet-uploads-usc1%2F3595956822%2Ff7076eb826a9de1e135ed7f64179cee3%2F_______.jpg%3Fexpiry_token%3D5WaHZRdGG3LkUVQGy3SZ-zdRtq89aJeottSBaF_Hii8dmxJqYDvE2-MDbblcM-ZrVekXW99RReKkJFIoMoKio3NJ0jCaoHwy2GIar5z9BT9aWvld3VWLKlbKfrsBtskwOAJQ-2ZYThjxMRZRbz4_DbyjG1gsw_035kU6y-u9c_LmS7uw-psgo5gVp6QV2w7clRaSj1ct3BVivLQUIAreyA%3D%3D",
      imageCaption: "베드로와 사마리아 여인",
      lyrics: "♬메인 테마곡 : 주가 답이다",
      commentary: `-베드로 이야기
♬ 생명 길을 찾았네
♬ 사랑은 휴거다

-사마리아 여인
♬ 주를 알았네`,
      duration: "25:00"
    },
    {
      id: "prog-4",
      order: 4,
      actTitle: "제4장",
      songTitle: "Part 4. 인생, 창조 그 목적",
      theme: "창조의 목적을 이루는 사랑",
      scripture: "창세기1:26",
      performer: "챔버 합차단",
      imageUrl: "https://v1.padlet.pics/1/image.webp?t=c_limit%2Cdpr_2%2Ch_975%2Cw_975&url=https%3A%2F%2Fpadlet-artifacts.storage.googleapis.com%2F197296600b2e75724a7870b17614f13e78e2b2cd%2F3354ce8b46d6336fcafa7c9780df6760-h-334ca637d0fe42d325e0270fdcefe60b.png",
      imageCaption: "인생, 창조 그 목적",
      lyrics: "♬메인 테마곡 : 창조의 목적을 이루는 사랑",
      commentary: "말씀 주제 :",
      duration: "25:00"
    },
    {
      id: "prog-5",
      order: 5,
      actTitle: "제5장",
      songTitle: "Part 5. END, AND",
      theme: "나의 운명이 정해져 있을까?",
      scripture: "-",
      performer: "영상",
      imageUrl: "https://v1.padlet.pics/1/image.webp?t=c_limit%2Cdpr_2%2Ch_975%2Cw_975&url=https%3A%2F%2Fpadlet-artifacts.storage.googleapis.com%2F128d528fe41131dce98f3bad95df7b039d04fb45%2F4f5a2a010fb48af998f172ad1318d53b-h-23b07c53106e6d0e1db639c05d66a4d6.png",
      imageCaption: "인생은 두 갈래 길이 있다",
      lyrics: "-",
      commentary: `‘운명(運命)’.
모든 것이 미리 정해져 있다는 그 차가운 단어 뒤에는,
움직일 운(運), 목숨 명(命)이라는 가슴 뛰는 진실이 숨겨져 있습니다.
인간을 지배하는 절대적인 힘으로만 여겨졌던 굴레가 아니라, 우리의 의지와 노력으로 흐름을 바꾸고 새롭게 빚어낼 수 있는 거룩한 기회입니다.
그리고 그 기적은 멀리 있지 않습니다.`,
      duration: "5:00"
    },
    {
      id: "prog-6",
      order: 6,
      actTitle: "제6장",
      songTitle: "Part 6. 화동",
      theme: "전체 영광",
      scripture: "시편150:6",
      performer: "찬양단&전체",
      imageUrl: "https://v1.padlet.pics/1/image.webp?t=c_limit%2Cdpr_2%2Ch_975%2Cw_975&url=https%3A%2F%2Fpadlet-artifacts.storage.googleapis.com%2Fc50de8d5349e91619b77bc093b3a37ba68c121e3%2F6dd4a24503c3f7146cd2b2a43ab6c8b6-h-16fadccf7cf33a0518e80a62851f6831.png",
      imageCaption: "기쁨의 영광",
      lyrics: "♬사랑의 목적을 이루었네",
      commentary: `♬기쁘다 구주 오셨네_전체 영광
*전체 기립 해주세요

▶ 레크레이션
- 감사트리 쓰기
- 사연 추첨 및 발표

▶ 합심 기도 및 목회자 축복 기도
▶ ending 영상
▶ 사진 촬영`,
      duration: "40:00"
    }
  ]
};
