import exportCourse1 from './images/ExportCourse1.png';
import exportCourse2 from './images/ExportCourse2.png';
import exportCourse3 from './images/ExportCourse3.png';
import exportCourse4 from './images/ExportCourse4.png';
import exportCourse5 from './images/ExportCourse5.png';
import exportCourse6 from './images/ExportCourse6.png';
import exportCourse7 from './images/ExportCourse7.png';
import {
  AdvancedFilterOption,
  AdvancedFilterType,
  Course,
  FilterOption,
} from './types';

export const ANNOUNCEMENT_DATA = {
  version: 'v5.1.1',
  feedbackFormUrl: 'https://forms.gle/gFBZDgkSbj85zukP6',
  DCForumUrl: 'https://discord.gg/Md4x9frrHf',
  description: [
    <>
      此網站式依據電腦的使用者體驗設計，建議
      <span className='text-danger fw-bold'>使用電腦瀏覽</span>，
      近期有在進行手機版的大幅度改善，歡迎提出意見。
    </>,
    <>
      這是輔助大家選課的系統，
      <span className='text-danger fw-bold'>僅供參考</span>。
    </>,
    <>
      課程資料開啟實驗性功能將會獲取最新版，請在切換學期課表旁切換實驗性功能，並且
      <span className='text-danger fw-bold'>確保手動刷新網頁以更新資料</span>。
      <span className='text-danger fw-bold'>
        如果實驗性功能有任何問題，請聯絡我
      </span>
    </>,
  ],
  updates: ['改用自動更新API，資料將每小時更新一次。'],
  features: [
    '超漂亮UI',
    '課表動態更新',
    '一鍵加入必修課',
    '更強大的篩選器以及智慧搜尋',
    '本學期學程搜尋',
    '顯示衝堂',
    '自動填課目前已經上線測試中！',
    '一鍵登記選課 (其實沒有一鍵啦)',
    'Local Storage 關閉瀏覽器自動儲存選課資料',
  ],
  knownIssues: [
    'Safari 瀏覽器有可能會出現渲染問題，有任何選染錯誤請聯絡我，並註記您的瀏覽器版本。(如果願意擔當測試者，請在表單說想當 IOS 前端測試，不勝感激)',
    '如果有任何使用上卡頓的問題，請幫忙填寫表單反饋，並註記位置。',
    <>
      課程資料是爬蟲下來的靜態資料，更新會每小時執行一次，請開啟實驗性功能，來體驗更即時課程更新。有興趣用此API的人可以參考
      <a href='https://github.com/nsysu-opendev/NSYSUCourseAPI'>
        中山課程開放API
      </a>
    </>,
  ],
  termsofuse: [
    <>
      當您使用本網站時，即表示您同意
      <a
        href='https://github.com/NSYSU-OpenDev/NSYSUSelectorHelper/blob/main/term_of_use.md'
        target='_blank'
        rel='noreferrer noopener'
      >
        使用條款
      </a>
    </>,
  ],
  githubUrl: 'https://github.com/NSYSU-OpenDev/NSYSUSelectorHelper/',
  contactEmail: 'yochen0123@gmail.com',
  copyright: [
    'By Cellery Lin (MEM113) and whats2000 (MIS114).',
    `MIT License, Copyright © ${new Date().getFullYear()} Cellery Lin and whats2000. All rights reserved.`,
  ],
};

export const ENTRY_NOTIFICATION_CONFIG = {
  version: ANNOUNCEMENT_DATA.version,
  description: (
    <>
      <ul>
        <li>
          中山選課論壇DC現在啟用啦！
          <a
            href={ANNOUNCEMENT_DATA.DCForumUrl}
            target='_blank'
            rel='noreferrer noopener'
          >
            點我前往
          </a>
          ，歡迎大家多加利用。
        </li>
        <li>
          We are now looking for the frontend developer to improve experience
          for English users. If you are interested, please fill out the &nbsp;
          <a
            href={ANNOUNCEMENT_DATA.feedbackFormUrl}
            target='_blank'
            rel='noreferrer noopener'
          >
            form below
          </a>
          , or contact me (yochen0123@gmail.com) directly.
        </li>
      </ul>
    </>
  ),
  updates: ['引入課程API，課程資料現在會每小時更新一次'],
  feedbackFormUrl: ANNOUNCEMENT_DATA.feedbackFormUrl,
};

