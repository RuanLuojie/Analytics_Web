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
git clone https://github.com/你的用戶名/你的倉庫名.git
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
    return render_template('index.html')

@app.route('/api/options', methods=['GET'])
def get_options():
    response = requests.get(EXCEL_URL)
    file = BytesIO(response.content)

    try:
        df = pd.read_excel(file, engine='xlrd')
        df.columns = df.columns.str.strip()
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    try:
        options = {
            'cpu': df['CPU'].dropna().unique().tolist(),
            'gpu': df['GPU'].dropna().unique().tolist(),
            'ram': df['RAM'].dropna().unique().tolist(),
            'hdd': df['HDD/SSD'].dropna().unique().tolist()
        }
    except KeyError as e:
        return jsonify({"error": "KeyError: " + str(e)}), 500

    return jsonify(options)

if __name__ == '__main__':
    app.run()
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
    </div>

    <div class="container">
        <div class="dropdown-container">
            <div class="dropdown">
                <label for="cpu">CPU 主要需求:</label>
                <select id="cpu" name="cpu"><option value="choose">請選擇</option></select>
            </div>

            <div class="dropdown">
                <label for="gpu">GPU 次要需求:</label>
                <select id="gpu" name="gpu"><option value="choose">請選擇</option></select>
            </div>

            <div class="dropdown">
                <label for="ram">RAM 多工處理:</label>
                <select id="ram" name="ram"><option value="choose">請選擇</option></select>
            </div>

            <div class="dropdown">
                <label for="hdd">HDD/SSD 儲存需求:</label>
                <select id="hdd" name="hdd"><option value="choose">請選擇</option></select>
            </div>
        </div>

        <div class="result-container">
            <div class="result-label">結果</div>
            <div class="result-box" id="result"></div>
        </div>
    </div>

    <script src="{{ url_for('static', filename='script.js') }}"></script>
</body>
</html>
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

.dropdown-container {
    display: flex;
    justify-content: space-around;
    width: 80%;
    border: 2px solid black;
    padding: 20px;
    margin-bottom: 20px;
}

.dropdown {
    display: flex;
    flex-direction: column;
    align-items: center;
}

label {
    font-weight: bold;
    margin-bottom: 5px;
}

select {
    padding: 5px;
    font-size: 16px;
    width: 200px;
    border: 2px solid black;
}

.result-container {
    display: flex;
    align-items: center;
    margin-top: 20px;
}

.result-label {
    font-size: 18px;
    font-weight: bold;
    margin-right: 10px;
}

.result-box {
    padding: 10px;
    background-color: #f0f0f0;
    border: 2px solid black;
    width: 500px;
    height: 40px;
    display: flex;
    align-items: center;
}
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
        .catch(error => {
            console.error('Error fetching options:', error);
            showError('伺服器未連線請重新整理網頁');
        });

    // 监听选择变化事件并显示结果
    const selects = document.querySelectorAll('select');
    selects.forEach(select => {
        select.addEventListener('change', showResult);
    });

    // 填充下拉菜单的函数
    function populateSelect(id, options) {
        const select = document.getElementById(id);
        optionsMap[id] = {};

        options.forEach(option => {
            const parts = option.split(':');
            const displayText = parts[0];
            const valueText = parts.length > 1 ? parts[1] : parts[0];
            
            // 将前缀与完整值映射到 optionsMap 中
            optionsMap[id][displayText] = valueText;

            const opt = document.createElement('option');
            opt.value = displayText;
            opt.textContent = displayText;
            select.appendChild(opt);
        });
    }

    // 显示结果的函数
    function showResult() {
        const cpu = document.getElementById("cpu").value;
        const gpu = document.getElementById("gpu").value;
        const ram = document.getElementById("ram").value;
        const hdd = document.getElementById("hdd").value;

        // 获取映射后的完整值
        const cpuValue = cpu !== "choose" ? `CPU: ${optionsMap["cpu"][cpu]}` : null;
        const gpuValue = gpu !== "choose" ? `GPU: ${optionsMap["gpu"][gpu]}` : null;
        const ramValue = ram !== "choose" ? `RAM: ${optionsMap["ram"][ram]}` : null;
        const hddValue = hdd !== "choose" ? `HDD/SSD: ${optionsMap["hdd"][hdd]}` : null;

        // 创建结果数组
        let resultArray = [cpuValue, gpuValue, ramValue, hddValue].filter(value => value !== null);

        // 生成结果文本
        let resultText = `選擇的硬體需求為: ${resultArray.join(',

 ')}`;
        
        document.getElementById("result").innerText = resultText;
    }

    // 显示错误消息的函数
    function showError(message) {
        const alert = document.getElementById('alert');
        alert.textContent = message;
        alert.style.display = 'block';
    }
});
```

## 注意事項

- 確保 `main.py` 和 `templates`、`static` 資料夾在同一個目錄下。
- 需要安裝 Python 2.7 並確保 Flask 和相關依賴項正確安裝。

## 支援

如果遇到任何問題，請聯絡 [Roger](hiaconde@gmail.com)。
