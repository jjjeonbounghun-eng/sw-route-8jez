// 스위스 자유여행 동선 데이터 — 화면(index.html)과 오프라인 저장(sw.js)이 같이 읽는다
// 시각은 2026-10 search.ch·SBB 조회값. 출발 1주 전 SBB 앱으로 다시 확인.
(function (g) {
  var W = 'https://upload.wikimedia.org/wikipedia/commons/';
  function wm(path, by, lic) {
    var file = path.split('/').pop();
    return { src: W + 'thumb/' + path + '/960px-' + file, by: by, lic: lic,
             page: 'https://commons.wikimedia.org/wiki/File:' + decodeURIComponent(file) };
  }
  function sat(bbox) {
    return { src: 'https://wms.geo.admin.ch/?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=ch.swisstopo.swissimage&STYLES=&CRS=EPSG:2056&BBOX=' + bbox + '&WIDTH=960&HEIGHT=600&FORMAT=image/jpeg',
             by: 'swisstopo', lic: '항공사진 SWISSIMAGE', page: 'https://www.swisstopo.admin.ch', sat: true };
  }

  var IMG = {
    camp:   wm('9/96/Couvent_de_la_Tourette_-_9.JPG', 'Camster', 'CC BY-SA 3.0'),
    pav:    wm('7/78/Pavillon_Le_Corbusier%2C_Zurich_%28Ank_Kumar_%29_05.jpg', 'Ank Kumar', 'CC BY-SA 4.0'),
    zhb:    wm('a/a3/Zurich_Hauptbahnhof_main_hall_arched_windows_2026.JPG', 'Mike is Michi', 'CC BY-SA 4.0'),
    ilo:    wm('0/03/Bahnhof_Interlaken_Ost_2023_S.jpg', 'Hans G. Oberlack', 'CC BY-SA 4.0'),
    home1:  sat('2634461,1170507,2635361,1171069'),
    spz:    wm('f/f0/20240904.Bahnhof_Spiez.-024.jpg', 'Bybbisch94', 'CC BY 4.0'),
    kan:    wm('1/12/Kandersteg_Bahnhof_2019.jpg', 'Adrian Michael', 'CC BY-SA 3.0'),
    tal:    sat('2617856,1149036,2619356,1149974'),
    oes:    wm('1/16/Oeschinensee_0437.jpg', 'Martin Thurnherr', 'CC BY-SA 4.0'),
    beat:   wm('c/c5/2005-Beatenberg-Gondelbahn.jpg', 'Roland Zumbuehl', 'CC BY-SA 4.0'),
    nied:   { src: W + '5/56/Niederhorn_aus_Nordost.jpg', by: 'Caumasee', lic: '퍼블릭 도메인',
              page: 'https://commons.wikimedia.org/wiki/File:Niederhorn_aus_Nordost.jpg' },
    harder: wm('d/d8/14_Harder_Kulm_Lac_Thoune_Photo_by_Giles_Laurent.jpg', 'Giles Laurent', 'CC BY-SA 4.0'),
    grin:   wm('a/ad/Eiger_seen_from_Grindelwald_village_2022-10-02_01.jpg', 'Leonhard Lenz', 'CC0'),
    ks:     wm('2/29/Kleine_Scheidegg_railway_station_2022-10-02_16.jpg', 'Leonhard Lenz', 'CC0'),
    jj:     wm('d/d8/Sphinx_at_Jungfraujoch_2022-10-02_06.jpg', 'Leonhard Lenz', 'CC0'),
    laut:   wm('7/7c/1_lauterbrunnen_valley_2012.jpg', 'Chensiyuan', 'CC BY-SA 4.0'),
    mur:    wm('2/27/M%C3%BCrren_Lauterbrunnen_2022-10-02_03.jpg', 'Leonhard Lenz', 'CC0'),
    thun:   wm('d/d9/Blick_vom_Schiff_auf_Spiez_am_Thunersee_%282014%29.jpg', 'JoachimKohler-HB', 'CC BY-SA 4.0'),
    brienz: wm('c/c8/BLS-Schiff_%22Jungfrau%22_an_der_Schiffl%C3%A4nde_Brienz_%282014%29.jpg', 'JoachimKohler-HB', 'CC BY-SA 4.0'),
    zer:    wm('0/00/Zermatt_Bahnhof_2016.jpg', 'Whgler', 'CC BY-SA 4.0'),
    gg:     wm('7/7b/Gornergrat-09.jpg', 'Wayne77', 'CC BY-SA 4.0'),
    para:   wm('0/0d/Matterhorn_paragliding.jpg', 'GBcavadini', 'CC BY-SA 4.0'),
    vill:   wm('b/bf/Matterhorn_in_winter_with_Zermatt_village.jpg', 'Deralpinbergsteiger', 'CC BY-SA 4.0'),
    zhome:  sat('2623645,1096768,2624345,1097205'),
    kunst:  wm('2/2a/Chipperfield_Candrian.jpg', 'Kunsthaus Zürich', 'CC BY-SA 4.0'),
    west:   wm('0/00/Z%C3%BCrich_Prime_Tower%2C_Hardbrucke_%28Ank_Kumar%2C_Infosys%29_03.jpg', 'Ank Kumar', 'CC BY-SA 4.0'),
    hotel:  sat('2681026,1248584,2681826,1249084'),
    zrh:    wm('8/80/Railway_station_and_Shopping_area_at_Zurich_International_Airport_%282013%29.jpg', 'JoachimKohler-HB', 'CC BY-SA 4.0')
  };

  // 바꿀 수 있는 선택 (첫 번째 값이 기본 계획)
  var DECISIONS = [
    { id: 'oe', when: '11/15 오전', opts: [
      ['walk', '외시넨호 · 걸어 올라가고 곤돌라로 하산'], ['gond', '외시넨호 · 곤돌라 왕복'],
      ['trek', '외시넨호 · 왕복 트레킹'], ['nied', '니더호른'] ] },
    { id: 'jf', when: '11/16 오전', opts: [ ['jj', '융프라우요흐'], ['mur', '뮈렌'] ] },
    { id: 'bt', when: '11/16 오후', opts: [ ['brienz', '브리엔츠호 유람선'], ['thun', '툰호 유람선'], ['none', '유람선 안 탐'] ] },
    { id: 'wx', when: '패러글라이딩 날', opts: [ ['B', '18일 아침'], ['A', '17일 오전'] ] },
    { id: 'fl', when: '비행', opts: [ ['fly', '비행'], ['cancel', '날씨로 취소 → 열차로 하산'] ] },
    { id: 'zh', when: '11/18 취리히 오후', opts: [ ['kunst', '쿤스트하우스'], ['west', '취리히 웨스트 산책'] ] },
    { id: 'tr', when: '11/16 융프라우요흐 하산', opts: [ ['rail', '열차로 하산'], ['walk', '37번 아이거 워크 걸어서'] ] }
  ];

  var DAYS = [
    ['11/14', '토', '취리히 → 인터라켄'], ['11/15', '일', '외시넨호 · 하더 쿨름'],
    ['11/16', '월', '융프라우 · 유람선'], ['11/17', '화', '체르마트로'],
    ['11/18', '수', '체르마트 → 취리히'], ['11/19', '목', '귀국']
  ];

  // 위치: d = 날짜(0=11/14), f = 그날 안의 위치(0~1), y = 줄(높이)
  var M = 290, U = 170, L = 410;
  var NODES = [
    { id: 'camp', d: -0.42, f: 0, y: M, name: '건축캠프', t: '11/6 ~ 11/14', img: 'camp',
      note: '리옹 → 피르미니·라 투레트(수도원 1박) → 라쇼드퐁 → 로잔·제네바 → 롱샹(프랑스)·바젤 → 쿠어 → 숨비츠·발스 → 브레겐츠(오스트리아) → 취리히. 캠프 교통으로 이동합니다.' },
    { id: 'pav', main: true, d: 0, f: 0.05, y: M, name: '르코르뷔지에 파빌리온', t: '12:00 개장', img: 'pav',
      note: '캠프는 10:00에 도착해 외관만 보고 11:30 공항으로 떠납니다. 우리는 12:00 개장까지 남아 안까지 관람하고 여기서 헤어집니다. 6일권으로 입장 무료. 11월까지 운영(월요일 휴관, 12~4월 휴관).' },
    { id: 'hosch', d: 0, f: 0.17, y: M, name: '회슈가세 정류장', t: '13:33', stop: true,
      note: '파빌리온 바로 옆 트램 정류장. 11번이 7~8분마다 옵니다. 13:40 트램도 있지만 14:02 기차까지 빠듯해서 13:33을 권합니다.' },
    { id: 'zhb', d: 0, f: 0.31, y: M, name: '취리히 중앙역', t: '14:02', img: 'zhb',
      note: '14:02 IC → 베른. 한 편 늦으면 14:32 (서역 16:21 도착).' },
    { id: 'bern', d: 0, f: 0.51, y: M, name: '베른', t: '15:04 갈아타기', stop: true },
    { id: 'ilw', d: 0, f: 0.66, y: M, name: '인터라켄 서역', t: '15:53', stop: true },
    { id: 'ilo', d: 0, f: 0.8, y: M, name: '인터라켄 동역', t: '16:04', img: 'ilo',
      note: '융프라우요흐·하더 쿨름 쿠폰표(별매)는 동역에서만 삽니다. 내일은 일요일이라 장을 넉넉히.' },
    { id: 'h14', d: 1, f: 0, y: M, name: '뵈니겐 숙소', t: '첫째 밤', img: 'home1', home: true,
      note: '에어비앤비 3박. 103번 버스 «Bönigen, Dorf»에서 걸어서 6분.' },

    { id: 'spz1', d: 1, f: 0.09, y: M, name: '스피츠', t: { oe: { walk: '08:12 갈아타기', trek: '08:12 갈아타기', gond: '09:12 갈아타기' } }, img: 'spz', stop: true },
    { id: 'kan', d: 1, f: 0.19, y: M, name: '칸데르슈테크역', t: { oe: { walk: '08:40', trek: '08:40', gond: '09:40' } }, img: 'kan',
      note: '역에서 곤돌라 타는 곳까지 걸어서 15분.' },
    { id: 'tal', d: 1, f: 0.31, y: M, name: '곤돌라역', t: { oe: { walk: '08:55', trek: '08:55', gond: '09:55' } }, img: 'tal',
      note: '곤돌라 운행 8:30~17:00 (11월은 토·일만). 운행 시간 밖에는 산길도 닫힙니다.' },
    { id: 'oes', main: true, d: 1, f: 0.5, y: M, name: '외시넨호', t: { oe: { walk: '10:30쯤', trek: '10:30쯤', gond: '10:40쯤' } }, img: 'oes',
      note: '해발 1,578m 호수. 산 위 역에서 호숫가까지 걸어서 30분(파노라마 길 35분).' },
    { id: 'tal2', d: 1, f: 0.7, y: M, name: '곤돌라역', t: '오후 1시 전후', img: 'tal', stop: true },
    { id: 'kan2', d: 1, f: 0.745, y: M, name: '칸데르슈테크역', t: '13:14 / 14:14', stop: true },
    { id: 'ilwn', d: 1, f: 0.14, y: L, name: '인터라켄 서역', t: '09:05', stop: true },
    { id: 'beat', d: 1, f: 0.3, y: L, name: '베아텐베르크', t: '09:37', img: 'beat',
      note: '101번 버스 종점에서 바로 곤돌라.' },
    { id: 'nied', main: true, d: 1, f: 0.5, y: L, name: '니더호른', t: '10:03', img: 'nied',
      note: '11/15가 올해 곤돌라 마지막 운행일이라, 날씨가 나쁘면 대안이 없습니다.' },
    { id: 'beat2', d: 1, f: 0.7, y: L, name: '베아텐베르크', t: '하산', stop: true },
    { id: 'ilw2', d: 1, f: 0.825, y: M, name: '인터라켄', t: '오후 2~3시', stop: true },
    { id: 'harder', main: true, d: 1, f: 0.89, y: M, name: '하더 쿨름', t: '30분 간격', img: 'harder',
      note: '인터라켄과 호수 두 개가 내려다보이는 전망대. 해 지는 시각 16:58. 내려오는 푸니쿨라 16:40 · 17:10 · 17:40.' },
    { id: 'h15', d: 2, f: 0, y: M, name: '뵈니겐 숙소', t: '둘째 밤', img: 'home1', home: true },

    { id: 'ilo16', d: 2, f: 0.08, y: M, name: '인터라켄 동역', t: { jf: { jj: '07:04', mur: '08:04' } }, img: 'ilo', stop: true },
    { id: 'grin', d: 2, f: 0.16, y: M, name: '그린델발트', t: '07:40', img: 'grin' },
    { id: 'ks', d: 2, f: 0.29, y: M, name: '클라이네 샤이덱', t: '08:30 출발', img: 'ks',
      note: '08:17 도착, 08:30 출발. 11/9~20은 에이거 익스프레스 곤돌라가 쉬어서 여기까지 산악열차로 올라옵니다.' },
    { id: 'jj', main: true, d: 2, f: 0.43, y: M, name: '융프라우요흐', t: '09:02', img: 'jj',
      note: '해발 3,454m, 영하 14℃ 안팎. 천천히 움직이기. 내려가는 열차 30분 간격(11:11 · 11:41 · 12:11).' },
    { id: 'laut', d: 2, f: 0.2, y: L, name: '라우터브루넨', t: '오전', img: 'laut' },
    { id: 'mur', main: true, d: 2, f: 0.35, y: L, name: '뮈렌', t: '오전', img: 'mur',
      note: '6일권으로 무료. 절벽 위 마을에서 아이거·묀히·융프라우를 정면으로 봅니다.' },
    { id: 'eg', d: 2, f: 0.5, y: U, name: '아이거글레처', t: '11:35쯤', img: 'jj',
      note: '해발 2,320m. 내려가는 열차에서 여기서 내려 37번 «아이거 워크»를 걷기 시작(약 2.5km · 1시간 · 내리막). 11/16은 겨울 산길 정비(11/21) 전이라 닫혀 있거나 눈·빙판이면 그냥 열차로.' },
    { id: 'ks2', d: 2, f: 0.6, y: U, name: '클라이네 샤이덱', t: '13:01 출발', img: 'ks',
      note: '12:40쯤 걸어서 도착. 13:01 열차 → 그린델발트 13:40 → 동역 14:24. 15:10 유람선까지 46분.' },
    { id: 'ilo16b', d: 2, f: 0.69, y: M, name: '인터라켄 동역', t: { tr: { rail: '13:24', walk: '14:24' } }, stop: true },
    { id: 'pier', d: 2, f: 0.77, y: U, name: '서역 선착장', t: '14:10 출항', stop: true },
    { id: 'thun', d: 2, f: 0.885, y: U, name: '툰', t: '16:20', img: 'thun',
      note: '11월엔 하루 한 편. 돌아올 땐 16:54 기차.' },
    { id: 'brienz', d: 2, f: 0.885, y: M, name: '브리엔츠', t: '16:10', img: 'brienz',
      note: '동역 선착장에서 15:10 출항. 돌아올 땐 16:37 기차.' },
    { id: 'h16', d: 3, f: 0, y: M, name: '뵈니겐 숙소', t: '셋째 밤', img: 'home1', home: true },

    { id: 'spz3', d: 3, f: 0.12, y: M, name: '스피츠', t: { wx: { A: '07:38', B: '09:38' } }, stop: true },
    { id: 'visp', d: 3, f: 0.22, y: M, name: '비스프', t: { wx: { A: '08:11', B: '10:11' } }, stop: true },
    { id: 'zer', d: 3, f: 0.34, y: M, name: '체르마트역', t: { wx: { A: '09:17', B: '11:17' } }, img: 'zer',
      note: '역에서 숙소까지 걸어서 4분. 역 사물함 CHF 5~13.' },
    { id: 'gg17', main: true, d: 3, f: 0.56, y: U, name: '고르너그라트', t: '10:33', img: 'gg',
      note: '해발 3,089m. 여기서 패러글라이딩 이륙. 열차 48분 간격.' },
    { id: 'para17', main: true, d: 3, f: 0.76, y: U, name: '패러글라이딩', t: '오전 비행', img: 'para',
      note: '비행은 별매 CHF 240 · 사진 +40. 점프수트·헬멧·장갑은 업체가 빌려줍니다. 비행 중 휴대폰 사용 금지.' },
    { id: 'vill17', d: 3, f: 0.6, y: M, name: '마을 산책', t: '오후', img: 'vill', note: '마테호른이 잘 보이는 마을 산책.' },
    { id: 'zh17', d: 4, f: 0, y: M, name: '체르마트 숙소', t: '넷째 밤', img: 'zhome', home: true, note: '에어비앤비 1박.' },

    { id: 'gg18', main: true, d: 4, f: 0.18, y: U, name: '고르너그라트', t: '07:33', img: 'gg',
      note: '첫 열차 07:00, 해 뜰 무렵 도착. 여기서 패러글라이딩 이륙.' },
    { id: 'para18', main: true, d: 4, f: 0.32, y: U, name: '패러글라이딩', t: '아침 비행', img: 'para',
      note: '비행은 별매 CHF 240 · 사진 +40. 오전이 바람에 안전합니다.' },
    { id: 'vill18', d: 4, f: 0.22, y: M, name: '아침 마을', t: '느긋한 아침', img: 'vill' },
    { id: 'zer18', d: 4, f: 0.46, y: M, name: '체르마트역', t: { wx: { A: '10:37 / 11:37', B: '11:37 / 12:37' } }, img: 'zer', stop: true },
    { id: 'visp2', d: 4, f: 0.53, y: M, name: '비스프', t: '갈아타기', stop: true },
    { id: 'zhb18', d: 4, f: 0.64, y: M, name: '취리히 중앙역', t: { wx: { A: '13:58 / 14:58', B: '14:58 / 15:58' } }, img: 'zhb' },
    { id: 'kunst', main: true, d: 4, f: 0.82, y: U + 40, name: '쿤스트하우스', t: '수요일 20시까지', img: 'kunst',
      note: '수요일은 소장품 누구나 무료. 데이비드 치퍼필드 증축동.' },
    { id: 'west', d: 4, f: 0.82, y: L - 40, name: '취리히 웨스트', t: '산책', img: 'west',
      note: '프라임 타워 · 프라이탁 타워 · 임 비아둑트. 호텔 근처.' },
    { id: 'hotel', d: 5, f: 0, y: M, name: '취리히 호텔', t: '다섯째 밤', img: 'hotel', home: true,
      note: 'ibis budget Zurich City West 1박. 하르트브뤼케역 근처.' },

    { id: 'hardb', d: 5, f: 0.16, y: M, name: '하르트브뤼케역', t: '10:48', img: 'west', stop: true },
    { id: 'zrh', d: 5, f: 0.36, y: M, name: '취리히 공항', t: '14:35 출발', img: 'zrh',
      note: '10:59 도착. EK088 14:35 → 두바이 → 인천. 놓치면 11:09 열차(외를리콘에서 갈아타 11:24 도착).' },
    { id: 'icn', d: 5, f: 0.72, y: M, name: '인천', t: '11/20 18:10', stop: true, note: '집으로.' }
  ];

  // 길: when = 이 길이 쓰이는 선택 (없으면 늘 쓰임), bend = 같은 두 점 사이 길을 벌리는 정도, sep = 6일권 밖이라 따로 사는 표(별매)
  var EDGES = [
    { a: 'camp', b: 'pav', m: 'bus', via: '캠프 일정으로 도착' },
    { a: 'pav', b: 'hosch', m: 'walk', via: '걸어서 5분 안팎' },
    { a: 'hosch', b: 'zhb', m: 'tram', r: '11', via: '트램 11번 13:33 → 중앙역 앞 13:47 (또는 오페른하우스에서 내려 슈타델호펜 S반 → 13:42)' },
    { a: 'zhb', b: 'bern', m: 'train', r: 'IC', via: 'IC 기차' },
    { a: 'bern', b: 'ilw', m: 'train', r: 'IC', via: 'IC 기차' },
    { a: 'ilw', b: 'ilo', m: 'bus', r: '103', via: '103번 버스 또는 대체버스 EV1 → 동역 16:04' },
    { a: 'ilo', b: 'h14', m: 'bus', r: '103', via: '103번 16:15 / 16:35 → 뵈니겐 도르프' },

    { a: 'h14', b: 'spz1', m: 'train', r: 'IC', via: { oe: { walk: '103번 07:09 → 서역 07:33 기차', trek: '103번 07:09 → 서역 07:33 기차', gond: '103번 08:09 → 서역 08:34 기차' } }, when: { oe: ['walk', 'gond', 'trek'] } },
    { a: 'spz1', b: 'kan', m: 'train', r: 'RE', via: 'RE 기차 28분', when: { oe: ['walk', 'gond', 'trek'] } },
    { a: 'kan', b: 'tal', m: 'walk', via: '걸어서 15분', when: { oe: ['walk', 'gond', 'trek'] } },
    { a: 'tal', b: 'oes', m: 'walk', via: '걸어서 약 90분', bend: -40, when: { oe: ['walk', 'trek'] } },
    { a: 'tal', b: 'oes', m: 'gondola', via: '곤돌라 + 걸어서 30분', sep: true, bend: 40, when: { oe: ['gond'] } },
    { a: 'oes', b: 'tal2', m: 'gondola', via: '걸어서 30분 + 곤돌라', sep: true, bend: -40, when: { oe: ['walk', 'gond'] } },
    { a: 'oes', b: 'tal2', m: 'walk', via: '걸어서 약 60분', bend: 40, when: { oe: ['trek'] } },
    { a: 'tal2', b: 'kan2', m: 'walk', via: '걸어서 15분', when: { oe: ['walk', 'gond', 'trek'] } },
    { a: 'kan2', b: 'ilw2', m: 'train', r: 'RE', via: '13:14 → 서역 14:21 (또는 14:14 → 15:22)', when: { oe: ['walk', 'gond', 'trek'] } },
    { a: 'h14', b: 'ilwn', m: 'bus', r: '103', via: '103번 버스', when: { oe: ['nied'] } },
    { a: 'ilwn', b: 'beat', m: 'bus', r: '101', via: '101번 버스 30분', when: { oe: ['nied'] } },
    { a: 'beat', b: 'nied', m: 'gondola', via: '곤돌라', sep: true, when: { oe: ['nied'] } },
    { a: 'nied', b: 'beat2', m: 'gondola', via: '곤돌라', sep: true, when: { oe: ['nied'] } },
    { a: 'beat2', b: 'ilw2', m: 'bus', r: '101', via: '101번 버스', when: { oe: ['nied'] } },
    { a: 'ilw2', b: 'harder', m: 'funi', via: '푸니쿨라', sep: true },
    { a: 'harder', b: 'h15', m: 'bus', r: '103', via: '하더반 → 걸어서 «드라이 타넨» → 103번 (17:30 / 18:00)' },

    { a: 'h15', b: 'ilo16', m: 'bus', r: '103', via: { jf: { jj: '103번 06:41 → 동역 06:47', mur: '103번 07:39 → 동역 07:47' } } },
    { a: 'ilo16', b: 'grin', m: 'train', via: '기차 07:04', when: { jf: ['jj'] } },
    { a: 'grin', b: 'ks', m: 'train', via: '산악열차 07:45', when: { jf: ['jj'] } },
    { a: 'ks', b: 'jj', m: 'train', via: '쿠폰표 · 08:30', sep: true, when: { jf: ['jj'] } },
    { a: 'jj', b: 'ilo16b', m: 'train', via: '11:11 열차 → 그린델발트 → 동역 13:24', when: { jf: ['jj'], tr: ['rail'] } },
    { a: 'jj', b: 'eg', m: 'train', via: '11:11 열차 → 아이거글레처에서 내림', when: { jf: ['jj'], tr: ['walk'] } },
    { a: 'eg', b: 'ks2', m: 'walk', via: '37번 아이거 워크 약 1시간 (열려 있고 눈·빙판 없을 때만)', when: { jf: ['jj'], tr: ['walk'] } },
    { a: 'ks2', b: 'ilo16b', m: 'train', via: '13:01 → 그린델발트 → 동역 14:24', when: { jf: ['jj'], tr: ['walk'] } },
    { a: 'ilo16', b: 'laut', m: 'train', via: '기차 20분', when: { jf: ['mur'] } },
    { a: 'laut', b: 'mur', m: 'gondola', via: '케이블카 + 기차', when: { jf: ['mur'] } },
    { a: 'mur', b: 'ilo16b', m: 'train', via: '같은 길로', when: { jf: ['mur'] } },
    { a: 'ilo16b', b: 'pier', m: 'bus', r: '108', via: '108번 버스 13:42', when: { bt: ['thun'] } },
    { a: 'pier', b: 'thun', m: 'boat', via: '배 14:10 → 툰 16:20', when: { bt: ['thun'] } },
    { a: 'thun', b: 'h16', m: 'train', via: '기차 16:54 → 서역 17:22 → 103번 17:27', when: { bt: ['thun'] } },
    { a: 'ilo16b', b: 'brienz', m: 'boat', via: '배 15:10 (동역 선착장) → 이젤트발트 15:40 → 브리엔츠 16:10', when: { bt: ['brienz'] } },
    { a: 'brienz', b: 'h16', m: 'train', via: '기차 16:37 → 동역 16:54 → 103번 17:05', when: { bt: ['brienz'] } },
    { a: 'ilo16b', b: 'h16', m: 'bus', r: '103', via: '103번 버스', bend: 60, when: { bt: ['none'] } },

    { a: 'h16', b: 'spz3', m: 'train', r: 'IC', via: { wx: { A: '103번 06:41 → 서역 07:04', B: '103번 08:41 → 서역 09:04' } } },
    { a: 'spz3', b: 'visp', m: 'train', r: 'IC', via: '기차' },
    { a: 'visp', b: 'zer', m: 'train', r: 'R', via: '기차' },
    { a: 'zer', b: 'gg17', m: 'train', via: '고르너그라트 열차 10:00', sep: true, when: { wx: ['A'] } },
    { a: 'gg17', b: 'para17', m: 'para', via: '이륙', when: { wx: ['A'], fl: ['fly'] } },
    { a: 'para17', b: 'zh17', m: 'walk', via: '착륙 → 걸어서', when: { wx: ['A'], fl: ['fly'] } },
    { a: 'gg17', b: 'zh17', m: 'train', via: '열차로 하산', sep: true, lane: U + 60, when: { wx: ['A'], fl: ['cancel'] } },
    { a: 'zer', b: 'vill17', m: 'walk', via: '짐 풀고 걸어서', when: { wx: ['B'] } },
    { a: 'vill17', b: 'zh17', m: 'walk', via: '걸어서', when: { wx: ['B'] } },

    { a: 'zh17', b: 'gg18', m: 'train', via: '첫 열차 07:00', sep: true, when: { wx: ['B'] } },
    { a: 'gg18', b: 'para18', m: 'para', via: '이륙', when: { wx: ['B'], fl: ['fly'] } },
    { a: 'para18', b: 'zer18', m: 'walk', via: '착륙 → 짐 찾기', when: { wx: ['B'], fl: ['fly'] } },
    { a: 'gg18', b: 'zer18', m: 'train', via: '열차로 하산', sep: true, lane: U + 60, when: { wx: ['B'], fl: ['cancel'] } },
    { a: 'zh17', b: 'vill18', m: 'walk', via: '걸어서', when: { wx: ['A'] } },
    { a: 'vill18', b: 'zer18', m: 'walk', via: '걸어서', when: { wx: ['A'] } },
    { a: 'zer18', b: 'visp2', m: 'train', r: 'R', via: '기차' },
    { a: 'visp2', b: 'zhb18', m: 'train', r: 'IC', via: 'IC 8 직행 (비스프 → 취리히 약 2시간 4분)' },
    { a: 'zhb18', b: 'kunst', m: 'tram', r: '3', via: '트램 3번 · 31번 버스 (5분)', when: { zh: ['kunst'] } },
    { a: 'kunst', b: 'hotel', m: 'tram', via: '트램', when: { zh: ['kunst'] } },
    { a: 'zhb18', b: 'west', m: 'train', via: 'S반 → 하르트브뤼케', when: { zh: ['west'] } },
    { a: 'west', b: 'hotel', m: 'walk', via: '걸어서', when: { zh: ['west'] } },

    { a: 'hotel', b: 'hardb', m: 'walk', via: '걸어서' },
    { a: 'hardb', b: 'zrh', m: 'train', r: 'S16', via: 'S16 직행 11분' },
    { a: 'zrh', b: 'icn', m: 'plane', r: 'EK088', via: 'EK088 → 두바이 → 인천' }
  ];

  // 카드의 «구글 지도» 버튼이 찾을 이름 (숙소는 집 위치 대신 마을 이름만)
  var MAPQ = {
    pav: 'Pavillon Le Corbusier, Zürich', zhb: 'Zürich HB', bern: 'Bern Bahnhof',
    ilw: 'Interlaken West', ilo: 'Interlaken Ost', ilwn: 'Interlaken West', ilw2: 'Interlaken West',
    hosch: 'Zürich, Höschgasse', ilo16: 'Interlaken Ost', ilo16b: 'Interlaken Ost', eg: 'Eigergletscher', ks2: 'Kleine Scheidegg',
    h14: 'Bönigen', h15: 'Bönigen', h16: 'Bönigen',
    spz1: 'Spiez Bahnhof', spz3: 'Spiez Bahnhof', kan: 'Kandersteg Bahnhof', kan2: 'Kandersteg Bahnhof',
    tal: 'Gondelbahn Kandersteg-Oeschinensee', tal2: 'Gondelbahn Kandersteg-Oeschinensee', oes: 'Oeschinensee',
    beat: 'Gondelbahn Beatenberg-Niederhorn', beat2: 'Gondelbahn Beatenberg-Niederhorn', nied: 'Niederhorn',
    harder: 'Harder Kulm', grin: 'Grindelwald Bahnhof', ks: 'Kleine Scheidegg', jj: 'Jungfraujoch',
    laut: 'Lauterbrunnen', mur: 'Mürren', pier: 'Schiffstation Interlaken West', thun: 'Thun', brienz: 'Brienz BE',
    visp: 'Visp Bahnhof', visp2: 'Visp Bahnhof', zer: 'Zermatt Bahnhof', zer18: 'Zermatt Bahnhof',
    gg17: 'Gornergrat', gg18: 'Gornergrat', para17: 'Paragliding Zermatt', para18: 'Paragliding Zermatt',
    vill17: 'Zermatt', vill18: 'Zermatt', zh17: 'Zermatt', zhb18: 'Zürich HB',
    kunst: 'Kunsthaus Zürich', west: 'Prime Tower, Zürich', hotel: 'ibis budget Zurich City West',
    hardb: 'Zürich Hardbrücke', zrh: 'Zurich Airport', icn: 'Incheon International Airport'
  };
  NODES.forEach(function (n) { if (MAPQ[n.id]) n.q = MAPQ[n.id]; });

  // 일행 공유 저장소(구글 앱스 스크립트 웹 앱 주소). 비워 두면 메모·계획이 이 기기에만 남는다
  var SYNC = 'https://script.google.com/macros/s/AKfycbzYJNV4vLpDJ1Pak2zjYXDVNr6nAoMKPAQljm0kfAqoBJ0M7qxSnUVgXLBhrW14NCd_SQ/exec';

  // 사진은 앱 안(img/키.jpg)에 넣어 두고, 없으면 원본 주소에서 불러온다
  Object.keys(IMG).forEach(function (k) { IMG[k].local = 'img/' + k + '.jpg'; });

  g.ROUTE = { M: M, SYNC: SYNC, IMG: IMG, DECISIONS: DECISIONS, DAYS: DAYS, NODES: NODES, EDGES: EDGES };
})(typeof self !== 'undefined' ? self : this);
