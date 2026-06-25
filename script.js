// ==================== 配置 ====================
const CONFIG = {
    // 修改此 URL 為您的 Google Apps Script 部署 URL
    GAS_URL: 'https://script.google.com/macros/s/AKfycbwl6q_OEViMEiRFvWs90_SbYyZyfmJ1x0JHCOyC6hMw37R_h4mxEog5jSTBuYhWAvNeHg/exec',
    HISTORY_KEY: 'mealHistory',
    PREFERENCES_KEY: 'mealPreferences'
};

// ==================== 狀態管理 ====================
let appState = {
    currentMeals: null,
    history: [],
    preferences: {
        restrictions: [],
        taste: null,
        allergies: [],
        other: [],
        userNote: ''
    }
};

// ==================== DOM 元素 ====================
const elements = {
    generateBtn: document.getElementById('generateBtn'),
    resultsContainer: document.getElementById('resultsContainer'),
    historyContainer: document.getElementById('historyContainer'),
    savePrefsBtn: document.getElementById('savePrefs'),
    resetPrefsBtn: document.getElementById('resetPrefs'),
    statusElement: document.getElementById('status'),
    restrictions: document.querySelectorAll('input[name="restriction"]'),
    taste: document.querySelectorAll('input[name="taste"]'),
    allergiesInput: document.getElementById('allergies'),
    otherPrefs: document.querySelectorAll('input[name="other"]'),
    userNoteInput: document.getElementById('userNote')
};

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    console.log('應用程序初始化中...');
    
    // 載入存儲的偏好
    loadPreferences();
    
    // 載入歷史記錄
    loadHistory();
    
    // 如果有先前生成過的記錄，直接顯示最新一筆結果
    if (appState.history.length > 0) {
        appState.currentMeals = appState.history[0].meals;
        displayMeals(appState.currentMeals);
        updateStatus('已載入上次生成結果。', 'normal');
    }
    
    // 綁定事件監聽器
    bindEventListeners();
    
    // 顯示歡迎訊息（若無歷史結果則保持預設提示）
    if (appState.history.length === 0) {
        updateStatus('準備就緒 ✓', 'normal');
    }
}

function bindEventListeners() {
    elements.generateBtn.addEventListener('click', generateMeals);
    elements.savePrefsBtn.addEventListener('click', savePreferences);
    elements.resetPrefsBtn.addEventListener('click', resetPreferences);
}

// ==================== 生成餐點 ====================
async function generateMeals() {
    console.log('生成餐點中...');
    
    savePreferences();
    
    updateStatus('正在生成您的完美三餐組合...', 'loading');
    elements.generateBtn.disabled = true;
    
    try {
        // 從 API 獲取餐點數據
        const meals = await fetchMealsFromAPI();
        
        if (!meals) {
            throw new Error('無法獲取餐點數據');
        }
        
        appState.currentMeals = meals;
        
        // 顯示結果
        displayMeals(meals);
        
        // 保存到歷史記錄
        addToHistory(meals);
        
        // 上傳到 Google Sheets
        await saveMealsToSheets(meals);
        
        updateStatus('完美的三餐組合已生成！✨', 'normal');
        
    } catch (error) {
        console.error('錯誤:', error);
        updateStatus('生成失敗：' + error.message, 'error');
    } finally {
        elements.generateBtn.disabled = false;
    }
}

