# Stage 1: Build file JAR bang Maven
FROM maven:3.9-eclipse-temurin-17-alpine AS builder
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Runtime sieu nhe tiet kiem RAM tren Render
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar

# Gioi han JVM toi da 384MB de an toan trong goi Free 512MB cua Render
ENV JAVA_OPTS="-Xmx384m -Xms128m"
EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]