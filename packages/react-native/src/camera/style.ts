import { themes } from "@theme";
import { StyleSheet, ViewStyle } from "react-native";

interface Style {
  container: ViewStyle;
  camera: any;
}

export default (isRTL: boolean) =>
  StyleSheet.create<Style>({
    container: {
      flex: 1,
      position: "relative",
    },
    camera: {
      width: themes.device.width,
      height: themes.device.height,
    },
    absContainer: {
      width: themes.device.width,
      height: themes.device.height,
      position: "absolute",
      justifyContent: "center",
      alignItems: "center",
    },
    topContainer: {
      flex: 0.2,
      width: themes.device.width,
      paddingTop: themes.size(themes.device.statusBarHeight + 8),
      paddingHorizontal: themes.size(16),
      flexDirection: isRTL ? "row-reverse" : "row",
    },
    centerContainer: {
      flex: 0.5,
      width: "80%",
      justifyContent: "space-between",
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
      borderBottomLeftRadius: 15,
      borderBottomRightRadius: 15,
    },
    bottomContainer: {
      flex: 0.3,
      alignItems: "flex-end",
      justifyContent: "flex-end",
    },
    text: {
      color: themes.colors.white,
      paddingHorizontal: themes.size(10),
      fontSize: themes.size(16),
      flex: 1,
    },
    activeButton: {
      backgroundColor: themes.colors.white,
      borderRadius: themes.size(4),
      flex: 0.5,
      alignItems: "center",
      justifyContent: "center",
      margin: themes.size(4),
      height: themes.size(40),
    },
    inActiveButton: {
      flex: 0.5,
      alignItems: "center",
      justifyContent: "center",
      height: themes.size(40),
    },
    activeText: {
      color: themes.colors.text,
      paddingHorizontal: themes.size(10),
      fontSize: themes.size(12),
    },
    inActiveText: {
      color: themes.colors.white,
      paddingHorizontal: themes.size(10),
      fontSize: themes.size(12),
    },
    bottomBtnContainer: {
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: themes.colors.backgroundOverlay,
      marginBottom: themes.size(40),
      borderRadius: themes.size(4),
      flexDirection: isRTL ? "row-reverse" : "row",
      height: themes.size(48),
      width: "90%",
    },
    imageCorner: {
      width: themes.size(250),
      height: themes.size(250),
    },
    cornerTopLeft: {
      borderTopLeftRadius: 15,
      borderTopColor: themes.colors.white,
      borderTopWidth: themes.size(3),
      borderLeftColor: themes.colors.white,
      borderLeftWidth: themes.size(3),
      width: themes.size(30),
      height: themes.size(30),
    },
    cornerTopRight: {
      borderTopRightRadius: 15,
      borderTopColor: themes.colors.white,
      borderTopWidth: themes.size(3),
      borderRightColor: themes.colors.white,
      borderRightWidth: themes.size(3),
      width: themes.size(30),
      height: themes.size(30),
    },
    cornerBottomLeft: {
      borderTopLeftRadius: 15,
      borderTopColor: themes.colors.white,
      borderTopWidth: themes.size(3),
      borderLeftColor: themes.colors.white,
      borderLeftWidth: themes.size(3),
      width: themes.size(30),
      height: themes.size(30),
      transform: [{ rotate: "-90deg" }],
    },
    cornerBottomRight: {
      borderTopRightRadius: 15,
      borderTopColor: themes.colors.white,
      borderTopWidth: themes.size(3),
      borderRightColor: themes.colors.white,
      borderRightWidth: themes.size(3),
      width: themes.size(30),
      height: themes.size(30),
      transform: [{ rotate: "90deg" }],
    },
    topCorner: {
      width: "100%",
      height: themes.size(40),
      justifyContent: "space-between",
      flexDirection: "row",
      alignItems: "flex-start",
    },
    bottomCorner: {
      width: "100%",
      height: themes.size(40),
      justifyContent: "space-between",
      flexDirection: "row",
      alignItems: "flex-end",
    },
  });
