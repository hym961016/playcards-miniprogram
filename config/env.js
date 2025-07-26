// env.js
const envConfig = {
  development: {
    host: "192.168.3.37",
    port: "8080",
    apiBaseUrl: "http://192.168.3.37:8080/api",
    // 可以添加其他开发环境的配置
  },
  production: {
    apiBaseUrl: "https://prod-api.example.com",
    // 可以添加其他生产环境的配置
  },
  // 可以根据需要添加更多环境，如测试环境
  test: {
    host: "192.168.1.3",
    port: "8080",
    apiBaseUrl: "http://192.168.1.3:8080/api",
  },
};

// 手动指定当前环境，可根据实际情况修改
const currentEnv = "test";

export default envConfig[currentEnv];
