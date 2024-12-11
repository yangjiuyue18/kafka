from fastapi import FastAPI, HTTPException, status
from fastapi.responses import RedirectResponse
from typing import Dict
from fastapi.staticfiles import StaticFiles
import uvicorn
import ast
import json
 
app = FastAPI()
WEATHER_DATA_FILE = 'latest_weather_data.txt'
WEATHER_HISTORY_FILE = 'weather_history.txt'
MAP_DATA_FILE = 'map_data.txt'

# 挂载静态文件服务，但不直接暴露给用户
app.mount("/static", StaticFiles(directory="web"), name="web_files")
 
# 创建一个路由来重定向 /index.html 到静态文件中的 index.html
@app.get("/index.html")
async def redirect_to_index():
    return RedirectResponse(url="/static/index.html")
 
@app.get("/weather_data")
async def read_weather_data():
    """返回天气数据"""
    weather_data = {}
    try:
        with open(WEATHER_DATA_FILE, 'r') as file:
            for line in file:
                city, data_str = line.strip().split(': ', 1)
                # 使用 ast.literal_eval 安全地将字符串解析为字典
                weather_data[city] = ast.literal_eval(data_str)
    except FileNotFoundError:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Weather data file not found")
    
    return weather_data

@app.get("/map_data")
async def read_map_data():
    """返回地图数据"""
    map_data = {}
    try:
        with open(MAP_DATA_FILE, 'r') as file:
            for line in file:
                city, data_str = line.strip().split(': ', 1)
                # 使用 ast.literal_eval 安全地将字符串解析为字典
                map_data[city] = ast.literal_eval(data_str)
    except FileNotFoundError:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Map data file not found")
    
    return map_data

@app.get("/weather_history")
async def read_weather_history():
    """返回天气历史数据"""
    weather_history = []
    try:
        with open(WEATHER_HISTORY_FILE, 'r') as file:
            for line in file:
                # 解析每一行的JSON数据
                data = json.loads(line)
                weather_history.append(data)
    except FileNotFoundError:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Weather history file not found")
    
    return weather_history
 
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8080)
