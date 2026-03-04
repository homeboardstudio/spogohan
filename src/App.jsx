import { useState } from "react";

/* ═══════════════════════════════════════════════════════════
   §1  THEME / CONSTANTS
   ═══════════════════════════════════════════════════════════ */
const FONT = "'Zen Maru Gothic','Noto Sans JP',sans-serif";
const COLOR = {
  bg: "#faf8f5", card: "#fff",
  accent: "#c4652e", accentLight: "#f4e8de",
  green: "#4a7c59", greenLight: "#e8f0ea",
  blue: "#3d6b8e",
  text: "#2c2418", textSub: "#7d7062",
  border: "#ebe6df", warm: "#f7f2ec",
  premium: "#8b6914",
};

/* ═══════════════════════════════════════════════════════════
   §2  MASTER DATA — 競技 / 年齢 / 目標 / 苦手食材
   ═══════════════════════════════════════════════════════════ */
const SPORTS = [
  { id: "soccer",     name: "サッカー", emoji: "⚽", cal: 1.4  },
  { id: "baseball",   name: "野球",     emoji: "⚾", cal: 1.3  },
  { id: "tennis",     name: "テニス",   emoji: "🎾", cal: 1.35 },
  { id: "swimming",   name: "水泳",     emoji: "🏊", cal: 1.5  },
  { id: "basketball", name: "バスケ",   emoji: "🏀", cal: 1.45 },
  { id: "track",      name: "陸上",     emoji: "🏃", cal: 1.4  },
  { id: "volleyball", name: "バレー",   emoji: "🏐", cal: 1.35 },
  { id: "judo",       name: "柔道",     emoji: "🥋", cal: 1.45 },
];

const AGES = [
  { id: "6-8",   label: "6〜8歳",   baseCal: 1400, baseProtein: 40 },
  { id: "9-11",  label: "9〜11歳",  baseCal: 1800, baseProtein: 55 },
  { id: "12-14", label: "12〜14歳", baseCal: 2200, baseProtein: 65 },
  { id: "15-17", label: "15〜17歳", baseCal: 2600, baseProtein: 75 },
];

const GOALS = [
  { id: "stamina",  name: "持久力UP",   emoji: "💪", focus: "炭水化物多め"          },
  { id: "growth",   name: "体を大きく", emoji: "📏", focus: "タンパク質+カルシウム" },
  { id: "recovery", name: "疲労回復",   emoji: "🔋", focus: "ビタミンB群+鉄分"     },
  { id: "prematch", name: "試合前",     emoji: "🏆", focus: "高糖質・低脂肪"       },
];

const DISLIKE_LIST = [
  /* 魚 */
  { id: "bluefish",  label: "青魚",       emoji: "🐟" },
  { id: "whitefish", label: "しらす・鮭", emoji: "🐠" },
  /* 肉 */
  { id: "redmeat",   label: "豚肉・牛肉", emoji: "🥩" },
  /* 卵・内臓 */
  { id: "egg",       label: "卵",         emoji: "🥚" },
  { id: "liver",     label: "レバー",     emoji: "🫀" },
  /* 豆 */
  { id: "natto",     label: "納豆",       emoji: "🫘" },
  { id: "tofu",      label: "豆腐",       emoji: "🫧" },
  /* 乳 */
  { id: "dairy",     label: "牛乳・乳製品", emoji: "🥛" },
  /* 野菜 */
  { id: "pepper",    label: "ピーマン",   emoji: "🫑" },
  { id: "tomato",    label: "トマト",     emoji: "🍅" },
  { id: "broccoli",  label: "ブロッコリー", emoji: "🥦" },
  { id: "carrot",    label: "にんじん",     emoji: "🥕" },
  { id: "greenonion",label: "ネギ",         emoji: "🧅" },
  { id: "leafy",     label: "葉物",       emoji: "🥬" },
  { id: "mushroom",  label: "きのこ",     emoji: "🍄" },
  /* 海藻 */
  { id: "seaweed",   label: "わかめ・海藻", emoji: "🌊" },
];

const DISLIKE_MAP = {
  bluefish:  ["サバ切り身","かつおたたき"],
  whitefish: ["鮭切り身","鮭","しらす","鮭フレーク"],
  redmeat:   ["豚ロース","豚薄切り肉","牛薄切り肉","合いびき肉"],
  egg:       ["卵"],
  liver:     ["レバー"],
  natto:     ["納豆"],
  tofu:      ["豆腐"],
  dairy:     ["牛乳","チーズ","ヨーグルト"],
  pepper:    ["ピーマン"],
  tomato:    ["トマト","トマト缶","ケチャップ"],
  broccoli:  ["ブロッコリー"],
  carrot:    ["にんじん"],
  greenonion:["ネギ"],
  leafy:     ["ほうれん草","小松菜"],
  mushroom:  ["しめじ","えのき","しいたけ","きのこ"],
  seaweed:   ["わかめ","ひじき"],
};

const DAY_LABELS = ["月","火","水","木","金","土","日"];

/* ═══════════════════════════════════════════════════════════
   §3  RECIPE DATABASE (RDB)
   ═══════════════════════════════════════════════════════════ */
