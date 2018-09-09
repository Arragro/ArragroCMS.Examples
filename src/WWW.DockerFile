# docker build -f .\CMS.DockerFile -t docker.arragro.com/cms.arragro.com:v0.0.{change this version}-alpha .
# docker push docker.arragro.com/cms.arragro.com:v0.0.{change this version}-alpha
FROM microsoft/dotnet:2.1-sdk-alpine AS build-env
WORKDIR /app

# copy csproj and restore as distinct layers
COPY ./www.arragro.com ./www.arragro.com
COPY ./arragro.com.ContentTypes ./arragro.com.ContentTypes

RUN dotnet restore www.arragro.com/*.csproj
RUN dotnet publish www.arragro.com/*.csproj -c Release -o out

# build runtime image
FROM microsoft/dotnet:2.1-aspnetcore-runtime-alpine
WORKDIR /app
COPY --from=build-env /app/www.arragro.com/out ./
EXPOSE 5001/tcp
ENV ASPNETCORE_URLS http://*:5001
ENTRYPOINT ["dotnet", "www.arragro.com.dll"]