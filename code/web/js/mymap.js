(function() {
    // 初始化变量
    var myChart = echarts.init(document.querySelector(".map .chart"));
  
    // 定义地图的配置选项
    var mapOption = {
        tooltip: { // 添加tooltip组件
            trigger: 'item', // 数据触发，可选为：'item'、'axis'
            formatter: function(params) {
                return 'current<br/>' + params.name + ':' + params.value + '℃';
            }
        },
        visualMap: {
            left: 'right',
            min: -20, // 假设温度范围是-20到40度，根据实际情况调整
            max: 40,
            inRange: {
                color: ['#0000ff', '#0080ff', '#ffff00', '#ffa500', '#ff4500', '#ff0000']
            },
            textStyle: {
                color: ["#2f89cf"],
            },
            text: ['High', 'Low'],
            calculable: true,
        },
        series: [
            {
                id: 'temperature',
                type: 'map',
                roam: true,
                zoom: 1.18,
                map: 'china',
                animationDurationUpdate: 1000,
                universalTransition: true,
                data: [], // 初始为空，将在AJAX请求后填充
                label: { // 添加标签配置
                    show: true, // 设置为true以显示标签
                    formatter: function(params) {
                        // 格式化标签内容，这里显示名称和温度值
                        // 假设 params.value[2] 是温度值，根据实际情况调整
                        return params.value;
                    },
                },
            }
        ]
    };

    function fetchCityTemperatures() {
        $.ajax({
            url: "http://localhost:8080/map_data", // 修改为新的数据源URL
            type: "get", // 假设是GET请求，根据后端实际情况调整
            dataType: "json", // 指定返回数据类型为JSON
            success: function(data) {
                var temperatureData = [];
                var cityNameMapping = { // 添加英文到中文名称的映射
                    "Beijing": "北京",
                    "Tianjin": "天津",
                    "Zhengzhou": "河南",
                    "Hubei": "湖北",
                    "Hunan": "湖南",
                    "Guangdong": "广东",
                    "Hebei": "河北",
                    "Shanghai": "上海",
                    "Chongqing": "重庆",
                    "Zhejiang": "浙江",
                    "Anhui": "安徽",
                    "Fujian": "福建",
                    "Gansu": "甘肃",
                    "Guangxi": "广西",
                    "Guizhou": "贵州",
                    "Hainan": "海南",
                    "Heilongjiang": "黑龙江",
                    "Jilin": "吉林",
                    "Jiangsu": "江苏",
                    "Jiangxi": "江西",
                    "Qinghai": "青海",
                    "Menggu": "内蒙古",
                    "Shenyang": "辽宁", 
                    "Yinchuan": "宁夏",
                    "Shandong": "山东",
                    "Shanxi": "山西",
                    "Shaanxi": "陕西",
                    "Sichuan": "四川",
                    "Xinjiang": "新疆",
                    "Kunming": "云南",
                    "Xizang": "西藏",
                    "Macao":"澳门",
                    "Xianggang":"香港",
                    "Taiwan":"台湾",
                    "Nanhai":"南海诸岛"
                };
                for (var city in data) {
                    if (data.hasOwnProperty(city)) {
                        var chineseCityName = cityNameMapping[city] || city; // 使用映射或保持原名
                        // 构建ECharts所需的数据格式 {name: '城市名', value: 温度值}
                        temperatureData.push({
                            name: chineseCityName,
                            value: data[city].temperature // 使用温度值作为value
                        });
                    }
                }
                // 更新地图数据并渲染图表
                mapOption.series[0].data = temperatureData;
                myChart.setOption(mapOption);

                                // 统计不同温度范围的城市数量
                                var lowTempCount = 0;
                                var moderateTempCount = 0;
                                var highTempCount = 0;
                                        
                                Object.keys(data).forEach(function(city) {
                                    var temperature = data[city].temperature;
                                    if (temperature <= 0) {
                                        lowTempCount++;
                                    } else if (temperature >= 15) {
                                        highTempCount++;
                                    } else {
                                        moderateTempCount++;
                                    }
                                });
                                        
                                // 更新页面上的城市计数
                                $(".low-temperature-cities .count").text(lowTempCount);
                                $(".moderate-cities .count").text(moderateTempCount);
                                $(".high-temperature-cities .count").text(highTempCount);
            },
            error: function() {
                console.error("Failed to fetch city temperatures.");
            }
        });
    }

    // 设置初始图表配置
    myChart.setOption(mapOption);

    // 在页面加载完成后获取城市温度数据
    setTimeout(fetchCityTemperatures, 500); // 延迟2秒执行，可根据需要调整

    // 设置定时器，每隔一定时间自动更新数据
    setInterval(fetchCityTemperatures, 60000); // 每隔60秒（1分钟）更新一次数据
    myChart.hideLoading(); // 隐藏加载动画
})();
  