# 🍽️ 隨機餐點組合生成器

一個功能完整的網頁應用，幫助您每天生成完美的三餐組合！

**🌐 線上訪問:** [GitHub Pages](https://alauej5j3.github.io/meowwwww)

## ✨ 功能特性

### 🎯 智能餐點生成
- ✅ 隨機生成早餐、午餐、晚餐的組合
- ✅ 根據用戶偏好自動篩選
- ✅ 美觀的卡片式展示
- ✅ 完整的餐點描述和標籤

### 👤 用戶偏好系統
- ✅ 飲食限制設置（素食、全素、無麩質等）
- ✅ 口味偏好選擇（重口味、中等、清淡）
- ✅ 過敏食物管理
- ✅ 其他飲食偏好（健身餐、低熱量等）
- ✅ 使用者需求 / 參考說明，生成前必填
- ✅ 本地存儲保持用戶偏好

### 📜 歷史記錄
- ✅ 自動保存最近 20 個生成的組合
- ✅ 一鍵恢復之前的組合
- ✅ 本地存儲，無需登錄

### 🔗 API 整合
- ✅ 從 Google Sheets 獲取餐點數據
- ✅ Google Apps Script 後端支持
- ✅ 自動上傳生成記錄到 Sheets
- ✅ 用戶偏好保存到 Sheets

### 📊 數據持久化
- ✅ 所有數據保存在 Google Sheets
- ✅ 完整的生成歷史記錄
- ✅ 用戶偏好統計

## 🛠️ 技術棧

### 前端
- **HTML5** - 語義化標記
- **CSS3** - 完全自訂設計，包含動畫和漸變
- **Vanilla JavaScript** - 無框架依賴，輕量級
- **Local Storage** - 客戶端數據持久化

### 後端
- **Google Apps Script** - 無服務器後端
- **Google Sheets API** - 數據存儲
- **REST API** - 前後端通信

### 部署
- **GitHub Pages** - 靜態網站托管
- **GitHub** - 版本控制

## 📁 項目結構

```
meowwwww/
├── index.html              # 主頁面
├── styles.css              # 樣式表 (自訂 CSS)
├── script.js               # 前端邏輯
├── apps-script.gs          # Google Apps Script 代碼
├── deployment.py           # 部署指南
└── README.md               # 本文檔
```

## 🚀 快速開始

### 前置要求
- Google 帳號（用於 Google Sheets 和 Apps Script）
- GitHub 帳號（用於 GitHub Pages 部署）
- 現代網瀏覽器

### 部署步驟

#### 1️⃣ 準備 Google Sheets

```bash
# 不需要運行任何命令，直接按照以下步驟：
1. 打開 Google Sheets (https://sheets.google.com)
2. 新建一個試算表，命名為 "餐點組合生成器"
3. 複製試算表 URL 中 /d/ 後面的部分（Sheet ID）
```

#### 2️⃣ 部署 Google Apps Script

```bash
# 1. 在 Google Sheets 中打開 Apps Script
# 擴充功能 > Apps Script

# 2. 刪除默認代碼，複製 apps-script.gs 的內容

# 3. 在第 11 行更新 SPREADSHEET_ID：
SPREADSHEET_ID = 'your-sheet-id-here'

# 4. 保存並運行 initializeSheet() 函數

# 5. 部署為網頁應用
# 部署 > 新增部署 > 選擇「網頁應用」
# 複製生成的部署 URL
```

#### 3️⃣ 配置前端

```bash
# 編輯 script.js 第 6 行：
CONFIG.GAS_URL = 'https://script.google.com/macros/d/{YOUR_DEPLOYMENT_ID}/usercontent'
```

#### 4️⃣ 上傳到 GitHub

```bash
# 初始化 Git 倉庫（如果還沒有）
git init
git add .
git commit -m "Initial commit: Meal combination generator"

# 如果已經有遠程倉庫
git push origin main
```

#### 5️⃣ 啟用 GitHub Pages

在 GitHub 倉庫設置中：
- Settings > Pages
- Source: Deploy from a branch
- Branch: main / (root)
- 保存

⏳ 等待 1-2 分鐘後訪問：
```
https://alauej5j3.github.io/meowwwww
```

## 💡 使用指南

### 生成早午晚餐

1. **打開應用**
   - 訪問 GitHub Pages 網址
   
2. **設置偏好（可選）**
   - 在左側面板選擇飲食限制
   - 選擇口味偏好
   - 輸入過敏食物
   - 點擊「保存偏好」💾

3. **生成組合**
   - 點擊「生成新組合」✨ 按鈕
   - 應用會根據您的偏好生成三餐組合
   - 結果自動保存到 Google Sheets

4. **查看歷史**
   - 右下方顯示最近生成的組合
   - 點擊歷史項目快速恢復

## 🎨 界面特性

### 設計亮點
- 🌈 現代漸變色設計
- ✨ 流暢的動畫和過渡效果
- 📱 完全響應式設計（手機、平板、桌面）
- ♿ 無障礙設計，支持鍵盤導航
- 🎯 直觀的用戶界面

### 用戶體驗
- ⚡ 快速加載和響應
- 🔄 實時狀態反饋
- 💾 自動保存用戶數據
- 🌙 支持本地存儲（無需帳號）

## 📊 數據流

```
┌─────────────────────────────────────────────┐
│                  用戶瀏覽器                    │
│  ┌────────────────┐        ┌──────────────┐ │
│  │   HTML/CSS     │        │  Local Src   │ │
│  │   JavaScript   │        │  (偏好/歷史)  │ │
│  └────────────────┘        └──────────────┘ │
└──────────────┬──────────────────────────────┘
               │ API 呼叫
               ↓
┌─────────────────────────────────────────────┐
│       Google Apps Script (後端)              │
│  ┌──────────────────────────────────────┐   │
│  │   - 獲取餐點數據                      │   │
│  │   - 保存生成記錄                      │   │
│  │   - 保存用戶偏好                      │   │
│  └──────────────────────────────────────┘   │
└──────────────┬──────────────────────────────┘
               │ Read/Write
               ↓
┌─────────────────────────────────────────────┐
│       Google Sheets 數據庫                    │
│  ┌──────────────┐  ┌──────────┐  ┌────────┐ │
│  │  餐點列表    │  │ 生成歷史 │  │ 用戶   │ │
│  │              │  │          │  │ 偏好   │ │
│  └──────────────┘  └──────────┘  └────────┘ │
└─────────────────────────────────────────────┘
```

## 🔒 隱私和安全

- ✅ 所有個人數據存儲在您自己的 Google Sheets 中
- ✅ 用戶偏好只在本地瀏覽器存儲
- ✅ 沒有第三方跟踪或分析
- ✅ 開源代碼，透明可審計
- ✅ 可隨時刪除 Google Sheets 中的數據

## 🐛 故障排除

### 問題：看不到任何餐點

**解決方案：**
```
1. 打開瀏覽器開發者工具 (F12)
2. 檢查 Console 標籤是否有錯誤信息
3. 確保 script.js 中的 CONFIG.GAS_URL 正確
4. 檢查網絡連接
```

### 問題：數據沒有保存到 Google Sheets

**解決方案：**
```
1. 確認 Google Apps Script 已正確部署
2. 檢查 SPREADSHEET_ID 是否在 apps-script.gs 中設置
3. 檢查 Google Sheets 是否有 "餐點列表" 等工作表
4. 再次運行 initializeSheet() 函數
```

### 問題：GitHub Pages 網站無法訪問

**解決方案：**
```
1. 確認倉庫已公開
2. 檢查 Settings > Pages 已正確配置
3. 等待 1-2 分鐘讓 GitHub 發布網站
4. 嘗試硬刷新瀏覽器 (Ctrl+Shift+R)
```

## 📝 添加新餐點

### 通過 Google Sheets UI

1. 打開您的 Google Sheets 試算表
2. 進入「餐點列表」工作表
3. 在最後一行添加新餐點：
   - 類型：「早餐」、「午餐」或「晚餐」
   - 餐點名稱：例如「漢堡」
   - 描述：餐點的簡短介紹
   - 標籤：用逗號分隔，例如「快手餐,高蛋白」
   - 建立時間：自動填充

### 通過 Google Apps Script

```javascript
// 在 Google Apps Script 編輯器中執行：
addMeal('早餐', '新餐點名稱', '描述', '標籤1,標籤2');
```

## 🎓 學習資源

### 前端開發
- [MDN - HTML/CSS/JavaScript 文檔](https://developer.mozilla.org/zh-TW/)
- [CSS 動畫教程](https://www.w3schools.com/css/css3_animations.asp)

### Google Apps Script
- [Google Apps Script 官方文檔](https://developers.google.com/apps-script)
- [Sheets API 參考](https://developers.google.com/sheets/api)

### 部署
- [GitHub Pages 文檔](https://docs.github.com/en/pages)
- [Google Apps Script 部署指南](https://developers.google.com/apps-script/guides/web)

## 📄 許可證

MIT License - 可自由使用和修改

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

### 改進想法
- [ ] 添加營養信息（熱量、蛋白質等）
- [ ] 集成真實餐廳菜單
- [ ] 添加餐點評分系統
- [ ] 導出為購物清單
- [ ] 多語言支持
- [ ] 用戶登錄系統

## 📞 聯繫方式

如有問題或建議，請通過 GitHub Issues 聯繫。

---

## 🎉 致謝

感謝所有貢獻者和使用者的支持！

**祝您用餐愉快！🍽️✨**
