#!/usr/bin/env python3

"""
Google Apps Script 部署腳本配置
此配置文件幫助快速設置 GitHub Pages 和 Google Apps Script 整合
"""

# 前端配置
FRONTEND_CONFIG = {
    "site_name": "隨機餐點組合生成器",
    "description": "一鍵生成您今天的完美三餐組合",
    "url": "https://alauej5j3.github.io/meowwwww"
}

# Google Apps Script 配置
GAS_CONFIG = {
    "project_name": "MealCombinationGenerator",
    "description": "隨機早午晚餐組合生成器 - Google Sheets 後端",
    "scopes": [
        "https://www.googleapis.com/auth/spreadsheets",
        "https://www.googleapis.com/auth/script.scriptapp"
    ]
}

# 部署步驟說明
DEPLOYMENT_STEPS = """
════════════════════════════════════════════════════════
🚀 完整部署步驟指南
════════════════════════════════════════════════════════

【步驟 1】準備 Google Sheets
─────────────────────────────────────────────────────
1. 打開 Google Sheets (https://sheets.google.com)
2. 新建一個試算表，命名為 "餐點組合生成器"
3. 複製試算表的 ID (URL 中 /d/ 後面的部分)
4. 保存這個 ID，稍後會使用

【步驟 2】部署 Google Apps Script
─────────────────────────────────────────────────────
1. 在試算表中打開 Apps Script (擴充功能 > Apps Script)
2. 刪除默認的 myFunction 代碼
3. 將 apps-script.gs 的內容複製到編輯器
4. 在第 11 行將 SPREADSHEET_ID 替換為您的 Sheet ID
5. 按 Ctrl+S 保存
6. 運行 initializeSheet() 函數 (選擇函數 > 運行)
7. 批准權限請求

【步驟 3】部署為 Web 應用
─────────────────────────────────────────────────────
1. 點擊「部署」> 「新增部署」
2. 選擇部署類型：「網頁應用」
3. 執行身份：選擇您的 Google 帳戶
4. 有誰可以訪問：「任何人」
5. 點擊「部署」
6. 複製自動生成的部署 URL
   格式: https://script.google.com/macros/d/{DEPLOYMENT_ID}/usercontent

【步驟 4】配置前端
─────────────────────────────────────────────────────
1. 打開 script.js
2. 找到第 6 行的 CONFIG.GAS_URL
3. 將 URL 替換為您的 Google Apps Script 部署 URL
4. 保存文件

【步驟 5】上傳到 GitHub Pages
─────────────────────────────────────────────────────
1. 確保所有文件已提交：
   git add .
   git commit -m "Initial commit: Meal combination generator"
   
2. 推送到 GitHub：
   git push origin main

3. 在 GitHub 倉庫設置中：
   - 進入 Settings > Pages
   - Source 選擇「Deploy from a branch」
   - Branch 選擇「main」和「/(root)」
   - 點擊「Save」

4. 等待幾分鐘，GitHub Pages 會自動發布
   您的網站將在此 URL 提供:
   https://alauej5j3.github.io/meowwwww

════════════════════════════════════════════════════════
✅ 部署完成檢查清單
════════════════════════════════════════════════════════

□ Google Sheets 試算表已創建
□ Google Apps Script 已部署
□ 部署 URL 已複製到 script.js
□ 前端文件已提交到 GitHub
□ GitHub Pages 已啟用
□ 可以訪問 GitHub Pages URL

════════════════════════════════════════════════════════
🧪 測試應用程序
════════════════════════════════════════════════════════

1. 打開您的 GitHub Pages 網址
2. 點擊「生成新組合」按鈕
3. 確認餐點組合已顯示
4. 設置一些用戶偏好，點擊「保存偏好」
5. 打開 Google Sheets 檢查是否有新數據

════════════════════════════════════════════════════════
📝 文件說明
════════════════════════════════════════════════════════

- index.html          : 主頁面結構
- styles.css          : 完整的自訂 CSS 樣式
- script.js           : 前端邏輯和 API 調用
- apps-script.gs      : Google Apps Script 後端代碼
- README.md           : 項目文檔
- deployment.py       : 本部署配置文件

════════════════════════════════════════════════════════
⚠️ 常見問題解決
════════════════════════════════════════════════════════

Q: "Cannot find Meals sheet" 錯誤
A: 確保在 Google Apps Script 編輯器中運行了 initializeSheet()

Q: 前端無法連接 API
A: 檢查 script.js 中的 CONFIG.GAS_URL 是否正確

Q: GitHub Pages 網站無法加載
A: 檢查倉庫設置，確保 Pages 已從 main branch 啟用

Q: Google Sheets 沒有保存數據
A: 檢查 Google Apps Script 的部署 URL 和權限

════════════════════════════════════════════════════════
"""

if __name__ == "__main__":
    print(DEPLOYMENT_STEPS)