const RECIPE_DB = {
"鮭おにぎり2個＋味噌汁＋バナナ":["鮭を中火で両面焼き、ほぐす|ご飯に混ぜおにぎり2個握る|豆腐の味噌汁を作る|バナナと盛り付け","鮭の抗酸化作用で筋肉疲労軽減。バナナで朝エネルギー補給","鮭は週末まとめ焼き→冷凍2週間OK"],
"炊飯器で鶏飯＋わかめスープ":["米に醤油・酒・生姜を混ぜる|鶏もも肉をのせ炊飯|炊き上がりほぐして混ぜる|わかめスープを作る","鶏タンパク＋ご飯でグリコーゲン補給","タイマーで朝完成"],
"親子丼＋ほうれん草おひたし＋みかん":["鶏肉一口大・玉ねぎ薄切り|だし＋醤油・みりんで5分煮る|溶き卵で半熟に→ご飯へ|ほうれん草おひたし＋みかん","卵＋鶏のWタンパク＋ほうれん草鉄分で持久力UP","おひたしは前夜作り置きOK"],
"ツナマヨおにぎり＋豚汁":["ツナ＋マヨ混ぜおにぎり|豚肉・大根・にんじん炒め|水＋だしで8分煮て味噌","ツナDHAで集中力、豚汁B1でエネルギー変換","豚汁は冷蔵3日OK"],
"レンジ鶏チャーシュー丼＋サラダ":["鶏むねに醤油・砂糖・酒・生姜|レンジ600W3分→裏返し3分→蒸らし|スライスしてご飯にのせる|レタス＋トマト添え","高タンパク低脂質で消化良好","冷蔵3日・冷凍2週間OK"],
"豚の生姜焼き弁当＋フルーツ":["豚ロースに醤油・みりん・生姜5分|フライパン中火で両面2分|弁当に詰める|りんご添え","豚肉B1が糖質代謝→持久力UP","下味つき冷凍OK（2週間）"],
"肉うどん＋おにぎり＋ゆで卵":["めんつゆでうどん茹で|牛肉＋ネギ投入|卵12分茹で＋塩おにぎり|盛り付け","W炭水化物でグリコーゲン貯蔵","おにぎり冷凍＋ゆで卵前夜に"],
"チキンカレー＋サラダ＋ヨーグルト":["鶏肉＋野菜を炒め焼き色|水で15分煮る|ルー投入→弱火5分|サラダ＋ヨーグルト添え","ターメリックの抗炎症で練習後の回復促進","2〜3食分冷凍が最強時短"],
"炊飯器ビビンバ＋卵スープ":["米に醤油・ごま油・コチュジャン|ひき肉・にんじん・ほうれん草のせ炊飯|混ぜて卵黄のせ|溶き卵スープ","鉄分＋葉酸で酸素運搬能力UP","野菜カット済み保存で時短"],
"鮭のちゃんちゃん焼き＋ご飯大盛り＋豚汁":["鮭に塩、キャベツざく切り|味噌・みりん・砂糖でタレ|ホイルで蒸し焼き12〜15分|ご飯大盛り＋豚汁","EPA/DHAが炎症抑制、ビタミンCで鉄吸収","タレ倍量作り冷蔵1週間OK"],
"豚キムチ炒め＋ご飯＋わかめスープ":["豚肉をごま油で炒め|キムチ加え1〜2分|わかめスープ作る|ご飯に盛る","キムチ乳酸菌で腸内環境→栄養吸収UP","冷蔵2日OK"],
"おにぎり＋100%オレンジジュース":["好みの具でおにぎり|OJを注ぐ","練習前後の素早いエネルギー補給","週末まとめ握り冷凍OK"],
"レンジ蒸しパン（きな粉）":["HM・きな粉・卵・牛乳を混ぜる|600W2分加熱|はちみつかける","きな粉の植物性タンパク質。練習後30分以内が効果的","材料ジップ袋に計量済みで3分おやつ"],
"バナナ＋ヨーグルト＋はちみつ":["バナナ輪切り→ヨーグルト→はちみつ","即効エネルギー＋タンパク質",""],
"納豆ご飯＋しらす＋牛乳＋小松菜味噌汁":["納豆混ぜご飯にのせしらすかける|小松菜の味噌汁|牛乳添え","しらす＋牛乳Ca＋納豆ビタミンKで骨成長",""],
"レンジスクランブルエッグ＋トースト＋ヨーグルト":["卵＋牛乳＋塩混ぜ|レンジ1分→混ぜ→30秒|チーズトースト＋ヨーグルト","卵・チーズ・ヨーグルトで動物性タンパク＋Ca効率摂取",""],
"しらすトースト＋牛乳＋フルーツ":["しらす＋チーズ→トースター3〜4分|牛乳＋キウイ添え","しらすCa抜群＋チーズで骨密度UP",""],
"鶏そぼろ丼＋ひじきの煮物＋牛乳":["鶏ひき肉をそぼろに|炒り卵作る|ひじき煮物|ご飯にのせ牛乳添え","鶏タンパク＋ひじき鉄分Caで筋肉＋骨","全て冷凍OK。3色弁当にも"],
"炊飯器チーズリゾット＋ブロッコリー":["米に牛乳＋水＋コンソメ|鶏むねのせ炊飯|チーズ混ぜ|ブロッコリーレンジ2分","チーズ・牛乳Ca＋鶏タンパクで骨成長",""],
"豆腐ハンバーグ＋小松菜ソテー＋ご飯＋牛乳":["豆腐水切り→鶏ひき肉とこね成形|両面4分→蒸し焼き3分|小松菜ソテー|ご飯＋牛乳","高タンパク低脂質。小松菜はCa野菜トップ","焼く前で冷凍OK"],
"サバの味噌煮＋切り干し大根＋ご飯":["サバ湯通し→味噌煮汁で15分|切り干し大根炒め煮|ご飯＋キウイ","サバEPA/DHAが成長ホルモン分泌を助ける","味噌煮は冷蔵3日。翌日が美味"],
"チーズトースト＋牛乳":["チーズトースト3〜4分|牛乳","1回でCa約400mg。1日目標の約半分",""],
"プロテインスムージー（バナナ+きな粉）":["バナナ＋牛乳＋きな粉混ぜる","植物性＋動物性タンパクで練習後に最適","バナナ冷凍でシェイク感UP"],
"ほうれん草入りオムレツ＋トースト＋ジュース":["ほうれん草レンジ1分|バターで卵→折りたたむ|トースト＋OJ","ほうれん草鉄分＋卵タンパク。OJで鉄吸収3倍",""],
"レンジ雑炊（卵＋しらす）":["ご飯＋水＋だしの素→レンジ3分|しらす＋溶き卵→1分|ネギ","消化良く胃腸に優しい。しらすCa＋卵タンパク",""],
"牛丼＋ほうれん草ごま和え＋みかん":["牛肉＋玉ねぎを甘辛く8分煮|ほうれん草ごま和え|ご飯にのせみかん添え","牛ヘム鉄は吸収率高く疲労回復に最効果","牛丼の具は冷凍2週間OK"],
"レンジ肉豆腐＋ご飯＋果物":["豆腐＋豚肉＋調味料→レンジ5分|混ぜて2分追加|ご飯＋キウイ","豚B1が疲労物質分解、豆腐で炎症緩和",""],
"かつおのたたき＋ひじきご飯＋豆腐味噌汁":["かつお切り→薬味＋ポン酢|ひじきご飯|豆腐味噌汁","かつおは鉄＋B12が豊富。疲労回復＋貧血予防に最適",""],
"炊飯器サムゲタン風スープ＋ご飯":["手羽元・米・水・生姜・にんにくで炊飯|ネギ散らす|ご飯添え","コラーゲン＋でんぷんで温め回復","タイマーで朝完成。翌日お粥にも"],
"あんぱん＋牛乳":["市販あんぱん＋牛乳","あんこ糖質は吸収早く練習後に最適",""],
"干しぶどう＋ナッツ＋OJ":["器に盛りOJ添え","鉄分・ビタミンE・Cの疲労回復トリプル","ジップ袋小分けで持ち運びOK"],
"おにぎり3個＋味噌汁＋バナナ":["3種おにぎり握る|わかめ味噌汁|バナナ添え","試合3〜4時間前に炭水化物でグリコーゲン満タン","冷凍ストック解凍が最速"],
"炊飯器おかゆ＋鮭フレーク＋果物":["おかゆモード炊飯|鮭フレーク＋梅干し|バナナ添え","消化吸収が早く試合当日朝に最適","タイマーセットがベスト"],
"パスタ（トマトソース）＋パン＋ゼリー":["パスタ茹で|トマト缶ソース5分|絡めてパン＋ゼリー添え","Wパスタ＋パンで試合エネルギー最大蓄積","トマトソース冷凍OK"],
"レンジナポリタン＋バナナ":["パスタ半分折り→水→レンジ|ウインナー・ピーマン・ケチャップ混ぜ→1分|バナナ","レンジだけの時短。試合当日の忙しい朝に",""],
"鮭の塩焼き＋ご飯大盛り＋具だくさん味噌汁":["鮭塩焼きグリル8〜10分|大根・にんじん・豆腐で味噌汁|ご飯大盛り","試合前日は消化の良い和食が鉄則",""],
"炊飯器で鶏おこわ＋卵スープ":["もち米＋白米に醤油・酒|鶏肉＋にんじんのせ炊飯|卵スープ","もち米は腹持ち良く試合前夜に最適",""],
"エネルギーゼリー＋バナナ":["ゼリー＋バナナ。試合1〜2時間前に","胃腸負担ゼロの最終エネルギーチャージ",""],
"カステラ＋りんごジュース":["カステラ切り＋りんごジュース","脂質低く消化良好。伝統的な試合前補食",""],
};

/* ═══════════════════════════════════════════════════════════
   §4  MEAL DATABASE (MB)
   ═══════════════════════════════════════════════════════════ */
