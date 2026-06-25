// ==================== 配置 ====================
const CONFIG = {
    GAS_URL: 'https://script.google.com/macros/s/AKfycbwqu4zybaSNcf604QRML1yehTpeMcuBHUwFCELgWn_oo4cCpw6joEKSh78DEXvuVVRx_w/exec'
};

// ==================== DOM 元素 ====================
const elements = {
    mealTypeSelect: document.getElementById('mealType'),
    mealNameInput: document.getElementById('mealName'),
    mealDescriptionInput: document.getElementById('mealDescription'),
    mealTagsInput: document.getElementById('mealTags'),
    addMealBtn: document.getElementById('addMealBtn'),
    clearMealFormBtn: document.getElementById('clearMealFormBtn'),
    adminStatus: document.getElementById('adminStatus')
};

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', () => {
    bindEventListeners();
});

function bindEventListeners() {
    elements.addMealBtn.addEventListener('click', addNewMeal);
    elements.clearMealFormBtn.addEventListener('click', clearMealForm);
}

async function addNewMeal(event) {
    event.preventDefault();

    const type = elements.mealTypeSelect.value;
    const name = elements.mealNameInput.value.trim();
    const description = elements.mealDescriptionInput.value.trim();
    const tags = elements.mealTagsInput.value.trim();

    if (!name || !description || !tags) {
        updateAdminStatus('請填寫餐點名稱、描述和標籤。', 'error');
        return;
    }

    const payload = {
        action: 'saveMeal',
        data: {
            type,
            name,
            description,
            tags
        }
    };

    try {
        const response = await fetch(CONFIG.GAS_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        if (result.success) {
            updateAdminStatus('✓ 餐點已新增到 Google Sheets。', 'success');
            clearMealForm();
        } else {
            updateAdminStatus('新增餐點失敗：' + (result.error || '伺服器錯誤'), 'error');
        }
    } catch (error) {
        console.error('新增餐點失敗:', error);
        updateAdminStatus('新增餐點失敗：無法連線至 Google Apps Script', 'error');
    }
}

function clearMealForm(event) {
    if (event) event.preventDefault();
    elements.mealTypeSelect.value = '早餐';
    elements.mealNameInput.value = '';
    elements.mealDescriptionInput.value = '';
    elements.mealTagsInput.value = '';
    updateAdminStatus('已清空欄位，可輸入下一筆餐點。', 'normal');
}

function updateAdminStatus(message, type = 'normal') {
    elements.adminStatus.textContent = message;
    elements.adminStatus.style.color = type === 'error' ? '#d9534f' : type === 'success' ? '#28a745' : '#555';
}
