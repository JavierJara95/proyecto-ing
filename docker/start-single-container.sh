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

echo "Esperando backend Spring Boot en 127.0.0.1:${BACKEND_PORT}..."
for intento in $(seq 1 90); do
  if ! kill -0 "${JAVA_PID}" 2>/dev/null; then
    echo "El backend se detuvo antes de quedar disponible." >&2
    wait "${JAVA_PID}" || true
    exit 1
  fi

  if nc -z 127.0.0.1 "${BACKEND_PORT}"; then
    echo "Backend disponible."
    break
  fi

  if [ "${intento}" -eq 90 ]; then
    echo "El backend no quedo disponible despues de 90 intentos." >&2
    kill "${JAVA_PID}" 2>/dev/null || true
    exit 1
  fi

  sleep 2
done

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
