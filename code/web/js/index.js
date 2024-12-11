//柱状图
function createBarChart(containerId, xAxisData, seriesData) {
    var chart = echarts.init(document.getElementById(containerId));
    var option = {
        tooltip: {},
        grid: {
            left: '5px', // 设置左边距
            right: '5px', // 设置右边距
            bottom: '5px', // 设置下边距
            containLabel: true // 确保坐标轴标签在grid区域内
        },
        xAxis: {
            type: 'category',
            data: xAxisData,
            axisLabel: {
                show: true,
                textStyle: {
                    color: '#fff', // y轴标签字体颜色为白色
                    fontFamily: 'Times New Roman' // 设置备用字体
                },
                rotate: 45 // 旋转45度以避免标签重叠
            },
            axisLine: {
                lineStyle: { color: 'rgba(255,255,255,0.1)' } // x轴线颜色
            },
            boundaryGap: true // 确保第一个柱子不与y轴重合
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                show: true,
                textStyle: {
                    color: '#fff', // y轴标签字体颜色为白色
                    fontFamily: 'Times New Roman' // 设置备用字体
                },
            },
            axisLine: {
                lineStyle: { color: 'rgba(255,255,255,0.1)' } // y轴线颜色
            },
            splitLine: {
                lineStyle: { color: 'rgba(255,255,255,0.1)' } // 分割线颜色
            }
        },
        series: [{
            name: '数据',
            type: 'bar',
            data: seriesData,
            barWidth: '30%', // 控制柱子的宽度，根据需要调整百分比
            barGap: '10%', // 控制柱子之间的间距，负值表示柱子之间紧密排列
            itemStyle: {
                color: '#3498db' // 柱子颜色
            }
        }]
    };
    chart.setOption(option);
    // 确保图表尺寸适应容器大小
    window.addEventListener('resize', function() {
        chart.resize();
    });
}

// 曲线图
function createLineChart(containerId, xAxisData, seriesData) {
    var chart = echarts.init(document.getElementById(containerId));
    var option = {
        tooltip: {},
        grid: {
            left: '5px', // 设置左边距
            right: '5px', // 设置右边距
            bottom: '5px', // 设置下边距
            containLabel: true // 确保坐标轴标签在grid区域内
        },
        xAxis: {
            type: 'category',
            data: xAxisData,
            axisLabel: {
                show: true,
                textStyle: {
                    color: '#fff', // x轴标签字体颜色为白色
                    fontFamily: 'Times New Roman' // 设置备用字体
                },
                rotate: 45 // 旋转45度以避免标签重叠
            },
            axisLine: {
                lineStyle: { color: '#fff' } // x轴线颜色
            },
            boundaryGap: false // 对于曲线图，通常设置为false，使线条紧贴坐标轴边缘
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                show: true,
                textStyle: {
                    color: '#fff', // y轴标签字体颜色为白色
                    fontFamily: 'Times New Roman' // 设置备用字体
                },
            },
            axisLine: {
                lineStyle: { color: '#fff' } // y轴线颜色
            },
            splitLine: {
                lineStyle: { color: 'rgba(255,255,255,0.1)' } // 分割线颜色
            }
        },
        series: [{
            name: '数据',
            type: 'line', // 修改为曲线图类型
            data: seriesData,
            smooth: true, // 设置为true，使线条平滑
            areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgba(52, 152, 219, 1)' // 雨水蓝色，从透明到不透明
                }, {
                    offset: 1,
                    color: 'rgba(52, 152, 219, 0.5)' // 雨水蓝色，半透明
                }])
            },
            // 设置线条颜色为另一种颜色以区分填充区域
            lineStyle: {
                color: '#996633', // 这里设置为番茄红色，您可以根据需要更改
                width: 2 // 线条宽度
            },
        }]
    };
    chart.setOption(option);
    // 确保图表尺寸适应容器大小
    window.addEventListener('resize', function() {
        chart.resize();
    });
}

