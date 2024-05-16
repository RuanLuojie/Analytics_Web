# -*- coding: utf-8 -*-

from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd
import requests
from io import BytesIO

app = Flask(__name__)
CORS(app)  # 启用 CORS

EXCEL_URL = 'https://cdn.glitch.global/717c90c6-39f6-46fc-b43d-b44ee8bb0dbb/123.xls?v=1715858247369'

@app.route('/api/options', methods=['GET'])
def get_options():
    # 从URL下载Excel文件
    response = requests.get(EXCEL_URL)
    file = BytesIO(response.content)
    
    try:
        # 使用xlrd引擎读取.xls文件
        df = pd.read_excel(file, engine='xlrd')
        
        # 去除列名中的空格
        df.columns = df.columns.str.strip()
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    # 将数据转换为字典格式
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