const MEAL_DB = {
stamina: {
  breakfast: [
    { name:"鮭おにぎり2個＋味噌汁＋バナナ", min:15, tags:["作り置き"], cal:520, p:22, c:85, f:10, items:[{n:"鮭切り身",q:1,u:"切"},{n:"ご飯",q:300,u:"g"},{n:"味噌",q:15,u:"g"},{n:"豆腐",q:50,u:"g"},{n:"バナナ",q:1,u:"本"}] },
    { name:"炊飯器で鶏飯＋わかめスープ", min:10, tags:["炊飯器","時短"], cal:530, p:26, c:80, f:10, items:[{n:"鶏もも肉",q:100,u:"g"},{n:"米",q:1,u:"合"},{n:"生姜",q:5,u:"g"},{n:"わかめ",q:3,u:"g"},{n:"ネギ",q:10,u:"g"}] },
    { name:"親子丼＋ほうれん草おひたし＋みかん", min:20, tags:[], cal:550, p:28, c:78, f:12, items:[{n:"鶏もも肉",q:80,u:"g"},{n:"卵",q:2,u:"個"},{n:"ご飯",q:250,u:"g"},{n:"ほうれん草",q:60,u:"g"},{n:"みかん",q:1,u:"個"}] },
    { name:"ツナマヨおにぎり＋豚汁", min:15, tags:["作り置き"], cal:510, p:20, c:82, f:12, items:[{n:"ツナ缶",q:0.5,u:"缶"},{n:"ご飯",q:300,u:"g"},{n:"豚薄切り肉",q:30,u:"g"},{n:"大根",q:40,u:"g"},{n:"にんじん",q:20,u:"g"}] },
  ],
  lunch: [
    { name:"レンジ鶏チャーシュー丼＋サラダ", min:10, tags:["レンジ","時短","作り置き"], cal:660, p:34, c:82, f:16, items:[{n:"鶏むね肉",q:120,u:"g"},{n:"ご飯",q:250,u:"g"},{n:"レタス",q:30,u:"g"},{n:"トマト",q:0.5,u:"個"},{n:"醤油",q:15,u:"ml"}] },
    { name:"豚の生姜焼き弁当＋フルーツ", min:25, tags:["作り置き","冷凍OK"], cal:720, p:32, c:90, f:20, items:[{n:"豚ロース",q:100,u:"g"},{n:"ご飯",q:250,u:"g"},{n:"キャベツ",q:50,u:"g"},{n:"生姜",q:10,u:"g"},{n:"りんご",q:0.5,u:"個"}] },
    { name:"肉うどん＋おにぎり＋ゆで卵", min:20, tags:["冷凍OK"], cal:680, p:30, c:98, f:14, items:[{n:"うどん",q:1,u:"玉"},{n:"牛薄切り肉",q:80,u:"g"},{n:"ご飯",q:150,u:"g"},{n:"卵",q:1,u:"個"},{n:"ネギ",q:15,u:"g"}] },
  ],
  dinner: [
    { name:"チキンカレー＋サラダ＋ヨーグルト", min:35, tags:["冷凍OK","作り置き"], cal:750, p:35, c:100, f:18, items:[{n:"鶏もも肉",q:100,u:"g"},{n:"じゃがいも",q:1,u:"個"},{n:"にんじん",q:0.5,u:"本"},{n:"カレールー",q:1,u:"かけ"},{n:"ご飯",q:250,u:"g"},{n:"レタス",q:30,u:"g"},{n:"ヨーグルト",q:80,u:"g"}] },
    { name:"炊飯器ビビンバ＋卵スープ", min:10, tags:["炊飯器","時短"], cal:720, p:32, c:92, f:18, items:[{n:"合いびき肉",q:80,u:"g"},{n:"米",q:1.5,u:"合"},{n:"にんじん",q:0.3,u:"本"},{n:"ほうれん草",q:40,u:"g"},{n:"卵",q:1,u:"個"},{n:"コチュジャン",q:10,u:"g"}] },
    { name:"鮭のちゃんちゃん焼き＋ご飯大盛り＋豚汁", min:30, tags:[], cal:780, p:38, c:95, f:22, items:[{n:"鮭切り身",q:1,u:"切"},{n:"キャベツ",q:80,u:"g"},{n:"味噌",q:20,u:"g"},{n:"ご飯",q:300,u:"g"},{n:"豚薄切り肉",q:40,u:"g"},{n:"大根",q:50,u:"g"}] },
    { name:"豚キムチ炒め＋ご飯＋わかめスープ", min:15, tags:["時短"], cal:740, p:34, c:90, f:20, items:[{n:"豚薄切り肉",q:100,u:"g"},{n:"キムチ",q:50,u:"g"},{n:"ご飯",q:280,u:"g"},{n:"わかめ",q:3,u:"g"},{n:"豆腐",q:50,u:"g"}] },
  ],
  snack: [
    { name:"おにぎり＋100%オレンジジュース", min:5, tags:["冷凍OK"], cal:280, p:5, c:55, f:2, items:[{n:"ご飯",q:150,u:"g"},{n:"オレンジジュース",q:200,u:"ml"}] },
    { name:"レンジ蒸しパン（きな粉）", min:5, tags:["レンジ","時短"], cal:250, p:8, c:42, f:6, items:[{n:"ホットケーキミックス",q:50,u:"g"},{n:"きな粉",q:10,u:"g"},{n:"牛乳",q:50,u:"ml"},{n:"卵",q:0.5,u:"個"}] },
    { name:"バナナ＋ヨーグルト＋はちみつ", min:2, tags:["時短"], cal:230, p:6, c:44, f:4, items:[{n:"バナナ",q:1,u:"本"},{n:"ヨーグルト",q:100,u:"g"},{n:"はちみつ",q:10,u:"g"}] },
  ],
},
growth: {
  breakfast: [
    { name:"納豆ご飯＋しらす＋牛乳＋小松菜味噌汁", min:15, tags:[], cal:480, p:28, c:62, f:12, items:[{n:"納豆",q:1,u:"パック"},{n:"ご飯",q:200,u:"g"},{n:"しらす",q:15,u:"g"},{n:"牛乳",q:200,u:"ml"},{n:"小松菜",q:40,u:"g"},{n:"味噌",q:12,u:"g"}] },
    { name:"レンジスクランブルエッグ＋トースト＋ヨーグルト", min:5, tags:["レンジ","時短"], cal:520, p:30, c:48, f:22, items:[{n:"卵",q:2,u:"個"},{n:"食パン",q:1,u:"枚"},{n:"チーズ",q:1,u:"枚"},{n:"ヨーグルト",q:100,u:"g"},{n:"牛乳",q:30,u:"ml"}] },
    { name:"しらすトースト＋牛乳＋フルーツ", min:5, tags:["時短"], cal:460, p:24, c:55, f:14, items:[{n:"食パン",q:1,u:"枚"},{n:"しらす",q:20,u:"g"},{n:"チーズ",q:1,u:"枚"},{n:"牛乳",q:200,u:"ml"},{n:"キウイ",q:1,u:"個"}] },
  ],
  lunch: [
    { name:"鶏そぼろ丼＋ひじきの煮物＋牛乳", min:20, tags:["作り置き","冷凍OK"], cal:650, p:35, c:80, f:16, items:[{n:"鶏ひき肉",q:80,u:"g"},{n:"卵",q:1,u:"個"},{n:"ご飯",q:250,u:"g"},{n:"ひじき",q:5,u:"g"},{n:"牛乳",q:200,u:"ml"}] },
    { name:"炊飯器チーズリゾット＋ブロッコリー", min:10, tags:["炊飯器","時短"], cal:680, p:34, c:76, f:22, items:[{n:"米",q:1,u:"合"},{n:"鶏むね肉",q:80,u:"g"},{n:"チーズ",q:30,u:"g"},{n:"ブロッコリー",q:60,u:"g"},{n:"牛乳",q:100,u:"ml"}] },
  ],
  dinner: [
    { name:"豆腐ハンバーグ＋小松菜ソテー＋ご飯＋牛乳", min:30, tags:["冷凍OK","作り置き"], cal:720, p:40, c:82, f:20, items:[{n:"豆腐",q:100,u:"g"},{n:"鶏ひき肉",q:80,u:"g"},{n:"小松菜",q:60,u:"g"},{n:"ご飯",q:250,u:"g"},{n:"牛乳",q:200,u:"ml"},{n:"パン粉",q:15,u:"g"}] },
    { name:"サバの味噌煮＋切り干し大根＋ご飯", min:25, tags:["作り置き"], cal:700, p:36, c:85, f:18, items:[{n:"サバ切り身",q:1,u:"切"},{n:"味噌",q:20,u:"g"},{n:"切り干し大根",q:15,u:"g"},{n:"ご飯",q:250,u:"g"},{n:"キウイ",q:1,u:"個"}] },
  ],
  snack: [
    { name:"チーズトースト＋牛乳", min:5, tags:["時短"], cal:300, p:16, c:30, f:12, items:[{n:"食パン",q:1,u:"枚"},{n:"チーズ",q:1,u:"枚"},{n:"牛乳",q:200,u:"ml"}] },
    { name:"プロテインスムージー（バナナ+きな粉）", min:3, tags:["時短"], cal:280, p:14, c:38, f:8, items:[{n:"バナナ",q:1,u:"本"},{n:"牛乳",q:200,u:"ml"},{n:"きな粉",q:10,u:"g"}] },
  ],
},
recovery: {
  breakfast: [
    { name:"ほうれん草入りオムレツ＋トースト＋ジュース", min:15, tags:[], cal:480, p:24, c:52, f:18, items:[{n:"卵",q:2,u:"個"},{n:"ほうれん草",q:40,u:"g"},{n:"食パン",q:1,u:"枚"},{n:"オレンジジュース",q:200,u:"ml"}] },
    { name:"レンジ雑炊（卵＋しらす）", min:5, tags:["レンジ","時短"], cal:420, p:22, c:60, f:10, items:[{n:"ご飯",q:200,u:"g"},{n:"卵",q:1,u:"個"},{n:"しらす",q:15,u:"g"},{n:"ネギ",q:5,u:"g"},{n:"だしの素",q:3,u:"g"}] },
  ],
  lunch: [
    { name:"牛丼＋ほうれん草ごま和え＋みかん", min:20, tags:["冷凍OK"], cal:700, p:32, c:88, f:20, items:[{n:"牛薄切り肉",q:100,u:"g"},{n:"ご飯",q:250,u:"g"},{n:"ほうれん草",q:50,u:"g"},{n:"ごま",q:5,u:"g"},{n:"みかん",q:1,u:"個"}] },
    { name:"レンジ肉豆腐＋ご飯＋果物", min:10, tags:["レンジ","時短"], cal:660, p:34, c:80, f:18, items:[{n:"豚薄切り肉",q:80,u:"g"},{n:"豆腐",q:150,u:"g"},{n:"ご飯",q:250,u:"g"},{n:"ネギ",q:10,u:"g"},{n:"キウイ",q:1,u:"個"}] },
  ],
  dinner: [
    { name:"かつおのたたき＋ひじきご飯＋豆腐味噌汁", min:20, tags:[], cal:680, p:42, c:78, f:14, items:[{n:"かつおたたき",q:120,u:"g"},{n:"ひじき",q:5,u:"g"},{n:"ご飯",q:250,u:"g"},{n:"豆腐",q:80,u:"g"},{n:"味噌",q:15,u:"g"}] },
    { name:"炊飯器サムゲタン風スープ＋ご飯", min:10, tags:["炊飯器","時短"], cal:700, p:36, c:82, f:18, items:[{n:"手羽元",q:3,u:"本"},{n:"米",q:0.5,u:"合"},{n:"ネギ",q:15,u:"g"},{n:"生姜",q:10,u:"g"},{n:"にんにく",q:1,u:"かけ"},{n:"ご飯",q:200,u:"g"}] },
  ],
  snack: [
    { name:"あんぱん＋牛乳", min:0, tags:[], cal:320, p:10, c:52, f:8, items:[{n:"あんぱん",q:1,u:"個"},{n:"牛乳",q:200,u:"ml"}] },
    { name:"干しぶどう＋ナッツ＋OJ", min:0, tags:[], cal:260, p:6, c:42, f:10, items:[{n:"干しぶどう",q:30,u:"g"},{n:"ミックスナッツ",q:20,u:"g"},{n:"オレンジジュース",q:200,u:"ml"}] },
  ],
},
prematch: {
  breakfast: [
    { name:"おにぎり3個＋味噌汁＋バナナ", min:15, tags:["冷凍OK"], cal:620, p:16, c:115, f:6, items:[{n:"ご飯",q:400,u:"g"},{n:"味噌",q:12,u:"g"},{n:"わかめ",q:3,u:"g"},{n:"バナナ",q:1,u:"本"},{n:"梅干し",q:1,u:"個"}] },
    { name:"炊飯器おかゆ＋鮭フレーク＋果物", min:5, tags:["炊飯器","時短"], cal:500, p:18, c:90, f:6, items:[{n:"米",q:1,u:"合"},{n:"鮭フレーク",q:20,u:"g"},{n:"梅干し",q:1,u:"個"},{n:"バナナ",q:1,u:"本"}] },
  ],
  lunch: [
    { name:"パスタ（トマトソース）＋パン＋ゼリー", min:20, tags:[], cal:700, p:22, c:120, f:12, items:[{n:"スパゲッティ",q:100,u:"g"},{n:"トマト缶",q:100,u:"g"},{n:"パン",q:1,u:"個"},{n:"ゼリー",q:1,u:"個"}] },
    { name:"レンジナポリタン＋バナナ", min:8, tags:["レンジ","時短"], cal:680, p:20, c:110, f:14, items:[{n:"スパゲッティ",q:100,u:"g"},{n:"ケチャップ",q:30,u:"g"},{n:"ウインナー",q:2,u:"本"},{n:"ピーマン",q:1,u:"個"},{n:"バナナ",q:1,u:"本"}] },
  ],
  dinner: [
    { name:"鮭の塩焼き＋ご飯大盛り＋具だくさん味噌汁", min:25, tags:[], cal:700, p:32, c:105, f:12, items:[{n:"鮭切り身",q:1,u:"切"},{n:"ご飯",q:300,u:"g"},{n:"味噌",q:15,u:"g"},{n:"豆腐",q:50,u:"g"},{n:"大根",q:40,u:"g"},{n:"にんじん",q:30,u:"g"}] },
    { name:"炊飯器で鶏おこわ＋卵スープ", min:10, tags:["炊飯器","時短"], cal:680, p:28, c:108, f:10, items:[{n:"もち米",q:0.5,u:"合"},{n:"米",q:1,u:"合"},{n:"鶏もも肉",q:80,u:"g"},{n:"にんじん",q:30,u:"g"},{n:"卵",q:1,u:"個"}] },
  ],
  snack: [
    { name:"エネルギーゼリー＋バナナ", min:0, tags:[], cal:220, p:2, c:50, f:1, items:[{n:"エネルギーゼリー",q:1,u:"個"},{n:"バナナ",q:1,u:"本"}] },
    { name:"カステラ＋りんごジュース", min:0, tags:[], cal:240, p:4, c:48, f:4, items:[{n:"カステラ",q:1,u:"切"},{n:"りんごジュース",q:200,u:"ml"}] },
  ],
},
};

