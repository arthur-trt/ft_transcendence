# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Dockerfile                                         :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: ccommiss <ccommiss@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2022/06/14 15:35:26 by atrouill          #+#    #+#              #
#    Updated: 2022/06/30 14:47:38 by ccommiss         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

#
# Dev image
#
FROM	node:16.15-alpine3.15

#WORKDIR /api/
#COPY	package*.json /cache/

#RUN		npm install && npm audit fix
# && tar -cf node_modules.tar node_modules/ apk update && apk add tar

WORKDIR	/api/
COPY	./entrypoint.sh ./entrypoint.sh

CMD ["ash", "/api/entrypoint.sh"]
