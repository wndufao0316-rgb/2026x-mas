import { BrochureData } from '../types';

export const initialBrochureData: BrochureData = {
  googleSheetUrl: "https://docs.google.com/spreadsheets/d/1Dzu4WZ9qJa4Eq_RYQI2dM6xIFEdlzlTmPQ0UT-TJh70/edit?usp=sharing",
  metadata: {
    concertSubtitle: "JOSHUA JEONG_PRAISE CONCERT",
    concertTitle: "운명(運命):\n창조의 뜻",
    themeQuote: "우리가 살아도 주를 위하여 살고 죽어도 주를 위하여 죽나니 (롬 14:8)",
    date: "2026. 09. 20 (SUN) PM 6:30",
    venue: "헤리티지 클래식 오디토리움 (Heritage Auditorium)",
    welcomeHeading: "초대의 글",
    welcomeSubtitle: "Invocation & Welcome",
    welcomeDedicationHeader: '"운명(運命): 창조의 뜻"에 부쳐',
    welcomeMessage: `창세 이전부터 예비하신 거룩한 섭리와 부르심 앞에 겸손히 섭니다. 
우리의 걸음과 호흡 하나하나가 우연이 아닌 ‘창조의 뚜렷한 뜻’이었음을 고백하며, 
클래식 선율과 깊은 영성의 찬양으로 빚어낸 이 거룩한 시간으로 여러분을 초대합니다.

어둠 속에서 빛을 부르신 그 첫 음성처럼, 
오늘 울려 퍼지는 찬양이 우리 삶의 방향을 비추고 
메마른 심령에 생수의 강을 흘려보내는 은혜의 축복이 되기를 간절히 기도합니다.`,
    
    welcomePage2Heading: "초대의 글",
    welcomePage2Subtitle: "Reflection & Vision",
    welcomePage2DedicationHeader: "은혜의 여정을 함께 걷는 모든 분들께",
    welcomePage2ImageUrl: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80",
    welcomePage2ImageCaption: "아름다운 선율과 기도가 머무는 거룩한 찬양의 처소",
    welcomePage2Message: `함께 모여 같은 마음으로 주를 바라보는 이 자리가 
우리에게 가장 큰 위로와 기쁨이 됩니다. 
무대 위의 선율과 회중의 기도가 하나 되어 
하늘 보좌에 상달되는 영원한 감사의 고백이 되기를 소망합니다.`,

    dedicationText: `오케스트레이션: 헤리티지 필하모닉\n합창: 글로리아 콰이어\n기획 및 총괄: 헤리티지 프레이즈 위원회`
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
      actTitle: "part 1.",
      songTitle: "Part 1. 창조",
      theme: "태초에 하나님의 말씀이 있었으니",
      scripture: "창세기 1:1",
      performer: "영상",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/2/29/The_Creation_of_Adam_perspective_fix.jpg?utm_source=ko.wikipedia.org&utm_campaign=index&utm_content=original",
      imageCaption: "미켈란젤로 천지창조",
      lyrics: `태초에 하나님 말씀으로 천지를 창조하셨습니다.\n“빛이 있으라!” 하시니 빛이 있었고,\n“궁창이 있어 물과 물로 나뉘라” 하시어 하늘을 창조하셨으며,\n“땅과 물을 나뉘어 땅엔 식물들이 있으라.” 하시니 채소 열매 맺는 나무가,\n“해와 달과 별들을 창조”하셔 계절과 시간을 알 수 있게 하셨다.\n다섯 번째 날에는 “바다에 물고기, 하늘에는 새들”을 창조하셨으며,\n“땅에 모든 동물들을 창조, 자기 형상대로 남자 여자를 창조”하시고 만물을 주관하고 다스려라! 하시며 천지창조를 마치시고 거룩하고 복 되게 하시며 안식 하셨다.`,
      commentary: `♬메인 곡명 : 천지창조`,
      duration: "5:00"
    },
    {
      id: "prog-2",
      order: 2,
      actTitle: "part 2.",
      songTitle: "Part 2. 인생, 문제의 연속",
      theme: "나의 운명은 정해져 있는 걸까?",
      scripture: "-",
      performer: "드라마",
      imageUrl: "https://v1.padlet.pics/1/image.webp?t=c_limit%2Cdpr_2%2Ch_975%2Cw_975&url=https%3A%2F%2Fpadlet-artifacts.storage.googleapis.com%2F42298654b1115a557fbb8f2d23cda8ae1a5f17d2%2Fcc0be69a7f4d5eff276360d5ef831012-h-b038cad86043d91a1ffe1bee651b9bf1.png",
      imageCaption: "인생, 문제의 연속",
      lyrics: `누구나 한 번쯤 문득 멈춰 서서 묻게 됩니다.\n‘정말 사람의 운명은 정해져 있는 걸까?’, ‘내 인생은 어디로 향하고 있을까…’\n남들처럼 평범하게 살고 싶었을 뿐인데, 돌아보면 늘 '흘러가는 대로' 살아온 날들에 씁쓸한 후회가 남습니다. 또한 열심히 살았다고 생각했는데 어느 순간 밀려오는 공허함은 SNS 속 반짝이는 타인의 행복을 볼 때마다 내 삶의 무게는 더욱 무겁게만 느껴집니다.\n인생, 희로애락의 연속이라지만\n우리에게 허락된 삶은 기쁨과 즐거움보다 슬픔과 노여움이 더 잦았던 것 같습니다.\n불안하고, 흔들리고, 때로는 숨이 턱끝까지 차오르는 날들.\n하지만 그 무거운 마음 뒤에는 간절한 소망이 숨어 있습니다.\n‘이렇게 살고 싶지 않다. 내 삶을 가치 있게 가꾸고 싶다.’ 고. \n여기,\n지친 마음을 다잡고, 삶의 진짜 의미를 찾아 한 걸음 내딛으려는 사람들의 이야기가 지금 시작됩니다.`,
      commentary: `▶드라마 출연진\n강한나役 : 이영숙\n김석진役 : 박재범\n김태형役 : 이지훈\n김태민役 : 이선근`,
      duration: "7:00"
    },
    {
      id: "prog-3",
      order: 3,
      actTitle: "part 3.",
      songTitle: "Part 3. 인생, 그 해답의 열쇠",
      theme: "주가 답이다",
      scripture: "눅5:1~11/요4:3~26",
      performer: "연극",
      imageUrl: "https://v1.padlet.pics/3/image.webp?t=c_limit%2Cdpr_2%2Ch_858%2Cw_1528&url=https%3A%2F%2Fu1.padletusercontent.com%2Fuploads%2Fpadlet-uploads-usc1%2F3595956822%2Ff7076eb826a9de1e135ed7f64179cee3%2F_______.jpg%3Fexpiry_token%3D5WaHZRdGG3LkUVQGy3SZ-zdRtq89aJeottSBaF_Hii8dmxJqYDvE2-MDbblcM-ZrVekXW99RReKkJFIoMoKio3NJ0jCaoHwy2GIar5z9BT9aWvld3VWLKlbKfrsBtskwOAJQ-2ZYThjxMRZRbz4_DbyjG1gsw_035kU6y-u9c_LmS7uw-psgo5gVp6QV2w7clRaSj1ct3BVivLQUIAreyA%3D%3D",
      imageCaption: "기록된 찬양과 묵상의 순간",
      lyrics: `♬메인 곡명 : 주가 답이다`,
      commentary: `▶ 베드로 이야기 출연진\n예수님 役\n베드로 役\n요한 役\n안드레 役\n야고보 役\n앙상블\n♬ 생명 길을 찾았네\n▶ 사마리아 여인 이야기 출연진\n예수님 役\n사마리아 여인 役\n앙상블\n♬ 주를 알았네`,
      duration: "25:00"
    },
    {
      id: "prog-4",
      order: 4,
      actTitle: "part 4.",
      songTitle: "인생, 창조. 그 목적",
      theme: "창조의 목적을 이루는 사랑",
      scripture: "창세기 1:26",
      performer: "챔버 합창단",
      imageUrl: "https://v1.padlet.pics/1/image.webp?t=c_limit%2Cdpr_2%2Ch_975%2Cw_975&url=https%3A%2F%2Fpadlet-artifacts.storage.googleapis.com%2F197296600b2e75724a7870b17614f13e78e2b2cd%2F3354ce8b46d6336fcafa7c9780df6760-h-334ca637d0fe42d325e0270fdcefe60b.png",
      imageCaption: "기록된 찬양과 묵상의 순간",
      lyrics: `♬메인 곡명 : 창조의 목적을 이루는 사랑`,
      commentary: `말씀 주제 : `,
      duration: "25:00"
    },
    {
      id: "prog-5",
      order: 5,
      actTitle: "part 5.",
      songTitle: "END, AND",
      theme: "나의 운명이 정해져 있을까?",
      scripture: "-",
      performer: "영상",
      imageUrl: "https://v1.padlet.pics/1/image.webp?t=c_limit%2Cdpr_2%2Ch_975%2Cw_975&url=https%3A%2F%2Fpadlet-artifacts.storage.googleapis.com%2F128d528fe41131dce98f3bad95df7b039d04fb45%2F4f5a2a010fb48af998f172ad1318d53b-h-23b07c53106e6d0e1db639c05d66a4d6.png",
      imageCaption: "인생은 두 갈래 길이 있다",
      lyrics: `‘운명(運命)’.\n모든 것이 미리 정해져 있다는 그 차가운 단어 뒤에는,\n움직일 운(運), 목숨 명(命)이라는 가슴 뛰는 진실이 숨겨져 있습니다.\n인간을 지배하는 절대적인 힘으로만 여겨졌던 굴레가 아니라, 우리의 의지와 노력으로 흐름을 바꾸고 새롭게 빚어낼 수 있는 거룩한 기회입니다.\n그리고 그 기적은 멀리 있지 않습니다.`,
      commentary: ``,
      duration: "5:00"
    },
    {
      id: "prog-6",
      order: 6,
      actTitle: "part 6.",
      songTitle: "함께, 화동",
      theme: "전체 영광",
      scripture: "시편 150:6",
      performer: "찬양단&전체",
      imageUrl: "https://v1.padlet.pics/1/image.webp?t=c_limit%2Cdpr_2%2Ch_975%2Cw_975&url=https%3A%2F%2Fpadlet-artifacts.storage.googleapis.com%2Fc50de8d5349e91619b77bc093b3a37ba68c121e3%2F6dd4a24503c3f7146cd2b2a43ab6c8b6-h-16fadccf7cf33a0518e80a62851f6831.png",
      imageCaption: "기록된 찬양과 묵상의 순간",
      lyrics: `♬사랑의 목적을 이루었네`,
      commentary: `♬기쁘다 구주 오셨네_전체 영광\n*전체 기립 해주세요\n▶ 레크레이션\n- 감사트리 쓰기\n- 사연 추첨 및 발표\n▶ 합심 기도 및 목회자 축복 기도\n▶ ending 영상\n▶ 사진 촬영`,
      duration: "30:00"
    }
  ]
};
