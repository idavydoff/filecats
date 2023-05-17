FROM rust:1.65.0 as build
ENV PKG_CONFIG_ALLOW_CROSS=1

WORKDIR /usr/src/filecats-backend
COPY . .

RUN cargo install --path .

FROM gcr.io/distroless/cc-debian10

COPY --from=build /usr/local/cargo/bin/filecats-backend /usr/local/bin/filecats-backend

CMD ["filecats-backend"]