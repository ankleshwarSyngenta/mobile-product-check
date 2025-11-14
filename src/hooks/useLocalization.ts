import { useState, useEffect } from 'react';
import i18n from 'i18next';
import { LocaleStrings } from '../types';

// Default English translations
const defaultTranslations: LocaleStrings = {
  scanPrompt: 'Point camera at product QR code to scan',
  scanningInProgress: 'Scanning...',
  productAuthentic: 'This product is authentic and registered with Syngenta.',
  productName: 'Product Name',
  serialNumber: 'Serial Number',
  producedDate: 'Produced Date',
  expiryDate: 'Expiry Date',
  batchNumber: 'Batch Number',
  rawMaterialBatchNumber: 'Raw Material Batch Number',
  manufacturer: 'Manufacturer',
  marketedBy: 'Marketed By',
  notAvailable: 'NA',
  nonSyngentaProduct: 'Non-Syngenta Product',
  counterfeitWarning: 'Potential Counterfeit Warning',
  counterfeitWarningMessage: 'This product has been scanned multiple times. Please verify with Syngenta if you have concerns about authenticity.',
  scanAnother: 'Scan Another Product',
  errorOccurred: 'An error occurred',
  cameraAccessDenied: 'Camera access denied. Please enable camera permissions in settings.',
  cameraNotAvailable: 'Camera not available on this device.',
  close: 'Close',
};