export const HOW_TO_USE_EXPORT_CODE = [
  {
    image: exportCourse1,
    description:
      '選擇欲加選課程，並填入點數或志願 (請依照學校的規定勾選及填寫點數或志願，此以初選一配點為例)',
  },
  {
    image: exportCourse2,
    description: '點選匯出課程。',
  },
  {
    image: exportCourse3,
    description: '腳本一般會自動複製到剪貼簿，若沒有請手動複製。',
  },
  {
    image: exportCourse4,
    description: '進入選課系統，點選課 (這邊以初選一作範例)',
  },
  {
    image: exportCourse5,
    description: '右鍵點選空白處，選擇檢查。或是按下 F12。',
  },
  {
    image: exportCourse6,
    description: '點選 Console。貼上剛剛複製的腳本，按下 Enter。',
  },
  {
    image: exportCourse7,
    description: '完成！',
  },
];

export const COURSE_DETECTIVE_ELEMENTS = [
  { id: 'liberal-arts', content: '博雅課程', enabled: true },
  { id: 'sports-fitness', content: '運動與健康(大一必修)', enabled: true },
  { id: 'sports-other', content: '運動與健康(其他)', enabled: true },
  { id: 'cross-department', content: '跨院選修', enabled: true },
  { id: 'chinese-critical-thinking', content: '中文思辨與表達', enabled: true },
  { id: 'random-courses', content: '隨機大學部課程', enabled: false },
  { id: 'random-graduate-courses', content: '隨機研究所課程', enabled: false },
  { id: 'english-beginner', content: '英文初級', enabled: false },
  { id: 'english-intermediate', content: '英文中級', enabled: false },
  { id: 'english-advanced-mid', content: '英文中高級', enabled: false },
  { id: 'english-advanced', content: '英文高級', enabled: false },
];

export const DEFAULT_FILTER_OPTIONS: {
  [key in AdvancedFilterOption]: {
    options: string[];
    dropdown: boolean;
    optionDisplayName?: string[];
  };
} = {
  名稱: { options: [], dropdown: false },
  教師: { options: [], dropdown: false },
  學程: { options: [], dropdown: false },
  節次: {
    options: [
      'A',
      '1',
      '2',
      '3',
      '4',
      'B',
      '5',
      '6',
      '7',
      '8',
      '9',
      'C',
      'D',
      'E',
      'F',
    ],
    dropdown: true,
  },
  星期: {
    options: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ],
    optionDisplayName: ['一', '二', '三', '四', '五', '六', '日'],
    dropdown: true,
  },
  年級: {
    options: ['0', '1', '2', '3', '4'],
    optionDisplayName: ['不分', '大一', '大二', '大三', '大四'],
    dropdown: true,
  },
  班別: { options: ['甲班', '乙班', '全英班', '不分班'], dropdown: true },
  系所: { options: [], dropdown: true },
  必修: {
    options: ['必', '選'],
    optionDisplayName: ['必修', '選修'],
    dropdown: true,
  },
  學分: { options: [], dropdown: true },
  英課: {
    options: ['1', '0'],
    optionDisplayName: ['是', '否'],
    dropdown: true,
  },
};

