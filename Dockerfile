FROM oven/bun:alpine

WORKDIR /app

RUN apk update
RUN apk upgrade
RUN apk add ffmpeg

COPY *.json ./
COPY bun.lockb .
COPY *.config.* ./
RUN bun install

COPY static static
COPY database database
COPY kafka kafka
COPY src src

EXPOSE 5173

CMD bun --bun run dev