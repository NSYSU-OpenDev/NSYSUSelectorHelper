import React, { Component } from 'react';
import styled from 'styled-components';
import { Col, Row } from 'react-bootstrap';
import { ArrowBarRight, ArrowBarLeft } from 'react-bootstrap-icons';
import ReactGA from 'react-ga4';

import Header from './components/Header';
import LoadingSpinner from './components/LoadingSpinner';
import ScheduleTable from './components/ScheduleTable';
import SelectorSetting from './components/SelectorSetting';
import EntryNotification from './components/EntryNotification';
import VersionAlert from './components/VersionAlert';
import type {
  AcademicYear,
  Course,
  CourseDataFilesInfo,
  TimeSlot,
} from './types';
import { NSYSUCourseAPIOld } from '@/api/NSYSUCourseAPIOld.ts';
import { NSYSUCourseAPI } from '@/api/NSYSUCourseAPI.ts';
import { mapNewApiToOldApiFormat } from '@/utils';

const TRACKING_ID = 'G-38C3BQTTSC'; // your Measurement ID

const MainContent = styled.main`
  margin-top: 68px;
  margin-bottom: 10px;
`;

const SlideColContainer = styled(Col)`
  transition: margin 0.5s;

  @media (min-width: 992px) {
    max-height: 88vh;
    overflow-y: auto;
  }
`;

const FixedHeightCol = styled(Col)`
  @media (min-width: 992px) {
    max-height: 88vh;
    overflow-y: auto;
  }
`;

// Cellery: 收合「顯示課表」按鈕
const ToggleButton = styled.button`
  position: fixed;
  z-index: 100;
  left: -2rem;
  top: 50%;
  transform: translateY(-50%);
  transition:
    left 0.1s,
    opacity 0.1s;
  opacity: 0.5;
  border-radius: 0 0.375rem 0.375rem 0;
  height: 10rem;
  width: 1rem;

  &:hover {
    opacity: 0.8;
    left: 0;
  }
`;

interface AppState {
  loading: string | null;
  isCollapsed: boolean;
  currentTab: string;
  courses: Course[];
  selectedCourses: Set<Course>;
  hoveredCourseId: string | null;
  currentCourseHistoryData: string;
  latestCourseHistoryData: string;
  availableCourseHistoryData: CourseDataFilesInfo[];
  searchTimeSlot: TimeSlot[];
  experimentalFeatures: {
    useNewApi: boolean;
    selectedSemester: string;
    availableSemesters: AcademicYear;
  };
  clickedCourseId?: string | null;
  showVersionAlert: boolean;
}

class App extends Component<{}, AppState> {
  state = {
    loading: '資料',
    isCollapsed: false,
    currentTab: '公告',
    courses: [],
    selectedCourses: new Set<Course>(),
    hoveredCourseId: null,
    currentCourseHistoryData: '',
    latestCourseHistoryData: '',
    availableCourseHistoryData: [],
    searchTimeSlot: [],
    experimentalFeatures: {
      useNewApi: true,
      selectedSemester: '',
      availableSemesters: {
        latest: '',
        history: {},
      },
    },
    clickedCourseId: null,
    showVersionAlert: true, // Default to true, will be updated by VersionAlert component
  };

  componentDidMount() {
    //ga4 init
    ReactGA.initialize(TRACKING_ID);
    ReactGA.send({ hitType: 'pageview' });

    // 移除靜態載入畫面
    const loadingScreen = document.getElementById('loading');
    if (loadingScreen) {
      loadingScreen.style.display = 'none';
    }

    void this.initCourseData();
  }

  async componentDidUpdate(
    _prevProps: Readonly<{}>,
    prevState: Readonly<AppState>,
  ) {
    if (!prevState.experimentalFeatures.useNewApi) {
      return;
    }

    if (
      this.state.experimentalFeatures.selectedSemester !==
      prevState.experimentalFeatures.selectedSemester
    ) {
      void this.updateCourseWithNewApi();
    }
  }