//气泡图
function createBubbleChart(containerId, xAxisData, seriesData) {
    var chart = echarts.init(document.getElementById(containerId));
    var option = {
        backgroundColor: new echarts.graphic.RadialGradient(0.3, 0.3, 0.8, [
            {
                offset: 0,
                color: '#f7f8fa'
            },
            {
                offset: 1,
                color: '#cdd0d5'
            }
        ]),
        grid: {
            top: '10%',
            bottom: '5%', // 设置下边距
          },
        tooltip: {},
        xAxis: {
            type: 'category',
            data: xAxisData,
            axisLabel: {
                rotate: 45, // 旋转标签以便于阅读
                show: true,
            },
            show: false // 关闭x轴的显示        
        },
        yAxis: {
            type: 'value',
            splitLine: {
                show: false
            }
        },
        series: [{
            name: 'Cloud',
            type: 'scatter', // 气泡图类型
            symbolSize: function (val) {
                var size = val; // 原始的气泡大小值
                var minSize = 10; // 设置最小气泡大小，避免气泡过小
                var maxSize = 90; // 设置最大气泡大小，避免气泡过大
                
                // 限制气泡大小在设定的最小值和最大值之间
                return Math.max(minSize, Math.min(maxSize, size));
            },
            data: seriesData,
            label: {
                formatter: '{b}',
                position: 'right',
                show: true // 根据需要显示或隐藏标签
            },
            itemStyle: {
                shadowBlur: 10,
                shadowColor: 'rgba(25, 100, 150, 0.5)',
                shadowOffsetY: 5,
                color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [
                  {
                    offset: 0,
                    color: 'rgb(129, 227, 238)'
                  },
                  {
                    offset: 1,
                    color: 'rgb(25, 183, 207)'
                  }
                ])
              }
        }]
    };
    chart.setOption(option);
    window.addEventListener('resize', function() {
        chart.resize();
    });
}

// 趋势图
function createTendencyChart(containerId, Data) {
    var mychart = echarts.init(document.getElementById(containerId));
    // 提取时间和体感温度数据
    var times = [];
    var feelTemperatures = {}; // 使用对象来按城市组织数据
    Data.forEach(function(item) {
        times.push(item.time.replace('T', ' ').substr(0, 19)); // 简化时间格式，去除毫秒和时区信息
        Object.keys(item.data).forEach(function(city) {
            if (!feelTemperatures[city]) {
                feelTemperatures[city] = []; // 初始化城市的体感温度数组
            }
            feelTemperatures[city].push(item.data[city].feel_temperature); // 提取并存储体感温度
        });
    });
    // 将数据转换为ECharts所需的系列格式
    var seriesData = Object.keys(feelTemperatures).map(function(city) {
        return {
            name: city,
            type: 'line', // 使用折线图展示趋势
            data: feelTemperatures[city].map(function(temp, index) {
                return [times[index], temp]; // 使用时间标签和体感温度作为数据点
            })
        };
    });
    var option = {
        tooltip: { trigger: 'axis' }, // 触发类型，默认数据触发，可选为：'item'、'axis'
        legend: {
            data: Object.keys(feelTemperatures), // 图例数据
            textStyle: { // 图例文字的样式
                color: '#fff' // 设置图例文字颜色为白色
            }
        },
        grid: {
            left: '5px', // 设置左边距
            right: '5px', // 设置右边距
            bottom: '5px', // 设置下边距
            containLabel: true // 确保坐标轴标签在grid区域内
        },
        xAxis: {
            type: 'category',
            data: times, // X轴为时间类别轴，使用简化后的时间格式
            axisLabel: {
                textStyle: {
                    color: '#fff', // x轴标签字体颜色为白色
                    fontFamily: 'Times New Roman' // 设置备用字体
                },
            },
            axisLine: {
                lineStyle: { color: 'rgba(255,255,255,0.1)' } // x轴线颜色
            },
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                textStyle: {
                    color: '#fff', // y轴标签字体颜色为白色
                    fontFamily: 'Times New Roman' // 设置备用字体
                },
            },
            axisLine: {
                lineStyle: { color: 'rgba(255,255,255,0.1)' } // y轴线颜色
            },
            splitLine: {
                lineStyle: { color: 'rgba(255,255,255,0.1)' } // 分割线颜色
            }
        },
        series: seriesData // 系列数据
    };
    mychart.setOption(option); // 设置图表选项并显示图表
}

