// services/videoService.js
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');


// Функция для добавления задания в очередь
const addVideoToQueue = async (filePath, videoQueue) => {
    try {
        const job = await videoQueue.add({ filePath });
        console.log(`Job added to the queue with ID: ${job.id}`);
        return job.id;
    } catch (error) {
        console.error('Error adding job to queue:', error.message);
        throw new Error('Error adding job to queue');
    }
};

const convertVideoToGif = (inputFile) => {
    return new Promise((resolve, reject) => {
        // Проверка существования файла
        if (!fs.existsSync(inputFile)) {
            return reject(new Error(`Input file does not exist: ${inputFile}`));
        }

        const outputDir = path.join(__dirname, '../../output'); // Папка для хранения GIF
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const outputFile = path.join(outputDir, `${Date.now()}.gif`); // Путь к результату

        // Настройка и запуск FFmpeg для конвертации
        ffmpeg(inputFile)
            .outputOptions([
                '-pix_fmt rgb24',
                '-vf fps=5,scale=-1:400',
                '-t 10',
                '-f gif',
            ])
            .on('start', (command) => {
                console.log(`Spawned FFmpeg with command: ${command}`);
            })
            .on('progress', (progress) => {
                console.log(`Processing: ${progress.percent}% done`);
            })
            .on('end', () => {
                console.log(`Conversion completed: ${outputFile}`);
                resolve(outputFile); // Возвращаем путь к готовому GIF
            })
            .on('stderr', (stderr) => {
                console.log(`FFmpeg STDERR: ${stderr}`);
            })
            .on('error', (err) => {
                console.error(`Error during conversion: ${err.message}`);
                reject(err); // В случае ошибки возвращаем её
            })
            .save(outputFile);
    });
};
// Функция для конвертации видео в GIF
const convertVideoFile = async (filePath) => {
    try {
        const outputFile = await convertVideoToGif(filePath);  // Конвертируем видео
        console.log(`Video converted successfully, output file: ${outputFile}`);
        return outputFile;
    } catch (error) {
        console.error(`Error converting video: ${error.message}`);
        throw new Error('Failed to convert video');
    }
};

// Функция для отправки файла пользователю
const sendGifFile = async (outputFile, res) => {
    try {
        // Установите правильный тип контента
        res.type('gif');
        res.setHeader('Content-Disposition', 'attachment; filename=' + path.basename(outputFile));

        // Отправляем файл пользователю
        return res.sendFile(outputFile, async (err) => {
            if (err) {
                console.error(`Error downloading the file: ${err.message}`);
                return res.status(500).send('Error downloading the file.');
            }

            // Удаляем временный файл после отправки
            try {
                await fsPromises.unlink(outputFile);
                console.log(`Output file deleted: ${outputFile}`);
            } catch (unlinkErr) {
                console.error('Error deleting output file:', unlinkErr);
            }
        });
    } catch (downloadErr) {
        console.error('Error processing file download:', downloadErr);
        return res.status(500).send('Error processing file.');
    }
};


module.exports = {
    addVideoToQueue,
    convertVideoFile,
    sendGifFile,
    convertVideoToGif
};