// ==================== API 調用 ====================
async function fetchMealsFromAPI() {
    try {
        // 嘗試從 Google Sheets 獲取餐點列表
        const response = await fetch(`${CONFIG.GAS_URL}?action=getMeals`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`API 錯誤: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.error || '無法獲取餐點數據');
        }
        
        const mealsData = data.data || {};
        
        // 篩選符合用戶偏好的餐點
        const meals = {
            breakfast: selectRandomMeal(mealsData.breakfast, 'breakfast'),
            lunch: selectRandomMeal(mealsData.lunch, 'lunch'),
            dinner: selectRandomMeal(mealsData.dinner, 'dinner')
        };
        
        if (!meals.breakfast || !meals.lunch || !meals.dinner) {
            throw new Error('未能生成完整的餐點組合');
        }
        
        return meals;
        
    } catch (error) {
        console.error('API 呼叫失敗:', error);
        // 如果 API 失敗，使用本地數據
        return getLocalMeals();
    }
}

// ==================== 本地餐點數據 ====================
function getLocalMeals() {
    const allMeals = {
        breakfast: [
            { name: '蛋餅配豆漿', description: '台灣人氣早餐，蛋餅香脆又飽足', tags: ['快手餐', '台灣傳統', '含蛋'] },
            { name: '飯糰配鮮奶茶', description: 'Q彈飯糰搭配香醇鮮奶茶的絕佳組合', tags: ['快手餐', '高蛋白', '含蛋'] },
            { name: '油條豆漿套餐', description: '經典台灣早餐，炸油條配溫豆漿', tags: ['傳統', '飽足', '素食'] },
            { name: '蔥油餅加蛋', description: '香噴噴的蔥油餅夾蛋，咬下去油香四溢', tags: ['台灣傳統', '美味', '含蛋'] },
            { name: '起司蛋吐司', description: '香脆吐司夾起司和蛋，西式早餐新選擇', tags: ['快手餐', '含乳製品', '含蛋'] },
            { name: '鮮奶麥片', description: '營養滿分的鮮奶麥片配水果', tags: ['健康', '含乳製品', '高纖維'] },
            { name: '可頌配咖啡', description: '酥脆法式可頌搭配濃醇咖啡', tags: ['烘焙', '含乳製品'] },
            { name: '番茄起司歐姆蛋', description: '蓬鬆歐姆蛋夾起司和番茄，中西合併', tags: ['快手餐', '含蛋', '含乳製品'] },
            { name: '燒餅配豆漿', description: '外酥內軟的燒餅，咬下去香到不行', tags: ['傳統', '飽足', '素食'] },
            { name: '蛋捲配奶茶', description: '古早味蛋捲配濃醇奶茶', tags: ['快手餐', '台灣傳統', '含蛋'] },
            { name: '漢堡配牛奶', description: '蓬鬆漢堡夾蛋和起司，配冰冷牛奶', tags: ['西式', '含蛋', '含乳製品'] },
            { name: '花椒餅加豆漿', description: '台灣古早味，外層香脆花椒香', tags: ['台灣傳統', '素食', '飽足'] },
            { name: '鐵板麵配蛋', description: '香氣十足的鐵板麵，營養又方便', tags: ['快手餐', '含蛋', '台灣傳統'] },
            { name: '玉米湯加蛋餅', description: '溫暖的玉米湯搭配香脆蛋餅', tags: ['快手餐', '台灣傳統', '含蛋'] },
            { name: '起司蔥油餅', description: '蔥油餅夾起司和火腿，新鮮創意', tags: ['創新', '含乳製品', '快手餐'] },
            { name: '優格莓果碗', description: '希臘優格配新鮮莓果和穀類', tags: ['健康', '含乳製品', '清淡'] }
        ],
        lunch: [
            { name: '滷肉飯', description: '滷汁香濃的軟飯配肉燥，台灣国民便當', tags: ['台灣傳統', '飽足', '含豬肉'] },
            { name: '牛肉麵', description: '麻辣香辛的牛肉湯頭，配上嫩彈牛肉', tags: ['重口味', '台灣經典', '含牛肉'] },
            { name: '炸雞腿便當', description: '金黃炸雞腿配白飯和配菜，營養均衡', tags: ['快手餐', '高蛋白', '含雞肉'] },
            { name: '豬腳飯', description: '膠質豐富的豬腳配滷汁飯，古早味十足', tags: ['重口味', '台灣傳統', '含豬肉'] },
            { name: '蚵仔麵線', description: '湯頭濃郁，蚵仔鮮美的經典小吃', tags: ['台灣小吃', '重口味', '含海鮮'] },
            { name: '排骨便當', description: '酥脆排骨配飯，台灣便當店必點', tags: ['快手餐', '飽足', '含豬肉'] },
            { name: '素食便當', description: '豆製品和新鮮蔬菜的營養組合', tags: ['清淡', '素食', '健康'] },
            { name: '炸蝦漢堡', description: '酥脆炸蝦夾萵苣番茄，中西新吃法', tags: ['快手餐', '含海鮮', '西式'] },
            { name: '起司雞肉飯', description: '嫩雞肉配融化起司和白飯', tags: ['快手餐', '含雞肉', '含乳製品'] },
            { name: '豆乾滷味飯', description: '豆乾、豆類和蔬菜的素食組合', tags: ['素食', '台灣小吃', '低熱量'] },
            { name: '香菇雞湯麵', description: '鮮香的雞湯配細麵和香菇', tags: ['清淡', '含雞肉', '暖胃'] },
            { name: '鮪魚沙拉便當', description: '新鮮鮪魚配青菜和白飯', tags: ['健康', '含海鮮', '清淡'] },
            { name: '肉燥蛋飯', description: '豐富的肉燥配太陽蛋和白飯', tags: ['台灣傳統', '含豬肉', '含蛋'] },
            { name: '貢丸湯麵', description: 'Q彈貢丸搭配清湯細麵', tags: ['台灣傳統', '含豬肉', '暖胃'] },
            { name: '菠菜起司義大利麵', description: '鮮綠菠菜搭配濃郁起司醬', tags: ['西式', '素食', '含乳製品'] },
            { name: '烤雞腿丼飯', description: '日式烤雞腿蓋飯，醬汁香濃', tags: ['日式', '含雞肉', '飽足'] },
            { name: '番茄海鮮湯飯', description: '清酸番茄湯配新鮮海鮮', tags: ['健康', '含海鮮', '清淡'] }
        ],
        dinner: [
            { name: '海鮮火鍋', description: '冬天最暖胃的選擇，涮涮樂享受鮮美', tags: ['豐盛', '溫暖', '含海鮮'] },
            { name: '素食火鍋', description: '各式新鮮蔬菜和豆製品的素食火鍋', tags: ['素食', '溫暖', '健康'] },
            { name: '牛肉火鍋', description: '鮮嫩牛肉片搭配濃湯底的享受', tags: ['豐盛', '溫暖', '含牛肉'] },
            { name: '燒烤拼盤', description: '牛肉、豬肉、雞肉和蔬菜的烤肉組合', tags: ['聚餐', '豐盛', '含肉類'] },
            { name: '蔬菜串燒', description: '各式新鮮蔬菜的素食烤肉', tags: ['素食', '豐盛', '健康'] },
            { name: '素食滷味拼盤', description: '豆製品和蔬菜的素食滷味選擇', tags: ['台灣小吃', '夜市', '素食'] },
            { name: '牛肉麻辣燙', description: '麻辣鮮香的湯頭，涮肉品和蔬菜超涮嘴', tags: ['重口味', '夜市', '含牛肉'] },
            { name: '蔬菜麻辣燙', description: '麻辣湯頭搭配各式時蔬，素食也超涮嘴', tags: ['重口味', '夜市', '素食'] },
            { name: '豬肉水餃湯麵', description: '豬肉水餃配清湯麵，溫暖又舒服', tags: ['清淡', '溫暖', '含豬肉'] },
            { name: '素食水餃湯麵', description: '蔬菜水餃配清湯麵，素食也很飽足', tags: ['清淡', '溫暖', '素食'] },
            { name: '鹹粥配滷菜', description: '暖胃的清粥配各式滷味，豐富又満足', tags: ['台灣傳統', '飱足', '含肉類'] },
            { name: '清粥配素滷菜', description: '暖胃清粥配素食滷菜，清淡又營養', tags: ['台灣傳統', '飱足', '素食'] },
            { name: '臭豆腐鍋', description: '香到爆表的素食臭豆腐鍋，膽大的人必吃', tags: ['重口味', '台灣特色', '素食'] },
            { name: '蚵仔煎配甜辣醬', description: '牡蠣飽滿鮮美，配上甜辣醬絕了', tags: ['台灣小吃', '經典', '含海鮮'] },
            { name: '蛤蜊雞湯', description: '鮮甜蛤蜊搭配雞湯的經典組合', tags: ['健康', '含海鮮', '含雞肉'] },
            { name: '番茄牛肉義大利麵', description: '濃郁番茄醬搭配嫩牛肉', tags: ['西式', '含牛肉', '飽足'] },
            { name: '青醬海鮮義大利麵', description: '清爽青醬搭配新鮮海鮮', tags: ['西式', '含海鮮', '清淡'] },
            { name: '薑母鴨', description: '溫補的薑母鴨湯，冬天必吃', tags: ['溫暖', '台灣特色', '含鴨肉'] },
            { name: '麻油雞湯麵', description: '香香的麻油雞搭配細麵', tags: ['台灣傳統', '暖胃', '含雞肉'] },
            { name: '豆腐煲', description: '軟滑豆腐搭配湯汁的家常菜', tags: ['素食', '暖胃', '清淡'] }
        ]
    };
    
    return {
        breakfast: selectRandomMeal(allMeals.breakfast, 'breakfast'),
        lunch: selectRandomMeal(allMeals.lunch, 'lunch'),
        dinner: selectRandomMeal(allMeals.dinner, 'dinner')
    };
}

// ==================== 選擇隨機餐點 ====================
function selectRandomMeal(meals, type) {
    if (!meals || meals.length === 0) return null;
    
    // 根據用戶偏好篩選餐點
    let filteredMeals = meals.filter(meal => {
        // 檢查是否符合飲食限制
        const restrictions = appState.preferences.restrictions;
        
        // 如果選擇了「全素」，排除所有含肉、含海鮮、含蛋、含乳製品的餐點
        if (restrictions.includes('全素')) {
            const nonVeganTags = ['含豬肉', '含牛肉', '含雞肉', '含海鮮', '含蛋', '含乳製品', '含肉類'];
            if (meal.tags.some(tag => nonVeganTags.includes(tag))) {
                return false;
            }
        }
        // 如果選擇了「素食」，只排除含肉和海鮮的餐點（可以吃蛋和乳製品）
        else if (restrictions.includes('素食')) {
            const meatTags = ['含豬肉', '含牛肉', '含雞肉', '含海鮮', '含肉類'];
            if (meal.tags.some(tag => meatTags.includes(tag))) {
                return false;
            }
        }
        
        // 檢查是否包含「無麩質」限制
        if (restrictions.includes('無麩質') && meal.tags.includes('含麩質')) {
            return false;
        }
        
        // 檢查過敏食物
        const allergies = appState.preferences.allergies.map(a => a.toLowerCase());
        for (let allergy of allergies) {
            if (meal.name.toLowerCase().includes(allergy) || 
                meal.description.toLowerCase().includes(allergy) ||
                meal.tags.some(tag => tag.toLowerCase().includes(allergy))) {
                return false;
            }
        }
        
        return true;
    });
    
    // 如果沒有符合條件的餐點，使用所有餐點
    if (filteredMeals.length === 0) {
        filteredMeals = meals;
    }
    
    const randomIndex = Math.floor(Math.random() * filteredMeals.length);
    const selectedMeal = filteredMeals[randomIndex];
    
    return {
        ...selectedMeal,
        type: type,
        timestamp: new Date().toLocaleString('zh-TW')
    };
}

// ==================== 顯示餐點 ====================
function displayMeals(meals) {
    const html = `
        <div class="meal-cards">
            ${Object.entries(meals).map(([type, meal]) => `
                <div class="meal-card ${type}">
                    <div class="meal-time">${getMealTimeLabel(type)}</div>
                    <div class="meal-name">${meal.name}</div>
                    <div class="meal-description">${meal.description}</div>
                    <div class="meal-tags">
                        ${meal.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    elements.resultsContainer.innerHTML = html;
}

function getMealTimeLabel(type) {
    const labels = {
        breakfast: '🌅 早餐',
        lunch: '☀️ 午餐',
        dinner: '🌙 晚餐'
    };
    return labels[type] || type;
}

// ==================== 歷史記錄管理 ====================
function addToHistory(meals) {
    const historyEntry = {
        id: Date.now(),
        meals: meals,
        timestamp: new Date().toLocaleString('zh-TW')
    };
    
    appState.history.unshift(historyEntry);
    
    // 只保留最近 20 條記錄
    if (appState.history.length > 20) {
        appState.history.pop();
    }
    
    saveHistory();
    displayHistory();
}

function loadHistory() {
    try {
        const stored = localStorage.getItem(CONFIG.HISTORY_KEY);
        if (stored) {
            appState.history = JSON.parse(stored);
            displayHistory();
        }
    } catch (error) {
        console.error('載入歷史記錄失敗:', error);
    }
}

function saveHistory() {
    try {
        localStorage.setItem(CONFIG.HISTORY_KEY, JSON.stringify(appState.history));
    } catch (error) {
        console.error('保存歷史記錄失敗:', error);
    }
}

function displayHistory() {
    if (appState.history.length === 0) {
        elements.historyContainer.innerHTML = '<p class="empty">暫無記錄</p>';
        return;
    }
    
    const html = appState.history.map(entry => `
        <div class="history-item" onclick="restoreFromHistory(${entry.id})">
            <span>
                ${entry.meals.breakfast.name} / 
                ${entry.meals.lunch.name} / 
                ${entry.meals.dinner.name}
            </span>
            <span class="history-time">${entry.timestamp}</span>
        </div>
    `).join('');
    
    elements.historyContainer.innerHTML = html;
}

function restoreFromHistory(id) {
    const entry = appState.history.find(h => h.id === id);
    if (entry) {
        appState.currentMeals = entry.meals;
        displayMeals(entry.meals);
        updateStatus('已恢復之前的組合 📚', 'normal');
    }
}

// ==================== 偏好管理 ====================
function loadPreferences() {
    try {
        const stored = localStorage.getItem(CONFIG.PREFERENCES_KEY);
        if (stored) {
            appState.preferences = JSON.parse(stored);
            applyPreferencesToUI();
        }
    } catch (error) {
        console.error('載入偏好失敗:', error);
    }
}

function savePreferences() {
    // 收集飲食限制
    appState.preferences.restrictions = Array.from(elements.restrictions)
        .filter(el => el.checked)
        .map(el => el.value);
    
    // 收集口味偏好
    appState.preferences.taste = Array.from(elements.taste)
        .find(el => el.checked)?.value || null;
    
    // 收集過敏食物
    appState.preferences.allergies = elements.allergiesInput.value
        .split(',')
        .map(a => a.trim())
        .filter(a => a.length > 0);
    
    // 收集其他偏好
    appState.preferences.other = Array.from(elements.otherPrefs)
        .filter(el => el.checked)
        .map(el => el.value);
    
    // 收集使用者需求
    appState.preferences.userNote = elements.userNoteInput.value.trim();
    
    try {
        localStorage.setItem(CONFIG.PREFERENCES_KEY, JSON.stringify(appState.preferences));
        updateStatus('✓ 偏好已保存', 'normal');
        
        // 上傳偏好到 Google Sheets
        uploadPreferencesToSheets();
        
    } catch (error) {
        console.error('保存偏好失敗:', error);
        updateStatus('保存偏好失敗', 'error');
    }
}

function resetPreferences() {
    elements.restrictions.forEach(el => el.checked = false);
    elements.taste.forEach(el => el.checked = false);
    elements.allergiesInput.value = '';
    elements.otherPrefs.forEach(el => el.checked = false);
    elements.userNoteInput.value = '';
    
    appState.preferences = {
        restrictions: [],
        taste: null,
        allergies: [],
        other: [],
        userNote: ''
    };
    
    try {
        localStorage.removeItem(CONFIG.PREFERENCES_KEY);
        updateStatus('✓ 已重置偏好', 'normal');
    } catch (error) {
        console.error('重置失敗:', error);
    }
}

function applyPreferencesToUI() {
    elements.restrictions.forEach(el => {
        el.checked = appState.preferences.restrictions.includes(el.value);
    });
    
    elements.taste.forEach(el => {
        el.checked = el.value === appState.preferences.taste;
    });
    
    elements.allergiesInput.value = appState.preferences.allergies.join(', ');
    
    elements.otherPrefs.forEach(el => {
        el.checked = appState.preferences.other.includes(el.value);
    });
    
    elements.userNoteInput.value = appState.preferences.userNote || '';
}

// ==================== Google Sheets 整合 ====================
async function saveMealsToSheets(meals) {
    try {
        const payload = {
            action: 'saveMeals',
            data: {
                breakfast: meals.breakfast.name,
                lunch: meals.lunch.name,
                dinner: meals.dinner.name,
                preferences: appState.preferences,
                timestamp: new Date().toISOString()
            }
        };
        
        const response = await fetch(CONFIG.GAS_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        const result = await response.json();
        if (!result.success) {
            console.warn('無法保存到 Sheets:', result.error);
        }
        
    } catch (error) {
        console.warn('保存到 Sheets 失敗 (非關鍵):', error);
    }
}

async function uploadPreferencesToSheets() {
    try {
        const payload = {
            action: 'savePreferences',
            data: appState.preferences
        };
        
        const response = await fetch(CONFIG.GAS_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        const result = await response.json();
        if (!result.success) {
            console.warn('無法保存偏好到 Sheets:', result.error);
        }
        
    } catch (error) {
        console.warn('保存偏好到 Sheets 失敗 (非關鍵):', error);
    }
}

// ==================== 狀態指示 ==================
function updateStatus(message, type = 'normal') {
    elements.statusElement.textContent = message;
    elements.statusElement.classList.remove('loading', 'error');
    
    if (type === 'loading') {
        elements.statusElement.classList.add('loading');
    } else if (type === 'error') {
        elements.statusElement.classList.add('error');
    }
}

// ==================== 調試函數 ====================
function debugLog() {
    console.log('應用程序狀態:', appState);
    console.log('所有歷史記錄:', appState.history);
    console.log('當前偏好:', appState.preferences);
}

// 暴露到全域 scope 供調試使用
window.debugLog = debugLog;
window.appState = appState;
