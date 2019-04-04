FROM microsoft/dotnet:2.1-sdk AS installer-env

COPY ./functions/arragro.com.functions /src/dotnet-function-app
COPY ./arragro.com.ContentTypes /src/arragro.com.ContentTypes

RUN cd /src/dotnet-function-app && \
    mkdir -p /home/site/wwwroot && \
    dotnet restore -s https://registry.arragro.com/repository/nuget-hosted/ -s https://api.nuget.org/v3/index.json && \
    dotnet publish *.csproj --output /home/site/wwwroot

FROM mcr.microsoft.com/azure-functions/dotnet:2.0
ENV AzureWebJobsScriptRoot=/home/site/wwwroot

COPY --from=installer-env ["/home/site/wwwroot", "/home/site/wwwroot"]