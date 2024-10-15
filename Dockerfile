# 使用 Ubuntu 22.04 作为基础镜像
FROM ubuntu:20.04

# 设置非交互模式，避免一些软件包安装时出现交互提示
ENV DEBIAN_FRONTEND=noninteractive

# 替换apt-get镜像源
# COPY ./sources.list /etc/apt/

RUN apt-get update -y

RUN apt-get install curl -y

# RUN apt-get remove -y nodejs

RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash -

# 添加 Node.js 20.x 的官方仓库并安装 Node.js 20 和 npm
RUN apt-get install -y nodejs 
# RUN apt-get install -y npm
    
# 设置工作目录为 /app
WORKDIR /app

# 复制 package.json 和 package-lock.json 到工作目录
COPY package*.json ./

# 安装依赖
RUN npm config set registry https://registry.npmmirror.com/ \
    && npm install --production

# 复制 src 文件夹到容器的 /app 目录中
COPY ./src ./src

# 设置环境变量（可根据需要调整）
ENV NODE_ENV=production

# 启动 Node.js 服务
CMD ["node", "src/index.mjs"]
