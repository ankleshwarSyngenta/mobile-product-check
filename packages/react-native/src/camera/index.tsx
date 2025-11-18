import React, { useState, useEffect, useMemo } from "react";
import { Pressable, View } from "react-native";
import { useStyle } from "@hooks";
import { useAppState } from "@react-native-community/hooks";
import { Text } from "@shared-components";
import { themes } from "@theme";
import {
  Camera,
  CameraDevice,
  Code,
  useCameraDevices,
  useCodeScanner,
} from "react-native-vision-camera";
import { SvgImages } from "@images";
import style from "./style";
import { SCAN_TYPE } from "@shared-constants";
import { TEST_IDS } from "@packages/tests/testIDConstants";
import find from "lodash/find";

interface ICameraUIProps {
  headerLabel?: string;
  scanCodeLabel: string;
  enterCodeLabel: string;
  handleOnCloseClick?: () => void;
  handleOnBottomViewClick?: (type: SCAN_TYPE) => void;
  handleOnScanResult?: (result: Code[]) => void;
  isCameraReady?: boolean;
  isFocused?: boolean;
  isInputModalClosed?: boolean;
  testID: string;
}

export const CameraUI: React.FC<ICameraUIProps> = ({
  headerLabel,
  scanCodeLabel,
  enterCodeLabel,
  isCameraReady = false,
  isFocused = false,
  isInputModalClosed = false,
  handleOnCloseClick,
  handleOnBottomViewClick,
  handleOnScanResult,
  testID,
}) => {
  const styles = useStyle(style);
  const devices: CameraDevice[] = useCameraDevices();
  const device: CameraDevice | undefined = useMemo(
    () => find(devices, (item: CameraDevice) => item.position === "back"),
    [devices],
  );
  const appState = useAppState();
  const codeScanner = useCodeScanner({
    codeTypes: [
      "code-128",
      "code-39",
      "code-93",
      "codabar",
      "ean-13",
      "ean-8",
      "itf",
      "upc-e",
      "upc-a",
      "qr",
      "pdf-417",
      "aztec",
      "data-matrix",
    ],
    onCodeScanned: (codes) => {
      if (handleOnScanResult) {
        handleOnScanResult(codes);
      }
    },
  });
  const [activeBtn, setActiveBtn] = useState<SCAN_TYPE>(SCAN_TYPE.SCAN_CODE);
  const [isTorchEnabled, setIsTorchEnabled] = useState<boolean>(false);

  useEffect(() => {
    if (isFocused) {
      setActiveBtn(SCAN_TYPE.SCAN_CODE);
      setIsTorchEnabled(false);
    }
  }, [isFocused]);

  useEffect(() => {
    if (isInputModalClosed) {
      setActiveBtn(SCAN_TYPE.SCAN_CODE);
    }
  }, [isInputModalClosed]);

  const handleToggleClick = (type: SCAN_TYPE) => {
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
          isActive={appState === "active"}
          focusable={true}
          exposure={0}
          codeScanner={codeScanner}
          torch={device && device?.hasTorch && isTorchEnabled ? "on" : "off"}
          photoQualityBalance={"speed"}
        />
      )}
      <View style={styles.absContainer}>
        <View style={styles.topContainer}>
          <Pressable testID={"closeButton"} onPress={handleOnCloseClick}>
            <SvgImages.Close
              width={themes.size(24)}
              fill={themes.colors.white}
              height={themes.size(24)}
            />
          </Pressable>
          <Text numberOfLines={1} font={"bold"} style={styles.text}>
            {headerLabel}
          </Text>
          {device?.hasTorch && (
            <Pressable testID={"flashlightButton"} onPress={handleFlashClick}>
              <SvgImages.Flashlight
                color={themes.colors.white}
                width={themes.size(24)}
                height={themes.size(24)}
              />
            </Pressable>
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
              onPress={() => handleToggleClick(SCAN_TYPE.SCAN_CODE)}
              style={
                activeBtn === SCAN_TYPE.SCAN_CODE
                  ? styles.activeButton
                  : styles.inActiveButton
              }
            >
              <Text
                font={"semi"}
                style={
                  activeBtn === SCAN_TYPE.SCAN_CODE
                    ? styles.activeText
                    : styles.inActiveText
                }
              >
                {scanCodeLabel}
              </Text>
            </Pressable>
            <Pressable
              testID={TEST_IDS.SCAN_TAB_INPUT}
              onPress={() => handleToggleClick(SCAN_TYPE.ENTER_CODE)}
              style={
                activeBtn === SCAN_TYPE.ENTER_CODE
                  ? styles.activeButton
                  : styles.inActiveButton
              }
            >
              <Text
                font={"semi"}
                style={
                  activeBtn === SCAN_TYPE.ENTER_CODE
                    ? styles.activeText
                    : styles.inActiveText
                }
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
