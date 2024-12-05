const videoQueue = require('../queue/queue');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // Генерация уникальных ID для задач

// Контроллер для обработки видео
const convertVideo = async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const uploadedFilePath = req.file.path;
  const jobId = uuidv4();
  console.log(`Received file for conversion: ${uploadedFilePath}`);

  try {
    // Проверка, существует ли файл
    if (!fs.existsSync(uploadedFilePath)) {
      return res.status(400).send('Uploaded file does not exist.');
    }

    // Добавляем задачу в очередь для обработки видео
    const job = await videoQueue.add({
      filePath: uploadedFilePath,
      jobId: jobId, // Добавляем ID задачи для отслеживания
    });

    console.log(`Job added to the queue with ID: ${job.id}`);
    return res.status(202).send({ message: 'Video conversion in progress...', jobId }); // Возвращаем ID задачи клиенту
  } catch (error) {
    console.error('Error adding job to queue:', error.message);
    return res.status(500).send('Error adding job to queue.');
  }
};

// Контроллер для получения GIF после завершения конвертации
const getConvertedGif = async (req, res) => {
  const { jobId } = req.params; // Получаем ID задачи из параметра запроса
  const filePath = path.join(__dirname, '../../output', `${jobId}.gif`); // Путь к файлу с GIF

  try {
    // Проверяем, существует ли файл
    if (fs.existsSync(filePath)) {
      return res.sendFile(filePath); // Отправляем файл пользователю
    } else {
      return res.status(404).send('Converted GIF not found.'); // Если файл не найден
    }
  } catch (err) {
    console.error(`Error retrieving GIF: ${err.message}`);
    return res.status(500).send('Error retrieving GIF.');
  }
};

module.exports = { convertVideo, getConvertedGif };
