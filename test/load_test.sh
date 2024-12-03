#!/bin/bash

URL="http://localhost:3001/api/convert"
VIDEO_FILE="test.mp4"
TOTAL_REQUESTS=100
CONCURRENT_REQUESTS=10


send_request() {
    response=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$URL" -F "video=@$VIDEO_FILE")
    echo "Ответ: $response"
}


start_time=$(date +%s)


for ((i=1; i<=TOTAL_REQUESTS; i++))
do
    echo "Отправка запроса $i..."
    send_request &


    if (( i % CONCURRENT_REQUESTS == 0 )); then
        wait
    fi
done

wait

end_time=$(date +%s)

duration=$(( end_time - start_time ))

minutes=$(( duration / 60 ))
seconds=$(( duration % 60 ))

echo "Тестирование завершено. Время выполнения: ${minutes} минут(ы) и ${seconds} секунд(ы)."