$(document).ready(function() {
    function refreshData() {
    // 发送AJAX请求到后端API获取天气数据
        $.ajax({
            url: "http://localhost:8080/weather_data", // 后端API的URL
            type: "GET", // 请求类型，这里是GET请求
            dataType: "json", // 预期服务器返回的数据类型
            success: function(data) {
                // 成功获取数据后的回调函数
                // data参数包含服务器返回的数据
                        
                // 清空并填充天气状况列表
                var weatherList = $(".list1 .list");
                weatherList.empty();
                Object.keys(data).forEach(function(city) {
                    weatherList.append(`<li><span class="city">${city}</span> <span class="weather">${data[city].weather}</span></li>`);
                });
                        
                // 准备柱状图的数据
                var cities = Object.keys(data); // 获取所有城市名作为 x 轴数据
                var averagetemperatures = cities.map(function(city) {
                    return data[city].average_temperature; // 获取每个城市的温度作为 y 轴数据
                });
                // 调用 createBarChart 函数渲染柱状图
                createBarChart("averageTemperatureChart", cities, averagetemperatures);

                //云
                var cloud = cities.map(function(city) {
                    return data[city].cloud;
                });
                createBubbleChart("cloudBubbleChart", cities, cloud); // 调用函数渲染气泡图
                        
                // 湿度
                var humidity = cities.map(function(city) {
                    return data[city].humidity; // 获取每个城市的温度作为 y 轴数据
                });

                createLineChart("HumidityChart", cities, humidity);
                        
                // 清空并填充风速列表
                var windList = $(".list6 .list"); // 注意这里类名改为 list6
                windList.empty();
                var maxWind = Object.values(data).reduce(function(max, cityData) {
                    return Math.max(max, cityData.wind);
                }, 0); // 找到最大风速
                
                Object.keys(data).sort(function(a, b) {
                    return data[b].wind - data[a].wind; // 排序
                }).forEach(function(city) {
                    var windSpeed = data[city].wind;
                    var percentage = (windSpeed / maxWind); // 计算风速占比
                    var animationSpeed = 10 - (percentage * 4); // 根据占比计算动画速度，范围1-5s
                    animationSpeed = Math.max(2.5, animationSpeed); // 确保动画速度不会低于1s
                
                    var liElement = $(`<li class="list-item-animated" style="animation-duration: ${animationSpeed}s;"><span class="city" style="color: #FFFF00">${city}</span> 
                        <span class="weather" style="color: #FFFF00">${windSpeed.toFixed(2)} m/s</span></li>`);
                    
                    windList.append(liElement); // 将列表项添加到列表中
                }); 
            },
            error: function(jqXHR, textStatus, errorThrown) {
                // 请求失败时的回调函数
                console.error("AJAX请求失败:", textStatus, errorThrown);
            }
        });

            // 发送AJAX请求到后端API获取天气数据
        $.ajax({
            url: "http://localhost:8080/weather_history", // 后端API的URL
            type: "GET", // 请求类型，这里是GET请求
            dataType: "json", // 预期服务器返回的数据类型
            success: function(historyData) {
                createTendencyChart("feelTemperatureChart", historyData);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                // 请求失败时的回调函数
                console.error("AJAX请求失败:", textStatus, errorThrown);
            }
        });
    }
    // 首次加载时获取数据
    refreshData();
 
    // 设置定时器，每隔5分钟（300000毫秒）刷新一次数据
    setInterval(refreshData, 300000);
  });