/* ═══════════════════════════════════════════════════════════
   §5  SIDE DISH DATABASE
   ═══════════════════════════════════════════════════════════ */
const SIDE_DISH_DB = [
  { name:"ほうれん草のごま和え",   cat:"veg",  min:5,  cal:45, p:3, c:4,  f:2, items:[{n:"ほうれん草",q:80,u:"g"},{n:"ごま",q:5,u:"g"}],   steps:"茹で30秒→冷水→3cm幅に切りすりごま＋醤油で和える", why:"鉄分＋ビタミンCで疲労回復を強化" },
  { name:"小松菜としらすの炒め",   cat:"fish", min:5,  cal:60, p:6, c:3,  f:3, items:[{n:"小松菜",q:80,u:"g"},{n:"しらす",q:10,u:"g"}],   steps:"小松菜をごま油でさっと炒め、しらす加えて醤油少々", why:"カルシウムの宝庫。骨を強くする最強コンビ" },
  { name:"ブロッコリーの塩茹で",   cat:"veg",  min:5,  cal:35, p:4, c:3,  f:1, items:[{n:"ブロッコリー",q:80,u:"g"}],                       steps:"小房に分け塩茹で2分→ザルに上げる。マヨ少々で", why:"ビタミンCが豊富。鉄の吸収率を高めます" },
  { name:"かぼちゃの煮物",         cat:"veg",  min:10, cal:80, p:2, c:16, f:1, items:[{n:"かぼちゃ",q:100,u:"g"}],                           steps:"一口大に切り、だし＋醤油＋砂糖＋みりんで中火8分煮る", why:"βカロテンで免疫力UP。練習後の体調管理に" },
  { name:"冷奴ネギだれ",           cat:"tofu", min:3,  cal:70, p:6, c:2,  f:4, items:[{n:"豆腐",q:100,u:"g"},{n:"ネギ",q:10,u:"g"}],       steps:"豆腐を器に盛り、刻みネギ＋ごま油＋醤油をかける", why:"良質な植物性タンパク質を手軽に追加" },
  { name:"にんじんしりしり",       cat:"egg",  min:8,  cal:75, p:4, c:6,  f:4, items:[{n:"にんじん",q:80,u:"g"},{n:"卵",q:0.5,u:"個"}],     steps:"にんじん千切り→油で炒め→溶き卵加え→めんつゆで味付け", why:"βカロテン＋卵タンパクで体づくりをサポート" },
  { name:"きゅうりとわかめの酢の物", cat:"veg", min:5,  cal:25, p:1, c:4,  f:0, items:[{n:"きゅうり",q:1,u:"本"},{n:"わかめ",q:3,u:"g"}],   steps:"きゅうり薄切り→塩もみ→戻したわかめと酢＋砂糖＋醤油で和える", why:"ミネラル補給＋さっぱりして食欲を助ける" },
  { name:"ひじきの煮物",           cat:"veg",  min:10, cal:55, p:2, c:8,  f:1, items:[{n:"ひじき",q:8,u:"g"},{n:"にんじん",q:20,u:"g"}],   steps:"ひじき戻し→にんじん千切り→醤油・砂糖・みりんで5分煮る", why:"鉄分＋カルシウム＋食物繊維のトリプル補給" },
  { name:"卵焼き（甘め）",         cat:"egg",  min:8,  cal:90, p:7, c:3,  f:6, items:[{n:"卵",q:1,u:"個"}],                                 steps:"卵＋砂糖＋醤油少々を混ぜ、卵焼き器で3回巻く", why:"良質なタンパク質を手軽にプラス" },
  { name:"トマトスライス",         cat:"veg",  min:2,  cal:20, p:1, c:4,  f:0, items:[{n:"トマト",q:0.5,u:"個"}],                           steps:"トマトをスライスして皿に並べる", why:"リコピンの抗酸化作用で運動後の回復を助ける" },
  { name:"豚汁（ミニ）",           cat:"meat", min:10, cal:95, p:6, c:8,  f:4, items:[{n:"豚薄切り肉",q:20,u:"g"},{n:"大根",q:30,u:"g"},{n:"にんじん",q:15,u:"g"}], steps:"豚肉炒め→野菜加え→水200ml＋だしで5分煮て味噌を溶く", why:"豚肉のB1＋根菜で体を温め疲労回復" },
  { name:"きのこのバター醤油",     cat:"veg",  min:5,  cal:40, p:2, c:3,  f:2, items:[{n:"しめじ",q:50,u:"g"},{n:"えのき",q:30,u:"g"}],     steps:"きのこをバターで炒め醤油をジュッと回しかける", why:"ビタミンDがカルシウム吸収を助け骨を強化" },
];

/* ═══════════════════════════════════════════════════════════
   §6  LOGIC
   ═══════════════════════════════════════════════════════════ */

function calcNeeds(ageId, sportId) {
  const age   = AGES.find(a => a.id === ageId);
  const sport = SPORTS.find(s => s.id === sportId);
  if (!age || !sport) return { cal: 2000, protein: 60 };
  return { cal: Math.round(age.baseCal * sport.cal), protein: Math.round(age.baseProtein * sport.cal) };
}

function getDislikedIngredients(ids) { return ids.flatMap(id => DISLIKE_MAP[id] || []); }

function filterByDislikes(meals, dislikedNames) {
  if (!dislikedNames.length) return meals;
  return meals.filter(m => !m.items.some(it => dislikedNames.some(d => it.n.includes(d))));
}

function pickMeal(meals, dislikedNames, usedNames = []) {
  const filtered = filterByDislikes(meals, dislikedNames).filter(m => !usedNames.includes(m.name));
  if (!filtered.length) {
    const fb = filterByDislikes(meals, dislikedNames);
    return fb.length ? fb[0 | Math.random() * fb.length] : meals[0 | Math.random() * meals.length];
  }
  return filtered[0 | Math.random() * filtered.length];
}

function generateDailyPlan(goalId, dislikedNames, usedNames = []) {
  const db = MEAL_DB[goalId] || MEAL_DB.stamina;
  const b = pickMeal(db.breakfast, dislikedNames, usedNames);
  const l = pickMeal(db.lunch, dislikedNames, [...usedNames, b.name]);
  const d = pickMeal(db.dinner, dislikedNames, [...usedNames, b.name, l.name]);
  const s = pickMeal(db.snack, dislikedNames, [...usedNames, b.name, l.name, d.name]);
  return { breakfast: b, lunch: l, dinner: d, snack: s };
}

function getRecipe(name) {
  const r = RECIPE_DB[name];
  if (!r) return null;
  return { steps: r[0].split("|"), tips: r[1], makeAhead: r[2] };
}

function sumNutrition(plan) {
  let cal = 0, p = 0, c = 0, f = 0;
  ["breakfast","lunch","dinner","snack"].forEach(k => {
    if (!plan[k]) return;
    cal += plan[k].cal; p += plan[k].p; c += plan[k].c; f += plan[k].f;
    if (plan[k].extra) { cal += plan[k].extra.cal; p += plan[k].extra.p; c += plan[k].extra.c; f += plan[k].extra.f; }
  });
  return { cal, p, c, f };
}

function buildShoppingList(plans, servings) {
  const map = {};
  (Array.isArray(plans) ? plans : [plans]).forEach(plan => {
    ["breakfast","lunch","dinner","snack"].forEach(k => {
      if (!plan[k]) return;
      plan[k].items.forEach(i => { if (!map[i.n]) map[i.n] = { ...i, q: 0 }; map[i.n].q += i.q * servings; });
      if (plan[k].extra) plan[k].extra.items.forEach(i => { if (!map[i.n]) map[i.n] = { ...i, q: 0 }; map[i.n].q += i.q * servings; });
    });
  });
  const MEAT_NAMES = ["鶏もも肉","鶏むね肉","鶏ひき肉","豚ロース","豚薄切り肉","牛薄切り肉","合いびき肉","鮭切り身","サバ切り身","かつおたたき","しらす","手羽元","ウインナー","鮭フレーク","ツナ缶"];
  const VEG_NAMES = ["キャベツ","レタス","ほうれん草","小松菜","にんじん","大根","じゃがいも","トマト","ネギ","ブロッコリー","ピーマン","生姜","にんにく","バナナ","みかん","りんご","キウイ"];
  const GRAIN_NAMES = ["ご飯","米","もち米","食パン","パン","うどん","スパゲッティ","ひじき","切り干し大根","わかめ","ホットケーキミックス","パン粉"];
  const cat = { "🥩 肉・魚": [], "🥬 野菜": [], "🍚 穀物": [], "🥛 他": [] };
  Object.values(map).forEach(item => {
    if (MEAT_NAMES.includes(item.n)) cat["🥩 肉・魚"].push(item);
    else if (VEG_NAMES.some(v => item.n.includes(v))) cat["🥬 野菜"].push(item);
    else if (GRAIN_NAMES.includes(item.n)) cat["🍚 穀物"].push(item);
    else cat["🥛 他"].push(item);
  });
  return cat;
}

function formatQty(q) { return Number.isInteger(q) ? String(q) : q === 0.5 ? "1/2" : q === 0.3 ? "1/3" : q.toFixed(1); }

