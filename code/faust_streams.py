import faust

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
    async for weather in stream:
        try:
            # 直接使用解析后的 Weather 对象
            city = weather.name
            temp_kelvin = weather.main['temp']
            temp_celsius = temp_kelvin - 273.15  # 转换为摄氏温度
            humidity = weather.main['humidity']

            # 输出原始数据
            print(f"Received weather data: City={city}, Temp={temp_celsius:.2f}°C, Humidity={humidity}%")

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
            print(f"📊 Updated average temperature for {city}: {new_avg_temp:.2f}°C")

        except KeyError as e:
            print(f"Error processing weather data: Missing key {e}")
        except Exception as e:
            print(f"Unexpected error: {e}")


@app.timer(interval=60.0)
async def print_statistics():
    """定时打印统计数据"""
    print("\n🌍 Current City Temperature Statistics:")
    for city, avg_temp in city_temperature_table.items():
        print(f"City={city}, Average Temp={avg_temp:.2f}°C, Records={city_count_table[city]}")


if __name__ == '__main__':
    app.main()