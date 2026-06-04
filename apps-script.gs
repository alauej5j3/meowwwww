/**
 * Google Apps Script for Meal Combination Generator
 * 
 * 部署步驟：
 * 1. 在 Google Sheets 中打開 Apps Script (擴充功能 > Apps Script)
 * 2. 複製此代碼到 Code.gs 中
 * 3. 運行 initializeSheet() 函數進行初始化
 * 4. 部署為網頁應用 (部署 > 新增部署 > 類型：網頁應用)
 * 5. 複製部署 URL 到前端 script.js 的 CONFIG.GAS_URL
 */

// ==================== 全域配置 ====================
const SHEET_NAMES = {
  MEALS: '餐點列表',
  PREFERENCES: '用戶偏好',
  HISTORY: '生成歷史'
};

const SPREADSHEET_ID = ''; // 替換為您的 Google Sheet ID

function getSpreadsheet() {
  return SPREADSHEET_ID ? SpreadsheetApp.openById(SPREADSHEET_ID) : SpreadsheetApp.getActiveSpreadsheet();
}

// ==================== 初始化 ====================

/**
 * 初始化 Google Sheet 結構
 * 第一次使用時執行此函數
 */
function initializeSheet() {
  const ss = getSpreadsheet();
  
  // 創建餐點列表工作表
  createMealsSheet(ss);
  
  // 創建用戶偏好工作表
  createPreferencesSheet(ss);
  
  // 創建歷史記錄工作表
  createHistorySheet(ss);
  
  Logger.log('初始化完成！');
}

function createMealsSheet(ss) {
  let sheet = ss.getSheetByName(SHEET_NAMES.MEALS);
  
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAMES.MEALS);
  } else {
    sheet.clear();
  }
  
  // 設置標題
  const headers = ['類型', '餐點名稱', '描述', '標籤', '建立時間'];
  sheet.appendRow(headers);
  
  // 格式化標題行
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#667eea');
  headerRange.setFontColor('white');
  
  // 設置列寬
  sheet.setColumnWidth(1, 80);
  sheet.setColumnWidth(2, 150);
  sheet.setColumnWidth(3, 200);
  sheet.setColumnWidth(4, 150);
  sheet.setColumnWidth(5, 150);
  
  // 添加示例數據
  const meals = [
    ['早餐', '蛋餅配豆漿', '台灣人氣早餐，蛋餅香脆又飽足', '快手餐,台灣傳統,含蛋', new Date()],
    ['早餐', '油條豆漿套餐', '經典台灣早餐，炸油條配溫豆漿', '傳統,飽足,素食', new Date()],
    ['早餐', '鮮奶麥片', '營養滿分的鮮奶麥片配水果', '健康,含乳製品,高纖維', new Date()],
    ['午餐', '滷肉飯', '滷汁香濃的軟飯配肉燥，台灣国民便當', '台灣傳統,飽足,含豬肉', new Date()],
    ['午餐', '牛肉麵', '麻辣香辛的牛肉湯頭，配上嫩彈牛肉', '重口味,台灣經典,含牛肉', new Date()],
    ['午餐', '素食便當', '豆製品和新鮮蔬菜的營養組合', '清淡,素食,健康', new Date()],
    ['晚餐', '海鮮火鍋', '冬天最暖胃的選擇，涮涮樂享受鮮美', '豐盛,溫暖,含海鮮', new Date()],
    ['晚餐', '素食火鍋', '各式新鮮蔬菜和豆製品的素食火鍋', '素食,溫暖,健康', new Date()],
    ['晚餐', '蚵仔煎配甜辣醬', '牡蠣飽滿鮮美，配上甜辣醬絕了', '台灣小吃,經典,含海鮮', new Date()]
  ];
  
  meals.forEach(meal => sheet.appendRow(meal));
}

function createPreferencesSheet(ss) {
  let sheet = ss.getSheetByName(SHEET_NAMES.PREFERENCES);
  
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAMES.PREFERENCES);
  } else {
    sheet.clear();
  }
  
  // 設置標題
  const headers = ['用戶ID', '飲食限制', '口味偏好', '過敏食物', '其他偏好', '用戶意見', '保存時間'];
  sheet.appendRow(headers);
  
  // 格式化標題行
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#764ba2');
  headerRange.setFontColor('white');
  
  // 設置列寬
  sheet.setColumnWidth(1, 120);
  sheet.setColumnWidth(2, 150);
  sheet.setColumnWidth(3, 120);
  sheet.setColumnWidth(4, 150);
  sheet.setColumnWidth(5, 150);
  sheet.setColumnWidth(6, 200);
  sheet.setColumnWidth(7, 150);
}

function createHistorySheet(ss) {
  let sheet = ss.getSheetByName(SHEET_NAMES.HISTORY);
  
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAMES.HISTORY);
  } else {
    sheet.clear();
  }
  
  // 設置標題
  const headers = ['生成ID', '早餐', '午餐', '晚餐', '用戶偏好', '用戶需求', '生成時間'];
  sheet.appendRow(headers);
  
  // 格式化標題行
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#667eea');
  headerRange.setFontColor('white');
  
  // 設置列寬
  sheet.setColumnWidth(1, 120);
  sheet.setColumnWidth(2, 150);
  sheet.setColumnWidth(3, 150);
  sheet.setColumnWidth(4, 150);
  sheet.setColumnWidth(5, 200);
  sheet.setColumnWidth(6, 250);
  sheet.setColumnWidth(7, 150);
}

