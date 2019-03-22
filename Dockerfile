FROM node:8.10 AS setup
# The alias setup is used in docker-compose.yml

LABEL AUTHOR="Rodrigo Melgar"
LABEL VERSION="0.0.2"

RUN npm i -g npm \
  && npm install -g serverless \
  && npm install -g typescript \
  && echo "Installation completed!"

ENTRYPOINT ["/bin/bash"]

FROM setup AS build
ENV WORKSPACE /opt/app
WORKDIR ${WORKSPACE}

COPY ./ .
RUN npm ci --verbose

FROM build AS deploy

ARG STAGE=dev
ARG FUNCTION

WORKDIR ${WORKSPACE}

COPY ./deployment-config/aws /root/.aws
RUN npm run build \
  && ./.ci/deploy.sh ${STAGE} ${FUNCTION}

# FROM deploy AS rollback
# WORKDIR ${WORKSPACE}/lib
# RUN AWS_PROFILE="${STAGE}" serverless remove --stage ${STAGE} --verbose
