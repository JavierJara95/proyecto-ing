#!/usr/bin/env bash
set -euo pipefail

: "${DB_HOST:=db}"
: "${DB_PORT:=3306}"
: "${BACKEND_PORT:=8080}"

export DB_HOST DB_PORT BACKEND_PORT

echo "Esperando base de datos en ${DB_HOST}:${DB_PORT}..."
for intento in $(seq 1 60); do
  if nc -z "${DB_HOST}" "${DB_PORT}"; then
    echo "Base de datos disponible."
    break
  fi

  if [ "${intento}" -eq 60 ]; then
    echo "No fue posible conectar con la base de datos despues de 60 intentos." >&2
    exit 1
  fi

  sleep 2
done

echo "Iniciando backend Spring Boot..."
java -jar /app/smaa-backend.jar &
JAVA_PID=$!

echo "Iniciando Nginx..."
nginx -g 'daemon off;' &
NGINX_PID=$!

shutdown() {
  echo "Deteniendo servicios..."
  kill "${JAVA_PID}" "${NGINX_PID}" 2>/dev/null || true
  wait "${JAVA_PID}" "${NGINX_PID}" 2>/dev/null || true
}
trap shutdown SIGTERM SIGINT

wait -n "${JAVA_PID}" "${NGINX_PID}"
EXIT_CODE=$?
shutdown
exit "${EXIT_CODE}"
