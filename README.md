# Kafka Weather Dashboard
 
## Kafka Weather Dashboard
 
This project fetches city weather data via API, processes the data streams using Kafka, and displays the data in real-time through a web interface. 
The overall architecture includes a Kafka producer, a Faust stream processing application, and a web dashboard based on FastAPI.
 
## Directory Structure
    kafka-main/

        └── code/

              └── kafka/src/main/java/ru/spbu/apmath/pt/

                        └─ WeatherKafkaProducer.kt

              └── web/

              └ fastapi_dashboard.py

              └ faust_streams.py

        └── docker/

              └ docker-compose-kafka.yml

## Running Steps
 
### 1. Start Kafka Containers
In the `docker` directory, run the following command to start Kafka and Zookeeper containers: 
```sh
docker-compose -f docker-compose-kafka.yml up -d
# Note: It may be necessary to run this command twice, the first time to start the base containers, and the second time to ensure they are updated and running properly.
```

### 2. Start the Faust Stream Processing Application
In the `kafka-main/code` directory, run the following command to start the Faust stream processing application:
```sh
python faust_streams.py worker
# This application will listen for weather data in Kafka and perform exception handling and data processing.
```

### 3. Start the Kafka Producer
Navigate to the `Kafka` producer code directory and compile and run the `WeatherKafkaProducer.kt file`. 
The specific steps may vary depending on your development environment, such as using `IntelliJ IDEA` or `Android Studio` for compilation and execution.
```sh
cd code/kafka/src/main/java/ru/spbu/apmath/pt
# Compile and run WeatherKafkaProducer.kt according to your environment.
```

### 4. Start the Web Application
In the `kafka-main/code directory`, run the following command to start the web application based on `FastAPI`:
```sh
uvicorn fastapi_dashboard:app --host 0.0.0.0 --port 8080 --reload
```
After the web application starts, you can access `http://localhost:8080/static/index.html` in your browser to view the real-time weather data dashboard.

## Technology Stack
Kafka: For data stream processing and message delivery.

Faust: A Kafka stream processing library based on Python.

FastAPI: For building high-performance web APIs.

Uvicorn: An ASGI server for FastAPI.

Docker: For containerized deployment of Kafka and other dependencies.

## Notes
Ensure that the Kafka and Zookeeper containers are properly started and running.

Check the configurations in `faust_streams.py` and `WeatherKafkaProducer.kt` to make sure that parameters such as Kafka topics, `API keys`, etc., are set correctly.

Ensure that the port listened by the web application (default is `8080`) is not occupied by other applications.


## 项目简介
 
本项目通过API获取城市天气数据，利用Kafka进行数据流处理，并通过Web界面实时展示这些数据。整体架构包含Kafka生产者、Faust流处理应用以及基于FastAPI的Web仪表盘。
 
## 目录结构
    kafka-main/

        └── code/

              └── kafka/src/main/java/ru/spbu/apmath/pt/

                        └─ WeatherKafkaProducer.kt

              └── web/

              └ fastapi_dashboard.py

              └ faust_streams.py

        └── docker/

              └ docker-compose-kafka.yml

## 运行步骤
 
### 1. 启动Kafka容器
在`docker`目录下，运行以下命令以启动Kafka和Zookeeper容器： 
```sh
docker-compose -f docker-compose-kafka.yml up -d
# 注意：可能需要运行两次该命令，第一次启动基础容器，第二次确保容器更新并正常运行。
```

### 2. 启动Faust流处理应用
在`kafka-main/code`目录下，运行以下命令以启动Faust流处理应用：
```sh
python faust_streams.py worker
# 该应用将监听Kafka中的天气数据，并进行异常处理和数据处理。
```

### 3. 启动Kafka生产者
进入`Kafka`生产者代码目录，并编译运行`WeatherKafkaProducer.kt`文件。具体操作可能因你的开发环境而异，例如使用`IDEA`或`Android Studio`进行编译和运行。
```sh
cd code/kafka/src/main/java/ru/spbu/apmath/pt
# 根据你的环境编译和运行WeatherKafkaProducer.kt
```

### 4. 启动Web应用
在`kafka-main/code`目录下，运行以下命令以启动基于`FastAPI`的Web应用：
```sh
uvicorn fastapi_dashboard:app --host 0.0.0.0 --port 8080 --reload
```
Web应用启动后，你可以在浏览器中访问 `http://localhost:8080/static/index.html` 来查看实时的天气数据仪表盘

## 技术栈
Kafka：用于数据流处理和消息传递。

Faust：基于Python的Kafka流处理库。

FastAPI：用于构建高性能的Web API。

Uvicorn：FastAPI的ASGI服务器。

Docker：容器化部署Kafka和其他依赖。

## 注意事项
确保Kafka和Zookeeper容器已经正确启动并运行。

检查`faust_streams.py`和`WeatherKafkaProducer.kt`中的配置，确保Kafka主题、API密钥等参数设置正确。

确保Web应用监听的端口（默认是`8080`）没有被其他应用占用。
