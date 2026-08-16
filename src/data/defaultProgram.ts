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
      actTitle: "서곡 (Overture)",
      songTitle: "태초의 빛과 생명의 숨결 (Fiat Lux)",
      theme: "창조의 서막과 하나님의 영광",
      scripture: "창세기 1:1-3",
      performer: "헤리티지 심포니 오케스트라 & 파이프 오르간",
      imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80",
      imageCaption: "혼돈과 흑암 속에서 울려 퍼지는 첫 번째 창조의 빛",
      lyrics: `어둠을 가르고 울리는 거룩한 음성
"빛이 있으라" 하시매 온 우주가 깨어나고
바람과 파도, 별들의 노래가 시작되네
우리의 심장에 뛰는 창조주의 맥박을 느끼며.`,
      commentary: `장엄한 파이프 오르간의 저음과 현악기의 유려한 선율로 무(無)에서 유(有)로 피어나는 우주의 웅장한 창조를 묘사합니다. 우주 만물의 탄생을 통해 우리 존재의 근원을 묵상합니다.`,
      duration: "6:15"
    },
    {
      id: "prog-2",
      order: 2,
      actTitle: "제1악장 : 소명 (Vocation)",
      songTitle: "진흙 속에 불어넣은 생기",
      theme: "인간 창조와 지명하여 부르신 은혜",
      scripture: "이사야 43:1",
      performer: "솔로 바리톤 & 첼로 독주",
      imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80",
      imageCaption: "토기장이의 손길로 빚어낸 존귀한 생명",
      lyrics: `내가 너를 지명하여 불렀나니 너는 내 것이라
물 가운데로 지날 때에도 너와 함께하리니
보잘것없는 흙 한 줌에 담아주신 거룩한 형상
내 평생의 목적, 오직 당신의 영광을 노래함이라.`,
      commentary: `인간을 흙으로 빚으시고 그 코에 생기를 불어넣으신 하나님의 애틋한 사랑을 깊은 바리톤 솔로와 애수 어린 첼로로 표현한 곡입니다.`,
      duration: "5:40"
    },
    {
      id: "prog-3",
      order: 3,
      actTitle: "제2악장 : 연단 (Wilderness)",
      songTitle: "광야의 밤, 약속의 등불",
      theme: "침묵 속에서 빚어가시는 섭리",
      scripture: "신명기 8:2",
      performer: "어쿠스틱 앙상블 & 코러스",
      imageUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80",
      imageCaption: "거친 광야 길에서 오직 별빛과 구름기둥을 따르며",
      lyrics: `길이 보이지 않던 메마른 땅에서도
한 걸음마다 만나와 반석의 물을 내시며
나를 낮추시고 시험하사 마침내 복을 주려 하심이라
밤이 깊을수록 새벽별은 더욱 찬란히 빛나리.`,
      commentary: `고난과 연단의 시련조차 하나님의 거룩한 계획 속에서 우리를 정금같이 연단하시는 과정임을 감사의 고백으로 풀어냅니다.`,
      duration: "4:55"
    },
    {
      id: "prog-4",
      order: 4,
      actTitle: "제3악장 : 구속 (Redemption)",
      songTitle: "골고다 언덕의 운명적 사랑",
      theme: "십자가의 완성과 구원의 뜻",
      scripture: "요한복음 19:30",
      performer: "글로리아 콰이어 & 솔리스트",
      imageUrl: "https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=800&q=80",
      imageCaption: "세상을 구원하기 위해 지신 거룩한 희생의 십자가",
      lyrics: `다 이루었다 선포하신 그 거룩한 순종
찢기신 살과 흘리신 보혈로 화목을 이루셨네
창세 전부터 정해진 사랑의 운명
죽음을 이기시고 부활의 산 소망이 되셨네.`,
      commentary: `창조의 뜻이 궁극적으로 도달하는 십자가 구속의 절정. 콰이어의 웅장한 화성과 함께 감격스러운 은혜의 파도가 회중을 감쌉니다.`,
      duration: "7:10"
    },
    {
      id: "prog-5",
      order: 5,
      actTitle: "제4악장 : 헌신 (Consecration)",
      songTitle: "주의 손에 이끌리어 (Here Am I)",
      theme: "남은 생애를 바치는 결단의 찬양",
      scripture: "로마서 12:1",
      performer: "오케스트라 튜티 & 코러스",
      imageUrl: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=800&q=80",
      imageCaption: "거룩한 산 제물로 드리는 온전한 삶의 예배",
      lyrics: `주여 내가 여기 있나이다 나를 보내소서
세상의 헛된 영광 뒤로하고 주의 발자취 좇아가리니
나의 호흡이 다하는 그 순간까지
창조의 뜻을 온 세상에 전파하리라.`,
      commentary: `콘서트의 클라이맥스로, 구원받은 성도로서 세상 속에서 거룩한 청지기로 살아갈 것을 다짐하는 결단의 고백입니다.`,
      duration: "5:30"
    },
    {
      id: "prog-6",
      order: 6,
      actTitle: "피날레 (Finale & Doxology)",
      songTitle: "창조주를 향한 영원한 송축 (Hallelujah Chorus)",
      theme: "모든 만물의 영원한 찬송",
      scripture: "요한계시록 4:11",
      performer: "전 출연진 & 전 회중 다 함께",
      imageUrl: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80",
      imageCaption: "하늘과 땅이 하나 되어 올리는 영원한 찬양의 대합창",
      lyrics: `할렐루야 주 하나님 전능하신 이가 통치하시도다
영광과 존귀와 능력이 세세토록 무궁하시도다
만유의 주재시오 영원하신 왕께
영원무궁토록 찬양과 경배를 돌릴지어다!`,
      commentary: `모든 연주자와 회중이 기립하여 한목소리로 영원하신 창조주 하나님을 찬양하며 대단원의 막을 내립니다.`,
      duration: "6:45"
    }
  ]
};
