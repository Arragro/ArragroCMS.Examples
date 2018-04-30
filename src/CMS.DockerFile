# docker build -f .\CMS.DockerFile -t docker.arragro.com/cms.arragro.com:v0.0.{change this version}-alpha .
# docker push docker.arragro.com/cms.arragro.com:v0.0.{change this version}-alpha
FROM microsoft/dotnet:2.0-sdk AS build-env
WORKDIR /app

# copy csproj and restore as distinct layers
COPY . ./
RUN dotnet restore cms.arragro.com/*.csproj
RUN dotnet publish cms.arragro.com/*.csproj -c Release -o out

# build runtime image
FROM microsoft/dotnet:2.0-runtime 
WORKDIR /app
COPY --from=build-env /app/cms.arragro.com/out ./
EXPOSE 5000/tcp
ENV ASPNETCORE_URLS http://*:5000
ENTRYPOINT ["dotnet", "cms.arragro.com.dll"]