  /**
   * 初始化課程資料
   */
  initCourseData = async () => {
    this.startLoading('資料');
    if (!this.state.experimentalFeatures.useNewApi) {
      const latestFiles = await NSYSUCourseAPIOld.getAvailableSemesters();
      this.setState({ availableCourseHistoryData: latestFiles });

      if (latestFiles.length > 0) {
        // Fetch the content of the latest file
        const latestFile = latestFiles.sort((a, b) =>
          b.name.localeCompare(a.name),
        )[0];
        this.setState({ currentCourseHistoryData: latestFile.name });
        this.setState({ latestCourseHistoryData: latestFile.name });
        const uniqueResults =
          await NSYSUCourseAPIOld.getSemesterUpdates(latestFile);
        this.setState({ courses: uniqueResults }, this.loadSelectedCourses);
      }
    } else {
      const semesters = await NSYSUCourseAPI.getAvailableSemesters();
      this.setState(
        {
          experimentalFeatures: {
            ...this.state.experimentalFeatures,
            availableSemesters: semesters,
            selectedSemester: semesters.latest,
          },
        },
        this.updateCourseWithNewApi,
      );
    }
    this.endLoading();

    // whats2000: 處理網址 hash 應自動切換至對應頁面
    const hash = decodeURI(window.location.hash);

    if (
      hash &&
      ['#所有課程', '#學期必修', '#課程偵探', '#已選匯出', '#公告'].includes(
        hash,
      )
    ) {
      this.setState({ currentTab: hash.slice(1) });
    }
  };

  updateCourseWithNewApi = async () => {
    // Fetch the content of the selected semester
    this.startLoading('資料');
    try {
      const updatedData = await NSYSUCourseAPI.getSemesterUpdates(
        this.state.experimentalFeatures.selectedSemester,
      );
      const courses = await NSYSUCourseAPI.getCourses(
        this.state.experimentalFeatures.selectedSemester,
        updatedData.latest,
      );
      const mapCourses = courses.map((course) =>
        mapNewApiToOldApiFormat(course),
      );
      this.setState({ courses: mapCourses }, this.loadSelectedCourses);
    } catch (e) {
      console.error(e);
    }
    this.endLoading();
  };

  /**
   * 轉換版本
   * @param version {Object} 版本
   */
  switchVersion = async (version: CourseDataFilesInfo) => {
    this.startLoading('資料');

    if (!this.state.experimentalFeatures.useNewApi) {
      // Fetch the csv file content
      const uniqueResults = await NSYSUCourseAPIOld.getSemesterUpdates(version);
      this.setState(
        {
          courses: uniqueResults,
          currentCourseHistoryData: version.name,
        },
        this.loadSelectedCourses,
      );
    }

    this.endLoading();
  };

  /**
   * 處理學期變更
   * @param semester {string} 學期
   */
  onSemesterChange = (semester: string) => {
    this.setState({
      experimentalFeatures: {
        ...this.state.experimentalFeatures,
        selectedSemester: semester,
      },
    });
  };

  /**
   * 切換實驗性功能
   */
  toggleExperimentalFeatures = () => {
    this.setState(
      (prevState) => ({
        experimentalFeatures: {
          ...prevState.experimentalFeatures,
          useNewApi: !prevState.experimentalFeatures.useNewApi,
        },
      }),
      this.initCourseData,
    );
  };