const FISH_INGREDIENTS = ["鮭","サバ","しらす","かつお","ツナ","鮭フレーク"];
const MEAT_INGREDIENTS = ["鶏","豚","牛","合いびき","手羽","ウインナー"];
const EGG_INGREDIENTS  = ["卵"];
const TOFU_INGREDIENTS = ["豆腐","納豆"];

function detectMainCategory(meal) {
  const joined = meal.items.map(i => i.n).join("");
  if (FISH_INGREDIENTS.some(f => joined.includes(f))) return "fish";
  if (MEAT_INGREDIENTS.some(m => joined.includes(m))) return "meat";
  if (EGG_INGREDIENTS.some(e => joined.includes(e))) return "egg";
  if (TOFU_INGREDIENTS.some(t => joined.includes(t))) return "tofu";
  return "other";
}

function pickSideDish(meal, dislikedNames) {
  const mainCat = detectMainCategory(meal);
  const avoidCat = mainCat === "other" ? [] : [mainCat];
  let pool = SIDE_DISH_DB.filter(s => !avoidCat.includes(s.cat));
  if (dislikedNames.length) pool = pool.filter(s => !s.items.some(i => dislikedNames.some(d => i.n.includes(d))));
  if (!pool.length) pool = SIDE_DISH_DB;
  return pool[0 | Math.random() * pool.length];
}

/* ═══════════════════════════════════════════════════════════
   §7  SMALL UI COMPONENTS
   ═══════════════════════════════════════════════════════════ */

function TagBadge({ tag }) {
  const MAP = { "時短":{ bg:"#fff3e0", fg:"#e65100", icon:"⚡" }, "レンジ":{ bg:"#fce4ec", fg:"#c62828", icon:"📡" }, "炊飯器":{ bg:"#e8eaf6", fg:"#283593", icon:"🍚" }, "作り置き":{ bg:"#e0f2f1", fg:"#00695c", icon:"🧊" }, "冷凍OK":{ bg:"#e3f2fd", fg:"#1565c0", icon:"❄️" } };
  const s = MAP[tag] || { bg:"#f5f5f5", fg:"#666", icon:"🏷" };
  return <span style={{ fontSize:10, padding:"2px 7px", borderRadius:6, background:s.bg, color:s.fg, fontWeight:700, display:"inline-flex", alignItems:"center", gap:2 }}>{s.icon} {tag}</span>;
}

