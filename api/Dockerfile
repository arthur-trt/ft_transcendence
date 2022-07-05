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
FROM	node:alpine

WORKDIR	/api/
COPY	./entrypoint.sh ./entrypoint.sh

CMD ["ash", "/api/entrypoint.sh"]
