import { selfieContent } from './content.mjs';

// Keep image IDs, prices and session structure aligned with the original page.
const en = selfieContent.en;
export const koreanSelfie = {
  ...en,
  heroHeading: 'Aether(에테르) 셀프사진관\n부다페스트에서 나만의 사진을',
  heroSubheading: '원하는 순간을 직접 담아보세요',
  heroCopy: '부다페스트의 Aether 셀프사진관에서 프라이빗한 촬영을 즐겨보세요. 사진사 없이 리모컨으로 직접 촬영하며 여행의 추억을 편안하게 남겨보세요.',
  heroCta: '예약하기',
  processHeading: '셀프사진관 이용 방법',
  processSteps: [
    ['원하는 배경과 스타일을 선택하세요', 'process-01'],
    ['화면에서 구도를 확인하세요', 'process-02'],
    ['리모컨으로 촬영하세요', '(셔터를 누른 2초 후 촬영되므로 리모컨을 감출 수 있어요)', 'process-03'],
    ['촬영한 사진을 바로 확인하세요', 'process-04'],
    ['촬영한 사진 전체를 온라인으로 받아보세요', 'process-03']
  ],
  galleryHeading: '스튜디오에서 촬영한 사진',
  customizeHeading: '원하는 모습으로 촬영하세요',
  customizeCopy: 'Aether 셀프사진관에서는 배경과 조명, 사진 구도를 직접 선택할 수 있습니다. 편안한 공간에서 나만의 아이디어를 사진으로 만들어 보세요.',
  controls: [
    ['마음에 드는 배경 선택', ['그린 세트', '화이트', '그레이', '블랙', '라이트 블루', '오키드', '울트라마린', '옐로', '오렌지', '크림슨', '코랄', '베이지'], en.controls[0][2]],
    ['분위기에 맞는 조명 선택', ['무디', '렘브란트', '하이 패션', '블랙라이트'], en.controls[1][2]],
    ['원하는 사진 구도 선택', ['클로즈업', '허리 위', '전신'], en.controls[2][2]]
  ],
  benefitsHeading: 'Aether 셀프사진관을 선택하는 이유',
  benefitsIntro: '편안하게 촬영할 수 있도록 카메라와 조명, 다양한 소품을 준비했습니다.',
  benefits: [
    ['다양한 배경과 소품', '10가지가 넘는 배경과 다양한 가구, 소품을 이용할 수 있습니다.'],
    ['메이크업 공간과 탈의실', '메이크업 공간에서 촬영을 준비하세요. 헤어드라이어와 헤어스프레이도 준비되어 있습니다.'],
    ['전문 스튜디오 조명', '미리 세팅된 조명으로 편하게 촬영할 수 있습니다.'],
    ['리모컨으로 촬영', '손에 쏙 들어오는 리모컨으로 원하는 순간에 직접 셔터를 누를 수 있습니다.'],
    ['프라이빗한 공간', '촬영하는 동안 예약한 일행만 스튜디오 공간을 사용합니다.'],
    ['빠른 사진 전달', '촬영한 사진은 온라인으로 전달해 드립니다.']
  ],
  pricesHeading: '셀프사진관 가격',
  prices: en.prices.map(([, , price], index) => [
    ['미니 셀프 세션', '셀프 세션', '사진 보정'][index],
    index === 2 ? ['원하는 사진을 전문적으로 보정'] : ['1–6명', '촬영 횟수 무제한'],
    String(price).replace(/10\.990\./, '10,990').replace(/16\.990/, '16,990').replace('5000', '5,000').replace('/ 30 min', '/ 30분').replace('/ hour', '/ 60분').replace('/ photo', '/ 장')
  ]),
  reserveHeading: '셀프사진관 예약',
  reserveCopy: '부다페스트 현지 시간으로 원하는 촬영 시간을 선택하세요. 예약 요청은 이메일 확인 후 확정됩니다.',
  reserveCta: '예약하기',
  szegedHeading: '세게드 스튜디오도 만나보세요!',
  szegedCopy: '세게드의 미니 셀프사진관에서도 같은 가격으로 촬영할 수 있습니다.',
  szegedCta: '세게드 셀프사진관 (영어)'
};
