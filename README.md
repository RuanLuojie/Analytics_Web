```markdown
# 硬體需求選擇系統

這是一個簡單的網頁應用程式，讓使用者可以根據選擇的硬體需求，顯示相應的結果。此應用程式使用 Flask 作為後端伺服器，並提供 API 以供前端 JavaScript 獲取資料。

## 功能

- 從伺服器獲取硬體選項並填充到下拉選單中
- 用戶選擇硬體選項後顯示相應的結果
- 在伺服器無法連線時顯示錯誤提示

## 目錄結構

```plaintext
.
├── main.py
├── requirements.txt
├── static
│   ├── styles.css
│   └── script.js
└── templates
    └── index.html
```

## 安裝與執行

1. 克隆此倉庫：

```bash
git clone https://github.com/RuanLuojie/Analytics_Web.git
cd 你的倉庫名
```

2. 創建虛擬環境並安裝依賴：

```bash
python -m venv venv
source venv/bin/activate  # Windows 使用 venv\Scripts\activate
pip install -r requirements.txt
```

3. 執行 Flask 伺服器：

```bash
python main.py
```

4. 在瀏覽器中打開 `http://127.0.0.1:5000` 以查看應用程式。

## 文件說明

### main.py

```python
from flask import Flask, render_template, jsonify
from flask_cors import CORS
import pandas as pd
import requests
from io import BytesIO

app = Flask(__name__)
CORS(app)

EXCEL_URL = 'https://cdn.glitch.global/717c90c6-39f6-46fc-b43d-b44ee8bb0dbb/123.xls?v=1715853003674'

@app.route('/')
def index():
.....
```

### templates/index.html

```html
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
    <meta charset="UTF-8">
    <title>硬體需求選擇</title>
    <link rel="stylesheet" href="{{ url_for('static', filename='styles.css') }}">
</head>
<body>
    <div class="alert" id="alert" style="display: none;">
        伺服器未連線請重新整理網頁

.....
```

### static/styles.css

```css
.alert {
    padding: 10px;
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
    border-radius: 4px;
    font-size: 16px;
    text-align: center;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1000;
}

.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
}
....
```

### static/script.js

```javascript
document.addEventListener('DOMContentLoaded', function() {
    let optionsMap = {};

    // 发出 GET 请求获取选项数据
    fetch('https://nova-leather-hardhat.glitch.me/api/options')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            populateSelect('cpu', data.cpu);
            populateSelect('gpu', data.gpu);
            populateSelect('ram', data.ram);
            populateSelect('hdd', data.hdd);
        })
...
```

## 注意事項

- 確保 `main.py` 和 `templates`、`static` 資料夾在同一個目錄下。
- 需要安裝 Python 2.7 並確保 Flask 和相關依賴項正確安裝。

## 支援

如果遇到任何問題，請聯絡 [Roger] (hiaconde@gmail.com)。