export const TIMESLOT: [
  { key: 'A'; value: '7:00\n~\n7:50' },
  { key: '1'; value: '8:10\n~\n9:00' },
  { key: '2'; value: '9:10\n~\n10:00' },
  { key: '3'; value: '10:10\n~\n11:00' },
  { key: '4'; value: '11:10\n~\n12:00' },
  { key: 'B'; value: '12:10\n~\n13:00' },
  { key: '5'; value: '13:10\n~\n14:00' },
  { key: '6'; value: '14:10\n~\n15:00' },
  { key: '7'; value: '15:10\n~\n16:00' },
  { key: '8'; value: '16:10\n~\n17:00' },
  { key: '9'; value: '17:10\n~\n18:00' },
  { key: 'C'; value: '18:20\n~\n19:10' },
  { key: 'D'; value: '19:15\n~\n20:05' },
  { key: 'E'; value: '20:10\n~\n21:00' },
  { key: 'F'; value: '21:05\n~\n21:55' },
] = [
  { key: 'A', value: '7:00\n~\n7:50' },
  { key: '1', value: '8:10\n~\n9:00' },
  { key: '2', value: '9:10\n~\n10:00' },
  { key: '3', value: '10:10\n~\n11:00' },
  { key: '4', value: '11:10\n~\n12:00' },
  { key: 'B', value: '12:10\n~\n13:00' },
  { key: '5', value: '13:10\n~\n14:00' },
  { key: '6', value: '14:10\n~\n15:00' },
  { key: '7', value: '15:10\n~\n16:00' },
  { key: '8', value: '16:10\n~\n17:00' },
  { key: '9', value: '17:10\n~\n18:00' },
  { key: 'C', value: '18:20\n~\n19:10' },
  { key: 'D', value: '19:15\n~\n20:05' },
  { key: 'E', value: '20:10\n~\n21:00' },
  { key: 'F', value: '21:05\n~\n21:55' },
];

export const WEEKDAY: [
  { key: 'Monday'; value: '一' },
  { key: 'Tuesday'; value: '二' },
  { key: 'Wednesday'; value: '三' },
  { key: 'Thursday'; value: '四' },
  { key: 'Friday'; value: '五' },
  { key: 'Saturday'; value: '六' },
  { key: 'Sunday'; value: '日' },
] = [
  { key: 'Monday', value: '一' },
  { key: 'Tuesday', value: '二' },
  { key: 'Wednesday', value: '三' },
  { key: 'Thursday', value: '四' },
  { key: 'Friday', value: '五' },
  { key: 'Saturday', value: '六' },
  { key: 'Sunday', value: '日' },
];

export const COURSE_DATA_NAME_MAP: {
  [key in FilterOption]: keyof Course;
} = {
  名稱: 'Name',
  教師: 'Teacher',
  學程: 'Programs',
  年級: 'Grade',
  班別: 'Class',
  系所: 'Department',
  必修: 'CompulsoryElective',
  學分: 'Credit',
  英課: 'EMI',
};

export const DEFAULT_ADVANCE_FILTER: AdvancedFilterType = {
  名稱: { active: false, value: '', filterLogic: 'include', activeOptions: {} },
  教師: { active: false, value: '', filterLogic: 'include', activeOptions: {} },
  學程: { active: false, value: '', filterLogic: 'include', activeOptions: {} },
  年級: { active: false, value: '', filterLogic: 'include', activeOptions: {} },
  節次: { active: false, value: '', filterLogic: 'include', activeOptions: {} },
  星期: { active: false, value: '', filterLogic: 'include', activeOptions: {} },
  班別: { active: false, value: '', filterLogic: 'include', activeOptions: {} },
  系所: { active: false, value: '', filterLogic: 'include', activeOptions: {} },
  必修: { active: false, value: '', filterLogic: 'include', activeOptions: {} },
  學分: { active: false, value: '', filterLogic: 'include', activeOptions: {} },
  英課: { active: false, value: '', filterLogic: 'include', activeOptions: {} },
};

export const COURSE_DAY_NAMES = WEEKDAY.map((day) => day.key);

export const WEBSITE_COLOR = {
  mainColor: '#009e96',
  mainDarkerColor: '#008e86',
  mainLighterColor: '#b2e2df',
  boxShadowColor: 'rgba(0, 158, 150, 0.25)',
};