/** 栄養バー — DEC-006: locked=true のときぼかし表示 */
function NutritionBar({ label, current, target, color, unit, locked }) {
  const pct = Math.min(current / target * 100, 100);
  if (locked) {
    return (
      <div style={{ marginBottom:10, position:"relative" }}>
        <div style={{ filter:"blur(4px)", opacity:.4 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
            <span style={{ fontSize:11, color:COLOR.textSub, fontWeight:600 }}>{label}</span>
            <span style={{ fontSize:11, color:COLOR.textSub, fontWeight:700 }}>??{unit}/??{unit}</span>
          </div>
          <div style={{ height:7, borderRadius:4, background:COLOR.warm, overflow:"hidden" }}>
            <div style={{ width:"60%", height:"100%", borderRadius:4, background:color }} />
          </div>
        </div>
        <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <span style={{ fontSize:9, color:COLOR.premium, fontWeight:700, background:"#fff", padding:"1px 8px", borderRadius:4 }}>🔒 プレミアム</span>
        </div>
      </div>
    );
  }
  return (
    <div style={{ marginBottom:10 }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
        <span style={{ fontSize:11, color:COLOR.textSub, fontWeight:600 }}>{label}</span>
        <span style={{ fontSize:11, color: current > target * 1.1 ? "#c44" : COLOR.text, fontWeight:700 }}>{current}{unit}/{target}{unit}</span>
      </div>
      <div style={{ height:7, borderRadius:4, background:COLOR.warm, overflow:"hidden" }}>
        <div style={{ width:`${pct}%`, height:"100%", borderRadius:4, background: current > target * 1.1 ? "#c44" : color, transition:"width .6s" }} />
      </div>
    </div>
  );
}

function PremiumGate({ children, isPremium }) {
  if (isPremium) return children;
  return (
    <div style={{ position:"relative" }}>
      <div style={{ filter:"blur(3px)", pointerEvents:"none", opacity:.5 }}>{children}</div>
      <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", borderRadius:16, background:"rgba(255,255,255,.75)" }}>
        <span style={{ fontSize:28, marginBottom:6 }}>🔒</span>
        <span style={{ fontSize:13, fontWeight:800, color:COLOR.text }}>プレミアム限定</span>
      </div>
    </div>
  );
}

/** PY-CTA: 共通の「無料で試す」ボタン */
function TrialCTA({ onClick, label }) {
  return (
    <button onClick={onClick} style={{ width:"100%", padding:"10px", borderRadius:10, border:"none", background:`linear-gradient(135deg,${COLOR.accent},#e8913a)`, color:"#fff", fontSize:12, fontWeight:800, cursor:"pointer", fontFamily:FONT }}>
      {label || "14日間 無料で試す →"}
    </button>
  );
}

/** 食事カード — MP-03: 無料=Step1チラ見せ + PY-05ロック */
function MealCard({ mealType, meal, emoji, isPremium, dislikedNames, onAddExtra, onTrial }) {
  const [expanded, setExpanded] = useState(false);
  const LABELS = { breakfast:"朝食", lunch:"昼食", dinner:"夕食", snack:"補食" };
  const COLORS = { breakfast:"#e8913a", lunch:COLOR.green, dinner:COLOR.blue, snack:"#9b6b9e" };
  const recipe = getRecipe(meal.name);

  /* 無料ユーザーもタップでStep1を見られる */
  function handleTap() { setExpanded(!expanded); }

  function handleSide() {
    const side = pickSideDish(meal, dislikedNames);
    onAddExtra(mealType, { name: side.name, reason: side.why, min: side.min, cal: side.cal, p: side.p, c: side.c, f: side.f, items: side.items, steps: side.steps });
  }

  return (
    <div style={{ background:COLOR.card, borderRadius:14, overflow:"hidden", border:`1px solid ${expanded ? COLORS[mealType]+"40" : COLOR.border}`, transition:"all .3s" }}>
      <div onClick={handleTap} style={{ padding:"14px 16px", cursor:"pointer" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ fontSize:20 }}>{emoji}</span>
            <span style={{ fontSize:9, fontWeight:800, color:COLORS[mealType], background:COLORS[mealType]+"12", padding:"2px 7px", borderRadius:5 }}>{LABELS[mealType]}</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            {meal.min > 0 && <span style={{ fontSize:10, fontWeight:700, color: meal.min <= 10 ? "#e65100" : COLOR.textSub }}>⏱{meal.min}分</span>}
            <span style={{ fontSize:14, color:COLOR.textSub, transform: expanded ? "rotate(180deg)" : "none", transition:"transform .2s" }}>▾</span>
          </div>
        </div>
        <p style={{ fontSize:13, fontWeight:700, color:COLOR.text, margin:"0 0 6px", lineHeight:1.5 }}>{meal.name}</p>
        {meal.tags.length > 0 && (
          <div style={{ display:"flex", gap:4, flexWrap:"wrap", marginBottom:8 }}>
            {meal.tags.map((t, i) => <TagBadge key={i} tag={t} />)}
          </div>
        )}
        <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
          {[{ l:`${meal.cal}kcal`, c:"#e8913a" }, { l:`P${meal.p}g`, c:COLOR.accent }, { l:`C${meal.c}g`, c:COLOR.green }, { l:`F${meal.f}g`, c:COLOR.blue }].map((t, i) => (
            <span key={i} style={{ fontSize:9, padding:"2px 7px", borderRadius:5, background:t.c+"10", color:t.c, fontWeight:700 }}>{t.l}</span>
          ))}
        </div>
        {/* 副菜（Premium展開済みのみ表示） */}
        {meal.extra && (
          <div style={{ marginTop:10, padding:"10px 12px", borderRadius:10, background:COLOR.greenLight, border:`1px solid ${COLOR.green}20` }}>
            <div style={{ display:"flex", alignItems:"center", gap:4, marginBottom:4 }}>
              <span style={{ fontSize:12 }}>🥗</span>
              <span style={{ fontSize:10, fontWeight:800, color:COLOR.green }}>副菜：{meal.extra.name}</span>
              <span style={{ fontSize:9, color:COLOR.green, opacity:.7 }}>+{meal.extra.cal}kcal</span>
            </div>
            <div style={{ fontSize:10, color:COLOR.green, marginBottom:4 }}>{meal.extra.reason}</div>
            <div style={{ fontSize:10, color:COLOR.green, background:"#fff", padding:"6px 8px", borderRadius:6, lineHeight:1.5 }}>📝 {meal.extra.steps}</div>
          </div>
        )}
      </div>

      {/* ── レシピ展開エリア ── */}
      {expanded && (
        <div style={{ padding:"0 16px 14px", borderTop:`1px solid ${COLOR.border}` }}>
          <div style={{ paddingTop:12 }}>
            {recipe ? (
              <div>
                {/* DEC-007: 材料リスト（無料でも全表示） */}
                <div style={{ marginBottom:12, padding:"10px 12px", borderRadius:10, background:COLOR.warm }}>
                  <div style={{ display:"flex", alignItems:"baseline", gap:6, marginBottom:6 }}><span style={{ fontSize:10, fontWeight:800, color:COLOR.textSub }}>🥄 材料（1人分）</span><span style={{ fontSize:9, color:COLOR.textSub, opacity:.7 }}>※買い物リストで人数分に調整</span></div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
                    {meal.items.map((item, i) => (
                      <span key={i} style={{ fontSize:11, color:COLOR.text, background:COLOR.card, padding:"3px 8px", borderRadius:6, border:`1px solid ${COLOR.border}`, lineHeight:1.4 }}>
                        {item.n} <span style={{ fontWeight:700, color:COLOR.accent }}>{formatQty(item.q)}{item.u}</span>
                      </span>
                    ))}
                  </div>
                </div>
                {/* Step 1 は常に表示（無料チラ見せ） */}
                <div style={{ display:"flex", gap:8, marginBottom:8 }}>
                  <div style={{ width:22, height:22, borderRadius:6, flexShrink:0, background:COLOR.accent+"12", color:COLOR.accent, fontSize:10, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center" }}>1</div>
                  <div style={{ fontSize:12, color:COLOR.text, lineHeight:1.6, paddingTop:2 }}>{recipe.steps[0]}</div>
                </div>

                {isPremium ? (
                  <>
                    {/* Premium: Step 2以降＋Tips＋作り置きメモ */}
                    {recipe.steps.slice(1).map((s, i) => (
                      <div key={i+1} style={{ display:"flex", gap:8, marginBottom:8 }}>
                        <div style={{ width:22, height:22, borderRadius:6, flexShrink:0, background:COLOR.accent+"12", color:COLOR.accent, fontSize:10, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center" }}>{i+2}</div>
                        <div style={{ fontSize:12, color:COLOR.text, lineHeight:1.6, paddingTop:2 }}>{s}</div>
                      </div>
                    ))}
                    {recipe.tips && (
                      <div style={{ padding:"8px 12px", borderRadius:8, background:COLOR.greenLight, border:`1px solid ${COLOR.green}20`, marginTop:4, marginBottom:6 }}>
                        <span style={{ fontSize:10, fontWeight:700, color:COLOR.green }}>💡 </span>
                        <span style={{ fontSize:11, color:COLOR.green }}>{recipe.tips}</span>
                      </div>
                    )}
                    {recipe.makeAhead && (
                      <div style={{ padding:"8px 12px", borderRadius:8, background:"#e3f2fd", border:"1px solid #bbdefb" }}>
                        <span style={{ fontSize:10, fontWeight:700, color:"#1565c0" }}>🧊 </span>
                        <span style={{ fontSize:11, color:"#1565c0" }}>{recipe.makeAhead}</span>
                      </div>
                    )}
                  </>
                ) : (
                  /* PY-05: 無料ユーザー → Step1の後にロック＋CTA */
                  <div style={{ marginTop:4, padding:"14px 12px", borderRadius:10, background:COLOR.premium+"06", border:`1px dashed ${COLOR.premium}30`, textAlign:"center" }}>
                    <div style={{ fontSize:11, fontWeight:700, color:COLOR.premium, marginBottom:8 }}>📝 続きのレシピ＋時短コツを見る</div>
                    <TrialCTA onClick={onTrial} label="無料で試す" />
                  </div>
                )}
              </div>
            ) : (
              <div>
                {/* レシピ未登録でも材料は表示 */}
                <div style={{ marginBottom:10, padding:"10px 12px", borderRadius:10, background:COLOR.warm }}>
                  <div style={{ display:"flex", alignItems:"baseline", gap:6, marginBottom:6 }}><span style={{ fontSize:10, fontWeight:800, color:COLOR.textSub }}>🥄 材料（1人分）</span><span style={{ fontSize:9, color:COLOR.textSub, opacity:.7 }}>※買い物リストで人数分に調整</span></div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
                    {meal.items.map((item, i) => (
                      <span key={i} style={{ fontSize:11, color:COLOR.text, background:COLOR.card, padding:"3px 8px", borderRadius:6, border:`1px solid ${COLOR.border}`, lineHeight:1.4 }}>
                        {item.n} <span style={{ fontWeight:700, color:COLOR.accent }}>{formatQty(item.q)}{item.u}</span>
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{ fontSize:12, color:COLOR.textSub }}>レシピ準備中</div>
              </div>
            )}
          </div>

          {/* 副菜追加ボタン（Premiumのみ） */}
          {isPremium && !meal.extra && (
            <button onClick={e => { e.stopPropagation(); handleSide(); }} style={{ width:"100%", marginTop:10, padding:"10px", borderRadius:10, border:`1.5px dashed ${COLOR.green}40`, background:COLOR.green+"06", fontSize:12, fontWeight:700, color:COLOR.green, cursor:"pointer", fontFamily:FONT }}>
              🥗 副菜を追加する
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   §8  MAIN APP
   ═══════════════════════════════════════════════════════════ */
export default function App() {
  const [screen, setScreen]         = useState("onboarding");
  const [sportId, setSportId]       = useState(null);
  const [ageId, setAgeId]           = useState(null);
  const [goalId, setGoalId]         = useState(null);
  const [dislikes, setDislikes]     = useState([]);
  const [dailyPlan, setDailyPlan]   = useState(null);
  const [weeklyPlan, setWeeklyPlan] = useState(null);
  const [loading, setLoading]       = useState(false);
  const [weekLoading, setWeekLoading] = useState(false);
  const [checked, setChecked]       = useState({});
  const [isPremium, setIsPremium]   = useState(false);
  const [servings, setServings]     = useState(1);
  const [tab, setTab]               = useState("meal");
  const [weekDay, setWeekDay]       = useState(0);
  const [weekProgress, setWeekProgress] = useState(0);
  const [showDislikeWall, setShowDislikeWall] = useState(false); // PY-03
  const [showWeeklyWall, setShowWeeklyWall]   = useState(false); // PY-04
  const [isFirstResult, setIsFirstResult]     = useState(true);  // PY-02

  const needs = sportId && ageId ? calcNeeds(ageId, sportId) : null;
  const sportObj = SPORTS.find(s => s.id === sportId);
  const ageObj = AGES.find(a => a.id === ageId);
  const goalObj = GOALS.find(g => g.id === goalId);
  const dislikedNames = getDislikedIngredients(dislikes);

  function activateTrial() { setIsPremium(true); }

  /* PY-03: 苦手食材の4つ目タップ */
  function toggleDislike(id) {
    if (dislikes.includes(id)) {
      setDislikes(prev => prev.filter(x => x !== id));
      setShowDislikeWall(false);
      return;
    }
    if (dislikes.length >= 3 && !isPremium) {
      setShowDislikeWall(true);
      return;
    }
    setDislikes(prev => [...prev, id]);
  }

  function handleGenerate() {
    if (!sportId || !ageId || !goalId) return;
    setLoading(true);
    setTimeout(() => {
      setDailyPlan(generateDailyPlan(goalId, dislikedNames));
      setScreen("result");
      setLoading(false);
      setChecked({});
      setTab("meal");
      setWeeklyPlan(null);
      setIsFirstResult(true);
    }, 800);
  }

  function handleRegenerate() {
    setLoading(true);
    setIsFirstResult(false);
    setTimeout(() => { setDailyPlan(generateDailyPlan(goalId, dislikedNames)); setLoading(false); setChecked({}); }, 500);
  }

  function handleAddExtra(mealType, extra) {
    if (tab === "weekly" && weeklyPlan) setWeeklyPlan(prev => prev.map((x, i) => i === weekDay ? { ...x, [mealType]: { ...x[mealType], extra } } : x));
    else setDailyPlan(prev => ({ ...prev, [mealType]: { ...prev[mealType], extra } }));
  }

  /* PY-04: 週間タブの初タップ */
  function handleTabChange(newTab) {
    if (newTab === "weekly" && !isPremium && !showWeeklyWall) {
      setShowWeeklyWall(true);
      return;
    }
    setTab(newTab);
  }

  async function handleWeekGenerate() {
    setWeekLoading(true); setWeekProgress(0);
    const plans = [], allUsed = [];
    for (let i = 0; i < 7; i++) {
      await new Promise(r => setTimeout(r, 120));
      const p = generateDailyPlan(goalId, dislikedNames, allUsed);
      plans.push(p); allUsed.push(p.breakfast.name, p.lunch.name, p.dinner.name); setWeekProgress(i + 1);
    }
    setWeeklyPlan(plans); setWeekDay(0); setWeekLoading(false); setTab("weekly");
  }

  const MEAL_TYPES = [["breakfast","🌅"], ["lunch","☀️"], ["dinner","🌙"], ["snack","🍌"]];

  return (
    <div style={{ fontFamily:FONT, background:COLOR.bg, minHeight:"100vh" }}>
      {/* fonts & keyframes are in index.html */}

      <div style={{ maxWidth:440, margin:"0 auto", padding:"0 14px", minHeight:"100vh" }}>
        {/* ── HEADER ── */}
        <header style={{ padding:"14px 0 10px", display:"flex", alignItems:"center", justifyContent:"space-between", borderBottom:`1px solid ${COLOR.border}` }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:32, height:32, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", background:`linear-gradient(135deg,${COLOR.accent},#e8913a)`, fontSize:16 }}>🍙</div>
            <div>
              <div style={{ fontSize:15, fontWeight:900, color:COLOR.text }}>アスメシ</div>
              <div style={{ fontSize:7, color:COLOR.textSub }}>v0.7.3</div>
            </div>
          </div>
          <div style={{ display:"flex", gap:5 }}>
            <button onClick={() => setIsPremium(!isPremium)} style={{ padding:"4px 9px", borderRadius:16, fontSize:9, fontWeight:700, cursor:"pointer", border: isPremium ? "none" : `1px solid ${COLOR.premium}40`, fontFamily:FONT, background: isPremium ? "linear-gradient(135deg,#c49a14,#e8b914)" : "transparent", color: isPremium ? "#fff" : COLOR.premium }}>
              {isPremium ? "💎 ON" : "💎 OFF"}
            </button>
            {screen === "result" && (
              <button onClick={() => { setScreen("onboarding"); setDailyPlan(null); setWeeklyPlan(null); setShowWeeklyWall(false); }} style={{ background:COLOR.warm, border:"none", padding:"4px 9px", borderRadius:8, fontSize:10, color:COLOR.textSub, cursor:"pointer", fontFamily:FONT, fontWeight:600 }}>
                ← 戻る
              </button>
            )}
          </div>
        </header>

        {/* ═══ ONBOARDING ═══ */}
        {screen === "onboarding" && (
          <div style={{ paddingBottom:36 }}>
            <div style={{ textAlign:"center", padding:"24px 0 16px" }}>
              <div style={{ fontSize:40, marginBottom:6 }}>🏃‍♂️🍳</div>
              <h1 style={{ fontSize:20, fontWeight:900, color:COLOR.text, margin:"0 0 4px", lineHeight:1.4 }}>お子さんについて<br/>教えてください</h1>
              <p style={{ fontSize:12, color:COLOR.textSub, margin:0 }}>最適な献立とレシピを提案します</p>
            </div>

            {/* 競技 */}
            <div style={{ marginBottom:20 }}>
              <label style={{ fontSize:12, fontWeight:800, color:COLOR.text, display:"block", marginBottom:6 }}>🏅 競技</label>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                {SPORTS.map(s => (
                  <button key={s.id} onClick={() => setSportId(s.id)} style={{ padding:"8px 14px", borderRadius:20, border:`1.5px solid ${sportId === s.id ? "transparent" : COLOR.border}`, background: sportId === s.id ? COLOR.accent : "transparent", color: sportId === s.id ? "#fff" : COLOR.text, fontSize:12, fontWeight: sportId === s.id ? 700 : 500, cursor:"pointer", fontFamily:FONT }}>{s.emoji} {s.name}</button>
                ))}
              </div>
            </div>

            {/* 年齢 */}
            <div style={{ marginBottom:20 }}>
              <label style={{ fontSize:12, fontWeight:800, color:COLOR.text, display:"block", marginBottom:6 }}>📅 年齢</label>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                {AGES.map(a => (
                  <button key={a.id} onClick={() => setAgeId(a.id)} style={{ padding:"8px 14px", borderRadius:20, border:`1.5px solid ${ageId === a.id ? "transparent" : COLOR.border}`, background: ageId === a.id ? COLOR.green : "transparent", color: ageId === a.id ? "#fff" : COLOR.text, fontSize:12, fontWeight: ageId === a.id ? 700 : 500, cursor:"pointer", fontFamily:FONT }}>{a.label}</button>
                ))}
              </div>
            </div>

            {needs && (
              <div style={{ background:COLOR.greenLight, borderRadius:12, padding:"10px 14px", marginBottom:20, border:`1px solid ${COLOR.green}20` }}>
                <div style={{ fontSize:10, color:COLOR.green, fontWeight:700 }}>📊 推定1日</div>
                <div style={{ display:"flex", gap:14 }}>
                  <span style={{ fontSize:18, fontWeight:900, color:COLOR.green }}>{needs.cal}kcal</span>
                  <span style={{ fontSize:13, fontWeight:700, color:COLOR.green }}>P {needs.protein}g</span>
                </div>
              </div>
            )}

            {/* 苦手食材 */}
            <div style={{ marginBottom:20 }}>
              <label style={{ fontSize:12, fontWeight:800, color:COLOR.text, display:"block", marginBottom:6 }}>
                🙅 苦手な食材<span style={{ fontSize:10, fontWeight:500, color:COLOR.textSub, marginLeft:6 }}>{isPremium ? "無制限" : "3つまで"}</span>
              </label>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                {DISLIKE_LIST.map(d => {
                  const selected = dislikes.includes(d.id);
                  const disabled = !selected && dislikes.length >= 3 && !isPremium;
                  return (
                    <button key={d.id} onClick={() => toggleDislike(d.id)} style={{ padding:"8px 12px", borderRadius:20, fontSize:12, fontFamily:FONT, cursor: disabled ? "pointer" : "pointer", border: selected ? "2px solid #c44" : `1.5px solid ${COLOR.border}`, background: selected ? "#fef2f2" : "transparent", color: selected ? "#c44" : COLOR.text, fontWeight: selected ? 700 : 500, opacity: disabled ? .5 : 1 }}>
                      {d.emoji} {d.label}{selected ? " ✕" : ""}
                    </button>
                  );
                })}
              </div>
              {/* PY-03: ソフトウォール */}
              {showDislikeWall && !isPremium && (
                <div style={{ marginTop:8, padding:"12px 14px", borderRadius:12, background:COLOR.premium+"08", border:`1px solid ${COLOR.premium}20` }}>
                  <div style={{ fontSize:11, fontWeight:700, color:COLOR.premium, marginBottom:8 }}>🙅 4つ以上の食材を除外するにはプレミアムが必要です</div>
                  <TrialCTA onClick={activateTrial} label="14日間 無料で試す" />
                </div>
              )}
            </div>

            {/* 目標 */}
            <div style={{ marginBottom:24 }}>
              <label style={{ fontSize:12, fontWeight:800, color:COLOR.text, display:"block", marginBottom:6 }}>🎯 目標</label>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                {GOALS.map(g => (
                  <button key={g.id} onClick={() => setGoalId(g.id)} style={{ padding:"12px 10px", borderRadius:12, textAlign:"left", fontFamily:FONT, border: goalId === g.id ? `2px solid ${COLOR.accent}` : `1.5px solid ${COLOR.border}`, background: goalId === g.id ? COLOR.accentLight : COLOR.card, cursor:"pointer" }}>
                    <div style={{ fontSize:20, marginBottom:2 }}>{g.emoji}</div>
                    <div style={{ fontSize:13, fontWeight:700, color:COLOR.text }}>{g.name}</div>
                    <div style={{ fontSize:10, color:COLOR.textSub }}>{g.focus}</div>
                  </button>
                ))}
              </div>
            </div>

            <button onClick={handleGenerate} disabled={!sportId || !ageId || !goalId || loading} style={{ width:"100%", padding:"14px", borderRadius:14, border:"none", fontFamily:FONT, background: sportId && ageId && goalId ? `linear-gradient(135deg,${COLOR.accent},#e8913a)` : COLOR.border, color: sportId && ageId && goalId ? "#fff" : COLOR.textSub, fontSize:15, fontWeight:800, cursor: sportId && ageId && goalId ? "pointer" : "not-allowed" }}>
              {loading ? "生成中..." : "🍽️ 今日の献立を提案する"}
            </button>
          </div>
        )}

        {/* ═══ RESULT ═══ */}
        {screen === "result" && (dailyPlan || weeklyPlan) && (
          <div style={{ paddingBottom:36 }}>
            {/* プロフィールサマリー */}
            <div style={{ margin:"12px 0 10px", padding:"10px 14px", borderRadius:12, background:COLOR.warm, display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ fontSize:22 }}>{sportObj?.emoji}</span>
              <div>
                <div style={{ fontSize:13, fontWeight:800, color:COLOR.text }}>{sportObj?.name}・{ageObj?.label}</div>
                <div style={{ display:"flex", gap:6 }}>
                  <span style={{ fontSize:11, color:COLOR.accent, fontWeight:600 }}>{goalObj?.emoji} {goalObj?.name}</span>
                  {dislikes.length > 0 && <span style={{ fontSize:10, color:"#c44", fontWeight:600 }}>🚫{dislikes.map(d => DISLIKE_LIST.find(x => x.id === d)?.label).join("・")}</span>}
                </div>
              </div>
            </div>

            {/* PY-02: インライン提案（初回のみ） */}
            {!isPremium && isFirstResult && (
              <div style={{ marginBottom:12, padding:"12px 14px", borderRadius:12, background:COLOR.accentLight, border:`1px solid ${COLOR.accent}20`, display:"flex", alignItems:"center", justifyContent:"space-between", gap:8 }}>
                <div style={{ fontSize:11, color:COLOR.accent, fontWeight:600, lineHeight:1.5 }}>🍽️ 献立ができました！<br/>レシピも見たい場合は →</div>
                <button onClick={activateTrial} style={{ flexShrink:0, padding:"8px 14px", borderRadius:10, border:"none", background:`linear-gradient(135deg,${COLOR.accent},#e8913a)`, color:"#fff", fontSize:10, fontWeight:800, cursor:"pointer", fontFamily:FONT, whiteSpace:"nowrap" }}>14日間 無料おためし</button>
              </div>
            )}

            {/* PY-04: 週間タブモーダル風ウォール */}
            {showWeeklyWall && !isPremium && (
              <div style={{ marginBottom:12, padding:"20px 16px", borderRadius:14, background:COLOR.card, border:`2px solid ${COLOR.accent}30`, textAlign:"center" }}>
                <div style={{ fontSize:32, marginBottom:6 }}>📅</div>
                <div style={{ fontSize:14, fontWeight:800, color:COLOR.text, marginBottom:4 }}>1週間まとめて献立を作れます</div>
                <div style={{ fontSize:11, color:COLOR.textSub, marginBottom:12 }}>毎日考えなくてOK。買い物リストも自動で出ます</div>
                <TrialCTA onClick={activateTrial} label="無料で始める（14日間）" />
                <button onClick={() => setShowWeeklyWall(false)} style={{ marginTop:8, background:"none", border:"none", fontSize:10, color:COLOR.textSub, cursor:"pointer", fontFamily:FONT }}>閉じる</button>
              </div>
            )}

            {/* タブ */}
            <div style={{ display:"flex", gap:3, marginBottom:12, background:"#e5e2dc", borderRadius:10, padding:3 }}>
              {[{ id:"meal", l:"🍽 今日" }, { id:"list", l:"🛒 買物" }, { id:"weekly", l:"📅 週間" }].map(t => (
                <button key={t.id} onClick={() => handleTabChange(t.id)} style={{ flex:1, padding:"8px 4px", border:"none", borderRadius:8, fontSize:12, fontWeight: tab === t.id ? 700 : 500, fontFamily:FONT, cursor:"pointer", background: tab === t.id ? "#fff" : "transparent", color: tab === t.id ? COLOR.text : COLOR.textSub }}>{t.l}</button>
              ))}
            </div>

            {/* ── TAB: 今日の献立 ── */}
            {tab === "meal" && dailyPlan && (
              <div>
                {/* DEC-006: 栄養バー（無料=カロリーのみ、P/C/Fロック） */}
                <div style={{ background:COLOR.card, borderRadius:14, padding:14, marginBottom:12, border:`1px solid ${COLOR.border}` }}>
                  <div style={{ fontSize:12, fontWeight:800, color:COLOR.text, marginBottom:10 }}>📊 栄養バランス</div>
                  <NutritionBar label="エネルギー" current={sumNutrition(dailyPlan).cal} target={needs?.cal || 2000} color={COLOR.accent} unit="kcal" locked={false} />
                  <NutritionBar label="タンパク質" current={sumNutrition(dailyPlan).p}   target={needs?.protein || 60} color="#c4652e" unit="g" locked={!isPremium} />
                  <NutritionBar label="炭水化物"   current={sumNutrition(dailyPlan).c}   target={Math.round((needs?.cal || 2000) * .55 / 4)} color={COLOR.green} unit="g" locked={!isPremium} />
                  <NutritionBar label="脂質"       current={sumNutrition(dailyPlan).f}   target={Math.round((needs?.cal || 2000) * .25 / 9)} color={COLOR.blue} unit="g" locked={!isPremium} />
                </div>
                {isPremium && <div style={{ padding:"8px 12px", marginBottom:12, borderRadius:10, background:COLOR.accent+"08", fontSize:11, color:COLOR.accent, fontWeight:600 }}>✨ タップ → レシピ即表示＆副菜提案</div>}
                <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:12 }}>
                  {MEAL_TYPES.map(([k, e]) => (
                    <MealCard key={k} mealType={k} meal={dailyPlan[k]} emoji={e} isPremium={isPremium} dislikedNames={dislikedNames} onAddExtra={handleAddExtra} onTrial={activateTrial} />
                  ))}
                </div>
                <button onClick={handleRegenerate} disabled={loading} style={{ width:"100%", padding:"12px", borderRadius:12, border:`1.5px solid ${COLOR.border}`, background:COLOR.card, fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:FONT, color:COLOR.text }}>
                  {loading ? "🔄 生成中..." : "🔄 別の献立にする"}
                </button>
              </div>
            )}

            {/* ── TAB: 買い物リスト ── */}
            {tab === "list" && (
              <PremiumGate isPremium={isPremium}>
                <div style={{ background:COLOR.card, borderRadius:14, padding:16, border:`1px solid ${COLOR.green}20` }}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14, padding:"10px 12px", borderRadius:12, background:COLOR.greenLight }}>
                    <div style={{ fontSize:12, fontWeight:800, color:COLOR.green }}>👨‍👩‍👧‍👦 何人分？</div>
                    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                      <button onClick={() => setServings(Math.max(1, servings - 1))} style={{ width:30, height:30, borderRadius:8, border:`1px solid ${COLOR.green}40`, background:"#fff", fontSize:16, cursor:"pointer", color:COLOR.green, fontWeight:700 }}>−</button>
                      <span style={{ fontSize:20, fontWeight:900, color:COLOR.green, minWidth:30, textAlign:"center" }}>{servings}</span>
                      <button onClick={() => setServings(Math.min(8, servings + 1))} style={{ width:30, height:30, borderRadius:8, border:`1px solid ${COLOR.green}40`, background:"#fff", fontSize:16, cursor:"pointer", color:COLOR.green, fontWeight:700 }}>+</button>
                      <span style={{ fontSize:11, color:COLOR.green, fontWeight:700 }}>人分</span>
                    </div>
                  </div>
                  {Object.entries(buildShoppingList(weeklyPlan || dailyPlan, servings)).map(([cat, items]) =>
                    items.length > 0 && (
                      <div key={cat} style={{ marginBottom:14 }}>
                        <div style={{ fontSize:11, fontWeight:700, color:COLOR.textSub, marginBottom:4, paddingBottom:3, borderBottom:`1px solid ${COLOR.border}` }}>{cat}</div>
                        {items.map((it, j) => {
                          const key = cat + it.n;
                          return (
                            <label key={j} style={{ display:"flex", alignItems:"center", gap:8, padding:"7px 10px", borderRadius:8, cursor:"pointer", background: checked[key] ? COLOR.greenLight : "transparent" }}>
                              <input type="checkbox" checked={!!checked[key]} onChange={() => setChecked(p => ({ ...p, [key]: !p[key] }))} style={{ width:16, height:16, accentColor:COLOR.green }} />
                              <span style={{ flex:1, fontSize:12, color: checked[key] ? COLOR.textSub : COLOR.text, textDecoration: checked[key] ? "line-through" : "none" }}>{it.n}</span>
                              <span style={{ fontSize:12, fontWeight:700, color: checked[key] ? COLOR.textSub : COLOR.accent, textDecoration: checked[key] ? "line-through" : "none" }}>{formatQty(it.q)} {it.u}</span>
                            </label>
                          );
                        })}
                      </div>
                    )
                  )}
                </div>
              </PremiumGate>
            )}

            {/* ── TAB: 週間献立 ── */}
            {tab === "weekly" && (
              <PremiumGate isPremium={isPremium}>
                <div>
                  {!weeklyPlan ? (
                    <div style={{ background:COLOR.card, borderRadius:14, padding:24, textAlign:"center", border:`1px solid ${COLOR.border}` }}>
                      <div style={{ fontSize:40, marginBottom:8 }}>📅</div>
                      <div style={{ fontSize:15, fontWeight:800, color:COLOR.text, marginBottom:16 }}>1週間分の献立を一括作成</div>
                      <button onClick={handleWeekGenerate} disabled={weekLoading} style={{ padding:"14px 28px", borderRadius:12, border:"none", background:`linear-gradient(135deg,${COLOR.accent},#e8913a)`, color:"#fff", fontSize:14, fontWeight:800, cursor:"pointer", fontFamily:FONT }}>
                        {weekLoading ? `${weekProgress}/7日 生成中...` : "🗓 1週間分を作成する"}
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div style={{ display:"flex", gap:4, marginBottom:12 }}>
                        {DAY_LABELS.map((d, i) => (
                          <button key={i} onClick={() => setWeekDay(i)} style={{ minWidth:44, padding:"10px 6px", borderRadius:10, border:"none", fontFamily:FONT, cursor:"pointer", background: weekDay === i ? COLOR.accent : "#fff", color: weekDay === i ? "#fff" : COLOR.text, fontSize:12, fontWeight: weekDay === i ? 800 : 500, display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
                            <span style={{ fontSize:10, opacity:.7 }}>{d}</span><span>{i + 1}</span>
                          </button>
                        ))}
                      </div>
                      <div style={{ background:COLOR.card, borderRadius:14, padding:14, marginBottom:12, border:`1px solid ${COLOR.border}` }}>
                        <div style={{ fontSize:12, fontWeight:800, color:COLOR.text, marginBottom:10 }}>📊 {DAY_LABELS[weekDay]}曜日</div>
                        <NutritionBar label="エネルギー" current={sumNutrition(weeklyPlan[weekDay]).cal} target={needs?.cal || 2000} color={COLOR.accent} unit="kcal" locked={false} />
                        <NutritionBar label="タンパク質" current={sumNutrition(weeklyPlan[weekDay]).p}   target={needs?.protein || 60} color="#c4652e" unit="g" locked={false} />
                      </div>
                      <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:12 }}>
                        {MEAL_TYPES.map(([k, e]) => (
                          <MealCard key={weekDay + k} mealType={k} meal={weeklyPlan[weekDay][k]} emoji={e} isPremium={isPremium} dislikedNames={dislikedNames} onAddExtra={handleAddExtra} onTrial={activateTrial} />
                        ))}
                      </div>
                      <div style={{ display:"flex", gap:8 }}>
                        <button onClick={() => { const n = [...weeklyPlan]; n[weekDay] = generateDailyPlan(goalId, dislikedNames); setWeeklyPlan(n); }} style={{ flex:1, padding:"10px", borderRadius:10, border:`1.5px solid ${COLOR.border}`, background:COLOR.card, fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:FONT, color:COLOR.text }}>🔄 {DAY_LABELS[weekDay]}曜だけ</button>
                        <button onClick={handleWeekGenerate} disabled={weekLoading} style={{ flex:1, padding:"10px", borderRadius:10, border:"none", background:COLOR.accent+"12", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:FONT, color:COLOR.accent }}>🗓 全日再生成</button>
                      </div>
                    </div>
                  )}
                </div>
              </PremiumGate>
            )}

            {/* ── PY-01: アップセルバナー（改修版） ── */}
            {!isPremium && (
              <div style={{ marginTop:16, padding:"20px 16px", borderRadius:16, background:"linear-gradient(135deg,#2c2418,#4a3828)" }}>
                <div style={{ fontSize:10, color:"#c4a882", fontWeight:700, marginBottom:6 }}>PREMIUM</div>
                <div style={{ fontSize:15, fontWeight:900, color:"#fff", marginBottom:4 }}>毎日の「何作ろう？」がゼロになる</div>
                <div style={{ fontSize:11, color:"#a89880", marginBottom:10 }}>レシピ・副菜・週間献立・買い物リストが全部使える</div>
                <div style={{ display:"flex", flexDirection:"column", gap:3, marginBottom:12 }}>
                  {["📝 全レシピ即表示","🥗 副菜提案＋レシピ","🙅 苦手食材 無制限","🛒 買い物リスト","📅 1週間献立","👨‍👩‍👧‍👦 家族人数調整"].map((f, i) => (
                    <div key={i} style={{ fontSize:11, color:"#d4c4a8" }}><span style={{ color:"#e8b914" }}>✓</span> {f}</div>
                  ))}
                </div>
                <div style={{ display:"flex", alignItems:"baseline", gap:4, marginBottom:12 }}>
                  <span style={{ fontSize:26, fontWeight:900, color:"#fff" }}>¥980</span>
                  <span style={{ fontSize:11, color:"#a89880" }}>/月</span>
                </div>
                <TrialCTA onClick={activateTrial} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
