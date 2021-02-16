# docker build -f .\CMS.DockerFile -t docker.arragro.com/cms.arragro.com:v0.0.{change this version}-alpha .
# docker push docker.arragro.com/cms.arragro.com:v0.0.{change this version}-alpha
FROM mcr.microsoft.com/dotnet/sdk:5.0.103-buster-slim AS build-env
WORKDIR /app

RUN wget -qO- https://raw.githubusercontent.com/Microsoft/artifacts-credprovider/master/helpers/installcredprovider.sh | bash

ENV VSS_NUGET_EXTERNAL_FEED_ENDPOINTS "{\"endpointCredentials\": [{\"endpoint\": \"https://arragro.pkgs.visualstudio.com/_packaging/arragro/nuget/v3/index.json\", \"password\": \"xoesikepw5qbnpypdrkujhe6vwl3rii57pqssyqdz7pai2zejsla\"}]}"
ENV NUGET_CREDENTIALPROVIDER_SESSIONTOKENCACHE_ENABLED true

# copy csproj and restore as distinct layers
COPY ./src/cms.arragro.com ./cms.arragro.com
COPY ./src/arragro.com.ContentTypes ./arragro.com.ContentTypes

RUN curl -sL https://deb.nodesource.com/setup_10.x | bash - && \
    apt-get install -y nodejs

WORKDIR /app/cms.arragro.com

RUN npm i npm@latest -g
RUN npm config set @arragro:registry https://registry.arragro.com/repository/npm-hosted/
RUN npm i
RUN npm run build-prod

WORKDIR /app

RUN dotnet restore cms.arragro.com/*.csproj -s https://registry.arragro.com/repository/nuget-hosted/ -s https://api.nuget.org/v3/index.json -s https://arragro.pkgs.visualstudio.com/_packaging/arragro/nuget/v3/index.json
RUN dotnet publish cms.arragro.com/*.csproj -c Release -o out

# build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:5.0.3-buster-slim
WORKDIR /app

COPY --from=build-env /app/out ./
RUN find ./runtimes -mindepth 1 ! -regex '^.\/runtimes\/\(linux-x64\|unix\)\(/.*\)?' -delete
COPY --from=build-env /app/cms.arragro.com/Resources/test-cert.pfx ./Resources/test-cert.pfx
EXPOSE 5000/tcp
ENV ASPNETCORE_URLS http://*:5000
ENTRYPOINT ["dotnet", "cms.arragro.com.dll"]
