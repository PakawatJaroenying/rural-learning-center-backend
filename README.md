```bash
# Project Setup

## Initialize npm and Install Dependencies
```bash
npm init -y
npm install express
npm install --save-dev @types/express
npm install --save-dev typescript ts-node nodemon @types/node
npm install cors
npm install --save-dev @types/cors
npm install helmet
npm install compression
npm install --save-dev @types/compression
npm install morgan
npm install --save-dev @types/morgan
npm install multer
npm install express-validator
npm install dotenv
npm install jsonwebtoken
npm install --save-dev @types/jsonwebtoken
npm install typeorm reflect-metadata pg
npm install typeorm@latest reflect-metadata@latest
npm install bcrypt
npm install --save-dev @types/bcrypt
npm install typedi
npm install swagger-ui-express swagger-jsdoc
npm install --save-dev @types/swagger-jsdoc
npm install --save-dev @types/swagger-ui-express
npm install express-oas-generator
```

## TypeScript Configuration
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

## Nodemon Configuration
```json
// nodemon.json
{
  "watch": ["src"],
  "ext": "ts",
  "exec": "ts-node ./src/index.ts"
}
```

## Package Scripts
```json
// package.json
"scripts": {
  "start": "ts-node src/index.ts",
  "dev": "nodemon"
}
```

## CORS คืออะไร?
CORS เป็นกลไกที่ช่วยให้เว็บเบราว์เซอร์อนุญาตหรือปฏิเสธการร้องขอจากโดเมนอื่น (Cross-Origin Requests) โดยค่าเริ่มต้น เว็บเบราว์เซอร์จะบล็อกการร้องขอที่มาจากโดเมนต้นทางที่ต่างจากที่แอปกำลังโฮสต์อยู่ เช่น:
- แอป API ของคุณโฮสต์อยู่ที่ http://api.example.com
- แต่ frontend โฮสต์ที่ http://frontend.example.com
- หากไม่มี CORS การร้องขอจะถูกปฏิเสธ

### ทำไมต้องใช้?
ถ้าคุณมีแอป frontend และ backend แยกกัน (คนละโดเมน, คนละพอร์ต) เพื่ออนุญาตให้ frontend สามารถส่งคำขอ (เช่น GET, POST) ไปยัง backend

```javascript
app.use(express.urlencoded({ extended: true })); // แปลง URL-encoded Body ให้เป็น JavaScript Object
```

## Helmet
ช่วยเพิ่มความปลอดภัยให้กับ Express โดยการตั้งค่า HTTP Headers เพื่อป้องกันช่องโหว่ทั่วไป เช่น Cross-Site Scripting (XSS), Clickjacking

## Compression
ช่วยบีบอัด response เพื่อให้ส่งข้อมูลได้เร็วขึ้น ลดขนาดข้อมูลที่ส่งไปยัง client

## Morgan
```javascript
app.use(morgan('dev')); // Logger สำหรับ HTTP requests ที่ช่วยบันทึกคำขอ (request logs) ซึ่งมีประโยชน์สำหรับการดีบัก
```

## Multer
ใช้สำหรับอัปโหลดไฟล์ (เช่น รูปภาพ)

## TypeORM Migrations
```bash
npx ts-node ./node_modules/typeorm/cli.js migration:generate src/migrations/addeedMetaDataToCourseEntity --data-source src/data-source.ts
npx ts-node ./node_modules/typeorm/cli.js migration:run --data-source src/data-source.ts
```
### การย้อนกลับ (Revert Migration)
```bash
npx typeorm migration:revert
```
