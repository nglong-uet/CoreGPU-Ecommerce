# Build stage
FROM eclipse-temurin:21-jdk AS builder
WORKDIR /workspace/app

# Copy chỉ các file cần thiết để tối ưu cache layer
COPY mvnw .
COPY .mvn/ .mvn
COPY pom.xml .
COPY src src

# Build ứng dụng (sử dụng cache Maven)
RUN ./mvnw clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:21-jre
WORKDIR /app

# Copy file JAR từ stage builder
COPY --from=builder /workspace/app/target/*.jar app.jar

# Cấu hình thời gian (đặt lại thành Asia/Ho_Chi_Minh)
ENV TZ=Asia/Ho_Chi_Minh
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Port và entrypoint
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]