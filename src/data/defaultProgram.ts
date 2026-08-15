import { BrochureData } from '../types';

export const initialBrochureData: BrochureData = {
  metadata: {
    concertSubtitle: "JOSHUA JEONG_PRAISE CONCERT",
    concertTitle: "운명(運命): 창조의 뜻",
    themeQuote: "우리가 살아도 주를 위하여 살고 죽어도 주를 위하여 죽나니 (롬 14:8)",
    date: "2026. 09. 20 (SUN) PM 6:30",
    venue: "헤리티지 클래식 오디토리움 (Heritage Auditorium)",
    welcomeMessage: `창세 이전부터 예비하신 거룩한 섭리와 부르심 앞에 겸손히 섭니다. 
우리의 걸음과 호흡 하나하나가 우연이 아닌 ‘창조의 뚜렷한 뜻’이었음을 고백하며, 
클래식 선율과 깊은 영성의 찬양으로 빚어낸 이 거룩한 시간으로 여러분을 초대합니다.`,
    dedicationText: `기획·찬양: 정여호수아 (Joshua Jeong)\n오케스트레이션: 헤리티지 필하모닉\n합창: 글로리아 콰이어`
  },
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
      lyrics: `어둠을 가르고 울리는 거룩한 음성\n"빛이 있으라" 하시매 온 우주가 깨어나고\n바람과 파도, 별들의 노래가 시작되네\n우리의 심장에 뛰는 창조주의 맥박을 느끼며.`,
      commentary: `장엄한 파이프 오르간의 저음과 현악기의 유려한 선율로 무(無)에서 유(有)로 피어나는 우주의 웅장한 창조를 묘사합니다. 우주 만물의 탄생을 통해 우리 존재의 근원을 묵상합니다.`,
      duration: "06:15"
    },
    {
      id: "prog-2",
      order: 2,
      actTitle: "제1악장 : 소명 (Vocation)",
      songTitle: "진흙 속에 불어넣은 생기",
      theme: "인간 창조와 지명하여 부르신 은혜",
      scripture: "이사야 43:1",
      performer: "정여호수아 (Solo Baritone) & 첼로 독주",
      imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80",
      imageCaption: "토기장이의 손길로 빚어낸 존귀한 생명",
      lyrics: `내가 너를 지명하여 불렀나니 너는 내 것이라\n물 가운데로 지날 때에도 너와 함께하리니\n보잘것없는 흙 한 줌에 담아주신 거룩한 형상\n내 평생의 목적, 오직 당신의 영광을 노래함이라.`,
      commentary: `인간을 흙으로 빚으시고 그 코에 생기를 불어넣으신 하나님의 애틋한 사랑을 깊은 바리톤 솔로와 애수 어린 첼로로 표현한 곡입니다.`,
      duration: "05:40"
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
      lyrics: `길이 보이지 않던 메마른 땅에서도\n한 걸음마다 만나와 반석의 물을 내시며\n나를 낮추시고 시험하사 마침내 복을 주려 하심이라\n밤이 깊을수록 새벽별은 더욱 찬란히 빛나리.`,
      commentary: `고난과 연단의 시련조차 하나님의 거룩한 계획 속에서 우리를 정금같이 연단하시는 과정임을 감사의 고백으로 풀어냅니다.`,
      duration: "04:55"
    },
    {
      id: "prog-4",
      order: 4,
      actTitle: "제3악장 : 구속 (Redemption)",
      songTitle: "골고다 언덕의 운명적 사랑",
      theme: "십자가의 완성과 구원의 뜻",
      scripture: "요한복음 19:30",
      performer: "정여호수아 & 글로리아 콰이어",
      imageUrl: "https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=800&q=80",
      imageCaption: "세상을 구원하기 위해 지신 거룩한 희생의 십자가",
      lyrics: `다 이루었다 선포하신 그 거룩한 순종\n찢기신 살과 흘리신 보혈로 화목을 이루셨네\n창세 전부터 정해진 사랑의 운명\n죽음을 이기시고 부활의 산 소망이 되셨네.`,
      commentary: `창조의 뜻이 궁극적으로 도달하는 십자가 구속의 절정. 콰이어의 웅장한 화성과 함께 감격스러운 은혜의 파도가 회중을 감쌉니다.`,
      duration: "07:10"
    },
    {
      id: "prog-5",
      order: 5,
      actTitle: "제4악장 : 헌신 (Consecration)",
      songTitle: "주의 손에 이끌리어 (Here Am I)",
      theme: "남은 생애를 바치는 결단의 찬양",
      scripture: "로마서 12:1",
      performer: "정여호수아 & 오케스트라 튜티",
      imageUrl: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=800&q=80",
      imageCaption: "거룩한 산 제물로 드리는 온전한 삶의 예배",
      lyrics: `주여 내가 여기 있나이다 나를 보내소서\n세상의 헛된 영광 뒤로하고 주의 발자취 좇아가리니\n나의 호흡이 다하는 그 순간까지\n창조의 뜻을 온 세상에 전파하리라.`,
      commentary: `콘서트의 클라이맥스로, 구원받은 성도로서 세상 속에서 거룩한 청지기로 살아갈 것을 다짐하는 결단의 고백입니다.`,
      duration: "05:30"
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
      lyrics: `할렐루야 주 하나님 전능하신 이가 통치하시도다\n영광과 존귀와 능력이 세세토록 무궁하시도다\n만유의 주재시오 영원하신 왕께\n영원무궁토록 찬양과 경배를 돌릴지어다!`,
      commentary: `모든 연주자와 회중이 기립하여 한목소리로 영원하신 창조주 하나님을 찬양하며 대단원의 막을 내립니다.`,
      duration: "06:45"
    }
  ]
};
