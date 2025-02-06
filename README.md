# 企业员工管理系统

这是一个基于 React 和 Ant Design 的企业员工管理系统，提供完整的部门管理、员工管理、考勤管理等功能。

## 技术栈

- React 18
- React Router v6
- Redux Toolkit
- Ant Design 5.x
- Axios
- ECharts
- i18next (国际化)
- Mock.js (数据模拟)
- ESLint + Prettier (代码规范)

## 功能特性

- 🔐 用户认证

  - 登录/登出
  - 个人信息管理
  - 密码修改

- 👥 部门管理

  - 部门的增删改查
  - 部门状态管理
  - 部门人数统计

- 👨‍💼 员工管理

  - 员工信息的增删改查
  - 员工状态管理
  - 部门关联

- ⏰ 考勤管理

  - 考勤记录
  - 加班申请
  - 请假申请
  - 调休申请
  - 考勤统计

- 📊 数据可视化

  - 部门人数分布
  - 考勤状况统计
  - 数据趋势分析

- 🌐 国际化
  - 中英文切换
  - 自动语言检测

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm start
```

### 构建生产版本

```bash
npm run build
```

### 代码检查

```bash
npm run lint
```

### 代码格式化

```bash
npm run format
```

## 项目结构

```
src/
├── api/                # API 接口
│   ├── axios.js       # axios 配置
│   ├── index.js       # API 接口定义
│   ├── mock.js        # Mock 数据配置
│   └── mockServeData/ # Mock 数据
├── assets/            # 静态资源
├── components/        # 公共组件
│   ├── commonAside/   # 侧边栏组件
│   ├── commonHeader/  # 头部组件
│   ├── commonTag/     # 标签组件
│   ├── Echarts/      # 图表组件
│   └── LanguageSwitch/# 语言切换组件
├── config/           # 配置文件
├── i18n/             # 国际化配置
│   ├── config.js     # i18n 配置
│   └── locales/      # 语言包
├── pages/            # 页面组件
│   ├── home/         # 首页
│   ├── login/        # 登录页
│   ├── DepartmentManagement/  # 部门管理
│   ├── EmployeeManagement/    # 员工管理
│   ├── AttendanceManagement/  # 考勤管理
│   └── ...
├── router/           # 路由配置
└── store/            # Redux 状态管理
    ├── index.js      # store 配置
    └── reducers/     # reducer 定义
```

## 开发规范

- 使用 ESLint 进行代码检查
- 使用 Prettier 进行代码格式化
- 遵循组件化开发原则
- 统一使用函数组件和 Hooks

## 默认账号

- 用户名：admin
- 密码：123456

## 主要功能说明

### 1. 用户认证

- 支持用户登录/登出
- 记住登录状态
- 修改个人信息
- 修改密码

### 2. 部门管理

- 部门列表展示
- 新增/编辑/删除部门
- 部门状态管理
- 部门人数统计

### 3. 员工管理

- 员工信息列表
- 新增/编辑/删除员工
- 员工状态变更
- 部门调动

### 4. 考勤管理

- 考勤记录管理
- 加班申请处理
- 请假申请处理
- 调休申请处理
- 考勤数据统计

### 5. 数据可视化

- ECharts 图表展示
- 部门分布统计
- 考勤数据分析
- 趋势图表展示

## 浏览器支持

- Chrome (推荐)
- Firefox
- Safari
- Edge

## 注意事项

1. 开发环境

   - Node.js >= 16
   - npm >= 8

2. 数据存储

   - 使用 localStorage 存储用户信息
   - Mock.js 模拟后端接口

3. 开发建议
   - 遵循 ESLint 规范
   - 保持代码整洁
   - 编写必要的注释
   - 及时处理控制台警告

## 联系方式

- 作者：Charles
- 邮箱：cwcharles0323@163.com
