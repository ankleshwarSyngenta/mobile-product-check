import { StyleSheet } from 'react-native';

export const CAMERA_COLORS = {
  white: '#FFFFFF',
  overlay: 'rgba(0,0,0,0.65)',
  text: '#111827',
  accent: '#22d3ee',
  muted: '#94a3b8',
};

const size = (value: number) => value;

interface CameraStyleOptions {
  width: number;
  height: number;
  isRTL: boolean;
}

export default function createStyles({ width, height, isRTL }: CameraStyleOptions) {
  return StyleSheet.create({
    container: {
      flex: 1,
      position: 'relative',
      backgroundColor: '#000',
    },
    camera: {
      width,
      height,
    },
    absContainer: {
      width,
      height,
      position: 'absolute',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: size(16),
    },
    topContainer: {
      width,
      paddingTop: size(24),
      paddingHorizontal: size(16),
      flexDirection: isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    centerContainer: {
      width: '80%',
      height: height * 0.4,
      justifyContent: 'space-between',
    },
    bottomContainer: {
      width,
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    text: {
      color: CAMERA_COLORS.white,
      paddingHorizontal: size(10),
      fontSize: size(16),
      flex: 1,
      textAlign: 'center',
    },
    activeButton: {
      backgroundColor: CAMERA_COLORS.white,
      borderRadius: size(4),
      flex: 0.5,
      alignItems: 'center',
      justifyContent: 'center',
      margin: size(4),
      height: size(40),
    },
    inActiveButton: {
      flex: 0.5,
      alignItems: 'center',
      justifyContent: 'center',
      height: size(40),
    },
    activeText: {
      color: CAMERA_COLORS.text,
      paddingHorizontal: size(10),
      fontSize: size(14),
      fontWeight: '600',
    },
    inActiveText: {
      color: CAMERA_COLORS.white,
      paddingHorizontal: size(10),
      fontSize: size(14),
    },
    bottomBtnContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: CAMERA_COLORS.overlay,
      marginBottom: size(32),
      borderRadius: size(6),
      flexDirection: isRTL ? 'row-reverse' : 'row',
      height: size(52),
      width: '90%',
    },
    topCorner: {
      width: '100%',
      height: size(40),
      justifyContent: 'space-between',
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    bottomCorner: {
      width: '100%',
      height: size(40),
      justifyContent: 'space-between',
      flexDirection: 'row',
      alignItems: 'flex-end',
    },
    cornerTopLeft: {
      borderTopLeftRadius: 15,
      borderTopColor: CAMERA_COLORS.white,
      borderTopWidth: size(3),
      borderLeftColor: CAMERA_COLORS.white,
      borderLeftWidth: size(3),
      width: size(30),
      height: size(30),
    },
    cornerTopRight: {
      borderTopRightRadius: 15,
      borderTopColor: CAMERA_COLORS.white,
      borderTopWidth: size(3),
      borderRightColor: CAMERA_COLORS.white,
      borderRightWidth: size(3),
      width: size(30),
      height: size(30),
    },
    cornerBottomLeft: {
      borderTopLeftRadius: 15,
      borderTopColor: CAMERA_COLORS.white,
      borderTopWidth: size(3),
      borderLeftColor: CAMERA_COLORS.white,
      borderLeftWidth: size(3),
      width: size(30),
      height: size(30),
      transform: [{ rotate: '-90deg' }],
    },
    cornerBottomRight: {
      borderTopRightRadius: 15,
      borderTopColor: CAMERA_COLORS.white,
      borderTopWidth: size(3),
      borderRightColor: CAMERA_COLORS.white,
      borderRightWidth: size(3),
      width: size(30),
      height: size(30),
      transform: [{ rotate: '90deg' }],
    },
  });
}
