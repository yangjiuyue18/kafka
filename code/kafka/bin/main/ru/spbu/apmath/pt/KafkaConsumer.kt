package ru.spbu.apmath.pt

import org.apache.kafka.clients.consumer.KafkaConsumer
import org.apache.kafka.common.serialization.StringDeserializer
import org.apache.log4j.BasicConfigurator
import org.apache.log4j.Level
import org.apache.log4j.Logger
import java.time.Duration
import java.util.*
import kotlin.concurrent.thread


object KafkaWeatherConsumer {

    class WeatherConsumer(private val props: Properties, private val topics: List<String>) : Runnable {
        @Volatile
        private var isStopped = false

        override fun run() {
            val consumer = KafkaConsumer(
                props, StringDeserializer(), StringDeserializer()
            )
            consumer.subscribe(topics)

            while (!isStopped) {
                val records = consumer.poll(Duration.ofSeconds(1))
                for (record in records) {
                    println("Topic: ${record.topic()}, message: ${record.value()}")
                }
            }
        }
    }
}

fun main() {
    BasicConfigurator.configure()
    Logger.getRootLogger().level = Level.INFO

    val props = KafkaConfig.KafkaLocalConfig().consumerProps
    val topics = listOf(KafkaConfig.WEATHER_TOPIC)
    thread(start = true, block = KafkaWeatherConsumer.WeatherConsumer(props, topics)::run)
}