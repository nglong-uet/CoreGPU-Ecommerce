# Stage 1: Build ứng dụng
FROM maven:3-openjdk-21 AS build
WORKDIR /app

# Copy toàn bộ source code vào container
COPY . .
RUN mvn clean package -DskipTests

# Stage 2: Runtime
FROM openjdk:21-jdk-slim
WORKDIR /app

# Copy file JAR từ stage build
COPY --from=build /app/target/backend-0.0.1-SNAPSHOT.war backend.war
EXPOSE 8080
# Chạy ứng dụng
ENTRYPOINT ["java", "-jar", "bakend.jar"]
