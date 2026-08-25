const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
const { Client } = require('pg');

const imgDir = 'D:\\Project\\Personal\\img-cinema-web-app';
const cloudName = 'ou9km1tu';
const uploadPreset = 'v0x2gloe';

const pgClient = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres',
  port: 5433,
});

async function uploadToCloudinary(filePath) {
  const form = new FormData();
  form.append('file', fs.createReadStream(filePath));
  form.append('upload_preset', uploadPreset);

  const res = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, form, {
    headers: form.getHeaders()
  });
  
  return res.data.secure_url;
}

function generateMovieData(filename) {
  const title = path.parse(filename).name.replace(/[-_]/g, ' ').replace(/\d+/g, '').replace(/poster/i, '').trim().toUpperCase();
  const directors = ['Trấn Thành', 'Victor Vũ', 'Charlie Nguyễn', 'Ngô Thanh Vân', 'Lý Hải'];
  const ageLimits = ['P', 'K', 'T13', 'T16', 'T18'];
  
  return {
    title: title || 'Siêu Phẩm Điện Ảnh',
    description: `Một tác phẩm điện ảnh bom tấn không thể bỏ lỡ. Bộ phim hứa hẹn mang đến những trải nghiệm tuyệt vời nhất với hình ảnh mãn nhãn và âm thanh sống động.`,
    duration: Math.floor(Math.random() * 40) + 90, // 90 - 130 mins
    release_date: new Date().toISOString(),
    trailer_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    director: directors[Math.floor(Math.random() * directors.length)],
    movie_cast: 'Diễn viên bí ẩn',
    age_limit: ageLimits[Math.floor(Math.random() * ageLimits.length)],
    is_active: true
  };
}

async function run() {
  try {
    await pgClient.connect();
    console.log('Connected to PostgreSQL');

    const files = fs.readdirSync(imgDir).filter(f => f.match(/\.(jpg|jpeg|png)$/i));
    console.log(`Found ${files.length} images to process.`);

    for (const file of files) {
      console.log(`\nProcessing ${file}...`);
      const filePath = path.join(imgDir, file);
      
      try {
        console.log(`  Uploading to Cloudinary...`);
        const posterUrl = await uploadToCloudinary(filePath);
        console.log(`  Upload success: ${posterUrl}`);

        const m = generateMovieData(file);
        
        console.log(`  Inserting into DB...`);
        const query = `
          INSERT INTO movies 
          (title, description, duration, release_date, poster_url, trailer_url, director, movie_cast, age_limit, is_active)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          RETURNING id;
        `;
        const values = [
          m.title, m.description, m.duration, m.release_date, posterUrl, m.trailer_url, m.director, m.movie_cast, m.age_limit, m.is_active
        ];
        
        const res = await pgClient.query(query, values);
        console.log(`  Inserted movie ID: ${res.rows[0].id}`);
      } catch (err) {
        console.error(`  Failed processing ${file}:`, err?.response?.data || err.message);
      }
    }
  } finally {
    await pgClient.end();
    console.log('\nFinished all tasks.');
  }
}

run();
