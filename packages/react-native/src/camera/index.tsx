import React, { useState, useEffect, useMemo } from 'react';
import {
  AppState,
  AppStateStatus,
  I18nManager,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {
  Camera,
  CameraDevice,
  Code,
  useCameraDevices,
  useCodeScanner,
} from 'react-native-vision-camera';
import createStyles, { CAMERA_COLORS } from './style';

export enum ScanType {
  SCAN_CODE = 'SCAN_CODE',
  ENTER_CODE = 'ENTER_CODE',
}

export const TEST_IDS = {
  SCAN_TAB_SCAN: 'scan-tab-scan',
  SCAN_TAB_INPUT: 'scan-tab-input',
} as const;

const useAppState = () => {
  const [state, setState] = useState<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', setState);
    return () => subscription.remove();
  }, []);

  return state;
};

const ICON_SIZE = 24;

interface IconButtonProps {
  label: string;
  onPress?: () => void;
  testID?: string;
}

const IconButton: React.FC<IconButtonProps> = ({ label, onPress, testID }) => (
  <Pressable accessibilityRole="button" onPress={onPress} testID={testID}>
    <Text style={{ fontSize: ICON_SIZE, color: CAMERA_COLORS.white }}>{label}</Text>
  </Pressable>
);

interface ICameraUIProps {
  headerLabel?: string;
  scanCodeLabel: string;
  enterCodeLabel: string;
  handleOnCloseClick?: () => void;
  handleOnBottomViewClick?: (type: ScanType) => void;
  handleOnScanResult?: (result: Code[]) => void;
  isCameraReady?: boolean;
  isFocused?: boolean;
  isInputModalClosed?: boolean;
  testID: string;
}

export const CameraUI: React.FC<ICameraUIProps> = ({
  headerLabel = 'Product Check',
  scanCodeLabel = 'Scan code',
  enterCodeLabel = 'Enter code',
  isCameraReady = false,
  isFocused = false,
  isInputModalClosed = false,
  handleOnCloseClick,
  handleOnBottomViewClick,
  handleOnScanResult,
  testID,
}) => {
  const { width, height } = useWindowDimensions();
  const isRTL = I18nManager.isRTL;
  const styles = useMemo(() => createStyles({ width, height, isRTL }), [width, height, isRTL]);
  const devices: CameraDevice[] = useCameraDevices();
  const device: CameraDevice | undefined = useMemo(
    () => devices.find((item: CameraDevice) => item.position === 'back'),
    [devices]
  );
  const appState = useAppState();
  const codeScanner = useCodeScanner({
    codeTypes: [
      'code-128',
      'code-39',
      'code-93',
      'codabar',
      'ean-13',
      'ean-8',
      'itf',
      'upc-e',
      'upc-a',
      'qr',
      'pdf-417',
      'aztec',
      'data-matrix',
    ],
    onCodeScanned: (codes) => {
      if (handleOnScanResult) {
        handleOnScanResult(codes);
      }
    },
  });
  const [activeBtn, setActiveBtn] = useState<ScanType>(ScanType.SCAN_CODE);
  const [isTorchEnabled, setIsTorchEnabled] = useState<boolean>(false);

  useEffect(() => {
    if (isFocused) {
      setActiveBtn(ScanType.SCAN_CODE);
      setIsTorchEnabled(false);
    }
  }, [isFocused]);

  useEffect(() => {
    if (isInputModalClosed) {
      setActiveBtn(ScanType.SCAN_CODE);
    }
  }, [isInputModalClosed]);

  const handleToggleClick = (type: ScanType) => {
    if (handleOnBottomViewClick) {
      handleOnBottomViewClick(type);
    }
    setActiveBtn(type);
  };

  const handleFlashClick = () => {
    setIsTorchEnabled(!isTorchEnabled);
  };

  return (
    <View style={styles.container} testID={testID}>
      {isCameraReady && device && devices?.length > 0 && (
        <Camera
          style={styles.camera}
          device={device}
          isActive={appState === 'active'}
          focusable={true}
          codeScanner={codeScanner}
          torch={device && device?.hasTorch && isTorchEnabled ? 'on' : 'off'}
        />
      )}
      <View style={styles.absContainer}>
        <View style={styles.topContainer}>
          <IconButton label="×" onPress={handleOnCloseClick} testID="closeButton" />
          <Text numberOfLines={1} style={styles.text}>
            {headerLabel}
          </Text>
          {device?.hasTorch && (
            <IconButton
              label={isTorchEnabled ? '🔦' : '💡'}
              onPress={handleFlashClick}
              testID="flashlightButton"
            />
          )}
        </View>
        <View style={styles.centerContainer}>
          <View style={styles.topCorner}>
            <View style={styles.cornerTopLeft} />
            <View style={styles.cornerTopRight} />
          </View>
          <View style={styles.bottomCorner}>
            <View style={styles.cornerBottomLeft} />
            <View style={styles.cornerBottomRight} />
          </View>
        </View>
        <View style={styles.bottomContainer}>
          <View style={styles.bottomBtnContainer}>
            <Pressable
              testID={TEST_IDS.SCAN_TAB_SCAN}
              onPress={() => handleToggleClick(ScanType.SCAN_CODE)}
              style={activeBtn === ScanType.SCAN_CODE ? styles.activeButton : styles.inActiveButton}
            >
              <Text
                style={activeBtn === ScanType.SCAN_CODE ? styles.activeText : styles.inActiveText}
              >
                {scanCodeLabel}
              </Text>
            </Pressable>
            <Pressable
              testID={TEST_IDS.SCAN_TAB_INPUT}
              onPress={() => handleToggleClick(ScanType.ENTER_CODE)}
              style={
                activeBtn === ScanType.ENTER_CODE ? styles.activeButton : styles.inActiveButton
              }
            >
              <Text
                style={activeBtn === ScanType.ENTER_CODE ? styles.activeText : styles.inActiveText}
              >
                {enterCodeLabel}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
};
