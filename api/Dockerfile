# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Dockerfile                                         :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: atrouill <atrouill@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2022/06/14 15:35:26 by atrouill          #+#    #+#              #
#    Updated: 2022/06/16 13:45:56 by atrouill         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

#
# Dev image
#
FROM	node:16.15-alpine3.15

WORKDIR /cache/
COPY	package*.json /cache/

RUN		apk update && apk add tar && npm install && npm audit fix && \
		tar -cf node_modules.tar node_modules/

WORKDIR	/api/
COPY	./entrypoint.sh ./entrypoint.sh

CMD ["ash", "/api/entrypoint.sh"]
