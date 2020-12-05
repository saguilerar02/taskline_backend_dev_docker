ARG VARIANT=12
FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:${VARIANT}

ARG MONGO_TOOLS_VERSION=4.2
RUN curl -sSL "https://www.mongodb.org/static/pgp/server-${MONGO_TOOLS_VERSION}.asc" | (OUT=$(apt-key add - 2>&1) || echo $OUT) \
    && echo "deb http://repo.mongodb.org/apt/debian $(lsb_release -cs)/mongodb-org/${MONGO_TOOLS_VERSION} main" | tee /etc/apt/sources.list.d/mongodb-org-${MONGO_TOOLS_VERSION}.list \
    && apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get install -y mongodb-org-tools mongodb-org-shell \
    && apt-get clean -y && rm -rf /var/lib/apt/lists/*


ARG USER_UID=1000
ARG USER_GID=$USER_UID
RUN if [ "$USER_GID" != "1000" ] || [ "$USER_UID" != "1000" ]; then \
        groupmod --gid $USER_GID node \
        && usermod --uid $USER_UID --gid $USER_GID node \
        && chmod -R $USER_UID:$USER_GID /home/node \
        && chmod -R $USER_UID:root /usr/local/share/nvm /usr/local/share/npm-global; \
    fi
RUN mkdir ssl_certificates uploads defaults \
    && openssl genrsa -out ssl_certificates/privateKey.pem 4096  \
    && openssl rsa -in ssl_certificates/privateKey.pem -pubout -out ssl_certificates/publicKey.pem \
    && openssl req -new -x509 -key /ssl_certificates/privateKey.pem -out ssl_certificates/cert.pem -days 360 --subj '/CN=Taskline\/emailAddress=taskline_dev@gmail.com/C=ES/ST=BADAJOZ/L=BADAJOZ/O=TASKLINE Inc'


WORKDIR /workspace

ENTRYPOINT npm install

