# docker build -f .\CMS.DockerFile -t docker.arragro.com/cms.arragro.com:v0.0.{change this version}-alpha .
# docker push docker.arragro.com/cms.arragro.com:v0.0.{change this version}-alpha
FROM mcr.microsoft.com/dotnet/core/sdk:3.1.302-alpine3.12 AS build-env
WORKDIR /app

# copy csproj and restore as distinct layers
COPY ./www.arragro.com ./www.arragro.com
COPY ./arragro.com.ContentTypes ./arragro.com.ContentTypes

RUN apk add --update nodejs nodejs-npm

WORKDIR /app/www.arragro.com

RUN npm i npm@latest -g
RUN npm i
RUN npm run build-prod

WORKDIR /app

RUN dotnet restore www.arragro.com/*.csproj -s https://registry.arragro.com/repository/nuget-hosted/ -s https://api.nuget.org/v3/index.json
RUN dotnet publish www.arragro.com/*.csproj -c Release -o out

# build runtime image
FROM mcr.microsoft.com/dotnet/core/aspnet:3.1.6-alpine3.12
WORKDIR /app
COPY --from=build-env /app/out ./
EXPOSE 5001/tcp
ENV ASPNETCORE_URLS http://*:5001
ENTRYPOINT ["dotnet", "www.arragro.com.dll"]