// ==================== Web API 處理 ====================

/**
 * 處理 GET 請求
 * @param {Object} e - 事件對象
 */
function doGet(e) {
  const action = e.parameter.action;
  
  switch(action) {
    case 'getMeals':
      return getMeals();
    case 'getHistory':
      return getHistory();
    default:
      return ContentService.createTextOutput('Invalid action')
        .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * 處理 POST 請求
 * @param {Object} e - 事件對象
 */
function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const action = payload.action;
    
    switch(action) {
      case 'saveMeals':
        return saveMeals(payload.data);
      case 'savePreferences':
        return savePreferences(payload.data);
      default:
        return sendResponse(false, 'Invalid action');
    }
  } catch (error) {
    Logger.log('錯誤: ' + error.toString());
    return sendResponse(false, error.toString());
  }
}

// ==================== 餐點管理 ====================

/**
 * 獲取所有餐點
 */
function getMeals() {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAMES.MEALS);
  
  if (!sheet) {
    return sendResponse(false, '餐點列表工作表不存在');
  }
  
  const data = sheet.getDataRange().getValues();
  const meals = {
    breakfast: [],
    lunch: [],
    dinner: []
  };
  
  // 跳過標題行，從第 2 行開始
  for (let i = 1; i < data.length; i++) {
    const [type, name, description, tags, timestamp] = data[i];
    
    if (!type || !name) continue; // 跳過空行
    
    const meal = {
      name: name.toString(),
      description: description.toString(),
      tags: tags.toString().split(',').map(t => t.trim())
    };
    
    const typeKey = type.toString().toLowerCase();
    if (typeKey === '早餐') {
      meals.breakfast.push(meal);
    } else if (typeKey === '午餐') {
      meals.lunch.push(meal);
    } else if (typeKey === '晚餐') {
      meals.dinner.push(meal);
    }
  }
  
  return sendResponse(true, null, meals);
}

/**
 * 保存生成的餐點到歷史記錄
 */
function saveMeals(data) {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAMES.HISTORY);
  
  if (!sheet) {
    return sendResponse(false, '歷史記錄工作表不存在');
  }
  
  try {
    const row = [
      generateId(),
      data.breakfast,
      data.lunch,
      data.dinner,
      JSON.stringify(data.preferences),
      data.preferences.userNote || '',
      new Date()
    ];
    
    sheet.appendRow(row);
    
    return sendResponse(true, '已保存到 Google Sheets');
  } catch (error) {
    return sendResponse(false, error.toString());
  }
}

// ==================== 用戶偏好管理 ====================

/**
 * 保存用戶偏好
 */
function savePreferences(preferences) {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAMES.PREFERENCES);
  
  if (!sheet) {
    return sendResponse(false, '偏好工作表不存在');
  }
  
  try {
    const userId = generateId();
    const row = [
      userId,
      preferences.restrictions.join(', '),
      preferences.taste || '未設置',
      preferences.allergies.join(', '),
      preferences.other.join(', '),
      preferences.userNote || '',
      new Date()
    ];
    
    sheet.appendRow(row);
    
    return sendResponse(true, '偏好已保存');
  } catch (error) {
    return sendResponse(false, error.toString());
  }
}

/**
 * 獲取歷史記錄
 */
function getHistory() {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAMES.HISTORY);
  
  if (!sheet) {
    return sendResponse(false, '歷史記錄工作表不存在');
  }
  
  const data = sheet.getDataRange().getValues();
  const history = [];
  
  // 獲取最後 20 條記錄
  const startIndex = Math.max(1, data.length - 20);
  
  for (let i = startIndex; i < data.length; i++) {
    if (i === 0) continue; // 跳過標題行
    
    const [id, breakfast, lunch, dinner, preferences, userNote, timestamp] = data[i];
    
    history.push({
      id: id,
      breakfast: breakfast,
      lunch: lunch,
      dinner: dinner,
      preferences: preferences,
      userNote: userNote,
      timestamp: timestamp
    });
  }
  
  return sendResponse(true, null, history);
}

// ==================== 輔助函數 ====================

/**
 * 生成唯一 ID
 */
function generateId() {
  return 'meal_' + Utilities.getUuid();
}

/**
 * 發送 JSON 響應
 */
function sendResponse(success, error = null, data = null) {
  const response = {
    success: success,
    error: error,
    data: data
  };
  
  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

// ==================== 調試函數 ====================

/**
 * 添加新餐點 (用於測試)
 */
function addMeal(type, name, description, tags) {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAMES.MEALS);
  
  if (!sheet) {
    Logger.log('餐點列表工作表不存在');
    return;
  }
  
  sheet.appendRow([type, name, description, tags, new Date()]);
  Logger.log('已添加餐點: ' + name);
}

/**
 * 清空歷史記錄 (用於測試)
 */
function clearHistory() {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAMES.HISTORY);
  
  if (!sheet) {
    Logger.log('歷史記錄工作表不存在');
    return;
  }
  
  const range = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn());
  range.clearContent();
  
  Logger.log('已清空歷史記錄');
}
