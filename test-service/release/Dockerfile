#FROM java:8-jdk-alpine
FROM adoptopenjdk/openjdk8-openj9:alpine-slim

RUN mkdir -p /deployment/
RUN mkdir -p /app/
ADD ./service/target/*.jar /deployment/
RUN cd /deployment/ && mv ./*.jar /app/app.jar


EXPOSE 8080 80
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/app/app.jar","--spring.profiles.active=prod"]
