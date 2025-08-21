# Stage 1: Build ứng dụng
FROM maven:3-eclipse-temurin-21 AS build
WORKDIR /app

# Copy toàn bộ source code vào container
COPY . .
RUN mvn clean package -DskipTests

# Stage 2: Runtime
FROM eclipse-temurin:21-jre AS runtime
WORKDIR /app

# Copy file JAR từ stage build
COPY --from=build /app/target/backend-0.0.1-SNAPSHOT.war backend.war
EXPOSE 8080
# Chạy ứng dụng
ENTRYPOINT ["java", "-jar", "backend.war"]
