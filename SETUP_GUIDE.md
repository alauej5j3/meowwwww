# 🚀 詳細設置指南

## 目錄
1. [準備工作](#準備工作)
2. [Google Sheets 設置](#google-sheets-設置)
3. [Google Apps Script 部署](#google-apps-script-部署)
4. [前端配置](#前端配置)
5. [GitHub 上傳](#github-上傳)
6. [GitHub Pages 啟用](#github-pages-啟用)
7. [測試和驗證](#測試和驗證)
8. [常見問題](#常見問題)

---

## 準備工作

確保您擁有以下內容：

- ✅ Google 帳號（可以是 Gmail）
- ✅ GitHub 帳號
- ✅ 現代網瀏覽器（Chrome、Firefox、Edge 等）
- ✅ 基本的文本編輯器

---

## Google Sheets 設置

### 步驟 1：創建 Google Sheets

1. 打開 [Google Sheets](https://sheets.google.com)
2. 點擊「新建」或「+ 新建試算表」
3. 命名為 `餐點組合生成器`
4. 點擊「建立」

### 步驟 2：獲取 Sheets ID

1. 打開新建的試算表
2. 查看瀏覽器地址欄，URL 格式如下：
   ```
   https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit
   ```
3. 複製 `[SHEET_ID]` 部分（不含 `[]`）
4. 保存此 ID，稍後會使用

**例子：**
```
URL: https://docs.google.com/spreadsheets/d/1A2B3C4D5E6F7G8H9I0J1K2L3M4/edit
ID:  1A2B3C4D5E6F7G8H9I0J1K2L3M4
```

---

## Google Apps Script 部署

### 步驟 1：打開 Apps Script 編輯器

1. 在您的 Google Sheets 中
2. 點擊菜單「擴充功能」> 「Apps Script」
3. 一個新標籤頁將打開 Google Apps Script 編輯器

### 步驟 2：清空默認代碼

1. 刪除編輯器中的所有代碼
2. 確保編輯區是空白的

### 步驟 3：複製 Apps Script 代碼

1. 打開文件 `apps-script.gs`（來自本倉庫）
2. 複製全部內容
3. 粘貼到 Google Apps Script 編輯器

### 步驟 4：配置 Sheets ID

1. 在編輯器中找到第 11 行：
   ```javascript
   const SPREADSHEET_ID = '';
   ```
2. 替換為您的 Sheets ID：
   ```javascript
   const SPREADSHEET_ID = '1A2B3C4D5E6F7G8H9I0J1K2L3M4';
   ```
3. 按 `Ctrl+S`（或 `Cmd+S`）保存

### 步驟 5：初始化數據庫

1. 在編輯器上方的函數下拉菜單中選擇 `initializeSheet`
2. 點擊「▶ 執行」按鈕
3. 在彈出的授權窗口中檢查應用權限
4. 點擊「檢視權限要求」
5. 選擇您的 Google 帳號
6. 點擊「允許」

**您會看到以下授權請求：**
- 查看和管理試算表
- 執行應用腳本

這是正常的，點擊「允許」即可。

### 步驟 6：檢查初始化結果

1. 返回到您的 Google Sheets 試算表
2. 刷新頁面（F5 或 Ctrl+R）
3. 您應該看到新的工作表：
   - 「餐點列表」
   - 「用戶偏好」
   - 「生成歷史」
4. 「餐點列表」應該包含示例餐點數據

### 步驟 7：部署為網頁應用

1. 返回到 Apps Script 編輯器
2. 點擊左側的「部署」按鈕
3. 點擊「新增部署」
4. 在「選擇類型」下拉菜單中選擇「網頁應用」
5. 填寫表單：
   - **執行身份**：選擇您的 Google 帳號
   - **有誰可以訪問**：選擇「任何人」
6. 點擊「部署」

### 步驟 8：複製部署 URL

1. 部署後，您會看到一個彈出窗口
2. 複製 「部署 ID」下的完整 URL
3. 格式應如下：
   ```
   https://script.google.com/macros/d/[DEPLOYMENT_ID]/usercontent
   ```
4. 保存此 URL，下一步需要使用

---

## 前端配置

### 步驟 1：編輯 JavaScript 文件

1. 打開文件 `script.js`
2. 找到第 6 行附近的 `CONFIG.GAS_URL`：
   ```javascript
   const CONFIG = {
       GAS_URL: 'https://script.google.com/macros/d/{DEPLOYMENT_ID}/usercontent',
       ...
   };
   ```

### 步驟 2：替換部署 URL

1. 將 `{DEPLOYMENT_ID}` 替換為您在上一步複製的完整 URL
2. 例如：
   ```javascript
   const CONFIG = {
       GAS_URL: 'https://script.google.com/macros/d/AKfycbyAbCdEfGhIjKlMnOpQrStUvWxYz1A2B3C/usercontent',
       HISTORY_KEY: 'mealHistory',
       PREFERENCES_KEY: 'mealPreferences'
   };
   ```

### 步驟 3：保存文件

- 按 `Ctrl+S`（或 `Cmd+S`）保存

---

## GitHub 上傳

### 準備工作

如果您還沒有本地 Git 設置，請先執行以下命令。

### 步驟 1：初始化 Git（首次使用）

```bash
# 進入項目目錄
cd /path/to/meowwwww

# 初始化 Git 倉庫
git init

# 配置 Git 用戶信息
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

### 步驟 2：添加遠程倉庫

如果您還沒有在 GitHub 上創建倉庫：

1. 打開 [GitHub](https://github.com)
2. 點擊「+」> 「New repository」
3. 命名為 `meowwwww`
4. 選擇「Public」（公開）
5. 點擊「Create repository」

然後在命令行執行：

```bash
git remote add origin https://github.com/YOUR_USERNAME/meowwwww.git
git branch -M main
```

### 步驟 3：提交和推送

```bash
# 添加所有文件到暫存區
git add .

# 提交代碼
git commit -m "Initial commit: Meal combination generator with Google Sheets integration"

# 推送到 GitHub
git push -u origin main
```

### 步驟 4：驗證上傳

1. 打開 GitHub 倉庫頁面
2. 確認所有文件已上傳：
   - `index.html`
   - `styles.css`
   - `script.js`
   - `apps-script.gs`
   - `README.md`
   - `.gitignore`

---

## GitHub Pages 啟用

### 步驟 1：進入倉庫設置

1. 在 GitHub 倉庫頁面，點擊「Settings」（設置）
2. 在左側菜單中找到並點擊「Pages」

### 步驟 2：配置 Pages

1. 在「Build and deployment」部分：
   - **Source**：選擇「Deploy from a branch」
   - **Branch**：選擇 `main`
   - **Folder**：選擇 `/ (root)`

2. 點擊「Save」

### 步驟 3：等待發布

- GitHub 會自動發布您的網站
- 這通常需要 1-2 分鐘
- 您會看到一條信息：「Your site is live at https://...」

### 步驟 4：訪問您的網站

您的應用現已在以下地址提供：

```
https://alauej5j3.github.io/meowwwww
```

在地址欄中輸入此 URL 訪問您的餐點組合生成器。

---

## 測試和驗證

### 步驟 1：打開應用

1. 訪問您的 GitHub Pages URL
2. 確認頁面正常加載
3. 檢查樣式是否正確應用

### 步驟 2：測試生成功能

1. 點擊「✨ 生成新組合」按鈕
2. 確認三個餐點卡片出現
3. 每次點擊時應該看到不同的組合

### 步驟 3：測試偏好功能

1. 在左側面板勾選一些偏好（例如選擇「素食」）
2. 點擊「💾 保存偏好」
3. 刷新頁面，確認偏好已保存
4. 再次點擊「生成新組合」

### 步驟 4：檢查 Google Sheets 數據

1. 返回您的 Google Sheets 試算表
2. 檢查「生成歷史」工作表
3. 應該能看到您剛才生成的記錄
4. 檢查「用戶偏好」工作表
5. 應該能看到保存的偏好信息

### 步驟 5：打開開發者工具

1. 按 `F12` 打開開發者工具
2. 點擊「Console」標籤
3. 查看是否有任何紅色錯誤信息
4. 執行命令 `debugLog()` 查看應用狀態

---

## 常見問題

### Q1：「Cannot find Meals sheet」錯誤

**原因：** 未成功運行 `initializeSheet()` 函數

**解決方案：**
1. 返回 Google Apps Script 編輯器
2. 在函數下拉菜單中選擇 `initializeSheet`
3. 點擊「▶ 執行」
4. 檢查執行日誌中是否有錯誤信息

### Q2：前端無法連接到 API

**原因：** `CONFIG.GAS_URL` 配置不正確

**解決方案：**
1. 打開瀏覽器開發者工具（F12）
2. 查看「Network」標籤，看是否有失敗的請求
3. 檢查 `script.js` 中的 URL 是否正確複製
4. 確保 URL 末尾有 `/usercontent`

### Q3：GitHub Pages 網站無法訪問

**原因：** Pages 設置不正確或尚未完成發布

**解決方案：**
1. 等待 2-3 分鐘
2. 檢查 Settings > Pages 的狀態
3. 嘗試清除瀏覽器緩存（Ctrl+Shift+Delete）
4. 確認倉庫設置為「Public」

### Q4：數據沒有保存到 Google Sheets

**原因：** API 權限或部署 URL 問題

**解決方案：**
1. 打開 Google Apps Script 編輯器
2. 查看執行日誌（查看日誌）
3. 檢查是否有權限相關的錯誤
4. 確認已運行 `initializeSheet()` 初始化

### Q5：頁面樣式混亂

**原因：** CSS 文件加載失敗

**解決方案：**
1. 確認 `styles.css` 已上傳到 GitHub
2. 打開開發者工具檢查是否有 404 錯誤
3. 檢查文件名是否正確（區分大小寫）
4. 嘗試硬刷新（Ctrl+Shift+R）

### Q6：如何更新餐點列表？

**方案 1：直接編輯 Google Sheets**
1. 打開您的 Google Sheets 試算表
2. 進入「餐點列表」工作表
3. 添加新行，填寫餐點信息

**方案 2：使用 Google Apps Script**
1. 在 Apps Script 編輯器中執行：
   ```javascript
   addMeal('早餐', '新遊司飯', '美味的日式飯團', '日料,清淡');
   ```

---

## 故障排除清單

在提交問題前，請檢查以下項目：

- [ ] Google Sheets ID 在 `apps-script.gs` 中正確配置
- [ ] Google Apps Script 已成功部署為網頁應用
- [ ] 部署 URL 在 `script.js` 中正確配置
- [ ] 所有文件已上傳到 GitHub main branch
- [ ] GitHub Pages 已在 Settings 中啟用
- [ ] 打開開發者工具（F12）檢查是否有 JavaScript 錯誤
- [ ] 已嘗試硬刷新瀏覽器（Ctrl+Shift+R）
- [ ] Google Sheets 已初始化（包含必要的工作表）

---

## 後續優化

### 添加更多餐點

1. 編輯 Google Sheets 中的「餐點列表」
2. 每行添加一個新餐點
3. 前端會自動識別新數據

### 自定義樣式

1. 編輯 `styles.css`
2. 修改顏色、字體、動畫等
3. 刷新瀏覽器查看效果

### 添加新功能

1. 在 `script.js` 中添加新的 JavaScript 函數
2. 在 `apps-script.gs` 中添加新的 API 端點
3. 提交更新到 GitHub

---

## 獲取幫助

如有問題，請：

1. 檢查本指南中的「常見問題」部分
2. 查看 `README.md` 中的故障排除部分
3. 在 GitHub Issues 中提交問題
4. 提供以下信息：
   - 您看到的錯誤信息
   - 瀏覽器開發者工具的截圖
   - 您已經嘗試的解決方案

---

**祝您設置順利！如有任何疑問，隨時提出。🎉**
