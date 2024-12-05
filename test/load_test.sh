#!/bin/bash

# URL вашего API
URL="http://localhost:3001/api/convert"
VIDEO_FILE="test.mp4"
TOTAL_REQUESTS=100
CONCURRENT_REQUESTS=100

# Функция для отправки запроса
send_request() {
    # Отправка POST-запроса с видеофайлом
    response=$(curl -s -o response.json -w "%{http_code}" -X POST "$URL" -F "video=@$VIDEO_FILE")

    # Считываем HTTP статус
    http_code=$(echo "$response" | tail -n1)
    echo "HTTP Code: $http_code"

    # Логирование ответа и status
    if [ "$http_code" -eq 202 ]; then
        # Если запрос успешен, извлекаем jobId
        job_id=$(jq -r '.jobId' response.json)
        echo "Задача отправлена успешно, jobId: $job_id"
        # Здесь можно добавить логику для ожидания завершения задачи
        check_conversion_status "$job_id"
    else
        echo "Ошибка при отправке запроса. HTTP код: $http_code"
    fi
}

# Функция для проверки статуса обработки задачи
check_conversion_status() {
    job_id=$1
    echo "Проверка статуса для jobId: $job_id"

    # Проверяем статус задачи (например, через GET запрос на /gif/:jobId)
    while true; do
        # Получаем статус конвертации
        status_response=$(curl -s -o /dev/null -w "%{http_code}" "$URL/gif/$job_id")

        if [ "$status_response" -eq 200 ]; then
            echo "GIF успешно получен для jobId: $job_id"
            break
        elif [ "$status_response" -eq 404 ]; then
            echo "GIF для jobId $job_id еще не готов. Попробуем еще раз через 5 секунд."
            sleep 5
        else
            echo "Ошибка при получении GIF для jobId $job_id. HTTP код: $status_response"
            break
        fi
    done
}

# Основной блок теста
start_time=$(date +%s)

# Отправка запросов с параллельным выполнением
for ((i=1; i<=TOTAL_REQUESTS; i++))
do
    echo "Отправка запроса $i..."
    send_request &

    if (( i % CONCURRENT_REQUESTS == 0 )); then
        wait
    fi
done

# Ожидание завершения всех фоновых процессов
wait

# Вычисление времени выполнения
end_time=$(date +%s)
duration=$(( end_time - start_time ))
minutes=$(( duration / 60 ))
seconds=$(( duration % 60 ))

echo "Тестирование завершено. Время выполнения: ${minutes} минут(ы) и ${seconds} секунд(ы)."
