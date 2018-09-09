# docker build -f .\CMS.DockerFile -t docker.arragro.com/cms.arragro.com:v0.0.{change this version}-alpha .
# docker push docker.arragro.com/cms.arragro.com:v0.0.{change this version}-alpha
FROM microsoft/dotnet:2.1-sdk-alpine AS build-env
WORKDIR /app

# copy csproj and restore as distinct layers
COPY ./cms.arragro.com ./cms.arragro.com
COPY ./arragro.com.ContentTypes ./arragro.com.ContentTypes

RUN apk add nodejs

WORKDIR /app/cms.arragro.com

RUN npm i
RUN npm run build-prod

WORKDIR /app

RUN dotnet restore cms.arragro.com/*.csproj
RUN dotnet publish cms.arragro.com/*.csproj -c Release -o out

# build runtime image
FROM microsoft/dotnet:2.1-aspnetcore-runtime-alpine
WORKDIR /app
COPY --from=build-env /app/cms.arragro.com/out ./
EXPOSE 5000/tcp
ENV ASPNETCORE_URLS http://*:5000
ENTRYPOINT ["dotnet", "cms.arragro.com.dll"]