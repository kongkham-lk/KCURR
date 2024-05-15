# Get base SDK Image from Microsoft
FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 5268

# Copy the csproj and restore all of the nugets
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["backend/backend.csproj", "backend/"]
RUN dotnet restore "backend/backend.csproj"

# Copy the rest of the project files and build out release
COPY . ./
WORKDIR "/src/backend"
RUN dotnet build "backend.csproj" -c $BUILD_CONFIGURATION -o /app/build

# Generate runtime image
FROM build as publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "backend.csproj" -c $BUILD_CONFIGURATION -o /app/publish

# deploy container
FROM base AS final
WORKDIR "/app"
COPY --from=publish /app/publish .
ENTRYPOINT [ "dotnet", "backend.dll" ]

# # run nginx config to handle CORS policy blocking
# FROM nginx:alpine
# COPY ./backend/nginx.conf ./backend/conf.d/default.conf
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]

# FROM mcr.microsoft.com/dotnet/sdk:7.0

# COPY . /app
# WORKDIR /app

# # Install netstat
# RUN apt-get update \
#   && DEBIAN_FRONTEND=noninteractive apt-get install -y \
#     net-tools \
#   && apt-get clean \
#   && rm -rf /var/lib/apt/lists/*

# # Restore and Build.
# RUN ["dotnet", "restore"]
# RUN ["dotnet", "build"]

# # Container will open port 5000 allowing us to connect to it.
# EXPOSE 5268

# # Start the dotnet application on port 5000.
# CMD ["dotnet", "run", "--server.urls", "http://localhost:5268"]