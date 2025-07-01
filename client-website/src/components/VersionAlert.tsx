import { Component } from 'react';
import { Alert, Button } from 'react-bootstrap';
import { InfoCircle, X } from 'react-bootstrap-icons';
import styled from 'styled-components';

import { WEBSITE_COLOR } from '../config';

const StyledAlert = styled(Alert)`
  margin: 0;
  border-radius: 0;
  border: none;
  border-bottom: 2px solid ${WEBSITE_COLOR.mainColor};
  background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
  color: #1565c0;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1050;

  .alert-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .alert-message {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex: 1;
    min-width: 300px;
  }

  .alert-actions {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .btn-primary {
    background-color: ${WEBSITE_COLOR.mainColor};
    border-color: ${WEBSITE_COLOR.mainColor};
    font-weight: 600;

    &:hover,
    &:focus {
      background-color: ${WEBSITE_COLOR.mainDarkerColor};
      border-color: ${WEBSITE_COLOR.mainDarkerColor};
    }
  }

  .btn-close {
    background: none;
    border: none;
    color: #1565c0;
    font-size: 1.2rem;
    padding: 0.25rem;

    &:hover {
      color: #0d47a1;
    }
  }

  @media (max-width: 768px) {
    .alert-content {
      flex-direction: column;
      align-items: stretch;
    }

    .alert-message {
      min-width: auto;
      justify-content: center;
      text-align: center;
    }

    .alert-actions {
      justify-content: center;
    }
  }
`;

interface VersionAlertProps {
  onVisibilityChange?: (show: boolean) => void;
}

interface VersionAlertState {
  show: boolean;
}

class VersionAlert extends Component<VersionAlertProps, VersionAlertState> {
  private readonly STORAGE_KEY = 'v6VersionAlertDismissed';
  private readonly STORAGE_TIMESTAMP_KEY = 'v6VersionAlertDismissedTimestamp';
  private readonly ALERT_VERSION = 'v6-announcement-2025';
  private readonly DISMISS_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  state: VersionAlertState = {
    show: false,
  };

  componentDidMount() {
    const dismissed = localStorage.getItem(this.STORAGE_KEY);
    const dismissedTimestamp = localStorage.getItem(this.STORAGE_TIMESTAMP_KEY);
    const dismissedVersion = localStorage.getItem(
      `${this.STORAGE_KEY}_version`,
    );

    let shouldShow = true;

    // Check if alert was dismissed and if the dismissal is still valid (within 24 hours)
    if (
      dismissed === 'true' &&
      dismissedTimestamp &&
      dismissedVersion === this.ALERT_VERSION
    ) {
      const dismissedTime = parseInt(dismissedTimestamp, 10);
      const currentTime = Date.now();
      const timeDifference = currentTime - dismissedTime;

      // If less than 24 hours have passed since dismissal, don't show the alert
      if (timeDifference < this.DISMISS_DURATION_MS) {
        shouldShow = false;
      }
    }

    // Always show if it's a new version of the alert
    if (dismissedVersion !== this.ALERT_VERSION) {
      shouldShow = true;
    }

    this.setState({ show: shouldShow });

    // Notify parent component about initial visibility
    if (this.props.onVisibilityChange) {
      this.props.onVisibilityChange(shouldShow);
    }
  }

  handleClose = () => {
    this.setState({ show: false });

    // Store dismissal with current timestamp
    const currentTime = Date.now();
    localStorage.setItem(this.STORAGE_KEY, 'true');
    localStorage.setItem(this.STORAGE_TIMESTAMP_KEY, currentTime.toString());
    localStorage.setItem(`${this.STORAGE_KEY}_version`, this.ALERT_VERSION);

    // Notify parent component about visibility change
    if (this.props.onVisibilityChange) {
      this.props.onVisibilityChange(false);
    }
  };

  handleVisitV6 = () => {
    window.open(
      'https://nsysu-opendev.github.io/NSYSUCourseSelectorV6/',
      '_blank',
      'noopener,noreferrer',
    );
    // Don't auto-close the alert when visiting v6, let user manually close it
  };

  render() {
    if (!this.state.show) {
      return null;
    }

    return (
      <StyledAlert variant='info' className='mb-0'>
        <div className='alert-content'>
          <div className='alert-message'>
            <InfoCircle size={20} />
            <span>
              <strong>🎉 全新版本上線！</strong>
              中山選課助手 v6 系列現已推出，提供更優質的使用者體驗！
            </span>
          </div>
          <div className='alert-actions'>
            <Button variant='primary' size='sm' onClick={this.handleVisitV6}>
              立即體驗 v6
            </Button>
            <button
              type='button'
              className='btn-close'
              onClick={this.handleClose}
              aria-label='關閉'
            >
              <X size={27} />
            </button>
          </div>
        </div>
      </StyledAlert>
    );
  }
}

export default VersionAlert;
