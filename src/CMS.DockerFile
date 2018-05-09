# docker build -f .\CMS.DockerFile -t docker.arragro.com/cms.arragro.com:v0.0.{change this version}-alpha .
# docker push docker.arragro.com/cms.arragro.com:v0.0.{change this version}-alpha
FROM microsoft/dotnet:2.1.300-rc1-sdk AS build-env
WORKDIR /app

# copy csproj and restore as distinct layers
COPY . ./
RUN dotnet add cms.arragro.com/cms.arragro.com.csproj package Magick.NET-Q8-x64 -v 7.4.5
RUN dotnet restore cms.arragro.com/*.csproj
RUN dotnet publish cms.arragro.com/*.csproj -c Release -o out

# build runtime image
FROM microsoft/dotnet:2.1.0-rc1-runtime
WORKDIR /app
COPY --from=build-env /app/cms.arragro.com/out ./
EXPOSE 5000/tcp
ENV ASPNETCORE_URLS http://*:5000
ENTRYPOINT ["dotnet", "cms.arragro.com.dll"]