  /**
   * 轉換版本資訊成可閱讀的格式
   * @param version
   */
  convertVersion = (version: string) => {
    // Cellery: Regular expression to extract parts of the version string
    // all_classes_SSSS_YYYYMMDD.csv, SSSS is semester code.
    const regex = /all_classes_(\d{3})([123])_(\d{4})(\d{2})(\d{2})\.csv/;
    const match = version.match(regex);

    // Return the original string if it doesn't match the expected format
    if (!match) return version;

    const [, academicYear, semesterCode, year, month, day] = match;

    // Convert the academic year and semester code to a readable format
    const semesterText =
      semesterCode === '1' ? '上' : semesterCode === '2' ? '下' : '暑';
    const formattedAcademicYear = `${parseInt(academicYear, 10)}`;

    // Format the update date
    const formattedDate = `${year}${month}${day} 資料`;

    return (
      <>
        {formattedAcademicYear}
        {semesterText}
        <span className='version-formattedDate'>{formattedDate}</span>
      </>
    );
  };

  /**
   * 載入已選課程
   */
  loadSelectedCourses = () => {
    const savedSelectedCoursesNumbers = localStorage.getItem(
      'selectedCoursesNumbers',
    );
    if (!savedSelectedCoursesNumbers) return;

    const selectedCourseNumbers = new Set(
      JSON.parse(savedSelectedCoursesNumbers),
    );
    const selectedCourses = new Set(
      this.state.courses.filter((course) =>
        selectedCourseNumbers.has(course['Number']),
      ),
    );
    this.setState({ selectedCourses });
  };

