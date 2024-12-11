package ru.spbu.apmath.pt

import org.apache.log4j.BasicConfigurator
import org.apache.log4j.Level
import org.apache.log4j.Logger
import org.apache.spark.SparkConf
import org.apache.spark.streaming.Durations
import org.apache.spark.streaming.api.java.JavaStreamingContext
import org.apache.spark.streaming.kafka010.ConsumerStrategies
import org.apache.spark.streaming.kafka010.KafkaUtils
import org.apache.spark.streaming.kafka010.LocationStrategies
import org.json.JSONObject
import ru.spbu.apmath.pt.KafkaConfig.KafkaLocalConfig

fun main() {
    BasicConfigurator.configure()
    Logger.getRootLogger().level = Level.FATAL

    val conf = SparkConf().setAppName("Weather Data Analysis")
        .setMaster("local[*]")

    val ssc = JavaStreamingContext(conf, Durations.seconds(1))
    val props = KafkaConfig.KafkaLocalConfig().consumerProps
    val propsMap = props.mapKeys { kv -> kv.key.toString() }

    val topics = listOf(KafkaConfig.WEATHER_TOPIC)
    val stream = KafkaUtils.createDirectStream(
        ssc,
        LocationStrategies.PreferConsistent(),
        ConsumerStrategies.Subscribe<String, String>(topics, propsMap)
    )

    stream.map { record -> record.value() }
        .window(Durations.seconds(60), Durations.seconds(10))  // 窗口大小 60s，滑动间隔 10s
        .map { data ->
            val json = JSONObject(data)
            val city = json.getString("name")
            val temperature = json.getJSONObject("main").getDouble("temp") - 273.15  // 转换为摄氏温度
            val humidity = json.getJSONObject("main").getInt("humidity")
            "$city: Temperature = ${"%.2f".format(temperature)}°C, Humidity = $humidity%"
        }
        .foreachRDD { rdd ->
            println("Weather Data in the last window:")
            rdd.collect().forEach { println(it) }
        }
    ssc.start()
    ssc.awaitTermination()
}