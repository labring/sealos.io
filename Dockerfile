FROM node:20-bookworm-slim AS builder

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    git \
    python3 \
    make \
    g++ \
    libcairo2-dev \
    libjpeg62-turbo-dev \
    libpango1.0-dev \
    libgif-dev \
    librsvg2-dev \
    libfreetype6-dev \
    libharfbuzz-dev \
    libfribidi-dev \
    fontconfig \
    curl \
  && rm -rf /var/lib/apt/lists/*
WORKDIR /app

ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_OPEN_SOURCE_URL
ARG NEXT_PUBLIC_DEFAULT_LOCALE

ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_OPEN_SOURCE_URL=$NEXT_PUBLIC_OPEN_SOURCE_URL
ENV NEXT_PUBLIC_DEFAULT_LOCALE=$NEXT_PUBLIC_DEFAULT_LOCALE
ENV NEXT_TELEMETRY_DISABLED=1
ENV DOCKER_BUILD=true

COPY . .
# Replace relative image paths with CDN URLs
RUN chmod +x ./scripts/replace-image-paths.sh && ./scripts/replace-image-paths.sh
RUN npm ci && npm run build

FROM nginx:1.27-alpine AS runner

# Copy static export output to nginx web root
COPY --from=builder /app/out /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