  /**
   * 切換課表顯示狀態
   */
  toggleSchedule = () => {
    this.setState((prevState) => ({
      isCollapsed: !prevState.isCollapsed,
    }));

    // whats2000: 修復手機版課表收折行為改成滑動
    if (window.innerWidth >= 992) return;

    if (this.state.isCollapsed) {
      // 滑動到頂部
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // 滑動到功能區
      const scheduleSetting = document.getElementById('schedule-setting');
      if (scheduleSetting) {
        scheduleSetting.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  /**
   * 切換設定頁面
   */
  handleTabChange = (tab: string) => {
    this.setState({ currentTab: tab });
  };

  /**
   * 處理課程選取
   * @param course {Course} 課程資料
   * @param isSelected {boolean} 是否選取
   */
  handleCourseSelect = (course: Course, isSelected: boolean) => {
    this.setState((prevState) => {
      const selectedCourses = new Set(prevState.selectedCourses);
      if (isSelected) {
        selectedCourses.add(course);
      } else {
        selectedCourses.delete(course);
      }

      localStorage.setItem(
        'selectedCoursesNumbers',
        JSON.stringify(Array.from(selectedCourses).map((c) => c['Number'])),
      );

      return { selectedCourses };
    });
  };

  /**
   * 處理清除所有已選課程的事件
   */
  handleClearAllSelectedCourses = () => {
    localStorage.removeItem('selectedCoursesNumbers');

    this.setState({ selectedCourses: new Set() });
  };

  /**
   * 處理課程滑鼠移入
   * @param courseId {string | null} 課程 ID
   */
  handleCourseHover = (courseId: string | null) => {
    this.setState({ hoveredCourseId: courseId });
  };

  /**
   * 切換課程時間選取狀態
   * @param timeSlot {TimeSlot} 時間格子
   */
  toggleSearchTimeSlot = (timeSlot: TimeSlot) => {
    const { searchTimeSlot } = this.state;

    const searchTimeSlotIndex = searchTimeSlot.findIndex(
      (slot: TimeSlot) =>
        slot.weekday === timeSlot.weekday &&
        slot.timeSlot === timeSlot.timeSlot,
    );

    if (searchTimeSlotIndex === -1) {
      this.setState((prevState) => ({
        searchTimeSlot: [...prevState.searchTimeSlot, timeSlot],
      }));
    } else {
      this.setState((prevState) => ({
        searchTimeSlot: prevState.searchTimeSlot.filter(
          (_slot, index) => index !== searchTimeSlotIndex,
        ),
      }));
    }
  };

  /**
   * 開始載入
   * @param loadingName {string} 載入名稱
   */
  startLoading = (loadingName: string) => {
    this.setState({ loading: loadingName });
  };

  /**
   * 結束載入
   */
  endLoading = () => {
    this.setState({ loading: null });
  };

  // whats2000: 新增處理課程點擊事件
  /**
   * 處理課程點擊
   * @param course {Course} 課程資料
   */
  onCourseClick = (course: Course) => {
    this.setState({ clickedCourseId: course.Number });
  };

  /**
   * 處理版本提醒顯示狀態變更
   * @param show {boolean} 是否顯示版本提醒
   */
  onVersionAlertVisibilityChange = (show: boolean) => {
    this.setState({ showVersionAlert: show });
  };

  /**
   * 渲染元件
   * @returns {React.ReactNode} 元件
   */
  render(): React.ReactNode {
    const {
      isCollapsed,
      currentTab,
      courses,
      selectedCourses,
      hoveredCourseId,
      currentCourseHistoryData,
      latestCourseHistoryData,
      availableCourseHistoryData,
      loading,
      searchTimeSlot,
      clickedCourseId,
      showVersionAlert,
    } = this.state;
    const slideStyle = {
      marginLeft: isCollapsed ? (window.innerWidth >= 992 ? '-50%' : '0') : '0',
    };

    return (
      <>
        <Header
          currentTab={currentTab}
          onTabChange={this.handleTabChange}
          currentCourseHistoryData={currentCourseHistoryData}
          availableCourseHistoryData={availableCourseHistoryData}
          switchVersion={this.switchVersion}
          convertVersion={this.convertVersion}
          toggleExperimentalFeatures={this.toggleExperimentalFeatures}
          isExperimentalFeaturesEnabled={
            this.state.experimentalFeatures.useNewApi
          }
          selectedSemester={this.state.experimentalFeatures.selectedSemester}
          availableSemesters={
            this.state.experimentalFeatures.availableSemesters
          }
          onSemesterChange={this.onSemesterChange}
        />
        <VersionAlert
          onVisibilityChange={this.onVersionAlertVisibilityChange}
        />
        <EntryNotification />
        {loading && <LoadingSpinner loadingName={loading} />}
        {/* bookmark */}
        <ToggleButton
          className='btn toggle-schedule-btn btn-secondary w-auto'
          onClick={this.toggleSchedule}
        >
          {isCollapsed ? <ArrowBarRight /> : <ArrowBarLeft />}
        </ToggleButton>

        <MainContent
          id='app'
          className={`container-fluid ${showVersionAlert ? 'with-version-alert' : ''}`}
        >
          <Row className='d-flex flex-wrap'>
            <SlideColContainer
              style={slideStyle}
              className='d-flex flex-column'
              lg={6}
            >
              <ScheduleTable
                selectedCourses={selectedCourses}
                currentTab={currentTab}
                handleCourseSelect={this.handleCourseSelect}
                hoveredCourseId={hoveredCourseId}
                onCourseHover={this.handleCourseHover}
                searchTimeSlot={searchTimeSlot}
                toggleSearchTimeSlot={this.toggleSearchTimeSlot}
                onCourseClick={this.onCourseClick}
              />
            </SlideColContainer>

            <FixedHeightCol
              className='d-flex flex-column'
              id='schedule-setting'
            >
              <SelectorSetting
                isCollapsed={isCollapsed}
                currentTab={currentTab}
                courses={courses}
                selectedCourses={selectedCourses}
                hoveredCourseId={hoveredCourseId}
                onCourseSelect={this.handleCourseSelect}
                onClearAllSelectedCourses={this.handleClearAllSelectedCourses}
                onCourseHover={this.handleCourseHover}
                latestCourseHistoryData={latestCourseHistoryData}
                convertVersion={this.convertVersion}
                searchTimeSlot={searchTimeSlot}
                clickedCourseId={clickedCourseId}
              />
            </FixedHeightCol>
          </Row>
        </MainContent>
      </>
    );
  }
}

export default App;
