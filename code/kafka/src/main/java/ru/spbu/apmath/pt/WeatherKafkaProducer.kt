package ru.spbu.apmath.pt

import org.apache.kafka.clients.producer.KafkaProducer
import org.apache.kafka.clients.producer.ProducerRecord
import org.apache.log4j.BasicConfigurator
import org.apache.log4j.Level
import org.apache.log4j.Logger
import java.net.HttpURLConnection
import java.net.URL
import java.net.URLEncoder
import java.nio.charset.StandardCharsets
import java.util.*

object WeatherProducer {

    private const val CONFIG_FILE = "/weather.conf"

    // 加载配置文件
    private val weatherConfig: Properties by lazy {
        val props = Properties()
        WeatherProducer::class.java.getResourceAsStream(CONFIG_FILE)?.use {
            props.load(it)
        } ?: throw IllegalArgumentException("Configuration file not found: $CONFIG_FILE")
        props
    }

    // 获取 API Key
    private val apiKey: String by lazy {
        weatherConfig.getProperty("api_key") ?: throw IllegalArgumentException("API key not found in config")
    }

    // 获取城市列表（多个城市以逗号分隔）
    private val cities: List<String> by lazy {
        weatherConfig.getProperty("cities")?.split(",")?.map { it.trim() }
            ?: throw IllegalArgumentException("Cities not found in config")
    }

    // 获取天气数据
    private fun fetchWeatherData(city: String): String? {
        val encodedCity = URLEncoder.encode(city, StandardCharsets.UTF_8.toString())
        val url = "https://api.openweathermap.org/data/2.5/weather?q=$encodedCity&appid=$apiKey"
        println("Request URL: $url")

        return try {
            val connection = URL(url).openConnection() as HttpURLConnection
            connection.requestMethod = "GET"
            connection.connectTimeout = 10000
            connection.readTimeout = 10000

            if (connection.responseCode == 200) {
                connection.inputStream.bufferedReader().use { it.readText() }
            } else {
                println("Error fetching weather data for $city: ${connection.responseCode}")
                null
            }
        } catch (e: Exception) {
            println("Error fetching weather data for $city: ${e.message}")
            null
        }
    }

    // 生产天气数据到 Kafka
    fun produceWeatherData(props: Properties, topic: String) {
        val producer = KafkaProducer<String, String>(props)

        // 定期发送每个城市的天气数据
        Thread {
            while (true) {
                for (city in cities) {
                    val weatherData = fetchWeatherData(city)
                    if (weatherData != null) {
                        val record = ProducerRecord(topic, city, weatherData)
                        producer.send(record)
                        println("Sent weather data to Kafka for $city: $weatherData")
                    } else {
                        println("Failed to fetch weather data for $city")
                    }
                }
                Thread.sleep(60000)  // 每分钟发送一次
            }
        }.start()
    }
}

fun main() {
    BasicConfigurator.configure()
    Logger.getRootLogger().level = Level.INFO

    val props = KafkaConfig.KafkaLocalConfig().consumerProps
    WeatherProducer.produceWeatherData(props, KafkaConfig.WEATHER_TOPIC)
}
