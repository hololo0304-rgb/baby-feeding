# 🍼 寶寶餵奶雲端紀錄小工具 (Baby Feeding Tracker)

專為新手父母設計的輕量化手機網頁小工具，支援 **Google 試算表雲端雙機同步**，讓爸爸媽媽用不同手機開啟都能即時同步餵奶紀錄。

---

## 🛠️ 架構簡介

* **前端介面**：單一 `index.html` 檔案（託管於 GitHub Pages）。
* **後端與資料庫**：Google Apps Script (GAS) + Google 試算表 (Google Sheets)。

---

## ⚙️ 未來常見修改指南 (長大調整奶量)

當寶寶長大、單餐奶量增加時，只需要修改 `index.html` 中的數值即可：

### 1. 修改快速點選按鈕的毫升數 (ml)

打開 GitHub 中的 `index.html`，搜尋 `amount-grid`（大約在第 155 行附近），你會看到 4 個按鈕：

```html
<!-- 修改前 (預設 60, 90, 120, 150) -->
<div class="amount-grid">
  <button type="button" class="amount-btn" onclick="setAmount(60, this)">60</button>
  <button type="button" class="amount-btn" onclick="setAmount(90, this)">90</button>
  <button type="button" class="amount-btn" onclick="setAmount(120, this)">120</button>
  <button type="button" class="amount-btn" onclick="setAmount(150, this)">150</button>
</div>
