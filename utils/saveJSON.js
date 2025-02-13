// utils/saveJSON.js

import fs from 'fs';
import path from 'path';

/**
 * 将传入的 JSON 数据保存为文件。
 * 文件将保存在项目根目录下的 "savedResponses" 文件夹中，
 * 文件名格式为 taResponse_<时间戳>.json
 */
export function saveJSONToFile(jsonData) {
  const dir = path.join(process.cwd(), 'savedResponses');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const fileName = `taResponse_${Date.now()}.json`;
  const filePath = path.join(dir, fileName);
  fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));
  console.log(`TA response saved to: ${filePath}`);
}