// Translation resources
const resources = {
  en: { translation: defaultTranslations },
  es: {
    translation: {
      scanPrompt: 'Apunte la cámara al código QR del producto para escanear',
      scanningInProgress: 'Escaneando...',
      productAuthentic: 'Este producto es auténtico y está registrado en Syngenta.',
      productName: 'Nombre del Producto',
      serialNumber: 'Número de Serie',
      producedDate: 'Fecha de Producción',
      expiryDate: 'Fecha de Vencimiento',
      batchNumber: 'Número de Lote',
      rawMaterialBatchNumber: 'Número de Lote de Materia Prima',
      manufacturer: 'Fabricante',
      marketedBy: 'Comercializado Por',
      notAvailable: 'No Disponible',
      nonSyngentaProduct: 'Producto No Syngenta',
      counterfeitWarning: 'Advertencia de Posible Falsificación',
      counterfeitWarningMessage: 'Este producto ha sido escaneado varias veces. Verifique con Syngenta si tiene dudas sobre su autenticidad.',
      scanAnother: 'Escanear Otro Producto',
      errorOccurred: 'Ocurrió un error',
      cameraAccessDenied: 'Acceso a la cámara denegado. Habilite los permisos de cámara en la configuración.',
      cameraNotAvailable: 'Cámara no disponible en este dispositivo.',
      close: 'Cerrar',
    },
  },
  pt: {
    translation: {
      scanPrompt: 'Aponte a câmera para o código QR do produto para escanear',
      scanningInProgress: 'Escaneando...',
      productAuthentic: 'Este produto é autêntico e está registrado na Syngenta.',
      productName: 'Nome do Produto',
      serialNumber: 'Número de Série',
      producedDate: 'Data de Produção',
      expiryDate: 'Data de Validade',
      batchNumber: 'Número do Lote',
      rawMaterialBatchNumber: 'Número do Lote de Matéria-Prima',
      manufacturer: 'Fabricante',
      marketedBy: 'Comercializado Por',
      notAvailable: 'Não Disponível',
      nonSyngentaProduct: 'Produto Não Syngenta',
      counterfeitWarning: 'Aviso de Possível Falsificação',
      counterfeitWarningMessage: 'Este produto foi escaneado várias vezes. Verifique com a Syngenta se tiver dúvidas sobre autenticidade.',
      scanAnother: 'Escanear Outro Produto',
      errorOccurred: 'Ocorreu um erro',
      cameraAccessDenied: 'Acesso à câmera negado. Habilite as permissões de câmera nas configurações.',
      cameraNotAvailable: 'Câmera não disponível neste dispositivo.',
      close: 'Fechar',
    },
  },
  fr: {
    translation: {
      scanPrompt: 'Pointez l\'appareil photo sur le code QR du produit pour scanner',
      scanningInProgress: 'Numérisation...',
      productAuthentic: 'Ce produit est authentique et enregistré chez Syngenta.',
      productName: 'Nom du Produit',
      serialNumber: 'Numéro de Série',
      producedDate: 'Date de Production',
      expiryDate: 'Date d\'Expiration',
      batchNumber: 'Numéro de Lot',
      rawMaterialBatchNumber: 'Numéro de Lot de Matière Première',
      manufacturer: 'Fabricant',
      marketedBy: 'Commercialisé Par',
      notAvailable: 'Non Disponible',
      nonSyngentaProduct: 'Produit Non-Syngenta',
      counterfeitWarning: 'Avertissement de Contrefaçon Potentielle',
      counterfeitWarningMessage: 'Ce produit a été scanné plusieurs fois. Vérifiez auprès de Syngenta si vous avez des doutes sur son authenticité.',
      scanAnother: 'Scanner un Autre Produit',
      errorOccurred: 'Une erreur s\'est produite',
      cameraAccessDenied: 'Accès à la caméra refusé. Veuillez activer les autorisations de caméra dans les paramètres.',
      cameraNotAvailable: 'Caméra non disponible sur cet appareil.',
      close: 'Fermer',
    },
  },
  de: {
    translation: {
      scanPrompt: 'Richten Sie die Kamera auf den QR-Code des Produkts zum Scannen',
      scanningInProgress: 'Scannen...',
      productAuthentic: 'Dieses Produkt ist authentisch und bei Syngenta registriert.',
      productName: 'Produktname',
      serialNumber: 'Seriennummer',
      producedDate: 'Herstellungsdatum',
      expiryDate: 'Verfallsdatum',
      batchNumber: 'Chargennummer',
      rawMaterialBatchNumber: 'Rohstoff-Chargennummer',
      manufacturer: 'Hersteller',
      marketedBy: 'Vermarktet Von',
      notAvailable: 'Nicht Verfügbar',
      nonSyngentaProduct: 'Nicht-Syngenta-Produkt',
      counterfeitWarning: 'Warnung vor möglicher Fälschung',
      counterfeitWarningMessage: 'Dieses Produkt wurde mehrmals gescannt. Überprüfen Sie bei Syngenta, wenn Sie Bedenken zur Echtheit haben.',
      scanAnother: 'Ein Anderes Produkt Scannen',
      errorOccurred: 'Ein Fehler ist aufgetreten',
      cameraAccessDenied: 'Kamerazugriff verweigert. Bitte aktivieren Sie Kameraberechtigungen in den Einstellungen.',
      cameraNotAvailable: 'Kamera auf diesem Gerät nicht verfügbar.',
      close: 'Schließen',
    },
  },
  zh: {
    translation: {
      scanPrompt: '将相机对准产品二维码进行扫描',
      scanningInProgress: '扫描中...',
      productAuthentic: '此产品是正品并已在先正达注册。',
      productName: '产品名称',
      serialNumber: '序列号',
      producedDate: '生产日期',
      expiryDate: '到期日期',
      batchNumber: '批号',
      rawMaterialBatchNumber: '原料批号',
      manufacturer: '制造商',
      marketedBy: '销售商',
      notAvailable: '不可用',
      nonSyngentaProduct: '非先正达产品',
      counterfeitWarning: '潜在假冒警告',
      counterfeitWarningMessage: '此产品已被多次扫描。如果您对真实性有疑虑，请与先正达核实。',
      scanAnother: '扫描另一个产品',
      errorOccurred: '发生错误',
      cameraAccessDenied: '相机访问被拒绝。请在设置中启用相机权限。',
      cameraNotAvailable: '此设备上没有相机。',
      close: '关闭',
    },
  },
};

// Initialize i18next
i18n.init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

/**
 * Custom hook for localization
 */
export const useLocalization = (locale?: string) => {
  const [currentLocale, setCurrentLocale] = useState(locale || 'en');

  useEffect(() => {
    if (locale) {
      i18n.changeLanguage(locale);
      setCurrentLocale(locale);
    }
  }, [locale]);

  const t = (key: string): string => {
    return i18n.t(key);
  };

  const changeLanguage = (newLocale: string) => {
    i18n.changeLanguage(newLocale);
    setCurrentLocale(newLocale);
  };

  return {
    t,
    currentLocale,
    changeLanguage,
  };
};

export default i18n;
