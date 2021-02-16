FROM mcr.microsoft.com/dotnet/sdk:5.0.103-buster-slim AS build-env

RUN wget -qO- https://raw.githubusercontent.com/Microsoft/artifacts-credprovider/master/helpers/installcredprovider.sh | bash

ENV VSS_NUGET_EXTERNAL_FEED_ENDPOINTS "{\"endpointCredentials\": [{\"endpoint\": \"https://arragro.pkgs.visualstudio.com/_packaging/arragro/nuget/v3/index.json\", \"password\": \"xoesikepw5qbnpypdrkujhe6vwl3rii57pqssyqdz7pai2zejsla\"}]}"
ENV NUGET_CREDENTIALPROVIDER_SESSIONTOKENCACHE_ENABLED true

COPY ./jobs/arragro_com_hostedservices ./code
WORKDIR /code
RUN dotnet restore "arragro_com_hostedservices.csproj" -s https://registry.arragro.com/repository/nuget-hosted/ -s https://api.nuget.org/v3/index.json -s https://arragro.pkgs.visualstudio.com/_packaging/arragro/nuget/v3/index.json && \
    dotnet publish *.csproj -c Release --output /out

# To enable ssh & remote debugging on app service change the base image to the one below
# FROM mcr.microsoft.com/azure-functions/dotnet:2.0-appservice 
FROM mcr.microsoft.com/dotnet/aspnet:5.0.3-alpine3.13

ENV DOTNET_USE_POLLING_FILE_WATCHER true

WORKDIR /app

COPY --from=build-env /out ./
EXPOSE 5000/tcp
ENV ASPNETCORE_URLS http://*:5000
ENTRYPOINT ["dotnet", "arragro_com_hostedservices.dll"]