// Mock react-native-vision-camera
jest.mock('react-native-vision-camera', () => ({
  Camera: 'Camera',
  useCameraDevice: jest.fn(() => ({
    id: 'mock-camera',
    position: 'back',
    hasFlash: true,
  })),
  useCodeScanner: jest.fn(() => ({
    codeTypes: ['qr'],
    onCodeScanned: jest.fn(),
  })),
}));

// Mock react-native
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return {
    ...RN,
    Alert: {
      alert: jest.fn(),
    },
  };
});
