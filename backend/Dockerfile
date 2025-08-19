# Stage 1: Build ứng dụng
FROM eclipse-temurin:21-jdk AS builder

WORKDIR /workspace/app

# Copy toàn bộ source code vào container
COPY . .

# Gán quyền thực thi cho mvnw (fix lỗi Permission denied)
RUN chmod +x mvnw

# Build ứng dụng (bỏ qua test cho nhanh)
RUN ./mvnw clean package -DskipTests

# Stage 2: Runtime
FROM eclipse-temurin:21-jre

WORKDIR /app

# Copy file JAR từ stage build
COPY --from=builder /workspace/app/target/*.jar app.jar

# Chạy ứng dụng
ENTRYPOINT ["java", "-jar", "app.jar"]
