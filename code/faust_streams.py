import faust
import datetime
import json
import os
import asyncio


# 在文件顶部添加
latest_weather_data = {}
counter = 0
MAX_SHOW = 6
WEATHER_DATA_FILE = 'latest_weather_data.txt'
HISTORY_DATA_FILE = 'weather_history.txt'
weather_history = []
map_data = {}
MAP_DATA_FILE = 'map_data.txt'

update_lock = False
last_update_time = None

# 创建一个 asyncio.Lock 实例
lock = asyncio.Lock()


# 定义 Weather 模型
class Weather(faust.Record):
    name: str
    main: dict

# 创建 Faust 应用
app = faust.App(
    'weather_faust_app',
    broker='kafka://localhost:9092',
    store='memory://',
)

# 定义 Kafka Topic
weather_topic = app.topic('weather-data', value_type=Weather)

# 定义表，用于统计每个城市的平均温度
city_temperature_table = app.Table(
    'city_temperature_table',
    default=float,
    partitions=1,
)

# 定义表，用于统计每个城市的记录计数
city_count_table = app.Table(
    'city_count_table',
    default=int,
    partitions=1,
)

# 异常检测阈值
TEMP_THRESHOLD = 35.0  # 温度阈值（摄氏度）


@app.agent(weather_topic)
async def process_weather_data(stream):
    """处理天气数据流"""
    async for weathers in stream:
        try:
            # 直接使用解析后的 Weather 对象
            city = weathers.name
            weather_condition = weathers.weather[0]['main']
            temp_kelvin = weathers.main['temp']
            temp_celsius = temp_kelvin - 273.15  # 转换为摄氏温度
            feel_temp_kelvin = weathers.main['feels_like']
            feel_temp_celsius = feel_temp_kelvin - 273.15  # 转换为摄氏温度
            cloud = weathers.clouds['all']
            humidity = weathers.main['humidity']
            wind_speed = weathers.wind['speed']

            # 输出原始数据
            # print(f"Received weather data: City={city}, Weather_condition={weather_condition}, Temp={temp_celsius:.2f}°C, Cloud={cloud}%, Humidity={humidity}%, Wind_speed={wind_speed}m/s")

            # 异常检测
            if temp_celsius > TEMP_THRESHOLD:
                print(f"⚠️  Temperature anomaly detected in {city}: {temp_celsius:.2f}°C")

            # 更新平均温度表
            current_total_temp = city_temperature_table[city] * city_count_table[city]
            current_total_temp += temp_celsius
            city_count_table[city] += 1
            new_avg_temp = current_total_temp / city_count_table[city]
            city_temperature_table[city] = new_avg_temp

            # 打印更新的平均温度
            # print(f"📊 Updated average temperature for {city}: {new_avg_temp:.2f}°C")

            async with lock:
                global counter  # 使用全局变量counter
                if counter < MAX_SHOW:  # 如果计数器小于MAX_SHOW，则更新数据
                # 更新最新天气数据
                    latest_weather_data[city] = {
                        'weather':weather_condition,
                        'temperature': round(temp_celsius, 2),
                        'feel_temperature': round(feel_temp_celsius, 2),
                        'cloud':cloud,
                        'humidity': humidity,
                        'wind':wind_speed,
                        'average_temperature':round(new_avg_temp, 2)
                    }
                    counter += 1

                map_data[city] = {
                    'temperature': round(temp_celsius, 2),
                }

                # 标记数据已更新，并记录最后更新时间
                global update_lock, last_update_time
                update_lock = True
                last_update_time = datetime.datetime.now()

        except KeyError as e:
            print(f"Error processing weather data: Missing key {e}")
        except Exception as e:
            print(f"Unexpected error: {e}")


@app.timer(interval=360.0)
async def check_and_save_data():
    global update_lock, last_update_time, counter
    if update_lock and (datetime.datetime.now() - last_update_time).total_seconds() >= 60:
        async with lock:
            # 执行保存操作
            save_data()
            # 重置标签
            update_lock = False
            counter = 0




def save_data():
    print(latest_weather_data)

    # 将最新天气数据写入本地txt文件
    with open(WEATHER_DATA_FILE, 'w') as file:  # 'w' 模式会清空文件内容再写入
        for city, data in latest_weather_data.items():
            file.write(f"{city}: {data}\n")

    
    with open(MAP_DATA_FILE, 'w') as file:  # 'w' 模式会清空文件内容再写入
        for city, data in map_data.items():
            file.write(f"{city}: {data}\n")
            
    # 将当前所有城市的天气数据和时间戳添加到历史记录中
    current_weather_snapshot = {'time': datetime.datetime.now().isoformat(), 'data': latest_weather_data.copy()}
    weather_history.append(current_weather_snapshot)

    # 检查并更新历史数据文件
    if os.path.exists(HISTORY_DATA_FILE):
        # 读取现有文件行数
        with open(HISTORY_DATA_FILE, 'r') as file:
            lines = file.readlines()
        
        # 如果文件有六行数据，则删除第一行
        if len(lines) == 6:
            with open(HISTORY_DATA_FILE, 'w') as file:
                for line in lines[1:]:  # 跳过第一行
                    file.write(line)
    
    # 将历史天气数据追加到本地txt文件
    with open(HISTORY_DATA_FILE, 'a') as file:  # 使用'a'模式追加数据
        file.write(json.dumps(current_weather_snapshot) + '\n')  # 追加当前天气快照


if __name__ == '__main__':
    app.main()