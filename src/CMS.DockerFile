# docker build -f .\CMS.DockerFile -t docker.arragro.com/cms.arragro.com:v0.0.{change this version}-alpha .
# docker push docker.arragro.com/cms.arragro.com:v0.0.{change this version}-alpha
FROM mcr.microsoft.com/dotnet/core/sdk:2.2 AS build-env
WORKDIR /app

# copy csproj and restore as distinct layers
COPY ./cms.arragro.com ./cms.arragro.com
COPY ./arragro.com.ContentTypes ./arragro.com.ContentTypes

RUN curl -sL https://deb.nodesource.com/setup_10.x | bash - && \
    apt-get install -y nodejs

WORKDIR /app/cms.arragro.com

RUN npm i npm@latest -g
RUN npm config set @arragro:registry https://registry.arragro.com/repository/npm-hosted/
RUN npm i
RUN npm run build-prod

WORKDIR /app

RUN dotnet restore cms.arragro.com/*.csproj -s https://registry.arragro.com/repository/nuget-hosted/ -s https://api.nuget.org/v3/index.json
RUN dotnet publish cms.arragro.com/*.csproj -c Release -o out

# build runtime image
FROM mcr.microsoft.com/dotnet/core/aspnet:2.2
WORKDIR /app
COPY --from=build-env /app/cms.arragro.com/out ./
COPY --from=build-env /app/cms.arragro.com/Resources/test-cert.pfx ./Resources/test-cert.pfx
EXPOSE 5000/tcp
ENV ASPNETCORE_URLS http://*:5000
ENTRYPOINT ["dotnet", "cms.arragro.com.dll"]